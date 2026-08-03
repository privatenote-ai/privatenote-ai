import React from "react";
import { Link } from "wouter";
import { ArrowRight, Bot, Chrome, Code2, Cpu, Globe, Terminal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { LucideIcon } from "lucide-react";

type RecipeConfig = {
  titleKey: string;
  bodyKey: string;
  snippetKey: string;
  toolKey: string;
  href: string;
  icon: LucideIcon;
};

const RECIPES: RecipeConfig[] = [
  {
    titleKey: "devRecipe1Title",
    bodyKey: "devRecipe1Body",
    snippetKey: "devRecipe1Snippet",
    toolKey: "devRecipe1Tool",
    href: "/developers/cli",
    icon: Terminal,
  },
  {
    titleKey: "devRecipe2Title",
    bodyKey: "devRecipe2Body",
    snippetKey: "devRecipe2Snippet",
    toolKey: "devRecipe2Tool",
    href: "/developers/chrome",
    icon: Chrome,
  },
  {
    titleKey: "devRecipe3Title",
    bodyKey: "devRecipe3Body",
    snippetKey: "devRecipe3Snippet",
    toolKey: "devRecipe3Tool",
    href: "/developers/mcp",
    icon: Cpu,
  },
  {
    titleKey: "devRecipe4Title",
    bodyKey: "devRecipe4Body",
    snippetKey: "devRecipe4Snippet",
    toolKey: "devRecipe4Tool",
    href: "/developers/vscode",
    icon: Code2,
  },
  {
    titleKey: "devRecipe5Title",
    bodyKey: "devRecipe5Body",
    snippetKey: "devRecipe5Snippet",
    toolKey: "devRecipe5Tool",
    href: "/developers/codex",
    icon: Bot,
  },
  {
    titleKey: "devRecipe6Title",
    bodyKey: "devRecipe6Body",
    snippetKey: "devRecipe6Snippet",
    toolKey: "devRecipe6Tool",
    href: "/how-it-works",
    icon: Globe,
  },
];

export function DeveloperRecipes() {
  const { language, t } = useLanguage();
  const lp = (path: string) => localizedPath(path, language);

  return (
    <section id="recipes" className="scroll-mt-28 mb-20 lg:mb-24">
      <p className="mb-3 text-sm font-semibold text-primary">{t.devRecipesLabel}</p>
      <h2 className="text-3xl font-bold text-gray-950 dark:text-white">{t.devRecipesTitle}</h2>
      <p className="mt-4 max-w-3xl text-base leading-loose text-gray-600 dark:text-gray-400 md:text-lg">
        {t.devRecipesIntro}
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {RECIPES.map((recipe) => {
          const Icon = recipe.icon;
          return (
            <article
              key={recipe.titleKey}
              className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm dark:border-gray-800 dark:bg-white/5 sm:p-7"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {t[recipe.toolKey]}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-950 dark:text-white">{t[recipe.titleKey]}</h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {t[recipe.bodyKey]}
              </p>
              <div className="mb-5 overflow-x-auto rounded-lg bg-gray-950 px-3 py-2.5 font-mono text-xs leading-relaxed text-green-400">
                {t[recipe.snippetKey]}
              </div>
              <Link
                href={lp(recipe.href)}
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline"
              >
                {t.devViewDocs}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
