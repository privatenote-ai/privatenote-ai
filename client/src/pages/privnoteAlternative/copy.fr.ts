import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativeFr: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Alternative à Privnote",
  eyebrow: "Alternative à Privnote",
  heroTitleLine1: "Une alternative privée à Privnote",
  heroTitleLine2: "pour notes, mots de passe et fichiers",
  heroBody:
    "PrivateNote garde la simplicité d’une note qui disparaît et y ajoute le partage de fichiers chiffrés, la protection par mot de passe, des contrôles destinataire et des outils pour remettre des informations sensibles.",
  primaryCta: "Créer une note privée",
  secondaryCta: "Fonctionnement",
  trustLine: "Pas de compte pour les notes texte · Chiffrement dans le navigateur · Lecture unique",

  introHeading: "Si vous connaissez déjà Privnote",
  introBody:
    "Si vous cherchez une alternative à Privnote, PrivateNote reprend la même idée : créer un lien privé, le partager, et faire expirer ou disparaître le contenu après ouverture. Le chiffrement a lieu dans le navigateur avant tout envoi. Les destinataires ouvrent le lien et déchiffrent localement. Ils n’ont pas besoin de compte.",
  introBody2:
    "PrivateNote prolonge ce flux au-delà d’un court message texte. Vous pouvez partager mots de passe, documents, photos, enregistrements audio ou vidéo et d’autres fichiers dans la même remise chiffrée, avec des contrôles supplémentaires quand la situation l’exige.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Les deux services sont conçus pour le partage temporaire. PrivateNote étend l’idée aux fichiers, aux médias, aux contrôles destinataire et aux flux professionnels.",
  compareFeatureColumn: "Fonction",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Oui",
  compareNo: "Non proposé",
  comparePaid: "Starter et Business",
  compareRows: [
    { feature: "Notes autodestructrices", privnote: "yes", privatenote: "yes" },
    { feature: "Pas de compte requis pour le destinataire", privnote: "yes", privatenote: "yes" },
    { feature: "Protection par mot de passe", privnote: "yes", privatenote: "yes" },
    { feature: "Pièces jointes chiffrées", privnote: "no", privatenote: "yes" },
    { feature: "Plusieurs fichiers dans un même lien", privnote: "no", privatenote: "yes" },
    { feature: "Photos, audio et vidéo", privnote: "no", privatenote: "yes" },
    { feature: "Notifications d’ouverture et de destruction", privnote: "yes", privatenote: "yes" },
    { feature: "Vérification du destinataire", privnote: "no", privatenote: "paid" },
    { feature: "Révélation planifiée", privnote: "no", privatenote: "paid" },
    {
      feature: "Image de marque sur la page d’ouverture",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Outils développeurs (CLI, MCP, extensions)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Les fonctionnalités peuvent évoluer. Comparaison basée sur les informations produit publiques en septembre 2026.",
  compareCta: "Essayer PrivateNote",

  whyHeading: "Pourquoi chercher une alternative à Privnote ?",
  whyBody:
    "Privnote convient bien quand le besoin est simple : envoyer une note texte temporaire. Le texte temporaire n’est qu’une des façons dont circule une information sensible.",
  whyBody2:
    "Vous pouvez avoir à envoyer un PDF, partager plusieurs fichiers, confirmer qu’un lien a été ouvert, protéger l’accès par un mot de passe, ou remettre des documents confidentiels sans les laisser dans un e-mail ordinaire.",
  whyClose:
    "C’est le problème que PrivateNote est conçu pour traiter : une remise sécurisée, pas seulement un message qui disparaît.",

  passwordHeading: "Une alternative à Privnote pour partager des mots de passe",
  passwordBody:
    "Les mots de passe Wi-Fi, les clés API et les codes de récupération voyagent souvent dans le même e-mail ou le même chat qui explique à quoi ils servent. Cela peut laisser des copies dans l’historique, les appareils synchronisés et les sauvegardes.",
  passwordBody2:
    "PrivateNote place l’identifiant derrière un lien chiffré distinct. Vous envoyez le contexte par le canal que vous utilisez déjà, et le secret dans une note temporaire qui peut expirer, se détruire après lecture et, si besoin, exiger un mot de passe. C’est une remise, pas un gestionnaire de mots de passe.",
  passwordCta: "Partager un mot de passe en toute sécurité",
  passwordArticleLink: "Comment partager un mot de passe en toute sécurité",

  filesHeading: "Envoyer des fichiers, pas seulement du texte",
  filesBody:
    "Contrats, pièces d’identité, PDF financiers, fichiers de configuration, photos et archives sont souvent le vrai contenu. Une note texte qui disparaît ne peut pas les porter. PrivateNote conserve la note et ses pièces jointes chiffrées dans la même remise sécurisée, pour que le message et les fichiers voyagent ensemble.",
  filesBody2:
    "L’envoi de fichiers nécessite un compte PrivateNote gratuit, afin d’appliquer les limites de stockage et de transfert. Les destinataires ouvrent toujours le lien sans se connecter. Après la première ouverture, les pièces jointes restent disponibles pendant une fenêtre limitée — pas un dossier partagé durable.",
  filesLimits:
    "Limites actuelles : Free jusqu’à {freeSize} par fichier et {freeCount} fichiers par transfert ({freeTransfers} transferts par mois). Starter jusqu’à {starterSize} et {starterCount} fichiers. Business jusqu’à {businessSize} et {businessCount} fichiers.",
  filesCta: "Envoyer un fichier chiffré",
  filesArticleLink: "Envoyer des documents sensibles en toute sécurité",

  mediaHeading: "Partager photos, audio et vidéo sensibles",
  mediaBody:
    "Certaines informations ne commencent jamais comme un fichier sur le disque. Vous photographiez un document, enregistrez un court message vocal, ou joignez une photo existante sans passer d’abord par une autre messagerie.",
  mediaBody2:
    "PrivateNote peut prendre une photo, enregistrer de l’audio ou de la vidéo, ou joindre un média existant. La capture a lieu dans le navigateur, puis le même chiffrement côté client que pour les fichiers s’applique avant l’envoi.",
  mediaPhotoLink: "Partager des photos en sécurité",
  mediaVoiceLink: "Messages vocaux chiffrés",

  businessHeading: "Quand une note qui disparaît devient un flux professionnel",
  businessBody:
    "Le même lien privé sert lorsqu’expéditeur est un expert-comptable, un administrateur IT, un consultant ou un cabinet qui remet des fichiers confidentiels à un client. Le besoin n’est pas seulement le secret. C’est la confirmation, le contrôle et une livraison professionnelle.",
  businessScenarios: [
    "Un expert-comptable envoie des chiffres confidentiels à un client.",
    "Un administrateur IT envoie des identifiants à un collaborateur.",
    "Un cabinet envoie des pièces d’identité ou des documents financiers à un client.",
    "Un consultant transmet des fichiers de projet qui ne doivent pas rester dans l’e-mail.",
    "Une entreprise a besoin de savoir que des informations sensibles ont été consultées.",
  ],
  businessBody2:
    "Starter et Business ajoutent la vérification du destinataire, la révélation planifiée, la preuve d’accès, des fenêtres d’accès plus longues, la révocation des notes non ouvertes et le suivi des notes envoyées. Business ajoute des pages d’ouverture à votre image, l’accès fichiers en lecture seule et des transferts plus volumineux. Le chiffrement reste côté navigateur sur chaque offre.",
  businessCta: "Découvrir PrivateNote Business",
  businessNotifyLink: "Savoir quand un lien secret a été ouvert",
  businessVerifyLink: "Vérification du destinataire",

  securityHeading: "Comment PrivateNote protège votre contenu",
  securityBody:
    "Le contenu sensible est chiffré dans votre navigateur avant l’envoi. L’infrastructure de PrivateNote stocke du texte chiffré, pas la note ou le fichier en clair.",
  securityArchitecture:
    "Pour une note standard, le navigateur génère une clé de chiffrement aléatoire de 256 bits et utilise le chiffrement authentifié AES-256-GCM. La clé de déchiffrement voyage dans le fragment d’URL — la partie après #. Les navigateurs n’incluent pas le fragment dans les requêtes HTTP normales, donc le serveur ne reçoit pas la clé dans l’URL de la requête.",
  securityRecipient:
    "Le navigateur du destinataire utilise la clé du lien partagé pour déchiffrer le contenu localement.",
  securityLimitation:
    "Quiconque possède plus tard le lien complet peut encore copier ou capturer ce qu’il voit. PrivateNote contrôle la remise, pas ce que fait le destinataire après l’ouverture.",
  securityFlowWrite: "Écrire / joindre",
  securityFlowEncrypt: "Chiffrer dans le navigateur",
  securityFlowCiphertext: "Envoyer le texte chiffré",
  securityFlowShare: "Partager le lien privé",
  securityFlowDecrypt: "Le destinataire déchiffre",
  securityEncryptionLink: "Comment fonctionne le chiffrement PrivateNote",
  securityHowItWorksLink: "Le fonctionnement en détail",
  founderHeading: "Conçu avec la cryptographie en tête",
  founderBody:
    "PrivateNote est développé par Marjan Skrobot, chercheur en cryptographie et sécurité de l’information. Le modèle de sécurité et ses limites sont documentés publiquement, y compris ce que PrivateNote peut — et ne peut pas — protéger.",
  founderLink: "Le modèle de sécurité",

  decideHeading: "Lequel utiliser ?",
  decidePrivnoteTitle: "Privnote peut suffire si…",
  decidePrivnoteItems: [
    "Vous n’avez qu’une note texte temporaire à envoyer.",
    "Vous voulez le flux le plus simple possible.",
    "Vous n’avez pas besoin de pièces jointes ni de contrôles de livraison supplémentaires.",
  ],
  decidePrivateNoteTitle: "PrivateNote peut mieux convenir si…",
  decidePrivateNoteItems: [
    "Vous voulez un chiffrement côté client documenté.",
    "Vous devez partager des fichiers ou des médias en plus du texte.",
    "Vous avez besoin de la vérification du destinataire ou d’une révélation planifiée.",
    "Vous voulez des notifications d’accès ou une preuve d’accès.",
    "Vous avez besoin d’une image de marque professionnelle ou de contrôles de livraison métier.",
  ],
  decideOneTimeLink: "Comment fonctionnent les liens secrets à usage unique",
  decideDevelopersLink: "Intégrations développeurs",

  faqHeading: "Questions fréquentes",
  faqs: [
    {
      question: "Quelles sont les alternatives à Privnote ?",
      answer:
        "Plusieurs services proposent le partage temporaire ou chiffré de notes. PrivateNote s’adresse à celles et ceux qui veulent le flux d’une note qui disparaît, mais ont aussi besoin de fichiers chiffrés, de médias, de contrôles destinataire ou de fonctions de livraison professionnelles.",
    },
    {
      question: "En quoi PrivateNote diffère-t-il de Privnote ?",
      answer:
        "Les deux créent un lien privé temporaire que le destinataire peut ouvrir sans compte. PrivateNote ajoute des pièces jointes chiffrées, la capture photo et audio dans le navigateur, une protection par mot de passe optionnelle dans le même flux, et des contrôles payants comme la vérification du destinataire et les pages d’ouverture à votre image. Privnote se concentre sur les notes texte autodestructrices.",
    },
    {
      question: "Puis-je utiliser PrivateNote sans compte ?",
      answer:
        "Oui. Vous pouvez créer une note texte chiffrée simple sans vous connecter. Les destinataires n’ont jamais besoin de compte. L’envoi de fichiers, photos ou enregistrements nécessite un compte gratuit pour appliquer les limites de stockage et de transfert mensuel.",
    },
    {
      question: "Puis-je envoyer des fichiers avec PrivateNote ?",
      answer:
        "Oui. Joignez un ou plusieurs fichiers à la même note chiffrée. Les fichiers sont chiffrés dans le navigateur avant l’envoi. L’envoi nécessite un compte gratuit ; l’ouverture du lien, non. Les destinataires peuvent télécharger les pièces jointes pendant une fenêtre limitée après l’ouverture.",
    },
    {
      question: "Puis-je partager des mots de passe avec PrivateNote ?",
      answer:
        "Oui. Placez le mot de passe dans la note et envoyez le lien chiffré plutôt que le mot de passe lui-même. Vous pouvez ajouter une protection distincte et garder une expiration courte. Après usage d’un identifiant important, faites-le tourner. Une note privée est une remise, pas un gestionnaire de mots de passe.",
    },
    {
      question: "Comment PrivateNote chiffre-t-il les notes ?",
      answer:
        "Le navigateur génère une clé aléatoire de 256 bits et chiffre la note avec AES-256-GCM avant l’envoi. La clé voyage dans le fragment d’URL — la partie après # — que les navigateurs n’envoient pas dans une requête HTTP normale. Les notes protégées par mot de passe enveloppent cette clé avec Argon2id. Les pièces jointes sont aussi chiffrées dans le navigateur.",
    },
    {
      question: "Le destinataire a-t-il besoin d’un compte PrivateNote ?",
      answer:
        "Non. Les destinataires ouvrent le lien dans un navigateur et déchiffrent le contenu localement. Ils n’ont pas à se connecter. Quiconque a le lien complet, et le mot de passe s’il y en a un, peut ouvrir la note.",
    },
  ],

  finalHeading: "Partagez en privé.",
  finalBody: "Créez une note chiffrée ou une remise de fichier et envoyez le lien à votre destinataire.",
  finalPrimaryCta: "Créer une note privée",
  finalSecondaryCta: "Voir les tarifs",
  finalTrust: "Pas de compte requis pour commencer.",
};
