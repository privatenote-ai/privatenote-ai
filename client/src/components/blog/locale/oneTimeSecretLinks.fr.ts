import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksFr: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Un **lien à usage unique** est une URL qui sert à transmettre une information sensible sans laisser le texte en clair dans une boîte mail ou un historique de discussion. Le destinataire ouvre le lien, affiche le secret dans le navigateur, puis la copie chiffrée sur le serveur devient inaccessible selon les règles d’accès et d’expiration.",
    "C’est utile pour un mot de passe, une clé API, un code de récupération, des identifiants temporaires ou un message privé qui doit arriver une fois—et n’a pas besoin d’un fil de conversation durable.",
    "Le problème n’est pas toujours l’interception. C’est la **rétention**. Le chiffrement protège l’accès. L’éphémérité réduit le temps pendant lequel des copies inutiles restent disponibles. Un lien à usage unique vise un troisième rôle : la **remise temporaire**.",
  ],
  earlyCta: {
    body: "Besoin d’envoyer un secret maintenant ?",
    linkLabel: "Créer un lien chiffré à usage unique avec PrivateNote",
  },
  sections: [
    {
      title: "Qu’est-ce qu’un lien à usage unique ?",
      paragraphs: [
        "On trouve plusieurs noms pour la même idée : lien secret, note autodestructible, lien « brûler après lecture », lien expirant. L’étiquette change. Les propriétés de sécurité ne suivent pas automatiquement le nom.",
        "Un produit vendu comme « secret à usage unique » ne garantit ni que le chiffrement a lieu dans le navigateur, ni que le fournisseur ne peut pas lire le contenu, ni que la clé reste hors du serveur, ni que la suppression suit vraiment la lecture, ni que les métadonnées disparaissent. Ce sont des choix de conception. Évaluez les propriétés, pas le slogan.",
        "Une checklist utile : où le texte en clair est-il chiffré ? Le serveur reçoit-il un jour la clé de déchiffrement ? Que se passe-t-il après la consultation prévue ? Combien de temps un lien inutilisé reste-t-il disponible ? Que récupère l’aperçu d’un chat si l’on colle l’URL ?",
      ],
    },
    {
      title: "Comment fonctionne un lien à usage unique ?",
      paragraphs: [
        "Dans une conception côté client comme celle de PrivateNote, le secret est chiffré dans le navigateur de l’expéditeur avant l’envoi. Le serveur stocke du texte chiffré. Le navigateur du destinataire le déchiffre localement. Le texte d’une note utilise AES-256-GCM via l’API Web Crypto.",
      ],
      beforeFlowSteps: "**Concrètement, le parcours complet ressemble à ceci :**",
      flowSteps: [
        {
          title: "Clé et chiffrement dans le navigateur",
          step: "Étape 1 : votre navigateur",
          body: "Vous saisissez le secret localement. Le navigateur génère le matériel cryptographique et chiffre le texte en clair avant qu’une requête réseau ne quitte l’appareil.",
        },
        {
          title: "Envoi du texte chiffré uniquement",
          step: "Étape 2 : le serveur",
          body: "Seule la charge chiffrée est envoyée. Le serveur stocke un texte qu’il ne peut pas lire, parce qu’il ne reçoit ni le clair ni la clé du fragment.",
        },
        {
          title: "La clé reste dans le lien",
          step: "Étape 3 : l’URL",
          body: "La clé de déchiffrement est placée dans le fragment d’URL—la partie après #. Le chemin public identifie la note ; le fragment reste dans le navigateur lors d’une navigation HTTPS habituelle.",
        },
        {
          title: "Afficher, déchiffrer, puis appliquer les règles d’accès",
          step: "Étape 4 : le destinataire",
          body: "Ouvrir la page ne suffit pas. Le destinataire clique pour afficher, ce qui récupère le texte chiffré. Le navigateur déchiffre localement. Après un affichage réussi, PrivateNote applique la limite de consultations—une par défaut—et supprime le texte chiffré lorsque cette limite est atteinte. Les liens inutilisés expirent aussi dans le temps.",
        },
      ],
      afterFlowSteps: [
        "Tous les produits vendus comme liens à usage unique ne suivent pas ce modèle. Certains chiffrent sur le serveur après avoir reçu votre texte, ou y génèrent la clé, ce qui permettrait au service de lire le secret. D’autres suppriment selon un calendrier mais conservent des copies récupérables. Demandez si la conception complète est réellement en place—pas seulement si le lien expire.",
        "Pour l’architecture de chiffrement de PrivateNote, y compris l’enveloppement par mot de passe avec Argon2id, voir [Comment ça marche](app:how-it-works).",
      ],
    },
    {
      title: "Pourquoi le fragment d’URL compte",
      paragraphs: [
        "Ce détail passe souvent inaperçu, et c’est le fondement de cette architecture.",
        "Lors d’une navigation HTTPS normale, le navigateur envoie le chemin et la requête au serveur. Le [fragment d’URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—tout ce qui suit #—reste dans le navigateur et n’est pas inclus dans cette requête. Un système bien conçu peut donc stocker le texte chiffré derrière un identifiant du type `/note/abc123` tout en gardant le matériel de déchiffrement dans `#…`, hors des journaux serveur ordinaires de ce chargement de page.",
        "Placer une clé après # ne rend pas une application sûre à elle seule. La cryptographie autour doit rester saine : une clé aléatoire forte, un chiffrement authentifié, et un serveur qui n’a jamais besoin du texte en clair. Le fragment sert à séparer ces pièces—ce n’est pas un raccourci autour d’elles.",
      ],
    },
    {
      title: "Lien à usage unique, lien expirant, message éphémère",
      paragraphs: [
        "Ces idées sont souvent mélangées. Ce sont des contrôles différents, et un même produit peut les combiner.",
      ],
      bullets: [
        {
          label: "Lien à usage unique",
          body: "La disponibilité dépend surtout de l’accès. Après la consultation prévue—chez PrivateNote, un affichage réussi qui atteint la limite—la charge chiffrée disparaît du serveur.",
        },
        {
          label: "Lien expirant",
          body: "La disponibilité dépend surtout du temps. Le lien reste récupérable jusqu’à l’échéance, qu’il ait été ouvert ou non.",
        },
        {
          label: "Message éphémère",
          body: "Il s’inscrit dans une conversation en cours. La rétention suit la politique du messager, qui peut encore laisser des sauvegardes, des citations ou des copies sur l’appareil.",
        },
      ],
      callout:
        "**PrivateNote combine accès et temps.** Une note commence par une consultation réussie, et expire aussi si personne ne l’ouvre—un jour par défaut, avec des durées plus courtes ou plus longues selon l’offre. C’est une remise temporaire : on récupère, ou on attend, et la copie côté serveur disparaît.",
    },
    {
      title: "Un lien à usage unique est-il sûr ?",
      paragraphs: [
        "Il peut l’être. La sécurité dépend de l’implémentation et de la façon dont le lien est envoyé—pas de l’expression « à usage unique ».",
        "Une conception sérieuse doit examiner le chiffrement côté client, la qualité des clés, ce que le serveur peut voir, l’expiration, le sens de l’accès, une protection par mot de passe optionnelle, une vérification du destinataire optionnelle, les métadonnées, la fuite du lien, la compromission des terminaux et le comportement du destinataire.",
        "PrivateNote chiffre dans le navigateur, stocke du texte chiffré, garde la clé dans le fragment d’URL, limite par défaut à un affichage et expire les notes inutilisées. Vous pouvez ajouter un mot de passe ou, sur les offres payantes, une vérification du destinataire. Le destinataire n’a pas besoin de compte.",
        "Un lien à usage unique **ne protège pas** contre un appareil compromis, un destinataire qui copie le secret après l’avoir vu, une capture d’écran ou une photo, ou l’envoi de l’URL complète—fragment compris—à la mauvaise personne. Traitez le lien entier comme la capacité d’accès.",
      ],
    },
    {
      title: "Quand utiliser un lien à usage unique ?",
      paragraphs: [
        "Quand le secret a un rôle court : arriver, servir, et cesser de vivre dans le canal utilisé pour l’envoyer.",
      ],
      subsections: [
        {
          title: "Mots de passe",
          paragraphs: [
            "Un lien à usage unique convient pour remettre un mot de passe temporaire ou nouvellement créé à une personne, sans laisser le clair dans le mail ou le chat. Pour le flux dédié, voir [comment partager un mot de passe en toute sécurité](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Clés API et jetons",
          paragraphs: [
            "Développeurs et prestataires ont souvent besoin d’une clé une seule fois. Passer par un lien évite de coller l’identifiant brut dans Slack, un ticket ou un commentaire Git. Voir [comment partager une clé API en toute sécurité](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Codes de récupération",
          paragraphs: [
            "Utile lorsqu’un code de sauvegarde ou de récupération 2FA doit vraiment aller vers une autre personne autorisée—et ne doit pas rester recherchable dans le fil qui l’a porté.",
          ],
        },
        {
          title: "Messages privés",
          paragraphs: [
            "Une information à communiquer une fois, sans devenir une conversation permanente. Le destinataire peut ouvrir la note sans créer de compte. Voir [envoyer un message secret sans compte](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Fichiers sensibles",
          paragraphs: [
            "Un fichier demande plus de soin : taille, téléchargement, aperçu, et une fenêtre d’accès distincte après l’ouverture de la note. Chez PrivateNote, envoyer un fichier exige un compte expéditeur ; le destinataire, non. Les pièces jointes restent récupérables pendant une fenêtre limitée après l’affichage—une heure par défaut. Utilisez le [transfert de fichiers sécurisé](app:secure-file-transfer) lorsque le contenu est un document plutôt qu’un secret court.",
          ],
        },
      ],
    },
    {
      title: "Quand ne pas l’utiliser ?",
      paragraphs: [
        "Le lien à usage unique est le mauvais outil lorsque le besoin est le stockage, la collaboration ou un enregistrement que vous devez conserver.",
      ],
      poorFits: [
        "Stockage durable des mots de passe : utilisez un coffre de gestionnaire de mots de passe.",
        "Conversation continue : utilisez un messager déjà partagé, par exemple Signal.",
        "Archives d’organisation à conserver pour un audit ou une obligation légale.",
        "Secrets qui n’ont pas besoin d’être transmis—générez-les sur place, ou ne les partagez pas.",
        "Phrases de récupération crypto et autres secrets maîtres irrécupérables : un lien peut encore fuir si l’URL complète est copiée. Lisez [phrases de seed crypto et liens à usage unique](blog:crypto-seed-phrase-one-time-link) avant d’appliquer ce modèle.",
      ],
    },
    {
      title: "Lien à usage unique, e-mail, messagerie et gestionnaire de mots de passe",
      paragraphs: [
        "La comparaison utile porte sur le rôle et la persistance—pas sur un classement de « ce qui est sécurisé ».",
      ],
      comparisonTable: {
        headers: [
          "Moyen",
          "Usage principal",
          "Chiffrement de bout en bout",
          "Persistance typique",
          "Adapté à une remise ponctuelle ?",
        ],
        rows: [
          [
            "E-mail",
            "Correspondance durable",
            "Le chiffrement en transit est courant ; le bout en bout n’est généralement pas le défaut",
            "Souvent conservé dans plusieurs boîtes, sauvegardes et recherches",
            "Mauvais choix pour un secret en clair",
          ],
          [
            "Slack / Teams",
            "Conversation professionnelle et recherche",
            "Chiffré en transit et au repos sur la plateforme ; pas de bout en bout par défaut",
            "Historique d’espace de travail consultable et exportable",
            "Mauvais choix pour un secret en clair ; acceptable pour envoyer un lien",
          ],
          [
            "SMS / iMessage",
            "Messagerie personnelle",
            "Très variable selon l’opérateur et la plateforme",
            "Souvent sauvegardé ou synchronisé dans le cloud",
            "Mauvais choix pour un secret en clair",
          ],
          [
            "WhatsApp",
            "Conversation privée",
            "Bout en bout pour les discussions ; les sauvegardes peuvent ne pas l’être",
            "Copies sur l’appareil et, éventuellement, dans le cloud",
            "Mieux que l’e-mail pour converser ; toujours un mauvais endroit pour poser un mot de passe",
          ],
          [
            "Signal",
            "Conversation privée",
            "Bout en bout",
            "Les messages éphémères sont configurables",
            "Une alternative raisonnable lorsque les deux parties l’utilisent déjà",
          ],
          [
            "Gestionnaire de mots de passe",
            "Stockage et partage d’identifiants",
            "Oui, par conception",
            "Conçu pour une conservation longue",
            "Excellent pour les équipes et l’accès durable ; souvent trop lourd pour une remise ponctuelle",
          ],
          [
            "PrivateNote",
            "Remise chiffrée temporaire",
            "Chiffrement côté client ; clé dans le fragment d’URL",
            "Limite de consultations plus expiration ; texte chiffré supprimé lorsque ces conditions sont réunies",
            "Conçu pour cet usage",
          ],
        ],
      },
    },
    {
      title: "Le problème de l’aperçu de lien",
      paragraphs: [
        "Beaucoup d’applications de chat récupèrent une URL entrante pour construire un aperçu—titre, description, miniature. Si le simple chargement de la page comptait comme une lecture, ce robot brûlerait le lien avant que le destinataire ne l’ouvre.",
        "PrivateNote ne traite pas un chargement de page comme une lecture. L’URL publique de la note affiche une porte « cliquer pour révéler ». Les métadonnées de cette page peuvent être récupérées sans renvoyer le texte en clair. Le texte chiffré n’est demandé qu’après une action explicite d’affichage. Un aperçu Slack, Teams ou iMessage ne reçoit donc pas le secret, et ne consomme pas la limite de consultations.",
        "C’est un choix de conception du client et de l’API, pas une liste d’agents utilisateurs bloqués. La façon d’envoyer le lien reste importante : quiconque a l’URL complète, fragment compris, et clique pour afficher, peut lire la note. Pour l’avertissement côté destinataire, voir [pourquoi les notes attendent un clic pour s’afficher](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Comment créer un lien à usage unique",
      paragraphs: ["Gardez les étapes courtes. L’outil chiffre ; vous choisissez les règles d’accès."],
      numberedSteps: [
        { title: "Ouvrir PrivateNote", body: "Utilisez l’éditeur sur le site—aucun compte n’est requis pour une note texte." },
        { title: "Saisir ce que vous devez partager", body: "Un mot de passe, un message, une clé API ou, avec un compte, un fichier." },
        {
          title: "Choisir l’expiration et l’accès",
          body: "Préférez la durée la plus courte qui reste pratique. Par défaut : une consultation et une expiration d’un jour si inutilisé. Ajoutez un mot de passe ou une vérification du destinataire si la sensibilité le justifie.",
        },
        { title: "Créer le lien chiffré", body: "Le navigateur chiffre d’abord, puis envoie le texte chiffré." },
        { title: "Envoyer le lien au destinataire prévu", body: "Ne collez pas le texte en clair à côté." },
      ],
      closingNote: "Quand vous êtes prêt, [créez un lien à usage unique](app:one-time-link).",
    },
    {
      title: "Avant d’envoyer un secret",
      paragraphs: ["Une remise soignée est surtout opérationnelle. La cryptographie ne corrige pas un mauvais destinataire."],
      checklist: [
        "Confirmez le destinataire avant d’envoyer l’URL complète.",
        "Choisissez l’expiration la plus courte possible.",
        "Ajoutez un mot de passe ou une vérification du destinataire si la sensibilité le justifie.",
        "Envoyez tout facteur d’authentification supplémentaire par un autre canal.",
        "Faites tourner les identifiants temporaires après usage.",
        "Ne transmettez pas de secrets qui n’ont pas besoin de bouger.",
        "Souvenez-vous que le destinataire peut copier, photographier ou capturer ce qu’il voit.",
      ],
    },
    {
      title: "Questions fréquentes",
      paragraphs: [],
      faqs: [
        {
          question: "Qu’est-ce qu’un lien à usage unique ?",
          answer:
            "Une URL qui livre un secret à récupérer, puis rend la copie chiffrée côté serveur inaccessible selon des règles d’accès et d’expiration—pour que le texte en clair n’ait pas à vivre dans l’e-mail ou le chat.",
        },
        {
          question: "Comment envoyer un mot de passe par un lien sécurisé ?",
          answer:
            "Placez le mot de passe dans la note, pas dans le message qui transporte le lien. Des conseils de canaux séparés se trouvent dans [comment partager un mot de passe en toute sécurité](blog:how-to-share-a-password-securely).",
        },
        {
          question: "Un lien à usage unique est-il plus sûr que l’e-mail ?",
          answer:
            "Pour le secret lui-même, oui, parce que l’e-mail conserve le texte en clair. Le lien peut quand même voyager par e-mail ; la boîte contient alors une URL, pas l’identifiant.",
        },
        {
          question: "Que se passe-t-il après l’ouverture du lien ?",
          answer:
            "Chez PrivateNote, un affichage réussi compte comme une consultation. Avec la limite par défaut d’une consultation, le serveur supprime ensuite le texte chiffré. Le contenu peut rester visible dans le navigateur déjà ouvert. Les liens inutilisés expirent aussi dans le temps.",
        },
        {
          question: "Le destinataire a-t-il besoin d’un compte ?",
          answer:
            "Non. Quiconque a le lien complet peut ouvrir une note non protégée. Un mot de passe ou une vérification ne s’applique que si l’expéditeur l’a activé.",
        },
        {
          question: "Peut-on envoyer un fichier avec un lien à usage unique ?",
          answer:
            "Oui, via le [transfert de fichiers sécurisé](app:secure-file-transfer) de PrivateNote. L’envoi exige un compte gratuit ; l’ouverture, non. Après l’affichage, les pièces jointes suivent une fenêtre d’accès distincte—une heure par défaut.",
        },
        {
          question: "Quelle différence entre un lien à usage unique et un lien qui expire ?",
          answer:
            "L’usage unique porte sur l’accès : indisponible après la consultation prévue. L’expiration porte sur le temps : indisponible après l’échéance, même sans ouverture. PrivateNote utilise les deux.",
        },
        {
          question: "Peut-on faire une capture d’écran d’un secret à usage unique ?",
          answer:
            "Oui. Une fois le contenu à l’écran, il peut être copié, photographié ou capturé. Un lien à usage unique limite la copie originale sur le serveur ; ce n’est pas un DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Type de canal",
    encrypted: "Chiffré ?",
    persistent: "Persistant ?",
    verdict: "Adapté aux secrets ponctuels ?",
  },
  goodFitsLabel: "Bons usages",
  poorFitsLabel: "Mauvais usages",
  closingTitle: "Où PrivateNote s’inscrit",
  closingBody:
    "PrivateNote est un outil de remise. Ce n’est ni un coffre de mots de passe à long terme, ni un wiki d’équipe, ni une archive de conformité. Chiffrez dans le navigateur, partagez un lien temporaire, et laissez la copie côté serveur disparaître une fois le travail fait.",
  encryptLu: "",
  tagline: "Faites correspondre la durée de vie du secret à celle du support qui le transporte.",
  relatedReading: "Pour aller plus loin",
  ctaTitle: "Créer un lien à usage unique",
  ctaBody: "Chiffrez un message, un mot de passe ou un fichier dans votre navigateur et partagez-le par un lien temporaire.",
  ctaButton: "Créer un lien sécurisé",
};
