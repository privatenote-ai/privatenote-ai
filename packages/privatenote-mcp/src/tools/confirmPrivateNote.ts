import { z } from "zod";
import { createPrivateNote, formatNotePreviewMessage, preloadedFromBoundFiles } from "../createNote.ts";
import { consumePendingCreate, type PendingCreate } from "../pendingCreates.ts";
import { createdNotePayload, type ElicitCreateConfirm } from "./createPrivateNote.ts";

export const confirmPrivateNoteSchema = z.object({
  confirmationId: z
    .string()
    .min(8)
    .describe(
      "confirmationId from the pending_confirmation response. Call after the user approved the preview (host Accept, or their next message). Do not resupply path, recipient, channel, expiry, or other options; they are bound to this id.",
    ),
});

export type ConfirmPrivateNoteArgs = z.infer<typeof confirmPrivateNoteSchema>;

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

function boundInput(pending: PendingCreate) {
  return {
    ...pending.input,
    expiresIn: pending.options.expiresIn,
    burnAfterReading: pending.options.burnAfterReading,
    title: pending.options.title ?? undefined,
    recipientEmail: pending.options.recipientEmail ?? undefined,
    requireRecipientVerification: pending.options.requireRecipientVerification,
    notifyOnOpen: pending.options.notifyOnOpen,
    label: pending.options.label ?? undefined,
    sendChannel: pending.sendAuthorization.requested ? pending.sendAuthorization.channel : undefined,
    sendRecipient: pending.sendAuthorization.requested ? pending.sendAuthorization.recipient : undefined,
  };
}

export async function handleConfirmPrivateNote(
  args: ConfirmPrivateNoteArgs,
  options: { elicitConfirm?: ElicitCreateConfirm } = {},
) {
  const pending = consumePendingCreate(args.confirmationId);

  // Creating a link only needs the earlier preview approval. Re-prompt only when
  // this confirmation also authorizes sending the URL.
  if (pending.sendAuthorization.requested && options.elicitConfirm) {
    const elicited = await options.elicitConfirm(pending.preview);
    if (elicited && !elicited.approved) {
      return jsonResult({
        status: "cancelled",
        preview: pending.preview,
        summary: formatNotePreviewMessage(pending.preview),
        message: "The user declined. This confirmation id is consumed; call create_private_note again to start over.",
      });
    }
  }

  const preloaded = await preloadedFromBoundFiles(pending.boundFiles);
  const result = await createPrivateNote(boundInput(pending), preloaded);
  return jsonResult(createdNotePayload(result, pending.sendAuthorization.requested));
}
