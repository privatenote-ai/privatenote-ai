import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersEn: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "You need to send a password to a colleague. Maybe it's the staging database. Maybe it's a Stripe key that's about to go into production. Maybe it's an SSH credential for a server that only you and two other people are supposed to touch.",
    "You open Slack. You start typing. And then — a small, familiar hesitation.",
    "That message is going to sit in your chat history. It's going to sync to three devices. It might end up in a backup, a search index, a compliance archive. Long after you've rotated the credential and forgotten about it, that message is still there.",
    "PrivateNote is a different path. The secret gets encrypted on your machine before it touches any network. The decryption key lives only in the URL you share — the server that stores the note never sees it. The note self-destructs after the first read. Nothing persists.",
    "Here's how to use it — starting with the easiest option.",
  ],
  sections: [
    {
      title: "The VS Code and Cursor extension",
      body: [
        "If you spend your days in VS Code or Cursor, this is the most frictionless path. Install the extension once and it sits in your sidebar, always one click away.",
        "Open the Extensions panel (Cmd+Shift+X), search for PrivateNote, and click Install. After a window reload, a small envelope icon appears in the activity bar on the left.",
        "Click it. A panel opens:",
      ],
      bullets: [
        "Type or paste the secret into the content box",
        "Set an expiry — 15 minutes, 1 hour, 1 day, or 7 days",
        'Leave "Burn after reading" checked (the default)',
        "Click Share PrivateNote →",
      ],
    },
    {
      title: "What happens when you click Share",
      body: [
        "Your browser's built-in cryptography generates a random 256-bit key. That key never leaves your machine.",
        "The content is encrypted with AES-256-GCM. The result is a blob of ciphertext with no readable content inside.",
        "Only that ciphertext is sent to the PrivateNote server. The key is not included — not in the request body, not in a header, not anywhere.",
        "The server stores the encrypted blob and hands back a note ID. Your machine builds a shareable URL: the note ID in the path, the decryption key in the URL fragment — the #this-part that browsers never send to servers.",
        "The link copies to your clipboard. You paste it wherever you'd normally paste the secret. The difference is that the link is the secret now, not the password itself.",
      ],
    },
    {
      title: "Two other ways to use the extension",
      body: [
        "You don't always need to open the panel. Two faster shortcuts exist:",
        "Select any text in your editor and right-click — you'll see Share as PrivateNote in the context menu. A quick-pick prompt asks for expiry and burn preference, then the link copies to your clipboard.",
        "When you have text selected, a lock icon also appears in the editor title bar at the top right. One click sends it.",
      ],
    },
    {
      title: "If you use an AI assistant: the MCP server",
      body: [
        "If you work in Cursor with Claude or another model, you can let the AI create PrivateNotes on your behalf. The MCP (Model Context Protocol) server adds a create_private_note tool that the agent can call automatically.",
        "Add this to ~/.cursor/mcp.json:",
      ],
      code: mcpConfig,
      bullets: [
        "Restart Cursor and check Settings → MCP — you should see privatenote with a green dot",
        'Then just tell the agent: "Send this API key securely, burn after reading"',
        "The agent calls the tool, encryption runs locally, and you get a link",
      ],
    },
    {
      title: "One thing to understand about AI and secrets",
      body: [
        "When you include a secret in an AI prompt, the model reads it before the MCP tool encrypts it. The AI provider's servers briefly see the content.",
        "This is still a meaningful improvement over sending it through Slack — the secret doesn't end up in persistent chat history, email, or server logs. But it's not the same as the AI never seeing it.",
        "For full end-to-end privacy when using an AI agent, use a local model running on your machine (like Ollama). Then nothing leaves your computer until it's already encrypted.",
      ],
    },
    {
      title: "No install needed: the web app",
      body: [
        "If you're not in VS Code, or you're on a machine without your usual setup, the web app at privatenote.ai does the same thing in any browser.",
        "Paste your secret, choose an expiry, click Create. Share the link. The encryption logic runs in your browser — the same AES-256-GCM, the same key-in-fragment architecture.",
      ],
    },
    {
      title: "What to remember",
      body: [
        "The link contains the decryption key. Treat the URL with the same care as the secret itself — don't post it in a public channel.",
        "Once a burn-after-reading note is opened, the link is dead. Neither you nor the recipient can re-open it.",
        "If you've typed a secret into an AI prompt, consider rotating it after sharing. The prompt was seen. The PrivateNote link wasn't — but the underlying credential was.",
        "For secrets that need to persist, use a proper secrets manager. PrivateNote is for delivery, not storage.",
      ],
    },
  ],
  ctaTitle: "Share your first private note",
  ctaBody: "Install the VS Code extension or try the web app — no account required for single-read notes.",
  ctaButton: "Try PrivateNote →",
};
