/**
 * Legacy `/auth` → `/auth/sign-in` (301).
 *
 * Prerendered pages and old builds linked to `/auth`; `_redirects` alone is unreliable
 * with `wrangler pages deploy` (workers-sdk#2671). Crawlers need a real redirect, not SPA 404.
 */
export async function onRequest(context: { request: Request }): Promise<Response> {
  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(context.request.url);
  const target = new URL("/auth/sign-in", url.origin);
  target.search = url.search;

  return new Response(null, {
    status: 301,
    headers: {
      Location: target.toString(),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
