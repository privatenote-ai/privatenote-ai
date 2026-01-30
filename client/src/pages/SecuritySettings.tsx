import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WebAuthnOptions, coerceLoginOptions, credentialToJson } from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";
import { Laptop, Smartphone, Globe } from "lucide-react";

type SessionInfo = {
  id: string;
  createdAt: string | null;
  lastSeenAt: string | null;
  expiresAt: string | null;
  absoluteExpiresAt: string | null;
  revokedAt: string | null;
  revokedReason: string | null;
  userAgent: string | null;
  ip: string | null;
  city: string | null;
  country: string | null;
  deviceLabel: string | null;
  current: boolean;
};

type PasskeyInfo = {
  id: string;
  createdAt: string;
  lastUsedAt: string | null;
  transports: string[] | null;
  label: string;
};

export default function SecuritySettings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [recoveryRemaining, setRecoveryRemaining] = useState<number>(0);
  const [recoveryGeneratedAt, setRecoveryGeneratedAt] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);

  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }), []);

  const getSessionDevice = (session: SessionInfo) => {
    const ua = (session.userAgent ?? "").toLowerCase();
    if (ua.includes("iphone") || ua.includes("android") || ua.includes("mobile")) {
      return { label: "Phone", icon: Smartphone };
    }
    if (ua.includes("electron") || ua.includes("desktop app") || ua.includes("privatenote")) {
      return { label: "Desktop App", icon: Laptop };
    }
    return { label: "Web", icon: Globe };
  };

  const refreshAll = async () => {
    try {
      const me = await apiRequest<{
        email: string | null;
      }>("/api/auth/me", "GET");
      setEmail(me.email ?? user?.email ?? null);
      setSignedIn(true);

      const passkeyRes = await apiRequest<{ passkeys: PasskeyInfo[] }>("/api/auth/passkeys", "GET");
      setPasskeys(passkeyRes.passkeys || []);

      const sessionRes = await apiRequest<{ sessions: SessionInfo[] }>("/api/auth/sessions", "GET");
      setSessions(sessionRes.sessions || []);

      const recoveryRes = await apiRequest<{ remaining: number; generatedAt: string | null }>(
        "/api/auth/recovery-codes/status",
        "GET"
      );
      setRecoveryRemaining(recoveryRes.remaining || 0);
      setRecoveryGeneratedAt(recoveryRes.generatedAt || null);
    } catch (error) {
      setSignedIn(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const performStepUp = async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return false;
    }
    const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
      "/api/auth/webauthn/stepup/options",
      "POST"
    );
    const publicKey = coerceLoginOptions(data.options);
    const credential = (await navigator.credentials.get({ publicKey })) as PublicKeyCredential | null;
    if (!credential) {
      toast({ title: "Step-up cancelled", description: "No credential returned." });
      return false;
    }
    await apiRequest("/api/auth/webauthn/stepup/verify", "POST", {
      challengeId: data.challengeId,
      credential: credentialToJson(credential),
    });
    return true;
  };

  const handleGenerateRecoveryCodes = async () => {
    setBusy(true);
    try {
      const response = await apiRequest<{ codes: string[] }>("/api/auth/recovery-codes/generate", "POST");
      setRecoveryCodes(response.codes);
      toast({ title: "Recovery codes generated", description: "Store them in a safe place." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.startsWith("403")) {
        const stepped = await performStepUp();
        if (stepped) {
          const response = await apiRequest<{ codes: string[] }>("/api/auth/recovery-codes/generate", "POST");
          setRecoveryCodes(response.codes);
          toast({ title: "Recovery codes generated", description: "Store them in a safe place." });
        }
      } else {
        toast({
          title: "Recovery codes failed",
          description: error instanceof Error ? error.message : "Try again.",
          variant: "destructive",
        });
      }
    } finally {
      setBusy(false);
      refreshAll();
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setBusy(true);
    try {
      await apiRequest("/api/auth/sessions/revoke", "POST", { sessionId });
      toast({ title: "Session revoked", description: "That session has been signed out." });
      refreshAll();
    } catch (error) {
      toast({
        title: "Revoke failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleResetPasskeys = async () => {
    if (passkeys.length === 0) {
      toast({ title: "No passkeys", description: "There are no passkeys to reset." });
      return;
    }
    const confirmed = window.confirm("Remove all passkeys from this account?");
    if (!confirmed) return;
    setBusy(true);
    try {
      await apiRequest("/api/auth/passkeys/reset", "POST");
      toast({ title: "Passkeys reset", description: "All passkeys have been removed." });
      setPasskeys([]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.startsWith("403")) {
        const stepped = await performStepUp();
        if (stepped) {
          await apiRequest("/api/auth/passkeys/reset", "POST");
          toast({ title: "Passkeys reset", description: "All passkeys have been removed." });
          setPasskeys([]);
        }
      } else {
        toast({
          title: "Reset failed",
          description: error instanceof Error ? error.message : "Try again.",
          variant: "destructive",
        });
      }
    } finally {
      setBusy(false);
      refreshAll();
    }
  };

  if (loading) {
    return (
      <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-8">
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading security settings…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Sign in to manage your security settings.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <a href="/auth">Sign in</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Primary email on file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Primary email</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{email ?? "No email set"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
          <CardDescription>Synced vs device-bound passkeys based on transport hints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {passkeys.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">No passkeys registered yet.</p>
          ) : (
            <div className="space-y-2">
              {passkeys.map((pk) => (
                <div key={pk.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border border-gray-200 dark:border-gray-700 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{pk.label}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Added {dateFormatter.format(new Date(pk.createdAt))}
                      {pk.lastUsedAt ? ` · Last used ${dateFormatter.format(new Date(pk.lastUsedAt))}` : ""}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{pk.transports?.join(", ")}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleResetPasskeys} disabled={busy || passkeys.length === 0}>
              Reset passkeys
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recovery Codes</CardTitle>
          <CardDescription>One-time codes for account recovery.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {recoveryRemaining > 0
              ? `${recoveryRemaining} unused codes available.`
              : "No unused recovery codes."}
            {recoveryGeneratedAt ? ` Last generated ${dateFormatter.format(new Date(recoveryGeneratedAt))}.` : ""}
          </p>
          <Button onClick={handleGenerateRecoveryCodes} disabled={busy}>
            Generate new codes
          </Button>
          {recoveryCodes && (
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                Copy these codes now. You won’t be able to see them again.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono text-gray-800 dark:text-gray-100">
                {recoveryCodes.map((code) => (
                  <span key={code}>{code}</span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Devices signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">No sessions found.</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => {
                const device = getSessionDevice(session);
                const Icon = device.icon;
                return (
                  <div key={session.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {device.label}{session.current ? " · Current" : ""}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Created {session.createdAt ? dateFormatter.format(new Date(session.createdAt)) : "Unknown"}
                        </p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" onClick={() => handleRevokeSession(session.id)} disabled={busy}>
                        Revoke
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Session revocation may take up to 10 minutes to complete.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
