import {
  buildPageContentSecurityPolicy,
  generateCspNonce,
  injectCspNonceIntoHtml,
} from "../../shared/pageContentSecurityPolicy";

export async function applyHtmlPageSecurity(response: Response): Promise<Response> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) {
    return response;
  }

  const nonce = generateCspNonce();
  const headers = new Headers(response.headers);
  headers.set("Content-Security-Policy", buildPageContentSecurityPolicy(nonce));

  const html = await response.text();
  return new Response(injectCspNonceIntoHtml(html, nonce), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
