import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { redactErrorMessage, redactSensitiveText } from "../src/redactSecrets.ts";

const SAMPLE =
  "https://privatenote.ai/note/550e8400-e29b-41d4-a716-446655440000#abcdefghijklmnopqrstuvwxyZ0123456789_-abc";

describe("redactSensitiveText", () => {
  it("redacts URL fragments from logs and errors", () => {
    const redacted = redactSensitiveText(`failed to post ${SAMPLE}`);
    assert.match(redacted, /\/note\/550e8400-e29b-41d4-a716-446655440000#\[redacted\]/);
    assert.ok(!redacted.includes("abcdefghijklmnopqrstuvwxyZ0123456789_-abc"));
  });

  it("redacts secureUrl JSON fields", () => {
    const redacted = redactSensitiveText(JSON.stringify({ secureUrl: SAMPLE }));
    assert.match(redacted, /"secureUrl"\s*:\s*"\[redacted\]"/);
    assert.ok(!redacted.includes("abcdefghijklmnopqrstuvwxyZ0123456789_-abc"));
  });

  it("redactErrorMessage uses the same helper", () => {
    const message = redactErrorMessage(new Error(`upload failed for ${SAMPLE}`));
    assert.ok(message.includes("[redacted]"));
    assert.ok(!message.includes("#abcdefghijklmnopqrstuvwxyZ0123456789_-abc"));
  });
});
