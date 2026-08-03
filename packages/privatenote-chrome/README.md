# PrivateNote for Chrome

Chrome extension (Manifest V3) for creating end-to-end encrypted PrivateNote links without leaving the page you are on.

## Phase 1 MVP

- Toolbar popup to compose and share encrypted notes
- Context menu: **Create PrivateNote** from selected text
- Keyboard shortcut: `Alt+Shift+P` (prefills selected text)
- Automatic copy of the generated link to clipboard
- Settings page: default expiry, burn-after-reading, theme, language

Encryption runs locally in the extension using `@shared/noteCrypto`. Plaintext is never sent to PrivateNote servers; only ciphertext is uploaded. Analytics records `creationSource: "chrome"`.

## Development

Run the build from the **repository root** or from **`packages/privatenote-chrome`** — not from `dist/` (that folder is output only and has no `package.json` scripts).

```bash
# Option A — from repo root (privatenote.ai/)
npm run build:chrome

# Option B — from the extension package
cd packages/privatenote-chrome
npm run icons    # regenerate 128×128 store icon (96×96 + 16px padding)
npm run build
```

**Chrome Web Store icon:** `icons/icon128.png` — 128×128 PNG with 96×96 artwork centered and 16px transparent padding per [Google's icon guidelines](https://developer.chrome.com/docs/webstore/images#icon).

Then reload in Chrome:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** (first time) or **Reload** on the extension card
4. Select or use folder: `packages/privatenote-chrome/dist`

## Permissions

| Permission | Purpose |
|---|---|
| `storage` | Sync settings; session storage for prefilled selection |
| `contextMenus` | Right-click **Create PrivateNote** on selected text |
| `activeTab` + `scripting` | Read selection for keyboard shortcut |
| `clipboardWrite` | Copy generated link |
| `host_permissions` (`privatenote.ai`) | Reserve note ID and upload ciphertext |

## Not yet implemented

- Additional languages beyond English (i18n structure is in place)
