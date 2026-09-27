import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersFr: SecureClientDeliveryForLawyersArticleCopy = {
  heroKicker: "Protection du secret professionnel",
  intro: [
    "Le chiffrement d’un message ne dit pas, à lui seul, qui pourra plus tard relire une trace écrite. En France, en Belgique et en Suisse romande, la protection effective des échanges couverts par le secret suppose aussi de s’interroger sur leur conservation : qui peut retrouver, copier ou produire un écrit, et pendant combien de temps.",
    "Les cabinets savent que le courriel est un mauvais coffre. Beaucoup se tournent vers Signal ou WhatsApp parce que « c’est chiffré ». Ces applications sont faites pour conserver une conversation. Or bien des échanges couverts par le secret visent l’inverse : transmettre une instruction, un projet ou une pièce au client, puis cesser d’accumuler des copies.",
    "Surtout en défense pénale, une part importante de la clientèle n’installera pas une seconde application. Elle ouvrira un lien dans le navigateur déjà présent. La profession a besoin d’un envoi qui ressemble à une correspondance de cabinet — pas à une bulle issue d’un réseau social.",
  ],
  sections: [
    {
      title: "Pourquoi une « messagerie sécurisée » reste un dossier",
      paragraphs: [
        "Le chiffrement de bout en bout de Signal ou WhatsApp protège efficacement le contenu contre l’accès du prestataire. Mais chiffrement et persistance sont deux questions différentes : un message peut être parfaitement chiffré pendant sa transmission et rester ensuite consultable sur les appareils des participants. C’est cette seconde question qui importe en pratique au cabinet et, tout particulièrement, à l’avocat pénaliste :",
      ],
      bullets: [
        "Un historique consultable demeure-t-il sur le téléphone du client, sur celui d’un proche, ou sur un appareil qui sera plus tard saisi, perdu ou expertisé ?",
        "Les sauvegardes cloud, ordinateurs liés, aperçus de notification et captures d’écran transférées multiplient-ils le contenu au-delà des parties initiales ?",
        "A-t-on, sans le vouloir, créé un commentaire écrit courant qui n’était pas destiné à figurer au dossier, mais qui pourra réapparaître comme trace numérique ?",
      ],
      paragraphsAfterBullets: [
        "Le même schéma se retrouve hors du prétoire. Voir [notes éphémères pour les messages professionnels](blog:workplace-texts-private-note) et [pourquoi les secrets n’ont pas leur place dans les messageries](blog:secrets-never-send-in-chat). Pour passeports, comptes rendus médicaux et contrats, l’objection vaut aussi pour les [pièces jointes de courriel](blog:why-email-is-worst-for-secrets).",
        "Il ne s’agit pas d’inviter à détruire ce que le cabinet doit conserver. Les obligations de conservation du dossier, la tenue régulière des pièces et, le cas échéant, les mesures de sauvegarde demeurent. Le propos est plus étroit : beaucoup de communications opérationnelles — instructions ponctuelles, identifiants d’accès, formulations destinées aux seuls yeux du client, une pièce sensible qui n’a pas à vivre dans la messagerie familiale — n’ont pas à se fossiliser dans une application de messagerie.",
      ],
    },
    {
      title: "Défense pénale, détention et le client sans deuxième application",
      paragraphs: [
        "L’objection est la plus vive en défense pénale. Le client est souvent sous pression, parfois en garde à vue, en détention provisoire ou en détention, et utilise le téléphone d’un parent. Lui demander d’« installer simplement Signal » échoue dans un grand nombre de dossiers. WhatsApp est souvent déjà sur l’appareil — et c’est précisément le problème : la famille s’y dispute, les captures d’écran y circulent, et une instruction couverte par le secret côtoie le message d’un cousin.",
        "S’y ajoute la pratique des saisies. Si le téléphone est saisi, l’historique local de la messagerie est sur l’appareil. PrivateNote ne modifie pas les pouvoirs de saisie ni d’examen des autorités. Il vise à réduire, par défaut, la persistance d’une instruction dans une conversation — pas à changer ce que le droit permet d’examiner.",
        "Parmi les communications qui n’ont pas à rester dans ce réseau :",
      ],
      bullets: [
        "Instructions sur l’attitude procédurale, le contrôle judiciaire, une caution, des admissions envisagées ou une comparution.",
        "Projets de déclaration, de conclusions ou de plaidoirie sur la peine, que le client doit approuver avant dépôt.",
        "Adresses, certificats médicaux, situation patrimoniale ou identité d’un témoin pressenti — nécessaires aujourd’hui, dangereux s’ils subsistent.",
        "Identifiants ponctuels pour un portail, une visioaudience ou un document que le client doit lire une fois, sans le stocker dans la messagerie.",
        "Avocat à avocat : confrère correspondant, postulation, substitution à l’audience — les pièces sont nécessaires maintenant, pas un fil de discussion permanent.",
      ],
      paragraphsAfterBullets: [
        "Dans chacun de ces cas, l’enjeu est de transmettre le contenu au destinataire visé, sans élargir inutilement le cercle de ceux qui pourront plus tard le reconstituer.",
      ],
    },
    {
      title: "Un lien d’envoi, pas une conversation",
      paragraphs: [
        "C’est la logique d’un [lien secret à usage unique](blog:one-time-secret-links), appliquée à l’exercice. PrivateNote chiffre le contenu dans le navigateur avant qu’il ne quitte l’appareil. Les destinataires ouvrent une URL unique. L’avocat envoie le lien par le canal que le client utilise déjà — SMS, courriel, même un court appel où l’adresse est dictée — sans y placer l’instruction elle-même. Le contenu sensible reste dans la note. La messagerie ou la boîte de réception ne contiennent qu’un lien qui cesse ensuite de fonctionner.",
      ],
      comparisonTable: {
        headers: ["Exigence de l’exercice", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "Le client n’installe pas d’application",
            "Non — l’application est le canal",
            "Oui — navigateur ordinaire",
          ],
          [
            "Pas d’historique durable par défaut",
            "Conversation dans une application, y compris avec messages éphémères",
            "Transmission ponctuelle par lien ; destruction après lecture sur le service",
          ],
          [
            "Identité du cabinet à l’ouverture",
            "Une identité de messagerie grand public",
            "Logo, nom du cabinet et page d’ouverture à l’image du cabinet",
          ],
          [
            "Preuve que les pièces ont été ouvertes",
            "Les coches bleues ne constituent pas un suivi de transmission dédié",
            "Alertes d’ouverture et preuve d’accès (statut seulement)",
          ],
          [
            "Rappel en cas de mauvais numéro",
            "Le message est déjà sur l’appareil",
            "Révoquer une note non ouverte",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Signal et WhatsApp proposent également des messages éphémères. Leur modèle reste toutefois celui d’une conversation dans une application de messagerie, alors que PrivateNote est conçu comme une transmission ponctuelle par lien. Pour les documents plutôt que de brèves instructions, voir [comment envoyer des documents sensibles en sécurité](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Exemple : transmettre un projet de déclaration",
      paragraphs: [
        "L’avocat prépare le texte et crée une note à lecture unique, protégée par [vérification du destinataire](blog:recipient-verification-code-before-reveal). Le client reçoit uniquement le lien par SMS. Le code lui est communiqué séparément. Il ouvre la note dans son navigateur, sans compte PrivateNote. L’avocat reçoit le [statut d’ouverture](blog:know-when-secret-link-opened). La note n’est ensuite plus disponible via le lien. Si le numéro était erroné, la [révocation](blog:revoke-unopened-note-proof-of-access) peut encore détruire un lien non ouvert.",
        "L’identité visuelle du cabinet remplit aussi une fonction de confiance. Un client habitué à se méfier des liens inconnus doit pouvoir reconnaître immédiatement le contexte de l’envoi : nom du cabinet, logo, identité de l’expéditeur et message d’accompagnement. Cela ne remplace pas la vérification cryptographique du destinataire, mais rend la transmission plus identifiable et professionnelle.",
      ],
      midCta: {
        body: "L’offre Business est conçue pour les besoins de transmission des cabinets d’avocats : image du cabinet chez le destinataire, fichiers en lecture seule, pièces jointes jusqu’à 1 Go, et l’ensemble des contrôles d’envoi (preuve d’accès, vérification du destinataire, révocation, révélation planifiée). 12 € / 12 $ par mois, ou 120 € / 120 $ par an — un compte professionnel, pas une licence par siège.",
        button: "Découvrir l’offre Business pour cabinets",
      },
      paragraphsAfterOrdered: [
        "Pour les liasses plus volumineuses, le même modèle s’applique : [fichiers chiffrés, données chiffrées sur le serveur, fenêtre de téléchargement limitée](app:secure-file-transfer). L’envoi d’un fichier exige un compte gratuit ; l’ouverture d’un lien, jamais.",
      ],
    },
    {
      title: "Ce que cet outil ne décide pas",
      paragraphs: [
        "L’application du secret professionnel à une communication concrète dépend du cadre juridique et des circonstances du cas. PrivateNote ne détermine pas ce statut juridique. Aucun produit n’empêche un destinataire légitime de copier, capturer ou photographier une fois le contenu en clair affiché. PrivateNote peut empêcher que la copie stockée par le service reste disponible après destruction. Il ne peut pas garantir qu’aucune copie du contenu en clair n’existe ailleurs sur l’appareil du destinataire. Il ne remplace pas le dossier du cabinet. Il ne change pas ce que les autorités peuvent légalement saisir ou examiner.",
      ],
    },
    {
      title: "Questions fréquentes",
      faqs: [
        {
          question:
            "Le chiffrement de Signal ou WhatsApp suffit-il au secret professionnel ?",
          answer:
            "Le chiffrement de bout en bout protège efficacement le contenu contre l’accès du prestataire. Il ne décide pas combien de temps un historique demeure sur les appareils, dans les sauvegardes ou dans la messagerie du client. Chiffrement et persistance sont deux questions différentes. La protection juridique applicable à une communication ne dépend pas seulement de l’outil utilisé pour la transmettre.",
        },
        {
          question: "PrivateNote remplace-t-il le dossier du cabinet ?",
          answer:
            "Non. C’est un canal d’envoi de courte durée. Les dossiers, les pièces de procédure et tout ce qui relève d’une obligation de conservation restent dans les systèmes habituels du cabinet.",
        },
        {
          question: "Le destinataire peut-il quand même conserver une copie après ouverture ?",
          answer:
            "Oui. Une fois le contenu en clair légitimement affiché, un destinataire déterminé peut copier, capturer l’écran, télécharger ou photographier. La destruction après lecture et l’expiration réduisent les copies résiduelles sur le service ; elles n’effacent pas à distance ce que le destinataire a déjà fixé. La lecture seule de Business décourage le téléchargement de convenance ; elle n’interdit pas la photographie.",
        },
      ],
    },
  ],
  ctaTitle: "Transmettre l’instruction. Ne pas laisser l’historique.",
  ctaBody:
    "Découvrez l’offre Business pour apposer le nom du cabinet sur la page d’ouverture. Ou testez d’abord l’envoi d’une note chiffrée.",
  ctaPrimary: "Découvrir l’offre Business pour cabinets",
  ctaSecondary: "Tester l’envoi d’une note chiffrée",
};
