import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

test("static CSP allows the homepage JSON-LD schema block", () => {
  const html = readFileSync("client/index.html", "utf8");
  const headers = readFileSync("client/public/_headers", "utf8");
  const schemaScript = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  assert.ok(schemaScript, "homepage JSON-LD script should exist");

  const hash = createHash("sha256").update(schemaScript[1]).digest("base64");
  assert.match(headers, new RegExp(`script-src[^;]*'sha256-${hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}'`));
});
