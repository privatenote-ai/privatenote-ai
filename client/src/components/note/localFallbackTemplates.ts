import type { AiSentenceLengthId } from "./promptTemplates";
import type { SupportedLanguage } from "@/utils/translation";
import {
  type GuidedWritingPlaceholder,
  type GuidedWritingTone,
  type GuidedWritingAudience,
  type GuidedWritingStyle,
  type GuidedWritingSensitivity,
  type LocalFallbackTemplateOption,
  type GuidedWritingTemplateRecord,
  type GuidedWritingTemplateSet,
  type GuidedWritingSentenceBucketId,
  LOCAL_FALLBACK_TEMPLATE_IDS,
  type LocalFallbackTemplateId,
  STANDARD_GUIDED_WRITING_BUCKETS,
  isLocalFallbackTemplateId,
} from "./localFallbackShared";
import { GUIDED_WRITING_TEMPLATES_EN } from "./guidedWritingTemplatesEn";
import { GUIDED_WRITING_TEMPLATES_DE } from "./guidedWritingTemplatesDe";
import { GUIDED_WRITING_TEMPLATES_FR } from "./guidedWritingTemplatesFr";
import { GUIDED_WRITING_TEMPLATES_ES } from "./guidedWritingTemplatesEs";

export type {
  GuidedWritingTone,
  GuidedWritingAudience,
  GuidedWritingStyle,
  GuidedWritingSensitivity,
  GuidedWritingPlaceholder,
  GuidedWritingTemplateOption,
} from "./localFallbackShared";

export { LOCAL_FALLBACK_TEMPLATE_IDS, type LocalFallbackTemplateId };

const GUIDED_BY_LANG: Record<
  SupportedLanguage,
  GuidedWritingTemplateRecord
> = {
  en: GUIDED_WRITING_TEMPLATES_EN,
  de: GUIDED_WRITING_TEMPLATES_DE,
  fr: GUIDED_WRITING_TEMPLATES_FR,
  es: GUIDED_WRITING_TEMPLATES_ES,
};

export const GUIDED_WRITING_PLACEHOLDER_LABELS = {
  recipientName: "Recipient name",
  groupName: "Person or group",
  topic: "Topic",
  mainMessage: "Main message",
  reason: "Reason",
  relevantDetail: "Relevant detail",
  specificDetail: "Specific detail",
  timeframe: "Timeframe",
  extraDetail: "Extra detail",
  nextStep: "Next step",
  actionTaken: "What they did",
  supportType: "Help, gift, or support",
  result: "Result",
  resultOrSituation: "Result or situation",
  positiveResult: "Positive result",
  dayOrTime: "Day or time",
  alternateTime: "Alternate time",
  issue: "Issue",
  happened: "What happened",
  impact: "Impact",
  fixStep: "How to make it right",
  quality: "Quality",
  feeling: "Feeling",
  memory: "Memory or detail",
  achievement: "Achievement",
  eventName: "Event",
  occasion: "Occasion",
  date: "Date",
  time: "Time",
  place: "Place",
  rsvpDate: "RSVP date",
  eventDetail: "Event detail",
  loss: "Loss",
  personName: "Person's name",
  tribute: "Simple tribute",
  task: "Task",
  deadline: "Deadline",
  item: "Item",
  joyWish: "Joy, success, or adventure",
  goalOrWish: "Goal or wish",
  hopeOrGoal: "Hope or goal",
} as const;

const PLACEHOLDER_LABELS_BY_LANG: Record<
  SupportedLanguage,
  Record<GuidedWritingPlaceholder, string>
> = {
  en: GUIDED_WRITING_PLACEHOLDER_LABELS,
  de: {
    recipientName: "Empfängername",
    groupName: "Person oder Gruppe",
    topic: "Thema",
    mainMessage: "Kernbotschaft",
    reason: "Grund",
    relevantDetail: "Relevantes Detail",
    specificDetail: "Konkretes Detail",
    timeframe: "Zeitraum",
    extraDetail: "Zusatzdetail",
    nextStep: "Nächster Schritt",
    actionTaken: "Was sie getan haben",
    supportType: "Hilfe, Geschenk oder Unterstützung",
    result: "Ergebnis",
    resultOrSituation: "Ergebnis oder Situation",
    positiveResult: "Positives Ergebnis",
    dayOrTime: "Tag oder Uhrzeit",
    alternateTime: "Alternative Zeit",
    issue: "Thema / Problem",
    happened: "Was passiert ist",
    impact: "Auswirkung",
    fixStep: "Wiedergutmachung",
    quality: "Eigenschaft",
    feeling: "Gefühl",
    memory: "Erinnerung oder Detail",
    achievement: "Erfolg / Meilenstein",
    eventName: "Veranstaltung",
    occasion: "Anlass",
    date: "Datum",
    time: "Uhrzeit",
    place: "Ort",
    rsvpDate: "Antwort bis",
    eventDetail: "Veranstaltungsdetail",
    loss: "Verlust",
    personName: "Name der Person",
    tribute: "Einfache Würdigung",
    task: "Aufgabe",
    deadline: "Frist",
    item: "Punkt",
    joyWish: "Freude, Erfolg oder Abenteuer",
    goalOrWish: "Wunsch oder Ziel",
    hopeOrGoal: "Hoffnung oder Ziel",
  },
  fr: {
    recipientName: "Nom du destinataire",
    groupName: "Personne ou groupe",
    topic: "Sujet",
    mainMessage: "Message principal",
    reason: "Raison",
    relevantDetail: "Détail pertinent",
    specificDetail: "Détail précis",
    timeframe: "Période",
    extraDetail: "Détail supplémentaire",
    nextStep: "Prochaine étape",
    actionTaken: "Ce qu’ils ont fait",
    supportType: "Aide, cadeau ou soutien",
    result: "Résultat",
    resultOrSituation: "Résultat ou situation",
    positiveResult: "Résultat positif",
    dayOrTime: "Jour ou heure",
    alternateTime: "Créneau alternatif",
    issue: "Problème",
    happened: "Ce qui s’est passé",
    impact: "Impact",
    fixStep: "Comment réparer",
    quality: "Qualité",
    feeling: "Sentiment",
    memory: "Souvenir ou détail",
    achievement: "Réussite",
    eventName: "Événement",
    occasion: "Occasion",
    date: "Date",
    time: "Heure",
    place: "Lieu",
    rsvpDate: "Date de réponse",
    eventDetail: "Détail de l’événement",
    loss: "Perte",
    personName: "Nom de la personne",
    tribute: "Hommage simple",
    task: "Tâche",
    deadline: "Échéance",
    item: "Élément",
    joyWish: "Joie, réussite ou aventure",
    goalOrWish: "Souhait ou objectif",
    hopeOrGoal: "Espoir ou objectif",
  },
  es: {
    recipientName: "Nombre del destinatario",
    groupName: "Persona o grupo",
    topic: "Tema",
    mainMessage: "Mensaje principal",
    reason: "Motivo",
    relevantDetail: "Detalle relevante",
    specificDetail: "Detalle concreto",
    timeframe: "Periodo",
    extraDetail: "Detalle adicional",
    nextStep: "Siguiente paso",
    actionTaken: "Qué hicieron",
    supportType: "Ayuda, regalo o apoyo",
    result: "Resultado",
    resultOrSituation: "Resultado o situación",
    positiveResult: "Resultado positivo",
    dayOrTime: "Día u hora",
    alternateTime: "Hora alternativa",
    issue: "Asunto",
    happened: "Qué pasó",
    impact: "Impacto",
    fixStep: "Cómo enmendarlo",
    quality: "Cualidad",
    feeling: "Sentimiento",
    memory: "Recuerdo o detalle",
    achievement: "Logro",
    eventName: "Evento",
    occasion: "Ocasión",
    date: "Fecha",
    time: "Hora",
    place: "Lugar",
    rsvpDate: "Fecha límite de respuesta",
    eventDetail: "Detalle del evento",
    loss: "Pérdida",
    personName: "Nombre de la persona",
    tribute: "Homenaje sencillo",
    task: "Tarea",
    deadline: "Plazo",
    item: "Punto",
    joyWish: "Alegría, éxito o aventura",
    goalOrWish: "Deseo u objetivo",
    hopeOrGoal: "Esperanza u objetivo",
  },
};

/** @deprecated Use `GUIDED_WRITING_TEMPLATES_EN` or `getGuidedWritingTemplatesForLanguage`. */
export const GUIDED_WRITING_TEMPLATES = GUIDED_WRITING_TEMPLATES_EN;

export function getGuidedWritingTemplatesForLanguage(
  language: SupportedLanguage,
): GuidedWritingTemplateRecord {
  return GUIDED_BY_LANG[language] ?? GUIDED_BY_LANG.en;
}

function renderPlaceholderToken(
  token: GuidedWritingPlaceholder,
  language: SupportedLanguage,
): string {
  const labels = PLACEHOLDER_LABELS_BY_LANG[language] ?? PLACEHOLDER_LABELS_BY_LANG.en;
  return `[${labels[token]}]`;
}

export function renderGuidedWritingTemplateText(
  textTemplate: string,
  language: SupportedLanguage = "en",
): string {
  const labels = PLACEHOLDER_LABELS_BY_LANG[language] ?? PLACEHOLDER_LABELS_BY_LANG.en;
  return textTemplate.replace(/\{\{([a-zA-Z0-9]+)\}\}/g, (_match, token) => {
    if (token in labels) {
      return renderPlaceholderToken(token as GuidedWritingPlaceholder, language);
    }
    return `[${token}]`;
  });
}

export function getGuidedWritingTemplateSet(
  templateId: string | null | undefined,
  language: SupportedLanguage = "en",
): GuidedWritingTemplateSet {
  const set = getGuidedWritingTemplatesForLanguage(language);
  if (!isLocalFallbackTemplateId(templateId)) {
    return set["thank-you"];
  }
  return set[templateId];
}

function guidedWritingBucketForSentenceLength(id: AiSentenceLengthId): GuidedWritingSentenceBucketId {
  return id === "auto" ? "4-6" : id;
}

export function getLocalFallbackTemplateOptions(
  templateId: string | null | undefined,
  sentenceLength: AiSentenceLengthId,
  language: SupportedLanguage = "en",
): readonly LocalFallbackTemplateOption[] {
  const tplSet = getGuidedWritingTemplateSet(templateId, language);
  const bucket = guidedWritingBucketForSentenceLength(sentenceLength);
  return tplSet[bucket].map((opt) => ({
    ...opt,
    text: renderGuidedWritingTemplateText(opt.textTemplate, language),
  }));
}

/** Filters offline starters by metadata; empty fields mean “any”. */
export type GuidedWritingStarterFilters = {
  tone?: GuidedWritingTone | null;
  audience?: GuidedWritingAudience | null;
  style?: GuidedWritingStyle | null;
  sensitivity?: GuidedWritingSensitivity | null;
};

export function filterGuidedWritingTemplateOptions(
  options: readonly LocalFallbackTemplateOption[],
  filters: GuidedWritingStarterFilters,
): readonly LocalFallbackTemplateOption[] {
  return options.filter((o) => {
    if (filters.tone && o.tone !== filters.tone) return false;
    if (filters.audience && o.audience !== filters.audience) return false;
    if (filters.style && o.style !== filters.style) return false;
    if (filters.sensitivity && o.sensitivity !== filters.sensitivity) return false;
    return true;
  });
}

/** True if the note still contains bracketed guided-writing labels for this UI language. */
export function noteHasUnresolvedGuidedPlaceholders(
  text: string,
  language: SupportedLanguage,
): boolean {
  return listUnresolvedGuidedPlaceholderLabelsInNote(text, language).length > 0;
}

/** Human-readable placeholder labels still present as `[Label]` in the note. */
export function listUnresolvedGuidedPlaceholderLabelsInNote(
  text: string,
  language: SupportedLanguage,
): string[] {
  const labels = PLACEHOLDER_LABELS_BY_LANG[language] ?? PLACEHOLDER_LABELS_BY_LANG.en;
  const labelValues = new Set(Object.values(labels));
  const found: string[] = [];
  const seen = new Set<string>();
  const re = /\[[^\]]+\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const inner = m[0].slice(1, -1);
    if (labelValues.has(inner) && !seen.has(inner)) {
      seen.add(inner);
      found.push(inner);
    }
  }
  return found;
}

export function getAllGuidedWritingTemplateIds(): readonly LocalFallbackTemplateId[] {
  return LOCAL_FALLBACK_TEMPLATE_IDS;
}

export function getStandardGuidedWritingBuckets(): readonly GuidedWritingSentenceBucketId[] {
  return STANDARD_GUIDED_WRITING_BUCKETS;
}

export { isLocalFallbackTemplateId };
