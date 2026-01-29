export async function onRequest(context: {
  request: Request;
  env?: { API_PROXY_TARGET?: string };
}) {
  const url = new URL(context.request.url);
  const base = context.env?.API_PROXY_TARGET || "https://privatenote-api.marjan-skrobot.workers.dev";
  const target = new URL(base);
  target.pathname = url.pathname;
  target.search = url.search;

  const proxyRequest = new Request(target.toString(), context.request);
  return fetch(proxyRequest);
}
