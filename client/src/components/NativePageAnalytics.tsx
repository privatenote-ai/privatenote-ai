import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  notifyNativePageAnalyticsRoute,
  startNativePageAnalytics,
} from "@/utils/nativePageAnalytics";

/**
 * First-party page tracker (visits and engaged time).
 * No session ID is sent. Admin routes and iframes are skipped.
 */
export function NativePageAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    try {
      return startNativePageAnalytics();
    } catch {
      return () => {};
    }
  }, []);

  useEffect(() => {
    try {
      notifyNativePageAnalyticsRoute(location.split(/[?#]/)[0] || "/");
    } catch {
      /* ignore */
    }
  }, [location]);

  return null;
}
