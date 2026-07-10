import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import type { Translations } from "@/utils/translations/types";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { secretMessageWithoutAccountEs } from "@/components/blog/locale/secretMessageWithoutAccount.es";
import { secretMessageWithoutAccountFr } from "@/components/blog/locale/secretMessageWithoutAccount.fr";
import { secretMessageWithoutAccountHr } from "@/components/blog/locale/secretMessageWithoutAccount.hr";
import { secretMessageWithoutAccountNl } from "@/components/blog/locale/secretMessageWithoutAccount.nl";
import { secretMessageWithoutAccountPt } from "@/components/blog/locale/secretMessageWithoutAccount.pt";
import { secretMessageWithoutAccountSr } from "@/components/blog/locale/secretMessageWithoutAccount.sr";

const heroImagePath = "/images/blog-secret-message-no-account-hero.png";
const heroArtistUrl =
  "https://pixabay.com/users/alexas_fotos-686414/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3444212";
const heroPixabayUrl =
  "https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=3444212";

type FlowStep = {
  title: string;
  body: string;
};

type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  beforeFlowSteps?: string;
  flowSteps?: FlowStep[];
  afterFlowSteps?: string[];
};

type ArticleCopy = {
  intro: string[];
  sections: ArticleSection[];
  closingTitle: string;
  closingBody: string[];
  fileSharingNote: string;
  tagline: string;
  relatedReading: string;
  relatedPosts: { slug: string; blurb: string }[];
};

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function renderInlineContent(
  text: string,
  resolveLink: (href: string) => { to: string; external: boolean },
): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) {
      return <RichText key={index} text={part} />;
    }
    const [, label, href] = match;
    const { to, external } = resolveLink(href);
    if (external) {
      return (
        <a
          key={index}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {label}
        </a>
      );
    }
    return (
      <Link key={index} href={to} className="font-medium text-primary hover:underline">
        {label}
      </Link>
    );
  });
}

function ArticleParagraph({
  text,
  lead = false,
  resolveLink,
}: {
  text: string;
  lead?: boolean;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <p
      className={cn(
        "leading-[1.8] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      {renderInlineContent(text, resolveLink)}
    </p>
  );
}

function CalloutBox({
  text,
  resolveLink,
}: {
  text: string;
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <blockquote className="my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-violet-500/[0.05] px-6 py-5 dark:border-primary/25 dark:from-primary/10 dark:to-violet-500/10">
      <p className="text-[1.0625rem] leading-[1.75] text-gray-800 dark:text-gray-100">
        {renderInlineContent(text, resolveLink)}
      </p>
    </blockquote>
  );
}

function BulletList({
  items,
  resolveLink,
}: {
  items: string[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li className="flex gap-3.5" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-[1.0625rem] leading-[1.75] text-gray-700 dark:text-gray-300">
            {renderInlineContent(item, resolveLink)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FlowStepsList({
  steps,
  resolveLink,
}: {
  steps: FlowStep[];
  resolveLink: (href: string) => { to: string; external: boolean };
}) {
  return (
    <ol className="space-y-6">
      {steps.map((step, index) => (
        <li className="flex gap-4" key={step.title}>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200">
            {index + 1}
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">{step.title}</p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(step.body, resolveLink)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      "Sometimes you need to share something confidential—a [password](app:password-generator), a recovery code, a Wi-Fi password, a private note, or a personal message—but creating an account just to send one message feels unnecessary.",
      "The good news is that it isn't required.",
      "Modern [browser-based encryption](blog:encrypted-vs-secure-file-sharing) makes it possible to securely send a secret message **without signing up**, installing software, or trusting a service with your plaintext.",
    ],
    sections: [
      {
        title: "Why avoid creating an account?",
        paragraphs: [
          "Creating an account leaves behind more information than many people realize. A typical service may store your email address, a [username](https://passwords.lu/en/blog/username-privacy-identity), login history, device information, IP addresses, and metadata about your activity.",
          "For long-term collaboration, that may be perfectly reasonable. For sharing a single confidential message, it usually isn't.",
          'If your goal is simply, "I want this one person to read this message once," an account often adds complexity without improving security. For that pattern, [one-time secret links](blog:one-time-secret-links) are usually a better fit.',
        ],
      },
      {
        title: "Encrypt before you send",
        paragraphs: [
          "The important question is not whether a website uses HTTPS. Nearly every website today uses HTTPS (TLS), which protects data while it travels across the Internet. Our guide on [encrypted vs. secure file sharing](blog:encrypted-vs-secure-file-sharing) explains why transport encryption alone is not the same as end-to-end privacy.",
          "The more important question is: **who can read your message after it reaches the server?**",
        ],
      },
      {
        title: "Traditional web services",
        paragraphs: [
          "Many messaging platforms send your message over an encrypted connection (HTTPS/TLS). Once the message reaches their servers, they can technically access it before storing or processing it.",
          "Depending on the service, the message might be scanned for spam or abuse, indexed for search, processed by cloud systems, retained in backups, or accessible to administrators.",
          "TLS protects the connection between your browser and the service. It does **not** necessarily prevent the service itself from reading your message.",
        ],
      },
      {
        title: "Browser encryption",
        paragraphs: [
          "A more privacy-friendly approach is to encrypt the message inside your browser before it is uploaded.",
        ],
        beforeFlowSteps: "In this model:",
        flowSteps: [
          {
            title: "Write your message",
            body: "You compose the secret in your browser—nothing is sent yet. Or use Private AI and [Write with Private AI](app:home) to draft it on your device before encryption.",
          },
          {
            title: "Generate a unique key locally",
            body: "Your browser creates an encryption key on your device.",
          },
          {
            title: "Encrypt before upload",
            body: "The message is encrypted locally. Only ciphertext is uploaded to the server.",
          },
          {
            title: "Share the key in the link",
            body: "The decryption key stays with you and is shared as part of the secure link—typically in the [URL fragment](blog:one-time-secret-links), which browsers do not send to web servers.",
          },
        ],
        afterFlowSteps: [
          "The service stores only encrypted data and acts as a relay. Without the decryption key, the ciphertext is practically useless.",
          "The same principle applies to files. [Secure file transfer](app:secure-file-transfer) encrypts documents and archives in your browser before upload. Recipients can open the link without an account, but sending requires signing in to a free PrivateNote account.",
        ],
      },
      {
        title: "Why this means no account is needed",
        paragraphs: [
          "When a service never needs to read your message, it also has little reason to know who you are. That is why browser-encrypted note sharing services can often work without registration—see [how one-time secret links work](blog:one-time-secret-links) for the full flow.",
          "Instead of creating an account, you simply write your message, generate a secure link, and send the link to the recipient. No usernames. No passwords to remember. No inbox full of verification emails.",
        ],
      },
      {
        title: "Add another layer with a password",
        paragraphs: [
          "For highly sensitive information, you can protect the encrypted message with an additional password.",
          "A common approach is to send the encrypted link through one communication channel and the password through another—such as a phone call, SMS, or messaging app. An attacker would need both to decrypt the message.",
        ],
      },
      {
        title: "Messages that automatically disappear",
        paragraphs: [
          "Confidential information usually should not stay online forever. Many secure note services allow messages to [self-destruct after the first read](blog:one-time-secret-links), expire after a chosen time, or be deleted automatically.",
          "This reduces the amount of sensitive information that remains available online—similar to why [workplace texts and chat logs](blog:workplace-texts-private-note) are a poor place for one-time secrets. No technology can prevent a recipient from taking a screenshot or copying the contents after opening the message, but automatic expiration significantly reduces long-term exposure.",
        ],
      },
      {
        title: "When should you use anonymous secret messages?",
        paragraphs: ["Sending encrypted messages without creating an account is useful for sharing:"],
        bullets: [
          "[Passwords and recovery codes](blog:how-we-generate-passwords) — or use our [password generator](app:password-generator) before you share",
          "[API keys](blog:privatenote-for-developers) and software license keys",
          "Private links and confidential business notes",
          "Financial information and Wi-Fi passwords",
          "Temporary personal messages that should not live in email or chat history forever",
        ],
      },
      {
        title: "What to look for in a secure service",
        paragraphs: ['Not every "private messaging" or "secret note" service offers the same level of protection. Look for services that:'],
        bullets: [
          "Encrypt messages in your browser before upload",
          "Never receive your plaintext",
          "Do not require an account",
          "Support automatic expiration",
          "Optionally allow password protection",
          "Use modern authenticated encryption",
        ],
        callout:
          "These design choices reduce the amount of trust you must place in the service itself. For a broader security baseline—including passwords, authentication, and secure sharing—see [The Myth of \"Good Enough\" Security](blog:myth-good-enough-security).",
      },
      {
        title: "How PrivateNote fits these principles",
        paragraphs: [
          "PrivateNote was built around exactly these ideas. When you create a note, encryption happens entirely inside your browser before anything is uploaded. The server stores only encrypted ciphertext and acts solely as a relay between you and your recipient—it never receives the plaintext of your message.",
          "Because of this design, you do not need to create an account to send a private note. Simply write your message, generate a secure link, and share it using whatever communication channel you prefer.",
          "For additional protection, you can protect the note with a password, choose when it expires, make it self-destruct after the first read, attach encrypted files, and optionally receive delivery notifications that tell you when a note has been opened or expired—without revealing the contents of the message.",
          "The goal is simple: make sending confidential information as easy as sharing a link while minimizing how much trust you need to place in the service.",
        ],
      },
      {
        title: "Final thoughts",
        paragraphs: [
          "Sending a secret message should not require creating another account or giving away unnecessary personal information.",
          "Browser-based encryption makes it possible to encrypt your message before it ever leaves your device, allowing the service to store only encrypted ciphertext rather than your actual message. Combined with [expiring links](blog:one-time-secret-links) and optional password protection, this provides a simple and practical way to share confidential information.",
          "Whether you are sending a password, a recovery code, or a personal note, choosing a service that encrypts data in your browser and does not require an account gives you greater privacy with less friction.",
        ],
      },
    ],
    closingTitle: "Try it without signing up",
    closingBody: [
      "PrivateNote was designed around these principles—secure message sharing as simple as creating a link and sending it to the intended recipient.",
    ],
    fileSharingNote:
      "PrivateNote also offers [secure file transfer](app:secure-file-transfer) for sharing documents and folders with the same browser-side encryption model. Sending requires a free account; recipients can open the link without signing up.",
    tagline:
      "Less account overhead. Less metadata. More control over what exists online after the handoff.",
    relatedReading: "Related reading",
    relatedPosts: [
      {
        slug: "one-time-secret-links",
        blurb: "Deep dive on burn-after-reading links, the URL fragment, and why ephemerality beats email or Slack for one-time secrets.",
      },
      {
        slug: "encrypted-vs-secure-file-sharing",
        blurb: "TLS vs browser-side encryption—what each protects and why the server may still read your data.",
      },
      {
        slug: "how-we-generate-passwords",
        blurb: "How to create and share strong passwords without reusing patterns or leaving them in chat history.",
      },
      {
        slug: "workplace-texts-private-note",
        blurb: "Why written records in email and workplace chat create long-term risk—and when ephemeral notes fit better.",
      },
      {
        slug: "myth-good-enough-security",
        blurb: "A practical security baseline: passwords, authentication, messaging, and secure sharing patterns.",
      },
      {
        slug: "privatenote-for-developers",
        blurb: "Share API keys and credentials from your editor without pasting secrets into Slack or tickets.",
      },
    ],
  },
  de: {
    intro: [
      "Manchmal muessen Sie etwas Vertrauliches teilen: ein [Passwort](app:password-generator), einen Wiederherstellungscode, ein WLAN-Passwort, eine private Notiz oder eine persoenliche Nachricht. Nur dafuer ein Konto zu erstellen, fuehlt sich oft unnoetig an.",
      "Die gute Nachricht: Es ist nicht noetig.",
      "Moderne [browserbasierte Verschluesselung](blog:encrypted-vs-secure-file-sharing) macht es moeglich, eine geheime Nachricht sicher zu senden, **ohne Registrierung**, ohne Installation und ohne dem Dienst Klartext anzuvertrauen.",
    ],
    sections: [
      {
        title: "Warum auf ein Konto verzichten?",
        paragraphs: [
          "Ein Konto hinterlaesst mehr Spuren, als vielen bewusst ist. Ein typischer Dienst speichert moeglicherweise Ihre E-Mail-Adresse, einen [Benutzernamen](https://passwords.lu/en/blog/username-privacy-identity), Anmeldeverlaeufe, Geraeteinformationen, IP-Adressen und Metadaten zu Ihrer Aktivitaet.",
          "Fuer langfristige Zusammenarbeit kann das sinnvoll sein. Fuer eine einzelne vertrauliche Nachricht ist es meistens ueberdimensioniert.",
          "Wenn das Ziel schlicht lautet: \"Diese eine Person soll diese Nachricht genau einmal lesen\", erhoeht ein Konto oft nur die Komplexitaet, ohne die Sicherheit zu verbessern. Fuer dieses Muster passen [Einmal-Links fuer Geheimnisse](blog:one-time-secret-links) meist besser.",
        ],
      },
      {
        title: "Vor dem Senden verschluesseln",
        paragraphs: [
          "Die wichtige Frage ist nicht nur, ob eine Website HTTPS verwendet. Fast jede Website nutzt heute HTTPS (TLS), das Daten auf dem Weg durch das Internet schuetzt. Unser Leitfaden zu [verschluesselter vs. sicherer Dateiuebertragung](blog:encrypted-vs-secure-file-sharing) erklaert, warum Transportverschluesselung allein nicht dasselbe ist wie Ende-zu-Ende-Privatsphaere.",
          "Die wichtigere Frage lautet: **Wer kann Ihre Nachricht lesen, nachdem sie den Server erreicht hat?**",
        ],
      },
      {
        title: "Klassische Webdienste",
        paragraphs: [
          "Viele Messaging-Plattformen senden Ihre Nachricht ueber eine verschluesselte Verbindung (HTTPS/TLS). Sobald die Nachricht ihre Server erreicht, koennen sie technisch darauf zugreifen, bevor sie gespeichert oder verarbeitet wird.",
          "Je nach Dienst kann die Nachricht auf Spam oder Missbrauch geprueft, fuer die Suche indexiert, von Cloud-Systemen verarbeitet, in Backups aufbewahrt oder fuer Administratoren zugaenglich sein.",
          "TLS schuetzt die Verbindung zwischen Ihrem Browser und dem Dienst. Es verhindert **nicht** zwingend, dass der Dienst selbst Ihre Nachricht lesen kann.",
        ],
      },
      {
        title: "Verschluesselung im Browser",
        paragraphs: [
          "Ein datenschutzfreundlicherer Ansatz ist, die Nachricht bereits in Ihrem Browser zu verschluesseln, bevor sie hochgeladen wird.",
        ],
        beforeFlowSteps: "In diesem Modell:",
        flowSteps: [
          {
            title: "Nachricht schreiben",
            body: "Sie verfassen das Geheimnis im Browser; noch wird nichts gesendet. Oder Sie nutzen Private AI und [Write with Private AI](app:home), um den Text vor der Verschluesselung auf Ihrem Geraet zu entwerfen.",
          },
          {
            title: "Einmaligen Schluessel lokal erzeugen",
            body: "Ihr Browser erstellt den Verschluesselungsschluessel auf Ihrem Geraet.",
          },
          {
            title: "Vor dem Upload verschluesseln",
            body: "Die Nachricht wird lokal verschluesselt. Auf den Server wird nur Chiffretext hochgeladen.",
          },
          {
            title: "Schluessel im Link teilen",
            body: "Der Entschluesselungsschluessel bleibt bei Ihnen und wird als Teil des sicheren Links geteilt, typischerweise im [URL-Fragment](blog:one-time-secret-links), das Browser nicht an Webserver senden.",
          },
        ],
        afterFlowSteps: [
          "Der Dienst speichert nur verschluesselte Daten und dient als Relais. Ohne Entschluesselungsschluessel ist der Chiffretext praktisch nutzlos.",
          "Dasselbe Prinzip gilt fuer Dateien. [Sichere Dateiuebertragung](app:secure-file-transfer) verschluesselt Dokumente und Archive vor dem Upload in Ihrem Browser. Empfaenger koennen den Link ohne Konto oeffnen; fuer das Senden ist ein kostenloses PrivateNote-Konto erforderlich.",
        ],
      },
      {
        title: "Warum dadurch kein Konto noetig ist",
        paragraphs: [
          "Wenn ein Dienst Ihre Nachricht nie lesen muss, hat er auch wenig Grund zu wissen, wer Sie sind. Deshalb koennen Dienste mit browserseitiger Verschluesselung haeufig ohne Registrierung funktionieren. Den vollstaendigen Ablauf finden Sie unter [So funktionieren Einmal-Links fuer Geheimnisse](blog:one-time-secret-links).",
          "Statt ein Konto anzulegen, schreiben Sie einfach Ihre Nachricht, erzeugen einen sicheren Link und senden ihn an den Empfaenger. Keine Benutzernamen. Keine Passwoerter zum Merken. Keine Verifizierungs-E-Mails im Posteingang.",
        ],
      },
      {
        title: "Mit einem Passwort zusaetzlich absichern",
        paragraphs: [
          "Bei besonders sensiblen Informationen koennen Sie die verschluesselte Nachricht mit einem zusaetzlichen Passwort schuetzen.",
          "Ein gaengiger Ansatz ist, den verschluesselten Link ueber einen Kommunikationskanal zu senden und das Passwort ueber einen anderen, etwa per Telefon, SMS oder Messenger. Ein Angreifer braeuchte dann beides, um die Nachricht zu entschluesseln.",
        ],
      },
      {
        title: "Nachrichten, die automatisch verschwinden",
        paragraphs: [
          "Vertrauliche Informationen sollten normalerweise nicht dauerhaft online bleiben. Viele sichere Notizdienste koennen Nachrichten [nach dem ersten Lesen selbst loeschen](blog:one-time-secret-links), nach einer gewaehlten Zeit ablaufen lassen oder automatisch entfernen.",
          "Das reduziert die Menge sensibler Informationen, die online verfuegbar bleibt. Genau deshalb sind [Arbeitsplatz-Chats und Chatverlaeufe](blog:workplace-texts-private-note) ein schlechter Ort fuer einmalige Geheimnisse. Keine Technik kann verhindern, dass ein Empfaenger nach dem Oeffnen einen Screenshot macht oder Inhalte kopiert, aber automatischer Ablauf reduziert die langfristige Exposition deutlich.",
        ],
      },
      {
        title: "Wann sind anonyme geheime Nachrichten sinnvoll?",
        paragraphs: ["Verschluesselte Nachrichten ohne Konto eignen sich zum Teilen von:"],
        bullets: [
          "[Passwoertern und Wiederherstellungscodes](blog:how-we-generate-passwords), oder nutzen Sie vor dem Teilen unseren [Passwortgenerator](app:password-generator)",
          "[API-Schluesseln](blog:privatenote-for-developers) und Software-Lizenzschluesseln",
          "Privaten Links und vertraulichen Geschaeftsnotizen",
          "Finanzinformationen und WLAN-Passwoertern",
          "Temporaeren persoenlichen Nachrichten, die nicht dauerhaft in E-Mail- oder Chatverlaeufen liegen sollten",
        ],
      },
      {
        title: "Woran Sie einen sicheren Dienst erkennen",
        paragraphs: ["Nicht jeder Dienst fuer \"private Nachrichten\" oder \"geheime Notizen\" bietet denselben Schutz. Achten Sie auf Dienste, die:"],
        bullets: [
          "Nachrichten vor dem Upload im Browser verschluesseln",
          "Ihren Klartext nie erhalten",
          "Kein Konto verlangen",
          "Automatischen Ablauf unterstuetzen",
          "Optionalen Passwortschutz anbieten",
          "Moderne authentifizierte Verschluesselung verwenden",
        ],
        callout:
          "Diese Designentscheidungen reduzieren, wie viel Vertrauen Sie dem Dienst selbst entgegenbringen muessen. Eine breitere Sicherheitsgrundlage zu Passwoertern, Authentifizierung und sicherem Teilen finden Sie in [Der Mythos von \"gut genug\" bei Sicherheit](blog:myth-good-enough-security).",
      },
      {
        title: "Wie PrivateNote diese Prinzipien umsetzt",
        paragraphs: [
          "PrivateNote wurde genau um diese Ideen herum gebaut. Wenn Sie eine Notiz erstellen, findet die Verschluesselung vollstaendig in Ihrem Browser statt, bevor etwas hochgeladen wird. Der Server speichert nur verschluesselten Chiffretext und dient ausschliesslich als Relais zwischen Ihnen und dem Empfaenger; den Klartext Ihrer Nachricht erhaelt er nie.",
          "Durch dieses Design muessen Sie kein Konto erstellen, um eine private Notiz zu senden. Schreiben Sie einfach Ihre Nachricht, erzeugen Sie einen sicheren Link und teilen Sie ihn ueber den Kommunikationskanal Ihrer Wahl.",
          "Fuer zusaetzlichen Schutz koennen Sie die Notiz mit einem Passwort schuetzen, eine Ablaufzeit waehlen, sie nach dem ersten Lesen selbst loeschen lassen, verschluesselte Dateien anhaengen und optional Zustellbenachrichtigungen erhalten, die Ihnen mitteilen, wann eine Notiz geoeffnet oder abgelaufen ist, ohne den Inhalt der Nachricht preiszugeben.",
          "Das Ziel ist einfach: vertrauliche Informationen so leicht wie einen Link teilbar machen und gleichzeitig minimieren, wie viel Vertrauen Sie dem Dienst entgegenbringen muessen.",
        ],
      },
      {
        title: "Fazit",
        paragraphs: [
          "Eine geheime Nachricht zu senden, sollte nicht bedeuten, ein weiteres Konto zu erstellen oder unnoetige persoenliche Daten preiszugeben.",
          "Browserbasierte Verschluesselung macht es moeglich, Ihre Nachricht zu verschluesseln, bevor sie Ihr Geraet verlaesst. Der Dienst speichert dann nur Chiffretext statt Ihrer eigentlichen Nachricht. Zusammen mit [ablaufenden Links](blog:one-time-secret-links) und optionalem Passwortschutz entsteht eine einfache, praktische Moeglichkeit, vertrauliche Informationen zu teilen.",
          "Ob Passwort, Wiederherstellungscode oder persoenliche Notiz: Ein Dienst, der Daten im Browser verschluesselt und kein Konto verlangt, bietet mehr Privatsphaere mit weniger Reibung.",
        ],
      },
    ],
    closingTitle: "Ohne Registrierung ausprobieren",
    closingBody: [
      "PrivateNote wurde um diese Prinzipien herum entwickelt: sicheres Teilen von Nachrichten, so einfach wie einen Link zu erstellen und an den vorgesehenen Empfaenger zu senden.",
    ],
    fileSharingNote:
      "PrivateNote bietet auch [sichere Dateiuebertragung](app:secure-file-transfer) fuer Dokumente und Ordner mit demselben browserseitigen Verschluesselungsmodell. Fuer das Senden ist ein kostenloses Konto erforderlich; Empfaenger koennen den Link ohne Registrierung oeffnen.",
    tagline:
      "Weniger Kontoaufwand. Weniger Metadaten. Mehr Kontrolle darueber, was nach der Uebergabe online bleibt.",
    relatedReading: "Weiterlesen",
    relatedPosts: [
      {
        slug: "one-time-secret-links",
        blurb: "Ein tiefer Blick auf Einmal-Links, das URL-Fragment und warum Ablauf besser ist als E-Mail oder Slack fuer einmalige Geheimnisse.",
      },
      {
        slug: "encrypted-vs-secure-file-sharing",
        blurb: "TLS im Vergleich zu browserseitiger Verschluesselung: was jeweils geschuetzt wird und warum der Server Ihre Daten trotzdem lesen koennte.",
      },
      {
        slug: "how-we-generate-passwords",
        blurb: "Wie Sie starke Passwoerter erstellen und teilen, ohne Muster wiederzuverwenden oder sie in Chatverlaeufen liegen zu lassen.",
      },
      {
        slug: "workplace-texts-private-note",
        blurb: "Warum schriftliche Spuren in E-Mail und Arbeitsplatz-Chat langfristige Risiken schaffen und wann fluechtige Notizen besser passen.",
      },
      {
        slug: "myth-good-enough-security",
        blurb: "Eine praktische Sicherheitsgrundlage: Passwoerter, Authentifizierung, Messaging und sicheres Teilen.",
      },
      {
        slug: "privatenote-for-developers",
        blurb: "API-Schluessel und Zugangsdaten direkt aus dem Editor teilen, ohne Geheimnisse in Slack oder Tickets zu kopieren.",
      },
    ],
  },
  it: {
    intro: [
      "A volte devi condividere qualcosa di riservato: una [password](app:password-generator), un codice di recupero, una password Wi‑Fi, una nota privata o un messaggio personale, ma creare un account solo per inviare un messaggio sembra inutile.",
      "La buona notizia è che non è necessario.",
      "La moderna [cifratura basata sul browser](blog:encrypted-vs-secure-file-sharing) permette di inviare in modo sicuro un messaggio segreto **senza registrarsi**, senza installare software e senza affidare a un servizio il testo in chiaro.",
    ],
    sections: [
      {
        title: "Perché evitare di creare un account?",
        paragraphs: [
          "Creare un account lascia più informazioni di quanto molti immaginino. Un servizio tipico può conservare indirizzo e-mail, [nome utente](https://passwords.lu/en/blog/username-privacy-identity), cronologia di accesso, informazioni sul dispositivo, indirizzi IP e metadati sulla tua attività.",
          "Per una collaborazione di lungo periodo può essere ragionevole. Per condividere un singolo messaggio riservato, di solito no.",
          "Se l’obiettivo è semplicemente “voglio che questa persona legga questo messaggio una sola volta”, un account spesso aggiunge complessità senza migliorare la sicurezza. Per questo schema, i [link segreti monouso](blog:one-time-secret-links) sono di solito più adatti.",
        ],
      },
      {
        title: "Cifra prima di inviare",
        paragraphs: [
          "La domanda importante non è se un sito usa HTTPS. Quasi tutti i siti oggi usano HTTPS (TLS), che protegge i dati mentre viaggiano su Internet. La nostra guida su [condivisione file cifrata vs sicura](blog:encrypted-vs-secure-file-sharing) spiega perché la sola cifratura di trasporto non equivale a privacy end-to-end.",
          "La domanda più importante è: **chi può leggere il messaggio dopo che raggiunge il server?**",
        ],
      },
      {
        title: "Servizi web tradizionali",
        paragraphs: [
          "Molte piattaforme di messaggistica inviano il messaggio tramite una connessione cifrata (HTTPS/TLS). Quando il messaggio raggiunge i loro server, possono tecnicamente accedervi prima di conservarlo o elaborarlo.",
          "A seconda del servizio, il messaggio può essere analizzato per spam o abuso, indicizzato per la ricerca, elaborato da sistemi cloud, conservato nei backup o accessibile agli amministratori.",
          "TLS protegge la connessione tra il browser e il servizio. **Non** impedisce necessariamente al servizio stesso di leggere il messaggio.",
        ],
      },
      {
        title: "Cifratura nel browser",
        paragraphs: [
          "Un approccio più rispettoso della privacy consiste nel cifrare il messaggio dentro il browser prima dell’invio.",
        ],
        beforeFlowSteps: "In questo modello:",
        flowSteps: [
          {
            title: "Scrivi il messaggio",
            body: "Componi il segreto nel browser: nulla viene ancora inviato. Oppure usa Private AI e [Write with Private AI](app:home) per prepararlo sul dispositivo prima della cifratura.",
          },
          {
            title: "Genera localmente una chiave unica",
            body: "Il browser crea una chiave di cifratura sul tuo dispositivo.",
          },
          {
            title: "Cifra prima dell’upload",
            body: "Il messaggio viene cifrato localmente. Sul server viene caricato solo testo cifrato.",
          },
          {
            title: "Condividi la chiave nel link",
            body: "La chiave di decifratura resta con te ed è condivisa come parte del link sicuro, di solito nel [frammento URL](blog:one-time-secret-links), che i browser non inviano ai server web.",
          },
        ],
        afterFlowSteps: [
          "Il servizio conserva solo dati cifrati e agisce da relay. Senza la chiave di decifratura, il testo cifrato è praticamente inutile.",
          "Lo stesso principio vale per i file. Il [trasferimento sicuro di file](app:secure-file-transfer) cifra documenti e archivi nel browser prima dell’upload. I destinatari possono aprire il link senza account, ma l’invio richiede l’accesso a un account gratuito PrivateNote.",
        ],
      },
      {
        title: "Perché questo significa che non serve un account",
        paragraphs: [
          "Quando un servizio non ha bisogno di leggere il messaggio, ha anche pochi motivi per sapere chi sei. Per questo i servizi di note cifrate nel browser possono spesso funzionare senza registrazione: leggi [come funzionano i link segreti monouso](blog:one-time-secret-links) per il flusso completo.",
          "Invece di creare un account, scrivi il messaggio, generi un link sicuro e lo invii al destinatario. Nessun nome utente. Nessuna password da ricordare. Nessuna casella piena di e-mail di verifica.",
        ],
      },
      {
        title: "Aggiungi un livello con una password",
        paragraphs: [
          "Per informazioni molto sensibili, puoi proteggere il messaggio cifrato con una password aggiuntiva.",
          "Un approccio comune è inviare il link cifrato tramite un canale e la password tramite un altro, per esempio telefonata, SMS o app di messaggistica. Un attaccante avrebbe bisogno di entrambi per decifrare il messaggio.",
        ],
      },
      {
        title: "Messaggi che scompaiono automaticamente",
        paragraphs: [
          "Le informazioni riservate di solito non dovrebbero restare online per sempre. Molti servizi di note sicure permettono ai messaggi di [autodistruggersi dopo la prima lettura](blog:one-time-secret-links), scadere dopo un tempo scelto o essere eliminati automaticamente.",
          "Questo riduce la quantità di informazioni sensibili che resta disponibile online, per lo stesso motivo per cui [messaggi di lavoro e log chat](blog:workplace-texts-private-note) sono un pessimo posto per segreti monouso. Nessuna tecnologia può impedire a un destinatario di fare uno screenshot o copiare il contenuto dopo l’apertura, ma la scadenza automatica riduce molto l’esposizione a lungo termine.",
        ],
      },
      {
        title: "Quando usare messaggi segreti anonimi?",
        paragraphs: ["Inviare messaggi cifrati senza creare un account è utile per condividere:"],
        bullets: [
          "[Password e codici di recupero](blog:how-we-generate-passwords), oppure usa il nostro [generatore di password](app:password-generator) prima di condividere",
          "[Chiavi API](blog:privatenote-for-developers) e chiavi di licenza software",
          "Link privati e note aziendali riservate",
          "Informazioni finanziarie e password Wi‑Fi",
          "Messaggi personali temporanei che non dovrebbero vivere per sempre in e-mail o cronologia chat",
        ],
      },
      {
        title: "Cosa cercare in un servizio sicuro",
        paragraphs: ['Non ogni servizio di "messaggistica privata" o "nota segreta" offre lo stesso livello di protezione. Cerca servizi che:'],
        bullets: [
          "Cifrano i messaggi nel browser prima dell’upload",
          "Non ricevono mai il testo in chiaro",
          "Non richiedono un account",
          "Supportano la scadenza automatica",
          "Consentono opzionalmente la protezione con password",
          "Usano cifratura autenticata moderna",
        ],
        callout:
          "Queste scelte di design riducono la quantità di fiducia che devi riporre nel servizio stesso. Per una base di sicurezza più ampia, inclusi password, autenticazione e condivisione sicura, leggi [Il mito della sicurezza “abbastanza buona”](blog:myth-good-enough-security).",
      },
      {
        title: "Come PrivateNote applica questi principi",
        paragraphs: [
          "PrivateNote è stato costruito esattamente attorno a queste idee. Quando crei una nota, la cifratura avviene interamente nel browser prima di qualsiasi upload. Il server conserva solo testo cifrato e agisce solo da relay tra te e il destinatario: non riceve mai il testo in chiaro del messaggio.",
          "Grazie a questo design, non devi creare un account per inviare una nota privata. Scrivi semplicemente il messaggio, genera un link sicuro e condividilo usando il canale di comunicazione che preferisci.",
          "Per maggiore protezione puoi aggiungere una password, scegliere la scadenza, far autodistruggere la nota dopo la prima lettura, allegare file cifrati e ricevere opzionalmente notifiche di consegna che indicano quando una nota è stata aperta o è scaduta, senza rivelare il contenuto del messaggio.",
          "L’obiettivo è semplice: rendere l’invio di informazioni riservate facile quanto condividere un link, minimizzando quanta fiducia devi riporre nel servizio.",
        ],
      },
      {
        title: "Considerazioni finali",
        paragraphs: [
          "Inviare un messaggio segreto non dovrebbe richiedere la creazione di un altro account o la condivisione di informazioni personali non necessarie.",
          "La cifratura basata sul browser permette di cifrare il messaggio prima che lasci il dispositivo, consentendo al servizio di conservare solo testo cifrato invece del messaggio reale. Insieme a [link in scadenza](blog:one-time-secret-links) e protezione opzionale con password, offre un modo semplice e pratico per condividere informazioni riservate.",
          "Che tu stia inviando una password, un codice di recupero o una nota personale, scegliere un servizio che cifra i dati nel browser e non richiede un account offre più privacy con meno attrito.",
        ],
      },
    ],
    closingTitle: "Provalo senza registrarti",
    closingBody: [
      "PrivateNote è stato progettato attorno a questi principi: condivisione sicura dei messaggi semplice come creare un link e inviarlo al destinatario previsto.",
    ],
    fileSharingNote:
      "PrivateNote offre anche [trasferimento sicuro di file](app:secure-file-transfer) per condividere documenti e cartelle con lo stesso modello di cifratura nel browser. L’invio richiede un account gratuito; i destinatari possono aprire il link senza registrarsi.",
    tagline:
      "Meno account. Meno metadati. Più controllo su ciò che resta online dopo la consegna.",
    relatedReading: "Letture correlate",
    relatedPosts: [
      {
        slug: "one-time-secret-links",
        blurb: "Approfondimento sui link a lettura unica, sul frammento URL e sul perché l’effimerità batte e-mail o Slack per i segreti monouso.",
      },
      {
        slug: "encrypted-vs-secure-file-sharing",
        blurb: "TLS vs cifratura nel browser: cosa protegge ciascuna e perché il server potrebbe ancora leggere i dati.",
      },
      {
        slug: "how-we-generate-passwords",
        blurb: "Come creare e condividere password forti senza riutilizzare pattern o lasciarle nella cronologia chat.",
      },
      {
        slug: "workplace-texts-private-note",
        blurb: "Perché i record scritti in e-mail e chat di lavoro creano rischi di lungo periodo, e quando le note effimere sono più adatte.",
      },
      {
        slug: "myth-good-enough-security",
        blurb: "Una base pratica di sicurezza: password, autenticazione, messaggistica e condivisione sicura.",
      },
      {
        slug: "privatenote-for-developers",
        blurb: "Condividi chiavi API e credenziali dall’editor senza incollare segreti in Slack o nei ticket.",
      },
    ],
  },
  es: secretMessageWithoutAccountEs,
  fr: secretMessageWithoutAccountFr,
  hr: secretMessageWithoutAccountHr,
  nl: secretMessageWithoutAccountNl,
  pt: secretMessageWithoutAccountPt,
  sr: secretMessageWithoutAccountSr,
};

export const SecretMessageWithoutAccountPost: React.FC = () => {
  const { t, language } = useLanguage();
  const howItWorksPath = localizedPath("/how-it-works", language);
  const article = getBlogArticleCopy(copy, language);
  const blogHref = (slug: string) => blogPostPath(slug, language);
  const resolveLink = (href: string) => {
    if (href.startsWith("blog:")) {
      return { to: blogHref(href.slice(5)), external: false };
    }
    if (href.startsWith("app:")) {
      const path = href.slice(4).replace(/^\/+/, "");
      if (!path || path === "home") {
        return { to: localizedPath("/", language), external: false };
      }
      return { to: localizedPath(`/${path}`, language), external: false };
    }
    return { to: href, external: true };
  };

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="send-secret-message-without-account"
          title={t.blogSecretNoAccountTitle}
          excerpt={t.blogSecretNoAccountExcerpt}
          headerClassName="mb-12"
        >
          <figure className="mt-8 flex flex-col items-center">
            <img
              src={heroImagePath}
              alt="Three figures in hear no evil, see no evil, speak no evil poses"
              className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800"
              loading="lazy"
            />
            <figcaption className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
              Image by{" "}
              <a
                href={heroArtistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-90"
              >
                Alexa
              </a>{" "}
              from{" "}
              <a
                href={heroPixabayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-90"
              >
                Pixabay
              </a>
              .
            </figcaption>
          </figure>
        </BlogPostHeader>

        <div className="space-y-6 leading-relaxed">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} resolveLink={resolveLink} />
          ))}
        </div>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.bullets ? <BulletList items={section.bullets} resolveLink={resolveLink} /> : null}

              {section.beforeFlowSteps ? (
                <ArticleParagraph text={section.beforeFlowSteps} resolveLink={resolveLink} />
              ) : null}

              {section.flowSteps ? <FlowStepsList steps={section.flowSteps} resolveLink={resolveLink} /> : null}

              {section.afterFlowSteps?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} resolveLink={resolveLink} />
              ))}

              {section.callout ? <CalloutBox text={section.callout} resolveLink={resolveLink} /> : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-4 w-4 text-primary/70" />
            {article.closingTitle}
          </h2>
          {article.closingBody.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
              {renderInlineContent(paragraph, resolveLink)}
            </p>
          ))}
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderInlineContent(article.fileSharingNote, resolveLink)}
          </p>
          <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
            <RichText text={article.tagline} />
          </p>
          <Link
            href={howItWorksPath}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-primary/5 px-6 py-3.5 text-lg font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10 dark:border-primary/30 dark:bg-primary/10 dark:hover:bg-primary/15"
          >
            {t.howItWorks}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <BlogPostCrossLinks slug="send-secret-message-without-account" />
      </article>
    </div>
  );
};
