import type { VpnGuideCopy } from "./types";

export const vpnGuidePt: VpnGuideCopy = {
  metaTitle: "Guia de serviços VPN",
  metaDescription:
    "Escolha uma VPN confiável: compare Proton VPN, Mullvad e NymVPN — o que protegem, limites e partilha segura de segredos.",
  heroLabel: "Guia de segurança",
  heroTitle: "Guia de serviços VPN",
  heroSubtitle:
    "Um guia prático para escolher uma VPN de confiança — o que protege, o que não resolve e por que Proton VPN, Mullvad e NymVPN se destacam para utilizadores preocupados com a privacidade.",
  whatItDoesTitle: "O que uma VPN realmente faz",
  whatItDoesBody:
    "Uma rede privada virtual cria um túnel encriptado entre o seu dispositivo e um servidor VPN. O tráfego de saída é encriptado e os sites veem o endereço IP do servidor VPN em vez do seu — reduzindo o que o seu ISP, o operador do Wi‑Fi do café ou alguém na mesma rede pode observar.",
  benefits: [
    "Encripta o tráfego entre o dispositivo e o servidor VPN",
    "Oculta o seu IP real dos sites e serviços que visita",
    "Protege contra escuta passiva em Wi‑Fi não confiável",
    "Reduz o rastreio de metadados DNS e de destino ao nível do ISP",
  ],
  withoutVpnLabel: "Sem VPN",
  withoutVpnBody:
    "O dispositivo comunica diretamente com o site. O operador do Wi‑Fi e o ISP podem ver metadados de ligação — e em redes hostis, o tráfego pode ser interceptado.",
  withoutVpnItems: [
    "IP real visível para os sites",
    "O ISP vê destinos e DNS",
    "Exposição em Wi‑Fi público",
  ],
  withVpnLabel: "Com VPN",
  withVpnBody:
    "O tráfego é primeiro envolvido em encriptação até ao servidor VPN. Observadores na rede local veem pacotes encriptados — não quais sites visita.",
  withVpnItems: [
    "Os sites veem o IP de saída da VPN",
    "Túnel encriptado ao servidor",
    "Mais seguro em redes não confiáveis",
  ],
  limitationsTitle: "O que uma VPN não faz",
  limitationsIntro: "As VPNs são úteis, mas não um manto de invisibilidade mágico — especialmente ao partilhar segredos.",
  limitations: [
    "Não o torna anónimo se permanecer ligado ao Google, Facebook ou contas de trabalho",
    "Não impede phishing, malware ou palavras-passe fracas",
    "Não encripta o conteúdo do chat a menos que a app já use encriptação ponta a ponta",
    "Não substitui a partilha segura de palavras-passe, chaves API ou códigos de recuperação",
  ],
  limitationsCallout:
    "Para segredos de uso único — palavras-passe, frases seed, chaves API — use partilha encriptada ponta a ponta como PrivateNote. Uma VPN protege o canal; não protege o que cola em e-mail, Slack ou SMS.",
  whenToUseTitle: "Quando usar uma VPN",
  whenToUseIntro:
    "Não precisa de uma 24 horas por dia, a menos que o seu modelo de ameaças o exija — mas estas são as situações em que uma VPN de confiança vale a pena.",
  useCases: [
    { label: "Wi‑Fi público", detail: "Aeroportos, hotéis, cafés" },
    { label: "Viagens", detail: "Redes estrangeiras e roaming" },
    { label: "Metadados do ISP", detail: "Menos registo na rede doméstica" },
    { label: "Trabalho sensível", detail: "Investigação e jornalismo" },
  ],
  trustTitle: "Como identificar uma VPN de confiança",
  trustSignals: [
    "Política de não registos auditada de forma independente",
    "Propriedade e jurisdição transparentes",
    "WireGuard ou OpenVPN com encriptação forte",
    "Clientes de código aberto ou builds reproduzíveis",
    "Divulgações honestas sobre metadados e faturação",
    "Sem marketing de «100% anónimo»",
  ],
  providersTitle: "Fornecedores recomendados",
  providersIntro:
    "Três VPNs focadas na privacidade de equipas de confiança — escolha com base na lei suíça, registo anónimo ou encaminhamento mixnet.",
  providers: {
    proton: {
      tagline: "Lei suíça de privacidade · não registos auditado · ecossistema Proton",
      description:
        "Criado pela Proton AG — a equipa por trás do Proton Mail. Apps de código aberto, auditorias independentes, encaminhamento Secure Core e Tor-over-VPN opcional.",
      highlights: ["Jurisdição suíça", "Não registos auditado", "Plano gratuito disponível", "Clientes de código aberto"],
      visitLabel: "Visitar Proton VPN",
    },
    mullvad: {
      tagline: "Sem e-mail · apenas número de conta · dinheiro e cripto",
      description:
        "VPN sueca com números de conta anónimos, preço fixo e opções de pagamento que separam a sua identidade da subscrição.",
      highlights: ["Registo sem e-mail", "WireGuard + OpenVPN", "Aceita dinheiro e cripto", "Infraestrutura auditada"],
      visitLabel: "Visitar Mullvad",
    },
    nym: {
      tagline: "Encaminhamento mixnet · além do túnel padrão",
      description:
        "Adiciona tecnologia mixnet à encriptação VPN — fragmentando e reordenando pacotes para resistir à análise de tráfego, não apenas ocultar o IP.",
      highlights: [
        "Modos WireGuard + mixnet",
        "Encaminhamento descentralizado",
        "Resistente à análise de tráfego",
        "Equipa com base em investigação",
      ],
      visitLabel: "Visitar NymVPN",
    },
  },
  comparisonHeaders: {
    bestFor: "Melhor para",
    proton: "Proton VPN",
    mullvad: "Mullvad",
    nym: "NymVPN",
  },
  comparisonRows: {
    privacyJurisdiction: {
      label: "Jurisdição de privacidade",
      proton: "Suíça",
      mullvad: "Suécia",
      nym: "Mixnet descentralizado",
    },
    signup: {
      label: "Registo",
      proton: "Conta com e-mail",
      mullvad: "N.º de conta aleatório",
      nym: "Conta padrão",
    },
    standout: {
      label: "Característica de destaque",
      proton: "Secure Core + Tor",
      mullvad: "Pagamento em dinheiro/cripto",
      nym: "Encaminhamento mixnet",
    },
    idealUser: {
      label: "Utilizador ideal",
      proton: "Fãs do ecossistema Proton",
      mullvad: "Máxima anonimidade no registo",
      nym: "Resistência à análise de tráfego",
    },
  },
  ctaTitle: "VPN + PrivateNote: funções diferentes",
  ctaBody:
    "Uma VPN protege a sua ligação. PrivateNote protege o segredo em si — encriptado no navegador antes do envio, autodestrutivo após uma única leitura.",
  ctaButton: "Criar uma nota segura de uso único",
  exploreOther: "Explorar outros guias",
  allResources: "Todos os recursos",
  affiliateDisclaimer:
    "Guia apenas educativo. Podemos receber comissão através de links de afiliado ao usar os serviços recomendados, o que ajuda a manter este recurso gratuito de privacidade.",
  otherGuides: [
    { id: "password", title: "Gestores de palavras-passe" },
    { id: "messenger", title: "Mensagens seguras" },
    { id: "email", title: "E-mail seguro" },
    { id: "browser", title: "Navegadores de privacidade" },
  ],
};
