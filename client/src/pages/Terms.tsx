import React from "react";
import {
  AlertTriangle,
  CreditCard,
  Shield,
  Scale,
  UserX,
  Lock,
  Gavel,
  Globe,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type TermsLocale = "en" | "de" | "fr";

type TermsCopy = {
  title: string;
  lastUpdated: string;
  sections: {
    ageTitle: string;
    ageBody: React.ReactNode;
    serviceTitle: string;
    serviceBody: React.ReactNode;
    warningLabel: string;
    warningBody: string;
    gdprTitle: string;
    gdprBody: React.ReactNode;
    prohibitedTitle: string;
    prohibitedIntro: React.ReactNode;
    prohibitedList: string[];
    prohibitedOutro: string;
    withdrawalTitle: string;
    withdrawalBody: string;
    withdrawalSubscriptionBody: string;
    billingTitle: string;
    billingIntro: React.ReactNode;
    billingList: string[];
    billingTaxNote: string;
    availabilityTitle: string;
    availabilityBody1: React.ReactNode;
    availabilityBody2: string;
    aiTitle: string;
    aiBody1: string;
    aiBody2: string;
    liabilityTitle: string;
    liabilityBody1: string;
    liabilityBody2: string;
    governingTitle: string;
    governingBody: React.ReactNode;
    odrTitle: string;
    odrBody: string;
    odrUrl: string;
    companyName: string;
    companyAddress: string;
  };
};

const TERMS_COPY: Record<TermsLocale, TermsCopy> = {
  en: {
    title: "Terms of Use",
    lastUpdated: "Last updated: August 13, 2026 • Luxembourg, EU",
    sections: {
      ageTitle: "0. Age Requirement",
      ageBody: (
        <>
          This service is intended for users who are at least <strong>16 years old</strong>. By using
          PrivateNote.ai, you confirm that you meet the minimum age requirement under applicable EU data
          protection laws.
        </>
      ),
      serviceTitle: "1. Service Description & Encryption",
      serviceBody: (
        <>
          PrivateNote.ai provides a tool for end-to-end encrypted, temporary data sharing.{" "}
          <strong>Client-side encrypted:</strong> Encryption occurs locally in your browser. We never
          receive your unencrypted data or your decryption keys.
        </>
      ),
      warningLabel: "Warning:",
      warningBody:
        "If you lose the link or the password, the data is mathematically irrecoverable. Under no circumstances can we restore access to an encrypted note.",
      gdprTitle: "2. Data Protection (GDPR)",
      gdprBody: (
        <>
          In accordance with the <strong>EU General Data Protection Regulation (GDPR)</strong>, we
          minimize data collection. While note content is encrypted and anonymous to us, technical metadata
          (e.g., IP addresses) may be processed for security and rate-limiting purposes.
        </>
      ),
      prohibitedTitle: "3. Prohibited Content & DSA",
      prohibitedIntro: (
        <>
          Pursuant to the <strong>EU Digital Services Act (DSA)</strong>, you are prohibited from using
          this service to share illegal content, including but not limited to:
        </>
      ),
      prohibitedList: [
        "Child Sexual Abuse Material (CSAM)",
        "Terrorist content or propaganda",
        "Hate speech or illegal defamation",
        "Unauthorized sharing of private data",
      ],
      prohibitedOutro:
        "We act as a neutral technical intermediary (“mere conduit”) within the meaning of applicable EU law. While we cannot monitor encrypted content, we will comply with valid legal orders from EU authorities to block access to specific resources.",
      withdrawalTitle: "4. Right of Withdrawal (EU Consumers)",
      withdrawalBody:
        "By using our Service to create a Note, you expressly request the immediate performance of the service. You acknowledge that you lose your right of withdrawal once the digital content has been fully rendered or the Note has been created and shared.",
      withdrawalSubscriptionBody:
        "Paid subscriptions: if you are a consumer in the EU or EEA, you have 14 days from the start of a paid subscription to withdraw from it. Because you ask us at checkout to start the service immediately, if you withdraw within those 14 days we refund what you paid less an amount in proportion to the service already supplied up to the moment you tell us. Write to support@privatenote.ai to withdraw. This right is separate from the ordinary cancellation described in section 5, which stops the next renewal without a refund.",
      billingTitle: "5. Paid Plans, Billing & Cancellation",
      billingIntro: (
        <>
          PrivateNote.ai is free to use. <strong>Starter</strong> and <strong>Business</strong> are
          optional paid plans that add delivery controls, higher limits and — on Business — branding
          on the reveal page. Payments are handled by <strong>Stripe</strong>; we never see or store
          your card details.
        </>
      ),
      billingList: [
        "Billing in advance: paid plans are charged when you subscribe and then at the start of each renewal period, monthly or annually as you choose. Prices are shown in USD or EUR based on your region, and the exact total appears at Stripe Checkout before you pay.",
        "Automatic renewal: your subscription renews automatically at the price then in force until you cancel it.",
        "Cancelling: cancel at any time from Account → Manage billing. Cancellation takes effect at the end of the period you have already paid for. You keep your paid features until then, and that period is not refunded.",
        "Upgrading: an upgrade starts immediately. Stripe charges the difference for the rest of the current period and credits the unused part of your previous plan. Your renewal date does not change.",
        "Downgrading: a downgrade takes effect at the end of the current period, so you keep the higher plan until then.",
        "Failed payments: if a renewal payment fails we email you and keep your paid features for a grace period of at least three days while the payment is retried. If it still fails, the account returns to Free. Notes you already created keep the conditions under which they were created.",
        "Deleting your account: deleting your account also cancels your subscription. Time left in the period you have paid for is not refunded.",
        "Price changes: we may change prices. Any change applies from your next renewal, and we will tell you by email before it takes effect.",
      ],
      billingTaxNote:
        "Taxes: the total shown at Stripe Checkout is the amount charged. We do not currently add VAT, because Pupin Labs applies the Luxembourg exemption for small enterprises under Article 57bis of the amended law of 12 February 1979, and your invoice states this. If tax becomes chargeable in future, prices shown to consumers will include it.",
      availabilityTitle: "6. Service Availability",
      availabilityBody1: (
        <>
          We strive to keep PrivateNote.ai available at all times, but the service is provided on an{" "}
          <strong>“as is”</strong> and <strong>“as available”</strong> basis.
        </>
      ),
      availabilityBody2:
        "We reserve the right to modify, suspend, or discontinue parts of the service at any time for security, legal, or operational reasons.",
      aiTitle: "7. AI Features",
      aiBody1:
        "Optional AI-powered features are provided for convenience only. Any output generated by AI does not constitute legal, medical, or professional advice.",
      aiBody2:
        "You remain solely responsible for the content you submit to AI features and for how you use any generated output.",
      liabilityTitle: "8. Liability Limits",
      liabilityBody1:
        "Under Luxembourg law, we are liable for damages resulting from gross negligence or willful misconduct.",
      liabilityBody2:
        "However, to the extent permitted by law, PrivateNote.ai is not liable for any indirect losses, loss of data caused by user error, or unauthorized access to your devices. We do not guarantee 100% uptime.",
      governingTitle: "9. Governing Law & Jurisdiction",
      governingBody: (
        <>
          These terms are governed by the laws of the <strong>Grand Duchy of Luxembourg</strong>. Any
          disputes shall be subject to the exclusive jurisdiction of the competent courts in Luxembourg
          City.
        </>
      ),
      odrTitle: "Online Dispute Resolution (ODR)",
      odrBody:
        "The Online Dispute Resolution (ODR) platform is now closed. For consumer assistance, please visit:",
      odrUrl: "https://consumer-redress.ec.europa.eu/index_en",
      companyName: "Pupin Labs",
      companyAddress: "62 Rue Marie-Adelaide, 2128, Luxembourg, Luxembourg",
    },
  },
  de: {
    title: "Nutzungsbedingungen",
    lastUpdated: "Zuletzt aktualisiert: 13. August 2026 • Luxemburg, EU",
    sections: {
      ageTitle: "0. Altersanforderung",
      ageBody: (
        <>
          Dieser Dienst ist für Nutzerinnen und Nutzer bestimmt, die mindestens{" "}
          <strong>16 Jahre alt</strong> sind. Mit der Nutzung von PrivateNote.ai bestätigen Sie, dass Sie
          die nach den geltenden EU-Datenschutzgesetzen erforderliche Altersgrenze erfüllen.
        </>
      ),
      serviceTitle: "1. Dienstbeschreibung und Verschlüsselung",
      serviceBody: (
        <>
          PrivateNote.ai bietet ein Werkzeug für Ende-zu-Ende-verschlüsseltes, temporäres Teilen von
          Daten. <strong>Clientseitig verschlüsselt:</strong> Die Verschlüsselung erfolgt lokal in Ihrem
          Browser. Wir erhalten weder Ihre unverschlüsselten Daten noch Ihre Entschlüsselungsschlüssel.
        </>
      ),
      warningLabel: "Warnung:",
      warningBody:
        "Wenn Sie den Link oder das Passwort verlieren, sind die Daten mathematisch nicht wiederherstellbar. Unter keinen Umständen können wir den Zugriff auf eine verschlüsselte Notiz wiederherstellen.",
      gdprTitle: "2. Datenschutz (DSGVO)",
      gdprBody: (
        <>
          Gemäß der <strong>EU-Datenschutz-Grundverordnung (DSGVO)</strong> minimieren wir die
          Datenerhebung. Während Notizinhalte für uns verschlüsselt und anonym sind, können technische
          Metadaten (z. B. IP-Adressen) zu Sicherheits- und Rate-Limiting-Zwecken verarbeitet werden.
        </>
      ),
      prohibitedTitle: "3. Verbotene Inhalte und DSA",
      prohibitedIntro: (
        <>
          Gemäß dem <strong>EU Digital Services Act (DSA)</strong> ist es untersagt, diesen Dienst zur
          Verbreitung rechtswidriger Inhalte zu nutzen, einschließlich, aber nicht beschränkt auf:
        </>
      ),
      prohibitedList: [
        "Darstellungen sexualisierter Gewalt gegen Kinder (CSAM)",
        "Terroristische Inhalte oder Propaganda",
        "Hassrede oder rechtswidrige Verleumdung",
        "Unbefugte Weitergabe privater Daten",
      ],
      prohibitedOutro:
        "Wir handeln als neutraler technischer Vermittler („mere conduit“) im Sinne des geltenden EU-Rechts. Auch wenn wir verschlüsselte Inhalte nicht überwachen können, werden wir rechtmäßigen Anordnungen von EU-Behörden zur Sperrung bestimmter Ressourcen nachkommen.",
      withdrawalTitle: "4. Widerrufsrecht (EU-Verbraucher)",
      withdrawalBody:
        "Durch die Nutzung unseres Dienstes zur Erstellung einer Notiz verlangen Sie ausdrücklich die sofortige Ausführung der Dienstleistung. Sie erkennen an, dass Ihr Widerrufsrecht erlischt, sobald der digitale Inhalt vollständig bereitgestellt oder die Notiz erstellt und geteilt wurde.",
      withdrawalSubscriptionBody:
        "Bezahlte Abonnements: Als Verbraucher in der EU oder im EWR haben Sie ab Beginn eines bezahlten Abonnements 14 Tage Zeit, dieses zu widerrufen. Da Sie uns beim Bezahlvorgang ausdrücklich auffordern, den Dienst sofort bereitzustellen, erstatten wir bei einem Widerruf innerhalb dieser 14 Tage den gezahlten Betrag abzüglich eines Anteils, der dem bis zu Ihrer Mitteilung bereits erbrachten Leistungsumfang entspricht. Für den Widerruf schreiben Sie an support@privatenote.ai. Dieses Recht besteht unabhängig von der ordentlichen Kündigung nach Abschnitt 5, die lediglich die nächste Verlängerung beendet.",
      billingTitle: "5. Bezahlte Tarife, Abrechnung und Kündigung",
      billingIntro: (
        <>
          PrivateNote.ai ist kostenlos nutzbar. <strong>Starter</strong> und{" "}
          <strong>Business</strong> sind optionale bezahlte Tarife mit zusätzlichen Zustellkontrollen,
          höheren Limits und – bei Business – Branding auf der Abrufseite. Die Zahlungen werden von{" "}
          <strong>Stripe</strong> abgewickelt; wir sehen und speichern Ihre Kartendaten nicht.
        </>
      ),
      billingList: [
        "Abrechnung im Voraus: Bezahlte Tarife werden beim Abschluss und danach zu Beginn jedes Verlängerungszeitraums abgerechnet – monatlich oder jährlich, je nach Ihrer Wahl. Die Preise werden je nach Region in USD oder EUR angezeigt; der genaue Gesamtbetrag erscheint vor der Zahlung im Stripe-Checkout.",
        "Automatische Verlängerung: Ihr Abonnement verlängert sich automatisch zum jeweils geltenden Preis, bis Sie es kündigen.",
        "Kündigung: Sie können jederzeit unter Konto → Abrechnung verwalten kündigen. Die Kündigung wirkt zum Ende des bereits bezahlten Zeitraums. Bis dahin behalten Sie Ihre bezahlten Funktionen; dieser Zeitraum wird nicht zurückerstattet.",
        "Upgrade: Ein Upgrade gilt sofort. Stripe berechnet die Differenz für den Rest des laufenden Zeitraums und rechnet den nicht genutzten Teil Ihres bisherigen Tarifs an. Ihr Verlängerungsdatum bleibt unverändert.",
        "Downgrade: Ein Downgrade wirkt zum Ende des laufenden Zeitraums; bis dahin behalten Sie den höheren Tarif.",
        "Fehlgeschlagene Zahlungen: Scheitert eine Verlängerungszahlung, informieren wir Sie per E-Mail und erhalten Ihre bezahlten Funktionen für eine Kulanzfrist von mindestens drei Tagen, während die Zahlung erneut versucht wird. Bleibt sie erfolglos, wechselt das Konto zurück auf Free. Bereits erstellte Notizen behalten die Bedingungen, unter denen sie erstellt wurden.",
        "Löschung des Kontos: Mit der Löschung Ihres Kontos wird auch Ihr Abonnement gekündigt. Die verbleibende Zeit des bezahlten Zeitraums wird nicht zurückerstattet.",
        "Preisänderungen: Wir können Preise ändern. Änderungen gelten ab Ihrer nächsten Verlängerung; wir informieren Sie vorher per E-Mail.",
      ],
      billingTaxNote:
        "Steuern: Der im Stripe-Checkout angezeigte Gesamtbetrag ist der berechnete Betrag. Wir erheben derzeit keine Mehrwertsteuer, da Pupin Labs die luxemburgische Kleinunternehmerregelung nach Artikel 57bis des geänderten Gesetzes vom 12. Februar 1979 anwendet; Ihre Rechnung weist dies aus. Sollte künftig Steuer anfallen, werden die für Verbraucher angezeigten Preise diese enthalten.",
      availabilityTitle: "6. Verfügbarkeit des Dienstes",
      availabilityBody1: (
        <>
          Wir bemühen uns, PrivateNote.ai jederzeit verfügbar zu halten, der Dienst wird jedoch{" "}
          <strong>„wie besehen“</strong> und <strong>„wie verfügbar“</strong> bereitgestellt.
        </>
      ),
      availabilityBody2:
        "Wir behalten uns das Recht vor, Teile des Dienstes aus Sicherheits-, rechtlichen oder betrieblichen Gründen jederzeit zu ändern, auszusetzen oder einzustellen.",
      aiTitle: "7. KI-Funktionen",
      aiBody1:
        "Optionale KI-gestützte Funktionen werden ausschließlich zur Vereinfachung bereitgestellt. Von KI erzeugte Inhalte stellen keine rechtliche, medizinische oder sonstige professionelle Beratung dar.",
      aiBody2:
        "Sie bleiben allein verantwortlich für Inhalte, die Sie in KI-Funktionen eingeben, sowie für die Nutzung der erzeugten Ergebnisse.",
      liabilityTitle: "8. Haftungsbeschränkung",
      liabilityBody1:
        "Nach luxemburgischem Recht haften wir für Schäden, die durch grobe Fahrlässigkeit oder vorsätzliches Fehlverhalten verursacht werden.",
      liabilityBody2:
        "Soweit gesetzlich zulässig, haftet PrivateNote.ai jedoch nicht für mittelbare Schäden, Datenverluste durch Benutzerfehler oder unbefugten Zugriff auf Ihre Geräte. Eine 100%ige Verfügbarkeit wird nicht garantiert.",
      governingTitle: "9. Anwendbares Recht und Gerichtsstand",
      governingBody: (
        <>
          Diese Bedingungen unterliegen dem Recht des <strong>Großherzogtums Luxemburg</strong>. Für
          Streitigkeiten sind ausschließlich die zuständigen Gerichte in Luxemburg-Stadt zuständig.
        </>
      ),
      odrTitle: "Online-Streitbeilegung (ODR)",
      odrBody:
        "Die Plattform zur Online-Streitbeilegung (ODR) ist geschlossen. Für Unterstützung für Verbraucher besuchen Sie bitte:",
      odrUrl: "https://consumer-redress.ec.europa.eu/index_de",
      companyName: "Pupin Labs",
      companyAddress: "62 Rue Marie-Adelaide, 2128, Luxemburg, Luxemburg",
    },
  },
  fr: {
    title: "Conditions d’utilisation",
    lastUpdated: "Dernière mise à jour : 13 août 2026 • Luxembourg, UE",
    sections: {
      ageTitle: "0. Condition d’âge",
      ageBody: (
        <>
          Ce service est destiné aux utilisateurs âgés d’au moins <strong>16 ans</strong>. En utilisant
          PrivateNote.ai, vous confirmez respecter l’âge minimum prévu par les lois européennes
          applicables en matière de protection des données.
        </>
      ),
      serviceTitle: "1. Description du service et chiffrement",
      serviceBody: (
        <>
          PrivateNote.ai fournit un outil de partage temporaire de données chiffrées de bout en bout.{" "}
          <strong>Chiffrement côté client :</strong> le chiffrement se fait localement dans votre
          navigateur. Nous ne recevons jamais vos données non chiffrées ni vos clés de déchiffrement.
        </>
      ),
      warningLabel: "Avertissement :",
      warningBody:
        "Si vous perdez le lien ou le mot de passe, les données sont mathématiquement irrécupérables. En aucun cas nous ne pouvons restaurer l’accès à une note chiffrée.",
      gdprTitle: "2. Protection des données (RGPD)",
      gdprBody: (
        <>
          Conformément au <strong>Règlement général sur la protection des données (RGPD)</strong> de
          l’UE, nous minimisons la collecte de données. Bien que le contenu des notes soit chiffré et
          anonyme pour nous, des métadonnées techniques (par ex. adresses IP) peuvent être traitées à des
          fins de sécurité et de limitation de débit.
        </>
      ),
      prohibitedTitle: "3. Contenus interdits et DSA",
      prohibitedIntro: (
        <>
          Conformément au <strong>Digital Services Act (DSA)</strong> de l’UE, il vous est interdit
          d’utiliser ce service pour partager des contenus illégaux, notamment :
        </>
      ),
      prohibitedList: [
        "Contenus d’abus sexuels sur mineurs (CSAM)",
        "Contenus ou propagande terroristes",
        "Discours de haine ou diffamation illégale",
        "Partage non autorisé de données privées",
      ],
      prohibitedOutro:
        "Nous agissons en tant qu’intermédiaire technique neutre (« mere conduit ») au sens du droit de l’UE applicable. Même si nous ne pouvons pas surveiller les contenus chiffrés, nous respecterons les injonctions légales valides des autorités de l’UE pour bloquer l’accès à des ressources spécifiques.",
      withdrawalTitle: "4. Droit de rétractation (consommateurs UE)",
      withdrawalBody:
        "En utilisant notre service pour créer une note, vous demandez expressément l’exécution immédiate du service. Vous reconnaissez perdre votre droit de rétractation une fois que le contenu numérique est pleinement fourni ou que la note a été créée et partagée.",
      withdrawalSubscriptionBody:
        "Abonnements payants : en tant que consommateur dans l’UE ou l’EEE, vous disposez de 14 jours à compter du début d’un abonnement payant pour vous rétracter. Comme vous nous demandez expressément, lors du paiement, de commencer immédiatement la prestation, si vous vous rétractez dans ce délai nous remboursons le montant payé, déduction faite d’une somme proportionnelle au service déjà fourni jusqu’à votre notification. Pour vous rétracter, écrivez à support@privatenote.ai. Ce droit est distinct de la résiliation ordinaire décrite à la section 5, qui met seulement fin au renouvellement suivant.",
      billingTitle: "5. Offres payantes, facturation et résiliation",
      billingIntro: (
        <>
          PrivateNote.ai est gratuit. <strong>Starter</strong> et <strong>Business</strong> sont des
          offres payantes facultatives qui ajoutent des contrôles de remise, des limites plus élevées
          et, pour Business, une identité visuelle sur la page de révélation. Les paiements sont
          traités par <strong>Stripe</strong> ; nous ne voyons ni ne conservons vos données de carte.
        </>
      ),
      billingList: [
        "Facturation d’avance : les offres payantes sont facturées à la souscription puis au début de chaque période de renouvellement, mensuelle ou annuelle selon votre choix. Les prix sont affichés en USD ou en EUR selon votre région, et le total exact apparaît dans Stripe Checkout avant le paiement.",
        "Renouvellement automatique : votre abonnement se renouvelle automatiquement au prix alors en vigueur jusqu’à ce que vous le résiliiez.",
        "Résiliation : vous pouvez résilier à tout moment depuis Compte → Gérer la facturation. La résiliation prend effet à la fin de la période déjà payée. Vous conservez vos fonctionnalités payantes jusque-là ; cette période n’est pas remboursée.",
        "Passage à une offre supérieure : le changement est immédiat. Stripe facture la différence pour le reste de la période en cours et crédite la part non utilisée de votre offre précédente. Votre date de renouvellement ne change pas.",
        "Passage à une offre inférieure : le changement prend effet à la fin de la période en cours ; vous conservez l’offre supérieure jusque-là.",
        "Échec de paiement : si un paiement de renouvellement échoue, nous vous prévenons par e-mail et maintenons vos fonctionnalités payantes pendant un délai de grâce d’au moins trois jours, le temps que le paiement soit retenté. En cas d’échec persistant, le compte revient à l’offre gratuite. Les notes déjà créées conservent les conditions dans lesquelles elles ont été créées.",
        "Suppression du compte : la suppression de votre compte résilie également votre abonnement. Le temps restant de la période payée n’est pas remboursé.",
        "Changements de prix : nous pouvons modifier les prix. Toute modification s’applique à compter de votre prochain renouvellement et vous en serez informé par e-mail au préalable.",
      ],
      billingTaxNote:
        "Taxes : le total affiché dans Stripe Checkout correspond au montant facturé. Nous n’ajoutons pas de TVA à ce jour, Pupin Labs appliquant le régime luxembourgeois d’exonération des petites entreprises prévu à l’article 57bis de la loi modifiée du 12 février 1979 ; votre facture le mentionne. Si une taxe devient exigible, les prix affichés aux consommateurs l’incluront.",
      availabilityTitle: "6. Disponibilité du service",
      availabilityBody1: (
        <>
          Nous nous efforçons de maintenir PrivateNote.ai disponible en permanence, mais le service est
          fourni <strong>« en l’état »</strong> et <strong>« selon disponibilité »</strong>.
        </>
      ),
      availabilityBody2:
        "Nous nous réservons le droit de modifier, suspendre ou interrompre certaines parties du service à tout moment pour des raisons de sécurité, juridiques ou opérationnelles.",
      aiTitle: "7. Fonctionnalités IA",
      aiBody1:
        "Les fonctionnalités optionnelles basées sur l’IA sont fournies à titre de commodité uniquement. Les résultats générés par l’IA ne constituent pas un conseil juridique, médical ou professionnel.",
      aiBody2:
        "Vous restez seul responsable du contenu soumis aux fonctionnalités IA et de l’usage que vous faites des résultats générés.",
      liabilityTitle: "8. Limitation de responsabilité",
      liabilityBody1:
        "Selon le droit luxembourgeois, nous sommes responsables des dommages résultant d’une faute lourde ou d’une faute intentionnelle.",
      liabilityBody2:
        "Toutefois, dans la mesure permise par la loi, PrivateNote.ai n’est pas responsable des pertes indirectes, des pertes de données dues à une erreur de l’utilisateur ou d’un accès non autorisé à vos appareils. Nous ne garantissons pas une disponibilité de 100%.",
      governingTitle: "9. Droit applicable et juridiction",
      governingBody: (
        <>
          Les présentes conditions sont régies par le droit du{" "}
          <strong>Grand-Duché de Luxembourg</strong>. Tout litige relève de la compétence exclusive des
          juridictions compétentes de la ville de Luxembourg.
        </>
      ),
      odrTitle: "Règlement en ligne des litiges (ODR)",
      odrBody:
        "La plateforme européenne de règlement en ligne des litiges (ODR) est désormais fermée. Pour l’assistance aux consommateurs, veuillez consulter :",
      odrUrl: "https://consumer-redress.ec.europa.eu/index_fr",
      companyName: "Pupin Labs",
      companyAddress: "62 Rue Marie-Adelaide, 2128, Luxembourg, Luxembourg",
    },
  },
};

export default function Terms() {
  const { language } = useLanguage();
  const locale: TermsLocale = language === "de" || language === "fr" ? language : "en";
  const copy = TERMS_COPY[locale];

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
          {copy.lastUpdated}
        </p>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
        {/* 0. Age Requirement */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <UserX className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.ageTitle}
              </h2>
              <p>{copy.sections.ageBody}</p>
            </div>
          </div>
        </section>

        {/* 1. Client-side Encryption & Security */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.serviceTitle}
              </h2>
              <p className="mb-3">{copy.sections.serviceBody}</p>
              <p className="text-sm border-l-2 border-amber-500 pl-4 bg-amber-50/50 dark:bg-amber-900/10 py-2 rounded-r-md">
                <strong>{copy.sections.warningLabel}</strong> {copy.sections.warningBody}
              </p>
            </div>
          </div>
        </section>

        {/* 2. GDPR & Data Protection */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg shrink-0">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.gdprTitle}
              </h2>
              <p>{copy.sections.gdprBody}</p>
            </div>
          </div>
        </section>

        {/* 3. Acceptable Use & DSA */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg shrink-0">
              <UserX className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.prohibitedTitle}
              </h2>
              <p className="mb-4">{copy.sections.prohibitedIntro}</p>
              <ul className="grid md:grid-cols-2 gap-2 pl-2 mb-4">
                {copy.sections.prohibitedList.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm italic">{copy.sections.prohibitedOutro}</p>
            </div>
          </div>
        </section>

        {/* 4. Right of Withdrawal */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.withdrawalTitle}
              </h2>
              <p className="mb-3">{copy.sections.withdrawalBody}</p>
              <p>{copy.sections.withdrawalSubscriptionBody}</p>
            </div>
          </div>
        </section>

        {/* 5. Paid Plans, Billing & Cancellation */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.billingTitle}
              </h2>
              <p className="mb-4">{copy.sections.billingIntro}</p>
              <ul className="space-y-2 mb-4">
                {copy.sections.billingList.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm italic">{copy.sections.billingTaxNote}</p>
            </div>
          </div>
        </section>

        {/* 6. Service Availability */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.availabilityTitle}
              </h2>
              <p className="mb-3">{copy.sections.availabilityBody1}</p>
              <p>{copy.sections.availabilityBody2}</p>
            </div>
          </div>
        </section>

        {/* 7. AI Features */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg shrink-0">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.aiTitle}
              </h2>
              <p className="mb-3">{copy.sections.aiBody1}</p>
              <p className="text-sm">{copy.sections.aiBody2}</p>
            </div>
          </div>
        </section>

        {/* 8. Limitation of Liability */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.liabilityTitle}
              </h2>
              <p className="mb-3">{copy.sections.liabilityBody1}</p>
              <p className="text-sm">{copy.sections.liabilityBody2}</p>
            </div>
          </div>
        </section>

        {/* 9. Governing Law & Dispute Resolution */}
        <section className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Scale className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {copy.sections.governingTitle}
              </h2>
              <p className="mb-4">{copy.sections.governingBody}</p>

              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-sm font-bold mb-2 uppercase flex items-center gap-2">
                  {copy.sections.odrTitle}
                </h3>
                <p className="text-sm mb-3">
                  {copy.sections.odrBody}
                </p>
                <a
                  href={copy.sections.odrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium flex items-center hover:underline"
                >
                  {copy.sections.odrUrl}{" "}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Footer */}
        <div className="text-center pt-10 mt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
            {copy.sections.companyName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {copy.sections.companyAddress}
          </p>
          <a
            href="mailto:legal@privatenote.ai"
            className="inline-flex items-center text-primary font-medium hover:underline transition-colors"
          >
            <Gavel className="h-4 w-4 mr-2" />
            legal@privatenote.ai
          </a>
        </div>
      </div>
    </div>
  );
}
