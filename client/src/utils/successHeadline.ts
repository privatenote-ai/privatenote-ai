export type SuccessHeadlineKind = "note" | "file" | "password" | "photo";

export function deriveSuccessHeadlineKind(input: {
  isFileTransfer: boolean;
  creationEntryPoint?: string;
  files: Array<{ type: string }>;
  noteBody: string;
}): SuccessHeadlineKind {
  if (input.isFileTransfer) return "file";
  if (input.creationEntryPoint === "password-share") return "password";
  if (
    input.files.length > 0 &&
    input.files.every((file) => file.type.startsWith("image/")) &&
    !input.noteBody.trim()
  ) {
    return "photo";
  }
  return "note";
}
