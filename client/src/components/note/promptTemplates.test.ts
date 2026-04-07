import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  cleanOutput,
  validateLocalLlmOutput,
  classifyAskAnythingIntent,
} from "./promptTemplates";

describe("cleanOutput", () => {
  it("strips prelude when a substantive second paragraph exists", () => {
    const t =
      "Sure.\n\nHi Alex, thanks for your help on the release. I really appreciated it.";
    assert.equal(
      cleanOutput(t),
      "Hi Alex, thanks for your help on the release. I really appreciated it."
    );
  });

  it("strips markdown fences wrapping the whole reply", () => {
    const t = "```\nHello team,\nReminder: review is at 10am.\n```";
    assert.equal(cleanOutput(t), "Hello team,\nReminder: review is at 10am.");
  });

  it("does not strip a single-line note starting with Sure", () => {
    const t = "Sure, I can send the file by Friday.";
    assert.equal(cleanOutput(t), t);
  });
});

describe("classifyAskAnythingIntent", () => {
  it("detects list intent", () => {
    assert.equal(
      classifyAskAnythingIntent("Give me bullet points for the agenda"),
      "list"
    );
  });

  it("detects explain intent", () => {
    assert.equal(classifyAskAnythingIntent("What is a polite way to decline?"), "explain");
  });
});

describe("validateLocalLlmOutput", () => {
  it("flags placeholder braces", () => {
    const r = validateLocalLlmOutput("Hi {{name}}, thanks.", {
      enhancementType: "ask",
      modelTier: "small",
      userRequest: "thank Pat",
    });
    assert.equal(r.ok, false);
    assert.ok(r.issues.includes("placeholder_braces"));
  });

  it("flags missing meeting recipient when structured parse succeeds", () => {
    const r = validateLocalLlmOutput("Hello, I would like to schedule a meeting.", {
      enhancementType: "ask",
      modelTier: "small",
      userRequest: "meeting with Dr. Lee about the budget",
      templateId: "meeting-request",
    });
    assert.equal(r.ok, false);
    assert.ok(r.issues.includes("meeting_recipient_missing"));
  });
});
