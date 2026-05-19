import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clampNoteReadLimitForAccount,
  parseMaxReadsFromBody,
} from "./noteReadLimits";

describe("parseMaxReadsFromBody", () => {
  it("defaults to 1 when omitted", () => {
    const r = parseMaxReadsFromBody(undefined);
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.maxReads, 1);
  });

  it("accepts 5 for premium", () => {
    const r = parseMaxReadsFromBody(5, { isPremium: true });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.maxReads, 5);
  });

  it("rejects 5 for free", () => {
    const r = parseMaxReadsFromBody(5, { isPremium: false });
    assert.equal(r.ok, false);
  });

  it("rejects unlimited (0)", () => {
    const r = parseMaxReadsFromBody(0, { isPremium: true });
    assert.equal(r.ok, false);
  });
});

describe("clampNoteReadLimitForAccount", () => {
  it("clamps premium limits to 1 for free users", () => {
    assert.equal(clampNoteReadLimitForAccount(5, false), 1);
    assert.equal(clampNoteReadLimitForAccount(5, true), 5);
  });
});
