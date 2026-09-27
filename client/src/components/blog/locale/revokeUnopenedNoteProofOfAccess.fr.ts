import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessFr: BlogGuideArticleCopy = {
  heroAlt:
    "Vue d’activité du compte avec une note non ouverte et une option claire pour révoquer le lien",
  heroCaption:
    "Changé d’avis avant l’ouverture ? Détruisez le lien. Besoin d’un reçu ? Consultez la preuve d’accès.",
  intro: [
    "Le partage sécurisé ne se limite pas au chiffrement au moment de l’envoi. Il s’agit aussi du **contrôle ensuite** : arrêter un lien que vous n’auriez pas dû envoyer, et conserver un historique respectueux de la vie privée sur ce qui est arrivé à un lien que vous avez bien envoyé.",
    "Les forfaits Starter et Business de PrivateNote ajoutent deux outils complémentaires. **Révoquer** détruit un lien non ouvert pour qu’il ne puisse plus être révélé. La **preuve d’accès** affiche une chronologie simple—créée, ouverte, pièce jointe téléchargée, détruite, expirée ou révoquée—sans exposer le contenu de la note.",
    "Ensemble, ils répondent aux deux questions de suivi que les équipes posent vraiment : « Puis-je le reprendre ? » et « Puis-je montrer que le lien a été consulté ? »",
  ],
  sections: [
    {
      title: "Révoquer tant que c’est encore non ouvert",
      takeaway:
        "La révocation agit avant la révélation—pas après qu’une copie ait déjà été déchiffrée.",
      paragraphs: [
        "Si une note n’a pas encore été ouverte, vous pouvez la révoquer depuis l’écran de succès après création ou depuis Compte → Activité. Le lien cesse de fonctionner ; les destinataires qui arrivent plus tard voient que l’accès a disparu.",
        "Révoquer est le bon geste lorsque vous avez collé le mauvais destinataire, repéré le secret dans le mauvais chat, ou décidé que la remise doit attendre. Ce n’est **pas** une suppression à distance d’un fichier déjà téléchargé après révélation—aucun outil de remise E2EE honnête ne peut le promettre.",
      ],
      checklist: [
        "Créer la note sur Starter ou Business",
        "Si quelque chose semble incorrect, révoquer immédiatement depuis l’écran de succès",
        "Ou ouvrir Compte → Activité et révoquer tant que le statut est encore non ouvert",
        "Envoyer une note de remplacement si le destinataire a encore besoin du secret",
      ],
      midCta: {
        body: "Besoin de reprises et de reçus pour des remises sensibles ?",
        button: "Créer une note révocable",
      },
    },
    {
      title: "Preuve d’accès sans fuite de contenu",
      takeaway:
        "Un enregistrement de statut respectueux de la vie privée : le lien a été consulté—pas une transcription de lecture.",
      paragraphs: [
        "La preuve d’accès est conçue pour les échanges opérationnels et de conformité qui ont besoin de preuves d’événements de livraison sans mettre des secrets dans des e-mails ou des tickets.",
        "La chronologie reste de haut niveau : créée, lien ouvert, pièce jointe téléchargée (lorsqu’elle est suivie), détruite, expirée, révoquée. Cela correspond à la posture de confidentialité des [alertes d’ouverture](blog:know-when-secret-link-opened) : le statut, pas le fond.",
      ],
      calloutTitle: "Lisez l’étiquette attentivement",
      callout:
        "La preuve d’accès est un reçu indiquant que le lien a été consulté—pas une preuve cryptographique qu’une personne précise a soigneusement lu chaque mot, et pas un DRM contre les captures d’écran.",
    },
    {
      title: "Comment révocation et preuve s’articulent",
      takeaway:
        "Empêchez l’accès quand vous le pouvez ; documentez l’accès quand vous devez.",
      comparisonTable: {
        headers: ["Situation", "Utiliser", "Résultat"],
        rows: [
          [
            "Mauvais destinataire, encore non ouverte",
            "Révoquer",
            "Le lien meurt ; créer une note corrigée",
          ],
          [
            "Remise terminée, l’auditeur demande « a-t-elle été ouverte ? »",
            "Preuve d’accès",
            "Montrer les événements de chronologie sans contenu",
          ],
          [
            "Note déjà révélée",
            "Faire tourner le secret / considérer comme exposé",
            "La révocation ne récupère plus les copies en clair",
          ],
          [
            "En attente du destinataire",
            "Alertes + durée de vie",
            "Relancer ou laisser expirer automatiquement si jamais ouverte",
          ],
        ],
      },
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Puis-je révoquer après que le destinataire a ouvert la note ?",
          answer:
            "La révocation cible les notes non ouvertes. Après révélation, partez du principe que le destinataire peut conserver ce qu’il a vu ; faites tourner les identifiants ou traitez le document comme livré.",
        },
        {
          question: "La preuve d’accès inclut-elle le texte du message ?",
          answer:
            "Non. Ce n’est qu’une chronologie de statut. Le contenu reste hors d’Activité et des vues de preuve.",
        },
        {
          question: "La révocation est-elle disponible sur Free ?",
          answer:
            "La révocation et la preuve d’accès sont des capacités Starter/Business. Les utilisateurs Free bénéficient toujours du chiffrement, de durées de vie courtes et des alertes d’ouverture une fois connectés avec un e-mail vérifié.",
        },
        {
          question: "Où retrouver la preuve plus tard ?",
          answer:
            "Ouvrez Compte → Activité, trouvez la note et choisissez Voir la preuve d’accès lorsque le forfait le permet.",
        },
      ],
    },
    {
      title: "L’essentiel",
      takeaway: "Contrôlez le lien non ouvert ; documentez celui qui a été ouvert.",
      paragraphs: [
        "Le chiffrement répond à « qui peut lire ceci en transit et au repos. » La révocation et la preuve répondent à « que faisons-nous ensuite. »",
        "Utilisez-les avec les [codes de vérification](blog:recipient-verification-code-before-reveal) et les [alertes d’ouverture](blog:know-when-secret-link-opened) pour une boucle de remise complète—de l’envoi à la confirmation, jusqu’à la reprise ou au reçu.",
      ],
    },
  ],
  ctaTitle: "Reprendre un secret non ouvert.",
  ctaBody:
    "Révoquez les liens qui ne devraient jamais s’ouvrir, et conservez une chronologie respectueuse de la vie privée lorsque vous devez montrer qu’une remise a été consultée—sans envoyer le secret par e-mail.",
  ctaButton: "Créer une note privée",
};
