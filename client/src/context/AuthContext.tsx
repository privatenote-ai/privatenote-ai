import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApiRequestError, apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { fetchAndApplyAccountPreferredLanguage } from "@/utils/accountPreferredLanguage";
import {
  clearAuthHint,
  consumeJustSignedIn,
  readAuthHint,
  shouldEagerPrefetchAuth,
  writeAuthHint,
} from "@/utils/authPrefetch";
import { scheduleAuthSessionCheck } from "@/utils/scheduleDeferred";

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
  const { language, setLanguage } = useLanguage();
  // Seed from the last-known signed-in hint so a cold reload renders the profile
  // immediately instead of flashing "Sign in" before the deferred session check
  // resolves. The real session check below confirms or clears this.
  const [user, setUser] = useState<AuthUser | null>(() => readAuthHint());
  // Start as true on pages that check auth eagerly so components don't briefly
  // flash the "sign in" state before the first session API call resolves.
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return shouldEagerPrefetchAuth(window.location.pathname);
  });
  // Track whether we've already synced the DB language preference for this
  // session. We only do it once (on first successful auth check) so that a
  // footer language switch is not overridden every time the user changes tabs.
  const appliedDbLangRef = useRef(false);

  const refresh = useCallback(async (): Promise<AuthUser | null> => {
    try {
      const data = await apiRequest<{
        authenticated?: boolean;
        user?: { email?: string | null };
      }>("/api/auth/session", "GET");
      if (data?.authenticated && data.user) {
        const next: AuthUser = { email: data.user.email ?? null };
        setUser(next);
        writeAuthHint(next.email);
        if (!appliedDbLangRef.current) {
          appliedDbLangRef.current = true;
          void fetchAndApplyAccountPreferredLanguage(setLanguage);
        }
        return next;
      }
      setUser(null);
      clearAuthHint();
      // Reset so the next sign-in re-applies the DB language preference.
      appliedDbLangRef.current = false;
      return null;
    } catch (error) {
      // Only treat a real server response (e.g. 401) as a definitive logout. On a
      // transient network error keep the optimistic hint so a flaky connection
      // doesn't visually sign the user out.
      if (error instanceof ApiRequestError) {
        setUser(null);
        clearAuthHint();
        appliedDbLangRef.current = false;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLanguage]);

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
      clearAuthHint();
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/account")) {
        window.location.assign(localizedPath("/", language));
      }
    }
  }, [language]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // After a sign-in redirect (full page reload), check the session immediately so the
    // navbar reflects the signed-in state on first paint instead of waiting for the first
    // user interaction (the deferred check below is an LCP optimization for cold loads).
    if (shouldEagerPrefetchAuth(window.location.pathname) || consumeJustSignedIn()) {
      void refresh();
      return;
    }
    let fetched = false;
    const runOnce = () => {
      if (fetched) return;
      fetched = true;
      void refresh();
    };
    return scheduleAuthSessionCheck(runOnce);
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
