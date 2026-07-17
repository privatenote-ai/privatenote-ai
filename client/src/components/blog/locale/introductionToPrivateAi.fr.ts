import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiFr: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Personne travaillant à un bureau à domicile avec un ordinateur portable affichant une visualisation de réseau neuronal et un petit serveur d'IA local à côté",
  intro: [
    "**Private AI** signifie exécuter un grand modèle de langage sur du matériel que vous contrôlez directement—votre ordinateur portable, votre navigateur ou un serveur dans votre bureau—de sorte que votre texte saisi n'est jamais envoyé à un cloud tiers pour l'inférence. C'est la réponse pratique à une question simple : *puis-je obtenir une aide de haute qualité de l'IA sans confier mes mots à l'ordinateur de quelqu'un d'autre ?*",
    "Cette question compte davantage chaque année. Les assistants cloud sont remarquablement puissants, mais ils traitent vos invites sur une infrastructure distante. Pour les notes, identifiants, brouillons juridiques, informations de santé ou tout ce que vous ne colleriez pas dans un chatbot public, l'IA locale et côté navigateur n'est plus une curiosité d'amateur. C'est une exigence de sécurité vitale.",
    "Ce guide parcourt l'évolution de l'IA privée, pourquoi les grands laboratoires publient les poids des modèles, les principales façons d'exécuter des modèles localement, les projets open source et familles de modèles qui comptent le plus, où en est l'état de l'art en 2026—et comment [PrivateNote](app:home) s'intègre avec **Write with Private AI**, qui s'exécute entièrement dans l'onglet de votre navigateur.",
  ],
  sections: [
    {
      title: "Une courte évolution : des laboratoires à votre ordinateur portable",
      paragraphs: [
        "Pendant des années, les modèles de langage utiles vivaient presque exclusivement au sein de géants technologiques disposant de clusters GPU massifs. L'entraînement exigeait des millions de dollars en calcul, des équipes spécialisées et des jeux de données propriétaires. Si vous vouliez une assistance IA, vous utilisiez une API ou une application web cloud—et votre texte quittait votre machine.",
        "Trois changements dans l'industrie ont complètement transformé ce tableau :",
      ],
      bullets: [
        "**Lois d'échelle des transformeurs** — La recherche a montré que des modèles bien entraînés sur de grands jeux de données de haute qualité pouvaient offrir des capacités étonnamment générales—pas seulement à l'échelle de la frontière.",
        "**Publications de poids ouverts** — À partir de la famille Llama de Meta, suivie par Mistral, Google Gemma, Alibaba Qwen et d'autres, des paramètres téléchargeables ont atteint les développeurs du monde entier.",
        "**Maturation des outils d'inférence** — Des projets comme llama.cpp, Ollama, vLLM, WebLLM et Transformers.js ont rendu pratique l'exécution de ces poids sur du matériel grand public.",
      ],
      callout:
        "En 2026, l'écart entre « cloud uniquement » et « tourne sur mon appareil » s'est considérablement réduit. Les modèles cloud de pointe restent plus grands et plus rapides, mais les petits et moyens modèles ouverts sont très capables pour la rédaction, la synthèse, la réécriture et les questions quotidiennes—surtout pour l'écriture courte comme les notes.",
    },
    {
      title: "Pourquoi les entreprises publient les poids des modèles",
      paragraphs: [
        "Publier des poids n'est pas de la charité. Les laboratoires diffusent des paramètres pour des raisons stratégiques qui façonnent tout l'écosystème.",
      ],
      bullets: [
        "**Effet de levier de l'écosystème** — Quand les développeurs construisent sur votre modèle, votre architecture devient une référence. Les fine-tunes, outils et intégrations suivent les poids.",
        "**Crédibilité de recherche** — Les poids ouverts invitent à l'examen, à la reproductibilité et à l'adoption académique. Cette visibilité renforce le leadership technique.",
        "**Positionnement réglementaire et confiance** — Des acteurs européens comme Mistral et des marques mondiales comme Meta et Google utilisent les publications ouvertes pour signaler la transparence et se différencier des API entièrement fermées.",
        "**Distillation et spécialisation** — Des modèles plus petits entraînés à partir de plus grands diffusent les capacités vers le bas. Publier les poids parents accélère ce pipeline dans toute la communauté.",
        "**Pression concurrentielle** — Une fois qu'un grand laboratoire publie en open source un modèle solide, les autres subissent la pression de s'aligner ou de risquer de perdre l'attention des développeurs.",
      ],
      callout:
        "Les poids ouverts ne sont pas toujours « open source » au sens strict. Les licences peuvent restreindre l'usage commercial, exiger une attribution ou exclure certains domaines. Lisez toujours la fiche du modèle avant un déploiement en production.",
    },
    {
      title: "Trois façons de déployer l'IA privée",
      paragraphs: [
        "Il n'existe pas d'architecture unique idéale. Le bon choix dépend de votre matériel, de vos exigences de confidentialité et de votre besoin d'un généraliste de 70 milliards de paramètres ou d'un assistant rapide pour de courtes notes.",
      ],
      beforeFlowSteps: "La plupart des déploiements d'IA privée se classent dans l'un de ces schémas :",
      flowDiagramCaption: "Trois schémas de déploiement en un coup d'œil",
      flowSteps: [
        {
          step: "Option 1",
          title: "Environnements d'applications locaux (Ollama et applications de bureau)",
          body: "Des outils comme [Ollama](https://ollama.com), LM Studio et GPT4All téléchargent les poids des modèles et les exécutent nativement sur votre Mac, Windows ou Linux. Vous obtenez une inférence hors ligne, une accélération GPU native et l'accès à des modèles plus grands qu'un navigateur ne peut confortablement charger. Compromis : espace disque important (souvent des dizaines de gigaoctets par modèle), RAM ou VRAM dédiée et mises à jour manuelles.",
        },
        {
          step: "Option 2",
          title: "Environnements sandbox (WebGPU dans le navigateur)",
          body: "Les navigateurs modernes exposent **WebGPU**, qui permet à JavaScript d'exécuter des réseaux neuronaux sur votre GPU sans rien installer. Des projets comme WebLLM, MLC LLM et Transformers.js compilent des modèles pour le web. Vous sacrifiez la taille du modèle et la vitesse brute, mais vous gagnez une propriété remarquable : **votre invite ne quitte jamais l'onglet du navigateur pour l'inférence**. Pas de compte, pas d'aller-retour serveur, pas de journalisation de votre brouillon par un fournisseur.",
        },
        {
          step: "Option 3",
          title: "Calcul dédié (serveurs domestiques ou de bureau)",
          body: "Les équipes disposant de GPU NVIDIA dédiés, d'un Mac Studio ou d'un petit serveur en rack exécutent souvent **vLLM**, **llama.cpp** ou Ollama comme point de terminaison interne partagé. C'est le schéma pour une IA privée de qualité maximale : grandes fenêtres de contexte, modèles plus imposants et plusieurs utilisateurs sur un LAN. Compromis : coût du matériel, alimentation, refroidissement et maintenance opérationnelle continue.",
        },
      ],
      afterFlowSteps: [
        "Le fil conducteur est le même dans les trois cas : **l'inférence se produit sur une infrastructure que vous contrôlez**, pas sur un cloud multi-locataire où votre texte devient la charge de traitement de quelqu'un d'autre.",
      ],
    },
    {
      title: "Les projets open source qui comptent le plus",
      paragraphs: [
        "Les modèles ne sont que la moitié de l'histoire. Ces projets fondateurs ont transformé des poids bruts en logiciels que des millions de personnes peuvent réellement exécuter.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Inférence C/C++ à haute efficacité ; la base d'innombrables déploiements locaux CPU et GPU.",
        "**[Ollama](https://ollama.com)** — Une expérience CLI et de bureau conviviale pour récupérer, mettre à jour et discuter avec des modèles localement.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Service à haut débit par lots pour serveurs GPU d'équipe partagés et charges de travail à l'échelle API.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — La bibliothèque et le hub de référence pour découvrir, télécharger, fine-tuner et partager des modèles.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Compile des modèles pour une exécution native dans le navigateur, sans installation, via WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Exécute des modèles exportés en ONNX directement en JavaScript—une autre voie vers l'inférence côté navigateur.",
      ],
    },
    {
      title: "Les familles de modèles à connaître",
      paragraphs: [
        "Des dizaines de checkpoints apparaissent chaque mois. Quatre familles dominent les conversations sur l'IA privée en 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 et les lignes Llama 4 plus récentes fixent la référence pour les généralistes à poids ouverts : raisonnement solide, large support d'outils et un immense écosystème de fine-tunes.",
        "**Google Gemma** — Les familles Gemma 2, Gemma 3 et **Gemma 4** se concentrent sur l'efficacité—forte performance par paramètre, excellents petits modèles et variantes optimisées pour l'inférence sur appareil et hébergée.",
        "**Mistral AI (Europe)** — Mistral, basé à Paris, propose des modèles compacts et capables (Mistral, Mixtral, Codestral) avec des licences conviviales pour les développeurs et un récit distinct de souveraineté des données européen.",
        "**Alibaba Qwen** — Les séries Qwen 2.5 et **Qwen 3** excellent dans les tâches multilingues et proposent de minuscules variantes (moins de 1 milliard de paramètres) qui fonctionnent exceptionnellement bien sur du matériel modeste d'ordinateur portable et de navigateur.",
      ],
      callout:
        "L'IA navigateur de PrivateNote utilise **Gemma 2 2B** et **Qwen3 0.6B** via WebLLM—des modèles à poids ouverts compilés pour WebGPU, pas un checkpoint propriétaire fermé. Des variantes **Gemma 4** plus grandes apparaissent dans le chemin Cloud Assist optionnel, pas dans Write with Private AI aujourd'hui.",
    },
    {
      title: "État de l'art en 2026",
      paragraphs: [
        "La frontière est divisée. Les API fermées d'OpenAI, Anthropic et Google mènent encore sur la capacité brute, l'utilisation d'outils à grande échelle et les plus grandes fenêtres de contexte. Mais les poids ouverts sont assez proches pour de nombreux flux de travail réels—et en avance sur la **confidentialité, le contrôle des coûts et la personnalisation**.",
        "Parmi les modèles ouverts, **Gemma 4**, **Llama 4**, **Qwen 3** et les grands checkpoints **Mistral** représentent la génération actuelle : meilleur suivi des instructions, codage et mathématiques améliorés, et refus plus fiables sur les invites sensibles. Des variantes distillées plus petites apportent une part significative de cette qualité aux ordinateurs portables et navigateurs.",
        "Les modèles multimodaux (texte + image) se développent dans les publications cloud et ouvertes, mais pour la prise de notes et les transmissions de secrets, les petits modèles texte uniquement restent le point idéal : assez rapides pour être interactifs, assez petits pour rester locaux.",
      ],
    },
    {
      title: "L'IA privée dans PrivateNote : Write with Private AI",
      paragraphs: [
        "PrivateNote est conçu pour des notes chiffrées et éphémères—pas pour remplacer toute votre pile IA. Pourtant, rédiger un message sensible est exactement là où l'IA côté navigateur excelle : vous obtenez de l'aide à l'écriture **avant** le chiffrement, sans envoyer votre texte à nos serveurs pour l'inférence.",
        "Ouvrez [PrivateNote](app:home) et choisissez **Write with Private AI**. Il n'y a pas de sélecteur de modèle manuel—sur les ordinateurs de bureau compatibles avec WebGPU, le niveau de votre appareil détermine quel checkpoint s'exécute :",
        "Soyez honnête sur les compromis. Les poids se téléchargent dans le stockage du navigateur et l'inférence s'exécute localement—mais l'IA navigateur est **plus lente** qu'un datacenter cloud et ne peut pas égaler les **grandes fenêtres de contexte** des modèles de classe serveur. Elle dépend aussi du matériel : de nombreux téléphones et ordinateurs portables plus anciens reviennent à la saisie sans IA ou à Cloud Assist optionnel. Mais pour rédiger une courte note privée, un message de transmission de mot de passe ou une réponse confidentielle, c'est **tout à fait capable**—et les propriétés de confidentialité sont fondamentalement différentes des flux coller-dans-ChatGPT.",
      ],
      bullets: [
        "**Matériel modeste** — Charge **Qwen3 0.6B** et exécute l'inférence localement via WebGPU.",
        "**Ordinateurs de bureau capables** — Charge **Gemma 2 2B** et exécute l'inférence localement via WebGPU.",
        "**Privé par architecture** — Avec Write with Private AI, votre brouillon est traité dans le navigateur. Il n'est pas envoyé aux serveurs PrivateNote pour l'inférence du modèle.",
        "**Chiffrer après la rédaction** — Une fois satisfait du texte, la note est chiffrée localement avant l'envoi—le même modèle que pour toute autre note PrivateNote.",
        "**Cloud Assist optionnel** — Si votre appareil ne peut pas exécuter de modèles locaux, vous pouvez opter pour Cloud Assist (Google **Gemma 4 26B** via Cloudflare Workers AI). Ce chemin est plus rapide et plus capable, mais **pas entièrement privé**—votre invite quitte l'appareil en clair et vous devez l'activer explicitement. Consultez [comment fonctionne PrivateNote](app:how-it-works) pour la comparaison complète.",
        "**Le bon outil pour la tâche** — Utilisez l'IA privée navigateur pour les brouillons sensibles. Utilisez Ollama ou un serveur GPU domestique quand vous avez besoin de longs documents, d'un contexte immense ou des plus grands modèles ouverts.",
      ],
      callout:
        "L'IA privée dans le navigateur ne cherche pas à battre les modèles cloud de pointe sur les benchmarks. Elle cherche à rendre **la rédaction privée pratique** pour les notes que les gens créent déjà dans PrivateNote.",
    },
    {
      title: "Choisir votre configuration d'IA privée",
      paragraphs: [
        "Si vous débutez avec l'IA privée, commencez simplement : installez Ollama et essayez un checkpoint Llama ou Gemma de taille moyenne pour l'écriture quotidienne sur votre ordinateur portable.",
        "Si votre modèle de menace exige que les brouillons ne quittent jamais l'appareil—même avant le chiffrement—utilisez des outils côté navigateur, y compris Write with Private AI dans PrivateNote. La souveraineté des données et l'automatisation intelligente ne se contredisent plus ; vous adaptez simplement la sensibilité du texte à l'architecture qui l'exécute.",
        "Si vous sécurisez une équipe, évaluez un serveur GPU partagé avec vLLM et des contrôles d'accès—et lisez [sécuriser les agents IA comme des employés](blog:securing-ai-agents-like-employees) pour comprendre comment les systèmes agentiques modifient la frontière de confiance. Pour les développeurs intégrant des agents dans des flux de travail, consultez [PrivateNote pour les développeurs](blog:privatenote-for-developers) et l'[intégration Codex MCP](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Essayez la rédaction privée dans votre navigateur",
  closingBody: [
    "Ouvrez PrivateNote, sélectionnez Write with Private AI et rédigez votre prochaine note sensible sans l'envoyer à un modèle cloud externe. Chiffrez-la quand vous êtes prêt—puis partagez un lien sécurisé à usage unique.",
  ],
  fileSharingNote:
    "Vous partagez aussi des fichiers ? [Transfert de fichiers sécurisé](app:secure-file-transfer) utilise le même chiffrement côté navigateur. L'envoi nécessite un compte gratuit ; les destinataires ouvrent les liens sans s'inscrire.",
  tagline: "Rédigez localement. Chiffrez d'abord. Partagez un lien.",
  relatedReading: "Lectures connexes",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb:
        "À mesure que les agents IA acquièrent des outils et de la mémoire, la sécurité doit gouverner l'ensemble du système—pas seulement le modèle.",
    },
    {
      slug: "privatenote-for-developers",
      blurb:
        "Partagez des secrets depuis VS Code, Cursor ou un agent IA sans les coller dans l'historique de chat.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb:
        "Chiffrez avant l'envoi, partagez un lien et laissez la note expirer—étape par étape.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Qui détient les clés, et pourquoi le chiffrement navigateur diffère du seul HTTPS.",
    },
    {
      slug: "privacy-tools",
      blurb:
        "Assembler une stack de confidentialité pratique pour 2026 par tâche—pas par hype.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb:
        "Pourquoi les notes éphémères battent les journaux de chat permanents pour les messages professionnels sensibles.",
    },
  ],
};
