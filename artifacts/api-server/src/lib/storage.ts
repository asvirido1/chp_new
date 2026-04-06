import { randomUUID } from "node:crypto";

const DEFAULT_BUCKET = "report-media";

function getStorageBaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || DEFAULT_BUCKET;

  if (!url || !key) {
    throw new Error(
      "Supabase Storage is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY).",
    );
  }

  return {
    url: url.replace(/\/+$/, ""),
    key,
    bucket,
  };
}

function sanitizeBasename(filename: string) {
  const base = filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "upload";
}

function inferExtension(filename: string, mimeType: string) {
  const rawExt = filename.split(".").pop()?.toLowerCase();
  if (rawExt && /^[a-z0-9]{1,8}$/.test(rawExt)) {
    return rawExt;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    case "video/mp4":
      return "mp4";
    case "video/quicktime":
      return "mov";
    default:
      return "bin";
  }
}

function encodePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function inferMediaType(mimeType: string, fallback?: string | null) {
  if (fallback === "photo" || fallback === "video") {
    return fallback;
  }

  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("video/")) return "video";

  return null;
}

export function buildStorageObjectPath(reportId: string, filename: string, mimeType: string) {
  const ext = inferExtension(filename, mimeType);
  const base = sanitizeBasename(filename);
  return `reports/${reportId}/${Date.now()}-${base}-${randomUUID()}.${ext}`;
}

export function buildPublicStorageUrl(objectPath: string) {
  const { url, bucket } = getStorageBaseConfig();
  return `${url}/storage/v1/object/public/${encodePath(bucket)}/${encodePath(objectPath)}`;
}

export async function uploadBufferToStorage(input: {
  buffer: Buffer;
  objectPath: string;
  mimeType: string;
}) {
  const { url, key, bucket } = getStorageBaseConfig();
  const uploadUrl = `${url}/storage/v1/object/${encodePath(bucket)}/${encodePath(input.objectPath)}`;

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${key}`,
      apikey: key,
      "content-type": input.mimeType,
      "x-upsert": "false",
    },
    body: input.buffer,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Storage upload failed: ${response.status} ${response.statusText} ${detail}`.trim());
  }
}
