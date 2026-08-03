import React from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Cloud,
  Laptop,
  Lock,
  Server,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { blogPostPath, localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { encryptedVsSecureFileSharingDe } from "@/components/blog/locale/encryptedVsSecureFileSharing.de";
import { encryptedVsSecureFileSharingEs } from "@/components/blog/locale/encryptedVsSecureFileSharing.es";
import { encryptedVsSecureFileSharingFr } from "@/components/blog/locale/encryptedVsSecureFileSharing.fr";
import { encryptedVsSecureFileSharingHr } from "@/components/blog/locale/encryptedVsSecureFileSharing.hr";
import { encryptedVsSecureFileSharingNl } from "@/components/blog/locale/encryptedVsSecureFileSharing.nl";
import { encryptedVsSecureFileSharingPt } from "@/components/blog/locale/encryptedVsSecureFileSharing.pt";
import { encryptedVsSecureFileSharingSr } from "@/components/blog/locale/encryptedVsSecureFileSharing.sr";

type FlowKind = "tls" | "browser";

type ArticleSection = {
  title: string;
  level?: "primary" | "secondary";
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
  flow?: FlowKind;
};

type ArticleCopy = {
  intro: string[];
  sections: ArticleSection[];
  closingTitle: string;
  closingBody: string;
  ctaLabel: string;
  relatedReading: string;
};

const heroImagePath = "/images/blog-encrypted-file-sharing-hero.jpg";

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

function ArticleParagraph({
  text,
  lead = false,
}: {
  text: string;
  lead?: boolean;
}) {
  return (
    <p
      className={cn(
        "leading-[1.8] text-gray-700 dark:text-gray-300",
        lead ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100" : "text-[1.0625rem]",
      )}
    >
      <RichText text={text} />
    </p>
  );
}

function CalloutBox({ text }: { text: string }) {
  return (
    <blockquote className="my-2 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-violet-500/[0.05] px-6 py-5 dark:border-primary/25 dark:from-primary/10 dark:to-violet-500/10">
      <p className="text-[1.0625rem] leading-[1.75] text-gray-800 dark:text-gray-100">
        <RichText text={text} />
      </p>
    </blockquote>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li className="flex gap-3.5" key={item}>
          <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="text-[1.0625rem] leading-[1.75] text-gray-700 dark:text-gray-300">
            <RichText text={item} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function FlowNode({
  icon: Icon,
  label,
  detail,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  detail: string;
  tone?: "neutral" | "warn" | "safe";
}) {
  const toneClass =
    tone === "warn"
      ? "border-amber-200/80 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30"
      : tone === "safe"
        ? "border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-950/30"
        : "border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/50";

  return (
    <div className={cn("flex min-w-[9.5rem] flex-1 flex-col items-center rounded-2xl border px-4 py-4 text-center shadow-sm", toneClass)}>
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 dark:bg-gray-950/60">
        <Icon className="h-5 w-5 text-primary" aria-hidden />
      </div>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{detail}</p>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-shrink-0 flex-col items-center justify-center gap-1 px-1 sm:px-2">
      <ArrowRight className="hidden h-5 w-5 text-gray-400 sm:block" aria-hidden />
      <span className="text-center text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-[11px]">
        {label}
      </span>
      <ArrowRight className="h-5 w-5 rotate-90 text-gray-400 sm:hidden" aria-hidden />
    </div>
  );
}

function EncryptionFlowDiagram({ kind }: { kind: FlowKind }) {
  if (kind === "tls") {
    return (
      <figure className="my-2 overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 dark:border-gray-700 dark:bg-gray-900/40 sm:p-6">
        <figcaption className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Transport encryption (TLS only)
        </figcaption>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <FlowNode icon={Laptop} label="Your device" detail="Original file (plaintext)" tone="warn" />
          <FlowArrow label="TLS tunnel" />
          <FlowNode icon={Server} label="Host server" detail="Receives readable file" tone="warn" />
        </div>
      </figure>
    );
  }

  return (
    <figure className="my-2 overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 dark:border-primary/25 dark:bg-primary/[0.07] sm:p-6">
      <figcaption className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary/80 dark:text-primary/70">
        Browser-side encryption + TLS
      </figcaption>
      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-center">
        <FlowNode icon={Laptop} label="Your browser" detail="Encrypts locally first" tone="safe" />
        <FlowArrow label="Ciphertext" />
        <FlowNode icon={Lock} label="Encrypted payload" detail="Unreadable without key" tone="safe" />
        <FlowArrow label="TLS tunnel" />
        <FlowNode icon={Cloud} label="Host server" detail="Stores ciphertext only" tone="safe" />
      </div>
    </figure>
  );
}

function InlineCodeBlock({ code }: { code: string }) {
  return (
    <div className="my-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-950 px-4 py-3.5 dark:border-gray-700">
      <code className="font-mono text-sm text-emerald-300">{code}</code>
    </div>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      'When people search for "secure file sharing," they often assume that every service offering HTTPS or TLS encryption protects their files in the same way. Unfortunately, that is not true.',
      'Two services can both advertise "encrypted file transfer" while offering vastly different privacy guarantees. The difference lies entirely in **where the encryption happens**. Understanding this distinction explains why some services can inspect, index, and process your files, while others simply cannot.',
    ],
    sections: [
      {
        title: "The two types of encryption",
        level: "primary",
        paragraphs: ["There are two primary ways modern file-sharing services protect your data."],
      },
      {
        title: "1. Transport encryption (TLS)",
        level: "secondary",
        paragraphs: [
          "This is the standard encryption used by almost every website on the Internet today. When you upload a file, your browser establishes a secure Transport Layer Security (TLS) connection with the host server. The connection is encrypted while your file travels across the network, protecting you against attackers on public Wi-Fi, compromised routers, or anyone sniffing network traffic.",
        ],
        flow: "tls",
        bullets: [
          "TLS is essential, and every reputable service must use it.",
          "Once the upload reaches the server, the provider receives the original plaintext file.",
          "From that point onward, depending on its policies, the service may store the file, generate previews, index contents, scan for malware, or use metadata for analytics.",
          'Many providers also encrypt files "at rest." That protects against physical theft of disks—but the service still holds the keys and can read your files.',
        ],
        callout:
          "**The core vulnerability of traditional cloud storage:** the server can only encrypt what it has already been able to read.",
      },
      {
        title: "2. Browser-side encryption",
        level: "secondary",
        paragraphs: [
          "A fundamentally different approach is to encrypt the file **before** it ever leaves your device. Instead of uploading the original file, your browser uses local cryptographic APIs to encrypt it. The server only receives ciphertext—data that appears random and is useless without the decryption key.",
        ],
        flow: "browser",
        bullets: [
          "Browser-side encryption does not replace TLS—it complements it.",
          "TLS still protects the connection from network-level eavesdroppers.",
          "The provider's servers receive nothing but unreadable ciphertext because they never receive the plaintext or the decryption key.",
        ],
      },
      {
        title: "Why this difference matters",
        level: "primary",
        paragraphs: [
          "Suppose you are sharing highly sensitive data: legal contracts, financial spreadsheets, proprietary source code, medical records, or confidential business documents.",
          "With transport-only encryption, your privacy is **contractual**. You must trust the provider's implementation, employee access controls, and current and future corporate policies.",
          "With browser-side encryption, your privacy is **architectural**. The provider only stores encrypted ciphertext. Even if they are hacked, subpoenaed, or change their business model, they cannot hand over plaintext they never possessed.",
        ],
        callout:
          "With transport-only encryption, your privacy is **contractual**. With browser-side encryption, your privacy is **architectural**.",
      },
      {
        title: "A recent reminder: the trust factor",
        level: "primary",
        paragraphs: [
          "In 2025, WeTransfer updated its Terms of Service with language that appeared to grant broad rights over uploaded content, including for improving machine-learning systems used in content moderation.",
          "The change triggered immediate backlash from artists, journalists, and creative professionals who feared their intellectual property would be used to train AI systems. WeTransfer quickly clarified that customer content was not being used for AI training and removed the confusing language—but the incident highlighted a crucial lesson:",
          "If a provider receives your files in plaintext, you are entirely dependent on their promises. When a provider only stores encrypted ciphertext, the amount of trust you must place in them is structurally minimized. The architecture enforces the privacy.",
        ],
      },
      {
        title: "How PrivateNote handles file sharing",
        level: "primary",
        paragraphs: [
          "Modern browser-based encryption combines several well-established cryptographic building blocks to keep data secure without relying on server trust.",
        ],
      },
      {
        title: "Key generation and isolation",
        level: "secondary",
        paragraphs: [
          "When a user prepares to share a file, PrivateNote generates a cryptographically secure, random symmetric key directly in the browser using the Web Crypto API.",
          "This key is never transmitted to our infrastructure. Instead, it is appended to the sharing link as a URL fragment (the portion after the `#` symbol):",
          "`https://privatenote.ai/note/your-note-id#your-secret-key`",
          "By design, web browsers never send the URL fragment to the web server during an HTTP request. This behavior is defined by the URL standard and has worked this way for decades. The decryption key stays in the recipient's browser.",
        ],
      },
      {
        title: "Authenticated streaming encryption",
        level: "secondary",
        paragraphs: [
          "Instead of uploading raw data, the browser encrypts the file before it touches the network. Because PrivateNote supports large attachments, it uses **streaming, chunked encryption**: files are encrypted block-by-block (typically in multi-megabyte chunks) so large uploads do not need to load the entire file into memory at once.",
          "Free accounts can attach files up to 25 MB; Premium accounts support much larger payloads (up to 1 GB per file). In all cases, only ciphertext reaches our servers.",
          "The implementation relies on **AES-GCM** (Authenticated Encryption with Associated Data), providing both confidentiality and integrity:",
        ],
        bullets: [
          "**Confidentiality** — the payload is unreadable without the key.",
          "**Integrity** — tampering with ciphertext at rest is detected and rejected during client-side decryption.",
          "When password protection is enabled, a password-derived key is generated using memory-hard algorithms such as **Argon2id**, making brute-force guessing impractical.",
        ],
      },
      {
        title: "What metadata still exists",
        level: "primary",
        paragraphs: [
          "A rigorous security architecture must acknowledge its boundaries. Browser-side encryption protects the **contents** of your files, but certain metadata remains visible to the network and service:",
        ],
        bullets: [
          "Upload and download timestamps.",
          "The approximate size of the encrypted payload.",
          "Expiration, view limits, and file-access windows.",
          "The recipient's IP address when they download (visible to the web server routing the request).",
        ],
        callout:
          "Privacy-focused systems minimize metadata wherever practical, but no web-based service can eliminate it entirely. PrivateNote treats metadata with the same retention discipline as encrypted payloads—purged when a note expires or is deleted.",
      },
      {
        title: "The trade-offs of true privacy",
        level: "primary",
        paragraphs: ["Browser-side encryption offers maximum content privacy, but it comes with intentional trade-offs:"],
        bullets: [
          "**No server-side malware scanning** — because the server cannot read the file, it cannot scan it for viruses. Trust the sender.",
          "**No server-generated previews** — thumbnails and document previews are rendered locally in the recipient's browser after decryption, not on the server.",
          "**No password or key recovery** — if you lose the link or encryption key, the provider cannot recover the file. There is no \"Forgot password\" for data the host cannot access.",
        ],
      },
      {
        title: "Choosing the right service",
        level: "primary",
        paragraphs: [
          "Not every file transfer requires strict browser-side encryption. Casual holiday photos with family may be fine with transport encryption alone.",
          "If you are sharing intellectual property, legal agreements, or sensitive personal data, ask one architectural question:",
          "**Does the service receive my original file, or only an encrypted version of it?**",
          "That single distinction determines who can technically access your data—not just today, but as corporate policies, ownership, and privacy laws evolve over time.",
        ],
      },
    ],
    closingTitle: "Share files without handing plaintext to the server",
    closingBody:
      "PrivateNote's secure file transfer uses the same browser-side encryption model as our disappearing notes: encrypt locally, upload ciphertext, share the key in the URL fragment, and expire access on your terms.",
    ctaLabel: "Try secure file transfer",
    relatedReading: "Related reading",
  },
  it: {
    intro: [
      'Quando le persone cercano "condivisione sicura di file", spesso danno per scontato che ogni servizio con HTTPS o TLS protegga i file nello stesso modo. Purtroppo non è così.',
      'Due servizi possono pubblicizzare entrambi un "trasferimento file cifrato" offrendo garanzie di privacy molto diverse. La differenza sta interamente in **dove avviene la cifratura**. Capire questa distinzione spiega perché alcuni servizi possono ispezionare, indicizzare ed elaborare i tuoi file, mentre altri semplicemente non possono.',
    ],
    sections: [
      {
        title: "I due tipi di cifratura",
        level: "primary",
        paragraphs: ["Esistono due modi principali con cui i servizi moderni di condivisione file proteggono i dati."],
      },
      {
        title: "1. Cifratura di trasporto (TLS)",
        level: "secondary",
        paragraphs: [
          "È la cifratura standard usata oggi da quasi tutti i siti web. Quando carichi un file, il browser stabilisce una connessione sicura Transport Layer Security (TLS) con il server host. La connessione è cifrata mentre il file viaggia sulla rete, proteggendoti da attaccanti su Wi‑Fi pubblici, router compromessi o chiunque intercetti il traffico.",
        ],
        flow: "tls",
        bullets: [
          "TLS è essenziale, e ogni servizio affidabile deve usarlo.",
          "Quando il caricamento raggiunge il server, il provider riceve il file originale in chiaro.",
          "Da quel momento, a seconda delle policy, il servizio può conservare il file, generare anteprime, indicizzare il contenuto, scannerizzare malware o usare metadati per analisi.",
          'Molti provider cifrano anche i file "a riposo". Questo protegge dal furto fisico dei dischi, ma il servizio possiede comunque le chiavi e può leggere i file.',
        ],
        callout:
          "**La vulnerabilità centrale del cloud storage tradizionale:** il server può cifrare solo ciò che ha già potuto leggere.",
      },
      {
        title: "2. Cifratura nel browser",
        level: "secondary",
        paragraphs: [
          "Un approccio radicalmente diverso consiste nel cifrare il file **prima** che lasci il dispositivo. Invece di caricare il file originale, il browser usa API crittografiche locali per cifrarlo. Il server riceve solo testo cifrato: dati che appaiono casuali e sono inutili senza la chiave di decifratura.",
        ],
        flow: "browser",
        bullets: [
          "La cifratura nel browser non sostituisce TLS: lo completa.",
          "TLS continua a proteggere la connessione da intercettazioni a livello di rete.",
          "I server del provider ricevono solo testo cifrato illeggibile, perché non ricevono mai né il file in chiaro né la chiave di decifratura.",
        ],
      },
      {
        title: "Perché questa differenza conta",
        level: "primary",
        paragraphs: [
          "Supponi di condividere dati molto sensibili: contratti legali, fogli finanziari, codice sorgente proprietario, cartelle cliniche o documenti aziendali riservati.",
          "Con la sola cifratura di trasporto, la tua privacy è **contrattuale**. Devi fidarti dell’implementazione del provider, dei controlli di accesso dei dipendenti e delle policy aziendali presenti e future.",
          "Con la cifratura nel browser, la tua privacy è **architetturale**. Il provider conserva solo testo cifrato. Anche se viene violato, riceve un ordine legale o cambia modello di business, non può consegnare testo in chiaro che non ha mai posseduto.",
        ],
        callout:
          "Con la sola cifratura di trasporto, la privacy è **contrattuale**. Con la cifratura nel browser, la privacy è **architetturale**.",
      },
      {
        title: "Un promemoria recente: il fattore fiducia",
        level: "primary",
        paragraphs: [
          "Nel 2025 WeTransfer ha aggiornato i Termini di servizio con un linguaggio che sembrava concedere ampi diritti sui contenuti caricati, anche per migliorare sistemi di machine learning usati nella moderazione dei contenuti.",
          "La modifica ha provocato una reazione immediata da artisti, giornalisti e professionisti creativi, preoccupati che la loro proprietà intellettuale venisse usata per addestrare sistemi IA. WeTransfer ha chiarito rapidamente che i contenuti dei clienti non venivano usati per l’addestramento IA e ha rimosso il linguaggio ambiguo, ma l’episodio ha evidenziato una lezione cruciale:",
          "Se un provider riceve i tuoi file in chiaro, dipendi interamente dalle sue promesse. Quando un provider conserva solo testo cifrato, la quantità di fiducia che devi riporre in lui è ridotta strutturalmente. È l’architettura a far rispettare la privacy.",
        ],
      },
      {
        title: "Come PrivateNote gestisce la condivisione file",
        level: "primary",
        paragraphs: [
          "La cifratura moderna basata sul browser combina diversi componenti crittografici consolidati per mantenere i dati sicuri senza affidarsi alla fiducia nel server.",
        ],
      },
      {
        title: "Generazione e isolamento della chiave",
        level: "secondary",
        paragraphs: [
          "Quando un utente prepara un file da condividere, PrivateNote genera direttamente nel browser una chiave simmetrica casuale e crittograficamente sicura usando la Web Crypto API.",
          "Questa chiave non viene mai trasmessa alla nostra infrastruttura. Viene invece aggiunta al link di condivisione come frammento URL, cioè la parte dopo il simbolo `#`:",
          "`https://privatenote.ai/note/your-note-id#your-secret-key`",
          "Per design, i browser non inviano mai il frammento URL al server durante una richiesta HTTP. Questo comportamento è definito dallo standard URL e funziona così da decenni. La chiave di decifratura resta nel browser del destinatario.",
        ],
      },
      {
        title: "Cifratura streaming autenticata",
        level: "secondary",
        paragraphs: [
          "Invece di caricare dati grezzi, il browser cifra il file prima che tocchi la rete. Poiché PrivateNote supporta allegati grandi, usa **cifratura streaming a blocchi**: i file vengono cifrati blocco per blocco, di solito in chunk da diversi megabyte, così gli upload grandi non devono essere caricati interamente in memoria.",
          "Gli account gratuiti possono allegare file fino a 25 MB; gli account Premium supportano payload molto più grandi, fino a 1 GB per file. In ogni caso, ai nostri server arriva solo testo cifrato.",
          "L’implementazione usa **AES-GCM** (Authenticated Encryption with Associated Data), che offre sia confidenzialità sia integrità:",
        ],
        bullets: [
          "**Confidenzialità**: il payload è illeggibile senza la chiave.",
          "**Integrità**: manomissioni del testo cifrato a riposo vengono rilevate e rifiutate durante la decifratura lato client.",
          "Quando è attiva la protezione con password, viene generata una chiave derivata dalla password usando algoritmi memory-hard come **Argon2id**, rendendo impraticabile il brute force.",
        ],
      },
      {
        title: "Quali metadati restano visibili",
        level: "primary",
        paragraphs: [
          "Un’architettura di sicurezza rigorosa deve riconoscere i propri limiti. La cifratura nel browser protegge il **contenuto** dei file, ma alcuni metadati restano visibili alla rete e al servizio:",
        ],
        bullets: [
          "Timestamp di upload e download.",
          "Dimensione approssimativa del payload cifrato.",
          "Scadenza, limiti di visualizzazione e finestre di accesso ai file.",
          "Indirizzo IP del destinatario durante il download, visibile al server web che instrada la richiesta.",
        ],
        callout:
          "I sistemi orientati alla privacy minimizzano i metadati dove possibile, ma nessun servizio web può eliminarli del tutto. PrivateNote tratta i metadati con la stessa disciplina di conservazione dei payload cifrati: vengono eliminati quando una nota scade o viene cancellata.",
      },
      {
        title: "I compromessi della vera privacy",
        level: "primary",
        paragraphs: ["La cifratura nel browser offre massima privacy del contenuto, ma comporta compromessi intenzionali:"],
        bullets: [
          "**Nessuna scansione malware lato server**: poiché il server non può leggere il file, non può scannerizzarlo per virus. Devi fidarti del mittente.",
          "**Nessuna anteprima generata dal server**: miniature e anteprime dei documenti vengono renderizzate localmente nel browser del destinatario dopo la decifratura, non sul server.",
          "**Nessun recupero di password o chiave**: se perdi il link o la chiave di cifratura, il provider non può recuperare il file. Non esiste “Password dimenticata” per dati a cui l’host non può accedere.",
        ],
      },
      {
        title: "Scegliere il servizio giusto",
        level: "primary",
        paragraphs: [
          "Non ogni trasferimento file richiede una cifratura rigorosa nel browser. Foto delle vacanze condivise con la famiglia possono andare bene anche con la sola cifratura di trasporto.",
          "Se stai condividendo proprietà intellettuale, accordi legali o dati personali sensibili, poniti una domanda architetturale:",
          "**Il servizio riceve il mio file originale o solo una versione cifrata?**",
          "Questa singola distinzione determina chi può tecnicamente accedere ai tuoi dati, non solo oggi, ma anche mentre policy aziendali, proprietà e leggi sulla privacy evolvono nel tempo.",
        ],
      },
    ],
    closingTitle: "Condividi file senza consegnare testo in chiaro al server",
    closingBody:
      "Il trasferimento sicuro di file di PrivateNote usa lo stesso modello di cifratura nel browser delle nostre note effimere: cifra localmente, carica testo cifrato, condividi la chiave nel frammento URL e fai scadere l’accesso alle tue condizioni.",
    ctaLabel: "Prova il trasferimento sicuro di file",
    relatedReading: "Letture correlate",
  },
  de: encryptedVsSecureFileSharingDe,
  es: encryptedVsSecureFileSharingEs,
  fr: encryptedVsSecureFileSharingFr,
  hr: encryptedVsSecureFileSharingHr,
  nl: encryptedVsSecureFileSharingNl,
  pt: encryptedVsSecureFileSharingPt,
  sr: encryptedVsSecureFileSharingSr,
};

export const EncryptedVsSecureFileSharingPost: React.FC = () => {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);
  const fileTransferPath = localizedPath("/secure-file-transfer", language);
  const article = getBlogArticleCopy(copy, language);

  return (
    <BlogGuideArticle slug="encrypted-vs-secure-file-sharing">
      <article>
        <BlogPostHeader
          slug="encrypted-vs-secure-file-sharing"
          title={t.blogEncryptedFileSharingTitle}
          subtitle={t.blogEncryptedFileSharingSubtitle}
          excerpt={t.blogEncryptedFileSharingExcerpt}
          titleClassName="mb-5 text-3xl leading-tight tracking-tight sm:text-4xl"
          headerClassName="mb-14"
        >
          <figure className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/80 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
            <img
              src={heroImagePath}
              alt="Illustration comparing plaintext cloud upload versus encrypting files in the browser before upload"
              width={1000}
              height={666}
              className="mx-auto h-auto w-full object-contain"
            />
          </figure>
        </BlogPostHeader>

        <BlogArticleTakeaways slug="encrypted-vs-secure-file-sharing" />

        <div className="space-y-7">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} />
          ))}
        </div>

        <div className="mt-16 space-y-16">
          {article.sections.map((section, index) => {
            const isPrimary = section.level !== "secondary";
            const isFirst = index === 0;

            return (
              <section
                key={section.title}
                className={cn(
                  "space-y-6",
                  isPrimary && !isFirst && "border-t border-gray-200 pt-12 dark:border-gray-800",
                )}
              >
                {isPrimary ? (
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[1.75rem]">
                    {section.title}
                  </h2>
                ) : (
                  <h3 className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {section.title.match(/^(\d+)/)?.[1] ?? "•"}
                    </span>
                    {section.title.replace(/^\d+\.\s*/, "")}
                  </h3>
                )}

                <div className="space-y-5">
                  {section.paragraphs.map((paragraph) =>
                    paragraph.startsWith("`") && paragraph.endsWith("`") ? (
                      <InlineCodeBlock key={paragraph} code={paragraph.slice(1, -1)} />
                    ) : (
                      <ArticleParagraph key={paragraph} text={paragraph} />
                    ),
                  )}
                </div>

                {section.flow ? <EncryptionFlowDiagram kind={section.flow} /> : null}
                {section.bullets ? <BulletList items={section.bullets} /> : null}
                {section.callout ? <CalloutBox text={section.callout} /> : null}
              </section>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50/70 px-6 py-8 dark:border-gray-800 dark:bg-gray-900/40 sm:px-8">
          <h2 className="mb-4 flex items-center gap-2.5 text-xl font-semibold text-gray-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-primary/80" />
            {article.closingTitle}
          </h2>
          <p className="mb-7 max-w-2xl text-[1.0625rem] leading-[1.8] text-gray-700 dark:text-gray-300">
            {article.closingBody}
          </p>
          <Link
            href={fileTransferPath}
            className="group inline-flex items-center gap-2.5 rounded-xl border border-primary/25 bg-white px-6 py-3.5 text-base font-semibold text-primary shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5 dark:border-primary/30 dark:bg-gray-950 dark:hover:bg-primary/10"
          >
            {article.ctaLabel}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <BlogPostCrossLinks slug="encrypted-vs-secure-file-sharing" />
      </article>
    </BlogGuideArticle>
  );
};
