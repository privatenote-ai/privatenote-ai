import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsFr: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Ordinateur portable de développeur sur un bureau la nuit affichant un terminal et des fichiers de configuration sous une lumière bleue froide",
  heroCaption:
    "La plupart des fuites de secrets commencent par la commodité : un .env commité, une variable CI collée, ou une clé qui n’a jamais quitté l’historique Git.",
  intro: [
    "Les clés API ne fuient généralement pas via des attaques cryptographiques sophistiquées. Elles fuient via les workflows développeurs—fichiers `.env` commités dans Git, secrets affichés dans les logs CI, et identifiants collés dans des pull requests « juste pour l’instant ».",
    "Si vous savez déjà [comment partager une clé API en toute sécurité](blog:how-to-share-api-key-securely), ce guide est la couche suivante : où ces clés s’échappent réellement dans la livraison logicielle moderne, et comment empêcher GitHub, CI/CD et la config locale de devenir une archive permanente de votre accès production.",
    "Le schéma est toujours le même. Un secret entre dans un système conçu pour conserver l’historique. Des mois plus tard, un fork, un export de logs, un laptop compromis ou un scan de repo public transforme cette commodité en incident.",
  ],
  sections: [
    {
      title: "Pourquoi les fichiers .env et le CI/CD attirent les fuites développeur",
      paragraphs: [
        "Les fichiers d’environnement locaux et les pipelines existent pour déplacer la configuration rapidement. Cette vitesse est utile—et dangereuse—parce que les secrets voyagent souvent avec les mêmes outils que vous utilisez pour la revue de code, les artefacts de build et l’automatisation.",
        "Un fichier `.env` semble temporaire. Un secret stocké en CI semble « géré ». Un `echo $DATABASE_URL` de debug semble inoffensif dans un repo privé. Les attaquants—et les scanners de secrets automatisés—ne se soucient pas de l’intention. Ils se soucient de la permanence, de la recherchabilité et du rayon d’impact.",
        "Traitez chaque secret qui touche Git ou CI comme s’il finirait par être copié, mirroirisé ou indexé. Concevez le workflow pour que cette hypothèse soit survivable : identifiants à courte durée de vie, stores de secrets appropriés, et transmissions humaines qui ne laissent pas de texte en clair dans le chat ou les tickets.",
      ],
    },
    {
      title: "Comment les secrets s’échappent via GitHub",
      subsections: [
        {
          title: "Fichiers .env et de config commités",
          paragraphs: [
            "La fuite classique reste la plus courante : `cp .env.example .env`, renseigner les valeurs de production, puis `git add .` sans y prêter attention. Même si vous supprimez le fichier au commit suivant, le secret reste dans l’historique Git jusqu’à ce que vous le réécrivez—et les dépôts publics peuvent être scannés très rapidement pour des identifiants exposés. Réécrire l’historique n’efface pas non plus toutes les copies : forks, miroirs, caches CI et clones locaux peuvent encore détenir les anciens commits.",
            "Les variantes incluent `docker-compose.yml` avec des mots de passe en dur, l’état Terraform avec des sorties sensibles, des manifests Kubernetes qui stockent des « secrets » encodés en base64 (base64 est un encodage, pas du chiffrement—quiconque peut lire le manifest peut décoder la valeur), et des cellules de notebook qui affichent des tokens. Si cela ressemble à de la configuration, supposez que les scanners le traiteront comme un dump d’identifiants.",
          ],
        },
        {
          title: "Pull requests, issues et commentaires",
          paragraphs: [
            "Les développeurs collent des clés de staging dans les descriptions de PR pour « aider le reviewer à reproduire le bug ». Les commentaires de tickets et GitHub Discussions héritent du même problème : permanence recherchable, notifications, digests e-mail et exports.",
            "Les dépôts privés réduisent fortement l’exposition fortuite, mais ce ne sont toujours pas un store de secrets approprié. Les changements d’accès, les prestataires, les comptes compromis, les clones, les sauvegardes et les intégrations peuvent tous faire resurgir du texte en clair historique. Pour les transmissions de clés API entre humains, utilisez un [lien à usage unique chiffré côté client](blog:one-time-secret-links)—pas un commentaire de PR.",
          ],
        },
        {
          title: "Forks, miroirs et historique qui ne meurt jamais",
          paragraphs: [
            "Une clé commitée une fois peut survivre dans les forks, miroirs, caches CI et clones locaux longtemps après le nettoyage de la branche principale. La rotation du secret est la vraie remédiation ; la réécriture d’historique est du contrôle des dégâts.",
            "Si GitHub Secret Scanning, TruffleHog, gitleaks ou une alerte cloud se déclenche, rotatez d’abord. Puis retirez le secret des branches actives. Seulement ensuite décidez si la réécriture d’historique vaut le coût de coordination.",
          ],
        },
      ],
      calloutTitle: "Règle stricte",
      callout:
        "Ne committez jamais de secrets live dans Git—même des identifiants de staging temporaires. Si un secret doit circuler entre des personnes, utilisez un canal de livraison sécurisé approprié, comme un lien à usage unique chiffré côté client. Si l’automatisation a besoin du secret, utilisez le mécanisme natif de secrets de la plateforme CI, un gestionnaire de secrets dédié, ou de préférence des identifiants à courte durée de vie obtenus via workload identity ou OIDC—pas le dépôt.",
    },
    {
      title: "Comment les secrets s’échappent via CI/CD",
      subsections: [
        {
          title: "Texte en clair dans les fichiers de workflow",
          paragraphs: [
            "Mettre `API_KEY: sk-...` directement dans `.github/workflows/*.yml`, le YAML GitLab CI ou la config CircleCI, c’est juste committer un secret avec des étapes en plus. Les fichiers de workflow sont du code. Ils sont revus, clonés et conservés pour toujours.",
            "Utilisez le mécanisme natif de secrets de la plateforme (secrets GitHub Actions, variables GitLab CI/CD et équivalents) et référencez-les comme bindings d’environnement—pas du YAML en dur. Les secrets CI natifs sont bien meilleurs que le dépôt, mais ce n’est pas magique : une logique de workflow malveillante, des dépendances compromises et un logging négligent peuvent encore exposer des valeurs à l’exécution. Préférez OIDC ou une autre fédération d’identité de charge de travail vers les cloud providers afin de ne pas avoir besoin de clés cloud longue durée dans le CI.",
          ],
        },
        {
          title: "Logs de pipeline et sortie de debug",
          paragraphs: [
            "Les logs de build sont une archive sous-estimée. Afficher des variables d’env « pour débugger le deploy », dumper `process.env`, ou lancer une sortie Terraform/Helm verbeuse peut écrire des identifiants dans un stockage de logs qui survit au job.",
            "Supposez que les logs sont lisibles par quiconque a accès au CI—et parfois par quiconque peut télécharger des artefacts. Masquez les secrets, évitez de dumper l’env, et traitez une ligne de log fuitée comme un mot de passe fuité : rotatez.",
          ],
        },
        {
          title: "Pull requests depuis des forks",
          paragraphs: [
            "Les PR de forks sont un piège CI classique : du code non fiable qui s’exécute avec des secrets. La plupart des plateformes restreignent la disponibilité des secrets sur les workflows de forks pour exactement cette raison. Gardez-le ainsi. N’« activez jamais les secrets » pour des contributeurs externes juste pour faire passer un check au vert.",
            "Pour les repos internes, séparez quand même les jobs de deploy privilégiés des checks de PR. Build et test avec le moindre privilège ; deploy uniquement depuis des branches de confiance avec des secrets explicitement accordés.",
          ],
        },
        {
          title: "Runners partagés et fuite d’artefacts",
          paragraphs: [
            "Les runners self-hosted, les caches partagés et les artefacts uploadés peuvent conserver des tokens plus longtemps que le job qui les a créés. Nettoyez les workspaces, scopez soigneusement les clés de cache, et ne packez jamais de fichiers `.env` dans des artefacts de build « par commodité ».",
          ],
        },
      ],
    },
    {
      title: "Un modèle mental plus sûr : trois endroits où les secrets peuvent vivre",
      paragraphs: [
        "La confusion survient quand les équipes utilisent un seul outil pour chaque tâche. Découpez le problème par cycle de vie.",
      ],
      comparisonTable: {
        headers: ["Endroit", "Idéal pour", "Pas pour"],
        rows: [
          [
            "Local .env / dotenv",
            "Config de développement local qui reste sur le laptop et est correctement gitignored",
            "Partage avec des collègues, CI, Git, ou secrets de production longue durée en clair",
          ],
          [
            "Secrets CI natifs / Vault / cloud secret manager",
            "Runtime machine-à-machine et automatisation de deploy",
            "Transmissions chat humaines ou messages longue durée « passe ça au prestataire »",
          ],
          [
            "Note à usage unique chiffrée côté client",
            "Livraison humaine d’une clé, d’un token ou d’un extrait .env",
            "Stockage de secrets de production pour apps ou pipelines",
          ],
        ],
        after: [
          "Un `.env` gitignored convient au développement local. Les secrets de production sensibles ne devraient idéalement pas non plus vivre indéfiniment en clair sur les machines des développeurs—préférez un gestionnaire de mots de passe ou un accès à courte durée de vie quand c’est pratique. PrivateNote se situe dans la troisième ligne : livraison sécurisée entre personnes. Ce n’est pas un remplacement des secrets GitHub Actions, HashiCorp Vault, AWS Secrets Manager, ou de votre gestionnaire de mots de passe. Pour les transmissions quotidiennes de clés API, couplez ceci avec [comment partager une clé API en toute sécurité](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Workflow pratique : garder les secrets hors de Git et du chat",
      flowIntro:
        "Quand un collègue, un prestataire ou un client a besoin d’une valeur qui finira dans le CI ou un `.env` local, utilisez cette séquence :",
      flowSteps: [
        {
          step: "Étape 1",
          title: "Créer un identifiant scoped et à courte durée de vie",
          body: "Préférez les clés de staging, les scopes en lecture seule, les listes d’IP autorisées et l’expiration. Évitez de distribuer la clé de production principale « parce que c’est plus rapide ».",
        },
        {
          step: "Étape 2",
          title: "Livrer via une note à usage unique chiffrée côté client",
          body: "Chiffrez le secret (ou les quelques lignes `.env` requises) localement avec PrivateNote—via l’[app web](app:home), la [CLI](app:developers/cli), l’[extension VS Code / Cursor](app:developers/vscode) ou l’[extension Chrome](chrome:extension). Définissez une expiration courte ou burn-after-read, puis envoyez le lien de la note—pas le texte en clair—via Slack, e-mail ou ticket.",
        },
        {
          step: "Étape 3",
          title: "Installer dans le bon store",
          body: "Le destinataire copie la valeur dans un `.env` local gitignored (pour le développement), un gestionnaire de mots de passe, ou le store de secrets CI/cloud. Ne la recollez pas dans la PR, le fil de chat ou un doc partagé.",
        },
        {
          step: "Étape 4",
          title: "Rotater quand le travail est terminé",
          body: "Révoquez les clés prestataires, rotatez après incidents, et remplacez tout identifiant qui a jamais apparu dans des logs, Git ou un ticket. La commodité sans rotation n’est qu’une réponse à incident différée.",
        },
      ],
      midCta: {
        body: "Besoin de transmettre un token CI ou quelques lignes .env maintenant ? Envoyez une note à usage unique chiffrée côté client au lieu de committer ou coller du texte en clair.",
        button: "Créer une note privée",
      },
    },
    {
      title: "Partager depuis là où vous travaillez déjà",
      paragraphs: [
        "Vous n’avez pas besoin de quitter votre terminal, éditeur ou onglet de navigateur pour créer une note à usage unique chiffrée côté client. Choisissez la surface PrivateNote qui correspond au moment—le chiffrement se fait toujours localement sur votre appareil avant l’upload. Pour un parcours plus complet, voir [PrivateNote pour les développeurs](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Lisez depuis un fichier ou pipez stdin pour que le secret ne reste jamais dans l’historique shell comme argument d’`echo` : `npx privatenote-cli --expire 1h --output-url-only .env.local` ou `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Utile dans les workflows shell, scripts et transmissions rapides au terminal. Setup et flags : [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code et Cursor",
          paragraphs: [
            "Installez l’[extension VS Code / Cursor](app:developers/vscode), puis chiffrez depuis la barre latérale, la sélection de l’éditeur ou le menu contextuel—idéal quand le secret est déjà à l’écran dans un `.env` ou un fichier de config et ne doit jamais atterrir en clair dans Slack.",
          ],
        },
        {
          title: "Extension Chrome",
          paragraphs: [
            "Quand l’identifiant apparaît dans un e-mail, des docs ou un ticket, l’[extension Chrome](chrome:extension) transforme le texte sélectionné en note à usage unique chiffrée dans le navigateur sans quitter l’onglet.",
          ],
        },
      ],
    },
    {
      title: "Checklist développeur avant chaque push et changement de pipeline",
      useCaseTable: {
        headers: ["Point de contrôle", "Quoi vérifier"],
        rows: [
          [
            "Avant le git commit",
            "`.env`, `*.pem`, `credentials.json` et fichiers de secrets locaux sont gitignored ; `git status` ne montre aucune addition surprise",
          ],
          [
            "Avant d’ouvrir une PR",
            "Aucune clé dans la description, captures d’écran, fixtures ou fichiers de debug « temporaires »",
          ],
          [
            "Avant d’éditer des workflows",
            "Les secrets viennent du mécanisme natif de secrets de la plateforme ou d’OIDC/workload identity—pas de YAML en dur",
          ],
          [
            "Avant de débugger le CI",
            "Pas de `env`, `printenv` ou dumps verbeux qui pourraient écrire des secrets dans les logs",
          ],
          [
            "Après toute exposition",
            "Rotater d’abord, puis nettoyer historique/branches ; traiter les scanners comme des déclencheurs d’incident",
          ],
        ],
      },
      callout:
        "Ajoutez le secret scanning au chemin par défaut : hooks pre-commit (gitleaks), scanning CI, et GitHub Secret Scanning / push protection. La prévention bat les réécritures d’historique héroïques.",
    },
    {
      title: "Que faire si un secret est déjà dans GitHub",
      paragraphs: [
        "Agissez dans cet ordre : **rotater ou révoquer** l’identifiant chez le provider, **invalider** les sessions ou webhooks dépendants, **retirer** le secret de la branche par défaut, puis décider si une réécriture d’historique est requise pour la conformité ou l’exposition publique. Même après une réécriture, supposez que forks, miroirs, caches et clones peuvent encore détenir des copies jusqu’à ce qu’ils soient traités séparément.",
        "Notifiez les propriétaires de tout système que la clé pourrait atteindre. Vérifiez la facturation cloud, les logs d’accès et l’usage API inhabituel. Si le secret a aussi été collé dans Slack ou un e-mail, supposez que ces archives le contiennent encore—voir [pourquoi l’e-mail est le pire endroit pour les secrets](blog:why-email-is-worst-for-secrets) et [les secrets à ne jamais envoyer dans le chat](blog:secrets-never-send-in-chat).",
        "Pour des secrets extrêmement précieux comme les seed phrases crypto, évitez de les transmettre autant que possible. Pour d’autres identifiants root irremplaçables, ne les tapez pas du tout dans un site web—chiffrez d’abord localement et ne partagez que le ciphertext quand vous devez. Ce modèle est couvert dans notre [guide seed phrase crypto](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "Un dépôt GitHub privé suffit-il pour les fichiers .env ?",
          answer:
            "Non. Un dépôt privé limite fortement l’exposition, mais ce n’est toujours pas un store de secrets approprié. Les changements d’accès, comptes compromis, clones, sauvegardes et intégrations tierces peuvent tous faire resurgir du texte en clair historique. Gardez les secrets entièrement hors de Git.",
        },
        {
          question: "Les secrets GitHub Actions suffisent-ils ?",
          answer:
            "C’est le bon endroit pour de nombreuses valeurs runtime CI—bien mieux que le YAML ou les fichiers du repo. Ils ne résolvent toujours pas la livraison humaine, les fuites de logs, les permissions trop larges, les risques des PR de forks, ni l’exposition via des étapes de workflow malveillantes et des dépendances compromises. Combinez le mécanisme natif de secrets de la plateforme avec le moindre privilège, un logging prudent, et de préférence des identifiants à courte durée de vie via OIDC ou workload identity.",
        },
        {
          question: "Dois-je committer un .env.example expurgé ?",
          answer:
            "Oui. Committez uniquement les noms de variables et des placeholders factices. Ne committez jamais de vraies valeurs, de clés de staging « presque réelles », ou des chaînes de connexion production avec le mot de passe retiré mais l’hôte et le nom d’utilisateur intacts si cette combinaison est sensible dans votre modèle de menace.",
        },
        {
          question: "Un fichier .env local est-il acceptable ?",
          answer:
            "Pour le développement local, oui—quand il est correctement gitignored et jamais commité. Les secrets de production sensibles ne devraient idéalement pas vivre indéfiniment dans des fichiers `.env` en clair sur les machines des développeurs ; utilisez un gestionnaire de mots de passe, un accès à courte durée de vie, ou un gestionnaire de secrets quand c’est pratique.",
        },
        {
          question: "PrivateNote peut-il remplacer Vault ou les secrets GitHub ?",
          answer:
            "Non. PrivateNote sert à la livraison sécurisée humain-à-humain. Utilisez le mécanisme natif de secrets de la plateforme CI et des gestionnaires de secrets dédiés pour l’automatisation. Utilisez PrivateNote quand une personne doit recevoir une clé, un token ou un extrait .env sans laisser de texte en clair dans Slack, l’e-mail ou GitHub.",
        },
        {
          question: "Quelle est la transmission sûre la plus rapide pour un token CI ?",
          answer:
            "Créez un token étroitement scoped, livrez-le via une note à usage unique chiffrée côté client (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) ou [Chrome](chrome:extension)), faites le stocker par le destinataire dans le store de secrets CI ou un gestionnaire de mots de passe, puis révoquez le token quand le travail est terminé.",
        },
      ],
    },
    {
      title: "Réflexions finales",
      paragraphs: [
        "GitHub et CI/CD excellent à préserver le travail. C’est exactement pourquoi ce sont de mauvais endroits pour préserver des secrets.",
        "Gardez les fichiers `.env` locaux, gitignored, et limités au développement quand vous le pouvez. Mettez les identifiants d’automatisation dans les secrets CI natifs, un gestionnaire de secrets, ou des identifiants OIDC à courte durée de vie. Quand un humain a besoin d’une valeur, utilisez une note à usage unique chiffrée côté client—puis rotatez.",
        "Si votre équipe colle encore des clés dans des PR ou commit des identifiants « juste staging », commencez par le [workflow de partage de clés API](blog:how-to-share-api-key-securely) et la checklist ci-dessus. Pour le matériel d’accès serveur, utilisez [comment partager des clés SSH en toute sécurité](blog:how-to-share-ssh-keys-securely). Intégrez la [CLI](app:developers/cli), l’[extension VS Code](app:developers/vscode) ou l’[extension Chrome](chrome:extension) dans le chemin de moindre résistance pour que l’option sûre soit aussi la rapide.",
      ],
    },
  ],
  ctaTitle: "Partagez le secret—pas une copie permanente",
  ctaBody:
    "Chiffrez un token CI ou un extrait .env localement avec PrivateNote—via l’app web, la CLI, VS Code / Cursor ou l’extension Chrome—avant qu’il n’atteigne le chat ou Git. Utilisez une expiration courte ou burn-after-read, envoyez le lien de note à usage unique au lieu du texte en clair, et gardez l’historique Git et des pipelines libre d’identifiants live.",
  ctaButton: "Créer une note privée",
};
