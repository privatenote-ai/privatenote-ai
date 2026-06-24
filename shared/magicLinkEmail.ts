import { escapeHtml } from "./escapeHtml.ts";

export type AuthEmailLocale = "en" | "de" | "fr" | "es";
export type MagicLinkEmailPurpose = "default" | "file_attach";

export const MAGIC_LINK_TTL_MINUTES = 10;

export function normalizeAuthEmailLocale(raw: unknown): AuthEmailLocale {
  if (typeof raw !== "string") return "en";
  const v = raw.trim().toLowerCase();
  return v === "de" || v === "fr" || v === "es" ? v : "en";
}

export function detectAuthEmailLocale(request: Request, explicit?: unknown): AuthEmailLocale {
  const normalizedExplicit = normalizeAuthEmailLocale(explicit);
  if (typeof explicit === "string" && normalizedExplicit !== "en") return normalizedExplicit;
  const accept = request.headers.get("Accept-Language") || "";
  const primary = accept.split(",")[0]?.trim().toLowerCase() || "";
  if (primary.startsWith("de")) return "de";
  if (primary.startsWith("fr")) return "fr";
  if (primary.startsWith("es")) return "es";
  return normalizedExplicit;
}

export function normalizeMagicLinkEmailPurpose(raw: unknown): MagicLinkEmailPurpose {
  if (typeof raw !== "string") return "default";
  const v = raw.trim().toLowerCase();
  return v === "file_attach" ? "file_attach" : "default";
}

type MagicLinkCopy = {
  subject: string;
  preheader: string;
  title: string;
  codeExpiry: string;
  linkAlternativeHeading: string;
  linkAlternativeBody: string;
  cta: string;
  ignore: string;
  footer: string;
};

const COPY: Record<MagicLinkEmailPurpose, Record<AuthEmailLocale, MagicLinkCopy>> = {
  default: {
    en: {
      subject: "Your PrivateNote sign-in code",
      preheader: "Your sign-in code and one-tap link expire in 10 minutes.",
      title: "Your PrivateNote sign-in code",
      codeExpiry: "This code expires after 10 minutes or if you request a new code.",
      linkAlternativeHeading: "Or sign in with one tap",
      linkAlternativeBody: "Finish signing in to {host} below.",
      cta: "Log in",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted private notes — only you and your recipients can read them.",
    },
    de: {
      subject: "Ihr PrivateNote-Anmeldecode",
      preheader: "Ihr Anmeldecode und Ein-Tipp-Link laufen in 10 Minuten ab.",
      title: "Ihr PrivateNote-Anmeldecode",
      codeExpiry: "Dieser Code laeuft nach 10 Minuten ab oder wenn Sie einen neuen Code anfordern.",
      linkAlternativeHeading: "Oder mit einem Tipp anmelden",
      linkAlternativeBody: "Schliessen Sie die Anmeldung bei {host} unten ab.",
      cta: "Anmelden",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte private Notizen — nur Sie und Ihre Empfaenger koennen sie lesen.",
    },
    fr: {
      subject: "Votre code de connexion PrivateNote",
      preheader: "Votre code et lien expirent dans 10 minutes.",
      title: "Votre code de connexion PrivateNote",
      codeExpiry: "Ce code expire apres 10 minutes ou si vous demandez un nouveau code.",
      linkAlternativeHeading: "Ou connectez-vous en un tap",
      linkAlternativeBody: "Terminez la connexion sur {host} ci-dessous.",
      cta: "Se connecter",
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes privees chiffrees de bout en bout — seuls vous et vos destinataires pouvez les lire.",
    },
    es: {
      subject: "Tu codigo de inicio de sesion de PrivateNote",
      preheader: "Tu codigo y enlace caducan en 10 minutos.",
      title: "Tu codigo de inicio de sesion de PrivateNote",
      codeExpiry: "Este codigo caduca a los 10 minutos o si solicitas uno nuevo.",
      linkAlternativeHeading: "O inicia sesion con un toque",
      linkAlternativeBody: "Termina el inicio de sesion en {host} abajo.",
      cta: "Iniciar sesion",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas privadas cifradas de extremo a extremo — solo tu y tus destinatarios pueden leerlas.",
    },
  },
  file_attach: {
    en: {
      subject: "Your PrivateNote sign-in code",
      preheader: "Sign in to attach encrypted files — code and link expire in 10 minutes.",
      title: "Your PrivateNote sign-in code",
      codeExpiry: "This code expires after 10 minutes or if you request a new code.",
      linkAlternativeHeading: "Or sign in with one tap",
      linkAlternativeBody: "Return to attach encrypted files on {host} below.",
      cta: "Log in",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted notes and file sharing.",
    },
    de: {
      subject: "Ihr PrivateNote-Anmeldecode",
      preheader: "Melden Sie sich an, um verschluesselte Dateien anzuhaengen.",
      title: "Ihr PrivateNote-Anmeldecode",
      codeExpiry: "Dieser Code laeuft nach 10 Minuten ab oder wenn Sie einen neuen Code anfordern.",
      linkAlternativeHeading: "Oder mit einem Tipp anmelden",
      linkAlternativeBody: "Kehren Sie zu {host} zurueck, um verschluesselte Dateien anzuhaengen.",
      cta: "Anmelden",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte Notizen und Dateifreigabe.",
    },
    fr: {
      subject: "Votre code de connexion PrivateNote",
      preheader: "Connectez-vous pour joindre des fichiers chiffres.",
      title: "Votre code de connexion PrivateNote",
      codeExpiry: "Ce code expire apres 10 minutes ou si vous demandez un nouveau code.",
      linkAlternativeHeading: "Ou connectez-vous en un tap",
      linkAlternativeBody: "Revenez sur {host} pour joindre des fichiers chiffres.",
      cta: "Se connecter",
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes chiffrees de bout en bout et partage de fichiers.",
    },
    es: {
      subject: "Tu codigo de inicio de sesion de PrivateNote",
      preheader: "Inicia sesion para adjuntar archivos cifrados.",
      title: "Tu codigo de inicio de sesion de PrivateNote",
      codeExpiry: "Este codigo caduca a los 10 minutos o si solicitas uno nuevo.",
      linkAlternativeHeading: "O inicia sesion con un toque",
      linkAlternativeBody: "Vuelve a {host} para adjuntar archivos cifrados.",
      cta: "Iniciar sesion",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas cifradas de extremo a extremo y archivos compartidos.",
    },
  },
};

function substituteHost(template: string, hostLabel: string): string {
  return template.replace(/\{host\}/g, hostLabel);
}

function buildMagicLinkHtml(copy: MagicLinkCopy, magicUrl: string, signInCode: string, hostLabel: string): string {
  const safeUrl = escapeHtml(magicUrl);
  const safeCode = escapeHtml(signInCode);
  const altBody = escapeHtml(substituteHost(copy.linkAlternativeBody, hostLabel));

  return [
    '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: 32px 24px 28px; text-align: left; -webkit-text-size-adjust: 100%; box-sizing: border-box;">',
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader)}</div>`,
    `  <h1 style="margin: 0 0 20px; font-size: 22px; font-weight: 700; line-height: 1.3; color: #111827;">${escapeHtml(copy.title)}</h1>`,
    `  <p style="margin: 0 0 8px; font-size: 32px; letter-spacing: 0.18em; font-weight: 700; color: #111827; font-variant-numeric: tabular-nums;">${safeCode}</p>`,
    `  <p style="margin: 0 0 28px; color: #6B7280; font-size: 14px; line-height: 1.45;">${escapeHtml(copy.codeExpiry)}</p>`,
    `  <p style="margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #111827;">${escapeHtml(copy.linkAlternativeHeading)}</p>`,
    `  <p style="margin: 0 0 16px; color: #374151; font-size: 15px; line-height: 1.5;">${altBody}</p>`,
    '  <p style="margin: 0 0 24px;">',
    '  <a href="' +
      safeUrl +
      `" referrerpolicy="no-referrer" style="display: inline-block; max-width: 100%; box-sizing: border-box; background: #0066FF; color: #FFFFFF; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: 600; font-size: 16px; line-height: 1.3; text-align: center;">${escapeHtml(copy.cta)}</a>`,
    "  </p>",
    `  <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.45;">${escapeHtml(copy.ignore)}</p>`,
    '  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 28px 0 16px;" />',
    '  <p style="margin: 0; font-size: 14px; font-weight: 700; line-height: 1.35;">PrivateNote</p>',
    `  <p style="margin: 6px 0 0; color: #6B7280; font-size: 13px; line-height: 1.45;">${escapeHtml(copy.footer)}</p>`,
    "</div>",
  ].join("\n");
}

function buildMagicLinkText(copy: MagicLinkCopy, magicUrl: string, signInCode: string, hostLabel: string): string {
  const altBody = substituteHost(copy.linkAlternativeBody, hostLabel);
  return [
    copy.title,
    "",
    signInCode,
    "",
    copy.codeExpiry,
    "",
    copy.linkAlternativeHeading,
    altBody,
    "",
    copy.cta + ":",
    magicUrl,
    "",
    copy.ignore,
    "",
    "—",
    "PrivateNote",
    copy.footer,
  ].join("\n");
}

export function buildMagicLinkEmailContent(options: {
  magicUrl: string;
  signInCode: string;
  hostLabel?: string;
  locale?: AuthEmailLocale;
  purpose?: MagicLinkEmailPurpose;
}): { subject: string; preheader: string; text: string; html: string } {
  const locale = options.locale ?? "en";
  const purpose = options.purpose ?? "default";
  const copy = COPY[purpose][locale];
  let hostLabel = options.hostLabel?.trim() || "PrivateNote";
  try {
    hostLabel = new URL(options.magicUrl).host || hostLabel;
  } catch {
    /* keep hostLabel */
  }

  return {
    subject: copy.subject,
    preheader: copy.preheader,
    text: buildMagicLinkText(copy, options.magicUrl, options.signInCode, hostLabel),
    html: buildMagicLinkHtml(copy, options.magicUrl, options.signInCode, hostLabel),
  };
}
