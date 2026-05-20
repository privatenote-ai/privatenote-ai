/**
 * PrivateNote sidebar WebviewView provider.
 * Renders the same composer UI inside the activity bar panel.
 */

import * as vscode from "vscode";
import { createPrivateNote, isExpiresIn } from "./createNote.ts";
import { renderComposerHtml } from "./composer.ts";

export class PrivateNoteSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewId = "privatenote.composerView";
  public static readonly sidebarContainerId = "privatenote-sidebar";

  private _view?: vscode.WebviewView;
  private _pendingPrefill?: string;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  /** Focus the sidebar and prefill the content box when the editor has a selection. */
  async revealAndPrefill(content?: string): Promise<void> {
    if (content) {
      this._pendingPrefill = content;
    }

    await vscode.commands.executeCommand(
      `workbench.view.extension.${PrivateNoteSidebarProvider.sidebarContainerId}`,
    );

    this._applyPrefill();
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    const initialContent = this._pendingPrefill;
    webviewView.webview.html = renderComposerHtml(webviewView.webview, {
      initialContent,
    });
    if (initialContent) {
      this._pendingPrefill = undefined;
    }

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.type === "ready") {
        this._applyPrefill();
        return;
      }
      await this._handleMessage(message);
    });
  }

  private _applyPrefill(): void {
    if (!this._pendingPrefill || !this._view) {
      return;
    }

    this._view.webview.postMessage({
      type: "prefill",
      content: this._pendingPrefill,
    });
    this._pendingPrefill = undefined;
  }

  private async _handleMessage(message: Record<string, unknown>): Promise<void> {
    if (!this._view) return;

    if (message.type === "submit") {
      const config = vscode.workspace.getConfiguration("privatenote");
      const apiBaseUrl = config.get<string>("apiBaseUrl", "https://privatenote.ai");
      const webOrigin = config.get<string>("webOrigin", apiBaseUrl);
      const expiresIn = String(message.expiresIn ?? "24h");

      if (!isExpiresIn(expiresIn)) {
        this._view.webview.postMessage({ type: "error", message: "Invalid expiry." });
        return;
      }

      try {
        const result = await createPrivateNote({
          content: String(message.content ?? ""),
          title: message.title ? String(message.title) : undefined,
          expiresIn,
          burnAfterReading: Boolean(message.burnAfterReading),
          apiBaseUrl,
          webOrigin,
        });

        this._view.webview.postMessage({
          type: "success",
          url: result.secureUrl,
          expiresAt: result.expiresAt,
          burnAfterReading: result.burnAfterReading,
        });

        await vscode.env.clipboard.writeText(result.secureUrl);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create note";
        this._view.webview.postMessage({ type: "error", message: msg });
      }
    } else if (message.type === "copy") {
      await vscode.env.clipboard.writeText(String(message.text ?? ""));
      vscode.window.showInformationMessage("PrivateNote link copied to clipboard.");
    } else if (message.type === "open") {
      await vscode.env.openExternal(vscode.Uri.parse(String(message.url ?? "")));
    }
  }
}
