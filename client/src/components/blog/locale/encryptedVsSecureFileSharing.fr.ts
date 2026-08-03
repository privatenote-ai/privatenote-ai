import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingFr: EncryptedFileSharingArticleCopy = {
  intro: [
    "Lorsque les gens recherchent « partage de fichiers sécurisé », ils supposent souvent que tout service avec HTTPS ou chiffrement TLS protège leurs fichiers de la même manière. Malheureusement, ce n'est pas le cas.",
    "Deux services peuvent tous deux annoncer un « transfert de fichiers chiffré » avec des garanties de confidentialité très différentes. La différence réside entièrement dans **l'endroit où le chiffrement a lieu**. Comprendre cette distinction explique pourquoi certains services peuvent inspecter, indexer et traiter vos fichiers, tandis que d'autres ne le peuvent tout simplement pas.",
  ],
  sections: [
    {
      title: "Les deux types de chiffrement",
      level: "primary",
      paragraphs: ["Il existe deux principales façons dont les services modernes de partage de fichiers protègent vos données."],
    },
    {
      title: "1. Chiffrement de transport (TLS)",
      level: "secondary",
      paragraphs: [
        "C'est le chiffrement standard utilisé par presque tous les sites web sur Internet aujourd'hui. Lorsque vous envoyez un fichier, votre navigateur établit une connexion sécurisée Transport Layer Security (TLS) avec le serveur hôte. La connexion est chiffrée pendant que votre fichier traverse le réseau, vous protégeant des attaquants sur le Wi‑Fi public, des routeurs compromis ou de quiconque écoute le trafic réseau.",
      ],
      flow: "tls",
      bullets: [
        "TLS est essentiel, et tout service digne de confiance doit l'utiliser.",
        "Une fois l'envoi arrivé sur le serveur, le fournisseur reçoit le fichier original lisible.",
        "À partir de ce moment, selon ses politiques, le service peut stocker le fichier, générer des aperçus, indexer le contenu, analyser les logiciels malveillants ou utiliser les métadonnées pour l'analytique.",
        "De nombreux fournisseurs chiffrent également les fichiers « au repos ». Cela protège contre le vol physique de disques — mais le service possède toujours les clés et peut lire vos fichiers.",
      ],
      callout:
        "**La vulnérabilité centrale du stockage cloud traditionnel :** le serveur ne peut chiffrer que ce qu'il a déjà pu lire.",
    },
    {
      title: "2. Chiffrement dans le navigateur",
      level: "secondary",
      paragraphs: [
        "Une approche fondamentalement différente consiste à chiffrer le fichier **avant** qu'il ne quitte votre appareil. Au lieu d'envoyer le fichier original, votre navigateur utilise des API cryptographiques locales pour le chiffrer. Le serveur ne reçoit que du texte chiffré — des données qui semblent aléatoires et sont inutiles sans la clé de déchiffrement.",
      ],
      flow: "browser",
      bullets: [
        "Le chiffrement dans le navigateur ne remplace pas TLS — il le complète.",
        "TLS protège toujours la connexion contre les écoutes au niveau du réseau.",
        "Les serveurs du fournisseur ne reçoivent que du texte chiffré illisible, car ils ne reçoivent jamais le contenu lisible ni la clé de déchiffrement.",
      ],
    },
    {
      title: "Pourquoi cette différence compte",
      level: "primary",
      paragraphs: [
        "Supposons que vous partagiez des données très sensibles : contrats juridiques, feuilles de calcul financières, code source propriétaire, dossiers médicaux ou documents professionnels confidentiels.",
        "Avec uniquement le chiffrement de transport, votre confidentialité est **contractuelle**. Vous devez faire confiance à l'implémentation du fournisseur, aux contrôles d'accès des employés et aux politiques commerciales actuelles et futures.",
        "Avec le chiffrement dans le navigateur, votre confidentialité est **architecturale**. Le fournisseur ne stocke que du texte chiffré. Même en cas de piratage, d'ordonnance judiciaire ou de changement de modèle économique, il ne peut pas remettre du contenu lisible qu'il n'a jamais possédé.",
      ],
      callout:
        "Avec uniquement le chiffrement de transport, votre confidentialité est **contractuelle**. Avec le chiffrement dans le navigateur, votre confidentialité est **architecturale**.",
    },
    {
      title: "Un rappel récent : le facteur de confiance",
      level: "primary",
      paragraphs: [
        "En 2025, WeTransfer a mis à jour ses Conditions d'utilisation avec un libellé qui semblait accorder de larges droits sur le contenu envoyé, y compris pour améliorer les systèmes d'apprentissage automatique utilisés dans la modération de contenu.",
        "La modification a provoqué des réactions immédiates d'artistes, de journalistes et de professionnels créatifs craignant que leur propriété intellectuelle soit utilisée pour entraîner des systèmes d'IA. WeTransfer a rapidement clarifié que le contenu client n'était pas utilisé pour l'entraînement de l'IA et a supprimé le libellé confus — mais l'incident a souligné une leçon cruciale :",
        "Si un fournisseur reçoit vos fichiers sous forme lisible, vous dépendez entièrement de ses promesses. Lorsqu'un fournisseur ne stocke que du texte chiffré, la confiance que vous devez lui accorder est structurellement minimisée. L'architecture impose la confidentialité.",
      ],
    },
    {
      title: "Comment PrivateNote gère le partage de fichiers",
      level: "primary",
      paragraphs: [
        "Le chiffrement moderne basé sur le navigateur combine plusieurs briques cryptographiques bien établies pour garder les données en sécurité sans s'appuyer sur la confiance envers le serveur.",
      ],
    },
    {
      title: "Génération et isolation des clés",
      level: "secondary",
      paragraphs: [
        "Lorsqu'un utilisateur souhaite partager un fichier, PrivateNote génère dans le navigateur une clé symétrique cryptographiquement sécurisée et aléatoire à l'aide de l'API Web Crypto.",
        "Cette clé n'est jamais envoyée à notre infrastructure. Elle est plutôt ajoutée au lien de partage comme fragment d'URL (la partie après le `#`) :",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Les navigateurs n'envoient pas le fragment d'URL au serveur web dans une requête HTTP, par conception. Ce comportement est spécifié dans la norme URL et fonctionne ainsi depuis des décennies. La clé de déchiffrement reste dans le navigateur du destinataire.",
      ],
    },
    {
      title: "Chiffrement en flux authentifié",
      level: "secondary",
      paragraphs: [
        "Au lieu d'envoyer des données brutes, le navigateur chiffre le fichier avant qu'il n'atteigne le réseau. Comme PrivateNote prend en charge les pièces jointes volumineuses, il utilise le **chiffrement en flux par blocs** : les fichiers sont chiffrés bloc par bloc (généralement par morceaux de plusieurs mégaoctets), afin que les envois volumineux n'aient pas besoin de charger l'intégralité du fichier en mémoire.",
        "Les comptes gratuits peuvent joindre des fichiers jusqu'à 25 Mo ; les comptes Premium prennent en charge des envois beaucoup plus volumineux (jusqu'à 1 Go par fichier). Dans tous les cas, seul du texte chiffré atteint nos serveurs.",
        "L'implémentation s'appuie sur **AES-GCM** (Authenticated Encryption with Associated Data), qui fournit à la fois la confidentialité et l'intégrité :",
      ],
      bullets: [
        "**Confidentialité** — la charge utile est illisible sans la clé.",
        "**Intégrité** — la manipulation du texte chiffré au repos est détectée et rejetée lors du déchiffrement côté client.",
        "Lorsque la protection par mot de passe est activée, une clé dérivée du mot de passe est générée à l'aide d'algorithmes à mémoire coûteuse comme **Argon2id**, rendant la force brute par essais impraticable.",
      ],
    },
    {
      title: "Quelles métadonnées subsistent",
      level: "primary",
      paragraphs: [
        "Une architecture de sécurité rigoureuse doit reconnaître ses limites. Le chiffrement dans le navigateur protège le **contenu** de vos fichiers, mais certaines métadonnées restent visibles pour le réseau et le service :",
      ],
      bullets: [
        "Horodatages d'envoi et de téléchargement.",
        "La taille approximative de la charge utile chiffrée.",
        "Date d'expiration, limites de consultation et fenêtres d'accès aux fichiers.",
        "L'adresse IP du destinataire lors du téléchargement (visible pour le serveur web qui achemine la requête).",
      ],
      callout:
        "Les systèmes axés sur la confidentialité minimisent les métadonnées lorsque c'est pratique, mais aucun service basé sur le web ne peut les éliminer entièrement. PrivateNote traite les métadonnées avec la même discipline de conservation que les charges utiles chiffrées — supprimées lorsqu'une note expire ou est effacée.",
    },
    {
      title: "Les compromis d'une véritable confidentialité",
      level: "primary",
      paragraphs: ["Le chiffrement dans le navigateur offre une confidentialité maximale du contenu, mais avec des compromis conscients :"],
      bullets: [
        "**Pas d'analyse antivirus côté serveur** — car le serveur ne peut pas lire le fichier, il ne peut pas l'analyser pour détecter les virus. Faites confiance à l'expéditeur.",
        "**Pas d'aperçus générés côté serveur** — les miniatures et aperçus de documents sont rendus localement dans le navigateur du destinataire après déchiffrement, pas sur le serveur.",
        "**Pas de récupération de mot de passe ou de clé** — si vous perdez le lien ou la clé de chiffrement, le fournisseur ne peut pas restaurer le fichier. Il n'y a pas de « Mot de passe oublié » pour des données auxquelles l'hébergeur n'a pas accès.",
      ],
    },
    {
      title: "Choisir le bon service",
      level: "primary",
      paragraphs: [
        "Tous les transferts de fichiers ne nécessitent pas un chiffrement strict dans le navigateur. Des photos de vacances informelles avec la famille peuvent très bien convenir avec uniquement le chiffrement de transport.",
        "Si vous partagez de la propriété intellectuelle, des accords juridiques ou des données personnelles sensibles, posez une question architecturale :",
        "**Le service reçoit-il mon fichier original, ou seulement une version chiffrée ?**",
        "Cette seule distinction détermine qui a techniquement accès à vos données — pas seulement aujourd'hui, mais à mesure que les politiques commerciales, la propriété et les lois sur la confidentialité évoluent au fil du temps.",
      ],
    },
  ],
  closingTitle: "Partagez des fichiers sans donner de contenu lisible au serveur",
  closingBody:
    "Le transfert sécurisé de fichiers de PrivateNote utilise le même modèle de chiffrement basé sur le navigateur que nos notes éphémères : chiffrer localement, envoyer le texte chiffré, partager la clé dans le fragment d'URL et faire expirer l'accès selon vos conditions.",
  ctaLabel: "Essayer le transfert sécurisé de fichiers",
  relatedReading: "Pour aller plus loin",
};
