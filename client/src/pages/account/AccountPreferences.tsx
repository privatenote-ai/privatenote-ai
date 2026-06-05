import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiRequestError } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { useThemePreferenceControls, type ThemePreference } from "@/hooks/useThemePreference";
import { Sun, Moon, Monitor, Bell, Cloud, ShieldOff } from "lucide-react";
import {
  readLocalHostedAiAllowed,
  writeLocalHostedAiAllowed,
} from "@/utils/hostedAiPreference";
import { useLanguage } from "@/context/LanguageContext";
import { normalizeLanguageCode, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/utils/translation";

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

  const loadSummary = useCallback(async () => {
    try {
      const data = await apiRequest<{
        ok: boolean;
        emailNotifications?: boolean;
        preferredLanguage?: SupportedLanguage | null;
        allowHostedAi?: boolean;
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
                    "Premium note-open alerts, product updates, and security messages. Critical account emails may still be sent."}
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

        {/* ── Coming later ────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">{t.authPrefsComingLater || "Coming later"}</p>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-600">
            <li>{t.authPrefsComingDigest || "Notification digest frequency"}</li>
            <li>{t.authPrefsComingNoteDefaults || "Note defaults (expiry, AI, etc.)"}</li>
          </ul>
        </section>
      </div>
    </AccountSettingsShell>
  );
}
