import { isVoiceMessageAttachment } from "./voiceMessageRecording";

export type AttachmentPreviewKind = "image" | "pdf" | "audio" | "video" | "text";

const IMAGE_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "heic",
  "heif",
]);

const VIDEO_FILE_EXTENSIONS = new Set(["mp4", "webm", "mov", "m4v", "ogv", "mkv"]);

const TEXT_FILE_EXTENSIONS = new Set([
  "txt",
  "md",
  "csv",
  "tsv",
  "json",
  "xml",
  "yml",
  "yaml",
  "log",
  "ini",
  "toml",
  "env",
  "html",
  "htm",
  "css",
  "js",
  "jsx",
  "ts",
  "tsx",
  "mjs",
  "cjs",
  "py",
  "rb",
  "go",
  "rs",
  "java",
  "kt",
  "swift",
  "c",
  "h",
  "cpp",
  "hpp",
  "cs",
  "sh",
  "sql",
]);

/** Skip inline text preview above this decrypted size. */
export const TEXT_PREVIEW_MAX_BYTES = 2 * 1024 * 1024;

export function getFileExtension(fileName: string | undefined): string | null {
  if (!fileName) return null;
  const dot = fileName.lastIndexOf(".");
  if (dot < 0 || dot === fileName.length - 1) return null;
  return fileName.slice(dot + 1).toLowerCase();
}

export function getAttachmentPreviewKind(
  mimeType: string | undefined,
  fileName?: string,
): AttachmentPreviewKind | null {
  const normalizedMime = mimeType?.trim().toLowerCase();
  if (normalizedMime?.startsWith("video/")) return "video";
  if (normalizedMime === "application/pdf" || normalizedMime === "application/x-pdf") return "pdf";
  if (normalizedMime?.startsWith("image/")) return "image";
  if (normalizedMime?.startsWith("audio/") || isVoiceMessageAttachment(mimeType, fileName)) {
    return "audio";
  }
  if (isTextPreviewMime(normalizedMime)) return "text";

  const ext = getFileExtension(fileName);
  if (!ext) return null;
  if (IMAGE_FILE_EXTENSIONS.has(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (VIDEO_FILE_EXTENSIONS.has(ext)) return "video";
  if (TEXT_FILE_EXTENSIONS.has(ext)) return "text";
  return null;
}

function isTextPreviewMime(mime: string | undefined): boolean {
  if (!mime) return false;
  if (mime.startsWith("text/")) return true;
  return (
    mime === "application/json" ||
    mime === "application/xml" ||
    mime === "application/javascript" ||
    mime === "application/x-javascript" ||
    mime === "application/yaml" ||
    mime === "application/x-yaml" ||
    mime === "application/toml"
  );
}

export function isGenericAttachmentMimeType(mimeType: string | undefined): boolean {
  const normalized = mimeType?.trim().toLowerCase();
  return !normalized || normalized === "application/octet-stream" || normalized === "binary/octet-stream";
}

export function getAttachmentBlobMimeType(
  mimeType: string | undefined,
  previewKind: AttachmentPreviewKind,
  fileName?: string,
): string {
  const normalizedMime = mimeType?.trim();
  if (normalizedMime && !isGenericAttachmentMimeType(mimeType)) return normalizedMime;
  if (previewKind === "pdf") return "application/pdf";

  const ext = getFileExtension(fileName);
  if (previewKind === "audio") {
    if (ext === "m4a" || ext === "mp4") return "audio/mp4";
    if (ext === "ogg" || ext === "oga") return "audio/ogg";
    if (ext === "mp3") return "audio/mpeg";
    if (ext === "wav") return "audio/wav";
    if (ext === "aac") return "audio/aac";
    return "audio/webm";
  }
  if (previewKind === "video") {
    if (ext === "mp4" || ext === "m4v") return "video/mp4";
    if (ext === "webm") return "video/webm";
    if (ext === "mov") return "video/quicktime";
    if (ext === "ogv") return "video/ogg";
    return "video/mp4";
  }
  if (previewKind === "text") {
    if (ext === "json") return "application/json";
    if (ext === "xml") return "application/xml";
    if (ext === "js" || ext === "mjs" || ext === "cjs") return "text/javascript";
    if (ext === "css") return "text/css";
    if (ext === "html" || ext === "htm") return "text/html";
    if (ext === "csv") return "text/csv";
    if (ext === "md") return "text/markdown";
    return "text/plain";
  }
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  if (ext === "webp") return "image/webp";
  if (ext === "heic") return "image/heic";
  if (ext === "heif") return "image/heif";
  if (ext === "bmp") return "image/bmp";
  if (ext === "svg") return "image/svg+xml";
  return previewKind === "image" ? "image/jpeg" : "application/octet-stream";
}

const TYPE_LABEL_ALIASES: Record<string, string> = {
  jpg: "JPEG",
  jpeg: "JPEG",
  tif: "TIFF",
  tiff: "TIFF",
  mpg: "MPEG",
  mpeg: "MPEG",
};

export function formatAttachmentTypeLabel(
  mimeType: string | undefined,
  fileName?: string,
): string {
  const ext = getFileExtension(fileName);
  if (ext) return TYPE_LABEL_ALIASES[ext] ?? ext.toUpperCase();

  const normalizedMime = mimeType?.trim().toLowerCase();
  if (!normalizedMime || isGenericAttachmentMimeType(normalizedMime)) return "FILE";
  if (normalizedMime === "application/pdf" || normalizedMime === "application/x-pdf") return "PDF";
  if (normalizedMime === "application/zip" || normalizedMime === "application/x-zip-compressed") {
    return "ZIP";
  }
  const slash = normalizedMime.lastIndexOf("/");
  if (slash >= 0 && slash < normalizedMime.length - 1) {
    const subtype = normalizedMime.slice(slash + 1).replace(/^x-/, "");
    if (subtype) return TYPE_LABEL_ALIASES[subtype] ?? subtype.toUpperCase();
  }
  return "FILE";
}

export function formatTextPreview(text: string, mimeType: string | undefined, fileName?: string): string {
  const ext = getFileExtension(fileName);
  const mime = mimeType?.trim().toLowerCase() ?? "";
  if (ext === "json" || mime === "application/json" || mime.endsWith("+json")) {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  }
  return text;
}
