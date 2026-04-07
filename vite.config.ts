import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import fs from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configuredApiUrl = (process.env.VITE_API_URL || "").trim();
const isLocalApiUrl =
  configuredApiUrl.includes("localhost") || configuredApiUrl.includes("127.0.0.1");
const localApiPort = process.env.LOCAL_API_PORT || "8787";
const proxyTarget =
  configuredApiUrl && isLocalApiUrl
    ? configuredApiUrl
    : `http://localhost:${localApiPort}`;

/**
 * argon2-browser uses `require("../dist/argon2.wasm")` when `require` exists. Vite's CommonJS
 * resolver then tries to load .wasm as ESM WebAssembly (unsupported). The library expects a
 * base64 string and runs `decodeWasmBinary` → atob. We satisfy that with a virtual module.
 */
function argon2BrowserWasmPlugin(): Plugin {
  const virtualId = "\0argon2-browser:wasm-base64";
  const wasmAbs = path.resolve(
    __dirname,
    "node_modules/argon2-browser/dist/argon2.wasm",
  );

  return {
    name: "argon2-browser-wasm-base64",
    enforce: "pre",
    resolveId(id, importer) {
      if (id === virtualId) return virtualId;
      const normId = id.replace(/\\/g, "/");
      const normImporter = importer?.replace(/\\/g, "/") ?? "";
      if (
        normId.endsWith("argon2.wasm") &&
        (normId.includes("argon2-browser") ||
          normImporter.includes("argon2-browser/lib/argon2"))
      ) {
        return virtualId;
      }
      return null;
    },
    load(id) {
      if (id !== virtualId) return null;
      const buf = fs.readFileSync(wasmAbs);
      return `export default ${JSON.stringify(buf.toString("base64"))};`;
    },
  };
}

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

export default defineConfig({
  plugins: [
    argon2BrowserWasmPlugin(),
    ...(useDevHttps && !useMkcert
      ? [basicSsl({ domains: ["localhost", "127.0.0.1"] })]
      : []),
    devHttpsHintsPlugin(),
    react(),
    runtimeErrorOverlay(),
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
  },
  server: {
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
    proxy: {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
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
