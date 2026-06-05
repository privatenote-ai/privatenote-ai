import * as vscode from "vscode";

/** Returns the active editor selection text, or undefined when nothing is selected. */
export function getActiveEditorSelectionText(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.selection.isEmpty) {
    return undefined;
  }

  const text = editor.document.getText(editor.selection);
  return text.trim() ? text : undefined;
}
