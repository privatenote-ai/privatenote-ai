/**
 * PrivateNote MCP server — stdio transport.
 *
 * Exposes a single tool `create_private_note` that encrypts text on the local
 * machine and posts only ciphertext to the PrivateNote API. The decryption key
 * never leaves the client: it travels only in the URL fragment returned to the
 * caller.
 *
 * Usage:
 *   node dist/index.js          (after `npm run build`)
 *   npx tsx src/index.ts        (during development)
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createPrivateNoteSchema, handleCreatePrivateNote } from "./tools/createPrivateNote.ts";

const server = new McpServer({
  name: "privatenote-mcp",
  version: "0.1.0",
});

server.tool(
  "create_private_note",
  "Encrypt sensitive text and create a self-destructing PrivateNote link. " +
    "Encryption happens locally — only ciphertext reaches the server. " +
    "The decryption key is embedded in the returned URL fragment and never logged.",
  createPrivateNoteSchema.shape,
  async (args) => {
    try {
      return await handleCreatePrivateNote(args);
    } catch (err) {
      return {
        content: [
          {
            type: "text" as const,
            // Intentionally generic: do not echo back any part of the input
            text: err instanceof Error ? err.message : "Note creation failed",
          },
        ],
        isError: true,
      };
    }
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
