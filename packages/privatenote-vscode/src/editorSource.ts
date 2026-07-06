import * as vscode from "vscode";
import type { NoteCreationSource } from "@shared/noteCreationSource";

/** Detect whether the extension is running in Cursor or another VS Code–compatible editor. */
export function detectEditorCreationSource(): NoteCreationSource {
  return vscode.env.appName.toLowerCase().includes("cursor") ? "cursor" : "vscode";
}
