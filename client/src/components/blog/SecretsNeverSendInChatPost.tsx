import React from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Clock,
  Code2,
  Database,
  Eye,
  FileText,
  KeyRound,
  Link2,
  Lock,
  MessageSquare,
  Search,
  Shield,
  Trash2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import type { Translations } from "@/utils/translations/types";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { secretsNeverSendInChatHr } from "@/components/blog/locale/secretsNeverSendInChat.hr";
import { secretsNeverSendInChatSr } from "@/components/blog/locale/secretsNeverSendInChat.sr";
import type {
  SecretsNeverSendInChatArticleCopy,
  SecretsNeverSendInChatCheatSheetRow,
  SecretsNeverSendInChatFaqEntry,
  SecretsNeverSendInChatSecretEntry,
} from "@/components/blog/locale/secretsNeverSendInChat.types";

const chatScreenshotPath = "/images/blog-chat-passwords-in-slack.jpg";

type ArticleCopy = SecretsNeverSendInChatArticleCopy;
type CheatSheetRow = SecretsNeverSendInChatCheatSheetRow;
type SecretEntry = SecretsNeverSendInChatSecretEntry;
type FaqEntry = SecretsNeverSendInChatFaqEntry;

const BLOG_TITLE_BY_SLUG: Record<string, (t: Translations) => string> = {
  "send-secret-message-without-account": (t) => t.blogSecretNoAccountTitle,
  "one-time-secret-links": (t) => t.blogOneTimeLinksTitle,
  "encrypted-vs-secure-file-sharing": (t) => t.blogEncryptedFileSharingTitle,
  "how-we-generate-passwords": (t) => t.blogPasswordTitle,
  "workplace-texts-private-note": (t) => t.blogWorkplaceTextsTitle,
  "privatenote-for-developers": (t) => t.blogDevelopersTitle,
  "myth-good-enough-security": (t) => t.blogGoodEnoughTitle,
};

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

function BulletList({
  items,
  resolveLink,
  compact = false,
}: {
  items: string[];
  resolveLink: (href: string) => { to: string; external: boolean };
  compact?: boolean;
}) {
  return (
    <ul className={cn(compact ? "grid gap-2 sm:grid-cols-2" : "space-y-3.5")}>
      {items.map((item) => (
        <li className={cn("flex gap-3", compact && "text-sm")} key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className={cn("leading-[1.75] text-gray-700 dark:text-gray-300", compact ? "text-sm" : "text-[1.0625rem]")}>
            {renderInlineContent(item, resolveLink)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SecretCard({
  secret,
  index,
  resolveLink,
  isFirst = false,
}: {
  secret: SecretEntry;
  index: number;
  resolveLink: (href: string) => { to: string; external: boolean };
  isFirst?: boolean;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "border-t border-gray-200 py-10 dark:border-gray-800",
        isFirst && "border-t-0 pt-0",
      )}
    >
      <div className="grid gap-5 md:grid-cols-[5.5rem_minmax(0,1fr)] md:gap-x-10 lg:grid-cols-[6.5rem_minmax(0,1fr)] lg:gap-x-12">
        <div className="md:pt-0.5" aria-hidden>
          <span className="block text-[3.25rem] font-bold tabular-nums leading-none tracking-[-0.04em] text-gray-200 dark:text-gray-800 sm:text-[3.75rem] md:text-[4.25rem] lg:text-[4.75rem]">
            {number}
          </span>
        </div>

        <div className="min-w-0 space-y-5">
          <h3 className="text-xl font-bold leading-snug tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            <span className="sr-only">{index + 1}. </span>
            {secret.title}
          </h3>

          {secret.paragraphs.map((paragraph) => (
            <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
          ))}

          {secret.bullets ? <BulletList items={secret.bullets} resolveLink={resolveLink} compact /> : null}

          <p className="border-t border-gray-200/90 pt-5 text-[1.0625rem] leading-relaxed text-gray-700 dark:border-gray-700/80 dark:text-gray-300">
            <span className="font-medium text-gray-900 dark:text-white">Instead — </span>
            {renderInlineContent(secret.instead, resolveLink)}
          </p>
        </div>
      </div>
    </article>
  );
}

const CHEAT_SHEET_ROW_ICONS: LucideIcon[] = [KeyRound, Shield, Code2, FileText];

function CheatSheetTable({
  title,
  headers,
  rows,
  resolveLink,
}: {
  title: string;
  headers: [string, string, string];
  rows: CheatSheetRow[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  const [neverSendHeader, riskHeader, betterHeader] = headers;

  const columnHeaderClass =
    "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em]";

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-primary/[0.06] px-5 py-5 dark:border-gray-800 dark:from-gray-900/80 dark:via-gray-950 dark:to-primary/10 sm:px-6">
        <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[1.35rem]">
          {title}
        </h3>
      </div>

      <div className="hidden border-b border-gray-200 bg-gray-50/90 px-5 py-3.5 md:grid md:grid-cols-3 md:gap-4 dark:border-gray-800 dark:bg-gray-900/45 sm:px-6">
        <div className={cn(columnHeaderClass, "text-red-600 dark:text-red-400")}>
          <XCircle className="h-4 w-4 shrink-0" aria-hidden />
          {neverSendHeader}
        </div>
        <div className={cn(columnHeaderClass, "text-amber-700 dark:text-amber-300")}>
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
          {riskHeader}
        </div>
        <div className={cn(columnHeaderClass, "text-emerald-700 dark:text-emerald-300")}>
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {betterHeader}
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800/90">
        {rows.map((row, index) => {
          const RowIcon = CHEAT_SHEET_ROW_ICONS[index] ?? KeyRound;

          return (
            <div
              key={row.neverSend}
              className="grid gap-4 p-5 sm:grid-cols-1 sm:p-6 md:grid-cols-3 md:items-stretch md:gap-4"
            >
              <div className="flex min-h-[4.5rem] items-center gap-3 rounded-xl border border-red-200/80 bg-red-50/60 p-4 dark:border-red-900/35 dark:bg-red-950/20">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100/90 text-red-700 ring-1 ring-red-200/90 dark:bg-red-900/45 dark:text-red-200 dark:ring-red-900/50">
                  <RowIcon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-600 md:hidden dark:text-red-400">
                    <XCircle className="h-3.5 w-3.5" aria-hidden />
                    {neverSendHeader}
                  </p>
                  <p className="text-sm font-semibold leading-relaxed text-red-950/95 dark:text-red-50/95">
                    {row.neverSend}
                  </p>
                </div>
              </div>

              <div className="flex min-h-[4.5rem] items-center rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/35 dark:bg-amber-950/20">
                <div className="min-w-0">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-800 md:sr-only dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                    {riskHeader}
                  </p>
                  <p className="text-sm leading-relaxed text-amber-950/90 dark:text-amber-50/90">
                    {renderInlineContent(row.risk, resolveLink)}
                  </p>
                </div>
              </div>

              <div className="flex min-h-[4.5rem] items-center rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900/35 dark:bg-emerald-950/20">
                <div className="min-w-0">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-800 md:sr-only dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                    {betterHeader}
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-emerald-950/90 dark:text-emerald-50/90">
                    {renderInlineContent(row.better, resolveLink)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type WorkflowTone = "neutral" | "warning" | "danger" | "primary" | "success";

type WorkflowStepConfig = {
  label: string;
  icon: LucideIcon;
  tone: WorkflowTone;
};

const WORKFLOW_TONE_CLASS: Record<WorkflowTone, string> = {
  neutral:
    "border-gray-200/90 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100",
  warning:
    "border-amber-200/90 bg-amber-50/90 text-amber-950 dark:border-amber-900/45 dark:bg-amber-950/35 dark:text-amber-50",
  danger:
    "border-red-200/90 bg-red-50/90 text-red-950 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-50",
  primary:
    "border-primary/30 bg-primary/10 text-primary dark:border-primary/35 dark:bg-primary/15",
  success:
    "border-emerald-200/90 bg-emerald-50/90 text-emerald-950 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-50",
};

const WORKFLOW_ICON_CLASS: Record<WorkflowTone, string> = {
  neutral: "bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-700",
  warning: "bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-900/50 dark:text-amber-100 dark:ring-amber-800/50",
  danger: "bg-red-100 text-red-800 ring-red-200 dark:bg-red-900/50 dark:text-red-100 dark:ring-red-800/50",
  primary: "bg-primary/15 text-primary ring-primary/25 dark:bg-primary/20 dark:ring-primary/30",
  success:
    "bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-100 dark:ring-emerald-800/50",
};

const WORKFLOW_RAIL_CLASS: Record<"chat" | "privatenote", string> = {
  chat: "from-amber-300 via-orange-400 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600",
  privatenote: "from-primary via-primary/70 to-emerald-500 dark:from-primary dark:via-primary/80 dark:to-emerald-500",
};

function buildChatWorkflowSteps(labels: string[]): WorkflowStepConfig[] {
  const icons = [KeyRound, MessageSquare, Database, Search, Cloud, Clock];
  const tones: WorkflowTone[] = ["neutral", "warning", "warning", "danger", "danger", "danger"];
  return labels.map((label, index) => ({
    label,
    icon: icons[index] ?? Clock,
    tone: tones[index] ?? "danger",
  }));
}

function buildPrivateNoteWorkflowSteps(labels: string[]): WorkflowStepConfig[] {
  const icons = [KeyRound, Shield, Link2, Eye, Trash2];
  const tones: WorkflowTone[] = ["neutral", "primary", "primary", "success", "success"];
  return labels.map((label, index) => ({
    label,
    icon: icons[index] ?? Shield,
    tone: tones[index] ?? "primary",
  }));
}

function WorkflowTimeline({
  label,
  steps,
  variant,
  outcome,
}: {
  label: string;
  steps: WorkflowStepConfig[];
  variant: "chat" | "privatenote";
  outcome: string;
}) {
  const isChat = variant === "chat";
  const HeaderIcon = isChat ? MessageSquare : Shield;

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-3">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            isChat
              ? "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900/50"
              : "bg-primary/10 text-primary ring-primary/25 dark:bg-primary/15 dark:ring-primary/30",
          )}
        >
          <HeaderIcon className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-base font-semibold leading-snug tracking-tight text-gray-900 dark:text-white">
            {label}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            {isChat ? "Data accumulates at every step" : "Encrypted once, removed after read"}
          </p>
        </div>
      </div>

      <ol className="relative flex-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.label} className="grid grid-cols-[2rem_1fr] gap-x-3">
              <div className="flex flex-col items-center">
                <div className="flex min-h-[2.75rem] w-full items-center justify-center">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-950",
                      WORKFLOW_ICON_CLASS[step.tone],
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </div>
                {!isLast ? (
                  <div
                    className={cn(
                      "mb-1 w-0.5 min-h-3 flex-1 bg-gradient-to-b",
                      WORKFLOW_RAIL_CLASS[variant],
                    )}
                    aria-hidden
                  />
                ) : null}
              </div>

              <div
                className={cn(
                  "mb-3 flex min-h-[2.75rem] items-center rounded-xl border px-3.5 py-2.5 text-sm font-medium leading-snug shadow-sm",
                  WORKFLOW_TONE_CLASS[step.tone],
                )}
              >
                {step.label}
              </div>
            </li>
          );
        })}
      </ol>

      <div
        className={cn(
          "mt-2 flex items-center gap-2.5 rounded-xl border px-4 py-3",
          isChat
            ? "border-red-200/80 bg-red-50/90 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-100"
            : "border-emerald-200/80 bg-emerald-50/90 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100",
        )}
      >
        {isChat ? (
          <AlertTriangle className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        ) : (
          <CheckCircle2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
        )}
        <span className="text-sm font-semibold leading-snug">{outcome}</span>
      </div>
    </div>
  );
}

function WorkflowFlowChart({
  label,
  steps,
  variant,
  outcome,
}: {
  label: string;
  steps: WorkflowStepConfig[];
  variant: "chat" | "privatenote";
  outcome: string;
}) {
  const isChat = variant === "chat";

  return (
    <div
      className={cn(
        "h-full overflow-hidden rounded-2xl",
        isChat
          ? "bg-gradient-to-br from-red-50/50 via-white to-orange-50/30 dark:from-red-950/20 dark:via-gray-950 dark:to-orange-950/10"
          : "bg-gradient-to-br from-primary/[0.04] via-white to-emerald-50/40 dark:from-primary/10 dark:via-gray-950 dark:to-emerald-950/15",
      )}
    >
      <div
        className={cn(
          "h-1",
          isChat
            ? "bg-gradient-to-r from-amber-400 via-orange-400 to-red-500"
            : "bg-gradient-to-r from-primary via-primary/80 to-emerald-500",
        )}
        aria-hidden
      />
      <div className="p-5 sm:p-6">
        <WorkflowTimeline label={label} steps={steps} variant={variant} outcome={outcome} />
      </div>
    </div>
  );
}

function WorkflowComparison({
  chatLabel,
  chatSteps,
  chatOutcome,
  privateNoteLabel,
  privateNoteSteps,
  privateNoteOutcome,
}: {
  chatLabel: string;
  chatSteps: string[];
  chatOutcome: string;
  privateNoteLabel: string;
  privateNoteSteps: string[];
  privateNoteOutcome: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="border-b border-gray-200 bg-gray-50/80 px-5 py-4 dark:border-gray-800 dark:bg-gray-900/50 sm:px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
          Compare data lifetime
        </p>
      </div>

      <div className="relative grid lg:grid-cols-2 lg:divide-x lg:divide-gray-200 dark:lg:divide-gray-800">
        <div className="border-b border-gray-200 p-5 dark:border-gray-800 sm:p-6 lg:border-b-0">
          <WorkflowFlowChart
            label={chatLabel}
            steps={buildChatWorkflowSteps(chatSteps)}
            variant="chat"
            outcome={chatOutcome}
          />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex"
          aria-hidden
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold uppercase tracking-wider text-gray-500 shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            vs
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <WorkflowFlowChart
            label={privateNoteLabel}
            steps={buildPrivateNoteWorkflowSteps(privateNoteSteps)}
            variant="privatenote"
            outcome={privateNoteOutcome}
          />
        </div>
      </div>
    </div>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      "From Slack and Microsoft Teams to WhatsApp and Messenger, chat has become the default way we exchange information. It is fast, convenient, and keeps teams aligned. Unfortunately, it has also become a digital graveyard for highly sensitive data—shared in a moment of convenience, then forgotten.",
      "Many modern chat apps offer strong [encryption in transit](blog:encrypted-vs-secure-file-sharing) or even end-to-end encryption. Encryption protects messages while they move between devices. The bigger problem is what happens afterward. Once a secret enters a chat, it often remains searchable for months or years across multiple systems.",
      "That persistence creates a surprisingly large digital footprint. Sensitive information can survive in places such as searchable chat history, cloud backups, workspace exports, notification previews, screenshots, and synced devices.",
      "According to [Verizon's 2026 Data Breach Investigations Report](https://www.verizon.com/business/resources/reports/dbir/), **62% of breaches involve the human element**—credential theft, phishing, social engineering, misuse, and simple mistakes. Technology alone cannot prevent these incidents if sensitive information is shared carelessly.",
      "A safer approach relies on a simple principle: **share information only when needed, and ensure it vanishes after the first view.** That is the model behind [one-time secret links](blog:one-time-secret-links)—and why PrivateNote treats note lifetime as part of security, not an afterthought.",
    ],
    chatScreenshotCaption:
      "Illustrative example: plaintext credentials pasted into a team chat stay in channel history, backups, and search—long after the handoff is done.",
    cheatSheetTitle: "The quick-reference security cheat sheet",
    cheatSheetHeaders: ["Never send", "The risk", "Better approach"],
    cheatSheetRows: [
      {
        neverSend: "Passwords",
        risk: "Indexed in permanent chat history and searchable logs.",
        better: "[Browser-encrypted one-time link](blog:one-time-secret-links).",
      },
      {
        neverSend: "Recovery codes",
        risk: "Effectively bypasses multi-factor authentication permanently.",
        better: "Dedicated password manager or [single-use note](blog:send-secret-message-without-account).",
      },
      {
        neverSend: "API keys",
        risk: "Accidental public-channel paste compromises production environments.",
        better: "[Self-destructing secure note](blog:privatenote-for-developers) with client-side encryption.",
      },
      {
        neverSend: "Documents",
        risk: "Leaves persistent copies scattered across local download folders.",
        better: "[Temporary encrypted file transfer](app:secure-file-transfer) with limited access.",
      },
    ],
    whyChatTitle: "Why chat is not a secret manager",
    whyChatParagraphs: [
      "Messaging platforms are designed for communication, not secret management. Their purpose is to preserve conversations across devices, synchronize history, support search, create backups, and keep records of collaboration.",
      "Those same features become liabilities when credentials or corporate assets are shared. The information remains accessible long after it has served its purpose. Our piece on [workplace texts and legal discovery](blog:workplace-texts-private-note) shows how casually written messages can outlive their original context by years.",
      "A one-time secret follows a different model: make the information available only for the short time it is actually needed—then remove server-side access by design.",
    ],
    lifetimeTitle: "Data lifetime: traditional chat vs. PrivateNote",
    lifetimeIntro: "The difference is not whether a message is encrypted in transit. It is whether the secret still exists anywhere after it has been read.",
    chatWorkflowLabel: "Traditional chat workflow",
    chatWorkflowSteps: ["Password", "Slack / Teams", "Stored", "Searchable", "Backups", "Years later"],
    chatWorkflowOutcome: "Secret persists across systems",
    privateNoteWorkflowLabel: "PrivateNote workflow",
    privateNoteWorkflowSteps: [
      "Password",
      "Encrypt in browser",
      "One-time link",
      "Viewed",
      "Deleted from server",
    ],
    privateNoteWorkflowOutcome: "Secret removed after delivery",
    secretsTitle: "10 secrets to ban from your chat apps",
    secrets: [
      {
        title: "Account passwords",
        paragraphs: [
          'We have all seen it: "Hey, what is the login for the shared marketing account again?" followed by a plaintext reply. Even if you trust your colleague entirely, that password is now indexed in workspace history, cached in local app data, and potentially visible in email or push notification previews.',
          "If an attacker compromises that chat history months later, they inherit active access to your account.",
        ],
        instead:
          "Send a [browser-encrypted one-time link](blog:send-secret-message-without-account). Once the recipient opens it and retrieves the password, the ciphertext is deleted from the host server. Need a strong password first? Use our [password generator](app:password-generator).",
      },
      {
        title: "Multi-factor authentication (MFA) recovery codes",
        paragraphs: [
          "When enabling MFA, services generate emergency backup codes. Because users worry about losing access, they frequently paste these codes into a chat with a teammate—or message them to their own personal chat space.",
          "Recovery codes are backup master keys. Treating them like casual text defeats the entire purpose of enforcing multi-factor security.",
        ],
        instead:
          "Store them in a dedicated password manager. If you must share them during an account handoff, use a [temporary single-view note](blog:one-time-secret-links) so the secret does not remain permanently stored in chat history.",
      },
      {
        title: "Production API keys",
        paragraphs: [
          "Developers routinely exchange API keys, access tokens, or cloud service secrets over chat to debug a quick issue. [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) continuously detects exposed credentials in public repositories—evidence of how often secrets leak by accident.",
          "One accidental paste into the wrong channel can expose live database clusters or billing pipelines.",
        ],
        instead:
          "Route tokens through a [client-side encrypted note](blog:privatenote-for-developers) that automatically expires after it has been viewed once.",
      },
      {
        title: "SSH private keys",
        paragraphs: [
          "Your private key is your identity for server infrastructure. It should never exist inside a messaging application. Copying a private key means a copy now lives outside its intended secure environment—and may persist in chat history, backups, or on recipient devices.",
        ],
        instead:
          "If a key must be moved securely, use an encrypted, single-view payload that deletes itself from the host server after delivery.",
      },
      {
        title: "Invitation and reset links",
        paragraphs: [
          "People constantly drop temporary onboarding and administrative links into chat channels:",
        ],
        bullets: [
          "Zoom host assignment links",
          "Google Meet moderator access tokens",
          "Stripe onboarding invitations",
          "Admin privilege invites",
          "Password reset URLs",
        ],
        instead:
          "Deliver high-privilege onboarding links via a [single-use note](blog:one-time-secret-links) so they cannot be harvested from historical logs if left unused.",
      },
      {
        title: "Cryptocurrency seed phrases",
        paragraphs: [
          "Your 12- or 24-word recovery phrase controls your entire wallet. If someone compromises your chat account years later, automated scraping can scan historical conversations for phrases matching seed formats. If your seed phrase is stolen, your assets can be lost permanently.",
        ],
        instead:
          "Avoid transmitting seed phrases digitally entirely. If an absolute emergency forces your hand, use an encrypted note that enforces immediate deletion upon reading to limit exposure.",
      },
      {
        title: "Temporary login credentials",
        paragraphs: [
          "IT helpdesks frequently share initial credentials during employee onboarding. While the user is usually prompted to change the password on first login, the temporary credential remains searchable in chat history. If the user delays changing it—or the system allows password reuse—that message remains an active vulnerability.",
        ],
        instead:
          "Deliver temporary credentials through a [browser-encrypted note](blog:send-secret-message-without-account) that expires after it has been viewed.",
      },
      {
        title: "Financial and banking information",
        paragraphs: [
          "Pasting corporate IBANs, wire routing details, tax documents, or payment confirmations into chat feels harmless because an IBAN alone is not a password. However, when attackers combine banking details with personal conversations found in chat history, they gain the context needed for convincing phishing and invoice-fraud attacks.",
        ],
        instead:
          "Separate financial details from daily conversation. Share them through encrypted channels that remove access the moment the transaction is verified.",
      },
      {
        title: "Scans of personal documents",
        paragraphs: [
          "Need to send a quick copy of your passport, driver's license, or employment contract to HR? Dropping that PDF into a chat window copies highly sensitive identity data across cloud backups, local phone galleries, and synced desktop folders.",
        ],
        instead:
          "Use [secure file transfer](app:secure-file-transfer) with browser-side encryption—one download, then the file is purged from the hosting server according to your access settings.",
      },
      {
        title: "Confidential business information",
        paragraphs: [
          "Internal strategy decks, unannounced pricing proposals, legal drafts, and acquisition documents constantly float around team channels. Data leaks do not always come from external hackers; sometimes they happen because an employee accidentally invites an external guest to a channel containing years of internal strategy.",
        ],
        instead:
          "Share sensitive corporate assets using encrypted notes with strict automatic expiration dates and limited access windows.",
      },
    ],
    lifespanTitle: "Secrets have a lifespan",
    lifespanParagraphs: [
      "Encryption protects secrets in transit. **Expiration protects them over time.** Most chat applications ignore that second part entirely.",
      "When you use PrivateNote, you change the security posture by design. Instead of relying on users to remember to delete sensitive messages later, you enforce the lifetime of the secret. The recipient reads it once—and then it is gone from the server.",
    ],
    lifespanBullets: [
      "**No permanent footprint:** no chat history or searchable archive contains the raw secret.",
      "**Blast-radius reduction:** if a laptop or chat account is compromised later, there are no legacy passwords sitting in the logs to harvest.",
      "**Human-error mitigation:** the system handles data minimization automatically, removing the need to remember to delete sensitive messages manually.",
    ],
    underHoodTitle: "Security under the hood: how PrivateNote works",
    underHoodParagraphs: [
      "PrivateNote encrypts your message directly in your browser before it is uploaded. The server stores only encrypted ciphertext. The decryption key lives in the [URL fragment](blog:one-time-secret-links)—the part after `#`—which browsers do not send to web servers as part of HTTP requests. The server never receives the decryption key.",
      "Once the note is opened under your chosen settings, the encrypted ciphertext is deleted from the server. For passwords, API keys, recovery codes, and temporary credentials, **limiting data lifetime is just as important as encrypting the data itself.** Chats preserve conversations. PrivateNote limits secret lifespans.",
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Is sending passwords in Slack secure?",
        answer:
          "Slack encrypts data in transit and at rest, but passwords remain in searchable chat history until deleted. For temporary credentials, a [browser-encrypted one-time note](blog:send-secret-message-without-account) reduces long-term exposure.",
      },
      {
        question: "Are WhatsApp messages safe for passwords?",
        answer:
          "End-to-end encryption protects messages during transmission, and disappearing messages can auto-delete them after a set time—but recipients can still screenshot, forward, or back up content before it vanishes. Passwords should ideally be shared only for as long as necessary—through a [one-time secret link](blog:one-time-secret-links), not a permanent chat thread.",
      },
      {
        question: "Is email safer than chat for passwords?",
        answer:
          "No. Standard email lacks end-to-end encryption by default and passes through multiple mail servers. Once delivered, a password sits indefinitely in inboxes, sent folders, local caches, and provider backups.",
      },
      {
        question: "What is a one-time secret?",
        answer:
          "A one-time secret is a message that becomes unavailable after it has been viewed once or after a defined expiration time—reducing persistent copies across systems. See our guide on [how one-time secret links work](blog:one-time-secret-links).",
      },
    ],
    referencesTitle: "References",
    references: [
      "Verizon. 2026 Data Breach Investigations Report (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
      "Verizon. 2026 Healthcare Data Breach Investigations Snapshot. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
    ],
    closingTitle: "Share secrets without leaving a chat-shaped footprint",
    closingBody: [
      "Chat is excellent for coordination. It is a poor vault for credentials, keys, recovery codes, and documents that were never meant to persist.",
      "PrivateNote was built for the opposite pattern: encrypt in the browser, share a link, and let the secret expire when its job is done—no account required for the sender, no plaintext sitting in a searchable archive for years.",
    ],
    tagline: "Less chat history. Less metadata. More control over how long a secret exists online.",
    relatedReading: "Related reading",
    relatedPosts: [
      {
        slug: "send-secret-message-without-account",
        blurb: "Send passwords and private notes without signing up—browser encryption and expiring links explained.",
      },
      {
        slug: "one-time-secret-links",
        blurb: "How burn-after-reading links work, why the URL fragment matters, and when ephemerality beats email or Slack.",
      },
      {
        slug: "workplace-texts-private-note",
        blurb: "Why written records in email and workplace chat create long-term risk—and when ephemeral notes fit better.",
      },
      {
        slug: "encrypted-vs-secure-file-sharing",
        blurb: "TLS vs browser-side encryption—what each protects and why the server may still read your data.",
      },
      {
        slug: "how-we-generate-passwords",
        blurb: "Create strong passwords before you share them through a one-time link.",
      },
      {
        slug: "myth-good-enough-security",
        blurb: "A practical security baseline for passwords, authentication, and secure sharing habits.",
      },
    ],
  },
  hr: secretsNeverSendInChatHr,
  sr: secretsNeverSendInChatSr,
};

export const SecretsNeverSendInChatPost: React.FC = () => {
  const { t, language } = useLanguage();
  const howItWorksPath = localizedPath("/how-it-works", language);
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
    return { to: href, external: true };
  };

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="secrets-never-send-in-chat"
          title={t.blogChatSecretsTitle}
          headerClassName="mb-8 sm:mb-10"
          mediaClassName="mt-0"
        >
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:mt-6">
            {renderInlineContent(article.intro[0], resolveLink)}
          </p>
          <figure className="mt-6 flex flex-col items-center sm:mt-8">
            <img
              src={chatScreenshotPath}
              alt="Team chat channel showing plaintext passwords shared in message history"
              className="mx-auto w-full max-w-3xl rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
              loading="lazy"
              width={1024}
              height={682}
            />
            <figcaption className="mt-2.5 max-w-3xl px-2 text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {article.chatScreenshotCaption}
            </figcaption>
          </figure>
        </BlogPostHeader>

        <div className="space-y-6 leading-relaxed">
          {article.intro.slice(1).map((paragraph) => (
            <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
          ))}
        </div>

        <div className="mt-14 space-y-14">
          <section>
            <CheatSheetTable
              title={article.cheatSheetTitle}
              headers={article.cheatSheetHeaders}
              rows={article.cheatSheetRows}
              resolveLink={resolveLink}
            />
          </section>

          <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {article.whyChatTitle}
            </h2>
            {article.whyChatParagraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
          </section>

          <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {article.lifetimeTitle}
            </h2>
            <ArticleParagraph text={article.lifetimeIntro} resolveLink={resolveLink} />
            <WorkflowComparison
              chatLabel={article.chatWorkflowLabel}
              chatSteps={article.chatWorkflowSteps}
              chatOutcome={article.chatWorkflowOutcome}
              privateNoteLabel={article.privateNoteWorkflowLabel}
              privateNoteSteps={article.privateNoteWorkflowSteps}
              privateNoteOutcome={article.privateNoteWorkflowOutcome}
            />
          </section>

          <section className="border-t border-gray-200 pt-12 dark:border-gray-800 sm:pt-14">
            <header className="mb-12 border-b border-gray-200 pb-10 dark:border-gray-800 sm:mb-14 sm:pb-12">
              <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[2.75rem]">
                {article.secretsTitle}
              </h2>
            </header>
            <ol className="list-none">
              {article.secrets.map((secret, index) => (
                <li key={secret.title}>
                  <SecretCard
                    secret={secret}
                    index={index}
                    resolveLink={resolveLink}
                    isFirst={index === 0}
                  />
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {article.lifespanTitle}
            </h2>
            {article.lifespanParagraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
            <BulletList items={article.lifespanBullets} resolveLink={resolveLink} />
          </section>

          <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <Lock className="h-5 w-5 text-primary/70" aria-hidden />
              {article.underHoodTitle}
            </h2>
            {article.underHoodParagraphs.map((paragraph) => (
              <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
            ))}
          </section>

          <section className="space-y-6 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{article.faqTitle}</h2>
            <div className="space-y-6">
              {article.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{item.question}</h3>
                  <ArticleParagraph text={item.answer} resolveLink={resolveLink} />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3 border-t border-gray-200 pt-10 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{article.referencesTitle}</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {article.references.map((ref) => (
                <li key={ref}>{renderInlineContent(ref, resolveLink)}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-4 w-4 text-primary/70" aria-hidden />
            {article.closingTitle}
          </h2>
          {article.closingBody.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(paragraph, resolveLink)}
            </p>
          ))}
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <RichText text={article.tagline} />
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={homePath}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.createNewNote}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <Link
              href={howItWorksPath}
              className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
            >
              {t.howItWorks}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{article.relatedReading}</p>
          <ul className="space-y-4">
            {article.relatedPosts.map((post) => {
              const titleFn = BLOG_TITLE_BY_SLUG[post.slug];
              const title = titleFn ? titleFn(t) : post.slug;
              return (
                <li key={post.slug}>
                  <Link
                    href={blogHref(post.slug)}
                    className="group block rounded-lg border border-transparent px-1 py-1 transition-colors hover:border-gray-200 hover:bg-gray-50/80 dark:hover:border-gray-800 dark:hover:bg-gray-900/40"
                  >
                    <span className="text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                      {title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {post.blurb}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </div>
  );
};
