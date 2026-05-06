import { QueryClient, QueryFunction } from "@tanstack/react-query";

// In local dev, prefer Vite's /api proxy unless VITE_API_URL points to localhost.
const RAW_API_BASE_URL = (import.meta.env.VITE_API_URL || "").trim();
const isLocalHost = (() => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
})();
const hasSameOriginApiProxy = (() => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  // Cloudflare Pages deploys functions/api/[[path]].ts as a same-origin API proxy.
  // Prefer it on deployed app hosts so auth cookies are first-party to the app
  // instead of being set by a cross-site workers.dev API response.
  return (
    host === "privatenote.ai" ||
    host === "www.privatenote.ai" ||
    host === "app.privatenote.ai" ||
    host === "premium.privatenote.ai" ||
    host === "privatenote-ai.pages.dev" ||
    host.endsWith(".privatenote-ai.pages.dev")
  );
})();
const isLocalApiTarget =
  RAW_API_BASE_URL.includes("localhost") || RAW_API_BASE_URL.includes("127.0.0.1");
const API_BASE_URL =
  hasSameOriginApiProxy
    ? ""
    : import.meta.env.DEV && isLocalHost && RAW_API_BASE_URL && !isLocalApiTarget
    ? ""
    : RAW_API_BASE_URL;

function getApiUrl(url: string): string {
  // If URL already starts with http, use it as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // Otherwise, prepend API base URL if configured
  if (API_BASE_URL) {
    // Ensure API_BASE_URL has protocol
    let baseUrl = API_BASE_URL;
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      console.warn(`[CLIENT] ⚠️ VITE_API_URL is missing protocol, adding https://`);
      baseUrl = `https://${baseUrl}`;
    }
    // Remove trailing slash from base URL and leading slash from path
    baseUrl = baseUrl.replace(/\/$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  }
  if (import.meta.env.DEV && isLocalHost && RAW_API_BASE_URL && !isLocalApiTarget) {
    console.warn(
      `[CLIENT] ⚠️ Ignoring non-local VITE_API_URL in local dev; using /api proxy instead.`,
    );
  }
  // If no API_BASE_URL, use relative URL
  return url;
}

/** Thrown for non-2xx API responses; `bodyText` is always the raw response body (for structured client handling). */
export class ApiRequestError extends Error {
  readonly status: number;
  readonly bodyText: string;

  constructor(status: number, bodyText: string) {
    const safeMessage =
      import.meta.env.DEV ? `${status}: ${bodyText}` : `${status}: Request failed`;
    super(safeMessage);
    this.name = "ApiRequestError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new ApiRequestError(res.status, text);
  }
}

export async function apiRequest<T = any>(
  url: string,
  method: string = "GET",
  data?: unknown | undefined,
): Promise<T> {
  const fullUrl = getApiUrl(url);

  if (import.meta.env.DEV) {
    console.log(`[CLIENT] ========== API REQUEST ==========`);
    console.log(`[CLIENT] Original URL: ${url}`);
    console.log(`[CLIENT] API_BASE_URL: "${import.meta.env.VITE_API_URL || '(empty)'}"`);
    console.log(`[CLIENT] Full URL: ${fullUrl}`);
    console.log(`[CLIENT] Method: ${method}`);
  }

  // Warn if API URL might be incorrect in production
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    const currentHost = window.location.hostname;
    const isPagesDev = currentHost.includes('.pages.dev');
    
    if (isPagesDev && fullUrl.startsWith('http')) {
      console.warn(`[CLIENT] ⚠️ WARNING: VITE_API_URL is not set in production!`);
      console.warn(`[CLIENT] Requests are going to: ${fullUrl}`);
      console.warn(`[CLIENT] If this is a Pages deployment, set VITE_API_URL to your Worker URL`);
      console.warn(`[CLIENT] See FIX_405_ERROR.md for instructions`);
    }
  }
  if (import.meta.env.DEV) {
    console.log(`[CLIENT] Has data: ${!!data}`);
    if (data) {
      console.log(`[CLIENT] Data keys:`, Object.keys(data as Record<string, any>));
      console.log(`[CLIENT] Data preview:`, JSON.stringify(data).substring(0, 200));
    }
  }

  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (import.meta.env.DEV) {
    console.log(`[CLIENT] Request headers:`, headers);
  }

  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    const responseText = await res.text();
    if (import.meta.env.DEV) {
      console.log(`[CLIENT] Response status: ${res.status} ${res.statusText}`);
      console.log(
        `[CLIENT] Response headers:`,
        JSON.stringify(Object.fromEntries(res.headers.entries())),
      );
      console.log(`[CLIENT] Response body: ${responseText.substring(0, 500)}`);
    }
    
    // Recreate response for throwIfResNotOk
    const responseClone = new Response(responseText, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers
    });

    await throwIfResNotOk(responseClone);
    
    // Parse JSON from the text we already read
    return JSON.parse(responseText) as T;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[CLIENT] ❌❌❌ API REQUEST ERROR ❌❌❌`);
      console.error(`[CLIENT] Error type: ${error?.constructor?.name || "Unknown"}`);
      console.error(
        `[CLIENT] Error message:`,
        error instanceof Error ? error.message : String(error),
      );
      console.error(`[CLIENT] Error stack:`, error instanceof Error ? error.stack : "No stack");
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn<T>(options: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> {
  const { on401: unauthorizedBehavior } = options;
  return async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const fullUrl = getApiUrl(url);
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
