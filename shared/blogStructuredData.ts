import { localizedBlogPostPath, resolveCanonicalBlogSlug } from "./localizedBlogSlugs.ts";
import type { SupportedLanguage } from "./supportedLanguages.ts";

export const PUBLIC_SITE_ORIGIN = "https://privatenote.ai";
export const SITE_NAME = "PrivateNote.ai";
export const ORGANIZATION_ID = `${PUBLIC_SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${PUBLIC_SITE_ORIGIN}/#website`;
export const ORGANIZATION_LOGO_URL = `${PUBLIC_SITE_ORIGIN}/brand/privateNote-logo-mark.png`;
export const DEFAULT_SOCIAL_IMAGE_URL = `${PUBLIC_SITE_ORIGIN}/og-image.png`;

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogStructuredDataInput = {
  slug: string;
  language: SupportedLanguage;
  title: string;
  description?: string | null;
  author?: string | null;
  publishedAt?: Date | string | number | null;
  updatedAt?: Date | string | number | null;
  image?: string | null;
  tags?: string[];
  faqs?: BlogFaqItem[];
};

function toIsoDate(value: BlogStructuredDataInput["publishedAt"]): string | undefined {
  if (value == null) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function absoluteUrl(pathOrUrl: string | null | undefined): string {
  const raw = pathOrUrl?.trim();
  if (!raw) return DEFAULT_SOCIAL_IMAGE_URL;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `${PUBLIC_SITE_ORIGIN}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

export function buildBlogArticleStructuredData(input: BlogStructuredDataInput): Record<string, unknown> {
  const canonicalSlug = resolveCanonicalBlogSlug(input.slug);
  const articlePath = canonicalSlug
    ? localizedBlogPostPath(canonicalSlug, input.language)
    : input.language === "en"
      ? `/blog/${input.slug}`
      : `/${input.language}/blog/${input.slug}`;
  const articleUrl = `${PUBLIC_SITE_ORIGIN}${articlePath}`;
  const blogUrl = `${PUBLIC_SITE_ORIGIN}${input.language === "en" ? "/blog" : `/${input.language}/blog`}`;
  const publishedIso = toIsoDate(input.publishedAt);
  const modifiedIso = toIsoDate(input.updatedAt) ?? publishedIso;
  const description = input.description?.trim();
  const tags = input.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [];
  const faqs =
    input.faqs
      ?.map((faq) => ({
        question: faq.question.trim(),
        answer: faq.answer.trim(),
      }))
      .filter((faq) => faq.question && faq.answer) ?? [];

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${PUBLIC_SITE_ORIGIN}/`,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${PUBLIC_SITE_ORIGIN}/`,
      name: SITE_NAME,
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: input.language,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${articleUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${PUBLIC_SITE_ORIGIN}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: blogUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: input.title,
          item: articleUrl,
        },
      ],
    },
    {
      "@type": "BlogPosting",
      "@id": `${articleUrl}#article`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      headline: input.title,
      description,
      image: absoluteUrl(input.image),
      url: articleUrl,
      datePublished: publishedIso,
      dateModified: modifiedIso,
      author: {
        "@type": input.author && input.author !== SITE_NAME ? "Person" : "Organization",
        name: input.author?.trim() || SITE_NAME,
      },
      publisher: { "@id": ORGANIZATION_ID },
      keywords: tags.length > 0 ? tags : undefined,
      articleSection: tags[0],
      isAccessibleForFree: true,
      inLanguage: input.language,
    },
  ];

  if (faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${articleUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export type BlogCategoryStructuredDataInput = {
  category: string;
  language: SupportedLanguage;
  name: string;
  description?: string | null;
  posts?: Array<{ slug: string; title: string }>;
};

export function buildBlogCategoryStructuredData(
  input: BlogCategoryStructuredDataInput,
): Record<string, unknown> {
  const categoryPath =
    input.language === "en"
      ? `/blog/category/${input.category}`
      : `/${input.language}/blog/category/${input.category}`;
  const categoryUrl = `${PUBLIC_SITE_ORIGIN}${categoryPath}`;
  const blogUrl = `${PUBLIC_SITE_ORIGIN}${input.language === "en" ? "/blog" : `/${input.language}/blog`}`;
  const description = input.description?.trim();
  const posts = input.posts ?? [];

  const graph: Array<Record<string, unknown>> = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      url: `${PUBLIC_SITE_ORIGIN}/`,
      logo: {
        "@type": "ImageObject",
        url: ORGANIZATION_LOGO_URL,
        width: 512,
        height: 512,
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${PUBLIC_SITE_ORIGIN}/`,
      name: SITE_NAME,
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: input.language,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${categoryUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${PUBLIC_SITE_ORIGIN}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: blogUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: input.name,
          item: categoryUrl,
        },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": `${categoryUrl}#collection`,
      url: categoryUrl,
      name: input.name,
      description,
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: input.language,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: posts.length,
        itemListElement: posts.map((post, index) => {
          const canonicalSlug = resolveCanonicalBlogSlug(post.slug);
          const path = canonicalSlug
            ? localizedBlogPostPath(canonicalSlug, input.language)
            : input.language === "en"
              ? `/blog/${post.slug}`
              : `/${input.language}/blog/${post.slug}`;
          return {
            "@type": "ListItem",
            position: index + 1,
            name: post.title,
            url: `${PUBLIC_SITE_ORIGIN}${path}`,
          };
        }),
      },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
