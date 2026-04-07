import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { noteMetaEligibility, type NoteMetaRow } from "./noteMetaEligibility.ts";

const frozenIso = "2030-01-01T00:00:00.000Z";
const baseRow = (over: Partial<NoteMetaRow> = {}): NoteMetaRow => ({
  note_id: "00000000-0000-4000-8000-000000000001",
  expires_at: frozenIso,
  max_reads: 1,
  current_reads: 0,
  consumed: 0,
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
});
