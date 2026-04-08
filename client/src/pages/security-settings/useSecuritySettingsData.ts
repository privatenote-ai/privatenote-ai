import { useCallback, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { PasskeyInfo, SessionInfo } from "./types";

type MeResponse = { id: string; email: string | null; lastStepUpAt?: string | null };

export function useSecuritySettingsData(fallbackEmail: string | null | undefined) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [passkeys, setPasskeys] = useState<PasskeyInfo[]>([]);
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [recoveryRemaining, setRecoveryRemaining] = useState(0);
  const [recoveryGeneratedAt, setRecoveryGeneratedAt] = useState<string | null>(null);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [lastStepUpAt, setLastStepUpAt] = useState<string | null>(null);

  const refreshAuthAndAccount = useCallback(async (): Promise<boolean> => {
    try {
      const me = await apiRequest<MeResponse>("/api/auth/me", "GET");
      setUserId(me.id);
      setEmail(me.email ?? fallbackEmail ?? null);
      setLastStepUpAt(me.lastStepUpAt ?? null);
      setSignedIn(true);
      return true;
    } catch {
      setSignedIn(false);
      setLastStepUpAt(null);
      return false;
    }
  }, [fallbackEmail]);

  const refreshSecondaryData = useCallback(async () => {
    const [passkeyRes, sessionRes, recoveryRes, totpRes] = await Promise.allSettled([
      apiRequest<{ passkeys: PasskeyInfo[] }>("/api/auth/passkeys", "GET"),
      apiRequest<{ sessions: SessionInfo[] }>("/api/auth/sessions", "GET"),
      apiRequest<{ remaining: number; generatedAt: string | null }>(
        "/api/auth/recovery-codes/status",
        "GET",
      ),
      apiRequest<{ enabled: boolean }>("/api/auth/totp/status", "GET"),
    ]);

    if (passkeyRes.status === "fulfilled") {
      setPasskeys(passkeyRes.value.passkeys || []);
    }
    if (sessionRes.status === "fulfilled") {
      setSessions(sessionRes.value.sessions || []);
    }
    if (recoveryRes.status === "fulfilled") {
      setRecoveryRemaining(recoveryRes.value.remaining || 0);
      setRecoveryGeneratedAt(recoveryRes.value.generatedAt || null);
    }
    if (totpRes.status === "fulfilled") {
      setTotpEnabled(totpRes.value.enabled);
    } else {
      setTotpEnabled(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    const ok = await refreshAuthAndAccount();
    if (ok) {
      await refreshSecondaryData();
    }
    setLoading(false);
  }, [refreshAuthAndAccount, refreshSecondaryData]);

  return {
    loading,
    signedIn,
    userId,
    email,
    passkeys,
    setPasskeys,
    sessions,
    recoveryRemaining,
    recoveryGeneratedAt,
    totpEnabled,
    setTotpEnabled,
    lastStepUpAt,
    refreshAll,
    refreshSecondaryData,
  };
}
