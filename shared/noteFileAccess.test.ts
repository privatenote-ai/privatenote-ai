import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  clampNoteFileAccessWindowForAccount,
  formatNoteFileAccessWindow,
  parseNoteFileAccessWindowFromBody,
} from "./noteFileAccess.ts";

describe("note file access window policy", () => {
  it("defaults to one hour", () => {
    const parsed = parseNoteFileAccessWindowFromBody(undefined, { accountType: "free" });
    assert.deepEqual(parsed, { ok: true, seconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS });
    assert.equal(NOTE_FILE_ACCESS_DEFAULT_SECONDS, 60 * 60);
  });

  it("allows fifteen minutes and one hour on Free, but not four hours", () => {
    assert.deepEqual(parseNoteFileAccessWindowFromBody(15 * 60, { accountType: "free" }), {
      ok: true,
      seconds: 15 * 60,
    });
    assert.deepEqual(parseNoteFileAccessWindowFromBody(60 * 60, { accountType: "free" }), {
      ok: true,
      seconds: 60 * 60,
    });
    assert.equal(parseNoteFileAccessWindowFromBody(4 * 60 * 60, { accountType: "free" }).ok, false);
  });

  it("allows four hours on Starter but not twenty-four", () => {
    assert.deepEqual(
      parseNoteFileAccessWindowFromBody(4 * 60 * 60, { accountType: "personal_premium" }),
      { ok: true, seconds: 4 * 60 * 60 },
    );
    assert.equal(
      parseNoteFileAccessWindowFromBody(24 * 60 * 60, { accountType: "personal_premium" }).ok,
      false,
    );
  });

  it("allows twenty-four hours on Business", () => {
    assert.deepEqual(
      parseNoteFileAccessWindowFromBody(24 * 60 * 60, { accountType: "business_premium" }),
      { ok: true, seconds: 24 * 60 * 60 },
    );
  });

  it("still honors a legacy thirty-minute stored window", () => {
    assert.deepEqual(parseNoteFileAccessWindowFromBody(30 * 60, { accountType: "free" }), {
      ok: true,
      seconds: 30 * 60,
    });
  });

  it("clamps picker values to the plan maximum and migrates thirty minutes to one hour", () => {
    assert.equal(clampNoteFileAccessWindowForAccount(15 * 60, "free"), 15 * 60);
    assert.equal(clampNoteFileAccessWindowForAccount(60 * 60, "free"), 60 * 60);
    assert.equal(clampNoteFileAccessWindowForAccount(4 * 60 * 60, "free"), 60 * 60);
    assert.equal(clampNoteFileAccessWindowForAccount(30 * 60, "personal_premium"), 60 * 60);
    assert.equal(clampNoteFileAccessWindowForAccount(4 * 60 * 60, "personal_premium"), 4 * 60 * 60);
    assert.equal(
      clampNoteFileAccessWindowForAccount(24 * 60 * 60, "personal_premium"),
      4 * 60 * 60,
    );
    assert.equal(
      clampNoteFileAccessWindowForAccount(24 * 60 * 60, "business_premium"),
      24 * 60 * 60,
    );
  });

  it("formats labels for the picker", () => {
    assert.equal(formatNoteFileAccessWindow(15 * 60), "15 minutes");
    assert.equal(formatNoteFileAccessWindow(60 * 60), "1 hour");
    assert.equal(formatNoteFileAccessWindow(4 * 60 * 60), "4 hours");
    assert.equal(formatNoteFileAccessWindow(24 * 60 * 60), "24 hours");
  });
});
