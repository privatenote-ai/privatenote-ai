import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseAccountActivityMetadata,
  serializeAccountActivityMetadata,
} from "./accountActivityMetadata";

describe("accountActivityMetadata", () => {
  it("compacts only privacy-safe create flags", () => {
    const json = serializeAccountActivityMetadata({
      hasAttachment: true,
      passwordProtected: false,
      maxReads: 3,
      expirySeconds: 86400,
      notifyOnOpen: true,
      aiEnhanced: true,
      aiMode: "local",
    });
    assert.equal(
      json,
      JSON.stringify({
        hasAttachment: true,
        maxReads: 3,
        expirySeconds: 86400,
        notifyOnOpen: true,
        aiEnhanced: true,
        aiMode: "local",
      }),
    );
  });

  it("marks voice recordings distinctly and implies attachment", () => {
    const json = serializeAccountActivityMetadata({
      hasVoiceMessage: true,
    });
    assert.equal(
      json,
      JSON.stringify({
        hasAttachment: true,
        hasVoiceMessage: true,
      }),
    );
    assert.deepEqual(parseAccountActivityMetadata(json), {
      hasAttachment: true,
      hasVoiceMessage: true,
    });
  });

  it("parses stored JSON and rejects junk", () => {
    const parsed = parseAccountActivityMetadata(
      '{"hasAttachment":true,"maxReads":1,"bogus":true}',
    );
    assert.deepEqual(parsed, { hasAttachment: true, maxReads: 1 });
    assert.equal(parseAccountActivityMetadata("not-json"), null);
    assert.equal(parseAccountActivityMetadata(null), null);
  });
});
