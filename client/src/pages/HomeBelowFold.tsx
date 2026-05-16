import React from "react";
import { Link } from "wouter";
import { Check, ArrowRight, Shield } from "lucide-react";
import { FAQSection } from "@/components/features/FAQSection";
import { HomeBlogCarousel } from "@/components/home/HomeBlogCarousel";
import type { Translations } from "@/utils/translation";

type BlogPostCard = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
};

type HomeBelowFoldProps = {
  t: Translations;
  blogPath: string;
  blogPosts: BlogPostCard[];
};

/** Below-the-fold homepage sections — lazy-loaded to shrink the initial JS bundle. */
export default function HomeBelowFold({ t, blogPath, blogPosts }: HomeBelowFoldProps) {
  return (
    <>
      <section className="relative isolate overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[520px] w-[min(900px,130vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-[0.10]" />
        </div>

        <div className="relative z-10 mx-auto min-w-0 max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
            <div className="inline-flex items-center rounded-full border border-gray-200/70 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm dark:border-gray-700/70 dark:bg-gray-900/60 dark:text-gray-300">
              {t.whyPrivateNote}
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {t.shareSensitiveHeading}
            </h2>

            <p className="mt-3 max-w-xl text-base text-gray-600 dark:text-gray-300">{t.shareSensitiveBody}</p>

            <ul className="mt-7 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {[t.clientSideEncryption, t.readOnceExposure, t.noTrackingAds].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                    <Check className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
        </div>
      </section>

      <section
        className="relative isolate overflow-x-clip border-y border-gray-200/70 bg-gray-50/80 dark:border-gray-800/80 dark:bg-gray-950/55"
        aria-labelledby="latest-blog-heading"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#00000014_1px,transparent_1px),linear-gradient(to_bottom,#00000014_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-[0.12]" />

        <div className="relative mx-auto min-w-0 max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {t.homeBlogEyebrow}
              </p>
              <h3 id="latest-blog-heading" className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white sm:text-[1.625rem]">
                {t.blog}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px] sm:leading-7">
                {t.blogSubtitle}
              </p>
              <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-300">{t.homeBlogCarouselHint}</p>
            </div>

            <Link
              href={blogPath}
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-950 transition-colors hover:text-primary dark:text-gray-100 dark:hover:text-primary"
            >
              {t.homeBlogViewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <HomeBlogCarousel t={t} blogPath={blogPath} blogPosts={blogPosts} />
        </div>
      </section>

      <section
        className="relative isolate overflow-x-clip border-t border-gray-200/70 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 py-16 dark:border-gray-800/70 dark:from-gray-950/90 dark:via-gray-950 dark:to-gray-950/85 sm:py-20 lg:py-24"
        aria-labelledby="privacy-flow-heading"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] [background-size:52px_52px] dark:opacity-[0.08]" />

        <div className="relative mx-auto min-w-0 max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h3
                id="privacy-flow-heading"
                className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl"
              >
                {t.simplePrivacyFlow}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">{t.clearSteps}</p>
            </div>
            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary ring-1 ring-primary/15 sm:py-1.5">
              <Shield className="h-4 w-4" />
              {t.privacyFirst}
            </div>
          </div>

          <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3 md:gap-6">
            {[
              { title: t.write, detail: t.writeStepDetail },
              { title: t.encrypt, detail: t.encryptStepDetail },
              { title: t.share, detail: t.shareStepDetail },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200/60 bg-white/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900/80 sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/15">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">{step.title}</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px]">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 grid max-w-3xl gap-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-4">
            {[t.noTrackingCookies, t.noThirdPartyAnalytics, t.keysStayInLink, t.minimalMetadata].map((detail) => (
              <div key={detail} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
