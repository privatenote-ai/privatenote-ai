import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Get API base URL from environment variable or use relative path
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
  // If no API_BASE_URL, use relative URL
  return url;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest<T = any>(
  url: string,
  method: string = "GET",
  data?: unknown | undefined,
): Promise<T> {
  const fullUrl = getApiUrl(url);
  
  // Client-side logging
  console.log(`[CLIENT] ========== API REQUEST ==========`);
  console.log(`[CLIENT] Original URL: ${url}`);
  console.log(`[CLIENT] API_BASE_URL: "${import.meta.env.VITE_API_URL || '(empty)'}"`);
  console.log(`[CLIENT] Full URL: ${fullUrl}`);
  console.log(`[CLIENT] Method: ${method}`);
  
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
  console.log(`[CLIENT] Has data: ${!!data}`);
  if (data) {
    console.log(`[CLIENT] Data keys:`, Object.keys(data as Record<string, any>));
    console.log(`[CLIENT] Data preview:`, JSON.stringify(data).substring(0, 200));
  }
  
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  console.log(`[CLIENT] Request headers:`, headers);
  
  try {
    const res = await fetch(fullUrl, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      // Removed credentials: "include" because we use wildcard CORS (*)
      // If you need credentials, change server to return specific origin instead of *
    });

    console.log(`[CLIENT] Response status: ${res.status} ${res.statusText}`);
    console.log(`[CLIENT] Response headers:`, JSON.stringify(Object.fromEntries(res.headers.entries())));
    
    // Read response text for logging
    const responseText = await res.text();
    console.log(`[CLIENT] Response body: ${responseText.substring(0, 500)}`);
    
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
    console.error(`[CLIENT] ❌❌❌ API REQUEST ERROR ❌❌❌`);
    console.error(`[CLIENT] Error type: ${error?.constructor?.name || 'Unknown'}`);
    console.error(`[CLIENT] Error message:`, error instanceof Error ? error.message : String(error));
    console.error(`[CLIENT] Error stack:`, error instanceof Error ? error.stack : 'No stack');
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const fullUrl = getApiUrl(url);
    const res = await fetch(fullUrl, {
      // Removed credentials: "include" because we use wildcard CORS (*)
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

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
