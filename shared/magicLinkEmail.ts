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
  securityExpiryHtml: string;
  cta: string;
  urlFallback: string;
  ignore: string;
  footer: string;
};

const COPY: Record<MagicLinkEmailPurpose, Record<AuthEmailLocale, MagicLinkCopy>> = {
  default: {
    en: {
      subject: "Finish signing in to PrivateNote",
      preheader: "Your secure sign-in link expires in 10 minutes.",
      title: "Finish signing in",
      intro: "You asked to sign in to PrivateNote. Tap the button below to continue securely.",
      securityExpiry:
        "For your security, open this link in the same browser where you requested it. It expires in 10 minutes and works only once.",
      securityExpiryHtml:
        "For your security, open this link in the <strong>same browser</strong> where you requested it. It expires in <strong>10 minutes</strong> and works only once.",
      cta: "Sign in securely",
      urlFallback: "Or paste this link into your browser:",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted private notes — only you and your recipients can read them.",
    },
    de: {
      subject: "Anmeldung bei PrivateNote abschliessen",
      preheader: "Ihr sicherer Anmeldelink laeuft in 10 Minuten ab.",
      title: "Anmeldung abschliessen",
      intro: "Sie moechten sich bei PrivateNote anmelden. Tippen Sie unten, um sicher fortzufahren.",
      securityExpiry:
        "Aus Sicherheitsgruenden oeffnen Sie diesen Link im selben Browser, in dem Sie ihn angefordert haben. Er laeuft in 10 Minuten ab und funktioniert nur einmal.",
      securityExpiryHtml:
        "Aus Sicherheitsgruenden oeffnen Sie diesen Link im <strong>selben Browser</strong>, in dem Sie ihn angefordert haben. Er laeuft in <strong>10 Minuten</strong> ab und funktioniert nur einmal.",
      cta: "Sicher anmelden",
      urlFallback: "Oder fuegen Sie diesen Link in Ihren Browser ein:",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte private Notizen — nur Sie und Ihre Empfaenger koennen sie lesen.",
    },
    fr: {
      subject: "Terminez votre connexion a PrivateNote",
      preheader: "Votre lien de connexion securise expire dans 10 minutes.",
      title: "Terminez votre connexion",
      intro: "Vous avez demande a vous connecter a PrivateNote. Appuyez ci-dessous pour continuer en toute securite.",
      securityExpiry:
        "Pour votre securite, ouvrez ce lien dans le meme navigateur que celui utilise pour la demande. Il expire dans 10 minutes et ne fonctionne qu une seule fois.",
      securityExpiryHtml:
        "Pour votre securite, ouvrez ce lien dans le <strong>meme navigateur</strong> que celui utilise pour la demande. Il expire dans <strong>10 minutes</strong> et ne fonctionne qu une seule fois.",
      cta: "Se connecter en toute securite",
      urlFallback: "Ou collez ce lien dans votre navigateur :",
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes privees chiffrees de bout en bout — seuls vous et vos destinataires pouvez les lire.",
    },
    es: {
      subject: "Termina tu inicio de sesion en PrivateNote",
      preheader: "Tu enlace seguro de inicio de sesion caduca en 10 minutos.",
      title: "Termina tu inicio de sesion",
      intro: "Pediste iniciar sesion en PrivateNote. Pulsa el boton de abajo para continuar de forma segura.",
      securityExpiry:
        "Por seguridad, abre este enlace en el mismo navegador donde lo solicitaste. Caduca en 10 minutos y solo funciona una vez.",
      securityExpiryHtml:
        "Por seguridad, abre este enlace en el <strong>mismo navegador</strong> donde lo solicitaste. Caduca en <strong>10 minutos</strong> y solo funciona una vez.",
      cta: "Iniciar sesion de forma segura",
      urlFallback: "O pega este enlace en tu navegador:",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas privadas cifradas de extremo a extremo — solo tu y tus destinatarios pueden leerlas.",
    },
  },
  file_attach: {
    en: {
      subject: "Sign in to attach encrypted files",
      preheader: "Sign in to attach encrypted files to your note.",
      title: "Sign in to attach files",
      intro:
        "You asked to share encrypted files with your note. Tap below to sign in and continue where you left off.",
      securityExpiry:
        "For your security, open this link in the same browser where you requested it. It expires in 10 minutes and works only once.",
      securityExpiryHtml:
        "For your security, open this link in the <strong>same browser</strong> where you requested it. It expires in <strong>10 minutes</strong> and works only once.",
      cta: "Sign in and attach files",
      urlFallback: "Or paste this link into your browser:",
      ignore: "If you did not request this email, you can safely ignore it.",
      footer: "End-to-end encrypted private notes — only you and your recipients can read them.",
    },
    de: {
      subject: "Anmelden, um verschluesselte Dateien anzuhaengen",
      preheader: "Melden Sie sich an, um verschluesselte Dateien an Ihre Notiz anzuhaengen.",
      title: "Anmelden, um Dateien anzuhaengen",
      intro:
        "Sie moechten verschluesselte Dateien mit Ihrer Notiz teilen. Tippen Sie unten, um sich anzumelden und fortzufahren.",
      securityExpiry:
        "Aus Sicherheitsgruenden oeffnen Sie diesen Link im selben Browser, in dem Sie ihn angefordert haben. Er laeuft in 10 Minuten ab und funktioniert nur einmal.",
      securityExpiryHtml:
        "Aus Sicherheitsgruenden oeffnen Sie diesen Link im <strong>selben Browser</strong>, in dem Sie ihn angefordert haben. Er laeuft in <strong>10 Minuten</strong> ab und funktioniert nur einmal.",
      cta: "Anmelden und Dateien anhaengen",
      urlFallback: "Oder fuegen Sie diesen Link in Ihren Browser ein:",
      ignore: "Wenn Sie diese E-Mail nicht angefordert haben, koennen Sie sie getrost ignorieren.",
      footer: "Ende-zu-Ende verschluesselte private Notizen — nur Sie und Ihre Empfaenger koennen sie lesen.",
    },
    fr: {
      subject: "Connectez-vous pour joindre des fichiers chiffres",
      preheader: "Connectez-vous pour joindre des fichiers chiffres a votre note.",
      title: "Connectez-vous pour joindre des fichiers",
      intro:
        "Vous avez demande a partager des fichiers chiffres avec votre note. Appuyez ci-dessous pour vous connecter et continuer.",
      securityExpiry:
        "Pour votre securite, ouvrez ce lien dans le meme navigateur que celui utilise pour la demande. Il expire dans 10 minutes et ne fonctionne qu une seule fois.",
      securityExpiryHtml:
        "Pour votre securite, ouvrez ce lien dans le <strong>meme navigateur</strong> que celui utilise pour la demande. Il expire dans <strong>10 minutes</strong> et ne fonctionne qu une seule fois.",
      cta: "Se connecter et joindre des fichiers",
      urlFallback: "Ou collez ce lien dans votre navigateur :",
      ignore: "Si vous n avez pas demande cet e-mail, vous pouvez l ignorer en toute securite.",
      footer: "Notes privees chiffrees de bout en bout — seuls vous et vos destinataires pouvez les lire.",
    },
    es: {
      subject: "Inicia sesion para adjuntar archivos cifrados",
      preheader: "Inicia sesion para adjuntar archivos cifrados a tu nota.",
      title: "Inicia sesion para adjuntar archivos",
      intro:
        "Pediste compartir archivos cifrados con tu nota. Pulsa abajo para iniciar sesion y continuar.",
      securityExpiry:
        "Por seguridad, abre este enlace en el mismo navegador donde lo solicitaste. Caduca en 10 minutos y solo funciona una vez.",
      securityExpiryHtml:
        "Por seguridad, abre este enlace en el <strong>mismo navegador</strong> donde lo solicitaste. Caduca en <strong>10 minutos</strong> y solo funciona una vez.",
      cta: "Iniciar sesion y adjuntar archivos",
      urlFallback: "O pega este enlace en tu navegador:",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas privadas cifradas de extremo a extremo — solo tu y tus destinatarios pueden leerlas.",
    },
  },
};

export function buildMagicLinkEmailContent(options: {
  magicUrl: string;
  locale?: AuthEmailLocale;
  purpose?: MagicLinkEmailPurpose;
}): { subject: string; preheader: string; text: string; html: string } {
  const locale = options.locale ?? "en";
  const purpose = options.purpose ?? "default";
  const copy = COPY[purpose][locale];
  const safeUrl = escapeHtml(options.magicUrl);

  const text = [
    copy.title,
    "",
    copy.intro,
    "",
    copy.cta + ":",
    options.magicUrl,
    "",
    copy.securityExpiry,
    "",
    copy.ignore,
    "",
    "—",
    "PrivateNote",
    copy.footer,
  ].join("\n");

  const html = [
    "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; max-width: 480px; margin: 0; padding: 0 16px 16px; -webkit-text-size-adjust: 100%; box-sizing: border-box;\">",
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader)}</div>`,
    `  <div style="font-size: 18px; font-weight: 700; margin: 0 0 6px; line-height: 1.25;">${escapeHtml(copy.title)}</div>`,
    `  <p style="margin: 0 0 12px; color: #374151; font-size: 15px; line-height: 1.45;">${escapeHtml(copy.intro)}</p>`,
    "  <a href=\"" +
      safeUrl +
      `" referrerpolicy="no-referrer" style="display: inline-block; max-width: 100%; box-sizing: border-box; background: #0066FF; color: #FFFFFF; text-decoration: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; font-size: 15px; line-height: 1.25; text-align: center; word-wrap: break-word;">${escapeHtml(copy.cta)}</a>`,
    `  <p style="margin: 14px 0 4px; color: #6B7280; font-size: 12px; line-height: 1.45;">${escapeHtml(copy.urlFallback)}</p>`,
    `  <p style="margin: 0 0 12px; color: #374151; font-size: 12px; line-height: 1.45; word-break: break-all;">${safeUrl}</p>`,
    `  <p style="margin: 0 0 8px; color: #374151; font-size: 13px; line-height: 1.45;">${copy.securityExpiryHtml}</p>`,
    `  <p style="margin: 10px 0 0; color: #6B7280; font-size: 12px; line-height: 1.45;">${escapeHtml(copy.ignore)}</p>`,
    `  <hr style="border: 0; border-top: 1px solid #E5E7EB; margin: 18px 0 14px;" />`,
    `  <p style="margin: 0; font-size: 14px; font-weight: 700; line-height: 1.3;">PrivateNote</p>`,
    `  <p style="margin: 6px 0 0; color: #6B7280; font-size: 12px; line-height: 1.42;">${escapeHtml(copy.footer)}</p>`,
    "</div>",
  ].join("");

  return { subject: copy.subject, preheader: copy.preheader, text, html };
}
