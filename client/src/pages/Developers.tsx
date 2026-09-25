import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  CheckCircle2,
  Chrome,
  Code2,
  Globe2,
  LayoutGrid,
  Shield,
  Table2,
} from "lucide-react";
import { DeveloperHubFooter } from "@/components/developers/DeveloperHubFooter";
import { DeveloperBottomCta } from "@/components/developers/DeveloperBottomCta";
import { DeveloperComparisonMatrix } from "@/components/developers/DeveloperComparisonMatrix";
import { DeveloperEncryptionFlow } from "@/components/developers/DeveloperEncryptionFlow";
import { DeveloperHubCard } from "@/components/developers/DeveloperHubCard";
import { DeveloperRecipes } from "@/components/developers/DeveloperRecipes";
import { DeveloperSelfHostedCallout } from "@/components/developers/DeveloperSelfHostedCallout";
import { DocMobileNav } from "@/components/developers/DocMobileNav";
import { getDeveloperIntegration } from "@/pages/developers/integrationContent";
import { MarketingDocShell } from "@/components/layout/MarketingDocShell";
import { useLanguage } from "@/context/LanguageContext";
import { CHROME_EXTENSION_STORE_URL } from "@/utils/chromeExtensionOnboarding";
import { localizedPath } from "@/utils/localizedPath";
import { trackNamedEvent } from "@/utils/productAnalytics";

const HUB_TOOL_ORDER = ["web", "cli", "vscode", "chrome", "mcp", "codex"] as const;
type HubToolId = (typeof HUB_TOOL_ORDER)[number];

const HUB_CARD_KEYS: Record<Exclude<HubToolId, "web">, { titleKey: string; jtbdKey: string }> = {
  cli: { titleKey: "devCardCliTitle", jtbdKey: "devCardCliJtbd" },
  vscode: { titleKey: "devCardVscodeTitle", jtbdKey: "devCardVscodeJtbd" },
  mcp: { titleKey: "devCardMcpTitle", jtbdKey: "devCardMcpJtbd" },
  codex: { titleKey: "devCardCodexTitle", jtbdKey: "devCardCodexJtbd" },
  chrome: { titleKey: "devCardChromeTitle", jtbdKey: "devCardChromeJtbd" },
};

export default function Developers() {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  useEffect(() => {
    trackNamedEvent("developer_page_viewed");
  }, []);
  const [hubView, setHubView] = useState<"cards" | "compare">("cards");

  const hubNavEntries = [
    { href: "#which-tool", label: t.devHubWhichToolTitle, id: "which-tool" },
    { href: "#recipes", label: t.devRecipesTitle, id: "recipes" },
    { href: "#encryption-flow", label: t.devArchFlowLabel, id: "encryption-flow" },
    { href: "#trust", label: t.devQuickLinkTrust, id: "trust" },
  ];

  const installLinkClass =
    "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300";

  const installChipClass =
    "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300";

  const installLinks = (
    <div className="flex flex-col gap-2">
      <a
        href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
        target="_blank"
        rel="noopener noreferrer"
        className={installLinkClass}
      >
        <Code2 className="h-3.5 w-3.5 shrink-0" />
        VS Marketplace
      </a>
      <a
        href={CHROME_EXTENSION_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={installLinkClass}
      >
        <Chrome className="h-3.5 w-3.5 shrink-0" />
        {t.devQuickLinkChrome}
      </a>
      <Link href={lp("/developers/cli")} className={installLinkClass}>
        <Shield className="h-3.5 w-3.5 shrink-0" />
        {t.devCardCliTitle}
      </Link>
      <a
        href="https://www.npmjs.com/package/privatenote-cli"
        target="_blank"
        rel="noopener noreferrer"
        className={installLinkClass}
      >
        npm: privatenote-cli
      </a>
      <a
        href="https://www.npmjs.com/package/privatenote-mcp"
        target="_blank"
        rel="noopener noreferrer"
        className={installLinkClass}
      >
        npm: privatenote-mcp
      </a>
    </div>
  );

  const mobileInstallLinks = (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {t.devInstallNow}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <a
          href="https://marketplace.visualstudio.com/items?itemName=PrivateNote.privatenote-vscode"
          target="_blank"
          rel="noopener noreferrer"
          className={installChipClass}
        >
          <Code2 className="h-3 w-3 shrink-0" />
          VS Code
        </a>
        <a href={CHROME_EXTENSION_STORE_URL} target="_blank" rel="noopener noreferrer" className={installChipClass}>
          <Chrome className="h-3 w-3 shrink-0" />
          Chrome
        </a>
        <Link href={lp("/developers/cli")} className={installChipClass}>
          CLI
        </Link>
        <a
          href="https://www.npmjs.com/package/privatenote-cli"
          target="_blank"
          rel="noopener noreferrer"
          className={installChipClass}
        >
          privatenote-cli
        </a>
        <a
          href="https://www.npmjs.com/package/privatenote-mcp"
          target="_blank"
          rel="noopener noreferrer"
          className={installChipClass}
        >
          privatenote-mcp
        </a>
      </div>
    </div>
  );

  const desktopSidebar = (
    <>
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {t.devHubIntegrationsNav}
      </p>
      <nav className="flex flex-col gap-1.5">
        {hubNavEntries.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-primary/8 hover:text-primary dark:text-gray-400 dark:hover:bg-primary/10 dark:hover:text-primary"
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-800">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {t.devInstallNow}
        </p>
        {installLinks}
      </div>
    </>
  );

  const mobileNav = (
    <DocMobileNav title={t.devOnThisPage} entries={hubNavEntries}>
      {mobileInstallLinks}
    </DocMobileNav>
  );

  const trustModel = [t.devTrust1, t.devTrust2, t.devTrust3, t.devTrust4];

  return (
    <MarketingDocShell sidebar={desktopSidebar}>
      <section className="mb-16 lg:mb-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Code2 className="h-3.5 w-3.5" />
          {t.devBadge}
        </div>
        <h1 className="page-title mb-8 max-w-none pb-2 leading-[1.05]">{t.devHeroTitle}</h1>
        <p className="max-w-3xl text-lg leading-loose text-gray-600 dark:text-gray-400 md:text-xl md:leading-loose lg:max-w-4xl">
          {t.devHeroSubtitle}
        </p>
      </section>

      {mobileNav}

      <section id="which-tool" className="scroll-mt-28 mb-20 lg:mb-28">
        <h2 className="text-3xl font-bold text-gray-950 dark:text-white">{t.devHubWhichToolTitle}</h2>
        <p className="mt-4 max-w-3xl text-base leading-loose text-gray-600 dark:text-gray-400 md:text-lg">
          {t.devHubWhichToolIntro}
        </p>

        <div
          className="mt-8 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900/60"
          role="tablist"
          aria-label={t.devHubWhichToolTitle}
        >
          <button
            type="button"
            role="tab"
            aria-selected={hubView === "cards"}
            onClick={() => setHubView("cards")}
            className={
              `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ` +
              (hubView === "cards"
                ? "bg-white text-primary shadow-sm dark:bg-gray-950"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200")
            }
          >
            <LayoutGrid className="h-4 w-4" />
            {t.devHubViewCards}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={hubView === "compare"}
            onClick={() => setHubView("compare")}
            className={
              `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors ` +
              (hubView === "compare"
                ? "bg-white text-primary shadow-sm dark:bg-gray-950"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200")
            }
          >
            <Table2 className="h-4 w-4" />
            {t.devHubViewCompare}
          </button>
        </div>

        {hubView === "cards" ? (
        <div className="mt-10 flex flex-col gap-6 xl:gap-8">
          {HUB_TOOL_ORDER.map((toolId) => {
            if (toolId === "web") {
              return (
                <DeveloperHubCard
                  key={toolId}
                  icon={Globe2}
                  title={t.devPathWebTitle}
                  jtbd={t.devPathWebText}
                  status="stable"
                  statusLabel={t.devStatusStable}
                  preview={t.devPathWebPreview}
                  docsHref={lp("/how-it-works")}
                  ctaLabel={t.devTrustHowItWorksLink}
                  screenshot={{
                    src: "/images/developers/web-app-editor.png",
                    alt: t.devWebScreenshotAlt,
                    caption: t.devWebScreenshotCaption,
                    wide: true,
                  }}
                />
              );
            }

            const content = getDeveloperIntegration(toolId);
            if (!content) return null;
            const keys = HUB_CARD_KEYS[toolId];
            const title = t[keys.titleKey as keyof typeof t] as string;
            const jtbd = t[keys.jtbdKey as keyof typeof t] as string;
            const statusLabel = content.status === "beta" ? t.devStatusBeta : t.devStatusStable;
            const terminalPreview =
              toolId === "cli"
                ? {
                    lines: [
                      {
                        variant: "prompt" as const,
                        text: `$ echo 'sk-live-...' | npx privatenote-cli --expire 1h --output-url-only`,
                      },
                      {
                        variant: "output" as const,
                        text: "https://privatenote.ai/note/a1b2c3d4#…",
                      },
                    ],
                    caption: t.devCliTerminalCaption,
                  }
                : toolId === "mcp"
                  ? {
                      title: "MCP",
                      lines: [
                        { variant: "comment" as const, text: "// create_private_note" },
                        {
                          variant: "json" as const,
                          text: '{ "content": "recovery-code-…", "expiresIn": "1h", "burnAfterReading": true }',
                        },
                        {
                          variant: "output" as const,
                          text: "https://privatenote.ai/note/a1b2c3d4#…",
                        },
                      ],
                      caption: t.devMcpTerminalCaption,
                    }
                  : undefined;
            const hubScreenshot = content.screenshot
              ? {
                  src: content.screenshot.src,
                  alt: content.screenshot.alt,
                  caption: content.screenshot.caption,
                }
              : undefined;
            return (
              <DeveloperHubCard
                key={toolId}
                icon={content.icon}
                title={title}
                jtbd={jtbd}
                status={content.status}
                statusLabel={statusLabel}
                preview={content.hubPreview}
                docsHref={lp(`/developers/${toolId}`)}
                ctaLabel={t.devViewDocs}
                terminalPreview={terminalPreview}
                screenshot={hubScreenshot}
              />
            );
          })}
        </div>
        ) : (
          <div className="mt-10" role="tabpanel">
            <DeveloperComparisonMatrix />
          </div>
        )}
      </section>

      <DeveloperRecipes />

      <DeveloperSelfHostedCallout />

      <section className="mb-20 border-y border-gray-200 py-16 dark:border-gray-800 lg:mb-24 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">{t.devFitsLabel}</p>
            <h2 className="text-3xl font-bold leading-snug text-gray-950 dark:text-white lg:text-[2rem]">
              {t.devFitsTitle}
            </h2>
          </div>
          <div className="space-y-7 text-base leading-loose text-gray-700 dark:text-gray-300 md:text-[1.0625rem]">
            <p>{t.devFitsP1}</p>
            <p>{t.devFitsP2}</p>
          </div>
        </div>
      </section>

      <section id="trust" className="scroll-mt-28 mb-20 lg:mb-24">
        <div className="max-w-5xl">
          <p className="mb-3 text-sm font-semibold text-primary">{t.devTrustLabel}</p>
          <h2 className="text-3xl font-bold leading-snug text-gray-950 dark:text-white lg:text-[2rem]">
            {t.devTrustTitle}
          </h2>

          <DeveloperEncryptionFlow id="encryption-flow" />

          <ul className="mt-8 space-y-6 sm:space-y-7">
            {trustModel.map((item) => (
              <li key={item} className="flex gap-4">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <p className="text-base leading-loose text-gray-700 dark:text-gray-300 md:text-[1.0625rem]">{item}</p>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-base leading-loose text-gray-700 dark:text-gray-300 md:text-[1.0625rem]">
            {t.devTrustClosing}
          </p>
          <Link
            href={lp("/how-it-works")}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {t.devTrustHowItWorksLink}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <DeveloperBottomCta variant="hub" />

      <DeveloperHubFooter />
    </MarketingDocShell>
  );
}
