import { useEffect } from "react";
import { useLocation } from "wouter";
import {
  notifyNativePageAnalyticsRoute,
  startNativePageAnalytics,
} from "@/utils/nativePageAnalytics";

/**
 * First-party page engagement tracker (visits, visible time, coarse heatmaps).
 * Mounted once in the app shell; skipped on admin/internal routes by the shared allow-list.
 */
export function NativePageAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    return startNativePageAnalytics();
  }, []);

  useEffect(() => {
    notifyNativePageAnalyticsRoute(location.split(/[?#]/)[0] || "/");
  }, [location]);

  return null;
}
