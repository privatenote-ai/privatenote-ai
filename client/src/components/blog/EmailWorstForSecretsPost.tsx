import React from "react";
import { Link } from "wouter";
import {
  Archive,
  Bot,
  Forward,
  Inbox,
  Lock,
  Mail,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { cn } from "@/lib/utils";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";

const heroImagePath = "/images/blog-email-secrets-hero.jpg";

const emailCopies = [
  "your mailbox",
  "the recipient's mailbox",
  "mail provider backups",
  "archived copies",
  "synchronized devices",
  "company backup systems",
  "exported PST or MBOX files",
  "disaster recovery infrastructure",
];

const agedSecretsExamples = [
  "a production database password",
  "an API key",
  "SSH credentials",
  "VPN login details",
  "a cryptocurrency recovery phrase",
];

const forwardingPaths = [
  "forwarded",
  "copied into ticketing systems",
  "pasted into chat applications",
  "attached to other emails",
  "shared with contractors",
  "included in support requests",
];

const aiProcessingUses = [
  "spam detection",
  "phishing protection",
  "malware detection",
  "smart replies",
  "inbox categorization",
  "search",
  "productivity features",
  "AI-assisted writing and summarization",
];

const oneTimeSecretExamples = [
  "a password",
  "an API key",
  "a recovery code",
  "a software license",
  "a server credential",
  "a confidential message",
];

function ArticleSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 sm:space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="space-y-5 sm:space-y-6">{children}</div>
    </section>
  );
}

function BlogInlineLink({
  slug,
  children,
}: {
  slug: BlogCanonicalSlug;
  children: React.ReactNode;
}) {
  const { language } = useLanguage();
  return (
    <Link href={blogPostPath(slug, language)} className="font-semibold text-primary hover:underline">
      {children}
    </Link>
  );
}

export const EmailWorstForSecretsPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const howItWorksPath = localizedPath("/how-it-works", language);

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="why-email-is-worst-for-secrets"
          title={t.blogEmailSecretsTitle}
          excerpt={t.blogEmailSecretsExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt="Laptop on a desk showing an email with server credentials and an SSH private key in plain text"
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
              loading="lazy"
            />
          </figure>
        </BlogPostHeader>

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-[1.35rem] sm:leading-[1.75]">
            Email has become the default way to exchange almost everything—contracts, passwords, API keys, bank
            details, medical records, identity documents, Wi‑Fi passwords, and recovery codes. Most of us send
            sensitive information over email without thinking twice.
          </p>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
            <div className="flex gap-5">
              <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">
                  Email was built to deliver messages—not to make them disappear
                </h2>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  Once you send an email, you often lose control over where it ends up, how long it is stored,
                  and who may eventually have access to it. If you&apos;re sending anything that should remain
                  private, email is usually the wrong tool.
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title="Your email doesn't just exist in one place">
            <p>
              Many people imagine email as a simple conversation between two people. In reality, every email
              typically exists in multiple locations:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {emailCopies.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Inbox className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Even if you delete an email, copies may continue to exist elsewhere. Some organizations retain
              email for years to satisfy legal, regulatory, or business requirements. In practice, an email often
              becomes permanent.
            </p>
          </ArticleSection>

          <ArticleSection title="Secrets age poorly">
            <p>
              The most dangerous thing about email is not necessarily today. It&apos;s five years from now.
              Imagine you emailed someone:
            </p>
            <ul className="space-y-2">
              {agedSecretsExamples.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
                  <Archive className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Perhaps the credentials have since changed. Perhaps they haven&apos;t. Years later, that email may
              still be sitting in multiple inboxes, searchable in seconds. Anyone who gains access to one of
              those accounts suddenly has a map of your past secrets. Our guide on{" "}
              <BlogInlineLink slug="secrets-never-send-in-chat">
                secrets you should never send in chat
              </BlogInlineLink>{" "}
              covers similar risks in messaging apps—email is often worse because the retention is longer and
              the copies are more numerous.
            </p>
          </ArticleSection>

          <ArticleSection title="Email is designed to be searchable">
            <p>
              Modern email clients are incredibly good at finding old messages. Search for{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">password</code>,{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">API</code>, or{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">confidential</code>
              , and messages from years ago appear almost instantly.
            </p>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-7">
              <div className="flex gap-4">
                <Search className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                <p className="leading-relaxed">
                  This is a fantastic feature for everyday communication. It is a terrible feature for secrets.
                  Sensitive information should become <strong className="font-semibold text-gray-900 dark:text-white">harder</strong> to find over time—not easier.
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="Forwarding takes one click">
            <p>Perhaps you trust the recipient. That isn&apos;t always enough. Emails are routinely:</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {forwardingPaths.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Forward className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Once a secret leaves your inbox, you no longer control how many copies exist. Unlike a password
              manager or encrypted sharing service, email has no concept of revoking access after delivery.
            </p>
          </ArticleSection>

          <ArticleSection title="AI is increasingly processing email">
            <p>
              Another reason to think carefully before emailing sensitive information is that email providers
              increasingly use automated systems to process messages. These systems may help with:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {aiProcessingUses.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Bot className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Providers differ significantly in how these features work, what data is processed, and under what
              privacy policies. While many providers have introduced stronger privacy commitments in recent
              years, sending sensitive information by email still means entrusting that information to systems
              outside your control. If your goal is to minimize exposure, reducing the amount of sensitive
              information sent through email is a sensible first step.
            </p>
          </ArticleSection>

          <ArticleSection title="Regulatory scanning is also part of the discussion">
            <p>
              Privacy is no longer just a technical question. It has become a policy question. In July 2026, the
              European Parliament approved an extension of the temporary legal framework that allows providers of
              certain communication services to voluntarily detect and report child sexual abuse material (CSAM)
              until April 2028.
            </p>
            <p>
              The framework primarily affects services that can access message contents, such as many traditional
              email providers and other non-{" "}
              <BlogInlineLink slug="what-is-end-to-end-encryption">end-to-end encrypted</BlogInlineLink>{" "}
              communication services. For more on what that vote meant—and why more “No” votes than “Yes” still
              resulted in approval—see our explainer on{" "}
              <BlogInlineLink slug="chat-control-1-0-vote-explained">Chat Control 1.0</BlogInlineLink>.
            </p>
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
              <div className="flex gap-4">
                <ShieldAlert className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
                <p className="leading-relaxed">
                  The stated goal is child protection, and reasonable people can disagree about the appropriate
                  balance between privacy and public safety. Nevertheless, the discussion illustrates an
                  important point: <strong className="font-semibold text-gray-900 dark:text-white">if a service can read your messages, then future laws, policies, or platform decisions may affect how those messages are processed.</strong> By contrast, end-to-end encrypted services are fundamentally different because the provider does not possess the cryptographic keys needed to read the contents.
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="There is a better way to share secrets">
            <p>
              Not every piece of information needs to live forever. Sometimes you simply need to send something
              once. Examples include:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {oneTimeSecretExamples.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <Trash2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Instead of sending these directly in an email, send a{" "}
              <BlogInlineLink slug="one-time-secret-links">one-time encrypted link</BlogInlineLink>. The
              recipient opens the link, reads the secret, and the encrypted data is permanently deleted. For API
              keys specifically, see our workflow guide on{" "}
              <BlogInlineLink slug="how-to-share-api-key-securely">how to share an API key securely</BlogInlineLink>
              .
            </p>
            <ul className="space-y-2 text-gray-800 dark:text-gray-200">
              <li>No inbox history.</li>
              <li>No searchable archive.</li>
              <li>No accidental forwarding of the secret itself.</li>
              <li>No forgotten copies sitting in mailboxes for years.</li>
            </ul>
          </ArticleSection>

          <ArticleSection title="Browser encryption makes a difference">
            <p>
              At PrivateNote, encryption happens inside your browser before anything is uploaded. Your browser
              encrypts the message locally. Only the encrypted ciphertext reaches our servers. The decryption key
              never leaves your device and is never stored by us.
            </p>
            <p>
              When the recipient opens the note, it can be configured to self-destruct after the first successful
              read or automatically expire after a chosen period. That means there is no permanent email
              containing the secret waiting to be discovered years later. You can{" "}
              <BlogInlineLink slug="send-secret-message-without-account">
                send a secret message without creating an account
              </BlogInlineLink>
              , or read{" "}
              <Link href={howItWorksPath} className="font-semibold text-primary hover:underline">
                how PrivateNote works
              </Link>{" "}
              for the full encryption model.
            </p>
            <div className="rounded-3xl border border-primary/20 bg-white p-7 shadow-sm dark:border-primary/25 dark:bg-gray-950 sm:p-8">
              <div className="flex gap-4">
                <Lock className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
                <p className="leading-relaxed">
                  The practical test is simple: can the provider obtain the decryption key or the plaintext? If
                  yes, the system is not truly end-to-end encrypted. Email fails that test by design.
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="The right tool for the right information">
            <p>
              Email remains one of the most useful communication technologies ever created. It is excellent for
              conversations, invoices, newsletters, and everyday business communication.
            </p>
            <p>
              It is not the ideal place for information that should disappear after it has served its purpose.
              Passwords, recovery codes, API keys, confidential documents, and other sensitive information deserve
              a sharing mechanism designed with privacy in mind.
            </p>
            <p>
              <strong className="font-semibold text-gray-900 dark:text-white">
                Sometimes the safest secret is the one that simply doesn&apos;t exist anymore.
              </strong>
            </p>
          </ArticleSection>
        </div>

        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-7 sm:mt-20 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Share a secret without leaving it in anyone&apos;s inbox
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Create an encrypted one-time note in your browser. Send the link by email if you must—the secret
            itself stays out of the thread.
          </p>
          <Link
            href={homePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Try PrivateNote -&gt;
          </Link>
        </div>

        <BlogPostCrossLinks slug="why-email-is-worst-for-secrets" />
      </article>
    </div>
  );
};
