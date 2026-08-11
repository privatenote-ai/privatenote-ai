/**
 * Replace nested `#root` contents with an empty mount node.
 *
 * Production `index.html` is the prerendered homepage. SPA route Functions used to
 * serve that file as-is, so /auth, /admin, /premium, /account flashed (or stuck on)
 * the homepage until client JS replaced the root.
 */
export function emptySpaRoot(html: string): string {
  const openMatch = /<div\s+id=["']root["'][^>]*>/i.exec(html);
  if (!openMatch || openMatch.index === undefined) return html;

  const openEnd = openMatch.index + openMatch[0].length;
  let depth = 1;
  let i = openEnd;

  while (i < html.length && depth > 0) {
    const nextClose = html.indexOf("</div>", i);
    if (nextClose === -1) return html;

    const nextOpen = html.indexOf("<div", i);
    if (nextOpen !== -1 && nextOpen < nextClose) {
      const ch = html[nextOpen + 4];
      // Real opening tag: <div…>, <div …>, or <div/>
      if (ch === undefined || /[\s>/]/.test(ch)) {
        depth += 1;
        i = nextOpen + 4;
        continue;
      }
      // False positive (e.g. <divide) — skip past the match.
      i = nextOpen + 4;
      continue;
    }

    depth -= 1;
    if (depth === 0) {
      return `${html.slice(0, openMatch.index)}<div id="root"></div>${html.slice(nextClose + 6)}`;
    }
    i = nextClose + 6;
  }

  return html;
}
