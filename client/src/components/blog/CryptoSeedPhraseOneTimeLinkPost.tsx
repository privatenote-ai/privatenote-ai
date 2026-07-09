import React from "react";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, KeyRound, Lock, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { cn } from "@/lib/utils";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";
import { PASSWORDS_LU_PARTNER_URLS } from "@/config/passwordsLuPartner";

const heroImagePath = "/images/blog-encrypted-file-sharing-hero.jpg";

const offlineAlternatives = [
  { label: "Metal backup", body: "stored in a safe or safety deposit box" },
  { label: "SLIP-39", body: "or similar schemes for inheritance or disaster recovery" },
  { label: "Hardware wallet transfer", body: "when practical, instead of the recovery phrase" },
];

const seedPhraseTraits = [
  { label: "Grants full control", body: "over assets" },
  { label: "Often lasts decades", body: "without rotation" },
  { label: "Cannot be changed", body: "if compromised" },
  { label: "Has no vendor recovery", body: "if stolen" },
];

const oneTimeLinkFit = [
  "API keys & temporary passwords",
  "Wi‑Fi credentials",
  "MFA recovery codes",
  "Business messages & legal drafts",
  "Temporary access tokens",
];

const localEncryptFirst = [
  "Cryptocurrency seed phrases",
  "Hardware wallet backups",
  "CA private keys & signing keys",
  "Password manager recovery material",
  "High-value master secrets",
];

const philosophySteps = [
  "avoid transmitting when you can",
  "encrypt locally",
  "upload ciphertext only",
  "erase temporary plaintext",
  "send the age file passphrase—not the mnemonic—on a separate channel when possible",
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

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 p-5 text-sm leading-relaxed text-gray-100 dark:border-gray-800">
      <code>{children}</code>
    </pre>
  );
}

function RecommendationColumn({
  title,
  subtitle,
  items,
  tone,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  items: readonly string[];
  tone: "emerald" | "amber";
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  const toneStyles =
    tone === "emerald"
      ? {
          border: "border-emerald-200 dark:border-emerald-900/50",
          header: "border-emerald-100 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-950/25",
          icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
          bullet: "text-emerald-600 dark:text-emerald-400",
        }
      : {
          border: "border-amber-200 dark:border-amber-900/50",
          header: "border-amber-100 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/25",
          icon: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
          bullet: "text-amber-600 dark:text-amber-400",
        };

  return (
    <div className={cn("overflow-hidden rounded-2xl border shadow-sm", toneStyles.border)}>
      <div className={cn("border-b px-5 py-5 sm:px-6 sm:py-6", toneStyles.header)}>
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
              toneStyles.icon,
            )}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 px-5 py-3.5 sm:px-6 sm:py-4">
            <Icon className={cn("mt-0.5 h-4 w-4 flex-shrink-0", toneStyles.bullet)} aria-hidden />
            <span className="text-[0.98rem] leading-relaxed text-gray-800 dark:text-gray-200">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const CryptoSeedPhraseOneTimeLinkPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const howItWorksPath = localizedPath("/how-it-works", language);

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="crypto-seed-phrase-one-time-link"
          title={t.blogCryptoSeedTitle}
          excerpt={t.blogCryptoSeedExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt="Encrypted file sharing concept illustrating local encryption before uploading secrets"
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
              loading="lazy"
            />
          </figure>
        </BlogPostHeader>

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-[1.35rem] sm:leading-[1.75]">
            A cryptocurrency seed phrase is one of the most valuable secrets you will ever own. It usually
            cannot be reset. There is no &ldquo;Forgot password.&rdquo; Whoever holds it typically controls the
            wallet and everything in it.
          </p>

          <p>
            That may sound odd on the blog of a company that builds encrypted one-time links. Security is not
            pretending every tool fits every job—it is matching the approach to what you are protecting,
            including our own limits.
          </p>

          <p>
            For <strong className="font-semibold text-gray-900 dark:text-white">replaceable secrets</strong>
            —such as Wi‑Fi passwords, temporary credentials, MFA recovery codes, many API keys, and confidential
            business messages—a{" "}
            <BlogInlineLink slug="one-time-secret-links">encrypted one-time link</BlogInlineLink> is an
            excellent solution.
          </p>
          <p>
            <strong className="font-semibold text-gray-900 dark:text-white">Long-lived master secrets</strong>
            , such as cryptocurrency seed phrases, deserve a different approach.
          </p>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
            <div className="flex gap-5">
              <AlertTriangle
                className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700 dark:text-amber-300"
                aria-hidden
              />
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">Rule #1</h2>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  <strong className="font-semibold">
                    Do not enter a cryptocurrency seed phrase into a website—including PrivateNote.
                  </strong>{" "}
                  If transmission is unavoidable, encrypt locally first and share{" "}
                  <strong className="font-semibold">only the ciphertext</strong>. PrivateNote is for
                  transporting pre-encrypted data, not for typing the mnemonic.
                </p>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  <strong className="font-semibold">
                    Legitimate hardware wallet vendors do not ask you to enter your recovery phrase on a
                    website.
                  </strong>{" "}
                  If a site requests your seed phrase, treat it as highly suspicious—verify authenticity before
                  you proceed.
                </p>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  Avoid entering seed phrases on websites whenever possible.
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title="Do you need to send it at all?">
            <p>
              Before encryption, ask: <strong className="font-semibold text-gray-900 dark:text-white">does the phrase need to leave where it is?</strong> Often, no.
            </p>
            <ul className="space-y-3">
              {offlineAlternatives.map((item) => (
                <li key={item.label} className="flex gap-3 text-gray-800 dark:text-gray-200">
                  <KeyRound className="mt-1 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
                    {" — "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              Every transmission adds a chance of disclosure. If you can avoid sending it, do. For other
              channels that also retain secrets indefinitely, see{" "}
              <BlogInlineLink slug="why-email-is-worst-for-secrets">
                why email is the worst place for secrets
              </BlogInlineLink>
              .
            </p>
          </ArticleSection>

          <ArticleSection title="Why seed phrases are different">
            <p>
              A seed phrase is the root secret for an entire digital estate—not &ldquo;just another
              password.&rdquo;
            </p>
            <p>Unlike most credentials, it:</p>
            <ul className="space-y-3">
              {seedPhraseTraits.map((item) => (
                <li key={item.label} className="flex gap-3 text-gray-800 dark:text-gray-200">
                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>
                    <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
                    {" — "}
                    {item.body}
                  </span>
                </li>
              ))}
            </ul>
            <p>
              You are not only defending against today&apos;s attackers—you are making choices that may matter
              ten or twenty years from now.
            </p>
          </ArticleSection>

          <ArticleSection title="Browser encryption is strong—but not magic">
            <p>
              PrivateNote encrypts in your browser before upload. Our servers see ciphertext only; the key never
              reaches us. That is far better than{" "}
              <BlogInlineLink slug="why-email-is-worst-for-secrets">email</BlogInlineLink>, chat, or cloud
              docs for everyday secrets—and aligns with a strict{" "}
              <BlogInlineLink slug="what-is-end-to-end-encryption">end-to-end encryption</BlogInlineLink>{" "}
              model for the note contents.
            </p>
            <p>
              Every browser crypto app shares one constraint:{" "}
              <strong className="font-semibold text-gray-900 dark:text-white">
                plaintext must exist in the browser before encryption.
              </strong>{" "}
              Malicious JavaScript—from extensions, supply-chain compromise, injection, or a bad CDN—could
              theoretically read it first. That is inherent to client-side encryption in the browser, not unique
              to PrivateNote.
            </p>
            <p>
              For API keys and temp passwords, that trade-off is usually fine. For a seed phrase protecting life
              savings, you may want to trust fewer systems.
            </p>
          </ArticleSection>

          <ArticleSection title="Encrypt before the browser sees it">
            <p>Encrypt locally, then upload ciphertext only:</p>
            <CodeBlock>{`Seed phrase
     │
     ▼
Local encryption (age / GnuPG / OpenSSL)
     │
     ▼
Encrypted ciphertext
     │
     ▼
PrivateNote`}</CodeBlock>
            <p>PrivateNote never receives the mnemonic—only encrypted data.</p>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-7">
              <div className="flex gap-4">
                <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                <p className="leading-relaxed">
                  Local encryption does <strong className="font-semibold text-gray-900 dark:text-white">not</strong>{" "}
                  stop malware on your machine. It{" "}
                  <strong className="font-semibold text-gray-900 dark:text-white">
                    keeps plaintext off web apps, cloud services, and servers
                  </strong>{" "}
                  that do not need it. You shrink the trusted computing base; you do not eliminate a compromised
                  endpoint.
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="Which tool to use">
            <ul className="space-y-4">
              <li>
                <strong className="font-semibold text-gray-900 dark:text-white">age</strong> (recommended for
                most users): simple file encryption with secure defaults —{" "}
                <a
                  href="https://github.com/FiloSottile/age"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  github.com/FiloSottile/age
                </a>
              </li>
              <li>
                <strong className="font-semibold text-gray-900 dark:text-white">GnuPG</strong>: excellent if
                you already use OpenPGP.
              </li>
              <li>
                <strong className="font-semibold text-gray-900 dark:text-white">OpenSSL</strong>: trusted and
                powerful; low-level CLI—better for experienced users.
              </li>
            </ul>
          </ArticleSection>

          <ArticleSection title="Minimal example (age)">
            <CodeBlock>{`# Install age (pick your platform)
# macOS:        brew install age
# Windows:      winget install FiloSottile.age
# Linux (apt):  sudo apt install age

age --version

age -p -o seed.txt.age seed.txt    # encrypt with passphrase
age -d -o seed.txt seed.txt.age    # decrypt on a trusted machine`}</CodeBlock>
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-5 py-4 dark:border-primary/25 dark:bg-primary/[0.08] sm:px-6 sm:py-5">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Need a strong passphrase?
              </p>
              <p className="mt-2 leading-relaxed text-gray-700 dark:text-gray-300">
                Use a long, unique secret for{" "}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">age -p</code>. Generate
                one locally in your browser—the{" "}
                <a
                  href={PASSWORDS_LU_PARTNER_URLS.passphraseGenerator}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-gray-400 underline-offset-2 transition-colors hover:decoration-primary dark:decoration-gray-600"
                >
                  passphrase generator
                </a>{" "}
                on passwords.lu runs client-side; nothing is uploaded.
              </p>
            </div>
            <p>
              After <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">seed.txt.age</code>{" "}
              is verified, <strong className="font-semibold text-gray-900 dark:text-white">securely erase plaintext</strong>{" "}
              on the sender&apos;s device. After the recipient imports into a wallet,{" "}
              <strong className="font-semibold text-gray-900 dark:text-white">erase their plaintext copy</strong> too.
            </p>
            <p>
              For regular exchange with someone,{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">age -r</code>{" "}
              (public-key mode) avoids a shared passphrase—worth learning separately.
            </p>
            <p>
              Docs:{" "}
              <a
                href="https://github.com/FiloSottile/age"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                age
              </a>
              {" · "}
              <a
                href="https://www.gnupg.org/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                GnuPG
              </a>
              {" · "}
              <a
                href="https://docs.openssl.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                OpenSSL
              </a>
            </p>
          </ArticleSection>

          <ArticleSection title="Use separate channels">
            <p>
              Split the encrypted file from the secret that unlocks it. You are separating the{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">.age</code> ciphertext
              from the <strong className="font-semibold text-gray-900 dark:text-white">age decryption passphrase</strong>
              —not sending the seed phrase mnemonic through a second channel.
            </p>
            <ol className="list-decimal space-y-2 pl-6 text-gray-800 dark:text-gray-200">
              <li>
                Upload the <strong className="font-semibold text-gray-900 dark:text-white">encrypted file</strong>{" "}
                (ciphertext) with PrivateNote
              </li>
              <li>
                Send the <strong className="font-semibold text-gray-900 dark:text-white">age passphrase</strong> that
                decrypts that file—via Signal, phone, or in person
              </li>
            </ol>
            <p>An attacker must compromise multiple systems—not one link.</p>
          </ArticleSection>

          <ArticleSection title="What we recommend">
            <p className="text-gray-700 dark:text-gray-300">
              The split is really about <strong className="font-semibold text-gray-900 dark:text-white">replaceable</strong>{" "}
              versus <strong className="font-semibold text-gray-900 dark:text-white">long-lived master</strong> secrets—not
              the file format or channel alone.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <RecommendationColumn
                title="Good fit for one-time links"
                subtitle="Replaceable secrets you can rotate or revoke"
                items={oneTimeLinkFit}
                tone="emerald"
                icon={CheckCircle2}
              />
              <RecommendationColumn
                title="Encrypt locally first"
                subtitle="Long-lived master secrets that rarely change"
                items={localEncryptFirst}
                tone="amber"
                icon={Lock}
              />
            </div>
            <p>
              For API keys specifically, see our guide on{" "}
              <BlogInlineLink slug="how-to-share-api-key-securely">how to share an API key securely</BlogInlineLink>
              .
            </p>
          </ArticleSection>

          <ArticleSection title="Match the tool to the risk">
            <p>
              Every approach has trust assumptions—password managers, hardware wallets, offline tools, browser
              crypto. None is perfect; trade-offs differ. The question is whether they fit the{" "}
              <strong className="font-semibold text-gray-900 dark:text-white">value</strong> of what you protect.
            </p>
          </ArticleSection>

          <ArticleSection title="Our philosophy">
            <p>
              We built PrivateNote so encryption happens{" "}
              <strong className="font-semibold text-gray-900 dark:text-white">before</strong> data reaches our
              servers. For temporary, replaceable secrets, that beats email, messaging, or cloud storage. You
              can also{" "}
              <BlogInlineLink slug="send-secret-message-without-account">
                send a secret without an account
              </BlogInlineLink>
              . Read{" "}
              <Link href={howItWorksPath} className="font-semibold text-primary hover:underline">
                how PrivateNote works
              </Link>{" "}
              for the full model.
            </p>
            <p>For a seed phrase that could be your life savings:</p>
            <ul className="list-disc space-y-2 pl-6 text-gray-800 dark:text-gray-200">
              {philosophySteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-7">
              <div className="flex gap-4">
                <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden />
                <p className="text-lg font-medium leading-relaxed text-gray-900 dark:text-white">
                  Sometimes the best advice is not &ldquo;use our product.&rdquo; It is &ldquo;use the right tool
                  for the job.&rdquo;
                </p>
              </div>
            </div>
          </ArticleSection>
        </div>

        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-7 sm:mt-20 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Share replaceable secrets—not seed phrases—in the browser
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            Create an encrypted one-time note for API keys, passwords, and credentials. For seed phrases, encrypt
            locally with age first, then share only the ciphertext.
          </p>
          <Link
            href={homePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Try PrivateNote -&gt;
          </Link>
        </div>

        <BlogPostCrossLinks slug="crypto-seed-phrase-one-time-link" />
      </article>
    </div>
  );
};
