import assert from "node:assert/strict";
import test from "node:test";
import { emptySpaRoot } from "./emptySpaRoot";

test("emptySpaRoot clears nested homepage markup inside #root", () => {
  const html = `<!DOCTYPE html><html><body><div id="root"><div class="flex"><nav>Sign in</nav><h1>Your Messages, Your Privacy</h1><div>deep</div></div></div><script src="/assets/index.js"></script></body></html>`;
  const out = emptySpaRoot(html);
  assert.match(out, /<div id="root"><\/div><script/);
  assert.doesNotMatch(out, /Your Messages/);
  assert.doesNotMatch(out, /Sign in/);
});

test("emptySpaRoot is a no-op when root is already empty", () => {
  const html = `<html><body><div id="root"></div><script src="/x.js"></script></body></html>`;
  assert.equal(emptySpaRoot(html), html);
});

test("emptySpaRoot leaves unrelated markup alone when root is missing", () => {
  const html = `<html><body><main>hi</main></body></html>`;
  assert.equal(emptySpaRoot(html), html);
});

test("emptySpaRoot handles attribute order on the root tag", () => {
  const html = `<div id="root" class="app"><div><span>home</span></div></div><footer>f</footer>`;
  assert.equal(emptySpaRoot(html), `<div id="root"></div><footer>f</footer>`);
});
