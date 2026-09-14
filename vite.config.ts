import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import fs from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import { buildDevPageContentSecurityPolicy } from "./shared/pageContentSecurityPolicy";
import {
  ensureBlockingEntryStylesheet,
  stripStaleModulePreloads,
} from "./scripts/deferEntryStylesheet.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * After production build: drop the Inter TTF preload (it starves CSS on mobile)
 * and keep the Tailwind stylesheet render-blocking so prerendered HTML does not
 * flash unstyled.
 */
function htmlCriticalPathPlugin(): Plugin {
  return {
    name: "html-critical-path",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      let html = fs.readFileSync(indexPath, "utf8");
      html = html.replace(
        /\s*<link rel="preload" href="[^"]*Inter-VariableFont[^"]*" as="font"[^>]*\s*\/?>/g,
        "",
      );
      html = ensureBlockingEntryStylesheet(html);
      html = stripStaleModulePreloads(html);
      fs.writeFileSync(indexPath, html);
    },
  };
}

/**
 * Copy the empty Vite index shell to spa-shell.html for Pages Functions.
 * Production prerender overwrites index.html with the homepage; client routes
 * (/auth, /admin, /premium, /account) must serve an empty #root instead.
 */
function spaShellCopyPlugin(): Plugin {
  return {
    name: "spa-shell-copy",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(__dirname, "dist");
      const indexPath = path.join(distDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      const html = fs.readFileSync(indexPath, "utf8");
      const spa = html.replace(
        /<div id="pn-home-prerender"[\s\S]*?<div id="root">/,
        '<div id="root">',
      );
      fs.writeFileSync(path.join(distDir, "spa-shell.html"), spa);
    },
  };
}
const configuredApiUrl = (process.env.VITE_API_URL || "").trim();
const isLocalApiUrl =
  configuredApiUrl.includes("localhost") || configuredApiUrl.includes("127.0.0.1");
const localApiPort = process.env.LOCAL_API_PORT || "8787";
const proxyTarget =
  configuredApiUrl && isLocalApiUrl
    ? configuredApiUrl
    : `http://localhost:${localApiPort}`;


/** Set VITE_DEV_HTTP=1 to use plain http:// (e.g. quick debugging). Default: HTTPS for Turnstile / secure contexts. */
const useDevHttps = process.env.VITE_DEV_HTTP !== "1";

/** Optional mkcert (or other) PEM paths — Safari trusts mkcert's local CA; basic-ssl is often rejected. */
const devSslCert = process.env.VITE_DEV_SSL_CERT?.trim();
const devSslKey = process.env.VITE_DEV_SSL_KEY?.trim();
const useMkcert =
  Boolean(
    devSslCert &&
      devSslKey &&
      fs.existsSync(devSslCert) &&
      fs.existsSync(devSslKey),
  );

/**
 * Safari often resolves `localhost` to IPv6 (::1). Default Vite bind is IPv4-only, so the browser
 * shows "can't connect". `::` listens for IPv6 loopback (and typically IPv4 via dual-stack).
 * Override with VITE_DEV_HOST (e.g. 127.0.0.1 or true for 0.0.0.0).
 */
function devServerHost(): string | boolean | undefined {
  if (!useDevHttps) return undefined;
  const override = process.env.VITE_DEV_HOST?.trim();
  if (override === "true") return true;
  if (override) return override;
  return process.platform === "win32" ? true : "::";
}

function devHttpsHintsPlugin(): Plugin {
  return {
    name: "dev-https-hints",
    configureServer(server) {
      if (!useDevHttps || useMkcert) return;
      server.httpServer?.once("listening", () => {
        const addr = server.httpServer?.address();
        const port =
          typeof addr === "object" && addr && "port" in addr
            ? String(addr.port)
            : String(server.config.server.port ?? 5173);
        console.log(
          `\n\x1b[36m[vite]\x1b[0m HTTPS dev: Safari issues → try \x1b[1mhttps://127.0.0.1:${port}/\x1b[0m or mkcert + VITE_DEV_SSL_CERT / VITE_DEV_SSL_KEY (see vite.config.ts).\n` +
            `\x1b[36m[vite]\x1b[0m Passkeys (Chromium): use \x1b[1mhttps://localhost:${port}/\x1b[0m — bare IPs are rejected for WebAuthn.\n`,
        );
      });
    },
  };
}

const devHost = devServerHost();

/** Dev CSP — production HTML CSP is nonce-based via Pages middleware (`shared/pageContentSecurityPolicy.ts`). */
const devContentSecurityPolicy = buildDevPageContentSecurityPolicy();

export default defineConfig({
  plugins: [
    htmlCriticalPathPlugin(),
    spaShellCopyPlugin(),
    ...(useDevHttps && !useMkcert
      ? [basicSsl({ domains: ["localhost", "127.0.0.1"] })]
      : []),
    devHttpsHintsPlugin(),
    react(),
    // Replit-only plugins — only active when running inside a Repl (REPL_ID is set).
    // Outside Replit the runtime-error overlay causes "Importing a module script failed"
    // CSP errors because it injects blob: module scripts that our strict dev CSP blocks.
    ...(process.env.REPL_ID !== undefined ? [runtimeErrorOverlay()] : []),
    themePlugin(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    modulePreload: {
      resolveDependencies: (_filename, deps, { hostId }) => {
        const filtered = deps.filter(
          (d) =>
            !/vendor-web-llm|vendor-transformers|client-llm|clientLLM|webllm-engine/.test(
              d,
            ),
        );
        // Homepage + composer must not preload AI/feature splits (WebLLM is 1.7MB).
        if (/index-|Home|App|CreateNote/.test(hostId)) return [];
        return filtered;
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@mlc-ai/web-llm")) return "vendor-web-llm";
          if (id.includes("@huggingface/transformers")) return "vendor-transformers";
          if (id.includes("@tanstack/react-query")) return "vendor-query";
          if (id.includes("@radix-ui")) return "vendor-radix";
          // Do not split lucide-react into a shared chunk: it pulled every route's icons
          // into one file on the homepage critical path (Lighthouse network dependency).
          if (
            id.includes("/react-dom/") ||
            id.includes("/react/") ||
            id.includes("/scheduler/")
          ) {
            return "vendor-react";
          }
        },
      },
    },
  },
  server: {
    /**
     * Cross-Origin Isolation headers — required for SharedArrayBuffer which WebLLM (MLC-AI)
     * uses for its WASM engine. Without these, window.crossOriginIsolated = false and the
     * on-device AI will fail with a low-level WASM error in all browsers including Safari.
     * In production these are set via client/public/_headers (Cloudflare Pages).
     */
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "credentialless",
      "Content-Security-Policy": devContentSecurityPolicy,
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
    ...(devHost !== undefined ? { host: devHost } : {}),
    ...(useMkcert
      ? {
          https: {
            cert: fs.readFileSync(devSslCert!),
            key: fs.readFileSync(devSslKey!),
          },
        }
      : {}),
    ...(useDevHttps ? {} : { https: false as const }),
    warmup: {
      clientFiles: [
        "./src/pages/Home.tsx",
        "./src/components/note/CreateNote.tsx",
      ],
    },
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
        timeout: 8_000,
        proxyTimeout: 8_000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('[VITE PROXY] Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('[VITE PROXY] Proxying request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('[VITE PROXY] Proxy response:', req.method, req.url, proxyRes.statusCode);
          });
        },
      },
    },
  },
});
