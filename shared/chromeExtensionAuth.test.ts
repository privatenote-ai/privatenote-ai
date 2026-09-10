import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeAuthReturnTo } from "./sanitizeAuthReturnTo.ts";
import {
  CHROME_EXTENSION_CONNECTED_PATH,
  chromeExtensionSignInUrl,
} from "./chromeExtensionAuth.ts";

describe("chrome extension auth helpers", () => {
  it("uses a same-site returnTo the auth sanitizer accepts", () => {
    assert.equal(sanitizeAuthReturnTo(CHROME_EXTENSION_CONNECTED_PATH), CHROME_EXTENSION_CONNECTED_PATH);
  });

  it("builds a sign-in URL that returns to the connected page", () => {
    assert.equal(
      chromeExtensionSignInUrl("https://privatenote.ai"),
      "https://privatenote.ai/auth/sign-in?returnTo=%2Fextension%2Fconnected",
    );
  });
});
