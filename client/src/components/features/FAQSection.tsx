import React, { useEffect } from 'react';
import { applyCspNonceToScript } from '@/lib/cspNonce';
import { Link } from 'wouter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

const FAQ_ITEM_IDS = [
  'howItWorks',
  'seeContent',
  'afterOpen',
  'takePhoto',
  'video',
  'password',
  'shareLink',
  'protectAgainstAttack',
  'size',
  'pricing',
  'ai',
  'linkLength',
  'euStorage',
  'metadata',
  'sensitiveSecrets',
] as const;

export const FAQSection: React.FC = () => {
  const { t, language } = useLanguage();
  const faqItems = FAQ_ITEM_IDS.map((id) => ({
    id: `faq-${id}`,
    question: t[`homeFaq_${id}_question`],
    answer: t[`homeFaq_${id}_answer`],
  }));

  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    const scriptId = 'faq-schema-json-ld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      applyCspNonceToScript(script);
      document.head.appendChild(script);
    }

    script.text = JSON.stringify(jsonLd);
  }, [faqItems]);

  return (
    <section className="mt-20 border-t border-gray-200/70 dark:border-gray-800/70 bg-gray-50/60 dark:bg-gray-900/40 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent">
              {t.faq}
            </h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
              {t.homeFaqSubtitle}
            </p>
          </div>
        </div>

        <Accordion
          type="single"
          collapsible
          className="rounded-3xl border border-primary/20 dark:border-primary/15 bg-white/85 dark:bg-gray-950/80 backdrop-blur shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_10px_40px_rgba(15,23,42,0.09)] ring-1 ring-primary/10 dark:ring-primary/5"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className={`group border-b border-gray-200/70 dark:border-gray-800/70 overflow-hidden transition-colors duration-150 data-[state=open]:bg-primary/[0.035] dark:data-[state=open]:bg-primary/[0.07] ${index === faqItems.length - 1 ? 'border-b-0' : ''}`}
            >
              <AccordionTrigger className="items-start gap-3 text-left text-sm sm:text-base text-gray-900 dark:text-white px-6 py-5 hover:no-underline hover:bg-gray-50/70 dark:hover:bg-gray-900/50 data-[state=open]:text-primary transition-colors [&>svg]:mt-1.5 [&>svg]:shrink-0 [&>svg]:text-gray-400 data-[state=open]:[&>svg]:text-primary">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/15 text-xs font-semibold tabular-nums leading-none text-primary ring-1 ring-primary/25 shadow-[0_0_8px_rgba(var(--primary-rgb,99,102,241),0.15)]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 pt-1.5 leading-snug">{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 dark:text-gray-300 px-6 pb-6 pt-6 leading-relaxed">
                <div className="pl-12 border-l-2 border-primary/25 ml-4">
                  {item.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-4xl">
          {t.homeFaqStillUnsure}{' '}
          <Link
            href={localizedPath('/how-it-works', language)}
            className="font-medium text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-sm"
          >
            {t.howItWorks}
          </Link>
          {' '}
          — {t.homeFaqTryTestNote}
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href="https://launchnest.io/p/privatenote"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="PrivateNote on LaunchNest"
            className="inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            <img
              src="https://launchnest.io/badge/privatenote.svg?variant=featured&theme=light"
              alt="PrivateNote on LaunchNest"
              width={220}
              height={56}
              className="h-14 w-[220px] dark:hidden"
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://launchnest.io/badge/privatenote.svg?variant=featured&theme=dark"
              alt="PrivateNote on LaunchNest"
              width={220}
              height={56}
              className="hidden h-14 w-[220px] dark:block"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
        </div>
      </div>
    </section>
  );
};
