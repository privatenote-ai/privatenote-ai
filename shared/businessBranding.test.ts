import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BRANDING_COMPANY_NAME_MAX,
  BRANDING_LOGO_URL_MAX,
  brandingIsEmpty,
  parseBrandingAccentColor,
  parseBrandingLogoUrl,
  parseBusinessBrandingInput,
  parseStoredRevealBranding,
  toRevealBranding,
} from "./businessBranding";

const allowed = { revealBrandingAllowed: true };
const denied = { revealBrandingAllowed: false };

describe("parseBusinessBrandingInput", () => {
  it("rejects an unentitled account before validating any field", () => {
    // A malformed payload must still report premium_required, otherwise the
    // error code leaks which fields the feature accepts.
    const result = parseBusinessBrandingInput({ accentColor: "not-a-colour" }, denied);
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.code, "premium_required");
    assert.equal(result.ok === false && result.status, 403);
  });

  it("fails closed when the entitlement context is omitted", () => {
    const result = parseBusinessBrandingInput({ companyName: "Acme" });
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.code, "premium_required");
  });

  it("accepts a full branding payload for an entitled account", () => {
    const result = parseBusinessBrandingInput(
      {
        companyName: "passwords.lu",
        senderName: "Marjan",
        logoUrl: "https://passwords.lu/logo.svg",
        accentColor: "#2563EB",
      },
      allowed,
    );
    assert.equal(result.ok, true);
    assert.deepEqual(result.ok === true && result.branding, {
      companyName: "passwords.lu",
      senderName: "Marjan",
      logoUrl: "https://passwords.lu/logo.svg",
      accentColor: "#2563eb",
    });
  });

  it("treats an empty payload as fully unconfigured", () => {
    const result = parseBusinessBrandingInput({}, allowed);
    assert.equal(result.ok, true);
    assert.equal(result.ok === true && brandingIsEmpty(result.branding), true);
  });

  it("normalizes whitespace and blank strings in names", () => {
    const result = parseBusinessBrandingInput(
      { companyName: "  Acme   Corp  ", senderName: "   " },
      allowed,
    );
    assert.equal(result.ok, true);
    assert.equal(result.ok === true && result.branding.companyName, "Acme Corp");
    assert.equal(result.ok === true && result.branding.senderName, null);
  });

  it("rejects names carrying control characters", () => {
    const result = parseBusinessBrandingInput({ companyName: "Acme\u0000Corp" }, allowed);
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.code, "invalid_company_name");
    assert.equal(result.ok === false && result.status, 400);
  });

  it("rejects an over-long company name", () => {
    const result = parseBusinessBrandingInput(
      { companyName: "a".repeat(BRANDING_COMPANY_NAME_MAX + 1) },
      allowed,
    );
    assert.equal(result.ok, false);
    assert.equal(result.ok === false && result.code, "invalid_company_name");
  });

  it("reports the offending field for a bad logo and accent", () => {
    const badLogo = parseBusinessBrandingInput({ logoUrl: "javascript:alert(1)" }, allowed);
    assert.equal(badLogo.ok === false && badLogo.code, "invalid_logo_url");

    const badAccent = parseBusinessBrandingInput({ accentColor: "red" }, allowed);
    assert.equal(badAccent.ok === false && badAccent.code, "invalid_accent_color");
  });
});

describe("parseBrandingLogoUrl", () => {
  it("accepts an absolute https URL", () => {
    assert.deepEqual(parseBrandingLogoUrl("https://passwords.lu/logo.png"), {
      ok: true,
      value: "https://passwords.lu/logo.png",
    });
  });

  it("treats omitted and blank values as unset", () => {
    for (const raw of [undefined, null, "", "   "]) {
      assert.deepEqual(parseBrandingLogoUrl(raw), { ok: true, value: null });
    }
  });

  it("rejects non-https schemes that could turn the image slot into a payload", () => {
    for (const raw of [
      "javascript:alert(1)",
      "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=",
      "http://passwords.lu/logo.png",
      "//passwords.lu/logo.png",
      "/local/logo.png",
      "logo.png",
    ]) {
      assert.equal(parseBrandingLogoUrl(raw).ok, false, `expected ${raw} to be rejected`);
    }
  });

  it("rejects embedded credentials that would be echoed to recipients", () => {
    assert.equal(parseBrandingLogoUrl("https://user:pass@passwords.lu/logo.png").ok, false);
  });

  it("rejects hostnames that are not publicly resolvable names", () => {
    assert.equal(parseBrandingLogoUrl("https://localhost/logo.png").ok, false);
  });

  it("rejects an over-long URL", () => {
    const long = `https://passwords.lu/${"a".repeat(BRANDING_LOGO_URL_MAX)}.png`;
    assert.equal(parseBrandingLogoUrl(long).ok, false);
  });
});

describe("parseBrandingAccentColor", () => {
  it("accepts three and six digit hex, normalized to lowercase", () => {
    assert.deepEqual(parseBrandingAccentColor("#ABC"), { ok: true, value: "#abc" });
    assert.deepEqual(parseBrandingAccentColor("#2563EB"), { ok: true, value: "#2563eb" });
  });

  it("treats omitted and blank values as unset", () => {
    for (const raw of [undefined, null, "", "  "]) {
      assert.deepEqual(parseBrandingAccentColor(raw), { ok: true, value: null });
    }
  });

  it("rejects anything that could carry extra CSS declarations", () => {
    for (const raw of [
      "red",
      "rgb(1,2,3)",
      "#2563eb; background: url(https://evil.example/pixel)",
      "#12345",
      "#gggggg",
      "var(--x)",
      "url(https://evil.example/x)",
    ]) {
      assert.equal(parseBrandingAccentColor(raw).ok, false, `expected ${raw} to be rejected`);
    }
  });
});

describe("toRevealBranding", () => {
  it("omits empty fields rather than sending nulls", () => {
    const wire = toRevealBranding({
      companyName: "passwords.lu",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
    });
    assert.deepEqual(wire, { companyName: "passwords.lu", accentColor: "#2563eb" });
  });

  it("returns undefined when nothing would render", () => {
    assert.equal(
      toRevealBranding({
        companyName: null,
        senderName: null,
        logoUrl: null,
        accentColor: null,
      }),
      undefined,
    );
    assert.equal(toRevealBranding(null), undefined);
  });
});

describe("parseStoredRevealBranding", () => {
  it("round-trips a valid stored snapshot", () => {
    assert.deepEqual(
      parseStoredRevealBranding({
        companyName: "passwords.lu",
        logoUrl: "https://passwords.lu/logo.svg",
        accentColor: "#2563eb",
      }),
      {
        companyName: "passwords.lu",
        logoUrl: "https://passwords.lu/logo.svg",
        accentColor: "#2563eb",
      },
    );
  });

  it("drops individual unsafe fields instead of failing the whole reveal", () => {
    // A cosmetic problem must never deny the recipient access to the secret.
    const wire = parseStoredRevealBranding({
      companyName: "passwords.lu",
      logoUrl: "javascript:alert(1)",
      accentColor: "red",
    });
    assert.deepEqual(wire, { companyName: "passwords.lu" });
  });

  it("ignores non-object payloads", () => {
    for (const raw of [undefined, null, "x", 5, [], true]) {
      assert.equal(parseStoredRevealBranding(raw), undefined);
    }
  });
});
