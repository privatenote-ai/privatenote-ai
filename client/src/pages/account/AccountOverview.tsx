import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { apiRequest } from "@/lib/queryClient";
import { parseActivityCreatedAt } from "@/lib/parseActivityCreatedAt";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  FilePlus2,
  Eye,
  Clock,
  Sparkles,
  Shield,
  Key,
  Fingerprint,
  Bell,
  BellOff,
  Sun,
  Moon,
  Monitor,
  Copy,
} from "lucide-react";
import { getThemePreference } from "@/hooks/useThemePreference";

// ─── Types ────────────────────────────────────────────────────────────────────

type AccountType = "free" | "personal_premium" | "business_premium";

type AccountSummary = {
  ok: boolean;
  id: string;
  email: string | null;
  createdAt: string | null;
  plan: string;
  accountType: AccountType;
  businessDisplayName: string | null;
  emailNotifications: boolean;
  limits: { notesPerDay: number | null; aiUsesPerDay: number | null };
  usage: { notesToday: number; aiToday: number; notesMonth: number; aiMonth: number };
};

type MeResponse = {
  id: string;
  email: string | null;
  hasPasskeys: boolean;
  emailVerified: boolean;
};

type ActivityEvent = {
  id: string;
  type: string;
  noteId: string | null;
  createdAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeAccountType(raw: string | null | undefined): AccountType {
  const v = (raw ?? "free").toLowerCase();
  if (v === "personal_premium" || v === "pro") return "personal_premium";
  if (v === "business_premium" || v === "business") return "business_premium";
  return "free";
}

const PLAN_LABEL: Record<AccountType, string> = {
  free: "Free",
  personal_premium: "Personal Premium",
  business_premium: "Business Premium",
};

const PLAN_BADGE_CLASS: Record<AccountType, string> = {
  free: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  personal_premium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  business_premium: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

function eventLabel(type: string): string {
  switch (type) {
    case "note_created": return "authActivitySecureNoteCreated";
    case "ai_note_created": return "authActivityAiNoteCreated";
    case "note_opened": return "authActivityNoteOpened";
    case "note_expired": return "authActivityNoteExpired";
    default: return type.replace(/_/g, " ");
  }
}

function EventIcon({ type }: { type: string }) {
  const cls = "h-3.5 w-3.5";
  switch (type) {
    case "note_created": return <FilePlus2 className={cls} />;
    case "ai_note_created": return <Sparkles className={cls} />;
    case "note_opened": return <Eye className={cls} />;
    case "note_expired": return <Clock className={cls} />;
    default: return <FilePlus2 className={cls} />;
  }
}

function eventAccent(type: string): string {
  switch (type) {
    case "note_created": return "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30";
    case "ai_note_created": return "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30";
    case "note_opened": return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    case "note_expired": return "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
    default: return "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
  }
}

function ThemeLabel({ pref, t }: { pref: string; t: (key: string, fallback: string) => string }) {
  if (pref === "light") return <><Sun className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />{t("authThemeLight", "Light")}</>;
  if (pref === "dark") return <><Moon className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />{t("authThemeDark", "Dark")}</>;
  return <><Monitor className="h-3.5 w-3.5 inline -mt-0.5 mr-1" />{t("authThemeSystem", "System")}</>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AccountOverview() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const tx = (key: string, fallback: string) => t[key] || fallback;
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [totpEnabled, setTotpEnabled] = useState<boolean | null>(null);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [recentEvents, setRecentEvents] = useState<ActivityEvent[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [themePref, setThemePref] = useState(getThemePreference());

  // Keep theme label in sync with storage changes
  useEffect(() => {
    const sync = () => setThemePref(getThemePreference());
    window.addEventListener("privatenote-theme", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("privatenote-theme", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const load = useCallback(async () => {
    setLoadError(false);
    try {
      const [summaryRes, meRes, totpRes, sessionsRes, activityRes] = await Promise.allSettled([
        apiRequest<AccountSummary>("/api/auth/account/summary", "GET"),
        apiRequest<MeResponse>("/api/auth/me", "GET"),
        apiRequest<{ enabled: boolean }>("/api/auth/totp/status", "GET"),
        apiRequest<{ sessions: { id: string }[] }>("/api/auth/sessions", "GET"),
        apiRequest<{ ok: boolean; events: ActivityEvent[] }>("/api/auth/account/activity?limit=5", "GET"),
      ]);

      if (summaryRes.status === "fulfilled" && summaryRes.value.ok) {
        setSummary({
          ...summaryRes.value,
          accountType: normalizeAccountType(
            summaryRes.value.accountType ?? summaryRes.value.plan,
          ),
        });
      } else {
        setLoadError(true);
      }
      if (meRes.status === "fulfilled") setMe(meRes.value);
      if (totpRes.status === "fulfilled") setTotpEnabled(totpRes.value.enabled);
      if (sessionsRes.status === "fulfilled") {
        setSessionCount(sessionsRes.value.sessions?.length ?? null);
      }
      if (activityRes.status === "fulfilled" && activityRes.value.ok) {
        setRecentEvents(activityRes.value.events ?? []);
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    void load();
  }, [authLoading, user, load]);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }),
    [],
  );

  const copyAccountId = useCallback(async () => {
    const id = summary?.id;
    if (!id) return;
    try {
      await navigator.clipboard.writeText(id);
      toast({
        title: tx("authAccountIdCopiedTitle", "Account ID copied"),
        description: tx("authAccountIdCopiedDesc", "Account ID copied to clipboard."),
      });
    } catch {
      toast({
        title: tx("authCopyFailedTitle", "Copy failed"),
        description: tx("authCopyFailedDesc", "Failed to copy account ID to clipboard."),
        variant: "destructive",
      });
    }
  }, [summary?.id, toast]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <AccountSettingsShell>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
          <div className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
          <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800/60" />
        </div>
      </AccountSettingsShell>
    );
  }

  // ── Not signed in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <AccountSettingsShell>
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {tx("authSignInToViewAccount", "Sign in to view your account.")}
          </p>
          <Button asChild size="sm">
            <a href="/auth/sign-in">{tx("signIn", "Sign in")}</a>
          </Button>
        </div>
      </AccountSettingsShell>
    );
  }

  const accountType = normalizeAccountType(summary?.accountType ?? summary?.plan);
  const planLabel = PLAN_LABEL[accountType];
  const planBadge = PLAN_BADGE_CLASS[accountType];
  const hasPasskeys = me?.hasPasskeys ?? false;
  const emailVerified = me?.emailVerified ?? false;

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <AccountSettingsShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{tx("account", "Account")}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {tx("authOverviewSubtitle", "Your identity, security, and settings at a glance.")}
          </p>
        </div>

        {loadError && (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
            Some details could not be loaded.{" "}
            <button
              type="button"
              className="underline underline-offset-2"
              onClick={() => { setLoading(true); void load(); }}
            >
              {tx("authRetry", "Retry")}
            </button>
          </p>
        )}

        {/* ── Identity card ─────────────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 bg-gray-50/60 dark:bg-gray-900/40">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {tx("authIdentity", "Identity")}
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                {summary?.email ?? user.email ?? "—"}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${planBadge}`}
            >
              {planLabel}
            </span>
          </div>

          {/* Email verified */}
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">{tx("authEmailVerified", "Email verified")}</span>
            {emailVerified ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {tx("authVerified", "Verified")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                <XCircle className="h-4 w-4" /> {tx("authNotVerified", "Not verified")}
              </span>
            )}
          </div>

          {/* Member since */}
          <div className="flex items-center justify-between gap-4 px-5 py-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">{tx("authMemberSince", "Member since")}</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {summary?.createdAt ? dateFormatter.format(new Date(summary.createdAt)) : "—"}
            </span>
          </div>

          {/* Account ID */}
          <div className="px-5 py-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{tx("authAccountId", "Account ID")}</span>
              {summary?.id ? (
                <button
                  type="button"
                  onClick={() => void copyAccountId()}
                  className="shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                  title={tx("authCopyAccountId", "Copy account ID")}
                >
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              ) : null}
            </div>
            <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
              {summary?.id ?? "—"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tx("authAccountIdHelp", "Support may ask for this to verify your account.")}
            </p>
          </div>
        </section>

        {/* ── Security at a glance ──────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx("security", "Security")}</p>
            </div>
            <Link href="/account/security">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-2">
                {tx("authManage", "Manage")} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            {/* Passkeys */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Fingerprint className="h-4 w-4 text-gray-400" aria-hidden />
                {tx("authPasskey", "Passkey")}
              </span>
              {hasPasskeys ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {tx("authSetUp", "Set up")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                  <XCircle className="h-4 w-4" /> {tx("authNone", "None")}
                </span>
              )}
            </div>

            {/* 2-step verification */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Key className="h-4 w-4 text-gray-400" aria-hidden />
                {tx("authTwoStepVerification", "2-step verification")}
              </span>
              {totpEnabled === null ? (
                <span className="text-xs text-gray-400">—</span>
              ) : totpEnabled ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> {tx("authEnabled", "Enabled")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                  <XCircle className="h-4 w-4" /> {tx("authDisabled", "Disabled")}
                </span>
              )}
            </div>

            {/* Active sessions */}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">{tx("authActiveSessions", "Active sessions")}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {sessionCount !== null ? sessionCount : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* ── Recent activity ────────────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx("authRecentActivity", "Recent activity")}</p>
            <Link href="/account/activity">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-2">
                {tx("authViewAll", "View all")} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <p className="px-5 py-6 text-sm text-gray-500 dark:text-gray-400">
              {tx("authNoActivityYet", "No activity yet. Create a note while signed in to see it here.")}
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800/80">
              {recentEvents.map((ev) => {
                let relative = "";
                try {
                  relative = formatDistanceToNow(parseActivityCreatedAt(ev.createdAt), { addSuffix: true });
                } catch {
                  relative = ev.createdAt;
                }
                return (
                  <li key={ev.id} className="flex items-center gap-3 px-5 py-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${eventAccent(ev.type)}`}>
                      <EventIcon type={ev.type} />
                    </span>
                    <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                      {tx(eventLabel(ev.type), eventLabel(ev.type))}
                    </span>
                    <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">{relative}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Preferences quick-look ─────────────────────────────────────── */}
        <section className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{tx("authNavPreferences", "Preferences")}</p>
            <Link href="/account/preferences">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-2">
                {tx("authEdit", "Edit")} <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">{tx("authTheme", "Theme")}</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                <ThemeLabel pref={themePref} t={tx} />
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">{tx("authEmailNotifications", "Email notifications")}</span>
              {summary?.emailNotifications ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                  <Bell className="h-3.5 w-3.5" /> {tx("authOn", "On")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-500">
                  <BellOff className="h-3.5 w-3.5" /> {tx("authOff", "Off")}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Plan ──────────────────────────────────────────────────────── */}
        <section className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 p-5">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              {tx("authCurrentPlan", "Current plan")}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{planLabel}</p>
          </div>

          {accountType === "free" && (
            <div className="mt-4 pt-4 border-t border-blue-200/60 dark:border-blue-900/40 grid gap-3 sm:grid-cols-2">
              {(["personal_premium", "business_premium"] as AccountType[]).map((t) => (
                <div key={t} className="rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{PLAN_LABEL[t]}</p>
                  <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5">
                    {tx("authPlanned", "Planned")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AccountSettingsShell>
  );
}
