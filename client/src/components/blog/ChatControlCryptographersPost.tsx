import React from "react";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, Eye, Lock, Scale, ShieldAlert, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { cn } from "@/lib/utils";

const heroImagePath = "/images/blog-chat-control-is-back-hero.png";
const bartPreneelLinkedInPostUrl =
  "https://www.linkedin.com/feed/update/urn:li:activity:7480027993994768384/";
const scientistOpenLetterSep2025Url = "https://csa-scientist-open-letter.org/Sep2025";
const scientistOpenLetterNov2025Url = "https://csa-scientist-open-letter.org/Nov2025";

const technicalConcerns = [
  {
    title: "AI cannot reliably classify unknown CSAM at Internet scale",
    body:
      "Image classification depends on context. Family photos, medical images, educational material, and consensual images exchanged by teenagers can be difficult even for humans to interpret correctly.",
  },
  {
    title: "Known-image matching can be evaded",
    body:
      "Cropping, resizing, compression, small pixel changes, and adversarial perturbations can leave an image recognizable to a person while changing how automated matching systems see it.",
  },
  {
    title: "Client-side scanning changes the encryption trust model",
    body:
      "The encryption algorithm may remain mathematically strong, but the software is required to inspect content before encryption protects it. That is not the privacy guarantee users expect from end-to-end encryption.",
  },
  {
    title: "Scanning infrastructure becomes a high-value target",
    body:
      "Once devices are required to inspect private messages, the same mechanism can attract attackers, political pressure, and future demands to scan for other categories of content.",
  },
];

const protectedGroups = [
  "journalists and confidential sources",
  "lawyers and clients",
  "doctors and patients",
  "businesses protecting trade secrets",
  "government officials and diplomats",
  "law enforcement and military communications",
];

const betterInvestments = [
  {
    title: "Support victims",
    body: "Trauma-informed reporting channels and long-term victim support.",
  },
  {
    title: "Fund specialists",
    body: "More capacity for trained law enforcement teams that investigate abuse.",
  },
  {
    title: "Investigate evidence",
    body: "Rapid, targeted investigation based on concrete leads and reports.",
  },
  {
    title: "Work across borders",
    body: "International cooperation where offenders, platforms, and victims span jurisdictions.",
  },
  {
    title: "Remove confirmed material",
    body: "Faster takedown of known illegal content after proper confirmation.",
  },
  {
    title: "Prevent abuse earlier",
    body: "Education and prevention work before abuse occurs.",
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

export const ChatControlCryptographersPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);

  return (
    <div className={cn(blogPostPageClass, "pb-12 mb-28")}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="chat-control-europe-cryptographers"
          title={t.blogChatControlTitle}
          excerpt={t.blogChatControlExcerpt}
          headerClassName="mb-14 sm:mb-16"
        >
          <figure className="mt-10 sm:mt-12">
            <img
              src={heroImagePath}
              alt="Chat Control is back editorial graphic with a locked chat bubble and map of Europe"
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
            Today, Tuesday, July 7, the European Parliament is expected to revisit the proposed Child Sexual
            Abuse Regulation, commonly known by critics as Chat Control. The goal behind the proposal is not
            controversial: children must be protected from horrific abuse. The technical question is whether
            mandatory scanning of private communications can do that without breaking the security guarantees
            everyone else depends on.
          </p>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-7 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
            <div className="flex gap-5">
              <AlertTriangle className="mt-1 h-6 w-6 flex-shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
              <div>
                <h2 className="text-xl font-bold text-amber-950 dark:text-amber-100">
                  This is not a debate about whether child abuse should be fought.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-amber-950/90 dark:text-amber-100/90">
                  Victims deserve protection. Law enforcement deserves effective tools. Platforms should rapidly
                  report known illegal material and cooperate in investigations. The disagreement is whether mass
                  scanning of everyone&apos;s private messages is a technically sound way to get there.
                </p>
              </div>
            </div>
          </div>

          <ArticleSection title="The proposal keeps returning">
            <p>
              Over the last several years, CSAR has gone through multiple revisions. Some changes deserve
              recognition: faster handling of voluntary reports, clearer obligations, and narrower categories of
              content are all better than broader, vaguer mandates.
            </p>
            <p>
              But those changes do not remove the central technical problem. The most contested versions of Chat
              Control still rely on detection technologies that cryptographers, computer scientists, and security
              researchers have warned are not reliable enough to deploy against hundreds of millions of private
              communications.
            </p>
          </ArticleSection>

          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              Expert warning
            </p>
            <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">
              Bart Preneel: the security community is unusually aligned
            </h2>
            <p className="mt-5">
              Bart Preneel, full professor at KU Leuven and one of Europe&apos;s best-known experts in
              cryptography, privacy, and digital rights, warned today that Chat Control is returning for a
              third vote after two earlier votes failed to settle the issue. In his LinkedIn post, he described
              the proposal as indiscriminate scanning of unencrypted communications, now extended to the use of
              AI to find new CSAM.
            </p>
            <p className="mt-5">
              Preneel also pointed to the unusually broad expert consensus behind the criticism: more than 800
              cybersecurity and privacy experts have warned that mass scanning and AI-based content analysis
              still have unacceptable error rates, raise serious proportionality concerns, and are less effective
              than targeted approaches. As he put it, the security community rarely reaches this level of
              agreement on any topic.
            </p>
            <p className="mt-5">
              His practical recommendation is direct: contact Members of the European Parliament and explain why
              indiscriminate scanning is not a sound way to address the serious problem of CSAM distribution.
            </p>
            <p className="mt-5">
              For the technical background, he points readers to two scientist letters: the September 2025 open
              letter, which explains the core concerns with client-side scanning and AI-based detection, and the
              November 2025 follow-up, which argues that the proposed increase in scope amplifies the same risks
              the security community has already identified.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={bartPreneelLinkedInPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                Bart Preneel&apos;s LinkedIn post
              </a>
              <a
                href={scientistOpenLetterSep2025Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                September 2025 open letter
              </a>
              <a
                href={scientistOpenLetterNov2025Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                November 2025 follow-up
              </a>
            </div>
          </div>

          <ArticleSection title="Why cryptographers keep objecting">
            <div className="space-y-5">
              {technicalConcerns.map((concern, index) => {
                const icons = [Eye, ShieldAlert, Lock, Scale];
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

          <ArticleSection title="End-to-end encryption cannot survive mandatory client-side scanning">
            <p>
              End-to-end encryption gives users a simple promise: only the sender and the intended recipient can
              read the message. Mandatory client-side scanning changes that promise. The device must inspect the
              message before encryption protects it and report anything the scanning system considers suspicious.
            </p>
            <p>
              In transit, the message may still be encrypted with strong cryptography. The problem is what
              happens before that step. If software is required to examine the plaintext on the device and report
              matches to an outside system, the endpoint is no longer acting only for the user. That is a different
              trust model from end-to-end encryption as people understand it.
            </p>
          </ArticleSection>

          <ArticleSection title="Encryption protects more than personal chats">
            <p>
              The public debate often sounds as if encrypted messaging is only about casual conversation. It is
              not. Secure private communication is critical infrastructure for people and institutions that face
              real risk.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {protectedGroups.map((item) => (
                <li
                  className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-800 dark:bg-gray-900/70 dark:text-gray-200"
                  key={item}
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ArticleSection>

          <ArticleSection title="More technology does not automatically mean more safety">
            <p>
              The proposal also sits alongside broader calls for age verification and additional mitigation
              systems. Those ideas may sound like extra safety layers, but security engineering is rarely improved
              by adding complexity without understanding the new attack surfaces it creates.
            </p>
            <p>
              Centralized identity checks, scanning pipelines, review queues, and reporting infrastructure can
              all introduce privacy risks of their own. A system built to protect children should not quietly
              create new databases, new surveillance incentives, and new failure modes for everyone.
            </p>
          </ArticleSection>

          <ArticleSection title="There are better ways to protect children">
            <p>
              One point from the scientific criticism deserves special attention: CSAM is evidence of an earlier
              crime. The real objective should be preventing abuse, supporting victims, and enabling targeted
              investigations that can actually identify offenders.
            </p>
            <div className="mt-8 overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-sm dark:border-primary/25 dark:bg-gray-950">
              <div className="border-b border-primary/15 bg-primary/[0.055] px-7 py-6 dark:bg-primary/[0.09] sm:px-8 sm:py-7">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  Better investment
                </p>
                <h3 className="mt-3 text-xl font-bold leading-tight text-gray-900 dark:text-white">
                  Strengthen the work that directly helps victims and investigators
                </h3>
              </div>
              <div className="grid divide-y divide-gray-200 dark:divide-gray-800 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                {betterInvestments.map((item, index) => (
                  <div
                    className="group flex gap-4 p-6 transition duration-300 hover:bg-primary/[0.035] dark:hover:bg-primary/[0.08] sm:p-7"
                    key={item.title}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xs font-bold tabular-nums text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold leading-snug text-gray-900 dark:text-white">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ArticleSection>

          <ArticleSection title="Why this matters for PrivateNote">
            <p>
              At PrivateNote, the principle is simple: when you create an encrypted note, only the people you
              choose should be able to read it. Not us. Not advertisers. Not cloud providers. Not anyone else.
            </p>
            <p>
              That principle is not a slogan. It reflects decades of cryptographic engineering. The debate
              around Chat Control asks whether private communication should remain genuinely private, or whether
              every device should become a mandatory checkpoint that inspects messages before they are encrypted.
            </p>
          </ArticleSection>

          <ArticleSection title="Policy should follow technical reality">
            <p>
              Reasonable people can disagree on policy.{" "}
              <strong className="font-semibold text-gray-900 dark:text-white">
                But policy should be informed by technical reality.
              </strong>{" "}
              When hundreds of cryptographers, computer scientists, security engineers, and privacy researchers
              warn that a proposed technology cannot deliver its promises without weakening fundamental security
              guarantees, lawmakers should listen.
            </p>
            <p>
              Protecting children and protecting secure communications are not mutually exclusive goals. Europe
              should pursue solutions that accomplish both.
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
      </article>
    </div>
  );
};
