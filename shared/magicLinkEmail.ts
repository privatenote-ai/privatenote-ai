import { escapeHtml } from "./escapeHtml.ts";
import { PAGES_APEX_HOST, PAGES_PROJECT_LABEL } from "./pagesAppHosts.ts";

export type AuthEmailLocale = "en" | "de" | "fr" | "es" | "nl";
export type MagicLinkEmailPurpose = "default" | "file_attach";

export const MAGIC_LINK_TTL_MINUTES = 10;

export function normalizeAuthEmailLocale(raw: unknown): AuthEmailLocale {
  if (typeof raw !== "string") return "en";
  const v = raw.trim().toLowerCase();
  return v === "de" || v === "fr" || v === "es" || v === "nl" ? v : "en";
}

export function detectAuthEmailLocale(request: Request, explicit?: unknown): AuthEmailLocale {
  const normalizedExplicit = normalizeAuthEmailLocale(explicit);
  if (typeof explicit === "string" && normalizedExplicit !== "en") return normalizedExplicit;
  const accept = request.headers.get("Accept-Language") || "";
  const primary = accept.split(",")[0]?.trim().toLowerCase() || "";
  if (primary.startsWith("de")) return "de";
  if (primary.startsWith("fr")) return "fr";
  if (primary.startsWith("es")) return "es";
  if (primary.startsWith("nl")) return "nl";
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
      cta: "Sign in",
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
      subject: "Tu código de inicio de sesión de PrivateNote",
      preheader: "Tu código y enlace caducan en 10 minutos.",
      title: "Tu código de inicio de sesión de PrivateNote",
      codeExpiry: "Este código caduca a los 10 minutos o si solicitas uno nuevo.",
      linkAlternativeHeading: "O inicia sesión con un toque",
      linkAlternativeBody: "Completa el inicio de sesión en {host} con el botón de abajo.",
      cta: "Iniciar sesión",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas privadas cifradas de extremo a extremo — solo tú y tus destinatarios pueden leerlas.",
    },
    nl: {
      subject: "Je PrivateNote-inlogcode",
      preheader: "Je inlogcode en link verlopen over 10 minuten.",
      title: "Je PrivateNote-inlogcode",
      codeExpiry: "Deze code verloopt na 10 minuten of als je een nieuwe code aanvraagt.",
      linkAlternativeHeading: "Of log in met één tik",
      linkAlternativeBody: "Rond het inloggen af op {host} hieronder.",
      cta: "Inloggen",
      ignore: "Als je deze e-mail niet hebt aangevraagd, kun je hem negeren.",
      footer: "End-to-end versleutelde privénotities — alleen jij en je ontvangers kunnen ze lezen.",
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
      cta: "Sign in",
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
      subject: "Tu código de inicio de sesión de PrivateNote",
      preheader: "Inicia sesión para adjuntar archivos cifrados — el código y el enlace caducan en 10 minutos.",
      title: "Tu código de inicio de sesión de PrivateNote",
      codeExpiry: "Este código caduca a los 10 minutos o si solicitas uno nuevo.",
      linkAlternativeHeading: "O inicia sesión con un toque",
      linkAlternativeBody: "Vuelve a {host} para adjuntar archivos cifrados.",
      cta: "Iniciar sesión",
      ignore: "Si no solicitaste este correo, puedes ignorarlo sin problema.",
      footer: "Notas cifradas de extremo a extremo y envío de archivos.",
    },
    nl: {
      subject: "Je PrivateNote-inlogcode",
      preheader: "Log in om versleutelde bestanden bij te voegen — code en link verlopen over 10 minuten.",
      title: "Je PrivateNote-inlogcode",
      codeExpiry: "Deze code verloopt na 10 minuten of als je een nieuwe code aanvraagt.",
      linkAlternativeHeading: "Of log in met één tik",
      linkAlternativeBody: "Ga terug naar {host} om versleutelde bestanden bij te voegen.",
      cta: "Inloggen",
      ignore: "Als je deze e-mail niet hebt aangevraagd, kun je hem negeren.",
      footer: "End-to-end versleutelde notities en veilig bestanden delen.",
    },
  },
};

function substituteHost(template: string, hostLabel: string): string {
  return template.replace(/\{host\}/g, hostLabel);
}

const CANONICAL_SITE_HOST = "privatenote.ai";
const STAGING_SITE_HOST = "premium.privatenote.ai";
const CANONICAL_SITE_ORIGIN = `https://${CANONICAL_SITE_HOST}`;

/** Same origin as the magic link so logo assets resolve on prod, premium, and preview hosts. */
export function resolveMagicLinkEmailWebOrigin(magicUrl: string): string {
  try {
    return new URL(magicUrl).origin;
  } catch {
    return CANONICAL_SITE_ORIGIN;
  }
}

/**
 * Host shown in sign-in email copy. Maps Pages preview hosts to the first-party
 * app host so the body does not look like a phishing pages.dev mail.
 * The magic-link href itself is left unchanged.
 */
export function magicLinkEmailDisplayHost(magicUrl: string, fallback = CANONICAL_SITE_HOST): string {
  try {
    const host = new URL(magicUrl).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return host;
    if (host === CANONICAL_SITE_HOST || host === `www.${CANONICAL_SITE_HOST}` || host === `app.${CANONICAL_SITE_HOST}`) {
      return CANONICAL_SITE_HOST;
    }
    if (host === STAGING_SITE_HOST || host === `premium.${PAGES_PROJECT_LABEL}.pages.dev`) {
      return STAGING_SITE_HOST;
    }
    if (host === PAGES_APEX_HOST || host.endsWith(`.${PAGES_PROJECT_LABEL}.pages.dev`)) {
      return CANONICAL_SITE_HOST;
    }
    if (host.endsWith(`.${CANONICAL_SITE_HOST}`)) return host;
    return fallback;
  } catch {
    return fallback;
  }
}

/** Navbar-style header: mark tile + privateNote.ai wordmark (matches site upper-left). */
function buildNavbarLogoEmailHtml(webOrigin: string): string {
  const origin = escapeHtml(webOrigin.replace(/\/$/, ""));
  const markUrl = `${origin}/brand/privateNote-logo-mark.png`;

  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 40px;">',
    "  <tr>",
    '    <td valign="middle" style="padding:0;">',
    `      <a href="${origin}" style="text-decoration:none;">`,
    `        <img src="${markUrl}" alt="PrivateNote" width="30" height="30" border="0" style="display:block;width:30px;height:30px;border:0;outline:none;" />`,
    "      </a>",
    "    </td>",
    `    <td valign="middle" style="padding:0 0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">`,
    `      <a href="${origin}" style="text-decoration:none;color:#0000ff;">`,
    '        <span style="font-size:22px;line-height:1;font-weight:700;color:#0000ff;">privateNote</span>',
    '        <sup style="font-size:11px;line-height:0;font-weight:700;color:#0000ff;vertical-align:super;">.ai</sup>',
    "      </a>",
    "    </td>",
    "  </tr>",
    "</table>",
  ].join("\n");
}

function buildMagicLinkHtml(copy: MagicLinkCopy, magicUrl: string, signInCode: string, hostLabel: string): string {
  const safeUrl = escapeHtml(magicUrl);
  const safeCode = escapeHtml(signInCode);
  const safeTitle = escapeHtml(copy.title);
  const safeCodeExpiry = escapeHtml(copy.codeExpiry);
  const safeAltHeading = escapeHtml(copy.linkAlternativeHeading);
  const altBody = escapeHtml(substituteHost(copy.linkAlternativeBody, hostLabel));
  const safeCta = escapeHtml(copy.cta);
  const safeIgnore = escapeHtml(copy.ignore);
  const safeFooter = escapeHtml(copy.footer);
  const logoHtml = buildNavbarLogoEmailHtml(resolveMagicLinkEmailWebOrigin(magicUrl));

  return [
    '<!doctype html>',
    '<html>',
    '<body style="margin:0;padding:0;background:#f3f4f6;-webkit-text-size-adjust:100%;text-size-adjust:100%;">',
    '<div style="margin:0;padding:0;min-width:100%;background:#f3f4f6;">',
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader)}</div>`,
    '  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f3f4f6" style="border-collapse:collapse;width:100%;min-width:100%;background:#f3f4f6;margin:0;padding:0;">',
    '    <tr>',
    '      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:24px 16px 0;">',
    '        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="border-collapse:collapse;width:100%;max-width:640px;background:#ffffff;">',
    '          <tr><td style="height:10px;background:#0000ff;font-size:0;line-height:0;">&nbsp;</td></tr>',
    '          <tr>',
    '            <td style="padding:42px 40px 36px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;color:#050816;text-align:left;">',
    `              ${logoHtml}`,
    `              <h1 style="margin:0 0 24px;font-size:22px;line-height:1.25;font-weight:800;color:#050816;">${safeTitle}</h1>`,
    `              <p style="margin:0 0 28px;font-size:34px;line-height:1.15;letter-spacing:0.08em;font-weight:500;color:#050816;font-variant-numeric:tabular-nums;">${safeCode}</p>`,
    `              <p style="margin:0 0 30px;font-size:15px;line-height:1.45;font-weight:400;color:#111827;">${safeCodeExpiry}</p>`,
    `              <p style="margin:0 0 7px;font-size:20px;line-height:1.25;font-weight:800;color:#050816;">${safeAltHeading}</p>`,
    `              <p style="margin:0 0 20px;font-size:15px;line-height:1.45;font-weight:400;color:#111827;">${altBody}</p>`,
    '              <p style="margin:0 0 30px;">',
    `                <a href="${safeUrl}" referrerpolicy="no-referrer" style="display:inline-block;max-width:100%;box-sizing:border-box;background:#0000ff;color:#ffffff;text-decoration:none;padding:12px 30px;border-radius:8px;font-weight:600;font-size:15px;line-height:1.25;text-align:center;">${safeCta}</a>`,
    '              </p>',
    `              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.45;">${safeIgnore}</p>`,
    '            </td>',
    '          </tr>',
    '        </table>',
    '      </td>',
    '    </tr>',
    '    <tr>',
    '      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:28px 16px 34px;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;color:#8a8f98;text-align:center;">',
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:600;color:#8a8f98;">Copyright &copy; PrivateNote.ai</p>',
    `        <p style="margin:0 0 16px;font-size:12px;line-height:1.35;color:#8a8f98;">${safeFooter}</p>`,
    '        <p style="margin:0;font-size:13px;line-height:1.35;color:#8a8f98;">',
    `          <a href="${CANONICAL_SITE_ORIGIN}" style="color:#8a8f98;text-decoration:none;">${CANONICAL_SITE_HOST}</a>`,
    '        </p>',
    '      </td>',
    '    </tr>',
    '  </table>',
    "</div>",
    "</body>",
    "</html>",
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
    "PrivateNote.ai",
    copy.footer,
    CANONICAL_SITE_HOST,
  ].join("\n");
}

type BrandedCodeEmailCopy = {
  subject: string;
  preheader: string;
  title: string;
  lead: string;
  codeLabel: string;
  instructions: string;
  codeExpiry: string;
  ignore: string;
  footer: string;
};

const RECIPIENT_VERIFICATION_COPY: BrandedCodeEmailCopy = {
  subject: "PrivateNote verification code",
  preheader: "Your PrivateNote code to unlock a private note addressed to you.",
  title: "Unlock your private note",
  lead: "Someone shared an end-to-end encrypted PrivateNote with you. Use the code below on the note page to continue.",
  codeLabel: "Verification code",
  instructions: "Return to the note link in your browser and enter this code when asked.",
  codeExpiry: "This code stops working if a new one is requested, or when the note link expires.",
  ignore: "If you were not expecting this, you can safely ignore this email. The note stays locked without the code.",
  footer: "End-to-end encrypted private notes — only you and your recipients can read them.",
};

function buildBrandedCodeEmailHtml(
  copy: BrandedCodeEmailCopy,
  code: string,
  webOrigin: string,
): string {
  const safeTitle = escapeHtml(copy.title);
  const safeLead = escapeHtml(copy.lead);
  const safeCode = escapeHtml(code);
  const safeCodeLabel = escapeHtml(copy.codeLabel);
  const safeInstructions = escapeHtml(copy.instructions);
  const safeCodeExpiry = escapeHtml(copy.codeExpiry);
  const safeIgnore = escapeHtml(copy.ignore);
  const safeFooter = escapeHtml(copy.footer);
  const logoHtml = buildNavbarLogoEmailHtml(webOrigin);

  return [
    "<!doctype html>",
    "<html>",
    '<head><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"></head>',
    '<body style="margin:0;padding:0;background:#f3f4f6;-webkit-text-size-adjust:100%;text-size-adjust:100%;">',
    '<div style="margin:0;padding:0;min-width:100%;background:#f3f4f6;">',
    `  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(copy.preheader)}</div>`,
    '  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" bgcolor="#f3f4f6" style="border-collapse:collapse;width:100%;min-width:100%;background:#f3f4f6;margin:0;padding:0;">',
    "    <tr>",
    '      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:24px 16px 0;">',
    '        <table role="presentation" cellpadding="0" cellspacing="0" width="640" style="border-collapse:collapse;width:100%;max-width:640px;background:#ffffff;">',
    '          <tr><td style="height:10px;background:#0000ff;font-size:0;line-height:0;">&nbsp;</td></tr>',
    "          <tr>",
    `            <td style="padding:42px 40px 36px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#050816;text-align:left;">`,
    `              ${logoHtml}`,
    `              <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;font-weight:800;color:#050816;">${safeTitle}</h1>`,
    `              <p style="margin:0 0 24px;font-size:15px;line-height:1.5;font-weight:400;color:#374151;">${safeLead}</p>`,
    '              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:0 0 24px;">',
    "                <tr>",
    '                  <td style="background:#f3f4f6;border:1px solid #e5e7eb;border-radius:12px;padding:20px 22px;text-align:center;">',
    `                    <p style="margin:0 0 8px;font-size:12px;line-height:1.3;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0000ff;">${safeCodeLabel}</p>`,
    `                    <p style="margin:0;font-size:36px;line-height:1.15;letter-spacing:0.18em;font-weight:700;color:#050816;font-variant-numeric:tabular-nums;">${safeCode}</p>`,
    "                  </td>",
    "                </tr>",
    "              </table>",
    `              <p style="margin:0 0 12px;font-size:15px;line-height:1.5;font-weight:400;color:#111827;">${safeInstructions}</p>`,
    `              <p style="margin:0 0 28px;font-size:14px;line-height:1.45;font-weight:400;color:#6b7280;">${safeCodeExpiry}</p>`,
    `              <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.45;">${safeIgnore}</p>`,
    "            </td>",
    "          </tr>",
    "        </table>",
    "      </td>",
    "    </tr>",
    "    <tr>",
    `      <td align="center" bgcolor="#f3f4f6" style="background:#f3f4f6;padding:28px 16px 34px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#8a8f98;text-align:center;">`,
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:700;color:#0000ff;">PrivateNote.ai</p>',
    '        <p style="margin:0 0 4px;font-size:13px;line-height:1.35;font-weight:600;color:#8a8f98;">Copyright &copy; PrivateNote.ai</p>',
    `        <p style="margin:0 0 16px;font-size:12px;line-height:1.35;color:#8a8f98;">${safeFooter}</p>`,
    '        <p style="margin:0;font-size:13px;line-height:1.35;color:#8a8f98;">',
    '          <a href="https://www.privatenote.ai" style="color:#8a8f98;text-decoration:none;">www.privatenote.ai</a>',
    '          <span style="padding:0 10px;color:#8a8f98;">|</span>',
    '          <a href="https://www.linkedin.com/company/privatenote" style="color:#8a8f98;text-decoration:none;">LinkedIn</a>',
    "        </p>",
    "      </td>",
    "    </tr>",
    "  </table>",
    "</div>",
    "</body>",
    "</html>",
  ].join("\n");
}

function buildBrandedCodeEmailText(copy: BrandedCodeEmailCopy, code: string): string {
  return [
    "PrivateNote.ai",
    "",
    copy.title,
    "",
    copy.lead,
    "",
    `${copy.codeLabel}:`,
    code,
    "",
    copy.instructions,
    "",
    copy.codeExpiry,
    "",
    copy.ignore,
    "",
    "—",
    "PrivateNote.ai",
    copy.footer,
    "www.privatenote.ai",
    "LinkedIn: https://www.linkedin.com/company/privatenote",
  ].join("\n");
}

/** Recipient reveal gate: same brand chrome as the signup / magic-link code email. */
export function buildRecipientVerificationEmailContent(options: {
  verificationCode: string;
  webOrigin?: string;
}): { subject: string; preheader: string; text: string; html: string } {
  const copy = RECIPIENT_VERIFICATION_COPY;
  const webOrigin = (options.webOrigin || "https://privatenote.ai").replace(/\/$/, "");
  return {
    subject: copy.subject,
    preheader: copy.preheader,
    text: buildBrandedCodeEmailText(copy, options.verificationCode),
    html: buildBrandedCodeEmailHtml(copy, options.verificationCode, webOrigin),
  };
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
  const hostLabel = options.hostLabel?.trim() || magicLinkEmailDisplayHost(options.magicUrl);

  return {
    subject: copy.subject,
    preheader: copy.preheader,
    text: buildMagicLinkText(copy, options.magicUrl, options.signInCode, hostLabel),
    html: buildMagicLinkHtml(copy, options.magicUrl, options.signInCode, hostLabel),
  };
}
