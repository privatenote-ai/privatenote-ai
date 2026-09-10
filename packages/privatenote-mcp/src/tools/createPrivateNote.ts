import { z } from "zod";
import { createPrivateNote, isMcpExpiresIn } from "../createNote.ts";

export const createPrivateNoteSchema = z.object({
  content: z
    .string()
    .optional()
    .describe("The sensitive text to encrypt and store. Optional when filePath is set."),
  expiresIn: z
    .enum(["15m", "1h", "24h", "7d"])
    .optional()
    .default("24h")
    .describe("How long the note stays accessible (default: 24h)"),
  burnAfterReading: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Destroy after first view (default: true). Setting false uses maxReads=2 — requires a Premium account on the server.",
    ),
  title: z
    .string()
    .optional()
    .describe(
      "Optional title prepended to the content before encryption (not stored separately)",
    ),
  filePath: z
    .string()
    .optional()
    .describe(
      "Absolute path to a local file to encrypt and attach. Requires sign_in. Do not pass file bytes through the model.",
    ),
});

export type CreatePrivateNoteArgs = z.infer<typeof createPrivateNoteSchema>;

export async function handleCreatePrivateNote(args: CreatePrivateNoteArgs) {
  const expiresIn = args.expiresIn ?? "24h";
  if (!isMcpExpiresIn(expiresIn)) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Invalid expiresIn value. Must be one of: 15m, 1h, 24h, 7d`,
        },
      ],
      isError: true,
    };
  }

  const result = await createPrivateNote({
    content: args.content,
    expiresIn,
    burnAfterReading: args.burnAfterReading,
    title: args.title,
    filePath: args.filePath,
  });

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}
