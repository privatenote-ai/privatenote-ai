import React from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostBackLink, BlogPostHeader, blogPostPageClass } from "@/components/blog/BlogPostChrome";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { oneTimeSecretLinksHr } from "@/components/blog/locale/oneTimeSecretLinks.hr";
import { oneTimeSecretLinksSr } from "@/components/blog/locale/oneTimeSecretLinks.sr";
import type { OneTimeSecretLinksArticleCopy } from "@/components/blog/locale/oneTimeSecretLinks.types";

const heroImagePath = "/images/dieandreart-footprint-2143685.jpg";
const heroArtistUrl =
  "https://pixabay.com/users/dieandreart-3765415/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2143685";
const heroPixabayUrl =
  "https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=2143685";

type ArticleCopy = OneTimeSecretLinksArticleCopy;
type ArticleSection = OneTimeSecretLinksArticleCopy["sections"][number];
type BulletItem = OneTimeSecretLinksArticleCopy["sections"][number]["bullets"] extends (infer B)[] | undefined ? B : never;
type FlowStep = NonNullable<OneTimeSecretLinksArticleCopy["sections"][number]["flowSteps"]>[number];
type TableRow = NonNullable<OneTimeSecretLinksArticleCopy["sections"][number]["table"]>[number];

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

function renderMarkdownLink(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a
          key={index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {match[1]}
        </a>
      );
    }
    return <RichText key={index} text={part} />;
  });
}

function ArticleParagraph({
  text,
  lead = false,
  withLinks = false,
}: {
  text: string;
  lead?: boolean;
  withLinks?: boolean;
}) {
  return (
    <p
      className={
        lead
          ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300"
      }
    >
      {withLinks ? renderMarkdownLink(text) : <RichText text={text} />}
    </p>
  );
}

function CalloutBox({ text }: { text: string }) {
  return (
    <blockquote className="border-l-2 border-gray-300 py-1 pl-5 dark:border-gray-600">
      <p className="text-[1.05rem] leading-relaxed text-gray-800 dark:text-gray-200">
        <RichText text={text} />
      </p>
    </blockquote>
  );
}

function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="flex gap-3" key={item.label}>
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          <span className="text-gray-700 dark:text-gray-300">
            {item.body ? (
              <>
                <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
                {" — "}
                {item.body}
              </>
            ) : (
              item.label
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FlowStepsList({ steps }: { steps: FlowStep[] }) {
  return (
    <ol className="space-y-6">
      {steps.map((step, index) => (
        <li className="flex gap-4" key={step.title}>
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 text-sm font-semibold text-gray-700 dark:border-gray-600 dark:text-gray-200">
            {index + 1}
          </span>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900 dark:text-white">{step.title}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{step.step}</p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const isGood = verdict.includes("✓");
  const isBad = verdict.includes("✗");

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        isGood && "whitespace-nowrap bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800",
        isBad && "whitespace-nowrap bg-red-50 text-red-800 ring-red-200 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-800",
        !isGood &&
          !isBad &&
          "max-w-[12rem] whitespace-normal text-left leading-snug bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-200 dark:ring-amber-800",
      )}
    >
      {verdict}
    </span>
  );
}

function ComparisonTable({
  headers,
  rows,
}: {
  headers: ArticleCopy["tableHeaders"];
  rows: TableRow[];
}) {
  const headCellClass =
    "h-11 border-r border-gray-200 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 last:border-r-0 dark:border-gray-700 dark:text-gray-400";
  const bodyCellClass =
    "border-r border-gray-100 px-4 py-3.5 align-top last:border-r-0 dark:border-gray-800";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
      <Table className="min-w-[640px]">
        <TableHeader>
          <TableRow className="border-b border-gray-200 bg-gray-50/90 hover:bg-gray-50/90 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:bg-gray-800/60">
            <TableHead className={headCellClass}>{headers.channel}</TableHead>
            <TableHead className={headCellClass}>{headers.encrypted}</TableHead>
            <TableHead className={headCellClass}>{headers.persistent}</TableHead>
            <TableHead className={cn(headCellClass, "text-right")}>{headers.verdict}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isRecommended = row.verdict.includes("✓");

            return (
              <TableRow
                key={row.channel}
                className={cn(
                  "border-b border-gray-100 last:border-0 dark:border-gray-800",
                  isRecommended
                    ? "bg-emerald-50/50 hover:bg-emerald-50/70 dark:bg-emerald-950/15 dark:hover:bg-emerald-950/25"
                    : "hover:bg-gray-50/80 dark:hover:bg-gray-800/30",
                )}
              >
                <TableCell className={cn(bodyCellClass, "font-medium text-gray-900 dark:text-white")}>
                  {row.channel}
                </TableCell>
                <TableCell className={cn(bodyCellClass, "text-gray-600 dark:text-gray-300")}>
                  {row.encrypted}
                </TableCell>
                <TableCell className={cn(bodyCellClass, "text-gray-600 dark:text-gray-300")}>
                  {row.persistent}
                </TableCell>
                <TableCell className={cn(bodyCellClass, isRecommended ? "text-right" : "text-left sm:text-right")}>
                  <VerdictBadge verdict={row.verdict} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function FitList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            <span className="text-gray-700 dark:text-gray-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      "Most people share sensitive information the same way they share everything else: paste it into an email, drop it in Slack, or send a text.",
      "That works until you realize what you've actually done. You didn't just deliver a password or API key—you created a **permanent record** in someone else's inbox, your company's chat archive, a cloud backup, a compliance export, or an AI-generated meeting summary you forgot existed.",
      "Some information has a short job to do. A staging password. A recovery code. A one-time access instruction. A contractor credential that expires Friday. These secrets don't need a searchable history. They need to arrive, get used, and disappear.",
      "That's what **one-time secret links** are for.",
    ],
    sections: [
      {
        title: 'The Problem with "Secure Enough" Channels',
        paragraphs: [
          "Email can be encrypted in transit. Slack can be locked down with single sign-on (SSO). Signal can offer disappearing messages. All of that helps—but it solves a completely different problem.",
          "The issue isn't always interception. It's **retention**.",
          "When you send a secret through a normal channel, you're betting on a massive chain of assumptions:",
        ],
        bullets: [
          { label: "The message will never be forwarded, screenshotted, or copied.", body: "" },
          { label: "Nobody will accidentally search the shared chat history six months later.", body: "" },
          {
            label:
              "Backups, server exports, and data discovery workflows won't turn a quick handoff into a long-term liability.",
            body: "",
          },
          {
            label:
              "Link preview bots in Slack, Teams, or iMessage won't fetch the URL automatically and burn it before your recipient opens it.",
            body: "",
          },
          {
            label:
              "The secret will be immediately rotated after use, even though the old value still sits in a server log somewhere.",
            body: "",
          },
        ],
        callout:
          "**The Separation of Powers:** Encryption protects content in motion. Ephemerality reduces what exists afterward. Both matter—but most mainstream communication tools optimize heavily for the first and entirely ignore the second.",
      },
      {
        title: "What a One-Time Secret Link Actually Is",
        paragraphs: [
          'A one-time secret link (sometimes called a "burn after reading" link or self-destructing note) is a URL meant to deliver sensitive text to one reader, once. After that read, the content should be gone—not archived, not searchable, not lingering in a mailbox or chat history.',
          "A **true one-time secret design** is stricter than an expiry timer. Critically, the **encryption key is generated in your browser**—never on the server—and the plaintext is encrypted there before anything is uploaded.",
        ],
        beforeFlowSteps: "**In practice, the full flow looks like this:**",
        flowSteps: [
          {
            title: "Browser-Generated Key & Encryption",
            step: "Step 1: Your Browser",
            body: "You write the secret in your web browser. The browser generates a fresh encryption key locally and uses it to encrypt the text—before any network request leaves your device.",
          },
          {
            title: "Ciphertext Upload",
            step: "Step 2: The Server",
            body: "Only the encrypted blob is uploaded. The server stores ciphertext it cannot read because it never received the key or the plaintext.",
          },
          {
            title: "Key Stays in the Link",
            step: "Step 3: The URL",
            body: "The browser-generated key is appended to the link in the URL fragment—the part after #—which is never sent to the server.",
          },
          {
            title: "One Read, Then Gone",
            step: "Step 4: The Recipient",
            body: "The recipient opens the full link. Their browser reads the key from the fragment, decrypts locally, and the server deletes the ciphertext after that first successful read.",
          },
        ],
        afterFlowSteps: [
          "Not every product sold as a one-time secret link follows this pattern. Some tools encrypt on the server after receiving your text—or generate the key there, meaning the service could read your secret. Others rely on a shared password the service can validate. Still others delete on a schedule but keep metadata, logs, or recoverable copies. When you evaluate a tool, ask whether it implements the full design—not only whether the link expires.",
        ],
      },
      {
        title: "Why the URL Fragment Matters",
        paragraphs: [
          "This architectural detail is incredibly easy to miss, yet it is the foundation of modern web cryptography.",
          "In a standard HTTPS request, everything before the # symbol is sent directly to the server. Everything after the # stays inside the browser sandbox. That means a well-designed one-time link system can store your encrypted content securely at /note/abc123 while keeping the decryption key at #xK9m2p... entirely invisible to the server logs, CDN access paths, or external database tables.",
        ],
      },
      {
        title: "When to Use a One-Time Link (And When Not To)",
        paragraphs: [
          "Not every channel is wrong for every kind of secret—but most everyday tools were built for persistence, not one-time delivery.",
        ],
        table: [
          {
            channel: "Email",
            encrypted: "Often in transit",
            persistent: "Yes—forever, in multiple boxes",
            verdict: "✗ Poor",
          },
          {
            channel: "Slack / Teams",
            encrypted: "Yes, on platform",
            persistent: "Yes—searchable, exportable",
            verdict: "✗ Poor",
          },
          {
            channel: "SMS / iMessage",
            encrypted: "Varies widely",
            persistent: "Often backed up, cloud-synced",
            verdict: "✗ Poor",
          },
          {
            channel: "Password Manager",
            encrypted: "Yes",
            persistent: "Designed specifically for retention",
            verdict: "Usually cumbersome—often paid, high-friction for quick handoffs",
          },
          {
            channel: "One-Time Link",
            encrypted: "Yes, client-side",
            persistent: "Deleted instantly after read",
            verdict: "✓ Built for this",
          },
        ],
        goodFits: [
          "Passwords, API keys, and temporary tokens being handed to one person once.",
          "System recovery codes and 2FA backup secrets.",
          'Temporary physical access instructions ("use this door code until 6 PM").',
          "Legal- or HR-sensitive drafts that aren't meant to become institutional memory.",
        ],
        poorFits: [
          "Long-term storage: Use a designated password manager vault.",
          "Ongoing conversations: Use an end-to-end encrypted messaging app like Signal.",
          "Auditable secrets: If compliance dictates an unchangeable trail, use your organization's approved vaulting system.",
        ],
      },
      {
        title: "The Link Preview Trap",
        paragraphs: [
          "Here's a failure mode most tech teams discover the hard way. Many enterprise chat apps automatically crawl incoming URLs to generate rich previews (titles, descriptions, thumbnails).",
          "That automatic crawl can consume a one-time link before your recipient even has a chance to click it. The automated preview bot becomes the first reader, the note burns, and your colleague opens a dead link.",
          "Serious ephemerality tools actively mitigate this by blocking known crawler user-agents, forcing explicit user click-throughs before local decryption happens, and keeping token expiries incredibly tight.",
        ],
      },
    ],
    tableHeaders: {
      channel: "Channel Type",
      encrypted: "Encrypted?",
      persistent: "Persistent?",
      verdict: "Good for One-Time Secrets?",
    },
    goodFitsLabel: "Good Fits",
    poorFitsLabel: "Poor Fits",
    closingTitle: "Where PrivateNote Fits",
    closingBody:
      "PrivateNote is engineered around this client-side encryption model. It isn't a long-term password vault, a team wiki, or a permanent compliance archive. It is a lean, lightning-fast utility designed for delivery.",
    encryptLu:
      "For larger files that need the same client-side encryption model, [Encrypt.lu](https://encrypt.lu) applies the same architectural approach at file scale.",
    tagline:
      "It ensures that the lifespan of your sensitive data matches the lifespan of the medium it is traveling through. Because sometimes, the most secure message is the one that completely stops existing.",
    relatedReading: "Related reading",
  },
  de: {
    intro: [
      "Die meisten Menschen teilen sensible Informationen so, wie sie alles andere teilen: per E-Mail, in Slack oder per SMS.",
      "Das funktioniert, bis man erkennt, was man wirklich getan hat. Man hat nicht nur ein Passwort oder einen API-Schlüssel übermittelt—man hat einen **dauerhaften Datensatz** im Postfach eines anderen, im Chat-Archiv des Unternehmens, in einem Cloud-Backup, in einem Compliance-Export oder in einer KI-generierten Meeting-Zusammenfassung hinterlassen, an die niemand mehr denkt.",
      "Manche Informationen haben nur eine kurze Aufgabe. Ein Staging-Passwort. Ein Wiederherstellungscode. Eine einmalige Zugriffsanweisung. Zugangsdaten für einen Auftragnehmer, die am Freitag ablaufen. Diese Geheimnisse brauchen keine durchsuchbare Historie. Sie müssen ankommen, genutzt werden und verschwinden.",
      "Genau dafür sind **One-Time-Secret-Links** da.",
    ],
    sections: [
      {
        title: 'Das Problem mit „sicher genug“-Kanälen',
        paragraphs: [
          "E-Mail kann während der Übertragung verschlüsselt sein. Slack kann mit Single Sign-On (SSO) abgesichert werden. Signal bietet verschwindende Nachrichten. All das hilft—löst aber ein völlig anderes Problem.",
          "Es geht nicht immer um Abfangen. Es geht um **Aufbewahrung**.",
          "Wenn Sie ein Geheimnis über einen normalen Kanal senden, setzen Sie auf eine lange Kette von Annahmen:",
        ],
        bullets: [
          { label: "Die Nachricht wird nie weitergeleitet, gescreenshottet oder kopiert.", body: "" },
          { label: "Niemand durchsucht sechs Monate später versehentlich den gemeinsamen Chatverlauf.", body: "" },
          {
            label:
              "Backups, Server-Exporte und eDiscovery-Workflows machen aus einer schnellen Übergabe keine langfristige Haftung.",
            body: "",
          },
          {
            label:
              "Link-Vorschau-Bots in Slack, Teams oder iMessage rufen die URL nicht automatisch ab und verbrennen sie, bevor der Empfänger sie öffnet.",
            body: "",
          },
          {
            label:
              "Das Geheimnis wird sofort nach der Nutzung rotiert, obwohl der alte Wert noch irgendwo in einem Server-Log liegt.",
            body: "",
          },
        ],
        callout:
          "**Trennung der Aufgaben:** Verschlüsselung schützt Inhalte in Bewegung. Ephemerität reduziert, was danach noch existiert. Beides zählt—doch die meisten Mainstream-Kommunikationstools optimieren stark für Ersteres und ignorieren Letzteres vollständig.",
      },
      {
        title: "Was ein One-Time-Secret-Link wirklich ist",
        paragraphs: [
          'Ein One-Time-Secret-Link (manchmal „Burn-after-Reading“-Link oder selbstzerstörende Notiz genannt) ist eine URL, die sensible Texte genau einmal an einen Leser liefern soll. Nach dem Lesen soll der Inhalt weg sein—nicht archiviert, nicht durchsuchbar, nicht in Postfach oder Chatverlauf hängen geblieben.',
          "Ein **wirklich One-Time-Secret-Design** ist strenger als ein Ablauf-Timer. Entscheidend: Der **Verschlüsselungsschlüssel wird in Ihrem Browser erzeugt**—niemals auf dem Server—und der Klartext wird dort verschlüsselt, bevor etwas hochgeladen wird.",
        ],
        beforeFlowSteps: "**In der Praxis sieht der Ablauf so aus:**",
        flowSteps: [
          {
            title: "Schlüsselerzeugung & Verschlüsselung im Browser",
            step: "Schritt 1: Ihr Browser",
            body: "Sie schreiben das Geheimnis im Browser. Der Browser erzeugt lokal einen neuen Verschlüsselungsschlüssel und verschlüsselt damit den Text—bevor eine Netzwerkanfrage Ihr Gerät verlässt.",
          },
          {
            title: "Upload des Chiffretexts",
            step: "Schritt 2: Der Server",
            body: "Nur der verschlüsselte Blob wird hochgeladen. Der Server speichert Chiffretext, den er nicht lesen kann, weil er weder Schlüssel noch Klartext erhalten hat.",
          },
          {
            title: "Schlüssel bleibt im Link",
            step: "Schritt 3: Die URL",
            body: "Der im Browser erzeugte Schlüssel wird an den Link im URL-Fragment angehängt—dem Teil nach #—der niemals an den Server gesendet wird.",
          },
          {
            title: "Einmal lesen, dann weg",
            step: "Schritt 4: Der Empfänger",
            body: "Der Empfänger öffnet den vollständigen Link. Der Browser liest den Schlüssel aus dem Fragment, entschlüsselt lokal, und der Server löscht den Chiffretext nach diesem ersten erfolgreichen Lesevorgang.",
          },
        ],
        afterFlowSteps: [
          "Nicht jedes Produkt, das als One-Time-Secret-Link verkauft wird, folgt diesem Muster. Manche Tools verschlüsseln erst auf dem Server, nachdem sie Ihren Text erhalten haben—oder erzeugen den Schlüssel dort, sodass der Dienst Ihr Geheimnis lesen könnte. Andere verlassen sich auf ein gemeinsames Passwort, das der Dienst prüfen kann. Wieder andere löschen nach Zeitplan, behalten aber Metadaten, Logs oder wiederherstellbare Kopien. Fragen Sie bei der Auswahl, ob das volle Design umgesetzt ist—nicht nur, ob der Link abläuft.",
        ],
      },
      {
        title: "Warum das URL-Fragment wichtig ist",
        paragraphs: [
          "Dieses architektonische Detail ist leicht zu übersehen—und doch die Grundlage moderner Web-Kryptografie.",
          "Bei einer Standard-HTTPS-Anfrage wird alles vor dem #-Symbol direkt an den Server gesendet. Alles danach bleibt in der Browser-Sandbox. Ein gut designtes One-Time-Link-System kann verschlüsselten Inhalt unter /note/abc123 speichern, während der Entschlüsselungsschlüssel unter #xK9m2p... für Server-Logs, CDN-Pfade und externe Datenbanktabellen unsichtbar bleibt.",
        ],
      },
      {
        title: "Wann ein One-Time-Link sinnvoll ist (und wann nicht)",
        paragraphs: [
          "Nicht jeder Kanal ist für jede Art von Geheimnis falsch—aber die meisten Alltags-Tools wurden für Persistenz gebaut, nicht für einmalige Übergabe.",
        ],
        table: [
          {
            channel: "E-Mail",
            encrypted: "Oft in Transit",
            persistent: "Ja—dauerhaft, in mehreren Postfächern",
            verdict: "✗ Schlecht",
          },
          {
            channel: "Slack / Teams",
            encrypted: "Ja, auf der Plattform",
            persistent: "Ja—durchsuchbar, exportierbar",
            verdict: "✗ Schlecht",
          },
          {
            channel: "SMS / iMessage",
            encrypted: "Sehr unterschiedlich",
            persistent: "Oft gesichert, cloud-synchronisiert",
            verdict: "✗ Schlecht",
          },
          {
            channel: "Passwortmanager",
            encrypted: "Ja",
            persistent: "Für dauerhafte Aufbewahrung konzipiert",
            verdict: "Meist umständlich—oft kostenpflichtig, aufwendig für schnelle Übergaben",
          },
          {
            channel: "One-Time-Link",
            encrypted: "Ja, clientseitig",
            persistent: "Sofort nach dem Lesen gelöscht",
            verdict: "✓ Dafür gebaut",
          },
        ],
        goodFits: [
          "Passwörter, API-Schlüssel und temporäre Tokens, die einmal an eine Person übergeben werden.",
          "System-Wiederherstellungscodes und 2FA-Backup-Geheimnisse.",
          'Temporäre Zugangsanweisungen („diesen Türcode bis 18 Uhr nutzen“).',
          "Rechtlich oder HR-sensible Entwürfe, die kein institutionelles Gedächtnis werden sollen.",
        ],
        poorFits: [
          "Langzeitspeicherung: Nutzen Sie einen dedizierten Passwortmanager-Tresor.",
          "Laufende Gespräche: Nutzen Sie eine Ende-zu-Ende-verschlüsselte Messenger-App wie Signal.",
          "Auditierbare Geheimnisse: Wenn Compliance eine unveränderliche Spur verlangt, nutzen Sie das genehmigte Vaulting-System Ihrer Organisation.",
        ],
      },
      {
        title: "Die Link-Vorschau-Falle",
        paragraphs: [
          "Hier ist ein Fehlermodus, den viele Tech-Teams auf die harte Tour entdecken. Viele Enterprise-Chat-Apps crawlen eingehende URLs automatisch, um Rich Previews (Titel, Beschreibungen, Vorschaubilder) zu erzeugen.",
          "Dieser automatische Crawl kann einen One-Time-Link verbrauchen, bevor der Empfänger überhaupt klicken kann. Der Vorschau-Bot wird zum ersten Leser, die Notiz verbrennt, und der Kollege öffnet einen toten Link.",
          "Seriöse Ephemeritäts-Tools mildern das aktiv: bekannte Crawler-User-Agents blockieren, explizite Klick-Bestätigung vor der lokalen Entschlüsselung erzwingen und Ablaufzeiten sehr kurz halten.",
        ],
      },
    ],
    tableHeaders: {
      channel: "Kanaltyp",
      encrypted: "Verschlüsselt?",
      persistent: "Persistent?",
      verdict: "Gut für One-Time-Geheimnisse?",
    },
    goodFitsLabel: "Gute Einsatzfälle",
    poorFitsLabel: "Schlechte Einsatzfälle",
    closingTitle: "Wo PrivateNote passt",
    closingBody:
      "PrivateNote ist genau um dieses clientseitige Verschlüsselungsmodell herum gebaut. Es ist kein Langzeit-Passworttresor, kein Team-Wiki und kein dauerhaftes Compliance-Archiv. Es ist ein schlankes, schnelles Werkzeug für die Übergabe.",
    encryptLu:
      "Für größere Dateien mit demselben clientseitigen Verschlüsselungsmodell wendet [Encrypt.lu](https://encrypt.lu) denselben architektonischen Ansatz in Dateigröße an.",
    tagline:
      "Es stellt sicher, dass die Lebensdauer sensibler Daten zur Lebensdauer des Mediums passt, durch das sie reisen. Denn manchmal ist die sicherste Nachricht die, die vollständig aufhört zu existieren.",
    relatedReading: "Weiterlesen",
  },
  fr: {
    intro: [
      "La plupart des gens partagent des informations sensibles comme tout le reste : par e-mail, dans Slack ou par SMS.",
      "Cela fonctionne jusqu'à ce que l'on comprenne ce qu'on a vraiment fait. Vous n'avez pas seulement transmis un mot de passe ou une clé API—vous avez créé un **enregistrement permanent** dans la boîte de quelqu'un d'autre, l'archive de chat de votre entreprise, une sauvegarde cloud, un export de conformité ou un résumé de réunion généré par l'IA que vous aviez oublié.",
      "Certaines informations n'ont qu'un court rôle à jouer. Un mot de passe de staging. Un code de récupération. Une consigne d'accès à usage unique. Des identifiants de prestataire qui expirent vendredi. Ces secrets n'ont pas besoin d'un historique consultable. Ils doivent arriver, être utilisés et disparaître.",
      "C'est précisément à cela que servent les **liens secrets à usage unique**.",
    ],
    sections: [
      {
        title: 'Le problème des canaux « assez sécurisés »',
        paragraphs: [
          "L'e-mail peut être chiffré en transit. Slack peut être verrouillé avec l'authentification unique (SSO). Signal peut proposer des messages éphémères. Tout cela aide—mais cela résout un problème complètement différent.",
          "Le problème n'est pas toujours l'interception. C'est la **rétention**.",
          "Quand vous envoyez un secret via un canal ordinaire, vous pariez sur une longue chaîne d'hypothèses :",
        ],
        bullets: [
          { label: "Le message ne sera jamais transféré, capturé ou copié.", body: "" },
          { label: "Personne ne fouillera par accident l'historique du chat six mois plus tard.", body: "" },
          {
            label:
              "Les sauvegardes, exports serveur et workflows de découverte ne transformeront pas une remise rapide en passif à long terme.",
            body: "",
          },
          {
            label:
              "Les bots d'aperçu de lien dans Slack, Teams ou iMessage ne récupéreront pas l'URL automatiquement et ne la brûleront pas avant l'ouverture par le destinataire.",
            body: "",
          },
          {
            label:
              "Le secret sera immédiatement remplacé après usage, alors que l'ancienne valeur reste dans un journal serveur.",
            body: "",
          },
        ],
        callout:
          "**Séparation des rôles :** le chiffrement protège le contenu en mouvement. L'éphémérité réduit ce qui existe ensuite. Les deux comptent—mais la plupart des outils grand public optimisent fortement le premier et ignorent entièrement le second.",
      },
      {
        title: "Ce qu'est réellement un lien secret à usage unique",
        paragraphs: [
          'Un lien secret à usage unique (parfois appelé lien « brûler après lecture » ou note autodestructible) est une URL destinée à livrer un texte sensible à un seul lecteur, une fois. Après cette lecture, le contenu doit disparaître—pas archivé, pas consultable, pas laissé dans une boîte mail ou un historique de chat.',
          "Un **vrai design de secret à usage unique** est plus strict qu'un simple délai d'expiration. Point crucial : **la clé de chiffrement est générée dans votre navigateur**—jamais sur le serveur—et le texte clair y est chiffré avant tout envoi.",
        ],
        beforeFlowSteps: "**En pratique, voici le déroulement complet :**",
        flowSteps: [
          {
            title: "Clé générée et chiffrement dans le navigateur",
            step: "Étape 1 : votre navigateur",
            body: "Vous rédigez le secret dans le navigateur. Il génère localement une nouvelle clé de chiffrement et l'utilise pour chiffrer le texte—avant que toute requête réseau ne quitte votre appareil.",
          },
          {
            title: "Envoi du chiffré uniquement",
            step: "Étape 2 : le serveur",
            body: "Seul le blob chiffré est téléversé. Le serveur stocke du chiffré qu'il ne peut pas lire, car il n'a jamais reçu la clé ni le texte clair.",
          },
          {
            title: "La clé reste dans le lien",
            step: "Étape 3 : l'URL",
            body: "La clé générée dans le navigateur est ajoutée au lien dans le fragment d'URL—la partie après #—qui n'est jamais envoyée au serveur.",
          },
          {
            title: "Une lecture, puis disparition",
            step: "Étape 4 : le destinataire",
            body: "Le destinataire ouvre le lien complet. Son navigateur lit la clé dans le fragment, déchiffre localement, et le serveur supprime le chiffré après cette première lecture réussie.",
          },
        ],
        afterFlowSteps: [
          "Tous les produits vendus comme liens secrets à usage unique ne suivent pas ce modèle. Certains outils chiffrent côté serveur après réception de votre texte—ou y génèrent la clé, ce qui permettrait au service de lire votre secret. D'autres s'appuient sur un mot de passe partagé que le service peut valider. D'autres encore suppriment selon un calendrier mais conservent métadonnées, journaux ou copies récupérables. Lors du choix d'un outil, demandez s'il implémente le design complet—pas seulement si le lien expire.",
        ],
      },
      {
        title: "Pourquoi le fragment d'URL compte",
        paragraphs: [
          "Ce détail architectural est incroyablement facile à manquer, pourtant il est le fondement de la cryptographie web moderne.",
          "Dans une requête HTTPS standard, tout ce qui précède le # est envoyé au serveur. Tout ce qui suit reste dans le bac à sable du navigateur. Un système de lien à usage unique bien conçu peut stocker le contenu chiffré sous /note/abc123 tout en gardant la clé sous #xK9m2p... invisible aux journaux serveur, aux chemins CDN ou aux tables de base de données.",
        ],
      },
      {
        title: "Quand utiliser un lien à usage unique (et quand ne pas le faire)",
        paragraphs: [
          "Tous les canaux ne conviennent pas à tous les secrets—mais la plupart des outils du quotidien ont été conçus pour la persistance, pas pour la remise unique.",
        ],
        table: [
          {
            channel: "E-mail",
            encrypted: "Souvent en transit",
            persistent: "Oui—pour toujours, dans plusieurs boîtes",
            verdict: "✗ Mauvais",
          },
          {
            channel: "Slack / Teams",
            encrypted: "Oui, sur la plateforme",
            persistent: "Oui—consultable, exportable",
            verdict: "✗ Mauvais",
          },
          {
            channel: "SMS / iMessage",
            encrypted: "Variable",
            persistent: "Souvent sauvegardé, synchronisé cloud",
            verdict: "✗ Mauvais",
          },
          {
            channel: "Gestionnaire de mots de passe",
            encrypted: "Oui",
            persistent: "Conçu pour la rétention",
            verdict: "Souvent lourd—souvent payant, peu pratique pour une remise rapide",
          },
          {
            channel: "Lien à usage unique",
            encrypted: "Oui, côté client",
            persistent: "Supprimé instantanément après lecture",
            verdict: "✓ Conçu pour cela",
          },
        ],
        goodFits: [
          "Mots de passe, clés API et jetons temporaires remis une seule fois à une personne.",
          "Codes de récupération système et secrets de secours 2FA.",
          'Consignes d\'accès physiques temporaires (« utilisez ce code de porte jusqu\'à 18 h »).',
          "Brouillons sensibles juridiques ou RH qui ne doivent pas devenir une mémoire institutionnelle.",
        ],
        poorFits: [
          "Stockage long terme : utilisez un coffre de gestionnaire de mots de passe dédié.",
          "Conversations continues : utilisez une messagerie chiffrée de bout en bout comme Signal.",
          "Secrets auditables : si la conformité exige une trace immuable, utilisez le système de coffre approuvé par votre organisation.",
        ],
      },
      {
        title: "Le piège de l'aperçu de lien",
        paragraphs: [
          "Voici un mode d'échec que beaucoup d'équipes tech découvrent à leurs dépens. De nombreuses apps de chat d'entreprise explorent automatiquement les URL entrantes pour générer des aperçus enrichis (titres, descriptions, vignettes).",
          "Ce crawl automatique peut consommer un lien à usage unique avant que le destinataire ait la chance de cliquer. Le bot d'aperçu devient le premier lecteur, la note brûle, et votre collègue ouvre un lien mort.",
          "Les outils d'éphémérité sérieux atténuent cela en bloquant les user-agents de crawlers connus, en exigeant un clic explicite avant le déchiffrement local, et en gardant des expirations très courtes.",
        ],
      },
    ],
    tableHeaders: {
      channel: "Type de canal",
      encrypted: "Chiffré ?",
      persistent: "Persistant ?",
      verdict: "Bon pour secrets à usage unique ?",
    },
    goodFitsLabel: "Bons cas d'usage",
    poorFitsLabel: "Mauvais cas d'usage",
    closingTitle: "Où PrivateNote s'inscrit",
    closingBody:
      "PrivateNote est conçu autour de ce modèle de chiffrement côté client. Ce n'est ni un coffre de mots de passe long terme, ni un wiki d'équipe, ni une archive de conformité permanente. C'est un utilitaire léger et rapide, pensé pour la remise.",
    encryptLu:
      "Pour des fichiers plus volumineux avec le même modèle de chiffrement côté client, [Encrypt.lu](https://encrypt.lu) applique la même approche architecturale à l'échelle des fichiers.",
    tagline:
      "Il garantit que la durée de vie de vos données sensibles correspond à celle du médium par lequel elles transitent. Car parfois, le message le plus sûr est celui qui cesse complètement d'exister.",
    relatedReading: "À lire aussi",
  },
  es: {
    intro: [
      "La mayoría de la gente comparte información sensible igual que todo lo demás: la pega en un correo, la deja en Slack o la envía por SMS.",
      "Eso funciona hasta que te das cuenta de lo que has hecho de verdad. No solo entregaste una contraseña o una clave API—creaste un **registro permanente** en la bandeja de otra persona, el archivo de chat de tu empresa, una copia de seguridad en la nube, una exportación de cumplimiento o un resumen de reunión generado por IA que habías olvidado.",
      "Alguna información tiene un trabajo breve. Una contraseña de staging. Un código de recuperación. Una instrucción de acceso de un solo uso. Credenciales de un contratista que caducan el viernes. Estos secretos no necesitan un historial buscable. Necesitan llegar, usarse y desaparecer.",
      "Para eso existen los **enlaces secretos de un solo uso**.",
    ],
    sections: [
      {
        title: 'El problema de los canales "suficientemente seguros"',
        paragraphs: [
          "El correo puede cifrarse en tránsito. Slack puede protegerse con inicio de sesión único (SSO). Signal puede ofrecer mensajes que desaparecen. Todo eso ayuda—pero resuelve un problema completamente distinto.",
          "El problema no siempre es la interceptación. Es la **retención**.",
          "Cuando envías un secreto por un canal normal, apuestas a una larga cadena de suposiciones:",
        ],
        bullets: [
          { label: "El mensaje nunca se reenviará, capturará en pantalla ni copiará.", body: "" },
          { label: "Nadie buscará por accidente el historial del chat seis meses después.", body: "" },
          {
            label:
              "Las copias de seguridad, exportaciones del servidor y flujos de eDiscovery no convertirán una entrega rápida en un pasivo a largo plazo.",
            body: "",
          },
          {
            label:
              "Los bots de vista previa de enlace en Slack, Teams o iMessage no obtendrán la URL automáticamente ni la quemarán antes de que la abra el destinatario.",
            body: "",
          },
          {
            label:
              "El secreto se rotará inmediatamente tras el uso, aunque el valor antiguo siga en algún registro del servidor.",
            body: "",
          },
        ],
        callout:
          "**Separación de funciones:** el cifrado protege el contenido en movimiento. La efimeridad reduce lo que existe después. Ambos importan—pero la mayoría de herramientas de comunicación optimizan mucho la primera y ignoran por completo la segunda.",
      },
      {
        title: "Qué es realmente un enlace secreto de un solo uso",
        paragraphs: [
          'Un enlace secreto de un solo uso (a veces llamado enlace "quemar tras leer" o nota autodestructiva) es una URL pensada para entregar texto sensible a un solo lector, una vez. Tras esa lectura, el contenido debe desaparecer—sin archivar, sin buscar, sin quedar en un buzón o historial de chat.',
          "Un **diseño verdaderamente de un solo uso** es más estricto que un temporizador de caducidad. Punto clave: **la clave de cifrado se genera en tu navegador**—nunca en el servidor—y el texto en claro se cifra allí antes de subir nada.",
        ],
        beforeFlowSteps: "**En la práctica, el flujo completo es este:**",
        flowSteps: [
          {
            title: "Clave generada y cifrado en el navegador",
            step: "Paso 1: tu navegador",
            body: "Escribes el secreto en el navegador. Este genera localmente una clave de cifrado nueva y la usa para cifrar el texto—antes de que salga cualquier petición de red de tu dispositivo.",
          },
          {
            title: "Subida solo del texto cifrado",
            step: "Paso 2: el servidor",
            body: "Solo se sube el blob cifrado. El servidor almacena texto cifrado que no puede leer porque nunca recibió la clave ni el texto en claro.",
          },
          {
            title: "La clave permanece en el enlace",
            step: "Paso 3: la URL",
            body: "La clave generada en el navegador se añade al enlace en el fragmento de la URL—la parte tras #—que nunca se envía al servidor.",
          },
          {
            title: "Una lectura y desaparece",
            step: "Paso 4: el destinatario",
            body: "El destinatario abre el enlace completo. Su navegador lee la clave del fragmento, descifra localmente y el servidor elimina el texto cifrado tras esa primera lectura exitosa.",
          },
        ],
        afterFlowSteps: [
          "No todos los productos vendidos como enlaces secretos de un solo uso siguen este patrón. Algunas herramientas cifran en el servidor tras recibir tu texto—o generan la clave allí, lo que permitiría al servicio leer tu secreto. Otras dependen de una contraseña compartida que el servicio puede validar. Otras eliminan según un calendario pero conservan metadatos, registros o copias recuperables. Al evaluar una herramienta, pregunte si implementa el diseño completo—no solo si el enlace caduca.",
        ],
      },
      {
        title: "Por qué importa el fragmento de la URL",
        paragraphs: [
          "Este detalle arquitectónico es increíblemente fácil de pasar por alto, pero es la base de la criptografía web moderna.",
          "En una petición HTTPS estándar, todo lo anterior al # se envía al servidor. Todo lo posterior permanece en el sandbox del navegador. Un sistema de enlace de un solo uso bien diseñado puede almacenar contenido cifrado en /note/abc123 mientras mantiene la clave en #xK9m2p... invisible para registros del servidor, rutas CDN o tablas de base de datos.",
        ],
      },
      {
        title: "Cuándo usar un enlace de un solo uso (y cuándo no)",
        paragraphs: [
          "No todo canal es incorrecto para todo tipo de secreto—pero la mayoría de herramientas cotidianas se construyeron para persistencia, no para entrega única.",
        ],
        table: [
          {
            channel: "Correo",
            encrypted: "A menudo en tránsito",
            persistent: "Sí—para siempre, en varias bandejas",
            verdict: "✗ Malo",
          },
          {
            channel: "Slack / Teams",
            encrypted: "Sí, en la plataforma",
            persistent: "Sí—buscable, exportable",
            verdict: "✗ Malo",
          },
          {
            channel: "SMS / iMessage",
            encrypted: "Muy variable",
            persistent: "A menudo respaldado, sincronizado en la nube",
            verdict: "✗ Malo",
          },
          {
            channel: "Gestor de contraseñas",
            encrypted: "Sí",
            persistent: "Diseñado para retención",
            verdict: "A menudo pesado—a menudo de pago, mucha fricción para entregas rápidas",
          },
          {
            channel: "Enlace de un solo uso",
            encrypted: "Sí, en el cliente",
            persistent: "Eliminado al instante tras la lectura",
            verdict: "✓ Hecho para esto",
          },
        ],
        goodFits: [
          "Contraseñas, claves API y tokens temporales entregados una sola vez a una persona.",
          "Códigos de recuperación del sistema y secretos de respaldo 2FA.",
          'Instrucciones temporales de acceso físico ("usa este código de puerta hasta las 18:00").',
          "Borradores sensibles legales o de RR. HH. que no deben convertirse en memoria institucional.",
        ],
        poorFits: [
          "Almacenamiento a largo plazo: usa un gestor de contraseñas dedicado.",
          "Conversaciones continuas: usa una app de mensajería cifrada de extremo a extremo como Signal.",
          "Secretos auditables: si el cumplimiento exige una pista inmutable, usa el sistema de bóveda aprobado por tu organización.",
        ],
      },
      {
        title: "La trampa de la vista previa del enlace",
        paragraphs: [
          "Este es un modo de fallo que muchos equipos técnicos descubren por las malas. Muchas apps de chat empresarial rastrean automáticamente las URL entrantes para generar vistas previas enriquecidas (títulos, descripciones, miniaturas).",
          "Ese rastreo automático puede consumir un enlace de un solo uso antes de que el destinatario tenga oportunidad de hacer clic. El bot de vista previa se convierte en el primer lector, la nota se quema y tu colega abre un enlace muerto.",
          "Las herramientas de efimeridad serias mitigan esto bloqueando user-agents de rastreadores conocidos, exigiendo un clic explícito antes del descifrado local y manteniendo expiraciones muy ajustadas.",
        ],
      },
    ],
    tableHeaders: {
      channel: "Tipo de canal",
      encrypted: "¿Cifrado?",
      persistent: "¿Persistente?",
      verdict: "¿Bueno para secretos de un solo uso?",
    },
    goodFitsLabel: "Buenos casos de uso",
    poorFitsLabel: "Malos casos de uso",
    closingTitle: "Dónde encaja PrivateNote",
    closingBody:
      "PrivateNote está diseñado en torno a este modelo de cifrado en el cliente. No es una bóveda de contraseñas a largo plazo, ni un wiki de equipo, ni un archivo de cumplimiento permanente. Es una utilidad ligera y rápida pensada para la entrega.",
    encryptLu:
      "Para archivos más grandes que necesitan el mismo modelo de cifrado en el cliente, [Encrypt.lu](https://encrypt.lu) aplica el mismo enfoque arquitectónico a escala de archivos.",
    tagline:
      "Garantiza que la vida útil de tus datos sensibles coincida con la del medio por el que viajan. Porque a veces, el mensaje más seguro es el que deja por completo de existir.",
    relatedReading: "Lecturas relacionadas",
  },
  hr: oneTimeSecretLinksHr,
  sr: oneTimeSecretLinksSr,
};

export const OneTimeSecretLinksPost: React.FC = () => {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);
  const howItWorksPath = localizedPath("/how-it-works", language);
  const article = getBlogArticleCopy(copy, language);

  return (
    <div className={blogPostPageClass}>
      <BlogPostBackLink />

      <article>
        <BlogPostHeader
          slug="one-time-secret-links"
          title={t.blogOneTimeLinksTitle}
          excerpt={t.blogOneTimeLinksExcerpt}
          headerClassName="mb-12"
        >
          <figure className="mt-6">
            <img
              src={heroImagePath}
              alt="Footprints in sand fading away, symbolizing ephemeral one-time secret links"
              className="mx-auto w-full max-w-2xl max-h-[340px] rounded-2xl border border-gray-200 object-cover dark:border-gray-800"
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
                DieAndreArt
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
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} />
          ))}
        </div>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} />
              ))}

              {section.bullets ? <BulletList items={section.bullets} /> : null}

              {section.beforeFlowSteps ? <ArticleParagraph text={section.beforeFlowSteps} /> : null}

              {section.callout ? <CalloutBox text={section.callout} /> : null}

              {section.flowSteps ? <FlowStepsList steps={section.flowSteps} /> : null}

              {section.afterFlowSteps?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} />
              ))}

              {section.table ? (
                <ComparisonTable headers={article.tableHeaders} rows={section.table} />
              ) : null}

              {section.goodFits ? (
                <FitList label={article.goodFitsLabel} items={section.goodFits} />
              ) : null}

              {section.poorFits ? (
                <FitList label={article.poorFitsLabel} items={section.poorFits} />
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Shield className="h-4 w-4 text-primary/70" />
            {article.closingTitle}
          </h2>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            <RichText text={article.closingBody} />
          </p>
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
            {renderMarkdownLink(article.encryptLu)}
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

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">{article.relatedReading}</p>
          <ul className="space-y-2">
            <li>
              <Link
                href={blogPostPath("privatenote-for-developers", language)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t.blogDevelopersTitle}
              </Link>
            </li>
            <li>
              <Link
                href={blogPostPath("workplace-texts-private-note", language)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t.blogWorkplaceTextsTitle}
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
};
