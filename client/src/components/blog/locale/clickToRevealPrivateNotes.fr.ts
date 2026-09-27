import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesFr: BlogGuideArticleCopy = {
  heroAlt:
    "Vue destinataire d'un écran de révélation PrivateNote avec un avertissement clair « Ouvrir quand vous êtes prêt » avant le déchiffrement",
  heroCaption:
    "La révélation est intentionnelle : le destinataire choisit quand déchiffrer—et quand la politique de destruction peut s'appliquer.",
  intro: [
    "Ouvrir une note à usage unique doit être un acte délibéré. PrivateNote affiche donc une porte **cliquer pour révéler** avec un avertissement explicite avant le début du déchiffrement.",
    "Le lien peut arriver tôt. Le texte chiffré peut rester chiffré jusqu'à ce que quelqu'un soit prêt. Le déchiffrement et la consommation n'ont lieu qu'après que le destinataire confirme **Révéler la note**, avec un texte qui rend la conséquence claire : n'ouvrir que lorsque vous êtes prêt—cela ne peut pas être annulé.",
    "Cette pause est volontaire. Elle réduit les révélations accidentelles dues aux aperçus de liens, aux mauvais taps ou à l'ouverture sur le mauvais appareil avant d'être prêt à consommer une note à usage unique.",
  ],
  sections: [
    {
      title: "Une étape de confirmation, pas un déverrouillage programmé",
      takeaway:
        "Le destinataire choisit quand révéler ; le serveur ne déverrouille pas la note selon un calendrier.",
      paragraphs: [
        "Il n'existe pas aujourd'hui de commutateur « déverrouiller cette note mardi prochain à 09:00 » dans le produit. À la place, PrivateNote sépare la **livraison** de l'**ouverture**.",
        "Vous pouvez envoyer le lien dès que la coordination l'exige. Le destinataire peut attendre d'être devant un écran privé, d'avoir un code de vérification ou une phrase secrète prêt, et d'être préparé à une ouverture unique. Le secret reste scellé jusqu'à cette action consciente.",
        "Les contrôles de timing associés restent importants : durée de vie de la note (combien de temps le lien fonctionne s'il n'est jamais ouvert) et fenêtres de téléchargement des pièces jointes (combien de temps les fichiers restent récupérables après ouverture). Ceux-ci limitent la disponibilité ; le cliquer-pour-révéler limite *quand le déchiffrement commence*.",
      ],
    },
    {
      title: "Pourquoi les ouvertures accidentelles coûtent cher",
      takeaway:
        "Les notes à usage unique punissent autant la curiosité que les mauvais taps.",
      paragraphs: [
        "Si une note est configurée pour une seule vue, la première révélation réussie peut détruire tout accès ultérieur. L'ouvrir sur l'écran de verrouillage d'un téléphone, un ordinateur partagé ou un café en Wi-Fi public peut gaspiller la seule vue—ou exposer le contenu au mauvais endroit.",
        "L'écran de révélation impose une pause. Combiné aux [codes de vérification destinataire](blog:recipient-verification-code-before-reveal), vous obtenez deux étapes délibérées avant l'apparition du texte en clair.",
      ],
      calloutTitle: "Texte produit, par conception",
      callout:
        "« Ouvrez-la seulement lorsque vous êtes prêt — cette action est irréversible. » n'est pas du marketing creux. C'est la rampe de sécurité des workflows de destruction à l'ouverture.",
    },
    {
      title: "Comment fonctionne le parcours destinataire",
      takeaway: "Arriver sur le lien → vérifier (optionnel) → révéler → déchiffrer localement.",
      checklist: [
        "Ouvrir l'URL PrivateNote complète",
        "Saisir un code de vérification si l'expéditeur en a exigé un",
        "Lire l'avertissement de révélation",
        "Appuyer sur Révéler la note seulement lorsque vous êtes prêt",
        "Le déchiffrement a lieu dans le navigateur ; suivre ensuite toute politique d'ouverture/destruction",
      ],
      paragraphsAfterChecklist: [
        "Les expéditeurs peuvent renforcer la pause avec une instruction claire : « J'envoie le lien maintenant ; ne le révélez pas avant d'être en appel. » L'écran de confirmation soutient cette instruction, mais ne programme ni n'impose techniquement une heure d'ouverture future.",
        "Pour le modèle à usage unique plus large, voir [liens secrets à usage unique](blog:one-time-secret-links) et [comment créer une note privée](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Envoyez une note que le destinataire peut conserver jusqu'à être prêt à l'ouvrir.",
        button: "Créer une note privée",
      },
    },
    {
      title: "Contrôles de timing qui complètent la révélation",
      takeaway:
        "Durée de vie, limites d'ouverture et fenêtres de fichiers complètent la porte au clic.",
      comparisonTable: {
        headers: ["Contrôle", "Protège contre", "Usage typique"],
        rows: [
          [
            "Cliquer pour révéler",
            "Déchiffrement accidentel ou prématuré",
            "Toute note à usage unique ou très sensible",
          ],
          [
            "Durée de vie de la note",
            "Liens périmés non ouverts",
            "« S'ils n'ouvrent pas sous 24 h, détruire »",
          ],
          [
            "Limite d'ouvertures / vues",
            "Accès répété après la remise",
            "Une fois (ou un petit nombre fixe)",
          ],
          [
            "Fenêtre de téléchargement des pièces jointes",
            "Re-téléchargements illimités après ouverture",
            "15 minutes par défaut ; plus long sur les plans éligibles",
          ],
        ],
      },
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Puis-je programmer le déverrouillage d'une note à une date future ?",
          answer:
            "Pas via un planning côté serveur. Partagez le lien tôt si besoin et demandez au destinataire d'attendre—le cliquer-pour-révéler plus une vérification optionnelle garde le contenu scellé jusqu'à confirmation.",
        },
        {
          question: "L'aperçu du lien déchiffre-t-il la note ?",
          answer:
            "La confirmation de révélation est l'étape de déchiffrement intentionnelle. Les destinataires ne doivent pas appuyer sur Révéler tant qu'ils ne sont pas prêts à ce que la politique de destruction s'applique.",
        },
        {
          question: "Que se passe-t-il si quelqu'un ouvre le lien par erreur ?",
          answer:
            "S'il s'arrête avant Révéler, il pourra peut-être revenir plus tard (sous réserve de la durée de vie). Après Révéler sur une note à usage unique, l'accès ultérieur est généralement perdu—envoyez une nouvelle note si besoin.",
        },
        {
          question: "Quel lien avec les notifications e-mail ?",
          answer:
            "Les alertes d'ouverture et de destruction indiquent à l'expéditeur quand le statut change. Elles n'incluent pas le contenu du message. Voir [comment savoir quand un lien secret a été ouvert](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "En résumé",
      takeaway:
        "Révéler est une action consciente, pas une conséquence automatique du chargement d'un lien.",
      paragraphs: [
        "Le cliquer-pour-révéler permet d'envoyer un lien tôt sans déchiffrer la note simplement parce que la page d'atterrissage s'est chargée.",
        "Associez-le à des durées de vie courtes, une vérification quand les canaux sont faibles, et des instructions claires au destinataire—et vous obtenez une pause pratique avant l’affichage, sans prétendre que le produit peut supprimer un capture d'écran à distance.",
      ],
    },
  ],
  ctaTitle: "Laissez le destinataire révéler seulement quand il est prêt.",
  ctaBody:
    "PrivateNote garde le texte chiffré scellé jusqu'à ce que le destinataire confirme la révélation—ainsi les notes à usage unique ont moins de chances de se détruire sur un tap accidentel.",
  ctaButton: "Créer une note avec cliquer pour révéler",
};
