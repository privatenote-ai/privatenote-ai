import type { Translations } from "@/utils/translation";
import { buildDocumentTitle } from "@/utils/documentMeta";

const LOCALE_PREFIXES = new Set(["de", "fr", "es"]);

export function normalizeDocumentPath(pathname: string): string {
  const raw = pathname.split(/[?#]/)[0] ?? "";
  if (raw.length > 1 && raw.endsWith("/")) return raw.slice(0, -1);
  return raw || "/";
}

function homeDocumentMeta(t: Translations): { title: string; description: string } {
  const titlePart = `${t.homeHeroLine1.replace(/\s*,\s*$/, "")} — ${t.homeHeroLine2}`;
  return {
    title: buildDocumentTitle(titlePart),
    description: t.documentMetaHomeDescription,
  };
}

function notFoundDocumentMeta(t: Translations): { title: string; description: string } {
  return {
    title: buildDocumentTitle(t.documentMetaNotFoundTitle),
    description: t.documentMetaNotFoundDescription,
  };
}

function blogSlugStaticMeta(
  slug: string,
  t: Translations,
): { title: string; description: string } | null {
  switch (slug) {
    case "privacy-tools":
      return { title: buildDocumentTitle(t.blogPrivacyTitle), description: t.blogPrivacyExcerpt };
    case "myth-good-enough-security":
      return { title: buildDocumentTitle(t.blogGoodEnoughTitle), description: t.blogGoodEnoughExcerpt };
    case "how-we-generate-passwords":
      return {
        title: buildDocumentTitle(t.blogPasswordTitle),
        description: t.blogPasswordMetaDescription,
      };
    case "workplace-texts-private-note":
      return {
        title: buildDocumentTitle(t.blogWorkplaceMetaTitle),
        description: t.blogWorkplaceMetaDescription,
      };
    case "privatenote-for-developers":
      return {
        title: buildDocumentTitle(t.blogDevelopersTitle),
        description: t.blogDevelopersExcerpt,
      };
    case "privatenote-codex":
      return {
        title: buildDocumentTitle(t.blogCodexTitle),
        description: t.blogCodexExcerpt,
      };
    case "securing-ai-agents-like-employees":
      return {
        title: buildDocumentTitle(t.blogAgentSecurityMetaTitle),
        description: t.blogAgentSecurityMetaDescription,
      };
    default:
      return null;
  }
}

function pageMetaForPublicPage(rest: string, t: Translations): { title: string; description: string } | null {
  switch (rest) {
    case "password-generator":
      return {
        title: buildDocumentTitle(t.passwordGenerator),
        description: t.passwordGeneratorSubtitle,
      };
    case "privacy-tools":
      return {
        title: buildDocumentTitle(t.documentMetaPrivacyToolsTitle),
        description: t.documentMetaPrivacyToolsDescription,
      };
    case "security-resources":
      return {
        title: buildDocumentTitle(`${t.securityHeroPrefix} ${t.securityHeroAccent}`),
        description: t.securityHeroSubtitle,
      };
    case "how-it-works":
      return {
        title: buildDocumentTitle(`${t.howHeroPrefix} ${t.howHeroAccent}`),
        description: t.documentMetaHowItWorksDescription,
      };
    case "developers":
      return {
        title: buildDocumentTitle(t.documentMetaDevelopersTitle),
        description: t.documentMetaDevelopersDescription,
      };
    case "about":
      return {
        title: buildDocumentTitle(t.aboutPageTitle),
        description: t.documentMetaAboutDescription,
      };
    case "contact":
      return {
        title: buildDocumentTitle(t.documentMetaContactTitle),
        description: t.documentMetaContactDescription,
      };
    case "privacy":
      return {
        title: buildDocumentTitle(t.privacyPolicy),
        description: t.documentMetaPrivacyPolicyDescription,
      };
    case "terms":
      return {
        title: buildDocumentTitle(t.termsOfUse),
        description: t.documentMetaTermsDescription,
      };
    default:
      return null;
  }
}

function metaForBlogSubpath(slug: string, t: Translations): { title: string; description: string } {
  const fromSlug = blogSlugStaticMeta(slug, t);
  if (fromSlug) return fromSlug;
  return {
    title: buildDocumentTitle(t.blog),
    description: t.documentMetaBlogLoadingDescription,
  };
}

/** Inner path after locale prefix, e.g. `password-generator` or `blog/my-slug`. */
function metaForLocalizedRest(rest: string, t: Translations): { title: string; description: string } | null {
  if (rest === "blog") {
    return { title: buildDocumentTitle(t.blog), description: t.blogSubtitle };
  }
  if (rest.startsWith("blog/")) {
    const slug = rest.slice("blog/".length);
    if (!slug || slug.includes("/")) return null;
    return metaForBlogSubpath(slug, t);
  }
  return pageMetaForPublicPage(rest, t);
}

function metaForAuthSegments(segments: string[], t: Translations): { title: string; description: string } | null {
  if (segments[0] === "magic" && segments.length === 1) {
    return { title: buildDocumentTitle(t.authCheckEmailTitle), description: t.authCheckEmailDesc };
  }
  if (segments[0] !== "auth") return null;

  const sub = segments[1];
  if (!sub) {
    return {
      title: buildDocumentTitle(t.documentMetaAuthRootTitle),
      description: t.documentMetaAuthRootDescription,
    };
  }
  switch (sub) {
    case "sign-in":
    case "sign-up":
      return { title: buildDocumentTitle(t.signIn), description: t.authUnifiedSubtitle };
    case "magic":
      return { title: buildDocumentTitle(t.authCheckEmailTitle), description: t.authCheckEmailDesc };
    case "recovery":
      return {
        title: buildDocumentTitle(t.documentMetaRecoveryTitle),
        description: t.documentMetaRecoveryDescription,
      };
    case "email-change":
      return {
        title: buildDocumentTitle(t.documentMetaEmailChangeTitle),
        description: t.documentMetaEmailChangeDescription,
      };
    case "totp":
      return {
        title: buildDocumentTitle(t.documentMetaTotpTitle),
        description: t.documentMetaTotpDescription,
      };
    default:
      return {
        title: buildDocumentTitle(t.documentMetaAuthRootTitle),
        description: t.documentMetaAuthRootDescription,
      };
  }
}

function metaForAdminSegments(segments: string[], t: Translations): { title: string; description: string } | null {
  if (segments[0] !== "admin") return null;
  switch (segments[1]) {
    case "blog":
      return {
        title: buildDocumentTitle(t.documentMetaAdminBlogTitle),
        description: t.documentMetaAdminBlogDescription,
      };
    case "analytics":
      return {
        title: buildDocumentTitle(t.documentMetaAnalyticsTitle),
        description: t.documentMetaAnalyticsDescription,
      };
    case "audit-logs":
      return {
        title: buildDocumentTitle(t.documentMetaAuditLogsTitle),
        description: t.documentMetaAuditLogsDescription,
      };
    default:
      return notFoundDocumentMeta(t);
  }
}

function metaForAccountSegments(segments: string[], t: Translations): { title: string; description: string } | null {
  if (segments[0] !== "account") return null;
  const sub = segments[1];
  if (!sub) {
    return { title: buildDocumentTitle(t.account), description: t.authOverviewSubtitle };
  }
  switch (sub) {
    case "security":
      return {
        title: buildDocumentTitle(t.documentMetaAccountSecurityTitle),
        description: t.documentMetaAccountSecurityDescription,
      };
    case "activity":
      return {
        title: buildDocumentTitle(t.documentMetaAccountActivityTitle),
        description: t.documentMetaAccountActivityDescription,
      };
    case "preferences":
      return {
        title: buildDocumentTitle(t.documentMetaAccountPreferencesTitle),
        description: t.documentMetaAccountPreferencesDescription,
      };
    default:
      return notFoundDocumentMeta(t);
  }
}

/**
 * Resolve `<title>` and meta description for the current pathname using static route data.
 * Dynamic pages (note view, some blog posts, security guide articles) may override via `setDocumentMeta`.
 */
export function resolveDocumentMeta(
  pathname: string,
  t: Translations,
): { title: string; description: string } {
  const p = normalizeDocumentPath(pathname);
  const segments = p.split("/").filter(Boolean);

  if (p === "/" || segments.length === 0) {
    return homeDocumentMeta(t);
  }

  if (segments.length === 1 && LOCALE_PREFIXES.has(segments[0])) {
    return homeDocumentMeta(t);
  }

  const authMeta = metaForAuthSegments(segments, t);
  if (authMeta) return authMeta;

  if (segments[0] === "note" && segments[1] && segments.length === 2) {
    return {
      title: buildDocumentTitle(t.privateNote),
      description: t.documentMetaViewNoteDescription,
    };
  }

  const adminMeta = metaForAdminSegments(segments, t);
  if (adminMeta) return adminMeta;

  const accountMeta = metaForAccountSegments(segments, t);
  if (accountMeta) return accountMeta;

  if (segments[0] === "test-llm" && segments.length === 1) {
    return {
      title: buildDocumentTitle(t.documentMetaTestLlmTitle),
      description: t.documentMetaTestLlmDescription,
    };
  }
  if (segments[0] === "llm-ui" && segments.length === 1) {
    return {
      title: buildDocumentTitle(t.documentMetaLlmUiTitle),
      description: t.documentMetaLlmUiDescription,
    };
  }

  if (segments[0] === "security-guides" && segments[1] && segments.length === 2) {
    return {
      title: buildDocumentTitle(t.documentMetaSecurityGuideTitle),
      description: t.documentMetaSecurityGuideDescription,
    };
  }

  if (segments[0] === "blog") {
    if (segments.length === 1) {
      return { title: buildDocumentTitle(t.blog), description: t.blogSubtitle };
    }
    if (segments.length === 2 && segments[1]) {
      return metaForBlogSubpath(segments[1], t);
    }
    return notFoundDocumentMeta(t);
  }

  if (segments.length >= 2 && LOCALE_PREFIXES.has(segments[0])) {
    const rest = segments.slice(1).join("/");
    const localized = metaForLocalizedRest(rest, t);
    if (localized) return localized;
    return notFoundDocumentMeta(t);
  }

  if (segments.length === 1) {
    const single = pageMetaForPublicPage(segments[0], t);
    if (single) return single;
  }

  return notFoundDocumentMeta(t);
}
