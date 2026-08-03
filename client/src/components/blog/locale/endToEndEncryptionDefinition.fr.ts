import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionFr: E2eeDefinitionArticleCopy = {
  intro: [
    "Le chiffrement de bout en bout est l'une des expressions les plus répétées dans le marketing de la sécurité. C'est aussi l'une des plus faciles à diluer. La vraie définition n'est pas que les données sont chiffrées quelque part. La vraie définition porte sur qui peut les déchiffrer.",
    "Si le fournisseur de service possède les clés, peut les récupérer ou reçoit du texte en clair pendant le fonctionnement normal, le système peut encore être chiffré, mais il n'est pas chiffré de bout en bout au sens strict.",
  ],
  definitionTitle: "La définition la plus courte et la plus utile",
  definitionBody:
    "Le chiffrement de bout en bout signifie que seuls les points terminaux possèdent les clés nécessaires pour déchiffrer les données. Le fournisseur de service peut stocker ou relayer du texte chiffré, mais il ne devrait pas posséder les clés ni le texte en clair.",
  tableHeaders: ["Modèle", "Chiffrement", "Le serveur voit le texte en clair ?", "Le serveur a les clés ?"],
  tableRows: [
    { model: "Sécurité de transport (TLS)", happens: "Entre le navigateur et le serveur", plaintext: "Oui, sur le serveur", keys: "Oui, pour le traitement côté serveur" },
    { model: "Chiffrement côté client défaillant", happens: "Sur l'appareil", plaintext: "Peut-être", keys: "Oui, si les clés sont envoyées ou récupérables" },
    { model: "Véritable E2EE", happens: "Aux points terminaux", plaintext: "Non", keys: "Non" },
  ],
  flowNodes: [
    { title: "Navigateur de l'expéditeur", body: "Chiffre localement avant l'envoi" },
    { title: "Stockage PrivateNote", body: "Stocke uniquement du texte chiffré" },
    { title: "Navigateur du destinataire", body: "Déchiffre avec la clé du fragment" },
  ],
  sections: [
    {
      title: "Le chiffrement n'est pas la même chose que le chiffrement de bout en bout",
      paragraphs: [
        "La plupart des services web sérieux utilisent TLS. C'est important : TLS protège les données pendant leur transit entre votre navigateur et le serveur, et empêche les attaquants du réseau local de lire la connexion.",
        "Mais TLS se termine au serveur. Une fois la requête arrivée, le service peut généralement voir le texte en clair. Le fournisseur peut ensuite le stocker, l'analyser, l'indexer, le traiter ou le rechiffrer au repos avec des clés qu'il contrôle.",
        "C'est du transport chiffré. Ce n'est pas, à lui seul, du chiffrement de bout en bout.",
      ],
      callout: "Le test pratique est simple : le fournisseur peut-il obtenir la clé de déchiffrement ou le texte en clair ? Si oui, le système n'est pas véritablement chiffré de bout en bout.",
    },
    {
      title: "La définition du cryptographe",
      paragraphs: [
        "Une définition précise de l'E2EE commence par la possession des clés. Dans un véritable système de bout en bout, les clés de chiffrement et de déchiffrement sont créées et détenues par les points terminaux, pas par le service de livraison.",
        "Le serveur peut acheminer, stocker, limiter le débit et supprimer du texte chiffré. Il peut exploiter le service. Mais il ne détient pas le matériel de clé nécessaire pour transformer le texte chiffré en contenu lisible.",
        "L'analyse bien connue de Matthew Green sur la controverse du chiffrement de Zoom illustre clairement ce point : la propriété centrale n'est pas seulement que le chiffrement existe, mais que les clés de déchiffrement sont indisponibles pour le fournisseur.",
      ],
      bullets: [
        "Le point terminal de l'expéditeur peut chiffrer les données.",
        "Le point terminal du destinataire peut déchiffrer les données.",
        "Le serveur intermédiaire ne gère que du texte chiffré.",
        "Une compromission du serveur ne devrait pas exposer le contenu en clair.",
      ],
    },
    {
      title: "Le chiffrement côté client peut encore être insuffisant",
      paragraphs: [
        "Le chiffrement côté client signifie que l'opération cryptographique a lieu localement avant l'envoi. C'est nécessaire pour de nombreuses conceptions E2EE, mais ce n'est pas suffisant à lui seul.",
        "Un service pourrait chiffrer des données dans le navigateur puis envoyer à la fois le texte chiffré et la clé correspondante à son backend. Le chiffrement a eu lieu côté client, mais le fournisseur possède toujours la clé. Cela brise la frontière de bout en bout.",
        "La distinction significative est la possession exclusive des clés. Si le fournisseur peut accéder, récupérer, faire pivoter, déposer en escrow ou régénérer la clé utilisable, l'utilisateur fait toujours confiance au fournisseur pour l'accès au texte en clair.",
      ],
    },
    {
      title: "Comment les notes à fragment d'URL s'inscrivent dans le modèle",
      paragraphs: [
        "PrivateNote utilise une version basée sur le navigateur de cette architecture pour les notes à usage unique. Le navigateur de l'expéditeur chiffre la note localement. La charge utile chiffrée est envoyée au stockage. La clé de déchiffrement est placée dans le fragment d'URL : la partie après le symbole #.",
        "Les navigateurs n'envoient pas le fragment d'URL au serveur dans la requête HTTP. Cela signifie que le serveur reçoit le texte chiffré, mais pas la clé. Lorsque le destinataire ouvre le lien, son navigateur possède le fragment localement et peut déchiffrer la note après l'étape de révélation.",
        "Ce n'est pas la même topologie que Signal ou MLS, où les points terminaux sont généralement des appareils liés à un compte avec des clés publiques persistantes. Mais la propriété de sécurité centrale est la même : le fournisseur de stockage ne possède pas la clé nécessaire pour déchiffrer le contenu.",
      ],
    },
    {
      title: "Le canal de livraison compte toujours",
      paragraphs: [
        "Un lien chiffré à usage unique est puissant, mais le lien complet devient sensible car il transporte la clé de déchiffrement dans le fragment. Si vous collez ce lien dans un canal qui enregistre les messages, synchronise l'historique ou est surveillé par un administrateur, ce canal peut exposer le secret avant qu'il ne soit ouvert.",
        "C'est pourquoi l'expiration, les lectures uniques et les mots de passe optionnels sont opérationnellement importants. Ils ne changent pas la définition de l'E2EE, mais ils réduisent les dégâts si un lien est transféré, enregistré ou prévisualisé par un logiciel.",
        "Pour du matériel hautement sensible, envoyez le lien par un canal et partagez le mot de passe optionnel par un autre canal. Cela sépare la possession de la charge utile chiffrée de la possession du secret humain.",
      ],
    },
    {
      title: "La mise en garde sur la force brute hors ligne",
      paragraphs: [
        "La protection par mot de passe ajoute une défense en profondeur, mais elle comporte une véritable mise en garde cryptographique. Si un attaquant obtient le lien complet et télécharge le texte chiffré avant son expiration, la devinette de mot de passe peut devenir une attaque hors ligne. Les limites de débit du serveur n'aident plus, car l'attaquant peut essayer des suppositions contre le texte chiffré localement.",
        "PrivateNote utilise Argon2id pour les notes protégées par mot de passe. Argon2id est une fonction de dérivation de clé à mémoire coûteuse, qui augmente le coût de chaque tentative de mot de passe, en particulier pour les attaques par force brute intensives en GPU.",
        "Cela ne rend pas les mots de passe faibles sûrs. Un mot de passe court ou réutilisé peut encore échouer. Plus le mot de passe optionnel est fort, plus cette seconde couche devient utile.",
      ],
    },
    {
      title: "Pourquoi l'architecture compte",
      paragraphs: [
        "L'E2EE change le modèle de confiance. Avec le stockage chiffré au repos ordinaire, les utilisateurs s'appuient sur la politique du fournisseur, les contrôles des employés, le traitement juridique et la prévention des violations. Avec le chiffrement de bout en bout, le fournisseur est structurellement limité : il peut stocker des données chiffrées, mais il ne peut pas les déchiffrer.",
        "Cela n'élimine pas tous les risques. Les logiciels malveillants sur les terminaux, les extensions de navigateur malveillantes, les liens copiés, les mots de passe faibles et les canaux de livraison non sécurisés comptent toujours. La cryptographie réduit la frontière de confiance ; elle ne supprime pas le jugement opérationnel.",
        "La valeur reste significative : une violation de base de données devrait exposer du texte chiffré illisible plutôt que le contenu des messages. C'est la différence entre promettre de ne pas lire les données et être incapable de les lire en premier lieu.",
      ],
    },
  ],
  continueReadingTitle: "Pour aller plus loin",
  referencesTitle: "Références",
  references: [
    { label: "Matthew Green, « Does Zoom use end-to-end encryption? »", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
