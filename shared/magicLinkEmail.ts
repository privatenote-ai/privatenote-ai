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
  community: string;
};

const COPY: Record<MagicLinkEmailPurpose, Record<AuthEmailLocale, MagicLinkCopy>> = {
  default: {
    en: {
      subject: "Your PrivateNote sign-in code",
      preheader: "Your sign-in code expires in 10 minutes.",
      title: "Your PrivateNote sign-in code",
      codeExpiry: "This code expires after 10 minutes or if you request a new code.",
      linkAlternativeHeading: "Prefer not to use the code?",
      linkAlternativeBody: "Finish logging in to {host} below.",
      cta: "Log in",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted private notes — only you and your recipients can read them.",
      community: "Community",
    },
    de: {
      subject: "Ihr PrivateNote-Anmeldecode",
      preheader: "Ihr Anmeldecode laeuft in 10 Minuten ab.",
      title: "Ihr PrivateNote-Anmeldecode",
      codeExpiry: "Dieser Code laeuft nach 10 Minuten ab oder wenn Sie einen neuen Code anfordern.",
      linkAlternativeHeading: "Moechten Sie den Code nicht verwenden?",
      linkAlternativeBody: "Schliessen Sie die Anmeldung bei {host} unten ab.",
      cta: "Anmelden",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte private Notizen — nur Sie und Ihre Empfaenger koennen sie lesen.",
      community: "Community",
    },
    fr: {
      subject: "Votre code de connexion PrivateNote",
      preheader: "Votre code expire dans 10 minutes.",
      title: "Votre code de connexion PrivateNote",
      codeExpiry: "Ce code expire apres 10 minutes ou si vous demandez un nouveau code.",
      linkAlternativeHeading: "Vous preferez ne pas utiliser le code ?",
      linkAlternativeBody: "Terminez la connexion sur {host} ci-dessous.",
      cta: "Se connecter",
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes privees chiffrees de bout en bout — seuls vous et vos destinataires pouvez les lire.",
      community: "Communaute",
    },
    es: {
      subject: "Tu codigo de inicio de sesion de PrivateNote",
      preheader: "Tu codigo caduca en 10 minutos.",
      title: "Tu codigo de inicio de sesion de PrivateNote",
      codeExpiry: "Este codigo caduca a los 10 minutos o si solicitas uno nuevo.",
      linkAlternativeHeading: "Prefieres no usar el codigo?",
      linkAlternativeBody: "Termina el inicio de sesion en {host} abajo.",
      cta: "Iniciar sesion",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas privadas cifradas de extremo a extremo — solo tu y tus destinatarios pueden leerlas.",
      community: "Comunidad",
    },
  },
  file_attach: {
    en: {
      subject: "Your PrivateNote sign-in code",
      preheader: "Sign in to attach encrypted files. Your code expires in 10 minutes.",
      title: "Your PrivateNote sign-in code",
      codeExpiry: "This code expires after 10 minutes or if you request a new code.",
      linkAlternativeHeading: "Prefer not to use the code?",
      linkAlternativeBody: "Return to attach encrypted files on {host} below.",
      cta: "Log in",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted notes and file sharing.",
      community: "Community",
    },
    de: {
      subject: "Ihr PrivateNote-Anmeldecode",
      preheader: "Melden Sie sich an, um verschluesselte Dateien anzuhaengen.",
      title: "Ihr PrivateNote-Anmeldecode",
      codeExpiry: "Dieser Code laeuft nach 10 Minuten ab oder wenn Sie einen neuen Code anfordern.",
      linkAlternativeHeading: "Moechten Sie den Code nicht verwenden?",
      linkAlternativeBody: "Kehren Sie zu {host} zurueck, um verschluesselte Dateien anzuhaengen.",
      cta: "Anmelden",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte Notizen und Dateifreigabe.",
      community: "Community",
    },
    fr: {
      subject: "Votre code de connexion PrivateNote",
      preheader: "Connectez-vous pour joindre des fichiers chiffres.",
      title: "Votre code de connexion PrivateNote",
      codeExpiry: "Ce code expire apres 10 minutes ou si vous demandez un nouveau code.",
      linkAlternativeHeading: "Vous preferez ne pas utiliser le code ?",
      linkAlternativeBody: "Revenez sur {host} pour joindre des fichiers chiffres.",
      cta: "Se connecter",
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes chiffrees de bout en bout et partage de fichiers.",
      community: "Communaute",
    },
    es: {
      subject: "Tu codigo de inicio de sesion de PrivateNote",
      preheader: "Inicia sesion para adjuntar archivos cifrados.",
      title: "Tu codigo de inicio de sesion de PrivateNote",
      codeExpiry: "Este codigo caduca a los 10 minutos o si solicitas uno nuevo.",
      linkAlternativeHeading: "Prefieres no usar el codigo?",
      linkAlternativeBody: "Vuelve a {host} para adjuntar archivos cifrados.",
      cta: "Iniciar sesion",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas cifradas de extremo a extremo y archivos compartidos.",
      community: "Comunidad",
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
    '<div style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#000000;-webkit-text-size-adjust:100%;">',
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader)}</div>`,
    '  <div style="max-width:650px;margin:0 auto;background:#ffffff;">',
    '    <div style="height:10px;background:#ff7a1a;line-height:10px;font-size:10px;">&nbsp;</div>',
    '    <div style="padding:48px 40px 56px;">',
    '      <div style="margin:0 0 76px;font-size:34px;line-height:1;font-weight:800;letter-spacing:0;color:#111827;">',
    '        <span style="display:inline-block;color:#ff7a1a;font-size:30px;line-height:1;vertical-align:middle;margin-right:12px;">&#9679;</span><span style="vertical-align:middle;">PrivateNote</span>',
    '      </div>',
    `      <h1 style="margin:0 0 44px;font-size:28px;line-height:1.2;font-weight:700;color:#000000;">${escapeHtml(copy.title)}</h1>`,
    `      <div style="margin:0 0 44px;font-size:40px;line-height:1.2;font-weight:400;letter-spacing:0.06em;color:#000000;font-variant-numeric:tabular-nums;">${safeCode}</div>`,
    `      <p style="margin:0 0 56px;font-size:21px;line-height:1.35;color:#000000;">${escapeHtml(copy.codeExpiry)}</p>`,
    `      <h2 style="margin:0 0 10px;font-size:28px;line-height:1.2;font-weight:700;color:#000000;">${escapeHtml(copy.linkAlternativeHeading)}</h2>`,
    `      <p style="margin:0 0 28px;font-size:21px;line-height:1.35;color:#000000;">${altBody}</p>`,
    '      <a href="' +
      safeUrl +
      `" referrerpolicy="no-referrer" style="display:inline-block;background:#ff5f33;color:#000000;text-decoration:none;border-radius:10px;padding:16px 34px;font-size:20px;line-height:1.2;font-weight:400;">${escapeHtml(copy.cta)}</a>`,
    `      <p style="margin:36px 0 0;color:#6b7280;font-size:13px;line-height:1.45;">${escapeHtml(copy.ignore)}</p>`,
    "    </div>",
    "  </div>",
    '  <div style="max-width:650px;margin:24px auto 0;text-align:center;color:#8a8a8a;font-size:18px;line-height:1.35;padding:0 24px 28px;">',
    "    <div>Copyright &copy; PrivateNote</div>",
    `    <div style="margin-top:8px;">${escapeHtml(copy.footer)}</div>`,
    `    <div style="margin-top:20px;">privatenote.ai&nbsp;&nbsp;|&nbsp;&nbsp;${escapeHtml(copy.community)}</div>`,
    "  </div>",
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
