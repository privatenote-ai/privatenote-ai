import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { Sparkles } from "lucide-react";

type AccountSummary = {
  ok: boolean;
  email: string | null;
  createdAt: string | null;
  plan: string;
  emailNotifications: boolean;
  limits: { notesPerDay: number | null; aiUsesPerDay: number | null };
  usage: { notesToday: number; aiToday: number; notesMonth: number; aiMonth: number };
  storageUsedBytes: number | null;
};

function planLabel(plan: string): string {
  const p = plan.toLowerCase();
  if (p === "pro") return "Pro";
  if (p === "business") return "Business";
  return "Free";
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
      setSummary(data.ok ? data : null);
    } catch {
      setSummary(null);
      setLoadError("Could not load account summary.");
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
        timeStyle: "short",
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
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Sign in to view your account and usage.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth/sign-in">Sign in</a>
            </Button>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  const plan = summary ? planLabel(summary.plan) : "Free";
  const limits = summary?.limits;
  const usage = summary?.usage;

  return (
    <AccountSettingsShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Account</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Identity, plan, and usage — no note content is stored here.
          </p>
        </div>

        {loadError && (
          <p className="text-sm text-amber-700 dark:text-amber-300" role="alert">
            {loadError}
          </p>
        )}

        <section className="space-y-5 rounded-xl border border-blue-200/80 p-4 dark:border-blue-900/60">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your profile</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Basic identity tied to your sign-in.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white break-all">
                {summary?.email ?? user.email ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Account created
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {summary?.createdAt
                  ? dateFormatter.format(new Date(summary.createdAt))
                  : "—"}
              </p>
            </div>
          </div>
        </section>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Plan & billing</CardTitle>
            <CardDescription>
              Upgrade when you are ready — Business tier is coming later.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Current plan: {plan}
                </p>
                {plan === "Free" && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    Upgrade to Pro for branded notes, attachments, and advanced controls.
                  </p>
                )}
                {plan === "Business" && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Business features are on the roadmap — stay tuned.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <Button type="button" disabled className="w-full sm:w-auto" variant="default">
                  Upgrade to Pro
                </Button>
                <Button type="button" disabled variant="outline" className="w-full sm:w-auto">
                  Manage subscription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Usage</CardTitle>
            <CardDescription>
              Counts from this account only; helps set expectations for future plans.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Notes created today
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {usage
                    ? `${usage.notesToday}${
                        limits?.notesPerDay != null ? ` / ${limits.notesPerDay}` : " (unlimited)"
                      }`
                    : "—"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  AI-assisted creates today
                </p>
                <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {usage
                    ? `${usage.aiToday}${
                        limits?.aiUsesPerDay != null ? ` / ${limits.aiUsesPerDay}` : " (unlimited)"
                      }`
                    : "—"}
                </p>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-gray-200 p-4 dark:border-gray-700">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Storage used
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Not tracked yet — attachments would show here later.
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
              <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
              <p>
                <span className="font-medium text-gray-900 dark:text-white">Unlimited AI tools</span> will
                be part of Pro when billing goes live.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AccountSettingsShell>
  );
}
