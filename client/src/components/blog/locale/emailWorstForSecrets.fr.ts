import type { EmailWorstForSecretsArticleCopy } from "./emailWorstForSecrets.types";

export const emailWorstForSecretsFr: EmailWorstForSecretsArticleCopy = {
  heroAlt:
    "Ordinateur portable sur un bureau affichant un e-mail avec des identifiants serveur et une clé privée SSH en texte clair",
  intro:
    "L'e-mail est devenu le moyen par défaut pour échanger presque tout — contrats, mots de passe, clés API, coordonnées bancaires, dossiers médicaux, documents d'identité, mots de passe Wi‑Fi et codes de récupération. La plupart d'entre nous envoient des informations sensibles par e-mail sans y réfléchir.",
  calloutTitle: "L'e-mail a été conçu pour livrer des messages — pas pour les faire disparaître",
  calloutBody:
    "Une fois que vous envoyez un e-mail, vous perdez souvent le contrôle sur où il aboutit, combien de temps il est conservé et qui pourrait y accéder un jour. Si vous envoyez quelque chose qui doit rester privé, l'e-mail est généralement le mauvais outil.",
  emailCopies: [
    "votre boîte de réception",
    "la boîte de réception du destinataire",
    "sauvegardes du fournisseur de messagerie",
    "copies archivées",
    "appareils synchronisés",
    "systèmes de sauvegarde d'entreprise",
    "fichiers PST ou MBOX exportés",
    "infrastructure de reprise après sinistre",
  ],
  agedSecretsExamples: [
    "un mot de passe de base de données de production",
    "une clé API",
    "identifiants SSH",
    "identifiants VPN",
    "une phrase de récupération de cryptomonnaie",
  ],
  forwardingPaths: [
    "transféré",
    "copié dans des systèmes de tickets",
    "collé dans des applications de chat",
    "joint à d'autres e-mails",
    "partagé avec des sous-traitants",
    "inclus dans des demandes de support",
  ],
  aiProcessingUses: [
    "détection de spam",
    "protection contre le phishing",
    "détection de logiciels malveillants",
    "réponses intelligentes",
    "catégorisation de la boîte de réception",
    "recherche",
    "fonctionnalités de productivité",
    "rédaction et résumé assistés par l'IA",
  ],
  oneTimeSecretExamples: [
    "un mot de passe",
    "une clé API",
    "un code de récupération",
    "une licence logicielle",
    "un identifiant serveur",
    "un message confidentiel",
  ],
  oneTimeBenefits: [
    "Pas d'historique dans la boîte de réception.",
    "Pas d'archive consultable.",
    "Pas de transfert accidentel du secret lui-même.",
    "Pas de copies oubliées dans les boîtes de réception pendant des années.",
  ],
  sections: [
    {
      title: "Votre e-mail n'existe pas à un seul endroit",
      paragraphs: [
        "Beaucoup de gens imaginent l'e-mail comme une simple conversation entre deux personnes. En réalité, chaque e-mail existe généralement à plusieurs endroits :",
        "Même si vous supprimez un e-mail, des copies peuvent continuer d'exister ailleurs. Certaines organisations conservent les e-mails pendant des années pour satisfaire des exigences légales, réglementaires ou commerciales. En pratique, un e-mail devient souvent permanent.",
      ],
    },
    {
      title: "Les secrets vieillissent mal",
      paragraphs: [
        "Ce qui est le plus dangereux avec l'e-mail n'est pas nécessairement aujourd'hui. C'est dans cinq ans. Imaginez que vous ayez envoyé par e-mail à quelqu'un :",
        "Peut-être que les identifiants ont changé depuis. Peut-être pas. Des années plus tard, cet e-mail peut encore se trouver dans plusieurs boîtes de réception, consultable en quelques secondes. Quiconque accède à l'un de ces comptes dispose soudainement d'une carte de vos anciens secrets. Notre guide sur les [secrets que vous ne devriez jamais envoyer dans le chat](blog:secrets-never-send-in-chat) couvre des risques similaires dans les applications de messagerie — l'e-mail est souvent pire car la conservation est plus longue et les copies plus nombreuses.",
      ],
    },
    {
      title: "L'e-mail est conçu pour être consultable",
      paragraphs: [
        "Les clients e-mail modernes sont remarquablement efficaces pour retrouver d'anciens messages. Recherchez `password`, `API` ou `confidential`, et des messages datant de plusieurs années apparaissent presque instantanément.",
      ],
      callout:
        "C'est une fonctionnalité fantastique pour la communication quotidienne. C'est une terrible fonctionnalité pour les secrets. Les informations sensibles devraient devenir **plus difficiles** à trouver avec le temps — pas plus faciles.",
    },
    {
      title: "Le transfert ne prend qu'un clic",
      paragraphs: [
        "Peut-être faites-vous confiance au destinataire. Ce n'est pas toujours suffisant. Les e-mails sont régulièrement :",
        "Une fois qu'un secret quitte votre boîte de réception, vous ne contrôlez plus le nombre de copies existantes. Contrairement à un gestionnaire de mots de passe ou un service de partage chiffré, l'e-mail n'a pas le concept de révocation d'accès après livraison.",
      ],
    },
    {
      title: "L'IA traite de plus en plus les e-mails",
      paragraphs: [
        "Une autre raison de réfléchir avant d'envoyer des informations sensibles par e-mail est que les fournisseurs de messagerie utilisent de plus en plus des systèmes automatisés pour traiter les messages. Ces systèmes peuvent aider pour :",
        "Les fournisseurs diffèrent considérablement dans le fonctionnement de ces fonctionnalités, les données traitées et les politiques de confidentialité applicables. Bien que de nombreux fournisseurs aient introduit des engagements de confidentialité plus forts ces dernières années, envoyer des informations sensibles par e-mail signifie toujours confier ces informations à des systèmes hors de votre contrôle. Si votre objectif est de minimiser l'exposition, réduire la quantité d'informations sensibles envoyées par e-mail est une première étape sensée.",
      ],
    },
    {
      title: "L'analyse réglementaire fait aussi partie du débat",
      paragraphs: [
        "La vie privée n'est plus seulement une question technique. Elle est devenue une question de politique. En juillet 2026, le Parlement européen a approuvé une prolongation du cadre juridique temporaire qui permet aux fournisseurs de certains services de communication de détecter et signaler volontairement du matériel pédopornographique (CSAM) jusqu'en avril 2028.",
        "Le cadre concerne principalement les services qui peuvent accéder au contenu des messages, tels que de nombreux fournisseurs de messagerie traditionnels et d'autres services de communication non [chiffrés de bout en bout](blog:what-is-end-to-end-encryption). Pour en savoir plus sur ce que ce vote signifiait — et pourquoi davantage de votes « Non » que « Oui » ont quand même abouti à une adoption — consultez notre explication sur [Chat Control 1.0](blog:chat-control-1-0-vote-explained).",
      ],
      callout:
        "L'objectif déclaré est la protection des enfants, et des personnes raisonnables peuvent diverger sur l'équilibre approprié entre vie privée et sécurité publique. Néanmoins, la discussion illustre un point important : **si un service peut lire vos messages, alors les lois, politiques ou décisions de plateforme futures peuvent affecter la façon dont ces messages sont traités.** En revanche, les services chiffrés de bout en bout sont fondamentalement différents car le fournisseur ne possède pas les clés cryptographiques nécessaires pour lire le contenu.",
    },
    {
      title: "Il existe une meilleure façon de partager des secrets",
      paragraphs: [
        "Toutes les informations n'ont pas besoin d'exister pour toujours. Parfois, vous avez simplement besoin d'envoyer quelque chose une fois. Exemples :",
        "Au lieu de les envoyer directement dans un e-mail, envoyez un [lien chiffré à usage unique](blog:one-time-secret-links). Le destinataire ouvre le lien, lit le secret, et les données chiffrées sont définitivement supprimées. Pour les clés API spécifiquement, consultez notre guide de workflow sur [comment partager une clé API en toute sécurité](blog:how-to-share-api-key-securely).",
      ],
    },
    {
      title: "Le chiffrement dans le navigateur fait la différence",
      paragraphs: [
        "Chez PrivateNote, le chiffrement s'effectue dans votre navigateur avant tout envoi. Votre navigateur chiffre le message localement. Seul le texte chiffré atteint nos serveurs. La clé de déchiffrement ne quitte jamais votre appareil et n'est jamais stockée par nous.",
        "Lorsque le destinataire ouvre la note, elle peut être configurée pour s'autodétruire après la première lecture réussie ou expirer automatiquement après une période choisie. Cela signifie qu'il n'y a pas d'e-mail permanent contenant le secret, en attente d'être découvert des années plus tard. Vous pouvez [envoyer un message secret sans créer de compte](blog:send-secret-message-without-account), ou lire [comment fonctionne PrivateNote](app:how-it-works) pour le modèle de chiffrement complet.",
      ],
      callout:
        "Le test pratique est simple : le fournisseur peut-il obtenir la clé de déchiffrement ou le texte en clair ? Si oui, le système n'est pas véritablement chiffré de bout en bout. L'e-mail échoue à ce test par conception.",
    },
    {
      title: "Le bon outil pour la bonne information",
      paragraphs: [
        "L'e-mail reste l'une des technologies de communication les plus utiles jamais créées. Il est excellent pour les conversations, les factures, les newsletters et la communication professionnelle quotidienne.",
        "Ce n'est pas l'endroit idéal pour les informations qui devraient disparaître une fois leur objectif atteint. Les mots de passe, codes de récupération, clés API, documents confidentiels et autres informations sensibles méritent un mécanisme de partage conçu avec la confidentialité à l'esprit.",
        "**Parfois, le secret le plus sûr est celui qui n'existe tout simplement plus.**",
      ],
    },
  ],
  ctaTitle: "Partagez un secret sans le laisser dans la boîte de réception de quelqu'un",
  ctaBody:
    "Créez une note à usage unique chiffrée dans votre navigateur. Envoyez le lien par e-mail si vous devez — le secret lui-même reste hors du fil de discussion.",
  ctaButton: "Essayer PrivateNote ->",
};
