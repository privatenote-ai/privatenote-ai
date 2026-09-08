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
export const BRANDING_CARD_BANNER_PUBLIC_PATH_PREFIX = "/api/auth/branding/card-banner/";
export const BRANDING_OPENED_BANNER_PUBLIC_PATH_PREFIX = "/api/auth/branding/opened-banner/";
const BRANDING_HOSTED_ASSET_FILE = /^[A-Za-z0-9_-]{20,}\.(?:png|jpg|webp)$/;

/** Soft recommendations for Business upload UI (enforced limits are byte size + type). */
export const BRANDING_LOGO_MAX_BYTES = 1024 * 1024;
export const BRANDING_BANNER_MAX_BYTES = 3 * 1024 * 1024;
export const BRANDING_LOGO_RECOMMENDED_PX = { width: 512, height: 512 } as const;
/**
 * Full-page recipient background. 1920×1080 stays sharp on a desktop canvas
 * without asking senders for print-resolution photography. The image is
 * `object-cover`’d, so a 16:9 landscape is the crop-safe recommendation.
 */
export const BRANDING_BANNER_RECOMMENDED_PX = { width: 1920, height: 1080 } as const;
export const BRANDING_BANNER_ASPECT_RATIO = "16 / 9" as const;
export const BRANDING_BANNER_SIZE_LABEL =
  `${BRANDING_BANNER_RECOMMENDED_PX.width}×${BRANDING_BANNER_RECOMMENDED_PX.height}` as const;
/** Wide lockup on the reveal card (not the full-page photograph). */
export const BRANDING_CARD_BANNER_RECOMMENDED_PX = { width: 1200, height: 400 } as const;
/** A 1200×400 lockup needs more headroom than the square logo mark, especially as PNG. */
export const BRANDING_CARD_BANNER_MAX_BYTES = 3 * 1024 * 1024;
export const BRANDING_CARD_BANNER_SIZE_LABEL =
  `${BRANDING_CARD_BANNER_RECOMMENDED_PX.width}×${BRANDING_CARD_BANNER_RECOMMENDED_PX.height}` as const;

export type BrandingBackgroundStyle =
  | "neutral"
  | "gradient"
  | "vignette"
  | "glow"
  | "mesh"
  | "banner";
/** Default-page atmosphere. `banner` is Custom photography and is not a filter. */
export const BRANDING_BACKGROUND_FILTERS = [
  "neutral",
  "gradient",
  "vignette",
  "glow",
  "mesh",
] as const;
export type BrandingBackgroundFilter = (typeof BRANDING_BACKGROUND_FILTERS)[number];
/** UI page mode. Filters share Default; `banner` is Custom. */
export type BrandingPageMode = "default" | "custom";
export const BRANDING_MOBILE_LANES = ["top", "center", "bottom"] as const;
export type BrandingMobileLane = (typeof BRANDING_MOBILE_LANES)[number];
export const BRANDING_BACKGROUND_ZOOM_MIN = 100;
export const BRANDING_BACKGROUND_ZOOM_MAX = 200;
export const BRANDING_BACKGROUND_ZOOM_DEFAULT = 100;
/** Reveal card stays inside this inset so it cannot sit on the glass edge. */
export const BRANDING_CARD_INSET_PX = 48;
export const BRANDING_CARD_POSITIONS = [
  "top-left",
  "top",
  "top-right",
  "left",
  "center",
  "right",
  "bottom-left",
  "bottom",
  "bottom-right",
] as const;
export type BrandingCardPosition = (typeof BRANDING_CARD_POSITIONS)[number];
export type BrandingCardAxis = {
  x: "left" | "center" | "right";
  y: "top" | "middle" | "bottom";
};
export type BrandingBackgroundFit = "fill" | "fit";
export type BrandingOverlay = "light" | "medium" | "dark";
export type BrandingCardImage = "logo" | "banner";
export const BRANDING_CARD_IMAGES = ["logo", "banner"] as const;

const BRANDING_CARD_POSITION_SET = new Set<string>(BRANDING_CARD_POSITIONS);

export type BrandingPortalLayout = {
  /** Desktop / `sm+` placement. Older notes used this for every viewport. */
  cardPosition: BrandingCardPosition;
  /** Phone placement. Omitted on older notes, which then follow `cardPosition`. */
  cardPositionMobile: BrandingCardPosition;
  /** Which hosted image sits on the reveal card. */
  cardImage: BrandingCardImage;
  /** Wide lockup on the reveal card. Separate from `logoUrl` and the page photograph. */
  cardBannerUrl: string | null;
  backgroundFit: BrandingBackgroundFit;
  overlay: BrandingOverlay;
  focalX: number;
  focalY: number;
  /** Cover-crop zoom for the Custom photograph. 100 is unscaled. */
  backgroundZoom: number;
  /**
   * Free placement inside the inset frame. 0,0 is top-left; 100,100 is bottom-right.
   * Older notes omit these and follow `cardPosition`.
   */
  cardX: number;
  cardY: number;
  cardXMobile: number;
  cardYMobile: number;
  /** Identity lines on the Logo and Banner reveal cards. Default on. */
  showCompanyName: boolean;
  showSenderName: boolean;
  showSenderRole: boolean;
  showTrustMessage: boolean;
};

/** Light overlay is ~16% so photography stays visible behind an opaque card. */
export const BRANDING_OVERLAY_OPACITY: Record<BrandingOverlay, number> = {
  light: 0.16,
  medium: 0.32,
  dark: 0.5,
};

export const DEFAULT_BRANDING_PORTAL_LAYOUT: BrandingPortalLayout = {
  cardPosition: "center",
  cardPositionMobile: "center",
  cardImage: "logo",
  cardBannerUrl: null,
  backgroundFit: "fill",
  overlay: "light",
  focalX: 50,
  focalY: 50,
  backgroundZoom: BRANDING_BACKGROUND_ZOOM_DEFAULT,
  cardX: 50,
  cardY: 50,
  cardXMobile: 50,
  cardYMobile: 50,
  showCompanyName: true,
  showSenderName: true,
  showSenderRole: true,
  showTrustMessage: true,
};

/** Persisted shape. `null` means "not configured". */
export type BusinessBranding = {
  companyName: string | null;
  senderName: string | null;
  senderRole?: string | null;
  trustMessage?: string | null;
  logoUrl: string | null;
  bannerUrl?: string | null;
  cardBannerUrl?: string | null;
  accentColor: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  backgroundStyle?: BrandingBackgroundStyle;
  cardPosition?: BrandingCardPosition | null;
  cardPositionMobile?: BrandingCardPosition | null;
  cardX?: number | null;
  cardY?: number | null;
  cardXMobile?: number | null;
  cardYMobile?: number | null;
  cardImage?: BrandingCardImage | null;
  backgroundFit?: BrandingBackgroundFit | null;
  overlay?: BrandingOverlay | null;
  focalX?: number | null;
  focalY?: number | null;
  backgroundZoom?: number | null;
  showCompanyName?: boolean | null;
  showSenderName?: boolean | null;
  showSenderRole?: boolean | null;
  showTrustMessage?: boolean | null;
  showBrandingAfterReveal?: boolean | null;
  openedBackground?: OpenedNoteBackground | null;
  openedShowLogo?: boolean | null;
  openedShowSenderName?: boolean | null;
  openedShowCompanyName?: boolean | null;
  openedShowTrustMessage?: boolean | null;
  openedBannerUrl?: string | null;
  openedAccentColor?: string | null;
  openedTextColor?: string | null;
  openedBackgroundColor?: string | null;
  openedBackgroundZoom?: number | null;
};

export const OPENED_NOTE_BACKGROUNDS = [
  "same",
  "neutral",
  "gradient",
  "vignette",
  "glow",
  "mesh",
  "banner",
] as const;
export type OpenedNoteBackground = (typeof OPENED_NOTE_BACKGROUNDS)[number];

export type OpenedNoteBrandingSettings = {
  /** Off by default. Screenshots of the opened note stay unbranded unless this is true. */
  show: boolean;
  background: OpenedNoteBackground;
  showLogo: boolean;
  showSenderName: boolean;
  showCompanyName: boolean;
  showTrustMessage: boolean;
  /** Dedicated after-open photograph. When background is `banner` and this is empty, the reveal photo is reused. */
  bannerUrl?: string | null;
  backgroundColor?: string | null;
  accentColor?: string | null;
  textColor?: string | null;
  /** `null` inherits the reveal page's scale, so existing snapshots keep their look. */
  backgroundZoom?: number | null;
};

export const DEFAULT_OPENED_NOTE_BRANDING: OpenedNoteBrandingSettings = {
  show: false,
  background: "neutral",
  showLogo: true,
  showSenderName: true,
  showCompanyName: true,
  showTrustMessage: true,
  bannerUrl: null,
  backgroundColor: null,
  accentColor: null,
  textColor: null,
  backgroundZoom: null,
};

/** Wire shape sent to the reveal page; empty fields are omitted entirely. */
export type RevealBranding = {
  companyName?: string;
  senderName?: string;
  senderRole?: string;
  trustMessage?: string;
  logoUrl?: string;
  bannerUrl?: string;
  cardBannerUrl?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundStyle?: BrandingBackgroundStyle;
  cardPosition?: BrandingCardPosition;
  cardPositionMobile?: BrandingCardPosition;
  cardX?: number;
  cardY?: number;
  cardXMobile?: number;
  cardYMobile?: number;
  cardImage?: BrandingCardImage;
  backgroundFit?: BrandingBackgroundFit;
  overlay?: BrandingOverlay;
  focalX?: number;
  focalY?: number;
  backgroundZoom?: number;
  showCompanyName?: boolean;
  showSenderName?: boolean;
  showSenderRole?: boolean;
  showTrustMessage?: boolean;
  showBrandingAfterReveal?: boolean;
  openedBackground?: OpenedNoteBackground;
  openedShowLogo?: boolean;
  openedShowSenderName?: boolean;
  openedShowCompanyName?: boolean;
  openedShowTrustMessage?: boolean;
  openedBannerUrl?: string;
  openedAccentColor?: string;
  openedTextColor?: string;
  openedBackgroundColor?: string;
  openedBackgroundZoom?: number;
  /** Legacy alias still accepted when reading stored notes. */
  sharerName?: string;
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

export type BrandingPageBackground =
  | { kind: "none" }
  | { kind: "gradient"; background: string }
  | { kind: "color"; backgroundColor: string }
  | { kind: "image"; url: string };

export const EMPTY_BUSINESS_BRANDING: BusinessBranding = {
  companyName: null,
  senderName: null,
  senderRole: null,
  trustMessage: null,
  logoUrl: null,
  bannerUrl: null,
  cardBannerUrl: null,
  accentColor: null,
  backgroundColor: null,
  textColor: null,
  backgroundStyle: "neutral",
  cardPosition: DEFAULT_BRANDING_PORTAL_LAYOUT.cardPosition,
  cardPositionMobile: DEFAULT_BRANDING_PORTAL_LAYOUT.cardPositionMobile,
  cardImage: DEFAULT_BRANDING_PORTAL_LAYOUT.cardImage,
  backgroundFit: DEFAULT_BRANDING_PORTAL_LAYOUT.backgroundFit,
  overlay: DEFAULT_BRANDING_PORTAL_LAYOUT.overlay,
  focalX: DEFAULT_BRANDING_PORTAL_LAYOUT.focalX,
  focalY: DEFAULT_BRANDING_PORTAL_LAYOUT.focalY,
  backgroundZoom: DEFAULT_BRANDING_PORTAL_LAYOUT.backgroundZoom,
  cardX: DEFAULT_BRANDING_PORTAL_LAYOUT.cardX,
  cardY: DEFAULT_BRANDING_PORTAL_LAYOUT.cardY,
  cardXMobile: DEFAULT_BRANDING_PORTAL_LAYOUT.cardXMobile,
  cardYMobile: DEFAULT_BRANDING_PORTAL_LAYOUT.cardYMobile,
  showCompanyName: true,
  showSenderName: true,
  showSenderRole: true,
  showTrustMessage: true,
  showBrandingAfterReveal: false,
  openedBackground: "same",
  openedShowLogo: true,
  openedShowSenderName: true,
  openedShowCompanyName: true,
  openedShowTrustMessage: true,
  openedBannerUrl: null,
  openedAccentColor: null,
  openedTextColor: null,
  openedBackgroundColor: null,
};

/** True when the opened-note view should keep sender branding (opt-in). */
export function brandingShowsAfterReveal(
  branding: Pick<RevealBranding, "showBrandingAfterReveal"> | undefined,
): boolean {
  return branding?.showBrandingAfterReveal === true;
}


/** Prefer the JSON column; fall back to the legacy 0/1 flag for existing accounts. */
export function openedSettingsFromAccountColumns(
  json: unknown,
  showAfterRevealFlag: unknown,
): OpenedNoteBrandingSettings {
  if (json && typeof json === "object") {
    return parseOpenedNoteBrandingSettings(json);
  }
  if (typeof json === "string" && json.trim() !== "") {
    return parseOpenedNoteBrandingSettings(json);
  }
  const flagOn =
    showAfterRevealFlag === 1 ||
    showAfterRevealFlag === "1" ||
    showAfterRevealFlag === true;
  return { ...DEFAULT_OPENED_NOTE_BRANDING, show: flagOn };
}

/**
 * Scale for the after-open photograph. Returns `null` for anything missing or
 * out of range, which means "inherit the reveal page's scale" rather than 100%.
 */
function parseOpenedBackgroundZoom(raw: unknown): number | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const value = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw.trim()) : NaN;
  if (!Number.isInteger(value)) return null;
  if (value < BRANDING_BACKGROUND_ZOOM_MIN || value > BRANDING_BACKGROUND_ZOOM_MAX) return null;
  return value;
}

export function parseOpenedNoteBrandingSettings(raw: unknown): OpenedNoteBrandingSettings {
  let source: unknown = raw;
  if (typeof raw === "string") {
    try {
      source = JSON.parse(raw) as unknown;
    } catch {
      return { ...DEFAULT_OPENED_NOTE_BRANDING };
    }
  }
  const record =
    source && typeof source === "object" && !Array.isArray(source)
      ? (source as Record<string, unknown>)
      : {};
  const backgroundRaw = record.background;
  const parsedBackground = OPENED_NOTE_BACKGROUNDS.includes(backgroundRaw as OpenedNoteBackground)
    ? (backgroundRaw as OpenedNoteBackground)
    : "neutral";
  // "same as reveal" is no longer offered; older stored values become Default.
  const background = parsedBackground === "same" ? "neutral" : parsedBackground;
  const bannerUrl = parseBrandingBannerUrl(record.bannerUrl ?? record.openedBannerUrl);
  const backgroundColor = parseBrandingHexColor(record.backgroundColor ?? record.openedBackgroundColor);
  const accentColor = parseBrandingHexColor(record.accentColor ?? record.openedAccentColor);
  const textColor = parseBrandingHexColor(record.textColor ?? record.openedTextColor);
  const backgroundZoom = parseOpenedBackgroundZoom(record.backgroundZoom ?? record.openedBackgroundZoom);
  return {
    show: record.show === true,
    background,
    showLogo: record.showLogo !== false,
    showSenderName: record.showSenderName !== false,
    showCompanyName: record.showCompanyName !== false,
    showTrustMessage: record.showTrustMessage !== false,
    bannerUrl: bannerUrl.ok ? bannerUrl.value : null,
    backgroundColor: backgroundColor.ok ? backgroundColor.value : null,
    accentColor: accentColor.ok ? accentColor.value : null,
    textColor: textColor.ok ? textColor.value : null,
    backgroundZoom,
  };
}

export function stringifyOpenedNoteBrandingSettings(
  settings: OpenedNoteBrandingSettings,
): string {
  return JSON.stringify({
    show: settings.show === true,
    background: settings.background,
    showLogo: settings.showLogo !== false,
    showSenderName: settings.showSenderName !== false,
    showCompanyName: settings.showCompanyName !== false,
    showTrustMessage: settings.showTrustMessage !== false,
    ...(settings.bannerUrl ? { bannerUrl: settings.bannerUrl } : {}),
    ...(settings.backgroundColor ? { backgroundColor: settings.backgroundColor } : {}),
    ...(settings.accentColor ? { accentColor: settings.accentColor } : {}),
    ...(settings.textColor ? { textColor: settings.textColor } : {}),
    ...(settings.backgroundZoom ? { backgroundZoom: settings.backgroundZoom } : {}),
  });
}

export function openedSettingsFromBranding(
  branding: Pick<
    BusinessBranding,
    | "showBrandingAfterReveal"
    | "openedBackground"
    | "openedShowLogo"
    | "openedShowSenderName"
    | "openedShowCompanyName"
    | "openedShowTrustMessage"
    | "openedBannerUrl"
    | "openedAccentColor"
    | "openedTextColor"
    | "openedBackgroundColor"
    | "openedBackgroundZoom"
  > | null | undefined,
): OpenedNoteBrandingSettings {
  return parseOpenedNoteBrandingSettings({
    show: branding?.showBrandingAfterReveal === true,
    background: branding?.openedBackground ?? "same",
    showLogo: branding?.openedShowLogo !== false,
    showSenderName: branding?.openedShowSenderName !== false,
    showCompanyName: branding?.openedShowCompanyName !== false,
    showTrustMessage: branding?.openedShowTrustMessage !== false,
    bannerUrl: branding?.openedBannerUrl,
    accentColor: branding?.openedAccentColor,
    textColor: branding?.openedTextColor,
    backgroundColor: branding?.openedBackgroundColor,
    backgroundZoom: branding?.openedBackgroundZoom,
  });
}

/**
 * Projects the reveal-gate snapshot onto the opened-note page.
 * Returns undefined when after-open branding is off so screenshots stay unbranded.
 */
export function applyOpenedNoteBranding(
  gate: RevealBranding | undefined,
): RevealBranding | undefined {
  if (!gate || gate.showBrandingAfterReveal !== true) return undefined;
  const next: RevealBranding = { ...gate };
  delete next.showBrandingAfterReveal;
  delete next.openedBackground;
  delete next.openedShowLogo;
  delete next.openedShowSenderName;
  delete next.openedShowCompanyName;
  delete next.openedShowTrustMessage;
  delete next.openedBannerUrl;
  delete next.openedAccentColor;
  delete next.openedTextColor;
  delete next.openedBackgroundColor;
  delete next.openedBackgroundZoom;

  if (gate.openedShowLogo === false) {
    delete next.logoUrl;
    delete next.cardBannerUrl;
    delete next.cardImage;
  }
  if (gate.openedShowSenderName === false) {
    delete next.senderName;
    delete next.senderRole;
    delete next.sharerName;
  }
  if (gate.openedShowCompanyName === false) delete next.companyName;
  if (gate.openedShowTrustMessage === false) delete next.trustMessage;
  if (gate.openedAccentColor) next.accentColor = gate.openedAccentColor;
  if (gate.openedTextColor) next.textColor = gate.openedTextColor;

  const background = gate.openedBackground ?? "same";
  if (background === "neutral") {
    delete next.backgroundStyle;
    delete next.bannerUrl;
    if (gate.openedBackgroundColor) next.backgroundColor = gate.openedBackgroundColor;
  } else if (
    background === "gradient" ||
    background === "vignette" ||
    background === "glow" ||
    background === "mesh"
  ) {
    next.backgroundStyle = background;
    delete next.bannerUrl;
    if (gate.openedBackgroundColor) next.backgroundColor = gate.openedBackgroundColor;
  } else if (background === "banner") {
    if (gate.openedBannerUrl) next.bannerUrl = gate.openedBannerUrl;
    if (next.bannerUrl) next.backgroundStyle = "banner";
    // Absent scale keeps inheriting the reveal page's, which is what older snapshots expect.
    if (next.bannerUrl && gate.openedBackgroundZoom) next.backgroundZoom = gate.openedBackgroundZoom;
  }
  return next;
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
  | "invalid_card_position"
  | "invalid_card_image"
  | "invalid_background_fit"
  | "invalid_overlay"
  | "invalid_image_position"
  | "invalid_background_zoom"
  | "invalid_opened_note_branding";

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
  kind: "logo" | "banner" | "cardBanner" | "openedBanner",
): string | null {
  const prefix =
    kind === "logo"
      ? "account-branding/"
      : kind === "banner"
        ? "account-branding/banner/"
        : kind === "cardBanner"
          ? "account-branding/card-banner/"
          : "account-branding/opened-banner/";
  const publicPrefix =
    kind === "logo"
      ? BRANDING_LOGO_PUBLIC_PATH_PREFIX
      : kind === "banner"
        ? BRANDING_BANNER_PUBLIC_PATH_PREFIX
        : kind === "cardBanner"
          ? BRANDING_CARD_BANNER_PUBLIC_PATH_PREFIX
          : BRANDING_OPENED_BANNER_PUBLIC_PATH_PREFIX;
  if (!objectKey?.startsWith(prefix)) return null;
  const fileName = objectKey.slice(prefix.length);
  if (!BRANDING_HOSTED_ASSET_FILE.test(fileName)) return null;
  return `${publicPrefix}${fileName}`;
}

function hostedBrandingPublicPath(pathname: string): string | null | undefined {
  const prefixes = [
    BRANDING_LOGO_PUBLIC_PATH_PREFIX,
    BRANDING_BANNER_PUBLIC_PATH_PREFIX,
    BRANDING_CARD_BANNER_PUBLIC_PATH_PREFIX,
    BRANDING_OPENED_BANNER_PUBLIC_PATH_PREFIX,
  ] as const;
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

function parseOptionalBoolean(
  raw: unknown,
): { ok: true; value: boolean | null } | { ok: false } {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  if (raw === true || raw === false) return { ok: true, value: raw };
  return { ok: false };
}

function parseOpenedFields(
  body: Record<string, unknown>,
):
  | { ok: true; settings: OpenedNoteBrandingSettings }
  | { ok: false; message: string } {
  if (body.openedNote != null && typeof body.openedNote === "object" && !Array.isArray(body.openedNote)) {
    return { ok: true, settings: parseOpenedNoteBrandingSettings(body.openedNote) };
  }
  const show = parseOptionalBoolean(body.showBrandingAfterReveal);
  if (!show.ok) {
    return { ok: false, message: "showBrandingAfterReveal must be a boolean" };
  }
  const backgroundRaw = body.openedBackground;
  if (
    backgroundRaw != null &&
    backgroundRaw !== "" &&
    !OPENED_NOTE_BACKGROUNDS.includes(backgroundRaw as OpenedNoteBackground)
  ) {
    return { ok: false, message: "openedBackground must be same, neutral, gradient, vignette, glow, mesh, or banner" };
  }
  const showLogo = parseOptionalBoolean(body.openedShowLogo);
  const showSenderName = parseOptionalBoolean(body.openedShowSenderName);
  const showCompanyName = parseOptionalBoolean(body.openedShowCompanyName);
  const showTrustMessage = parseOptionalBoolean(body.openedShowTrustMessage);
  if (!showLogo.ok || !showSenderName.ok || !showCompanyName.ok || !showTrustMessage.ok) {
    return { ok: false, message: "Opened-note identity flags must be booleans" };
  }
  return {
    ok: true,
    settings: parseOpenedNoteBrandingSettings({
      show: show.value === true,
      background: backgroundRaw,
      showLogo: showLogo.value,
      showSenderName: showSenderName.value,
      showCompanyName: showCompanyName.value,
      showTrustMessage: showTrustMessage.value,
      bannerUrl: body.openedBannerUrl,
      accentColor: body.openedAccentColor,
      textColor: body.openedTextColor,
      backgroundColor: body.openedBackgroundColor,
      backgroundZoom: body.openedBackgroundZoom,
    }),
  };
}

function parseBackgroundStyle(
  raw: unknown,
): { ok: true; value: BrandingBackgroundStyle } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") return { ok: true, value: "neutral" };
  return raw === "neutral" ||
    raw === "gradient" ||
    raw === "vignette" ||
    raw === "glow" ||
    raw === "mesh" ||
    raw === "banner"
    ? { ok: true, value: raw }
    : { ok: false };
}

function parseCardPositionToken(
  raw: unknown,
): { kind: "value"; value: BrandingCardPosition } | { kind: "omitted" } | { kind: "invalid" } {
  if (raw === undefined || raw === null || raw === "") return { kind: "omitted" };
  return typeof raw === "string" && BRANDING_CARD_POSITION_SET.has(raw)
    ? { kind: "value", value: raw as BrandingCardPosition }
    : { kind: "invalid" };
}

export function brandingPageMode(
  style: BrandingBackgroundStyle | null | undefined,
): BrandingPageMode {
  return style === "banner" ? "custom" : "default";
}

/** Atmosphere applied on the Default page. Custom photography is never a filter. */
export function brandingBackgroundFilter(
  style: BrandingBackgroundStyle | null | undefined,
): BrandingBackgroundFilter {
  if (
    style === "gradient" ||
    style === "vignette" ||
    style === "glow" ||
    style === "mesh"
  ) {
    return style;
  }
  return "neutral";
}

export function brandingBackgroundStyleForPage(
  mode: BrandingPageMode,
  filter: BrandingBackgroundFilter | boolean = "neutral",
): BrandingBackgroundStyle {
  if (mode === "custom") return "banner";
  // Older call sites passed a gradient boolean.
  if (typeof filter === "boolean") return filter ? "gradient" : "neutral";
  return filter;
}

export function brandingMobileLane(position: BrandingCardPosition): BrandingMobileLane {
  const { y } = brandingCardAxis(position);
  return y === "middle" ? "center" : y;
}

export function brandingPositionFromMobileLane(lane: BrandingMobileLane): BrandingCardPosition {
  return lane;
}

/** `#ffffff` or unset means the PrivateNote canvas, not a painted page. */
export function brandingIsPrivateNoteCanvas(
  backgroundColor: string | null | undefined,
): boolean {
  if (!backgroundColor) return true;
  return backgroundColor.toLowerCase() === "#ffffff";
}

export function brandingCardAxis(position: BrandingCardPosition): BrandingCardAxis {
  switch (position) {
    case "top-left":
      return { x: "left", y: "top" };
    case "top":
      return { x: "center", y: "top" };
    case "top-right":
      return { x: "right", y: "top" };
    case "left":
      return { x: "left", y: "middle" };
    case "center":
      return { x: "center", y: "middle" };
    case "right":
      return { x: "right", y: "middle" };
    case "bottom-left":
      return { x: "left", y: "bottom" };
    case "bottom":
      return { x: "center", y: "bottom" };
    case "bottom-right":
      return { x: "right", y: "bottom" };
    default:
      return { x: "center", y: "middle" };
  }
}

export function brandingCardPercentFromPosition(position: BrandingCardPosition): {
  x: number;
  y: number;
} {
  const { x, y } = brandingCardAxis(position);
  return {
    x: x === "left" ? 0 : x === "right" ? 100 : 50,
    y: y === "top" ? 0 : y === "bottom" ? 100 : 50,
  };
}

/** Nearest 3×3 snap for a free 0–100 placement. */
export function brandingCardPositionFromPercent(x: number, y: number): BrandingCardPosition {
  const col = x <= 33 ? "left" : x >= 67 ? "right" : "center";
  const row = y <= 33 ? "top" : y >= 67 ? "bottom" : "middle";
  if (row === "top") return col === "left" ? "top-left" : col === "right" ? "top-right" : "top";
  if (row === "bottom") return col === "left" ? "bottom-left" : col === "right" ? "bottom-right" : "bottom";
  return col === "left" ? "left" : col === "right" ? "right" : "center";
}

export function brandingCardPlacePercent(
  layout: Pick<
    BrandingPortalLayout,
    "cardPosition" | "cardPositionMobile" | "cardX" | "cardY" | "cardXMobile" | "cardYMobile"
  >,
  viewport: "desktop" | "mobile",
): { x: number; y: number } {
  if (viewport === "mobile") {
    return { x: layout.cardXMobile, y: layout.cardYMobile };
  }
  return { x: layout.cardX, y: layout.cardY };
}

function parseBackgroundFit(
  raw: unknown,
): { ok: true; value: BrandingBackgroundFit } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, value: DEFAULT_BRANDING_PORTAL_LAYOUT.backgroundFit };
  }
  return raw === "fill" || raw === "fit" ? { ok: true, value: raw } : { ok: false };
}

function parseOverlay(
  raw: unknown,
): { ok: true; value: BrandingOverlay } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, value: DEFAULT_BRANDING_PORTAL_LAYOUT.overlay };
  }
  return raw === "light" || raw === "medium" || raw === "dark"
    ? { ok: true, value: raw }
    : { ok: false };
}

function parseCardImage(
  raw: unknown,
): { ok: true; value: BrandingCardImage } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, value: DEFAULT_BRANDING_PORTAL_LAYOUT.cardImage };
  }
  return raw === "logo" || raw === "banner" ? { ok: true, value: raw } : { ok: false };
}

function parseShowFlag(raw: unknown, fallback: boolean): boolean {
  if (raw === true) return true;
  if (raw === false) return false;
  return fallback;
}

function parseLayoutCardBannerUrl(raw: unknown): string | null {
  if (raw === undefined || raw === null || raw === "") return null;
  const parsed = parseBrandingLogoUrl(raw);
  return parsed.ok && parsed.value ? parsed.value : null;
}

function parseFocalPercent(
  raw: unknown,
  fallback: number,
): { ok: true; value: number } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") return { ok: true, value: fallback };
  if (typeof raw === "number") {
    if (!Number.isInteger(raw) || raw < 0 || raw > 100) return { ok: false };
    return { ok: true, value: raw };
  }
  if (typeof raw !== "string") return { ok: false };
  const trimmed = raw.trim();
  if (!/^(?:0|[1-9]\d?|100)$/.test(trimmed)) return { ok: false };
  return { ok: true, value: Number(trimmed) };
}

function parseBackgroundZoom(
  raw: unknown,
): { ok: true; value: number } | { ok: false } {
  if (raw === undefined || raw === null || raw === "") {
    return { ok: true, value: BRANDING_BACKGROUND_ZOOM_DEFAULT };
  }
  const value = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw.trim()) : NaN;
  if (!Number.isInteger(value) || value < BRANDING_BACKGROUND_ZOOM_MIN || value > BRANDING_BACKGROUND_ZOOM_MAX) {
    return { ok: false };
  }
  return { ok: true, value };
}

function parsePortalLayoutFields(body: Record<string, unknown>): {
  ok: true;
  layout: BrandingPortalLayout;
} | { ok: false; code: BrandingErrorCode; message: string } {
  const desktop = parseCardPositionToken(body.cardPosition);
  if (desktop.kind === "invalid") {
    return { ok: false, code: "invalid_card_position", message: "Card position must be a placement on the page" };
  }
  const mobile = parseCardPositionToken(body.cardPositionMobile);
  if (mobile.kind === "invalid") {
    return { ok: false, code: "invalid_card_position", message: "Mobile card position must be a placement on the page" };
  }
  const backgroundFit = parseBackgroundFit(body.backgroundFit);
  if (!backgroundFit.ok) {
    return { ok: false, code: "invalid_background_fit", message: "Background must be fill or fit" };
  }
  const overlay = parseOverlay(body.overlay);
  if (!overlay.ok) {
    return { ok: false, code: "invalid_overlay", message: "Overlay must be light, medium, or dark" };
  }
  const cardImage = parseCardImage(body.cardImage);
  if (!cardImage.ok) {
    return { ok: false, code: "invalid_card_image", message: "Card image must be logo or banner" };
  }
  const focalX = parseFocalPercent(body.focalX, DEFAULT_BRANDING_PORTAL_LAYOUT.focalX);
  const focalY = parseFocalPercent(body.focalY, DEFAULT_BRANDING_PORTAL_LAYOUT.focalY);
  if (!focalX.ok || !focalY.ok) {
    return { ok: false, code: "invalid_image_position", message: "Image position must be 0–100" };
  }
  const backgroundZoom = parseBackgroundZoom(body.backgroundZoom);
  if (!backgroundZoom.ok) {
    return {
      ok: false,
      code: "invalid_background_zoom",
      message: `Image scale must be ${BRANDING_BACKGROUND_ZOOM_MIN}–${BRANDING_BACKGROUND_ZOOM_MAX}`,
    };
  }
  const desktopPosition =
    desktop.kind === "value" ? desktop.value : DEFAULT_BRANDING_PORTAL_LAYOUT.cardPosition;
  const mobilePosition =
    mobile.kind === "value" ? mobile.value : DEFAULT_BRANDING_PORTAL_LAYOUT.cardPositionMobile;
  const desktopPlace = brandingCardPercentFromPosition(desktopPosition);
  const mobilePlace = brandingCardPercentFromPosition(mobilePosition);
  const cardX = parseFocalPercent(body.cardX, desktopPlace.x);
  const cardY = parseFocalPercent(body.cardY, desktopPlace.y);
  const cardXMobile = parseFocalPercent(body.cardXMobile, mobilePlace.x);
  const cardYMobile = parseFocalPercent(body.cardYMobile, mobilePlace.y);
  if (!cardX.ok || !cardY.ok || !cardXMobile.ok || !cardYMobile.ok) {
    return { ok: false, code: "invalid_image_position", message: "Card position must be 0–100" };
  }
  return {
    ok: true,
    layout: {
      cardPosition: desktopPosition,
      cardPositionMobile: mobilePosition,
      cardImage: cardImage.value,
      backgroundFit: backgroundFit.value,
      overlay: overlay.value,
      focalX: focalX.value,
      focalY: focalY.value,
      backgroundZoom: backgroundZoom.value,
      cardBannerUrl: parseLayoutCardBannerUrl(body.cardBannerUrl),
      cardX: cardX.value,
      cardY: cardY.value,
      cardXMobile: cardXMobile.value,
      cardYMobile: cardYMobile.value,
      showCompanyName: parseShowFlag(body.showCompanyName, true),
      showSenderName: parseShowFlag(body.showSenderName, true),
      showSenderRole: parseShowFlag(body.showSenderRole, true),
      showTrustMessage: parseShowFlag(body.showTrustMessage, true),
    },
  };
}

function parsePortalLayoutLenient(body: Record<string, unknown>): BrandingPortalLayout {
  const desktopToken = parseCardPositionToken(body.cardPosition);
  const desktop =
    desktopToken.kind === "value"
      ? desktopToken.value
      : DEFAULT_BRANDING_PORTAL_LAYOUT.cardPosition;
  const mobileToken = parseCardPositionToken(body.cardPositionMobile);
  const backgroundFit = parseBackgroundFit(body.backgroundFit);
  const overlay = parseOverlay(body.overlay);
  const cardImage = parseCardImage(body.cardImage);
  const focalX = parseFocalPercent(body.focalX, DEFAULT_BRANDING_PORTAL_LAYOUT.focalX);
  const focalY = parseFocalPercent(body.focalY, DEFAULT_BRANDING_PORTAL_LAYOUT.focalY);
  const backgroundZoom = parseBackgroundZoom(body.backgroundZoom);
  const desktopPlace = brandingCardPercentFromPosition(desktop);
  const mobilePlace = brandingCardPercentFromPosition(
    mobileToken.kind === "value" ? mobileToken.value : desktop,
  );
  const cardX = parseFocalPercent(body.cardX, desktopPlace.x);
  const cardY = parseFocalPercent(body.cardY, desktopPlace.y);
  const cardXMobile = parseFocalPercent(body.cardXMobile, mobilePlace.x);
  const cardYMobile = parseFocalPercent(body.cardYMobile, mobilePlace.y);
  return {
    cardPosition: desktop,
    cardPositionMobile: mobileToken.kind === "value" ? mobileToken.value : desktop,
    cardImage: cardImage.ok ? cardImage.value : DEFAULT_BRANDING_PORTAL_LAYOUT.cardImage,
    backgroundFit: backgroundFit.ok ? backgroundFit.value : DEFAULT_BRANDING_PORTAL_LAYOUT.backgroundFit,
    overlay: overlay.ok ? overlay.value : DEFAULT_BRANDING_PORTAL_LAYOUT.overlay,
    focalX: focalX.ok ? focalX.value : DEFAULT_BRANDING_PORTAL_LAYOUT.focalX,
    focalY: focalY.ok ? focalY.value : DEFAULT_BRANDING_PORTAL_LAYOUT.focalY,
    backgroundZoom: backgroundZoom.ok ? backgroundZoom.value : DEFAULT_BRANDING_PORTAL_LAYOUT.backgroundZoom,
    cardBannerUrl: parseLayoutCardBannerUrl(body.cardBannerUrl),
    cardX: cardX.ok ? cardX.value : desktopPlace.x,
    cardY: cardY.ok ? cardY.value : desktopPlace.y,
    cardXMobile: cardXMobile.ok ? cardXMobile.value : mobilePlace.x,
    cardYMobile: cardYMobile.ok ? cardYMobile.value : mobilePlace.y,
    showCompanyName: parseShowFlag(body.showCompanyName, true),
    showSenderName: parseShowFlag(body.showSenderName, true),
    showSenderRole: parseShowFlag(body.showSenderRole, true),
    showTrustMessage: parseShowFlag(body.showTrustMessage, true),
  };
}

export function brandingPortalLayout(
  branding:
    | Pick<
        RevealBranding,
        | "cardPosition"
        | "cardPositionMobile"
        | "cardImage"
        | "backgroundFit"
        | "overlay"
        | "focalX"
        | "focalY"
        | "backgroundZoom"
        | "cardBannerUrl"
        | "cardX"
        | "cardY"
        | "cardXMobile"
        | "cardYMobile"
        | "showCompanyName"
        | "showSenderName"
        | "showSenderRole"
        | "showTrustMessage"
      >
    | undefined,
): BrandingPortalLayout {
  return parsePortalLayoutLenient({
    cardPosition: branding?.cardPosition,
    cardPositionMobile: branding?.cardPositionMobile,
    cardImage: branding?.cardImage,
    backgroundFit: branding?.backgroundFit,
    overlay: branding?.overlay,
    focalX: branding?.focalX,
    focalY: branding?.focalY,
    backgroundZoom: branding?.backgroundZoom,
    cardBannerUrl: branding?.cardBannerUrl,
    cardX: branding?.cardX,
    cardY: branding?.cardY,
    cardXMobile: branding?.cardXMobile,
    cardYMobile: branding?.cardYMobile,
    showCompanyName: branding?.showCompanyName,
    showSenderName: branding?.showSenderName,
    showSenderRole: branding?.showSenderRole,
    showTrustMessage: branding?.showTrustMessage,
  });
}

export function brandingOverlayOpacity(branding: RevealBranding | undefined): number {
  return BRANDING_OVERLAY_OPACITY[brandingPortalLayout(branding).overlay];
}

export function parseStoredPortalLayoutJson(raw: string | null | undefined): BrandingPortalLayout {
  if (!raw || typeof raw !== "string") return { ...DEFAULT_BRANDING_PORTAL_LAYOUT };
  try {
    const value = JSON.parse(raw) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ...DEFAULT_BRANDING_PORTAL_LAYOUT };
    }
    const parsed = parsePortalLayoutLenient(value as Record<string, unknown>);
    return parsed;
  } catch {
    return { ...DEFAULT_BRANDING_PORTAL_LAYOUT };
  }
}

export function stringifyPortalLayout(layout: BrandingPortalLayout): string {
  return JSON.stringify(layout);
}

export function parseBusinessPortalLayoutInput(
  raw: unknown,
): { ok: true; layout: BrandingPortalLayout } | { ok: false; message: string } {
  if (raw == null) return { ok: true, layout: { ...DEFAULT_BRANDING_PORTAL_LAYOUT } };
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, message: "Portal layout must be an object" };
  }
  const parsed = parsePortalLayoutFields(raw as Record<string, unknown>);
  if (!parsed.ok) return { ok: false, message: parsed.message };
  return { ok: true, layout: parsed.layout };
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
 * Cover-crop style for a custom recipient photograph. Applied to a dedicated
 * `<img>` so the URL never enters a CSS `url()` string.
 */
export function brandingBannerStyle(
  branding: RevealBranding | undefined,
): BrandingHeroStyle | undefined {
  if (!brandingShowsBanner(branding) || !branding?.bannerUrl) return undefined;
  const layout = brandingPortalLayout(branding);
  const zoomed = layout.backgroundZoom !== BRANDING_BACKGROUND_ZOOM_DEFAULT;
  return {
    backgroundImage: `url(${branding.bannerUrl})`,
    backgroundSize: layout.backgroundFit === "fit" && !zoomed ? "contain" : "cover",
    backgroundPosition: `${layout.focalX}% ${layout.focalY}%`,
  };
}

function gradientWashColor(branding: RevealBranding): string {
  if (branding.backgroundColor && !brandingIsPrivateNoteCanvas(branding.backgroundColor)) {
    return branding.backgroundColor;
  }
  return brandingRelativeLuminance(branding.accentColor ?? "#2563eb") > 0.45
    ? "#f8fafc"
    : "#eef2ff";
}

/** Append a 2-digit hex alpha to a #rrggbb colour. */
function withHexAlpha(hex: string, alpha: string): string {
  const normalized = hex.startsWith("#") ? hex : `#${hex}`;
  if (/^#[0-9a-fA-F]{6}$/.test(normalized)) return `${normalized}${alpha}`;
  return normalized;
}

/**
 * Default-page atmosphere. Accents always tint the wash — never the page colour
 * itself — so a solid green page still shows a visible Soft wash / Glow / Mesh.
 */
function brandFilterBackground(
  filter: BrandingBackgroundFilter,
  accent: string,
  wash: string,
): string {
  switch (filter) {
    case "gradient":
      return [
        `radial-gradient(ellipse 85% 60% at 8% -5%, ${withHexAlpha(accent, "73")} 0%, transparent 58%)`,
        `radial-gradient(ellipse 75% 55% at 95% 105%, ${withHexAlpha(accent, "59")} 0%, transparent 52%)`,
        `linear-gradient(180deg, ${wash} 0%, ${wash} 100%)`,
      ].join(", ");
    case "vignette":
      return [
        `radial-gradient(ellipse 72% 68% at 50% 42%, transparent 35%, ${withHexAlpha(accent, "40")} 100%)`,
        `linear-gradient(180deg, ${wash} 0%, ${wash} 100%)`,
      ].join(", ");
    case "glow":
      return [
        `radial-gradient(circle at 50% 32%, ${withHexAlpha(accent, "66")} 0%, transparent 52%)`,
        `radial-gradient(ellipse 95% 55% at 50% 110%, ${withHexAlpha(accent, "33")} 0%, transparent 58%)`,
        `linear-gradient(180deg, ${wash} 0%, ${wash} 100%)`,
      ].join(", ");
    case "mesh":
      return [
        `radial-gradient(at 12% 18%, ${withHexAlpha(accent, "80")} 0px, transparent 42%)`,
        `radial-gradient(at 88% 12%, ${withHexAlpha(accent, "59")} 0px, transparent 40%)`,
        `radial-gradient(at 72% 82%, ${withHexAlpha(accent, "4d")} 0px, transparent 44%)`,
        `radial-gradient(at 18% 88%, ${withHexAlpha(accent, "40")} 0px, transparent 40%)`,
        `linear-gradient(180deg, ${wash} 0%, ${wash} 100%)`,
      ].join(", ");
    default:
      return `linear-gradient(180deg, ${wash} 0%, ${wash} 100%)`;
  }
}

/**
 * Full-viewport recipient background. Custom images are atmospheric; copy never
 * sits on the photograph. Filters and solid colour are generated from the
 * stored brand colours.
 */
export function brandingPageBackground(
  branding: RevealBranding | undefined,
): BrandingPageBackground {
  if (!branding) return { kind: "none" };
  if (brandingShowsBanner(branding) && branding.bannerUrl) {
    return { kind: "image", url: branding.bannerUrl };
  }
  const filter = brandingBackgroundFilter(branding.backgroundStyle);
  const wash = gradientWashColor(branding);
  const accent = branding.accentColor ?? "#2563eb";
  if (filter !== "neutral") {
    return {
      kind: "gradient",
      background: brandFilterBackground(filter, accent, wash),
    };
  }
  if (branding.backgroundColor && !brandingIsPrivateNoteCanvas(branding.backgroundColor)) {
    return { kind: "color", backgroundColor: branding.backgroundColor };
  }
  return { kind: "none" };
}

/** True when branding is present: Default and Custom both use a reveal card. */
export function brandingUsesPortalSurface(branding: RevealBranding | undefined): boolean {
  return Boolean(branding);
}

type BrandingCardMarkSource = Pick<
  RevealBranding,
  "logoUrl" | "bannerUrl" | "cardBannerUrl" | "cardImage" | "senderName" | "companyName"
>;

/** Image shown on the reveal card. Page photography (`bannerUrl`) stays behind the card. */
export function brandingCardMarkUrl(
  branding: BrandingCardMarkSource | undefined,
): string | undefined {
  if (branding?.cardImage === "banner") {
    return branding.cardBannerUrl || branding.logoUrl;
  }
  return branding?.logoUrl;
}

/** True when the reveal card shows a wide lockup instead of a square mark. */
export function brandingCardMarkIsBanner(
  branding: BrandingCardMarkSource | undefined,
): boolean {
  return branding?.cardImage === "banner" && Boolean(brandingCardMarkUrl(branding));
}

/** Logo is the only sender identity — no name or company to sit beside it. */
export function brandingLogoIsSolo(branding: BrandingCardMarkSource | undefined): boolean {
  if (!brandingCardMarkUrl(branding)) return false;
  return !branding?.senderName?.trim() && !branding?.companyName?.trim();
}

/**
 * Reveal-card logo size. A square mark next to a name stays ~64px. A logo with
 * no names reads larger, and a wide banner lockup larger still on desktop.
 */
export function brandingRevealLogoClassName(
  branding: BrandingCardMarkSource | undefined,
  options?: { preview?: boolean },
): string {
  const banner = brandingCardMarkIsBanner(branding);
  const large = brandingLogoIsSolo(branding) || banner;
  if (options?.preview) {
    return large
      ? "mx-auto max-h-8 w-auto max-w-[7rem] object-contain"
      : "mx-auto max-h-6 w-auto max-w-16 object-contain";
  }
  // A 3:1 lockup reads poorly at logo height, so it gets extra room on desktop only.
  if (banner) return "mx-auto max-h-16 w-auto max-w-full object-contain sm:max-h-32";
  return large
    ? "mx-auto max-h-16 w-auto max-w-full object-contain sm:max-h-20"
    : "mx-auto max-h-12 w-auto max-w-full object-contain sm:max-h-14";
}

/**
 * Page-level wash behind the reveal hero. Kept for older snapshots that still
 * tint a bounded hero; the recipient portal prefers `brandingPageBackground`.
 */
export function brandingHeroStyle(
  branding: RevealBranding | undefined,
): BrandingHeroStyle | undefined {
  if (!branding) return undefined;
  const filter = brandingBackgroundFilter(branding.backgroundStyle);
  if (filter !== "neutral") {
    return {
      background: brandFilterBackground(
        filter,
        branding.accentColor ?? "#2563eb",
        gradientWashColor(branding),
      ),
    };
  }
  if (branding.backgroundColor && !brandingIsPrivateNoteCanvas(branding.backgroundColor)) {
    return { backgroundColor: branding.backgroundColor };
  }
  return undefined;
}

export function brandingHeroUsesLightText(branding: RevealBranding | undefined): boolean {
  return brandingChromeUsesLightText(branding);
}

/** Chrome (PrivateNote mark, language, footer) over the page background. */
export function brandingChromeUsesLightText(branding: RevealBranding | undefined): boolean {
  const page = brandingPageBackground(branding);
  if (page.kind === "image") return true;
  if (page.kind === "color") return contrastingTextOn(page.backgroundColor) === "#ffffff";
  if (page.kind === "gradient") {
    const wash = branding ? gradientWashColor(branding) : "#f8fafc";
    return contrastingTextOn(wash) === "#ffffff";
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
      message: "Background style must be neutral, gradient, vignette, glow, mesh, or banner" };
  }
  const layout = parsePortalLayoutFields(body);
  if (!layout.ok) {
    return { ok: false, code: layout.code, status: 400, message: layout.message };
  }

  const opened = parseOpenedFields(body);
  if (!opened.ok) {
    return {
      ok: false,
      code: "invalid_opened_note_branding",
      status: 400,
      message: opened.message,
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
      cardBannerUrl: layout.layout.cardBannerUrl,
      accentColor: accentColor.value,
      backgroundColor: backgroundColor.value,
      textColor: textColor.value,
      backgroundStyle: backgroundStyle.value,
      cardPosition: layout.layout.cardPosition,
      cardPositionMobile: layout.layout.cardPositionMobile,
      cardImage: layout.layout.cardImage,
      backgroundFit: layout.layout.backgroundFit,
      overlay: layout.layout.overlay,
      focalX: layout.layout.focalX,
      focalY: layout.layout.focalY,
      backgroundZoom: layout.layout.backgroundZoom,
      cardX: layout.layout.cardX,
      cardY: layout.layout.cardY,
      cardXMobile: layout.layout.cardXMobile,
      cardYMobile: layout.layout.cardYMobile,
      showCompanyName: layout.layout.showCompanyName,
      showSenderName: layout.layout.showSenderName,
      showSenderRole: layout.layout.showSenderRole,
      showTrustMessage: layout.layout.showTrustMessage,
      showBrandingAfterReveal: opened.settings.show,
      openedBackground: opened.settings.background,
      openedShowLogo: opened.settings.showLogo,
      openedShowSenderName: opened.settings.showSenderName,
      openedShowCompanyName: opened.settings.showCompanyName,
      openedShowTrustMessage: opened.settings.showTrustMessage,
      openedBannerUrl: opened.settings.bannerUrl,
      openedAccentColor: opened.settings.accentColor,
      openedTextColor: opened.settings.textColor,
      openedBackgroundColor: opened.settings.backgroundColor,
      openedBackgroundZoom: opened.settings.backgroundZoom,
    },
  };
}

export function brandingIsEmpty(branding: BusinessBranding | null | undefined): boolean {
  if (!branding) return true;
  return (
    !branding.companyName && !branding.senderName && !branding.senderRole &&
    !branding.trustMessage && !branding.logoUrl && !branding.bannerUrl && !branding.cardBannerUrl &&
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
  const layout = brandingPortalLayout({
    cardPosition: branding.cardPosition ?? undefined,
    cardPositionMobile: branding.cardPositionMobile ?? undefined,
    cardImage: branding.cardImage ?? undefined,
    cardBannerUrl: branding.cardBannerUrl ?? undefined,
    backgroundFit: branding.backgroundFit ?? undefined,
    overlay: branding.overlay ?? undefined,
    focalX: branding.focalX ?? undefined,
    focalY: branding.focalY ?? undefined,
    backgroundZoom: branding.backgroundZoom ?? undefined,
    cardX: branding.cardX ?? undefined,
    cardY: branding.cardY ?? undefined,
    cardXMobile: branding.cardXMobile ?? undefined,
    cardYMobile: branding.cardYMobile ?? undefined,
    showCompanyName: branding.showCompanyName ?? undefined,
    showSenderName: branding.showSenderName ?? undefined,
    showSenderRole: branding.showSenderRole ?? undefined,
    showTrustMessage: branding.showTrustMessage ?? undefined,
  });
  const defaults = DEFAULT_BRANDING_PORTAL_LAYOUT;
  const desktopPlace = brandingCardPercentFromPosition(layout.cardPosition);
  const mobilePlace = brandingCardPercentFromPosition(layout.cardPositionMobile);
  return {
    ...(branding.companyName && layout.showCompanyName ? { companyName: branding.companyName } : {}),
    ...(branding.senderName && layout.showSenderName ? { senderName: branding.senderName } : {}),
    ...(branding.senderRole && layout.showSenderRole ? { senderRole: branding.senderRole } : {}),
    ...(branding.trustMessage && layout.showTrustMessage ? { trustMessage: branding.trustMessage } : {}),
    ...(branding.logoUrl ? { logoUrl: branding.logoUrl } : {}),
    ...(branding.bannerUrl ? { bannerUrl: branding.bannerUrl } : {}),
    ...(branding.cardBannerUrl ? { cardBannerUrl: branding.cardBannerUrl } : {}),
    ...(branding.accentColor ? { accentColor: branding.accentColor } : {}),
    ...(branding.backgroundColor ? { backgroundColor: branding.backgroundColor } : {}),
    ...(branding.textColor ? { textColor: branding.textColor } : {}),
    ...(branding.backgroundStyle && branding.backgroundStyle !== "neutral"
      ? { backgroundStyle: branding.backgroundStyle }
      : {}),
    ...(layout.cardPosition !== defaults.cardPosition ? { cardPosition: layout.cardPosition } : {}),
    ...(layout.cardPositionMobile !== layout.cardPosition
      ? { cardPositionMobile: layout.cardPositionMobile }
      : {}),
    ...(layout.cardImage !== defaults.cardImage ? { cardImage: layout.cardImage } : {}),
    ...(layout.backgroundFit !== defaults.backgroundFit ? { backgroundFit: layout.backgroundFit } : {}),
    ...(layout.overlay !== defaults.overlay ? { overlay: layout.overlay } : {}),
    ...(layout.focalX !== defaults.focalX ? { focalX: layout.focalX } : {}),
    ...(layout.focalY !== defaults.focalY ? { focalY: layout.focalY } : {}),
    ...(layout.backgroundZoom !== defaults.backgroundZoom ? { backgroundZoom: layout.backgroundZoom } : {}),
    ...(layout.cardX !== desktopPlace.x ? { cardX: layout.cardX } : {}),
    ...(layout.cardY !== desktopPlace.y ? { cardY: layout.cardY } : {}),
    ...(layout.cardXMobile !== mobilePlace.x ? { cardXMobile: layout.cardXMobile } : {}),
    ...(layout.cardYMobile !== mobilePlace.y ? { cardYMobile: layout.cardYMobile } : {}),
    ...(branding.showBrandingAfterReveal === true ? { showBrandingAfterReveal: true } : {}),
    ...(branding.showBrandingAfterReveal === true &&
    branding.openedBackground &&
    branding.openedBackground !== "same"
      ? { openedBackground: branding.openedBackground }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedShowLogo === false
      ? { openedShowLogo: false }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedShowSenderName === false
      ? { openedShowSenderName: false }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedShowCompanyName === false
      ? { openedShowCompanyName: false }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedShowTrustMessage === false
      ? { openedShowTrustMessage: false }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedBannerUrl
      ? { openedBannerUrl: branding.openedBannerUrl }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedAccentColor
      ? { openedAccentColor: branding.openedAccentColor }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedTextColor
      ? { openedTextColor: branding.openedTextColor }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedBackgroundColor
      ? { openedBackgroundColor: branding.openedBackgroundColor }
      : {}),
    ...(branding.showBrandingAfterReveal === true && branding.openedBackgroundZoom
      ? { openedBackgroundZoom: branding.openedBackgroundZoom }
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
  const layout = parsePortalLayoutLenient(source);
  const opened = parseOpenedFields(source);
  const openedSettings = opened.ok ? opened.settings : DEFAULT_OPENED_NOTE_BRANDING;

  return toRevealBranding({
    companyName: companyName.ok ? companyName.value : null,
    senderName: senderName.ok ? senderName.value : null,
    senderRole: senderRole.ok ? senderRole.value : null,
    trustMessage: trustMessage.ok ? trustMessage.value : null,
    logoUrl: logoUrl.ok ? logoUrl.value : null,
    bannerUrl: bannerUrl.ok ? bannerUrl.value : null,
    cardBannerUrl: layout.cardBannerUrl,
    accentColor: accentColor.ok ? accentColor.value : null,
    backgroundColor: backgroundColor.ok ? backgroundColor.value : null,
    textColor: textColor.ok ? textColor.value : null,
    backgroundStyle: backgroundStyle.ok ? backgroundStyle.value : "neutral",
    cardPosition: layout.cardPosition,
    cardPositionMobile: layout.cardPositionMobile,
    cardImage: layout.cardImage,
    backgroundFit: layout.backgroundFit,
    overlay: layout.overlay,
    focalX: layout.focalX,
    focalY: layout.focalY,
    backgroundZoom: layout.backgroundZoom,
    cardX: layout.cardX,
    cardY: layout.cardY,
    cardXMobile: layout.cardXMobile,
    cardYMobile: layout.cardYMobile,
    showCompanyName: layout.showCompanyName,
    showSenderName: layout.showSenderName,
    showSenderRole: layout.showSenderRole,
    showTrustMessage: layout.showTrustMessage,
    showBrandingAfterReveal: openedSettings.show,
    openedBackground: openedSettings.background,
    openedShowLogo: openedSettings.showLogo,
    openedShowSenderName: openedSettings.showSenderName,
    openedShowCompanyName: openedSettings.showCompanyName,
    openedShowTrustMessage: openedSettings.showTrustMessage,
    openedBannerUrl: openedSettings.bannerUrl,
    openedAccentColor: openedSettings.accentColor,
    openedTextColor: openedSettings.textColor,
    openedBackgroundColor: openedSettings.backgroundColor,
    openedBackgroundZoom: openedSettings.backgroundZoom,
  });
}
