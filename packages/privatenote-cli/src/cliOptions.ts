import { parseArgs } from "node:util";
import { isExpiresIn, type ExpiresIn } from "./createNote.ts";
import { resolveEndpoints, type ResolvedEndpoints } from "./endpoints.ts";

export const DEFAULT_API_BASE_URL = "https://privatenote.ai";

export type CliEnv = {
  PRIVATENOTE_API_BASE_URL?: string;
  PRIVATENOTE_WEB_ORIGIN?: string;
  PRIVATENOTE_ALLOWED_HOSTS?: string;
};

export type ParsedCliOptions =
  | { kind: "help" }
  | {
      kind: "run";
      expiresIn: ExpiresIn;
      jsonOutput: boolean;
      outputUrlOnly: boolean;
      forceStdout: boolean;
      burnAfterReading: boolean;
      title?: string;
      fileArg?: string;
      endpoints: ResolvedEndpoints;
      allowInsecure: boolean;
      allowOriginMismatch: boolean;
    };

export function parseCliArgv(argv: string[], env: CliEnv = {}): ParsedCliOptions {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      expire: { type: "string", default: "24h" },
      burn: { type: "boolean", default: true },
      "no-burn": { type: "boolean", default: false },
      title: { type: "string" },
      json: { type: "boolean", default: false },
      "output-url-only": { type: "boolean", default: false },
      "force-stdout": { type: "boolean", default: false },
      "api-base-url": { type: "string" },
      "web-origin": { type: "string" },
      insecure: { type: "boolean", default: false },
      "allow-origin-mismatch": { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });

  if (values.help) {
    return { kind: "help" };
  }

  const expiresIn = values.expire ?? "24h";
  if (!isExpiresIn(expiresIn)) {
    throw new Error(`Invalid --expire value "${expiresIn}". Use 15m, 1h, 24h, or 7d.`);
  }

  const jsonOutput = values.json === true;
  const outputUrlOnly = values["output-url-only"] === true;
  const forceStdout = values["force-stdout"] === true;
  if (outputUrlOnly && jsonOutput) {
    throw new Error("--output-url-only cannot be used with --json");
  }

  const allowInsecure = values.insecure === true;
  const allowOriginMismatch = values["allow-origin-mismatch"] === true;

  const endpoints = resolveEndpoints({
    defaultApiBaseUrl: DEFAULT_API_BASE_URL,
    apiBaseUrlRaw: values["api-base-url"] ?? env.PRIVATENOTE_API_BASE_URL,
    webOriginRaw: values["web-origin"] ?? env.PRIVATENOTE_WEB_ORIGIN,
    allowInsecure,
    allowOriginMismatch,
    allowedHostsRaw: env.PRIVATENOTE_ALLOWED_HOSTS,
  });

  const burnAfterReading = values["no-burn"] ? false : values.burn !== false;

  return {
    kind: "run",
    expiresIn,
    jsonOutput,
    outputUrlOnly,
    forceStdout,
    burnAfterReading,
    title: values.title,
    fileArg: positionals[0],
    endpoints,
    allowInsecure,
    allowOriginMismatch,
  };
}
