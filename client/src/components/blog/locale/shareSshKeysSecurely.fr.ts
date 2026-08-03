import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyFr: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Développeur travaillant à un bureau avec un ordinateur portable ouvert sur du code—là où les remises de clés SSH commencent souvent",
  heroCaption:
    "Les clés privées SSH doivent être transmises via des remises chiffrées et éphémères—pas Slack, l'e-mail ou l'historique Git. Image : bureau de programmation via Pixabay.",
  intro: [
    "Un collègue a besoin d'accéder au serveur de staging. Un sous-traitant a besoin d'une clé de déploiement pour le week-end. L'ordinateur portable de quelqu'un est mort et le seul accès restant est la clé privée sur votre machine.",
    "Le chemin le plus rapide est généralement la même mauvaise habitude : coller le bloc PEM dans Slack, l'envoyer par e-mail « juste cette fois » ou le déposer dans un ticket. Ce message se synchronise sur les téléphones, atterrit dans les index de recherche, et peut rester dans des sauvegardes longtemps après la fin de l'urgence.",
    "Les clés privées SSH sont des secrets à fort rayon d'explosion. Une seule clé divulguée peut signifier un accès shell complet. Ce guide couvre quand vous devriez partager une clé privée, ce qu'il ne faut jamais coller dans le chat, et comment en transmettre une via un lien chiffré à autodestruction—plus les extensions développeur de PrivateNote qui font du chemin sécurisé le chemin rapide.",
  ],
  sections: [
    {
      title: "Clé publique contre clé privée (30 secondes de clarté)",
      paragraphs: [
        "Une paire de clés SSH a deux moitiés. La clé **publique** est conçue pour être partagée : vous l'ajoutez à `~/.ssh/authorized_keys`, une console cloud, ou une clé de déploiement GitHub. Envoyer la clé publique de quelqu'un dans le chat est normal.",
        "La clé **privée** (`id_ed25519`, `id_rsa`, un fichier `.pem`) est le secret. Toute personne qui la possède peut s'authentifier en tant que cette identité jusqu'à ce que vous révoquiez l'accès. Traitez-la comme un mot de passe qui déverrouille un serveur—car c'est exactement ce qu'elle est.",
        "Si votre instinct vous dit « nous devons partager la clé privée », arrêtez-vous. Dans de nombreux cas, vous devriez plutôt partager la clé **publique** : le destinataire génère sa propre paire localement et vous autorisez sa clé publique sur l'hôte.",
      ],
      calloutTitle: "Règle de base",
      callout:
        "Préférez ajouter leur clé publique plutôt qu'envoyer votre clé privée. Les remises de clé privée sont pour les cas de récupération d'urgence (break-glass) et les cas legacy—pas pour l'intégration par défaut.",
    },
    {
      title: "Préférez ne pas partager la clé privée",
      paragraphs: [
        "Avant de chiffrer et d'envoyer quoi que ce soit, demandez-vous si la clé privée doit vraiment être déplacée :",
      ],
      subsections: [
        {
          title: "Ajouter leur clé publique",
          paragraphs: [
            "Demandez-leur d'exécuter `ssh-keygen`, de vous envoyer le fichier `.pub` (sans risque dans le chat), et de l'ajouter à `authorized_keys` ou aux paramètres SSH du fournisseur. Ils gardent la moitié privée ; vous ne la voyez jamais.",
          ],
        },
        {
          title: "Préférer une clé de déploiement dédiée",
          paragraphs: [
            "Pour la CI ou un seul dépôt, créez une clé de déploiement dédiée avec le périmètre minimal. Évitez de réutiliser une clé personnelle d'ordinateur portable sur plusieurs systèmes.",
          ],
        },
        {
          title: "Préférer un accès de courte durée",
          paragraphs: [
            "Là où votre stack le permet—certificats SSH, hôtes bastion (jump hosts), Tailscale SSH, rôles IAM cloud—préférez un accès limité dans le temps plutôt que de copier des clés privées à longue durée de vie.",
          ],
        },
        {
          title: "Quand la remise d'une clé privée est justifiée",
          paragraphs: [
            "Récupération d'urgence (break-glass), un hôte legacy qui ne peut pas enregistrer rapidement de nouvelles clés, ou une urgence où une seule clé protégée par phrase secrète existe. Même dans ce cas : chiffrez le transfert, gardez une expiration courte, confirmez la réception, puis faites pivoter ou révoquez.",
          ],
        },
      ],
    },
    {
      title: "Où les clés SSH meurent en pratique",
      paragraphs: [
        "Les mêmes canaux qui divulguent des [clés API](blog:how-to-share-api-key-securely) et des [mots de passe](blog:how-to-share-a-password-securely) divulguent aussi du matériel SSH—souvent avec des conséquences plus graves.",
      ],
      comparisonTable: {
        headers: ["Canal", "Pourquoi ça échoue", "Ce que les attaquants obtiennent"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Historique consultable, synchronisation d'appareils, exports d'espace de travail",
            "Clé privée complète en texte clair pour toujours",
          ],
          [
            "E-mail",
            "Boîtes de réception, archives, synchronisation mobile, transferts",
            "Une copie durable que vous ne pouvez pas effacer de manière fiable",
          ],
          [
            "Tickets et documents",
            "Jira, Notion, Confluence, tickets GitHub",
            "Clés dans les sauvegardes, la recherche IA et les pistes d'audit",
          ],
          [
            "Dépôts Git",
            "L'historique est collant ; « supprimer et pousser » n'efface rien",
            "Les scanners trouvent des PEM en quelques minutes sur les dépôts publics",
          ],
        ],
        after: [
          "Si le secret est déjà apparu dans le chat ou Git, considérez-le comme brûlé. Révoquez la clé, générez une nouvelle paire, et livrez le remplacement via un [lien chiffré à usage unique](blog:one-time-secret-links)—pas un autre copier-coller. Pour les fuites de pipeline et de `.env`, voir [secrets dans CI/CD et GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Une remise de clé privée SSH plus sûre",
      paragraphs: [
        "Lorsque vous devez déplacer une clé privée, traitez le transfert comme une livraison temporaire—pas un stockage. Le même schéma utilisé pour les mots de passe et les clés API s'applique : chiffrer localement, envoyer un lien, détruire après lecture, puis faire pivoter.",
        "PrivateNote chiffre dans le navigateur (ou dans votre éditeur/CLI) avec AES-256-GCM avant que quoi que ce soit n'atteigne le réseau. La clé de déchiffrement ne vit que dans le fragment d'URL—la partie `#…` que les navigateurs n'envoient jamais aux serveurs. Détails : [ce que signifie le chiffrement de bout en bout ici](blog:what-is-end-to-end-encryption) et [comment créer une note privée](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Un flux de travail pratique de récupération d'urgence :",
      flowSteps: [
        {
          step: "Étape 1",
          title: "Délimiter et protéger la clé",
          body: "Préférez une clé dédiée pour cet hôte ou cette tâche. Utilisez une phrase secrète sur la clé privée. Évitez d'envoyer votre clé d'identité personnelle quotidienne si une clé plus restreinte suffit.",
        },
        {
          step: "Étape 2",
          title: "Chiffrer localement",
          body: "Collez uniquement le matériel de la clé (pas un roman de noms d'hôtes et de noms d'utilisateurs) dans PrivateNote via l'[application web](app:home), l'[extension VS Code / Cursor](app:developers/vscode), la [CLI](app:developers/cli), ou l'[extension Chrome](chrome:extension).",
        },
        {
          step: "Étape 3",
          title: "Envoyer le lien—pas le PEM",
          body: "Partagez le lien chiffré sur Slack ou par e-mail. Activez éventuellement l'enveloppement par phrase secrète et envoyez cette phrase secrète sur un canal séparé ([conseil de canal séparé](blog:how-to-share-a-password-securely)). Préférez une expiration de 15 minutes ou 1 heure et la destruction après lecture.",
        },
        {
          step: "Étape 4",
          title: "Confirmer, puis faire pivoter",
          body: "Le destinataire installe la clé avec les permissions correctes (`chmod 600`), confirme la connexion, puis vous révoquez l'ancienne clé ou la faites pivoter. Traitez toute clé qui a séjourné dans un prompt IA comme vue—faites-la pivoter.",
        },
      ],
      midCta: {
        body: "Besoin de transmettre une clé SSH maintenant ? Créez une note chiffrée à usage unique et envoyez le lien plutôt que la clé privée.",
        button: "Créer une note privée",
      },
    },
    {
      title: "Extensions développeur : partagez des clés SSH depuis là où vous travaillez",
      paragraphs: [
        "Les remises échouent lorsque l'outil sécurisé est trois clics plus loin que Slack. Les intégrations PrivateNote maintiennent le chiffrement dans votre éditeur, navigateur, terminal ou flux de travail d'agent. Tour complet : [PrivateNote pour les développeurs](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Votre situation", "Meilleure voie"],
        rows: [
          [
            "La clé est déjà ouverte dans l'éditeur",
            "Extension IDE VS Code / Cursor / Codex — sélectionner → partager en tant que PrivateNote",
          ],
          [
            "La clé est sur une page web ou un ticket",
            "Extension Chrome — surligner → Créer une PrivateNote",
          ],
          [
            "Vous êtes dans un terminal",
            "CLI — transmettre le fichier par pipe pour que le PEM ne reste jamais dans l'historique du shell",
          ],
          [
            "Vous voulez qu'un agent produise le lien",
            "Serveur MCP — puis faire pivoter ; préférer l'extension éditeur pour les clés privées",
          ],
          [
            "Le destinataire n'est pas technique",
            "Lien de l'application web sur privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor et Codex IDE",
          paragraphs: [
            "Installez depuis la marketplace (`PrivateNote.privatenote-vscode`), sélectionnez le bloc de clé, et utilisez **Share as PrivateNote**—ou ouvrez le composeur de la barre latérale. Le chiffrement s'exécute dans le processus hôte de l'éditeur, donc le texte en clair n'a jamais besoin d'entrer dans un chat IA. Configuration : [extension VS Code / Cursor](app:developers/vscode).",
          ],
        },
        {
          title: "Extension Chrome",
          paragraphs: [
            "Lorsqu'une clé apparaît dans un ticket, une page de documentation ou une console d'administration, surlignez-la et créez une note chiffrée sans la copier d'abord dans Slack. Installation : [extension Chrome](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Transmettez depuis un fichier par pipe pour que le secret ne soit pas un argument `echo` dans l'historique du shell : `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Documentation : [CLI PrivateNote](app:developers/cli).",
          ],
        },
        {
          title: "MCP pour Cursor, Claude et Codex",
          paragraphs: [
            "Les agents peuvent appeler `create_private_note` après avoir installé [privatenote-mcp](app:developers/mcp). Utile pour l'orchestration—mais si vous collez la clé privée dans le prompt de l'agent, le fournisseur du modèle peut la voir avant le chiffrement. Pour les clés privées SSH, préférez l'extension éditeur ou Chrome. Configuration spécifique à Codex : [PrivateNote avec Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Réserve honnête",
      callout:
        "MCP chiffre après que l'agent a lu le prompt. L'exposition persistante au chat/e-mail disparaît ; la visibilité du fournisseur IA non. Pour les clés privées, utilisez l'extension VS Code ou Chrome afin que le texte en clair ne quitte jamais votre machine avant d'être déjà du texte chiffré.",
    },
    {
      title: "Bonnes pratiques et pièges",
      subsections: [
        {
          title: "Ne jamais committer de clés privées",
          paragraphs: [
            "Gardez `id_*` et `*.pem` hors des dépôts. Ajoutez-les au `.gitignore`. Si une clé a atteint l'historique Git, faites-la pivoter—réécrire l'historique ne suffit plus une fois que le dépôt a été cloné ou scanné.",
          ],
        },
        {
          title: "Corriger les permissions de fichiers",
          paragraphs: [
            "Les clés privées doivent être en `chmod 600` (ou `400`). SSH refusera les fichiers de clé trop permissifs sur de nombreux systèmes—et des clés lisibles par tout le monde sur des machines partagées sont un but marqué contre son camp.",
          ],
        },
        {
          title: "Ne pas mettre de contexte dans la note",
          paragraphs: [
            "Mettez uniquement le matériel de la clé dans la note chiffrée. Envoyez le nom d'hôte, le nom d'utilisateur et le port dans un message séparé. Si le lien fuit, l'attaquant ne devrait pas aussi obtenir une carte étiquetée de ce qu'il déverrouille.",
          ],
        },
        {
          title: "Phrase secrète et canaux séparés",
          paragraphs: [
            "Protégez le fichier de clé lui-même par une phrase secrète, et enveloppez éventuellement la PrivateNote avec une phrase secrète séparée envoyée sur un autre canal. Même conseil que pour le [partage sécurisé de mot de passe](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Le transfert d'agent n'est pas une stratégie de partage",
          paragraphs: [
            "Le transfert d'agent SSH peut réduire les copies de clés sur les hôtes distants, mais ce n'est pas un substitut à une distribution de clés soigneuse—et cela étend la confiance à chaque saut que vous traversez. Utilisez-le délibérément, pas comme excuse pour envoyer des PEM par e-mail.",
          ],
        },
      ],
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Est-il sûr d'envoyer une clé publique dans Slack ?",
          answer:
            "Oui. Les clés publiques sont destinées à être distribuées. Évitez tout de même de déverser des répertoires `~/.ssh` entiers—les gens y incluent accidentellement des fichiers privés.",
        },
        {
          question: "Puis-je mettre une clé privée SSH dans un gestionnaire de mots de passe ?",
          answer:
            "Pour le stockage à long terme des clés que vous conservez, un gestionnaire de mots de passe ou un agent matériel est approprié. Utilisez un lien chiffré à usage unique pour le moment de livraison de personne à personne—le destinataire stocke ensuite la clé correctement. PrivateNote est de la livraison, pas un coffre-fort de secrets.",
        },
        {
          question: "Devrais-je partager la clé et la phrase secrète ensemble ?",
          answer:
            "Non. Cela recrée un point de défaillance unique. Envoyez le lien chiffré sur un canal et toute phrase secrète sur un autre—ou laissez le destinataire définir sa propre phrase secrète après installation et faites pivoter.",
        },
        {
          question: "Quelle expiration devrais-je utiliser ?",
          answer:
            "Pour une coordination en direct, 15 minutes avec destruction après lecture. Pour des remises asynchrones à des sous-traitants, 1 heure ou 1 jour maximum. Préférez plus court chaque fois que le destinataire est joignable.",
        },
        {
          question: "PrivateNote remplace-t-il Vault ou les gestionnaires de secrets cloud ?",
          answer:
            "Non. Utilisez Vault, AWS Secrets Manager et des outils similaires pour le stockage et l'injection machine à machine. Utilisez PrivateNote pour le moment de personne à personne lorsqu'une clé doit traverser le chat ou l'e-mail sans devenir une archive permanente. Même distinction que dans le [guide des clés API](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Réflexions finales",
      paragraphs: [
        "La plupart des problèmes de « partage » SSH sont en réalité des problèmes d'enrôlement : ajoutez une clé publique, utilisez une clé de déploiement, ou émettez un accès de courte durée. Lorsqu'une clé privée doit être déplacée, ne la laissez pas dans l'[historique du chat](blog:secrets-never-send-in-chat) ou l'[e-mail](blog:why-email-is-worst-for-secrets).",
        "Chiffrez localement, envoyez un lien à autodestruction, confirmez l'installation, puis faites pivoter. Connectez les [outils développeur](app:developers) que vous utilisez déjà pour que le chemin sécurisé soit aussi le chemin de moindre résistance.",
      ],
    },
  ],
  ctaTitle: "Partagez le lien—pas la clé privée",
  ctaBody:
    "Créez une PrivateNote chiffrée dans le navigateur avec une expiration courte et destruction après lecture. Ou chiffrez depuis l'extension VS Code, la CLI, ou l'extension Chrome afin que le PEM n'atterrisse jamais en texte clair dans Slack.",
  ctaButton: "Créer une note privée",
};
