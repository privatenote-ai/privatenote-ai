import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WebAuthnOptions, coerceLoginOptions, credentialToJson } from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import {
  Laptop,
  Smartphone,
  Globe,
  Copy,
  ChevronRight,
  Mail,
  Loader2,
} from "lucide-react";

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
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [recoveryRemaining, setRecoveryRemaining] = useState<number>(0);
  const [recoveryGeneratedAt, setRecoveryGeneratedAt] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEmailInput, setDeleteEmailInput] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [emailChangeDialogOpen, setEmailChangeDialogOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailChangeSent, setEmailChangeSent] = useState(false);

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

  const refreshAll = useCallback(async () => {
    try {
      const me = await apiRequest<{
        id: string;
        email: string | null;
      }>("/api/auth/me", "GET");
      setUserId(me.id);
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
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refreshAll();
  }, [user, authLoading, refreshAll]);

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

  const copyEmail = async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Email copied", description: "Email address copied to clipboard." });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy email to clipboard.",
        variant: "destructive",
      });
    }
  };

  const copyUserId = async () => {
    if (!userId) return;
    try {
      await navigator.clipboard.writeText(userId);
      toast({ title: "User ID copied", description: "User ID copied to clipboard." });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy User ID to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleRevokeAllSessions = async () => {
    const confirmed = window.confirm("Log out of all other active sessions on other devices besides this one?");
    if (!confirmed) return;
    setBusy(true);
    try {
      await apiRequest("/api/auth/sessions/revoke-all", "POST");
      toast({ title: "All devices logged out", description: "All other sessions have been revoked." });
      refreshAll();
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
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

  const handleDeleteAccount = async () => {
    if (!email) return;

    const normalizedInput = deleteEmailInput.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedInput !== normalizedEmail) {
      toast({
        title: "Email mismatch",
        description: "The email you entered does not match your account email.",
        variant: "destructive",
      });
      return;
    }

    setDeletingAccount(true);
    try {
      // Only require step-up if user has passkeys
      // Magic-link-only users can delete without step-up (they proved email ownership)
      if (passkeys.length > 0) {
        const stepped = await performStepUp();
        if (!stepped) {
          toast({
            title: "Authentication required",
            description: "Please complete authentication to delete your account.",
            variant: "destructive",
          });
          setDeletingAccount(false);
          return;
        }
      }

      // Delete account
      await apiRequest("/api/auth/account/delete", "POST", { email: normalizedEmail });

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      // Sign out and redirect
      await signOut();
      setLocation("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.startsWith("403")) {
        toast({
          title: "Authentication required",
          description: "Please complete authentication to delete your account.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete failed",
          description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setDeletingAccount(false);
      setDeleteDialogOpen(false);
      setDeleteEmailInput("");
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmailInput.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmailInput.trim())) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const normalizedNew = newEmailInput.trim().toLowerCase();
    const normalizedCurrent = (email ?? "").trim().toLowerCase();

    if (normalizedNew === normalizedCurrent) {
      toast({
        title: "Same email",
        description: "New email must be different from your current email.",
        variant: "destructive",
      });
      return;
    }

    setChangingEmail(true);
    try {
      // Only require step-up if user has passkeys
      // Magic-link-only users can proceed without step-up
      if (passkeys.length > 0) {
        const stepped = await performStepUp();
        if (!stepped) {
          toast({
            title: "Authentication required",
            description: "Please complete authentication to change your email.",
            variant: "destructive",
          });
          return;
        }
      }

      // Request email change
      await apiRequest("/api/auth/email/change/request", "POST", {
        newEmail: normalizedNew,
      });

      setEmailChangeSent(true);
      toast({
        title: "Verification email sent",
        description: "Check your new email address for a verification link.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.startsWith("403")) {
        toast({
          title: "Authentication required",
          description: "Please complete authentication to change your email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Change email failed",
          description: error instanceof Error ? error.message : "Failed to request email change. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setChangingEmail(false);
    }
  };

  const closeEmailChangeDialog = () => {
    setEmailChangeDialogOpen(false);
    setNewEmailInput("");
    setEmailChangeSent(false);
  };

  if (authLoading || loading) {
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

  if (!signedIn || !user) {
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
    <div className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Account Security Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Account security</h2>

        <div className="space-y-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          {/* Email */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{email ?? "No email set"}</p>
                {email && (
                  <button
                    onClick={copyEmail}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    title="Copy email"
                  >
                    <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEmailChangeDialogOpen(true)}
              disabled={busy || !email}
            >
              Change email
            </Button>
          </div>

          {/* 2-step verification */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">2-step verification</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add an additional layer of security to your account during login.
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Add verification method
            </Button>
          </div>

          {/* Passkeys */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Passkeys</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Securely sign-in with on-device biometric authentication.
              </p>
              {passkeys.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {passkeys.length} passkey{passkeys.length !== 1 ? "s" : ""} registered
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {passkeys.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetPasskeys}
                  disabled={busy || passkeys.length === 0}
                >
                  Reset passkeys
                </Button>
              )}
              <Button variant="outline" size="sm" disabled>
                Add passkey
              </Button>
            </div>
          </div>

          {/* Recovery Codes */}
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Recovery codes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {recoveryRemaining > 0
                  ? `${recoveryRemaining} unused codes available.`
                  : "No unused recovery codes."}
                {recoveryGeneratedAt ? ` Last generated ${dateFormatter.format(new Date(recoveryGeneratedAt))}.` : ""}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleGenerateRecoveryCodes} disabled={busy}>
              Generate new codes
            </Button>
          </div>
        </div>

        {/* Recovery Codes Display */}
        {recoveryCodes && (
          <div className="mt-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Copy these codes now. You won't be able to see them again.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono text-gray-800 dark:text-gray-100">
              {recoveryCodes.map((code) => (
                <span key={code}>{code}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Devices Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Devices</h2>

        {/* Log out of all devices */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Log out of all devices</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Log out of all other active sessions on other devices besides this one.
            </p>
          </div>
          <Button variant="outline" onClick={handleRevokeAllSessions} disabled={busy}>
            Log out of all devices
          </Button>
        </div>

        {/* Devices Table */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Device Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Last Active</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Action</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 px-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      No active sessions found.
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => {
                    const device = getSessionDevice(session);
                    const Icon = device.icon;
                    const lastActive = session.lastSeenAt || session.createdAt;
                    const isCurrent = session.current;

                    return (
                      <tr
                        key={session.id}
                        className="border-b border-gray-200 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {device.label}
                            </span>
                            {isCurrent && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                This Device
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {lastActive
                              ? isCurrent
                                ? "Now"
                                : dateFormatter.format(new Date(lastActive))
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {!isCurrent && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevokeSession(session.id)}
                              disabled={busy}
                            >
                              Log out
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User ID Section */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">User ID</h2>
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">User ID</p>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{userId ?? "Loading..."}</p>
            </div>
            {userId && (
              <button
                onClick={copyUserId}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                title="Copy User ID"
              >
                <Copy className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h2>

        <div className="space-y-0 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
          {/* Delete Account */}
          <button
            onClick={() => setDeleteDialogOpen(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-left"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Delete my account</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permanently delete the account and remove access from all sessions.
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Change Email Dialog */}
      <Dialog open={emailChangeDialogOpen} onOpenChange={(open) => !changingEmail && (open ? setEmailChangeDialogOpen(true) : closeEmailChangeDialog())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change email address</DialogTitle>
            <DialogDescription>
              {emailChangeSent
                ? "We've sent a verification link to your new email address."
                : "Enter your new email address. You'll need to verify it before the change takes effect."
              }
            </DialogDescription>
          </DialogHeader>
          {emailChangeSent ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Verification email sent
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Check <span className="font-mono">{newEmailInput}</span> for the verification link.
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The link expires in 1 hour. Your email won't change until you click the verification link.
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Current email:
                </p>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  New email address:
                </p>
                <Input
                  type="email"
                  placeholder="Enter new email address"
                  value={newEmailInput}
                  onChange={(e) => setNewEmailInput(e.target.value)}
                  disabled={changingEmail}
                />
              </div>
              {passkeys.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You'll need to verify with your passkey before we send the verification email.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            {emailChangeSent ? (
              <Button onClick={closeEmailChangeDialog}>
                Done
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={closeEmailChangeDialog}
                  disabled={changingEmail}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangeEmail}
                  disabled={changingEmail || !newEmailInput.trim()}
                >
                  {changingEmail ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                To confirm, please type or paste your email address:
              </p>
              <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{email}</p>
                  <button
                    onClick={copyEmail}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors"
                    title="Copy email"
                  >
                    <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={deleteEmailInput}
                onChange={(e) => setDeleteEmailInput(e.target.value)}
                disabled={deletingAccount}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteEmailInput("");
              }}
              disabled={deletingAccount}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deletingAccount || !deleteEmailInput.trim()}
            >
              {deletingAccount ? "Deleting..." : "Delete account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
