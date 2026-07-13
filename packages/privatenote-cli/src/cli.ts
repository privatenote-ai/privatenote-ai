import { readFile } from "node:fs/promises";
import { parseCliArgv } from "./cliOptions.ts";
import { createPrivateNote } from "./createNote.ts";
import { assertStdoutWriteAllowed, stdoutBypassWarnings } from "./stdoutPolicy.ts";

function printHelp(): void {
  console.log(`privatenote — create encrypted one-time note links from the terminal

Usage:
  privatenote [options] [file]
  cat secret.txt | privatenote --expire 1h

Options:
  --expire <duration>   15m, 1h, 24h, or 7d (default: 24h)
  --burn                Destroy after first view (default)
  --no-burn             Allow a second view (requires Premium on server)
  --title <text>        Optional title prepended to the note body
  --json                Print JSON instead of the URL alone
  --output-url-only     Write only the share URL (default; bypasses non-TTY stdout guard)
  --force-stdout        Allow writing output when stdout is not a terminal (CI / pipes)
  --api-base-url <url>  API origin (env: PRIVATENOTE_API_BASE_URL)
  --web-origin <url>    Share-link origin (defaults to API origin; env: PRIVATENOTE_WEB_ORIGIN)
  --insecure            Allow http:// API origins (local dev only)
  --allow-origin-mismatch
                        Allow share links on a different host than the API (dangerous)
  -h, --help            Show this help

HTTPS is required for remote APIs. The share-link origin must match the API host unless
you explicitly pass --allow-origin-mismatch.

When stdout is not a terminal (piped or captured by CI), pass --force-stdout or
--output-url-only before printing a link. Use --force-stdout with --json in scripts.

Encryption runs locally. Only ciphertext is uploaded; the decryption key is in the URL fragment.
`);
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function resolveContent(fileArg: string | undefined): Promise<string> {
  if (fileArg) {
    return readFile(fileArg, "utf8");
  }

  if (!process.stdin.isTTY) {
    return readStdin();
  }

  throw new Error("No input provided. Pass a file path or pipe content on stdin.");
}

async function main(): Promise<void> {
  const parsed = parseCliArgv(process.argv.slice(2), process.env);

  if (parsed.kind === "help") {
    printHelp();
    return;
  }

  if (parsed.allowInsecure) {
    console.error("privatenote: warning — HTTP API origins are allowed (--insecure). Use only for local development.");
  }
  if (parsed.allowOriginMismatch) {
    console.error(
      "privatenote: warning — share-link origin may differ from API host (--allow-origin-mismatch). Recipients must trust that host.",
    );
  }

  assertStdoutWriteAllowed({
    isStdoutTty: process.stdout.isTTY === true,
    json: parsed.jsonOutput,
    forceStdout: parsed.forceStdout,
    outputUrlOnly: parsed.outputUrlOnly,
  });

  for (const warning of stdoutBypassWarnings({
    isStdoutTty: process.stdout.isTTY === true,
    json: parsed.jsonOutput,
    forceStdout: parsed.forceStdout,
    outputUrlOnly: parsed.outputUrlOnly,
  })) {
    console.error(warning);
  }

  const content = await resolveContent(parsed.fileArg);

  const result = await createPrivateNote({
    content,
    expiresIn: parsed.expiresIn,
    burnAfterReading: parsed.burnAfterReading,
    title: parsed.title,
    apiBaseUrl: parsed.endpoints.apiBaseUrl,
    webOrigin: parsed.endpoints.webOrigin,
  });

  if (parsed.jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(result.secureUrl);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`privatenote: ${message}`);
  process.exit(1);
});
