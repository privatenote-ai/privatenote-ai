/**
 * Fire a lightweight analytics event to the backend.
 * Always non-blocking — never throws, never awaited in critical paths.
 */
import {
  CLIENT_ANALYTICS_EVENTS,
  isClientAnalyticsEvent,
  type ClientAnalyticsEvent,
} from "@shared/clientAnalyticsEvents";
import { trackNamedEvent } from "@/utils/productAnalytics";

export type { ClientAnalyticsEvent };
export { CLIENT_ANALYTICS_EVENTS, isClientAnalyticsEvent };

export function fireAnalyticsEvent(event: ClientAnalyticsEvent): void {
  if (!isClientAnalyticsEvent(event)) return;
  trackNamedEvent(event);
}
