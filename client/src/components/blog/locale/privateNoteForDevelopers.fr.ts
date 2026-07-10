import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersFr: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Tu dois envoyer un mot de passe à un collègue. Peut-être la base de données de staging. Peut-être une clé Stripe sur le point d'aller en production. Peut-être des identifiants SSH pour un serveur auquel seuls toi et deux autres personnes devraient accéder.",
    "Tu ouvres Slack. Tu commences à taper. Et puis — une petite hésitation familière.",
    "Ce message va rester dans ton historique de chat. Il va se synchroniser sur trois appareils. Il pourrait finir dans une sauvegarde, un index de recherche, une archive de conformité. Longtemps après avoir fait tourner les identifiants et les avoir oubliés, ce message est toujours là.",
    "PrivateNote est un autre chemin. Le secret est chiffré sur ta machine avant de toucher un réseau. La clé de déchiffrement vit uniquement dans l'URL que tu partages — le serveur qui stocke la note ne la voit jamais. La note s'autodétruit après la première lecture. Rien ne persiste.",
    "Voici comment l'utiliser — en commençant par l'option la plus simple.",
  ],
  sections: [
    {
      title: "L'extension VS Code et Cursor",
      body: [
        "Si tu passes tes journées dans VS Code ou Cursor, c'est le chemin le moins frictif. Installe l'extension une fois et elle reste dans ta barre latérale, toujours à un clic.",
        "Ouvre le panneau Extensions (Cmd+Shift+X), cherche PrivateNote et clique sur Installer. Après un rechargement de la fenêtre, une petite icône d'enveloppe apparaît dans la barre d'activité à gauche.",
        "Clique dessus. Un panneau s'ouvre :",
      ],
      bullets: [
        "Tape ou colle le secret dans le champ contenu",
        "Définis une expiration — 15 minutes, 1 heure, 1 jour ou 7 jours",
        'Laisse « Brûler après lecture » coché (par défaut)',
        "Clique sur Share PrivateNote →",
      ],
    },
    {
      title: "Ce qui se passe quand tu cliques sur Partager",
      body: [
        "La cryptographie intégrée de ton navigateur génère une clé aléatoire de 256 bits. Cette clé ne quitte jamais ta machine.",
        "Le contenu est chiffré avec AES-256-GCM. Le résultat est un blob de texte chiffré sans contenu lisible.",
        "Seul ce texte chiffré est envoyé au serveur PrivateNote. La clé n'est pas incluse — ni dans le corps de la requête, ni dans un en-tête, nulle part.",
        "Le serveur stocke le blob chiffré et renvoie un ID de note. Ta machine construit une URL partageable : l'ID de la note dans le chemin, la clé de déchiffrement dans le fragment d'URL — la partie #que les navigateurs n'envoient jamais aux serveurs.",
        "Le lien est copié dans ton presse-papiers. Tu le colles là où tu collerais normalement le secret. La différence : le secret est maintenant le lien, pas le mot de passe lui-même.",
      ],
    },
    {
      title: "Deux autres façons d'utiliser l'extension",
      body: [
        "Tu n'as pas toujours besoin d'ouvrir le panneau. Deux raccourcis plus rapides existent :",
        "Sélectionne du texte dans ton éditeur et fais un clic droit — tu verras Share as PrivateNote dans le menu contextuel. Un quick-pick demande l'expiration et la préférence de destruction, puis le lien est copié dans ton presse-papiers.",
        "Quand du texte est sélectionné, une icône de cadenas apparaît aussi dans la barre de titre de l'éditeur en haut à droite. Un clic l'envoie.",
      ],
    },
    {
      title: "Si tu utilises un assistant IA : le serveur MCP",
      body: [
        "Si tu travailles dans Cursor avec Claude ou un autre modèle, tu peux laisser l'IA créer des PrivateNotes en ton nom. Le serveur MCP (Model Context Protocol) ajoute un outil create_private_note que l'agent peut appeler automatiquement.",
        "Ajoute ceci à ~/.cursor/mcp.json :",
      ],
      code: mcpConfig,
      bullets: [
        "Redémarre Cursor et vérifie Settings → MCP — tu devrais voir privatenote avec un point vert",
        'Dis ensuite à l\'agent : « Envoie cette clé API en sécurité, brûler après lecture »',
        "L'agent appelle l'outil, le chiffrement s'exécute localement et tu obtiens un lien",
      ],
    },
    {
      title: "Une chose à comprendre sur l'IA et les secrets",
      body: [
        "Quand tu inclus un secret dans un prompt IA, le modèle le lit avant que l'outil MCP ne le chiffre. Les serveurs du fournisseur IA voient brièvement le contenu.",
        "C'est quand même une amélioration significative par rapport à Slack — le secret ne finit pas dans l'historique persistant du chat, l'e-mail ou les journaux serveur. Mais ce n'est pas la même chose que si l'IA ne l'avait jamais vu.",
        "Pour une confidentialité de bout en bout complète avec un agent IA, utilise un modèle local sur ta machine (comme Ollama). Alors rien ne quitte ton ordinateur avant d'être déjà chiffré.",
      ],
    },
    {
      title: "Sans installation : l'application web",
      body: [
        "Si tu n'es pas dans VS Code, ou sur une machine sans ta configuration habituelle, l'application web sur privatenote.ai fait la même chose dans n'importe quel navigateur.",
        "Colle ton secret, choisis une expiration, clique sur Create. Partage le lien. La logique de chiffrement s'exécute dans ton navigateur — le même AES-256-GCM, la même architecture clé-dans-le-fragment.",
      ],
    },
    {
      title: "Ce qu'il faut retenir",
      body: [
        "Le lien contient la clé de déchiffrement. Traite l'URL avec le même soin que le secret lui-même — ne la publie pas dans un canal public.",
        "Une fois qu'une note à brûler après lecture est ouverte, le lien est mort. Ni toi ni le destinataire ne pouvez le rouvrir.",
        "Si tu as saisi un secret dans un prompt IA, envisage de le faire tourner après le partage. Le prompt a été vu. Le lien PrivateNote non — mais les identifiants sous-jacents, oui.",
        "Pour les secrets qui doivent persister, utilise un vrai gestionnaire de secrets. PrivateNote sert à la livraison, pas au stockage.",
      ],
    },
  ],
  ctaTitle: "Partage ta première note privée",
  ctaBody: "Installe l'extension VS Code ou essaie l'application web — aucun compte requis pour les notes à lecture unique.",
  ctaButton: "Essayer PrivateNote →",
};
