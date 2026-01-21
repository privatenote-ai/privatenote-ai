import React from 'react';
import { Link } from 'wouter';
import { ExternalLink } from 'lucide-react';
import { SecurityEducation } from '@/components/features/SecurityEducation';
import { SecurityRecommendations } from '@/components/features/SecurityRecommendations';

export const PrivacyToolsPost: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <article>
        <header className="mb-10">
          <h1 className="text-3xl font-bold mb-4">Why Privacy Matters</h1>
          <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            <p>
              I approach privacy the way I approach cryptography: assume the system will be observed, measured, and
              eventually exploited unless you design for that reality. Privacy is not paranoia; it is good engineering
              and a basic human need for autonomy, experimentation, and dignity.
            </p>
            <p>
              When data trails are collected by default, they are inevitably reused beyond their original purpose.
              Profiles are built, permissions expand quietly, and decisions get made about you without your consent.
              The longer this is left unchecked, the harder it becomes to opt out.
            </p>
            <p>
              My goal with privateNote.ai is to make strong privacy feel ordinary. You should not need to be a security
              expert to send a secret safely. Small, consistent habits—short-lived notes, separate channels for passwords,
              and encrypted communication—compound into real safety over time.
            </p>
          </div>
        </header>

        <section className="mb-10">
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
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/blog/myth-good-enough-security"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Next article: The Myth of &quot;Good Enough&quot; Security
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          We may earn a commission from affiliate links. This helps support the service at no extra cost to you.
        </div>
      </article>
    </div>
  );
};
