import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersFr: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Graphique éditorial « Chat Control est de retour » avec une bulle de discussion verrouillée et une carte de l'Europe",
  heroCaption: "Illustration générée pour PrivateNote.ai.",
  intro:
    "Aujourd'hui, mardi 7 juillet, le Parlement européen devrait réexaminer le règlement proposé sur les abus sexuels sur enfants (CSAR), communément appelé Chat Control par ses détracteurs. L'objectif de la proposition n'est pas controversé : les enfants doivent être protégés contre des abus horribles. La question technique est de savoir si l'analyse obligatoire des communications privées peut y parvenir sans compromettre les garanties de sécurité dont tout le monde dépend.",
  updatePrefix:
    "**Mise à jour (9 juillet 2026) :** Le Parlement a prolongé Chat Control 1.0 même si davantage de députés ont voté contre que pour.",
  updateLink: "Lisez ce qui s'est passé et pourquoi",
  updateSuffix: ".",
  calloutTitle: "Ce débat ne porte pas sur la question de savoir s'il faut combattre les abus sur enfants.",
  calloutBody:
    "Les victimes méritent une protection. Les forces de l'ordre méritent des outils efficaces. Les plateformes doivent signaler rapidement les contenus illégaux connus et coopérer aux enquêtes. Le désaccord porte sur la question de savoir si l'analyse massive des messages privés de chacun est une approche techniquement solide pour y parvenir.",
  expertEyebrow: "Avertissement d'expert",
  expertTitle: "Bart Preneel : la communauté de la sécurité est exceptionnellement unie",
  expertParagraphs: [
    "Bart Preneel, professeur à temps plein à la KU Leuven et l'un des experts européens les plus connus en cryptographie, vie privée et droits numériques, a averti aujourd'hui que Chat Control revient pour un troisième vote après que deux votes précédents n'ont pas tranché la question. Dans sa publication LinkedIn, il a décrit la proposition comme une analyse indiscriminée des communications non chiffrées, désormais étendue à l'utilisation de l'IA pour trouver de nouveaux CSAM.",
    "Preneel a également souligné le consensus d'experts exceptionnellement large derrière les critiques : plus de 800 experts en cybersécurité et en protection de la vie privée ont averti que l'analyse massive et l'analyse de contenu basée sur l'IA présentent encore des taux d'erreur inacceptables, soulèvent de sérieuses questions de proportionnalité et sont moins efficaces que les approches ciblées. Comme il l'a formulé, la communauté de la sécurité atteint rarement ce niveau d'accord sur un sujet.",
    "Sa recommandation pratique est directe : contactez les membres du Parlement européen et expliquez pourquoi l'analyse indiscriminée n'est pas une approche solide pour traiter le grave problème de la diffusion du CSAM.",
    "Pour le contexte technique, il renvoie les lecteurs vers deux lettres de scientifiques : la lettre ouverte de septembre 2025, qui explique les préoccupations centrales concernant l'analyse côté client et la détection basée sur l'IA, et le suivi de novembre 2025, qui affirme que l'élargissement proposé du périmètre amplifie les mêmes risques que la communauté de la sécurité a déjà identifiés.",
  ],
  expertLinks: {
    preneel: "Publication LinkedIn de Bart Preneel",
    sep2025: "Lettre ouverte de septembre 2025",
    nov2025: "Suivi de novembre 2025",
  },
  technicalConcerns: [
    {
      title: "L'IA ne peut pas classifier de manière fiable du CSAM inconnu à l'échelle d'Internet",
      body: "La classification d'images dépend du contexte. Les photos de famille, les images médicales, le matériel pédagogique et les images consensuelles échangées par des adolescents peuvent être difficiles à interpréter correctement, même pour des humains.",
    },
    {
      title: "La correspondance d'images connues peut être contournée",
      body: "Le recadrage, le redimensionnement, la compression, de petites modifications de pixels et les perturbations adversariales peuvent laisser une image reconnaissable pour une personne tout en modifiant la façon dont les systèmes de correspondance automatisés la perçoivent.",
    },
    {
      title: "L'analyse côté client modifie le modèle de confiance du chiffrement",
      body: "L'algorithme de chiffrement peut rester mathématiquement solide, mais le logiciel est tenu d'inspecter le contenu avant que le chiffrement ne le protège. Ce n'est pas la garantie de confidentialité que les utilisateurs attendent du chiffrement de bout en bout.",
    },
    {
      title: "L'infrastructure d'analyse devient une cible de grande valeur",
      body: "Une fois que les appareils sont tenus d'inspecter les messages privés, le même mécanisme peut attirer des attaquants, des pressions politiques et de futures demandes d'analyse pour d'autres catégories de contenu.",
    },
  ],
  protectedGroups: [
    "journalistes et sources confidentielles",
    "avocats et clients",
    "médecins et patients",
    "entreprises protégeant des secrets commerciaux",
    "fonctionnaires et diplomates",
    "communications des forces de l'ordre et militaires",
  ],
  betterInvestments: [
    { title: "Soutenir les victimes", body: "Canaux de signalement adaptés au traumatisme et soutien à long terme des victimes." },
    { title: "Financer des spécialistes", body: "Davantage de capacité pour des équipes d'enquête formées qui enquêtent sur les abus." },
    { title: "Enquêter sur les preuves", body: "Enquête rapide et ciblée basée sur des pistes et signalements concrets." },
    { title: "Travailler au-delà des frontières", body: "Coopération internationale lorsque les auteurs, les plateformes et les victimes s'étendent sur plusieurs juridictions." },
    { title: "Supprimer les contenus confirmés", body: "Retrait plus rapide des contenus illégaux connus après confirmation appropriée." },
    { title: "Prévenir les abus plus tôt", body: "Éducation et travail de prévention avant que les abus ne se produisent." },
  ],
  betterInvestmentEyebrow: "Meilleur investissement",
  betterInvestmentTitle: "Renforcer le travail qui aide directement les victimes et les enquêteurs",
  sections: {
    proposalReturns: {
      title: "La proposition continue de revenir",
      paragraphs: [
        "Au cours des dernières années, le CSAR a connu plusieurs révisions. Certaines modifications méritent d'être reconnues : un traitement plus rapide des signalements volontaires, des obligations plus claires et des catégories de contenu plus étroites sont tous préférables à des mandats plus larges et plus vagues.",
        "Mais ces changements ne suppriment pas le problème technique central. Les versions les plus contestées de Chat Control reposent toujours sur des technologies de détection dont les cryptographes, informaticiens et chercheurs en sécurité ont averti qu'elles ne sont pas assez fiables pour être déployées contre des centaines de millions de communications privées.",
      ],
    },
    cryptographersObject: { title: "Pourquoi les cryptographes continuent de s'opposer" },
    e2eeScanning: {
      title: "Le chiffrement de bout en bout ne peut pas survivre à une analyse obligatoire côté client",
      paragraphs: [
        "Le chiffrement de bout en bout offre aux utilisateurs une promesse simple : seuls l'expéditeur et le destinataire prévu peuvent lire le message. L'analyse obligatoire côté client modifie cette promesse. L'appareil doit inspecter le message avant que le chiffrement ne le protège et signaler tout ce que le système d'analyse considère comme suspect.",
        "En transit, le message peut toujours être chiffré avec une cryptographie solide. Le problème se situe avant cette étape. Si le logiciel est tenu d'examiner le texte en clair sur l'appareil et de signaler les correspondances à un système externe, le point terminal n'agit plus uniquement pour l'utilisateur. C'est un modèle de confiance différent du chiffrement de bout en bout tel que les gens le comprennent.",
      ],
    },
    encryptionProtects: {
      title: "Le chiffrement protège plus que les discussions personnelles",
      intro:
        "Le débat public donne souvent l'impression que la messagerie chiffrée ne concerne que les conversations informelles. Ce n'est pas le cas. La communication privée sécurisée est une infrastructure critique pour les personnes et institutions qui font face à de réels risques.",
    },
    moreTech: {
      title: "Plus de technologie ne signifie pas automatiquement plus de sécurité",
      paragraphs: [
        "La proposition s'inscrit également dans des appels plus larges à la vérification d'âge et à des systèmes de mitigation supplémentaires. Ces idées peuvent sembler constituer des couches de sécurité supplémentaires, mais l'ingénierie de la sécurité s'améliore rarement en ajoutant de la complexité sans comprendre les nouvelles surfaces d'attaque qu'elle crée.",
        "Les vérifications d'identité centralisées, les pipelines d'analyse, les files d'attente de révision et l'infrastructure de signalement peuvent tous introduire leurs propres risques pour la vie privée. Un système conçu pour protéger les enfants ne devrait pas créer silencieusement de nouvelles bases de données, de nouvelles incitations à la surveillance et de nouveaux modes de défaillance pour tout le monde.",
      ],
    },
    betterWays: {
      title: "Il existe de meilleures façons de protéger les enfants",
      intro:
        "Un point de la critique scientifique mérite une attention particulière : le CSAM est la preuve d'un crime antérieur. L'objectif réel devrait être de prévenir les abus, de soutenir les victimes et de permettre des enquêtes ciblées capables d'identifier réellement les auteurs.",
    },
    privateNote: {
      title: "Pourquoi cela compte pour PrivateNote",
      paragraphs: [
        "Chez PrivateNote, le principe est simple : lorsque vous créez une note chiffrée, seules les personnes que vous choisissez devraient pouvoir la lire. Pas nous. Pas les annonceurs. Pas les fournisseurs cloud. Personne d'autre.",
        "Ce principe n'est pas un slogan. Il reflète des décennies d'ingénierie cryptographique. Le débat autour de Chat Control pose la question de savoir si la communication privée doit rester véritablement privée, ou si chaque appareil doit devenir un point de contrôle obligatoire qui inspecte les messages avant qu'ils ne soient chiffrés.",
      ],
    },
    policyReality: {
      title: "La politique doit suivre la réalité technique",
      paragraphs: [
        "Des personnes raisonnables peuvent diverger sur la politique. **Mais la politique doit être informée par la réalité technique.** Lorsque des centaines de cryptographes, informaticiens, ingénieurs en sécurité et chercheurs en protection de la vie privée avertissent qu'une technologie proposée ne peut pas tenir ses promesses sans affaiblir des garanties de sécurité fondamentales, les législateurs devraient écouter.",
        "Protéger les enfants et protéger les communications sécurisées ne sont pas des objectifs mutuellement exclusifs. L'Europe devrait poursuivre des solutions qui accomplissent les deux.",
      ],
    },
  },
  ctaTitle: "Envoyez des notes privées sans donner la clé au serveur",
  ctaBody:
    "PrivateNote chiffre les notes dans votre navigateur et conserve la clé de déchiffrement dans le fragment d'URL.",
  ctaButton: "Essayer PrivateNote ->",
};
