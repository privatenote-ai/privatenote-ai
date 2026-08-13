import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useAccountEntitlements } from "@/context/AccountEntitlementsContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, apiUploadRequest, ApiRequestError } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { useThemePreferenceControls, type ThemePreference } from "@/hooks/useThemePreference";
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Cloud,
  ShieldOff,
  SlidersHorizontal,
  Crown,
  Mic,
  ImageIcon,
  Upload,
  Trash2,
} from "lucide-react";
import {
  readLocalHostedAiAllowed,
  writeLocalHostedAiAllowed,
} from "@/utils/hostedAiPreference";
import {
  readVoiceRecordingFormatPreference,
  writeVoiceRecordingFormatPreference,
  type VoiceRecordingFormatPreference,
} from "@/utils/voiceRecordingFormatPreference";
import { isVoiceRecordingMp4Supported } from "@/utils/voiceMessageRecording";
import { useLanguage } from "@/context/LanguageContext";
import {
  LANGUAGE_OPTIONS,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/utils/translation";
import {
  hasPremiumFeatures,
  normalizeAccountType,
  planFeaturesFor,
  type AccountType,
} from "@shared/planCatalog";
import {
  BRANDING_BANNER_ASPECT_RATIO,
  BRANDING_BANNER_MAX_BYTES,
  BRANDING_BANNER_RECOMMENDED_PX,
  BRANDING_BANNER_SIZE_LABEL,
  BRANDING_LOGO_MAX_BYTES,
  BRANDING_LOGO_RECOMMENDED_PX,
  brandingBannerStyle,
  brandingCtaStyle,
  brandingHeroStyle,
  brandingHeroUsesLightText,
  brandingShowsBanner,
  contrastingTextOn,
  type RevealBranding,
} from "@shared/businessBranding";
import { NOTE_EXPIRY_PRESETS } from "@shared/noteExpiry";
import { NOTE_READ_LIMIT_OPTIONS, type NoteReadLimit } from "@shared/noteReadLimits";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  NOTE_FILE_ACCESS_WINDOW_OPTIONS,
  formatNoteFileAccessWindow,
  type NoteFileAccessWindowSeconds,
} from "@shared/noteFileAccess";

/** Scaled-down mirror of the reveal page header so branding edits are truthful. */
const BrandingPreview: React.FC<{ branding: RevealBranding; senderLine: string }> = ({
  branding,
  senderLine,
}) => {
  const bannerStyle = brandingBannerStyle(branding);
  const lightText = brandingHeroUsesLightText(branding);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-700">
      <div className="relative min-h-48 text-center" style={brandingHeroStyle(branding)}>
        <header>
          {branding.accentColor ? (
            <div className="h-[3px] w-full" style={{ backgroundColor: branding.accentColor }} />
          ) : null}
          <div
            className={`flex flex-col items-center gap-2 border-b px-6 pb-5 pt-4 ${
              lightText ? "border-white/15" : "border-gray-200/70 dark:border-gray-800"
            }`}
          >
            {branding.logoUrl ? (
              <div className={lightText ? "rounded-lg bg-white px-3 py-2 shadow-sm" : ""}>
                <img
                  src={branding.logoUrl}
                  alt="Brand preview"
                  className="max-h-9 max-w-36 object-contain"
                />
              </div>
            ) : null}
            <p
              className={`m-0 text-sm font-medium ${
                lightText ? "text-white/90" : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {senderLine}
            </p>
            {branding.trustMessage ? (
              <p
                className={`m-0 max-w-md text-xs ${
                  lightText ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {branding.trustMessage}
              </p>
            ) : null}
          </div>
        </header>
        <div className="px-6 py-8">
          <p
            className={`m-0 text-lg font-extrabold tracking-tight ${
              lightText ? "text-white" : "text-gray-900 dark:text-white"
            }`}
          >
            Reveal <span className="text-primary">Private Note</span>
          </p>
          {bannerStyle ? (
            <div
              className={`mx-auto mt-6 aspect-[8/3] w-full max-w-xs overflow-hidden rounded-lg border bg-gray-100 bg-cover bg-center shadow-sm dark:bg-gray-800 ${
                lightText ? "border-white/15" : "border-gray-200/80 dark:border-gray-800"
              }`}
              style={bannerStyle}
            />
          ) : null}
          <button
            type="button"
            className={`rounded-md px-5 py-2.5 text-sm font-semibold ${bannerStyle ? "mt-6" : "mt-8"}`}
            style={brandingCtaStyle(branding)}
          >
            Reveal note
          </button>
        </div>
      </div>
    </div>
  );
};

type NoteDefaultsForm = {
  expirySeconds: number;
  maxReads: NoteReadLimit;
  fileAccessWindowSeconds: NoteFileAccessWindowSeconds;
  readerLanguage: "auto" | SupportedLanguage;
  notifyOnOpen: boolean;
  requireRecipientVerification: boolean;
};

const INITIAL_NOTE_DEFAULTS: NoteDefaultsForm = {
  expirySeconds: 24 * 60 * 60,
  maxReads: 1,
  fileAccessWindowSeconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  readerLanguage: "auto",
  notifyOnOpen: false,
  requireRecipientVerification: false,
};

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

// ─── Theme picker ─────────────────────────────────────────────────────────────

const THEMES: { value: ThemePreference; labelKey: string; icon: typeof Sun }[] = [
  { value: "light", labelKey: "authThemeLight", icon: Sun },
  { value: "dark", labelKey: "authThemeDark", icon: Moon },
  { value: "system", labelKey: "authThemeSystem", icon: Monitor },
];

function ThemePicker({
  value,
  onChange,
}: {
  value: ThemePreference;
  onChange: (v: ThemePreference) => void;
}) {
  const { t } = useLanguage();
  const themeLabels: Record<string, string> = {
    authThemeLight: t.authThemeLight || "Light",
    authThemeDark: t.authThemeDark || "Dark",
    authThemeSystem: t.authThemeSystem || "System",
  };
  return (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden" role="group" aria-label={t.authTheme || "Choose theme"}>
      {THEMES.map(({ value: v, labelKey, icon: Icon }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60
            ${
              value === v
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            }
            border-r border-gray-200 dark:border-gray-700 last:border-0`}
        >
          <Icon className="h-4 w-4 shrink-0" aria-hidden />
          {themeLabels[labelKey]}
        </button>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountPreferences() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const {
    entitlements: accountEntitlements,
    refreshEntitlements,
  } = useAccountEntitlements();
  const { language, setLanguage, t } = useLanguage();
  /** Avoid stale closure inside loadSummary — must NOT refetch whenever `language` changes or we race the PATCH GET/overwrite UX. */
  const languageRef = useRef(language);
  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const { preference: themePref, setPreference: setThemePref } = useThemePreferenceControls();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>("en");
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [savingEmailPref, setSavingEmailPref] = useState(false);
  const [savingLanguagePref, setSavingLanguagePref] = useState(false);
  const [allowHostedAi, setAllowHostedAi] = useState(() => readLocalHostedAiAllowed());
  const [savingHostedAiPref, setSavingHostedAiPref] = useState(false);
  const [savedEmailIndicator, setSavedEmailIndicator] = useState(false);
  const [savedLanguageIndicator, setSavedLanguageIndicator] = useState(false);
  const [savedHostedAiIndicator, setSavedHostedAiIndicator] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("free");
  const [noteDefaults, setNoteDefaults] = useState<NoteDefaultsForm>(INITIAL_NOTE_DEFAULTS);
  const [noteDefaultsConfigured, setNoteDefaultsConfigured] = useState(false);
  const [noteDefaultsLoading, setNoteDefaultsLoading] = useState(true);
  const [savingNoteDefaults, setSavingNoteDefaults] = useState(false);
  const [resettingNoteDefaults, setResettingNoteDefaults] = useState(false);
  const [savedNoteDefaultsIndicator, setSavedNoteDefaultsIndicator] = useState(false);
  const [businessDisplayName, setBusinessDisplayName] = useState("");
  const [businessAccentColor, setBusinessAccentColor] = useState("#2563eb");
  const [businessBackgroundColor, setBusinessBackgroundColor] = useState("#ffffff");
  const [businessTextColor, setBusinessTextColor] = useState("#ffffff");
  const [businessLogoUrl, setBusinessLogoUrl] = useState<string | null>(null);
  const [businessSenderName, setBusinessSenderName] = useState("");
  const [businessSenderRole, setBusinessSenderRole] = useState("");
  const [businessTrustMessage, setBusinessTrustMessage] = useState("");
  const [businessBannerUrl, setBusinessBannerUrl] = useState<string | null>(null);
  const [businessBackgroundStyle, setBusinessBackgroundStyle] =
    useState<"neutral" | "gradient" | "banner">("neutral");
  const [savingBranding, setSavingBranding] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [removingLogo, setRemovingLogo] = useState(false);
  const [savedBrandingIndicator, setSavedBrandingIndicator] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [voiceFormatPreference, setVoiceFormatPreference] = useState<VoiceRecordingFormatPreference>(
    () => readVoiceRecordingFormatPreference(),
  );
  const [savedVoiceFormatIndicator, setSavedVoiceFormatIndicator] = useState(false);
  const [mp4RecordingSupported, setMp4RecordingSupported] = useState(false);
  const planCapabilities = planFeaturesFor(accountType);
  const canChooseVoiceFormat = hasPremiumFeatures(accountType);

  useEffect(() => {
    setMp4RecordingSupported(isVoiceRecordingMp4Supported());
  }, []);

  const onVoiceFormatChange = (next: VoiceRecordingFormatPreference) => {
    if (next === "m4a" && !isVoiceRecordingMp4Supported()) {
      toast({
        title: t.voiceFormatM4aUnsupportedTitle ?? "M4A not available here",
        description:
          t.voiceFormatM4aUnsupportedDesc ??
          "This browser can’t record M4A. Choose WAV or Auto instead.",
        variant: "destructive",
      });
      return;
    }
    setVoiceFormatPreference(next);
    writeVoiceRecordingFormatPreference(next);
    setSavedVoiceFormatIndicator(true);
    window.setTimeout(() => setSavedVoiceFormatIndicator(false), 1500);
  };

  const loadSummary = useCallback(async () => {
    try {
      const data = await apiRequest<{
        ok: boolean;
        emailNotifications?: boolean;
        preferredLanguage?: SupportedLanguage | null;
        allowHostedAi?: boolean;
        accountType?: unknown;
        plan?: unknown;
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
      }>("/api/auth/account/summary", "GET");
      if (data.ok && typeof data.emailNotifications === "boolean") {
        setEmailNotifications(data.emailNotifications);
      }
      if (data.ok && typeof data.allowHostedAi === "boolean") {
        setAllowHostedAi(data.allowHostedAi);
        writeLocalHostedAiAllowed(data.allowHostedAi);
      }
      if (data.ok) {
        setBusinessDisplayName(data.businessDisplayName ?? "");
        setBusinessLogoUrl(data.businessLogoUrl ?? null);
        setBusinessAccentColor(data.businessAccentColor ?? "#2563eb");
        setBusinessBackgroundColor(data.businessBackgroundColor ?? "#ffffff");
        setBusinessTextColor(
          data.businessTextColor
            ?? contrastingTextOn(data.businessAccentColor ?? "#2563eb"),
        );
        setBusinessSenderName(data.businessSenderName ?? "");
        setBusinessSenderRole(data.businessSenderRole ?? "");
        setBusinessTrustMessage(data.businessTrustMessage ?? "");
        setBusinessBannerUrl(data.businessBannerUrl ?? null);
        setBusinessBackgroundStyle(data.businessBackgroundStyle ?? "neutral");
      }
      if (data.ok && data.preferredLanguage && SUPPORTED_LANGUAGES.includes(data.preferredLanguage)) {
        setPreferredLanguage(data.preferredLanguage);
      } else if (data.ok) {
        const fb = languageRef.current;
        if (SUPPORTED_LANGUAGES.includes(fb)) {
          setPreferredLanguage(fb);
        }
      }
      const nextAccountType = normalizeAccountType(
        typeof data.accountType === "string"
          ? data.accountType
          : typeof data.plan === "string"
            ? data.plan
            : undefined,
      );
      setAccountType(nextAccountType);
      if (planFeaturesFor(nextAccountType).savedDefaults) {
        const defaultsResponse = await apiRequest<{
          ok: boolean;
          defaults: {
            expirySeconds: number | null;
            maxReads: NoteReadLimit | null;
            fileAccessWindowSeconds: NoteFileAccessWindowSeconds | null;
            readerLanguage: SupportedLanguage | null;
            notifyOnOpen: boolean;
            requireRecipientVerification: boolean;
          } | null;
        }>("/api/auth/account/note-defaults", "GET");
        if (defaultsResponse.defaults) {
          setNoteDefaults({
            expirySeconds:
              defaultsResponse.defaults.expirySeconds ?? INITIAL_NOTE_DEFAULTS.expirySeconds,
            maxReads: defaultsResponse.defaults.maxReads ?? INITIAL_NOTE_DEFAULTS.maxReads,
            fileAccessWindowSeconds:
              defaultsResponse.defaults.fileAccessWindowSeconds ??
              INITIAL_NOTE_DEFAULTS.fileAccessWindowSeconds,
            readerLanguage: defaultsResponse.defaults.readerLanguage ?? "auto",
            notifyOnOpen: defaultsResponse.defaults.notifyOnOpen,
            requireRecipientVerification:
              defaultsResponse.defaults.requireRecipientVerification,
          });
          setNoteDefaultsConfigured(true);
        }
      }
    } catch {
      /* non-critical */
    } finally {
      setNoteDefaultsLoading(false);
      setPrefsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setPrefsLoading(false); return; }
    void loadSummary();
  }, [authLoading, user, loadSummary]);

  const onEmailNotificationsChange = async (checked: boolean) => {
    if (!user) return;
    setSavingEmailPref(true);
    setEmailNotifications(checked);
    try {
      await apiRequest("/api/auth/account/preferences", "PATCH", { emailNotifications: checked });
      setSavedEmailIndicator(true);
      setTimeout(() => setSavedEmailIndicator(false), 2000);
    } catch {
      setEmailNotifications(!checked);
    } finally {
      setSavingEmailPref(false);
    }
  };

  const onAllowHostedAiChange = async (checked: boolean) => {
    if (!user) return;
    setSavingHostedAiPref(true);
    setAllowHostedAi(checked);
    writeLocalHostedAiAllowed(checked);
    try {
      await apiRequest("/api/auth/account/preferences", "PATCH", { allowHostedAi: checked });
      setSavedHostedAiIndicator(true);
      setTimeout(() => setSavedHostedAiIndicator(false), 2000);
    } catch (e) {
      setAllowHostedAi(!checked);
      writeLocalHostedAiAllowed(!checked);
      toast({
        title: "Could not save hosted AI preference",
        description: describeApiPreferenceError(e),
        variant: "destructive",
      });
    } finally {
      setSavingHostedAiPref(false);
    }
  };

  const onPreferredLanguageChange = async (nextLanguage: SupportedLanguage) => {
    if (!user) return;
    if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) return;
    const canonical = normalizeLanguageCode(nextLanguage);
    if (!SUPPORTED_LANGUAGES.includes(canonical)) return;

    const previousLanguage = preferredLanguage;
    setSavingLanguagePref(true);
    setPreferredLanguage(canonical);
    setLanguage(canonical);
    try {
      await apiRequest("/api/auth/account/preferences", "PATCH", { preferredLanguage: canonical });
      setSavedLanguageIndicator(true);
      setTimeout(() => setSavedLanguageIndicator(false), 2000);
    } catch (e) {
      setPreferredLanguage(previousLanguage);
      setLanguage(previousLanguage);
      toast({
        title: t.authPrefsCouldNotSaveLanguage || "Could not save language",
        description: describeApiPreferenceError(e),
        variant: "destructive",
      });
    } finally {
      setSavingLanguagePref(false);
    }
  };

  const saveNoteDefaults = async () => {
    setSavingNoteDefaults(true);
    try {
      await apiRequest("/api/auth/account/note-defaults", "PUT", noteDefaults);
      setNoteDefaultsConfigured(true);
      setSavedNoteDefaultsIndicator(true);
      setTimeout(() => setSavedNoteDefaultsIndicator(false), 2000);
      toast({
        title: "Note defaults saved",
        description: "These settings will be used on your signed-in devices.",
      });
    } catch (error) {
      toast({
        title: "Could not save note defaults",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setSavingNoteDefaults(false);
    }
  };

  const resetNoteDefaults = async () => {
    setResettingNoteDefaults(true);
    try {
      await apiRequest("/api/auth/account/note-defaults", "DELETE");
      setNoteDefaults(INITIAL_NOTE_DEFAULTS);
      setNoteDefaultsConfigured(false);
      toast({
        title: "Note defaults reset",
        description: "New notes will use the standard defaults.",
      });
    } catch (error) {
      toast({
        title: "Could not reset note defaults",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setResettingNoteDefaults(false);
    }
  };

  const saveBrandingDefaults = async () => {
    setSavingBranding(true);
    try {
      const response = await apiRequest<{
        businessDisplayName: string | null;
        businessAccentColor: string | null;
        businessBackgroundColor: string | null;
        businessTextColor: string | null;
      }>("/api/auth/account/preferences", "PATCH", {
        businessDisplayName,
        businessAccentColor,
        businessBackgroundColor,
        businessTextColor,
        businessSenderName,
        businessSenderRole,
        businessTrustMessage,
        businessBackgroundStyle,
      });
      setBusinessDisplayName(response.businessDisplayName ?? "");
      setBusinessAccentColor(response.businessAccentColor ?? "#2563eb");
      setBusinessBackgroundColor(response.businessBackgroundColor ?? "#ffffff");
      setBusinessTextColor(
        response.businessTextColor
          ?? contrastingTextOn(response.businessAccentColor ?? "#2563eb"),
      );
      setSavedBrandingIndicator(true);
      setTimeout(() => setSavedBrandingIndicator(false), 2000);
      await refreshEntitlements();
      toast({
        title: "Branding defaults saved",
        description: "New notes will start with this reveal branding.",
      });
    } catch (error) {
      toast({
        title: "Could not save branding",
        description: describeApiPreferenceError(error),
        variant: "destructive",
      });
    } finally {
      setSavingBranding(false);
    }
  };

  const uploadBusinessBanner = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > BRANDING_BANNER_MAX_BYTES) {
      toast({
        title: "Unsupported banner",
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
      toast({ title: "Banner uploaded", description: "Save branding defaults to use the banner treatment." });
    } catch (error) {
      toast({ title: "Could not upload banner", description: describeApiPreferenceError(error), variant: "destructive" });
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

  useEffect(() => {
    if (prefsLoading || authLoading) return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#reveal-branding") return;
    window.requestAnimationFrame(() => {
      document.getElementById("reveal-branding")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [authLoading, prefsLoading]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (authLoading || (user && prefsLoading)) {
    return (
      <AccountSettingsShell>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-36 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
          <div className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
        </div>
      </AccountSettingsShell>
    );
  }

  // ── Not signed in — theme still works locally ──────────────────────────────
  if (!user) {
    return (
      <AccountSettingsShell>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t.authNavPreferences || "Preferences"}</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t.authPrefsGuestSubtitle || "Theme preference is stored on this device. Sign in to sync email settings."}
            </p>
          </div>

          <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.authPrefsAppearance || "Appearance"}</p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{t.authPrefsAppearanceHintGuest || "Stored on this browser only."}</p>
            </div>
            <div className="px-5 py-4">
              <ThemePicker value={themePref} onChange={setThemePref} />
            </div>
          </section>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 px-5 py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.authPrefsSignInForEmail || "Sign in to manage email notification settings."}</p>
            <Button asChild size="sm">
              <a href="/auth/sign-in">{t.signIn || "Sign in"}</a>
            </Button>
          </div>
        </div>
      </AccountSettingsShell>
    );
  }

  // ── Signed-in preferences ──────────────────────────────────────────────────
  return (
    <AccountSettingsShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t.authNavPreferences || "Preferences"}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t.authPrefsSubtitle || "Appearance and notification controls."}
          </p>
        </div>

        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.authPrefsAppearance || "Appearance"}</p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {t.authPrefsAppearanceHint || "Stored on this browser only — not synced across devices."}
            </p>
          </div>
          <div className="px-5 py-5">
            <Label className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">{t.authTheme || "Theme"}</Label>
            <ThemePicker value={themePref} onChange={setThemePref} />
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.authPrefsLanguageSectionTitle || "Language"}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {t.authPrefsLanguageHint || "Choose your interface language. This syncs to your account."}
                </p>
              </div>
              {savedLanguageIndicator && (
                <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">{t.authPrefsSaved || "Saved"}</span>
              )}
            </div>
          </div>
          <div className="px-5 py-5">
            <Label htmlFor="preferred-language" className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
              {t.authPrefsPreferredLanguage || "Preferred language"}
            </Label>
            <select
              id="preferred-language"
              className="w-full max-w-xs rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 text-sm"
              value={preferredLanguage}
              disabled={savingLanguagePref}
              onChange={(event) => void onPreferredLanguageChange(event.target.value as SupportedLanguage)}
            >
              {SUPPORTED_LANGUAGES.map((option) => (
                <option key={option} value={option}>
                  {option === "en" ? "English" : option === "de" ? "Deutsch" : option === "fr" ? "Français" : "Español"}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ── Non-private hosted AI ─────────────────────────────────────── */}
        <section className="rounded-xl border-2 border-amber-500/70 dark:border-amber-600/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-200/80 dark:border-amber-900/50 bg-amber-50/80 dark:bg-amber-950/30">
            <div className="flex items-start gap-3">
              <ShieldOff className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400 mt-0.5" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">Non-private hosted AI</p>
                  {savedHostedAiIndicator && (
                    <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">{t.authPrefsSaved || "Saved"}</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-amber-900/85 dark:text-amber-200/85 max-w-xl">
                  Optional Cloudflare Workers AI when Private AI is unavailable. Premium does not make this private —
                  prompts still leave your device. Each note session still requires a separate confirmation.
                </p>
              </div>
            </div>
          </div>
          <div className="px-5 py-4 bg-white dark:bg-gray-950">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 max-w-md">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-gray-400" aria-hidden />
                  <Label htmlFor="allow-hosted-ai-pref" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    Allow non-private hosted AI
                  </Label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">Off by default. Not the same as Private AI on your device.</p>
              </div>
              <Switch
                id="allow-hosted-ai-pref"
                checked={allowHostedAi}
                disabled={savingHostedAiPref}
                onCheckedChange={(c) => void onAllowHostedAiChange(c)}
              />
            </div>
          </div>
        </section>

        {/* ── Email notifications ────────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.authPrefsEmailSectionTitle || "Email"}</p>
              {savedEmailIndicator && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{t.authPrefsSaved || "Saved"}</span>
              )}
            </div>
          </div>

          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5 max-w-sm">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gray-400" aria-hidden />
                  <Label htmlFor="email-notify" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                    {t.authEmailNotifications || "Email notifications"}
                  </Label>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
                  {t.authPrefsEmailNotificationsHint ||
                    "Note open/destroy alerts, product updates, and security messages. Critical account emails may still be sent."}
                </p>
              </div>
              <Switch
                id="email-notify"
                checked={emailNotifications}
                disabled={savingEmailPref}
                onCheckedChange={(c) => void onEmailNotificationsChange(c)}
              />
            </div>
          </div>
        </section>

        {/* ── Business branding defaults ───────────────────────────── */}
        <section
          id="reveal-branding"
          className="overflow-hidden rounded-xl border border-violet-200 dark:border-violet-900/60 scroll-mt-24"
        >
          <div className="border-b border-violet-200 bg-violet-50/60 px-5 py-4 dark:border-violet-900/60 dark:bg-violet-950/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-violet-600" aria-hidden />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Reveal branding
                  </p>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Synchronized Business defaults. New notes prefill these values,
                  and you can still adjust them per note.
                </p>
              </div>
              {savedBrandingIndicator ? (
                <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Saved
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-200">
                  Business
                </span>
              )}
            </div>
          </div>

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

              <div>
                <Label className="mb-2 block text-sm">Brand colors</Label>
                <div className="grid gap-4 sm:grid-cols-3">
                  {([
                    {
                      id: "business-background-color",
                      label: "Background",
                      value: businessBackgroundColor,
                      onChange: setBusinessBackgroundColor,
                    },
                    {
                      id: "business-accent-color",
                      label: "Accent",
                      value: businessAccentColor,
                      onChange: setBusinessAccentColor,
                    },
                    {
                      id: "business-text-color",
                      label: "Text",
                      value: businessTextColor,
                      onChange: setBusinessTextColor,
                    },
                  ] as const).map((swatch) => (
                    <div key={swatch.id}>
                      <Label htmlFor={swatch.id} className="mb-2 block text-xs text-gray-500 dark:text-gray-400">
                        {swatch.label}
                      </Label>
                      <div className="flex items-center gap-2">
                        <input
                          id={swatch.id}
                          type="color"
                          value={swatch.value}
                          onChange={(event) => swatch.onChange(event.target.value)}
                          className="h-10 w-12 cursor-pointer rounded border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900"
                        />
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          {swatch.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Background tints the reveal page. Accent fills Reveal and Copy.
                  Text is the label on those buttons.
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
                <Label className="mb-2 block text-sm">Logo</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-16 w-28 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700">
                    {businessLogoUrl ? (
                      <img
                        src={businessLogoUrl}
                        alt="Current reveal logo"
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
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingLogo || removingLogo}
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadingLogo ? "Uploading…" : businessLogoUrl ? "Replace logo" : "Upload logo"}
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
                  PNG, JPEG, or WebP; maximum {Math.round(BRANDING_LOGO_MAX_BYTES / (1024 * 1024))} MB.
                  Recommended {BRANDING_LOGO_RECOMMENDED_PX.width}×{BRANDING_LOGO_RECOMMENDED_PX.height} (square)
                  or a wider lockup up to about 1200×400. Uploaded logos are served from
                  PrivateNote instead of an external host.
                </p>
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <Label className="text-sm">Reveal banner</Label>
                  <p className="m-0 font-mono text-xs text-gray-500 dark:text-gray-400">
                    {BRANDING_BANNER_SIZE_LABEL} px · 8:3
                  </p>
                </div>
                <div
                  className="mb-3 overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40"
                  style={{ aspectRatio: BRANDING_BANNER_ASPECT_RATIO }}
                >
                  {businessBannerUrl ? (
                    <img
                      src={businessBannerUrl}
                      alt="Reveal banner preview"
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center">
                      <p className="m-0 text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {BRANDING_BANNER_RECOMMENDED_PX.width} × {BRANDING_BANNER_RECOMMENDED_PX.height} px
                      </p>
                      <p className="m-0 text-xs text-gray-500 dark:text-gray-400">
                        8:3 landscape cover · PNG, JPEG, or WebP
                      </p>
                    </div>
                  )}
                </div>
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {(["neutral", "gradient", "banner"] as const).map((style) => (
                    <button key={style} type="button" onClick={() => setBusinessBackgroundStyle(style)}
                      disabled={style === "banner" && !businessBannerUrl}
                      className={`rounded-lg border px-3 py-2 text-sm capitalize ${businessBackgroundStyle === style ? "border-primary bg-primary/5 text-primary" : "border-gray-200 dark:border-gray-700"} disabled:opacity-40`}>
                      {style}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <input ref={bannerInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only"
                    onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadBusinessBanner(file); }} />
                  <Button type="button" variant="outline" disabled={uploadingBanner}
                    onClick={() => bannerInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />{uploadingBanner ? "Uploading…" : businessBannerUrl ? "Replace banner" : "Upload banner"}
                  </Button>
                  {businessBannerUrl ? <Button type="button" variant="ghost" disabled={uploadingBanner}
                    onClick={() => void removeBusinessBanner()}><Trash2 className="mr-2 h-4 w-4" />Remove</Button> : null}
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Export at {BRANDING_BANNER_SIZE_LABEL} pixels (8:3). Maximum{" "}
                  {Math.round(BRANDING_BANNER_MAX_BYTES / (1024 * 1024))} MB. The banner shows in a
                  card just above the Reveal button at its full 8:3 shape, so nothing is cropped.
                  Your logo appears separately at the top of the page.
                </p>
              </div>

              <div>
                <Label className="mb-2 block text-sm">Live recipient preview</Label>
                <BrandingPreview
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
                  }}
                  senderLine={
                    businessSenderName || businessDisplayName
                      ? `${businessSenderName || businessDisplayName}${businessSenderRole ? `, ${businessSenderRole}` : ""}${businessSenderName && businessDisplayName ? ` from ${businessDisplayName}` : ""} shared a private note`
                      : "Your company shared a private note"
                  }
                />
              </div>

              <div className="flex justify-end border-t border-violet-100 pt-4 dark:border-violet-900/40">
                <Button
                  type="button"
                  disabled={savingBranding}
                  onClick={() => void saveBrandingDefaults()}
                >
                  {savingBranding ? "Saving…" : "Save branding defaults"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Branding is public reveal metadata only. It never includes note
                content, titles, or previews.
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
                    Add your display name, hosted logo, and three brand colors
                    (background, accent, and text) to note reveal pages. Stored
                    branding remains retained if you downgrade.
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

        {/* ── Saved note defaults ───────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="flex items-start gap-3">
              <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Saved note defaults
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      Synced to your account and applied when you create a new note while signed in.
                    </p>
                  </div>
                  {savedNoteDefaultsIndicator ? (
                    <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {t.authPrefsSaved || "Saved"}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {planCapabilities.savedDefaults ? (
            <div className="space-y-5 px-5 py-5">
              {noteDefaultsLoading ? (
                <div className="h-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="default-expiry" className="mb-2 block text-sm">
                        Note lifetime
                      </Label>
                      <select
                        id="default-expiry"
                        value={noteDefaults.expirySeconds}
                        onChange={(event) => {
                          const next = Number(event.target.value);
                          if (next > planCapabilities.maxExpirySeconds) return;
                          setNoteDefaults((current) => ({
                            ...current,
                            expirySeconds: next,
                          }));
                        }}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        {NOTE_EXPIRY_PRESETS.map((preset) => {
                          const locked = preset.seconds > planCapabilities.maxExpirySeconds;
                          const planLabel =
                            preset.seconds <= 3 * 24 * 60 * 60
                              ? null
                              : preset.seconds <= 15 * 24 * 60 * 60
                                ? "Starter"
                                : "Business";
                          return (
                            <option
                              key={preset.id}
                              value={preset.seconds}
                              disabled={locked}
                              style={locked ? { color: "#9ca3af" } : undefined}
                            >
                              {planLabel ? `${preset.label} — ${planLabel}` : preset.label}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="default-reads" className="mb-2 block text-sm">
                        Open limit
                      </Label>
                      <select
                        id="default-reads"
                        value={noteDefaults.maxReads}
                        onChange={(event) => {
                          const next = Number(event.target.value) as NoteReadLimit;
                          if (!planCapabilities.allowedReadCounts.includes(next)) return;
                          setNoteDefaults((current) => ({
                            ...current,
                            maxReads: next,
                          }));
                        }}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        {NOTE_READ_LIMIT_OPTIONS.map((reads) => {
                          const locked = !planCapabilities.allowedReadCounts.includes(reads);
                          const planLabel =
                            reads <= 1 ? null : reads <= 3 ? "Starter" : "Business";
                          return (
                            <option
                              key={reads}
                              value={reads}
                              disabled={locked}
                              style={locked ? { color: "#9ca3af" } : undefined}
                            >
                              {planLabel
                                ? `${reads === 1 ? "Once (read-once)" : `${reads} views`} — ${planLabel}`
                                : reads === 1
                                  ? "Once (read-once)"
                                  : `${reads} views`}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="default-file-window" className="mb-2 block text-sm">
                        File download window
                      </Label>
                      <select
                        id="default-file-window"
                        value={noteDefaults.fileAccessWindowSeconds}
                        onChange={(event) => {
                          const next = Number(event.target.value) as NoteFileAccessWindowSeconds;
                          if (next > planCapabilities.maxFileAccessWindowSeconds) return;
                          setNoteDefaults((current) => ({
                            ...current,
                            fileAccessWindowSeconds: next,
                          }));
                        }}
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        {NOTE_FILE_ACCESS_WINDOW_OPTIONS.map((seconds) => {
                          const locked = seconds > planCapabilities.maxFileAccessWindowSeconds;
                          const planLabel =
                            seconds <= 15 * 60 ? null : seconds <= 30 * 60 ? "Starter" : "Business";
                          return (
                            <option
                              key={seconds}
                              value={seconds}
                              disabled={locked}
                              style={locked ? { color: "#9ca3af" } : undefined}
                            >
                              {planLabel
                                ? `${formatNoteFileAccessWindow(seconds)} — ${planLabel}`
                                : formatNoteFileAccessWindow(seconds)}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="default-reader-language" className="mb-2 block text-sm">
                        Reader language
                      </Label>
                      <select
                        id="default-reader-language"
                        value={noteDefaults.readerLanguage}
                        onChange={(event) =>
                          setNoteDefaults((current) => ({
                            ...current,
                            readerLanguage: event.target.value as "auto" | SupportedLanguage,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                      >
                        <option value="auto">Auto — recipient browser language</option>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <option key={option.code} value={option.code}>
                            {option.nativeName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Alert me when opened
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Requires verified email and email notifications to remain enabled.
                        </p>
                      </div>
                      <Switch
                        checked={noteDefaults.notifyOnOpen}
                        disabled={!emailNotifications}
                        onCheckedChange={(checked) =>
                          setNoteDefaults((current) => ({
                            ...current,
                            notifyOnOpen: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Require recipient verification
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Generate a separate one-time code for each new note.
                        </p>
                      </div>
                      <Switch
                        checked={noteDefaults.requireRecipientVerification}
                        onCheckedChange={(checked) =>
                          setNoteDefaults((current) => ({
                            ...current,
                            requireRecipientVerification: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {noteDefaultsConfigured
                        ? "Custom defaults are currently active."
                        : "Standard defaults are currently active."}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={resettingNoteDefaults || !noteDefaultsConfigured}
                        onClick={() => void resetNoteDefaults()}
                      >
                        {resettingNoteDefaults ? "Resetting…" : "Reset defaults"}
                      </Button>
                      <Button
                        type="button"
                        disabled={savingNoteDefaults}
                        onClick={() => void saveNoteDefaults()}
                      >
                        {savingNoteDefaults ? "Saving…" : "Save defaults"}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="px-5 py-5">
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100">
                <Crown className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">Starter and Business feature</p>
                  <p className="mt-1 text-xs leading-relaxed">
                    Saved defaults are inactive on Free. Existing synchronized defaults are retained
                    and become active again after upgrading.
                  </p>
                  <div className="mt-3">
                    <Button asChild size="sm">
                      <a href="/premium">Compare plans</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Voice recording format ─────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="flex items-start gap-3">
              <Mic className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t.voiceFormatPrefsTitle ?? "Voice recording format"}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {t.voiceFormatPrefsDescription ??
                        "Choose how voice messages are captured in this browser. Saved on this device."}
                    </p>
                  </div>
                  {savedVoiceFormatIndicator ? (
                    <span className="shrink-0 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {t.authPrefsSaved || "Saved"}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {canChooseVoiceFormat ? (
            <div className="space-y-4 px-5 py-5">
              <div>
                <Label htmlFor="voice-recording-format" className="mb-2 block text-sm">
                  {t.voiceFormatPrefsLabel ?? "Preferred format"}
                </Label>
                <select
                  id="voice-recording-format"
                  value={voiceFormatPreference}
                  onChange={(event) =>
                    onVoiceFormatChange(event.target.value as VoiceRecordingFormatPreference)
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <option value="auto">
                    {t.voiceFormatOptionAuto ?? "Auto — best available for this browser"}
                  </option>
                  <option value="wav">
                    {t.voiceFormatOptionWav ?? "WAV — maximum compatibility (larger files)"}
                  </option>
                  <option value="m4a" disabled={!mp4RecordingSupported}>
                    {mp4RecordingSupported
                      ? (t.voiceFormatOptionM4a ?? "M4A — smaller files (Safari-friendly)")
                      : (t.voiceFormatOptionM4aUnavailable ??
                        "M4A — not supported in this browser")}
                  </option>
                </select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t.voiceFormatPrefsHint ??
                  "Auto uses M4A when this browser can record it; otherwise WAV so recipients can play messages in Chrome and Safari."}
              </p>
            </div>
          ) : (
            <div className="px-5 py-5">
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-100">
                <Crown className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">
                    {t.voiceFormatPrefsPremiumTitle ?? "Starter and Business feature"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {t.voiceFormatPrefsPremiumDesc ??
                      "Free accounts always use Auto. Upgrade to choose WAV or M4A for voice messages."}
                  </p>
                  <div className="mt-3">
                    <Button asChild size="sm">
                      <a href="/premium">{t.comparePlans ?? "Compare plans"}</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ── Coming later ────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">{t.authPrefsComingLater || "Coming later"}</p>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-600">
            <li>{t.authPrefsComingDigest || "Notification digest frequency"}</li>
          </ul>
        </section>
      </div>
    </AccountSettingsShell>
  );
}
