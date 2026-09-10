import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export type StoredMcpSession = {
  accessToken: string;
  apiBaseUrl: string;
  storedAt: string;
};

function configDir(): string {
  if (process.platform === "win32") {
    const appData = process.env["APPDATA"]?.trim();
    return join(appData && appData.length > 0 ? appData : homedir(), "privatenote");
  }
  const xdg = process.env["XDG_CONFIG_HOME"]?.trim();
  return join(xdg && xdg.length > 0 ? xdg : join(homedir(), ".config"), "privatenote");
}

export function mcpSessionFilePath(): string {
  const override = process.env["PRIVATENOTE_MCP_SESSION_PATH"]?.trim();
  if (override) return override;
  return join(configDir(), "mcp-session.json");
}

export async function readStoredSession(): Promise<StoredMcpSession | null> {
  const envToken = process.env["PRIVATENOTE_SESSION"]?.trim();
  if (envToken) {
    return {
      accessToken: envToken,
      apiBaseUrl: process.env["PRIVATENOTE_API_BASE_URL"]?.replace(/\/$/, "") ?? "https://privatenote.ai",
      storedAt: new Date().toISOString(),
    };
  }
  try {
    const raw = await readFile(mcpSessionFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<StoredMcpSession>;
    if (typeof parsed.accessToken !== "string" || parsed.accessToken.length < 8) {
      return null;
    }
    return {
      accessToken: parsed.accessToken,
      apiBaseUrl: typeof parsed.apiBaseUrl === "string" ? parsed.apiBaseUrl : "",
      storedAt: typeof parsed.storedAt === "string" ? parsed.storedAt : "",
    };
  } catch {
    return null;
  }
}

export async function writeStoredSession(session: StoredMcpSession): Promise<void> {
  const path = mcpSessionFilePath();
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await writeFile(path, JSON.stringify(session, null, 2), { encoding: "utf8", mode: 0o600 });
}

export async function clearStoredSession(): Promise<void> {
  try {
    await rm(mcpSessionFilePath(), { force: true });
  } catch {
    /* ignore */
  }
}

export function sessionAuthorizationHeader(accessToken: string): string {
  return `Bearer ${accessToken}`;
}
