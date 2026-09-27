import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineWorkersConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(root, "shared"),
    },
  },
  test: {
    pool: "@cloudflare/vitest-pool-workers",
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.vitest.toml" },
      },
    },
    include: ["src/**/*.integration.test.ts"],
  },
});
