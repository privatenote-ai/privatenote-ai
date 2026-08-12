import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodeFr: BlogGuideArticleCopy = {
  heroAlt:
    "Écran d’ordinateur portable montrant une étape de vérification à six chiffres avant qu’une note privée puisse être révélée",
  heroCaption:
    "Le lien seul ne suffit pas : le destinataire saisit un code à usage unique que vous partagez sur un autre canal.",
  intro: [
    "Un lien de note privée est puissant parce qu’il transporte généralement le matériel nécessaire pour déchiffrer le message. Cette commodité est aussi un risque : si l’URL complète atterrit dans la mauvaise boîte mail, le mauvais fil de discussion ou une capture d’écran, le secret peut être accessible avant que le destinataire prévu ne l’ouvre.",
    "Les **codes de vérification** destinataire ajoutent un second secret de livraison que vous contrôlez. Après la création de la note, PrivateNote affiche un code à six chiffres propre à la note. Vous partagez ce code séparément—par téléphone, Signal ou un autre canal—afin qu’un lien intercepté ne suffise pas à atteindre l’étape de révélation.",
    "Ce n’est ni l’enveloppe optionnelle par phrase secrète du texte chiffré, ni une connexion. C’est une porte de livraison : **vérifier, puis révéler**.",
  ],
  sections: [
    {
      title: "Lien seul vs lien plus code",
      takeaway:
        "Une livraison sur canaux séparés transforme un message volé en puzzle incomplet.",
      paragraphs: [
        "Les liens porteurs sont courants dans le partage sécurisé. Ils fonctionnent bien lorsque le canal est de confiance et la durée de vie courte. Ils fonctionnent moins bien lorsque le même compte e-mail ou chat qui reçoit le lien peut aussi être surveillé, partagé ou compromis.",
        "Exiger un code de vérification rétablit la séparation classique : envoyer le lien sur le canal A, le code sur le canal B. Un attaquant a besoin des deux. Ce schéma s’accorde naturellement avec [comment partager un mot de passe en toute sécurité](blog:how-to-share-a-password-securely) et les [liens secrets à usage unique](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Contrôle", "Ce qu’il protège", "Ce qu’il ne fait pas"],
        rows: [
          [
            "Code de vérification (Starter/Business)",
            "Bloque la révélation jusqu’à ce que le destinataire saisisse le code à usage unique",
            "Ne remplace ni l’enveloppe par phrase secrète ni la connexion au compte",
          ],
          [
            "Phrase secrète sur la note",
            "Enveloppe le texte chiffré afin que le déchiffrement exige la phrase secrète",
            "Exige toujours un partage hors bande soigneux de cette phrase secrète",
          ],
          [
            "Expiration courte + une ouverture",
            "Limite la durée d’utilité d’un lien fuité",
            "N’arrête pas quelqu’un qui a déjà le lien et le code à temps",
          ],
        ],
      },
    },
    {
      title: "Comment l’activer",
      takeaway:
        "Activez sous Livraison et vérification, puis partagez le code et le lien séparément.",
      paragraphs: [
        "Sur les forfaits Starter et Business éligibles, ouvrez **Personnaliser** lors de la création d’une note et activez **Exiger un code de vérification** sous Livraison et vérification. Vous pouvez aussi le définir par défaut dans Compte → Préférences pour que les nouvelles notes héritent de cette porte.",
        "Après la création, l’écran de succès affiche le **code de vérification destinataire**. Copiez le lien de la note comme d’habitude, puis envoyez le code par un autre chemin. Indiquez au destinataire qu’il verra une étape de vérification avant **Révéler la note**.",
      ],
      checklist: [
        "Utiliser Starter ou Business (fonctionnalité liée au forfait)",
        "Activer Exiger un code de vérification pour la note (ou comme défaut du compte)",
        "Créer la note et copier le lien",
        "Copier le code à six chiffres depuis l’écran de succès",
        "Envoyer le lien et le code sur des canaux séparés",
        "Confirmer que le destinataire vérifie avant de révéler",
      ],
      midCta: {
        body: "Vous envoyez quelque chose vers une boîte mail qui pourrait être partagée ou surveillée ?",
        button: "Créer une note avec vérification",
      },
    },
    {
      title: "Ce que vit le destinataire",
      takeaway: "D’abord le code, puis l’avertissement habituel click-to-reveal.",
      paragraphs: [
        "L’ouverture du lien présente un écran de vérification—pas le contenu déchiffré. Après un code correct, la porte de révélation familière apparaît : n’ouvrez que lorsque vous êtes prêt, car la révélation peut consommer la note selon sa politique de destruction.",
        "Les codes erronés échouent de façon fermée. Le destinataire n’a pas besoin de compte ; seulement du code que vous avez partagé. Pour le délai intentionnel avant déchiffrement, voir [pourquoi les notes attendent le click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Quand utiliser les codes de vérification",
      takeaway: "Utilisez-les lorsque le canal du lien est plus faible que le secret.",
      bullets: [
        "Identifiants ou documents envoyés par e-mail vers une boîte partagée",
        "Liens publiés dans un chat d’équipe à large effectif",
        "Remises où le risque de capture d’écran ou de transfert est élevé",
        "Tout secret que vous protégeriez aussi par un partage de phrase secrète sur canaux séparés",
      ],
      calloutTitle: "Conseil pratique",
      callout:
        "Ne mettez pas le code de vérification dans le même e-mail que le lien. Cela regroupe les deux facteurs dans un seul message interceptable.",
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Le code de vérification est-il le même qu’un mot de passe sur la note ?",
          answer:
            "Non. Le code de vérification est une porte vérifiée côté serveur avant la révélation. Une phrase secrète de note (lorsqu’elle est activée) enveloppe le texte chiffré lui-même et constitue un contrôle optionnel distinct.",
        },
        {
          question: "Puis-je choisir mon propre code ?",
          answer:
            "PrivateNote génère un code à six chiffres propre à la note. Vous partagez cette valeur générée ; vous n’inventez ni ne réutilisez un PIN personnel.",
        },
        {
          question: "Est-ce disponible sur Free ?",
          answer:
            "La vérification destinataire est une capacité Starter et Business. Les comptes Free peuvent toujours utiliser une expiration courte, des limites d’ouverture et l’enveloppe optionnelle par phrase secrète lorsqu’elles sont proposées.",
        },
        {
          question: "La vérification signifie-t-elle que PrivateNote peut lire ma note ?",
          answer:
            "Non. La vérification autorise l’accès au flux de révélation. Le contenu des messages reste chiffré dans le navigateur ; les alertes de statut n’incluent jamais de clair.",
        },
      ],
    },
    {
      title: "En résumé",
      takeaway: "Rendez le lien incomplet sans votre code hors bande.",
      paragraphs: [
        "Les codes de vérification sont destinés aux moments où la commodité laisserait autrement une URL entièrement déchiffrable dans un seul canal.",
        "Activez la porte, partagez le code séparément et gardez la durée de vie de la note courte—surtout pour les [clés API](blog:how-to-share-api-key-securely), mots de passe et documents.",
      ],
    },
  ],
  ctaTitle: "Ajoutez une étape de vérification séparée à la remise.",
  ctaBody:
    "Exigez un code de vérification à usage unique avant la révélation, puis envoyez ce code sur un canal différent de celui du lien.",
  ctaButton: "Créer une note privée vérifiée",
};
