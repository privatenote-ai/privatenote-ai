import React from "react";
import { Link } from "wouter";
import { ArrowRight, Hash, Laptop, Server, Shield, Trash2, type LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { oneTimeSecretLinksDe } from "@/components/blog/locale/oneTimeSecretLinks.de";
import { oneTimeSecretLinksEn } from "@/components/blog/locale/oneTimeSecretLinks.en";
import { oneTimeSecretLinksEs } from "@/components/blog/locale/oneTimeSecretLinks.es";
import { oneTimeSecretLinksFr } from "@/components/blog/locale/oneTimeSecretLinks.fr";
import { oneTimeSecretLinksHr } from "@/components/blog/locale/oneTimeSecretLinks.hr";
import { oneTimeSecretLinksIt } from "@/components/blog/locale/oneTimeSecretLinks.it";
import { oneTimeSecretLinksNl } from "@/components/blog/locale/oneTimeSecretLinks.nl";
import { oneTimeSecretLinksPt } from "@/components/blog/locale/oneTimeSecretLinks.pt";
import { oneTimeSecretLinksSr } from "@/components/blog/locale/oneTimeSecretLinks.sr";
import type { OneTimeSecretLinksArticleCopy } from "@/components/blog/locale/oneTimeSecretLinks.types";
import { CHROME_EXTENSION_STORE_URL } from "@/utils/chromeExtensionOnboarding";

const heroImagePath = "/images/dieandreart-footprint-2143685.jpg";
const heroArtistUrl =
  "https://pixabay.com/users/dieandreart-3765415/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2143685";
const heroPixabayUrl =
  "https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2143685";

type ArticleCopy = OneTimeSecretLinksArticleCopy;
type BulletItem = OneTimeSecretLinksArticleCopy["sections"][number]["bullets"] extends (infer B)[] | undefined ? B : never;
type FlowStep = NonNullable<OneTimeSecretLinksArticleCopy["sections"][number]["flowSteps"]>[number];
type TableRow = NonNullable<OneTimeSecretLinksArticleCopy["sections"][number]["table"]>[number];
type ResolveLink = (href: string) => { to: string; external: boolean };

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function renderInlineContent(text: string, resolveLink: ResolveLink): React.ReactNode {
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

function ArticleParagraph({
  text,
  lead = false,
  resolveLink,
}: {
  text: string;
  lead?: boolean;
  resolveLink: ResolveLink;
}) {
  return (
    <p
      className={
        lead
          ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300"
      }
    >
      {renderInlineContent(text, resolveLink)}
    </p>
  );
}

function CalloutBox({ text, resolveLink }: { text: string; resolveLink: ResolveLink }) {
  return (
    <blockquote className="border-l-2 border-gray-300 py-1 pl-5 dark:border-gray-600">
      <p className="text-[1.05rem] leading-relaxed text-gray-800 dark:text-gray-200">
        {renderInlineContent(text, resolveLink)}
      </p>
    </blockquote>
  );
}

function BulletList({ items, resolveLink }: { items: BulletItem[]; resolveLink: ResolveLink }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="flex gap-3" key={item.label}>
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          <span className="text-gray-700 dark:text-gray-300">
            {item.body ? (
              <>
                <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
                {" — "}
                {renderInlineContent(item.body, resolveLink)}
              </>
            ) : (
              renderInlineContent(item.label, resolveLink)
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ChromeExtensionLink({ label }: { label: string }) {
  return (
    <div className="flex justify-center pt-1">
      <a
        href={CHROME_EXTENSION_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );
}

const ONE_TIME_SECRET_FLOW_ICONS: LucideIcon[] = [Laptop, Server, Hash, Trash2];

function OneTimeSecretFlowDiagram({ steps, caption }: { steps: FlowStep[]; caption?: string }) {
  return (
    <figure className="rounded-xl border border-primary/15 bg-primary/[0.03] px-4 py-5 dark:border-primary/20 dark:bg-primary/[0.05] sm:px-5 sm:py-6">
      {caption ? (
        <figcaption className="mb-4 text-sm font-medium text-gray-800 dark:text-gray-200">
          <RichText text={caption} />
        </figcaption>
      ) : null}
      <ol className="m-0 list-none space-y-0 p-0">
        {steps.map((step, index) => {
          const Icon = ONE_TIME_SECRET_FLOW_ICONS[index] ?? Server;
          const isLast = index === steps.length - 1;

          return (
            <li className="relative flex gap-4" key={step.title}>
              <div className="flex w-8 shrink-0 flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-primary/25 dark:bg-gray-950">
                  <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />
                </div>
                {!isLast ? (
                  <div
                    className="my-1.5 w-px flex-1 min-h-[1.25rem] bg-gradient-to-b from-primary/30 to-gray-200 dark:to-gray-700"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-5")}>
                <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-primary/75 dark:text-primary/70">
                  {step.step}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-gray-900 dark:text-white">{step.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const isGood = verdict.includes("✓");
  const isBad = verdict.includes("✗");

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        isGood && "whitespace-nowrap bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800",
        isBad && "whitespace-nowrap bg-red-50 text-red-800 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800",
        !isGood &&
          !isBad &&
          "max-w-[14rem] whitespace-normal text-left leading-snug bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800",
      )}
    >
      {verdict}
    </span>
  );
}

function ComparisonTable({
  headers,
  rows,
}: {
  headers: ArticleCopy["tableHeaders"];
  rows: TableRow[];
}) {
  const headCellClass =
    "h-11 border-r border-gray-200 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 last:border-r-0 dark:border-gray-700 dark:text-gray-400";
  const bodyCellClass =
    "border-r border-gray-100 px-4 py-3.5 align-top last:border-r-0 dark:border-gray-800";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50/90 hover:bg-gray-50/90 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:bg-gray-800/60">
            <TableHead className={headCellClass}>{headers.channel}</TableHead>
            <TableHead className={headCellClass}>{headers.encrypted}</TableHead>
            <TableHead className={headCellClass}>{headers.persistent}</TableHead>
            <TableHead className={cn(headCellClass, "text-right")}>{headers.verdict}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isRecommended = row.verdict.includes("✓");

            return (
              <TableRow
                key={row.channel}
                className={cn(
                  "border-b border-gray-100 last:border-0 dark:border-gray-800",
                  isRecommended
                    ? "bg-emerald-50/50 hover:bg-emerald-50/70 dark:bg-emerald-950/15 dark:hover:bg-emerald-950/25"
                    : "hover:bg-gray-50/80 dark:hover:bg-gray-800/30",
                )}
              >
                <TableCell className={cn(bodyCellClass, "font-medium text-gray-900 dark:text-white")}>
                  {row.channel}
                </TableCell>
                <TableCell className={cn(bodyCellClass, "text-gray-600 dark:text-gray-300")}>
                  {row.encrypted}
                </TableCell>
                <TableCell className={cn(bodyCellClass, "text-gray-600 dark:text-gray-300")}>
                  {row.persistent}
                </TableCell>
                <TableCell className={cn(bodyCellClass, isRecommended ? "text-right" : "text-left sm:text-right")}>
                  <VerdictBadge verdict={row.verdict} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function FitList({
  label,
  items,
  resolveLink,
}: {
  label: string;
  items: string[];
  resolveLink: ResolveLink;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            <span className="text-gray-700 dark:text-gray-300">{renderInlineContent(item, resolveLink)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NumberedSteps({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li className="flex gap-4" key={step.title}>
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {index + 1}
          </span>
          <span>
            <strong className="font-semibold text-gray-900 dark:text-white">{step.title}</strong>
            <span className="mt-1 block text-gray-700 dark:text-gray-300">{step.body}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function Checklist({ items, resolveLink }: { items: string[]; resolveLink: ResolveLink }) {
  return (
    <ul className="m-0 list-none space-y-3 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-primary/15 bg-primary/[0.03] px-4 py-3 dark:border-primary/20 dark:bg-primary/[0.06]"
        >
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-primary/40 bg-white text-[0.65rem] font-bold text-primary dark:bg-gray-950"
            aria-hidden
          >
            ✓
          </span>
          <span className="text-gray-700 dark:text-gray-300">{renderInlineContent(item, resolveLink)}</span>
        </li>
      ))}
    </ul>
  );
}

function GenericComparisonTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
        <thead className="bg-gray-50 dark:bg-gray-900/60">
          <tr>
            {headers.map((header, headerIndex) => (
              <th
                key={`${header}-${headerIndex}`}
                className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900 dark:border-gray-800 dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]} className="align-top">
              {row.map((cell, cellIndex) => (
                <td
                  key={`${row[0]}-${cellIndex}`}
                  className="border-b border-gray-200 px-4 py-3 text-gray-700 dark:border-gray-800 dark:text-gray-300"
                >
                  {cellIndex === 0 ? (
                    <span className="font-medium text-gray-900 dark:text-white">{cell}</span>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: oneTimeSecretLinksEn,
  de: oneTimeSecretLinksDe,
  fr: oneTimeSecretLinksFr,
  es: oneTimeSecretLinksEs,
  nl: oneTimeSecretLinksNl,
  pt: oneTimeSecretLinksPt,
  it: oneTimeSecretLinksIt,
  hr: oneTimeSecretLinksHr,
  sr: oneTimeSecretLinksSr,
};

export const OneTimeSecretLinksPost: React.FC = () => {
  const { t, language } = useLanguage();
  const howItWorksPath = localizedPath("/how-it-works", language);
  const toolPath = localizedPath("/one-time-link", language);
  const article = getBlogArticleCopy(copy, language);
  const faqs = article.sections.flatMap((section) => section.faqs ?? []);

  const resolveLink = (href: string): { to: string; external: boolean } => {
    if (href.startsWith("blog:")) {
      return { to: blogPostPath(href.slice(5), language), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: localizedPath("/", language), external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return { to: href, external: true };
    }
    return { to: localizedPath(href.startsWith("/") ? href : `/${href}`, language), external: false };
  };

  return (
    <BlogGuideArticle slug="one-time-secret-links">
      <article>
        <BlogPostHeader
          slug="one-time-secret-links"
          title={t.blogOneTimeLinksTitle}
          subtitle={t.blogOneTimeLinksSubtitle}
          excerpt={t.blogOneTimeLinksExcerpt}
          faqs={faqs.length > 0 ? faqs : undefined}
          headerClassName="mb-12"
        >
          <figure className="mt-6">
            <img
              src={heroImagePath}
              alt="Footprints in sand fading away, symbolizing ephemeral one-time secret links"
              width={900}
              height={505}
              className="mx-auto w-full max-w-2xl max-h-[340px] rounded-2xl border border-gray-200 object-cover dark:border-gray-800"
            />
            <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Image by{" "}
              <a
                href={heroArtistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-90"
              >
                DieAndreArt
              </a>{" "}
              from{" "}
              <a
                href={heroPixabayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-90"
              >
                Pixabay
              </a>
              .
            </figcaption>
          </figure>
        </BlogPostHeader>

        <BlogArticleTakeaways slug="one-time-secret-links" />

        <div className="space-y-6 leading-relaxed">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} resolveLink={resolveLink} />
          ))}
        </div>

        {article.earlyCta ? (
          <p className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {article.earlyCta.body}{" "}
            <Link href={toolPath} className="font-semibold text-primary underline underline-offset-4">
              {article.earlyCta.linkLabel}
            </Link>
          </p>
        ) : null}

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.bullets ? <BulletList items={section.bullets} resolveLink={resolveLink} /> : null}

              {section.callout ? <CalloutBox text={section.callout} resolveLink={resolveLink} /> : null}

              {section.flowSteps ? (
                <OneTimeSecretFlowDiagram steps={section.flowSteps} caption={section.beforeFlowSteps} />
              ) : section.beforeFlowSteps ? (
                <ArticleParagraph text={section.beforeFlowSteps} resolveLink={resolveLink} />
              ) : null}

              {section.afterFlowSteps?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.subsections?.map((subsection) => (
                <div key={subsection.title} className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{subsection.title}</h3>
                  {subsection.paragraphs.map((paragraph) => (
                    <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
                  ))}
                </div>
              ))}

              {section.chromeExtensionCta ? <ChromeExtensionLink label={section.chromeExtensionCta} /> : null}

              {section.comparisonTable ? (
                <GenericComparisonTable
                  headers={section.comparisonTable.headers}
                  rows={section.comparisonTable.rows}
                />
              ) : null}

              {section.table ? <ComparisonTable headers={article.tableHeaders} rows={section.table} /> : null}

              {section.goodFits ? (
                <FitList label={article.goodFitsLabel} items={section.goodFits} resolveLink={resolveLink} />
              ) : null}

              {section.poorFits ? (
                <FitList label={article.poorFitsLabel} items={section.poorFits} resolveLink={resolveLink} />
              ) : null}

              {section.numberedSteps ? <NumberedSteps steps={section.numberedSteps} /> : null}

              {section.closingNote ? (
                <ArticleParagraph text={section.closingNote} resolveLink={resolveLink} />
              ) : null}

              {section.checklist ? <Checklist items={section.checklist} resolveLink={resolveLink} /> : null}

              {section.midCta ? (
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-5 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6">
                  <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">{section.midCta.body}</p>
                  <Link
                    href={toolPath}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                  >
                    {section.midCta.button}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              ) : null}

              {section.faqs ? (
                <div className="space-y-6">
                  {section.faqs.map((faq) => (
                    <div key={faq.question} className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                      <ArticleParagraph text={faq.answer} resolveLink={resolveLink} />
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-4 w-4 text-primary/70" />
            {article.closingTitle}
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderInlineContent(article.closingBody, resolveLink)}
          </p>
          {article.encryptLu ? (
            <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(article.encryptLu, resolveLink)}
            </p>
          ) : null}
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderInlineContent(article.tagline, resolveLink)}
          </p>
          {article.ctaTitle && article.ctaButton ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-8 sm:px-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{article.ctaTitle}</h2>
              {article.ctaBody ? (
                <p className="mt-3 leading-relaxed text-gray-700 dark:text-gray-300">{article.ctaBody}</p>
              ) : null}
              <Link
                href={toolPath}
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                {article.ctaButton}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <Link
              href={howItWorksPath}
              className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
            >
              {t.howItWorks}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        <BlogPostCrossLinks slug="one-time-secret-links" />
      </article>
    </BlogGuideArticle>
  );
};
