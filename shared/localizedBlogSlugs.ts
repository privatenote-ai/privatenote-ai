import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./supportedLanguages.ts";

export const BLOG_CANONICAL_SLUGS = [
  "introduction-to-private-ai",
  "how-to-make-a-private-note",
  "crypto-seed-phrase-one-time-link",
  "why-email-is-worst-for-secrets",
  "chat-control-1-0-vote-explained",
  "chat-control-europe-cryptographers",
  "how-to-share-api-key-securely",
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
  "social-media-bans-children-evidence",
  "how-to-share-a-password-securely",
  "secrets-in-cicd-env-github-leaks",
  "send-sensitive-documents-securely",
  "how-to-share-ssh-keys-securely",
  "android-iphone-rcs-end-to-end-encryption",
] as const;

export type BlogCanonicalSlug = (typeof BLOG_CANONICAL_SLUGS)[number];

/** Localized URL slug per language (ASCII, no diacritics). English values match canonical slugs. */
export const LOCALIZED_BLOG_SLUGS: Record<BlogCanonicalSlug, Record<SupportedLanguage, string>> = {
  "introduction-to-private-ai": {
    en: "introduction-to-private-ai",
    de: "einfuehrung-in-private-ki",
    fr: "introduction-a-l-ia-privee",
    es: "introduccion-a-la-ia-privada",
    it: "introduzione-all-ia-privata",
    nl: "introductie-tot-private-ai",
    pt: "introducao-a-ia-privada",
    sr: "uvod-u-privatnu-ai",
    hr: "uvod-u-privatnu-ai",
  },
  "how-to-make-a-private-note": {
    en: "how-to-make-a-private-note",
    de: "wie-man-eine-private-notiz-erstellt",
    fr: "comment-creer-une-note-privee",
    es: "como-hacer-una-nota-privada",
    it: "come-creare-una-nota-privata",
    nl: "hoe-maak-je-een-prive-notitie",
    pt: "como-fazer-uma-nota-privada",
    sr: "kako-napraviti-privatnu-belezku",
    hr: "kako-napraviti-privatnu-biljesku",
  },
  "crypto-seed-phrase-one-time-link": {
    en: "crypto-seed-phrase-one-time-link",
    de: "krypto-seed-phrase-einmal-link",
    fr: "phrase-seed-crypto-lien-unique",
    es: "frase-semilla-crypto-enlace-unico",
    it: "seed-phrase-crypto-link-monouso",
    nl: "crypto-seed-phrase-eenmalige-link",
    pt: "frase-semente-crypto-link-unico",
    sr: "crypto-seed-fraza-jednokratna-veza",
    hr: "crypto-seed-fraza-jednokratna-poveznica",
  },
  "why-email-is-worst-for-secrets": {
    en: "why-email-is-worst-for-secrets",
    de: "warum-e-mail-schlecht-fuer-geheimnisse-ist",
    fr: "pourquoi-l-email-est-mauvais-pour-les-secrets",
    es: "por-que-el-correo-es-malo-para-secretos",
    it: "perche-le-email-non-vanno-bene-per-i-segreti",
    nl: "waarom-e-mail-slecht-is-voor-geheimen",
    pt: "por-que-o-email-e-ruim-para-segredos",
    sr: "zasto-je-email-los-za-tajne",
    hr: "zasto-je-email-los-za-tajne",
  },
  "chat-control-1-0-vote-explained": {
    en: "chat-control-1-0-vote-explained",
    de: "chat-control-1-0-abstimmung-erklaert",
    fr: "chat-control-1-0-vote-explique",
    es: "chat-control-1-0-voto-explicado",
    it: "chat-control-1-0-voto-spiegato",
    nl: "chat-control-1-0-stemming-uitgelegd",
    pt: "chat-control-1-0-votacao-explicada",
    sr: "chat-control-1-0-glasanje-objasnjeno",
    hr: "chat-control-1-0-glasanje-objasnjeno",
  },
  "chat-control-europe-cryptographers": {
    en: "chat-control-europe-cryptographers",
    de: "chat-control-europa-kryptographen",
    fr: "chat-control-europe-cryptographes",
    es: "chat-control-europa-criptografos",
    it: "chat-control-europa-crittografi",
    nl: "chat-control-europa-cryptografen",
    pt: "chat-control-europa-criptografos",
    sr: "chat-control-evropa-kriptografi",
    hr: "chat-control-europa-kriptografi",
  },
  "how-to-share-api-key-securely": {
    en: "how-to-share-api-key-securely",
    de: "api-schluessel-sicher-teilen",
    fr: "partager-une-cle-api-en-securite",
    es: "compartir-clave-api-de-forma-segura",
    it: "condividere-chiave-api-in-modo-sicuro",
    nl: "api-sleutel-veilig-delen",
    pt: "compartilhar-chave-api-com-seguranca",
    sr: "bezbedno-deljenje-api-kljuca",
    hr: "sigurno-dijeljenje-api-kljuca",
  },
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
  "social-media-bans-children-evidence": {
    en: "social-media-bans-children-evidence",
    de: "social-media-verbote-kinder-evidenz",
    fr: "interdictions-reseaux-sociaux-enfants-preuves",
    es: "prohibiciones-redes-sociales-ninos-evidencia",
    it: "divieti-social-media-minori-evidenze",
    nl: "social-media-verboden-kinderen-bewijs",
    pt: "proibicoes-redes-sociais-criancas-evidencia",
    sr: "zabrane-drustvenih-mreza-za-decu-dokazi",
    hr: "zabrane-drustvenih-mreza-za-djecu-dokazi",
  },
  "how-to-share-a-password-securely": {
    en: "how-to-share-a-password-securely",
    de: "passwort-sicher-teilen",
    fr: "partager-un-mot-de-passe-en-securite",
    es: "como-compartir-una-contrasena-de-forma-segura",
    it: "come-condividere-una-password-in-modo-sicuro",
    nl: "wachtwoord-veilig-delen",
    pt: "como-partilhar-uma-palavra-passe-com-seguranca",
    sr: "kako-bezbedno-podeliti-lozinku",
    hr: "kako-sigurno-podijeliti-lozinku",
  },
  "secrets-in-cicd-env-github-leaks": {
    en: "secrets-in-cicd-env-github-leaks",
    de: "geheimnisse-in-cicd-env-github-lecks",
    fr: "secrets-cicd-env-fuites-github",
    es: "secretos-cicd-env-filtraciones-github",
    it: "segreti-cicd-env-perdite-github",
    nl: "geheimen-in-cicd-env-github-leaks",
    pt: "segredos-cicd-env-vazamentos-github",
    sr: "tajne-u-cicd-env-github-curenja",
    hr: "tajne-u-cicd-env-github-curenja",
  },
  "send-sensitive-documents-securely": {
    en: "send-sensitive-documents-securely",
    de: "sensible-dokumente-sicher-senden",
    fr: "envoyer-documents-sensibles-en-securite",
    es: "enviar-documentos-sensibles-de-forma-segura",
    it: "inviare-documenti-sensibili-in-modo-sicuro",
    nl: "gevoelige-documenten-veilig-versturen",
    pt: "enviar-documentos-sensiveis-com-seguranca",
    sr: "bezbedno-slanje-osetljivih-dokumenata",
    hr: "sigurno-slanje-osjetljivih-dokumenata",
  },
  "how-to-share-ssh-keys-securely": {
    en: "how-to-share-ssh-keys-securely",
    de: "ssh-schluessel-sicher-teilen",
    fr: "partager-cles-ssh-en-securite",
    es: "compartir-claves-ssh-de-forma-segura",
    it: "condividere-chiavi-ssh-in-modo-sicuro",
    nl: "ssh-sleutels-veilig-delen",
    pt: "compartilhar-chaves-ssh-com-seguranca",
    sr: "bezbedno-deljenje-ssh-kljuceva",
    hr: "sigurno-dijeljenje-ssh-kljuceva",
  },
  "android-iphone-rcs-end-to-end-encryption": {
    en: "android-iphone-rcs-end-to-end-encryption",
    de: "android-iphone-rcs-ende-zu-ende-verschluesselung",
    fr: "android-iphone-rcs-chiffrement-de-bout-en-bout",
    es: "android-iphone-rcs-cifrado-de-extremo-a-extremo",
    it: "android-iphone-rcs-crittografia-end-to-end",
    nl: "android-iphone-rcs-end-to-end-encryptie",
    pt: "android-iphone-rcs-criptografia-ponta-a-ponta",
    sr: "android-iphone-rcs-enkripcija-od-kraja-do-kraja",
    hr: "android-iphone-rcs-enkripcija-od-kraja-do-kraja",
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

/** All public blog post paths (canonical English + localized slugs only). */
export function allLocalizedBlogMarketingPaths(): string[] {
  const paths: string[] = [];

  for (const canonical of BLOG_CANONICAL_SLUGS) {
    paths.push(`/blog/${canonical}`);
    for (const language of SUPPORTED_LANGUAGES) {
      if (language === "en") continue;
      paths.push(localizedBlogPostPath(canonical, language));
    }
  }

  return paths;
}

/**
 * If pathname is a legacy English slug under a non-English locale (e.g. /de/blog/one-time-secret-links),
 * return the localized canonical path for a 301 redirect.
 */
export function resolveLegacyBlogPostRedirect(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const match = normalized.match(/^\/([a-z]{2})\/blog\/([^/]+)$/);
  if (!match) return null;

  const [, languageCode, slugFromUrl] = match;
  if (languageCode === "en") return null;
  if (!(SUPPORTED_LANGUAGES as readonly string[]).includes(languageCode)) return null;
  if (!isBlogCanonicalSlug(slugFromUrl)) return null;

  const language = languageCode as SupportedLanguage;
  const localized = localizedBlogSlug(slugFromUrl, language);
  if (localized === slugFromUrl) return null;

  return localizedBlogPostPath(slugFromUrl, language);
}
