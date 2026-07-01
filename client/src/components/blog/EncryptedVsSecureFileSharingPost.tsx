import React from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Laptop,
  Lock,
  Server,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { joinPublicPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";

type FlowKind = "tls" | "browser";

type ArticleSection = {
  title: string;
  level?: "primary" | "secondary";
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  flow?: FlowKind;
};

type ArticleCopy = {
  intro: string[];
  sections: ArticleSection[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  relatedReading: string;
};

const heroImagePath = "/images/blog-encrypted-file-sharing-hero.png";

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

function ArticleParagraph({
  text,
  lead = false,
}: {
  text: string;
  lead?: boolean;
}) {
  return (
    <p
      className={cn(
        "leading-[1.8] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      <RichText text={text} />
    </p>
  );
}

function CalloutBox({ text }: { text: string }) {
  return (
    <blockquote className="my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-violet-500/[0.05] px-6 py-5 dark:border-primary/25 dark:from-primary/10 dark:to-violet-500/10">
      <p className="text-[1.0625rem] leading-[1.75] text-gray-800 dark:text-gray-100">
        <RichText text={text} />
      </p>
    </blockquote>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li className="flex gap-3.5" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-[1.0625rem] leading-[1.75] text-gray-700 dark:text-gray-300">
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function FlowNode({
  icon: Icon,
  label,
  detail,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
  tone?: "neutral" | "warn" | "safe";
}) {
  const toneClass =
    tone === "warn"
      ? "border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30"
      : tone === "safe"
        ? "border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/30"
        : "border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/50";

  return (
    <div className={cn("flex min-w-[9.5rem] flex-1 flex-col items-center rounded-2xl border px-4 py-4 text-center shadow-sm", toneClass)}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 dark:bg-gray-950/60">
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-1 sm:px-2">
      <ArrowRight className="hidden h-5 w-5 text-gray-400 sm:block" aria-hidden />
      <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-[11px]">
        {label}
      </span>
      <ArrowRight className="h-5 w-5 rotate-90 text-gray-400 sm:hidden" aria-hidden />
    </div>
  );
}

function EncryptionFlowDiagram({ kind }: { kind: FlowKind }) {
  if (kind === "tls") {
    return (
      <figure className="my-2 overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 dark:border-gray-700 dark:bg-gray-900/40 sm:p-6">
        <figcaption className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Transport encryption (TLS only)
        </figcaption>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <FlowNode icon={Laptop} label="Your device" detail="Original file (plaintext)" tone="warn" />
          <FlowArrow label="TLS tunnel" />
          <FlowNode icon={Server} label="Host server" detail="Receives readable file" tone="warn" />
        </div>
      </figure>
    );
  }

  return (
    <figure className="my-2 overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 dark:border-primary/25 dark:bg-primary/[0.07] sm:p-6">
      <figcaption className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary/80 dark:text-primary/70">
        Browser-side encryption + TLS
      </figcaption>
      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-center">
        <FlowNode icon={Laptop} label="Your browser" detail="Encrypts locally first" tone="safe" />
        <FlowArrow label="Ciphertext" />
        <FlowNode icon={Lock} label="Encrypted payload" detail="Unreadable without key" tone="safe" />
        <FlowArrow label="TLS tunnel" />
        <FlowNode icon={Cloud} label="Host server" detail="Stores ciphertext only" tone="safe" />
      </div>
    </figure>
  );
}

function InlineCodeBlock({ code }: { code: string }) {
  return (
    <div className="my-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 px-4 py-3.5 dark:border-gray-700">
      <code className="font-mono text-sm text-emerald-300">{code}</code>
    </div>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      'When people search for "secure file sharing," they often assume that every service offering HTTPS or TLS encryption protects their files in the same way. Unfortunately, that is not true.',
      'Two services can both advertise "encrypted file transfer" while offering vastly different privacy guarantees. The difference lies entirely in **where the encryption happens**. Understanding this distinction explains why some services can inspect, index, and process your files, while others simply cannot.',
    ],
    sections: [
      {
        title: "The two types of encryption",
        level: "primary",
        paragraphs: ["There are two primary ways modern file-sharing services protect your data."],
      },
      {
        title: "1. Transport encryption (TLS)",
        level: "secondary",
        paragraphs: [
          "This is the standard encryption used by almost every website on the Internet today. When you upload a file, your browser establishes a secure Transport Layer Security (TLS) connection with the host server. The connection is encrypted while your file travels across the network, protecting you against attackers on public Wi-Fi, compromised routers, or anyone sniffing network traffic.",
        ],
        flow: "tls",
        bullets: [
          "TLS is essential, and every reputable service must use it.",
          "Once the upload reaches the server, the provider receives the original plaintext file.",
          "From that point onward, depending on its policies, the service may store the file, generate previews, index contents, scan for malware, or use metadata for analytics.",
          'Many providers also encrypt files "at rest." That protects against physical theft of disks—but the service still holds the keys and can read your files.',
        ],
        callout:
          "**The core vulnerability of traditional cloud storage:** the server can only encrypt what it has already been able to read.",
      },
      {
        title: "2. Browser-side encryption",
        level: "secondary",
        paragraphs: [
          "A fundamentally different approach is to encrypt the file **before** it ever leaves your device. Instead of uploading the original file, your browser uses local cryptographic APIs to encrypt it. The server only receives ciphertext—data that appears random and is useless without the decryption key.",
        ],
        flow: "browser",
        bullets: [
          "Browser-side encryption does not replace TLS—it complements it.",
          "TLS still protects the connection from network-level eavesdroppers.",
          "The provider's servers receive nothing but unreadable ciphertext because they never receive the plaintext or the decryption key.",
        ],
      },
      {
        title: "Why this difference matters",
        level: "primary",
        paragraphs: [
          "Suppose you are sharing highly sensitive data: legal contracts, financial spreadsheets, proprietary source code, medical records, or confidential business documents.",
          "With transport-only encryption, your privacy is **contractual**. You must trust the provider's implementation, employee access controls, and current and future corporate policies.",
          "With browser-side encryption, your privacy is **architectural**. The provider only stores encrypted ciphertext. Even if they are hacked, subpoenaed, or change their business model, they cannot hand over plaintext they never possessed.",
        ],
        callout:
          "With transport-only encryption, your privacy is **contractual**. With browser-side encryption, your privacy is **architectural**.",
      },
      {
        title: "A recent reminder: the trust factor",
        level: "primary",
        paragraphs: [
          "In 2025, WeTransfer updated its Terms of Service with language that appeared to grant broad rights over uploaded content, including for improving machine-learning systems used in content moderation.",
          "The change triggered immediate backlash from artists, journalists, and creative professionals who feared their intellectual property would be used to train AI systems. WeTransfer quickly clarified that customer content was not being used for AI training and removed the confusing language—but the incident highlighted a crucial lesson:",
          "If a provider receives your files in plaintext, you are entirely dependent on their promises. When a provider only stores encrypted ciphertext, the amount of trust you must place in them is structurally minimized. The architecture enforces the privacy.",
        ],
      },
      {
        title: "How PrivateNote handles file sharing",
        level: "primary",
        paragraphs: [
          "Modern browser-based encryption combines several well-established cryptographic building blocks to keep data secure without relying on server trust.",
        ],
      },
      {
        title: "Key generation and isolation",
        level: "secondary",
        paragraphs: [
          "When a user prepares to share a file, PrivateNote generates a cryptographically secure, random symmetric key directly in the browser using the Web Crypto API.",
          "This key is never transmitted to our infrastructure. Instead, it is appended to the sharing link as a URL fragment (the portion after the `#` symbol):",
          "`https://privatenote.ai/note/your-note-id#your-secret-key`",
          "By design, web browsers never send the URL fragment to the web server during an HTTP request. This behavior is defined by the URL standard and has worked this way for decades. The decryption key stays in the recipient's browser.",
        ],
      },
      {
        title: "Authenticated streaming encryption",
        level: "secondary",
        paragraphs: [
          "Instead of uploading raw data, the browser encrypts the file before it touches the network. Because PrivateNote supports large attachments, it uses **streaming, chunked encryption**: files are encrypted block-by-block (typically in multi-megabyte chunks) so large uploads do not need to load the entire file into memory at once.",
          "Free accounts can attach files up to 25 MB; Premium accounts support much larger payloads (up to 1 GB per file). In all cases, only ciphertext reaches our servers.",
          "The implementation relies on **AES-GCM** (Authenticated Encryption with Associated Data), providing both confidentiality and integrity:",
        ],
        bullets: [
          "**Confidentiality** — the payload is unreadable without the key.",
          "**Integrity** — tampering with ciphertext at rest is detected and rejected during client-side decryption.",
          "When password protection is enabled, a password-derived key is generated using memory-hard algorithms such as **Argon2id**, making brute-force guessing impractical.",
        ],
      },
      {
        title: "What metadata still exists",
        level: "primary",
        paragraphs: [
          "A rigorous security architecture must acknowledge its boundaries. Browser-side encryption protects the **contents** of your files, but certain metadata remains visible to the network and service:",
        ],
        bullets: [
          "Upload and download timestamps.",
          "The approximate size of the encrypted payload.",
          "Expiration, view limits, and file-access windows.",
          "The recipient's IP address when they download (visible to the web server routing the request).",
        ],
        callout:
          "Privacy-focused systems minimize metadata wherever practical, but no web-based service can eliminate it entirely. PrivateNote treats metadata with the same retention discipline as encrypted payloads—purged when a note expires or is deleted.",
      },
      {
        title: "The trade-offs of true privacy",
        level: "primary",
        paragraphs: ["Browser-side encryption offers maximum content privacy, but it comes with intentional trade-offs:"],
        bullets: [
          "**No server-side malware scanning** — because the server cannot read the file, it cannot scan it for viruses. Trust the sender.",
          "**No server-generated previews** — thumbnails and document previews are rendered locally in the recipient's browser after decryption, not on the server.",
          "**No password or key recovery** — if you lose the link or encryption key, the provider cannot recover the file. There is no \"Forgot password\" for data the host cannot access.",
        ],
      },
      {
        title: "Choosing the right service",
        level: "primary",
        paragraphs: [
          "Not every file transfer requires strict browser-side encryption. Casual holiday photos with family may be fine with transport encryption alone.",
          "If you are sharing intellectual property, legal agreements, or sensitive personal data, ask one architectural question:",
          "**Does the service receive my original file, or only an encrypted version of it?**",
          "That single distinction determines who can technically access your data—not just today, but as corporate policies, ownership, and privacy laws evolve over time.",
        ],
      },
    ],
    closingTitle: "Share files without handing plaintext to the server",
    closingBody:
      "PrivateNote's secure file transfer uses the same browser-side encryption model as our disappearing notes: encrypt locally, upload ciphertext, share the key in the URL fragment, and expire access on your terms.",
    ctaLabel: "Try secure file transfer",
    relatedReading: "Related reading",
  },
};

export const EncryptedVsSecureFileSharingPost: React.FC = () => {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);
  const fileTransferPath = localizedPath("/secure-file-transfer", language);
  const article = copy[language] ?? copy.en;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 mt-16 mb-24 sm:px-6">
      <Link
        href={blogPath}
        className="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
      >
        <ArrowLeft className="mr-1 h-4 w-4" /> {t.blogBackToBlog}
      </Link>

      <article>
        <header className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary/80">
            {t.blogTagSecurity} · {t.blogTagCryptography}
          </p>
          <h1 className="mb-5 text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {t.blogEncryptedFileSharingTitle}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {t.blogEncryptedFileSharingExcerpt}
          </p>
          <figure className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/80 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
            <img
              src={heroImagePath}
              alt="Illustration comparing plaintext cloud upload versus encrypting files in the browser before upload"
              className="mx-auto h-auto w-full object-contain"
              loading="lazy"
            />
          </figure>
        </header>

        <div className="space-y-7">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} />
          ))}
        </div>

        <div className="mt-16 space-y-16">
          {article.sections.map((section, index) => {
            const isPrimary = section.level !== "secondary";
            const isFirst = index === 0;

            return (
              <section
                key={section.title}
                className={cn(
                  "space-y-6",
                  isPrimary && !isFirst && "border-t border-gray-200 pt-12 dark:border-gray-800",
                )}
              >
                {isPrimary ? (
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
                    {section.title}
                  </h2>
                ) : (
                  <h3 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {section.title.match(/^(\d+)/)?.[1] ?? "•"}
                    </span>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </h3>
                )}

                <div className="space-y-5">
                  {section.paragraphs.map((paragraph) =>
                    paragraph.startsWith("`") && paragraph.endsWith("`") ? (
                      <InlineCodeBlock key={paragraph} code={paragraph.slice(1, -1)} />
                    ) : (
                      <ArticleParagraph key={paragraph} text={paragraph} />
                    ),
                  )}
                </div>

                {section.flow ? <EncryptionFlowDiagram kind={section.flow} /> : null}
                {section.bullets ? <BulletList items={section.bullets} /> : null}
                {section.callout ? <CalloutBox text={section.callout} /> : null}
              </section>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-8 dark:border-gray-800 dark:bg-gray-900/40 sm:px-8">
          <h2 className="mb-4 flex items-center gap-2.5 text-xl font-semibold text-gray-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-primary/80" />
            {article.closingTitle}
          </h2>
          <p className="mb-7 max-w-2xl text-[1.0625rem] leading-[1.8] text-gray-700 dark:text-gray-300">
            {article.closingBody}
          </p>
          <Link
            href={fileTransferPath}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-white px-6 py-3.5 text-base font-semibold text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 dark:border-primary/30 dark:bg-gray-950 dark:hover:bg-primary/10"
          >
            {article.ctaLabel}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-14 border-t border-gray-200 pt-10 dark:border-gray-800">
          <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {article.relatedReading}
          </p>
          <ul className="space-y-3">
            <li>
              <Link
                href={joinPublicPath(...blogPath.split("/").filter(Boolean), "one-time-secret-links")}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t.blogOneTimeLinksTitle}
              </Link>
            </li>
            <li>
              <Link
                href={joinPublicPath(...blogPath.split("/").filter(Boolean), "myth-good-enough-security")}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                {t.blogGoodEnoughTitle}
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
};
