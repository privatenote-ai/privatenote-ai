#!/usr/bin/env node
/**
 * esbuild bundler for the PrivateNote CLI.
 */
import { build } from "../../node_modules/esbuild/lib/main.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

await build({
  entryPoints: ["src/cli.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/cli.js",
  banner: {
    js: "#!/usr/bin/env node",
  },
  alias: {
    "@shared": resolve(repoRoot, "shared"),
  },
  absWorkingDir: __dirname,
  logLevel: "info",
});
