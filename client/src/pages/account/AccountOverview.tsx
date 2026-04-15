import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";

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
  storageUsedBytes: number | null;
};

const ACCOUNT_TYPE_META: Record<
  AccountType,
  {
    label: string;
    summary: string;
    detail: string;
    capabilities: string[];
    futureItems: string[];
  }
> = {
  free: {
    label: "Free",
    summary: "Secure notes with essential account features.",
    detail: "Built for core secure-note sharing without premium branding or public receiving setup.",
    capabilities: [
      "Basic secure notes",
      "Essential account controls",
      "Upgrade path to Personal Premium or Business Premium",
    ],
    futureItems: [
      "Limited AI and account features may expand later",
      "Receive securely features are not part of Free",
    ],
  },
  personal_premium: {
    label: "Personal Premium",
    summary: "For private individuals who want premium features without a public-facing business profile.",
    detail: "Personal Premium stays privacy-first and avoids pushing public identity or public contact setup.",
    capabilities: [
      "Premium note controls",
      "Enhanced account features",
      "Privacy-first personal use",
    ],
    futureItems: [
      "Lightweight personal receiving helpers are planned",
      "Public business identity is not the focus of this type",
    ],
  },
  business_premium: {
    label: "Business Premium",
    summary: "For businesses and public-facing professionals who want trusted, professional secure-note workflows.",
    detail: "This is the future home for branded professional use, trusted identity, and public secure intake.",
    capabilities: [
      "Professional account positioning",
      "Future business identity support",
      "Future receive securely foundation",
    ],
    futureItems: [
      "Public secure intake will be supported later",
      "Verified business identity and contact methods are planned",
    ],
  },
};

const ACCOUNT_TYPE_ORDER: AccountType[] = ["free", "personal_premium", "business_premium"];

function normalizeAccountType(raw: string | null | undefined): AccountType {
  const value = (raw || "free").toLowerCase();
  if (value === "personal_premium" || value === "pro") return "personal_premium";
  if (value === "business_premium" || value === "business") return "business_premium";
  return "free";
}

function formatInternalId(id: string | null | undefined): string {
  if (!id) return "—";
  if (id.length <= 16) return id;
  return `${id.slice(0, 8)}…${id.slice(-6)}`;
}

export default function AccountOverview() {
  const { user, loading: authLoading } = useAuth();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await apiRequest<AccountSummary>("/api/auth/account/summary", "GET");
      setSummary(data.ok ? { ...data, accountType: normalizeAccountType(data.accountType ?? data.plan) } : null);
    } catch {
      setSummary(null);
      setLoadError("Could not load account details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    void refresh();
  }, [authLoading, user, refresh]);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
      }),
    [],
  );

  if (authLoading || loading) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading account…</p>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  if (!user) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to view your account.</p>
            <div className="mt-4">
              <Button asChild>
                <a href="/auth/sign-in">Sign in</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  const accountType = normalizeAccountType(summary?.accountType ?? summary?.plan);
  const currentType = ACCOUNT_TYPE_META[accountType];
  const alternateTypes = ACCOUNT_TYPE_ORDER.filter((type) => type !== accountType);
  const usage = summary?.usage;
  const limits = summary?.limits;

  return (
    <AccountSettingsShell>
      <div className="space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Review who this account belongs to, what type of account it is, and what it is set up to support.
          </p>
        </div>

        {loadError && (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
            {loadError}
          </p>
        )}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Identity</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Basic account identity tied to your sign-in.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
              <div className="text-base font-medium text-gray-900 dark:text-white">Email</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white break-all">{summary?.email ?? user.email ?? "—"}</div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
              <div className="text-base font-medium text-gray-900 dark:text-white">Member since</div>
              <div className="text-sm text-gray-900 dark:text-white">
                {summary?.createdAt ? dateFormatter.format(new Date(summary.createdAt)) : "—"}
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
              <div className="text-base font-medium text-gray-900 dark:text-white">Account type</div>
              <div className="text-sm text-gray-900 dark:text-white">{currentType.label}</div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
              <div className="text-base font-medium text-gray-500 dark:text-gray-400">Account ID</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{formatInternalId(summary?.id)}</div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Plan and account type</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              PrivateNote uses account types to distinguish core use, premium scope, and future receiving features.
            </p>
          </div>
          <div className="rounded-lg border border-blue-200/80 p-5 dark:border-blue-900/60">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current account type</p>
                <h3 className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{currentType.label}</h3>
                <p className="mt-2 text-sm text-gray-900 dark:text-white">{currentType.summary}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{currentType.detail}</p>
                {accountType === "business_premium" && summary?.businessDisplayName && (
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Business display name: <span className="font-medium text-gray-900 dark:text-white">{summary.businessDisplayName}</span>
                  </p>
                )}
              </div>
              <div className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                Billing is not active yet. This page shows your current account type and where future upgrades will fit.
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {alternateTypes.map((type) => {
                const meta = ACCOUNT_TYPE_META[type];
                return (
                  <div key={type} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-base font-medium text-gray-900 dark:text-white">{meta.label}</p>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        Planned
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{meta.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Capabilities</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              What this account type supports now, and what it is positioned to support later.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Available now</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {currentType.capabilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">Planned / coming later</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {currentType.futureItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Usage</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Lightweight account-level usage only. No note content is shown here.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Notes created today</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {usage
                  ? `${usage.notesToday}${limits?.notesPerDay != null ? ` / ${limits.notesPerDay}` : " (unlimited)"}`
                  : "—"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-900 dark:text-white">AI-assisted creates today</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {usage
                  ? `${usage.aiToday}${limits?.aiUsesPerDay != null ? ` / ${limits.aiUsesPerDay}` : " (unlimited)"}`
                  : "—"}
              </p>
            </div>
          </div>
        </section>
      </div>
    </AccountSettingsShell>
  );
}
