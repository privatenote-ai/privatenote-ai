import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  GUIDED_WRITING_PLACEHOLDER_LABELS,
  GUIDED_WRITING_TEMPLATES,
  filterGuidedWritingTemplateOptions,
  getAllGuidedWritingTemplateIds,
  getLocalFallbackTemplateOptions,
  getStandardGuidedWritingBuckets,
  listUnresolvedGuidedPlaceholderLabelsInNote,
  noteHasUnresolvedGuidedPlaceholders,
  renderGuidedWritingTemplateText,
} from "./localFallbackTemplates";

describe("guided writing templates", () => {
  it("falls back to ask-anything for an invalid template id", () => {
    const unknown = getLocalFallbackTemplateOptions("unknown-id", "2-3");
    const askAnything = getLocalFallbackTemplateOptions("ask-anything", "2-3");
    assert.deepEqual(unknown, askAnything);
  });

  it("maps natural-length (auto) to the 4–6 starter bucket for offline templates", () => {
    const id = "thank-you" as const;
    const auto = getLocalFallbackTemplateOptions(id, "auto");
    const mid = getLocalFallbackTemplateOptions(id, "4-6");
    assert.deepEqual(auto, mid);
  });

  it("renders standardized placeholder labels for users", () => {
    const rendered = renderGuidedWritingTemplateText(
      "Hi {{recipientName}}, thank you for {{supportType}}.",
      "en",
    );
    assert.equal(rendered, "Hi [Recipient name], thank you for [Help, gift, or support].");
  });

  it("defines every configured template id in the dataset", () => {
    for (const id of getAllGuidedWritingTemplateIds()) {
      assert.ok(id in GUIDED_WRITING_TEMPLATES, `Missing dataset entry for ${id}`);
    }
  });

  it("defines every sentence bucket for every template id", () => {
    for (const id of getAllGuidedWritingTemplateIds()) {
      for (const bucket of getStandardGuidedWritingBuckets()) {
        const options = GUIDED_WRITING_TEMPLATES[id][bucket];
        assert.ok(Array.isArray(options), `Missing bucket ${bucket} for ${id}`);
        assert.ok(options.length >= 2, `Expected at least 2 options for ${id}/${bucket}`);
      }
    }
  });

  it("detects unresolved bracket placeholders for a language", () => {
    assert.equal(noteHasUnresolvedGuidedPlaceholders("Hello [Recipient name], thanks.", "en"), true);
    assert.equal(noteHasUnresolvedGuidedPlaceholders("Hello Alex, thanks.", "en"), false);
    assert.equal(listUnresolvedGuidedPlaceholderLabelsInNote("[Recipient name] and [Topic]", "en").length, 2);
  });

  it("filters offline starters by metadata", () => {
    const opts = getLocalFallbackTemplateOptions("ask-anything", "1-2", "en");
    const warmOnly = filterGuidedWritingTemplateOptions(opts, { tone: "warm" });
    assert.ok(warmOnly.length >= 1);
    assert.ok(warmOnly.every((o) => o.tone === "warm"));
  });

  it("keeps placeholders declared and renderable", () => {
    for (const id of getAllGuidedWritingTemplateIds()) {
      for (const bucket of getStandardGuidedWritingBuckets()) {
        for (const option of GUIDED_WRITING_TEMPLATES[id][bucket]) {
          for (const placeholder of option.placeholders) {
            assert.ok(
              placeholder in GUIDED_WRITING_PLACEHOLDER_LABELS,
              `Unknown placeholder ${placeholder} in ${id}/${bucket}/${option.label}`
            );
            assert.match(
              option.textTemplate,
              new RegExp(`\\{\\{${placeholder}\\}\\}`),
              `Placeholder ${placeholder} missing in template text for ${id}/${bucket}/${option.label}`
            );
          }
        }
      }
    }
  });
});
