import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseCreateResponse, parseReserveResponse } from "./responseValidation.ts";

const VALID_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("parseReserveResponse", () => {
  it("accepts a well-formed reserve payload", () => {
    const out = parseReserveResponse({
      id: VALID_ID,
      uploadToken: "abc123",
      expiresIn: 600,
    });
    assert.equal(out.id, VALID_ID);
  });

  it("rejects unexpected fields", () => {
    assert.throws(
      () =>
        parseReserveResponse({
          id: VALID_ID,
          uploadToken: "abc123",
          expiresIn: 600,
          evil: true,
        }),
      /unexpected field "evil"/,
    );
  });

  it("rejects invalid note ids", () => {
    assert.throws(
      () =>
        parseReserveResponse({
          id: "not-a-uuid",
          uploadToken: "abc123",
          expiresIn: 600,
        }),
      /valid note id/,
    );
  });
});

describe("parseCreateResponse", () => {
  it("accepts a matching id", () => {
    assert.doesNotThrow(() => parseCreateResponse({ id: VALID_ID }, VALID_ID));
  });

  it("rejects id mismatch", () => {
    assert.throws(
      () => parseCreateResponse({ id: "660e8400-e29b-41d4-a716-446655440001" }, VALID_ID),
      /does not match/,
    );
  });

  it("rejects unexpected fields", () => {
    assert.throws(
      () => parseCreateResponse({ id: VALID_ID, redirect: "https://evil.example" }, VALID_ID),
      /unexpected field "redirect"/,
    );
  });
});
