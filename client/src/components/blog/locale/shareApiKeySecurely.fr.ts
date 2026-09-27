import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyFr: ShareApiKeyArticleCopy = {
  heroAlt: "Deux ordinateurs portables échangeant une clé API via un lien chiffré à usage unique PrivateNote",
  heroCaption: "Illustration générée pour PrivateNote.ai.",
  takeawaysHeading: "À retenir",
  takeaways: [
    "Ne collez jamais de clés API dans un e-mail, chat, ticket, document ou Git.",
    "Clé la plus étroite possible : moindre privilège, courte durée, puis rotation.",
    "Envoyez les secrets via un lien à usage unique chiffré dans le navigateur.",
    "Pour les clés à haut risque, chiffrez d’abord en local ; ne partagez que le ciphertext.",
    "Surveillez les usages inhabituels—PrivateNote est une passation, pas un coffre.",
  ],
  intro:
    "Tout développeur finit un jour par devoir envoyer une clé API à quelqu'un d'autre — pour un accès staging, un sous-traitant, une intégration webhook ou une passation client. Le chemin le plus rapide est généralement aussi celui qui laisse la trace la plus longue.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord ou autre historique de chat",
    "E-mail, SMS ou fils de discussion transférés",
    "Jira, Trello, Notion, Confluence ou tickets GitHub",
    "Documents texte brut, feuilles de calcul et dossiers cloud partagés",
    "Commits Git, pull requests et commentaires de code",
  ],
  leakSources: [
    {
      title: "E-mail",
      body: "L'e-mail crée des copies de longue durée. Une clé peut survivre dans les boîtes de réception, archives, sauvegardes, synchronisation mobile, fils transférés et index de recherche longtemps après la fin de la tâche.",
    },
    {
      title: "Chat d'équipe",
      body: "Slack et Teams préservent le contexte — ce qui les rend risqués pour les secrets. Une clé collée peut devenir consultable par de futurs membres de l'espace de travail ou fuiter via un appareil compromis.",
    },
    {
      title: "Outils de projet",
      body: "Jira, Notion, Confluence, Trello et GitHub Issues ne sont pas des coffres-forts d'identifiants. Les tickets supprimés peuvent encore exister dans les exports, sauvegardes, pistes d'audit et recherche assistée par IA.",
    },
    {
      title: "Dépôts Git",
      body: "L'historique Git est collant. Supprimer une clé dans un commit ultérieur n'efface pas les commits antérieurs. Les dépôts publics sont analysés en continu, et des identifiants cloud exposés peuvent être exploités en quelques minutes.",
    },
  ],
  prepSteps: [
    {
      title: "Utilisez le périmètre le plus restreint possible",
      body: "Évitez les clés de production principales. Préférez les clés staging, les permissions en lecture seule, les restrictions IP, les jetons à courte durée de vie et les identifiants spécifiques à l'intégration.",
    },
    {
      title: "Prévoyez la rotation ou la révocation",
      body: "Traitez les clés API partagées comme temporaires. Révoquez-les lorsque l'intégration, les tests, l'engagement d'un sous-traitant ou la passation client est terminé.",
    },
    {
      title: "Surveillez les modèles d'utilisation",
      body: "Des emplacements inattendus, des pics soudains de requêtes, de nouveaux points de terminaison ou une activité de facturation inhabituelle sont souvent les premiers signes qu'une clé s'est échappée.",
    },
    {
      title: "Livrez via un lien chiffré à usage unique",
      body: "Chiffrez la clé localement avant qu'elle n'entre dans un canal de communication. Envoyez un lien à courte durée de vie au lieu de laisser le secret brut dans l'historique permanent de chat ou d'e-mail.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Limiter la clé", detail: "Permissions minimales uniquement" },
    { key: "encrypt", label: "Chiffrer localement", detail: "La clé ne quitte jamais votre navigateur" },
    { key: "send", label: "Envoyer le lien", detail: "Pas le secret brut" },
    { key: "revoke", label: "Révoquer une fois terminé", detail: "Faire pivoter après passation" },
  ],
  faqs: [
    {
      question: "Pourquoi ne pas simplement utiliser une variable d'environnement ?",
      answer:
        "Les variables d'environnement conviennent pour exécuter un logiciel localement. Elles ne résolvent pas le problème de transport lorsque vous devez transmettre cette valeur à un collègue, un sous-traitant, un client ou un partenaire d'intégration.",
    },
    {
      question: "Les clés API doivent-elles toujours expirer ?",
      answer:
        "Lorsque le fournisseur le prend en charge, oui. Les identifiants à courte durée de vie réduisent la fenêtre d'abus après une divulgation accidentelle et font de la rotation une partie du flux de travail normal.",
    },
    {
      question: "Quel est le flux de travail le plus sûr ?",
      answer:
        "Créez une clé étroitement limitée, envoyez-la via un lien à usage unique chiffré dans le navigateur, partagez tout mot de passe optionnel par un canal séparé, puis faites pivoter ou révoquez la clé une fois la tâche terminée. Pour les clés à haut risque ou de longue durée, chiffrez d'abord localement avec age ou OpenSSL et envoyez uniquement le texte chiffré.",
    },
    {
      question: "PrivateNote est-il un gestionnaire de secrets ?",
      answer:
        "Non. PrivateNote résout la livraison sécurisée de personne à personne. Pour le stockage de secrets machine à machine, utilisez HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager ou Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Traitez les clés API comme des mots de passe de production",
      paragraphs: [
        "Une clé API est effectivement un mot de passe pour un logiciel. Selon ses permissions, une clé divulguée peut exposer des données clients, consommer des ressources payantes, déployer une infrastructure cloud, envoyer des e-mails via votre domaine vérifié ou faire grimper une facture IA.",
        "Contrairement aux mots de passe humains, les clés API restent souvent valides pendant des mois, se trouvent dans des fichiers de configuration et contournent entièrement l'authentification multifacteur. Si une clé fuit, un attaquant peut agir comme votre application — et le trafic malveillant peut se fondre dans l'utilisation ordinaire de production jusqu'à ce que les coûts explosent ou que les données soient déjà exposées.",
      ],
    },
    neverPaste: {
      title: "Ne collez jamais de clés API dans des systèmes permanents",
      intro:
        "Ces canaux sont pratiques car ils préservent l'historique. C'est précisément pourquoi ils sont le mauvais endroit pour les secrets.",
      avoidHeading: "Évitez ces canaux",
    },
    whereLeak: {
      title: "Où les clés API fuient réellement",
      intro:
        "La plupart des fuites ne sont pas des cassages cryptographiques sophistiqués. Elles se produisent lorsque quelqu'un copie un secret dans un système conçu pour conserver des enregistrements.",
    },
    beforeShare: {
      title: "Avant de partager",
      intro:
        "Réduisez d'abord le rayon d'explosion. La façon dont vous livrez la clé compte — mais une clé étroitement limitée limite les dégâts si quelque chose tourne mal.",
      newKeyTitle: "Création d'une nouvelle clé ?",
      newKeyBefore: "Générez des identifiants à haute entropie localement dans votre navigateur — le",
      newKeyLink: "générateur de clés API",
      newKeyAfter: "sur passwords.lu s'exécute côté client ; rien n'est envoyé.",
    },
    highRisk: {
      title: "Clés à haut risque : chiffrez localement d'abord",
      p1: "La plupart des clés API sont remplaçables : jetons staging, secrets d'intégration à courte durée de vie et identifiants étroitement limités que vous prévoyez de faire pivoter. Pour ceux-là, la livraison à usage unique chiffrée dans le navigateur suffit généralement.",
      p2: "Certaines clés ont plus de poids — accès administrateur production, clés de signature, identifiants cloud racine ou tout secret de longue durée dont la révocation propre serait douloureuse ou impossible. Traitez-les comme des secrets maîtres : **chiffrez localement avant tout envoi web**, puis envoyez le texte chiffré via PrivateNote.",
      calloutHeading: "Chiffrement local d'abord",
      ageBullet:
        "**age** — paramètres par défaut les plus simples pour le chiffrement de fichiers (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — CLI fiable si vous connaissez déjà les options",
      separateChannelBullet:
        "Envoyez le fichier chiffré avec PrivateNote ; envoyez la phrase secrète de déchiffrement sur un **canal séparé** (Signal, téléphone, en personne)",
      outro:
        "Le même flux de travail s'applique aux phrases de récupération de cryptomonnaie et autres secrets maîtres irremplaçables. Consultez [phrases de récupération crypto et liens à usage unique](blog:crypto-seed-phrase-one-time-link) pour le guide complet age/OpenSSL, les conseils sur les phrases secrètes et quand les liens à usage unique sont — et ne sont pas — le bon outil.",
    },
    handoff: {
      title: "Un flux de passation plus sûr",
      intro: "Lorsqu'un humain a besoin de la clé — pas lorsqu'une application la récupère à l'exécution — suivez cette séquence.",
      diagramCaption: "Passation plus sûre en un coup d'œil",
      diagramFootnote: "Partagez tout mot de passe de note par un canal séparé — jamais dans le même message que le lien.",
    },
    privateNote: {
      title: "Comment PrivateNote s'inscrit dans la passation",
      p1: "PrivateNote est conçu pour le moment personne à personne : clés API, clés SSH privées, identifiants de base de données, codes de récupération, secrets de signature webhook et mots de passe temporaires qui doivent atteindre une personne sans devenir un enregistrement permanent.",
      relatedSsh:
        "Si le secret est une clé SSH plutôt qu’une clé API, voir [comment partager des clés SSH en toute sécurité](blog:how-to-share-ssh-keys-securely) pour clés publiques vs privées, deploy keys et extensions d’éditeur.",
      p2: "Le secret est chiffré dans votre navigateur avant l'envoi. PrivateNote stocke du texte chiffré, pas du texte en clair. La clé de déchiffrement se trouve dans le fragment d'URL — la partie après le `#` — que les navigateurs n'envoient pas au serveur lors du chargement de la page. C’est le modèle du [lien à usage unique](blog:one-time-secret-links) appliqué aux identifiants API.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "Le serveur reçoit l'ID de la note et la charge utile chiffrée.",
      bullet2: "Le serveur ne reçoit pas la clé de déchiffrement.",
      bullet3: "La destruction après lecture et l'expiration limitent la durée d'existence de la note chiffrée.",
      p3: "PrivateNote complète les coffres-forts de secrets dédiés — il comble l'écart lorsque vous devez envoyer une clé Stripe à un partenaire d'intégration, partager une clé OpenAI temporaire avec un sous-traitant ou donner à un collègue un accès staging à usage unique.",
    },
    faq: { title: "Questions fréquentes" },
    bottomLine: {
      title: "L'essentiel",
      body: "La plupart des fuites de clés API ne se produisent pas parce que la cryptographie a échoué. Elles se produisent parce que quelqu'un a copié un secret dans un système permanent et consultable par commodité. Limitez les clés, partagez-les uniquement lorsque nécessaire et évitez de laisser une trace en texte clair dans le chat, les tickets, l'e-mail ou Git.",
    },
  },
  ctaTitle: "Partagez une clé API sans la laisser dans le chat",
  ctaBody: "Créez un lien PrivateNote chiffré dans le navigateur avec destruction après lecture. Aucun compte requis pour les notes à usage unique.",
  ctaButton: "Créer une PrivateNote ->",
};
