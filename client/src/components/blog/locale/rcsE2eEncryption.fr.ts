import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionFr: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "Un iPhone et un téléphone Android avec des icônes de cadenas dans des bulles de message, reliés par un cadenas central représentant le RCS chiffré de bout en bout",
  heroCaption:
    "Le RCS multiplateforme rattrape enfin son retard : la même garantie de chiffrement de bout en bout, que la bulle soit bleue ou verte.",
  intro: [
    "Pendant des années, l'une des plus grandes frustrations de la messagerie mobile n'était pas le manque de fonctionnalités, mais le manque de confidentialité cohérente.",
    "Les utilisateurs Apple profitaient de conversations chiffrées de bout en bout via iMessage, tandis que les utilisateurs Android pouvaient bénéficier du chiffrement en utilisant Google Messages avec d'autres appareils Android. Les messages échangés entre Android et iPhone n'ont jamais eu la même protection. Les conversations multiplateformes reposaient sur les Rich Communication Services (RCS), mais sans chiffrement de bout en bout interopérable.",
    "Cela est enfin en train de changer.",
    "Google a récemment annoncé que le déploiement du RCS chiffré de bout en bout entre Android et iPhone commence, suite à la publication du dernier profil universel RCS de la GSMA, qui intègre le protocole Messaging Layer Security (MLS). Alors que le support s'étend aux appareils et aux applications de messagerie, des milliards d'utilisateurs gagneront une confidentialité renforcée pour leurs conversations quotidiennes.",
    "C'est une étape majeure pour la communication numérique. C'est aussi une bonne occasion de comprendre ce que [le chiffrement de bout en bout](blog:what-is-end-to-end-encryption) protège réellement — et ce qu'il ne protège pas.",
  ],
  sections: [
    {
      title: "Une meilleure norme pour la messagerie du quotidien",
      paragraphs: [
        "La transition du SMS vers le RCS a modernisé la messagerie texte avec des fonctionnalités telles que le partage de photos en haute qualité, les indicateurs de frappe, les accusés de lecture et des conversations de groupe plus riches. La sécurité, en revanche, est restée inégale selon les appareils impliqués.",
        "Jusqu'à présent, les utilisateurs Android échangeant avec d'autres utilisateurs Android pouvaient bénéficier du chiffrement de bout en bout via Google Messages, tandis que les utilisateurs iPhone avaient la même protection au sein d'iMessage. Les messages échangés entre Android et iPhone, en revanche, manquaient de chiffrement de bout en bout interopérable.",
        "La norme RCS mise à jour change cela. À mesure que le support se déploie, les utilisateurs des deux plateformes peuvent enfin bénéficier des mêmes garanties fondamentales de confidentialité, quel que soit le téléphone qu'ils possèdent.",
        "Pour une technologie de communication utilisée par des milliards de personnes, c'est une avancée importante.",
      ],
    },
    {
      title: "Ce que signifie réellement le chiffrement de bout en bout",
      paragraphs: [
        "Le chiffrement de bout en bout signifie qu'un message est chiffré avant de quitter l'appareil de l'expéditeur et ne peut être déchiffré que sur l'appareil du destinataire.",
        "Contrairement au chiffrement de transport traditionnel, où un fournisseur de service peut être en mesure d'accéder aux messages une fois qu'ils atteignent ses serveurs, le chiffrement de bout en bout garantit que seuls les appareils en communication possèdent les clés nécessaires pour lire la conversation. Le service de messagerie transporte des données chiffrées mais ne peut pas déchiffrer leur contenu.",
        "Pour les utilisateurs, l'avantage est simple : votre conversation reste privée entre vous et la personne à qui vous parlez.",
        "Un chiffrement de bout en bout correctement mis en œuvre protège contre de nombreuses menaces courantes. Quelqu'un surveillant un réseau Wi-Fi public ne peut pas simplement lire vos messages, les fournisseurs d'accès internet ne peuvent pas en inspecter le contenu, et une intrusion dans les serveurs du fournisseur de messagerie exposerait des données chiffrées plutôt que des conversations lisibles.",
        "Pour la communication quotidienne, cela représente une amélioration significative de la confidentialité. Pour une définition technique plus approfondie, consultez notre guide sur [ce que signifie le chiffrement de bout en bout](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "Le chiffrement a des limites",
      paragraphs: [
        "Aussi important que soit le chiffrement de bout en bout, il est souvent mal compris.",
        "Le chiffrement protège les messages pendant leur transmission et pendant qu'ils sont stockés par le fournisseur de messagerie. Il ne contrôle pas ce qui se passe après la remise du message.",
        "Une fois qu'un message a été déchiffré sur le téléphone du destinataire, il redevient une information ordinaire. Le destinataire peut la conserver indéfiniment, la transférer à quelqu'un d'autre, copier son contenu dans une autre application, ou simplement prendre une capture d'écran. Selon la plateforme de messagerie, les conversations peuvent aussi être synchronisées sur plusieurs appareils ou incluses dans des sauvegardes cloud.",
        "En d'autres termes, le chiffrement de bout en bout sécurise la remise — il ne garantit pas que l'information disparaît une fois lue.",
      ],
      callout:
        "Cette distinction devient de plus en plus importante lorsque l'information partagée est particulièrement sensible — mots de passe, codes de récupération, clés API et autres identifiants qui ne devraient pas vivre éternellement dans un historique de conversation consultable.",
    },
    {
      title: "Tous les secrets n'ont pas leur place dans l'historique des conversations",
      paragraphs: [
        "La plupart des conversations méritent d'être préservées. Les messages avec la famille, les discussions avec des amis ou les échanges professionnels deviennent souvent une archive utile que l'on souhaite consulter plus tard.",
        "Les identifiants sensibles, c'est différent.",
        "Imaginez que vous envoyez un mot de passe administrateur temporaire à un collègue. Le mot de passe voyage en sécurité sur internet grâce au chiffrement de bout en bout, mais six mois plus tard, il peut toujours se trouver dans un historique de conversation consultable. Il en va de même pour les clés API, les codes de récupération, les phrases de récupération de cryptomonnaie, les informations confidentielles de clients, ou les identifiants de connexion temporaires.",
        "Dans de nombreux incidents de sécurité réels, le problème n'est pas que le secret ait été intercepté pendant la transmission. C'est qu'il est resté stocké quelque part longtemps après le moment où il aurait dû être oublié.",
        "À mesure que la messagerie devient de plus en plus sécurisée, l'attention se déplace progressivement vers un autre défi : réduire la persistance inutile. C'est pourquoi certains [secrets ne devraient jamais être envoyés dans un chat](blog:secrets-never-send-in-chat), qu'ils soient chiffrés ou non.",
      ],
    },
    {
      title: "Quand les liens à usage unique sont plus pertinents",
      paragraphs: [
        "Pour une information qui n'a besoin d'être partagée qu'une seule fois, la laisser au sein d'une conversation permanente n'est pas toujours idéal.",
        "Une alternative de plus en plus courante consiste à partager des informations sensibles via des [liens chiffrés à usage unique](blog:one-time-secret-links) qui expirent automatiquement ou deviennent inaccessibles après avoir été consultés. Plutôt que d'intégrer directement le secret dans une conversation en cours, le destinataire ouvre un lien dédié, récupère l'information, et le lien finit par expirer — ou, dans certains cas, ne peut être consulté qu'une seule fois.",
        "Cette approche ne remplace pas la messagerie chiffrée. Elle la complète plutôt en répondant à un problème différent.",
        "Les applications de messagerie sont conçues pour préserver les conversations. Les liens à usage unique sont conçus pour minimiser l'exposition à long terme d'informations qui, idéalement, ne devraient pas rester stockées indéfiniment.",
        "Que vous partagiez un mot de passe temporaire, un jeton API, une clé de licence logicielle ou une autre valeur confidentielle, limiter la durée d'existence de cette information peut réduire considérablement le risque d'une divulgation accidentelle ultérieure.",
      ],
    },
    {
      title: "La confidentialité, c'est plus que le chiffrement",
      paragraphs: [
        "Le déploiement d'un RCS chiffré de bout en bout et interopérable est une excellente nouvelle. Pour la première fois, les utilisateurs Android et iPhone peuvent bénéficier du même niveau de protection, quel que soit l'écosystème qu'ils utilisent.",
        "C'est aussi un rappel que la confidentialité ne se limite pas au chiffrement.",
        "Protéger l'information pendant qu'elle voyage sur internet est essentiel, mais il faut aussi réfléchir à ce qui se passe ensuite. Certaines informations méritent de rester disponibles pendant des années. D'autres — en particulier les mots de passe, les codes de récupération et les identifiants temporaires — sont souvent plus sûres lorsqu'elles n'existent que le temps nécessaire.",
        "Les applications de messagerie modernes et les services de partage de secrets à usage unique servent des objectifs différents. Aucun ne remplace l'autre ; ils répondent plutôt à des aspects différents de la communication sécurisée. Choisir la bonne approche dépend de ce que vous partagez et de la durée pendant laquelle cela doit exister.",
      ],
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Cela remplace-t-il les SMS ?",
          answer:
            "Non. Les SMS traditionnels restent non chiffrés. Les nouvelles protections s'appliquent uniquement aux conversations RCS compatibles, lorsque les appareils et les applications de messagerie prennent en charge la dernière norme RCS chiffrée de bout en bout.",
        },
        {
          question: "Google ou Apple peuvent-ils lire les messages RCS chiffrés ?",
          answer:
            "Le chiffrement de bout en bout est conçu pour que seuls les appareils en communication possèdent les clés nécessaires pour déchiffrer les messages. Les fournisseurs transportent des données chiffrées mais ne peuvent pas accéder au contenu en clair de vos conversations.",
        },
        {
          question: "Quelqu'un peut-il encore prendre une capture d'écran ?",
          answer:
            "Oui. Une fois qu'un message a été déchiffré sur l'appareil du destinataire, il peut toujours prendre des captures d'écran, copier le contenu ou le transférer à d'autres. Le chiffrement de bout en bout protège la transmission du message, pas ce que le destinataire choisit d'en faire par la suite.",
        },
        {
          question: "Les liens à usage unique sont-ils plus sûrs que les applications de messagerie ?",
          answer:
            "Pas nécessairement — ils résolvent un problème différent. La messagerie chiffrée de bout en bout est excellente pour les conversations continues. Les [liens à usage unique ou expirants](blog:one-time-secret-links) sont souvent mieux adaptés au partage d'informations sensibles qui ne devraient pas rester indéfiniment dans un historique de conversation.",
        },
      ],
    },
  ],
  referencesTitle: "Pour aller plus loin",
  references: [
    {
      label:
        "Les utilisateurs Android et iPhone peuvent désormais profiter de la messagerie RCS chiffrée de bout en bout (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Partagez des secrets qui n'ont pas leur place dans un chat",
  ctaBody:
    "Lorsque vous devez transmettre un mot de passe, une clé API ou un code de récupération, envoyez une note chiffrée à usage unique côté client plutôt que de la coller dans Messages. Définissez une expiration courte ou une suppression après lecture pour que le secret ne traîne pas dans un historique consultable.",
  ctaButton: "Créer une note privée",
};
