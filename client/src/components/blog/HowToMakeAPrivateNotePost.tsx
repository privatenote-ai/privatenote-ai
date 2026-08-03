import React from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Link2,
  Lock,
  PencilLine,
  Settings2,
  Shield,
  type LucideIcon,
} from "lucide-react";
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
import { CHROME_EXTENSION_STORE_URL } from "@/utils/chromeExtensionOnboarding";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { howToMakeAPrivateNoteDe } from "@/components/blog/locale/howToMakeAPrivateNote.de";
import { howToMakeAPrivateNoteEn } from "@/components/blog/locale/howToMakeAPrivateNote.en";
import { howToMakeAPrivateNoteEs } from "@/components/blog/locale/howToMakeAPrivateNote.es";
import { howToMakeAPrivateNoteFr } from "@/components/blog/locale/howToMakeAPrivateNote.fr";
import { howToMakeAPrivateNoteHr } from "@/components/blog/locale/howToMakeAPrivateNote.hr";
import { howToMakeAPrivateNoteIt } from "@/components/blog/locale/howToMakeAPrivateNote.it";
import { howToMakeAPrivateNoteNl } from "@/components/blog/locale/howToMakeAPrivateNote.nl";
import { howToMakeAPrivateNotePt } from "@/components/blog/locale/howToMakeAPrivateNote.pt";
import { howToMakeAPrivateNoteSr } from "@/components/blog/locale/howToMakeAPrivateNote.sr";
import type { HowToMakeAPrivateNoteArticleCopy } from "@/components/blog/locale/howToMakeAPrivateNote.types";

type ArticleCopy = HowToMakeAPrivateNoteArticleCopy;
type FlowStep = NonNullable<ArticleCopy["sections"][number]["flowSteps"]>[number];
type TableRowData = NonNullable<ArticleCopy["sections"][number]["table"]>[number];

const heroImagePath = "/images/blog-how-to-make-a-private-note-hero.jpg";
const FLOW_STEP_ICONS: LucideIcon[] = [PencilLine, Settings2, Lock, Link2, CheckCircle2];

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

function ArticleParagraph({
  text,
  lead = false,
  resolveLink,
}: {
  text: string;
  lead?: boolean;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <p
      className={cn(
        "leading-[1.8] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
  );
}

function CalloutBox({
  text,
  resolveLink,
}: {
  text: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <blockquote className="my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-violet-500/[0.05] px-6 py-5 dark:border-primary/25 dark:from-primary/10 dark:to-violet-500/10">
      <p className="text-[1.0625rem] leading-[1.75] text-gray-800 dark:text-gray-100">
        {renderInlineContent(text, resolveLink)}
      </p>
    </blockquote>
  );
}

function BulletList({
  items,
  resolveLink,
}: {
  items: string[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li className="flex gap-3.5" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-[1.0625rem] leading-[1.75] text-gray-700 dark:text-gray-300">
            {renderInlineContent(item, resolveLink)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PrivateNoteFlowDiagram({
  steps,
  caption,
  resolveLink,
}: {
  steps: FlowStep[];
  caption?: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <figure className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-white to-violet-500/[0.03] px-5 py-6 shadow-sm dark:border-primary/20 dark:from-primary/[0.06] dark:via-gray-950 dark:to-violet-500/[0.04] sm:px-6 sm:py-7">
      {caption ? (
        <figcaption className="mb-5 text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-200">
          {caption}
        </figcaption>
      ) : null}
      <ol className="m-0 list-none space-y-0 p-0">
        {steps.map((step, index) => {
          const Icon = FLOW_STEP_ICONS[index] ?? Lock;
          const isLast = index === steps.length - 1;

          return (
            <li className="relative flex gap-4 sm:gap-5" key={step.title}>
              <div className="flex w-10 shrink-0 flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-primary/20 dark:bg-gray-950 dark:ring-primary/30">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                </div>
                {!isLast ? (
                  <div
                    className="my-2 w-px flex-1 min-h-[1.5rem] bg-gradient-to-b from-primary/35 to-gray-200 dark:to-gray-700"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-6 sm:pb-7")}>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-primary/80 dark:text-primary/70">
                  {step.step}
                </p>
                <p className="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-white">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {renderInlineContent(step.body, resolveLink)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

function UseCaseTable({
  headers,
  rows,
  resolveLink,
}: {
  headers: ArticleCopy["tableHeaders"];
  rows: TableRowData[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  const headCellClass =
    "h-11 border-r border-gray-200 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 last:border-r-0 dark:border-gray-700 dark:text-gray-400";
  const bodyCellClass =
    "border-r border-gray-100 px-4 py-4 align-top last:border-r-0 dark:border-gray-800";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50/90 hover:bg-gray-50/90 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:bg-gray-800/60">
            <TableHead className={cn(headCellClass, "w-[9.5rem] sm:w-44")}>{headers.dataType}</TableHead>
            <TableHead className={headCellClass}>{headers.scenario}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.dataType}
              className="border-b border-gray-100 last:border-0 hover:bg-gray-50/80 dark:border-gray-800 dark:hover:bg-gray-800/30"
            >
              <TableCell className={cn(bodyCellClass, "text-sm font-semibold text-gray-900 dark:text-white")}>
                {row.dataType}
              </TableCell>
              <TableCell className={cn(bodyCellClass, "text-sm leading-relaxed text-gray-700 dark:text-gray-300")}>
                {renderInlineContent(row.scenario, resolveLink)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: howToMakeAPrivateNoteEn,
  de: howToMakeAPrivateNoteDe,
  es: howToMakeAPrivateNoteEs,
  fr: howToMakeAPrivateNoteFr,
  it: howToMakeAPrivateNoteIt,
  nl: howToMakeAPrivateNoteNl,
  pt: howToMakeAPrivateNotePt,
  hr: howToMakeAPrivateNoteHr,
  sr: howToMakeAPrivateNoteSr,
};

export const HowToMakeAPrivateNotePost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const article = getBlogArticleCopy(copy, language);
  const blogHref = (slug: string) => blogPostPath(slug, language);
  const resolveLink = (href: string) => {
    if (href.startsWith("blog:")) {
      return { to: blogHref(href.slice(5)), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: localizedPath("/", language), external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    if (href.startsWith("chrome:")) {
      return { to: CHROME_EXTENSION_STORE_URL, external: true };
    }
    return { to: href, external: true };
  };

  return (
    <BlogGuideArticle slug="how-to-make-a-private-note">
      <article>
        <BlogPostHeader
          slug="how-to-make-a-private-note"
          title={t.blogMakePrivateNoteTitle}
          subtitle={t.blogMakePrivateNoteSubtitle}
          excerpt={t.blogMakePrivateNoteExcerpt}
          headerClassName="mb-12"
        >
          <figure className="mt-8">
            <img
              src={heroImagePath}
              alt={article.heroAlt}
              width={1376}
              height={768}
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
            />
          </figure>
        </BlogPostHeader>

        <BlogArticleTakeaways slug="how-to-make-a-private-note" />

        <div className="space-y-6 leading-relaxed">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} resolveLink={resolveLink} />
          ))}
        </div>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.bullets ? <BulletList items={section.bullets} resolveLink={resolveLink} /> : null}

              {section.beforeFlowSteps ? (
                <ArticleParagraph text={section.beforeFlowSteps} resolveLink={resolveLink} />
              ) : null}

              {section.flowSteps ? (
                <PrivateNoteFlowDiagram
                  steps={section.flowSteps}
                  caption={section.flowDiagramCaption}
                  resolveLink={resolveLink}
                />
              ) : null}

              {section.afterFlowSteps?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.table ? (
                <UseCaseTable headers={article.tableHeaders} rows={section.table} resolveLink={resolveLink} />
              ) : null}

              {section.callout ? <CalloutBox text={section.callout} resolveLink={resolveLink} /> : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-4 w-4 text-primary/70" />
            {article.closingTitle}
          </h2>
          {article.closingBody.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(paragraph, resolveLink)}
            </p>
          ))}
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderInlineContent(article.fileSharingNote, resolveLink)}
          </p>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderInlineContent(article.chromeExtensionNote, resolveLink)}
          </p>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <RichText text={article.tagline} />
          </p>
          <Link
            href={homePath}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
          >
            {t.createNewNote}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <BlogPostCrossLinks slug="how-to-make-a-private-note" />
      </article>
    </BlogGuideArticle>
  );
};
