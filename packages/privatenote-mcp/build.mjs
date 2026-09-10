#!/usr/bin/env node
/**
 * esbuild-based bundler for packages/privatenote-mcp.
 * Produces a single dist/index.js with the @shared alias resolved.
 * Invoked via `npm run build` or `node build.mjs`.
 */
import { build } from "../../node_modules/esbuild/lib/main.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "../..");

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "dist/index.js",
  banner: {
    js: "#!/usr/bin/env node",
  },
  alias: {
    "@shared": resolve(repoRoot, "shared"),
  },
  // Keep heavy deps as external so Node resolves them from node_modules at
  // runtime. This keeps the bundle ~5 KB instead of ~720 KB, which prevents
  // MCP startup timeouts in Cursor.
  external: ["@modelcontextprotocol/sdk", "zod", "libsodium-wrappers", "libsodium"],
  absWorkingDir: __dirname,
  logLevel: "info",
});
