import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteFr: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret et PrivateNote résolvent le même problème pratique : faire circuler un mot de passe, une clé API, un code de récupération ou une note confidentielle via un lien temporaire, plutôt que de laisser du texte en clair dans un e-mail ou un chat. Le destinataire ouvre le lien, et la charge utile stockée peut disparaître après lecture ou à l’expiration.",
    "Les deux produits chiffrent la charge utile. La différence importante est l’endroit où le chiffrement a lieu.",
    "OneTimeSecret décrit son architecture comme un chiffrement côté serveur. Le texte en clair atteint OneTimeSecret avant d’être chiffré. PrivateNote chiffre d’abord en local, de sorte que le service reçoit du texte chiffré plutôt que la charge utile en clair. Cette différence détermine la frontière de confiance cryptographique.",
  ],
  sections: [
    {
      title: "Deux façons de construire le même lien",
      paragraphs: [
        "Dans le **chiffrement côté serveur**, l’expéditeur soumet le secret au service via TLS. Le service reçoit le texte en clair, le chiffre et stocke du texte chiffré. Il peut ensuite stocker la charge utile, la délivrer, la faire expirer et la supprimer. Le serveur d’application fait partie du processus de chiffrement, car le texte en clair entre dans le service avant de devenir du texte chiffré.",
        "Dans le **chiffrement côté client**, l’appareil de l’expéditeur chiffre d’abord. Le service reçoit et stocke du texte chiffré. Cet envoi circule via TLS. Le service ne reçoit pas la clé nécessaire pour déchiffrer une charge utile standard. L’appareil du destinataire déchiffre en local. Le service peut toujours stocker, délivrer, faire expirer et supprimer la charge utile sans avoir besoin d’accéder à son texte en clair.",
        "Les deux conceptions peuvent fournir des liens temporaires, un accès limité et une expiration. Les deux peuvent être décrites avec exactitude comme chiffrées. OneTimeSecret utilise la première architecture ; PrivateNote utilise la seconde. La question pertinente n’est donc pas simplement de savoir si un lien à usage unique est chiffré, mais quels systèmes doivent avoir accès au texte en clair pour que ce lien fonctionne.",
      ],
    },
    {
      title: "OneTimeSecret : chiffrement côté serveur",
      paragraphs: [
        "Dans le flux ordinaire d’OneTimeSecret, l’expéditeur soumet le secret via TLS. L’application reçoit le texte en clair, le chiffre sur le serveur et stocke la charge utile chiffrée.",
        "Cela offre une protection réelle pour les données stockées. Obtenir seul le stockage chiffré ne révèle pas nécessairement son contenu lorsque le matériel requis pour le déchiffrement est indisponible à l’attaquant.",
        "Le compromis architectural survient avant le stockage. TLS protège le secret pendant son trajet entre le navigateur et OneTimeSecret, mais l’application doit traiter le texte en clair pour le chiffrer. Le serveur d’application se situe donc à l’intérieur de la frontière de confiance cryptographique.",
        "Un processus d’application malveillant ou compromis à ce moment-là pourrait accéder au secret avant qu’il ne soit chiffré pour le stockage. Le chiffrement côté client supprime cette dépendance particulière en chiffrant le secret avant qu’il n’atteigne le service.",
      ],
    },
    {
      title: "La phrase secrète d’OneTimeSecret ne change pas la frontière de chiffrement",
      paragraphs: [
        "La documentation d’OneTimeSecret décrit une phrase secrète optionnelle. Lorsqu’une phrase secrète est utilisée, OneTimeSecret indique que le secret est chiffré sur ses serveurs à l’aide de la phrase secrète fournie par l’expéditeur. Il indique qu’il ne stocke pas la phrase secrète elle-même ; à la place, il conserve un hachage bcrypt utilisé pour vérifier la phrase secrète lors de la récupération. Selon sa documentation, ce hachage ne peut pas lui-même déchiffrer le secret, et le secret stocké protégé par phrase secrète ne peut pas être déchiffré sans la phrase secrète d’origine.",
        "La récupération utilise la même frontière côté serveur. Le destinataire fournit la phrase secrète à OneTimeSecret via TLS. Le service la vérifie et effectue le déchiffrement sur le serveur avant de renvoyer le texte en clair.",
        "Cela signifie que le processus d’application a accès au secret et à la phrase secrète lorsque le chiffrement a lieu, et traite à nouveau la phrase secrète et le texte en clair résultant lors de la récupération. Un processus d’application malveillant ou compromis opérant à l’un ou l’autre de ces points pourrait potentiellement capturer ces informations. C’est une conséquence de l’endroit où le chiffrement et le déchiffrement s’exécutent, non une affirmation qu’OneTimeSecret enregistre ou détourne ces valeurs.",
        "La documentation publique d’OneTimeSecret n’établit pas, à elle seule, chaque détail de sa hiérarchie de clés interne — par exemple, précisément comment le matériel de clé côté serveur, les clés par secret, la dérivation de clés et la phrase secrète fournie sont combinés. Il n’est pas nécessaire de spéculer sur ces détails d’implémentation pour cette comparaison. La propriété documentée pertinente est que le chiffrement et le déchiffrement ont lieu côté service.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "Le secret que vous souhaitez envoyer, et la phrase secrète lorsque vous en définissez une, voyagent tous deux vers le serveur via TLS. Le chiffrement s’exécute sur ce serveur. Ce qui reste en stockage est du texte chiffré.",
          columns: [
            [
              { text: "Secret + phrase secrète", via: "TLS" },
              { text: "Serveur", via: "Chiffrer" },
              { text: "Texte chiffré" },
            ],
          ],
        },
      ],
    },
    {
      title: "L’auto-hébergement peut rendre cette confiance serveur raisonnable",
      paragraphs: [
        "OneTimeSecret est open source. Une organisation peut faire tourner sa propre instance à l’intérieur d’un périmètre de sécurité d’entreprise, plutôt que d’envoyer des secrets au service public.",
        "Dans ce déploiement, faire confiance au serveur d’application, c’est faire confiance à une infrastructure que l’organisation opère déjà. Le texte en clair atteint toujours ce serveur, car le chiffrement s’y produit encore. La partie de l’autre côté de la frontière, ce sont les hôtes, opérateurs et sauvegardes de l’organisation elle-même. Pour une équipe qui accepte déjà ces systèmes comme faisant partie du chemin emprunté par un secret, le chiffrement côté serveur peut être un choix raisonnable. Il réduit l’écart entre les modèles de menace côté serveur et côté client, car l’opérateur n’est plus un service extérieur.",
      ],
    },
    {
      title: "PrivateNote chiffre avant l’envoi",
      paragraphs: [
        "Une PrivateNote standard est chiffrée avant l’envoi. Le navigateur de l’expéditeur, ou un processus local [CLI](app:developers/cli), [extension Chrome](app:developers/chrome), [extension d’éditeur](app:developers/vscode) ou [MCP](app:developers/mcp), génère une clé aléatoire et chiffre la charge utile avec AES-256-GCM. Seul du texte chiffré est envoyé. TLS transporte ce texte chiffré du navigateur vers le worker Cloudflare de PrivateNote. La clé de déchiffrement est placée dans le fragment d’URL, la partie après `#`, par exemple `https://privatenote.ai/note/abc123#…`. Le fragment est géré côté client et n’est pas inclus dans la requête HTTPS ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5) ; [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). Le worker reçoit un identifiant de note et renvoie du texte chiffré sur la même connexion TLS. Le navigateur conserve le fragment et déchiffre en local.",
      ],
    },
    {
      title: "Une phrase secrète protège la clé si le canal du lien est compromis",
      paragraphs: [
        "Une phrase secrète sur PrivateNote remplit un rôle différent d’une phrase secrète sur OneTimeSecret. La note est déjà du texte chiffré avant de quitter l’appareil. Si vous ajoutez une phrase secrète, le navigateur en dérive une clé d’enveloppement avec Argon2id et utilise cette clé pour chiffrer la clé de la note. Le fragment d’URL détient alors la clé enveloppée. Le destinataire a besoin du lien et de la phrase secrète. Le navigateur déenveloppe la clé en local et seulement ensuite déchiffre la note.",
        "PrivateNote ne reçoit pas la phrase secrète. La requête de création transporte du texte chiffré, un sel et les paramètres dont le navigateur du destinataire a besoin pour essayer la phrase secrète en local. Il n’y a pas de hachage côté serveur dont le rôle serait de vérifier la phrase secrète. Une mauvaise phrase secrète fait échouer le déchiffrement sur l’appareil.",
        "La phrase secrète protège en outre la clé côté client en local si le canal qui transporte le lien est compromis. Ce canal voit alors une clé enveloppée, pas une clé qui peut ouvrir la note à elle seule. Ce n’est pas le mécanisme qui maintient PrivateNote hors du chemin du texte en clair. Cette séparation est déjà là sur une note standard, avec ou sans phrase secrète. Partagez la phrase secrète sur un canal différent de celui du lien. Le même message fait s’effondrer les deux couches en une seule — la même règle que pour [partager un mot de passe en toute sécurité](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "Le chiffrement local produit la clé côté client et le texte chiffré. Argon2id enveloppe cette clé, et la clé enveloppée reste dans le fragment d’URL. TLS ne transporte que le texte chiffré vers le worker Cloudflare.",
          columns: [
            [
              { text: "Secret" },
              { text: "Chiffrement local" },
              { text: "Texte chiffré", via: "TLS" },
              { text: "Serveur" },
            ],
            [
              { text: "Phrase secrète" },
              { text: "Argon2id local" },
              { text: "Envelopper la clé" },
              { text: "Fragment d’URL" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "La même séparation, une propriété à la fois.",
        headers: ["", "OneTimeSecret + phrase secrète", "PrivateNote + phrase secrète"],
        rows: [
          ["Chiffrement de la charge utile", "Serveur", "Appareil de l’expéditeur"],
          ["Le texte en clair atteint le service", "Oui", "Non"],
          ["La phrase secrète atteint le service", "Oui", "Non"],
          [
            "Rôle de la phrase secrète",
            "Participe à la protection côté serveur",
            "Dérive une clé d’enveloppement locale",
          ],
          [
            "Vérificateur ou matériel stocké",
            "Vérificateur bcrypt et charge utile chiffrée, selon la documentation d’OneTimeSecret",
            "Sel, paramètres d’enveloppement Argon2id et texte chiffré",
          ],
          ["Où le déchiffrement s’exécute", "Serveur d’application OneTimeSecret", "Appareil du destinataire"],
        ],
      },
      paragraphsAfterTable: [
        "La gestion des clés de PrivateNote est décrite sur [Comment ça marche](app:how-it-works) : la clé de contenu est enveloppée avec Argon2id, et la clé enveloppée voyage dans le lien.",
      ],
    },
    {
      title: "L’hypothèse de confiance restante du client web",
      paragraphs: [
        "Le chiffrement côté client dans un navigateur n’est pas une application web sans confiance. La cryptographie peut s’exécuter en local tandis que le JavaScript qui l’implémente est livré par le site. Le navigateur fait confiance au code qu’il reçoit pour cette session.",
        "Quelqu’un qui peut altérer ce JavaScript — via l’application, un CDN ou le pipeline de déploiement — pourrait modifier le client et capturer des clés lors d’une future session navigateur. C’est une défaillance différente du vol d’une base de données. Une compromission du stockage expose du texte chiffré. La livraison de code malveillant attaque le point d’extrémité pendant que la clé est effectivement présente.",
        "Un dump de base de données ultérieur ne peut pas fabriquer des clés côté client qui n’y ont jamais été stockées. Un client activement compromis peut attaquer les secrets traités pendant cette session. La même hypothèse figure dans le modèle de menace de PrivateNote : le code d’application livré n’a pas été modifié de façon malveillante, et les appareils de l’expéditeur et du destinataire sont de confiance au moment du chiffrement et du déchiffrement.",
        "Les logiciels installés réduisent cette dépendance à une page fraîchement téléchargée. Une CLI, une extension d’éditeur ou une application native exécute du code que vous avez installé. Ces clients dépendent encore du système d’exploitation, de la signature, des dépendances et du canal de mise à jour. Les [outils développeur](app:developers) utilisent la même séparation que le navigateur : chiffrer en local, envoyer du texte chiffré, laisser la clé dans le fragment.",
      ],
    },
    {
      title: "Durée de vie et confidentialité",
      paragraphs: [
        "Un lien à usage unique répond à deux questions distinctes. Combien de temps la charge utile chiffrée doit-elle exister ? Et qui peut la déchiffrer tant qu’elle existe ? La détruire après récupération ou expiration raccourcit la fenêtre. Cela ne décide pas qui pourrait la lire pendant cette fenêtre. Durée de vie et confidentialité se soutiennent mutuellement. L’une ne remplace pas l’autre.",
        "La distinction est la plus nette lorsque la charge utile est une autorité : clés API, identifiants de base de données, jetons cloud, codes de récupération, mots de passe d’infrastructure. Un service de partage de secrets existe parce que l’expéditeur veut confier cette information à moins de systèmes. Si l’intermédiaire n’a qu’à transporter un objet chiffré opaque, faire respecter l’expiration et le supprimer, le serveur peut faire ce travail sans recevoir le secret ni la clé qui l’ouvre.",
      ],
    },
    {
      title: "Où se situe la frontière",
      paragraphs: [
        "« Chiffré » ne vous dit pas où se situe la frontière de confiance. Le critère utile est une frontière de confiance minimale : le principe du moindre privilège appliqué à qui doit voir le texte en clair. En ingénierie cryptographique moderne, l’objectif n’est pas seulement de faire confiance au comportement d’un serveur, mais de réduire d’emblée la nécessité mathématique de cette confiance.",
        "OneTimeSecret décrit un système chiffré côté serveur. Avec la protection par phrase secrète, il indique que le secret stocké ne peut pas ensuite être déchiffré sans la phrase secrète, et qu’une compromission du serveur laisserait le secret en sécurité tant que cette phrase secrète reste inconnue. Une phrase secrète faible peut être attaquée par force brute. Si elle est faible, cette compromission peut quand même laisser le secret récupérable. Le texte en clair et la phrase secrète atteignent OneTimeSecret à la création, car le chiffrement a lieu sur ses serveurs, et la phrase secrète est renvoyée à la récupération pour que ces serveurs puissent déchiffrer.",
        "PrivateNote fait un choix architectural différent. La charge utile est chiffrée avant d’atteindre le service, et la clé de charge utile standard reste côté client. Une phrase secrète, lorsque vous en définissez une, protège en outre cette clé côté client en local si le canal qui transporte le lien est compromis. Elle n’est pas envoyée à PrivateNote.",
        "OneTimeSecret chiffre votre secret. Le client qui utilise le service PrivateNote le chiffre avant que le service ne le reçoive. Cette distinction ne dépend pas de l’hypothèse qu’un fournisseur ou l’autre soit malveillant. Elle ramène la question à l’architecture : combien de systèmes ont besoin d’accéder au texte en clair pour que le service fonctionne ?",
      ],
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question: "OneTimeSecret stocke-t-il le secret en clair ?",
          answer:
            "Leur documentation dit non. Ils chiffrent sur leurs serveurs. Avec une phrase secrète, ils indiquent stocker le secret chiffré et un hachage bcrypt de la phrase secrète, pas la phrase secrète, et que le hachage ne peut pas déchiffrer le secret.",
        },
        {
          question: "Si je définis une phrase secrète sur OneTimeSecret, le secret est-il caché à leurs serveurs ?",
          answer:
            "Pas pendant la création, et pas à la récupération. OneTimeSecret indique que le secret et la phrase secrète sont fournis à son serveur pour que le serveur puisse effectuer le chiffrement. Lorsque le destinataire ouvre le lien, il renvoie la phrase secrète via TLS, et le déchiffrement s’exécute sur les serveurs d’OneTimeSecret avant que le texte en clair ne soit renvoyé. Après le chiffrement, OneTimeSecret indique qu’il jette la phrase secrète en clair, ne conserve qu’un hachage bcrypt, et ne peut pas déchiffrer le secret stocké sans la phrase secrète d’origine.",
        },
        {
          question: "Que protège une phrase secrète PrivateNote ?",
          answer:
            "La clé côté client, si le canal qui transporte le lien est compromis. La note elle-même est déjà chiffrée sur votre appareil avec AES-256-GCM. Argon2id dérive une clé d’enveloppement à partir de la phrase secrète en local, et cette clé d’enveloppement chiffre la clé de la note. Le lien détient alors une clé enveloppée. PrivateNote reçoit du texte chiffré et un sel. Il ne reçoit ni la phrase secrète ni la clé brute. Une note standard est chiffrée avant l’envoi même sans phrase secrète. Envoyez la phrase secrète sur un canal séparé de celui du lien.",
        },
        {
          question: "Le chiffrement côté client peut-il protéger contre un serveur PrivateNote compromis ?",
          answer:
            "Compromission des données stockées ou de l’API : oui, dans le sens où le chiffrement côté client isole les charges utiles non lues, car le serveur n’a pas la clé de charge utile standard. Un dump de base de données ultérieur ne peut pas fabriquer des clés qui n’y ont jamais été stockées. Livraison de code client malveillant : non. Un attaquant qui peut modifier le JavaScript livré à une future session navigateur pourrait tenter de capturer la clé pendant qu’elle est présente. Les clients installés réduisent cette dépendance à une page fraîchement téléchargée.",
        },
      ],
    },
    {
      title: "Sources primaires",
      paragraphs: [
        "Les informations d’architecture sur OneTimeSecret ont été vérifiées par rapport à sa documentation publique le 23 septembre 2026. Les implémentations produit et la documentation peuvent évoluer.",
      ],
      bullets: [
        "[OneTimeSecret documentation](https://docs.onetimesecret.com/)",
        "[OneTimeSecret on security and passphrases](https://onetimesecret.com/en/about)",
        "[OneTimeSecret source code](https://github.com/onetimesecret/onetimesecret)",
        "[Comment fonctionne le chiffrement de PrivateNote](app:how-it-works)",
        "[PrivateNote pour les développeurs](blog:privatenote-for-developers), y compris la CLI",
        "[RFC 3986, section 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), qui sépare le fragment de l’URI avant le déréférencement",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), sur la gestion côté client du fragment",
      ],
    },
  ],
  ctaTitle: "Chiffrer avant que le secret ne quitte l’appareil",
  ctaBody:
    "Rédigez la note dans le navigateur. Le client la chiffre en local, place la clé dans le lien, et peut protéger cette clé avec une phrase secrète que le serveur ne reçoit jamais.",
  ctaPrimary: "Créer une note privée",
  ctaSecondary: "Voir comment fonctionne le chiffrement",
};
