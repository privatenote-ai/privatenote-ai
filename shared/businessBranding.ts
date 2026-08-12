/**
 * Business "branded reveal page" configuration.
 *
 * Branding is stored once per account and snapshotted onto a note at creation
 * time, because the reveal page is anonymous and cannot look up the sender.
 *
 * Every value here is rendered into the reveal page for an untrusted audience,
 * so parsing is allowlist-based: the accent colour lands in an inline style and
 * the logo lands in an `<img src>`. Anything that is not provably safe is
 * rejected rather than sanitised, so a caller cannot smuggle a value through by
 * finding a gap in an escaping routine.
 */

export const BRANDING_COMPANY_NAME_MAX = 80;
export const BRANDING_SENDER_NAME_MAX = 80;
export const BRANDING_SENDER_ROLE_MAX = 80;
export const BRANDING_TRUST_MESSAGE_MAX = 160;
export const BRANDING_LOGO_URL_MAX = 512;

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
  backgroundStyle?: BrandingBackgroundStyle;
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
  backgroundStyle?: BrandingBackgroundStyle;
};

export const EMPTY_BUSINESS_BRANDING: BusinessBranding = {
  companyName: null,
  senderName: null,
  senderRole: null,
  trustMessage: null,
  logoUrl: null,
  bannerUrl: null,
  accentColor: null,
  backgroundStyle: "neutral",
};

export type BrandingErrorCode =
  | "premium_required"
  | "invalid_company_name"
  | "invalid_sender_name"
  | "invalid_sender_role"
  | "invalid_trust_message"
  | "invalid_logo_url"
  | "invalid_banner_url"
  | "invalid_accent_color"
  | "invalid_background_style";

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
 * Accepts absolute `https:` URLs only.
 *
 * `http:` is excluded because the reveal page is served over TLS and a mixed
 * content image would be blocked anyway. `data:` and `javascript:` are excluded
 * because they turn an image slot into a script/payload vector.
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

export function parseBrandingAccentColor(
  raw: unknown,
): { ok: true; value: string | null } | { ok: false } {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  if (typeof raw !== "string") return { ok: false };
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: true, value: null };
  if (!HEX_COLOR.test(trimmed)) return { ok: false };
  return { ok: true, value: trimmed.toLowerCase() };
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

  const accentColor = parseBrandingAccentColor(body.accentColor);
  if (!accentColor.ok) {
    return {
      ok: false,
      code: "invalid_accent_color",
      status: 400,
      message: "Accent colour must be a hex value such as #2563eb",
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
      backgroundStyle: backgroundStyle.value,
    },
  };
}

export function brandingIsEmpty(branding: BusinessBranding | null | undefined): boolean {
  if (!branding) return true;
  return (
    !branding.companyName && !branding.senderName && !branding.senderRole &&
    !branding.trustMessage && !branding.logoUrl && !branding.bannerUrl &&
    !branding.accentColor
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
    ...(branding.backgroundStyle && branding.backgroundStyle !== "neutral"
      ? { backgroundStyle: branding.backgroundStyle }
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
  const accentColor = parseBrandingAccentColor(source.accentColor);
  const backgroundStyle = parseBackgroundStyle(source.backgroundStyle);

  return toRevealBranding({
    companyName: companyName.ok ? companyName.value : null,
    senderName: senderName.ok ? senderName.value : null,
    senderRole: senderRole.ok ? senderRole.value : null,
    trustMessage: trustMessage.ok ? trustMessage.value : null,
    logoUrl: logoUrl.ok ? logoUrl.value : null,
    bannerUrl: bannerUrl.ok ? bannerUrl.value : null,
    accentColor: accentColor.ok ? accentColor.value : null,
    backgroundStyle: backgroundStyle.ok ? backgroundStyle.value : "neutral",
  });
}
