/**
 * Runtime configuration. One-shot is frozen at MCP process start so later
 * process.env mutation (or a tool argument) cannot enable trusted automation.
 */

function envFlagEnabled(raw: string | undefined): boolean {
  if (!raw) return false;
  const value = raw.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes" || value === "on";
}

export function getConfig() {
  const apiBaseUrl =
    process.env["PRIVATENOTE_API_BASE_URL"]?.replace(/\/$/, "") ??
    "https://privatenote.ai";

  const webOrigin =
    process.env["PRIVATENOTE_WEB_ORIGIN"]?.replace(/\/$/, "") ?? apiBaseUrl;

  return { apiBaseUrl, webOrigin };
}

export type FrozenMcpRuntimeConfig = {
  readonly oneShotCreate: boolean;
};

let frozenRuntime: FrozenMcpRuntimeConfig | undefined;

function readOneShotFlag(env: NodeJS.ProcessEnv): boolean {
  return envFlagEnabled(env["PRIVATENOTE_MCP_ALLOW_ONE_SHOT"]);
}

/**
 * Capture administrator-controlled flags once. Call from server startup.
 * Subsequent env changes have no effect.
 */
export function freezeMcpRuntimeConfig(
  env: NodeJS.ProcessEnv = process.env,
): FrozenMcpRuntimeConfig {
  if (frozenRuntime) return frozenRuntime;
  frozenRuntime = Object.freeze({
    oneShotCreate: readOneShotFlag(env),
  });
  return frozenRuntime;
}

export function getFrozenMcpRuntimeConfig(): FrozenMcpRuntimeConfig {
  return freezeMcpRuntimeConfig();
}

export function resetFrozenMcpRuntimeConfigForTests(): void {
  frozenRuntime = undefined;
}
