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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WebAuthnOptions, coerceLoginOptions, coerceRegisterOptions, credentialToJson } from "@/utils/webauthn";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import QRCode from "react-qr-code";
import {
  Laptop,
  Smartphone,
  Globe,
  Copy,
  ChevronRight,
  Mail,
  Loader2,
  ShieldCheck,
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
  const [registeringPasskey, setRegisteringPasskey] = useState(false);
  const [emailChangeDialogOpen, setEmailChangeDialogOpen] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState("");
  const [changingEmail, setChangingEmail] = useState(false);
  const [emailChangeSent, setEmailChangeSent] = useState(false);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [totpDialogOpen, setTotpDialogOpen] = useState(false);
  const [totpSetupStep, setTotpSetupStep] = useState<"qr" | "verify" | "done">("qr");
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpOtpauthUri, setTotpOtpauthUri] = useState<string | null>(null);
  const [totpSetupId, setTotpSetupId] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [totpVerifying, setTotpVerifying] = useState(false);
  const [totpSettingUp, setTotpSettingUp] = useState(false);
  const [totpDisabling, setTotpDisabling] = useState(false);

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

      try {
        const totpRes = await apiRequest<{ enabled: boolean }>("/api/auth/totp/status", "GET");
        setTotpEnabled(totpRes.enabled);
      } catch {
        setTotpEnabled(false);
      }
    } catch (error) {
      setSignedIn(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleAddPasskey = useCallback(async () => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({
        title: "Passkeys not supported",
        description: "This browser does not support passkeys.",
      });
      return;
    }

    setRegisteringPasskey(true);
    try {
      const registerWithFreshChallenge = async () => {
        const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
          "/api/auth/webauthn/register/options",
          "POST",
          {}
        );

        if (!data?.options) {
          throw new Error("Missing WebAuthn options from server.");
        }

        const publicKey = coerceRegisterOptions(data.options);
        const credential = (await navigator.credentials.create({ publicKey })) as PublicKeyCredential | null;

        if (!credential) {
          throw new Error("No credential returned.");
        }

        await apiRequest("/api/auth/webauthn/register/verify", "POST", {
          challengeId: data.challengeId,
          credential: credentialToJson(credential),
        });
      };

      try {
        await registerWithFreshChallenge();
      } catch (error) {
        // Browsers can throw InvalidStateError if the platform authenticator state is stale.
        // One retry with a fresh challenge usually resolves this without user intervention.
        if (error instanceof DOMException && error.name === "InvalidStateError") {
          await registerWithFreshChallenge();
        } else {
          throw error;
        }
      }

      toast({
        title: "Passkey created",
        description: "You can now sign in with your passkey.",
      });

      await refreshAll();
    } catch (error) {
      let description = error instanceof Error ? error.message : "Try again.";
      if (error instanceof DOMException && error.name === "InvalidStateError") {
        description = "This passkey may already exist on this device. Try another authenticator or remove the old passkey and retry.";
      } else if (error instanceof DOMException && error.name === "NotAllowedError") {
        description = "Passkey creation was cancelled or timed out. Please try again.";
      }
      toast({
        title: "Passkey registration failed",
        description,
        variant: "destructive",
      });
    } finally {
      setRegisteringPasskey(false);
    }
  }, [toast, refreshAll]);

  useEffect(() => {
    if (authLoading) return;
    refreshAll();
  }, [user, authLoading, refreshAll]);

  const performStepUp = async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("PublicKeyCredential" in window)) {
      toast({ title: "Passkeys not supported", description: "This browser does not support passkeys." });
      return false;
    }
    try {
      const data = await apiRequest<{ challengeId: string; options: WebAuthnOptions }>(
        "/api/auth/webauthn/stepup/options",
        "POST"
      );
      const publicKey = coerceLoginOptions(data.options);

      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), 60_000);
      let credential: PublicKeyCredential | null;
      try {
        credential = (await navigator.credentials.get({
          publicKey,
          signal: abortController.signal,
        })) as PublicKeyCredential | null;
      } finally {
        clearTimeout(timeout);
      }

      if (!credential) {
        toast({ title: "Step-up cancelled", description: "No credential returned." });
        return false;
      }
      await apiRequest("/api/auth/webauthn/stepup/verify", "POST", {
        challengeId: data.challengeId,
        credential: credentialToJson(credential),
      });
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("AbortError") || (error instanceof DOMException && error.name === "AbortError")) {
        toast({ title: "Verification timed out", description: "The passkey prompt timed out. Please try again." });
      } else if (error instanceof DOMException && error.name === "NotAllowedError") {
        toast({ title: "Verification cancelled", description: "You cancelled the passkey prompt." });
      } else if (msg.startsWith("400")) {
        toast({ title: "Verification unavailable", description: "Set up a passkey first to perform this action.", variant: "destructive" });
      } else {
        toast({ title: "Verification failed", description: msg || "Please try again.", variant: "destructive" });
      }
      return false;
    }
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
        try {
          const stepped = await performStepUp();
          if (stepped) {
            const response = await apiRequest<{ codes: string[] }>("/api/auth/recovery-codes/generate", "POST");
            setRecoveryCodes(response.codes);
            toast({ title: "Recovery codes generated", description: "Store them in a safe place." });
          }
        } catch (retryError) {
          toast({
            title: "Recovery codes failed",
            description: retryError instanceof Error ? retryError.message : "Try again.",
            variant: "destructive",
          });
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
        try {
          const stepped = await performStepUp();
          if (stepped) {
            await apiRequest("/api/auth/passkeys/reset", "POST");
            toast({ title: "Passkeys reset", description: "All passkeys have been removed." });
            setPasskeys([]);
          }
        } catch (retryError) {
          toast({
            title: "Reset failed",
            description: retryError instanceof Error ? retryError.message : "Try again.",
            variant: "destructive",
          });
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

  const handleTotpSetup = async () => {
    setTotpSettingUp(true);
    try {
      const data = await apiRequest<{ setupId: string; secret: string; otpauthUri: string }>(
        "/api/auth/totp/setup",
        "POST"
      );
      setTotpSetupId(data.setupId);
      setTotpSecret(data.secret);
      setTotpOtpauthUri(data.otpauthUri);
      setTotpSetupStep("qr");
      setTotpCode("");
      setTotpDialogOpen(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.startsWith("403")) {
        const stepped = await performStepUp();
        if (stepped) {
          try {
            const data = await apiRequest<{ setupId: string; secret: string; otpauthUri: string }>(
              "/api/auth/totp/setup",
              "POST"
            );
            setTotpSetupId(data.setupId);
            setTotpSecret(data.secret);
            setTotpOtpauthUri(data.otpauthUri);
            setTotpSetupStep("qr");
            setTotpCode("");
            setTotpDialogOpen(true);
          } catch (retryError) {
            toast({
              title: "Setup failed",
              description: retryError instanceof Error ? retryError.message : "Try again.",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Setup failed",
          description: msg || "Could not start TOTP setup.",
          variant: "destructive",
        });
      }
    } finally {
      setTotpSettingUp(false);
    }
  };

  const handleTotpVerifySetup = async (code: string) => {
    if (code.length !== 6 || !totpSetupId) return;
    setTotpVerifying(true);
    try {
      await apiRequest("/api/auth/totp/verify-setup", "POST", {
        code,
        setupId: totpSetupId,
      });
      setTotpSetupStep("done");
      setTotpEnabled(true);
      toast({ title: "2-step verification enabled", description: "Your account is now more secure." });
      refreshAll();
    } catch (error) {
      toast({
        title: "Invalid code",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setTotpCode("");
    } finally {
      setTotpVerifying(false);
    }
  };

  const handleTotpDisable = async () => {
    const confirmed = window.confirm("Disable 2-step verification? This will make your account less secure.");
    if (!confirmed) return;
    setTotpDisabling(true);
    try {
      await apiRequest("/api/auth/totp/disable", "POST");
      setTotpEnabled(false);
      toast({ title: "2-step verification disabled" });
      refreshAll();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.startsWith("403")) {
        try {
          const stepped = await performStepUp();
          if (stepped) {
            await apiRequest("/api/auth/totp/disable", "POST");
            setTotpEnabled(false);
            toast({ title: "2-step verification disabled" });
            refreshAll();
          }
        } catch (retryError) {
          toast({
            title: "Disable failed",
            description: retryError instanceof Error ? retryError.message : "Try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Disable failed",
          description: msg || "Try again.",
          variant: "destructive",
        });
      }
    } finally {
      setTotpDisabling(false);
    }
  };

  const closeTotpDialog = () => {
    setTotpDialogOpen(false);
    setTotpSecret(null);
    setTotpOtpauthUri(null);
    setTotpSetupId(null);
    setTotpCode("");
    setTotpSetupStep("qr");
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
          <div className="flex flex-col items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
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
              className="w-full sm:w-auto"
            >
              Change email
            </Button>
          </div>

          {/* 2-step verification */}
          <div className="flex flex-col items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">2-step verification</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totpEnabled
                  ? "Authenticator app is enabled. A code is required after magic link sign-in."
                  : "Add an additional layer of security to your account during login."}
              </p>
              {totpEnabled && (
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
                </div>
              )}
            </div>
            {totpEnabled ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTotpDisable}
                disabled={busy || totpDisabling}
                className="w-full sm:w-auto"
              >
                {totpDisabling ? "Disabling..." : "Disable"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTotpSetup}
                disabled={busy || totpSettingUp}
                className="w-full sm:w-auto"
              >
                {totpSettingUp ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Add verification method"
                )}
              </Button>
            )}
          </div>

          {/* Passkeys */}
          <div className="flex flex-col items-start gap-3 p-4 border-b border-gray-200 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Passkeys</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Securely sign-in with on-device biometric authentication. Add a passkey from here to use it for future sign-ins.
              </p>
              {passkeys.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {passkeys.length} passkey{passkeys.length !== 1 ? "s" : ""} registered
                </p>
              )}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              {passkeys.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetPasskeys}
                  disabled={busy || passkeys.length === 0}
                  className="w-full sm:w-auto"
                >
                  Reset passkeys
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddPasskey}
                disabled={busy || registeringPasskey}
                className="w-full sm:w-auto"
              >
                Add passkey
              </Button>
            </div>
          </div>

          {/* Recovery Codes */}
          <div className="flex flex-col items-start gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Recovery codes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {recoveryRemaining > 0
                  ? `${recoveryRemaining} unused codes available.`
                  : "No unused recovery codes."}
                {recoveryGeneratedAt ? ` Last generated ${dateFormatter.format(new Date(recoveryGeneratedAt))}.` : ""}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateRecoveryCodes}
              disabled={busy}
              className="w-full sm:w-auto"
            >
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
        <div className="mb-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Log out of all devices</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Log out of all other active sessions on other devices besides this one.
            </p>
          </div>
          <Button variant="outline" onClick={handleRevokeAllSessions} disabled={busy} className="w-full sm:w-auto">
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

      {/* TOTP Setup Dialog */}
      <Dialog open={totpDialogOpen} onOpenChange={(open) => !totpVerifying && (open ? setTotpDialogOpen(true) : closeTotpDialog())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {totpSetupStep === "done" ? "2-step verification enabled" : "Set up 2-step verification"}
            </DialogTitle>
            <DialogDescription>
              {totpSetupStep === "qr" && "Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc)."}
              {totpSetupStep === "verify" && "Enter the 6-digit code from your authenticator app to confirm setup."}
              {totpSetupStep === "done" && "Your account is now protected with 2-step verification."}
            </DialogDescription>
          </DialogHeader>

          {totpSetupStep === "qr" && totpOtpauthUri && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <QRCode value={totpOtpauthUri} size={200} />
                </div>
              </div>
              {totpSecret && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Or enter this code manually:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono text-center break-all select-all">
                      {totpSecret}
                    </code>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(totpSecret);
                          toast({ title: "Copied", description: "Secret key copied to clipboard." });
                        } catch {
                          toast({ title: "Copy failed", variant: "destructive" });
                        }
                      }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      title="Copy secret"
                    >
                      <Copy className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {totpSetupStep === "verify" && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <InputOTP
                  maxLength={6}
                  value={totpCode}
                  onChange={(val) => {
                    setTotpCode(val);
                    if (val.length === 6) {
                      handleTotpVerifySetup(val);
                    }
                  }}
                  disabled={totpVerifying}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          )}

          {totpSetupStep === "done" && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Authenticator app verified
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    A code will be required after magic link sign-in.
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {totpSetupStep === "qr" && (
              <>
                <Button variant="outline" onClick={closeTotpDialog}>
                  Cancel
                </Button>
                <Button onClick={() => setTotpSetupStep("verify")}>
                  Next
                </Button>
              </>
            )}
            {totpSetupStep === "verify" && (
              <>
                <Button variant="outline" onClick={() => setTotpSetupStep("qr")} disabled={totpVerifying}>
                  Back
                </Button>
                <Button
                  onClick={() => handleTotpVerifySetup(totpCode)}
                  disabled={totpVerifying || totpCode.length !== 6}
                >
                  {totpVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </>
            )}
            {totpSetupStep === "done" && (
              <Button onClick={closeTotpDialog}>
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
