import React from 'react';
import { Link } from 'wouter';
import { ExternalLink } from "lucide-react";
import { SecurityEducation } from '@/components/features/SecurityEducation';
import { useLanguage } from '@/context/LanguageContext';
import { localizedPath } from '@/utils/localizedPath';
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from '@/components/blog/BlogPostChrome';
import { BlogPostCrossLinks } from '@/components/blog/BlogPostCrossLinks';

export const PrivacyToolsPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath('/', language);

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />
      <article>
        <BlogPostHeader slug="privacy-tools" title={t.blogPrivacyTitle} headerClassName="mb-10">
          <div className="mt-4 space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            <p>{t.blogPrivacyBody1}</p>
            <p>{t.blogPrivacyBody2}</p>
            <p>{t.blogPrivacyBody3}</p>
          </div>
        </BlogPostHeader>

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
        </div>

        <BlogPostCrossLinks slug="privacy-tools" className="mt-10 border-t-0 pt-0" />

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t.blogAffiliateDisclosure}
        </div>
      </article>
    </div>
  );
};
