import type { SecretMessageArticleCopy } from "./secretMessageWithoutAccount.types";

export const secretMessageWithoutAccountFr: SecretMessageArticleCopy = {
  intro: [
    "Parfois, vous devez partager quelque chose de confidentiel — un [mot de passe](app:password-generator), un code de récupération, un mot de passe Wi‑Fi, une note privée ou un message personnel. Mais créer un compte juste pour cela semble souvent inutile.",
    "La bonne nouvelle : ce n'est pas nécessaire.",
    "Le [chiffrement moderne dans le navigateur](blog:encrypted-vs-secure-file-sharing) permet d'envoyer un message secret en toute sécurité **sans vous inscrire**, installer de logiciel ni confier votre texte en clair à un service.",
  ],
  sections: [
    {
      title: "Pourquoi éviter de créer un compte ?",
      paragraphs: [
        "Créer un compte laisse plus de traces que beaucoup de gens ne le pensent. Un service typique peut stocker votre adresse e-mail, un [nom d'utilisateur](https://passwords.lu/en/blog/username-privacy-identity), l'historique de connexion, les informations sur l'appareil, les adresses IP et les métadonnées sur votre activité.",
        "Pour une collaboration à long terme, cela peut être parfaitement raisonnable. Pour partager un seul message confidentiel, ce n'est généralement pas le cas.",
        'Si votre objectif est simplement : « Je veux que cette personne lise ce message une seule fois », un compte ajoute souvent de la complexité sans améliorer la sécurité. Pour ce modèle, les [liens secrets à usage unique](blog:one-time-secret-links) conviennent généralement mieux.',
      ],
    },
    {
      title: "Chiffrez avant d'envoyer",
      paragraphs: [
        "La question importante n'est pas seulement de savoir si un site web utilise HTTPS. Presque tous les sites utilisent aujourd'hui HTTPS (TLS), qui protège les données pendant leur transit sur Internet. Notre guide sur le [chiffrement par rapport au partage sécurisé de fichiers](blog:encrypted-vs-secure-file-sharing) explique pourquoi le chiffrement de transport seul n'est pas la même chose que la confidentialité de bout en bout.",
        "La question la plus importante est : **qui peut lire votre message après qu'il a atteint le serveur ?**",
      ],
    },
    {
      title: "Services web traditionnels",
      paragraphs: [
        "De nombreuses plateformes de messagerie envoient votre message via une connexion chiffrée (HTTPS/TLS). Une fois le message arrivé sur leurs serveurs, ils peuvent techniquement y accéder avant de le stocker ou de le traiter.",
        "Selon le service, le message peut être analysé pour détecter le spam ou les abus, indexé pour la recherche, traité par des systèmes cloud, conservé dans des sauvegardes ou accessible aux administrateurs.",
        "TLS protège la connexion entre votre navigateur et le service. Il **n'empêche pas** nécessairement le service lui-même de lire votre message.",
      ],
    },
    {
      title: "Chiffrement dans le navigateur",
      paragraphs: ["Une approche plus respectueuse de la confidentialité consiste à chiffrer le message dans votre navigateur avant l'envoi."],
      beforeFlowSteps: "Dans ce modèle :",
      flowSteps: [
        {
          title: "Rédigez votre message",
          body: "Vous composez le secret dans votre navigateur — rien n'est encore envoyé. Ou utilisez Private AI et [Écrire avec Private AI](app:home) pour le rédiger sur votre appareil avant le chiffrement.",
        },
        {
          title: "Générez une clé unique localement",
          body: "Votre navigateur crée une clé de chiffrement sur votre appareil.",
        },
        {
          title: "Chiffrez avant l'envoi",
          body: "Le message est chiffré localement. Seul du texte chiffré est envoyé au serveur.",
        },
        {
          title: "Partagez la clé dans le lien",
          body: "La clé de déchiffrement reste avec vous et est partagée dans le lien sécurisé, généralement dans le [fragment d'URL](blog:one-time-secret-links) que les navigateurs n'envoient pas aux serveurs web.",
        },
      ],
      afterFlowSteps: [
        "Le service ne stocke que des données chiffrées et agit comme un relais. Sans la clé de déchiffrement, le texte chiffré est pratiquement inutile.",
        "Le même principe s'applique aux fichiers. Le [transfert sécurisé de fichiers](app:secure-file-transfer) chiffre documents et archives dans votre navigateur avant l'envoi. Les destinataires peuvent ouvrir le lien sans compte ; l'envoi nécessite une connexion à un compte PrivateNote gratuit.",
      ],
    },
    {
      title: "Pourquoi vous n'avez pas besoin de compte grâce à cela",
      paragraphs: [
        "Si un service n'a jamais besoin de lire votre message, il a peu de raisons de savoir qui vous êtes. C'est pourquoi les services avec chiffrement dans le navigateur peuvent souvent fonctionner sans inscription. Consultez [comment fonctionnent les liens secrets à usage unique](blog:one-time-secret-links) pour le processus complet.",
        "Au lieu de créer un compte, vous rédigez simplement votre message, générez un lien sécurisé et l'envoyez au destinataire. Pas de noms d'utilisateur. Pas de mots de passe à retenir. Pas de boîte de réception remplie d'e-mails de vérification.",
      ],
    },
    {
      title: "Ajoutez une couche supplémentaire avec un mot de passe",
      paragraphs: [
        "Pour des informations très sensibles, vous pouvez protéger le message chiffré avec un mot de passe supplémentaire.",
        "Une approche courante consiste à envoyer le lien chiffré par un canal de communication et le mot de passe par un autre, par exemple par téléphone, SMS ou messagerie. Un attaquant aurait besoin des deux pour déchiffrer le message.",
      ],
    },
    {
      title: "Messages qui disparaissent automatiquement",
      paragraphs: [
        "Les informations confidentielles ne devraient généralement pas rester en ligne pour toujours. De nombreux services de notes sécurisées permettent aux messages de [s'auto-supprimer après la première lecture](blog:one-time-secret-links), d'expirer après une durée choisie ou d'être supprimés automatiquement.",
        "Cela réduit la quantité d'informations sensibles restant disponibles en ligne, de la même manière que [les messages professionnels et les journaux de chat](blog:workplace-texts-private-note) constituent un mauvais endroit pour les secrets à usage unique. Aucune technologie ne peut empêcher un destinataire de faire une capture d'écran ou de copier le contenu après ouverture, mais l'expiration automatique réduit considérablement l'exposition à long terme.",
      ],
    },
    {
      title: "Quand utiliser des messages secrets anonymes ?",
      paragraphs: ["Envoyer des messages chiffrés sans créer de compte est utile pour partager :"],
      bullets: [
        "[Mots de passe et codes de récupération](blog:how-we-generate-passwords) — ou utilisez notre [générateur de mots de passe](app:password-generator) avant de partager",
        "[Clés API](blog:privatenote-for-developers) et clés de licence logicielle",
        "Liens privés et notes professionnelles confidentielles",
        "Informations financières et mots de passe Wi‑Fi",
        "Messages personnels temporaires qui ne devraient pas rester dans l'e-mail ou l'historique de chat pour toujours",
      ],
    },
    {
      title: "Ce qu'il faut rechercher dans un service sécurisé",
      paragraphs: ['Tous les services de « messages privés » ou de « notes secrètes » n\'offrent pas le même niveau de protection. Recherchez des services qui :'],
      bullets: [
        "Chiffrent les messages dans votre navigateur avant l'envoi",
        "Ne reçoivent jamais votre texte en clair",
        "Ne nécessitent pas de compte",
        "Prennent en charge l'expiration automatique",
        "Offrent une protection par mot de passe optionnelle",
        "Utilisent un chiffrement authentifié moderne",
      ],
      callout:
        'Ces choix de conception réduisent la confiance que vous devez accorder au service lui-même. Pour une base de sécurité plus large — y compris mots de passe, authentification et partage sécurisé — consultez [Le mythe de la sécurité « suffisamment bonne »](blog:myth-good-enough-security).',
    },
    {
      title: "Comment PrivateNote s'inscrit dans ces principes",
      paragraphs: [
        "PrivateNote a été conçu précisément autour de ces idées. Lorsque vous créez une note, le chiffrement s'effectue entièrement dans votre navigateur avant tout envoi. Le serveur ne stocke que du texte chiffré et agit uniquement comme relais entre vous et votre destinataire ; il ne reçoit jamais le texte en clair de votre message.",
        "Grâce à cette conception, vous n'avez pas besoin de créer un compte pour envoyer une note privée. Rédigez simplement votre message, générez un lien sécurisé et partagez-le via le canal de communication de votre choix.",
        "Pour une protection supplémentaire, vous pouvez protéger la note par mot de passe, choisir quand elle expire, la faire s'autodétruire après la première lecture, joindre des fichiers chiffrés et recevoir optionnellement des notifications de livraison indiquant quand une note a été ouverte ou a expiré — sans révéler le contenu du message.",
        "L'objectif est simple : partager des informations confidentielles aussi facilement qu'un lien, tout en ayant le moins possible besoin de faire confiance au service.",
      ],
    },
    {
      title: "Mot de la fin",
      paragraphs: [
        "Envoyer un message secret ne devrait pas signifier créer un autre compte ou donner des données personnelles inutiles.",
        "Le chiffrement dans le navigateur permet de chiffrer votre message avant qu'il ne quitte votre appareil, de sorte que le service ne stocke que du texte chiffré au lieu de votre vrai message. Combiné avec des [liens expirants](blog:one-time-secret-links) et une protection par mot de passe optionnelle, cela offre un moyen simple et pratique de partager des informations confidentielles.",
        "Que vous envoyiez un mot de passe, un code de récupération ou une note personnelle : un service qui chiffre les données dans votre navigateur et ne nécessite pas de compte vous offre plus de confidentialité avec moins de tracas.",
      ],
    },
  ],
  closingTitle: "Essayez sans vous inscrire",
  closingBody: [
    "PrivateNote est conçu autour de ces principes : partager des messages en toute sécurité aussi simplement que créer un lien et l'envoyer au destinataire prévu.",
  ],
  fileSharingNote:
    "PrivateNote propose également un [transfert sécurisé de fichiers](app:secure-file-transfer) pour partager documents et dossiers avec le même modèle de chiffrement dans le navigateur. L'envoi nécessite un compte gratuit ; les destinataires peuvent ouvrir le lien sans se connecter.",
  tagline: "Moins de comptes. Moins de métadonnées. Plus de contrôle sur ce qui reste en ligne après le transfert.",
  relatedReading: "Pour aller plus loin",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Explication approfondie des liens à usage unique, du fragment d'URL et de la raison pour laquelle l'éphémérité est préférable à l'e-mail ou Slack pour les secrets à usage unique.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS par rapport au chiffrement dans le navigateur — ce que chacun protège et pourquoi le serveur peut quand même lire vos données.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Comment créer des mots de passe forts et les partager sans réutiliser de motifs ni les laisser dans l'historique de chat.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Pourquoi les traces écrites dans l'e-mail et le chat professionnel créent des risques à long terme — et quand les notes éphémères conviennent mieux.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Une base de sécurité pratique : mots de passe, authentification, messagerie et modèles de partage sécurisé.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Partagez des clés API et des identifiants depuis votre éditeur sans coller de secrets dans Slack ou les tickets.",
    },
  ],
};
