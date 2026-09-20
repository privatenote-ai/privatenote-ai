export const REFERRER_TYPES = [
  "direct",
  "google",
  "bing",
  "x",
  "reddit",
  "linkedin",
  "github",
  "npm",
  "chatgpt",
  "claude",
  "other",
] as const;

export type ReferrerType = (typeof REFERRER_TYPES)[number];

const SEARCH_TYPES = new Set<ReferrerType>(["google", "bing"]);

const HOST_RULES: Array<{ type: ReferrerType; test: (host: string) => boolean }> = [
  { type: "google", test: (h) => h === "google.com" || h.endsWith(".google.com") || h === "google.co.uk" || h.endsWith(".google.co.uk") },
  { type: "bing", test: (h) => h === "bing.com" || h.endsWith(".bing.com") },
  { type: "x", test: (h) => h === "x.com" || h === "twitter.com" || h.endsWith(".x.com") || h.endsWith(".twitter.com") || h === "t.co" },
  { type: "reddit", test: (h) => h === "reddit.com" || h.endsWith(".reddit.com") },
  { type: "linkedin", test: (h) => h === "linkedin.com" || h.endsWith(".linkedin.com") || h === "lnkd.in" },
  { type: "github", test: (h) => h === "github.com" || h.endsWith(".github.com") || h === "github.io" || h.endsWith(".github.io") },
  { type: "npm", test: (h) => h === "npmjs.com" || h.endsWith(".npmjs.com") || h === "npmjs.org" },
  { type: "chatgpt", test: (h) => h === "chatgpt.com" || h.endsWith(".chatgpt.com") || h === "chat.openai.com" || h === "openai.com" },
  { type: "claude", test: (h) => h === "claude.ai" || h.endsWith(".claude.ai") || h === "anthropic.com" || h.endsWith(".anthropic.com") },
];

function hostnameFromReferrer(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    const value = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const host = new URL(value).hostname.toLowerCase();
    return host.startsWith("www.") ? host.slice(4) : host;
  } catch {
    return null;
  }
}

export function isSearchReferrer(type: ReferrerType): boolean {
  return SEARCH_TYPES.has(type);
}

export function isReferrerType(value: unknown): value is ReferrerType {
  return typeof value === "string" && (REFERRER_TYPES as readonly string[]).includes(value);
}

/**
 * Map a document.referrer or hostname to a closed category.
 * Same-site referrers are direct. Unknown hosts are other.
 */
export function categorizeReferrer(raw: string | null | undefined, pageOrigin?: string): ReferrerType {
  if (!raw || !raw.trim()) return "direct";
  const host = hostnameFromReferrer(raw);
  if (!host) return "direct";
  if (pageOrigin) {
    try {
      const originHost = new URL(pageOrigin).hostname.toLowerCase().replace(/^www\./, "");
      if (host === originHost || host.endsWith(`.${originHost}`)) return "direct";
    } catch {
      /* ignore */
    }
  }
  for (const rule of HOST_RULES) {
    if (rule.test(host)) return rule.type;
  }
  return "other";
}
