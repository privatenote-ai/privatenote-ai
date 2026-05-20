#!/usr/bin/env node
/**
 * esbuild bundler for the PrivateNote VS Code / Cursor extension.
 * Produces a single dist/extension.js with @shared resolved and the vscode
 * runtime module kept external.
 */
import { build } from "../../node_modules/esbuild/lib/main.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

await build({
  entryPoints: ["src/extension.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/extension.js",
  alias: {
    "@shared": resolve(repoRoot, "shared"),
  },
  // `vscode` is provided by the runtime, not installed in node_modules.
  external: ["vscode"],
  absWorkingDir: __dirname,
  logLevel: "info",
});
