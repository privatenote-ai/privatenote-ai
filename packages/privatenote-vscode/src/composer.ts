/**
 * Webview-based composer for creating PrivateNote links.
 * The webview collects input only; encryption + API calls run in the extension
 * host so we keep the cryptographic boundary inside Node, not in the iframe.
 */

import * as vscode from "vscode";
import { createPrivateNote, isExpiresIn, type ExpiresIn } from "./createNote.ts";

interface SubmitMessage {
  type: "submit";
  content: string;
  title?: string;
  expiresIn: string;
  burnAfterReading: boolean;
}

interface CopyMessage {
  type: "copy";
  text: string;
}

interface OpenMessage {
  type: "open";
  url: string;
}

type IncomingMessage = SubmitMessage | CopyMessage | OpenMessage;

export interface ComposerRenderOptions {
  initialContent?: string;
}

export function openComposerPanel(
  context: vscode.ExtensionContext,
  options?: ComposerRenderOptions,
): void {
  const panel = vscode.window.createWebviewPanel(
    "privatenoteComposer",
    "PrivateNote — Compose",
    vscode.ViewColumn.Active,
    {
      enableScripts: true,
      retainContextWhenHidden: false,
    },
  );

  panel.webview.html = renderHtml(panel.webview, options);

  panel.webview.onDidReceiveMessage(
    async (msg: IncomingMessage) => {
      if (msg.type === "submit") {
        await handleSubmit(panel, msg);
      } else if (msg.type === "copy") {
        await vscode.env.clipboard.writeText(msg.text);
        vscode.window.showInformationMessage("PrivateNote link copied to clipboard");
      } else if (msg.type === "open") {
        await vscode.env.openExternal(vscode.Uri.parse(msg.url));
      }
    },
    undefined,
    context.subscriptions,
  );
}

async function handleSubmit(panel: vscode.WebviewPanel, msg: SubmitMessage): Promise<void> {
  if (!isExpiresIn(msg.expiresIn)) {
    panel.webview.postMessage({
      type: "error",
      message: "Invalid expiry value",
    });
    return;
  }

  const config = vscode.workspace.getConfiguration("privatenote");
  const apiBaseUrl = config.get<string>("apiBaseUrl", "https://privatenote.ai");
  const webOrigin = config.get<string>("webOrigin", apiBaseUrl);

  try {
    const result = await createPrivateNote({
      content: msg.content,
      expiresIn: msg.expiresIn as ExpiresIn,
      burnAfterReading: msg.burnAfterReading,
      title: msg.title?.trim() || undefined,
      apiBaseUrl,
      webOrigin,
    });

    panel.webview.postMessage({
      type: "success",
      url: result.secureUrl,
      expiresAt: result.expiresAt,
      burnAfterReading: result.burnAfterReading,
    });
  } catch (err) {
    panel.webview.postMessage({
      type: "error",
      message: err instanceof Error ? err.message : "Failed to create note",
    });
  }
}

function getNonce(): string {
  let nonce = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    nonce += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return nonce;
}

export function renderComposerHtml(
  webview: vscode.Webview,
  options?: ComposerRenderOptions,
): string {
  return renderHtml(webview, options);
}

function renderHtml(webview: vscode.Webview, options?: ComposerRenderOptions): string {
  const nonce = getNonce();
  const initialContentJson = JSON.stringify(options?.initialContent ?? "");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <title>PrivateNote</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 1.5rem 2rem;
      max-width: 640px;
      margin: 0 auto;
      line-height: 1.5;
    }
    h2 {
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0 0 0.2rem 0;
    }
    .subtitle {
      opacity: 0.6;
      font-size: 0.82rem;
      margin-bottom: 1.25rem;
    }
    .privacy-note {
      display: flex;
      align-items: flex-start;
      gap: 0.45rem;
      font-size: 0.78rem;
      opacity: 0.7;
      margin-bottom: 1.25rem;
      line-height: 1.4;
    }
    .privacy-note-icon {
      flex-shrink: 0;
      margin-top: 0.05rem;
      color: #0000FF;
      opacity: 1;
    }
    .field {
      margin-bottom: 0.9rem;
    }
    label {
      display: block;
      font-size: 0.82rem;
      font-weight: 500;
      opacity: 0.75;
      margin-bottom: 0.3rem;
    }
    input[type="text"],
    textarea,
    select {
      width: 100%;
      padding: 0.55rem 0.7rem;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1.5px solid #0000FF;
      border-radius: 4px;
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: var(--vscode-editor-font-size, 13px);
      outline: none;
      transition: border-color 0.1s;
    }
    input[type="text"]:focus,
    textarea:focus,
    select:focus {
      border-color: #0000FF;
      box-shadow: 0 0 0 2px rgba(0,0,255,0.15);
    }
    textarea {
      resize: vertical;
      min-height: 160px;
      line-height: 1.55;
    }
    /* Settings row — stacked on the left */
    /* Action bar: options row, then button full-width below */
    .action-bar {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-bottom: 1rem;
    }
    .settings {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .setting-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .setting-item label {
      margin: 0;
      opacity: 1;
      font-size: 0.88rem;
      font-weight: 400;
      white-space: nowrap;
    }
    select.inline {
      width: auto;
      padding: 0.3rem 0.5rem;
      font-size: 0.88rem;
    }
    .setting-item input[type="checkbox"] {
      margin: 0;
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
    .submit-btn {
      width: 100%;
      padding: 0.55rem 1.25rem;
      background: #0000FF;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-family: inherit;
      font-weight: 600;
      letter-spacing: 0.01em;
    }
    .submit-btn:hover { background: #0000cc; }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    button.secondary {
      padding: 0.45rem 0.85rem;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: inherit;
      font-family: inherit;
    }
    button.secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
    .result {
      padding: 1rem 1.1rem;
      border: 1px solid var(--vscode-input-border, var(--vscode-widget-border, rgba(255,255,255,0.18)));
      border-radius: 6px;
      word-break: break-all;
    }
    .result.success { border-color: var(--vscode-charts-green, #4caf50); }
    .result.error {
      border-color: var(--vscode-errorForeground);
      color: var(--vscode-errorForeground);
    }
    .result-label { font-size: 0.78rem; opacity: 0.65; margin-bottom: 0.4rem; }
    .result-url {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 0.88rem;
      color: #0000FF;
      display: block;
      margin-bottom: 0.6rem;
    }
    .result-meta { font-size: 0.78rem; opacity: 0.65; margin-top: 0.4rem; }
    .result-actions { display: flex; gap: 0.5rem; margin-top: 0.65rem; }

    /* Branding header — stacked vertically for narrow sidebar */
    .brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.3rem;
      margin-bottom: 0.25rem;
      text-align: center;
    }
    .brand-logo {
      width: 40px;
      height: 40px;
    }
    .brand-name {
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }
    .brand-tagline {
      font-size: 0.75rem;
      opacity: 0.55;
      line-height: 1.3;
    }
    .brand-link {
      font-size: 0.78rem;
      color: #0000FF;
      text-decoration: none;
      font-weight: 500;
    }
    .brand-link:hover { text-decoration: underline; }
    .divider {
      border: none;
      border-top: 1px solid var(--vscode-widget-border, rgba(128,128,128,0.2));
      margin: 0.85rem 0 1.1rem 0;
    }
  </style>
</head>
<body>
  <!-- Branded header — stacked for narrow sidebar -->
  <div class="brand">
    <svg class="brand-logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(32 32) scale(0.84) translate(-32 -32)">
        <defs>
          <linearGradient id="fn-paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FFFDF8" />
            <stop offset="100%" stop-color="#EDE6D8" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#0000FF" />
        <g transform="translate(0 -4.5)">
          <path d="M14 23 L32 39 L50 23 V50 H14Z" fill="url(#fn-paper)" stroke="white" stroke-opacity="0.45" stroke-width="0.85" />
          <path d="M14 23 L32 39 L50 23Z" fill="url(#fn-paper)" fill-opacity="0.97" />
          <path d="M14 23 L32 39 L50 23" fill="none" stroke="#0000FF" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </g>
    </svg>
    <span class="brand-name">PrivateNote</span>
    <span class="brand-tagline">End-to-end encrypted note sharing</span>
    <a class="brand-link" href="https://privatenote.ai" title="Open privatenote.ai">privatenote.ai ↗</a>
  </div>

  <hr class="divider" />

  <div class="privacy-note">
    <svg class="privacy-note-icon" width="13" height="13" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1a4 4 0 0 0-4 4v1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm2.5 5H5.5V5a2.5 2.5 0 0 1 5 0v1z"/>
    </svg>
    <span>Encrypted on your machine · key stays in the URL, never sent to any server</span>
  </div>

  <div class="field">
    <label for="title">Title <span style="opacity:0.5">(optional)</span></label>
    <input id="title" type="text" placeholder="e.g. Staging database password" autocomplete="off" />
  </div>

  <div class="field">
    <label for="content">Content</label>
    <textarea id="content" placeholder="Paste or type the secret here…" autocomplete="off" spellcheck="false"></textarea>
  </div>

  <!-- Single action bar: options left, button right -->
  <div class="action-bar">
    <div class="settings">
      <div class="setting-item">
        <label for="expiresIn">Expires in</label>
        <select id="expiresIn" class="inline">
          <option value="15m">15 minutes</option>
          <option value="1h">1 hour</option>
          <option value="24h" selected>1 day</option>
          <option value="7d">7 days</option>
        </select>
      </div>
      <div class="setting-item">
        <input type="checkbox" id="burn" checked />
        <label for="burn">Burn after reading</label>
      </div>
    </div>
    <button id="submit" class="submit-btn">Share PrivateNote →</button>
  </div>

  <div id="result" style="display: none;" class="result"></div>

  <script nonce="${nonce}">
    (function () {
      const vscode = acquireVsCodeApi();
      const submit = document.getElementById("submit");
      const result = document.getElementById("result");
      const contentEl = document.getElementById("content");

      function applyPrefill(text) {
        if (!text) return;
        contentEl.value = text;
        contentEl.focus();
      }

      applyPrefill(${initialContentJson});
      vscode.postMessage({ type: "ready" });

      function showError(message) {
        result.style.display = "block";
        result.className = "result error";
        result.textContent = message;
      }

      function showSuccess(url, expiresAt, burnAfterReading) {
        result.style.display = "block";
        result.className = "result success";
        const expiresDate = new Date(expiresAt);
        const expiresLabel = expiresDate.toLocaleString();
        result.innerHTML = '<div class="result-label">Encrypted link (the # fragment is the key):</div>' +
          '<span class="result-url"></span>' +
          '<div class="result-meta">Expires ' + expiresLabel + (burnAfterReading ? ' · burns after first read' : ' · multi-read') + '</div>' +
          '<div class="result-actions">' +
          '<button id="copy">Copy link</button>' +
          '<button id="open" class="secondary">Open in browser</button>' +
          '</div>';
        result.querySelector(".result-url").textContent = url;
        document.getElementById("copy").onclick = function () {
          vscode.postMessage({ type: "copy", text: url });
        };
        document.getElementById("open").onclick = function () {
          vscode.postMessage({ type: "open", url: url });
        };
        // Scroll result into view so user sees the link
        setTimeout(function () { result.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50);
      }

      submit.onclick = function () {
        const content = contentEl.value;
        if (!content.trim()) {
          showError("Content cannot be empty.");
          return;
        }
        submit.disabled = true;
        submit.textContent = "Encrypting…";
        result.style.display = "none";
        vscode.postMessage({
          type: "submit",
          content: content,
          title: document.getElementById("title").value,
          expiresIn: document.getElementById("expiresIn").value,
          burnAfterReading: document.getElementById("burn").checked,
        });
      };

      window.addEventListener("message", function (event) {
        submit.disabled = false;
        submit.textContent = "Share PrivateNote →";
        const msg = event.data;
        if (msg.type === "success") {
          showSuccess(msg.url, msg.expiresAt, msg.burnAfterReading);
        } else if (msg.type === "error") {
          showError(msg.message);
        } else if (msg.type === "prefill") {
          applyPrefill(msg.content);
        }
      });
    })();
  </script>
</body>
</html>`;
}
