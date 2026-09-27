import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMeetingStructuredHint,
  tryExtractMeetingRecipientAndTopic,
} from "./meetingRequestStructuredHint";

describe("tryExtractMeetingRecipientAndTopic", () => {
  it("parses set up time … regarding …", () => {
    const r = tryExtractMeetingRecipientAndTopic(
      "set up time with Prof. Peter Ryan regarding the grant proposal"
    );
    assert.equal(r?.recipient, "Prof. Peter Ryan");
    assert.equal(r?.topic, "the grant proposal");
  });

  it("parses ask … if … about …", () => {
    const r = tryExtractMeetingRecipientAndTopic(
      "ask Peter Ryan if we can meet next week about the final submission"
    );
    assert.equal(r?.recipient, "Peter Ryan");
    assert.equal(r?.topic, "the final submission");
  });

  it("parses need a short meeting with … for …", () => {
    const r = tryExtractMeetingRecipientAndTopic(
      "need a short meeting with Professor Ryan for grant proposal submission"
    );
    assert.equal(r?.recipient, "Professor Ryan");
    assert.equal(r?.topic, "grant proposal submission");
  });

  it("parses email … to discuss …", () => {
    const r = tryExtractMeetingRecipientAndTopic(
      "email Prof. Peter Ryan to discuss submitting the proposal"
    );
    assert.equal(r?.recipient, "Prof. Peter Ryan");
    assert.equal(r?.topic, "submitting the proposal");
  });

  it("returns null when topic is missing (ambiguous ask-for-meeting)", () => {
    assert.equal(
      tryExtractMeetingRecipientAndTopic(
        "can you write to Prof. Ryan and ask for a meeting?"
      ),
      null
    );
  });

  it("parses request a meeting with … about …", () => {
    const r = tryExtractMeetingRecipientAndTopic(
      "Request a meeting with Prof. Peter Ryan about the grant proposal"
    );
    assert.equal(r?.recipient, "Prof. Peter Ryan");
    assert.equal(r?.topic, "the grant proposal");
  });
});

describe("buildMeetingStructuredHint", () => {
  it("is empty when extraction fails", () => {
    assert.equal(
      buildMeetingStructuredHint("can you write to Prof. Ryan and ask for a meeting?"),
      ""
    );
  });

  it("labels best-effort when extraction succeeds", () => {
    const h = buildMeetingStructuredHint(
      "email Prof. Chen to discuss the Q3 roadmap"
    );
    assert.ok(h.includes("Best-effort cues"));
    assert.ok(h.includes("ignore these lines"));
    assert.ok(h.includes("Prof. Chen"));
    assert.ok(h.includes("the Q3 roadmap"));
  });
});
