import { REPORT_MEDIA_BUCKET, getSupabaseClient } from "@/lib/supabase";

export type VoiceNoteAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  file?: File | null;
};

export type VoiceTranscriptResult = {
  storagePath: string;
  transcriptRaw: string | null;
  transcriptClean: string | null;
  transcriptStatus: string;
  transcriptLanguage: string | null;
  transcriptProvider: string | null;
  transcriptError: string | null;
};

function sanitizePathSegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferAudioMimeType(uri: string, fallback?: string | null) {
  if (fallback?.trim()) {
    return fallback;
  }

  const normalized = uri.toLowerCase();
  if (normalized.endsWith(".webm")) return "audio/webm";
  if (normalized.endsWith(".wav")) return "audio/wav";
  if (normalized.endsWith(".mp3")) return "audio/mpeg";
  if (normalized.endsWith(".ogg")) return "audio/ogg";
  if (normalized.endsWith(".m4a") || normalized.endsWith(".mp4")) return "audio/mp4";
  return "audio/mp4";
}

function inferFileName(uri: string, fallback: string) {
  const segment = uri.split("/").pop()?.trim();
  return segment || fallback;
}

function inferExtension(fileName: string, mimeType: string) {
  const raw = fileName.split(".").pop()?.toLowerCase();
  if (raw && /^[a-z0-9]{1,8}$/.test(raw)) {
    return raw;
  }

  switch (mimeType) {
    case "audio/webm":
      return "webm";
    case "audio/wav":
      return "wav";
    case "audio/mpeg":
      return "mp3";
    case "audio/ogg":
      return "ogg";
    case "audio/mp4":
      return "m4a";
    default:
      return "bin";
  }
}

async function toUploadBody(asset: VoiceNoteAsset, mimeType: string) {
  if (typeof File !== "undefined" && asset.file instanceof File) {
    return asset.file;
  }

  const response = await fetch(asset.uri);
  if (!response.ok) {
    throw new Error(`Failed to read selected audio file: ${response.status}`);
  }

  const blob = await response.blob();
  return blob.type === mimeType ? blob : blob.slice(0, blob.size, mimeType);
}

function buildStoragePath(
  userId: string,
  asset: VoiceNoteAsset,
  mimeType: string,
  reportId?: string | null,
) {
  const fileName = inferFileName(asset.uri, "voice-note.m4a");
  const safeUserId = sanitizePathSegment(userId) || "anonymous";
  const safeReportId = reportId ? sanitizePathSegment(reportId) : null;
  const safeBase = sanitizePathSegment(fileName.replace(/\.[^.]+$/, "")) || "voice-note";
  const extension = inferExtension(fileName, mimeType);
  if (safeReportId) {
    return `voice-notes/${safeUserId}/${safeReportId}/${Date.now()}-${safeBase}.${extension}`;
  }
  return `voice-notes/${safeUserId}/${Date.now()}-${safeBase}.${extension}`;
}

export async function uploadVoiceNoteToStorage(input: {
  asset: VoiceNoteAsset;
  userId: string;
  reportId?: string | null;
}) {
  const supabase = getSupabaseClient();
  const mimeType = inferAudioMimeType(input.asset.uri, input.asset.mimeType);
  const storagePath = buildStoragePath(input.userId, input.asset, mimeType, input.reportId);
  const fileBody = await toUploadBody(input.asset, mimeType);

  const { error: uploadError } = await supabase.storage
    .from(REPORT_MEDIA_BUCKET)
    .upload(storagePath, fileBody, {
      cacheControl: "3600",
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Voice note upload failed");
  }

  return {
    storagePath,
    mimeType,
  };
}

export async function invokeVoiceNoteTranscription(input: {
  storagePath: string;
  reportId?: string | null;
}) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.functions.invoke("transcribe-incident", {
    body: {
      reportId: input.reportId ?? null,
      storagePath: input.storagePath,
    },
  });

  if (error) {
    throw new Error(error.message || "Voice note transcription failed");
  }

  return {
    storagePath: input.storagePath,
    transcriptRaw: typeof data?.transcriptRaw === "string" ? data.transcriptRaw : null,
    transcriptClean: typeof data?.transcriptClean === "string" ? data.transcriptClean : null,
    transcriptStatus: typeof data?.transcriptStatus === "string" ? data.transcriptStatus : "done",
    transcriptLanguage:
      typeof data?.transcriptLanguage === "string" ? data.transcriptLanguage : null,
    transcriptProvider:
      typeof data?.transcriptProvider === "string" ? data.transcriptProvider : null,
    transcriptError: typeof data?.transcriptError === "string" ? data.transcriptError : null,
  } satisfies VoiceTranscriptResult;
}
