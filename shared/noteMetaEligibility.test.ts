import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { noteMetaEligibility, parseNoteOpensAtFromBody, type NoteMetaRow } from "./noteMetaEligibility.ts";

const frozenIso = "2030-01-01T00:00:00.000Z";
const baseRow = (over: Partial<NoteMetaRow> = {}): NoteMetaRow => ({
  note_id: "00000000-0000-4000-8000-000000000001",
  expires_at: frozenIso,
  max_reads: 1,
  current_reads: 0,
  consumed: 0,
  opens_at: null,
  ...over,
});

describe("noteMetaEligibility", () => {
  it("missing meta → missing", () => {
    const r = noteMetaEligibility(null, new Date("2029-06-01T00:00:00.000Z"));
    assert.deepEqual(r, { ok: false, kind: "missing" });
  });

  it("consumed (legacy tombstone) → consumed", () => {
    const r = noteMetaEligibility(baseRow({ consumed: 1 }), new Date("2029-06-01T00:00:00.000Z"));
    assert.deepEqual(r, { ok: false, kind: "consumed" });
  });

  it("expired when expires_at is strictly before now → expired", () => {
    const r = noteMetaEligibility(
      baseRow({ expires_at: "2020-01-01T00:00:00.000Z" }),
      new Date("2020-01-01T00:00:00.001Z"),
    );
    assert.deepEqual(r, { ok: false, kind: "expired" });
  });

  it("not expired when expires_at equals now (boundary)", () => {
    const t = new Date("2025-07-07T12:00:00.000Z");
    const r = noteMetaEligibility(baseRow({ expires_at: t.toISOString() }), t);
    assert.deepEqual(r, { ok: true });
  });

  it("exhausted when max_reads > 0 and current_reads >= max_reads", () => {
    const r = noteMetaEligibility(
      baseRow({ max_reads: 3, current_reads: 3 }),
      new Date("2029-06-01T00:00:00.000Z"),
    );
    assert.deepEqual(r, { ok: false, kind: "exhausted" });
  });

  it("not exhausted when one read remains", () => {
    const r = noteMetaEligibility(
      baseRow({ max_reads: 3, current_reads: 2 }),
      new Date("2029-06-01T00:00:00.000Z"),
    );
    assert.deepEqual(r, { ok: true });
  });

  it("max_reads === 0 (unlimited) never exhausted by read count", () => {
    const r = noteMetaEligibility(
      baseRow({ max_reads: 0, current_reads: 99_999 }),
      new Date("2029-06-01T00:00:00.000Z"),
    );
    assert.deepEqual(r, { ok: true });
  });

  it("eligible meta returns ok: true", () => {
    const r = noteMetaEligibility(baseRow(), new Date("2029-06-01T00:00:00.000Z"));
    assert.deepEqual(r, { ok: true });
  });

  it("not_yet_available when opens_at is strictly after now", () => {
    const r = noteMetaEligibility(
      baseRow({ opens_at: "2029-07-01T09:00:00.000Z" }),
      new Date("2029-06-01T00:00:00.000Z"),
    );
    assert.deepEqual(r, {
      ok: false,
      kind: "not_yet_available",
      opensAt: "2029-07-01T09:00:00.000Z",
    });
  });

  it("openable when opens_at equals now (boundary)", () => {
    const t = new Date("2029-07-01T09:00:00.000Z");
    const r = noteMetaEligibility(baseRow({ opens_at: t.toISOString() }), t);
    assert.deepEqual(r, { ok: true });
  });

  it("openable when opens_at is in the past", () => {
    const r = noteMetaEligibility(
      baseRow({ opens_at: "2029-01-01T00:00:00.000Z" }),
      new Date("2029-06-01T00:00:00.000Z"),
    );
    assert.deepEqual(r, { ok: true });
  });
});

describe("parseNoteOpensAtFromBody", () => {
  it("accepts null/empty as no delayed reveal", () => {
    const expiresAt = new Date("2030-01-01T00:00:00.000Z");
    assert.deepEqual(parseNoteOpensAtFromBody(null, { expiresAt }), { ok: true, opensAt: null });
    assert.deepEqual(parseNoteOpensAtFromBody("", { expiresAt }), { ok: true, opensAt: null });
  });

  it("rejects opensAt after or at expiry", () => {
    const expiresAt = new Date("2030-01-01T00:00:00.000Z");
    const r = parseNoteOpensAtFromBody("2030-01-01T00:00:00.000Z", {
      now: new Date("2029-06-01T00:00:00.000Z"),
      expiresAt,
    });
    assert.equal(r.ok, false);
  });

  it("accepts a future opensAt before expiry", () => {
    const expiresAt = new Date("2030-01-01T00:00:00.000Z");
    const r = parseNoteOpensAtFromBody("2029-08-15T09:00:00.000Z", {
      now: new Date("2029-06-01T00:00:00.000Z"),
      expiresAt,
    });
    assert.deepEqual(r, { ok: true, opensAt: "2029-08-15T09:00:00.000Z" });
  });
});
