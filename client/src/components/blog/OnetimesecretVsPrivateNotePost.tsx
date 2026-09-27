import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { onetimesecretVsPrivateNoteDe } from "@/components/blog/locale/onetimesecretVsPrivateNote.de";
import { onetimesecretVsPrivateNoteEn } from "@/components/blog/locale/onetimesecretVsPrivateNote.en";
import { onetimesecretVsPrivateNoteEs } from "@/components/blog/locale/onetimesecretVsPrivateNote.es";
import { onetimesecretVsPrivateNoteFr } from "@/components/blog/locale/onetimesecretVsPrivateNote.fr";
import { onetimesecretVsPrivateNoteHr } from "@/components/blog/locale/onetimesecretVsPrivateNote.hr";
import { onetimesecretVsPrivateNoteIt } from "@/components/blog/locale/onetimesecretVsPrivateNote.it";
import { onetimesecretVsPrivateNoteNl } from "@/components/blog/locale/onetimesecretVsPrivateNote.nl";
import { onetimesecretVsPrivateNotePt } from "@/components/blog/locale/onetimesecretVsPrivateNote.pt";
import { onetimesecretVsPrivateNoteSr } from "@/components/blog/locale/onetimesecretVsPrivateNote.sr";
import type { OnetimesecretVsPrivateNoteArticleCopy } from "@/components/blog/locale/onetimesecretVsPrivateNote.types";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";

const SLUG: BlogCanonicalSlug = "onetimesecret-vs-privatenote";

const copy: Partial<Record<SupportedLanguage, OnetimesecretVsPrivateNoteArticleCopy>> & {
  en: OnetimesecretVsPrivateNoteArticleCopy;
} = {
  en: onetimesecretVsPrivateNoteEn,
  de: onetimesecretVsPrivateNoteDe,
  fr: onetimesecretVsPrivateNoteFr,
  es: onetimesecretVsPrivateNoteEs,
  it: onetimesecretVsPrivateNoteIt,
  nl: onetimesecretVsPrivateNoteNl,
  pt: onetimesecretVsPrivateNotePt,
  hr: onetimesecretVsPrivateNoteHr,
  sr: onetimesecretVsPrivateNoteSr,
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-gray-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.9em] text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
}

function renderInlineContent(
  text: string,
  resolveLink: (href: string) => { to: string; external: boolean },
): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) {
      return <RichText key={index} text={part} />;
    }
    const [, label, href] = match;
    const { to, external } = resolveLink(href);
    if (external) {
      return (
        <a
          key={index}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {label}
        </a>
      );
    }
    return (
      <Link key={index} href={to} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    );
  });
}

function FlowStep({ text, tone }: { text: string; tone: "neutral" | "accent" }) {
  return (
    <p
      className={
        tone === "accent"
          ? "rounded-full border border-primary/25 bg-white px-3 py-1 text-[0.8125rem] font-medium text-gray-900 shadow-sm dark:bg-gray-950 dark:text-white"
          : "rounded-full border border-gray-200 bg-white px-3 py-1 text-[0.8125rem] font-medium text-gray-900 shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:text-white"
      }
    >
      {text}
    </p>
  );
}

function FlowConnector({ label, tone }: { label?: string; tone: "neutral" | "accent" }) {
  const line = tone === "accent" ? "bg-primary/50" : "bg-gray-300 dark:bg-gray-600";
  const mark = tone === "accent" ? "text-primary" : "text-gray-400 dark:text-gray-500";
  return (
    <div className="relative flex h-9 w-full items-center justify-center" aria-hidden>
      <div className={`h-full w-px ${line}`} />
      <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-xs leading-none ${mark}`}>▼</span>
      {label ? (
        <span
          className={`absolute left-[calc(50%+0.7rem)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.68rem] font-semibold uppercase tracking-wide ${mark}`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

const JOIN_KEY_LABEL: Record<SupportedLanguage, string> = {
  en: "Key",
  de: "Schlüssel",
  fr: "Clé",
  es: "Clave",
  it: "Chiave",
  nl: "Sleutel",
  pt: "Chave",
  hr: "Ključ",
  sr: "Ključ",
  tr: "Anahtar",
  pl: "Klucz",
};

type DiagramColumn = Array<{ text: string; via?: string }>;

function PrivateNoteJoinDiagram({
  tone,
  columns,
  keyLabel,
}: {
  tone: "neutral" | "accent";
  columns: DiagramColumn[];
  keyLabel: string;
}) {
  const stroke = tone === "accent" ? "#3b82f6" : "#9ca3af";
  const mark = tone === "accent" ? "text-primary" : "text-gray-400 dark:text-gray-500";
  const rootRef = React.useRef<HTMLDivElement>(null);
  const encryptRef = React.useRef<HTMLDivElement>(null);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [path, setPath] = React.useState<{
    d: string;
    arrow: string;
    labelX: number;
    labelY: number;
  } | null>(null);

  const left = columns[0] ?? [];
  const right = columns[1] ?? [];

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const from = encryptRef.current;
    const to = wrapRef.current;
    if (!root || !from || !to) return;

    const update = () => {
      const rootBox = root.getBoundingClientRect();
      const fromBox = from.getBoundingClientRect();
      const toBox = to.getBoundingClientRect();
      const x1 = fromBox.right - rootBox.left;
      const y1 = fromBox.top + fromBox.height / 2 - rootBox.top;
      const x2 = toBox.left - rootBox.left;
      const y2 = toBox.top + toBox.height / 2 - rootBox.top;
      const midX = x1 + (x2 - x1) * 0.55;
      setPath({
        d: `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`,
        arrow: `${x2 - 6},${y2 - 4} ${x2},${y2} ${x2 - 6},${y2 + 4}`,
        labelX: midX,
        labelY: y1,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative mx-auto w-max max-w-full">
      <div className="grid grid-cols-2 gap-x-20">
        <div className="flex w-[11.5rem] flex-col items-center">
          {left.map((step, index) => (
            <React.Fragment key={`left-${step.text}`}>
              {index > 0 ? <FlowConnector label={left[index - 1]?.via} tone={tone} /> : null}
              <div ref={index === 1 ? encryptRef : undefined}>
                <FlowStep text={step.text} tone={tone} />
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="flex w-[11.5rem] flex-col items-center">
          {right.map((step, index) => (
            <React.Fragment key={`right-${step.text}`}>
              {index > 0 ? <FlowConnector label={right[index - 1]?.via} tone={tone} /> : null}
              <div ref={index === 2 ? wrapRef : undefined}>
                <FlowStep text={step.text} tone={tone} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {path ? (
        <>
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
          >
            <path d={path.d} fill="none" stroke={stroke} strokeWidth="1.25" opacity="0.75" />
            <polygon points={path.arrow} fill={stroke} opacity="0.75" />
          </svg>
          <span
            className={`pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-sm bg-white px-1.5 text-[0.68rem] font-semibold uppercase tracking-wide dark:bg-gray-950 ${mark}`}
            style={{ left: path.labelX, top: path.labelY - 14 }}
          >
            {keyLabel}
          </span>
        </>
      ) : null}
    </div>
  );
}

function ArchitectureDiagram({
  diagrams,
  keyLabel,
}: {
  diagrams: NonNullable<OnetimesecretVsPrivateNoteArticleCopy["sections"][number]["diagrams"]>;
  keyLabel: string;
}) {
  return (
    <div className="space-y-16">
      {diagrams.map((diagram) => {
        const tone = diagram.label === "PrivateNote" ? "accent" : "neutral";
        const joined = diagram.columns.length > 1;
        return (
          <figure key={diagram.label} className="space-y-3">
            {diagram.intro ? (
              <p className="text-base text-gray-800 dark:text-gray-200">{diagram.intro}</p>
            ) : null}
            <div
              className={
                tone === "accent"
                  ? "mx-auto w-fit max-w-full rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-4 dark:border-primary/25 dark:bg-primary/[0.08]"
                  : "mx-auto w-fit max-w-full rounded-2xl border border-gray-200 bg-gray-50/80 px-8 py-4 pr-14 dark:border-gray-800 dark:bg-gray-900/40"
              }
            >
              <p
                className={
                  tone === "accent"
                    ? "mb-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary"
                    : "mb-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400"
                }
              >
                {diagram.label}
              </p>
              {joined ? (
                <PrivateNoteJoinDiagram tone={tone} columns={diagram.columns} keyLabel={keyLabel} />
              ) : (
              <div className="flex justify-center">
                {diagram.columns.map((column) => (
                  <div
                    key={column.map((step) => step.text).join("-")}
                    className="flex min-w-[9.5rem] flex-col items-center text-center"
                  >
                    {column.map((step, index) => (
                      <React.Fragment key={step.text}>
                        {index > 0 ? <FlowConnector label={column[index - 1]?.via} tone={tone} /> : null}
                        <FlowStep text={step.text} tone={tone} />
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
              )}
            </div>
            {diagram.caption ? (
              <figcaption className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                {diagram.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}

function ArticleParagraph({
  text,
  resolveLink,
}: {
  text: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return <p>{renderInlineContent(text, resolveLink)}</p>;
}

/**
 * Architecture comparison: where one-time secrets are encrypted,
 * and what a passphrase actually wraps.
 */
export const OnetimesecretVsPrivateNotePost: React.FC = () => {
  const { language, t } = useLanguage();
  const article = getBlogArticleCopy(copy, language);
  const createHref = localizedPath("/", language);
  const howItWorksHref = localizedPath("/how-it-works", language);
  const faqs = article.sections.flatMap((section) => section.faqs ?? []);

  const resolveLink = (href: string): { to: string; external: boolean } => {
    if (href.startsWith("blog:")) {
      return { to: blogPostPath(href.slice(5), language), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: createHref, external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return { to: href, external: true };
    }
    return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
  };

  return (
    <BlogGuideArticle slug={SLUG}>
      <article>
        <BlogPostHeader
          slug={SLUG}
          title={
            t.blogOnetimesecretVsPrivateNoteTitle ??
            "OneTimeSecret vs PrivateNote: Why Where You Encrypt Matters"
          }
          subtitle={
            t.blogOnetimesecretVsPrivateNoteSubtitle ??
            "OneTimeSecret encrypts on its servers. PrivateNote encrypts before the secret leaves your device."
          }
          excerpt={
            t.blogOnetimesecretVsPrivateNoteExcerpt ??
            "Both products deliver a temporary secret link, but their trust models are fundamentally different. OneTimeSecret performs encryption on its servers, which means the service receives the secret in plaintext and must be trusted to handle it securely before encryption. If a passphrase is used, that passphrase is also submitted to the service as part of the server-side protection mechanism. PrivateNote encrypts the secret locally before it leaves the sender’s device. The service receives ciphertext rather than the plaintext secret, and an optional passphrase protects the client-side encryption key locally, adding protection if the link itself is exposed."
          }
          headerClassName="mb-8"
          faqs={faqs}
        />

        <BlogArticleTakeaways slug={SLUG} />

        <div className="mt-4 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.intro.map((paragraph) => (
            <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
          ))}

          {article.sections.map((section) => (
            <div key={section.title} className="space-y-6 pt-10">
              <hr className="border-gray-200/80 dark:border-gray-800" />
              <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((item) => (
                      <li key={item}>{renderInlineContent(item, resolveLink)}</li>
                    ))}
                  </ul>
                ) : null}
                {section.paragraphsAfterBullets?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.diagrams ? (
                  <ArchitectureDiagram
                    diagrams={section.diagrams}
                    keyLabel={JOIN_KEY_LABEL[language] ?? JOIN_KEY_LABEL.en}
                  />
                ) : null}
                {section.comparisonTable ? (
                  <div className="space-y-4 pt-8">
                    {section.comparisonTable.lead ? (
                      <p className="max-w-2xl text-base text-gray-800 dark:text-gray-200">
                        {section.comparisonTable.lead}
                      </p>
                    ) : null}
                  <div className="overflow-x-auto rounded-2xl border border-primary/20 shadow-sm dark:border-primary/25">
                    <table className="w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm">
                      <thead>
                        <tr>
                          {section.comparisonTable.headers.map((header, headerIndex) => (
                            <th
                              key={header || "property"}
                              className={
                                headerIndex === 2
                                  ? "bg-primary/[0.12] px-5 py-4 font-semibold text-primary dark:bg-primary/20"
                                  : headerIndex === 0
                                    ? "bg-gray-50 px-5 py-4 font-semibold text-gray-900 dark:bg-gray-900/70 dark:text-white"
                                    : "bg-gray-50 px-5 py-4 font-semibold text-gray-900 dark:bg-gray-900/70 dark:text-white"
                              }
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.comparisonTable.rows.map((row, rowIndex) => (
                          <tr key={row[0]}>
                            {row.map((cell, cellIndex) => (
                              <td
                                key={`${row[0]}-${cellIndex}`}
                                className={
                                  cellIndex === 2
                                    ? `bg-primary/[0.06] px-5 py-4 text-gray-800 dark:bg-primary/[0.1] dark:text-gray-100 ${
                                        rowIndex > 0 ? "border-t border-primary/15" : ""
                                      }`
                                    : cellIndex === 0
                                      ? `bg-white px-5 py-4 font-medium text-gray-900 dark:bg-gray-950 dark:text-white ${
                                          rowIndex > 0 ? "border-t border-gray-200 dark:border-gray-800" : ""
                                        }`
                                      : `bg-white px-5 py-4 text-gray-700 dark:bg-gray-950 dark:text-gray-300 ${
                                          rowIndex > 0 ? "border-t border-gray-200 dark:border-gray-800" : ""
                                        }`
                                }
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
                ) : null}
                {section.paragraphsAfterTable?.map((paragraph) => (
                  <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                ))}
                {section.callout ? (
                  <blockquote className="rounded-2xl border border-primary/20 border-l-4 border-l-primary bg-primary/[0.05] px-5 py-5 leading-relaxed text-gray-800 dark:border-primary/25 dark:bg-primary/[0.08] dark:text-gray-200 sm:px-6">
                    {section.calloutTitle ? (
                      <p className="mb-3 text-sm font-semibold tracking-wide text-primary">
                        {section.calloutTitle}
                      </p>
                    ) : null}
                    <div className="space-y-3">
                      {section.callout.split(/\n\n+/).map((paragraph) => (
                        <p key={paragraph}>{renderInlineContent(paragraph, resolveLink)}</p>
                      ))}
                    </div>
                  </blockquote>
                ) : null}
                {section.faqs ? (
                  <div className="space-y-4">
                    {section.faqs.map((faq) => (
                      <div
                        key={faq.question}
                        className="space-y-3 rounded-2xl border border-gray-200/80 bg-gray-50/50 px-5 py-5 dark:border-gray-800 dark:bg-gray-900/30"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <ArticleParagraph text={faq.answer} resolveLink={resolveLink} />
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
          <h2 data-blog-toc-ignore="true" className="text-xl font-bold text-gray-900 dark:text-white">
            {article.ctaTitle}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {article.ctaBody}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={createHref}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
            >
              {article.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={howItWorksHref}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
            >
              {article.ctaSecondary}
            </Link>
          </div>
        </section>

        <BlogPostCrossLinks slug={SLUG} />
      </article>
    </BlogGuideArticle>
  );
};
