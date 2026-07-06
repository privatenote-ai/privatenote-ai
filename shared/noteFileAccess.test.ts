import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  clampNoteFileAccessWindowForAccount,
  formatNoteFileAccessWindow,
  parseNoteFileAccessWindowFromBody,
} from "./noteFileAccess.ts";

describe("note file access window policy", () => {
  it("defaults to 15 minutes", () => {
    assert.equal(parseNoteFileAccessWindowFromBody(undefined, { isPremium: false }).ok, true);
    const parsed = parseNoteFileAccessWindowFromBody(undefined, { isPremium: false });
    assert.deepEqual(parsed, { ok: true, seconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS });
  });

  it("blocks longer windows for free users", () => {
    assert.deepEqual(parseNoteFileAccessWindowFromBody(30 * 60, { isPremium: false }), {
      ok: false,
      message: "Longer attachment access windows require Premium",
    });
  });

  it("allows premium windows", () => {
    assert.deepEqual(parseNoteFileAccessWindowFromBody(60 * 60, { isPremium: true }), {
      ok: true,
      seconds: 60 * 60,
    });
  });

  it("clamps non-premium accounts to the default", () => {
    assert.equal(clampNoteFileAccessWindowForAccount(60 * 60, false), NOTE_FILE_ACCESS_DEFAULT_SECONDS);
  });

  it("formats labels for the picker", () => {
    assert.equal(formatNoteFileAccessWindow(15 * 60), "15 minutes");
    assert.equal(formatNoteFileAccessWindow(60 * 60), "1 hour");
  });
});
