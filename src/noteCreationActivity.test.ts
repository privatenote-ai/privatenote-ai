import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recordNoteCreatedActivity } from "./noteCreationActivity";
import type { Env } from "./types";

function memoryDb(inserted: Array<{ type: string; metadata: string | null }> = []) {
  return {
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          return {
            async run() {
              if (sql.includes("INSERT INTO account_activity")) {
                inserted.push({
                  type: String(values[2]),
                  metadata: (values[4] as string | null) ?? null,
                });
              }
              return { meta: { changes: 1 } };
            },
          };
        },
      };
    },
  } as unknown as Env["AUTH_DB"];
}

describe("noteCreationActivity", () => {
  it("records create activity with compact metadata and AI companion event", async () => {
    const inserted: Array<{ type: string; metadata: string | null }> = [];
    const env = { AUTH_DB: memoryDb(inserted) } as Env;
    await recordNoteCreatedActivity(env, "u1", "note-1", {
      aiEnhanced: true,
      hasAttachment: true,
      maxReads: 1,
      notifyOnOpen: true,
      passwordProtected: false,
    });
    assert.equal(inserted.length, 2);
    assert.equal(inserted[0]?.type, "note_created");
    assert.equal(inserted[1]?.type, "ai_note_created");
    assert.equal(
      inserted[0]?.metadata,
      JSON.stringify({
        hasAttachment: true,
        maxReads: 1,
        notifyOnOpen: true,
        aiEnhanced: true,
      }),
    );
  });
});
