import React from "react";
import { Link } from "wouter";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Eye,
  Lock,
  Scale,
  ShieldAlert,
  Vote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { cn } from "@/lib/utils";
import type { BlogCanonicalSlug } from "@shared/localizedBlogSlugs";

const heroImagePath = "/images/blog-chat-control-is-back-hero.png";

const voteTally = [
  { label: "Against", value: 314, tone: "against" as const },
  { label: "In favour", value: 276, tone: "for" as const },
  { label: "Abstentions", value: 17, tone: "neutral" as const },
];

const nonE2eChannels = [
  "traditional email services",
  "cloud storage",
  "certain direct messaging services",
  "other communications where providers can access message contents",
];

const privacyConcerns = [
  {
    title: "False positives",
    body:
      "Detecting already-known illegal material using cryptographic hashes is generally reliable, but it is not perfect. Researchers have demonstrated collisions and implementation errors that can generate false reports. If providers begin using AI to identify new, previously unseen material, the false positive rate becomes substantially harder to control. Every false positive potentially involves an innocent person's private communication being flagged for further review.",
  },
  {
    title: "Expansion of surveillance infrastructure",
    body:
      "Many experts argue that once platforms build large-scale scanning systems, expanding their use to additional purposes becomes technically straightforward. History shows that technologies introduced for narrow purposes often evolve into broader surveillance capabilities over time.",
  },
  {
    title: "Chilling effects",
    body:
      "Private communication only works when people trust that their conversations remain private. If users believe every message may be automatically analysed, many may avoid discussing sensitive topics altogether—even when perfectly lawful. This phenomenon is well documented in privacy research.",
  },
  {
    title: "Limited effectiveness",
    body:
      "More than 800 cybersecurity and privacy researchers have argued that broad message scanning is unlikely to significantly reduce child abuse while imposing substantial privacy costs on hundreds of millions of users. Critics argue that law enforcement resources are better invested in targeted investigations rather than indiscriminate scanning.",
  },
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

export const ChatControl10VoteExplainedPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const howItWorksPath = localizedPath("/how-it-works", language);

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="chat-control-1-0-vote-explained"
          title={t.blogChatControl10VoteTitle}
          excerpt={t.blogChatControl10VoteExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt="European Parliament vote on Chat Control with a locked chat bubble over a map of Europe"
              className="aspect-[16/9] w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
              loading="lazy"
            />
            <figcaption className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Illustration generated for PrivateNote.ai.
            </figcaption>
          </figure>
        </BlogPostHeader>

        <div className="space-y-12 text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 sm:space-y-14 sm:leading-[1.9]">
          <p className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 sm:text-[1.35rem] sm:leading-[1.75]">
            On 9 July 2026, something unusual happened in the European Parliament. The final vote on the
            extension of the temporary Chat Control 1.0 regulation ended with more Members of the European
            Parliament voting against it than for it—yet the measure still passed.
          </p>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
            <div className="flex items-start gap-4">
              <Vote className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Final vote, 9 July 2026
                </p>
                <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
                  More “No” votes than “Yes”—and it still passed
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {voteTally.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-2xl border px-5 py-4 text-center",
                        item.tone === "against" &&
                          "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20",
                        item.tone === "for" &&
                          "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20",
                        item.tone === "neutral" &&
                          "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/70",
                      )}
                    >
                      <p className="text-3xl font-bold tabular-nums text-gray-900 dark:text-white">
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  At first glance, most observers would conclude that the proposal had been rejected. The answer
                  lies not in encryption or cybersecurity—but in parliamentary procedure.
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title="Why did it pass?">
            <p>
              This was not a standard legislative vote requiring a simple majority of votes cast. Because of the
              specific procedural stage of this legislation, <strong className="font-semibold text-gray-900 dark:text-white">rejecting the proposal required an absolute majority of all Members of the European Parliament—currently 361 votes</strong>.
            </p>
            <p>
              Although 314 MEPs voted against the proposal, that number fell short of the required threshold. As
              a result, the proposal was considered approved.
            </p>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-7">
              <div className="flex gap-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                <p className="text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  This procedural outcome has surprised many observers, including journalists, legal experts, and
                  cybersecurity researchers, because the intuitive expectation is that more “No” votes than “Yes”
                  votes should defeat a proposal.
                </p>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="What does Chat Control 1.0 actually do?">
            <p>
              The adopted measure does <strong className="font-semibold text-gray-900 dark:text-white">not</strong> introduce mandatory scanning of all private messages. Instead, it extends the existing temporary legal framework that allows online service providers to <strong className="font-semibold text-gray-900 dark:text-white">voluntarily</strong> detect and report child sexual abuse material (CSAM) in certain types of communications until 3 April 2028.
            </p>
            <p>
              This primarily applies to communications that are not protected by{" "}
              <BlogInlineLink slug="what-is-end-to-end-encryption">end-to-end encryption</BlogInlineLink>, such as:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {nonE2eChannels.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p>
              Importantly, the Parliament maintained language excluding end-to-end encrypted communications from
              this voluntary scanning framework. For a precise definition of what that means in practice—and how
              it differs from ordinary transport encryption—see our guide on{" "}
              <BlogInlineLink slug="what-is-end-to-end-encryption">
                what end-to-end encryption actually is
              </BlogInlineLink>
              .
            </p>
          </ArticleSection>

          <ArticleSection title="Why are privacy experts concerned?">
            <p>
              Many researchers and civil liberties organisations opposed the extension—not because they oppose
              protecting children, but because they question whether this approach achieves that goal without
              creating significant risks. Our earlier article on{" "}
              <BlogInlineLink slug="chat-control-europe-cryptographers">
                why Europe&apos;s cryptographers keep warning about Chat Control
              </BlogInlineLink>{" "}
              explains the broader technical objections in depth.
            </p>
            <div className="space-y-5">
              {privacyConcerns.map((concern, index) => {
                const icons = [Eye, ShieldAlert, Ban, Scale];
                const Icon = icons[index];
                return (
                  <div
                    className="group flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 sm:p-7"
                    key={concern.title}
                  >
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-bold leading-snug text-gray-900 dark:text-white">{concern.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                        {concern.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ArticleSection>

          <ArticleSection title="The bigger story is Chat Control 2.0">
            <p>
              While this week&apos;s vote has attracted significant attention, many experts believe the larger
              debate is still ahead. The proposal commonly referred to as Chat Control 2.0 aims to establish a
              permanent legal framework for detecting CSAM online.
            </p>
            <p>
              Unlike the temporary extension adopted this week, discussions around Chat Control 2.0 have
              repeatedly included proposals that could affect end-to-end encrypted communications. That is where
              the debate becomes considerably more significant—and where the warnings in our{" "}
              <BlogInlineLink slug="chat-control-europe-cryptographers">
                cryptographers&apos; briefing on Chat Control
              </BlogInlineLink>{" "}
              matter most.
            </p>
            <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-7 dark:border-primary/25 dark:bg-primary/[0.08] sm:p-8">
              <div className="flex gap-4">
                <Lock className="mt-1 h-6 w-6 flex-shrink-0 text-primary" aria-hidden />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    End-to-end encryption changes the trust model
                  </h3>
                  <p className="mt-4 leading-relaxed">
                    End-to-end encryption ensures that only the sender and intended recipient possess the
                    cryptographic keys needed to read a message. Even the service provider cannot decrypt the
                    contents. Any requirement to inspect encrypted messages before or after encryption
                    fundamentally changes that security model—and has become one of the most controversial topics
                    in modern cybersecurity policy.
                  </p>
                </div>
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="Why this matters for PrivateNote">
            <p>
              Private communication is built on a simple principle: if a service cannot read your message, it
              cannot scan it, analyse it, sell it, or accidentally expose it. PrivateNote was designed around
              that idea.
            </p>
            <p>
              When you create a note, encryption happens directly inside your browser. The encryption key never
              reaches our servers. We store only ciphertext. Without the key—which remains entirely under your
              control—the contents of your note are mathematically unreadable to us.
            </p>
            <p>
              That design is not about avoiding responsibility. It is about ensuring that your private
              communication remains exactly that: private. Whether you are sharing passwords, legal documents,
              financial information, business secrets, or personal conversations, privacy should not depend
              solely on trusting the service provider. It should be enforced by cryptography.
            </p>
            <p>
              For a step-by-step view of how browser-side encryption works in practice, see{" "}
              <Link href={howItWorksPath} className="font-semibold text-primary hover:underline">
                How PrivateNote works
              </Link>
              . For sharing short-lived secrets without leaving them in a permanent chat thread,{" "}
              <BlogInlineLink slug="one-time-secret-links">one-time secret links</BlogInlineLink> are often a
              better fit than messaging apps—even encrypted ones.
            </p>
          </ArticleSection>

          <ArticleSection title="The debate is far from over">
            <p>
              Reasonable people can disagree about how society should combat online child abuse. Protecting
              children is unquestionably one of the most important public interests. The difficult question is
              how to achieve that goal without undermining the security and privacy infrastructure relied upon by
              journalists, businesses, lawyers, healthcare providers, activists, and ordinary citizens every day.
            </p>
            <p>
              As discussions continue around Chat Control 2.0, this balance between public safety and fundamental
              privacy rights will remain one of the defining technology policy debates in Europe. Whatever
              one&apos;s position, one thing is certain: the future of encrypted communication will increasingly
              be decided not only by cryptographers and software engineers—but also by legislators.
            </p>
          </ArticleSection>
        </div>

        <div className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-7 sm:mt-20 sm:p-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
            Send private notes without giving the server the key
          </h2>
          <p className="mb-6 text-gray-700 dark:text-gray-300">
            PrivateNote encrypts notes in your browser and keeps the decryption key in the URL fragment.
          </p>
          <Link
            href={homePath}
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
          >
            Try PrivateNote -&gt;
          </Link>
        </div>

        <BlogPostCrossLinks slug="chat-control-1-0-vote-explained" />
      </article>
    </div>
  );
};
