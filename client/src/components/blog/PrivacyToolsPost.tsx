import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { SecurityEducation } from '@/components/features/SecurityEducation';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';

export const PrivacyToolsPost: React.FC = () => {
  const { language, t } = useLanguage();
  const homePath = localizedPath('/', language);
  const blogPath = localizedPath('/blog', language);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <Link
        href={blogPath}
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> {t.blogBackToBlog}
      </Link>
      <article>
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-4">{t.blogPrivacyTitle}</h1>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            <p>{t.blogPrivacyBody1}</p>
            <p>{t.blogPrivacyBody2}</p>
            <p>{t.blogPrivacyBody3}</p>
          </div>
        </header>

        <section className="mb-10">
          <SecurityEducation />
        </section>


        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6">{t.blogSecurityRecommendations}</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">{t.recommendQuickTitle}</h3>
            <ul className="space-y-1 pl-7 list-disc text-sm text-gray-700 dark:text-gray-300">
              <li>{t.recommendQuick1}</li>
              <li>{t.recommendQuick2}</li>
              <li>{t.recommendQuick3}</li>
              <li>{t.recommendQuick4}</li>
              <li>{t.recommendQuick5}</li>
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <ExternalLink className="h-5 w-5 mr-2 text-primary" />
            {t.blogAdditionalResources}
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.eff.org/issues/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                Electronic Frontier Foundation - Privacy Resources
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </li>
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Link
            href={homePath}
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            {t.blogBackToHome}
          </Link>
          <Link
            href={`${blogPath}/myth-good-enough-security`}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {t.blogNextArticle}: {t.blogGoodEnoughTitle}
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t.blogAffiliateDisclosure}
        </div>
      </article>
    </div>
  );
};
