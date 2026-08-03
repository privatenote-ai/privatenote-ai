import type { VpnGuideCopy } from "./types";

export const vpnGuideFr: VpnGuideCopy = {
  metaTitle: "Guide des services VPN",
  metaDescription:
    "Choisissez un VPN fiable : comparez Proton VPN, Mullvad et NymVPN — ce qu'ils protègent, leurs limites et le partage sécurisé de secrets.",
  heroLabel: "Guide de sécurité",
  heroTitle: "Guide des services VPN",
  heroSubtitle:
    "Un guide pratique pour choisir un VPN réputé — ce qu'il protège, ce qu'il ne corrige pas, et pourquoi Proton VPN, Mullvad et NymVPN se distinguent pour les utilisateurs soucieux de leur vie privée.",
  whatItDoesTitle: "Ce que fait réellement un VPN",
  whatItDoesBody:
    "Un réseau privé virtuel crée un tunnel chiffré entre votre appareil et un serveur VPN. Le trafic sortant est chiffré, et les sites web voient l'adresse IP du serveur VPN plutôt que la vôtre — réduisant ce que votre FAI, l'exploitant du Wi‑Fi du café ou quelqu'un sur le même réseau peut observer.",
  benefits: [
    "Chiffre le trafic entre votre appareil et le serveur VPN",
    "Masque votre IP réelle aux sites et services que vous visitez",
    "Protège contre l'écoute passive sur un Wi‑Fi non fiable",
    "Réduit le suivi des métadonnées DNS et de destination au niveau du FAI",
  ],
  withoutVpnLabel: "Sans VPN",
  withoutVpnBody:
    "Votre appareil communique directement avec le site. L'exploitant du Wi‑Fi et le FAI peuvent voir les métadonnées de connexion — et sur des réseaux hostiles, le trafic peut être intercepté.",
  withoutVpnItems: [
    "IP réelle visible par les sites",
    "Le FAI voit destinations & DNS",
    "Exposition sur Wi‑Fi public",
  ],
  withVpnLabel: "Avec VPN",
  withVpnBody:
    "Le trafic est d'abord encapsulé dans un chiffrement vers le serveur VPN. Les observateurs sur le réseau local voient des paquets chiffrés — pas les sites que vous visitez.",
  withVpnItems: [
    "Les sites voient l'IP de sortie VPN",
    "Tunnel chiffré vers le serveur",
    "Plus sûr sur réseaux non fiables",
  ],
  limitationsTitle: "Ce qu'un VPN ne fait pas",
  limitationsIntro: "Les VPN sont utiles, mais pas une cape d'invisibilité magique — surtout pour partager des secrets.",
  limitations: [
    "Ne vous rend pas anonyme si vous restez connecté à Google, Facebook ou vos comptes professionnels",
    "N'arrête pas le phishing, les logiciels malveillants ni les mots de passe faibles",
    "Ne chiffre pas le contenu des chats sauf si l'application utilise déjà le chiffrement de bout en bout",
    "Ne remplace pas le partage sécurisé de mots de passe, clés API ou codes de récupération",
  ],
  limitationsCallout:
    "Pour les secrets à usage unique — mots de passe, phrases de récupération, clés API — utilisez un partage chiffré de bout en bout comme PrivateNote. Un VPN protège le canal ; il ne protège pas ce que vous collez dans un e-mail, Slack ou SMS.",
  whenToUseTitle: "Quand utiliser un VPN",
  whenToUseIntro:
    "Vous n'en avez pas besoin 24 h/24 sauf si votre modèle de menace l'exige — mais voici les situations où un VPN réputé se justifie.",
  useCases: [
    { label: "Wi‑Fi public", detail: "Aéroports, hôtels, cafés" },
    { label: "Voyage", detail: "Réseaux étrangers & itinérance" },
    { label: "Métadonnées FAI", detail: "Moins de journalisation à domicile" },
    { label: "Travail sensible", detail: "Recherche & journalisme" },
  ],
  trustTitle: "Comment repérer un VPN réputé",
  trustSignals: [
    "Politique no-logs auditée indépendamment",
    "Propriété et juridiction transparentes",
    "WireGuard ou OpenVPN avec chiffrement robuste",
    "Clients open source ou builds reproductibles",
    "Divulgations honnêtes sur métadonnées et facturation",
    "Pas de marketing « 100 % anonyme »",
  ],
  providersTitle: "Fournisseurs recommandés",
  providersIntro:
    "Trois VPN axés sur la confidentialité, portés par des équipes réputées — choisissez selon le droit suisse, l'inscription anonyme ou le routage mixnet.",
  providers: {
    proton: {
      tagline: "Droit suisse sur la vie privée · no-logs audité · écosystème Proton",
      description:
        "Conçu par Proton AG — l'équipe derrière Proton Mail. Applications open source, audits indépendants, routage Secure Core et Tor-over-VPN en option.",
      highlights: ["Juridiction suisse", "No-logs audité", "Offre gratuite disponible", "Clients open source"],
      visitLabel: "Visiter Proton VPN",
    },
    mullvad: {
      tagline: "Pas d'e-mail · numéro de compte uniquement · espèces & crypto",
      description:
        "VPN suédois avec numéros de compte anonymes, tarif fixe et options de paiement qui séparent votre identité de votre abonnement.",
      highlights: ["Inscription sans e-mail", "WireGuard + OpenVPN", "Espèces & crypto acceptées", "Infrastructure auditée"],
      visitLabel: "Visiter Mullvad",
    },
    nym: {
      tagline: "Routage mixnet · au-delà du tunneling standard",
      description:
        "Ajoute la technologie mixnet au chiffrement VPN — fragmentant et réordonnant les paquets pour résister à l'analyse du trafic, pas seulement masquer votre IP.",
      highlights: [
        "Modes WireGuard + mixnet",
        "Routage décentralisé",
        "Résistant à l'analyse du trafic",
        "Équipe fondée sur la recherche",
      ],
      visitLabel: "Visiter NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Idéal pour",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Juridiction confidentialité",
      proton: "Suisse",
      mullvad: "Suède",
      nym: "Mixnet décentralisé",
    },
    signup: {
      label: "Inscription",
      proton: "Compte e-mail",
      mullvad: "N° de compte aléatoire",
      nym: "Compte standard",
    },
    standout: {
      label: "Atout distinctif",
      proton: "Secure Core + Tor",
      mullvad: "Paiement espèces/crypto",
      nym: "Routage mixnet",
    },
    idealUser: {
      label: "Utilisateur idéal",
      proton: "Fans de l'écosystème Proton",
      mullvad: "Anonymat maximal à l'inscription",
      nym: "Résistance à l'analyse du trafic",
    },
  },
  ctaTitle: "VPN + PrivateNote : rôles différents",
  ctaBody:
    "Un VPN protège votre connexion. PrivateNote protège le secret lui-même — chiffré dans votre navigateur avant l'envoi, autodétruit après une seule lecture.",
  ctaButton: "Créer une note sécurisée à usage unique",
  exploreOther: "Explorer d'autres guides",
  allResources: "Toutes les ressources",
  affiliateDisclaimer:
    "Guide à titre éducatif uniquement. Nous pouvons percevoir une commission via des liens d'affiliation vers les services recommandés, ce qui soutient cette ressource gratuite sur la vie privée.",
  otherGuides: [
    { id: "password", title: "Gestionnaires de mots de passe" },
    { id: "messenger", title: "Messagerie sécurisée" },
    { id: "email", title: "E-mail sécurisé" },
    { id: "browser", title: "Navigateurs respectueux de la vie privée" },
  ],
};
