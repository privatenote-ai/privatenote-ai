import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { AffiliateLinks } from '@/components/features/AffiliateLinks';
import { SecurityEducation } from '@/components/features/SecurityEducation';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';

export const PrivacyToolsPost: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <Link href="/blog" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Blog
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Privacy and Security Tools We Recommend</h1>
          <p className="text-gray-600 dark:text-gray-400">
            A practical list of tools that reduce tracking and protect sensitive information.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Essential Privacy Tools</h2>
          <AffiliateLinks />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-10">
          <h2 className="text-2xl font-bold mb-3">Why Privacy Matters</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your data is collected, analyzed, and resold across the web. Privacy is about keeping control of your
            information and making it harder to profile you.
          </p>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Privacy Education</h2>
          <SecurityEducation />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
          <h2 className="text-2xl font-bold mb-6">Security Recommendations</h2>
          <SecurityRecommendations />
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-10">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <ExternalLink className="h-5 w-5 mr-2 text-primary" />
            Additional Resources
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
            <li>
              <a
                href="https://privacytools.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center"
              >
                Privacy Tools - Encryption Against Global Mass Surveillance
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </li>
          </ul>
        </section>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          We may earn a commission from affiliate links. This helps support the service at no extra cost to you.
        </div>
      </article>
    </div>
  );
};
