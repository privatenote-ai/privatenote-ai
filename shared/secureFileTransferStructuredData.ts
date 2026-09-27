import type { Translations } from "../client/src/utils/translations/types.ts";

export const SFT_FAQ_KEYS = [
  ["sftFaq1Q", "sftFaq1A"],
  ["sftFaq2Q", "sftFaq2A"],
  ["sftFaq3Q", "sftFaq3A"],
  ["sftFaq4Q", "sftFaq4A"],
  ["sftFaq5Q", "sftFaq5A"],
  ["sftFaq6Q", "sftFaq6A"],
  ["sftFaq7Q", "sftFaq7A"],
  ["sftFaq8Q", "sftFaq8A"],
  ["sftFaq9Q", "sftFaq9A"],
  ["sftFaq10Q", "sftFaq10A"],
  ["sftFaq11Q", "sftFaq11A"],
] as const;

export function isSecureFileTransferRoute(route: string): boolean {
  const parts = route.split("/").filter(Boolean);
  return parts[parts.length - 1] === "secure-file-transfer";
}

export function buildSecureFileTransferFaqSchema(t: Translations): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SFT_FAQ_KEYS.map(([questionKey, answerKey]) => ({
      "@type": "Question",
      name: t[questionKey],
      acceptedAnswer: {
        "@type": "Answer",
        text: t[answerKey],
      },
    })),
  };
}

/** Remove baked-in Cloudflare Web Analytics beacons from prerender HTML (edge injects one copy). */
export function stripPrerenderCloudflareAnalyticsBeacons(html: string): string {
  return html
    .replace(
      /<script\b[^>]*\bsrc=["']https?:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js[^"']*["'][^>]*>\s*<\/script>/gi,
      "",
    )
    .replace(/<script\b[^>]*\bdata-cf-beacon=["'][^"']*["'][^>]*>\s*<\/script>/gi, "");
}
