import React from "react";
import { Link } from "wouter";
import { Check, ArrowRight, Shield } from "lucide-react";
import { SecurityFeatures } from "@/components/features/SecurityFeatures";
import { FAQSection } from "@/components/features/FAQSection";
import { HomeBlogCarousel } from "@/components/home/HomeBlogCarousel";
import { useMountWhenInView } from "@/hooks/useMountWhenInView";
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
  const [faqRef, faqReady] = useMountWhenInView({ rootMargin: "320px" });

  return (
    <>
      <SecurityFeatures />

      <section className="relative isolate overflow-x-clip">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[520px] w-[min(900px,130vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] [background-size:56px_56px] dark:opacity-[0.10]" />
        </div>

        <div className="relative z-10 mx-auto min-w-0 max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="grid min-w-0 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div>
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
                    <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative z-0 mx-auto mt-10 min-w-0 max-w-4xl px-4 pb-20 pt-8 sm:mt-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t.simplePrivacyFlow}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t.clearSteps}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary ring-1 ring-primary/15">
              <Shield className="h-4 w-4" />
              {t.privacyFirst}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { title: t.write, detail: t.writeStepDetail },
              { title: t.encrypt, detail: t.encryptStepDetail },
              { title: t.share, detail: t.shareStepDetail },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gray-200/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/15">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</p>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{step.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-2">
            {[t.noTrackingCookies, t.noThirdPartyAnalytics, t.keysStayInLink, t.minimalMetadata].map(
              (detail) => (
                <div key={detail} className="flex items-start gap-2">
                  <span className="mt-0.5 text-primary">
                    <Check className="h-4 w-4" />
                  </span>
                  <span>{detail}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="relative isolate overflow-hidden border-y border-gray-200/70 bg-gray-50/80 px-4 py-14 dark:border-gray-800/80 dark:bg-gray-950/55 sm:px-6 lg:px-8"
        aria-labelledby="latest-blog-heading"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#00000014_1px,transparent_1px),linear-gradient(to_bottom,#00000014_1px,transparent_1px)] [background-size:48px_48px] dark:opacity-[0.12]" />

        <div className="mx-auto max-w-6xl min-w-0">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {t.homeBlogEyebrow}
              </p>
              <h3 id="latest-blog-heading" className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-white">
                {t.blogSubtitle}
              </h3>
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

      <div ref={faqRef}>
        {faqReady ? (
          <FAQSection />
        ) : (
          <div className="mt-20 min-h-[520px] border-t border-gray-200/70 dark:border-gray-800/70" aria-hidden />
        )}
      </div>
    </>
  );
}
