import { z } from "zod";
import { getConfig } from "../config.ts";
import { listSentNotes, revokeSentNote } from "../apiClient.ts";

export const listSentNotesSchema = z.object({
  limit: z
    .number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe("How many recent sent notes to return (1–50, default 25). Status, openedAt, openCount, and maxReads only — no note contents. Requires sign_in."),
});

export const revokeSentNoteSchema = z.object({
  noteId: z
    .string()
    .min(8)
    .describe("Note id from list_sent_notes or from a PrivateNote URL path. Requires sign_in. Unopened notes only."),
});

export async function handleListSentNotes(args: z.infer<typeof listSentNotesSchema>) {
  const { apiBaseUrl } = getConfig();
  const notes = await listSentNotes(apiBaseUrl, args.limit ?? 25);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ notes }, null, 2),
      },
    ],
  };
}

export async function handleRevokeSentNote(args: z.infer<typeof revokeSentNoteSchema>) {
  const { apiBaseUrl } = getConfig();
  await revokeSentNote(apiBaseUrl, args.noteId.trim());
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ revoked: true, noteId: args.noteId.trim() }, null, 2),
      },
    ],
  };
}
