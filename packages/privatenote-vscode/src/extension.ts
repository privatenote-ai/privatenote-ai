/**
 * PrivateNote VS Code / Cursor extension entry point.
 *
 * Provides two commands:
 *   - privatenote.sendSelection — encrypt the current editor selection
 *   - privatenote.composeNote   — open the webview composer
 *
 * Encryption happens entirely inside the extension host (Node). No plaintext
 * is sent to the AI agent, no plaintext is sent to the PrivateNote server.
 */

import * as vscode from "vscode";
import { createPrivateNote, isExpiresIn, type ExpiresIn } from "./createNote.ts";
import { PrivateNoteSidebarProvider } from "./sidebarView.ts";
import { getActiveEditorSelectionText } from "./editorSelection.ts";

const EXPIRY_LABELS: Record<ExpiresIn, string> = {
  "15m": "15 minutes",
  "1h": "1 hour",
  "24h": "1 day",
  "7d": "7 days",
};

export function activate(context: vscode.ExtensionContext): void {
  const sidebarProvider = new PrivateNoteSidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      PrivateNoteSidebarProvider.viewId,
      sidebarProvider,
    ),
    vscode.commands.registerCommand("privatenote.sendSelection", () =>
      sendSelectionCommand(),
    ),
    vscode.commands.registerCommand("privatenote.composeNote", async () => {
      const selection = getActiveEditorSelectionText();
      await sidebarProvider.revealAndPrefill(selection);
    }),
  );
}

export function deactivate(): void {
  // no-op
}

async function sendSelectionCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("PrivateNote: open an editor and select some text first.");
    return;
  }

  const text = editor.document.getText(editor.selection);
  if (!text.trim()) {
    vscode.window.showWarningMessage("PrivateNote: select some text to share first.");
    return;
  }

  const config = vscode.workspace.getConfiguration("privatenote");
  const defaultExpiry = config.get<string>("defaultExpiresIn", "24h");
  const defaultBurn = config.get<boolean>("defaultBurnAfterReading", true);
  const apiBaseUrl = config.get<string>("apiBaseUrl", "https://privatenote.ai");
  const webOrigin = config.get<string>("webOrigin", apiBaseUrl);

  const expiryPick = await vscode.window.showQuickPick(
    (Object.entries(EXPIRY_LABELS) as Array<[ExpiresIn, string]>).map(([id, label]) => ({
      label,
      description: id === defaultExpiry ? "default" : undefined,
      id,
    })),
    {
      placeHolder: "How long should the note remain accessible?",
      title: "PrivateNote — Expiry",
    },
  );
  if (!expiryPick) return;

  const burnPick = await vscode.window.showQuickPick(
    [
      {
        label: "Burn after reading",
        description:
          defaultBurn ? "default · single-use, recommended" : "single-use, recommended",
        value: true,
      },
      {
        label: "Allow up to 2 reads",
        description: "requires a PrivateNote Premium account on the server",
        value: false,
      },
    ],
    {
      placeHolder: "Read behavior",
      title: "PrivateNote — Read limit",
    },
  );
  if (!burnPick) return;

  if (!isExpiresIn(expiryPick.id)) {
    vscode.window.showErrorMessage(`PrivateNote: invalid expiry "${expiryPick.id}"`);
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Encrypting and creating PrivateNote…",
      cancellable: false,
    },
    async () => {
      try {
        const result = await createPrivateNote({
          content: text,
          expiresIn: expiryPick.id,
          burnAfterReading: burnPick.value,
          apiBaseUrl,
          webOrigin,
        });

        await vscode.env.clipboard.writeText(result.secureUrl);

        const expiresLabel = new Date(result.expiresAt).toLocaleString();
        const action = await vscode.window.showInformationMessage(
          `PrivateNote link copied to clipboard. Expires ${expiresLabel}${
            result.burnAfterReading ? " · burns after read" : ""
          }.`,
          "Open in browser",
          "Show link",
        );

        if (action === "Open in browser") {
          await vscode.env.openExternal(vscode.Uri.parse(result.secureUrl));
        } else if (action === "Show link") {
          await vscode.window.showInformationMessage(result.secureUrl);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create note";
        vscode.window.showErrorMessage(`PrivateNote: ${message}`);
      }
    },
  );
}
