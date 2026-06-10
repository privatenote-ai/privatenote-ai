import {
  buildPageContentSecurityPolicy,
  generateCspNonce,
  injectCspNonceIntoHtml,
} from "../../shared/pageContentSecurityPolicy";

/** Apply nonce-based CSP to HTML document responses (Pages middleware). */
export async function applyHtmlPageSecurity(request: Request, response: Response): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return response;
  }
  if (response.status !== 200) {
    return response;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  const nonce = generateCspNonce();
  const csp = buildPageContentSecurityPolicy(nonce);
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", csp);

  if (request.method === "HEAD") {
    return new Response(null, { status: 200, statusText: response.statusText, headers });
  }

  const html = await response.text();
  const rewritten = injectCspNonceIntoHtml(html, nonce);
  headers.delete("Content-Length");
  return new Response(rewritten, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
