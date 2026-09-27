import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNoteFr: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Ordinateur portable sur un bureau affichant l'écran de création d'une note privée avec destruction après lecture et expiration, à côté d'un carnet en cuir verrouillé",
  intro: [
    "Vous voulez écrire quelque chose de sensible—un [mot de passe](app:password-generator), un code de récupération, un message confidentiel ou une note personnelle—et le garder privé. Peut-être avez-vous cherché « how to make a note private » et trouvé des conseils génériques sur le verrouillage d'une app, le masquage d'un dossier local ou l'activation d'un réglage de confidentialité sur l'appareil.",
    "Ces étapes aident pour la confidentialité occasionnelle, face aux regards indiscrets. Elles **ne** résolvent pas le problème plus difficile : partager une note avec une autre personne sans laisser une copie permanente et consultable sur le serveur d'un tiers.",
    "Une note vraiment privée exige trois piliers distincts : **chiffrement avant l'envoi**, **contrôle d'accès strict** et **éphémérité planifiée**—un mécanisme de disparition. Voici comment y parvenir en pratique.",
  ],
  sections: [
    {
      title: "Ce que « privé » signifie réellement",
      paragraphs: [
        "Dans les applications courantes, « privé » signifie généralement caché des autres personnes physiques qui prennent votre appareil, protégé par le code du téléphone ou verrouillé derrière un abonnement premium. C'est très utile—mais ce n'est pas la même chose que la confidentialité cryptographique.",
        "Lorsque vous partagez des informations sensibles sur le web, la vraie question est : **qui peut lire la note après qu'elle a quitté vos mains ?**",
        "Le fournisseur de service peut-il la lire ? Une personne non autorisée ayant accès à une sauvegarde cloud peut-elle la lire ? Un futur collègue peut-il fouiller d'anciens historiques de chat et la retrouver des mois plus tard ?",
        "Une note privée, au sens strict de la sécurité, est une note que seul le destinataire prévu peut lire, dont le service d'hébergement ne voit jamais le texte en clair sous-jacent et qui ne reste pas en ligne indéfiniment.",
      ],
    },
    {
      title: "Pourquoi les apps de notes classiques ne suffisent pas",
      paragraphs: [
        "Apple Notes, Google Keep, Notion et Evernote sont d'excellents outils d'organisation personnelle, mais ils sont généralement le mauvais choix pour distribuer des secrets à usage unique en raison de plusieurs traits inhérents :",
      ],
      bullets: [
        "**Synchronisation et sauvegardes** — Votre note est silencieusement copiée sur plusieurs appareils, comptes de stockage cloud et archives historiques à long terme que vous ne contrôlez pas directement.",
        "**Recherche et partage** — Un partage public accidentel, des recherches larges dans l'espace de travail ou un seul compte compromis peuvent exposer d'anciennes notes des mois après les faits.",
        "**Accès du fournisseur** — À moins que l'app n'offre explicitement un chiffrement de bout en bout pour cette note précise, le fournisseur conserve la capacité technique de lire votre contenu sur ses serveurs.",
        "**Pas de destruction après lecture** — La plupart des apps d'organisation sont structurellement conçues pour stocker les informations indéfiniment, pas pour les purger après une seule lecture.",
      ],
      callout:
        "Pour un journal personnel à long terme, les apps de notes standard sont idéales. Pour les mots de passe, codes de récupération et transmissions confidentielles, il vous faut un outil éphémère conçu pour la [livraison de secrets à usage unique](blog:one-time-secret-links)—pas pour le stockage permanent.",
    },
    {
      title: "Comment créer une note privée : étape par étape",
      paragraphs: [
        "Vous n'avez pas besoin de créer un compte pour envoyer une note privée sécurisée à usage unique. Le flux structuré ci-dessous décrit ce que les services chiffrés dans le navigateur sont conçus pour exécuter en toute sécurité.",
      ],
      flowDiagramCaption: "Flux de travail d'une note privée en un coup d'œil",
      flowSteps: [
        {
          step: "Étape 1",
          title: "Rédigez le message dans votre navigateur",
          body: "Ouvrez [PrivateNote](app:home) et saisissez votre message directement. Déjà dans un autre onglet ? L'[extension Chrome](chrome:extension) chiffre le texte sélectionné sur place—le même flux côté client, sans ouvrir le site d'abord. Évitez de coller le secret brut dans des clients e-mail standard ou des fils de texte non chiffrés au préalable. Vous pouvez aussi utiliser [Write with Private AI](app:home) pour rédiger localement sur votre appareil avant le chiffrement.",
        },
        {
          step: "Étape 2",
          title: "Configurez vos paramètres de confidentialité éphémère",
          body: "Définissez une fenêtre d'expiration adaptée à la tâche. Activez la destruction après lecture si la note doit disparaître complètement après la première ouverture réussie, et ajoutez une phrase secrète optionnelle pour les contenus très sensibles.",
        },
        {
          step: "Étape 3",
          title: "Laissez le navigateur exécuter le chiffrement local",
          body: "Lorsque vous cliquez sur créer, le chiffrement s'effectue entièrement côté client. Seul le texte chiffré est envoyé. La clé de déchiffrement reste intégrée dans le fragment d'URL—la partie après `#`—que les navigateurs web modernes ne transmettent pas aux serveurs d'hébergement.",
        },
        {
          step: "Étape 4",
          title: "Isolez vos canaux de partage",
          body: "Transmettez le lien sécurisé généré à votre destinataire via votre canal préféré. Si vous avez configuré un mot de passe manuel, partagez-le hors bande—par appel téléphonique, Signal ou en personne de façon sécurisée.",
        },
        {
          step: "Étape 5",
          title: "Confirmez la livraison et effacez l'état local",
          body: "Utilisez les notifications de livraison optionnelles pour vérifier quand la note a été ouverte ou a expiré avec succès. Une fois consommée, aucune copie en clair ne subsiste dans votre boîte d'envoi ou vos historiques de chat.",
        },
      ],
    },
    {
      title: "Paramètres de confidentialité à activer",
      paragraphs: [
        "De petits ajustements architecturaux produisent d'énormes gains de sécurité. Lors de la création d'une note éphémère, maximisez vos défenses en utilisant ces configurations :",
      ],
      bullets: [
        "**Destruction après lecture** — La référence pour les mots de passe et identifiants. Le texte chiffré sous-jacent est effacé du serveur dès qu'il a été lu une fois avec succès.",
        "**Fenêtres d'expiration courtes** — Si votre destinataire n'a pas besoin d'ouvrir les données instantanément, limitez la fenêtre d'exposition à des heures ou des jours—jamais sans limite.",
        "**Mots de passe en couches** — Ajoute un second facteur crucial. Un attaquant devrait compromettre à la fois le canal de transport du lien et obtenir le mot de passe séparé pour lire le contenu.",
      ],
    },
    {
      title: "Ce qu'il ne faut pas mettre dans une note privée web",
      paragraphs: [
        "Les liens chiffrés dans le navigateur sont excellents pour les secrets temporaires ou remplaçables—comme les identifiants Wi‑Fi, les jetons API et les messages d'entreprise. Ils ont des limites.",
      ],
      callout:
        "**Règle de sécurité critique :** Ne saisissez jamais une phrase de récupération de cryptomonnaie, une sauvegarde maîtresse de portefeuille matériel ni une clé privée racine sur un site web. Les actifs maîtres irremplaçables justifient un chiffrement local en terminal avec age ou OpenSSL avant transmission. Pour cette architecture, lisez [phrases de récupération crypto et liens à usage unique](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Quand une note privée est le bon outil",
      paragraphs: [
        "Optez pour une note privée dédiée plutôt que pour l'e-mail ou le chat standard lorsque vous transmettez des informations sensibles :",
      ],
      table: [
        {
          dataType: "Identifiants",
          scenario:
            "Transmettre un [mot de passe ou code de récupération](blog:how-we-generate-passwords) à un membre de la famille ou un collègue de confiance.",
        },
        {
          dataType: "Clés d'accès",
          scenario:
            "Distribuer une [clé API ou un secret de signature de webhook](blog:how-to-share-api-key-securely) lors de l'intégration d'un développeur.",
        },
        {
          dataType: "Accès physique",
          scenario:
            "Partager des codes de porte temporaires, des codes PIN d'alarme ou des identifiants Wi‑Fi invités.",
        },
        {
          dataType: "Communications d'entreprise",
          scenario:
            "Envoyer un message professionnel confidentiel qui ne doit pas être indexé par les [archives de chat ou d'e-mail d'entreprise](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Notre philosophie chez PrivateNote",
      paragraphs: [
        "Nous avons conçu PrivateNote pour rééquilibrer la confiance en faveur de l'utilisateur. En effectuant les opérations cryptographiques entièrement dans votre navigateur avant que la charge n'atteigne notre infrastructure, nos serveurs restent structurellement aveugles à vos secrets en clair.",
        "Nous croyons aussi en une transparence claire sur les limites du produit. Si vous envoyez un jeton d'accès temporaire à un pair, un lien chiffré à usage unique est un excellent outil. Si vous traitez avec vos économies de toute une vie, chiffrez d'abord localement sur une machine hors ligne.",
        "La sécurité ne consiste pas à trouver un outil magique universel. Il s'agit d'adapter votre flux de travail à la valeur de ce que vous protégez. Pour le modèle technique derrière le chiffrement dans le navigateur, lisez [comment PrivateNote fonctionne](app:how-it-works) et [ce que signifie le chiffrement de bout en bout côté client](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Type de donnée",
    scenario: "Scénario de partage idéal",
  },
  closingTitle: "Créez une note privée maintenant",
  closingBody: [
    "Aucun compte requis. Rédigez votre note, configurez vos paramètres de confidentialité et partagez un lien sécurisé en moins d'une minute.",
  ],
  fileSharingNote:
    "Besoin de partager des documents aussi ? [Transfert de fichiers sécurisé](app:secure-file-transfer) utilise le même modèle de chiffrement côté navigateur. L'envoi nécessite un compte gratuit ; les destinataires peuvent ouvrir les liens sans s'inscrire.",
  chromeExtensionNote:
    "Vous utilisez souvent PrivateNote ? L'[extension Chrome](chrome:extension) ajoute chiffrer-et-partager à votre barre d'outils ou menu contextuel—pratique quand un mot de passe ou une clé API apparaît en pleine conversation.",
  tagline: "Chiffrez d'abord. Partagez un lien. Laissez expirer.",
  relatedReading: "Lectures connexes",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Liens de destruction après lecture, le fragment d'URL et pourquoi l'éphémérité bat l'e-mail ou Slack pour les secrets à usage unique.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Pourquoi l'e-mail crée des copies durables de secrets—et quoi utiliser à la place pour les transmissions confidentielles.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Un flux plus sûr pour les clés API : limiter la portée, chiffrer localement, envoyer le lien—pas le secret brut.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Ce que l'E2EE côté client signifie réellement et en quoi elle diffère de la sécurité de transport seule.",
    },
  ],
};
