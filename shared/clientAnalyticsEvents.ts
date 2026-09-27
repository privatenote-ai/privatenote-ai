export const CLIENT_ANALYTICS_EVENTS = [
  "wrong_password",
  "qr_share",
  "privnote_alternative_view",
  "privnote_alternative_create_note_click",
  "privnote_alternative_file_cta_click",
  "privnote_alternative_business_click",
  "privnote_alternative_pricing_click",
] as const;

export type ClientAnalyticsEvent = (typeof CLIENT_ANALYTICS_EVENTS)[number];

export function isClientAnalyticsEvent(value: unknown): value is ClientAnalyticsEvent {
  return typeof value === "string" && (CLIENT_ANALYTICS_EVENTS as readonly string[]).includes(value);
}
