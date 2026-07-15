/** Developer integration docs mirrored only in English (sub-pages under /developers). */
export const ENGLISH_ONLY_DEVELOPER_INTEGRATIONS = ["cli", "vscode", "mcp", "codex", "chrome"] as const;

export type EnglishOnlyDeveloperIntegration = (typeof ENGLISH_ONLY_DEVELOPER_INTEGRATIONS)[number];

export function isEnglishOnlyDeveloperIntegration(id: string): id is EnglishOnlyDeveloperIntegration {
  return (ENGLISH_ONLY_DEVELOPER_INTEGRATIONS as readonly string[]).includes(id);
}

export const ENGLISH_ONLY_DEVELOPER_MARKETING_PATHS = ENGLISH_ONLY_DEVELOPER_INTEGRATIONS.map(
  (id) => `/developers/${id}` as const,
);
