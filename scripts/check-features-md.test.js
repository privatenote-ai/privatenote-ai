import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { featuresMdCheck, isCapabilityPath } from "./check-features-md.mjs";

describe("isCapabilityPath", () => {
  it("flags composer, plans, and MCP", () => {
    assert.equal(isCapabilityPath("client/src/components/note/CreateNote.tsx"), true);
    assert.equal(isCapabilityPath("shared/planCatalog.ts"), true);
    assert.equal(isCapabilityPath("packages/privatenote-mcp/src/index.ts"), true);
    assert.equal(isCapabilityPath("client/src/pages/AuthSignIn.tsx"), true);
  });

  it("ignores tests, blog locale, and marketing copy", () => {
    assert.equal(isCapabilityPath("shared/planCatalog.test.ts"), false);
    assert.equal(isCapabilityPath("client/src/components/note/promptTemplates.test.ts"), false);
    assert.equal(isCapabilityPath("packages/privatenote-mcp/tests/createPrivateNote.test.ts"), false);
    assert.equal(isCapabilityPath("client/src/components/blog/locale/oneTimeSecretLinks.en.ts"), false);
    assert.equal(isCapabilityPath("client/src/index.css"), false);
    assert.equal(isCapabilityPath("README.md"), false);
  });
});

describe("featuresMdCheck", () => {
  it("requires FEATURES.md when a capability file changes", () => {
    const result = featuresMdCheck(["client/src/components/note/NoteSettingsPanel.tsx"]);
    assert.equal(result.required, true);
    assert.deepEqual(result.capabilityFiles, [
      "client/src/components/note/NoteSettingsPanel.tsx",
    ]);
  });

  it("passes when FEATURES.md is in the same diff", () => {
    const result = featuresMdCheck([
      "client/src/components/note/NoteSettingsPanel.tsx",
      "FEATURES.md",
    ]);
    assert.equal(result.required, false);
    assert.equal(result.catalogUpdated, true);
  });

  it("passes when only non-capability files change", () => {
    const result = featuresMdCheck(["client/src/index.css", "README.md"]);
    assert.equal(result.required, false);
    assert.deepEqual(result.capabilityFiles, []);
  });
});
