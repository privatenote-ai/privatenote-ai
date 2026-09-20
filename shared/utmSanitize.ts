export const UTM_MAX_LENGTH = 40;
export const UTM_ALLOWED = /^[a-z0-9][a-z0-9._-]{0,39}$/;

export type SanitizedUtm = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
};

export function sanitizeUtmValue(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const normalized = raw.trim().toLowerCase();
  if (!normalized || normalized.length > UTM_MAX_LENGTH) return null;
  if (!UTM_ALLOWED.test(normalized)) return null;
  return normalized;
}

export function sanitizeUtmFields(input: {
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
  utmContent?: unknown;
}): SanitizedUtm {
  return {
    source: sanitizeUtmValue(input.utmSource),
    medium: sanitizeUtmValue(input.utmMedium),
    campaign: sanitizeUtmValue(input.utmCampaign),
    content: sanitizeUtmValue(input.utmContent),
  };
}

export function utmCampaignKey(utm: SanitizedUtm): string | null {
  if (!utm.campaign) return null;
  const source = utm.source || "unknown";
  const medium = utm.medium || "unknown";
  const content = utm.content ? `:${utm.content}` : "";
  return `${source}:${medium}:${utm.campaign}${content}`.slice(0, 80);
}

export function readUtmFromSearchParams(search: string): SanitizedUtm {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  return sanitizeUtmFields({
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
  });
}
