import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatFr: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "De Slack et Microsoft Teams à WhatsApp et Messenger : le chat est devenu pour beaucoup le moyen par défaut d'échanger des informations. C'est rapide, pratique et maintient les équipes alignées. Malheureusement, c'est aussi devenu un cimetière numérique pour des données très sensibles : partagées par commodité puis oubliées.",
    "De nombreuses applications de chat modernes offrent un fort [chiffrement de transport](blog:encrypted-vs-secure-file-sharing) ou même un chiffrement de bout en bout. Le chiffrement protège les messages pendant leur transit entre appareils. Le problème plus important commence ensuite. Une fois qu'un secret atterrit dans un chat, il reste souvent consultable pendant des mois ou des années à travers plusieurs systèmes.",
    "Cette durabilité crée une empreinte numérique étonnamment importante. Les informations sensibles peuvent continuer d'exister dans l'historique de chat consultable, les sauvegardes cloud, les exports d'espace de travail, les aperçus de notifications, les captures d'écran et les appareils synchronisés.",
    "Selon le [Data Breach Investigations Report 2026 de Verizon](https://www.verizon.com/business/resources/reports/dbir/), **62 % des incidents de sécurité impliquent un facteur humain** : identifiants volés, phishing, ingénierie sociale, abus et erreurs simples. La technologie seule ne prévient pas de tels incidents lorsque des informations sensibles sont partagées sans réflexion.",
    "Une approche plus sûre suit un principe simple : **ne partagez des informations que lorsqu'elles sont nécessaires, et assurez-vous qu'elles disparaissent après la première consultation.** C'est sur cela que reposent les [liens secrets à usage unique](blog:one-time-secret-links), et c'est pourquoi PrivateNote traite la durée de vie d'une note comme faisant partie de la sécurité, pas comme un détail secondaire.",
  ],
  chatScreenshotCaption:
    "Exemple illustratif : des identifiants en texte clair dans un chat d'équipe restent conservés dans l'historique du canal, les sauvegardes et les fonctions de recherche, longtemps après la fin du transfert.",
  cheatSheetTitle: "L'aide-mémoire de sécurité",
  cheatSheetHeaders: ["Ne jamais envoyer", "Le risque", "Meilleure approche"],
  cheatSheetRows: [
    {
      neverSend: "Mots de passe",
      risk: "Indexés dans l'historique de chat permanent et les journaux consultables.",
      better: "[Lien à usage unique avec chiffrement dans le navigateur](blog:one-time-secret-links).",
    },
    {
      neverSend: "Codes de récupération",
      risk: "Contournent de fait l'authentification multifacteur de manière permanente.",
      better: "Gestionnaire de mots de passe dédié ou [note à usage unique](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "Clés API",
      risk: "Un collage accidentel dans un canal public compromet les environnements de production.",
      better: "[Note sécurisée à auto-suppression](blog:privatenote-for-developers) avec chiffrement dans le navigateur.",
    },
    {
      neverSend: "Documents",
      risk: "Laissent des copies permanentes dans les dossiers de téléchargement locaux et les appareils synchronisés.",
      better: "[Transfert de fichiers chiffré temporaire](app:secure-file-transfer) avec accès limité.",
    },
  ],
  whyChatTitle: "Pourquoi le chat n'est pas un gestionnaire de secrets",
  whyChatParagraphs: [
    "Les plateformes de messagerie sont conçues pour la communication, pas pour la gestion des secrets. Leur objectif est de préserver les conversations entre appareils, synchroniser l'historique, permettre la recherche, créer des sauvegardes et rendre la collaboration traçable.",
    "Ce sont précisément ces fonctionnalités qui deviennent un risque lorsque des identifiants ou des données sensibles d'entreprise sont partagés. L'information reste accessible longtemps après avoir rempli son objectif. Notre article sur [les messages professionnels et la découvrabilité juridique](blog:workplace-texts-private-note) montre comment des messages écrits avec désinvolture peuvent survivre à leur contexte d'origine pendant des années.",
    "Un secret à usage unique suit un modèle différent : l'information n'est disponible que pendant la courte période où elle est réellement nécessaire, puis l'accès côté serveur est supprimé par conception.",
  ],
  lifetimeTitle: "Durée de vie des données : chat classique vs PrivateNote",
  lifetimeIntro: "La différence ne réside pas seulement dans le fait qu'un message soit chiffré en transit. Il s'agit de savoir si le secret existe encore quelque part après lecture.",
  chatWorkflowLabel: "Processus de chat classique",
  chatWorkflowSteps: ["Mot de passe", "Slack / Teams", "Enregistré", "Consultable", "Sauvegardes", "Des années plus tard"],
  chatWorkflowOutcome: "Le secret continue d'exister à travers les systèmes",
  privateNoteWorkflowLabel: "Processus PrivateNote",
  privateNoteWorkflowSteps: [
    "Mot de passe",
    "Chiffrement dans le navigateur",
    "Lien à usage unique",
    "Ouvert",
    "Supprimé du serveur",
  ],
  privateNoteWorkflowOutcome: "Le secret est supprimé après livraison",
  secretsTitle: "10 secrets qui n'ont pas leur place dans les applications de chat",
  secrets: [
    {
      title: "Mots de passe de compte",
      paragraphs: [
        "Tout le monde connaît la situation : « Quel était déjà l'identifiant du compte marketing partagé ? » et quelques instants plus tard, le mot de passe apparaît en texte clair dans le chat. Même si vous faites entièrement confiance à votre collègue, ce mot de passe est maintenant indexé dans l'historique de l'espace de travail, mis en cache dans les données locales de l'application et potentiellement visible dans les notifications par e-mail ou push.",
        "Si un attaquant compromet cet historique de chat des mois plus tard, il hérite d'un accès actif à votre compte.",
      ],
      instead:
        "Envoyez un [lien à usage unique avec chiffrement dans le navigateur](blog:send-secret-message-without-account). Dès que le destinataire l'ouvre et récupère le mot de passe, le texte chiffré est supprimé du serveur hôte. Besoin d'un mot de passe fort d'abord ? Utilisez notre [générateur de mots de passe](app:password-generator).",
    },
    {
      title: "Codes de récupération MFA",
      paragraphs: [
        "Lors de l'activation de la MFA, les services génèrent des codes de secours. Par peur de perdre l'accès, les utilisateurs les copient souvent dans un chat avec un collègue ou dans leur propre chat privé.",
        "Les codes de récupération sont des clés maîtresses de secours. Les traiter comme un message anodin compromet l'objectif de la sécurité multifacteur.",
      ],
      instead:
        "Conservez-les dans un gestionnaire de mots de passe dédié. Si vous devez les partager lors d'un transfert de compte, utilisez une [note temporaire à usage unique](blog:one-time-secret-links), afin que le secret ne reste pas définitivement dans l'historique de chat.",
    },
    {
      title: "Clés API de production",
      paragraphs: [
        "Les développeurs échangent souvent des clés API, jetons d'accès ou secrets cloud dans le chat pour déboguer rapidement un problème. Le [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) détecte continuellement des identifiants divulgués dans les dépôts publics, un indice de la fréquence à laquelle les secrets fuient accidentellement.",
        "Un collage accidentel dans le mauvais canal peut exposer des bases de données en production ou des systèmes de facturation.",
      ],
      instead:
        "Envoyez les jetons via une [note chiffrée dans le navigateur](blog:privatenote-for-developers) qui expire automatiquement après une seule consultation.",
    },
    {
      title: "Clés SSH privées",
      paragraphs: [
        "Votre clé privée est votre identité pour l'infrastructure serveur. Elle ne devrait jamais se trouver dans une application de messagerie. Copier une clé privée crée une copie supplémentaire hors de l'environnement sécurisé prévu ; elle peut persister dans l'historique de chat, les sauvegardes ou sur les appareils des destinataires.",
      ],
      instead:
        "Si une clé doit être transférée en toute sécurité, utilisez une charge utile chiffrée à usage unique qui s'auto-supprime du serveur hôte après livraison.",
    },
    {
      title: "Liens d'invitation et de réinitialisation",
      paragraphs: [
        "Les liens temporaires d'intégration et d'administration atterrissent continuellement dans les canaux de chat :",
      ],
      bullets: [
        "Liens d'attribution d'hôte Zoom",
        "Jetons de modérateur Google Meet",
        "Invitations d'intégration Stripe",
        "Invitations aux droits d'administrateur",
        "URL de réinitialisation de mot de passe",
      ],
      instead:
        "Envoyez les liens d'intégration privilégiés via une [note à usage unique](blog:one-time-secret-links), afin qu'ils ne puissent pas être extraits des journaux historiques lorsqu'ils restent inutilisés.",
    },
    {
      title: "Phrases de récupération crypto",
      paragraphs: [
        "Votre phrase de récupération de 12 ou 24 mots contrôle l'ensemble de votre portefeuille. Si quelqu'un compromet votre compte de chat des années plus tard, des scrapers automatisés peuvent parcourir les conversations historiques à la recherche de phrases correspondant aux formats de seed. Si votre phrase de récupération est volée, vos avoirs peuvent être perdus définitivement.",
      ],
      instead:
        "Transférez de préférence les phrases de récupération sans support numérique. Si une urgence absolue l'impose, utilisez une note chiffrée qui impose une suppression immédiate après lecture pour limiter l'exposition.",
    },
    {
      title: "Identifiants temporaires",
      paragraphs: [
        "Les services d'assistance informatique partagent souvent des identifiants initiaux lors de l'intégration de nouveaux employés. Même si les utilisateurs sont généralement invités à changer leur mot de passe à la première connexion, le mot de passe temporaire reste consultable dans l'historique de chat. Si le changement est retardé ou si le système autorise la réutilisation, ce message reste une vulnérabilité active.",
      ],
      instead:
        "Livrez les identifiants temporaires via une [note avec chiffrement dans le navigateur](blog:send-secret-message-without-account) qui expire après ouverture.",
    },
    {
      title: "Informations financières et bancaires",
      paragraphs: [
        "Coller des IBAN d'entreprise, des coordonnées bancaires, des documents fiscaux ou des confirmations de paiement dans les chats semble anodin, car un IBAN seul n'est pas un mot de passe. Mais si des attaquants combinent des données bancaires avec le contexte personnel de l'historique de chat, ils créent la base d'un phishing convaincant et de la fraude à la facturation.",
      ],
      instead:
        "Séparez les détails financiers de la communication quotidienne. Partagez-les via des canaux chiffrés qui suppriment l'accès une fois la transaction vérifiée.",
    },
    {
      title: "Scans de documents personnels",
      paragraphs: [
        "Besoin d'envoyer rapidement une copie de votre passeport, permis de conduire ou contrat de travail aux RH ? Copier un PDF dans la fenêtre de chat duplique des données d'identité très sensibles vers les sauvegardes cloud, les galeries de smartphones locales et les dossiers de bureau synchronisés.",
      ],
      instead:
        "Utilisez le [transfert sécurisé de fichiers](app:secure-file-transfer) avec chiffrement dans le navigateur : un téléchargement, puis le fichier est supprimé du serveur hôte selon vos paramètres d'accès.",
    },
    {
      title: "Informations confidentielles d'entreprise",
      paragraphs: [
        "Les présentations de stratégie interne, les propositions de prix non encore annoncées, les brouillons juridiques et les documents de fusion passent continuellement par les canaux d'équipe. Les fuites de données ne viennent pas toujours de pirates externes ; parfois elles naissent lorsqu'un employé invite accidentellement un invité externe dans un canal contenant des années de stratégie interne.",
      ],
      instead:
        "Partagez les données sensibles d'entreprise via des notes chiffrées avec des dates d'expiration automatiques strictes et des fenêtres d'accès limitées.",
    },
  ],
  lifespanTitle: "Les secrets ont une durée de vie",
  lifespanParagraphs: [
    "Le chiffrement protège les secrets en transit. **L'expiration les protège dans le temps.** La plupart des applications de chat ignorent presque entièrement cette seconde partie.",
    "Avec PrivateNote, vous modifiez la posture de sécurité par conception. Au lieu d'espérer que les utilisateurs suppriment manuellement les messages sensibles plus tard, vous imposez la durée de vie du secret. Le destinataire le lit une fois, puis il disparaît du serveur.",
  ],
  lifespanBullets: [
    "**Pas d'empreinte permanente :** Aucun historique de chat ni archive consultable ne contient le secret brut.",
    "**Cercle de dommages réduit :** Si un ordinateur portable ou un compte de chat est compromis plus tard, il n'y a pas d'anciens mots de passe dans les journaux à exploiter.",
    "**Moins d'erreurs humaines :** Le système effectue la minimisation des données automatiquement, au lieu de compter sur quelqu'un pour penser à supprimer manuellement les messages sensibles.",
  ],
  underHoodTitle: "La sécurité sous le capot : comment fonctionne PrivateNote",
  underHoodParagraphs: [
    "PrivateNote chiffre votre message directement dans votre navigateur avant l'envoi. Le serveur ne stocke que du texte chiffré. La clé de déchiffrement se trouve dans le [fragment d'URL](blog:one-time-secret-links), la partie après `#`, que les navigateurs n'envoient pas dans les requêtes HTTP vers les serveurs web. Le serveur ne reçoit jamais la clé de déchiffrement.",
    "Une fois la note ouverte selon vos paramètres, le texte chiffré est supprimé du serveur. Pour les mots de passe, clés API, codes de récupération et identifiants temporaires, **limiter la durée de vie des données est tout aussi important que chiffrer les données elles-mêmes.** Les chats conservent les conversations. PrivateNote limite la durée de vie des secrets.",
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    {
      question: "Est-il sûr d'envoyer des mots de passe dans Slack ?",
      answer:
        "Slack chiffre les données en transit et au repos, mais les mots de passe restent dans l'historique de chat consultable jusqu'à suppression. Pour des identifiants temporaires, une [note à usage unique avec chiffrement dans le navigateur](blog:send-secret-message-without-account) réduit l'exposition à long terme.",
    },
    {
      question: "Les messages WhatsApp sont-ils sûrs pour les mots de passe ?",
      answer:
        "Le chiffrement de bout en bout protège les messages en transit, et les messages éphémères peuvent les supprimer automatiquement après un délai défini. Les destinataires peuvent toujours capturer le contenu par capture d'écran, transfert ou sauvegarde avant disparition. Les mots de passe devraient idéalement être partagés seulement aussi longtemps que nécessaire : via un [lien secret à usage unique](blog:one-time-secret-links), pas via un historique de chat permanent.",
    },
    {
      question: "L'e-mail est-il plus sûr que le chat pour les mots de passe ?",
      answer:
        "Non. L'e-mail standard n'est généralement pas chiffré de bout en bout par défaut et transite par plusieurs serveurs de messagerie. Après livraison, un mot de passe reste indéfiniment dans les boîtes de réception, les dossiers envoyés, les caches locaux et les sauvegardes du fournisseur.",
    },
    {
      question: "Qu'est-ce qu'un secret à usage unique ?",
      answer:
        "Un secret à usage unique est un message qui n'est plus disponible après une seule consultation ou après un délai d'expiration défini. Cela réduit les copies permanentes à travers les systèmes. Consultez notre guide sur les [liens secrets à usage unique](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Sources",
  references: [
    "Verizon. Data Breach Investigations Report 2026 (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. Healthcare Data Breach Investigations Snapshot 2026. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Partagez des secrets sans laisser de trace dans le chat",
  closingBody: [
    "Le chat est excellent pour la coordination. Comme coffre-fort pour identifiants, clés, codes de récupération et documents qui n'auraient jamais dû exister de manière permanente, il est mal adapté.",
    "PrivateNote est conçu pour le modèle inverse : chiffrer dans le navigateur, partager un lien et faire expirer le secret une fois sa tâche accomplie. Pas de compte nécessaire pour l'expéditeur, pas de texte en clair dans une archive consultable pendant des années.",
  ],
  tagline: "Moins d'historique de chat. Moins de métadonnées. Plus de contrôle sur la durée d'existence d'un secret en ligne.",
  relatedReading: "Pour aller plus loin",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Envoyer mots de passe et notes privées sans inscription : chiffrement dans le navigateur et liens expirants expliqués.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Comment fonctionnent les liens à usage unique, pourquoi le fragment d'URL compte et quand l'expiration est préférable à l'e-mail ou Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Pourquoi les traces écrites dans l'e-mail et le chat professionnel créent des risques à long terme et quand les notes éphémères conviennent mieux.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS par rapport au chiffrement dans le navigateur : ce que chacun protège et pourquoi le serveur peut quand même lire vos données.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Créez des mots de passe forts avant de les partager via un lien à usage unique.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Une base de sécurité pratique pour mots de passe, authentification et partage sécurisé.",
    },
  ],
};
