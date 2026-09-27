import { z } from "zod";
import {
  MCP_EXPIRES_IN,
  createPrivateNote,
  formatNotePreviewMessage,
  isMcpExpiresIn,
  preloadedFromInspected,
  prepareBoundCreate,
  type CreatePrivateNoteInput,
  type NotePreview,
} from "../createNote.ts";
import { wipeInspectedBytes } from "../boundFile.ts";
import { getFrozenMcpRuntimeConfig } from "../config.ts";
import { putPendingCreate } from "../pendingCreates.ts";
import { SEND_CHANNELS } from "../sendChannels.ts";

const expiresInEnum = MCP_EXPIRES_IN as unknown as [string, ...string[]];
const sendChannelEnum = SEND_CHANNELS as unknown as [string, ...string[]];

export const createPrivateNoteSchema = z.object({
  content: z
    .string()
    .optional()
    .describe(
      "LAST RESORT plaintext. Optional when a path is set. Never copy a local file into this field — use contentFilePath instead so the model never sees the secret.",
    ),
  contentFilePath: z
    .string()
    .optional()
    .describe(
      "Absolute path to a UTF-8 text file whose contents become the note body. Must be under the workspace or PRIVATENOTE_MCP_ALLOWED_ROOTS. Credential dirs (~/.ssh, ~/.aws) are always blocked. Pass the path only — do not read this file with other tools.",
    ),
  expiresIn: z
    .enum(expiresInEnum)
    .optional()
    .default("24h")
    .describe(
      "How long the note stays accessible. Server presets 5m–30d; 24h is an alias of 1d. Plan limits still apply. Bound at preview — confirm_private_note cannot change it.",
    ),
  burnAfterReading: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      "Destroy after first view (default: true). Setting false uses maxReads=2 — requires a Premium account on the server. Bound at preview — confirm_private_note cannot change it.",
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
      "Absolute path to one local file to encrypt and attach. Requires sign_in. Must be under the workspace or PRIVATENOTE_MCP_ALLOWED_ROOTS; credential dirs are always blocked. Pass the path only — do not read or paste file bytes.",
    ),
  filePaths: z
    .array(z.string())
    .optional()
    .describe(
      "Absolute paths to additional local files to attach (combined with filePath). Requires sign_in. Max 20. Same path allowlist as filePath. Do not read these files first.",
    ),
  passwordFilePath: z
    .string()
    .optional()
    .describe(
      "Absolute path to a UTF-8 file whose first line is the reveal passphrase (Argon2id wrap). Prefer this so the model never sees the password. Same path allowlist as contentFilePath. Send the passphrase separately from the link. Do not read this file first.",
    ),
  password: z
    .string()
    .optional()
    .describe(
      "LAST RESORT reveal passphrase. Prefer passwordFilePath. The recipient must enter this on reveal; do not put it in the returned URL or in the same message as the link.",
    ),
  recipientEmail: z
    .string()
    .optional()
    .describe(
      "Recipient email for the verification gate (not a secret). Requires sign_in, a paid plan, and requireRecipientVerification. The reader must prove they own this address before the note unlocks.",
    ),
  requireRecipientVerification: z
    .boolean()
    .optional()
    .describe(
      "If true, the reader must verify recipientEmail before reveal. Requires sign_in and a paid plan. This is a PrivateNote gate — it does not send the email for you.",
    ),
  notifyOnOpen: z
    .boolean()
    .optional()
    .describe(
      "Email the signed-in account when the note is first opened. Requires sign_in, a paid plan, and a verified account email. Also poll list_sent_notes for openedAt.",
    ),
  label: z
    .string()
    .optional()
    .describe("Optional label stored on the sent-note activity row (not encrypted content). Requires sign_in."),
  sendChannel: z
    .enum(sendChannelEnum)
    .optional()
    .describe(
      "If set with sendRecipient, the preview asks the user to authorize sending the URL via this channel only. Creating a note is not by itself authorization to send. Bound at preview — confirm_private_note cannot change it.",
    ),
  sendRecipient: z
    .string()
    .optional()
    .describe(
      "Exact destination for sendChannel (email address, Slack channel/user, etc.). Required with sendChannel. Bound at preview — confirm_private_note cannot substitute another recipient.",
    ),
});

export type CreatePrivateNoteArgs = z.input<typeof createPrivateNoteSchema>;

export type ElicitCreateConfirm = (preview: NotePreview) => Promise<{
  approved: boolean;
} | null>;

export const PENDING_CONFIRMATION_NEXT_STEP =
  "Show this preview and wait for the user to approve in their next message. Then call confirm_private_note with only confirmationId. Do not confirm in this turn, and do not change path, expiry, or destination.";

export const SEND_FORBIDDEN_NEXT_STEP =
  "Give the user only secureUrl and safe metadata. Do not send it via Slack, email, Discord, WhatsApp, or any other tool. sendAuthorized is false because no destination was approved.";

export const SEND_AUTHORIZED_NEXT_STEP =
  "The user authorized sending only via the approved channel and recipient from the preview. You may send only secureUrl (not file bytes or the passphrase) to that exact destination. Do not substitute another recipient or channel.";

function jsonResult(payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

export function createdNotePayload(
  result: Awaited<ReturnType<typeof createPrivateNote>>,
  sendAuthorized: boolean,
) {
  return {
    status: "created" as const,
    ...result,
    sendAuthorized,
    nextStep: sendAuthorized ? SEND_AUTHORIZED_NEXT_STEP : SEND_FORBIDDEN_NEXT_STEP,
  };
}

function toCreateInput(args: CreatePrivateNoteArgs, expiresIn: CreatePrivateNoteInput["expiresIn"]): CreatePrivateNoteInput {
  return {
    content: args.content,
    contentFilePath: args.contentFilePath,
    expiresIn,
    burnAfterReading: args.burnAfterReading,
    title: args.title,
    filePath: args.filePath,
    filePaths: args.filePaths,
    password: args.password,
    passwordFilePath: args.passwordFilePath,
    recipientEmail: args.recipientEmail,
    requireRecipientVerification: args.requireRecipientVerification,
    notifyOnOpen: args.notifyOnOpen,
    label: args.label,
    sendChannel: args.sendChannel as CreatePrivateNoteInput["sendChannel"],
    sendRecipient: args.sendRecipient,
  };
}

function sendAuthorizedFrom(prepared: { sendAuthorization: { requested: boolean } }): boolean {
  return prepared.sendAuthorization.requested === true;
}

export async function handleCreatePrivateNote(
  args: CreatePrivateNoteArgs,
  options: { elicitConfirm?: ElicitCreateConfirm } = {},
) {
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

  const input = toCreateInput(args, expiresIn);
  const prepared = await prepareBoundCreate(input);
  const oneShot = getFrozenMcpRuntimeConfig().oneShotCreate;

  const encryptNow = async () => {
    try {
      const result = await createPrivateNote(input, preloadedFromInspected(prepared.inspected));
      return jsonResult({
        ...createdNotePayload(result, sendAuthorizedFrom(prepared)),
        ...(oneShot ? { oneShot: true } : {}),
      });
    } finally {
      wipeInspectedBytes(prepared.inspected);
    }
  };

  if (oneShot) {
    return encryptNow();
  }

  if (options.elicitConfirm) {
    const elicited = await options.elicitConfirm(prepared.preview);
    if (elicited) {
      if (!elicited.approved) {
        wipeInspectedBytes(prepared.inspected);
        return jsonResult({
          status: "cancelled",
          preview: prepared.preview,
          summary: formatNotePreviewMessage(prepared.preview),
          message: "The user declined creating this note. Do not create or send a link.",
        });
      }
      return encryptNow();
    }
  }

  wipeInspectedBytes(prepared.inspected);
  const pending = putPendingCreate({
    input,
    preview: prepared.preview,
    boundFiles: prepared.boundFiles,
    options: prepared.options,
    sendAuthorization: prepared.sendAuthorization,
  });
  return jsonResult({
    status: "pending_confirmation",
    confirmationId: pending.confirmationId,
    confirmationExpiresAt: new Date(pending.expiresAtMs).toISOString(),
    preview: prepared.preview,
    summary: formatNotePreviewMessage(prepared.preview),
    nextStep: PENDING_CONFIRMATION_NEXT_STEP,
  });
}
