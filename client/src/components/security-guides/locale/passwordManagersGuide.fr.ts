import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuideFr: PasswordManagersGuideCopy = {
  metaTitle: "Guide des gestionnaires de mots de passe",
  metaDescription:
    "Créez et partagez des mots de passe en sécurité. Comparez KeePass, Bitwarden, Apple, Google — Passwords.lu et PrivateNote pour partage unique.",
  heroLabel: "Guide de sécurité",
  heroTitle: "Guide des gestionnaires de mots de passe",
  heroTagline: "Créer, stocker et partager des mots de passe en toute sécurité",
  heroSubtitle:
    "Les mots de passe protègent presque tous les aspects de la vie numérique — pourtant la réutilisation et les schémas faibles restent l'une des plus grandes failles en cybersécurité. Un gestionnaire de mots de passe y remédie.",
  introLead:
    "Le problème n'est pas les mots de passe eux-mêmes. C'est la façon dont les gens les utilisent. Beaucoup réutilisent encore le même mot de passe sur des dizaines de sites ou ne font que de petites variations :",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Si un site subit une fuite, les attaquants testent ces identifiants partout — une technique appelée credential stuffing, responsable de millions de comptes compromis chaque année. Un gestionnaire génère un mot de passe différent pour chaque compte. Vous n'avez qu'un seul mot de passe maître fort à retenir.",
  essentialTitle: "Pourquoi les gestionnaires de mots de passe sont essentiels",
  essentialIntro: "Un bon gestionnaire améliore considérablement la sécurité et l'expérience quotidienne en ligne.",
  essentialBenefits: [
    "Générer instantanément des mots de passe longs et aléatoires",
    "Stocker chaque mot de passe dans un coffre chiffré",
    "Remplir automatiquement les formulaires de connexion",
    "Détecter les mots de passe réutilisés ou faibles",
    "Recevoir des alertes lorsque des identifiants apparaissent dans des fuites connues",
    "Synchroniser les mots de passe sur tous vos appareils",
    "Stocker les passkeys aux côtés des mots de passe",
    "Partager les identifiants en toute sécurité si nécessaire",
  ],
  howItWorksTitle: "Comment fonctionnent les gestionnaires de mots de passe",
  howItWorksBody1:
    "Vos identifiants vivent dans un coffre chiffré. Lors de sa création, vous choisissez un mot de passe maître qui dérive les clés de chiffrement protégeant tout ce qu'il contient.",
  cryptoLabel: "La cryptographie moderne comprend généralement :",
  cryptoPoints: [
    "Chiffrement AES-256",
    "Argon2id ou PBKDF2 pour la dérivation de clés",
    "Chiffrement authentifié pour détecter les altérations",
  ],
  howItWorksBody2:
    "Comme le coffre est chiffré avant stockage ou synchronisation, les fournisseurs réputés ne peuvent généralement pas lire vos mots de passe.",
  unlockedLabel: "Une fois déverrouillé, votre gestionnaire peut :",
  vaultFeatures: [
    "Remplir automatiquement noms d'utilisateur et mots de passe",
    "Générer des mots de passe sécurisés",
    "Enregistrer les nouveaux identifiants créés",
    "Synchroniser les modifications sur tous les appareils",
    "Stocker des notes sécurisées et des passkeys",
  ],
  benefitsTitle: "Avantages d'utiliser un gestionnaire de mots de passe",
  benefitBlocks: [
    {
      title: "Chaque compte obtient un mot de passe unique",
      body: "Si votre mot de passe Netflix est volé, il ne devrait pas aussi déverrouiller votre e-mail, votre banque, votre compte GitHub ou votre stockage cloud. Les gestionnaires rendent les mots de passe uniques sans effort.",
    },
    {
      title: "Génération de mots de passe forts",
      body: "Les humains sont mauvais pour inventer des mots de passe aléatoires. Les gestionnaires génèrent des chaînes à haute entropie comme uQ8!kL#7P2@wXf9$rZm4 — extrêmement difficiles à deviner ou à forcer par brute force.",
    },
    {
      title: "Connexion automatique",
      body: "Les gestionnaires reconnaissent les sites web et remplissent les identifiants automatiquement. Les gestionnaires réputés ne remplissent généralement que sur le bon domaine, ce qui aide aussi à se protéger du phishing.",
    },
    {
      title: "Rapports de santé des mots de passe",
      body: "De nombreux gestionnaires signalent les mots de passe réutilisés, faibles, compromis, l'absence de MFA et les sites prenant en charge les passkeys — vous aidant à améliorer la sécurité au fil du temps.",
    },
    {
      title: "Synchronisation sécurisée",
      body: "Les gestionnaires modernes synchronisent votre coffre chiffré sur ordinateur, portable, téléphone et tablette pour que les mots de passe restent disponibles partout où vous en avez besoin.",
    },
  ],
  passwordsLuPartnerLabel: "Outil partenaire",
  passwordsLuTitle: "Génération dans le navigateur avec Passwords.lu",
  passwordsLuBody:
    "Parfois vous n'avez besoin que d'un mot de passe fort — pas d'un workflow de coffre complet. Passwords.lu exécute la génération directement dans votre navigateur. Les mots de passe ne sont pas envoyés sur des serveurs ; aucun compte requis.",
  passwordsLuWorkflow:
    "Workflow recommandé : générer sur Passwords.lu, puis enregistrer immédiatement dans votre gestionnaire de mots de passe.",
  passwordsLuCta: "Ouvrir le générateur de mots de passe",
  passwordsLuTools: [
    "Générateur de mots de passe forts",
    "Générateur de phrases de passe",
    "Générateur de PIN sécurisé",
    "Vérificateur de force de mot de passe",
    "Générateur de noms d'utilisateur",
    "Générateurs de hash (Argon2id, bcrypt, scrypt et plus)",
    "Outils éducatifs de sécurité",
  ],
  recommendedTitle: "Gestionnaires de mots de passe recommandés",
  recommendedIntro:
    "Pensez en trois couches : outils intégrés à la plateforme pour la stabilité, coffres open source locaux pour le contrôle, et gestionnaires cloud quand vous avez besoin d'une synchronisation puissante — en acceptant le risque serveur supplémentaire qui l'accompagne.",
  tiers: {
    platform: {
      title: "Gestionnaires intégrés à la plateforme",
      subtitle: "Ingénierie solide, produits stables — meilleur choix par défaut pour la plupart",
      intro:
        "Apple et Google livrent des gestionnaires de mots de passe avec le système d'exploitation. Ils sont soutenus par de grandes équipes de sécurité, reçoivent des mises à jour continues et intègrent passkeys, remplissage automatique et alertes de fuites avec une configuration minimale. Si vous vivez dans un écosystème, c'est souvent le choix le plus fluide et fiable.",
      strengthsLabel: "Points forts",
      tradeoffsLabel: "Compromis",
      pros: [
        "UX soignée avec remplissage automatique au niveau OS et support des passkeys",
        "Maintenus par des ingénieurs sécurité de plateforme à grande échelle",
        "Pas d'abonnement séparé pour les fonctionnalités de base",
        "Synchronisation stable via iCloud ou votre compte Google",
      ],
      cons: [
        "Liés au compte Apple ou Google et aux choix de plateforme",
        "Moins flexible si vous mélangez librement Windows, Linux et mobile",
        "Le modèle de confiance dépend de la sécurité de votre compte cloud",
      ],
      managers: {
        apple: {
          verdict: "Idéal pour iPhone, iPad, Mac et Vision Pro",
          description:
            "Intégré aux plateformes Apple avec stockage sécurisé, génération, alertes de sécurité, passkeys et synchronisation iCloud Keychain — aucune application supplémentaire requise dans un foyer entièrement Apple.",
          highlights: [
            "Intégration OS profonde et support des passkeys",
            "Alertes de sécurité pour les fuites connues",
            "Excellente UX dans l'écosystème Apple",
          ],
          learnMore: "En savoir plus",
        },
        google: {
          verdict: "Idéal pour Android et Chrome",
          description:
            "Intégré à Android et Chrome avec génération, remplissage automatique, Password Checkup, alertes de fuites, passkeys et synchronisation via votre compte Google.",
          highlights: [
            "Choix par défaut pratique sur les appareils Android",
            "Password Checkup et alertes de fuites",
            "Fonctionne partout où vous utilisez Chrome",
          ],
          learnMore: "En savoir plus",
        },
      },
    },
    local: {
      title: "Coffres open source locaux",
      subtitle: "Contrôle maximal — vous possédez le fichier chiffré",
      intro:
        "KeePass stocke votre coffre sous forme de base de données chiffrée locale. Aucun compte cloud fournisseur requis : vous décidez où vit le fichier et comment il se synchronise. Le compromis est l'UX — les interfaces peuvent sembler datées comparées aux gestionnaires de plateforme ou cloud, et la synchronisation multi-appareils est DIY sauf si vous ajoutez votre propre couche de stockage.",
      strengthsLabel: "Points forts",
      tradeoffsLabel: "Compromis",
      pros: [
        "Open source et auditable",
        "Pas de compte cloud ou d'abonnement obligatoire",
        "Offline-first ; le fichier coffre reste sous votre contrôle",
        "Grand écosystème de plugins (KeePassXC, ports mobiles, etc.)",
      ],
      cons: [
        "Interface et onboarding moins soignés que les outils de plateforme",
        "Synchronisation multi-appareils manuelle sauf configuration",
        "Plus de travail de configuration pour les familles ou foyers multi-appareils",
      ],
      managers: {
        keepass: {
          verdict: "Idéal pour les puristes de la vie privée et les auto-hébergeurs",
          description:
            "Le modèle open source original : un fichier .kdbx chiffré que vous pouvez stocker sur disque, USB, NAS ou synchroniser via votre propre cloud. KeePassXC est un fork multiplateforme populaire avec une interface plus moderne.",
          highlights: [
            "Entièrement gratuit — pas de verrouillage fournisseur",
            "Vous choisissez la stratégie de stockage et de synchronisation",
            "Idéal quand le cloud est optionnel, pas par défaut",
          ],
          learnMore: "En savoir plus",
        },
      },
    },
    cloud: {
      title: "Gestionnaires de mots de passe cloud",
      subtitle: "Synchronisation et partage puissants — risque serveur le plus élevé",
      intro:
        "Les gestionnaires cloud dédiés comme Bitwarden excellent en synchronisation multiplateforme, partage familial et fonctionnalités d'équipe. Cette commodité apporte un modèle de menace différent : votre coffre chiffré (et parfois les métadonnées) vit sur les serveurs de quelqu'un d'autre. Une fuite ou mauvaise configuration chez le fournisseur est le principal risque résiduel — d'où l'importance des audits, de l'open source et d'un mot de passe maître fort.",
      strengthsLabel: "Points forts",
      tradeoffsLabel: "Compromis",
      pros: [
        "Meilleure synchronisation multi-appareils prête à l'emploi",
        "Fonctionnalités de partage familial et organisationnel",
        "Fonctionne de manière cohérente sur Windows, macOS, Linux et mobile",
        "Options open source (Bitwarden) avec audits de sécurité publics",
      ],
      cons: [
        "Plus grande surface d'attaque si le fournisseur est compromis",
        "Les sauvegardes de coffre chiffrées peuvent encore être crackées hors ligne avec des mots de passe maîtres faibles",
        "Vous devez faire confiance à l'implémentation crypto et aux opérations du fournisseur",
      ],
      managers: {
        bitwarden: {
          verdict: "Meilleure option cloud pour les utilisateurs multiplateformes",
          description:
            "Logiciel open source, synchronisation chiffrée de bout en bout, support des passkeys, audits indépendants et offre gratuite solide — la recommandation par défaut quand vous avez besoin de sync cloud en dehors d'Apple ou Google.",
          highlights: [
            "Clients open source audités",
            "Excellent plan gratuit et offres familiales",
            "Expérience cohérente sur toutes les grandes plateformes",
          ],
          learnMore: "En savoir plus",
        },
        lastpass: {
          verdict: "Option héritée — préférez Bitwarden pour les nouveaux utilisateurs",
          description:
            "A aidé à populariser les gestionnaires cloud, mais des incidents majeurs impliquant des sauvegardes de coffre chiffrées volées ont poussé de nombreux professionnels de la sécurité vers Bitwarden ou KeePass local pour les nouveaux déploiements.",
          highlights: [
            "Utilisable avec mot de passe maître fort + MFA si déjà investi",
            "Envisagez une migration si vous partez de zéro",
          ],
          learnMore: "En savoir plus",
          caution: "Attention",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "Votre priorité",
    recommendation: "Recommandation",
  },
  comparisonRows: [
    { priority: "Vivre dans l'écosystème Apple", pick: "Apple Passwords" },
    { priority: "Android et Chrome au quotidien", pick: "Google Password Manager" },
    { priority: "Vie privée maximale et contrôle des fichiers", pick: "KeePass (coffre local)" },
    { priority: "Synchronisation cloud multiplateforme", pick: "Bitwarden" },
    { priority: "Utilisateur LastPass existant", pick: "Continuer si renforcé ; évaluer Bitwarden ou KeePass" },
  ],
  sharingTitle: "Partager des mots de passe en toute sécurité",
  sharingBody:
    "Même les mots de passe forts doivent parfois être partagés — avec des collègues, la famille, des admins IT, des prestataires ou des clients. Trop de gens les envoient encore via des plateformes de messagerie conçues pour le chat, pas pour la livraison de secrets.",
  unsafeChannels: ["E-mail", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Utilisez PrivateNote à la place",
  privateNoteSharingBody:
    "PrivateNote chiffre les secrets dans votre navigateur avant l'envoi. Le serveur ne stocke que du texte chiffré ; la clé de déchiffrement voyage séparément dans le lien. Les notes peuvent s'autodétruire après une lecture ou expirer selon un calendrier.",
  privateNoteSharingItems: [
    "Mots de passe",
    "Clés API",
    "Identifiants Wi‑Fi",
    "Codes de récupération",
    "Connexions temporaires",
  ],
  privateNoteSharingCta: "Créer une note sécurisée à usage unique",
  passwordProtectedTitle: "Protection supplémentaire avec des notes protégées par mot de passe",
  passwordProtectedBody1:
    "Ajoutez un mot de passe optionnel à une PrivateNote. Le destinataire a besoin à la fois du lien et du mot de passe séparé — idéalement livrés par des canaux différents (envoyer le lien par e-mail, partager le mot de passe par téléphone ou en personne).",
  passwordProtectedBody2:
    "Même si quelqu'un intercepte le lien, il ne peut pas révéler le secret sans le mot de passe.",
  bestPracticesTitle: "Bonnes pratiques",
  bestPractices: [
    "Utiliser un mot de passe maître long et unique",
    "Activer l'authentification multifacteur sur votre gestionnaire de mots de passe",
    "Ne jamais réutiliser des mots de passe sur différents sites",
    "Générer des mots de passe avec un gestionnaire ou Passwords.lu",
    "Enregistrer chaque mot de passe dans votre coffre chiffré",
    "Activer les passkeys dès qu'ils sont disponibles",
    "Consulter régulièrement les rapports de santé des mots de passe",
    "Partager les mots de passe via PrivateNote plutôt que par e-mail ou chat",
    "Pour les identifiants très sensibles, utiliser la protection par mot de passe optionnelle de PrivateNote et livrer le mot de passe séparément",
  ],
  faqTitle: "Questions fréquentes",
  faq: [
    {
      q: "Les gestionnaires de mots de passe sont-ils sûrs ?",
      a: "Oui. Les gestionnaires réputés utilisent un chiffrement fort et conforme aux standards du secteur. Pour presque tout le monde, utiliser un gestionnaire est nettement plus sûr que mémoriser des mots de passe ou réutiliser le même sur plusieurs sites.",
    },
    {
      q: "Le fournisseur du gestionnaire peut-il lire mes mots de passe ?",
      a: "Pour les gestionnaires modernes comme KeePass, Bitwarden, Apple Passwords et Google Password Manager, votre coffre est chiffré avant stockage. Avec un mot de passe maître fort, le fournisseur ne peut généralement pas lire vos identifiants stockés.",
    },
    {
      q: "Que se passe-t-il si j'oublie mon mot de passe maître ?",
      a: "La plupart des gestionnaires ne peuvent pas le récupérer car ils ne le connaissent jamais. C'est volontaire. Certains services offrent des options de récupération ou un accès d'urgence si configuré à l'avance.",
    },
    {
      q: "Dois-je utiliser le stockage de mots de passe du navigateur ?",
      a: "Les gestionnaires Apple et Google intégrés sont des choix solides et stables dans leurs écosystèmes — soutenus par de grandes équipes de sécurité. KeePass convient pour un contrôle maximal. Bitwarden s'adapte quand vous avez besoin de sync cloud sur des plateformes mixtes, en acceptant un risque serveur plus élevé.",
    },
  ],
  finalTitle: "Recommandation finale",
  finalBody:
    "Aucun gestionnaire n'est parfait pour tout le monde — mais en utiliser un est l'une des mesures les plus efficaces. Associez-le à Passwords.lu pour une génération rapide et à PrivateNote quand vous devez partager des secrets en toute sécurité.",
  finalBullets: [
    { label: "Apple & Google", text: "choix stables par défaut de la plateforme" },
    { label: "KeePass", text: "contrôle local, open source" },
    { label: "Bitwarden", text: "sync cloud quand vous avez besoin de chaque appareil" },
    { label: "Passwords.lu", text: "génération rapide dans le navigateur" },
  ],
  finalCtaPrivateNote: "Partager un secret avec PrivateNote",
  finalCtaPasswordsLu: "Visiter passwords.lu",
  exploreOther: "Explorer d'autres guides",
  allResources: "Toutes les ressources",
  affiliateDisclaimer:
    "Guide éducatif uniquement. Nous pouvons percevoir une commission via des liens d'affiliation lorsque vous utilisez les services recommandés, ce qui aide à soutenir cette ressource gratuite sur la vie privée.",
  otherGuides: [
    { id: "vpn", title: "Guide des services VPN" },
    { id: "messenger", title: "Messagerie sécurisée" },
    { id: "email", title: "E-mail sécurisé" },
    { id: "browser", title: "Navigateurs respectueux de la vie privée" },
  ],
};
