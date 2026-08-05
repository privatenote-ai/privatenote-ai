import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  normalizeAccountType,
  planFeaturesFor,
  type AccountType,
  type PlanFeatureFlags,
} from "@shared/planCatalog";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { ACCOUNT_ENTITLEMENTS_INVALIDATED_EVENT } from "@/utils/accountEntitlementEvents";
import { entitlementRefreshDelayMs } from "@/utils/accountEntitlementRefresh";

export type AccountEntitlementSnapshot = {
  accountType: AccountType;
  configuredAccountType: AccountType;
  subscriptionState: string;
  paidAccessExpiresAt: string | null;
  billingCustomerLinked: boolean;
  emailNotifications: boolean;
  emailVerified: boolean;
  allowHostedAi: boolean;
  businessDisplayName: string | null;
  businessLogoUrl: string | null;
  businessAccentColor: string | null;
  hostedAiUsage: {
    used: number;
    limit: number;
    remaining: number;
    resetAt: number;
  };
  capabilities: PlanFeatureFlags;
  refreshedAt: string | null;
};

const FREE_SNAPSHOT: AccountEntitlementSnapshot = {
  accountType: "free",
  configuredAccountType: "free",
  subscriptionState: "free",
  paidAccessExpiresAt: null,
  billingCustomerLinked: false,
  emailNotifications: false,
  emailVerified: false,
  allowHostedAi: false,
  businessDisplayName: null,
  businessLogoUrl: null,
  businessAccentColor: null,
  hostedAiUsage: {
    used: 0,
    limit: planFeaturesFor("free").hostedAiMonthly,
    remaining: planFeaturesFor("free").hostedAiMonthly,
    resetAt: 0,
  },
  capabilities: planFeaturesFor("free"),
  refreshedAt: null,
};

type AccountEntitlementsContextValue = {
  entitlements: AccountEntitlementSnapshot;
  loading: boolean;
  refreshEntitlements: () => Promise<AccountEntitlementSnapshot>;
};

const AccountEntitlementsContext =
  createContext<AccountEntitlementsContextValue | null>(null);

export function AccountEntitlementsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const [entitlements, setEntitlements] =
    useState<AccountEntitlementSnapshot>(FREE_SNAPSHOT);
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef<Promise<AccountEntitlementSnapshot> | null>(null);
  const signedInRef = useRef(Boolean(user));
  signedInRef.current = Boolean(user);

  const refreshEntitlements = useCallback(async () => {
    if (!user) {
      setEntitlements(FREE_SNAPSHOT);
      setLoading(false);
      return FREE_SNAPSHOT;
    }
    if (inFlightRef.current) return inFlightRef.current;
    setLoading(true);
    const request = apiRequest<{
      accountType?: string | null;
      plan?: string | null;
      configuredAccountType?: string | null;
      subscriptionState?: string | null;
      paidAccessExpiresAt?: string | null;
      billingCustomerLinked?: boolean;
      emailNotifications?: boolean;
      emailVerified?: boolean;
      allowHostedAi?: boolean;
      businessDisplayName?: string | null;
      businessLogoUrl?: string | null;
      businessAccentColor?: string | null;
      hostedAiUsage?: {
        used?: number;
        limit?: number;
        remaining?: number;
        resetAt?: number;
      };
    }>("/api/auth/account/summary", "GET")
      .then((summary) => {
        if (!signedInRef.current) return FREE_SNAPSHOT;
        const accountType = normalizeAccountType(
          summary.accountType ?? summary.plan,
        );
        const planHostedAiLimit = planFeaturesFor(accountType).hostedAiMonthly;
        const next: AccountEntitlementSnapshot = {
          accountType,
          configuredAccountType: normalizeAccountType(
            summary.configuredAccountType ?? accountType,
          ),
          subscriptionState: summary.subscriptionState ?? "free",
          paidAccessExpiresAt: summary.paidAccessExpiresAt ?? null,
          billingCustomerLinked: summary.billingCustomerLinked === true,
          emailNotifications: summary.emailNotifications === true,
          emailVerified: summary.emailVerified === true,
          allowHostedAi: summary.allowHostedAi === true,
          businessDisplayName: summary.businessDisplayName ?? null,
          businessLogoUrl: summary.businessLogoUrl ?? null,
          businessAccentColor: summary.businessAccentColor ?? null,
          hostedAiUsage: {
            used: Math.max(0, Number(summary.hostedAiUsage?.used ?? 0)),
            limit: Math.max(
              0,
              Number(summary.hostedAiUsage?.limit ?? planHostedAiLimit),
            ),
            remaining: Math.max(
              0,
              Number(summary.hostedAiUsage?.remaining ?? planHostedAiLimit),
            ),
            resetAt: Math.max(0, Number(summary.hostedAiUsage?.resetAt ?? 0)),
          },
          capabilities: planFeaturesFor(accountType),
          refreshedAt: new Date().toISOString(),
        };
        setEntitlements(next);
        return next;
      })
      .catch(() => {
        setEntitlements(FREE_SNAPSHOT);
        return FREE_SNAPSHOT;
      })
      .finally(() => {
        inFlightRef.current = null;
        setLoading(false);
      });
    inFlightRef.current = request;
    return request;
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setEntitlements(FREE_SNAPSHOT);
      setLoading(false);
      return;
    }
    void refreshEntitlements();
  }, [authLoading, user, refreshEntitlements]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => void refreshEntitlements();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    window.addEventListener(ACCOUNT_ENTITLEMENTS_INVALIDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener(ACCOUNT_ENTITLEMENTS_INVALIDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user, refreshEntitlements]);

  useEffect(() => {
    if (!user) return;
    const delay = entitlementRefreshDelayMs(entitlements.paidAccessExpiresAt);
    if (delay == null) return;
    const timer = window.setTimeout(() => {
      void refreshEntitlements();
    }, delay);
    return () => window.clearTimeout(timer);
  }, [entitlements.paidAccessExpiresAt, refreshEntitlements, user]);

  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("billing") !== "success") return;
    let cancelled = false;
    const delays = [0, 750, 1500, 3000, 5000, 8000];
    void (async () => {
      for (const delay of delays) {
        if (delay > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, delay));
        }
        if (cancelled) return;
        const result = await refreshEntitlements();
        if (result.accountType !== "free") break;
      }
      if (cancelled) return;
      const cleaned = new URL(window.location.href);
      cleaned.searchParams.delete("billing");
      cleaned.searchParams.delete("session_id");
      window.history.replaceState(null, "", `${cleaned.pathname}${cleaned.search}${cleaned.hash}`);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshEntitlements, user]);

  const value = useMemo(
    () => ({ entitlements, loading, refreshEntitlements }),
    [entitlements, loading, refreshEntitlements],
  );
  return (
    <AccountEntitlementsContext.Provider value={value}>
      {children}
    </AccountEntitlementsContext.Provider>
  );
}

export function useAccountEntitlements(): AccountEntitlementsContextValue {
  const context = useContext(AccountEntitlementsContext);
  if (!context) {
    throw new Error(
      "useAccountEntitlements must be used within AccountEntitlementsProvider",
    );
  }
  return context;
}
