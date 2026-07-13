export const NOTE_CREATION_SOURCES = ["web", "vscode", "cursor", "chrome", "cli", "mcp"] as const;

export type NoteCreationSource = (typeof NOTE_CREATION_SOURCES)[number];

export function sanitizeNoteCreationSource(raw: unknown): NoteCreationSource | null {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "web" ||
    normalized === "vscode" ||
    normalized === "cursor" ||
    normalized === "chrome" ||
    normalized === "cli" ||
    normalized === "mcp"
  ) {
    return normalized;
  }
  return null;
}

export const NOTE_CREATION_SOURCE_LABELS: Record<NoteCreationSource, string> = {
  web: "Web app",
  vscode: "VS Code",
  cursor: "Cursor",
  chrome: "Chrome extension",
  cli: "CLI",
  mcp: "MCP",
};
