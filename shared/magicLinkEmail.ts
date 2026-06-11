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
  intro: string;
  securityExpiry: string;
  cta: string;
  urlFallbackPrompt: string;
  urlFallbackLinkLabel: string;
  hideRawUrlInHtml: boolean;
  ignore: string;
  footer: string;
  compact: boolean;
};

const COPY: Record<MagicLinkEmailPurpose, Record<AuthEmailLocale, MagicLinkCopy>> = {
  default: {
    en: {
      subject: "Finish signing in to PrivateNote",
      preheader: "Your secure sign-in link expires in 10 minutes.",
      title: "Finish signing in",
      intro: "You asked to sign in to PrivateNote. Tap the button below to continue securely.",
      securityExpiry:
        "Open this link in the same browser you used to request it. It expires in 10 minutes and works only once.",
      cta: "Sign in securely",
      urlFallbackPrompt: "Or paste this link into your browser:",
      urlFallbackLinkLabel: "Open sign-in link",
      hideRawUrlInHtml: false,
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted private notes — only you and your recipients can read them.",
      compact: false,
    },
    de: {
      subject: "Anmeldung bei PrivateNote abschliessen",
      preheader: "Ihr sicherer Anmeldelink laeuft in 10 Minuten ab.",
      title: "Anmeldung abschliessen",
      intro: "Sie moechten sich bei PrivateNote anmelden. Tippen Sie unten, um sicher fortzufahren.",
      securityExpiry:
        "Oeffnen Sie diesen Link im selben Browser, in dem Sie ihn angefordert haben. Er laeuft in 10 Minuten ab und funktioniert nur einmal.",
      cta: "Sicher anmelden",
      urlFallbackPrompt: "Oder fuegen Sie diesen Link in Ihren Browser ein:",
      urlFallbackLinkLabel: "Anmeldelink oeffnen",
      hideRawUrlInHtml: false,
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte private Notizen — nur Sie und Ihre Empfaenger koennen sie lesen.",
      compact: false,
    },
    fr: {
      subject: "Terminez votre connexion a PrivateNote",
      preheader: "Votre lien de connexion securise expire dans 10 minutes.",
      title: "Terminez votre connexion",
      intro: "Vous avez demande a vous connecter a PrivateNote. Appuyez ci-dessous pour continuer en toute securite.",
      securityExpiry:
        "Ouvrez ce lien dans le meme navigateur que celui utilise pour la demande. Il expire dans 10 minutes et ne fonctionne qu une seule fois.",
      cta: "Se connecter en toute securite",
      urlFallbackPrompt: "Ou collez ce lien dans votre navigateur :",
      urlFallbackLinkLabel: "Ouvrir le lien de connexion",
      hideRawUrlInHtml: false,
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes privees chiffrees de bout en bout — seuls vous et vos destinataires pouvez les lire.",
      compact: false,
    },
    es: {
      subject: "Termina tu inicio de sesion en PrivateNote",
      preheader: "Tu enlace seguro de inicio de sesion caduca en 10 minutos.",
      title: "Termina tu inicio de sesion",
      intro: "Pediste iniciar sesion en PrivateNote. Pulsa el boton de abajo para continuar de forma segura.",
      securityExpiry:
        "Abre este enlace en el mismo navegador donde lo solicitaste. Caduca en 10 minutos y solo funciona una vez.",
      cta: "Iniciar sesion de forma segura",
      urlFallbackPrompt: "O pega este enlace en tu navegador:",
      urlFallbackLinkLabel: "Abrir enlace de inicio de sesion",
      hideRawUrlInHtml: false,
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas privadas cifradas de extremo a extremo — solo tu y tus destinatarios pueden leerlas.",
      compact: false,
    },
  },
  file_attach: {
    en: {
      subject: "Attach encrypted files",
      preheader: "Sign in to return and attach encrypted files.",
      title: "Attach encrypted files",
      intro:
        "Sign in to continue attaching encrypted files to your PrivateNote. We'll bring you back automatically.",
      securityExpiry: "This link expires in 10 minutes and can only be used once.",
      cta: "Sign in and attach files",
      urlFallbackPrompt: "Button not working?",
      urlFallbackLinkLabel: "Use this sign-in link",
      hideRawUrlInHtml: true,
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted notes and file sharing.",
      compact: true,
    },
    de: {
      subject: "Verschluesselte Dateien anhaengen",
      preheader: "Melden Sie sich an, um verschluesselte Dateien anzuhaengen.",
      title: "Verschluesselte Dateien anhaengen",
      intro:
        "Melden Sie sich an, um verschluesselte Dateien an Ihre PrivateNote anzuhaengen. Wir bringen Sie automatisch zurueck.",
      securityExpiry: "Dieser Link laeuft in 10 Minuten ab und kann nur einmal verwendet werden.",
      cta: "Anmelden und Dateien anhaengen",
      urlFallbackPrompt: "Button funktioniert nicht?",
      urlFallbackLinkLabel: "Diesen Anmeldelink verwenden",
      hideRawUrlInHtml: true,
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte Notizen und Dateifreigabe.",
      compact: true,
    },
    fr: {
      subject: "Joindre des fichiers chiffres",
      preheader: "Connectez-vous pour joindre des fichiers chiffres.",
      title: "Joindre des fichiers chiffres",
      intro:
        "Connectez-vous pour continuer a joindre des fichiers chiffres a votre PrivateNote. Nous vous ramenerons automatiquement.",
      securityExpiry: "Ce lien expire dans 10 minutes et ne peut etre utilise qu une seule fois.",
      cta: "Se connecter et joindre des fichiers",
      urlFallbackPrompt: "Le bouton ne fonctionne pas ?",
      urlFallbackLinkLabel: "Utiliser ce lien de connexion",
      hideRawUrlInHtml: true,
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes chiffrees de bout en bout et partage de fichiers.",
      compact: true,
    },
    es: {
      subject: "Adjuntar archivos cifrados",
      preheader: "Inicia sesion para adjuntar archivos cifrados.",
      title: "Adjuntar archivos cifrados",
      intro:
        "Inicia sesion para seguir adjuntando archivos cifrados a tu PrivateNote. Te devolveremos automaticamente.",
      securityExpiry: "Este enlace caduca en 10 minutos y solo puede usarse una vez.",
      cta: "Iniciar sesion y adjuntar archivos",
      urlFallbackPrompt: "El boton no funciona?",
      urlFallbackLinkLabel: "Usar este enlace de inicio de sesion",
      hideRawUrlInHtml: true,
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas cifradas de extremo a extremo y archivos compartidos.",
      compact: true,
    },
  },
};

function buildMagicLinkHtml(copy: MagicLinkCopy, magicUrl: string): string {
  const safeUrl = escapeHtml(magicUrl);
  const pad = copy.compact ? "24px 20px 20px" : "32px 24px 28px";
  const titleMb = copy.compact ? "10px" : "16px";
  const introMb = copy.compact ? "18px" : "24px";
  const ctaMb = copy.compact ? "16px" : "24px";
  const fallbackMb = copy.compact ? "14px" : "24px";
  const securityMb = copy.compact ? "12px" : "16px";
  const hrMargin = copy.compact ? "20px 0 12px" : "28px 0 16px";
  const titleSize = copy.compact ? "21px" : "22px";
  const introSize = copy.compact ? "15px" : "16px";

  const fallbackHtml = copy.hideRawUrlInHtml
    ? [
        `  <p style="margin: 0 0 4px; color: #6B7280; font-size: 13px; line-height: 1.45;">${escapeHtml(copy.urlFallbackPrompt)}</p>`,
        "  <p style=\"margin: 0 0 " + fallbackMb + ";\">",
        "  <a href=\"" +
          safeUrl +
          `" referrerpolicy="no-referrer" style="color: #0066FF; font-size: 14px; font-weight: 500; text-decoration: underline;">${escapeHtml(copy.urlFallbackLinkLabel)}</a>`,
        "  </p>",
      ].join("\n")
    : [
        `  <p style="margin: 0 0 6px; color: #6B7280; font-size: 13px; line-height: 1.45;">${escapeHtml(copy.urlFallbackPrompt)}</p>`,
        `  <p style="margin: 0 0 ${fallbackMb}; color: #374151; font-size: 13px; line-height: 1.45; word-break: break-all;">${safeUrl}</p>`,
      ].join("\n");

  return [
    "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; max-width: 600px; margin: 0 auto; padding: " +
      pad +
      '; text-align: left; -webkit-text-size-adjust: 100%; box-sizing: border-box;">',
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader)}</div>`,
    `  <h1 style="margin: 0 0 ${titleMb}; font-size: ${titleSize}; font-weight: 700; line-height: 1.3; color: #111827;">${escapeHtml(copy.title)}</h1>`,
    `  <p style="margin: 0 0 ${introMb}; color: #374151; font-size: ${introSize}; line-height: 1.5;">${escapeHtml(copy.intro)}</p>`,
    "  <p style=\"margin: 0 0 " + ctaMb + ";\">",
    "  <a href=\"" +
      safeUrl +
      `" referrerpolicy="no-referrer" style="display: inline-block; max-width: 100%; box-sizing: border-box; background: #0066FF; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 10px; font-weight: 600; font-size: 16px; line-height: 1.3; text-align: center;">${escapeHtml(copy.cta)}</a>`,
    "  </p>",
    fallbackHtml,
    `  <p style="margin: 0 0 ${securityMb}; color: #6B7280; font-size: 13px; line-height: 1.45;">${escapeHtml(copy.securityExpiry)}</p>`,
    `  <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 1.45;">${escapeHtml(copy.ignore)}</p>`,
    `  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: ${hrMargin};" />`,
    `  <p style="margin: 0; font-size: 14px; font-weight: 700; line-height: 1.35;">PrivateNote</p>`,
    `  <p style="margin: 6px 0 0; color: #6B7280; font-size: 13px; line-height: 1.45;">${escapeHtml(copy.footer)}</p>`,
    "</div>",
  ].join("\n");
}

function buildMagicLinkText(copy: MagicLinkCopy, magicUrl: string): string {
  const fallbackLines = copy.hideRawUrlInHtml
    ? [copy.urlFallbackPrompt, copy.urlFallbackLinkLabel + ": " + magicUrl]
    : [copy.urlFallbackPrompt, magicUrl];

  return [
    copy.title,
    "",
    copy.intro,
    "",
    copy.cta + ":",
    magicUrl,
    "",
    ...fallbackLines,
    "",
    copy.securityExpiry,
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
  locale?: AuthEmailLocale;
  purpose?: MagicLinkEmailPurpose;
}): { subject: string; preheader: string; text: string; html: string } {
  const locale = options.locale ?? "en";
  const purpose = options.purpose ?? "default";
  const copy = COPY[purpose][locale];

  return {
    subject: copy.subject,
    preheader: copy.preheader,
    text: buildMagicLinkText(copy, options.magicUrl),
    html: buildMagicLinkHtml(copy, options.magicUrl),
  };
}
