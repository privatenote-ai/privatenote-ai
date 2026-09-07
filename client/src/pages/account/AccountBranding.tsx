import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useAccountEntitlements } from "@/context/AccountEntitlementsContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, apiUploadRequest, ApiRequestError } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import {
  Monitor,
  Smartphone,
  ImageIcon,
  Upload,
  Trash2,
  Unlock,
  Crown,
} from "lucide-react";
import {
  BRANDING_BANNER_ASPECT_RATIO,
  BRANDING_BANNER_MAX_BYTES,
  BRANDING_BANNER_RECOMMENDED_PX,
  BRANDING_BANNER_SIZE_LABEL,
  BRANDING_CARD_BANNER_SIZE_LABEL,
  BRANDING_LOGO_MAX_BYTES,
  BRANDING_LOGO_RECOMMENDED_PX,
  BRANDING_BACKGROUND_ZOOM_MAX,
  BRANDING_BACKGROUND_ZOOM_MIN,
  brandingBackgroundStyleForPage,
  brandingCardMarkUrl,
  brandingCtaStyle,
  brandingIsPrivateNoteCanvas,
  brandingMobileLane,
  brandingPageMode,
  brandingPositionFromMobileLane,
  brandingRevealLogoClassName,
  brandingUsesPortalSurface,
  contrastingTextOn,
  DEFAULT_BRANDING_PORTAL_LAYOUT,
  DEFAULT_OPENED_NOTE_BRANDING,
  parseBrandingHexColor,
  parseStoredPortalLayoutJson,
  parseOpenedNoteBrandingSettings,
  brandingPortalLayout,
  applyOpenedNoteBranding,
  type BrandingCardPosition,
  type BrandingMobileLane,
  type BrandingOverlay,
  type BrandingPortalLayout,
  type OpenedNoteBrandingSettings,
  type RevealBranding,
} from "@shared/businessBranding";
import { RecipientPortal, RevealHandoffStack } from "@/components/note/RecipientPortal";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_BRAND_COLOR = "#2563eb";
const BRANDING_AUTOSAVE_MS = 650;

type BrandingAutosavePayload = {
  businessDisplayName: string;
  businessAccentColor: string;
  businessBackgroundColor: string;
  businessTextColor: string;
  businessSenderName: string;
  businessSenderRole: string;
  businessTrustMessage: string;
  businessBackgroundStyle: "neutral" | "gradient" | "banner";
  businessPortalLayout: BrandingPortalLayout;
  businessOpenedBranding: OpenedNoteBrandingSettings;
};

function brandingAutosaveKey(payload: BrandingAutosavePayload): string {
  return JSON.stringify(payload);
}

/** `#rgb` / `#rrggbb`, or the same digits without `#`. */
function normalizeBrandColorInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  const parsed = parseBrandingHexColor(withHash);
  return parsed.ok && parsed.value ? parsed.value : null;
}

function ColorField({
  id,
  label,
  value,
  draft,
  onValue,
  onDraft,
}: {
  id: string;
  label: string;
  value: string;
  draft: string;
  onValue: (next: string) => void;
  onDraft: (next: string) => void;
}) {
  const valid = normalizeBrandColorInput(draft) != null;
  return (
    <div>
      <Label htmlFor={`${id}-hex`} className="mb-2 block text-sm">
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="color"
          value={value}
          aria-label={label}
          onChange={(event) => {
            const next = event.target.value;
            onValue(next);
            onDraft(next);
          }}
          className="h-10 w-12 shrink-0 cursor-pointer rounded border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
        />
        <input
          id={`${id}-hex`}
          value={draft}
          onChange={(event) => {
            const next = event.target.value;
            onDraft(next);
            const parsed = normalizeBrandColorInput(next);
            if (parsed) onValue(parsed);
          }}
          onBlur={() => onDraft(value)}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          inputMode="text"
          maxLength={7}
          aria-invalid={!valid}
          className={`w-32 rounded-md border bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900 ${
            valid ? "border-gray-300 dark:border-gray-700" : "border-red-400 dark:border-red-500"
          }`}
        />
      </div>
    </div>
  );
}
const BrandingPreview: React.FC<{
  branding: RevealBranding;
  viewport: "desktop" | "mobile";
}> = ({ branding, viewport }) => {
  const compact = brandingUsesPortalSurface(branding);
  const buttonStyle = brandingCtaStyle(branding);
  const markUrl = brandingCardMarkUrl(branding);
  const logo = markUrl ? (
    <img
      src={markUrl}
      alt=""
      className={brandingRevealLogoClassName(branding, { preview: true })}
    />
  ) : null;
  const sender = branding.senderName?.trim();
  const company = branding.companyName?.trim();
  const brandingLine = sender && company
    ? `${sender} from ${company} shared a private note`
    : sender
      ? `Shared by ${sender}`
      : company
        ? `Shared by ${company}`
        : null;

  return (
    <RecipientPortal
      preview
      previewViewport={viewport}
      branding={branding}
      language="en"
      t={{
        revealTrustEncrypted: "End-to-end encrypted",
        revealTrustNoAccount: "No account required",
        revealSecuredByPrivateNote: "Secured by PrivateNote",
        language: "Language",
      }}
      surface={compact ? "card" : "plain"}
    >
      <RevealHandoffStack
        compact={compact}
        branding={branding}
        brandingLine={brandingLine}
        logo={logo}
        title={compact ? undefined : "Reveal Private Note"}
        action={
          <button
            type="button"
            className="inline-flex w-full max-w-xs items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold"
            style={buttonStyle}
          >
            <Unlock className="mr-2 h-4 w-4" />
            Reveal note
          </button>
        }
        footnote={compact ? "Deleted after opening" : undefined}
      />
    </RecipientPortal>
  );
};

const OpenedNoteBrandingPreview: React.FC<{
  branding: RevealBranding | undefined;
  viewport: "desktop" | "mobile";
}> = ({ branding, viewport }) => {
  const compact = brandingUsesPortalSurface(branding);
  const sender = branding?.senderName?.trim();
  const company = branding?.companyName?.trim();
  const brandingLine = sender && company
    ? `${sender} from ${company} shared a private note`
    : sender
      ? `Shared by ${sender}`
      : company
        ? `Shared by ${company}`
        : null;
  const markUrl = brandingCardMarkUrl(branding);

  return (
    <RecipientPortal
      preview
      previewViewport={viewport}
      branding={branding}
      language="en"
      t={{
        revealTrustEncrypted: "End-to-end encrypted",
        revealTrustNoAccount: "No account required",
        revealSecuredByPrivateNote: "Secured by PrivateNote",
        language: "Language",
      }}
      surface={compact ? "wide" : "plain"}
    >
      <div className="text-center">
        {markUrl || brandingLine || branding?.trustMessage ? (
          <div className="mb-4 flex flex-col items-center gap-1.5">
            {markUrl ? (
              <img src={markUrl} alt="" className="max-h-8 max-w-28 object-contain" />
            ) : null}
            {brandingLine ? (
              <p className="m-0 text-xs font-medium text-gray-700 dark:text-gray-200">{brandingLine}</p>
            ) : null}
            {branding?.trustMessage ? (
              <p className="m-0 max-w-xs text-[11px] leading-snug text-gray-500 dark:text-gray-400">
                {branding.trustMessage}
              </p>
            ) : null}
          </div>
        ) : null}
        <p className="m-0 text-[10px] font-medium text-amber-800 dark:text-amber-200">
          This note will be deleted after you leave…
        </p>
        <div className="mx-auto mt-4 max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100">
          Secret content
        </div>
      </div>
    </RecipientPortal>
  );
};

function BrandingPageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-300">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
          {title}
        </h3>
        <p className="mt-1 max-w-xl text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {actions}
    </div>
  );
}

function ChoiceRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string }>;
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      <div className="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              value === option.id
                ? "bg-primary/10 text-primary"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const CARD_POSITION_CELLS: Array<{ id: BrandingCardPosition; label: string }> = [
  { id: "top-left", label: "Top left" },
  { id: "top", label: "Top" },
  { id: "top-right", label: "Top right" },
  { id: "left", label: "Left" },
  { id: "center", label: "Center" },
  { id: "right", label: "Right" },
  { id: "bottom-left", label: "Bottom left" },
  { id: "bottom", label: "Bottom" },
  { id: "bottom-right", label: "Bottom right" },
];

function CardPositionPad({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BrandingCardPosition;
  onChange: (id: BrandingCardPosition) => void;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      <div
        className="grid w-[6.75rem] grid-cols-3 gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700"
        role="radiogroup"
        aria-label={label}
      >
        {CARD_POSITION_CELLS.map((cell) => {
          const selected = value === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={cell.label}
              title={cell.label}
              onClick={() => onChange(cell.id)}
              className={`h-7 rounded-md ${
                selected
                  ? "bg-primary shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function MobileLanePad({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BrandingCardPosition;
  onChange: (id: BrandingCardPosition) => void;
}) {
  const lane = brandingMobileLane(value);
  const cells: Array<{ id: BrandingMobileLane; label: string }> = [
    { id: "top", label: "Top" },
    { id: "center", label: "Center" },
    { id: "bottom", label: "Bottom" },
  ];
  return (
    <div>
      <Label className="mb-2 block text-sm">{label}</Label>
      <div
        className="grid w-[2.25rem] grid-rows-3 gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700"
        role="radiogroup"
        aria-label={label}
      >
        {cells.map((cell) => {
          const selected = lane === cell.id;
          return (
            <button
              key={cell.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={cell.label}
              title={cell.label}
              onClick={() => onChange(brandingPositionFromMobileLane(cell.id))}
              className={`h-7 w-7 rounded-md ${
                selected
                  ? "bg-primary shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function describeApiPreferenceError(error: unknown): string {
  if (!(error instanceof ApiRequestError)) return "Something went wrong.";
  try {
    const parsed = JSON.parse(error.bodyText) as { message?: unknown };
    if (typeof parsed.message === "string" && parsed.message.trim() !== "") {
      return parsed.message;
    }
  } catch {
    /* ignore */
  }
  if (error.bodyText.includes("migrations")) return "Server may need updates.";
  return `Error ${error.status}. Try again in a moment.`;
}


export default function AccountBranding() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const {
    entitlements: accountEntitlements,
    refreshEntitlements,
  } = useAccountEntitlements();
  const { t } = useLanguage();
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [businessDisplayName, setBusinessDisplayName] = useState("");
  const [businessAccentColor, setBusinessAccentColor] = useState(DEFAULT_BRAND_COLOR);
  const [businessAccentColorDraft, setBusinessAccentColorDraft] = useState(DEFAULT_BRAND_COLOR);
  const [businessBackgroundColor, setBusinessBackgroundColor] = useState("#ffffff");
  const [businessBackgroundColorDraft, setBusinessBackgroundColorDraft] = useState("#ffffff");
  const [businessTextColor, setBusinessTextColor] = useState("#ffffff");
  const [businessTextColorDraft, setBusinessTextColorDraft] = useState("#ffffff");
  const [businessLogoUrl, setBusinessLogoUrl] = useState<string | null>(null);
  const [businessSenderName, setBusinessSenderName] = useState("");
  const [businessSenderRole, setBusinessSenderRole] = useState("");
  const [businessTrustMessage, setBusinessTrustMessage] = useState("");
  const [businessBannerUrl, setBusinessBannerUrl] = useState<string | null>(null);
  const [businessBackgroundStyle, setBusinessBackgroundStyle] =
    useState<"neutral" | "gradient" | "banner">("neutral");
  const [portalLayout, setPortalLayout] = useState<BrandingPortalLayout>({
    ...DEFAULT_BRANDING_PORTAL_LAYOUT,
  });
  const [brandingPreviewViewport, setBrandingPreviewViewport] =
    useState<"desktop" | "mobile">("desktop");
  const [openedNoteBranding, setOpenedNoteBranding] =
    useState<OpenedNoteBrandingSettings>({ ...DEFAULT_OPENED_NOTE_BRANDING });
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [removingLogo, setRemovingLogo] = useState(false);
  const [savedBrandingIndicator, setSavedBrandingIndicator] = useState(false);
  const brandingHydratedRef = useRef(false);
  const skipBrandingAutosaveRef = useRef(false);
  const brandingSaveTimerRef = useRef<number | null>(null);
  const savedBrandingTimeoutRef = useRef<number | null>(null);
  const lastSavedBrandingKeyRef = useRef("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const data = await apiRequest<{
        ok: boolean;
        businessDisplayName?: string | null;
        businessLogoUrl?: string | null;
        businessAccentColor?: string | null;
        businessBackgroundColor?: string | null;
        businessTextColor?: string | null;
        businessSenderName?: string | null;
        businessSenderRole?: string | null;
        businessTrustMessage?: string | null;
        businessBannerUrl?: string | null;
        businessBackgroundStyle?: "neutral" | "gradient" | "banner";
        businessPortalLayout?: BrandingPortalLayout | string | null;
        businessOpenedBranding?: OpenedNoteBrandingSettings | string | null;
      }>("/api/auth/account/summary", "GET");
      if (data.ok) {
        setBusinessDisplayName(data.businessDisplayName ?? "");
        setBusinessLogoUrl(data.businessLogoUrl ?? null);
        const accent = data.businessAccentColor ?? DEFAULT_BRAND_COLOR;
        setBusinessAccentColor(accent);
        setBusinessAccentColorDraft(accent);
        setBusinessBackgroundColor(data.businessBackgroundColor ?? "#ffffff");
        setBusinessBackgroundColorDraft(data.businessBackgroundColor ?? "#ffffff");
        const text = data.businessTextColor ?? contrastingTextOn(accent);
        setBusinessTextColor(text);
        setBusinessTextColorDraft(text);
        setBusinessSenderName(data.businessSenderName ?? "");
        setBusinessSenderRole(data.businessSenderRole ?? "");
        setBusinessTrustMessage(data.businessTrustMessage ?? "");
        setBusinessBannerUrl(data.businessBannerUrl ?? null);
        setBusinessBackgroundStyle(data.businessBackgroundStyle ?? "neutral");
        setPortalLayout(
          typeof data.businessPortalLayout === "string"
            ? parseStoredPortalLayoutJson(data.businessPortalLayout)
            : brandingPortalLayout(data.businessPortalLayout ?? undefined),
        );
        setOpenedNoteBranding(parseOpenedNoteBrandingSettings(data.businessOpenedBranding));
      }
    } catch {
      /* non-critical */
    } finally {
      setPrefsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setPrefsLoading(false); return; }
    void loadSummary();
  }, [authLoading, user, loadSummary]);

  const saveBrandingDefaults = useCallback(async (payload: BrandingAutosavePayload) => {
    const key = brandingAutosaveKey(payload);
    if (!user) return;
    if (key === lastSavedBrandingKeyRef.current) return;
    setSavingBranding(true);
    try {
      const response = await apiRequest<{
        businessDisplayName: string | null;
        businessAccentColor: string | null;
        businessBackgroundColor: string | null;
        businessTextColor: string | null;
        businessPortalLayout?: BrandingPortalLayout;
      }>("/api/auth/account/preferences", "PATCH", payload);
      skipBrandingAutosaveRef.current = true;
      lastSavedBrandingKeyRef.current = key;
      setBusinessDisplayName(response.businessDisplayName ?? "");
      const accent = response.businessAccentColor ?? DEFAULT_BRAND_COLOR;
      setBusinessAccentColor(accent);
      setBusinessAccentColorDraft(accent);
      setBusinessBackgroundColor(response.businessBackgroundColor ?? "#ffffff");
      setBusinessBackgroundColorDraft(response.businessBackgroundColor ?? "#ffffff");
      const text =
        response.businessTextColor
          ?? contrastingTextOn(accent);
      setBusinessTextColor(text);
      setBusinessTextColorDraft(text);
      if (response.businessPortalLayout) {
        setPortalLayout(brandingPortalLayout(response.businessPortalLayout));
      }
      if (savedBrandingTimeoutRef.current) {
        window.clearTimeout(savedBrandingTimeoutRef.current);
      }
      setSavedBrandingIndicator(true);
      savedBrandingTimeoutRef.current = window.setTimeout(() => {
        setSavedBrandingIndicator(false);
      }, 2000);
      await refreshEntitlements();
    } catch (error) {
      toast({
        title: "Could not save branding",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setSavingBranding(false);
    }
  }, [refreshEntitlements, toast, user]);

  useEffect(() => {
    if (prefsLoading || authLoading || !user) return;
    if (!accountEntitlements.capabilities.revealBranding) {
      brandingHydratedRef.current = false;
      return;
    }
    const payload: BrandingAutosavePayload = {
      businessDisplayName,
      businessAccentColor,
      businessBackgroundColor,
      businessTextColor,
      businessSenderName,
      businessSenderRole,
      businessTrustMessage,
      businessBackgroundStyle,
      businessPortalLayout: portalLayout,
      businessOpenedBranding: openedNoteBranding,
    };
    const key = brandingAutosaveKey(payload);
    if (!brandingHydratedRef.current) {
      lastSavedBrandingKeyRef.current = key;
      brandingHydratedRef.current = true;
      return;
    }
    if (skipBrandingAutosaveRef.current) {
      skipBrandingAutosaveRef.current = false;
      lastSavedBrandingKeyRef.current = key;
      return;
    }
    if (key === lastSavedBrandingKeyRef.current) return;
    if (brandingSaveTimerRef.current) window.clearTimeout(brandingSaveTimerRef.current);
    brandingSaveTimerRef.current = window.setTimeout(() => {
      void saveBrandingDefaults(payload);
    }, BRANDING_AUTOSAVE_MS);
    return () => {
      if (brandingSaveTimerRef.current) {
        window.clearTimeout(brandingSaveTimerRef.current);
        brandingSaveTimerRef.current = null;
      }
    };
  }, [
    accountEntitlements.capabilities.revealBranding,
    authLoading,
    businessAccentColor,
    businessBackgroundColor,
    businessBackgroundStyle,
    businessDisplayName,
    businessSenderName,
    businessSenderRole,
    businessTextColor,
    businessTrustMessage,
    openedNoteBranding,
    portalLayout,
    prefsLoading,
    saveBrandingDefaults,
    user,
  ]);

  useEffect(() => {
    return () => {
      if (savedBrandingTimeoutRef.current) {
        window.clearTimeout(savedBrandingTimeoutRef.current);
      }
    };
  }, []);

  const uploadBusinessBanner = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > BRANDING_BANNER_MAX_BYTES) {
      toast({
        title: "Unsupported photograph",
        description: `Use a PNG, JPEG, or WebP image, ${BRANDING_BANNER_SIZE_LABEL} px, under ${Math.round(BRANDING_BANNER_MAX_BYTES / (1024 * 1024))} MB.`,
        variant: "destructive",
      });
      return;
    }
    setUploadingBanner(true);
    try {
      const response = await apiUploadRequest<{ bannerUrl: string }>("/api/auth/account/branding/banner", file);
      setBusinessBannerUrl(response.bannerUrl);
      setBusinessBackgroundStyle("banner");
      await refreshEntitlements();
      toast({ title: "Background photograph uploaded" });
    } catch (error) {
      toast({ title: "Could not upload photograph", description: describeApiPreferenceError(error), variant: "destructive" });
    } finally {
      setUploadingBanner(false);
      if (bannerInputRef.current) bannerInputRef.current.value = "";
    }
  };

  const removeBusinessBanner = async () => {
    setUploadingBanner(true);
    try {
      await apiRequest("/api/auth/account/branding/banner", "DELETE");
      setBusinessBannerUrl(null);
      if (businessBackgroundStyle === "banner") setBusinessBackgroundStyle("neutral");
      await refreshEntitlements();
    } finally {
      setUploadingBanner(false);
    }
  };

  const uploadBusinessLogo = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast({
        title: "Unsupported logo",
        description: "Choose a PNG, JPEG, or WebP image.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > BRANDING_LOGO_MAX_BYTES) {
      toast({
        title: "Logo is too large",
        description: "Choose an image smaller than 1 MB.",
        variant: "destructive",
      });
      return;
    }
    setUploadingLogo(true);
    try {
      const response = await apiUploadRequest<{ ok: boolean; logoUrl: string }>(
        "/api/auth/account/branding/logo",
        file,
      );
      setBusinessLogoUrl(response.logoUrl);
      await refreshEntitlements();
      toast({
        title: "Logo uploaded",
        description: "It will be prefilled on new Business notes.",
      });
    } catch (error) {
      toast({
        title: "Could not upload logo",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = "";
    }
  };

  const removeBusinessLogo = async () => {
    setRemovingLogo(true);
    try {
      await apiRequest("/api/auth/account/branding/logo", "DELETE");
      setBusinessLogoUrl(null);
      await refreshEntitlements();
      toast({ title: "Logo removed" });
    } catch (error) {
      toast({
        title: "Could not remove logo",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setRemovingLogo(false);
    }
  };

  const saveStatus = savingBranding ? (
    <span className="text-xs font-medium text-violet-700 dark:text-violet-300">
      Saving…
    </span>
  ) : savedBrandingIndicator ? (
    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
      Saved
    </span>
  ) : null;

  if (authLoading || (user && prefsLoading)) {
    return (
      <AccountSettingsShell>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
          <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
        </div>
      </AccountSettingsShell>
    );
  }

  if (!user) {
    return (
      <AccountSettingsShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.authNavBranding || "Branding"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authBrandingGuestSubtitle || "Sign in to set the page recipients see when they open a note."}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 px-5 py-6 text-center dark:border-gray-800">
            <Button asChild size="sm">
              <a href="/auth/sign-in">{t.signIn || "Sign in"}</a>
            </Button>
          </div>
        </div>
      </AccountSettingsShell>
    );
  }

  return (
    <AccountSettingsShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.authNavBranding || "Branding"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authBrandingSubtitle || "How recipients recognise you on secure delivery pages. PrivateNote stays the trust layer."}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            {saveStatus}
            <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
              Business
            </span>
          </div>
        </div>

        <section className="overflow-hidden rounded-xl border border-violet-200 dark:border-violet-900/60">
          {accountEntitlements.capabilities.revealBranding ? (
            <div className="space-y-5 px-5 py-5">
              <div>
                <Label htmlFor="business-display-name" className="mb-2 block text-sm">
                  Display name
                </Label>
                <input
                  id="business-display-name"
                  value={businessDisplayName}
                  onChange={(event) => setBusinessDisplayName(event.target.value)}
                  maxLength={120}
                  placeholder="Company or team name"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Shown as the company name on branded reveal pages.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="business-sender-name" className="mb-2 block text-sm">Sender name</Label>
                  <input id="business-sender-name" value={businessSenderName}
                    onChange={(event) => setBusinessSenderName(event.target.value)} maxLength={80}
                    placeholder="Marjan Skrobot"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
                </div>
                <div>
                  <Label htmlFor="business-sender-role" className="mb-2 block text-sm">Role or department</Label>
                  <input id="business-sender-role" value={businessSenderRole}
                    onChange={(event) => setBusinessSenderRole(event.target.value)} maxLength={80}
                    placeholder="Security Operations"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
                </div>
              </div>

              <div>
                <Label htmlFor="business-trust-message" className="mb-2 block text-sm">Recipient trust message</Label>
                <textarea id="business-trust-message" value={businessTrustMessage}
                  onChange={(event) => setBusinessTrustMessage(event.target.value)} maxLength={160} rows={2}
                  placeholder="We use PrivateNote to deliver sensitive information securely."
                  className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
                <p className="mt-1 text-right text-xs text-gray-500">{businessTrustMessage.length}/160</p>
              </div>

              <div>
                <Label className="mb-2 block text-sm">Show on the reveal card</Label>
                <div className="mb-4 grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      ["logo", "Logo", "Square mark. Optional name, role, and company sit with it."],
                      ["banner", "Banner", "Wider lockup. Name, role, company, and trust message still show."],
                    ] as const
                  ).map(([id, label, hint]) => (
                    <label
                      key={id}
                      className="flex items-start gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 dark:border-gray-700 dark:text-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={portalLayout.cardImage === id}
                        onChange={() => {
                          if (id === "banner" && !businessLogoUrl) {
                            logoInputRef.current?.click();
                          }
                          if (id === "logo" && !businessLogoUrl) {
                            logoInputRef.current?.click();
                          }
                          setPortalLayout((prev) => ({ ...prev, cardImage: id }));
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>
                        <span className="block font-medium">{label}</span>
                        <span className="mt-0.5 block text-xs font-normal text-gray-500 dark:text-gray-400">
                          {hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                <Label className="mb-2 block text-sm">
                  {portalLayout.cardImage === "banner" ? "Banner image" : "Logo"}
                </Label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`flex h-16 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700 ${
                    portalLayout.cardImage === "banner" ? "w-28" : "w-16"
                  }`}>
                    {businessLogoUrl ? (
                      <img
                        src={businessLogoUrl}
                        alt={portalLayout.cardImage === "banner" ? "Current reveal banner" : "Current reveal logo"}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300 dark:text-gray-600" />
                    )}
                  </div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadBusinessLogo(file);
                    }}
                  />
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void uploadBusinessBanner(file);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingLogo || removingLogo}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingLogo ? "Uploading…" : businessLogoUrl ? "Replace" : "Upload"}
                  </Button>
                  {businessLogoUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={uploadingLogo || removingLogo}
                      onClick={() => void removeBusinessLogo()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {removingLogo ? "Removing…" : "Remove"}
                    </Button>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {portalLayout.cardImage === "banner"
                    ? `Wide lockup, about ${BRANDING_CARD_BANNER_SIZE_LABEL}. Names and trust message stay on the card.`
                    : `Square mark. PNG, JPEG, or WebP; maximum ${Math.round(BRANDING_LOGO_MAX_BYTES / (1024 * 1024))} MB. Recommended ${BRANDING_LOGO_RECOMMENDED_PX.width}×${BRANDING_LOGO_RECOMMENDED_PX.height}.`}
                </p>
              </div>

              <div className="border-t border-violet-100 pt-6 dark:border-violet-900/40">
                <BrandingPageHeading
                  eyebrow="Page"
                  title="Reveal page"
                  description="Default is a centered card on PrivateNote. Custom is a photograph you pan and scale."
                  actions={
                    <div className="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
                      {([
                        { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                        { id: "mobile" as const, label: "Mobile", Icon: Smartphone },
                      ]).map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setBrandingPreviewViewport(option.id)}
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${
                            brandingPreviewViewport === option.id
                              ? "bg-primary/10 text-primary"
                              : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          <option.Icon className="h-3.5 w-3.5" aria-hidden />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  }
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm">Page</Label>
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {([
                    { id: "default" as const, label: "Default", hint: "Centered card, your colours" },
                    { id: "custom" as const, label: "Custom", hint: "Photograph behind the card" },
                  ]).map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => {
                        if (choice.id === "custom") {
                          if (!businessBannerUrl) {
                            bannerInputRef.current?.click();
                            return;
                          }
                          setBusinessBackgroundStyle("banner");
                          return;
                        }
                        setBusinessBackgroundStyle(
                          brandingBackgroundStyleForPage(
                            "default",
                            businessBackgroundStyle === "gradient",
                          ),
                        );
                      }}
                      className={`rounded-lg border px-3 py-2 text-left ${
                        brandingPageMode(businessBackgroundStyle) === choice.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <span className="block text-sm font-medium">{choice.label}</span>
                      <span className="mt-0.5 block text-[11px] font-normal text-gray-500 dark:text-gray-400">
                        {choice.hint}
                      </span>
                    </button>
                  ))}
                </div>

                {brandingPageMode(businessBackgroundStyle) === "default" ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block text-sm">Background</Label>
                      <div className="mb-3 inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
                        <button
                          type="button"
                          onClick={() => {
                            setBusinessBackgroundColor("#ffffff");
                            setBusinessBackgroundColorDraft("#ffffff");
                          }}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            brandingIsPrivateNoteCanvas(businessBackgroundColor)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          PrivateNote
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (brandingIsPrivateNoteCanvas(businessBackgroundColor)) {
                              setBusinessBackgroundColor("#e2e8f0");
                              setBusinessBackgroundColorDraft("#e2e8f0");
                            }
                          }}
                          className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                            !brandingIsPrivateNoteCanvas(businessBackgroundColor)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
                          }`}
                        >
                          Color
                        </button>
                      </div>
                      {!brandingIsPrivateNoteCanvas(businessBackgroundColor) ? (
                        <ColorField
                          id="business-background-color"
                          label="Page color"
                          value={businessBackgroundColor}
                          draft={businessBackgroundColorDraft}
                          onValue={setBusinessBackgroundColor}
                          onDraft={setBusinessBackgroundColorDraft}
                        />
                      ) : null}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                      <input
                        type="checkbox"
                        checked={businessBackgroundStyle === "gradient"}
                        onChange={(event) =>
                          setBusinessBackgroundStyle(event.target.checked ? "gradient" : "neutral")
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      Gradient wash
                    </label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <ColorField
                        id="business-accent-color"
                        label="Reveal button"
                        value={businessAccentColor}
                        draft={businessAccentColorDraft}
                        onValue={(next) => {
                          setBusinessAccentColor(next);
                          setBusinessAccentColorDraft(next);
                        }}
                        onDraft={setBusinessAccentColorDraft}
                      />
                      <ColorField
                        id="business-text-color"
                        label="Button text"
                        value={businessTextColor}
                        draft={businessTextColorDraft}
                        onValue={(next) => {
                          setBusinessTextColor(next);
                          setBusinessTextColorDraft(next);
                        }}
                        onDraft={setBusinessTextColorDraft}
                      />
                    </div>
                    {brandingCtaStyle({
                      accentColor: businessAccentColor,
                      textColor: businessTextColor,
                    })?.color.toLowerCase() !== businessTextColor.toLowerCase() ? (
                      <p className="text-xs text-amber-800 dark:text-amber-200">
                        Button text will use a higher-contrast colour so it stays readable.
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {brandingPageMode(businessBackgroundStyle) === "custom" ? (
                  <>
                    <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                      One photograph. Click to set the focal point, then scale. The reveal card stays inset from the edges.
                    </p>
                <div
                  className="mb-3 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-slate-950 dark:border-gray-700"
                  style={{ aspectRatio: BRANDING_BANNER_ASPECT_RATIO }}
                >
                  {businessBannerUrl ? (
                    <button
                      type="button"
                      className="relative block h-full w-full cursor-crosshair"
                      aria-label="Set image focal point"
                      onClick={(event) => {
                        const rect = event.currentTarget.getBoundingClientRect();
                        const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
                        const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
                        setPortalLayout((prev) => ({
                          ...prev,
                          focalX: Math.min(100, Math.max(0, x)),
                          focalY: Math.min(100, Math.max(0, y)),
                        }));
                        if (businessBackgroundStyle !== "banner") {
                          setBusinessBackgroundStyle("banner");
                        }
                      }}
                    >
                      <img
                        src={businessBannerUrl}
                        alt="Custom recipient background"
                        className="h-full w-full object-contain"
                        style={{
                          transform: `scale(${portalLayout.backgroundZoom / 100})`,
                          transformOrigin: `${portalLayout.focalX}% ${portalLayout.focalY}%`,
                        }}
                      />
                      <span
                        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow"
                        style={{
                          left: `${portalLayout.focalX}%`,
                          top: `${portalLayout.focalY}%`,
                        }}
                      />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="flex h-full w-full flex-col items-center justify-center gap-1 px-4 text-center"
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      <p className="m-0 text-sm font-semibold text-gray-200">
                        Upload a background photograph
                      </p>
                      <p className="m-0 text-xs text-gray-400">
                        {BRANDING_BANNER_RECOMMENDED_PX.width} × {BRANDING_BANNER_RECOMMENDED_PX.height} px · landscape
                      </p>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingBanner}
                    onClick={() => bannerInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingBanner ? "Uploading…" : businessBannerUrl ? "Replace photograph" : "Upload photograph"}
                  </Button>
                  {businessBannerUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={uploadingBanner}
                      onClick={() => void removeBusinessBanner()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Recommended {BRANDING_BANNER_SIZE_LABEL} (16:9). Maximum{" "}
                  {Math.round(BRANDING_BANNER_MAX_BYTES / (1024 * 1024))} MB.
                  Click the photo to set the focal point. Recipients cannot move the image.
                </p>
                {businessBackgroundStyle === "banner" ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="business-background-zoom" className="mb-2 block text-sm">
                        Scale {portalLayout.backgroundZoom}%
                      </Label>
                      <input
                        id="business-background-zoom"
                        type="range"
                        min={BRANDING_BACKGROUND_ZOOM_MIN}
                        max={BRANDING_BACKGROUND_ZOOM_MAX}
                        value={portalLayout.backgroundZoom}
                        onChange={(event) =>
                          setPortalLayout((prev) => ({
                            ...prev,
                            backgroundZoom: Number(event.target.value),
                          }))
                        }
                        className="w-full accent-primary"
                      />
                    </div>
                    <ChoiceRow<BrandingOverlay>
                      label="Overlay"
                      value={portalLayout.overlay}
                      onChange={(overlay) =>
                        setPortalLayout((prev) => ({ ...prev, overlay }))
                      }
                      options={[
                        { id: "light", label: "Light" },
                        { id: "medium", label: "Medium" },
                        { id: "dark", label: "Dark" },
                      ]}
                    />
                    <div>
                      <div className="mb-3">
                        <Label className="text-sm">Reveal card</Label>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Move the card inside a padded frame — not to the screen edge. Phones use top, center, or bottom.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-8">
                        <CardPositionPad
                          label="Desktop"
                          value={portalLayout.cardPosition}
                          onChange={(cardPosition) => {
                            setPortalLayout((prev) => ({ ...prev, cardPosition }));
                            setBrandingPreviewViewport("desktop");
                          }}
                        />
                        <MobileLanePad
                          label="Mobile"
                          value={portalLayout.cardPositionMobile}
                          onChange={(cardPositionMobile) => {
                            setPortalLayout((prev) => ({ ...prev, cardPositionMobile }));
                            setBrandingPreviewViewport("mobile");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                  </>
                ) : null}
              </div>

              <div>
                <BrandingPreview
                  viewport={brandingPreviewViewport}
                  branding={{
                    companyName: businessDisplayName || undefined,
                    senderName: businessSenderName || undefined,
                    senderRole: businessSenderRole || undefined,
                    trustMessage: businessTrustMessage || undefined,
                    logoUrl: businessLogoUrl ?? undefined,
                    bannerUrl: businessBannerUrl ?? undefined,
                    accentColor: businessAccentColor,
                    backgroundColor: businessBackgroundColor,
                    textColor: businessTextColor,
                    backgroundStyle: businessBackgroundStyle,
                    ...portalLayout,
                  }}
                />
              </div>

              <div className="space-y-5 border-t border-violet-100 pt-6 dark:border-violet-900/40">
                <BrandingPageHeading
                  eyebrow="Page"
                  title="After the note is opened"
                  description="Off by default so screenshots stay unbranded. When on, the opened note inherits this page."
                />
                <div className="rounded-lg border border-amber-200/80 bg-amber-50/70 px-4 py-3 dark:border-amber-800/50 dark:bg-amber-950/30">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Label
                        htmlFor="business-show-branding-after-reveal"
                        className="text-sm font-medium text-amber-950 dark:text-amber-50"
                      >
                        Show branding after the note is opened
                      </Label>
                      <p className="mt-1 text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/80">
                        Off by default. When on, screenshots of the opened note will
                        include your logo, sender name, and company identity.
                      </p>
                    </div>
                    <Switch
                      id="business-show-branding-after-reveal"
                      checked={openedNoteBranding.show}
                      onCheckedChange={(checked) =>
                        setOpenedNoteBranding({
                          ...DEFAULT_OPENED_NOTE_BRANDING,
                          show: checked,
                        })
                      }
                      aria-label="Show branding after the note is opened"
                    />
                  </div>
                </div>

                {openedNoteBranding.show ? (
                  <OpenedNoteBrandingPreview
                    viewport={brandingPreviewViewport}
                    branding={applyOpenedNoteBranding({
                      companyName: businessDisplayName || undefined,
                      senderName: businessSenderName || undefined,
                      senderRole: businessSenderRole || undefined,
                      trustMessage: businessTrustMessage || undefined,
                      logoUrl: businessLogoUrl ?? undefined,
                      bannerUrl: businessBannerUrl ?? undefined,
                      accentColor: businessAccentColor,
                      backgroundColor: businessBackgroundColor,
                      textColor: businessTextColor,
                      backgroundStyle: businessBackgroundStyle,
                      ...portalLayout,
                      showBrandingAfterReveal: true,
                      openedBackground: "same",
                    })}
                  />
                ) : null}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Branding is public reveal metadata only. It never includes note
                content, titles, or previews. After open, branding stays hidden
                unless you opt in above. Changes save automatically.
              </p>
            </div>

          ) : (
            <div className="px-5 py-5">
              <div className="flex items-start gap-3">
                <Crown className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Available with Business
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                    Add your logo, colours, and a Default or Custom reveal page.
                    Stored branding remains retained if you downgrade.
                  </p>
                  {(businessDisplayName || businessLogoUrl) ? (
                    <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                      Your saved branding is retained but currently inactive.
                    </p>
                  ) : null}
                  <Button asChild size="sm" className="mt-3">
                    <a href="/account">View account plan</a>
                  </Button>
                </div>
              </div>
            </div>

          )}
        </section>
      </div>
    </AccountSettingsShell>
  );
}
