import type { VpnGuideCopy } from "./types";

export const vpnGuideEs: VpnGuideCopy = {
  metaTitle: "Guía de servicios VPN",
  metaDescription:
    "Elija un VPN fiable: compare Proton VPN, Mullvad y NymVPN — qué protegen, sus límites y cómo encajan con el intercambio seguro de secretos.",
  heroLabel: "Guía de seguridad",
  heroTitle: "Guía de servicios VPN",
  heroSubtitle:
    "Una guía práctica para elegir un VPN de confianza — qué protege, qué no soluciona y por qué Proton VPN, Mullvad y NymVPN destacan para usuarios preocupados por la privacidad.",
  whatItDoesTitle: "Qué hace realmente un VPN",
  whatItDoesBody:
    "Una red privada virtual crea un túnel cifrado entre su dispositivo y un servidor VPN. El tráfico saliente se cifra y los sitios web ven la dirección IP del servidor VPN en lugar de la suya — reduciendo lo que su ISP, el operador del Wi‑Fi del café o alguien en la misma red puede observar.",
  benefits: [
    "Cifra el tráfico entre su dispositivo y el servidor VPN",
    "Oculta su IP real a los sitios y servicios que visita",
    "Protege contra la escucha pasiva en Wi‑Fi no confiable",
    "Reduce el seguimiento de metadatos DNS y de destino a nivel del ISP",
  ],
  withoutVpnLabel: "Sin VPN",
  withoutVpnBody:
    "Su dispositivo se comunica directamente con el sitio web. El operador del Wi‑Fi y el ISP pueden ver metadatos de conexión — y en redes hostiles, el tráfico puede ser interceptado.",
  withoutVpnItems: [
    "IP real visible para los sitios",
    "El ISP ve destinos y DNS",
    "Exposición en Wi‑Fi público",
  ],
  withVpnLabel: "Con VPN",
  withVpnBody:
    "El tráfico se envuelve primero en cifrado hacia el servidor VPN. Los observadores en la red local ven paquetes cifrados — no qué sitios visita.",
  withVpnItems: [
    "Los sitios ven la IP de salida del VPN",
    "Túnel cifrado al servidor",
    "Más seguro en redes no confiables",
  ],
  limitationsTitle: "Qué no hace un VPN",
  limitationsIntro: "Los VPN son útiles, pero no una capa de invisibilidad mágica — especialmente al compartir secretos.",
  limitations: [
    "No le hace anónimo si permanece conectado a Google, Facebook o cuentas de trabajo",
    "No detiene el phishing, el malware ni las contraseñas débiles",
    "No cifra el contenido del chat a menos que la app ya use cifrado de extremo a extremo",
    "No sustituye el intercambio seguro de contraseñas, claves API o códigos de recuperación",
  ],
  limitationsCallout:
    "Para secretos de un solo uso — contraseñas, frases semilla, claves API — use intercambio cifrado de extremo a extremo como PrivateNote. Un VPN protege la tubería; no protege lo que pega en correo, Slack o SMS.",
  whenToUseTitle: "Cuándo usar un VPN",
  whenToUseIntro:
    "No necesita uno las 24 horas a menos que su modelo de amenazas lo exija — pero estas son las situaciones en las que un VPN de confianza merece la pena.",
  useCases: [
    { label: "Wi‑Fi público", detail: "Aeropuertos, hoteles, cafés" },
    { label: "Viajes", detail: "Redes extranjeras y roaming" },
    { label: "Metadatos del ISP", detail: "Menos registro en red doméstica" },
    { label: "Trabajo sensible", detail: "Investigación y periodismo" },
  ],
  trustTitle: "Cómo identificar un VPN de confianza",
  trustSignals: [
    "Política de no registros auditada de forma independiente",
    "Propiedad y jurisdicción transparentes",
    "WireGuard u OpenVPN con cifrado robusto",
    "Clientes de código abierto o compilaciones reproducibles",
    "Divulgaciones honestas sobre metadatos y facturación",
    "Sin marketing de «100 % anónimo»",
  ],
  providersTitle: "Proveedores recomendados",
  providersIntro:
    "Tres VPN centrados en la privacidad de equipos de confianza — elija según la ley suiza, registro anónimo o enrutamiento mixnet.",
  providers: {
    proton: {
      tagline: "Ley suiza de privacidad · no-logs auditado · ecosistema Proton",
      description:
        "Creado por Proton AG — el equipo detrás de Proton Mail. Apps de código abierto, auditorías independientes, enrutamiento Secure Core y Tor-over-VPN opcional.",
      highlights: ["Jurisdicción suiza", "No-logs auditado", "Plan gratuito disponible", "Clientes de código abierto"],
      visitLabel: "Visitar Proton VPN",
    },
    mullvad: {
      tagline: "Sin correo · solo número de cuenta · efectivo y cripto",
      description:
        "VPN sueco con números de cuenta anónimos, precio fijo y opciones de pago que separan su identidad de la suscripción.",
      highlights: ["Registro sin correo", "WireGuard + OpenVPN", "Acepta efectivo y cripto", "Infraestructura auditada"],
      visitLabel: "Visitar Mullvad",
    },
    nym: {
      tagline: "Enrutamiento mixnet · más allá del túnel estándar",
      description:
        "Añade tecnología mixnet al cifrado VPN — fragmentando y reordenando paquetes para resistir el análisis de tráfico, no solo ocultar su IP.",
      highlights: [
        "Modos WireGuard + mixnet",
        "Enrutamiento descentralizado",
        "Resistente al análisis de tráfico",
        "Equipo respaldado por investigación",
      ],
      visitLabel: "Visitar NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Ideal para",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Jurisdicción de privacidad",
      proton: "Suiza",
      mullvad: "Suecia",
      nym: "Mixnet descentralizado",
    },
    signup: {
      label: "Registro",
      proton: "Cuenta con correo",
      mullvad: "N.º de cuenta aleatorio",
      nym: "Cuenta estándar",
    },
    standout: {
      label: "Característica destacada",
      proton: "Secure Core + Tor",
      mullvad: "Pago en efectivo/cripto",
      nym: "Enrutamiento mixnet",
    },
    idealUser: {
      label: "Usuario ideal",
      proton: "Fans del ecosistema Proton",
      mullvad: "Máxima anonimidad al registrarse",
      nym: "Resistencia al análisis de tráfico",
    },
  },
  ctaTitle: "VPN + PrivateNote: trabajos distintos",
  ctaBody:
    "Un VPN protege su conexión. PrivateNote protege el secreto en sí — cifrado en su navegador antes de subirlo, autodestrucción tras una sola lectura.",
  ctaButton: "Crear una nota segura de un solo uso",
  exploreOther: "Explorar otras guías",
  allResources: "Todos los recursos",
  affiliateDisclaimer:
    "Guía solo con fines educativos. Podemos recibir una comisión por enlaces de afiliado al usar los servicios recomendados, lo que ayuda a mantener este recurso gratuito de privacidad.",
  otherGuides: [
    { id: "password", title: "Gestores de contraseñas" },
    { id: "messenger", title: "Mensajería segura" },
    { id: "email", title: "Correo seguro" },
    { id: "browser", title: "Navegadores privados" },
  ],
};
