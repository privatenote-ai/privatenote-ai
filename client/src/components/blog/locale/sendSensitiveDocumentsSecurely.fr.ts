import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyFr: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Concept de transfert sécurisé de documents : une enveloppe scellée et une remise de fichier chiffré sur un bureau calme",
  heroCaption:
    "La partie difficile n'est presque jamais le bouton d'envoi. C'est ce qui arrive à chaque copie après l'arrivée du document.",
  intro: [
    "Imaginez que vous devez envoyer votre passeport à une banque, que votre comptable vous demande des documents fiscaux, que votre employeur exige une preuve d'identité, ou qu'un client a besoin d'un contrat signé.",
    "La tâche elle-même ne prend que quelques secondes : joindre le fichier, cliquer sur Envoyer, poursuivre sa journée. Le transfert est rarement le point le plus faible du processus. Le vrai problème commence après l'arrivée du document.",
    "Cette pièce jointe peut rester dans des boîtes de réception, des sauvegardes cloud, des appareils synchronisés, des boîtes mail archivées et de vieilles conversations de chat pendant des années. Dans de nombreux cas, le plus grand risque pour la vie privée n'est pas l'interception en transit — c'est que des copies continuent d'exister longtemps après que le document a rempli son rôle.",
    "Ce guide explique pourquoi le partage traditionnel de documents est souvent insuffisant, ce que signifie réellement le partage sécurisé de documents, et comment [le chiffrement côté navigateur](blog:encrypted-vs-secure-file-sharing) et [les liens à usage unique](blog:one-time-secret-links) vous aident à garder les informations confidentielles privées.",
  ],
  sections: [
    {
      title: "Pourquoi les documents confidentiels méritent un traitement différent",
      takeaway:
        "Si un document serait difficile à remplacer — ou douloureux à voir fuiter —, ne le traitez pas comme une photo de vacances.",
      paragraphs: [
        "Tous les fichiers ne méritent pas le même niveau de protection. Perdre une photo de vacances en ligne peut être décevant. Perdre un document confidentiel peut avoir des conséquences qui durent des années.",
        "Les documents d'identité contiennent souvent votre nom complet, votre date de naissance, votre numéro d'identification, votre nationalité, votre signature et votre photo. Les documents financiers révèlent les revenus, l'épargne, les informations fiscales ou les coordonnées bancaires. Les documents médicaux contiennent des informations profondément personnelles, tandis que les contrats incluent souvent des détails commercialement sensibles qui n'étaient jamais destinés à devenir publics.",
        "Si quelqu'un découvre votre mot de passe, vous le changez. Si quelqu'un copie votre passeport, votre carte d'identité nationale, votre déclaration d'impôts ou votre contrat de travail, la situation est bien plus compliquée. C'est pourquoi les documents confidentiels méritent une approche différente de la communication quotidienne.",
      ],
    },
    {
      title: "Le problème caché de l'e-mail",
      takeaway: "TLS protège le trajet ; il n'empêche pas les copies permanentes de s'accumuler par la suite.",
      paragraphs: [
        "L'e-mail reste l'un des outils de communication les plus utiles jamais créés. Il n'a jamais été conçu comme un système sécurisé de remise de documents.",
        "Les fournisseurs de messagerie modernes protègent les messages en transit avec des connexions chiffrées telles que TLS. Une fois le message arrivé, la pièce jointe est généralement stockée afin de pouvoir être recherchée, synchronisée, filtrée, sauvegardée et récupérée plus tard.",
        "Une seule pièce jointe devient rapidement plusieurs copies : votre dossier Envoyés, la boîte de réception du destinataire, des téléphones, des ordinateurs portables, des archives d'entreprise, des sauvegardes cloud, et parfois des systèmes de transfert automatique. Supprimer l'e-mail plus tard n'élimine que rarement chaque copie.",
        "Pour les conversations quotidiennes, c'est généralement acceptable. Pour les passeports, les contrats, les relevés financiers ou les rapports médicaux, ça ne l'est souvent pas. Pour un examen plus approfondi de la question, voir [pourquoi l'e-mail est le pire endroit pour les secrets](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Pourquoi les applications de messagerie laissent une trace permanente",
      takeaway: "Le chat facilite la collaboration — et rend la conservation des documents accidentelle.",
      paragraphs: [
        "Beaucoup de gens évitent l'e-mail et envoient plutôt des documents confidentiels via Slack, Microsoft Teams, WhatsApp, Signal, Telegram ou Discord. Ces plateformes résolvent la collaboration. Elles ne résolvent pas la gestion du cycle de vie des documents.",
        "Les fichiers partagés en chat restent souvent consultables pendant des mois ou des années, se synchronisent sur plusieurs appareils, entrent dans des sauvegardes automatiques et sont téléchargés sur des ordinateurs personnels. Même une fois la conversation oubliée, les documents subsistent souvent.",
        "Le plus grand risque pour la vie privée n'est souvent pas l'interception par des pirates. C'est que des informations confidentielles accumulent silencieusement des copies que personne n'avait l'intention de conserver. Le même schéma apparaît quand des équipes [collent des secrets dans le chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Le stockage cloud résout un autre problème",
      takeaway:
        "Les disques cloud sont conçus pour un accès durable ; la remise temporaire a besoin d'une expiration dès la conception.",
      paragraphs: [
        "Des services comme Google Drive, OneDrive, Dropbox et iCloud sont excellents pour la collaboration, les sauvegardes et le stockage à long terme. La remise sécurisée de documents est un problème différent.",
        "Si plusieurs collègues ont besoin d'un accès continu aux mêmes fichiers, le stockage cloud est le bon outil. Si vous voulez simplement qu'une seule personne reçoive un document confidentiel aujourd'hui — et que vous n'avez plus besoin qu'il soit disponible le mois prochain —, les exigences sont totalement différentes.",
        "Les liens de partage permanents restent souvent dans l'historique du navigateur, de vieux e-mails, des documents de projet, des messages de chat et des favoris longtemps après que tout le monde suppose qu'ils ont disparu. Le stockage cloud optimise la disponibilité à long terme plutôt que la remise temporaire.",
      ],
    },
    {
      title: "Le partage sécurisé de documents va au-delà du chiffrement",
      takeaway: "Le chiffrement protège les données ; les contrôles de cycle de vie déterminent combien de temps dure l'exposition.",
      paragraphs: [
        "Quand les gens entendent « partage sécurisé de documents », ils pensent souvent uniquement au chiffrement. Le chiffrement est essentiel. Ce n'est pas toute l'histoire.",
        "Le partage sécurisé consiste à réduire l'exposition inutile pendant toute la durée de vie d'un document. Un système bien conçu devrait répondre à : Seul le destinataire prévu peut-il accéder au document ? L'accès expire-t-il automatiquement ? Les copies inutiles sont-elles évitées ? Le service reçoit-il le document original ou seulement des données chiffrées ?",
        "La sécurité ne consiste pas seulement à protéger un fichier en transit. Il s'agit de limiter qui peut y accéder — et pendant combien de temps.",
      ],
    },
    {
      title: "E-mail contre lien chiffré à usage unique",
      takeaway:
        "L'e-mail est conçu pour conserver les messages ; les liens chiffrés à usage unique sont conçus pour livrer un document, puis cesser de le conserver.",
      comparisonTable: {
        headers: ["", "Pièce jointe e-mail", "Lien chiffré à usage unique"],
        rows: [
          ["Facilité d'envoi", "Très élevée", "Élevée"],
          [
            "Copies créées",
            "Nombreuses (envoyés, boîte de réception, appareils, sauvegardes)",
            "Bien moins nombreuses, par conception",
          ],
          ["Durée d'accès", "Souvent illimitée", "Expire ou s'autodétruit après usage"],
          [
            "Ce que voit le service",
            "Généralement le fichier original",
            "Du texte chiffré si chiffré d'abord dans le navigateur",
          ],
          [
            "Idéal pour",
            "Courrier quotidien non sensible",
            "Passeports, contrats, documents fiscaux et d'identité",
          ],
        ],
        after: [
          "**Résumé express :** Pièce jointe e-mail = envoi facile, copies pouvant durer des années. Lien chiffré à usage unique = chiffrement dans le navigateur avant l'envoi, accès qui expire, bien moins de copies restantes.",
        ],
      },
    },
    {
      title: "Le chiffrement dans le navigateur réduit la confiance nécessaire",
      takeaway: "Chiffrez avant l'envoi pour que le service stocke du texte chiffré — pas votre document original.",
      paragraphs: [
        "Les plateformes de partage de fichiers traditionnelles reçoivent généralement votre document original avant de le stocker ou de le traiter. Le chiffrement basé sur le navigateur fonctionne différemment.",
        "Avant que le fichier ne quitte votre ordinateur, votre navigateur le chiffre localement. Le service stocke du texte chiffré plutôt que le document original. Sans la clé de déchiffrement correspondante, les données stockées sont incompréhensibles.",
        "Plutôt que de dépendre entièrement du fournisseur après réception de votre document, vous réduisez dès le départ les informations disponibles pour ce fournisseur. Le guide de PrivateNote sur [le chiffrement contre le partage sécurisé de fichiers](blog:encrypted-vs-secure-file-sharing) détaille ce modèle.",
      ],
    },
    {
      title: "Les liens à usage unique réduisent l'exposition à long terme",
      takeaway: "La plupart des fuites sont un accès laissé qui subsiste — pas du piratage hollywoodien.",
      paragraphs: [
        "De nombreuses fuites de documents surviennent parce que d'anciens documents continuent d'exister : pièces jointes e-mail dans les boîtes de réception, liens cloud qui fonctionnent encore, historiques de chat qui conservent d'anciens fichiers.",
        "Les liens à usage unique adoptent une approche différente. Le destinataire récupère le document une seule fois. Ensuite, les données chiffrées sont supprimées ou le lien de partage expire définitivement.",
        "Aucun dossier partagé oublié. Aucun lien de téléchargement vieux de plusieurs années. Aucun document confidentiel attendant silencieusement d'être découvert.",
        "Aucune technologie ne peut empêcher un destinataire autorisé d'enregistrer intentionnellement une copie après avoir ouvert le document. Ce que le partage à usage unique accomplit, c'est éliminer bon nombre des copies inutiles créées par les outils traditionnels.",
      ],
      calloutTitle: "Règle de base",
      callout:
        "Si vous ne seriez pas à l'aise de publier un document sur un site web public, réfléchissez bien avant de l'envoyer en pièce jointe permanente par e-mail.",
    },
    {
      title: "Une couche supplémentaire : le partage protégé par mot de passe",
      takeaway: "Séparez le lien du mot de passe afin qu'une seule erreur n'expose pas les deux.",
      paragraphs: [
        "Parfois, même le lien de partage mérite une protection — un e-mail transféré par accident, un historique de navigateur visible, ou un compte de messagerie compromis.",
        "Ajouter un mot de passe crée une couche supplémentaire. Même si quelqu'un découvre le lien de partage, il ne peut toujours pas déchiffrer le document sans le mot de passe.",
        "Pour les informations particulièrement sensibles, communiquez le mot de passe par un canal différent — téléphone ou en personne — plutôt que dans le même message que le lien. Le même principe s'applique lorsque vous [partagez un mot de passe en toute sécurité](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Le partage sécurisé de documents en Europe et au-delà",
      takeaway: "Le RGPD ne nomme aucun produit — mais limiter l'accès et la conservation correspond à son esprit.",
      paragraphs: [
        "Partout en Europe, les organisations traitent des informations personnelles dans le cadre du RGPD. Il n'impose pas de service de partage de fichiers spécifique, mais il exige des mesures techniques et organisationnelles appropriées selon le risque.",
        "Le partage chiffré, la disponibilité limitée et un nombre réduit de copies inutiles sont des exemples concrets de ces principes. Les mêmes idées s'appliquent que vous envoyiez des documents à un comptable, un employeur, un avocat, une université, un prestataire de santé, une banque, un assureur ou une autorité publique.",
      ],
    },
    {
      title: "Quand devez-vous utiliser le partage sécurisé de documents ?",
      takeaway: "Si le fait que ce document devienne public aurait de l'importance, ne l'envoyez pas en pièce jointe permanente.",
      paragraphs: [
        "Cela inclut les passeports, cartes d'identité nationales, permis de conduire, relevés financiers, documents fiscaux, demandes de prêt immobilier, contrats de travail, documents d'assurance, accords juridiques, rapports médicaux, informations commerciales confidentielles, données de recherche, informations clients et propriété intellectuelle.",
        "Plus un document serait difficile à remplacer — ou plus les conséquences d'une exposition seraient graves —, plus il doit être partagé avec précaution.",
      ],
    },
    {
      title: "Des moyens concrets de réduire les risques",
      takeaway: "La sécurité parfaite n'existe pas ; moins de copies et un accès plus court aident presque toujours.",
      paragraphs: [
        "Avant d'envoyer un document confidentiel, parcourez cette courte liste de vérification :",
      ],
      checklist: [
        "Vérifiez le destinataire — bonne personne, bonne adresse ou bon canal",
        "N'envoyez que le nécessaire — les pages requises, pas tout le dossier si possible",
        "Utilisez un lien expirant ou à usage unique — pas une pièce jointe permanente",
        "Ajoutez un mot de passe pour les fichiers hautement sensibles — et partagez-le sur un canal séparé",
        "Confirmez la livraison, puis faites le ménage — supprimez les copies locales et de boîte de réception dont vous n'avez plus besoin",
      ],
      paragraphsAfterChecklist: [
        "Réduire le nombre de copies est l'une des améliorations de confidentialité les plus simples et les plus efficaces que quiconque puisse apporter.",
      ],
      midCta: {
        body: "Prêt à envoyer un scan de passeport, un contrat ou un dossier fiscal sans laisser de trace permanente dans un e-mail ?",
        button: "Démarrer un transfert de fichier sécurisé",
      },
    },
    {
      title: "Questions fréquentes",
      takeaway: "Le chiffrement aide ; l'expiration et la réduction des copies terminent le travail.",
      faqs: [
        {
          question: "Protéger un PDF par mot de passe est-il suffisant ?",
          answer:
            "Cela aide, mais ne résout pas le problème de persistance. Le PDF chiffré peut rester des années dans des archives e-mail, des sauvegardes cloud et des téléchargements. Combinez le chiffrement avec une remise expirante ou à usage unique.",
        },
        {
          question: "Le HTTPS n'est-il pas déjà sécurisé ?",
          answer:
            "HTTPS protège les données en transit. Il n'empêche pas nécessairement le service destinataire d'accéder au fichier ou de le stocker par la suite. Le chiffrement basé sur le navigateur chiffre avant l'envoi.",
        },
        {
          question: "Qu'en est-il des fichiers ZIP chiffrés ?",
          answer:
            "Raisonnable si vous utilisez un chiffrement fort et communiquez le mot de passe séparément — mais ils laissent quand même des fichiers permanents dans les systèmes de messagerie, sauf si la méthode de partage limite aussi la durée de disponibilité du fichier.",
        },
        {
          question: "Le partage sécurisé peut-il empêcher le destinataire d'enregistrer le document ?",
          answer:
            "Non. Une fois qu'une personne a légitimement reçu un document, elle peut l'enregistrer, l'imprimer ou photographier l'écran. Le partage sécurisé réduit l'exposition inutile avant et après la livraison ; il ne peut pas empêcher les actions intentionnelles de destinataires de confiance.",
        },
      ],
    },
    {
      title: "Partager des documents confidentiels avec PrivateNote",
      takeaway:
        "PrivateNote est conçu pour la remise temporaire de documents chiffrés — pas pour le stockage cloud permanent.",
      paragraphs: [
        "PrivateNote a été conçu autour d'une observation simple : de nombreux documents confidentiels n'ont besoin d'exister en ligne que le temps qu'un seul destinataire les récupère.",
        "Plutôt que de traiter le partage de documents comme un stockage permanent, PrivateNote chiffre les fichiers dans votre navigateur avant l'envoi et ne stocke que le texte chiffré résultant. Vous pouvez choisir une expiration automatique, créer des liens à usage unique et, si nécessaire, protéger le document par un mot de passe supplémentaire via [le transfert de fichier sécurisé](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["Ce que fait PrivateNote", "Ce qu'il ne fait pas"],
        rows: [
          [
            "Chiffre dans votre navigateur avant l'envoi",
            "Lire votre document original sur le serveur",
          ],
          [
            "Utilise des clés cryptographiques séparées pour le texte de la note, les fichiers et les métadonnées",
            "Mélanger ces éléments sous une seule clé réutilisable",
          ],
          [
            "Utilise un chiffrement authentifié AES-256-GCM, avec une politique (expiration / limites d'accès) liée au texte chiffré",
            "Se fier à un « chiffrement » qui ignore qui peut ouvrir la note ou pendant combien de temps",
          ],
          [
            "Prend en charge les liens à usage unique et expirants pour limiter l'accès résiduel",
            "Garder les documents disponibles indéfiniment par défaut, par commodité",
          ],
          [
            "Vous permet d'ajouter un mot de passe optionnel comme second facteur pour le lien",
            "Empêcher un destinataire autorisé de l'enregistrer ou de l'imprimer après l'avoir ouvert",
          ],
          [
            "Réduit les copies en ligne inutiles avant et après la livraison",
            "Remplacer le processus organisationnel, le jugement du destinataire ou le stockage sécurisé à long terme",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Cette approche ne peut pas empêcher un destinataire autorisé d'enregistrer une copie après avoir ouvert le document — aucune technologie ne le peut. Ce qu'elle réduit, c'est le nombre de copies inutiles qui restent en ligne avant et après la livraison.",
      ],
    },
    {
      title: "Réflexions finales",
      takeaway:
        "Le meilleur contrôle est souvent la durée de vie la plus courte — seulement les personnes qui en ont besoin, seulement le temps qu'il faut.",
      paragraphs: [
        "Internet a rendu le partage de documents presque sans effort. Il a aussi rendu leur conservation indéfinie remarquablement facile.",
        "La plupart des documents confidentiels n'ont pas besoin de rester accessibles pendant des mois ou des années. Ils doivent simplement atteindre le destinataire prévu en toute sécurité.",
        "Choisir une méthode qui chiffre avant l'envoi, limite les copies inutiles et supprime les données une fois qu'elles ont rempli leur rôle est l'une des façons les plus simples d'améliorer la confidentialité — sans rendre le partage quotidien de documents beaucoup plus difficile.",
        "La mesure de sécurité la plus forte n'est pas toujours la cryptographie la plus sophistiquée. Parfois, il suffit simplement de s'assurer qu'un document confidentiel n'existe que pour les personnes qui en ont besoin, et seulement le temps qu'elles en ont besoin.",
      ],
    },
  ],
  ctaTitle: "Envoyez le document. Gardez le contrôle des copies.",
  ctaBody:
    "Chiffrez un fichier dans votre navigateur, définissez une expiration ou une ouverture unique, et partagez un lien — pas une pièce jointe permanente qui vivra pour toujours dans la boîte de réception de quelqu'un.",
  ctaButton: "Transférer un fichier en toute sécurité",
};
