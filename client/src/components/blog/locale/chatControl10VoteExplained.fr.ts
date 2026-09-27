import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedFr: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Vote au Parlement européen sur Chat Control avec une bulle de discussion verrouillée au-dessus d'une carte de l'Europe",
  heroCaption: "Illustration générée pour PrivateNote.ai.",
  intro:
    "Le 9 juillet 2026, un événement inhabituel s'est produit au Parlement européen. Le vote final sur la prolongation du règlement temporaire Chat Control 1.0 s'est terminé avec plus de députés européens votant contre que pour — et pourtant la mesure a été adoptée.",
  voteEyebrow: "Vote final, 9 juillet 2026",
  voteHeadline: "Plus de votes « Non » que « Oui » — et cela a quand même été adopté",
  voteLabels: { against: "Contre", for: "Pour", abstentions: "Abstentions" },
  voteSummary:
    "À première vue, la plupart des observateurs concluraient que la proposition avait été rejetée. La réponse ne se trouve pas dans le chiffrement ou la cybersécurité — mais dans la procédure parlementaire.",
  nonE2eChannels: [
    "services de messagerie traditionnels",
    "stockage cloud",
    "certains services de messagerie directe",
    "autres communications où les fournisseurs peuvent accéder au contenu des messages",
  ],
  privacyConcerns: [
    {
      title: "Faux positifs",
      body: "La détection de contenus illégaux déjà connus à l'aide d'empreintes cryptographiques est généralement fiable, mais pas parfaite. Des chercheurs ont démontré des collisions et des erreurs d'implémentation pouvant générer de faux signalements. Si les fournisseurs commencent à utiliser l'IA pour identifier du contenu nouveau et encore inconnu, le taux de faux positifs devient nettement plus difficile à maîtriser. Chaque faux positif peut impliquer qu'une communication privée innocente soit signalée pour examen ultérieur.",
    },
    {
      title: "Extension de l'infrastructure de surveillance",
      body: "De nombreux experts estiment qu'une fois que les plateformes construisent des systèmes d'analyse à grande échelle, étendre leur usage à d'autres finalités devient techniquement simple. L'histoire montre que les technologies introduites pour des objectifs étroits évoluent souvent vers des capacités de surveillance plus larges au fil du temps.",
    },
    {
      title: "Effets dissuasifs",
      body: "La communication privée ne fonctionne que lorsque les utilisateurs ont confiance que leurs conversations restent privées. S'ils croient que chaque message peut être analysé automatiquement, beaucoup éviteront de discuter de sujets sensibles — même parfaitement légaux. Ce phénomène est bien documenté dans la recherche sur la vie privée.",
    },
    {
      title: "Efficacité limitée",
      body: "Plus de 800 chercheurs en cybersécurité et en protection de la vie privée ont affirmé qu'une analyse généralisée des messages est peu susceptible de réduire significativement les abus sur enfants tout en imposant des coûts substantiels en matière de vie privée à des centaines de millions d'utilisateurs. Les critiques estiment que les ressources des forces de l'ordre sont mieux investies dans des enquêtes ciblées plutôt que dans une analyse indiscriminée.",
    },
  ],
  e2eeCalloutTitle: "Le chiffrement de bout en bout change le modèle de confiance",
  e2eeCalloutBody:
    "Le chiffrement de bout en bout garantit que seuls l'expéditeur et le destinataire prévu possèdent les clés cryptographiques nécessaires pour lire un message. Même le fournisseur de service ne peut pas déchiffrer le contenu. Toute obligation d'inspecter les messages chiffrés avant ou après le chiffrement modifie fondamentalement ce modèle de sécurité — et est devenue l'un des sujets les plus controversés de la politique moderne en matière de cybersécurité.",
  sections: {
    whyPassed: {
      title: "Pourquoi cela a-t-il été adopté ?",
      paragraphs: [
        "Il ne s'agissait pas d'un vote législatif classique exigeant une simple majorité des votes exprimés. En raison de l'étape procédurale spécifique de cette législation, **rejeter la proposition exigeait une majorité absolue de tous les membres du Parlement européen — actuellement 361 voix**.",
        "Bien que 314 députés aient voté contre la proposition, ce nombre n'a pas atteint le seuil requis. En conséquence, la proposition a été considérée comme adoptée.",
      ],
      callout:
        "Ce résultat procédural a surpris de nombreux observateurs, y compris des journalistes, des juristes et des chercheurs en cybersécurité, car l'intuition veut que davantage de votes « Non » que « Oui » fasse échouer une proposition.",
    },
    whatItDoes: {
      title: "Que fait réellement Chat Control 1.0 ?",
      paragraphs: [
        "La mesure adoptée **n'introduit pas** l'analyse obligatoire de tous les messages privés. Elle prolonge plutôt le cadre juridique temporaire existant qui permet aux fournisseurs de services en ligne de détecter et signaler **volontairement** du matériel pédopornographique (CSAM) dans certains types de communications jusqu'au 3 avril 2028.",
        "Cela s'applique principalement aux communications qui ne sont pas protégées par le [chiffrement de bout en bout](blog:what-is-end-to-end-encryption), telles que :",
        "Il est important de noter que le Parlement a maintenu une formulation excluant les communications chiffrées de bout en bout de ce cadre d'analyse volontaire. Pour une définition précise de ce que cela signifie en pratique — et en quoi cela diffère du chiffrement de transport ordinaire — consultez notre guide sur [ce qu'est réellement le chiffrement de bout en bout](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Pourquoi les experts en vie privée s'inquiètent-ils ?",
      intro:
        "De nombreux chercheurs et organisations de défense des libertés civiles se sont opposés à la prolongation — non parce qu'ils rejettent la protection des enfants, mais parce qu'ils doutent que cette approche atteigne cet objectif sans créer de risques significatifs. Notre article précédent sur [pourquoi les cryptographes européens continuent d'alerter sur Chat Control](blog:chat-control-europe-cryptographers) explique en profondeur les objections techniques plus larges.",
    },
    chatControl20: {
      title: "La grande histoire, c'est Chat Control 2.0",
      paragraphs: [
        "Bien que le vote de cette semaine ait attiré une attention considérable, de nombreux experts estiment que le débat le plus important est encore à venir. La proposition communément appelée Chat Control 2.0 vise à établir un cadre juridique permanent pour la détection du CSAM en ligne.",
        "Contrairement à la prolongation temporaire adoptée cette semaine, les discussions autour de Chat Control 2.0 ont à plusieurs reprises inclus des propositions susceptibles d'affecter les communications chiffrées de bout en bout. C'est là que le débat devient considérablement plus important — et que les avertissements de notre [briefing des cryptographes sur Chat Control](blog:chat-control-europe-cryptographers) comptent le plus.",
      ],
    },
    privateNote: {
      title: "Pourquoi cela compte pour PrivateNote",
      paragraphs: [
        "La communication privée repose sur un principe simple : si un service ne peut pas lire votre message, il ne peut pas l'analyser, le vendre ou l'exposer accidentellement. PrivateNote a été conçu autour de cette idée.",
        "Lorsque vous créez une note, le chiffrement s'effectue directement dans votre navigateur. La clé de chiffrement n'atteint jamais nos serveurs. Nous ne stockons que du texte chiffré. Sans la clé — qui reste entièrement sous votre contrôle — le contenu de votre note nous est mathématiquement illisible.",
        "Cette conception ne vise pas à éviter la responsabilité. Elle vise à garantir que votre communication privée reste exactement cela : privée. Que vous partagiez des mots de passe, des documents juridiques, des informations financières, des secrets d'entreprise ou des conversations personnelles, la confidentialité ne devrait pas dépendre uniquement de la confiance envers le fournisseur de service. Elle devrait être imposée par la cryptographie.",
        "Pour une vue étape par étape du fonctionnement du chiffrement côté navigateur en pratique, consultez [comment fonctionne PrivateNote](app:how-it-works). Pour partager des secrets éphémères sans les laisser dans un fil de discussion permanent, les [liens secrets à usage unique](blog:one-time-secret-links) conviennent souvent mieux que les applications de messagerie — même chiffrées.",
      ],
    },
    debateContinues: {
      title: "Le débat est loin d'être terminé",
      paragraphs: [
        "Des personnes raisonnables peuvent diverger sur la manière dont la société devrait combattre les abus sur enfants en ligne. Protéger les enfants est sans conteste l'un des intérêts publics les plus importants. La question difficile est de savoir comment atteindre cet objectif sans compromettre l'infrastructure de sécurité et de confidentialité dont dépendent chaque jour les journalistes, les entreprises, les avocats, les professionnels de santé, les militants et les citoyens ordinaires.",
        "Alors que les discussions se poursuivent autour de Chat Control 2.0, cet équilibre entre la sécurité publique et les droits fondamentaux à la vie privée restera l'un des débats déterminants de la politique technologique en Europe. Quelle que soit votre position, une chose est certaine : l'avenir de la communication chiffrée sera de plus en plus décidé non seulement par les cryptographes et les ingénieurs logiciels — mais aussi par les législateurs.",
      ],
    },
  },
  ctaTitle: "Envoyez des notes privées sans donner la clé au serveur",
  ctaBody:
    "PrivateNote chiffre les notes dans votre navigateur et conserve la clé de déchiffrement dans le fragment d'URL.",
  ctaButton: "Essayer PrivateNote ->",
};
