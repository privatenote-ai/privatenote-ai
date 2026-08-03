export const NOTE_CREATION_ENTRY_POINTS = [
  "home",
  "password-share",
  "file-share",
  "extension",
  "cli",
  "mcp",
] as const;

export type NoteCreationEntryPoint = (typeof NOTE_CREATION_ENTRY_POINTS)[number];

export function sanitizeNoteCreationEntryPoint(raw: unknown): NoteCreationEntryPoint | null {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "home" ||
    normalized === "password-share" ||
    normalized === "file-share" ||
    normalized === "extension" ||
    normalized === "cli" ||
    normalized === "mcp"
  ) {
    return normalized;
  }
  return null;
}

export const NOTE_CREATION_ENTRY_POINT_LABELS: Record<NoteCreationEntryPoint, string> = {
  home: "Home",
  "password-share": "Share a password",
  "file-share": "Share a file",
  extension: "Editor extension",
  cli: "Command line",
  mcp: "MCP server",
};

export const FILE_SIZE_BUCKET_LABELS = {
  under5mb: "< 5 MB",
  from5to15mb: "5–15 MB",
  from15to25mb: "15–25 MB",
  over25mb: "≥ 25 MB",
} as const;
