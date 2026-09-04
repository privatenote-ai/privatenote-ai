/**
 * Business "branded reveal page" configuration.
 *
 * Branding is stored once per account and snapshotted onto a note at creation
 * time, because the reveal page is anonymous and cannot look up the sender.
 *
 * Every value here is rendered into the reveal page for an untrusted audience,
 * so parsing is allowlist-based: the three brand colours land in inline styles and
 * the logo lands in an `<img src>`. Anything that is not provably safe is
 * rejected rather than sanitised, so a caller cannot smuggle a value through by
 * finding a gap in an escaping routine.
 */

export const BRANDING_COMPANY_NAME_MAX = 80;
export const BRANDING_SENDER_NAME_MAX = 80;
export const BRANDING_SENDER_ROLE_MAX = 80;
export const BRANDING_TRUST_MESSAGE_MAX = 160;
export const BRANDING_LOGO_URL_MAX = 512;
/** Same-origin paths snapshotted onto notes so recipients never load workers.dev. */
export const BRANDING_LOGO_PUBLIC_PATH_PREFIX = "/api/auth/branding/logo/";
export const BRANDING_BANNER_PUBLIC_PATH_PREFIX = "/api/auth/branding/banner/";
const BRANDING_HOSTED_ASSET_FILE = /^[A-Za-z0-9_-]{20,}\.(?:png|jpg|webp)$/;

/** Soft recommendations for Business upload UI (enforced limits are byte size + type). */
export const BRANDING_LOGO_MAX_BYTES = 1024 * 1024;
export const BRANDING_BANNER_MAX_BYTES = 3 * 1024 * 1024;
export const BRANDING_LOGO_RECOMMENDED_PX = { width: 512, height: 512 } as const;
/**
 * Reveal-page cover art. It renders at its full 8:3 shape in a card above the
 * Reveal button, so nothing is cropped; 1920px wide keeps it sharp on retina at
 * the card's ~600px display width without wasting bytes.
 */
export const BRANDING_BANNER_RECOMMENDED_PX = { width: 1920, height: 720 } as const;
export const BRANDING_BANNER_ASPECT_RATIO = "8 / 3" as const;
export const BRANDING_BANNER_SIZE_LABEL =
  `${BRANDING_BANNER_RECOMMENDED_PX.width}×${BRANDING_BANNER_RECOMMENDED_PX.height}` as const;

export type BrandingBackgroundStyle = "neutral" | "gradient" | "banner";

/** Persisted shape. `null` means "not configured". */
export type BusinessBranding = {
  companyName: string | null;
  senderName: string | null;
  senderRole?: string | null;
  trustMessage?: string | null;
  logoUrl: string | null;
  bannerUrl?: string | null;
  accentColor: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  backgroundStyle?: BrandingBackgroundStyle;
  /**
   * When true, sender branding also appears on the opened-note view.
   * Default false so screenshots of secrets do not carry logo/attribution.
   */
  showBrandingAfterReveal?: boolean | null;
};

/** Wire shape sent to the reveal page; empty fields are omitted entirely. */
export type RevealBranding = {
  companyName?: string;
  senderName?: string;
  senderRole?: string;
  trustMessage?: string;
  logoUrl?: string;
  bannerUrl?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundStyle?: BrandingBackgroundStyle;
  /** Present only when true; missing/false means hide branding after open. */
  showBrandingAfterReveal?: boolean;
};

export type BrandingCtaStyle = {
  backgroundColor: string;
  color: string;
  border?: string;
};

export type BrandingHeroStyle = {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  background?: string;
};

export const EMPTY_BUSINESS_BRANDING: BusinessBranding = {
  companyName: null,
  senderName: null,
  senderRole: null,
  trustMessage: null,
  logoUrl: null,
  bannerUrl: null,
  accentColor: null,
  backgroundColor: null,
  textColor: null,
  backgroundStyle: "neutral",
  showBrandingAfterReveal: false,
};

/** True when the opened-note view should keep sender branding (opt-in). */
export function brandingShowsAfterReveal(
  branding: Pick<RevealBranding, "showBrandingAfterReveal"> | undefined,
): boolean {
  return branding?.showBrandingAfterReveal === true;
}

export type BrandingErrorCode =
  | "premium_required"
  | "invalid_company_name"
  | "invalid_sender_name"
  | "invalid_sender_role"
  | "invalid_trust_message"
  | "invalid_logo_url"
  | "invalid_banner_url"
  | "invalid_accent_color"
  | "invalid_background_color"
  | "invalid_text_color"
  | "invalid_background_style"
  | "invalid_show_branding_after_reveal";

export type BusinessBrandingParseResult =
  | { ok: true; branding: BusinessBranding }
  | { ok: false; code: BrandingErrorCode; status: 400 | 403; message: string };

export type BusinessBrandingParseOptions = {
  /** Defaults to false so an omitted entitlement context fails closed. */
  revealBrandingAllowed?: boolean;
};

/** `#rgb` or `#rrggbb` only. Named colours and functional notation are rejected
 *  so the value can never carry additional CSS declarations. */
const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/;

/** Collapses runs of whitespace so a name cannot be used to inject layout. */
function normalizeText(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const collapsed = raw.replace(/\s+/g, " ").trim();
  return collapsed.length > 0 ? collapsed : null;
}

function parseName(
  raw: unknown,
  max: number,
): { ok: true; value: string | null } | { ok: false } {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  if (typeof raw !== "string") return { ok: false };
  if (CONTROL_CHARS.test(raw)) return { ok: false };
  const value = normalizeText(raw);
  if (value === null) return { ok: true, value: null };
  if (value.length > max) return { ok: false };
  return { ok: true, value };
}

/**
 * Hosted logo/banner object keys (`account-branding/…`) become same-origin
 * public paths. Absolute URLs that already point at those paths are rewritten
 * so a note created via the Pages → workers.dev proxy still loads on the app host.
 */
export function publicBrandingAssetPath(
  objectKey: string | null | undefined,
  kind: "logo" | "banner",
): string | null {
  const prefix = kind === "logo" ? "account-branding/" : "account-branding/banner/";
  const publicPrefix =
    kind === "logo" ? BRANDING_LOGO_PUBLIC_PATH_PREFIX : BRANDING_BANNER_PUBLIC_PATH_PREFIX;
  if (!objectKey?.startsWith(prefix)) return null;
  const fileName = objectKey.slice(prefix.length);
  if (!BRANDING_HOSTED_ASSET_FILE.test(fileName)) return null;
  return `${publicPrefix}${fileName}`;
}

function hostedBrandingPublicPath(pathname: string): string | null | undefined {
  const prefixes = [BRANDING_LOGO_PUBLIC_PATH_PREFIX, BRANDING_BANNER_PUBLIC_PATH_PREFIX] as const;
  for (const prefix of prefixes) {
    if (!pathname.startsWith(prefix)) continue;
    const fileName = pathname.slice(prefix.length);
    if (!BRANDING_HOSTED_ASSET_FILE.test(fileName)) return null;
    return `${prefix}${fileName}`;
  }
  return undefined;
}

/**
 * Accepts same-origin hosted branding paths, or absolute `https:` URLs.
 *
 * Hosted `/api/auth/branding/{logo,banner}/…` values are stored as paths so the
 * reveal page loads them from the app origin. Other `https:` URLs stay absolute.
 * `http:`, `data:`, and `javascript:` are rejected.
 */
export function parseBrandingLogoUrl(
  raw: unknown,
): { ok: true; value: string | null } | { ok: false } {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  if (typeof raw !== "string") return { ok: false };
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: true, value: null };
  if (trimmed.length > BRANDING_LOGO_URL_MAX) return { ok: false };
  if (CONTROL_CHARS.test(trimmed)) return { ok: false };
  if (trimmed.startsWith("//") || trimmed.includes("\\")) return { ok: false };

  if (trimmed.startsWith("/")) {
    const hosted = hostedBrandingPublicPath(trimmed.split(/[?#]/, 1)[0] ?? trimmed);
    if (hosted === undefined) return { ok: false };
    if (hosted === null) return { ok: false };
    return { ok: true, value: hosted };
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return { ok: false };
  }
  if (url.protocol !== "https:") return { ok: false };
  // Embedded credentials would be echoed to every recipient.
  if (url.username || url.password) return { ok: false };
  if (!url.hostname || !url.hostname.includes(".")) return { ok: false };

  const hosted = hostedBrandingPublicPath(url.pathname);
  if (hosted === null) return { ok: false };
  if (hosted) return { ok: true, value: hosted };

  return { ok: true, value: url.toString() };
}

export const parseBrandingBannerUrl = parseBrandingLogoUrl;

function parseBackgroundStyle(
  raw: unknown,
): { ok: true; value: BrandingBackgroundStyle } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") return { ok: true, value: "neutral" };
  return raw === "neutral" || raw === "gradient" || raw === "banner"
    ? { ok: true, value: raw }
    : { ok: false };
}

export function parseBrandingHexColor(
  raw: unknown,
): { ok: true; value: string | null } | { ok: false } {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  if (typeof raw !== "string") return { ok: false };
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: true, value: null };
  if (!HEX_COLOR.test(trimmed)) return { ok: false };
  const lower = trimmed.toLowerCase();
  if (lower.length === 4) {
    return {
      ok: true,
      value: `#${lower[1]}${lower[1]}${lower[2]}${lower[2]}${lower[3]}${lower[3]}`,
    };
  }
  return { ok: true, value: lower };
}

export const parseBrandingAccentColor = parseBrandingHexColor;

function hexChannel(hex: string, index: number): number {
  return Number.parseInt(hex.slice(index, index + 2), 16) / 255;
}

function linearizeSrgb(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance for a parsed `#rrggbb` value. */
export function brandingRelativeLuminance(hex: string): number {
  const r = linearizeSrgb(hexChannel(hex, 1));
  const g = linearizeSrgb(hexChannel(hex, 3));
  const b = linearizeSrgb(hexChannel(hex, 5));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastingTextOn(hex: string): "#ffffff" | "#111827" {
  return brandingRelativeLuminance(hex) > 0.55 ? "#111827" : "#ffffff";
}

function contrastRatio(a: string, b: string): number {
  const lighter = Math.max(brandingRelativeLuminance(a), brandingRelativeLuminance(b));
  const darker = Math.min(brandingRelativeLuminance(a), brandingRelativeLuminance(b));
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Text painted on the accent fill. Uses the configured text colour when it
 * actually contrasts; otherwise falls back so a white accent cannot hide the CTA.
 */
export function brandingButtonTextColor(accentColor: string, textColor?: string): string {
  if (textColor && contrastRatio(accentColor, textColor) >= 3) return textColor;
  return contrastingTextOn(accentColor);
}

export function brandingCtaStyle(
  branding: Pick<RevealBranding, "accentColor" | "textColor"> | undefined,
): BrandingCtaStyle | undefined {
  if (!branding?.accentColor) return undefined;
  const color = brandingButtonTextColor(branding.accentColor, branding.textColor);
  const style: BrandingCtaStyle = {
    backgroundColor: branding.accentColor,
    color,
  };
  if (brandingRelativeLuminance(branding.accentColor) > 0.85) {
    style.border = `1px solid ${color === "#ffffff" ? "#d1d5db" : color}`;
  }
  return style;
}

export function brandingShowsBanner(
  branding: RevealBranding | undefined,
): boolean {
  return branding?.backgroundStyle === "banner" && Boolean(branding.bannerUrl);
}

/**
 * Cover art for the bounded banner card between the reveal copy and the CTA.
 *
 * The banner is deliberately not used as the page background: a full-bleed
 * wordmark competes with the reveal headline and the button, and any overlay
 * dark enough to fix that turns the whole page into an unreadable slab.
 */
export function brandingBannerStyle(
  branding: RevealBranding | undefined,
): BrandingHeroStyle | undefined {
  if (!brandingShowsBanner(branding) || !branding?.bannerUrl) return undefined;
  return {
    backgroundImage: `url(${branding.bannerUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

/**
 * Page-level wash behind the reveal hero.
 *
 * Near-white values are dropped so branding never draws a white card on top of
 * the app background, and the banner is excluded because it renders as a band.
 */
export function brandingHeroStyle(
  branding: RevealBranding | undefined,
): BrandingHeroStyle | undefined {
  if (!branding) return undefined;
  if (branding.backgroundStyle === "gradient" && branding.accentColor) {
    const base = branding.backgroundColor ?? "transparent";
    return {
      background: `linear-gradient(135deg, ${branding.accentColor}20, ${base})`,
    };
  }
  if (branding.backgroundColor && brandingRelativeLuminance(branding.backgroundColor) < 0.94) {
    return { backgroundColor: branding.backgroundColor };
  }
  return undefined;
}

export function brandingHeroUsesLightText(branding: RevealBranding | undefined): boolean {
  if (branding?.backgroundColor) {
    return contrastingTextOn(branding.backgroundColor) === "#ffffff";
  }
  return false;
}

/**
 * Validates a branding payload submitted by an account owner.
 *
 * The plan is checked before any field so an unentitled caller cannot use
 * validation errors to probe the shape of the feature.
 */
export function parseBusinessBrandingInput(
  raw: unknown,
  options?: BusinessBrandingParseOptions,
): BusinessBrandingParseResult {
  if (!options?.revealBrandingAllowed) {
    return {
      ok: false,
      code: "premium_required",
      status: 403,
      message: "Branded reveal pages are not available on your plan",
    };
  }

  const body = (raw ?? {}) as Record<string, unknown>;

  const companyName = parseName(body.companyName, BRANDING_COMPANY_NAME_MAX);
  if (!companyName.ok) {
    return {
      ok: false,
      code: "invalid_company_name",
      status: 400,
      message: `Company name must be plain text of at most ${BRANDING_COMPANY_NAME_MAX} characters`,
    };
  }

  const senderName = parseName(body.senderName, BRANDING_SENDER_NAME_MAX);
  if (!senderName.ok) {
    return {
      ok: false,
      code: "invalid_sender_name",
      status: 400,
      message: `Sender name must be plain text of at most ${BRANDING_SENDER_NAME_MAX} characters`,
    };
  }

  const senderRole = parseName(body.senderRole, BRANDING_SENDER_ROLE_MAX);
  if (!senderRole.ok) {
    return { ok: false, code: "invalid_sender_role", status: 400,
      message: `Sender role must be plain text of at most ${BRANDING_SENDER_ROLE_MAX} characters` };
  }
  const trustMessage = parseName(body.trustMessage, BRANDING_TRUST_MESSAGE_MAX);
  if (!trustMessage.ok) {
    return { ok: false, code: "invalid_trust_message", status: 400,
      message: `Trust message must be plain text of at most ${BRANDING_TRUST_MESSAGE_MAX} characters` };
  }

  const logoUrl = parseBrandingLogoUrl(body.logoUrl);
  if (!logoUrl.ok) {
    return {
      ok: false,
      code: "invalid_logo_url",
      status: 400,
      message: "Logo must be an absolute https:// URL",
    };
  }

  const accentColor = parseBrandingHexColor(body.accentColor);
  if (!accentColor.ok) {
    return {
      ok: false,
      code: "invalid_accent_color",
      status: 400,
      message: "Accent colour must be a hex value such as #2563eb",
    };
  }
  const backgroundColor = parseBrandingHexColor(body.backgroundColor);
  if (!backgroundColor.ok) {
    return {
      ok: false,
      code: "invalid_background_color",
      status: 400,
      message: "Background colour must be a hex value such as #ffffff",
    };
  }
  const textColor = parseBrandingHexColor(body.textColor);
  if (!textColor.ok) {
    return {
      ok: false,
      code: "invalid_text_color",
      status: 400,
      message: "Text colour must be a hex value such as #111827",
    };
  }
  const bannerUrl = parseBrandingBannerUrl(body.bannerUrl);
  if (!bannerUrl.ok) {
    return { ok: false, code: "invalid_banner_url", status: 400,
      message: "Banner must be an absolute https:// URL" };
  }
  const backgroundStyle = parseBackgroundStyle(body.backgroundStyle);
  if (!backgroundStyle.ok) {
    return { ok: false, code: "invalid_background_style", status: 400,
      message: "Background style must be neutral, gradient, or banner" };
  }
  const showAfterRaw = body.showBrandingAfterReveal;
  let showBrandingAfterReveal = false;
  if (showAfterRaw === true) {
    showBrandingAfterReveal = true;
  } else if (
    showAfterRaw !== false &&
    showAfterRaw !== null &&
    showAfterRaw !== undefined
  ) {
    return {
      ok: false,
      code: "invalid_show_branding_after_reveal",
      status: 400,
      message: "showBrandingAfterReveal must be a boolean",
    };
  }

  return {
    ok: true,
    branding: {
      companyName: companyName.value,
      senderName: senderName.value,
      senderRole: senderRole.value,
      trustMessage: trustMessage.value,
      logoUrl: logoUrl.value,
      bannerUrl: bannerUrl.value,
      accentColor: accentColor.value,
      backgroundColor: backgroundColor.value,
      textColor: textColor.value,
      backgroundStyle: backgroundStyle.value,
      showBrandingAfterReveal,
    },
  };
}

export function brandingIsEmpty(branding: BusinessBranding | null | undefined): boolean {
  if (!branding) return true;
  return (
    !branding.companyName && !branding.senderName && !branding.senderRole &&
    !branding.trustMessage && !branding.logoUrl && !branding.bannerUrl &&
    !branding.accentColor && !branding.backgroundColor && !branding.textColor
  );
}

/**
 * Projects stored branding onto the wire shape, dropping empty fields.
 *
 * Returns `undefined` when nothing would render, so callers can omit the key
 * rather than sending an object full of nulls.
 */
export function toRevealBranding(
  branding: BusinessBranding | null | undefined,
): RevealBranding | undefined {
  if (brandingIsEmpty(branding) || !branding) return undefined;
  return {
    ...(branding.companyName ? { companyName: branding.companyName } : {}),
    ...(branding.senderName ? { senderName: branding.senderName } : {}),
    ...(branding.senderRole ? { senderRole: branding.senderRole } : {}),
    ...(branding.trustMessage ? { trustMessage: branding.trustMessage } : {}),
    ...(branding.logoUrl ? { logoUrl: branding.logoUrl } : {}),
    ...(branding.bannerUrl ? { bannerUrl: branding.bannerUrl } : {}),
    ...(branding.accentColor ? { accentColor: branding.accentColor } : {}),
    ...(branding.backgroundColor ? { backgroundColor: branding.backgroundColor } : {}),
    ...(branding.textColor ? { textColor: branding.textColor } : {}),
    ...(branding.backgroundStyle && branding.backgroundStyle !== "neutral"
      ? { backgroundStyle: branding.backgroundStyle }
      : {}),
    ...(branding.showBrandingAfterReveal === true
      ? { showBrandingAfterReveal: true }
      : {}),
  };
}

/**
 * Re-validates branding read back out of note storage before it is rendered.
 *
 * Notes outlive deploys, so a payload written by an older or buggier version
 * cannot be trusted just because it is at rest. Individual bad fields are
 * dropped instead of failing the whole reveal, which would deny access to the
 * secret over a cosmetic problem.
 */
export function parseStoredRevealBranding(raw: unknown): RevealBranding | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return undefined;
  const source = raw as Record<string, unknown>;

  const companyName = parseName(source.companyName, BRANDING_COMPANY_NAME_MAX);
  const senderName = parseName(source.senderName, BRANDING_SENDER_NAME_MAX);
  const senderRole = parseName(source.senderRole, BRANDING_SENDER_ROLE_MAX);
  const trustMessage = parseName(source.trustMessage, BRANDING_TRUST_MESSAGE_MAX);
  const logoUrl = parseBrandingLogoUrl(source.logoUrl);
  const bannerUrl = parseBrandingBannerUrl(source.bannerUrl);
  const accentColor = parseBrandingHexColor(source.accentColor);
  const backgroundColor = parseBrandingHexColor(source.backgroundColor);
  const textColor = parseBrandingHexColor(source.textColor);
  const backgroundStyle = parseBackgroundStyle(source.backgroundStyle);

  return toRevealBranding({
    companyName: companyName.ok ? companyName.value : null,
    senderName: senderName.ok ? senderName.value : null,
    senderRole: senderRole.ok ? senderRole.value : null,
    trustMessage: trustMessage.ok ? trustMessage.value : null,
    logoUrl: logoUrl.ok ? logoUrl.value : null,
    bannerUrl: bannerUrl.ok ? bannerUrl.value : null,
    accentColor: accentColor.ok ? accentColor.value : null,
    backgroundColor: backgroundColor.ok ? backgroundColor.value : null,
    textColor: textColor.ok ? textColor.value : null,
    backgroundStyle: backgroundStyle.ok ? backgroundStyle.value : "neutral",
    showBrandingAfterReveal: source.showBrandingAfterReveal === true,
  });
}
