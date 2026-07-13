import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Quote,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { joinPublicPath, localizedPath } from "@/utils/localizedPath";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import { isLocalizedSecurityGuideTopic } from "@shared/localizedSecurityGuides";
import { StubSecurityGuideHero } from "@/components/security-guides/StubSecurityGuideHero";
import { SECURITY_GUIDE_REVEAL } from "@/components/security-guides/securityGuideMotion";
import type { StubGuideContent, StubGuideSection } from "@/components/security-guides/stubSecurityGuides";

const OTHER_GUIDES = [
  { id: "vpn", title: "VPN Services" },
  { id: "password", title: "Password Managers" },
  { id: "messenger", title: "Secure Messaging" },
  { id: "email", title: "Secure Email" },
  { id: "browser", title: "Privacy Browsers" },
] as const;

function ProseBlock({ section }: { section: StubGuideSection }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-[1.05rem] sm:leading-[1.75]">
      {section.content ? <p>{section.content}</p> : null}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>
          <RichText text={paragraph} />
        </p>
      ))}
    </div>
  );
}

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

function ProviderCards({ section }: { section: StubGuideSection }) {
  if (!section.providers?.length) return null;

  const accents = [
    "from-primary/20 to-primary/5 border-primary/30",
    "from-violet-500/15 to-violet-500/5 border-violet-400/30",
    "from-orange-500/15 to-orange-500/5 border-orange-400/30",
  ];

  return (
    <div className={`mt-8 grid gap-5 ${section.providers.length > 1 ? "lg:grid-cols-2" : ""}`}>
      {section.providers.map((provider, index) => (
        <article
          key={provider.name}
          className={`flex flex-col rounded-[1.5rem] border bg-gradient-to-b p-6 ${accents[index % accents.length]}`}
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{provider.name}</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-primary">{provider.tagline}</p>
          <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{provider.description}</p>
          <ul className="mt-5 space-y-2 border-t border-gray-200/50 pt-4 dark:border-gray-700/50">
            {provider.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {highlight}
              </li>
            ))}
          </ul>
          <a
            href={provider.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Visit {provider.name}
            <ExternalLink className="h-4 w-4" />
          </a>
        </article>
      ))}
    </div>
  );
}

type StubSecurityGuideProps = {
  guideId: "messenger" | "email" | "browser";
  copy: StubGuideContent;
};

export function StubSecurityGuide({ guideId, copy }: StubSecurityGuideProps) {
  const { language } = useLanguage();

  React.useEffect(() => {
    setDocumentMeta(buildDocumentTitle(copy.title), copy.description);
  }, [copy.title, copy.description]);

  const accentLabel =
    guideId === "messenger" ? "Security guide" : guideId === "email" ? "Security guide" : "Security guide";

  return (
    <div className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-20 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-teal-500/10 blur-[90px]" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div {...SECURITY_GUIDE_REVEAL} className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{accentLabel}</p>
          <h1 className="page-title text-gray-900 dark:text-white">{copy.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-600 dark:text-gray-400 sm:text-xl">{copy.description}</p>
        </motion.div>

        <motion.div {...SECURITY_GUIDE_REVEAL} transition={{ ...SECURITY_GUIDE_REVEAL.transition, delay: 0.1 }} className="mt-10">
          <StubSecurityGuideHero guideId={guideId} />
        </motion.div>

        <motion.aside
          {...SECURITY_GUIDE_REVEAL}
          transition={{ ...SECURITY_GUIDE_REVEAL.transition, delay: 0.14 }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-primary/15 bg-primary/[0.04] px-6 py-5 dark:border-primary/20 dark:bg-primary/[0.07] sm:px-8 sm:py-6"
        >
          <div className="flex items-start gap-3">
            <Quote className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <p className="text-base italic leading-relaxed text-gray-700 dark:text-gray-300">{copy.authorNote}</p>
          </div>
        </motion.aside>
      </section>

      <article className="mx-auto mt-20 max-w-3xl space-y-20 px-4 sm:px-6 lg:px-8">
        {copy.sections.map((section, index) => {
          if (section.plain) {
            return (
              <motion.section
                key={section.title}
                {...SECURITY_GUIDE_REVEAL}
                transition={{ ...SECURITY_GUIDE_REVEAL.transition, delay: index * 0.03 }}
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary to-blue-600 px-6 py-10 text-white sm:px-10 sm:py-12"
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <h2 className="text-2xl font-bold sm:text-3xl">{section.title}</h2>
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-white/90">
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                    {section.content ? <p>{section.content}</p> : null}
                  </div>
                  {section.link ? (
                    <Link
                      href={section.link.startsWith("http") ? section.link : localizedPath(section.link, language)}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary transition hover:bg-white/90"
                    >
                      {section.linkText ?? "Learn more"}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              </motion.section>
            );
          }

          return (
            <motion.section
              key={section.title}
              {...SECURITY_GUIDE_REVEAL}
              transition={{ ...SECURITY_GUIDE_REVEAL.transition, delay: index * 0.03 }}
              className="space-y-5"
            >
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">{section.title}</h2>
              <ProseBlock section={section} />

              {section.bullets && section.bullets.length > 0 ? (
                <ul className="space-y-3 pt-2">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.callout ? (
                <div
                  className={`flex items-start gap-3 rounded-2xl border p-5 ${
                    section.callout.tone === "warning"
                      ? "border-amber-300/50 bg-gradient-to-r from-amber-50 to-orange-50/50 dark:border-amber-800/40 dark:from-amber-950/30 dark:to-orange-950/20"
                      : "border-blue-200/70 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/25"
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 shrink-0 ${
                      section.callout.tone === "warning"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                  <p
                    className={`text-sm leading-relaxed sm:text-base ${
                      section.callout.tone === "warning"
                        ? "text-amber-950 dark:text-amber-100"
                        : "text-blue-950 dark:text-blue-100"
                    }`}
                  >
                    {section.callout.text}
                  </p>
                </div>
              ) : null}

              <ProviderCards section={section} />

              {section.link && !section.plain ? (
                section.link.startsWith("http") ? (
                  <a
                    href={section.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    {section.linkText ?? "Learn more"}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={localizedPath(section.link, language)}
                    className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
                  >
                    {section.linkText ?? "Learn more"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              ) : null}
            </motion.section>
          );
        })}
      </article>

      <section className="mx-auto mt-20 max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Explore other guides</p>
        <div className="flex flex-wrap justify-center gap-2">
          {OTHER_GUIDES.filter((g) => g.id !== guideId).map((g) => (
            <Link
              key={g.id}
              href={
                isLocalizedSecurityGuideTopic(g.id)
                  ? localizedPath(`/security-guides/${g.id}`, language)
                  : joinPublicPath("security-guides", g.id)
              }
              className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-primary/40 hover:text-primary dark:border-gray-700 dark:text-gray-300"
            >
              {g.title}
            </Link>
          ))}
          <Link
            href={localizedPath("/security-resources", language)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            All resources
          </Link>
        </div>
        <p className="mx-auto mt-10 max-w-xl text-xs text-gray-500 dark:text-gray-400">
          Educational guide only. We may earn a commission from affiliate links when you use recommended services,
          which helps support this free privacy resource.
        </p>
      </section>
    </div>
  );
}
