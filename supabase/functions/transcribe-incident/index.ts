import { createClient } from "npm:@supabase/supabase-js@2";

const FIREWORKS_URL = "https://audio-turbo.api.fireworks.ai/v1/audio/transcriptions";
const FIREWORKS_PROMPT =
  "ЧПОК, самокат, курьер, каршеринг, Whoosh, Urent, Яндекс, Самокат, Делимобиль, номер самоката, номер машины, доставка";
const REPORT_MEDIA_BUCKET = "report-media";

type RequestBody = {
  reportId?: string | null;
  storagePath?: string;
};

type TranscriptPayload = {
  transcriptRaw: string | null;
  transcriptClean: string | null;
  transcriptStatus: "transcribing" | "done" | "error";
  transcriptLanguage: string | null;
  transcriptProvider: "fireworks";
  transcriptError: string | null;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function cleanTranscript(text: string | null) {
  return text ? text.replace(/\s+/g, " ").trim() || null : null;
}

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildOwnedVoicePathPrefix(userId: string, reportId?: string | null) {
  const safeUserId = sanitizePathSegment(userId);
  const safeReportId = reportId ? sanitizePathSegment(reportId) : null;

  if (!safeUserId) {
    throw new Error("Invalid user id");
  }

  if (reportId && !safeReportId) {
    throw new Error("Invalid report id");
  }

  return safeReportId
    ? `voice-notes/${safeUserId}/${safeReportId}/`
    : `voice-notes/${safeUserId}/`;
}

function pathBelongsToUser(storagePath: string, userId: string, reportId?: string | null) {
  return storagePath.startsWith(buildOwnedVoicePathPrefix(userId, reportId));
}

function fileNameFromPath(path: string) {
  const segment = path.split("/").pop()?.trim();
  return segment || "voice-note.m4a";
}

function contentTypeFromPath(path: string) {
  const normalized = path.toLowerCase();
  if (normalized.endsWith(".webm")) return "audio/webm";
  if (normalized.endsWith(".wav")) return "audio/wav";
  if (normalized.endsWith(".mp3")) return "audio/mpeg";
  if (normalized.endsWith(".ogg")) return "audio/ogg";
  if (normalized.endsWith(".m4a") || normalized.endsWith(".mp4")) return "audio/mp4";
  return "application/octet-stream";
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

async function updateReport(
  supabaseAdmin: ReturnType<typeof createClient>,
  reportId: string,
  patch: Partial<{
    voice_note_path: string | null;
    transcript_raw: string | null;
    transcript_clean: string | null;
    transcript_status: string;
    transcript_language: string | null;
    transcript_provider: string | null;
    transcript_error: string | null;
  }>,
) {
  const { error } = await supabaseAdmin.from("reports").update(patch).eq("id", reportId);
  if (error) {
    throw new Error(error.message || "Failed to update report");
  }
}

async function transcribeWithFireworks(storagePath: string, audio: Blob) {
  const apiKey = getRequiredEnv("FIREWORKS_API_KEY");
  const formData = new FormData();
  formData.append(
    "file",
    new File([audio], fileNameFromPath(storagePath), { type: audio.type || contentTypeFromPath(storagePath) }),
  );
  formData.append("model", "whisper-v3-turbo");
  formData.append("language", "ru");
  formData.append("response_format", "json");
  formData.append("prompt", FIREWORKS_PROMPT);

  const response = await fetch(FIREWORKS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const rawText = await response.text();
  const parsed = rawText ? JSON.parse(rawText) : {};

  if (!response.ok) {
    const message =
      typeof parsed?.error === "string"
        ? parsed.error
        : typeof parsed?.message === "string"
          ? parsed.message
          : rawText || `Fireworks returned ${response.status}`;
    throw new Error(message);
  }

  const transcriptRaw = typeof parsed?.text === "string" ? parsed.text.trim() : null;
  const transcriptLanguage = typeof parsed?.language === "string" ? parsed.language : "ru";

  return {
    transcriptRaw,
    transcriptClean: cleanTranscript(transcriptRaw),
    transcriptStatus: "done" as const,
    transcriptLanguage,
    transcriptProvider: "fireworks" as const,
    transcriptError: null,
  };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const storagePath = body.storagePath?.trim();
  const reportId = body.reportId?.trim() || null;

  if (!storagePath) {
    return json({ error: "storagePath is required" }, 400);
  }

  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const supabaseAnonKey = getRequiredEnv("SUPABASE_ANON_KEY");
  const supabaseServiceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = request.headers.get("Authorization");

  const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
    global: authHeader ? { headers: { Authorization: authHeader } } : undefined,
  });
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

  try {
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return json({ error: "Unauthorized" }, 401);
    }

    if (reportId) {
      const { data: report, error: reportError } = await supabaseAdmin
        .from("reports")
        .select("id,user_id")
        .eq("id", reportId)
        .maybeSingle();

      if (reportError) {
        throw new Error(reportError.message || "Failed to load report");
      }

      if (!report) {
        return json({ error: "Report not found" }, 404);
      }

      if (report.user_id !== user.id) {
        return json({ error: "Forbidden" }, 403);
      }

      if (!pathBelongsToUser(storagePath, user.id, reportId)) {
        return json({ error: "Forbidden" }, 403);
      }

      await updateReport(supabaseAdmin, reportId, {
        voice_note_path: storagePath,
        transcript_status: "transcribing",
        transcript_provider: "fireworks",
        transcript_error: null,
      });
    } else {
      if (!pathBelongsToUser(storagePath, user.id)) {
        return json({ error: "Forbidden" }, 403);
      }
    }

    const { data: audioFile, error: downloadError } = await supabaseAdmin.storage
      .from(REPORT_MEDIA_BUCKET)
      .download(storagePath);

    if (downloadError || !audioFile) {
      const message = downloadError?.message || "Voice note file not found";
      if (reportId) {
        await updateReport(supabaseAdmin, reportId, {
          voice_note_path: storagePath,
          transcript_status: "error",
          transcript_provider: "fireworks",
          transcript_error: message,
        });
      }
      return json({ error: message }, 404);
    }

    const transcript = await transcribeWithFireworks(storagePath, audioFile);

    if (reportId) {
      await updateReport(supabaseAdmin, reportId, {
        voice_note_path: storagePath,
        transcript_raw: transcript.transcriptRaw,
        transcript_clean: transcript.transcriptClean,
        transcript_status: transcript.transcriptStatus,
        transcript_language: transcript.transcriptLanguage,
        transcript_provider: transcript.transcriptProvider,
        transcript_error: null,
      });
    }

    const responsePayload: TranscriptPayload & { storagePath: string; reportId: string | null } = {
      storagePath,
      reportId,
      ...transcript,
    };

    return json(responsePayload, 200);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected transcription failure";

    if (reportId) {
      try {
        await updateReport(supabaseAdmin, reportId, {
          voice_note_path: storagePath,
          transcript_status: "error",
          transcript_provider: "fireworks",
          transcript_error: message,
        });
      } catch {
        // Keep the original transcription error as the primary failure.
      }
    }

    return json(
      {
        error: "Transcription failed",
        message,
        storagePath,
        reportId,
      },
      502,
    );
  }
});
