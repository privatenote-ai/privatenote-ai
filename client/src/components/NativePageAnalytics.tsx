import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  notifyNativePageAnalyticsRoute,
  startNativePageAnalytics,
} from "@/utils/nativePageAnalytics";

/**
 * First-party page tracker (visits and visible time only).
 * Mounted once in the app shell; skipped on admin/internal routes and iframes.
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
