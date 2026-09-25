/**
 * PrivateNote MCP server — stdio transport.
 *
 * Tools encrypt on this machine. Ciphertext is posted to the PrivateNote API.
 * The decryption key is returned only in the URL fragment.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { freezeMcpRuntimeConfig } from "./config.ts";
import { formatNotePreviewMessage, type NotePreview } from "./createNote.ts";
import { redactErrorMessage } from "./redactSecrets.ts";
import { createPrivateNoteSchema, handleCreatePrivateNote } from "./tools/createPrivateNote.ts";
import {
  confirmPrivateNoteSchema,
  handleConfirmPrivateNote,
} from "./tools/confirmPrivateNote.ts";
import {
  handleSignIn,
  handleSignOut,
  handleWhoami,
  signInSchema,
  signOutSchema,
  whoamiSchema,
} from "./tools/signIn.ts";
import {
  handleListSentNotes,
  handleRevokeSentNote,
  listSentNotesSchema,
  revokeSentNoteSchema,
} from "./tools/sentNotes.ts";
import { AGENT_INSTRUCTIONS } from "./privacyBoundary.ts";

freezeMcpRuntimeConfig();

const server = new McpServer(
  {
    name: "privatenote-mcp",
    version: "0.4.0",
  },
  { instructions: AGENT_INSTRUCTIONS },
);

function toolError(err: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: redactErrorMessage(err),
      },
    ],
    isError: true,
  };
}

function clientSupportsFormElicitation(): boolean {
  const elicitation = server.server.getClientCapabilities()?.elicitation;
  if (!elicitation || typeof elicitation !== "object") return false;
  return "form" in elicitation;
}

async function elicitCreateConfirm(preview: NotePreview) {
  if (!clientSupportsFormElicitation()) return null;
  const sending = Boolean(preview.sendChannel);
  try {
    const result = await server.server.elicitInput({
      mode: "form",
      message:
        formatNotePreviewMessage(preview) +
        (sending
          ? "\n\nAccept to encrypt and authorize sending only to that destination."
          : "\n\nAccept to create the encrypted link. Decline to cancel. The agent must not send the URL unless send was approved."),
      requestedSchema: {
        type: "object",
        properties: {},
      },
    });
    return { approved: result.action === "accept" };
  } catch {
    return null;
  }
}

server.tool(
  "create_private_note",
  "Prepare an encrypted PrivateNote from local paths (preview first). " +
    "Prefer contentFilePath, filePaths, and passwordFilePath — do not read those files yourself. " +
    "If the host shows an Accept dialog, one Accept creates the link. Otherwise wait for the user, then confirm_private_note with only confirmationId. " +
    "To authorize delivery, pass sendChannel and sendRecipient so the preview names the destination. " +
    "If PRIVATENOTE_MCP_ALLOW_ONE_SHOT was set by the administrator at server start, this call creates the URL immediately. " +
    "When signed in to a Business account, the reveal page uses your account branding (logo, colors, sender). " +
    "Paths must be under the workspace or PRIVATENOTE_MCP_ALLOWED_ROOTS; credential directories are always blocked. " +
    "File attach, recipient verification, and open notifications require sign_in first.",
  createPrivateNoteSchema.shape,
  {
    title: "Prepare PrivateNote",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (args) => {
    try {
      return await handleCreatePrivateNote(args, { elicitConfirm: elicitCreateConfirm });
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "confirm_private_note",
  "Create the encrypted link after the user approved the preview. " +
    "Call with confirmationId only — do not resupply path, recipient, channel, expiry, or destruction options. " +
    "Do not call this in the same turn as create_private_note. " +
    "Return only secureUrl and safe metadata. sendAuthorized is true only if the preview bound a destination.",
  confirmPrivateNoteSchema.shape,
  {
    title: "Confirm PrivateNote",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (args) => {
    try {
      return await handleConfirmPrivateNote(args, { elicitConfirm: elicitCreateConfirm });
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "sign_in",
  "Sign in to PrivateNote. Opens an approve page in the browser (the link already includes the grant). " +
    "Do not ask the user to type a code. After they click Approve, call again with pollDeviceCode. " +
    "Does not replace the website session. Required before attaching files.",
  signInSchema.shape,
  async (args) => {
    try {
      return await handleSignIn(args);
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "whoami",
  "Show whether this MCP server is signed in to a PrivateNote account.",
  whoamiSchema.shape,
  async () => {
    try {
      return await handleWhoami();
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "sign_out",
  "Revoke this MCP app session and delete the local token. Does not sign you out of the website.",
  signOutSchema.shape,
  async () => {
    try {
      return await handleSignOut();
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "list_sent_notes",
  "List recent sent notes as events, not contents: id, status, createdAt, openedAt, revokedAt, expiresAt. " +
    "Poll this after delivery to see if the recipient opened the link. Requires sign_in. Paid plans only.",
  listSentNotesSchema.shape,
  async (args) => {
    try {
      return await handleListSentNotes(args);
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "revoke_sent_note",
  "Revoke an unopened sent note so the link can no longer be read. Requires sign_in. Paid plans only.",
  revokeSentNoteSchema.shape,
  async (args) => {
    try {
      return await handleRevokeSentNote(args);
    } catch (err) {
      return toolError(err);
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
