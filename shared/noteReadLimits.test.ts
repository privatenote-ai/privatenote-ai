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

  it("accepts 5 when the plan allows it", () => {
    const r = parseMaxReadsFromBody(5, { allowedReadCounts: [1, 2, 3, 5] });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.maxReads, 5);
  });

  it("rejects 5 for starter", () => {
    const r = parseMaxReadsFromBody(5, { allowedReadCounts: [1, 2, 3] });
    assert.equal(r.ok, false);
  });

  it("accepts 3 for starter", () => {
    const r = parseMaxReadsFromBody(3, { allowedReadCounts: [1, 2, 3] });
    assert.equal(r.ok, true);
  });

  it("rejects 5 for free", () => {
    const r = parseMaxReadsFromBody(5, { allowedReadCounts: [1] });
    assert.equal(r.ok, false);
  });

  it("rejects unlimited (0)", () => {
    const r = parseMaxReadsFromBody(0, { allowedReadCounts: [1, 2, 3, 5] });
    assert.equal(r.ok, false);
  });
});

describe("clampNoteReadLimitForAccount", () => {
  it("clamps to the highest allowed value for the plan", () => {
    assert.equal(clampNoteReadLimitForAccount(5, [1]), 1);
    assert.equal(clampNoteReadLimitForAccount(5, [1, 2, 3]), 1);
    assert.equal(clampNoteReadLimitForAccount(3, [1, 2, 3]), 3);
    assert.equal(clampNoteReadLimitForAccount(5, [1, 2, 3, 5]), 5);
  });
});
