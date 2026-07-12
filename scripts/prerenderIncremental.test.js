import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  affectedRoutesFromChangedFiles,
  expandBasePaths,
  shouldFullPrerender,
} from "./prerenderIncremental.js";

describe("prerender incremental route selection", () => {
  it("expands /about to English and localized marketing paths", () => {
    const routes = expandBasePaths(["/about"]);
    assert.ok(routes.has("/about"));
    assert.ok(routes.has("/de/about"));
    assert.ok(!routes.has("/blog"));
  });

  it("treats Navbar changes as full prerender", () => {
    assert.equal(shouldFullPrerender(["client/src/components/Navbar.tsx"]), true);
  });

  it("maps About page changes to about routes only", () => {
    const affected = affectedRoutesFromChangedFiles(["client/src/pages/About.tsx"]);
    assert.ok(affected);
    assert.ok(affected.has("/about"));
    assert.ok(affected.has("/fr/about"));
    assert.equal(affected.has("/blog"), false);
  });

  it("maps blog post source changes to all blog routes", () => {
    const affected = affectedRoutesFromChangedFiles(["client/src/utils/staticBlogPosts.ts"]);
    assert.ok(affected);
    assert.ok(affected.has("/blog"));
    assert.ok(affected.has("/blog/privacy-tools"));
    assert.ok(affected.has("/de/blog/datenschutz-tools"));
  });

  it("ignores app-only note component changes", () => {
    const affected = affectedRoutesFromChangedFiles(["client/src/components/note/NoteDisplay.tsx"]);
    assert.ok(affected);
    assert.equal(affected.size, 0);
  });

  it("uses full prerender for unmatched shared marketing changes", () => {
    assert.equal(
      affectedRoutesFromChangedFiles(["client/src/components/SomeNewSharedWidget.tsx"]),
      null,
    );
  });
});
