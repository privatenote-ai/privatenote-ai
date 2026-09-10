/**
 * PrivateNote MCP server — stdio transport.
 *
 * Tools encrypt on this machine. Ciphertext is posted to the PrivateNote API.
 * The decryption key is returned only in the URL fragment.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPrivateNoteSchema, handleCreatePrivateNote } from "./tools/createPrivateNote.ts";
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

const server = new McpServer({
  name: "privatenote-mcp",
  version: "0.2.1",
});

function toolError(err: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: err instanceof Error ? err.message : "Request failed",
      },
    ],
    isError: true,
  };
}

server.tool(
  "create_private_note",
  "Encrypt sensitive text and optionally attach local files, then create a self-destructing PrivateNote link. " +
    "Encryption happens locally — only ciphertext reaches the server. " +
    "Prefer contentFilePath and filePaths so secrets never enter the chat. " +
    "Attaching files requires sign_in first. The decryption key is in the returned URL fragment.",
  createPrivateNoteSchema.shape,
  async (args) => {
    try {
      return await handleCreatePrivateNote(args);
    } catch (err) {
      return toolError(err);
    }
  },
);

server.tool(
  "sign_in",
  "Sign in to PrivateNote with a device code. Returns an approve URL and userCode immediately so you can show them. " +
    "Opens the browser when possible. Call again with pollDeviceCode after the user approves. " +
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
  "List recent notes sent from this signed-in account (status, created/opened/revoked). Requires sign_in. Paid plans only.",
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
