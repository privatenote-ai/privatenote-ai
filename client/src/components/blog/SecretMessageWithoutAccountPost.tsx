import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import type { Translations } from "@/utils/translations/types";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { secretMessageWithoutAccountHr } from "@/components/blog/locale/secretMessageWithoutAccount.hr";
import { secretMessageWithoutAccountSr } from "@/components/blog/locale/secretMessageWithoutAccount.sr";

const heroImagePath = "/images/blog-secret-message-no-account-hero.png";
const heroArtistUrl =
  "https://pixabay.com/users/alexas_fotos-686414/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3444212";
const heroPixabayUrl =
  "https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3444212";

type FlowStep = {
  title: string;
  body: string;
};

type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  beforeFlowSteps?: string;
  flowSteps?: FlowStep[];
  afterFlowSteps?: string[];
};

type ArticleCopy = {
  intro: string[];
  sections: ArticleSection[];
  closingTitle: string;
  closingBody: string[];
  fileSharingNote: string;
  tagline: string;
  relatedReading: string;
  relatedPosts: { slug: string; blurb: string }[];
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

function FlowStepsList({
  steps,
  resolveLink,
}: {
  steps: FlowStep[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <ol className="space-y-6">
      {steps.map((step, index) => (
        <li className="flex gap-4" key={step.title}>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200">
            {index + 1}
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">{step.title}</p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(step.body, resolveLink)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      "Sometimes you need to share something confidential—a [password](app:password-generator), a recovery code, a Wi-Fi password, a private note, or a personal message—but creating an account just to send one message feels unnecessary.",
      "The good news is that it isn't required.",
      "Modern [browser-based encryption](blog:encrypted-vs-secure-file-sharing) makes it possible to securely send a secret message **without signing up**, installing software, or trusting a service with your plaintext.",
    ],
    sections: [
      {
        title: "Why avoid creating an account?",
        paragraphs: [
          "Creating an account leaves behind more information than many people realize. A typical service may store your email address, a [username](https://passwords.lu/en/blog/username-privacy-identity), login history, device information, IP addresses, and metadata about your activity.",
          "For long-term collaboration, that may be perfectly reasonable. For sharing a single confidential message, it usually isn't.",
          'If your goal is simply, "I want this one person to read this message once," an account often adds complexity without improving security. For that pattern, [one-time secret links](blog:one-time-secret-links) are usually a better fit.',
        ],
      },
      {
        title: "Encrypt before you send",
        paragraphs: [
          "The important question is not whether a website uses HTTPS. Nearly every website today uses HTTPS (TLS), which protects data while it travels across the Internet. Our guide on [encrypted vs. secure file sharing](blog:encrypted-vs-secure-file-sharing) explains why transport encryption alone is not the same as end-to-end privacy.",
          "The more important question is: **who can read your message after it reaches the server?**",
        ],
      },
      {
        title: "Traditional web services",
        paragraphs: [
          "Many messaging platforms send your message over an encrypted connection (HTTPS/TLS). Once the message reaches their servers, they can technically access it before storing or processing it.",
          "Depending on the service, the message might be scanned for spam or abuse, indexed for search, processed by cloud systems, retained in backups, or accessible to administrators.",
          "TLS protects the connection between your browser and the service. It does **not** necessarily prevent the service itself from reading your message.",
        ],
      },
      {
        title: "Browser encryption",
        paragraphs: [
          "A more privacy-friendly approach is to encrypt the message inside your browser before it is uploaded.",
        ],
        beforeFlowSteps: "In this model:",
        flowSteps: [
          {
            title: "Write your message",
            body: "You compose the secret in your browser—nothing is sent yet. Or use Private AI and [Write with Private AI](app:home) to draft it on your device before encryption.",
          },
          {
            title: "Generate a unique key locally",
            body: "Your browser creates an encryption key on your device.",
          },
          {
            title: "Encrypt before upload",
            body: "The message is encrypted locally. Only ciphertext is uploaded to the server.",
          },
          {
            title: "Share the key in the link",
            body: "The decryption key stays with you and is shared as part of the secure link—typically in the [URL fragment](blog:one-time-secret-links), which browsers do not send to web servers.",
          },
        ],
        afterFlowSteps: [
          "The service stores only encrypted data and acts as a relay. Without the decryption key, the ciphertext is practically useless.",
          "The same principle applies to files. [Secure file transfer](app:secure-file-transfer) encrypts documents and archives in your browser before upload. Recipients can open the link without an account, but sending requires signing in to a free PrivateNote account.",
        ],
      },
      {
        title: "Why this means no account is needed",
        paragraphs: [
          "When a service never needs to read your message, it also has little reason to know who you are. That is why browser-encrypted note sharing services can often work without registration—see [how one-time secret links work](blog:one-time-secret-links) for the full flow.",
          "Instead of creating an account, you simply write your message, generate a secure link, and send the link to the recipient. No usernames. No passwords to remember. No inbox full of verification emails.",
        ],
      },
      {
        title: "Add another layer with a password",
        paragraphs: [
          "For highly sensitive information, you can protect the encrypted message with an additional password.",
          "A common approach is to send the encrypted link through one communication channel and the password through another—such as a phone call, SMS, or messaging app. An attacker would need both to decrypt the message.",
        ],
      },
      {
        title: "Messages that automatically disappear",
        paragraphs: [
          "Confidential information usually should not stay online forever. Many secure note services allow messages to [self-destruct after the first read](blog:one-time-secret-links), expire after a chosen time, or be deleted automatically.",
          "This reduces the amount of sensitive information that remains available online—similar to why [workplace texts and chat logs](blog:workplace-texts-private-note) are a poor place for one-time secrets. No technology can prevent a recipient from taking a screenshot or copying the contents after opening the message, but automatic expiration significantly reduces long-term exposure.",
        ],
      },
      {
        title: "When should you use anonymous secret messages?",
        paragraphs: ["Sending encrypted messages without creating an account is useful for sharing:"],
        bullets: [
          "[Passwords and recovery codes](blog:how-we-generate-passwords) — or use our [password generator](app:password-generator) before you share",
          "[API keys](blog:privatenote-for-developers) and software license keys",
          "Private links and confidential business notes",
          "Financial information and Wi-Fi passwords",
          "Temporary personal messages that should not live in email or chat history forever",
        ],
      },
      {
        title: "What to look for in a secure service",
        paragraphs: ['Not every "private messaging" or "secret note" service offers the same level of protection. Look for services that:'],
        bullets: [
          "Encrypt messages in your browser before upload",
          "Never receive your plaintext",
          "Do not require an account",
          "Support automatic expiration",
          "Optionally allow password protection",
          "Use modern authenticated encryption",
        ],
        callout:
          "These design choices reduce the amount of trust you must place in the service itself. For a broader security baseline—including passwords, authentication, and secure sharing—see [The Myth of \"Good Enough\" Security](blog:myth-good-enough-security).",
      },
      {
        title: "How PrivateNote fits these principles",
        paragraphs: [
          "PrivateNote was built around exactly these ideas. When you create a note, encryption happens entirely inside your browser before anything is uploaded. The server stores only encrypted ciphertext and acts solely as a relay between you and your recipient—it never receives the plaintext of your message.",
          "Because of this design, you do not need to create an account to send a private note. Simply write your message, generate a secure link, and share it using whatever communication channel you prefer.",
          "For additional protection, you can protect the note with a password, choose when it expires, make it self-destruct after the first read, attach encrypted files, and optionally receive delivery notifications that tell you when a note has been opened or expired—without revealing the contents of the message.",
          "The goal is simple: make sending confidential information as easy as sharing a link while minimizing how much trust you need to place in the service.",
        ],
      },
      {
        title: "Final thoughts",
        paragraphs: [
          "Sending a secret message should not require creating another account or giving away unnecessary personal information.",
          "Browser-based encryption makes it possible to encrypt your message before it ever leaves your device, allowing the service to store only encrypted ciphertext rather than your actual message. Combined with [expiring links](blog:one-time-secret-links) and optional password protection, this provides a simple and practical way to share confidential information.",
          "Whether you are sending a password, a recovery code, or a personal note, choosing a service that encrypts data in your browser and does not require an account gives you greater privacy with less friction.",
        ],
      },
    ],
    closingTitle: "Try it without signing up",
    closingBody: [
      "PrivateNote was designed around these principles—secure message sharing as simple as creating a link and sending it to the intended recipient.",
    ],
    fileSharingNote:
      "PrivateNote also offers [secure file transfer](app:secure-file-transfer) for sharing documents and folders with the same browser-side encryption model. Sending requires a free account; recipients can open the link without signing up.",
    tagline:
      "Less account overhead. Less metadata. More control over what exists online after the handoff.",
    relatedReading: "Related reading",
    relatedPosts: [
      {
        slug: "one-time-secret-links",
        blurb: "Deep dive on burn-after-reading links, the URL fragment, and why ephemerality beats email or Slack for one-time secrets.",
      },
      {
        slug: "encrypted-vs-secure-file-sharing",
        blurb: "TLS vs browser-side encryption—what each protects and why the server may still read your data.",
      },
      {
        slug: "how-we-generate-passwords",
        blurb: "How to create and share strong passwords without reusing patterns or leaving them in chat history.",
      },
      {
        slug: "workplace-texts-private-note",
        blurb: "Why written records in email and workplace chat create long-term risk—and when ephemeral notes fit better.",
      },
      {
        slug: "myth-good-enough-security",
        blurb: "A practical security baseline: passwords, authentication, messaging, and secure sharing patterns.",
      },
      {
        slug: "privatenote-for-developers",
        blurb: "Share API keys and credentials from your editor without pasting secrets into Slack or tickets.",
      },
    ],
  },
  hr: secretMessageWithoutAccountHr,
  sr: secretMessageWithoutAccountSr,
};

export const SecretMessageWithoutAccountPost: React.FC = () => {
  const { t, language } = useLanguage();
  const howItWorksPath = localizedPath("/how-it-works", language);
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
          slug="send-secret-message-without-account"
          title={t.blogSecretNoAccountTitle}
          excerpt={t.blogSecretNoAccountExcerpt}
          headerClassName="mb-12"
        >
          <figure className="mt-8 flex flex-col items-center">
            <img
              src={heroImagePath}
              alt="Three figures in hear no evil, see no evil, speak no evil poses"
              className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800"
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
                Alexa
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

              {section.flowSteps ? <FlowStepsList steps={section.flowSteps} resolveLink={resolveLink} /> : null}

              {section.afterFlowSteps?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

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
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <RichText text={article.tagline} />
          </p>
          <Link
            href={howItWorksPath}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
          >
            {t.howItWorks}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <BlogPostCrossLinks slug="send-secret-message-without-account" />
      </article>
    </div>
  );
};
