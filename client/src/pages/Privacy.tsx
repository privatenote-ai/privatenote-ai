import React from "react";
import { Shield, Lock, Cpu, Globe, Scale } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  BILLING_SELLER_ADDRESS_LINE1,
  BILLING_SELLER_ADDRESS_LINE2,
  BILLING_SELLER_CAPACITY,
  BILLING_SELLER_LEGAL_NAME,
} from "@shared/billingTerms";

type PrivacyLocale = "en" | "de" | "fr";

type PrivacyCopy = {
  title: string;
  subtitle: string;
  controllerTitle: string;
  controllerIntro: string;
  companyName: string;
  companyLegalForm: string;
  companyAddress1: string;
  companyAddress2: string;
  under16: React.ReactNode;
  aiTitle: string;
  aiIntro: React.ReactNode;
  aiList1: React.ReactNode;
  aiList2: React.ReactNode;
  aiOutro: string;
  aiConsent: React.ReactNode;
  dataTitle: string;
  encryptedTitle: string;
  encryptedBody: string;
  technicalTitle: string;
  technicalBody: React.ReactNode;
  technicalNote: string;
  analyticsTitle: string;
  analyticsBody: React.ReactNode;
  cookieTitle: string;
  cookieBody: React.ReactNode;
  supportTitle: string;
  supportBody: React.ReactNode;
  legalBasisTitle: string;
  legalBasisItems: string[];
  retentionTitle: string;
  retentionItems: string[];
  transfersTitle: string;
  transfersIntro: string;
  processorsTitle: string;
  processorsIntro: string;
  processorsItems: React.ReactNode[];
  transfer1: React.ReactNode;
  transfer2: React.ReactNode;
  transfersSafeguards: React.ReactNode;
  rightsTitle: string;
  rightsIntro: string;
  rightsList: string[];
  rightsWorkflow: string;
  rightsContact: React.ReactNode;
  securityTitle: string;
  securityBody: string;
  complaintText: string;
};

const PRIVACY_COPY: Record<PrivacyLocale, PrivacyCopy> = {
  en: {
    title: "Privacy Policy",
    subtitle: "Version 2.4 • Last updated: September 8, 2026 • Luxembourg, EU",
    controllerTitle: "1. Data Controller",
    controllerIntro:
      "For the purposes of the General Data Protection Regulation (GDPR), the data controller is:",
    companyName: BILLING_SELLER_LEGAL_NAME,
    companyLegalForm: BILLING_SELLER_CAPACITY,
    companyAddress1: BILLING_SELLER_ADDRESS_LINE1,
    companyAddress2: BILLING_SELLER_ADDRESS_LINE2,
    under16: (
      <>
        PrivateNote.ai is not intended for users under the age of <strong>16</strong>. We do not knowingly
        collect personal data from children.
      </>
    ),
    aiTitle: "2. Optional AI (On-Device)",
    aiIntro: (
      <>
        PrivateNote.ai may offer optional AI-assisted drafting or editing <strong>in your browser</strong>{" "}
        (for example via a local model runtime). <strong>Please read this carefully:</strong>
      </>
    ),
    aiList1: (
      <>
        <strong>Processing location:</strong> For these features, note content you send into the assistant
        is processed on your device. It is <strong>not</strong> sent to PrivateNote.ai servers for AI
        inference. End-to-end encryption of the stored note is unchanged; plaintext exists in your browser
        only for as long as you use the feature.
      </>
    ),
    aiList2: (
      <>
        <strong>Network activity:</strong> Your browser may still contact third-party hosts to download
        model assets or dependencies (for example a CDN or model registry). Those requests are governed by
        those operators&apos; policies and your browser settings.
      </>
    ),
    aiOutro:
      "If you do not use AI features, you can create standard notes that stay client-side encrypted for storage and are not processed by the on-device assistant.",
    aiConsent: (
      <>
        <strong>Legal basis split:</strong> Text processed by optional on-device AI features relies on{" "}
        <strong>your consent (Art. 6(1)(a) GDPR)</strong> when you actively use those features. Security
        metadata for anti-abuse and service protection relies on{" "}
        <strong>legitimate interests (Art. 6(1)(f) GDPR)</strong>.
      </>
    ),
    dataTitle: "3. What Data We Collect & Why",
    encryptedTitle: "Encrypted Notes (Stored Data)",
    encryptedBody:
      "Notes are stored in an encrypted format that we cannot read. Notes are deleted automatically upon expiration or consumption, depending on the settings you choose.",
    technicalTitle: "Technical Metadata (Traffic Data)",
    technicalBody: (
      <>
        IP addresses, device and request metadata may be processed by our infrastructure providers (e.g.,
        Cloudflare) for security, DDoS protection, abuse prevention, and rate limiting (Art. 6(1)(f) GDPR).
      </>
    ),
    technicalNote:
      "Security-related metadata is retained only for as long as necessary to ensure service security and abuse prevention, typically for a limited period of days to weeks, after which it is automatically deleted or anonymized.",
    analyticsTitle: "First-Party Product Analytics",
    analyticsBody: (
      <>
        We collect <strong>aggregated, first-party</strong> statistics about how public pages are used so we
        can operate and improve the product. This includes page-visit counts, time a page stays visible in
        the foreground, coarse scroll-depth, and a low-resolution click/attention grid. We do{" "}
        <strong>not</strong> record session replays, keystrokes, note content, note IDs, or individual
        profiles, and we do <strong>not</strong> send this data to advertising or third-party analytics
        companies. Legal basis: <strong>Art. 6(1)(f) GDPR</strong> (legitimate interests in understanding and
        improving the service).
      </>
    ),
    cookieTitle: "First-Party Rate-Limit Cookie (pn_client_id)",
    cookieBody: (
      <>
        Our API may set a small <strong>first-party</strong>, <strong>HttpOnly</strong> cookie named{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">pn_client_id</code>. It holds
        a random identifier used <strong>only</strong> to separate abuse-prevention and rate-limit
        buckets-especially on networks where many people share one public IP (for example schools or
        offices). When your IP is available to our infrastructure, we combine IP and this cookie for
        counting; we <strong>do not</strong> use it for advertising, profiling, or analytics. The cookie is
        renewed with a <strong>~30-day</strong> lifetime; you can remove it at any time via your browser
        (you may get a new id on the next visit). Legal basis: <strong>Art. 6(1)(f) GDPR</strong>-legitimate
        interests in running a secure, abuse-resistant service.
      </>
    ),
    supportTitle: "Support Communications (If You Contact Us)",
    supportBody: (
      <>
        If you email our support or legal contacts, we will process the information you provide solely to
        respond to your request (Art. 6(1)(b) and/or Art. 6(1)(f) GDPR).
      </>
    ),
    legalBasisTitle: "Lawful Basis by Processing Purpose",
    legalBasisItems: [
      "Optional on-device AI text processing: Art. 6(1)(a) GDPR (consent).",
      "Security, abuse prevention, rate limiting, and network protection metadata: Art. 6(1)(f) GDPR (legitimate interests).",
      "Aggregated first-party product analytics (page visits, visible time, coarse click/scroll heatmaps): Art. 6(1)(f) GDPR (legitimate interests).",
      "Support/legal correspondence initiated by you: Art. 6(1)(b) and/or Art. 6(1)(f) GDPR.",
    ],
    retentionTitle: "Retention Windows (Data Minimization)",
    retentionItems: [
      "Encrypted note payload: retained until expiry/one-time read settings trigger deletion.",
      "Security metadata (IP/request-level anti-abuse logs): retained up to 30 days, then deleted or anonymized.",
      "Rate-limit cookie (pn_client_id): approximately 30 days from last renewal.",
      "Aggregated first-party page-engagement statistics (visits, visible time, coarse heatmaps): retained for up to 24 months.",
      "Support/legal emails: retained for up to 24 months after resolution unless a longer legal retention period is required.",
    ],
    transfersTitle: "4. International Data Transfers",
    transfersIntro:
      "As a Luxembourg-based service, we prioritize EU-based processing. However, depending on your location and infrastructure routing, certain technical data may be processed outside the EU:",
    processorsTitle: "Processors and Roles",
    processorsIntro:
      "We use infrastructure processors to operate and secure the service. Their role depends on the processing context.",
    processorsItems: [
      <>
        <strong>Cloudflare:</strong> processor for hosting, CDN delivery, and edge security; may process
        technical request metadata.
      </>,
      <>
        <strong>Model/CDN providers used by your browser:</strong> independent providers contacted only when
        optional on-device AI assets are fetched.
      </>,
      <>
        We maintain data processing agreements with processors where required and apply SCC-based safeguards
        when cross-border transfers are involved.
      </>,
    ],
    transfer1: (
      <>
        <strong>Cloudflare:</strong> used for global content delivery and security. Data may be processed in
        Cloudflare&apos;s global network.
      </>
    ),
    transfer2: (
      <>
        <strong>On-device AI:</strong> if you use optional in-browser AI, model files may be loaded from
        globally distributed CDNs or hosts outside the EU, depending on how your browser fetches them.
      </>
    ),
    transfersSafeguards: (
      <>
        Where required for transfers outside the EEA, we rely on{" "}
        <strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission and/or
        other appropriate safeguards to ensure a high level of data protection.
      </>
    ),
    rightsTitle: "5. Your GDPR Rights",
    rightsIntro:
      "Under the GDPR, you have rights including access, rectification, erasure, restriction, portability, and the right to object.",
    rightsList: [
      "Right of Access",
      "Right to Rectification",
      "Right to Erasure",
      "Right to Restrict Processing",
      "Right to Data Portability",
      "Right to Object",
    ],
    rightsWorkflow:
      "We respond to verified GDPR requests within one month (Art. 12(3) GDPR). For complex requests, this may be extended by up to two additional months with notice. To prevent unauthorized disclosure, we may ask for verification details (for example, the relevant note URL and contextual metadata you provided to us).",
    rightsContact: (
      <>
        To exercise these rights, contact{" "}
        <a href="mailto:support@privatenote.ai" className="text-primary font-medium hover:underline">
          support@privatenote.ai
        </a>
        . Because we do not use user accounts, we may require the specific note URL (or other information
        you provide) to identify any data related to your request.
      </>
    ),
    securityTitle: "6. Security Limitations",
    securityBody:
      "We use modern cryptography (e.g., AES-GCM) and security controls (e.g., strict Content Security Policy headers) to protect the service. However, no system is 100% secure. Optional on-device AI runs in your browser and may pull assets from third-party networks; users requiring maximum confidentiality can rely on standard client-side encrypted note creation without using AI features.",
    complaintText:
      "You have the right to lodge a complaint with the Luxembourgish data protection authority (CNPD - Commission Nationale pour la Protection des Donnees).",
  },
  de: {
    title: "Datenschutzerklaerung",
    subtitle: "Version 2.4 • Zuletzt aktualisiert: 8. September 2026 • Luxemburg, EU",
    controllerTitle: "1. Verantwortliche Stelle",
    controllerIntro:
      "Im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die verantwortliche Stelle:",
    companyName: BILLING_SELLER_LEGAL_NAME,
    companyLegalForm: BILLING_SELLER_CAPACITY,
    companyAddress1: BILLING_SELLER_ADDRESS_LINE1,
    companyAddress2: BILLING_SELLER_ADDRESS_LINE2,
    under16: (
      <>
        PrivateNote.ai ist nicht fuer Nutzer unter <strong>16</strong> Jahren bestimmt. Wir erheben
        wissentlich keine personenbezogenen Daten von Kindern.
      </>
    ),
    aiTitle: "2. Optionale KI (auf dem Geraet)",
    aiIntro: (
      <>
        PrivateNote.ai kann optionale KI-gestuetzte Funktionen zum Entwerfen oder Bearbeiten{" "}
        <strong>in Ihrem Browser</strong> anbieten (z. B. ueber eine lokale Modelllaufzeit).{" "}
        <strong>Bitte lesen Sie diesen Abschnitt sorgfaeltig:</strong>
      </>
    ),
    aiList1: (
      <>
        <strong>Ort der Verarbeitung:</strong> Bei diesen Funktionen werden die Inhalte, die Sie an den
        Assistenten senden, auf Ihrem Geraet verarbeitet. Sie werden <strong>nicht</strong> zur KI-Inferenz
        an Server von PrivateNote.ai uebermittelt. Die Ende-zu-Ende-Verschluesselung gespeicherter Notizen
        bleibt unveraendert; Klartext befindet sich nur waehrend der Nutzung im Browser.
      </>
    ),
    aiList2: (
      <>
        <strong>Netzwerkaktivitaet:</strong> Ihr Browser kann weiterhin Drittanbieter-Hosts kontaktieren, um
        Modell-Dateien oder Abhaengigkeiten herunterzuladen (z. B. CDN oder Modell-Registry). Diese Anfragen
        unterliegen den Richtlinien dieser Betreiber und Ihren Browser-Einstellungen.
      </>
    ),
    aiOutro:
      "Wenn Sie KI-Funktionen nicht nutzen, koennen Sie Standardnotizen erstellen, die clientseitig verschluesselt gespeichert werden und nicht durch den On-Device-Assistenten verarbeitet werden.",
    aiConsent: (
      <>
        <strong>Aufteilung der Rechtsgrundlagen:</strong> Die Verarbeitung von Texten in optionalen
        On-Device-KI-Funktionen erfolgt auf Basis Ihrer{" "}
        <strong>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO)</strong>, wenn Sie diese aktiv nutzen.
        Sicherheitsmetadaten fuer Missbrauchsschutz und Dienstsicherheit verarbeiten wir auf Basis{" "}
        <strong>berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO)</strong>.
      </>
    ),
    dataTitle: "3. Welche Daten wir erheben und warum",
    encryptedTitle: "Verschluesselte Notizen (gespeicherte Daten)",
    encryptedBody:
      "Notizen werden in einem verschluesselten Format gespeichert, das wir nicht lesen koennen. Notizen werden je nach Ihren Einstellungen bei Ablauf oder nach dem Abruf automatisch geloescht.",
    technicalTitle: "Technische Metadaten (Verkehrsdaten)",
    technicalBody: (
      <>
        IP-Adressen, Geraete- und Anfrage-Metadaten koennen von unseren Infrastrukturanbietern (z. B.
        Cloudflare) zu Sicherheitszwecken, DDoS-Schutz, Missbrauchspraevention und Rate-Limiting verarbeitet
        werden (Art. 6 Abs. 1 lit. f DSGVO).
      </>
    ),
    technicalNote:
      "Sicherheitsbezogene Metadaten werden nur so lange gespeichert, wie es fuer die Sicherheit des Dienstes und die Missbrauchspraevention erforderlich ist, typischerweise fuer einen begrenzten Zeitraum von Tagen bis Wochen; danach werden sie automatisch geloescht oder anonymisiert.",
    analyticsTitle: "First-Party Produktanalytik",
    analyticsBody: (
      <>
        Wir erfassen <strong>aggregierte First-Party</strong>-Statistiken zur Nutzung oeffentlicher Seiten,
        um den Dienst zu betreiben und zu verbessern: Seitenbesuche, sichtbare Verweildauer im Vordergrund,
        grobe Scrolltiefe sowie ein grobes Klick-/Aufmerksamkeitsraster. Wir speichern{" "}
        <strong>keine</strong> Session-Replays, Tastatureingaben, Notizinhalte, Notiz-IDs oder individuelle
        Profile und senden diese Daten <strong>nicht</strong> an Werbe- oder Drittanbieter-Analytics.
        Rechtsgrundlage: <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigte Interessen am Verstehen und
        Verbessern des Dienstes).
      </>
    ),
    cookieTitle: "First-Party Rate-Limit-Cookie (pn_client_id)",
    cookieBody: (
      <>
        Unsere API kann ein kleines <strong>First-Party</strong>-<strong>HttpOnly</strong>-Cookie mit dem
        Namen <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">pn_client_id</code>{" "}
        setzen. Es enthaelt eine zufaellige Kennung, die <strong>ausschliesslich</strong> zur Trennung von
        Missbrauchs- und Rate-Limit-Kontingenten verwendet wird-besonders in Netzwerken mit gemeinsamer
        oeffentlicher IP (z. B. Schulen oder Bueros). Wenn Ihre IP fuer unsere Infrastruktur verfuegbar ist,
        kombinieren wir IP und dieses Cookie fuer die Zaehllogik; wir verwenden es <strong>nicht</strong>{" "}
        fuer Werbung, Profiling oder Analytics. Das Cookie wird mit einer Laufzeit von{" "}
        <strong>ca. 30 Tagen</strong> erneuert; Sie koennen es jederzeit im Browser loeschen (beim naechsten
        Besuch kann eine neue Kennung entstehen). Rechtsgrundlage: <strong>Art. 6 Abs. 1 lit. f DSGVO</strong>
        - berechtigte Interessen am sicheren und missbrauchsresistenten Betrieb des Dienstes.
      </>
    ),
    supportTitle: "Support-Kommunikation (wenn Sie uns kontaktieren)",
    supportBody: (
      <>
        Wenn Sie unseren Support oder unsere Rechtskontakte per E-Mail kontaktieren, verarbeiten wir die von
        Ihnen bereitgestellten Informationen ausschliesslich zur Beantwortung Ihrer Anfrage (Art. 6 Abs. 1
        lit. b und/oder Art. 6 Abs. 1 lit. f DSGVO).
      </>
    ),
    legalBasisTitle: "Rechtsgrundlagen nach Verarbeitungszweck",
    legalBasisItems: [
      "Optionale On-Device-KI-Textverarbeitung: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).",
      "Sicherheit, Missbrauchspraevention, Rate-Limiting und Netzwerkschutz-Metadaten: Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen).",
      "Aggregierte First-Party-Produktanalytik (Seitenbesuche, sichtbare Zeit, grobe Klick-/Scroll-Heatmaps): Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen).",
      "Von Ihnen initiierte Support-/Rechtskommunikation: Art. 6 Abs. 1 lit. b und/oder Art. 6 Abs. 1 lit. f DSGVO.",
    ],
    retentionTitle: "Aufbewahrungsfristen (Datenminimierung)",
    retentionItems: [
      "Verschluesselte Notizinhalte: Speicherung bis Ablauf bzw. bis die Einmal-Lese-Einstellungen die Loeschung ausloesen.",
      "Sicherheitsmetadaten (IP-/Request-Anti-Abuse-Logs): Aufbewahrung bis zu 30 Tage, danach Loeschung oder Anonymisierung.",
      "Rate-Limit-Cookie (pn_client_id): etwa 30 Tage ab letzter Erneuerung.",
      "Aggregierte First-Party Seitenengagement-Statistiken (Besuche, sichtbare Zeit, grobe Heatmaps): Aufbewahrung bis zu 24 Monate.",
      "Support-/Rechts-E-Mails: Aufbewahrung bis zu 24 Monate nach Abschluss, sofern keine laengere gesetzliche Pflicht besteht.",
    ],
    transfersTitle: "4. Internationale Datentransfers",
    processorsTitle: "Auftragsverarbeiter und Rollen",
    processorsIntro:
      "Wir nutzen Auftragsverarbeiter zur Bereitstellung und Absicherung des Dienstes. Die genaue Rolle richtet sich nach dem Verarbeitungskontext.",
    processorsItems: [
      <>
        <strong>Cloudflare:</strong> Auftragsverarbeiter fuer Hosting, CDN-Auslieferung und Edge-Sicherheit;
        kann technische Anfrage-Metadaten verarbeiten.
      </>,
      <>
        <strong>Modell-/CDN-Anbieter im Browser:</strong> eigenstaendige Anbieter, die nur beim Abruf
        optionaler On-Device-KI-Assets kontaktiert werden.
      </>,
      <>
        Soweit erforderlich bestehen Auftragsverarbeitungsvertraege; bei Drittlanduebermittlungen nutzen wir
        SCC-basierte Schutzmechanismen.
      </>,
    ],
    transfersIntro:
      "Als in Luxemburg ansaessiger Dienst priorisieren wir die Verarbeitung in der EU. Je nach Ihrem Standort und Routing der Infrastruktur koennen jedoch bestimmte technische Daten ausserhalb der EU verarbeitet werden:",
    transfer1: (
      <>
        <strong>Cloudflare:</strong> wird fuer globale Auslieferung und Sicherheit genutzt. Daten koennen im
        globalen Netzwerk von Cloudflare verarbeitet werden.
      </>
    ),
    transfer2: (
      <>
        <strong>On-Device-KI:</strong> wenn Sie optionale KI im Browser verwenden, koennen Modell-Dateien
        ueber global verteilte CDNs oder Hosts ausserhalb der EU geladen werden, je nachdem, wie Ihr Browser
        sie abruft.
      </>
    ),
    transfersSafeguards: (
      <>
        Soweit fuer Uebermittlungen ausserhalb des EWR erforderlich, stuetzen wir uns auf von der
        Europaeischen Kommission genehmigte <strong>Standardvertragsklauseln (SCCs)</strong> und/oder andere
        geeignete Garantien, um ein hohes Datenschutzniveau sicherzustellen.
      </>
    ),
    rightsTitle: "5. Ihre DSGVO-Rechte",
    rightsIntro:
      "Nach der DSGVO haben Sie Rechte auf Auskunft, Berichtigung, Loeschung, Einschraenkung, Datenuebertragbarkeit und Widerspruch.",
    rightsList: [
      "Auskunftsrecht",
      "Recht auf Berichtigung",
      "Recht auf Loeschung",
      "Recht auf Einschraenkung der Verarbeitung",
      "Recht auf Datenuebertragbarkeit",
      "Widerspruchsrecht",
    ],
    rightsWorkflow:
      "Wir beantworten verifizierte DSGVO-Anfragen innerhalb eines Monats (Art. 12 Abs. 3 DSGVO). Bei komplexen Anfragen kann diese Frist um bis zu zwei weitere Monate verlaengert werden; darueber informieren wir Sie. Zum Schutz vor unbefugter Offenlegung koennen wir Verifikationsangaben anfordern (z. B. betreffende Notiz-URL und von Ihnen bereitgestellte Kontextdaten).",
    rightsContact: (
      <>
        Zur Ausuebung dieser Rechte kontaktieren Sie{" "}
        <a href="mailto:support@privatenote.ai" className="text-primary font-medium hover:underline">
          support@privatenote.ai
        </a>
        . Da wir keine Benutzerkonten verwenden, koennen wir die konkrete Notiz-URL (oder andere von Ihnen
        bereitgestellte Informationen) benoetigen, um relevante Daten zu Ihrem Anliegen zuzuordnen.
      </>
    ),
    securityTitle: "6. Sicherheitsgrenzen",
    securityBody:
      "Wir verwenden moderne Kryptografie (z. B. AES-GCM) und Sicherheitskontrollen (z. B. strenge Content-Security-Policy-Header), um den Dienst zu schuetzen. Dennoch ist kein System zu 100% sicher. Optionale On-Device-KI laeuft in Ihrem Browser und kann Assets aus Drittanbieter-Netzwerken laden; Nutzer mit maximalen Vertraulichkeitsanforderungen koennen die normale clientseitig verschluesselte Notizerstellung ohne KI-Funktionen verwenden.",
    complaintText:
      "Sie haben das Recht, bei der luxemburgischen Datenschutzbehoerde (CNPD - Commission Nationale pour la Protection des Donnees) Beschwerde einzureichen.",
  },
  fr: {
    title: "Politique de confidentialite",
    subtitle: "Version 2.4 • Derniere mise a jour : 8 septembre 2026 • Luxembourg, UE",
    controllerTitle: "1. Responsable du traitement",
    controllerIntro:
      "Aux fins du Reglement general sur la protection des donnees (RGPD), le responsable du traitement est :",
    companyName: BILLING_SELLER_LEGAL_NAME,
    companyLegalForm: BILLING_SELLER_CAPACITY,
    companyAddress1: BILLING_SELLER_ADDRESS_LINE1,
    companyAddress2: BILLING_SELLER_ADDRESS_LINE2,
    under16: (
      <>
        PrivateNote.ai n&apos;est pas destine aux utilisateurs de moins de <strong>16 ans</strong>. Nous ne
        collectons pas sciemment de donnees personnelles concernant des enfants.
      </>
    ),
    aiTitle: "2. IA optionnelle (sur l&apos;appareil)",
    aiIntro: (
      <>
        PrivateNote.ai peut proposer des fonctions optionnelles d&apos;aide a la redaction ou a la revision
        par IA <strong>dans votre navigateur</strong> (par exemple via une execution locale de modele).{" "}
        <strong>Veuillez lire attentivement :</strong>
      </>
    ),
    aiList1: (
      <>
        <strong>Lieu du traitement :</strong> pour ces fonctions, le contenu que vous envoyez a
        l&apos;assistant est traite sur votre appareil. Il n&apos;est <strong>pas</strong> envoye aux
        serveurs de PrivateNote.ai pour l&apos;inference IA. Le chiffrement de bout en bout de la note
        stockee reste inchange ; le texte en clair n&apos;existe dans votre navigateur que pendant
        l&apos;utilisation de la fonctionnalite.
      </>
    ),
    aiList2: (
      <>
        <strong>Activite reseau :</strong> votre navigateur peut tout de meme contacter des hebergeurs tiers
        pour telecharger des modeles ou dependances (par exemple un CDN ou un registre de modeles). Ces
        requetes sont regies par les politiques de ces operateurs et vos parametres de navigateur.
      </>
    ),
    aiOutro:
      "Si vous n&apos;utilisez pas les fonctions IA, vous pouvez creer des notes standard qui restent chiffrees cote client pour le stockage et ne sont pas traitees par l&apos;assistant sur l&apos;appareil.",
    aiConsent: (
      <>
        <strong>Base legale par finalite :</strong> le traitement du texte dans les fonctions IA optionnelles
        sur l&apos;appareil repose sur <strong>votre consentement (art. 6, par. 1, a) RGPD)</strong> lorsque
        vous les activez. Les metadonnees de securite pour la prevention des abus et la protection du service
        reposent sur <strong>l&apos;interet legitime (art. 6, par. 1, f) RGPD)</strong>.
      </>
    ),
    dataTitle: "3. Quelles donnees nous collectons et pourquoi",
    encryptedTitle: "Notes chiffrees (donnees stockees)",
    encryptedBody:
      "Les notes sont stockees dans un format chiffre que nous ne pouvons pas lire. Les notes sont supprimees automatiquement a l&apos;expiration ou apres consultation, selon les parametres choisis.",
    technicalTitle: "Metadonnees techniques (donnees de trafic)",
    technicalBody: (
      <>
        Les adresses IP, metadonnees d&apos;appareil et de requete peuvent etre traitees par nos fournisseurs
        d&apos;infrastructure (par ex. Cloudflare) pour la securite, la protection DDoS, la prevention des
        abus et la limitation de debit (art. 6, par. 1, f) RGPD).
      </>
    ),
    technicalNote:
      "Les metadonnees liees a la securite sont conservees uniquement le temps necessaire pour assurer la securite du service et prevenir les abus, generalement pour une periode limitee de quelques jours a quelques semaines, puis supprimees ou anonymisees automatiquement.",
    analyticsTitle: "Analytique produit first-party",
    analyticsBody: (
      <>
        Nous collectons des statistiques <strong>agregees first-party</strong> sur l&apos;usage des pages
        publiques afin d&apos;exploiter et d&apos;ameliorer le service : visites de pages, temps pendant
        lequel une page reste visible au premier plan, profondeur de defilement approximative, et une grille
        basse resolution des clics/de l&apos;attention. Nous n&apos;enregistrons <strong>pas</strong> de
        session replay, de frappes, de contenu de note, d&apos;identifiants de note ni de profils
        individuels, et nous n&apos;envoyons <strong>pas</strong> ces donnees a des publicitaires ou a des
        outils d&apos;analytique tiers. Base legale : <strong>art. 6, par. 1, f) RGPD</strong> (interet
        legitime a comprendre et ameliorer le service).
      </>
    ),
    cookieTitle: "Cookie first-party de limitation de debit (pn_client_id)",
    cookieBody: (
      <>
        Notre API peut definir un petit cookie <strong>first-party</strong>, <strong>HttpOnly</strong> nomme{" "}
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">pn_client_id</code>. Il contient
        un identifiant aleatoire utilise <strong>uniquement</strong> pour separer les quotas anti-abus et
        de limitation de debit-notamment sur les reseaux ou de nombreuses personnes partagent une meme IP
        publique (par exemple ecoles ou bureaux). Lorsque votre IP est disponible pour notre infrastructure,
        nous combinons IP et ce cookie pour le comptage ; nous ne l&apos;utilisons <strong>pas</strong> pour
        la publicite, le profilage ou l&apos;analyse. Le cookie est renouvelle avec une duree de vie
        d&apos;environ <strong>30 jours</strong> ; vous pouvez le supprimer a tout moment dans votre
        navigateur (un nouvel identifiant peut etre cree a la prochaine visite). Base legale :{" "}
        <strong>art. 6, par. 1, f) RGPD</strong> - interets legitimes a exploiter un service securise et
        resistant aux abus.
      </>
    ),
    supportTitle: "Communications d&apos;assistance (si vous nous contactez)",
    supportBody: (
      <>
        Si vous contactez notre support ou notre service juridique par e-mail, nous traitons les informations
        fournies uniquement pour repondre a votre demande (art. 6, par. 1, b) et/ou art. 6, par. 1, f) RGPD).
      </>
    ),
    legalBasisTitle: "Base legale par finalite de traitement",
    legalBasisItems: [
      "Traitement optionnel du texte via IA sur l&apos;appareil : art. 6, par. 1, a) RGPD (consentement).",
      "Metadonnees de securite, prevention des abus, limitation de debit et protection reseau : art. 6, par. 1, f) RGPD (interet legitime).",
      "Analytique produit first-party agregee (visites, temps visible, heatmaps clics/defilement grossiers) : art. 6, par. 1, f) RGPD (interet legitime).",
      "Communications support/juridique initiees par vous : art. 6, par. 1, b) et/ou art. 6, par. 1, f) RGPD.",
    ],
    retentionTitle: "Durees de conservation (minimisation des donnees)",
    retentionItems: [
      "Contenu de note chiffre : conserve jusqu&apos;a expiration ou suppression declenchee par le mode lecture unique.",
      "Metadonnees de securite (logs anti-abus IP/requetes) : conservation jusqu&apos;a 30 jours puis suppression ou anonymisation.",
      "Cookie de limitation de debit (pn_client_id) : environ 30 jours depuis le dernier renouvellement.",
      "Statistiques d&apos;engagement first-party agregees (visites, temps visible, heatmaps grossiers) : conservation jusqu&apos;a 24 mois.",
      "E-mails support/juridique : conservation jusqu&apos;a 24 mois apres resolution, sauf obligation legale plus longue.",
    ],
    transfersTitle: "4. Transferts internationaux de donnees",
    processorsTitle: "Sous-traitants et roles",
    processorsIntro:
      "Nous utilisons des sous-traitants d&apos;infrastructure pour exploiter et securiser le service. Le role exact depend du contexte de traitement.",
    processorsItems: [
      <>
        <strong>Cloudflare :</strong> sous-traitant pour l&apos;hebergement, la diffusion CDN et la securite
        edge ; peut traiter des metadonnees techniques de requete.
      </>,
      <>
        <strong>Fournisseurs de modeles/CDN charges par le navigateur :</strong> fournisseurs independants
        contactes uniquement lors du telechargement d&apos;assets IA optionnels sur l&apos;appareil.
      </>,
      <>
        Nous mettons en place des accords de traitement lorsque requis et appliquons des garanties de type
        SCC pour les transferts transfrontieres.
      </>,
    ],
    transfersIntro:
      "En tant que service base au Luxembourg, nous privilegions un traitement dans l&apos;UE. Toutefois, selon votre localisation et le routage de l&apos;infrastructure, certaines donnees techniques peuvent etre traitees hors UE :",
    transfer1: (
      <>
        <strong>Cloudflare :</strong> utilise pour la diffusion mondiale de contenu et la securite. Les
        donnees peuvent etre traitees dans le reseau mondial de Cloudflare.
      </>
    ),
    transfer2: (
      <>
        <strong>IA sur l&apos;appareil :</strong> si vous utilisez l&apos;IA optionnelle dans le navigateur,
        les fichiers de modele peuvent etre charges depuis des CDN ou hebergeurs repartis mondialement,
        potentiellement hors UE, selon la facon dont votre navigateur les recupere.
      </>
    ),
    transfersSafeguards: (
      <>
        Lorsque cela est requis pour des transferts hors EEE, nous nous appuyons sur les{" "}
        <strong>clauses contractuelles types (SCC)</strong> approuvees par la Commission europeenne et/ou
        d&apos;autres garanties appropriees afin d&apos;assurer un niveau eleve de protection des donnees.
      </>
    ),
    rightsTitle: "5. Vos droits RGPD",
    rightsIntro:
      "Au titre du RGPD, vous disposez notamment des droits d&apos;acces, de rectification, d&apos;effacement, de limitation, de portabilite et d&apos;opposition.",
    rightsList: [
      "Droit d&apos;acces",
      "Droit de rectification",
      "Droit a l&apos;effacement",
      "Droit a la limitation du traitement",
      "Droit a la portabilite des donnees",
      "Droit d&apos;opposition",
    ],
    rightsWorkflow:
      "Nous repondons aux demandes RGPD verifiees dans un delai d&apos;un mois (art. 12, par. 3 RGPD). Pour les demandes complexes, ce delai peut etre prolonge de deux mois supplementaires avec information prealable. Afin d&apos;eviter toute divulgation non autorisee, nous pouvons demander des elements de verification (par ex. URL de la note concernee et metadonnees de contexte que vous nous avez fournies).",
    rightsContact: (
      <>
        Pour exercer ces droits, contactez{" "}
        <a href="mailto:support@privatenote.ai" className="text-primary font-medium hover:underline">
          support@privatenote.ai
        </a>
        . Comme nous n&apos;utilisons pas de comptes utilisateur, nous pouvons demander l&apos;URL precise de
        la note (ou toute autre information fournie) pour identifier les donnees liees a votre demande.
      </>
    ),
    securityTitle: "6. Limites de securite",
    securityBody:
      "Nous utilisons une cryptographie moderne (par ex. AES-GCM) et des controles de securite (par ex. en-tetes stricts de Content Security Policy) pour proteger le service. Cependant, aucun systeme n&apos;est securise a 100%. L&apos;IA optionnelle sur l&apos;appareil s&apos;execute dans votre navigateur et peut charger des ressources depuis des reseaux tiers ; les utilisateurs exigeant une confidentialite maximale peuvent utiliser la creation de notes chiffrees cote client sans activer les fonctions IA.",
    complaintText:
      "Vous avez le droit d&apos;introduire une reclamation aupres de l&apos;autorite luxembourgeoise de protection des donnees (CNPD - Commission Nationale pour la Protection des Donnees).",
  },
};

export default function Privacy() {
  const { language } = useLanguage();
  const locale: PrivacyLocale = language === "de" || language === "fr" ? language : "en";
  const copy = PRIVACY_COPY[locale];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 mb-24 relative">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <h1 className="page-title mb-6 pb-2 leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 relative z-10">
          {copy.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed relative z-10">
          {copy.subtitle}
        </p>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
        {/* 1. Data Controller Identification */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {copy.controllerTitle}
              </h2>
              <p className="text-sm">{copy.controllerIntro}</p>
              <div className="mt-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm italic">
                {copy.companyName}
                <br />
                {copy.companyLegalForm}
                <br />
                {copy.companyAddress1}
                <br />
                {copy.companyAddress2}
                <br />
                Email:{" "}
                <a
                  href="mailto:legal@privatenote.ai"
                  className="text-primary font-medium hover:underline not-italic"
                >
                  legal@privatenote.ai
                </a>
              </div>

              <p className="text-xs mt-4 text-gray-500 dark:text-gray-400">
                {copy.under16}
              </p>
            </div>
          </div>
        </section>

        {/* 2. AI Disclosure - Critical */}
        <section className="bg-amber-50/50 dark:bg-amber-900/10 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg shrink-0">
              <Cpu className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-amber-900 dark:text-amber-300">
                {copy.aiTitle}
              </h2>
              <p className="mb-3">{copy.aiIntro}</p>

              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>{copy.aiList1}</li>
                <li>{copy.aiList2}</li>
              </ul>

              <p className="text-sm font-medium italic">
                {copy.aiOutro}
              </p>

              <p className="text-sm mt-4 border-l-2 border-amber-400 pl-4">
                {copy.aiConsent}
              </p>
            </div>
          </div>
        </section>

        {/* 3. Data Collection */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {copy.dataTitle}
              </h2>

              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.encryptedTitle}
                  </h3>
                  <p className="text-sm">{copy.encryptedBody}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.technicalTitle}
                  </h3>
                  <p className="text-sm">{copy.technicalBody}</p>
                  <p className="text-xs italic mt-2 text-gray-600 dark:text-gray-400">
                    {copy.technicalNote}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.analyticsTitle}
                  </h3>
                  <p className="text-sm">{copy.analyticsBody}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.cookieTitle}
                  </h3>
                  <p className="text-sm">{copy.cookieBody}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.supportTitle}
                  </h3>
                  <p className="text-sm">{copy.supportBody}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.legalBasisTitle}
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
                    {copy.legalBasisItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {copy.retentionTitle}
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-sm mt-2">
                    {copy.retentionItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Infrastructure & International Transfers */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {copy.transfersTitle}
              </h2>
              <p className="mb-3 text-sm">{copy.transfersIntro}</p>

              <h3 className="font-semibold text-gray-900 dark:text-white">{copy.processorsTitle}</h3>
              <p className="text-sm mt-1 mb-2">{copy.processorsIntro}</p>
              <ul className="list-disc pl-5 space-y-2 text-sm mb-4">
                {copy.processorsItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>{copy.transfer1}</li>
                <li>{copy.transfer2}</li>
              </ul>

              <p className="mt-3 text-sm italic">
                {copy.transfersSafeguards}
              </p>
            </div>
          </div>
        </section>

        {/* 5. User Rights */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {copy.rightsTitle}
              </h2>
              <p className="mb-3 text-sm">{copy.rightsIntro}</p>

              <div className="grid md:grid-cols-2 gap-2 text-xs uppercase tracking-wider font-semibold">
                {copy.rightsList.map((item) => (
                  <div key={item} className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                    {item}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm">{copy.rightsWorkflow}</p>
              <p className="mt-4 text-sm">{copy.rightsContact}</p>
            </div>
          </div>
        </section>

        {/* 6. Security trade-offs */}
        <section className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {copy.securityTitle}
          </h2>
          <p className="text-sm leading-relaxed">{copy.securityBody}</p>
        </section>

        {/* Contact */}
        <div className="text-center pt-10 mt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {copy.complaintText}
          </p>
          <a
            href="mailto:support@privatenote.ai"
            className="text-primary font-medium hover:underline transition-colors"
          >
            support@privatenote.ai
          </a>
        </div>
      </div>
    </div>
  );
}
