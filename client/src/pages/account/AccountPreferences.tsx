import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
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
import { NOTE_EXPIRY_PRESETS } from "@shared/noteExpiry";
import { NOTE_READ_LIMIT_OPTIONS, type NoteReadLimit } from "@shared/noteReadLimits";
import {
  parseRevealBodyFont,
  type RevealBodyFont,
} from "@shared/revealBodyFont";
import { RevealBodyFontPicker } from "@/components/note/RevealBodyFontPicker";
import {
  NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  NOTE_FILE_ACCESS_WINDOW_OPTIONS,
  formatNoteFileAccessWindow,
  type NoteFileAccessWindowSeconds,
} from "@shared/noteFileAccess";

type NoteDefaultsForm = {
  expirySeconds: number;
  maxReads: NoteReadLimit;
  fileAccessWindowSeconds: NoteFileAccessWindowSeconds;
  readerLanguage: "auto" | SupportedLanguage;
  bodyFont: RevealBodyFont;
  notifyOnOpen: boolean;
  requireRecipientVerification: boolean;
};

const INITIAL_NOTE_DEFAULTS: NoteDefaultsForm = {
  expirySeconds: 24 * 60 * 60,
  maxReads: 1,
  fileAccessWindowSeconds: NOTE_FILE_ACCESS_DEFAULT_SECONDS,
  readerLanguage: "auto",
  bodyFont: "system",
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
      }>("/api/auth/account/summary", "GET");
      if (data.ok && typeof data.emailNotifications === "boolean") {
        setEmailNotifications(data.emailNotifications);
      }
      if (data.ok && typeof data.allowHostedAi === "boolean") {
        setAllowHostedAi(data.allowHostedAi);
        writeLocalHostedAiAllowed(data.allowHostedAi);
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
            bodyFont: string | null;
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
            bodyFont: parseRevealBodyFont(defaultsResponse.defaults.bodyFont) ?? "system",
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

                  {planCapabilities.revealBodyFont ? (
                    <div>
                      <Label className="mb-2 block text-sm">Message typeface</Label>
                      <RevealBodyFontPicker
                        value={noteDefaults.bodyFont}
                        onChange={(next) =>
                          setNoteDefaults((current) => ({ ...current, bodyFont: next }))
                        }
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Used on the page where the recipient opens the note.
                      </p>
                    </div>
                  ) : null}

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
