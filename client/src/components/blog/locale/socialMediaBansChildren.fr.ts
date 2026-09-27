import type { SocialMediaBansChildrenArticleCopy } from "./socialMediaBansChildren.types";

export const socialMediaBansChildrenFr: SocialMediaBansChildrenArticleCopy = {
  heroAlt:
    "Adolescente regardant son smartphone à la maison, illustrant les débats sur l'accès des enfants aux réseaux sociaux et la politique de sécurité en ligne",
  heroCaption:
    "Les débats politiques s'accélèrent — mais les preuves sur les interdictions générales sont plus nuancées que les titres ne le laissent penser.",
  intro: [
    "Les parents ont de bonnes raisons de s'inquiéter. Les enfants passent plus de temps en ligne que jamais, confrontés au cyberharcèlement, au harcèlement, aux algorithmes de recommandation axés sur l'engagement et à des contenus conçus pour maximiser l'attention et le temps d'écran.",
    "Les préoccupations liées à la santé mentale, au temps d'écran excessif et à la sécurité en ligne poussent les gouvernements du monde entier à envisager une législation de plus en plus restrictive. Une proposition a particulièrement pris de l'ampleur : **interdire les réseaux sociaux aux enfants**.",
    "Cette vague politique gagne du terrain partout dans le monde — de la législation historique de l'Australie restreignant l'accès aux moins de 16 ans aux propositions et débats similaires en France, au Danemark et en Norvège. À première vue, la logique semble simple : si les enfants n'ont pas accès aux réseaux sociaux, ils ne peuvent pas en être blessés.",
    "Malheureusement, la technologie et le comportement humain sont rarement aussi simples.",
    "Un rapport complet publié par [Information Labs](https://informationlabs.org/wp-content/uploads/2026/07/SMB-Report.pdf) réunit des experts en droits de l'enfant, psychologie, cryptographie, informatique et politique numérique. Malgré des approches disciplinaires différentes, de nombreux contributeurs arrivent à une conclusion similaire : **les interdictions générales des réseaux sociaux sont peu susceptibles de traiter les causes profondes des préjudices en ligne et peuvent entraîner d'importantes conséquences imprévues**.",
  ],
  sections: [
    {
      title: "Le débat sur les préjudices et la régulation",
      paragraphs: [
        "Les partisans des restrictions d'âge affirment que les gouvernements ont la responsabilité de réduire l'exposition des enfants aux risques en ligne connus, même si les preuves scientifiques continuent d'évoluer. Attendre un consensus académique parfait, selon eux, pourrait retarder la protection d'une génération vulnérable.",
        "Le débat ne porte donc pas sur l'existence des préjudices en ligne — ils existent clairement — mais sur la question de savoir si les interdictions générales des réseaux sociaux constituent la réponse la plus efficace.",
        "Les chercheurs restent divisés sur l'ampleur des effets des réseaux sociaux et sur l'efficacité des restrictions larges. Une grande partie du débat public a été façonnée par le psychologue social Jonathan Haidt, dont le livre [The Anxious Generation](https://www.anxiousgeneration.com/) relie l'essor des smartphones et des réseaux sociaux à la détérioration de la santé mentale des adolescents.",
        "D'autres chercheurs appellent à plus de prudence. La Dre Candice Odgers, Associate Dean for Research à l'University of California, Irvine, a affirmé que de fortes affirmations causales reliant la technologie numérique à la crise de santé mentale des jeunes ne sont pas actuellement soutenues par l'ensemble plus large des preuves scientifiques.",
        "Par ailleurs, une étude de référence d'Amy Orben et Andrew K. Przybylski à l'University of Oxford, publiée dans **Nature Human Behaviour**, a analysé des données de plus de 355 000 adolescents et a constaté que l'utilisation des technologies numériques expliquait **au plus 0,4 %** de la variation du bien-être.",
        "Cela ne signifie pas que les réseaux sociaux n'ont aucun effet sur des enfants individuels. Cela indique plutôt que la relation est considérablement plus complexe que le débat public ne le suggère souvent : l'environnement familial, la santé mentale existante, l'éducation, les facteurs socioéconomiques et le soutien social jouent tous un rôle important.",
      ],
    },
    {
      title: "Le risque de déplacement numérique",
      paragraphs: [
        "Le rapport d'Information Labs met en lumière une préoccupation qui reçoit relativement peu d'attention publique : le **déplacement numérique**.",
        "Les enfants ne disparaissent pas simplement d'Internet lorsque l'accès aux grandes plateformes est restreint. Certains migrent plutôt vers des espaces en ligne beaucoup plus difficiles à surveiller.",
        "Les grandes plateformes — malgré leurs nombreuses lacunes — offrent souvent des outils de signalement, des équipes de modération, des fonctionnalités de sécurité et un accès direct à des ressources d'aide. Les plateformes plus petites ou de niche offrent fréquemment beaucoup moins de garanties.",
        "Cette préoccupation est particulièrement pertinente pour les jeunes marginalisés. Des recherches de [ReachOut Australia](https://about.au.reachout.com/our-research/social-media-report) montrent que de nombreux jeunes utilisent les réseaux sociaux pour accéder à des informations et à un soutien en matière de santé mentale. Des recherches de l'organisation LGBTQIA+ pour jeunes [Minus18](https://www.minus18.org.au/resources) soulignent également l'importance des communautés en ligne pour de nombreux jeunes queer, qui s'y appuient souvent pour l'amitié, le soutien émotionnel et le sentiment d'appartenance — surtout lorsqu'un soutien comparable n'est pas disponible hors ligne.",
        "Si les grands services deviennent inaccessibles, certains utilisateurs se tournent plutôt vers :",
      ],
      bullets: [
        "Des forums de discussion non réglementés",
        "Des groupes privés chiffrés avec peu ou pas de modération",
        "Des VPN pour contourner les restrictions",
        "Des applications internationales alternatives échappant à la supervision nationale",
      ],
      callout:
        "Plutôt que d'éliminer le risque, les interdictions générales peuvent simplement le déplacer vers des endroits où les parents, les éducateurs, les chercheurs et les organisations de protection de l'enfance ont beaucoup moins de visibilité.",
    },
    {
      title: "Pourquoi la vérification d'âge soulève des préoccupations en matière de vie privée",
      paragraphs: [
        "Toute interdiction des réseaux sociaux repose sur une hypothèse cruciale : les plateformes doivent pouvoir déterminer l'âge d'un utilisateur.",
        "Comme l'affirme le cryptographe **Dr Bart Preneel** dans sa contribution au rapport d'Information Labs, y parvenir tout en préservant la vie privée en ligne est extraordinairement difficile.",
        "Pour prouver qu'une personne est assez âgée pour utiliser une plateforme, les adultes — pas seulement les enfants — doivent de plus en plus soumettre des informations personnelles sensibles.",
        "Les propositions courantes incluent :",
      ],
      bullets: [
        "L'estimation de l'âge à partir du visage par intelligence artificielle",
        "Des documents d'identité délivrés par l'État, tels que passeports ou permis de conduire",
        "Des services de vérification d'identité tiers",
        "La vérification par carte bancaire",
      ],
      callout:
        "Fonder une politique sur une vérification d'identité à grande échelle revient à créer de nouvelles collections de données personnelles hautement sensibles. Les fournisseurs de vérification d'âge — comme toute organisation qui stocke des informations sensibles — deviennent des cibles attractives pour les cybercriminels. Le résultat est un compromis difficile : des efforts destinés à améliorer la sécurité des enfants peuvent simultanément accroître les risques pour la vie privée et la cybersécurité de millions d'utilisateurs légitimes.",
    },
    {
      title: "Le vrai problème : la conception des plateformes",
      paragraphs: [
        "L'un des thèmes récurrents les plus forts du rapport d'Information Labs est que les préjudices en ligne sont fortement influencés par **la façon dont les plateformes sont conçues**, et pas seulement par qui les utilise.",
        "De nombreuses grandes entreprises de réseaux sociaux s'appuient sur des modèles économiques qui récompensent l'engagement des utilisateurs. Les systèmes de recommandation sont généralement optimisés pour le temps de visionnage, les clics, les partages ou la durée de session. C'est commercialement efficace, mais cela peut aussi amplifier des contenus émotionnellement engageants ou sensationnels, car ils retiennent les utilisateurs sur la plateforme.",
        "Les enfants — dont la prise de décision, le contrôle des impulsions et la régulation émotionnelle sont encore en développement — peuvent être particulièrement sensibles à ces choix de conception.",
        "Plutôt que d'exclure entièrement les enfants, des organisations comme [UNICEF](https://www.unicef.org/press-releases/age-restrictions-alone-wont-keep-children-safe-online) et la [5Rights Foundation](https://5rightsfoundation.com/) plaident pour modifier les incitations techniques qui façonnent les plateformes numériques dès le départ.",
      ],
    },
    {
      title: "Des alternatives fondées sur les preuves",
      paragraphs: [
        "Au lieu d'interdictions générales, de nombreux experts recommandent des interventions qui ciblent les causes sous-jacentes des préjudices, notamment :",
      ],
      bullets: [
        "Des paramètres par défaut sécurisés pour les comptes d'enfants, comme la désactivation de la lecture automatique et la limitation des notifications nocturnes",
        "Des restrictions sur le profilage comportemental et la publicité ciblée destinée aux mineurs",
        "Des limites aux fonctionnalités d'interface addictives, y compris le défilement infini et la lecture automatique",
        "Une application plus stricte des lois européennes existantes, notamment le [règlement sur les services numériques](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package) et le [règlement général sur la protection des données (RGPD)](https://eur-lex.europa.eu/eli/reg/2016/679/oj)",
        "Une plus grande transparence autour des algorithmes de recommandation et un meilleur accès aux données des plateformes pour les chercheurs universitaires indépendants",
      ],
      callout:
        "Ces approches visent à réduire les préjudices tout en préservant la vie privée et en maintenant l'accès à des communautés en ligne légitimes et à des réseaux de soutien.",
    },
    {
      title: "Une perspective de vie privée et de sécurité",
      paragraphs: [
        "La cybersécurité a démontré à plusieurs reprises que collecter davantage de données personnelles résout rarement les problèmes de sécurité systémiques.",
        "Bloquer des sites malveillants n'élimine pas le hameçonnage. Des règles de mot de passe strictes à elles seules n'arrêtent pas le vol d'identifiants. Une sécurité durable repose sur des systèmes conçus pour être sûrs, des paramètres par défaut sensés, la responsabilité, la transparence et l'éducation des utilisateurs.",
        "Le même principe s'applique à la sécurité en ligne des enfants.",
        "Construire de grandes bases de documents d'identité pour faire respecter des restrictions d'âge introduit des surfaces d'attaque entièrement nouvelles. Les politiques destinées à protéger les enfants doivent donc être évaluées non seulement pour leurs objectifs sociaux, mais aussi pour les risques de vie privée et de sécurité qu'elles créent.",
        "Une protection efficace des enfants et une vie privée forte ne doivent pas être des objectifs concurrents. Des technologies bien conçues et une régulation fondée sur les preuves peuvent soutenir les deux.",
        "C'est aussi pourquoi les outils de partage sensible — tels que les [liens chiffrés à usage unique](blog:one-time-secret-links) et le [chiffrement de bout en bout](blog:what-is-end-to-end-encryption) — comptent : ils réduisent les copies durables de secrets sans exiger que chacun remette des documents d'identité à chaque plateforme utilisée.",
      ],
    },
  ],
  preneelEyebrow: "Perspective d'expert",
  preneelTitle: "Bart Preneel sur la vérification d'âge et la vie privée",
  preneelParagraphs: [
    "Le Dr Bart Preneel est un cryptographe belge et professeur à la KU Leuven. Sa contribution au rapport d'Information Labs se concentre sur une question que les décideurs traitent souvent comme un détail technique : comment vérifier l'âge en ligne sans transformer tout Internet en un point de contrôle d'identité ?",
    "L'argument de Preneel n'est pas que la sécurité des enfants est sans importance. C'est que **les contrôles d'âge obligatoires fonctionnent mal à grande échelle** — ils poussent des documents sensibles et des estimations biométriques dans des chaînes commerciales de vérification, créent des cibles attractives pour les attaquants et échouent tout de même face à des adolescents déterminés utilisant des VPN ou des comptes empruntés.",
    "Si vous voulez le débat politique en langage clair, sa conférence publique sur le sujet mérite d'être regardée aux côtés du rapport écrit.",
  ],
  preneelVideoLabel: "Regarder Bart Preneel sur YouTube",
  preneelReportLabel: "Lire le rapport d'Information Labs (PDF)",
  referencesTitle: "Références et lectures complémentaires",
  references: [
    {
      label: "Information Labs — Perspectives Report: Social Media Bans for Children (2026)",
      href: "https://informationlabs.org/wp-content/uploads/2026/07/SMB-Report.pdf",
    },
    {
      label: "Jonathan Haidt — The Anxious Generation",
      href: "https://www.anxiousgeneration.com/",
    },
    {
      label: "Candice L. Odgers — The great rewiring debate is overstated (Nature, 2024)",
      href: "https://www.nature.com/articles/d41586-024-00902-2",
    },
    {
      label: "Orben & Przybylski — Adolescent well-being and digital technology use (Nature Human Behaviour, 2019)",
      href: "https://doi.org/10.1038/s41562-018-0506-1",
    },
    {
      label: "ReachOut Australia — Comment les jeunes utilisent les réseaux sociaux pour l'information et le soutien en santé mentale",
      href: "https://about.au.reachout.com/our-research/social-media-report",
    },
    {
      label: "Minus18 — Ressources LGBTQIA+ pour les jeunes",
      href: "https://www.minus18.org.au/resources",
    },
    {
      label: "UNICEF — Keeping Children Safe Online: Trends in Online Platform Regulation (2025)",
      href: "https://www.unicef.org/documents/keeping-children-safe-online",
    },
    {
      label: "5Rights Foundation",
      href: "https://5rightsfoundation.com/",
    },
    {
      label: "Commission européenne — Règlement sur les services numériques",
      href: "https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package",
    },
    {
      label: "Règlement général sur la protection des données (RGPD)",
      href: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
    },
  ],
  closingTitle: "Réflexions finales",
  closingParagraphs: [
    "Protéger les enfants en ligne est l'un des défis les plus importants auxquels la société moderne est confrontée.",
    "Les preuves ne suggèrent pas que les préjudices en ligne doivent être ignorés. Elles indiquent en revanche que le problème est considérablement plus complexe qu'un simple choix entre accès sans restriction et interdiction générale.",
    "De nombreux chercheurs estiment que des progrès significatifs viendront de l'amélioration de la conception des plateformes, de l'application des réglementations existantes, de la réduction des incitations à l'engagement addictif, du renforcement de la littératie numérique et de la protection de la vie privée des utilisateurs.",
    "Ces solutions exigent une régulation durable, une refonte technique et une application efficace plutôt qu'une seule mesure législative. Elles s'attaquent aux systèmes qui créent les préjudices en ligne au lieu de se contenter de restreindre l'accès — et offrent une voie vers un environnement en ligne à la fois plus sûr pour les enfants et plus respectueux de la vie privée de chacun.",
  ],
  ctaTitle: "Partagez des informations sensibles sans copies permanentes",
  ctaBody:
    "Lorsque des adultes et des adolescents doivent transmettre des mots de passe, des codes de récupération ou des documents personnels, les liens chiffrés à usage unique réduisent les dégâts si un message est transféré, capturé d'écran ou stocké dans un historique de discussion.",
  ctaButton: "Créer une note privée",
};
