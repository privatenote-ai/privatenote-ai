import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const LLMS = readFileSync("client/public/llms.txt", "utf8");
const LLMS_FULL = readFileSync("client/public/llms-full.txt", "utf8");
const HEADERS = readFileSync("client/public/_headers", "utf8");
const ROBOTS = readFileSync("client/public/robots.txt", "utf8");
const INDEX = readFileSync("client/index.html", "utf8");

test("llms.txt follows the llmstxt.org v2 shape", () => {
  assert.match(LLMS, /^# PrivateNote\.ai\n/);
  assert.match(LLMS, /^> .+/m);
  assert.match(LLMS, /^## Product$/m);
  assert.match(LLMS, /^## Developers$/m);
  assert.match(LLMS, /\[Create a private note\]\(https:\/\/privatenote\.ai\/\)/);
  assert.match(LLMS, /https:\/\/privatenote\.ai\/llms-full\.txt/);
  assert.doesNotMatch(LLMS, /^### /m);
});

test("llms-full.txt expands FAQ and blog coverage", () => {
  assert.match(LLMS_FULL, /^# PrivateNote\.ai \(full\)\n/);
  assert.match(LLMS_FULL, /Can PrivateNote\.ai see my note content/);
  assert.match(LLMS_FULL, /privatenote-mcp/);
  assert.match(LLMS_FULL, /how-to-share-a-password-securely/);
});

test("llms.txt is discoverable from HTML, headers, and robots.txt", () => {
  assert.match(INDEX, /rel="describedby" href="\/llms\.txt"/);
  assert.match(HEADERS, /Link: <\/llms\.txt>; rel="describedby"/);
  assert.match(HEADERS, /^\/llms\.txt$/m);
  assert.match(HEADERS, /^\/llms-full\.txt$/m);
  assert.match(ROBOTS, /https:\/\/privatenote\.ai\/llms\.txt/);
});
