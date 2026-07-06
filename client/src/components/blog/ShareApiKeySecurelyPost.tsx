import React from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Link2,
  Lock,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";

const heroImagePath = "/images/blog-api-key-sharing-hero.jpg";
const heroArtistUrl =
  "https://pixabay.com/users/hans-2/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=65044";
const heroPixabayUrl =
  "https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=65044";

const avoidChannels = [
  "Slack, Microsoft Teams, Discord, or other chat history",
  "Email, SMS, or forwarded inbox threads",
  "Jira, Trello, Notion, Confluence, or GitHub issues",
  "Plain text documents, spreadsheets, and shared cloud folders",
  "Git commits, pull requests, and code comments",
];

const leakSources = [
  {
    title: "Email",
    body:
      "Email creates long-lived copies. A key can survive in inboxes, archives, backups, mobile sync, forwarded threads, and search indexes long after the task is done.",
  },
  {
    title: "Team chat",
    body:
      "Slack and Teams preserve context — which makes them risky for secrets. One pasted key can become searchable by future workspace members or leak through a compromised device.",
  },
  {
    title: "Project tools",
    body:
      "Jira, Notion, Confluence, Trello, and GitHub Issues are not credential vaults. Deleted tickets may still exist in exports, backups, audit trails, and AI-assisted search.",
  },
  {
    title: "Git repositories",
    body:
      "Git history is sticky. Removing a key in a later commit does not erase earlier commits. Public repos are scanned constantly, and exposed cloud credentials can be abused within minutes.",
  },
];

const prepSteps = [
  {
    title: "Use the smallest possible scope",
    body:
      "Avoid primary production keys. Prefer staging keys, read-only permissions, IP restrictions, short-lived tokens, and integration-specific credentials.",
  },
  {
    title: "Plan to rotate or revoke",
    body:
      "Treat shared API keys as temporary. Revoke them when onboarding, testing, a contractor engagement, or a client handoff is finished.",
  },
  {
    title: "Watch usage patterns",
    body:
      "Unexpected locations, sudden request spikes, new endpoints, or unusual billing activity are often the first signs that a key has escaped.",
  },
  {
    title: "Deliver through a one-time encrypted link",
    body:
      "Encrypt the key locally before it enters any communication channel. Send a short-lived link instead of leaving the raw secret in permanent chat or email history.",
  },
];

const handoffWorkflow = [
  {
    icon: KeyRound,
    label: "Scope the key",
    detail: "Minimum permissions only",
  },
  {
    icon: Lock,
    label: "Encrypt locally",
    detail: "Key never leaves your browser",
  },
  {
    icon: Link2,
    label: "Send the link",
    detail: "Not the raw secret",
  },
  {
    icon: RotateCcw,
    label: "Revoke when done",
    detail: "Rotate after handoff",
  },
] as const;

const faqs = [
  {
    question: "Why not just use an environment variable?",
    answer:
      "Environment variables are good for running local software. They do not solve the transport problem when you need to hand that value to a teammate, contractor, client, or integration partner.",
  },
  {
    question: "Should API keys always expire?",
    answer:
      "Whenever the provider supports it, yes. Short-lived credentials reduce the window of abuse after accidental disclosure and make rotation part of the normal workflow.",
  },
  {
    question: "What is the safest workflow?",
    answer:
      "Create a narrowly scoped key, send it through a browser-encrypted one-time link, share any optional password through a separate channel, then rotate or revoke the key when the task is done.",
  },
  {
    question: "Is PrivateNote a secrets manager?",
    answer:
      "No. PrivateNote solves secure human-to-human delivery. For machine-to-machine secret storage, use HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager, or Azure Key Vault.",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{children}</h2>;
}

function BoldParagraph({ title, body }: { title: string; body: string }) {
  return (
    <p>
      <strong className="font-semibold text-gray-900 dark:text-white">{title}.</strong> {body}
    </p>
  );
}

function HandoffFlowNode({
  icon: Icon,
  label,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex h-full min-h-[8.25rem] w-full flex-col items-center justify-center rounded-2xl border border-gray-200/90 bg-white px-3 py-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      <div className="mb-2.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <p className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">{label}</p>
      <p className="mt-1 min-h-[2.5rem] text-xs leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
    </div>
  );
}

function HandoffFlowArrow() {
  return (
    <div className="flex shrink-0 items-center justify-center self-center px-0.5 sm:px-1" aria-hidden>
      <ArrowRight className="hidden h-5 w-5 text-gray-400 sm:block" />
      <ArrowRight className="h-5 w-5 rotate-90 text-gray-400 sm:hidden" />
    </div>
  );
}

function HandoffFlowDiagram() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 dark:border-primary/25 dark:bg-primary/[0.07] sm:p-6">
      <figcaption className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary/80 dark:text-primary/70">
        Safer handoff at a glance
      </figcaption>
      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch sm:gap-x-1 sm:gap-y-0">
        {handoffWorkflow.map((step, index) => (
          <React.Fragment key={step.label}>
            <HandoffFlowNode icon={step.icon} label={step.label} detail={step.detail} />
            {index < handoffWorkflow.length - 1 ? <HandoffFlowArrow /> : null}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-4 text-center text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Share any note password through a separate channel — never in the same message as the link.
      </p>
    </figure>
  );
}

export const ShareApiKeySecurelyPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="how-to-share-api-key-securely"
          title={t.blogApiKeySharingTitle}
          excerpt={t.blogApiKeySharingExcerpt}
          headerClassName="mb-12"
        >
          <figure className="mt-8">
            <img
              src={heroImagePath}
              alt="Hotel keys hanging in a numbered wooden key rack"
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
              loading="lazy"
            />
            <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Image by{" "}
              <a
                href={heroArtistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-90"
              >
                Hans
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

        <div className="space-y-10 text-[1.0625rem] leading-[1.8] text-gray-700 dark:text-gray-300">
          <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100">
            Every developer eventually needs to send an API key to someone else — for staging access, a
            contractor, a webhook integration, or a client handoff. The fastest path is usually also the one
            that leaves the longest trail.
          </p>

          <section className="space-y-4">
            <SectionHeading>Treat API keys like production passwords</SectionHeading>
            <p>
              An API key is effectively a password for software. Depending on its permissions, a leaked key
              can expose customer data, consume paid resources, deploy cloud infrastructure, send email through
              your verified domain, or run up an AI bill.
            </p>
            <p>
              Unlike human passwords, API keys often stay valid for months, sit inside configuration files,
              and bypass multi-factor authentication entirely. If a key leaks, an attacker can operate as your
              application — and malicious traffic can blend into ordinary production usage until costs spike or
              data is already exposed.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>Never paste API keys into permanent systems</SectionHeading>
            <p>
              These channels are convenient because they preserve history. That is exactly why they are the
              wrong place for secrets.
            </p>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/60 dark:bg-red-950/20">
              <div className="mb-3 flex items-center gap-2 font-bold text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" aria-hidden />
                Avoid these channels
              </div>
              <ul className="space-y-2">
                {avoidChannels.map((item) => (
                  <li className="flex items-start gap-2 text-sm leading-relaxed text-red-950 dark:text-red-100" key={item}>
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-300" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>Where API keys actually leak</SectionHeading>
            <p>
              Most leaks are not sophisticated cryptography breaks. They happen when someone copies a secret
              into a system built to keep records.
            </p>
            <div className="space-y-4">
              {leakSources.map((source) => (
                <BoldParagraph key={source.title} title={source.title} body={source.body} />
              ))}
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>Before you share</SectionHeading>
            <p>
              Narrow the blast radius first. How you deliver the key matters — but a tightly scoped key limits
              the damage if something still goes wrong.
            </p>
            <div className="space-y-4">
              {prepSteps.map((step) => (
                <BoldParagraph key={step.title} title={step.title} body={step.body} />
              ))}
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>A safer handoff workflow</SectionHeading>
            <p className="max-w-2xl">
              When a human needs the key — not when an app retrieves it at runtime — follow this sequence.
            </p>
            <HandoffFlowDiagram />
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>How PrivateNote fits the handoff</SectionHeading>
            <p>
              PrivateNote is built for the human-to-human moment: API keys, SSH private keys, database
              credentials, recovery codes, webhook signing secrets, and temporary passwords that need to reach
              one person without becoming a permanent record.
            </p>
            <p>
              The secret is encrypted in your browser before upload. PrivateNote stores ciphertext, not
              plaintext. The decryption key lives in the URL fragment — the part after the <code>#</code> —
              which browsers do not send to the server when loading the page.
            </p>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="mb-3 font-mono text-sm text-gray-800 dark:text-gray-100">
                https://privatenote.ai/note/abc123#kL8mN4...
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>The server receives the note ID and encrypted payload.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>The server does not receive the decryption key.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>Burn-after-reading and expiration limit how long the encrypted note exists.</span>
                </li>
              </ul>
            </div>
            <p>
              PrivateNote complements dedicated secret stores — it closes the gap when you need to send a
              Stripe key to an integration partner, share a temporary OpenAI key with a contractor, or give a
              teammate one-time access to a staging credential.
            </p>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>Frequently asked questions</SectionHeading>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <p>
                    <strong className="font-semibold text-gray-900 dark:text-white">{faq.question}</strong>
                  </p>
                  <p className="mt-1">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gray-200 dark:border-gray-800" />

          <section className="space-y-4">
            <SectionHeading>The bottom line</SectionHeading>
            <p>
              Most API key leaks do not happen because cryptography failed. They happen because someone copied
              a secret into a permanent, searchable system out of convenience. Scope keys tightly, share them
              only when necessary, and avoid leaving a plaintext trail in chat, tickets, email, or Git.
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Share an API key without leaving it in chat
          </h2>
          <p className="mb-5 text-gray-700 dark:text-gray-300">
            Create a browser-encrypted, burn-after-reading PrivateNote link. No account required for one-time
            notes.
          </p>
          <Link
            href={homePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Create a PrivateNote -&gt;
          </Link>
        </div>
      </article>
    </div>
  );
};
