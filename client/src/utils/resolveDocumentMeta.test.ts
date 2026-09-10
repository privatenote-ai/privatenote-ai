import assert from "node:assert/strict";
import test from "node:test";
import { PUBLIC_MARKETING_PATHS } from "@shared/publicMarketingPaths";
import { resolveDocumentMeta } from "./resolveDocumentMeta.ts";
import { de } from "./translations/de.ts";
import { en } from "./translations/en.ts";
import { es } from "./translations/es.ts";
import { fr } from "./translations/fr.ts";
import { hr } from "./translations/hr.ts";
import { it } from "./translations/it.ts";
import { nl } from "./translations/nl.ts";
import { pt } from "./translations/pt.ts";
import { sr } from "./translations/sr.ts";

const META_DESCRIPTION_MAX = 160;

const localePacks = {
  en,
  de,
  fr,
  es,
  it,
  nl,
  pt,
  hr,
  sr,
} as const;

test("resolveDocumentMeta compounds German security-resources hero title", () => {
  const meta = resolveDocumentMeta("/de/security-resources", { ...en, ...de });
  assert.match(meta.title, /Sicherheitsarchitektur/);
  assert.doesNotMatch(meta.title, /Sicherheits architektur/);
});

test("resolveDocumentMeta keeps spaced French security-resources hero title", () => {
  const meta = resolveDocumentMeta("/fr/security-resources", { ...en, ...fr });
  assert.match(meta.title, /Architecture de sécurité/);
});

test("resolveDocumentMeta localizes German VPN security guide title", () => {
  const meta = resolveDocumentMeta("/de/security-guides/vpn", { ...en, ...de });
  assert.match(meta.title, /VPN-Dienste/);
  assert.doesNotMatch(meta.title, /VPN Services Guide ·/);
});

test("resolveDocumentMeta keeps public marketing meta descriptions within SEO length", () => {
  const over: string[] = [];
  for (const route of PUBLIC_MARKETING_PATHS) {
    const [maybeLang] = route.split("/").filter(Boolean);
    const pack = maybeLang && maybeLang in localePacks ? localePacks[maybeLang as keyof typeof localePacks] : en;
    const t = maybeLang && maybeLang in localePacks ? { ...en, ...pack } : en;
    const { description } = resolveDocumentMeta(route, t);
    if (description.length > META_DESCRIPTION_MAX) {
      over.push(`${route} description (${description.length})`);
    }
  }
  assert.deepEqual(over, [], `Trim meta descriptions for: ${over.join(", ")}`);
});

const META_TITLE_MAX = 60;

test("resolveDocumentMeta keeps public marketing titles within SEO length", () => {
  const over: string[] = [];
  for (const route of PUBLIC_MARKETING_PATHS) {
    const [maybeLang] = route.split("/").filter(Boolean);
    const pack = maybeLang && maybeLang in localePacks ? localePacks[maybeLang as keyof typeof localePacks] : en;
    const t = maybeLang && maybeLang in localePacks ? { ...en, ...pack } : en;
    const { title } = resolveDocumentMeta(route, t);
    if (title.length > META_TITLE_MAX) {
      over.push(`${route} title (${title.length})`);
    }
  }
  assert.deepEqual(over, [], `Trim document titles for: ${over.join(", ")}`);
});


test("one-time landing has transactional metadata distinct from the guide", () => {
  const deMeta = resolveDocumentMeta("/de/one-time-link", { ...en, ...de });
  assert.match(deMeta.title, /Einmal-Link erstellen/);
  assert.match(deMeta.description, /Passwörter, private Nachrichten und Dateien/);
  assert.notEqual(deMeta.title, resolveDocumentMeta("/de/blog/one-time-geheime-links", { ...en, ...de }).title);
  assert.deepEqual(resolveDocumentMeta("/de/one-time-link/", { ...en, ...de }), deMeta);

  const enMeta = resolveDocumentMeta("/one-time-link", en);
  assert.match(enMeta.title, /Create a One-Time Secret Link/);
  assert.notEqual(enMeta.title, resolveDocumentMeta("/blog/one-time-secret-links", en).title);
});
