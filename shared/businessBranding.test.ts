import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BRANDING_BANNER_MAX_BYTES,
  BRANDING_BANNER_RECOMMENDED_PX,
  BRANDING_BANNER_SIZE_LABEL,
  BRANDING_CARD_BANNER_RECOMMENDED_PX,
  BRANDING_COMPANY_NAME_MAX,
  BRANDING_LOGO_URL_MAX,
  brandingBannerStyle,
  brandingCardAxis,
  brandingCardPercentFromPosition,
  brandingCardPositionFromPercent,
  brandingCardMarkUrl,
  brandingCtaStyle,
  brandingNoteTextBorderColor,
  brandingHeroStyle,
  brandingHeroUsesLightText,
  brandingIsEmpty,
  brandingPageBackground,
  brandingFilterBlobs,
  brandingOverlayOpacity,
  brandingPortalLayout,
  brandingShowsBanner,
  brandingUsesPortalSurface,
  brandingChromeControl,
  brandingChromeInk,
  brandingChromeUsesLightText,
  brandingLogoTileTone,
  brandingLogoIsSolo,
  brandingRevealLogoClassName,
  parseBrandingAccentColor,
  parseBrandingLogoUrl,
  parseBusinessBrandingInput,
  parseStoredRevealBranding,
  toRevealBranding,
  applyOpenedNoteBranding,
  parseOpenedNoteBrandingSettings,
  stringifyOpenedNoteBrandingSettings,
  DEFAULT_OPENED_NOTE_BRANDING,
  brandingPageMode,
  brandingBackgroundStyleForPage,
  brandingMobileLane,
  brandingIsPrivateNoteCanvas,
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
        senderRole: "Security Operations",
        trustMessage: "Verify unexpected requests through your usual channel.",
        logoUrl: "https://passwords.lu/logo.svg",
        bannerUrl: "https://passwords.lu/banner.webp",
        accentColor: "#2563EB",
        backgroundColor: "#FFFFFF",
        textColor: "#111827",
        backgroundStyle: "banner",
      },
      allowed,
    );
    assert.equal(result.ok, true);
    assert.deepEqual(result.ok === true && result.branding, {
      companyName: "passwords.lu",
      senderName: "Marjan",
      senderRole: "Security Operations",
      trustMessage: "Verify unexpected requests through your usual channel.",
      logoUrl: "https://passwords.lu/logo.svg",
      bannerUrl: "https://passwords.lu/banner.webp",
      cardBannerUrl: null,
      accentColor: "#2563eb",
      backgroundColor: "#ffffff",
      textColor: "#111827",
      backgroundStyle: "banner",
      cardPosition: "center",
      cardPositionMobile: "center",
      cardImage: "logo",
      backgroundFit: "fill",
      overlay: "light",
      focalX: 50,
      focalY: 50,
      backgroundZoom: 100,
      cardX: 50,
      cardY: 50,
      cardXMobile: 50,
      cardYMobile: 50,
      showCompanyName: true,
      showSenderName: true,
      showSenderRole: true,
      showTrustMessage: true,
      showBrandingAfterReveal: false,
      openedBackground: "neutral",
      openedShowLogo: true,
      openedShowSenderName: true,
      openedShowCompanyName: true,
      openedShowTrustMessage: true,
      openedBannerUrl: null,
      openedAccentColor: null,
      openedTextColor: null,
      openedBackgroundColor: null,
      openedBackgroundZoom: null,
      noteBorderColor: null,
    });
  });

  it("treats an empty payload as fully unconfigured", () => {
    const result = parseBusinessBrandingInput({}, allowed);
    assert.equal(result.ok, true);
    assert.equal(result.ok === true && brandingIsEmpty(result.branding), true);
  });

  it("omits hidden identity lines from the reveal snapshot", () => {
    const result = parseBusinessBrandingInput(
      {
        companyName: "Acme",
        senderName: "Ada",
        senderRole: "IT Officer",
        trustMessage: "We send secrets here.",
        accentColor: "#2563eb",
        showCompanyName: false,
        showSenderName: true,
        showSenderRole: false,
        showTrustMessage: false,
      },
      allowed,
    );
    assert.equal(result.ok, true);
    const snapshotted = result.ok === true ? toRevealBranding(result.branding) : undefined;
    assert.equal(snapshotted?.senderName, "Ada");
    assert.equal(snapshotted?.companyName, undefined);
    assert.equal(snapshotted?.senderRole, undefined);
    assert.equal(snapshotted?.trustMessage, undefined);
  });

  it("snapshots a note-text border colour even when after-open branding is off", () => {
    const result = parseBusinessBrandingInput(
      {
        accentColor: "#2563eb",
        noteBorderColor: "#e11d48",
      },
      allowed,
    );
    assert.equal(result.ok, true);
    const snapshotted = result.ok === true ? toRevealBranding(result.branding) : undefined;
    assert.equal(snapshotted?.noteBorderColor, "#e11d48");
    assert.equal(brandingNoteTextBorderColor(snapshotted), "#e11d48");
    assert.equal(brandingNoteTextBorderColor({ accentColor: "#2563eb" }), "#2563eb");
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

    const badBackground = parseBusinessBrandingInput({ backgroundColor: "white" }, allowed);
    assert.equal(badBackground.ok === false && badBackground.code, "invalid_background_color");

    const badText = parseBusinessBrandingInput({ textColor: "rgb(0,0,0)" }, allowed);
    assert.equal(badText.ok === false && badText.code, "invalid_text_color");
  });

  it("accepts Default page filters and rejects unknown background styles", () => {
    for (const style of ["neutral", "gradient", "vignette", "glow", "mesh", "banner"] as const) {
      const result = parseBusinessBrandingInput(
        { accentColor: "#2563eb", backgroundStyle: style },
        allowed,
      );
      assert.equal(result.ok === true && result.branding.backgroundStyle, style);
    }
    const bad = parseBusinessBrandingInput({ backgroundStyle: "blur" }, allowed);
    assert.equal(bad.ok === false && bad.code, "invalid_background_style");
  });

  it("accepts sender layout controls and rejects CSS-carrying overlay values", () => {
    const result = parseBusinessBrandingInput(
      {
        accentColor: "#2563eb",
        backgroundStyle: "banner",
        bannerUrl: "https://passwords.lu/banner.webp",
        cardPosition: "left",
        backgroundFit: "fit",
        overlay: "medium",
        focalX: 20,
        focalY: 80,
      },
      allowed,
    );
    assert.equal(result.ok, true);
    assert.equal(result.ok === true && result.branding.cardPosition, "left");
    assert.equal(result.ok === true && result.branding.cardPositionMobile, "center");
    assert.equal(result.ok === true && result.branding.backgroundFit, "fit");
    assert.equal(result.ok === true && result.branding.overlay, "medium");
    assert.equal(result.ok === true && result.branding.focalX, 20);
    assert.equal(result.ok === true && result.branding.focalY, 80);
    const zoomed = parseBusinessBrandingInput(
      { backgroundZoom: 140, accentColor: "#2563eb" },
      allowed,
    );
    assert.equal(zoomed.ok === true && zoomed.branding.backgroundZoom, 140);
    const badZoom = parseBusinessBrandingInput({ backgroundZoom: 40 }, allowed);
    assert.equal(badZoom.ok === false && badZoom.code, "invalid_background_zoom");

    const badOverlay = parseBusinessBrandingInput({ overlay: "rgba(0,0,0,0.8)" }, allowed);
    assert.equal(badOverlay.ok === false && badOverlay.code, "invalid_overlay");
    const badFocal = parseBusinessBrandingInput({ focalX: 150 }, allowed);
    assert.equal(badFocal.ok === false && badFocal.code, "invalid_image_position");
    const corners = parseBusinessBrandingInput(
      { cardPosition: "top-left", cardPositionMobile: "bottom" },
      allowed,
    );
    assert.equal(corners.ok === true && corners.branding.cardPosition, "top-left");
    assert.equal(corners.ok === true && corners.branding.cardPositionMobile, "bottom");
    const badPosition = parseBusinessBrandingInput({ cardPosition: "flex-start" }, allowed);
    assert.equal(badPosition.ok === false && badPosition.code, "invalid_card_position");
    const cardBanner = parseBusinessBrandingInput({ cardImage: "banner" }, allowed);
    assert.equal(cardBanner.ok === true && cardBanner.branding.cardImage, "banner");
    const cardBannerFile = "abcdefghijklmnopqrstuvwxyz12.png";
    const cardBannerPath = `/api/auth/branding/card-banner/${cardBannerFile}`;
    const dedicatedBanner = parseBusinessBrandingInput(
      { cardImage: "banner", cardBannerUrl: cardBannerPath },
      allowed,
    );
    assert.equal(dedicatedBanner.ok === true && dedicatedBanner.branding.cardBannerUrl, cardBannerPath);
    const badCardImage = parseBusinessBrandingInput({ cardImage: "hero" }, allowed);
    assert.equal(badCardImage.ok === false && badCardImage.code, "invalid_card_image");
  });
});

describe("parseBrandingLogoUrl", () => {
  it("accepts an absolute https URL", () => {
    assert.deepEqual(parseBrandingLogoUrl("https://passwords.lu/logo.png"), {
      ok: true,
      value: "https://passwords.lu/logo.png",
    });
  });

  it("accepts hosted same-origin paths and rewrites worker URLs to those paths", () => {
    const file = "abcdefghijklmnopqrstuvwxyz12.png";
    const path = `/api/auth/branding/logo/${file}`;
    assert.deepEqual(parseBrandingLogoUrl(path), { ok: true, value: path });
    assert.deepEqual(
      parseBrandingLogoUrl(`https://privatenote-api.marjan-skrobot.workers.dev${path}`),
      { ok: true, value: path },
    );
    const cardBannerPath = `/api/auth/branding/card-banner/${file}`;
    assert.deepEqual(parseBrandingLogoUrl(cardBannerPath), { ok: true, value: cardBannerPath });
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
  it("accepts three and six digit hex, normalized to lowercase six-digit", () => {
    assert.deepEqual(parseBrandingAccentColor("#ABC"), { ok: true, value: "#aabbcc" });
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
      backgroundColor: "#ffffff",
      textColor: "#111827",
    });
    assert.deepEqual(wire, {
      companyName: "passwords.lu",
      accentColor: "#2563eb",
      backgroundColor: "#ffffff",
      textColor: "#111827",
    });
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
  it("rewrites a hosted workers.dev logo onto the public path", () => {
    const file = "abcdefghijklmnopqrstuvwxyz12.png";
    const path = `/api/auth/branding/logo/${file}`;
    assert.deepEqual(
      parseStoredRevealBranding({
        trustMessage: "Call us if this looks unexpected.",
        logoUrl: `https://privatenote-api.marjan-skrobot.workers.dev${path}`,
        accentColor: "#2563eb",
      }),
      {
        trustMessage: "Call us if this looks unexpected.",
        logoUrl: path,
        accentColor: "#2563eb",
      },
    );
  });

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

  it("round-trips background and text colours", () => {
    assert.deepEqual(
      parseStoredRevealBranding({
        accentColor: "#ffffff",
        backgroundColor: "#0f172a",
        textColor: "#111827",
      }),
      {
        accentColor: "#ffffff",
        backgroundColor: "#0f172a",
        textColor: "#111827",
      },
    );
  });

  it("ignores non-object payloads", () => {
    for (const raw of [undefined, null, "x", 5, [], true]) {
      assert.equal(parseStoredRevealBranding(raw), undefined);
    }
  });
});

describe("brandingCtaStyle", () => {
  it("uses configured text colour when it contrasts with the accent", () => {
    assert.deepEqual(brandingCtaStyle({ accentColor: "#2563eb", textColor: "#ffffff" }), {
      backgroundColor: "#2563eb",
      color: "#ffffff",
    });
  });

  it("does not render a white-on-white reveal button", () => {
    const style = brandingCtaStyle({ accentColor: "#ffffff" });
    assert.equal(style?.backgroundColor, "#ffffff");
    assert.equal(style?.color, "#111827");
    assert.equal(style?.border, "1px solid #111827");
  });

  it("replaces a text colour that disappears on the accent fill", () => {
    const style = brandingCtaStyle({ accentColor: "#ffffff", textColor: "#ffffff" });
    assert.equal(style?.color, "#111827");
  });

  it("keeps dark text on a pale accent such as #f8fafc", () => {
    const style = brandingCtaStyle({ accentColor: "#f8fafc", textColor: "#ffffff" });
    assert.equal(style?.color, "#111827");
  });
});

describe("brandingHeroStyle", () => {
  it("does not wrap the reveal page in a white card", () => {
    assert.equal(brandingHeroStyle({ backgroundColor: "#ffffff", accentColor: "#e11d48" }), undefined);
  });

  it("never paints the banner behind the reveal copy", () => {
    const style = brandingHeroStyle({
      bannerUrl: "https://passwords.lu/banner.webp",
      backgroundStyle: "banner",
      accentColor: "#e11d48",
    });
    assert.equal(style, undefined);
  });

  it("keeps a dark background color and switches the copy to light text", () => {
    const branding = { backgroundColor: "#0f172a", backgroundStyle: "neutral" } as const;
    assert.deepEqual(brandingHeroStyle(branding), { backgroundColor: "#0f172a" });
    assert.equal(brandingHeroUsesLightText(branding), true);
  });

  it("keeps dark copy on a light background color", () => {
    assert.equal(brandingHeroUsesLightText({ backgroundColor: "#f8fafc" }), false);
  });
});

describe("brandingChromeInk", () => {
  it("keeps the PrivateNote mark blue on a white or pale page", () => {
    assert.equal(brandingChromeInk({ backgroundColor: "#ffffff" }), "#0000ff");
    assert.equal(brandingChromeInk({ backgroundColor: "#f8fafc" }), "#0000ff");
    assert.equal(brandingLogoTileTone({ backgroundColor: "#f8fafc" }), "brand");
    assert.equal(brandingChromeUsesLightText({ backgroundColor: "#f8fafc" }), false);
  });

  it("flips chrome to white when the page matches the logo mark", () => {
    const branding = { backgroundColor: "#0000ff", backgroundStyle: "neutral" } as const;
    assert.equal(brandingChromeInk(branding), "#ffffff");
    assert.equal(brandingLogoTileTone(branding), "inverse");
    assert.equal(brandingChromeUsesLightText(branding), true);
  });

  it("flips chrome to white when the page is the default brand blue", () => {
    const branding = { backgroundColor: "#2563eb", backgroundStyle: "neutral" } as const;
    assert.equal(brandingChromeInk(branding), "#ffffff");
    assert.equal(brandingLogoTileTone(branding), "inverse");
  });

  it("darkens language-picker text and border when they match the page colour", () => {
    const slate = brandingChromeControl({
      backgroundColor: "#e2e8f0",
      backgroundStyle: "neutral",
    });
    assert.equal(slate.color, "#1f2937");
    assert.notEqual(slate.borderColor, "#e5e7eb");
    assert.match(slate.borderColor, /^#111827/i);

    const onInk = brandingChromeControl({
      backgroundColor: "#1f2937",
      backgroundStyle: "neutral",
    });
    assert.equal(onInk.color, "#ffffff");
    assert.match(onInk.borderColor, /255,\s*255,\s*255|#ffffff/i);
  });
});

describe("brandingPageBackground", () => {
  it("uses a custom photograph as a full-page image, not a hero band", () => {
    const branding = {
      bannerUrl: "https://passwords.lu/banner.webp",
      backgroundStyle: "banner",
    } as const;
    assert.deepEqual(brandingPageBackground(branding), {
      kind: "image",
      url: "https://passwords.lu/banner.webp",
    });
    assert.equal(brandingUsesPortalSurface(branding), true);
    assert.equal(brandingChromeUsesLightText(branding), true);
    assert.equal(brandingUsesPortalSurface({ companyName: "Acme", accentColor: "#2563eb" }), true);
  });

  it("ignores leftover Default-page filters and keeps the PrivateNote canvas", () => {
    const branding = {
      accentColor: "#e11d48",
      backgroundStyle: "gradient",
    } as const;
    assert.deepEqual(brandingPageBackground(branding), { kind: "none" });
    assert.equal(brandingUsesPortalSurface(branding), true);
  });

  it("uses page colour only when a leftover filter is still stored", () => {
    const page = brandingPageBackground({
      accentColor: "#2563eb",
      backgroundColor: "#84cc16",
      backgroundStyle: "gradient",
    });
    assert.deepEqual(page, { kind: "color", backgroundColor: "#84cc16" });
  });

  it("keeps filter styles on stored snapshots but does not paint them", () => {
    for (const style of ["gradient", "vignette", "glow", "mesh"] as const) {
      const parsed = parseStoredRevealBranding({
        accentColor: "#2563eb",
        backgroundColor: "#84cc16",
        backgroundStyle: style,
      });
      assert.equal(parsed?.backgroundStyle, style);
      assert.deepEqual(brandingPageBackground(parsed), {
        kind: "color",
        backgroundColor: "#84cc16",
      });
    }
  });

  it("treats vignette, soft glow, and mesh as the page colour", () => {
    for (const style of ["vignette", "glow", "mesh"] as const) {
      assert.deepEqual(
        brandingPageBackground({
          accentColor: "#7c3aed",
          backgroundColor: "#f8fafc",
          backgroundStyle: style,
        }),
        { kind: "color", backgroundColor: "#f8fafc" },
      );
    }
  });

  it("lays out a different number of DOM blobs for wash, glow, and mesh", () => {
    const accent = "#2563eb";
    assert.equal(brandingFilterBlobs("neutral", accent).length, 0);
    assert.equal(brandingFilterBlobs("vignette", accent).length, 0);
    assert.equal(brandingFilterBlobs("gradient", accent).length, 2);
    assert.equal(brandingFilterBlobs("glow", accent).length, 3);
    assert.equal(brandingFilterBlobs("mesh", accent).length, 4);
    const colors = brandingFilterBlobs("mesh", accent).map((blob) => blob.color);
    assert.equal(colors.every((color) => color.startsWith("#2563eb")), true);
  });

});

describe("brandingBannerStyle", () => {
  it("covers and centers the banner in the header band", () => {
    const branding = {
      bannerUrl: "https://passwords.lu/banner.webp",
      backgroundStyle: "banner",
    } as const;
    assert.equal(brandingShowsBanner(branding), true);
    assert.deepEqual(brandingBannerStyle(branding), {
      backgroundImage: "url(https://passwords.lu/banner.webp)",
      backgroundSize: "cover",
      backgroundPosition: "50% 50%",
    });
  });

  it("stays absent unless the banner style is selected", () => {
    const branding = {
      bannerUrl: "https://passwords.lu/banner.webp",
      backgroundStyle: "gradient",
      accentColor: "#e11d48",
    } as const;
    assert.equal(brandingShowsBanner(branding), false);
    assert.equal(brandingBannerStyle(branding), undefined);
  });
});

describe("branding portal layout", () => {
  it("defaults overlay to light (~16%) so photography stays visible", () => {
    assert.equal(brandingOverlayOpacity({ backgroundStyle: "banner" }), 0.16);
    assert.equal(brandingPortalLayout(undefined).overlay, "light");
    assert.equal(brandingPortalLayout(undefined).cardPosition, "center");
    assert.equal(brandingPortalLayout(undefined).cardPositionMobile, "center");
    assert.equal(brandingPortalLayout(undefined).cardImage, "logo");
    assert.equal(brandingPortalLayout(undefined).backgroundZoom, 100);
    assert.deepEqual(brandingCardAxis("top-left"), { x: "left", y: "top" });
    assert.deepEqual(brandingCardAxis("bottom-right"), { x: "right", y: "bottom" });
    assert.deepEqual(brandingCardAxis("left"), { x: "left", y: "middle" });
    assert.deepEqual(brandingCardPercentFromPosition("top-left"), { x: 0, y: 0 });
    assert.deepEqual(brandingCardPercentFromPosition("center"), { x: 50, y: 50 });
    assert.equal(brandingCardPositionFromPercent(12, 8), "top-left");
    assert.equal(brandingCardPositionFromPercent(50, 50), "center");
    assert.equal(brandingCardPositionFromPercent(90, 80), "bottom-right");
    assert.equal(brandingPortalLayout(undefined).cardX, 50);
    assert.equal(brandingPortalLayout({ cardPosition: "left" }).cardX, 0);
    assert.equal(brandingPortalLayout({ cardPosition: "left", cardX: 22 }).cardX, 22);
  });

  it("omits default layout from the note snapshot and keeps non-defaults", () => {
    const defaultsOnly = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
    });
    assert.deepEqual(defaultsOnly, {
      companyName: "Acme",
      accentColor: "#2563eb",
    });

    const custom = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      cardPosition: "left",
      overlay: "dark",
      focalY: 18,
    });
    assert.equal(custom?.cardPosition, "left");
    assert.equal(custom?.overlay, "dark");
    assert.equal(custom?.focalY, 18);
    assert.equal("cardX" in (custom ?? {}), false);

    const freePlace = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      cardX: 22,
      cardY: 70,
    });
    assert.equal(freePlace?.cardX, 22);
    assert.equal(freePlace?.cardY, 70);
    assert.equal("backgroundFit" in (custom ?? {}), false);
    assert.equal("cardPositionMobile" in (custom ?? {}), false);
    assert.equal("cardImage" in (custom ?? {}), false);

    const bannerMark = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      cardImage: "banner",
      cardBannerUrl: "https://acme.example/lockup.png",
    });
    assert.equal(bannerMark?.cardImage, "banner");
    assert.equal(bannerMark?.cardBannerUrl, "https://acme.example/lockup.png");

    const split = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      cardPosition: "left",
      cardPositionMobile: "center",
    });
    assert.equal(split?.cardPosition, "left");
    assert.equal(split?.cardPositionMobile, "center");

    const legacyLeft = brandingPortalLayout({ cardPosition: "left" });
    assert.equal(legacyLeft.cardPosition, "left");
    assert.equal(legacyLeft.cardPositionMobile, "left");
  });

  it("drops a bad overlay on stored notes without denying the reveal", () => {
    const wire = parseStoredRevealBranding({
      companyName: "passwords.lu",
      overlay: "rgba(0,0,0,0.9)",
      cardPosition: "right",
    });
    assert.equal(wire?.companyName, "passwords.lu");
    assert.equal(wire?.cardPosition, "right");
    assert.equal(wire?.overlay, undefined);
  });
});

describe("branding asset sizes", () => {
  it("defines a 16:9 full-page recipient photograph at 1920×1080", () => {
    assert.equal(BRANDING_BANNER_RECOMMENDED_PX.width, 1920);
    assert.equal(BRANDING_BANNER_RECOMMENDED_PX.height, 1080);
    assert.equal(BRANDING_BANNER_RECOMMENDED_PX.width / BRANDING_BANNER_RECOMMENDED_PX.height, 16 / 9);
    assert.equal(BRANDING_BANNER_SIZE_LABEL, "1920×1080");
    assert.equal(BRANDING_BANNER_MAX_BYTES, 3 * 1024 * 1024);
    assert.equal(BRANDING_CARD_BANNER_RECOMMENDED_PX.width, 1200);
    assert.equal(BRANDING_CARD_BANNER_RECOMMENDED_PX.height, 400);
  });
});

describe("opened-note branding", () => {
  it("is off by default and omitted from the snapshot until opted in", () => {
    const settings = parseOpenedNoteBrandingSettings(undefined);
    assert.deepEqual(settings, DEFAULT_OPENED_NOTE_BRANDING);
    const wire = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      showBrandingAfterReveal: false,
    });
    assert.equal(wire?.showBrandingAfterReveal, undefined);
    assert.equal(applyOpenedNoteBranding(wire), undefined);
  });

  it("keeps identity and gate background on the opened page when opted in", () => {
    const wire = toRevealBranding({
      companyName: "Acme",
      senderName: "Ada",
      logoUrl: "https://acme.example/logo.png",
      accentColor: "#2563eb",
      backgroundStyle: "gradient",
      showBrandingAfterReveal: true,
    });
    assert.equal(wire?.showBrandingAfterReveal, true);
    const opened = applyOpenedNoteBranding(wire);
    assert.equal(opened?.companyName, "Acme");
    assert.equal(opened?.senderName, "Ada");
    assert.equal(opened?.logoUrl, "https://acme.example/logo.png");
    assert.equal(opened?.backgroundStyle, "gradient");
    assert.equal(opened?.showBrandingAfterReveal, undefined);
  });

  it("can hide name text and switch the opened background independently", () => {
    const opened = applyOpenedNoteBranding({
      companyName: "Acme",
      senderName: "Ada",
      logoUrl: "https://acme.example/logo.png",
      bannerUrl: "https://acme.example/banner.jpg",
      backgroundStyle: "banner",
      showBrandingAfterReveal: true,
      openedBackground: "neutral",
      openedShowSenderName: false,
      openedShowCompanyName: false,
    });
    assert.equal(opened?.logoUrl, "https://acme.example/logo.png");
    assert.equal(opened?.senderName, undefined);
    assert.equal(opened?.companyName, undefined);
    assert.equal(opened?.backgroundStyle, undefined);
    assert.equal(opened?.bannerUrl, undefined);
    assert.equal(opened?.cardImage, undefined);
  });

  it("hides a card banner after open without dropping the page photograph", () => {
    const opened = applyOpenedNoteBranding({
      bannerUrl: "https://acme.example/banner.jpg",
      backgroundStyle: "banner",
      cardImage: "banner",
      showBrandingAfterReveal: true,
      openedShowLogo: false,
    });
    assert.equal(opened?.cardImage, undefined);
    assert.equal(opened?.bannerUrl, "https://acme.example/banner.jpg");
    assert.equal(opened?.backgroundStyle, "banner");
  });

  it("can use a dedicated opened photograph and Copy Note colour", () => {
    const opened = applyOpenedNoteBranding({
      bannerUrl: "https://acme.example/reveal.jpg",
      backgroundStyle: "banner",
      accentColor: "#2563eb",
      textColor: "#ffffff",
      showBrandingAfterReveal: true,
      openedBackground: "banner",
      openedBannerUrl: "https://acme.example/opened.jpg",
      openedAccentColor: "#111827",
      openedTextColor: "#f8fafc",
    });
    assert.equal(opened?.bannerUrl, "https://acme.example/opened.jpg");
    assert.equal(opened?.backgroundStyle, "banner");
    assert.equal(opened?.accentColor, "#111827");
    assert.equal(opened?.textColor, "#f8fafc");
    assert.equal(opened?.openedBannerUrl, undefined);
    assert.equal(opened?.openedAccentColor, undefined);
  });

  it("does not reuse the reveal photograph when the opened page has no upload", () => {
    const opened = applyOpenedNoteBranding({
      bannerUrl: "https://acme.example/reveal.jpg",
      backgroundStyle: "banner",
      showBrandingAfterReveal: true,
      openedBackground: "banner",
    });
    assert.equal(opened?.bannerUrl, undefined);
    assert.equal(opened?.backgroundStyle, undefined);
  });

  it("scales the opened photograph independently of the reveal page", () => {
    const gate = {
      bannerUrl: "https://acme.example/reveal.jpg",
      backgroundStyle: "banner" as const,
      backgroundZoom: 150,
      showBrandingAfterReveal: true,
      openedBackground: "banner" as const,
      openedBannerUrl: "https://acme.example/opened.jpg",
    };
    // Without its own scale the opened photo keeps inheriting the reveal scale.
    assert.equal(applyOpenedNoteBranding(gate)?.backgroundZoom, 150);
    assert.equal(
      applyOpenedNoteBranding({ ...gate, openedBackgroundZoom: 120 })?.backgroundZoom,
      120,
    );
    assert.equal(
      applyOpenedNoteBranding({ ...gate, openedBackgroundZoom: 120 })?.openedBackgroundZoom,
      undefined,
    );
    // A solid-colour opened page has no photograph to scale.
    assert.equal(
      applyOpenedNoteBranding({
        ...gate,
        openedBackground: "neutral",
        openedBackgroundZoom: 120,
      })?.backgroundZoom,
      150,
    );
  });

  it("keeps the opened scale within range through storage JSON", () => {
    const roundTrip = (backgroundZoom: number | null) =>
      parseOpenedNoteBrandingSettings(
        stringifyOpenedNoteBrandingSettings({
          ...DEFAULT_OPENED_NOTE_BRANDING,
          show: true,
          background: "banner",
          backgroundZoom,
        }),
      ).backgroundZoom;
    assert.equal(roundTrip(140), 140);
    assert.equal(roundTrip(null), null);
    // Out of range and non-integer values fall back to inheriting, not to 100%.
    assert.equal(parseOpenedNoteBrandingSettings({ backgroundZoom: 400 }).backgroundZoom, null);
    assert.equal(parseOpenedNoteBrandingSettings({ backgroundZoom: 99 }).backgroundZoom, null);
    assert.equal(parseOpenedNoteBrandingSettings({ backgroundZoom: 120.5 }).backgroundZoom, null);
    assert.equal(parseOpenedNoteBrandingSettings({ backgroundZoom: "130" }).backgroundZoom, 130);
  });

  it("maps the retired same-as-reveal opened page onto Default", () => {
    assert.equal(parseOpenedNoteBrandingSettings({ background: "same" }).background, "neutral");
    assert.equal(parseOpenedNoteBrandingSettings({}).background, "neutral");
    assert.equal(DEFAULT_OPENED_NOTE_BRANDING.background, "neutral");
  });

  it("can switch the opened page to a solid colour without moving the message", () => {
    const opened = applyOpenedNoteBranding({
      bannerUrl: "https://acme.example/reveal.jpg",
      backgroundStyle: "banner",
      accentColor: "#2563eb",
      showBrandingAfterReveal: true,
      openedBackground: "neutral",
      openedBackgroundColor: "#0f172a",
    });
    assert.equal(opened?.bannerUrl, undefined);
    assert.equal(opened?.backgroundStyle, undefined);
    assert.equal(opened?.backgroundColor, "#0f172a");
  });

  it("round-trips opened photograph and Copy Note colours through storage JSON", () => {
    const stored = stringifyOpenedNoteBrandingSettings({
      show: true,
      background: "banner",
      showLogo: true,
      showSenderName: true,
      showCompanyName: true,
      showTrustMessage: true,
      bannerUrl: "https://acme.example/opened.jpg",
      backgroundColor: null,
      accentColor: "#111827",
      textColor: "#f8fafc",
    });
    const parsed = parseOpenedNoteBrandingSettings(stored);
    assert.equal(parsed.show, true);
    assert.equal(parsed.background, "banner");
    assert.equal(parsed.bannerUrl, "https://acme.example/opened.jpg");
    assert.equal(parsed.accentColor, "#111827");
    assert.equal(parsed.textColor, "#f8fafc");
    assert.equal(parsed.backgroundColor, null);
  });

  it("does not copy reveal colours into opened settings on a stored snapshot", () => {
    const snapshotted = parseStoredRevealBranding({
      companyName: "Acme",
      accentColor: "#2563eb",
      textColor: "#ffffff",
      bannerUrl: "https://acme.example/reveal.jpg",
      backgroundStyle: "banner",
      showBrandingAfterReveal: true,
      openedBackground: "banner",
      openedBannerUrl: "https://acme.example/opened.jpg",
      openedAccentColor: "#111827",
      openedTextColor: "#f8fafc",
    });
    assert.equal(snapshotted?.accentColor, "#2563eb");
    assert.equal(snapshotted?.openedAccentColor, "#111827");
    assert.equal(snapshotted?.openedTextColor, "#f8fafc");
    assert.equal(snapshotted?.openedBannerUrl, "https://acme.example/opened.jpg");
    assert.equal(snapshotted?.openedBackground, "banner");
    const opened = applyOpenedNoteBranding(snapshotted);
    assert.equal(opened?.bannerUrl, "https://acme.example/opened.jpg");
    assert.equal(opened?.accentColor, "#111827");
  });
});

describe("branding reveal logo size", () => {
  it("treats a logo without names as a solo mark and sizes it larger", () => {
    assert.equal(brandingLogoIsSolo({ logoUrl: "https://acme.example/logo.png" }), true);
    assert.equal(
      brandingLogoIsSolo({ logoUrl: "https://acme.example/logo.png", senderName: "Ada" }),
      false,
    );
    assert.match(
      brandingRevealLogoClassName({ logoUrl: "https://acme.example/logo.png" }),
      /max-h-16/,
    );
    assert.match(
      brandingRevealLogoClassName({ logoUrl: "https://acme.example/logo.png" }),
      /max-w-full/,
    );
    assert.match(
      brandingRevealLogoClassName({
        logoUrl: "https://acme.example/logo.png",
        companyName: "Acme",
      }),
      /max-h-12/,
    );
    assert.match(
      brandingRevealLogoClassName({ logoUrl: "https://acme.example/logo.png" }, { preview: true }),
      /max-h-8/,
    );
    assert.match(
      brandingRevealLogoClassName(
        { logoUrl: "https://acme.example/logo.png", companyName: "Acme" },
        { preview: true },
      ),
      /max-h-6/,
    );
  });

  it("keeps shared/ in the Tailwind content globs", async () => {
    // These sizes are authored here, not in client/src. If Tailwind stops
    // scanning shared/ the utilities are never emitted and the logo renders
    // at its natural size on the reveal card.
    const { readFile } = await import("node:fs/promises");
    const config = await readFile(new URL("../tailwind.config.ts", import.meta.url), "utf8");
    assert.match(config, /\.\/shared\/\*\*/);
  });

  it("uses a wide lockup on the card when cardImage is banner", () => {
    const branding = {
      logoUrl: "https://acme.example/logo.png",
      cardBannerUrl: "https://acme.example/lockup.png",
      bannerUrl: "https://acme.example/office.jpg",
      cardImage: "banner" as const,
      senderName: "Ada",
      companyName: "Acme",
    };
    assert.equal(brandingCardMarkUrl(branding), "https://acme.example/lockup.png");
    assert.equal(brandingLogoIsSolo(branding), false);
    assert.match(brandingRevealLogoClassName(branding), /w-full/);
    assert.match(brandingRevealLogoClassName(branding), /object-contain/);
    // A solo logo shares the `large` branch but must keep the smaller desktop height.
    assert.doesNotMatch(
      brandingRevealLogoClassName({ logoUrl: "https://acme.example/logo.png" }),
      /sm:max-h-32/,
    );
    assert.equal(
      brandingCardMarkUrl({ logoUrl: "https://acme.example/logo.png" }),
      "https://acme.example/logo.png",
    );
    assert.equal(
      brandingCardMarkUrl({
        logoUrl: "https://acme.example/logo.png",
        cardImage: "banner",
      }),
      "https://acme.example/logo.png",
    );
  });

  it("keeps the page photograph when the card uses a banner lockup", () => {
    const branding = {
      logoUrl: "https://acme.example/logo.png",
      cardBannerUrl: "https://acme.example/lockup.png",
      bannerUrl: "https://acme.example/office.jpg",
      backgroundStyle: "banner" as const,
      cardImage: "banner" as const,
    };
    assert.deepEqual(brandingPageBackground(branding), {
      kind: "image",
      url: "https://acme.example/office.jpg",
    });
    assert.equal(brandingCardMarkUrl(branding), "https://acme.example/lockup.png");
  });
});

describe("branding page modes", () => {
  it("maps Default / Custom onto the stored backgroundStyle values", () => {
    assert.equal(brandingPageMode("neutral"), "default");
    assert.equal(brandingPageMode("gradient"), "default");
    assert.equal(brandingPageMode("vignette"), "default");
    assert.equal(brandingPageMode("glow"), "default");
    assert.equal(brandingPageMode("mesh"), "default");
    assert.equal(brandingPageMode("banner"), "custom");
    assert.equal(brandingBackgroundStyleForPage("default", false), "neutral");
    assert.equal(brandingBackgroundStyleForPage("default", true), "gradient");
    assert.equal(brandingBackgroundStyleForPage("default", "mesh"), "mesh");
    assert.equal(brandingBackgroundStyleForPage("custom", true), "banner");
    assert.equal(brandingMobileLane("top-left"), "top");
    assert.equal(brandingMobileLane("right"), "center");
    assert.equal(brandingIsPrivateNoteCanvas("#ffffff"), true);
    assert.equal(brandingIsPrivateNoteCanvas("#e2e8f0"), false);
  });

  it("omits default zoom from the note snapshot and keeps a custom scale", () => {
    const defaultsOnly = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      backgroundZoom: 100,
    });
    assert.equal("backgroundZoom" in (defaultsOnly ?? {}), false);
    const zoomed = toRevealBranding({
      companyName: "Acme",
      senderName: null,
      logoUrl: null,
      accentColor: "#2563eb",
      backgroundZoom: 140,
    });
    assert.equal(zoomed?.backgroundZoom, 140);
  });
});

describe("brandingCardAxis", () => {
  it("falls back to center for an unexpected stored position", () => {
    assert.deepEqual(
      brandingCardAxis("not-a-position" as Parameters<typeof brandingCardAxis>[0]),
      { x: "center", y: "middle" },
    );
  });
});
