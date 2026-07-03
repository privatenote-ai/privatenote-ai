import type { Translations } from "@/utils/translation";
import { buildDocumentTitle } from "@/utils/documentMeta";
import { resolveCanonicalBlogSlug } from "@shared/localizedBlogSlugs";
import { NON_ENGLISH_LANGUAGE_CODES } from "@shared/supportedLanguages";

const LOCALE_PREFIXES = new Set<string>(NON_ENGLISH_LANGUAGE_CODES);
const LOCALE_TITLE_LABELS: Record<string, string> = {
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  pt: "Português",
  sr: "Srpski",
  hr: "Hrvatski",
};

const SECURITY_GUIDE_META: Record<string, { title: string; description: string }> = {
  vpn: {
    title: "VPN Services Guide",
    description:
      "Learn how VPNs protect internet browsing, reduce exposure on public Wi-Fi, hide your IP address, and fit into a practical privacy setup.",
  },
  password: {
    title: "Password Managers Guide",
    description:
      "Learn how password managers generate unique passwords, store them safely, reduce reuse, and make stronger account security practical.",
  },
  messenger: {
    title: "Secure Messaging Guide",
    description:
      "Compare safer messaging habits for private conversations, including end-to-end encryption, disappearing messages, metadata exposure, and secure sharing limits.",
  },
  email: {
    title: "Secure Email Guide",
    description:
      "Protect email communications from scanning, surveillance, account takeover, and data mining with encrypted providers and safer handling habits.",
  },
  browser: {
    title: "Privacy Browsers Guide",
    description:
      "Browse with less tracking by choosing privacy-focused browsers, blocking invasive trackers, limiting fingerprinting, and controlling cookies.",
  },
};

const AUTH_META_DESCRIPTIONS = {
  signIn:
    "Sign in to PrivateNote.ai with email or passkeys to access your account, manage secure note settings, and keep private sharing workflows protected safely.",
  signUp:
    "Create a PrivateNote.ai account to send encrypted self-destructing notes, manage recovery options, and use passkeys for privacy-focused access safely.",
};

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

function withLocaleTitleLabel(
  meta: { title: string; description: string },
  locale: string | undefined,
): { title: string; description: string } {
  const label = locale ? LOCALE_TITLE_LABELS[locale] : undefined;
  if (!label) return meta;

  const suffix = " · PrivateNote.ai";
  if (meta.title.endsWith(suffix)) {
    return {
      ...meta,
      title: `${meta.title.slice(0, -suffix.length)} (${label})${suffix}`,
    };
  }
  return { ...meta, title: `${meta.title} (${label})` };
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
    case "one-time-secret-links":
      return {
        title: buildDocumentTitle(t.blogOneTimeLinksMetaTitle),
        description: t.blogOneTimeLinksMetaDescription,
      };
    case "encrypted-vs-secure-file-sharing":
      return {
        title: buildDocumentTitle(t.blogEncryptedFileSharingMetaTitle),
        description: t.blogEncryptedFileSharingMetaDescription,
      };
    case "send-secret-message-without-account":
      return {
        title: buildDocumentTitle(t.blogSecretNoAccountMetaTitle),
        description: t.blogSecretNoAccountMetaDescription,
      };
    case "secrets-never-send-in-chat":
      return {
        title: buildDocumentTitle(t.blogChatSecretsMetaTitle),
        description: t.blogChatSecretsMetaDescription,
      };
    case "what-is-end-to-end-encryption":
      return {
        title: buildDocumentTitle(t.blogE2eeDefinitionMetaTitle),
        description: t.blogE2eeDefinitionMetaDescription,
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
    case "secure-file-transfer":
      return {
        title: buildDocumentTitle(t.shareFile),
        description: t.sftHeroSubtitle,
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
    case "premium":
      return {
        title: buildDocumentTitle("Premium"),
        description:
          "Upgrade PrivateNote with delivery controls, note-open alerts, recipient checks, longer expirations, and higher hosted AI limits.",
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
    const slugFromUrl = rest.slice("blog/".length);
    if (!slugFromUrl || slugFromUrl.includes("/")) return null;
    const slug = resolveCanonicalBlogSlug(slugFromUrl) ?? slugFromUrl;
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
      return { title: buildDocumentTitle(t.signIn), description: AUTH_META_DESCRIPTIONS.signIn };
    case "sign-up":
      return { title: buildDocumentTitle(t.signUp), description: AUTH_META_DESCRIPTIONS.signUp };
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
    case "notifications":
      return {
        title: buildDocumentTitle(t.documentMetaNotificationCenterTitle ?? "Notifications"),
        description:
          t.documentMetaNotificationCenterDescription ??
          "Delivery status for your sent notes — no content or previews.",
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
    const guide = SECURITY_GUIDE_META[segments[1]];
    if (guide) {
      return {
        title: buildDocumentTitle(guide.title),
        description: guide.description,
      };
    }
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
    if (localized) return withLocaleTitleLabel(localized, segments[0]);
    return withLocaleTitleLabel(notFoundDocumentMeta(t), segments[0]);
  }

  if (segments.length === 1) {
    const single = pageMetaForPublicPage(segments[0], t);
    if (single) return single;
  }

  return notFoundDocumentMeta(t);
}
