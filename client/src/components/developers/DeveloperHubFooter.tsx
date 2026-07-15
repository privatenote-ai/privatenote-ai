import React from "react";
import { Database, GitBranch } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const GITHUB_RELEASES_URL = "https://github.com/privatenote-ai/privatenote/releases";
const NPM_CLI_VERSIONS_URL = "https://www.npmjs.com/package/privatenote-cli?activeTab=versions";
const NPM_MCP_VERSIONS_URL = "https://www.npmjs.com/package/privatenote-mcp?activeTab=versions";

export function DeveloperHubFooter() {
  const { t } = useLanguage();

  const releaseLinks = [
    { href: GITHUB_RELEASES_URL, label: t.devFooterGitHubReleases },
    { href: NPM_CLI_VERSIONS_URL, label: "privatenote-cli" },
    { href: NPM_MCP_VERSIONS_URL, label: "privatenote-mcp" },
  ];

  return (
    <footer className="mt-20 border-t border-gray-200 pt-8 dark:border-gray-800 lg:mt-24">
      <div className="flex items-center gap-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
        <GitBranch className="h-3.5 w-3.5 shrink-0" />
        <span>{t.devFooterNote}</span>
        <Database className="h-3.5 w-3.5 shrink-0" />
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {t.devFooterReleasesLabel}
        </p>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-sm">
          {releaseLinks.map((link, index) => (
            <React.Fragment key={link.href}>
              {index > 0 ? (
                <span className="text-gray-300 dark:text-gray-600" aria-hidden>
                  ·
                </span>
              ) : null}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-600 transition-colors hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              >
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}
