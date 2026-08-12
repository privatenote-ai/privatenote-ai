import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedFr: BlogGuideArticleCopy = {
  heroAlt:
    "Panneau de notifications affichant une alerte d’ouverture de note sans aucun contenu de message visible",
  heroCaption:
    "Statut uniquement : ouverte, détruite, expirée ou révoquée—jamais le secret lui-même.",
  intro: [
    "Après l’envoi d’un lien sensible, la question naturelle est : **l’ont-ils déjà ouvert ?** Attendre en silence est stressant ; relancer dans le chat ne fait qu’ajouter du bruit en clair.",
    "PrivateNote peut vous notifier lorsque l’état de livraison change—par e-mail, via des alertes en direct dans l’onglet tant que le site est ouvert, et optionnellement via des notifications du navigateur—sans jamais envoyer le contenu de la note par e-mail.",
    "Cette visibilité vous aide à faire tourner des identifiants, révoquer des liens non ouverts, ou simplement cesser de vous demander si la remise est bien arrivée.",
  ],
  sections: [
    {
      title: "Ce que vous pouvez savoir (et ce que vous ne pouvez pas)",
      takeaway: "Les alertes concernent les événements de cycle de vie, pas le texte du message.",
      paragraphs: [
        "Les événements typiques incluent note ouverte, détruite, expirée, pièce jointe téléchargée et révoquée. Le libellé reste volontairement grossier : assez pour une confiance opérationnelle, pas un flux de surveillance du comportement de lecture.",
        "Le modèle de confidentialité de PrivateNote s’applique toujours. Les e-mails de statut et les toasts **n’incluent pas** le secret déchiffré. Si vous avez besoin d’un reçu structuré pour une piste d’audit, utilisez la **preuve d’accès** sur les forfaits éligibles—décrite dans [révoquer et preuve d’accès](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Signal", "Où cela apparaît", "Utile pour"],
        rows: [
          [
            "Alertes e-mail (compte vérifié)",
            "L’e-mail de votre compte",
            "Confirmation asynchrone lorsque vous n’êtes pas sur le site",
          ],
          [
            "Alertes en direct dans l’onglet (connecté)",
            "PrivateNote ouvert dans un navigateur",
            "Conscience quasi temps réel pendant une remise active",
          ],
          [
            "Notifications du navigateur (permission requise)",
            "Permission OS demandée depuis Personnaliser",
            "Alerte lorsque l’onglet est en arrière-plan",
          ],
          [
            "Compte → Activité (selon le forfait)",
            "Votre historique d’activité privé",
            "Revoir plus tard ce qui s’est passé",
          ],
        ],
      },
    },
    {
      title: "Comment activer les alertes",
      takeaway:
        "Connectez-vous, vérifiez l’e-mail, puis activez les alertes par note ou dans les préférences.",
      checklist: [
        "Connectez-vous et vérifiez l’e-mail de votre compte",
        "Activez les notifications e-mail dans Compte → Préférences",
        "Lors de la création d’une note, ouvrez Personnaliser → Alertes par e-mail",
        "Choisissez notifier à l’ouverture, ou à l’ouverture et à la destruction (pour les flux à lecture unique)",
        "Autorisez les notifications du navigateur si vous voulez des alertes au niveau de l’OS",
        "Gardez PrivateNote ouvert pour les toasts en direct dans l’onglet pendant les remises critiques",
      ],
      paragraphsAfterChecklist: [
        "Les notifications d’ouverture sont disponibles pour les utilisateurs Free connectés une fois l’e-mail vérifié ; un suivi plus riche comme les événements de téléchargement de pièce jointe et les outils de révocation s’étend sur les forfaits payants.",
        "Pour le modèle de remise sous-jacent, voir [comment créer une note privée](blog:how-to-make-a-private-note) et [envoyer un message secret sans compte](blog:send-secret-message-without-account) pour les destinataires.",
      ],
      midCta: {
        body: "Vous envoyez un secret urgent et avez besoin de confirmer qu’il est arrivé ?",
        button: "Créer une note avec alertes d’ouverture",
      },
    },
    {
      title: "Utiliser les alertes de façon opérationnelle",
      takeaway:
        "Traitez « ouverte » comme un signal pour faire tourner ou clôturer—pas comme une preuve de lecture attentive.",
      bullets: [
        "Remise de mot de passe : à l’ouverture, faites tourner ou confirmez que le destinataire a changé l’identifiant",
        "Envoi de document : ouverte + pièce jointe téléchargée (si disponible) signifie que la fenêtre fichier est active",
        "Pas d’ouverture avant expiration : relancez sur un autre canal, ou révoquez si encore non ouverte",
        "Ouverture inattendue : supposez que le lien peut être compromis ; révoquez si possible et renvoyez",
      ],
      calloutTitle: "Limite honnête",
      callout:
        "« Ouverte » signifie que le flux de révélation a progressé—pas qu’un humain a lu soigneusement chaque ligne, et pas que les captures d’écran étaient impossibles.",
    },
    {
      title: "Attentes en matière de confidentialité",
      takeaway: "Surveiller la livraison ne doit pas recréer un e-mail du secret.",
      paragraphs: [
        "Les équipes abusent parfois des accusés de lecture comme surveillance de productivité. La conception de PrivateNote garde les alertes minimales : libellés de statut et références, pas de dumps de contenu.",
        "Cela correspond à la promesse produit ailleurs—chiffrement côté navigateur, [concepts de chiffrement de bout en bout](blog:what-is-end-to-end-encryption), et ne jamais remettre le secret dans l’e-mail juste pour prouver qu’il est arrivé.",
      ],
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "L’alerte inclura-t-elle le texte de ma note ?",
          answer:
            "Non. Les alertes e-mail et en direct décrivent uniquement le statut. Le contenu du message reste hors des canaux de notification.",
        },
        {
          question: "Dois-je garder l’onglet ouvert ?",
          answer:
            "Les alertes e-mail fonctionnent sans l’onglet. Les toasts en direct dans l’onglet nécessitent le site ouvert ; les notifications du navigateur aident lorsque l’onglet est en arrière-plan et que la permission est accordée.",
        },
        {
          question: "Les destinataires peuvent-ils voir que j’ai activé les alertes ?",
          answer:
            "Les destinataires se concentrent sur l’ouverture et la révélation de la note. Les paramètres de notification côté expéditeur ne font pas partie de la charge utile secrète qu’ils déchiffrent.",
        },
        {
          question: "Et si je dois stopper l’accès après l’envoi ?",
          answer:
            "Si la note est encore non ouverte, révoquez le lien depuis l’écran de succès ou l’activité du compte sur les forfaits éligibles. Détails dans [révoquer et preuve d’accès](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "En résumé",
      takeaway: "Clôturez la boucle sans copier le secret dans une autre boîte de réception.",
      paragraphs: [
        "Savoir quand un lien a été ouvert vous permet de terminer l’histoire opérationnelle : faire tourner, relancer ou révoquer.",
        "Activez le canal d’alerte qui correspond à votre façon de travailler—e-mail pour l’asynchrone, alertes en direct pour les remises en direct—et laissez le texte en clair là où il doit être : dans la note chiffrée.",
      ],
    },
  ],
  ctaTitle: "Envoyez le secret. Recevez le statut.",
  ctaBody:
    "Activez les alertes d’ouverture et de destruction pour savoir quand une remise PrivateNote avance—sans mettre le message dans l’e-mail.",
  ctaButton: "Créer une note avec alertes",
};
