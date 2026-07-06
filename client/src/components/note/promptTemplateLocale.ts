import { getTranslations, type SupportedLanguage } from "@/utils/translation";
import type { ModelTier } from "@shared/modelTier";
import type {
  PromptTemplate,
  AiSentenceLengthId,
  LocalLlmValidationIssue,
} from "./promptTemplates";

type Localized<T> = Partial<Record<SupportedLanguage, T>> & { en: T };

const AI_SENTENCE_LENGTH_LABELS: Record<Exclude<AiSentenceLengthId, "auto">, string> = {
  "1-2": "1 - 2",
  "2-3": "2 - 3",
  "4-6": "4 - 6",
  "7-10": "7 - 10",
};

export type PromptTemplateFieldPatch = Partial<
  Pick<
    PromptTemplate,
    | "name"
    | "description"
    | "userTemplate"
    | "modelGuidance"
    | "smallModelGuidance"
    | "promptPlaceholder"
  >
>;

const DE: Record<string, PromptTemplateFieldPatch> = {
  "ask-anything": {
    name: "KI fragt alles",
    description:
      "Fast jede Nachricht oder Antwort. Am besten mit Empfänger, Inhalt und Ton. Die Länge steuern Sie über die Satz-Einstellung.",
    userTemplate:
      "Hilf mir, eine [Nachricht/E-Mail/Antwort] an [wer] zu [Thema] in einem [Ton]-Ton zu schreiben.",
    modelGuidance:
      "Schreibe eine klare, praktische Nachricht nach der Nutzeranfrage. Halte den Ton ein. Natürlich und knapp. Nur der fertige Text.",
    smallModelGuidance: [
      "Nur den fertigen Text.",
      "Einfache, natürliche Sprache.",
      "Ton einhalten, falls angegeben.",
      "Keine Erklärungen.",
      "Keine Überschriften.",
    ].join("\n"),
    promptPlaceholder:
      "An wen, was soll gesagt werden, Ton (freundlich, professionell, direkt).",
  },
  "thank-you": {
    name: "Dankeschön",
    description: "Für Hilfe, Geschenke oder Unterstützung. Nennen Sie, was die Person getan hat und warum es wichtig war.",
    userTemplate:
      "Danke [Name] für [was sie getan haben], erwähne, warum es wichtig war, in einem [warmen/professionellen] Ton.",
    modelGuidance: "Schreibe eine warme, natürliche und konkrete Dankesnachricht.",
    smallModelGuidance: [
      "Dankesnachricht schreiben.",
      "Nur Angaben aus der Nutzeranfrage.",
      "Aufrichtig klingen.",
      "Nichts erfinden.",
    ].join("\n"),
    promptPlaceholder: "Wer hat geholfen, was, warum es wichtig war, Ton (warm, professionell).",
  },
  "meeting-request": {
    name: "Terminanfrage",
    description: "Anruf oder Meeting planen. Thema, Zeit und Format nennen.",
    userTemplate:
      "Bitte um ein [Gespräch/Meeting] mit [Name] zu [Thema], schlage [Zeit/Tag] vor, [professionell/locker].",
    modelGuidance:
      "Schreibe eine Terminanfrage. Zweck klar. Direkt. Zeiten nur nennen, wenn angegeben.",
    smallModelGuidance: [
      "Terminanfrage schreiben.",
      "Exakten Namen verwenden.",
      "Thema klar nennen.",
      "Zeiten nur, wenn angegeben.",
    ].join("\n"),
    promptPlaceholder: "Wer, Thema, bevorzugte Zeit, Ton.",
  },
  birthday: {
    name: "Geburtstagsgruß",
    description: "Für Freund:innen, Kolleg:innen oder Familie. Beziehung und Ton angeben.",
    userTemplate:
      "Schreibe eine Geburtstagsnachricht für [Name], [Beziehung], [witzig/warm].",
    modelGuidance:
      "Schreibe eine warme, natürliche Geburtstagsnachricht. Persönliches nur, wenn angegeben.",
    smallModelGuidance: [
      "Geburtstagsnachricht.",
      "Namen verwenden.",
      "Keine Details erfinden.",
    ].join("\n"),
    promptPlaceholder: "Name, Beziehung, Ton, optional Hobby oder Erinnerung.",
  },
  apology: {
    name: "Entschuldigung",
    description: "Persönlich oder beruflich. Klar und aufrichtig.",
    userTemplate:
      "Entschuldige dich bei [Name] für [was passiert ist], [aufrichtig/professionell], erwähne [wie du es gutmachst].",
    modelGuidance: "Schreibe eine aufrichtige Entschuldigung. Thema klar ansprechen. Keine Ausreden.",
    smallModelGuidance: [
      "Klar entschuldigen.",
      "Nur Nutzerdetails.",
      "Keine Ausreden.",
    ].join("\n"),
    promptPlaceholder: "Was passiert ist, wen es betrifft, Ton, optional Wiedergutmachung.",
  },
  love: {
    name: "Liebesnachricht",
    description: "Romantisch oder emotional. Nenne etwas Konkretes, das du schätzt.",
    userTemplate:
      "Schreibe eine romantische Nachricht an [Name] zu [Anlass], erwähne [was ich schätze].",
    modelGuidance: "Schreibe eine echte romantische Nachricht. Keine Klischees, außer gewünscht.",
    smallModelGuidance: [
      "Warme Nachricht.",
      "Nur gegebene Details.",
      "Keine erfundenen Erinnerungen.",
    ].join("\n"),
    promptPlaceholder: "Wer, Anlass, Ton, eine Sache, die du schätzt.",
  },
  congratulations: {
    name: "Glückwunsch",
    description: "Erfolge wie Jobs, Beförderungen oder Meilensteine.",
    userTemplate:
      "Gratuliere [Name] zu [Erfolg], [warm/professionell/stolz].",
    modelGuidance: "Schreibe eine Gratulation, die konkret und positiv wirkt.",
    smallModelGuidance: [
      "Klar gratulieren.",
      "Erfolg nennen.",
      "Gewünschte Länge einhalten.",
    ].join("\n"),
    promptPlaceholder: "Wer, was erreicht, Ton.",
  },
  farewell: {
    name: "Abschied",
    description: "Job, Team oder Ort verlassen. Fokus auf Dankbarkeit.",
    userTemplate:
      "Schreibe eine Abschiedsnachricht an [Person/Gruppe], erwähne [wofür ich dankbar bin], [warm/professionell].",
    modelGuidance: "Schreibe eine positive Abschiedsnachricht mit Wertschätzung.",
    smallModelGuidance: [
      "Abschiedsnachricht.",
      "Dank aussprechen.",
      "Positiv bleiben.",
    ].join("\n"),
    promptPlaceholder: "Wer, warum du gehst, Ton, Dank.",
  },
  invitation: {
    name: "Einladung",
    description: "Zu einem Anlass einladen. Wichtige Infos nennen.",
    userTemplate:
      "Lade [Personen] zu [Ereignis] am [Datum/Uhrzeit] in [Ort] ein, [locker/warm].",
    modelGuidance: "Schreibe eine freundliche Einladung. Kerninfos klar.",
    smallModelGuidance: [
      "Einladung schreiben.",
      "Datum/Ort nur, wenn angegeben.",
      "Freundlicher Ton.",
    ].join("\n"),
    promptPlaceholder: "Ereignis, Datum, Ort, Ton, ggf. RSVP.",
  },
  condolence: {
    name: "Beileid",
    description: "Bei Verlust oder schweren Situationen. Einfach und aufrichtig.",
    userTemplate:
      "Schreibe eine Beileidsnachricht an [Name] zu [Verlust], [sanft/einfach].",
    modelGuidance: "Schreibe eine einfühlsame Beileidsnachricht. Keine Floskeln.",
    smallModelGuidance: ["Einfach und freundlich.", "Keine Ratschläge."].join("\n"),
    promptPlaceholder: "Wer, was passiert ist, Ton.",
  },
  reminder: {
    name: "Erinnerung",
    description: "Höflich an Aufgabe oder Frist erinnern.",
    userTemplate:
      "Erinnere [Name/Gruppe] an [Aufgabe] bis [Frist], [locker/professionell].",
    modelGuidance: "Schreibe eine höfliche Erinnerung. Klar, nicht aufdringlich.",
    smallModelGuidance: [
      "Erinnerung schreiben.",
      "Frist nur, wenn angegeben.",
      "Höflich bleiben.",
    ].join("\n"),
    promptPlaceholder: "Wer, Aufgabe, Frist, Ton.",
  },
  "document-summary": {
    name: "Dokumentzusammenfassung",
    description: "Langen Text in Kernpunkte fassen. Länge über Satzeinstellung.",
    userTemplate: "Fasse diesen Text zusammen mit Fokus auf [Hauptpunkte/Entscheidungen/Risiken].",
    modelGuidance: "Fasse in klare Kernpunkte. Nur wichtige Inhalte.",
    smallModelGuidance: [
      "Stichpunkte.",
      "Nur Hauptideen.",
      "Keine Wiederholungen.",
    ].join("\n"),
    promptPlaceholder: "Text einfügen, optional Schwerpunkt nennen.",
  },
  "privacy-check": {
    name: "Datenschutz-Check",
    description: "Private oder identifizierende Angaben entfernen.",
    userTemplate:
      "Entferne Namen, E-Mails, Telefonnummern, Adressen und sensible Angaben aus diesem Text",
    modelGuidance: "Schwärze sensible Infos mit [REDACTED]. Struktur beibehalten.",
    smallModelGuidance: [
      "Sensible Infos durch [REDACTED] ersetzen.",
      "Nicht zusammenfassen.",
    ].join("\n"),
    promptPlaceholder: "Text mit privaten Informationen einfügen.",
  },
};

const FR: Record<string, PromptTemplateFieldPatch> = {
  "ask-anything": {
    name: "Demander n’importe quoi à l’IA",
    description:
      "Presque tout message ou réponse. Indiquez à qui, quoi dire et le ton. La longueur suit votre réglage de phrases.",
    userTemplate:
      "Aide-moi à écrire un [message/e-mail/réponse] à [qui] sur [sujet] sur un ton [ton].",
    modelGuidance:
      "Rédige un message clair et pratique selon la demande. Respecte le ton. Naturel et concis. Uniquement le texte final.",
    smallModelGuidance: [
      "Uniquement le texte final.",
      "Langage simple et naturel.",
      "Respecter le ton si indiqué.",
      "Pas d’explications.",
      "Pas de titres.",
    ].join("\n"),
    promptPlaceholder:
      "À qui, ce que vous voulez dire, ton (amical, professionnel, direct).",
  },
  "thank-you": {
    name: "Message de remerciement",
    description:
      "Pour une aide, un cadeau ou un soutien. Indiquez ce qu’ils ont fait et pourquoi c’était important.",
    userTemplate:
      "Remercie [nom] pour [ce qu’ils ont fait], explique pourquoi c’était important, sur un ton [chaleureux/professionnel].",
    modelGuidance: "Rédige un message de remerciement chaleureux, naturel et précis.",
    smallModelGuidance: [
      "Message de remerciement.",
      "Utiliser uniquement les détails fournis.",
      "Sincère.",
      "Pas d’invention.",
    ].join("\n"),
    promptPlaceholder: "Qui, ce qu’ils ont fait, pourquoi c’était important, ton.",
  },
  "meeting-request": {
    name: "Demande de rendez-vous",
    description: "Planifier un appel ou une réunion. Sujet, horaires et format.",
    userTemplate:
      "Demande un [appel/entretien] avec [nom] sur [sujet], propose [jour/heure], ton [professionnel/décontracté].",
    modelGuidance:
      "Rédige une demande de rendez-vous. Objectif clair. Direct. Horaires seulement si fournis.",
    smallModelGuidance: [
      "Demande de rendez-vous.",
      "Utiliser le nom exact.",
      "Sujet clair.",
      "Horaires seulement si indiqués.",
    ].join("\n"),
    promptPlaceholder: "Qui, sujet, horaire préféré, ton.",
  },
  birthday: {
    name: "Souhait d’anniversaire",
    description: "Amis, collègues ou famille. Relation et ton.",
    userTemplate:
      "Écris un message d’anniversaire pour [nom], [relation], ton [drôle/chaleureux].",
    modelGuidance:
      "Rédige un message d’anniversaire chaleureux et naturel. Détails personnels seulement si fournis.",
    smallModelGuidance: [
      "Message d’anniversaire.",
      "Utiliser le nom.",
      "Ne pas inventer de détails.",
    ].join("\n"),
    promptPlaceholder: "Nom, relation, ton, détail optionnel (loisir, souvenir).",
  },
  apology: {
    name: "Message d’excuses",
    description: "Excuses personnelles ou professionnelles. Claire et sincère.",
    userTemplate:
      "Présente tes excuses à [nom] pour [ce qui s’est passé], ton [sincère/professionnel], mentionne [comment réparer].",
    modelGuidance:
      "Rédige des excuses sincères. Reconnais clairement le problème. Pas d’excuses défensives.",
    smallModelGuidance: [
      "S’excuser clairement.",
      "Uniquement les détails de l’utilisateur.",
      "Pas d’excuses.",
    ].join("\n"),
    promptPlaceholder: "Ce qui s’est passé, impact, ton, correction optionnelle.",
  },
  love: {
    name: "Message d’amour",
    description: "Message romantique ou émotionnel. Quelque chose de précis que vous appréciez.",
    userTemplate:
      "Écris un message romantique à [nom] pour [occasion], mentionne [ce que j’apprécie].",
    modelGuidance:
      "Rédige un message romantique authentique. Évite les clichés sauf demande contraire.",
    smallModelGuidance: [
      "Message chaleureux.",
      "Détails fournis seulement.",
      "Pas de souvenirs inventés.",
    ].join("\n"),
    promptPlaceholder: "Qui, occasion, ton, une chose que vous appréciez.",
  },
  congratulations: {
    name: "Félicitations",
    description: "Réussites : emploi, promotion, étapes importantes.",
    userTemplate:
      "Félicite [nom] pour [réussite], ton [chaleureux/professionnel/fier].",
    modelGuidance: "Rédige des félicitations précises et positives.",
    smallModelGuidance: [
      "Féliciter clairement.",
      "Citer la réussite.",
      "Respecter la longueur demandée.",
    ].join("\n"),
    promptPlaceholder: "Qui, réussite, ton.",
  },
  farewell: {
    name: "Adieu / Départ",
    description: "Quitter un travail, une équipe ou un lieu. Gratitude.",
    userTemplate:
      "Écris un message d’adieu à [personne/groupe], mentionne [pour quoi je suis reconnaissant], ton [chaleureux/professionnel].",
    modelGuidance: "Rédige un message de départ positif centré sur la reconnaissance.",
    smallModelGuidance: [
      "Message d’adieu.",
      "Les remercier.",
      "Rester positif.",
    ].join("\n"),
    promptPlaceholder: "Qui, raison du départ, ton, gratitude.",
  },
  invitation: {
    name: "Invitation",
    description: "Inviter à un événement. Détails clés.",
    userTemplate:
      "Invite [personnes] à [événement] le [date/heure] à [lieu], ton [décontracté/chaleureux].",
    modelGuidance: "Rédige une invitation conviviale. Détails clairs.",
    smallModelGuidance: [
      "Invitation.",
      "Date/heure/lieu seulement si fournis.",
      "Ton amical.",
    ].join("\n"),
    promptPlaceholder: "Événement, date, lieu, ton, RSVP si besoin.",
  },
  condolence: {
    name: "Message de condoléances",
    description: "Perte ou moment difficile. Simple et sincère.",
    userTemplate:
      "Écris un message de condoléances à [nom] pour [perte], ton [doux/simple].",
    modelGuidance: "Rédige des condoléances douces. Évite les clichés.",
    smallModelGuidance: ["Simple et bienveillant.", "Pas de conseils."].join("\n"),
    promptPlaceholder: "Qui, ce qui s’est passé, ton.",
  },
  reminder: {
    name: "Rappel",
    description: "Rappel poli pour une tâche ou une échéance.",
    userTemplate:
      "Rappelle à [nom/groupe] la tâche [tâche] pour [échéance], ton [décontracté/professionnel].",
    modelGuidance: "Rédige un rappel poli. Clair, sans insister.",
    smallModelGuidance: [
      "Rappel.",
      "Échéance seulement si fournie.",
      "Rester poli.",
    ].join("\n"),
    promptPlaceholder: "Qui, tâche, échéance, ton.",
  },
  "document-summary": {
    name: "Résumé de document",
    description: "Long texte en points clés. Longueur selon le réglage.",
    userTemplate:
      "Résume ce texte en mettant l’accent sur [points clés/décisions/risques].",
    modelGuidance: "Résume en points clairs. Idées importantes seulement.",
    smallModelGuidance: [
      "Puces.",
      "Idées principales seulement.",
      "Pas de répétition.",
    ].join("\n"),
    promptPlaceholder: "Collez le texte, optionnellement le focus.",
  },
  "privacy-check": {
    name: "Vérification confidentialité",
    description: "Retirer informations privées ou identifiantes.",
    userTemplate:
      "Retire les noms, e-mails, téléphones, adresses et détails sensibles de ce texte",
    modelGuidance:
      "Remplace les informations sensibles par [REDACTED]. Garde la structure.",
    smallModelGuidance: [
      "Remplacer par [REDACTED].",
      "Ne pas résumer.",
    ].join("\n"),
    promptPlaceholder: "Collez le texte contenant des données privées.",
  },
};

const ES: Record<string, PromptTemplateFieldPatch> = {
  "ask-anything": {
    name: "Pídele cualquier cosa a la IA",
    description:
      "Casi cualquier mensaje o respuesta. Incluye para quién, qué decir y el tono. La longitud la marca tu ajuste de frases.",
    userTemplate:
      "Ayúdame a escribir un [mensaje/correo/respuesta] a [quién] sobre [tema] en tono [tono].",
    modelGuidance:
      "Escribe un mensaje claro y práctico según la petición. Respeta el tono. Natural y conciso. Solo el texto final.",
    smallModelGuidance: [
      "Solo el texto final.",
      "Lenguaje simple y natural.",
      "Respeta el tono si se indica.",
      "Sin explicaciones.",
      "Sin encabezados.",
    ].join("\n"),
    promptPlaceholder:
      "Para quién, qué quieres decir, tono (cercano, profesional, directo).",
  },
  "thank-you": {
    name: "Agradecimiento",
    description:
      "Por ayuda, regalos o apoyo. Di qué hicieron y por qué importó.",
    userTemplate:
      "Agradece a [nombre] por [qué hicieron], menciona por qué importó, en tono [cálido/profesional].",
    modelGuidance: "Escribe un agradecimiento cálido, natural y concreto.",
    smallModelGuidance: [
      "Mensaje de agradecimiento.",
      "Solo detalles del usuario.",
      "Suena sincero.",
      "No inventes datos.",
    ].join("\n"),
    promptPlaceholder: "Quién ayudó, qué hizo, por qué importó, tono.",
  },
  "meeting-request": {
    name: "Solicitud de reunión",
    description: "Programar llamada o reunión. Tema, horario y formato.",
    userTemplate:
      "Pide una [llamada/reunión] con [nombre] sobre [tema], sugiere [día/hora], tono [profesional/informal].",
    modelGuidance:
      "Escribe una solicitud de reunión. Propósito claro. Directo. Horarios solo si los dan.",
    smallModelGuidance: [
      "Solicitud de reunión.",
      "Usa el nombre exacto.",
      "Tema claro.",
      "Horarios solo si se indican.",
    ].join("\n"),
    promptPlaceholder: "Quién, tema, horario preferido, tono.",
  },
  birthday: {
    name: "Felicitación de cumpleaños",
    description: "Amigos, compañeros o familia. Relación y tono.",
    userTemplate:
      "Escribe un mensaje de cumpleaños para [nombre], [relación], tono [divertido/cálido].",
    modelGuidance:
      "Escribe un mensaje de cumpleaños cálido y natural. Detalle personal solo si lo dan.",
    smallModelGuidance: [
      "Mensaje de cumpleaños.",
      "Usa el nombre.",
      "No inventes detalles.",
    ].join("\n"),
    promptPlaceholder: "Nombre, relación, tono, detalle opcional.",
  },
  apology: {
    name: "Disculpa",
    description: "Personal o laboral. Clara y sincera.",
    userTemplate:
      "Pide disculpas a [nombre] por [qué pasó], tono [sincero/profesional], menciona [cómo arreglarlo].",
    modelGuidance:
      "Escribe una disculpa sincera. Reconoce el problema. Sin excusas defensivas.",
    smallModelGuidance: [
      "Disculparse con claridad.",
      "Solo detalles del usuario.",
      "Sin excusas.",
    ].join("\n"),
    promptPlaceholder: "Qué pasó, a quién afectó, tono, arreglo opcional.",
  },
  love: {
    name: "Mensaje de amor",
    description: "Romántico o emotivo. Algo concreto que aprecias.",
    userTemplate:
      "Escribe un mensaje romántico a [nombre] para [ocasión], menciona [qué aprecio].",
    modelGuidance:
      "Escribe un mensaje romántico auténtico. Evita clichés salvo que lo pidan.",
    smallModelGuidance: [
      "Mensaje cálido.",
      "Solo detalles dados.",
      "No inventes recuerdos.",
    ].join("\n"),
    promptPlaceholder: "Quién, ocasión, tono, algo que aprecias.",
  },
  congratulations: {
    name: "Felicidades",
    description: "Logros: trabajo, ascenso, hitos.",
    userTemplate:
      "Felicita a [nombre] por [logro], tono [cálido/profesional/orgulloso].",
    modelGuidance: "Escribe felicitaciones concretas y positivas.",
    smallModelGuidance: [
      "Felicitar con claridad.",
      "Menciona el logro.",
      "Respeta la longitud pedida.",
    ].join("\n"),
    promptPlaceholder: "Quién, logro, tono.",
  },
  farewell: {
    name: "Despedida",
    description: "Dejar un trabajo, equipo o lugar. Enfócate en gratitud.",
    userTemplate:
      "Escribe una despedida a [persona/grupo], menciona [por qué estoy agradecido], tono [cálido/profesional].",
    modelGuidance: "Escribe una despedida positiva centrada en el agradecimiento.",
    smallModelGuidance: [
      "Mensaje de despedida.",
      "Agradéceles.",
      "Mantén un tono positivo.",
    ].join("\n"),
    promptPlaceholder: "Quién, por qué te vas, tono, gratitud.",
  },
  invitation: {
    name: "Invitación",
    description: "Invitar a un evento. Datos clave.",
    userTemplate:
      "Invita a [personas] a [evento] el [fecha/hora] en [lugar], tono [informal/cálido].",
    modelGuidance: "Escribe una invitación amable. Datos claros.",
    smallModelGuidance: [
      "Invitación.",
      "Fecha/hora/lugar solo si se dan.",
      "Tono amable.",
    ].join("\n"),
    promptPlaceholder: "Evento, fecha, lugar, tono, RSVP si aplica.",
  },
  condolence: {
    name: "Condolencias",
    description: "Pérdida o momento difícil. Simple y sincero.",
    userTemplate:
      "Escribe condolencias a [nombre] por [pérdida], tono [suave/simple].",
    modelGuidance: "Escribe condolencias suaves. Evita clichés.",
    smallModelGuidance: ["Simple y amable.", "Sin consejos."].join("\n"),
    promptPlaceholder: "Quién, qué pasó, tono.",
  },
  reminder: {
    name: "Recordatorio",
    description: "Recordar con cortesía una tarea o plazo.",
    userTemplate:
      "Recuerda a [nombre/grupo] la tarea [tarea] para [plazo], tono [informal/profesional].",
    modelGuidance: "Escribe un recordatorio cortés. Claro, sin presionar.",
    smallModelGuidance: [
      "Recordatorio.",
      "Plazo solo si se indica.",
      "Sé cortés.",
    ].join("\n"),
    promptPlaceholder: "Quién, tarea, plazo, tono.",
  },
  "document-summary": {
    name: "Resumen de documento",
    description: "Texto largo en puntos clave. Longitud según ajuste.",
    userTemplate:
      "Resume este texto centrándote en [ideas clave/decisiones/riesgos].",
    modelGuidance: "Resume en puntos claros. Solo ideas importantes.",
    smallModelGuidance: [
      "Viñetas.",
      "Solo ideas principales.",
      "Sin repetición.",
    ].join("\n"),
    promptPlaceholder: "Pega el texto y, si quieres, el enfoque.",
  },
  "privacy-check": {
    name: "Revisión de privacidad",
    description: "Quitar datos privados o identificables.",
    userTemplate:
      "Elimina nombres, correos, teléfonos, direcciones y datos sensibles de este texto",
    modelGuidance:
      "Sustituye información sensible por [REDACTED]. Mantén la estructura.",
    smallModelGuidance: [
      "Sustituye por [REDACTED].",
      "No resumas.",
    ].join("\n"),
    promptPlaceholder: "Pega el texto con información privada.",
  },
};

export const PROMPT_TEMPLATE_FIELD_OVERRIDES: Partial<
  Record<SupportedLanguage, Record<string, PromptTemplateFieldPatch>>
> = {
  de: DE,
  fr: FR,
  es: ES,
};

const PROMPT_TEMPLATE_KEY_PREFIX: Record<string, string> = {
  "ask-anything": "AskAnything",
  "thank-you": "ThankYou",
  "meeting-request": "MeetingRequest",
  birthday: "Birthday",
  apology: "Apology",
  love: "Love",
  congratulations: "Congratulations",
  farewell: "Farewell",
  invitation: "Invitation",
  condolence: "Condolence",
  reminder: "Reminder",
  "document-summary": "DocumentSummary",
  "privacy-check": "PrivacyCheck",
};

function patchFromTranslationKeys(
  translations: Record<string, string>,
  prefix: string,
): PromptTemplateFieldPatch | null {
  const name = translations[`promptTpl${prefix}Name`];
  if (typeof name !== "string" || !name.trim()) return null;
  const patch: PromptTemplateFieldPatch = { name };
  const description = translations[`promptTpl${prefix}Description`];
  if (typeof description === "string" && description.trim()) patch.description = description;
  const userTemplate = translations[`promptTpl${prefix}UserTemplate`];
  if (typeof userTemplate === "string" && userTemplate.trim()) patch.userTemplate = userTemplate;
  const modelGuidance = translations[`promptTpl${prefix}ModelGuidance`];
  if (typeof modelGuidance === "string" && modelGuidance.trim()) patch.modelGuidance = modelGuidance;
  const smallModelGuidance = translations[`promptTpl${prefix}SmallModelGuidance`];
  if (typeof smallModelGuidance === "string" && smallModelGuidance.trim()) {
    patch.smallModelGuidance = smallModelGuidance;
  }
  const promptPlaceholder = translations[`promptTpl${prefix}PromptPlaceholder`];
  if (typeof promptPlaceholder === "string" && promptPlaceholder.trim()) {
    patch.promptPlaceholder = promptPlaceholder;
  }
  return patch;
}

function buildPromptTemplateOverridesFromTranslations(
  translations: Record<string, string>,
): Record<string, PromptTemplateFieldPatch> {
  const out: Record<string, PromptTemplateFieldPatch> = {};
  for (const [id, prefix] of Object.entries(PROMPT_TEMPLATE_KEY_PREFIX)) {
    const patch = patchFromTranslationKeys(translations, prefix);
    if (patch) out[id] = patch;
  }
  return out;
}

export function mergePromptTemplatesForLanguage(
  base: readonly PromptTemplate[],
  language: SupportedLanguage,
  translations?: Record<string, string>,
): PromptTemplate[] {
  if (language === "en") return [...base];
  const translated = buildPromptTemplateOverridesFromTranslations(
    translations ?? getTranslations(language),
  );
  const legacy = PROMPT_TEMPLATE_FIELD_OVERRIDES[language];
  const ov = legacy ? { ...translated, ...legacy } : translated;
  if (Object.keys(ov).length === 0) return [...base];
  return base.map((t) => ({ ...t, ...(ov[t.id] ?? {}) }));
}

const SENTENCE_SUFFIX: Localized<(label: string) => string> = {
  en: (label) => ` Write (${label}) of sentences.`,
  de: (label) => ` Schreibe (${label}) Sätze.`,
  fr: (label) => ` Écris (${label}) phrases.`,
  es: (label) => ` Escribe (${label}) frases.`,
  hr: (label) => ` Napišite (${label}) rečenice.`,
  sr: (label) => ` Napišite (${label}) rečenice.`,
  pt: (label) => ` Escreva (${label}) frases.`,
  it: (label) => ` Scrivi (${label}) frasi.`,
  nl: (label) => ` Schrijf (${label}) zinnen.`,
};

/** Matches any supported locale’s sentence-length suffix at end of prompt. */
export const SENTENCE_LENGTH_USER_SUFFIX_ANY_LOCALE =
  /\s*(?:Write|Schreibe|Écris|Escribe|Napišite|Scrivi|Schrijf|Escreva) \([^)]+\) (?:of sentences|Sätze|phrases|frases|frasi|zinnen|rečenice)\.$/;

const LEGACY_EN_ONLY = /\s*Use the sentence length I selected\.$/;

export function formatSentenceLengthUserSuffix(
  preset: AiSentenceLengthId,
  language: SupportedLanguage = "en",
): string {
  if (preset === "auto") return "";
  const label = AI_SENTENCE_LENGTH_LABELS[preset];
  const fn = SENTENCE_SUFFIX[language] ?? SENTENCE_SUFFIX.en;
  return fn(label);
}

export function applySentenceLengthToUserPrompt(
  prompt: string,
  preset: AiSentenceLengthId,
  language: SupportedLanguage = "en",
): string {
  const base = prompt
    .replace(SENTENCE_LENGTH_USER_SUFFIX_ANY_LOCALE, "")
    .replace(LEGACY_EN_ONLY, "");
  return base + formatSentenceLengthUserSuffix(preset, language);
}

const USER_REQUEST_LABEL: Localized<string> = {
  en: "User request:",
  de: "Nutzeranfrage:",
  fr: "Demande de l’utilisateur :",
  es: "Solicitud del usuario:",
  hr: "Zahtjev korisnika:",
  sr: "Zahtev korisnika:",
  pt: "Pedido do utilizador:",
  it: "Richiesta dell'utente:",
  nl: "Verzoek van gebruiker:",
};

export function getLocalizedUserRequestLabel(language: SupportedLanguage): string {
  return USER_REQUEST_LABEL[language] ?? USER_REQUEST_LABEL.en;
}

const BASE_INSTRUCTION_LOC: Localized<string> = {
  en: `Write like a real person.
Keep it concise, clear, and natural.
Avoid clichés, filler, and generic phrases.
Be specific when possible.
Do not add explanations before or after the message.
Follow the output-length line below.`,
  de: `Schreibe wie ein echter Mensch.
Kurz, klar und natürlich.
Vermeide Floskeln und Füllwörter.
So konkret wie möglich.
Keine Erklärungen vor oder nach der Nachricht.
Halte dich an die Zeilenlänge unten.`,
  fr: `Écris comme une vraie personne.
Reste concis, clair et naturel.
Évite les clichés et le remplissage.
Sois précis quand c’est possible.
Pas d’explications avant ou après le message.
Suis la consigne de longueur ci-dessous.`,
  es: `Escribe como una persona real.
Conciso, claro y natural.
Evita clichés y relleno.
Sé concreto cuando puedas.
Sin explicaciones antes ni después del mensaje.
Sigue la indicación de longitud de abajo.`,
  hr: `Pišite kao stvarna osoba.
Budite sažeti, jasni i prirodni.
Izbjegavajte klišeje, praznine i generičke fraze.
Budite konkretni kada je moguće.
Ne dodavajte objašnjenja prije ili poslije poruke.
Slijedite upute o duljini ispod.`,
  sr: `Pišite kao stvarna osoba.
Budite sažeti, jasni i prirodni.
Izbegavajte klišeje, praznine i generičke fraze.
Budite konkretni kada je moguće.
Ne dodajte objašnjenja pre ili posle poruke.
Pratite uputstvo o dužini ispod.`,
  pt: `Escreva como uma pessoa real.
Seja conciso, claro e natural.
Evite clichés, enchimentos e frases genéricas.
Seja específico quando possível.
Não adicione explicações antes ou depois da mensagem.
Siga a indicação de comprimento abaixo.`,
  it: `Scrivi come una persona reale.
Sii conciso, chiaro e naturale.
Evita cliché, riempitivi e frasi generiche.
Sii specifico quando possibile.
Non aggiungere spiegazioni prima o dopo il messaggio.
Segui l'indicazione di lunghezza qui sotto.`,
  nl: `Schrijf als een echt persoon.
Houd het beknopt, duidelijk en natuurlijk.
Vermijd clichés, opvulling en generieke zinnen.
Wees specifiek waar mogelijk.
Geen uitleg voor of na het bericht.
Volg de lengte-instructie hieronder.`,
};

const BASE_INSTRUCTION_SMALL_LOC: Localized<string> = {
  en: [
    "Use simple, natural wording.",
    "Keep it short and clear.",
    "Use only facts from the user request.",
    "Do not invent names, dates, links, or details.",
    "Do not add explanations before or after the main text.",
    "Follow the output-length line below.",
  ].join("\n"),
  de: [
    "Einfache, natürliche Wortwahl.",
    "Kurz und klar.",
    "Nur Fakten aus der Nutzeranfrage.",
    "Keine erfundenen Namen, Daten, Links oder Details.",
    "Keine Erklärungen vor oder nach dem Haupttext.",
    "Halte dich an die Zeilenlänge unten.",
  ].join("\n"),
  fr: [
    "Formulations simples et naturelles.",
    "Court et clair.",
    "Utilise uniquement les faits de la demande.",
    "N’invente pas de noms, dates, liens ou détails.",
    "Pas d’explications avant ou après le texte principal.",
    "Suis la consigne de longueur ci-dessous.",
  ].join("\n"),
  es: [
    "Lenguaje simple y natural.",
    "Breve y claro.",
    "Solo hechos de la petición del usuario.",
    "No inventes nombres, fechas, enlaces ni detalles.",
    "Sin explicaciones antes ni después del texto principal.",
    "Sigue la indicación de longitud de abajo.",
  ].join("\n"),
  hr: [
    "Koristite jednostavan, prirodan jezik.",
    "Neka bude kratko i jasno.",
    "Koristite samo činjenice iz zahtjeva korisnika.",
    "Ne izmišljajte imena, datume, poveznice ili detalje.",
    "Bez objašnjenja prije ili poslije glavnog teksta.",
    "Slijedite upute o duljini ispod.",
  ].join("\n"),
  sr: [
    "Koristite jednostavan, prirodan jezik.",
    "Neka bude kratko i jasno.",
    "Koristite samo činjenice iz zahteva korisnika.",
    "Ne izmišljajte imena, datume, linkove ili detalje.",
    "Bez objašnjenja pre ili posle glavnog teksta.",
    "Pratite uputstvo o dužini ispod.",
  ].join("\n"),
  pt: [
    "Use linguagem simples e natural.",
    "Mantenha curto e claro.",
    "Use apenas factos do pedido do utilizador.",
    "Não invente nomes, datas, ligações ou detalhes.",
    "Sem explicações antes ou depois do texto principal.",
    "Siga a indicação de comprimento abaixo.",
  ].join("\n"),
  it: [
    "Usa un linguaggio semplice e naturale.",
    "Mantienilo breve e chiaro.",
    "Usa solo i fatti dalla richiesta dell'utente.",
    "Non inventare nomi, date, link o dettagli.",
    "Nessuna spiegazione prima o dopo il testo principale.",
    "Segui l'indicazione di lunghezza qui sotto.",
  ].join("\n"),
  nl: [
    "Gebruik eenvoudige, natuurlijke bewoording.",
    "Houd het kort en duidelijk.",
    "Gebruik alleen feiten uit het gebruikersverzoek.",
    "Verzin geen namen, datums, links of details.",
    "Geen uitleg voor of na de hoofdtekst.",
    "Volg de lengte-instructie hieronder.",
  ].join("\n"),
};

const PLACEHOLDER_BRACE_RULE_LOC: Localized<string> = {
  en: "Hard rule: Never output {{ or }} in your answer. Use only real names and facts from the USER REQUEST and parsed cues when present.",
  de: "Strikte Regel: Gib niemals {{ oder }} in der Antwort aus. Nur echte Namen und Fakten aus der NUTZERANFRAGE und geparsten Hinweisen.",
  fr: "Règle stricte : n’affiche jamais {{ ou }} dans ta réponse. Utilise uniquement les noms et faits réels de la DEMANDE et des indices fournis.",
  es: "Regla estricta: nunca escribas {{ ni }} en tu respuesta. Solo nombres y hechos reales de la SOLICITUD y pistas analizadas.",
  hr: "Strogo pravilo: nikada ne ispisujte {{ ili }} u odgovoru. Koristite samo stvarna imena i činjenice iz ZAHTJEVA KORISNIKA i parsiranih naznaka.",
  sr: "Strogo pravilo: nikada ne ispisujte {{ ili }} u odgovoru. Koristite samo stvarna imena i činjenice iz ZAHTEVA KORISNIKA i parsiranih naznaka.",
  pt: "Regra rígida: nunca escreva {{ ou }} na resposta. Use apenas nomes e factos reais do PEDIDO e das pistas analisadas.",
  it: "Regola rigida: non scrivere mai {{ o }} nella risposta. Usa solo nomi e fatti reali dalla RICHIESTA e dagli indizi analizzati.",
  nl: "Strikte regel: geef nooit {{ of }} in je antwoord. Gebruik alleen echte namen en feiten uit het VERZOEK en geparste aanwijzingen.",
};

const GROUNDING_RULES_SMALL_LOC: Localized<string> = {
  en: [
    "Grounding (must follow):",
    "- Use ONLY names, titles, organizations, dates, topics, and facts from the USER REQUEST below.",
    "- Do NOT invent people or facts.",
    "- If the user gave someone’s name or title, use that exact wording.",
    "- Write only normal finished text.",
    "- Do not leave template syntax, brackets, or placeholder words in the final answer.",
    "- Never output the characters {{ or }}.",
  ].join("\n"),
  de: [
    "Verankerung (verbindlich):",
    "- NUR Namen, Titel, Organisationen, Daten, Themen und Fakten aus der NUTZERANFRAGE unten.",
    "- KEINE erfundenen Personen oder Fakten.",
    "- Wenn der Nutzer einen Namen oder Titel nannte, exakt so verwenden.",
    "- Nur normalen fertigen Text schreiben.",
    "- Keine Platzhalter-Syntax, Klammern oder Platzhalterwörter im Endergebnis.",
    "- Niemals die Zeichen {{ oder }} ausgeben.",
  ].join("\n"),
  fr: [
    "Ancrage (obligatoire) :",
    "- Utilise UNIQUEMENT noms, titres, organisations, dates, sujets et faits de la DEMANDE ci-dessous.",
    "- N’invente NI personnes NI faits.",
    "- Si l’utilisateur a donné un nom ou un titre, utilise la formulation exacte.",
    "- Écris uniquement un texte final normal.",
    "- Pas de syntaxe de modèle, crochets ou mots-placeholder dans la réponse finale.",
    "- N’affiche jamais les caractères {{ ou }}.",
  ].join("\n"),
  es: [
    "Anclaje (obligatorio):",
    "- Usa SOLO nombres, cargos, organizaciones, fechas, temas y hechos de la SOLICITUD de abajo.",
    "- NO inventes personas ni hechos.",
    "- Si el usuario dio un nombre o cargo, usa esa redacción exacta.",
    "- Solo texto final normal.",
    "- Sin sintaxis de plantilla, corchetes ni palabras marcador en la respuesta final.",
    "- Nunca escribas los caracteres {{ ni }}.",
  ].join("\n"),
  hr: [
    "Učvršćivanje (obavezno):",
    "- Koristite SAMO imena, titule, organizacije, datume, teme i činjenice iz ZAHTJEVA KORISNIKA u nastavku.",
    "- NE izmišljajte ljude ni činjenice.",
    "- Ako je korisnik dao ime ili titulu, koristite točno taj izraz.",
    "- Pišite samo normalan gotov tekst.",
    "- Ne ostavljajte sintaksu predloška, zagrade ili riječi rezervirane mjesto u konačnom odgovoru.",
    "- Nikada ne ispisujte znakove {{ ili }}.",
  ].join("\n"),
  sr: [
    "Učvršćivanje (obavezno):",
    "- Koristite SAMO imena, titule, organizacije, datume, teme i činjenice iz ZAHTEVA KORISNIKA u nastavku.",
    "- NE izmišljajte ljude ni činjenice.",
    "- Ako je korisnik dao ime ili titulu, koristite tačan izraz.",
    "- Pišite samo normalan gotov tekst.",
    "- Ne ostavljajte sintaksu šablona, zagrade ili reči za rezervisana mesta u konačnom odgovoru.",
    "- Nikada ne ispisujte znakove {{ ili }}.",
  ].join("\n"),
  pt: [
    "Ancoragem (obrigatório):",
    "- Use APENAS nomes, cargos, organizações, datas, temas e factos do PEDIDO abaixo.",
    "- NÃO invente pessoas nem factos.",
    "- Se o utilizador deu um nome ou cargo, use essa redação exacta.",
    "- Escreva apenas texto final normal.",
    "- Não deixe sintaxe de modelo, parênteses ou palavras marcador na resposta final.",
    "- Nunca escreva os caracteres {{ ou }}.",
  ].join("\n"),
  it: [
    "Ancoraggio (obbligatorio):",
    "- Usa SOLO nomi, titoli, organizzazioni, date, argomenti e fatti dalla RICHIESTA qui sotto.",
    "- NON inventare persone o fatti.",
    "- Se l'utente ha dato un nome o titolo, usa quella formulazione esatta.",
    "- Scrivi solo testo finale normale.",
    "- Non lasciare sintassi del modello, parentesi o parole segnaposto nella risposta finale.",
    "- Non scrivere mai i caratteri {{ o }}.",
  ].join("\n"),
  nl: [
    "Verankering (verplicht):",
    "- Gebruik ALLEEN namen, titels, organisaties, datums, onderwerpen en feiten uit het VERZOEK hieronder.",
    "- Verzin GEEN personen of feiten.",
    "- Als de gebruiker een naam of titel gaf, gebruik die exacte formulering.",
    "- Schrijf alleen normale afgeronde tekst.",
    "- Laat geen sjabloonsyntax, haakjes of placeholderwoorden in het eindantwoord.",
    "- Geef nooit de tekens {{ of }} uit.",
  ].join("\n"),
};

const EXAMPLE_SHAPE_PREFIX: Localized<string> = {
  en: "Example output shape only. Sample names and details are fictional. Use facts from the USER REQUEST only; do not copy sample names or wording:",
  de: "Nur Beispielform. Beispielnamen sind frei erfunden. Nutze nur Fakten aus der NUTZERANFRAGE; kopiere keine Beispielnamen oder Formulierungen:",
  fr: "Forme d’exemple uniquement. Noms et détails fictifs. Utilise uniquement les faits de la DEMANDE ; ne copie pas les exemples :",
  es: "Solo forma de ejemplo. Nombres y detalles ficticios. Usa solo hechos de la SOLICITUD; no copies los ejemplos:",
  hr: "Samo oblik primjera. Imena i detalji su izmišljeni. Koristite samo činjenice iz ZAHTJEVA KORISNIKA; ne kopirajte primjere:",
  sr: "Samo oblik primera. Imena i detalji su izmišljeni. Koristite samo činjenice iz ZAHTEVA KORISNIKA; ne kopirajte primere:",
  pt: "Apenas forma de exemplo. Nomes e detalhes fictícios. Use apenas factos do PEDIDO; não copie os exemplos:",
  it: "Solo forma di esempio. Nomi e dettagli sono fittizi. Usa solo fatti dalla RICHIESTA; non copiare gli esempi:",
  nl: "Alleen voorbeeldvorm. Namen en details zijn fictief. Gebruik alleen feiten uit het VERZOEK; kopieer de voorbeelden niet:",
};

const ULTRA_SMALL_NOTE: Localized<string> = {
  en: 'On-device model is very small: one tight paragraph when possible. No preamble (“Sure”, “Here is”). Jump straight into the requested text.',
  de: "On-Device-Modell ist sehr klein: wenn möglich ein kompakter Absatz. Kein Vorwort („Klar“, „Hier ist“). Direkt in den gewünschten Text.",
  fr: "Le modèle local est très petit : un paragraphe serré si possible. Pas d’intro (« Bien sûr », « Voici »). Va droit au texte demandé.",
  es: "El modelo local es muy pequeño: un párrafo compacto si se puede. Sin preámbulo (« Claro », « Aquí tienes »). Ve directo al texto pedido.",
  hr: "Lokalni model je vrlo mali: jedan sažet odlomak ako je moguće. Bez uvoda (« Naravno », « Evo »). Odmah pređite na traženi tekst.",
  sr: "Lokalni model je veoma mali: jedan sažet pasus ako je moguće. Bez uvoda (« Naravno », « Evo »). Odmah pređite na traženi tekst.",
  pt: "O modelo local é muito pequeno: um parágrafo compacto se possível. Sem prefácio (« Claro », « Aqui está »). Vá direto ao texto pedido.",
  it: "Il modello locale è molto piccolo: un paragrafo compatto se possibile. Nessun preambolo (« Certo », « Ecco »). Vai dritto al testo richiesto.",
  nl: "Het lokale model is zeer klein: één compacte alinea indien mogelijk. Geen inleiding (« Natuurlijk », « Hier is »). Ga direct naar de gevraagde tekst.",
};

const EXTRA_SMALL_LINES: Localized<[string, string]> = {
  en: ["Use simple words.", "Do not add a title."],
  de: ["Einfache Wörter.", "Keinen Titel hinzufügen."],
  fr: ["Mots simples.", "Pas de titre."],
  es: ["Palabras simples.", "Sin título."],
  hr: ["Jednostavne riječi.", "Bez naslova."],
  sr: ["Jednostavne reči.", "Bez naslova."],
  pt: ["Palavras simples.", "Não adicione título."],
  it: ["Parole semplici.", "Nessun titolo."],
  nl: ["Eenvoudige woorden.", "Geen titel toevoegen."],
};

export function getLocalizedBaseInstruction(
  tier: ModelTier,
  language: SupportedLanguage,
): string {
  if (tier === "small") {
    return BASE_INSTRUCTION_SMALL_LOC[language] ?? BASE_INSTRUCTION_SMALL_LOC.en;
  }
  return BASE_INSTRUCTION_LOC[language] ?? BASE_INSTRUCTION_LOC.en;
}

export function getLocalizedPlaceholderBraceRule(language: SupportedLanguage): string {
  return PLACEHOLDER_BRACE_RULE_LOC[language] ?? PLACEHOLDER_BRACE_RULE_LOC.en;
}

export function getLocalizedGroundingRulesSmall(language: SupportedLanguage): string {
  return GROUNDING_RULES_SMALL_LOC[language] ?? GROUNDING_RULES_SMALL_LOC.en;
}

export function getLocalizedExampleShapePrefix(language: SupportedLanguage): string {
  return EXAMPLE_SHAPE_PREFIX[language] ?? EXAMPLE_SHAPE_PREFIX.en;
}

export function getLocalizedUltraSmallNote(language: SupportedLanguage): string {
  return ULTRA_SMALL_NOTE[language] ?? ULTRA_SMALL_NOTE.en;
}

export function getLocalizedExtraSmallLines(language: SupportedLanguage): [string, string] {
  return EXTRA_SMALL_LINES[language] ?? EXTRA_SMALL_LINES.en;
}

export function buildOutputRepairAdditionLocalized(
  issues: LocalLlmValidationIssue[],
  language: SupportedLanguage = "en",
): string {
  const hdr: Localized<string> = {
    en: "---\nREGENERATE (your last answer failed checks). Use the same USER REQUEST above.\nRules for this attempt:",
    de: "---\nNEU GENERIEREN (letzte Antwort hat Prüfungen nicht bestanden). Nutze dieselbe NUTZERANFRAGE wie oben.\nRegeln für diesen Versuch:",
    fr: "---\nREGÉNÈRE (ta dernière réponse a échoué aux contrôles). Utilise la même DEMANDE ci-dessus.\nRègles pour cette tentative :",
    es: "---\nREGENERA (tu última respuesta no pasó las comprobaciones). Usa la misma SOLICITUD de arriba.\nReglas para este intento:",
  };
  const lines: Localized<string[]> = {
    en: [
      "- Output only the final text. No preamble like “Here is” or “Sure”.",
      "- No {{ or }} and no placeholder tokens.",
      "- No “Final note:” and no thinking tags.",
    ],
    de: [
      "- Nur den fertigen Text ausgeben. Kein Vorwort wie „Hier ist“ oder „Klar“.",
      "- Keine {{ oder }} und keine Platzhalter.",
      "- Kein „Endgültige Notiz:“ und keine Denk-Tags.",
    ],
    fr: [
      "- Uniquement le texte final. Pas d’intro du type « Voici » ou « Bien sûr ».",
      "- Pas de {{ ou }} ni de jetons placeholder.",
      "- Pas de « Note finale : » ni de balises de raisonnement.",
    ],
    es: [
      "- Solo el texto final. Sin preámbulos como « Aquí tienes » o « Claro ».",
      "- Sin {{ ni }} ni marcadores.",
      "- Sin « Nota final: » ni etiquetas de razonamiento.",
    ],
  };
  const meeting: Localized<string> = {
    en: "- Greet or address the person using the exact name or title from the USER REQUEST.",
    de: "- Grüße oder sprich die Person mit exaktem Namen oder Titel aus der NUTZERANFRAGE an.",
    fr: "- Salue la personne avec le nom ou titre exact de la DEMANDE.",
    es: "- Saluda a la persona con el nombre o cargo exacto de la SOLICITUD.",
  };
  const bullets: Localized<string> = {
    en: "- Use at most 4 bullet points. One idea per bullet.",
    de: "- Höchstens 4 Stichpunkte. Eine Idee pro Punkt.",
    fr: "- Au plus 4 puces. Une idée par puce.",
    es: "- Como máximo 4 viñetas. Una idea por viñeta.",
  };
  const thinking: Localized<string> = {
    en: "- Do not output <think>, <think>, or any XML-style reasoning tags.",
    de: "- Keine <think>- oder XML-ähnlichen Denk-Tags ausgeben.",
    fr: "- N’affiche pas de balises <think> ni de raisonnement XML.",
    es: "- No emitas <think> ni etiquetas XML de razonamiento.",
  };
  const end: Localized<string> = {
    en: "Throw away the bad patterns above and write the correct version now.",
    de: "Ignoriere die fehlerhaften Muster oben und schreibe jetzt die richtige Version.",
    fr: "Oublie les mauvais schémas ci-dessus et écris la version correcte maintenant.",
    es: "Descarta los patrones incorrectos de arriba y escribe la versión correcta ahora.",
  };

  const L = lines[language] ?? lines.en;
  const out: string[] = [hdr[language] ?? hdr.en, ...L];
  if (issues.includes("meeting_recipient_missing")) {
    out.push(meeting[language] ?? meeting.en);
  }
  if (issues.includes("too_many_bullets_summarize")) {
    out.push(bullets[language] ?? bullets.en);
  }
  if (issues.includes("thinking_tag")) {
    out.push(thinking[language] ?? thinking.en);
  }
  out.push(end[language] ?? end.en);
  return out.join("\n");
}
