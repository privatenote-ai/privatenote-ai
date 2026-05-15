import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { scheduleDeferred } from "@/utils/scheduleDeferred";

type AuthUser = {
  email: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<AuthUser | null>;
  /**
   * Like {@link refresh} but retries with exponential backoff if the session
   * comes back unauthenticated. Useful right after a sign-in API call where
   * D1 read-after-write replication lag can briefly return a stale "not yet
   * authenticated" view of the session row.
   */
  refreshUntilAuthenticated: (options?: { maxAttempts?: number }) => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const data = await apiRequest<{
        authenticated?: boolean;
        user?: { email?: string | null };
      }>("/api/auth/session", "GET");
      if (data?.authenticated && data.user) {
        const next: AuthUser = { email: data.user.email ?? null };
        setUser(next);
        return next;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUntilAuthenticated = useCallback(
    async ({ maxAttempts = 5 }: { maxAttempts?: number } = {}): Promise<AuthUser | null> => {
      // Retry with exponential backoff: 0ms, 250ms, 500ms, 1000ms, 2000ms
      // Total worst case ~3.75s. Handles D1 replication lag after sign-in.
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (attempt > 0) {
          const delayMs = Math.min(250 * 2 ** (attempt - 1), 2000);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
        const result = await refresh();
        if (result) return result;
      }
      return null;
    },
    [refresh],
  );

  const signOut = useCallback(async () => {
    try {
      await apiRequest("/api/auth/logout", "POST");
    } finally {
      setUser(null);
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/account")) {
        window.location.assign(localizedPath("/", language));
      }
    }
  }, [language]);

  useEffect(() => {
    return scheduleDeferred(() => {
      void refresh();
    });
  }, [refresh]);

  // Self-heal: re-fetch session when the tab regains visibility or focus.
  // This makes the navbar update if a sign-in completed in another tab,
  // or if a sign-in flow forgot to await refresh().
  useEffect(() => {
    const onVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        void refresh();
      }
    };
    const onFocus = () => {
      void refresh();
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisibilityChange);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("focus", onFocus);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("focus", onFocus);
      }
    };
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refresh,
      refreshUntilAuthenticated,
      signOut,
    }),
    [user, loading, refresh, refreshUntilAuthenticated, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
