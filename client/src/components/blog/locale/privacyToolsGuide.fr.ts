import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuideFr: PrivacyToolsGuideArticleCopy = {
  intro: [
    "La plupart des pages « meilleurs outils de confidentialité » sont des catalogues d’affiliation déguisés. Elles classent chaque catégorie, enterrent les compromis et vous laissent avec vingt onglets et aucun système.",
    "Ce guide est différent. C’est un **cadre de décision 2026** pour assembler une stack de confidentialité adaptée à la vraie vie : quel travail vous devez accomplir, quel défaut choisir, quand monter en gamme—et quand un outil a tout simplement la mauvaise forme.",
    "PrivateNote.ai occupe un créneau étroit—**les remises de secrets à usage unique**. Tout le reste ci-dessous est une opinion curatée pour que vous quittiez cette page avec une stack cohérente, puis consultiez notre [annuaire d’outils de confidentialité](app:privacy-tools) pour le catalogue complet.",
  ],
  sections: [
    {
      title: "Commencez par un modèle de menace (pas une liste de courses)",
      paragraphs: [
        "Les outils de confidentialité n’aident que s’ils correspondent à ce contre quoi vous vous défendez. Un freelance qui partage des identifiants Wi‑Fi n’a pas le même problème qu’un journaliste face à une surveillance ciblée. Choisissez la stack la plus légère qui couvre *vos* risques—puis arrêtez de collectionner des outils pour le sport.",
      ],
      subsections: [
        {
          title: "Usage personnel quotidien",
          paragraphs: [
            "Vous voulez moins de pistage, moins de catastrophes liées à la réutilisation de mots de passe, et des secrets qui ne s’éternisent pas dans le chat. Vous n’essayez pas de disparaître face aux États-nations. Concentrez-vous sur un gestionnaire de mots de passe, des défauts de navigateur raisonnables, une messagerie chiffrée pour les échanges sensibles, et des liens éphémères pour les identifiants ponctuels.",
          ],
        },
        {
          title: "Freelance ou consultant",
          paragraphs: [
            "Vous remettez des secrets à des clients qui ne partagent pas vos apps. L’e-mail et Slack deviennent des archives permanentes de clés API et de mots de passe temporaires. Ajoutez des notes chiffrées à usage unique et le transfert de fichiers chiffré ; gardez les identifiants durables dans un coffre, pas dans les fils de discussion.",
          ],
        },
        {
          title: "Petite équipe",
          paragraphs: [
            "Vous avez besoin d’un accès partagé révocable, de règles claires pour les prestataires, et de moins dépendre du « envoie-le juste dans le channel ». Préférez le partage via gestionnaire de mots de passe pour l’accès continu, les liens à usage unique pour les remises temporaires, et des normes écrites pour que la commodité ne devienne pas silencieusement la politique.",
          ],
        },
      ],
      calloutTitle: "Règle empirique",
      callout:
        "Si un outil ne correspond pas à un travail que vous faites réellement chaque semaine, passez votre chemin. Une stack minimale que vous utilisez bat une stack puriste que vous abandonnez.",
    },
    {
      title: "Des jobs de confidentialité, pas des catégories de produits",
      paragraphs: [
        "Les catégories (VPN, navigateur, messagerie) encouragent à collectionner des logos. Les jobs forcent les compromis à la lumière. Utilisez cette carte pour vous orienter ; les sections ci-dessous vont plus loin.",
      ],
      comparisonTable: {
        headers: ["Job", "Approche par défaut", "Mauvais outil pour le job"],
        rows: [
          [
            "Conserver des mots de passe durables",
            "Gestionnaire de mots de passe + générateur fort",
            "Mots de passe du navigateur seuls, ou archives de chat",
          ],
          [
            "Remettre un secret à usage unique",
            "Note chiffrée dans le navigateur et expirante",
            "E-mail, Slack, SMS, ou un dossier cloud « pour l’instant »",
          ],
          [
            "Chat privé au quotidien",
            "Messagerie chiffrée de bout en bout",
            "SMS, ou messages « disparaissants » dans des apps qui archivent quand même les métadonnées pour toujours",
          ],
          [
            "Réduire les trackers de navigation",
            "Navigateur grand public durci + bloqueur",
            "Installer cinq extensions de confidentialité conflictuelles",
          ],
          [
            "Réseaux non fiables",
            "VPN no-logs crédible et réputé",
            "Supposer qu’un VPN vous rend anonyme",
          ],
          [
            "Hygiène contre la prise de compte",
            "Vérification de fuites + 2FA / passkeys",
            "Réutiliser des mots de passe et espérer",
          ],
        ],
        after: [
          "Pour les noms de produits, notes de prix et exclusions, gardez l’[annuaire d’outils de confidentialité](app:privacy-tools) ouvert à côté de ce guide.",
        ],
      },
    },
    {
      title: "Job : mots de passe durables",
      paragraphs: [
        "Les mots de passe que vous réutiliserez pendant des mois appartiennent à un coffre—pas dans votre tête, pas dans une app de notes, et pas dans le fil Teams d’hier.",
      ],
      subsections: [
        {
          title: "Le problème",
          paragraphs: [
            "La réutilisation transforme une fuite en plusieurs. Les mots de passe faibles et mémorables échouent au cracking hors ligne. Les stores de mots de passe du navigateur aident, mais matchent rarement les gestionnaires dédiés pour la sync, le partage et l’auditabilité.",
          ],
        },
        {
          title: "Défaut + alternative",
          paragraphs: [
            "**Défaut :** [Bitwarden](https://bitwarden.com/) pour la plupart—open source, free tier utilisable, sync solide. **Alternative :** [KeePassXC](https://keepassxc.org/) si vous voulez un coffre local sans cloud. **Quand le polish compte plus que l’open source :** [1Password](https://1password.com/) est un choix raisonnable ; sachez que vous choisissez la commodité propriétaire.",
          ],
        },
        {
          title: "Quand ne pas utiliser un gestionnaire seul",
          paragraphs: [
            "Les gestionnaires excellent au *stockage* et à l’accès partagé continu. Ils sont maladroits quand le destinataire n’a pas de compte, ou quand le secret doit mourir après une lecture. C’est un autre job—voir les secrets à usage unique ci-dessous. Générez des valeurs fortes avec un [générateur de mots de passe](app:password-generator) local avant de les stocker ou de les partager.",
          ],
        },
      ],
    },
    {
      title: "Job : secrets à usage unique",
      paragraphs: [
        "Mots de passe pour prestataires, codes de récupération, clés API, Wi‑Fi pour un visiteur—tout ce qui ne devrait pas devenir un historique searchable.",
      ],
      subsections: [
        {
          title: "Le problème",
          paragraphs: [
            "L’e-mail et le chat chiffrent en transit, puis archivent pour toujours. Les dossiers cloud traînent. Les captures d’écran et sauvegardes d’appareils élargissent le rayon. Le mode de défaillance n’est pas « quelqu’un sniffe le fil »—c’est « le secret est encore là dans six mois ».",
          ],
        },
        {
          title: "Défaut",
          paragraphs: [
            "**Défaut :** une note chiffrée dans le navigateur et expirante comme [PrivateNote.ai](app:home)—ciphertext sur le serveur, matériel de déchiffrement dans le fragment du lien, destruction après lecture ou TTL courte. Pour le modèle, voir [comment fonctionne PrivateNote](app:how-it-works) et [pourquoi l’e-mail est le pire endroit pour les secrets](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Quand ne pas l’utiliser",
          paragraphs: [
            "Ne remplacez pas votre gestionnaire de mots de passe ni votre messagerie quotidienne par des notes à usage unique. Ne mettez pas de documents durables ni de conversations continues dans des liens éphémères. Et n'envoyez pas le lien et une passphrase optionnelle dans le même canal si l’enjeu est élevé—séparez les canaux.",
          ],
        },
      ],
      midCta: {
        body: "Besoin de remettre un mot de passe ou une clé API maintenant ? Chiffrez-le dans le navigateur et envoyez un lien qui peut expirer après lecture.",
        button: "Créer une note privée",
        href: "app:home",
      },
    },
    {
      title: "Job : messagerie au quotidien",
      paragraphs: [
        "Les conversations sensibles ont besoin du chiffrement de bout en bout par défaut—pas d’un interrupteur enterré dans les réglages, ni d’une promesse que les messages « disparaissants » effacent des copies côté serveur que vous ne pouvez pas vérifier.",
      ],
      subsections: [
        {
          title: "Défaut + compromis",
          paragraphs: [
            "**Défaut :** [Signal](https://signal.org/) pour le chat sécurisé grand public. **Compromis à nommer à voix haute :** l’inscription exige un numéro de téléphone, ce que certains modèles de menace à haute anonymité rejettent. Pour ces cas, regardez au-delà de ce guide de démarrage—et traitez toujours les métadonnées (qui parle à qui) comme un risque résiduel sur chaque messagerie.",
          ],
        },
        {
          title: "Quand ne pas utiliser le chat pour les secrets",
          paragraphs: [
            "Même les messageries chiffrées gardent l’historique sur les appareils. Collez un mot de passe de production dans un fil et vous avez créé une copie durable. Utilisez le chat pour la conversation ; utilisez les notes à usage unique pour les identifiants. Plus sur ce modèle : [secrets à ne jamais envoyer dans le chat](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Job : e-mail et séparation d’identité",
      paragraphs: [
        "L’e-mail est un système d’adressage public avec des espoirs privés. Traitez le chiffrement de boîte et l’aliasing comme de la limitation des dégâts, pas de l’invisibilité magique.",
      ],
      subsections: [
        {
          title: "Défauts",
          paragraphs: [
            "**Défaut boîte chiffrée :** [Proton Mail](https://proton.me/) ou [Tuta](https://tuta.com/) quand vous voulez du mail zero-access pour la correspondance sensible. **Défaut aliasing :** [Firefox Relay](https://relay.firefox.com/) pour un masquage léger, ou [SimpleLogin](https://simplelogin.io/) quand vous avez besoin de domaines personnalisés et d’une séparation d’identité plus nette.",
          ],
        },
        {
          title: "Quand ne pas compter sur l’e-mail",
          paragraphs: [
            "L’e-mail chiffré laisse encore des en-têtes, des habitudes de transfert et une rétention longue. Ne mettez jamais d’identifiants actifs dans le corps « juste cette fois ». Si la charge utile est une remise de secret, utilisez une note à usage unique et ne mettez que le contexte dans l’e-mail.",
          ],
        },
      ],
    },
    {
      title: "Job : naviguer avec moins de pistage",
      paragraphs: [
        "En 2026, le combat porte moins sur le « mode secret » que sur le fingerprinting, le pistage intersites, et les extensions qui promettent la confidentialité tout en ajoutant de la surface d’attaque.",
      ],
      subsections: [
        {
          title: "Stack par défaut",
          paragraphs: [
            "**Défaut :** [Firefox](https://www.mozilla.org/) avec protection stricte contre le pistage plus [uBlock Origin](https://ublockorigin.com/). **Alternative façon Chromium :** [Brave](https://brave.com/) si vous avez besoin de compatibilité d’extensions—sachant que la communauté est divisée sur sa surface rewards/crypto. **Recherche :** [DuckDuckGo](https://duckduckgo.com/) (ou une recherche similaire non profilante) pour que vos requêtes ne deviennent pas un flux de profil publicitaire.",
          ],
        },
        {
          title: "Quand Tor est la bonne montée en gamme",
          paragraphs: [
            "[Tor Browser](https://www.torproject.org/) est le standard pour une anonymité plus forte et la résistance à la censure. Il est aussi plus lent et chargé en CAPTCHA. Utilisez-le quand le modèle de menace l’exige—pas comme navigateur bancaire quotidien.",
          ],
        },
      ],
    },
    {
      title: "Job : réseaux non fiables (réalité VPN)",
      paragraphs: [
        "Un VPN chiffre le chemin entre vous et le fournisseur VPN. Il masque votre IP aux sites que vous visitez. Il ne vous rend **pas** anonyme, ne chiffre pas les logs de la destination, et ne corrige pas un mot de passe faible.",
      ],
      subsections: [
        {
          title: "Défauts que nous sommes prêts à nommer",
          paragraphs: [
            "Préférez des fournisseurs avec un track record public, une histoire de juridiction claire, et des claims no-logs audités—souvent [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) ou [IVPN](https://www.ivpn.net/). Payez pour le produit ; les modèles économiques des VPN gratuits sont souvent le produit.",
          ],
        },
        {
          title: "Quand ne pas s’en soucier",
          paragraphs: [
            "Sur un réseau que vous faites déjà confiance, avec HTTPS partout, un VPN est une hygiène optionnelle—pas un devoir moral. Évitez les marques douteuses « military-grade » et tout ce qui mène avec des codes influenceurs plutôt que du détail d’ingénierie. Les notes d’exclusion de notre annuaire couvrent les choix « privacy-washed » courants.",
          ],
        },
      ],
    },
    {
      title: "Job : fuites, 2FA et passkeys",
      paragraphs: [
        "L’hygiène de compte est la moitié peu glamour de la confidentialité. La plupart des désastres personnels sont du credential stuffing et des échecs proches du SIM-swap, pas des malwares exotiques.",
      ],
      subsections: [
        {
          title: "Défauts pratiques",
          paragraphs: [
            "Vérifiez les adresses sur [Have I Been Pwned](https://haveibeenpwned.com/). Activez des facteurs résistants au phishing là où vous pouvez—les passkeys ou clés matérielles comme [YubiKey](https://www.yubico.com/) battent l’OTP SMS. Utilisez le [2FA Directory](https://2fa.directory/) pour voir quels services traitent encore le second facteur comme du théâtre optionnel.",
          ],
        },
        {
          title: "Note 2026 sur le passwordless",
          paragraphs: [
            "Les passkeys réduisent le phishing et la réutilisation de mots de passe, mais la récupération et le lock-in cross-écosystème sont réels. Gardez une histoire de récupération (clé matérielle, processus documenté) avant de supprimer chaque mot de passe. Les gestionnaires restent utiles pour la longue traîne de sites qui n’ont pas rattrapé.",
          ],
        },
      ],
    },
    {
      title: "Ce qui a changé en 2026 (commentaire à garder)",
      bullets: [
        "**Le chat IA est une nouvelle archive.** Coller des secrets dans des assistants crée des questions de rétention et de risque d’entraînement que votre modèle de menace 2019 n’incluait pas. Traitez les prompts comme des corps d’e-mail.",
        "**Le fingerprinting a dépassé les bannières cookies.** Bloquer les cookies tiers aide ; le choix du navigateur, le blocage des trackers et moins d’extensions comptent encore plus qu’accepter chaque bascule « intérêt légitime ».",
        "**Les passkeys se généralisent.** Préférez-les sur les comptes à haute valeur ; ne prétendez pas que chaque site les prend déjà en charge.",
        "**Le marketing VPN est devenu plus bruyant, pas plus sage.** Le théâtre de juridiction et les classements d’affiliation ne sont pas des audits. Choisissez des fournisseurs ennuyeux et documentés—ou aucun.",
        "**Le partage éphémère reste de niche—et toujours nécessaire.** Les apps de collaboration optimisées pour la recherche rendent les outils de secrets à usage unique plus précieux, pas moins.",
      ],
    },
    {
      title: "Kit de démarrage minimal (la plupart des gens)",
      paragraphs: [
        "Si vous ne faites que sept choses, faites celles-ci. Tout le reste est de la profondeur optionnelle.",
      ],
      useCaseTable: {
        headers: ["Créneau", "Choix"],
        rows: [
          ["Coffre de mots de passe", "Bitwarden (ou KeePassXC si vous refusez le cloud)"],
          ["Création de mots de passe", "Générateur local—puis stocker dans le coffre"],
          ["Secrets à usage unique", "PrivateNote.ai (ou note équivalente chiffrée dans le navigateur)"],
          ["Chat privé", "Signal"],
          ["Navigateur + bloqueur", "Firefox + uBlock Origin"],
          ["Hygiène fuites / 2FA", "Have I Been Pwned + passkeys ou 2FA app/matériel"],
          ["Voyage / Wi‑Fi de café", "Mullvad, Proton VPN ou IVPN—quand le réseau est le risque"],
        ],
      },
      callout:
        "Les add-ons avancés (Tor au quotidien, ritualisme full-disk, toiles d’e-mail anonymes) sont valides—mais seulement après que le kit de démarrage soit devenu une habitude.",
    },
    {
      title: "Ce que nous excluons—et pourquoi",
      paragraphs: [
        "Curater, c’est surtout dire non. Quelques schémas que nous refusons d’adoucir :",
      ],
      subsections: [
        {
          title: "VPN théâtre de confidentialité",
          paragraphs: [
            "Free tiers financés par des pratiques de données floues, faux badges « audit », et SEO de classements. Si le pitch est la peur plus un code promo, partez.",
          ],
        },
        {
          title: "Messageries qui commercialisent le chiffrement sélectivement",
          paragraphs: [
            "Cloud par défaut, E2EE optionnel, ou modes « chat secret » qui entraînent les utilisateurs à coller des secrets dans le défaut non sûr. Nous préférons recommander un défaut honnête plutôt que cinq modes que les gens mésusent. Les clouds façon Telegram et les réalités métadonnées/sauvegarde de WhatsApp sont signalés dans nos [exclusions d’annuaire](app:privacy-tools).",
          ],
        },
        {
          title: "Tout ce qui devrait acheter notre recommandation",
          paragraphs: [
            "Ce guide et l’annuaire ne sont pas une liste d’affiliation. Nous ne gagnons rien si vous cliquez. Cela ne nous rend pas omniscients—cela signifie que les incentives ne dirigent pas discrètement la shortlist.",
          ],
        },
      ],
    },
    {
      title: "Où aller ensuite",
      paragraphs: [
        "Utilisez cet article comme couche de décision. Utilisez l’annuaire comme catalogue vivant—catégories, nuances et liens que nous maintenons revisés.",
      ],
      bullets: [
        "[Annuaire d’outils de confidentialité](app:privacy-tools) — catalogue curaté par catégorie",
        "[Comment partager un mot de passe en toute sécurité](blog:how-to-share-a-password-securely) — playbook de remise",
        "[Envoyer un secret sans compte](blog:send-secret-message-without-account) — aucune app partagée requise",
        "[Ressources de sécurité](app:security-resources) — lectures plus larges sur PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — contexte politique et droits",
        "[Privacy Guides](https://www.privacyguides.org/) — recommandations plus profondes maintenues par la communauté",
      ],
      midCta: {
        body: "Prêt à parcourir la shortlist complète avec notes de catégorie et exclusions ?",
        button: "Ouvrir l’annuaire d’outils de confidentialité",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Est-ce la même chose que votre annuaire d’outils de confidentialité ?",
          answer:
            "Non. Cet article est le guide 2026 pour savoir comment choisir. L’[annuaire](app:privacy-tools) est le catalogue curaté. Lisez le guide pour décider ; utilisez l’annuaire pour choisir des outils concrets.",
        },
        {
          question: "Puis-je chasser le classement de chaque catégorie de confidentialité ?",
          answer:
            "Vous pouvez, mais vous ne tiendrez pas. Un kit de démarrage à sept créneaux que vous utilisez vraiment bat un sanctuaire de trente outils que vous configurez une fois.",
        },
        {
          question: "Où s’inscrit PrivateNote.ai ?",
          answer:
            "Uniquement dans le job des secrets à usage unique—identifiants et instructions qui doivent expirer. Ce n’est ni un gestionnaire de mots de passe, ni une messagerie, ni un VPN.",
        },
        {
          question: "Ai-je besoin d’un VPN tous les jours ?",
          answer:
            "En général non. Utilisez-en un sur des réseaux non fiables ou quand vous devez spécifiquement masquer votre IP à une destination. Ce n’est pas un substitut au HTTPS, aux bons mots de passe, ou aux messageries chiffrées.",
        },
        {
          question: "Open source ou propriétaire poli ?",
          answer:
            "Préférez l’open source quand le risque est élevé et que vous pouvez vivre avec l’UX. Les outils propriétaires peuvent être rationnels quand l’utilisabilité détermine si votre famille adopte un coffre du tout—nommez le compromis explicitement, comme nous le faisons avec 1Password.",
        },
      ],
    },
  ],
  ctaTitle: "Construisez la stack, puis partagez les secrets correctement",
  ctaBody:
    "Quand le job est une remise temporaire, sautez l’archive du chat. Créez une note chiffrée dans le navigateur, envoyez le lien, et laissez-le expirer quand le moment est passé.",
  ctaButton: "Créer une note privée",
  ctaSecondaryLabel: "Parcourir l’annuaire d’outils de confidentialité",
  ctaSecondaryHref: "app:privacy-tools",
};
