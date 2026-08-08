import {
  serializeAccountActivityMetadata,
  type AccountActivityCreateMetadata,
} from "../shared/accountActivityMetadata";
import type { Env } from "./types";

export type NoteCreatedActivityOptions = AccountActivityCreateMetadata & {
  aiEnhanced?: boolean;
};

async function insertAccountActivity(
  env: Env,
  userId: string,
  eventType: "note_created" | "ai_note_created",
  noteId: string,
  metadataJson: string | null,
): Promise<void> {
  if (!env.AUTH_DB) return;
  try {
    await env.AUTH_DB.prepare(
      `INSERT INTO account_activity (id, user_id, event_type, note_id, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    )
      .bind(crypto.randomUUID(), userId, eventType, noteId, metadataJson)
      .run();
  } catch (error) {
    // Older DBs without metadata column: fall back so Activity still records creates.
    try {
      await env.AUTH_DB.prepare(
        `INSERT INTO account_activity (id, user_id, event_type, note_id, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
      )
        .bind(crypto.randomUUID(), userId, eventType, noteId)
        .run();
    } catch (fallbackError) {
      console.warn("[NOTE_ACTIVITY] insert failed:", error, fallbackError);
    }
  }
}

export async function recordNoteCreatedActivity(
  env: Env,
  userId: string,
  noteId: string,
  options: NoteCreatedActivityOptions = {},
): Promise<void> {
  const metadataJson = serializeAccountActivityMetadata(options);
  await insertAccountActivity(env, userId, "note_created", noteId, metadataJson);
  if (options.aiEnhanced) {
    await insertAccountActivity(env, userId, "ai_note_created", noteId, metadataJson);
  }
}
