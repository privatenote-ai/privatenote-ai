/**
 * Localized strings for small-tier Write-with-AI: scaffolds, output-length rules,
 * ask-anything intent hints, and structured-field labels (parsed cues).
 */

import type { SupportedLanguage } from "@/utils/translation";
import type { ModelTier } from "@shared/modelTier";

/** Matches `PromptTemplate["enhancementType"]` without importing promptTemplates (avoids cycles). */
type PromptEnhancementType = "improve" | "summarize" | "secure" | "ask";

/** Matches sentence-length chip ids used when resolving output length. */
type AiSentenceLengthPresetId = "1-2" | "2-3" | "4-6" | "7-10";

export type AskAnythingIntentRoute =
  | "message"
  | "explain"
  | "list"
  | "rewrite"
  | "default";

function L<T extends Record<SupportedLanguage, string>>(row: T, lang: SupportedLanguage): string {
  return row[lang] ?? row.en;
}

// ── Ask-anything intent (English + locale patterns) ─────────────────────────

function classifyAskAnythingIntentEnglish(u: string): AskAnythingIntentRoute {
  if (
    /\b(bullet|bullets|bullet-?point|outline|numbered\s+list|list\s+of|key\s+points)\b/i.test(u) ||
    /^\s*\d+[\).\]]\s+/m.test(u)
  ) {
    return "list";
  }
  if (
    /\b(why\s|what\s+is\s|what\s+are\s|how\s+does\s|how\s+do\s|explain\s|define\s|meaning\s+of)\b/i.test(u)
  ) {
    return "explain";
  }
  if (
    /\b(rewrite|rephrase|reword|polish|shorten|make\s+it\s+shorter|make\s+it\s+longer|change\s+the\s+tone|more\s+formal|more\s+casual)\b/i.test(
      u,
    )
  ) {
    return "rewrite";
  }
  if (/\b(write|draft|email|e-mail|message|reply|respond|slack|text\s+to)\b/i.test(u)) {
    return "message";
  }
  return "default";
}

function classifyAskAnythingIntentLocale(u: string, language: SupportedLanguage): AskAnythingIntentRoute {
  const listDe =
    /\b(Stichpunkte|Aufzählung|nummerierte\s+Liste|Listenpunkt|Bullet|Gliederung|Übersicht\s+der\s+Punkte)\b/i.test(
      u,
    ) || /^\s*\d+[\).\]]\s+/m.test(u);
  const listFr =
    /\b(liste\s+à\s+puces|à\s+puces|puces|liste\s+numérotée|énumération|points\s+clés)\b/i.test(u) ||
    /^\s*\d+[\).\]]\s+/m.test(u);
  const listEs =
    /\b(lista\s+con\s+viñetas|viñetas|lista\s+numerada|puntos\s+clave|enumeración)\b/i.test(u) ||
    /^\s*\d+[\).\]]\s+/m.test(u);

  const explainDe =
    /\b(warum\s|was\s+ist\s|was\s+sind\s|wie\s+funktioniert|wie\s+geht\s|erkläre|erklär|bedeutung\s+von|definiere)\b/i.test(
      u,
    );
  const explainFr =
    /\b(pourquoi\s|qu'est-?ce\s+que\s|qu’est-?ce\s+que\s|c'est\s+quoi\s|ce\s+est\s+quoi\s|explique|expliquez|définis|définissez|signification)\b/i.test(
      u,
    );
  const explainEs =
    /\b(por\s+qué\s|porque\s|qué\s+es\s|cómo\s+funciona|cómo\s+se\s|explica|explicar|define|definir|significado)\b/i.test(
      u,
    );

  const rewriteDe =
    /\b(umschreiben|umformulieren|formulier|kürzen|verkürzen|länger\s+machen|kürzer\s+machen|formeller|informeller|Ton\s+ändern|anders\s+formulieren)\b/i.test(
      u,
    );
  const rewriteFr =
    /\b(réécr|réécri|reformul|raccourcir|allonger|plus\s+formel|plus\s+informel|changer\s+le\s+ton)\b/i.test(
      u,
    );
  const rewriteEs =
    /\b(reescrib|reformul|acortar|alargar|más\s+formal|más\s+informal|cambiar\s+el\s+tono)\b/i.test(u);

  const messageDe =
    /\b(schreib|schreibe|schreibt|email|e-?mail|nachricht|antwort|antworte|an\s+.+\s+schreiben)\b/i.test(u);
  const messageFr =
    /\b(écris|écrire|écrivez|mail|e-?mail|courriel|message|répond|réponse)\b/i.test(u);
  const messageEs =
    /\b(escrib|escribe|redact|correo|e-?mail|mensaje|responde|respuesta)\b/i.test(u);

  if (language === "de") {
    if (listDe) return "list";
    if (explainDe) return "explain";
    if (rewriteDe) return "rewrite";
    if (messageDe) return "message";
  }
  if (language === "fr") {
    if (listFr) return "list";
    if (explainFr) return "explain";
    if (rewriteFr) return "rewrite";
    if (messageFr) return "message";
  }
  if (language === "es") {
    if (listEs) return "list";
    if (explainEs) return "explain";
    if (rewriteEs) return "rewrite";
    if (messageEs) return "message";
  }
  return "default";
}

export function classifyAskAnythingIntentForLocale(
  userInput: string,
  language: SupportedLanguage,
): AskAnythingIntentRoute {
  const u = userInput.trim();
  if (!u) return "default";
  if (language !== "en") {
    const loc = classifyAskAnythingIntentLocale(u, language);
    if (loc !== "default") return loc;
  }
  return classifyAskAnythingIntentEnglish(u);
}

/** @internal exported for tests that need English-only routing */
export function classifyAskAnythingIntentEnglishOnly(userInput: string): AskAnythingIntentRoute {
  const u = userInput.trim();
  if (!u) return "default";
  return classifyAskAnythingIntentEnglish(u);
}

const ASK_INTENT: Record<AskAnythingIntentRoute, Record<SupportedLanguage, string>> = {
  message: {
    en: "Intent: write a message or email.\n- Output only the finished message.\n- No meta advice.",
    de: "Absicht: Nachricht oder E-Mail schreiben.\n- Nur den fertigen Text ausgeben.\n- Keine Meta-Hinweise.",
    fr: "Intention : rédiger un message ou un e-mail.\n- Sors uniquement le texte final.\n- Pas de méta-conseils.",
    es: "Intención: escribir un mensaje o correo.\n- Solo el texto terminado.\n- Sin consejos meta.",
  },
  explain: {
    en: "Intent: answer or explain.\n- Use plain sentences.\n- No greeting unless the user asked for a message.",
    de: "Absicht: antworten oder erklären.\n- Klare Sätze.\n- Keine Begrüßung, außer der Nutzer wollte eine Nachricht.",
    fr: "Intention : répondre ou expliquer.\n- Phrases simples.\n- Pas de salutation sauf si l’utilisateur a demandé un message.",
    es: "Intención: responder o explicar.\n- Frases claras.\n- Sin saludo salvo que pidan un mensaje.",
  },
  list: {
    en: "Intent: list.\n- Use plain bullets (- or •).\n- No long intro before the list.",
    de: "Absicht: Liste.\n- Normale Aufzählungszeichen (- oder •).\n- Keine lange Einleitung vor der Liste.",
    fr: "Intention : liste.\n- Puces simples (- ou •).\n- Pas d’intro longue avant la liste.",
    es: "Intención: lista.\n- Viñetas simples (- o •).\n- Sin introducción larga antes de la lista.",
  },
  rewrite: {
    en: "Intent: rewrite.\n- Keep the same facts.\n- Output only the rewritten text.",
    de: "Absicht: umschreiben.\n- Gleiche Fakten behalten.\n- Nur den umgeschriebenen Text ausgeben.",
    fr: "Intention : réécrire.\n- Garde les mêmes faits.\n- Sors uniquement le texte réécrit.",
    es: "Intención: reescribir.\n- Conserva los mismos hechos.\n- Solo el texto reescrito.",
  },
  default: {
    en: "Intent: follow the request exactly.\n- Output only what the user asked for.\n- No extra commentary.",
    de: "Absicht: der Anfrage exakt folgen.\n- Nur ausgeben, was der Nutzer wollte.\n- Kein zusätzlicher Kommentar.",
    fr: "Intention : suivre exactement la demande.\n- Sors uniquement ce qui a été demandé.\n- Pas de commentaire en plus.",
    es: "Intención: seguir exactamente la petición.\n- Solo lo pedido.\n- Sin comentarios extra.",
  },
};

export function getLocalizedAskAnythingIntentSection(
  route: AskAnythingIntentRoute,
  language: SupportedLanguage,
): string {
  return L(ASK_INTENT[route], language);
}

// ── Medium tier extra line ──────────────────────────────────────────────────

const MEDIUM_STRAIGHTFORWARD: Record<SupportedLanguage, string> = {
  en: "Keep sentences straightforward.",
  de: "Halte die Sätze sachlich und verständlich.",
  fr: "Garde des phrases simples et directes.",
  es: "Mantén las frases claras y directas.",
};

export function getLocalizedMediumStraightforwardLine(language: SupportedLanguage): string {
  return MEDIUM_STRAIGHTFORWARD[language] ?? MEDIUM_STRAIGHTFORWARD.en;
}

// ── Output length (all tiers / types) ─────────────────────────────────────────

export function getLocalizedOutputLengthInstruction(
  tier: ModelTier,
  enhancementType: PromptEnhancementType,
  language: SupportedLanguage,
): string {
  if (enhancementType === "summarize") {
    if (tier === "small") {
      return L(
        {
          en: "Output length: at most 4 bullet points. One short sentence per bullet. Use plain bullets only.",
          de: "Ausgabelänge: höchstens 4 Stichpunkte. Ein kurzer Satz pro Punkt. Nur einfache Aufzählungszeichen.",
          fr: "Longueur : au plus 4 puces. Une courte phrase par puce. Puces simples uniquement.",
          es: "Longitud: como máximo 4 viñetas. Una frase corta por viñeta. Solo viñetas simples.",
        },
        language,
      );
    }
    if (tier === "medium") {
      return L(
        {
          en: "Output length: about 4–7 bullets. One clear sentence per bullet.",
          de: "Ausgabelänge: etwa 4–7 Stichpunkte. Ein klarer Satz pro Punkt.",
          fr: "Longueur : environ 4 à 7 puces. Une phrase claire par puce.",
          es: "Longitud: unas 4–7 viñetas. Una frase clara por viñeta.",
        },
        language,
      );
    }
    return L(
      {
        en: "Output length: about 5–10 bullets. Keep bullets scannable and non-redundant.",
        de: "Ausgabelänge: etwa 5–10 Stichpunkte. Stichpunkte scanbar und ohne Wiederholungen.",
        fr: "Longueur : environ 5 à 10 puces. Reste lisible et sans redondance.",
        es: "Longitud: unas 5–10 viñetas. Que se lean fácil y sin repetir.",
      },
      language,
    );
  }

  if (enhancementType === "secure") {
    if (tier === "small") {
      return L(
        {
          en: "Output length: keep the same structure as the input. Replace only sensitive spans with [REDACTED]. No explanation.",
          de: "Ausgabelänge: gleiche Struktur wie die Eingabe. Nur sensible Stellen durch [REDACTED] ersetzen. Keine Erklärung.",
          fr: "Longueur : garde la même structure que l’entrée. Remplace seulement les passages sensibles par [REDACTED]. Pas d’explication.",
          es: "Longitud: misma estructura que la entrada. Solo sustituye tramos sensibles por [REDACTED]. Sin explicación.",
        },
        language,
      );
    }
    return L(
      {
        en: "Output length: match the input layout and redact in place only.",
        de: "Ausgabelänge: Layout der Eingabe beibehalten und nur an Ort und Stelle schwärzen.",
        fr: "Longueur : reprends la mise en forme d’entrée et masque sur place seulement.",
        es: "Longitud: igual que el formato de entrada y censura solo en el lugar.",
      },
      language,
    );
  }

  if (enhancementType === "ask") {
    if (tier === "small") {
      return L(
        {
          en: "Output length: 2–4 short sentences, unless the user clearly asked for bullets or steps.",
          de: "Ausgabelänge: 2–4 kurze Sätze, außer der Nutzer will klar Stichpunkte oder Schritte.",
          fr: "Longueur : 2 à 4 phrases courtes, sauf si l’utilisateur veut clairement des puces ou des étapes.",
          es: "Longitud: 2–4 frases cortas, salvo que pidan viñetas o pasos.",
        },
        language,
      );
    }
    if (tier === "medium") {
      return L(
        {
          en: "Output length: about 3–6 sentences, or a compact bullet list if clearer.",
          de: "Ausgabelänge: etwa 3–6 Sätze, oder eine kompakte Liste wenn klarer.",
          fr: "Longueur : environ 3 à 6 phrases, ou une liste à puces compacte si plus clair.",
          es: "Longitud: unas 3–6 frases, o una lista breve si queda más claro.",
        },
        language,
      );
    }
    return L(
      {
        en: "Output length: about 4–10 sentences unless a shorter answer fits better.",
        de: "Ausgabelänge: etwa 4–10 Sätze, außer eine kürzere Antwort passt besser.",
        fr: "Longueur : environ 4 à 10 phrases sauf si une réponse plus courte convient mieux.",
        es: "Longitud: unas 4–10 frases salvo que una respuesta más corta encaje mejor.",
      },
      language,
    );
  }

  if (tier === "small") {
    return L(
      {
        en: "Output length: 2–3 short sentences unless the user clearly needs more.",
        de: "Ausgabelänge: 2–3 kurze Sätze, außer der Nutzer braucht klar mehr.",
        fr: "Longueur : 2 à 3 phrases courtes sauf si l’utilisateur a clairement besoin de plus.",
        es: "Longitud: 2–3 frases cortas salvo que haga falta más.",
      },
      language,
    );
  }
  if (tier === "medium") {
    return L(
      {
        en: "Output length: about 3–5 sentences unless the user asks for longer or shorter.",
        de: "Ausgabelänge: etwa 3–5 Sätze, außer der Nutzer will länger oder kürzer.",
        fr: "Longueur : environ 3 à 5 phrases sauf demande plus long ou plus court.",
        es: "Longitud: unas 3–5 frases salvo que pidan más largo o más corto.",
      },
      language,
    );
  }
  return L(
    {
      en: "Output length: about 4–8 sentences unless the user specifies a different length.",
      de: "Ausgabelänge: etwa 4–8 Sätze, außer der Nutzer nennt eine andere Länge.",
      fr: "Longueur : environ 4 à 8 phrases sauf autre longueur demandée.",
      es: "Longitud: unas 4–8 frases salvo otra longitud indicada.",
    },
    language,
  );
}

const RANGE: Record<AiSentenceLengthPresetId, string> = {
  "1-2": "1–2",
  "2-3": "2–3",
  "4-6": "4–6",
  "7-10": "7–10",
};

export function getLocalizedResolveOutputLengthLine(
  tier: ModelTier,
  enhancementType: PromptEnhancementType,
  preset: AiSentenceLengthPresetId | undefined,
  language: SupportedLanguage,
): string {
  const base = getLocalizedOutputLengthInstruction(tier, enhancementType, language);
  if (!preset || enhancementType === "secure") return base;
  const range = RANGE[preset];
  if (enhancementType === "summarize") {
    return L(
      {
        en: `Output length: about ${range} short summary sentences (or the same coverage as concise bullets).`,
        de: `Ausgabelänge: etwa ${range} kurze Satz-Zusammenfassungen (oder gleiche Abdeckung wie knappe Stichpunkte).`,
        fr: `Longueur : environ ${range} phrases de résumé courtes (ou même couverture qu’en puces concises).`,
        es: `Longitud: unas ${range} frases de resumen breves (o la misma cobertura que viñetas concisas).`,
      },
      language,
    );
  }
  return L(
    {
      en: `Output length: about ${range} complete sentences unless the user asked for bullets, a list, or a different format.`,
      de: `Ausgabelänge: etwa ${range} vollständige Sätze, außer der Nutzer wollte Stichpunkte, eine Liste oder ein anderes Format.`,
      fr: `Longueur : environ ${range} phrases complètes sauf si l’utilisateur a demandé des puces, une liste ou un autre format.`,
      es: `Longitud: unas ${range} frases completas salvo que pidan viñetas, lista u otro formato.`,
    },
    language,
  );
}

/** Ultra-small WebLLM: tight output-length overrides + preset refinement. */
export function getLocalizedUltraSmallOutputLengthLines(
  enhancementType: PromptEnhancementType,
  preset: AiSentenceLengthPresetId | undefined,
  language: SupportedLanguage,
): string {
  let lengthLine: string;
  if (enhancementType === "summarize") {
    lengthLine = L(
      {
        en: "Output length: at most 3 bullets or 3 short sentences. One fact per line. No intro paragraph.",
        de: "Ausgabelänge: höchstens 3 Stichpunkte oder 3 kurze Sätze. Ein Fakt pro Zeile. Kein Einleitungsabsatz.",
        fr: "Longueur : au plus 3 puces ou 3 phrases courtes. Un fait par ligne. Pas d’intro.",
        es: "Longitud: como máximo 3 viñetas o 3 frases cortas. Un hecho por línea. Sin párrafo introductorio.",
      },
      language,
    );
  } else if (enhancementType === "ask") {
    lengthLine = L(
      {
        en: "Output length: 1–3 short sentences unless the user clearly asked for bullets, a list, or a longer reply.",
        de: "Ausgabelänge: 1–3 kurze Sätze, außer der Nutzer will klar Stichpunkte, eine Liste oder eine längere Antwort.",
        fr: "Longueur : 1 à 3 phrases courtes sauf puces, liste ou réponse plus longue clairement demandée.",
        es: "Longitud: 1–3 frases cortas salvo viñetas, lista o respuesta más larga pedida con claridad.",
      },
      language,
    );
  } else if (enhancementType === "secure") {
    lengthLine = L(
      {
        en: "Output length: same structure as input. Replace only sensitive spans with [REDACTED]. One pass, no commentary.",
        de: "Ausgabelänge: gleiche Struktur wie die Eingabe. Nur sensible Stellen durch [REDACTED]. Ein Durchgang, kein Kommentar.",
        fr: "Longueur : même structure que l’entrée. Remplace seulement par [REDACTED]. Une passe, pas de commentaire.",
        es: "Longitud: misma estructura que la entrada. Solo [REDACTED] en tramos sensibles. Una pasada, sin comentario.",
      },
      language,
    );
  } else {
    lengthLine = L(
      {
        en: "Output length: 1–3 short sentences unless the user clearly needs more.",
        de: "Ausgabelänge: 1–3 kurze Sätze, außer der Nutzer braucht klar mehr.",
        fr: "Longueur : 1 à 3 phrases courtes sauf besoin clair de plus.",
        es: "Longitud: 1–3 frases cortas salvo que haga falta más.",
      },
      language,
    );
  }

  if (preset && enhancementType !== "secure") {
    const range = RANGE[preset];
    if (enhancementType === "summarize") {
      lengthLine = L(
        {
          en: `Output length: about ${range} very short lines (bullets or sentences). No intro.`,
          de: `Ausgabelänge: etwa ${range} sehr kurze Zeilen (Stichpunkte oder Sätze). Keine Einleitung.`,
          fr: `Longueur : environ ${range} lignes très courtes (puces ou phrases). Pas d’intro.`,
          es: `Longitud: unas ${range} líneas muy cortas (viñetas o frases). Sin intro.`,
        },
        language,
      );
    } else {
      lengthLine = L(
        {
          en: `Output length: about ${range} short sentences; stay tight for on-device limits.`,
          de: `Ausgabelänge: etwa ${range} kurze Sätze; wegen Gerätelimits knapp bleiben.`,
          fr: `Longueur : environ ${range} phrases courtes ; reste compact pour les limites locales.`,
          es: `Longitud: unas ${range} frases cortas; compacto por límites del dispositivo.`,
        },
        language,
      );
    }
  }

  return lengthLine;
}

// ── Small instruction scaffolds ───────────────────────────────────────────

const SCAFFOLD_DEFAULT: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Start naturally.",
    "- State the main point clearly.",
    "- Use only details from the USER REQUEST.",
    "- End with one short natural closing line if it fits.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Natürlich beginnen.",
    "- Hauptpunkt klar sagen.",
    "- Nur Details aus der NUTZERANFRAGE.",
    "- Optional: eine kurze Schlusszeile.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Commence naturellement.",
    "- Énonce l’idée principale clairement.",
    "- Utilise uniquement les détails de la DEMANDE.",
    "- Termine par une courte phrase de clôture si ça convient.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Empieza de forma natural.",
    "- Enuncia el punto principal con claridad.",
    "- Solo detalles de la SOLICITUD.",
    "- Cierra con una línea breve si encaja.",
  ].join("\n"),
};

const SCAFFOLD_ASK: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Follow the exact user request.",
    "- Output only the final text.",
    "- No intro like “Sure” or “Here is”.",
    "- No explanations unless the user asked for explanation.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Der Nutzeranfrage exakt folgen.",
    "- Nur den fertigen Text ausgeben.",
    "- Kein Vorwort wie „Klar“ oder „Hier ist“.",
    "- Keine Erklärungen, außer der Nutzer wollte eine.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Suis exactement la demande.",
    "- Sors uniquement le texte final.",
    "- Pas d’intro du type « Bien sûr » ou « Voici ».",
    "- Pas d’explications sauf si demandé.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Sigue exactamente la petición.",
    "- Solo el texto final.",
    "- Sin intro tipo « Claro » o « Aquí tienes ».",
    "- Sin explicaciones salvo que las pidan.",
  ].join("\n"),
};

const SCAFFOLD_THANK: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Address the person exactly as the user described them.",
    "- Thank them for the specific help, gift, or action.",
    "- Add one short sincere line.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Die Person ansprechen wie vom Nutzer beschrieben.",
    "- Für die konkrete Hilfe, das Geschenk oder die Tat danken.",
    "- Eine kurze aufrichtige Zeile hinzufügen.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Salue la personne comme décrit par l’utilisateur.",
    "- Remercie pour l’aide, le cadeau ou l’action précise.",
    "- Ajoute une courte phrase sincère.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Dirige al destinatario como describió el usuario.",
    "- Agradece la ayuda, regalo o acción concreta.",
    "- Añade una línea breve y sincera.",
  ].join("\n"),
};

const SCAFFOLD_MEETING: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Greet the person with the exact name or title from the user request.",
    "- State that you want to schedule a meeting.",
    "- Mention the topic clearly.",
    "- If the user gave times, include them. Otherwise ask for availability.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Mit exaktem Namen oder Titel aus der Anfrage grüßen.",
    "- Klar sagen, dass du ein Treffen planen möchtest.",
    "- Das Thema deutlich nennen.",
    "- Zeiten nur, wenn angegeben; sonst nach Verfügbarkeit fragen.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Salue avec le nom ou titre exact de la demande.",
    "- Dis que tu souhaites planifier un rendez-vous.",
    "- Mentionne le sujet clairement.",
    "- Inclus les horaires si fournis, sinon demande les disponibilités.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Saluda con el nombre o cargo exactos de la petición.",
    "- Di que quieres programar una reunión.",
    "- Cita el tema con claridad.",
    "- Incluye horarios si los dieron; si no, pide disponibilidad.",
  ].join("\n"),
};

const SCAFFOLD_BIRTHDAY: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Start with a birthday wish.",
    "- Use the exact name if the user provided one.",
    "- Mention relationship, memory, joke, age, or hobby only if the user included it.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Mit einem Geburtstagswunsch beginnen.",
    "- Exakten Namen verwenden, falls genannt.",
    "- Beziehung, Erinnerung, Witz, Alter oder Hobby nur, wenn der Nutzer es nannte.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Commence par un vœu d’anniversaire.",
    "- Utilise le nom exact si fourni.",
    "- Relation, souvenir, blague, âge ou loisir seulement si mentionné.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Empieza con un deseo de cumpleaños.",
    "- Usa el nombre exacto si lo dieron.",
    "- Relación, recuerdo, broma, edad u hobby solo si lo incluyeron.",
  ].join("\n"),
};

const SCAFFOLD_APOLOGY: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Apologize clearly for the exact issue the user described.",
    "- Do not be defensive.",
    "- Mention a fix only if the user gave one.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Klar für das genannte Problem entschuldigen.",
    "- Nicht defensiv sein.",
    "- Wiedergutmachung nur nennen, wenn der Nutzer sie nannte.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Excuse-toi clairement pour le problème décrit.",
    "- Pas de ton défensif.",
    "- Mentionne une réparation seulement si l’utilisateur en a donné une.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Disculpa con claridad por lo descrito.",
    "- Sin tono defensivo.",
    "- Menciona cómo enmendarlo solo si lo indicaron.",
  ].join("\n"),
};

const SCAFFOLD_LOVE: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Keep it warm and personal.",
    "- Mention only the feelings or details the user gave.",
    "- Do not invent memories or promises.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Warm und persönlich bleiben.",
    "- Nur Gefühle oder Details nennen, die der Nutzer gab.",
    "- Keine erfundenen Erinnerungen oder Versprechen.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Reste chaleureux et personnel.",
    "- Mentionne seulement sentiments ou détails fournis.",
    "- N’invente pas de souvenirs ni de promesses.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Cálido y personal.",
    "- Solo sentimientos o datos que dio el usuario.",
    "- No inventes recuerdos ni promesas.",
  ].join("\n"),
};

const SCAFFOLD_CONGRATS: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Congratulate the person on the exact achievement named by the user.",
    "- Add one short proud or supportive line.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Zur genannten Leistung gratulieren.",
    "- Eine kurze stolze oder unterstützende Zeile hinzufügen.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Félicite pour la réussite précise indiquée.",
    "- Ajoute une courte phrase fière ou encourageante.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Felicita por el logro indicado.",
    "- Añade una línea breve de orgullo o apoyo.",
  ].join("\n"),
};

const SCAFFOLD_FAREWELL: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Thank the person or group for what the user actually mentioned.",
    "- Keep the tone warm and positive.",
    "- Include a memory only if the user gave one.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Für das Genannte danken.",
    "- Ton warm und positiv.",
    "- Erinnerung nur, wenn der Nutzer sie nannte.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Remercie pour ce que l’utilisateur a mentionné.",
    "- Ton chaleureux et positif.",
    "- Souvenir seulement si fourni.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Agradece por lo que mencionó el usuario.",
    "- Tono cálido y positivo.",
    "- Recuerdo solo si lo dieron.",
  ].join("\n"),
};

const SCAFFOLD_INVITE: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- State the event clearly.",
    "- Include date, time, and place only if the user gave them.",
    "- Mention RSVP or what to bring only if the user asked.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Veranstaltung klar nennen.",
    "- Datum, Uhrzeit und Ort nur, wenn angegeben.",
    "- RSVP oder Mitbringen nur, wenn der Nutzer es wollte.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Précise l’événement clairement.",
    "- Date, heure et lieu seulement si fournis.",
    "- RSVP ou quoi apporter seulement si demandé.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Describe el evento con claridad.",
    "- Fecha, hora y lugar solo si los dieron.",
    "- RSVP o qué llevar solo si lo pidieron.",
  ].join("\n"),
};

const SCAFFOLD_CONDOLENCE: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Be gentle and simple.",
    "- Mention only the loss or hard moment named by the user.",
    "- Add one short supportive line.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- Sanft und einfach bleiben.",
    "- Nur den vom Nutzer genannten Verlust oder Moment nennen.",
    "- Eine kurze unterstützende Zeile.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Doux et simple.",
    "- Mentionne seulement la perte ou le moment nommé.",
    "- Une courte phrase de soutien.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Suave y sencillo.",
    "- Solo la pérdida o momento nombrado.",
    "- Una línea breve de apoyo.",
  ].join("\n"),
};

const SCAFFOLD_REMINDER: Record<SupportedLanguage, string> = {
  en: [
    "How to write it:",
    "- Say what the reminder is about in plain words.",
    "- Include deadline, time, or link only if the user gave them.",
    "- Keep it polite and not pushy.",
  ].join("\n"),
  de: [
    "So schreibst du es:",
    "- In einfachen Worten sagen, woran erinnert wird.",
    "- Frist, Zeit oder Link nur, wenn angegeben.",
    "- Höflich und nicht aufdringlich.",
  ].join("\n"),
  fr: [
    "Comment l’écrire :",
    "- Dis clairement le sujet du rappel.",
    "- Échéance, heure ou lien seulement si fournis.",
    "- Poli, sans insister.",
  ].join("\n"),
  es: [
    "Cómo escribirlo:",
    "- Di en palabras claras de qué es el recordatorio.",
    "- Plazo, hora o enlace solo si los dieron.",
    "- Cortés, sin presionar.",
  ].join("\n"),
};

const SCAFFOLD_SUMMARY: Record<SupportedLanguage, string> = {
  en: [
    "How to summarize:",
    "- Use plain bullets only.",
    "- One main idea per bullet.",
    "- No repeated points.",
    "- Focus on the most important facts, decisions, or takeaways.",
  ].join("\n"),
  de: [
    "So fasst du zusammen:",
    "- Nur einfache Stichpunkte.",
    "- Eine Hauptidee pro Punkt.",
    "- Keine Wiederholungen.",
    "- Wichtigste Fakten, Entscheidungen oder Erkenntnisse.",
  ].join("\n"),
  fr: [
    "Comment résumer :",
    "- Puces simples seulement.",
    "- Une idée principale par puce.",
    "- Pas de répétition.",
    "- Faits, décisions ou enseignements les plus importants.",
  ].join("\n"),
  es: [
    "Cómo resumir:",
    "- Solo viñetas simples.",
    "- Una idea principal por viñeta.",
    "- Sin repetir.",
    "- Hechos, decisiones o conclusiones más importantes.",
  ].join("\n"),
};

const SCAFFOLD_PRIVACY: Record<SupportedLanguage, string> = {
  en: [
    "How to redact:",
    "- Keep the original wording and order.",
    "- Replace only sensitive spans with [REDACTED].",
    "- Do not summarize.",
    "- Do not explain the changes.",
  ].join("\n"),
  de: [
    "So schwärzt du:",
    "- Originalwortlaut und Reihenfolge beibehalten.",
    "- Nur sensible Stellen durch [REDACTED] ersetzen.",
    "- Nicht zusammenfassen.",
    "- Änderungen nicht erklären.",
  ].join("\n"),
  fr: [
    "Comment masquer :",
    "- Garde la formulation et l’ordre d’origine.",
    "- Remplace seulement les passages sensibles par [REDACTED].",
    "- Ne résume pas.",
    "- N’explique pas les changements.",
  ].join("\n"),
  es: [
    "Cómo redactar/censurar:",
    "- Conserva la redacción y el orden originales.",
    "- Solo sustituye tramos sensibles por [REDACTED].",
    "- No resumas.",
    "- No expliques los cambios.",
  ].join("\n"),
};

const SCAFFOLD_BY_ID: Record<string, Record<SupportedLanguage, string>> = {
  "ask-anything": SCAFFOLD_ASK,
  "thank-you": SCAFFOLD_THANK,
  "meeting-request": SCAFFOLD_MEETING,
  birthday: SCAFFOLD_BIRTHDAY,
  apology: SCAFFOLD_APOLOGY,
  love: SCAFFOLD_LOVE,
  congratulations: SCAFFOLD_CONGRATS,
  farewell: SCAFFOLD_FAREWELL,
  invitation: SCAFFOLD_INVITE,
  condolence: SCAFFOLD_CONDOLENCE,
  reminder: SCAFFOLD_REMINDER,
  "document-summary": SCAFFOLD_SUMMARY,
  "privacy-check": SCAFFOLD_PRIVACY,
};

export function getLocalizedSmallInstructionScaffold(
  template: { id: string; enhancementType: PromptEnhancementType },
  tier: ModelTier,
  language: SupportedLanguage,
): string {
  if (tier !== "small") return "";
  if (template.enhancementType === "summarize" || template.enhancementType === "secure") {
    return L(SCAFFOLD_BY_ID[template.id] ?? SCAFFOLD_SUMMARY, language);
  }
  if (template.enhancementType === "improve" || template.enhancementType === "ask") {
    const row = SCAFFOLD_BY_ID[template.id];
    return L(row ?? SCAFFOLD_DEFAULT, language);
  }
  return "";
}

// ── Parsed cues (structured hints) ───────────────────────────────────────────

const PARSED_CUES_PREFIX: Record<SupportedLanguage, string> = {
  en: "Parsed cues (verify against USER REQUEST; ignore these lines if they disagree):\n",
  de: "Geparste Hinweise (mit NUTZERANFRAGE abgleichen; bei Widerspruch diese Zeilen ignorieren):\n",
  fr: "Indices analysés (vérifie avec la DEMANDE ; ignore ces lignes si elles ne correspondent pas) :\n",
  es: "Pistas analizadas (coteja con la SOLICITUD; ignora estas líneas si no coinciden):\n",
};

const RECIPIENT_LABEL: Record<SupportedLanguage, string> = {
  en: "Recipient",
  de: "Empfänger",
  fr: "Destinataire",
  es: "Destinatario",
};

export type StructuredSecondLabelKey =
  | "purpose_topic"
  | "what_to_address"
  | "reason"
  | "achievement"
  | "topic";

const SECOND_LABEL: Record<StructuredSecondLabelKey, Record<SupportedLanguage, string>> = {
  purpose_topic: {
    en: "Purpose / topic",
    de: "Zweck / Thema",
    fr: "Objet / sujet",
    es: "Propósito / tema",
  },
  what_to_address: {
    en: "What to address",
    de: "Was angesprochen werden soll",
    fr: "Point à traiter",
    es: "Qué abordar",
  },
  reason: {
    en: "Reason",
    de: "Grund",
    fr: "Raison",
    es: "Motivo",
  },
  achievement: {
    en: "Achievement",
    de: "Erfolg",
    fr: "Réussite",
    es: "Logro",
  },
  topic: {
    en: "Topic",
    de: "Thema",
    fr: "Sujet",
    es: "Tema",
  },
};

export function getStructuredHintParsedCuesPrefix(language: SupportedLanguage): string {
  return PARSED_CUES_PREFIX[language] ?? PARSED_CUES_PREFIX.en;
}

export function getStructuredHintRecipientLabel(language: SupportedLanguage): string {
  return RECIPIENT_LABEL[language] ?? RECIPIENT_LABEL.en;
}

export function getStructuredSecondLabel(
  key: StructuredSecondLabelKey,
  language: SupportedLanguage,
): string {
  return SECOND_LABEL[key][language] ?? SECOND_LABEL[key].en;
}

const MEETING_HINT_INTRO: Record<SupportedLanguage, string> = {
  en: "Best-effort cues (auto-parsed; if anything does not match the USER REQUEST, ignore these lines and use the request only):\n",
  de: "Best-effort-Hinweise (automatisch erkannt; wenn etwas nicht zur NUTZERANFRAGE passt, diese Zeilen ignorieren und nur die Anfrage nutzen):\n",
  fr: "Indices approximatifs (auto-analysés ; si quelque chose ne correspond pas à la DEMANDE, ignore ces lignes et utilise seulement la demande) :\n",
  es: "Pistas aproximadas (auto-analizadas; si algo no coincide con la SOLICITUD, ignora estas líneas y usa solo la petición):\n",
};

const MEETING_RECIPIENT_LINE: Record<SupportedLanguage, string> = {
  en: "- Recipient (from user): ",
  de: "- Empfänger (vom Nutzer): ",
  fr: "- Destinataire (fourni par l’utilisateur) : ",
  es: "- Destinatario (según el usuario): ",
};

const MEETING_TOPIC_LINE: Record<SupportedLanguage, string> = {
  en: "- Purpose / topic (from user): ",
  de: "- Zweck / Thema (vom Nutzer): ",
  fr: "- Objet / sujet (fourni par l’utilisateur) : ",
  es: "- Propósito / tema (según el usuario): ",
};

export function buildLocalizedMeetingStructuredHint(
  recipient: string,
  topic: string,
  language: SupportedLanguage,
): string {
  return (
    L(MEETING_HINT_INTRO, language) +
    L(MEETING_RECIPIENT_LINE, language) +
    recipient +
    "\n" +
    L(MEETING_TOPIC_LINE, language) +
    topic +
    "\n\n"
  );
}
