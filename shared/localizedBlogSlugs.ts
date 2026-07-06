import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./supportedLanguages.ts";

export const BLOG_CANONICAL_SLUGS = [
  "what-is-end-to-end-encryption",
  "secrets-never-send-in-chat",
  "send-secret-message-without-account",
  "encrypted-vs-secure-file-sharing",
  "one-time-secret-links",
  "securing-ai-agents-like-employees",
  "privatenote-codex",
  "privatenote-for-developers",
  "privacy-tools",
  "myth-good-enough-security",
  "how-we-generate-passwords",
  "workplace-texts-private-note",
] as const;

export type BlogCanonicalSlug = (typeof BLOG_CANONICAL_SLUGS)[number];

/** Localized URL slug per language (ASCII, no diacritics). English values match canonical slugs. */
export const LOCALIZED_BLOG_SLUGS: Record<BlogCanonicalSlug, Record<SupportedLanguage, string>> = {
  "what-is-end-to-end-encryption": {
    en: "what-is-end-to-end-encryption",
    de: "was-ist-end-to-end-verschluesselung",
    fr: "definition-du-chiffrement-de-bout-en-bout",
    es: "que-es-el-cifrado-de-extremo-a-extremo",
    it: "cos-e-la-crittografia-end-to-end",
    nl: "wat-is-end-to-end-versleuteling",
    pt: "o-que-e-criptografia-de-ponta-a-ponta",
    sr: "sta-je-end-to-end-sifrovanje",
    hr: "sto-je-end-to-end-sifriranje",
  },
  "secrets-never-send-in-chat": {
    en: "secrets-never-send-in-chat",
    de: "10-geheimnisse-die-nie-in-den-chat-gehoeren",
    fr: "10-secrets-a-ne-jamais-envoyer-dans-un-chat",
    es: "10-secretos-que-nunca-enviar-por-chat",
    it: "10-segreti-da-non-inviare-in-chat",
    nl: "10-geheimen-die-nooit-in-chat-horen",
    pt: "10-segredos-para-nunca-enviar-no-chat",
    sr: "10-tajni-koje-nikada-ne-slati-u-chat",
    hr: "10-tajni-koje-nikada-ne-slati-u-chat",
  },
  "send-secret-message-without-account": {
    en: "send-secret-message-without-account",
    de: "geheime-nachricht-ohne-konto-senden",
    fr: "message-secret-sans-compte",
    es: "mensaje-secreto-sin-cuenta",
    it: "messaggio-segreto-senza-account",
    nl: "geheim-bericht-zonder-account",
    pt: "mensagem-secreta-sem-conta",
    sr: "tajna-poruka-bez-naloga",
    hr: "tajna-poruka-bez-racuna",
  },
  "encrypted-vs-secure-file-sharing": {
    en: "encrypted-vs-secure-file-sharing",
    de: "verschluesseltes-vs-sicheres-dateiteilen",
    fr: "partage-chiffre-vs-securise",
    es: "cifrado-vs-comparticion-segura-de-archivos",
    it: "condivisione-crittografata-vs-sicura",
    nl: "versleuteld-vs-veilig-delen",
    pt: "compartilhamento-criptografado-vs-seguro",
    sr: "sifrovano-vs-bezbedno-deljenje-datoteka",
    hr: "sifrirano-vs-sigurno-dijeljenje-datoteka",
  },
  "one-time-secret-links": {
    en: "one-time-secret-links",
    de: "one-time-geheime-links",
    fr: "liens-secrets-a-usage-unique",
    es: "enlaces-secretos-de-un-solo-uso",
    it: "collegamenti-segreti-una-tantum",
    nl: "eenmalige-geheime-links",
    pt: "links-secretos-unicos",
    sr: "jednokratni-tajni-linkovi",
    hr: "jednokratne-tajne-poveznice",
  },
  "securing-ai-agents-like-employees": {
    en: "securing-ai-agents-like-employees",
    de: "ki-agenten-wie-mitarbeiter-absichern",
    fr: "securiser-les-agents-ia-comme-des-employes",
    es: "asegurar-agentes-de-ia-como-empleados",
    it: "garantire-agenti-ia-come-dipendenti",
    nl: "ai-agenten-beveiligen-zoals-werknemers",
    pt: "proteger-agentes-de-ia-como-funcionarios",
    sr: "obezbedivanje-ai-agensata-kao-zaposlenih",
    hr: "osiguravanje-ai-agents-poput-zaposlenika",
  },
  "privatenote-codex": {
    en: "privatenote-codex",
    de: "privatenote-mit-openai-codex",
    fr: "privatenote-avec-openai-codex",
    es: "privatenote-con-openai-codex",
    it: "privatenote-con-openai-codex",
    nl: "privatenote-met-openai-codex",
    pt: "privatenote-com-openai-codex",
    sr: "privatenote-sa-openai-codexom",
    hr: "privatenote-s-openai-codexom",
  },
  "privatenote-for-developers": {
    en: "privatenote-for-developers",
    de: "privatenote-fuer-entwickler",
    fr: "privatenote-pour-developpeurs",
    es: "privatenote-para-desarrolladores",
    it: "privatenote-per-sviluppatori",
    nl: "privatenote-voor-ontwikkelaars",
    pt: "privatenote-para-desenvolvedores",
    sr: "privatenote-za-programere",
    hr: "privatenote-za-programere",
  },
  "privacy-tools": {
    en: "privacy-tools",
    de: "datenschutz-tools",
    fr: "outils-de-confidentialite",
    es: "herramientas-de-privacidad",
    it: "strumenti-per-la-privacy",
    nl: "privacytools",
    pt: "ferramentas-de-privacidade",
    sr: "alati-za-privatnost",
    hr: "alati-za-privatnost",
  },
  "myth-good-enough-security": {
    en: "myth-good-enough-security",
    de: "mythos-gut-genug-sicherheit",
    fr: "mythe-securite-suffisante",
    es: "mito-seguridad-suficientemente-buena",
    it: "mito-sicurezza-abbastanza-buona",
    nl: "mythe-goed-genoeg-beveiliging",
    pt: "mito-seguranca-boa-o-suficiente",
    sr: "mit-dovoljno-dobrog-obezbedenja",
    hr: "mit-dovoljno-dobre-sigurnosti",
  },
  "how-we-generate-passwords": {
    en: "how-we-generate-passwords",
    de: "wie-wir-sichere-passwoerter-erzeugen",
    fr: "comment-nous-generons-des-mots-de-passe",
    es: "como-generamos-contrasenas-seguras",
    it: "come-generiamo-password-sicure",
    nl: "hoe-we-veilige-wachtwoorden-genereren",
    pt: "como-geramos-senhas-seguras",
    sr: "kako-generisemo-sigurne-lozinke",
    hr: "kako-generiramo-sigurne-lozinke",
  },
  "workplace-texts-private-note": {
    en: "workplace-texts-private-note",
    de: "arbeitsplatznachrichten-und-kurzlebige-notizen",
    fr: "messages-au-travail-et-notes-ehemeres",
    es: "mensajes-laborales-y-notas-efimeras",
    it: "testi-di-lavoro-e-appunti-effimeri",
    nl: "werkplekteksten-en-kortstondige-aantekeningen",
    pt: "textos-de-trabalho-e-notas-efemer",
    sr: "tekstovi-na-radnom-mestu-i-efemerne-poruke",
    hr: "tekstovi-na-radnom-mjestu-i-efemerne-biljeske",
  },
};

const SLUG_TO_CANONICAL = new Map<string, BlogCanonicalSlug>();

for (const canonical of BLOG_CANONICAL_SLUGS) {
  SLUG_TO_CANONICAL.set(canonical, canonical);
  for (const language of SUPPORTED_LANGUAGES) {
    SLUG_TO_CANONICAL.set(LOCALIZED_BLOG_SLUGS[canonical][language], canonical);
  }
}

export function isBlogCanonicalSlug(slug: string): slug is BlogCanonicalSlug {
  return (BLOG_CANONICAL_SLUGS as readonly string[]).includes(slug);
}

export function localizedBlogSlug(canonical: BlogCanonicalSlug, language: SupportedLanguage): string {
  return LOCALIZED_BLOG_SLUGS[canonical][language];
}

export function resolveCanonicalBlogSlug(slugFromUrl: string): BlogCanonicalSlug | null {
  return SLUG_TO_CANONICAL.get(slugFromUrl) ?? null;
}

export function localizedBlogPostPath(canonical: BlogCanonicalSlug, language: SupportedLanguage): string {
  const slug = localizedBlogSlug(canonical, language);
  if (language === "en") {
    return `/blog/${slug}`;
  }
  return `/${language}/blog/${slug}`;
}

/** All public blog post paths, including legacy English slugs under non-English locales. */
export function allLocalizedBlogMarketingPaths(): string[] {
  const paths: string[] = [];

  for (const canonical of BLOG_CANONICAL_SLUGS) {
    paths.push(`/blog/${canonical}`);
    for (const language of SUPPORTED_LANGUAGES) {
      if (language === "en") continue;
      const localized = localizedBlogSlug(canonical, language);
      paths.push(`/${language}/blog/${localized}`);
      if (localized !== canonical) {
        paths.push(`/${language}/blog/${canonical}`);
      }
    }
  }

  return paths;
}
