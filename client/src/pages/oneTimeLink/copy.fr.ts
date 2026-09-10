import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkFr: OneTimeLinkCopy = {
  heroTitle: "Créer un lien à usage unique",
  heroSubtitle:
    "Partagez des mots de passe, des messages et des fichiers via un lien chiffré · Chiffré dans le navigateur · Les destinataires n’ont pas besoin de compte",
  whatHeading: "Qu’est-ce qu’un lien à usage unique ?",
  whatBody:
    "Un lien à usage unique est un moyen plus sûr de transmettre une information qui ne devrait pas rester indéfiniment disponible dans les canaux de communication ordinaires. Vous placez un mot de passe, une clé API, un code de récupération, un message privé, un document sensible ou un identifiant temporaire derrière une URL chiffrée. Le destinataire ouvre le lien pour récupérer et déchiffrer le contenu dans son navigateur. PrivateNote chiffre le contenu dans le navigateur avant l’envoi, si bien que le serveur reçoit des données chiffrées, pas du texte en clair. Vous choisissez combien de temps le lien inutilisé reste disponible et combien de fois il peut être ouvert. C’est une remise sécurisée, pas un coffre pour stocker des secrets en permanence.",
  whatLearnMore: "Comment fonctionnent les liens secrets à usage unique",
  stepsHeading: "Comment créer un lien à usage unique",
  step1Title: "Ajoutez le contenu",
  step1Body: "Saisissez un message privé, un mot de passe, ou joignez un fichier.",
  step2Title: "Définissez l’accès",
  step2Body: "Choisissez l’expiration, le nombre d’ouvertures et, si vous le souhaitez, un mot de passe.",
  step3Title: "Envoyez le lien",
  step3Body: "PrivateNote chiffre le contenu dans votre navigateur et crée un lien que vous envoyez via le canal que vous utilisez déjà.",
  useHeading: "Ce que vous pouvez partager avec PrivateNote",
  usePasswordsTitle: "Mots de passe et identifiants",
  usePasswordsBody:
    "Partagez des mots de passe et des identifiants temporaires sans laisser le texte en clair durablement dans l’e-mail ou le chat.",
  usePasswordsLink: "Partager un mot de passe en toute sécurité",
  useApiTitle: "Clés API",
  useApiBody:
    "Partagez des clés API, des jetons et des secrets de webhook sans les laisser dans l’historique de chat ou les tickets.",
  useApiLink: "Partager une clé API en toute sécurité",
  useMessagesTitle: "Messages privés",
  useMessagesBody:
    "Pour les informations qui ne devraient pas rester indéfiniment recherchables dans l’e-mail ou le chat une fois lues.",
  useMessagesLink: "Envoyer un message secret sans compte",
  useFilesTitle: "Fichiers et documents",
  useFilesBody:
    "Pour les fichiers sensibles dont vous voulez une livraison chiffrée et une disponibilité limitée, pas un dossier partagé durable.",
  useFilesLink: "Transfert de fichiers sécurisé",
  persistHeading: "Pourquoi utiliser un lien à usage unique ?",
  persistBody:
    "Envoyer un mot de passe par e-mail, Slack, Teams, SMS ou un autre service de messagerie peut laisser une copie dans l’historique, les appareils synchronisés, les sauvegardes, les notifications et les archives recherchables. Le chiffrement protège le transfert. L’expiration réduit la durée de disponibilité de l’original.",
  handoffHeading: "Conçu pour une remise sécurisée",
  handoffBody:
    "PrivateNote chiffre les messages et les fichiers dans le navigateur avant l’envoi. Le serveur reçoit des données chiffrées, pas le contenu lisible. Le déchiffrement a lieu dans le navigateur du destinataire.",
  handoffEncryptionLink: "Comment fonctionne le chiffrement",
  handoffHowItWorksLink: "PrivateNote en détail",
  limitsHeading: "Ce qu’un lien à usage unique ne peut pas empêcher",
  limitsBody:
    "Après ouverture, une personne autorisée peut encore copier, enregistrer ou photographier l’information. PrivateNote protège la remise et limite la durée de disponibilité du lien d’origine. Les copies déjà enregistrées ne sont pas supprimées.",
  faqHeading: "Questions fréquentes",
  faqs: [
    {
      question: "Qu’est-ce qu’un lien à usage unique ?",
      answer:
        "Un lien à usage unique sert à partager des informations confidentielles de façon temporaire. Au lieu d’envoyer un mot de passe, un message ou un fichier directement par e-mail ou chat, vous partagez un lien chiffré à durée et accès limités. PrivateNote chiffre le contenu dans votre navigateur pour que le secret d’origine ne reste pas indéfiniment dans l’historique.",
    },
    {
      question: "Comment créer un lien à usage unique ?",
      answer:
        "Utilisez le formulaire en haut de cette page. Ajoutez un message, un mot de passe ou un fichier, choisissez combien de temps le lien inutilisé reste disponible et combien de fois il peut être ouvert, puis créez le lien. PrivateNote chiffre le contenu dans votre navigateur et renvoie une URL que vous envoyez via le canal que vous utilisez déjà.",
    },
    {
      question: "Puis-je envoyer un mot de passe avec un lien à usage unique ?",
      answer:
        "Oui. Placez le mot de passe dans la note et envoyez le lien chiffré plutôt que le mot de passe lui-même. Vous pouvez ajouter une protection par mot de passe. Pour les comptes importants, faites tourner l’identifiant après usage. Un lien à usage unique est une remise, pas un gestionnaire de mots de passe.",
    },
    {
      question: "Puis-je envoyer un fichier via un lien à usage unique ?",
      answer:
        "Oui. Joignez un fichier ou un dossier à la même note chiffrée. Les fichiers sont chiffrés dans le navigateur avant l’envoi. L’envoi de pièces jointes nécessite un compte PrivateNote gratuit pour appliquer les limites de stockage. Les destinataires n’ont toujours pas besoin de compte pour ouvrir le lien.",
    },
    {
      question: "Le destinataire a-t-il besoin d’un compte PrivateNote ?",
      answer:
        "Non. Les destinataires ouvrent le lien dans un navigateur et déchiffrent le contenu localement. Ils n’ont pas à se connecter. Vous pouvez aussi créer une note texte simple sans compte. L’envoi de fichiers nécessite un compte gratuit pour limiter les abus et le stockage.",
    },
    {
      question: "Que se passe-t-il après l’ouverture du lien ?",
      answer:
        "Le navigateur du destinataire déchiffre le contenu localement. Les notes gratuites se lisent une fois : ensuite, la note d’origine est détruite. Starter peut autoriser jusqu’à trois ouvertures, Business jusqu’à dix. Si personne n’ouvre le lien, il expire selon la durée que vous avez choisie — trois jours au plus sur l’offre gratuite. Les fichiers joints restent visibles pendant une fenêtre limitée après la première ouverture.",
    },
    {
      question: "Quelqu’un peut-il faire une capture d’écran d’un PrivateNote ?",
      answer:
        "Oui. Quiconque peut voir le contenu révélé peut le capturer, le photographier ou le copier. PrivateNote ne prétend pas l’empêcher. Il contrôle le transfert chiffré et la durée de disponibilité du lien d’origine.",
    },
    {
      question: "Combien de temps un lien PrivateNote peut-il rester actif ?",
      answer:
        "Si la note n’est jamais ouverte, les liens gratuits expirent au plus tard au bout de trois jours. Starter permet jusqu’à 15 jours et Business jusqu’à 30 jours. Après ouverture, les notes gratuites se lisent une fois. Starter peut autoriser jusqu’à trois ouvertures et Business jusqu’à dix. Choisissez la durée la plus courte qui permette encore d’achever la remise.",
    },
  ],
  articleLearnMore: "En savoir plus sur le fonctionnement et la sécurité des liens à usage unique",
  backToCreate: "Prêt ? Créer un lien à usage unique ↑",
};
