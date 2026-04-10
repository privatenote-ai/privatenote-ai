import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { AccountSettingsShell } from "./AccountSettingsShell";
import { useThemePreferenceControls, type ThemePreference } from "@/hooks/useThemePreference";

export default function AccountPreferences() {
  const { user, loading: authLoading } = useAuth();
  const { preference: themePref, setPreference: setThemePref } = useThemePreferenceControls();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [savingEmailPref, setSavingEmailPref] = useState(false);

  const loadSummary = useCallback(async () => {
    try {
      const data = await apiRequest<{ ok: boolean; emailNotifications?: boolean }>(
        "/api/auth/account/summary",
        "GET",
      );
      if (data.ok && typeof data.emailNotifications === "boolean") {
        setEmailNotifications(data.emailNotifications);
      }
    } catch {
      /* optional */
    } finally {
      setPrefsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setPrefsLoading(false);
      return;
    }
    void loadSummary();
  }, [authLoading, user, loadSummary]);

  const onEmailNotificationsChange = async (checked: boolean) => {
    if (!user) return;
    setSavingEmailPref(true);
    setEmailNotifications(checked);
    try {
      await apiRequest("/api/auth/account/preferences", "PATCH", { emailNotifications: checked });
    } catch {
      setEmailNotifications(!checked);
    } finally {
      setSavingEmailPref(false);
    }
  };

  if (authLoading || (user && prefsLoading)) {
    return (
      <AccountSettingsShell>
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading preferences…</p>
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
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Sign in to sync email notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Theme follows this device only until you sign in (below).
            </p>
            <div className="space-y-2 max-w-xs">
              <Label>Theme</Label>
              <Select
                value={themePref}
                onValueChange={(v) => setThemePref(v as ThemePreference)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button asChild>
              <a href="/auth/sign-in">Sign in</a>
            </Button>
          </CardContent>
        </Card>
      </AccountSettingsShell>
    );
  }

  return (
    <AccountSettingsShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Preferences</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Lightweight controls — language and more can land here later.
          </p>
        </div>

        <section className="space-y-5 rounded-xl border border-blue-200/80 p-4 dark:border-blue-900/60">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Stored on this browser only.
            </p>
          </div>
          <div className="flex flex-col gap-2 max-w-xs">
            <Label htmlFor="theme-select">Theme</Label>
            <Select value={themePref} onValueChange={(v) => setThemePref(v as ThemePreference)}>
              <SelectTrigger id="theme-select">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Email</CardTitle>
            <CardDescription>Product and security emails from PrivateNote.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="space-y-0.5">
                <Label htmlFor="email-notify" className="text-base">
                  Email notifications
                </Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Turn off if you want fewer messages. Critical security alerts may still apply.
                </p>
              </div>
              <Switch
                id="email-notify"
                checked={emailNotifications}
                disabled={savingEmailPref}
                onCheckedChange={(c) => void onEmailNotificationsChange(c)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg">Language</CardTitle>
            <CardDescription>Coming later.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">English only for now.</p>
          </CardContent>
        </Card>
      </div>
    </AccountSettingsShell>
  );
}
