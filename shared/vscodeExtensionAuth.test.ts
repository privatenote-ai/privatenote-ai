import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  VSCODE_EXTENSION_ID,
  buildVscodeExtensionAuthRedirectUri,
  isAllowedChromeIdentityRedirectUri,
  isAllowedPluginRedirectUri,
  isAllowedVscodeExtensionRedirectUri,
  isVscodeExtensionRedirectUriSafeForBrowser,
  parseVscodeLoginRecord,
  pkceS256Challenge,
  pluginClientForRedirectUri,
  randomPkceVerifier,
} from "./vscodeExtensionAuth.ts";

describe("vscode extension redirect URIs", () => {
  it("accepts vscode and cursor handlers for this extension only", () => {
    assert.equal(
      isAllowedVscodeExtensionRedirectUri(`vscode://${VSCODE_EXTENSION_ID}/auth`),
      true,
    );
    assert.equal(
      isAllowedVscodeExtensionRedirectUri(`cursor://${VSCODE_EXTENSION_ID}/auth`),
      true,
    );
    assert.equal(isAllowedVscodeExtensionRedirectUri("https://evil.example/auth"), false);
    assert.equal(
      isAllowedVscodeExtensionRedirectUri(`vscode://${VSCODE_EXTENSION_ID}/auth?code=1`),
      false,
    );
    assert.equal(isAllowedVscodeExtensionRedirectUri(`vscode://Other.ext/auth`), false);
  });

  it("allows the browser to follow only the callback with code+state", () => {
    const redirect = buildVscodeExtensionAuthRedirectUri(
      `cursor://${VSCODE_EXTENSION_ID}/auth`,
      { code: "abc", state: "xyz" },
    );
    assert.equal(isVscodeExtensionRedirectUriSafeForBrowser(redirect), true);
    assert.equal(
      isVscodeExtensionRedirectUriSafeForBrowser(`https://privatenote.ai/?code=abc`),
      false,
    );
    const chromeCb = buildVscodeExtensionAuthRedirectUri(
      "https://abcdefghijklmnopabcdefghijklmnop.chromiumapp.org/auth",
      { code: "abc", state: "xyz" },
    );
    assert.equal(isVscodeExtensionRedirectUriSafeForBrowser(chromeCb), true);
  });

  it("round-trips PKCE S256", async () => {
    const verifier = randomPkceVerifier();
    const challenge = await pkceS256Challenge(verifier);
    assert.equal(challenge, await pkceS256Challenge(verifier));
    assert.match(challenge, /^[A-Za-z0-9_-]{43}$/);
  });

  it("rejects malformed login records", () => {
    assert.equal(parseVscodeLoginRecord({ v: 1 }), null);
    const challenge = "a".repeat(43);
    const parsed = parseVscodeLoginRecord({
      v: 1,
      codeChallenge: challenge,
      redirectUri: `vscode://${VSCODE_EXTENSION_ID}/auth`,
      status: "pending",
    });
    assert.equal(parsed?.status, "pending");
    const parsedChrome = parseVscodeLoginRecord({
      v: 1,
      codeChallenge: challenge,
      redirectUri: "https://abcdefghijklmnopabcdefghijklmnop.chromiumapp.org/auth",
      status: "pending",
    });
    assert.equal(parsedChrome?.status, "pending");
  });

  it("accepts Chrome identity chromiumapp.org redirects", () => {
    const chromeRedirect = "https://abcdefghijklmnopabcdefghijklmnop.chromiumapp.org/auth";
    assert.equal(isAllowedChromeIdentityRedirectUri(`${chromeRedirect}/`), true);
    assert.equal(isAllowedPluginRedirectUri(chromeRedirect), true);
    assert.equal(pluginClientForRedirectUri(chromeRedirect), "chrome");
    assert.equal(
      isAllowedChromeIdentityRedirectUri("https://evil.example.chromiumapp.org/auth"),
      false,
    );
  });
});
