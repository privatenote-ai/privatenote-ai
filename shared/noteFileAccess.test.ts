import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  clampNoteFileAccessWindowForAccount,
  formatNoteFileAccessWindow,
  parseNoteFileAccessWindowFromBody,
} from "./noteFileAccess.ts";

describe("note file access window policy", () => {
  it("defaults to fifteen minutes", () => {
    const parsed = parseNoteFileAccessWindowFromBody(undefined, { accountType: "free" });
    assert.deepEqual(parsed, { ok: true, seconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS });
  });

  it("rejects longer windows on Free", () => {
    assert.deepEqual(parseNoteFileAccessWindowFromBody(30 * 60, { accountType: "free" }), {
      ok: false,
      message: "Longer attachment access windows require Starter or Business",
    });
  });

  it("allows thirty minutes on Starter but not sixty", () => {
    assert.deepEqual(
      parseNoteFileAccessWindowFromBody(30 * 60, { accountType: "personal_premium" }),
      { ok: true, seconds: 30 * 60 },
    );
    assert.equal(
      parseNoteFileAccessWindowFromBody(60 * 60, { accountType: "personal_premium" }).ok,
      false,
    );
  });

  it("allows sixty minutes on Business", () => {
    assert.deepEqual(
      parseNoteFileAccessWindowFromBody(60 * 60, { accountType: "business_premium" }),
      { ok: true, seconds: 60 * 60 },
    );
  });

  it("clamps to the plan maximum", () => {
    assert.equal(
      clampNoteFileAccessWindowForAccount(60 * 60, "free"),
      NOTE_FILE_ACCESS_DEFAULT_SECONDS,
    );
    assert.equal(
      clampNoteFileAccessWindowForAccount(60 * 60, "personal_premium"),
      NOTE_FILE_ACCESS_DEFAULT_SECONDS,
    );
    assert.equal(clampNoteFileAccessWindowForAccount(30 * 60, "personal_premium"), 30 * 60);
    assert.equal(clampNoteFileAccessWindowForAccount(60 * 60, "business_premium"), 60 * 60);
  });

  it("formats labels for the picker", () => {
    assert.equal(formatNoteFileAccessWindow(15 * 60), "15 minutes");
    assert.equal(formatNoteFileAccessWindow(60 * 60), "1 hour");
  });
});
