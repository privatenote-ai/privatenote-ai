/**
 * Serve /images/* via Functions so legacy PNG hero URLs 301 to optimized JPEGs
 * before Cloudflare Pages can return a stale 2MB static PNG from an old deploy.
 *
 * `_redirects` splats are unreliable with `wrangler pages deploy` (workers-sdk#2671).
 */
import { resolveLegacyImageRedirect } from "../../shared/legacyImageRedirects";

type ImagesEnv = {
  ASSETS: { fetch: (request: Request | string) => Promise<Response> };
};

export async function onRequest(context: {
  request: Request;
  env: ImagesEnv;
}): Promise<Response> {
  const { request, env } = context;
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const legacyTarget = resolveLegacyImageRedirect(url.pathname);
  if (legacyTarget) {
    url.pathname = legacyTarget;
    return Response.redirect(url.toString(), 301);
  }

  return env.ASSETS.fetch(request);
}
