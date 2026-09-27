import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhraseFr: CryptoSeedArticleCopy = {
  heroAlt:
    "Concept de partage de fichiers chiffrés illustrant le chiffrement local avant l'envoi de secrets",
  intro: [
    "Une phrase de récupération de cryptomonnaie est l'un des secrets les plus précieux que vous posséderez jamais. Elle ne peut généralement pas être réinitialisée. Il n'y a pas de « Mot de passe oublié ». Celui qui la détient contrôle en principe le portefeuille et tout ce qu'il contient.",
    "Cela peut sembler étrange sur le blog d'une entreprise qui construit des liens chiffrés à usage unique. La sécurité ne consiste pas à prétendre que chaque outil convient à chaque tâche — il s'agit d'adapter l'approche à ce que vous protégez, y compris nos propres limites.",
    "Pour les **secrets remplaçables** — tels que les mots de passe Wi‑Fi, les identifiants temporaires, les codes de récupération MFA, de nombreuses clés API et les messages professionnels confidentiels — un [lien chiffré à usage unique](blog:one-time-secret-links) est une excellente solution.",
    "Les **secrets maîtres de longue durée**, tels que les phrases de récupération de cryptomonnaie, méritent une approche différente.",
  ],
  ruleTitle: "Règle n° 1",
  ruleParagraphs: [
    "**N'entrez jamais une phrase de récupération de cryptomonnaie sur un site web — y compris PrivateNote.** Si la transmission est inévitable, chiffrez d'abord localement et partagez **uniquement le texte chiffré**. PrivateNote sert à transporter des données préalablement chiffrées, pas à saisir la mnémonique.",
    "**Les fabricants légitimes de portefeuilles matériels ne vous demandent pas d'entrer votre phrase de récupération sur un site web.** Si un site demande votre phrase de récupération, considérez cela comme hautement suspect — vérifiez l'authenticité avant de continuer.",
    "Évitez autant que possible de saisir des phrases de récupération sur des sites web.",
  ],
  offlineAlternatives: [
    { label: "Sauvegarde métallique", body: "conservée dans un coffre-fort ou un coffre bancaire" },
    { label: "SLIP-39", body: "ou des schémas similaires pour l'héritage ou la reprise après sinistre" },
    { label: "Transfert via portefeuille matériel", body: "lorsque c'est possible, plutôt que la phrase de récupération" },
  ],
  seedPhraseTraits: [
    { label: "Accorde un contrôle total", body: "sur les actifs" },
    { label: "Dure souvent des décennies", body: "sans rotation" },
    { label: "Ne peut pas être modifiée", body: "en cas de compromission" },
    { label: "Aucune récupération par le fournisseur", body: "en cas de vol" },
  ],
  oneTimeLinkFit: [
    "Clés API et mots de passe temporaires",
    "Identifiants Wi‑Fi",
    "Codes de récupération MFA",
    "Messages professionnels et brouillons juridiques",
    "Jetons d'accès temporaires",
  ],
  localEncryptFirst: [
    "Phrases de récupération de cryptomonnaie",
    "Sauvegardes de portefeuilles matériels",
    "Clés privées CA et clés de signature",
    "Matériel de récupération de gestionnaire de mots de passe",
    "Secrets maîtres de grande valeur",
  ],
  philosophySteps: [
    "éviter la transmission lorsque c'est possible",
    "chiffrer localement",
    "envoyer uniquement le texte chiffré",
    "effacer le texte en clair temporaire",
    "envoyer la phrase secrète du fichier age — pas la mnémonique — sur un canal séparé lorsque c'est possible",
  ],
  sections: {
    sendAtAll: {
      title: "Devez-vous vraiment l'envoyer ?",
      question: "**la phrase doit-elle quitter l'endroit où elle se trouve ?** Souvent, non.",
      outro:
        "Chaque transmission augmente le risque de divulgation. Si vous pouvez éviter de l'envoyer, faites-le. Pour d'autres canaux qui conservent également les secrets indéfiniment, consultez [pourquoi l'e-mail est le pire endroit pour les secrets](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Pourquoi les phrases de récupération sont différentes",
      p1: "Une phrase de récupération est le secret racine d'un patrimoine numérique entier — pas « un simple mot de passe de plus ».",
      listIntro: "Contrairement à la plupart des identifiants, elle :",
      outro:
        "Vous ne vous défendez pas seulement contre les attaquants d'aujourd'hui — vous prenez des décisions qui pourraient compter dans dix ou vingt ans.",
    },
    browserEncryption: {
      title: "Le chiffrement dans le navigateur est solide — mais pas magique",
      paragraphs: [
        "PrivateNote chiffre dans votre navigateur avant l'envoi. Nos serveurs ne voient que du texte chiffré ; la clé ne nous parvient jamais. C'est bien mieux que l'[e-mail](blog:why-email-is-worst-for-secrets), le chat ou les documents cloud pour les secrets du quotidien — et correspond à un modèle strict de [chiffrement de bout en bout](blog:what-is-end-to-end-encryption) pour le contenu de la note.",
        "Chaque application de cryptographie dans le navigateur partage une contrainte : **le texte en clair doit exister dans le navigateur avant le chiffrement.** Du JavaScript malveillant — provenant d'extensions, d'une compromission de la chaîne d'approvisionnement, d'une injection ou d'un CDN défaillant — pourrait théoriquement le lire en premier. C'est inhérent au chiffrement côté client dans le navigateur, pas spécifique à PrivateNote.",
        "Pour les clés API et les mots de passe temporaires, ce compromis est généralement acceptable. Pour une phrase de récupération protégeant des économies de toute une vie, vous voudrez peut-être faire confiance à moins de systèmes.",
      ],
    },
    encryptLocal: {
      title: "Chiffrer avant que le navigateur ne le voie",
      intro: "Chiffrez localement, puis envoyez uniquement le texte chiffré :",
      outro: "PrivateNote ne reçoit jamais la mnémonique — uniquement des données chiffrées.",
      callout:
        "Le chiffrement local **n'arrête pas les logiciels malveillants sur votre machine**. Il **éloigne le texte en clair des applications web, des services cloud et des serveurs** qui n'en ont pas besoin. Vous réduisez la base de confiance informatique ; vous n'éliminez pas un terminal compromis.",
    },
    whichTool: {
      title: "Quel outil utiliser",
      age: "**age** (recommandé pour la plupart des utilisateurs) : chiffrement de fichiers simple avec des paramètres sécurisés par défaut — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG** : excellent si vous utilisez déjà OpenPGP.",
      openssl: "**OpenSSL** : fiable et puissant ; CLI de bas niveau — mieux adapté aux utilisateurs expérimentés.",
    },
    ageExample: {
      title: "Exemple minimal (age)",
      passphraseTitle: "Besoin d'une phrase secrète solide ?",
      passphraseBefore: "Utilisez un secret long et unique pour `age -p`. Générez-en un localement dans votre navigateur — le",
      passphraseLink: "générateur de phrases secrètes",
      passphraseAfter: "sur passwords.lu s'exécute côté client ; rien n'est envoyé.",
      p1: "Après vérification de `seed.txt.age`, **effacez de manière sécurisée le texte en clair** sur l'appareil de l'expéditeur. Après l'importation dans un portefeuille par le destinataire, **effacez également sa copie en texte clair**.",
      p2: "Pour des échanges réguliers avec quelqu'un, `age -r` (mode à clé publique) évite une phrase secrète partagée — cela vaut la peine d'être appris séparément.",
      docsLabel: "Documentation :",
    },
    separateChannels: {
      title: "Utiliser des canaux séparés",
      intro:
        "Séparez le fichier chiffré du secret qui le déverrouille. Vous séparez le texte chiffré `.age` de la **phrase secrète de déchiffrement age** — vous n'envoyez pas la mnémonique de la phrase de récupération par un second canal.",
      steps: [
        "Envoyez le **fichier chiffré** (texte chiffré) avec PrivateNote",
        "Envoyez la **phrase secrète age** qui déchiffre ce fichier — via Signal, téléphone ou en personne",
      ],
      outro: "Un attaquant doit compromettre plusieurs systèmes — pas un seul lien.",
    },
    recommend: {
      title: "Ce que nous recommandons",
      intro:
        "La distinction porte vraiment sur les secrets **remplaçables** par rapport aux secrets maîtres de **longue durée** — pas seulement sur le format de fichier ou le canal.",
      oneTimeTitle: "Adapté aux liens à usage unique",
      oneTimeSubtitle: "Secrets remplaçables que vous pouvez faire pivoter ou révoquer",
      localTitle: "Chiffrer localement d'abord",
      localSubtitle: "Secrets maîtres de longue durée qui changent rarement",
      outro:
        "Pour les clés API spécifiquement, consultez notre guide sur [comment partager une clé API en toute sécurité](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Adapter l'outil au risque",
      body: "Chaque approche a des hypothèses de confiance — gestionnaires de mots de passe, portefeuilles matériels, outils hors ligne, cryptographie dans le navigateur. Aucune n'est parfaite ; les compromis diffèrent. La question est de savoir s'ils correspondent à la **valeur** de ce que vous protégez.",
    },
    philosophy: {
      title: "Notre philosophie",
      p1: "Nous avons conçu PrivateNote pour que le chiffrement s'effectue **avant** que les données n'atteignent nos serveurs. Pour les secrets temporaires et remplaçables, c'est mieux que l'e-mail, la messagerie ou le stockage cloud. Vous pouvez également [envoyer un secret sans compte](blog:send-secret-message-without-account). Consultez [comment fonctionne PrivateNote](app:how-it-works) pour le modèle complet.",
      listIntro: "Pour une phrase de récupération qui pourrait représenter vos économies :",
      closingQuote:
        "Parfois, le meilleur conseil n'est pas « utilisez notre produit ». C'est « utilisez le bon outil pour la tâche ».",
    },
  },
  ctaTitle: "Partagez des secrets remplaçables — pas des phrases de récupération — dans le navigateur",
  ctaBody:
    "Créez une note à usage unique chiffrée pour les clés API, mots de passe et identifiants. Pour les phrases de récupération, chiffrez d'abord localement avec age, puis partagez uniquement le texte chiffré.",
  ctaButton: "Essayer PrivateNote ->",
};
