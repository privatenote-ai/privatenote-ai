import React, { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SecurityEducation } from "@/components/features/SecurityEducation";
import { useLanguage } from "@/context/LanguageContext";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import { buildDocumentTitle, setDocumentMeta } from "@/utils/documentMeta";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";

const EXTERNAL_RESOURCES = [
  { href: "https://www.eff.org/issues/privacy", labelKey: "blogPrivacyResourceEff" as const },
  { href: "https://haveibeenpwned.com/", labelKey: "blogPrivacyResourceHibp" as const },
  { href: "https://2fa.directory/", labelKey: "blogPrivacyResource2fa" as const },
  { href: "https://signal.org/", labelKey: "blogPrivacyResourceSignal" as const },
  { href: "https://www.mozilla.org/en-US/privacy/", labelKey: "blogPrivacyResourceMozilla" as const },
  { href: "https://proton.me/", labelKey: "blogPrivacyResourceProton" as const },
] as const;

export const PrivacyToolsPost: React.FC = () => {
  const { t, language } = useLanguage();
  const homePath = localizedPath("/", language);
  const privacyToolsPath = localizedPath("/privacy-tools", language);
  const howItWorksPath = localizedPath("/how-it-works", language);
  const passwordGeneratorPath = localizedPath("/password-generator", language);
  const securityResourcesPath = localizedPath("/security-resources", language);
  const secureFileTransferPath = localizedPath("/secure-file-transfer", language);
  const emailSecretsPath = blogPostPath("why-email-is-worst-for-secrets", language);
  const secretNoAccountPath = blogPostPath("send-secret-message-without-account", language);

  useEffect(() => {
    setDocumentMeta(buildDocumentTitle(t.blogPrivacyTitle), t.blogPrivacyExcerpt, { ogType: "article" });
  }, [t.blogPrivacyExcerpt, t.blogPrivacyTitle]);

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />
      <article>
        <BlogPostHeader slug="privacy-tools" title={t.blogPrivacyTitle} excerpt={t.blogPrivacyExcerpt} headerClassName="mb-10">
          <div className="mt-4 space-y-4 max-w-3xl leading-relaxed text-gray-600 dark:text-gray-400">
            <p>{t.blogPrivacyBody1}</p>
            <p>{t.blogPrivacyBody2}</p>
          </div>
        </BlogPostHeader>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.blogPrivacyHabitsTitle}
          </h2>
          <SecurityEducation />
        </section>

        <section className="mb-12 space-y-4 border-t border-gray-200 pt-10 dark:border-gray-800">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.blogPrivacyOneTimeTitle}
          </h2>
          <p className="max-w-3xl leading-relaxed text-gray-700 dark:text-gray-300">{t.blogPrivacyOneTimeP1}</p>
          <p className="max-w-3xl leading-relaxed text-gray-700 dark:text-gray-300">{t.blogPrivacyOneTimeP2}</p>
          <p className="max-w-3xl leading-relaxed text-gray-700 dark:text-gray-300">{t.blogPrivacyOneTimeP3}</p>
          <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            <li>
              <Link href={howItWorksPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkHowItWorks}
              </Link>
            </li>
            <li>
              <Link href={passwordGeneratorPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkPasswordGenerator}
              </Link>
            </li>
            <li>
              <Link href={emailSecretsPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkEmailSecrets}
              </Link>
            </li>
            <li>
              <Link href={secretNoAccountPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkSecretNoAccount}
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12 border-t border-gray-200 pt-10 dark:border-gray-800">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t.blogPrivacyToolsMapTitle}
          </h2>
          <p className="mb-6 max-w-3xl leading-relaxed text-gray-600 dark:text-gray-400">
            {t.blogPrivacyToolsMapIntro}{" "}
            <Link href={privacyToolsPath} className="font-medium text-primary hover:underline">
              {t.blogPrivacyLinkPrivacyTools}
            </Link>
            .
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900/60">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {t.blogPrivacyToolsMapColJob}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {t.blogPrivacyToolsMapColTool}
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                    {t.blogPrivacyToolsMapColStart}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900/30">
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowPasswordsJob}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowPasswordsTool}</td>
                  <td className="px-4 py-3">
                    <Link href={passwordGeneratorPath} className="font-medium text-primary hover:underline">
                      {t.blogPrivacyToolsRowPasswordsStart}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowSecretsJob}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowSecretsTool}</td>
                  <td className="px-4 py-3">
                    <Link href={homePath} className="font-medium text-primary hover:underline">
                      {t.blogPrivacyToolsRowSecretsStart}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowFilesJob}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowFilesTool}</td>
                  <td className="px-4 py-3">
                    <Link href={secureFileTransferPath} className="font-medium text-primary hover:underline">
                      {t.blogPrivacyToolsRowFilesStart}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowDirectoryJob}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{t.blogPrivacyToolsRowDirectoryTool}</td>
                  <td className="px-4 py-3">
                    <Link href={privacyToolsPath} className="font-medium text-primary hover:underline">
                      {t.blogPrivacyToolsRowDirectoryStart}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/40">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{t.blogPrivacyFurtherReadingTitle}</h2>

          <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{t.blogPrivacyInternalLinksTitle}</h3>
          <ul className="mb-8 list-disc space-y-2 pl-5 text-gray-700 dark:text-gray-300">
            <li>
              <Link href={privacyToolsPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkPrivacyTools}
              </Link>
            </li>
            <li>
              <Link href={howItWorksPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkHowItWorks}
              </Link>
            </li>
            <li>
              <Link href={passwordGeneratorPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkPasswordGenerator}
              </Link>
            </li>
            <li>
              <Link href={securityResourcesPath} className="font-medium text-primary hover:underline">
                {t.blogPrivacyLinkSecurityResources}
              </Link>
            </li>
          </ul>

          <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
            <ExternalLink className="mr-2 h-5 w-5 text-primary" aria-hidden />
            {t.blogPrivacyExternalLinksTitle}
          </h3>
          <ul className="space-y-2">
            {EXTERNAL_RESOURCES.map(({ href, labelKey }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  {t[labelKey]}
                  <ExternalLink className="ml-1 h-4 w-4" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <Link
            href={homePath}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {t.blogBackToHome}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <BlogPostCrossLinks slug="privacy-tools" className="mt-10 border-t-0 pt-0" />
      </article>
    </div>
  );
};
