import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { keepCriticalFontPreloads } from "./keepCriticalFontPreloads.js";

describe("keepCriticalFontPreloads", () => {
  it("keeps Satoshi 700 and Inter 400 latin, drops other font preloads", () => {
    const html = [
      "<head>",
      '<link rel="preload" href="/assets/Satoshi-latin-700-abc.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="preload" href="/assets/Satoshi-latin-ext-700-abc.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="preload" href="/assets/Inter-latin-400-abc.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="preload" href="/assets/Inter-latin-600-abc.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="preload" href="/assets/Inter-latin-ext-400-abc.woff2" as="font" type="font/woff2" crossorigin>',
      '<link rel="preload" href="/assets/vendor-react-xyz.js" as="script">',
      "</head>",
    ].join("");

    const out = keepCriticalFontPreloads(html);
    assert.match(out, /Satoshi-latin-700-abc\.woff2/);
    assert.match(out, /Inter-latin-400-abc\.woff2/);
    assert.doesNotMatch(out, /Satoshi-latin-ext-700/);
    assert.doesNotMatch(out, /Inter-latin-600/);
    assert.doesNotMatch(out, /Inter-latin-ext-400/);
    assert.match(out, /vendor-react-xyz\.js/);
  });

  it("strips the old Inter variable TTF preload", () => {
    const html =
      '<head><link rel="preload" href="/assets/Inter-VariableFont_opsz_wght-c8O0ljhh.ttf" as="font" type="font/ttf" crossorigin></head>';
    const out = keepCriticalFontPreloads(html);
    assert.doesNotMatch(out, /Inter-VariableFont/);
    assert.doesNotMatch(out, /as="font"/);
  });

  it("injects missing critical woff2 preloads from dist assets", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pn-fonts-"));
    fs.writeFileSync(path.join(dir, "Satoshi-latin-700-hash.woff2"), "");
    fs.writeFileSync(path.join(dir, "Inter-latin-400-hash.woff2"), "");
    fs.writeFileSync(path.join(dir, "Inter-latin-ext-400-hash.woff2"), "");
    const out = keepCriticalFontPreloads("<head></head>", dir);
    assert.match(out, /Satoshi-latin-700-hash\.woff2/);
    assert.match(out, /Inter-latin-400-hash\.woff2/);
    assert.doesNotMatch(out, /Inter-latin-ext-400-hash/);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
