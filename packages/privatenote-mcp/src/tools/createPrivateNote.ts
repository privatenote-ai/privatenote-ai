import { z } from "zod";
import { MCP_EXPIRES_IN, createPrivateNote, isMcpExpiresIn } from "../createNote.ts";

const expiresInEnum = MCP_EXPIRES_IN as unknown as [string, ...string[]];

export const createPrivateNoteSchema = z.object({
  content: z
    .string()
    .optional()
    .describe(
      "Sensitive text to encrypt. Optional when contentFilePath, filePath, or filePaths is set. Prefer contentFilePath so the model never sees the secret.",
    ),
  contentFilePath: z
    .string()
    .optional()
    .describe(
      "Absolute path to a UTF-8 text file whose contents become the note body. The model should not read this file.",
    ),
  expiresIn: z
    .enum(expiresInEnum)
    .optional()
    .default("24h")
    .describe(
      "How long the note stays accessible. Server presets 5m–30d; 24h is an alias of 1d. Plan limits still apply.",
    ),
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
      "Absolute path to one local file to encrypt and attach. Requires sign_in. Prefer this over pasting file bytes.",
    ),
  filePaths: z
    .array(z.string())
    .optional()
    .describe(
      "Absolute paths to additional local files to attach (combined with filePath). Requires sign_in. Max 20; plan caps apply.",
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
          text: `Invalid expiresIn value. Must be one of: ${MCP_EXPIRES_IN.join(", ")}`,
        },
      ],
      isError: true,
    };
  }

  const result = await createPrivateNote({
    content: args.content,
    contentFilePath: args.contentFilePath,
    expiresIn,
    burnAfterReading: args.burnAfterReading,
    title: args.title,
    filePath: args.filePath,
    filePaths: args.filePaths,
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
