import type { PasswordManagersGuideCopy } from "./types";

export const passwordManagersGuidePt: PasswordManagersGuideCopy = {
  metaTitle: "Guia de gestores de palavras-passe",
  metaDescription:
    "Crie, armazene e partilhe palavras-passe em segurança. Compare KeePass, Bitwarden, Apple e Google — mais Passwords.lu e PrivateNote para partilha única.",
  heroLabel: "Guia de segurança",
  heroTitle: "Guia de gestores de palavras-passe",
  heroTagline: "Criar, armazenar e partilhar palavras-passe em segurança",
  heroSubtitle:
    "As palavras-passe protegem quase todos os aspetos da vida digital — mas a reutilização e padrões fracos continuam a ser um dos elos mais fracos na cibersegurança. Um gestor de palavras-passe resolve isso.",
  introLead:
    "O problema não são as palavras-passe em si. É a forma como as pessoas as usam. Muitos ainda reutilizam a mesma palavra-passe em dezenas de sites ou fazem apenas pequenas variações:",
  reuseExamples: ["Summer2026!", "Summer2026!Amazon", "Summer2026!Facebook"],
  credentialStuffing:
    "Se um site sofre uma violação, os atacantes testam essas credenciais em todo o lado — uma técnica chamada credential stuffing, responsável por milhões de contas comprometidas todos os anos. Um gestor gera uma palavra-passe diferente para cada conta. Só precisa de lembrar uma palavra-passe mestra forte.",
  essentialTitle: "Por que os gestores de palavras-passe são essenciais",
  essentialIntro: "Um bom gestor melhora drasticamente tanto a segurança como a experiência diária online.",
  essentialBenefits: [
    "Gerar palavras-passe longas e aleatórias instantaneamente",
    "Armazenar cada palavra-passe num cofre encriptado",
    "Preencher automaticamente formulários de início de sessão",
    "Detetar palavras-passe reutilizadas ou fracas",
    "Receber alertas quando credenciais aparecem em violações conhecidas",
    "Sincronizar palavras-passe em todos os seus dispositivos",
    "Armazenar passkeys juntamente com palavras-passe",
    "Partilhar credenciais em segurança quando necessário",
  ],
  howItWorksTitle: "Como funcionam os gestores de palavras-passe",
  howItWorksBody1:
    "As suas credenciais ficam num cofre encriptado. Ao criar o cofre, escolhe uma palavra-passe mestra que deriva as chaves de encriptação que protegem tudo o que contém.",
  cryptoLabel: "A criptografia moderna inclui tipicamente:",
  cryptoPoints: [
    "Encriptação AES-256",
    "Argon2id ou PBKDF2 para derivação de chaves",
    "Encriptação autenticada para detetar adulterações",
  ],
  howItWorksBody2:
    "Como o cofre é encriptado antes do armazenamento ou sincronização, fornecedores de confiança geralmente não conseguem ler as suas palavras-passe.",
  unlockedLabel: "Uma vez desbloqueado, o gestor pode:",
  vaultFeatures: [
    "Preencher automaticamente nomes de utilizador e palavras-passe",
    "Gerar palavras-passe seguras",
    "Guardar credenciais recém-criadas",
    "Sincronizar alterações entre dispositivos",
    "Armazenar notas seguras e passkeys",
  ],
  benefitsTitle: "Benefícios de usar um gestor de palavras-passe",
  benefitBlocks: [
    {
      title: "Cada conta obtém uma palavra-passe única",
      body: "Se a sua palavra-passe da Netflix for roubada, não deve também desbloquear o e-mail, banca, conta GitHub ou armazenamento na nuvem. Os gestores tornam palavras-passe únicas sem esforço.",
    },
    {
      title: "Geração de palavras-passe fortes",
      body: "Os humanos são maus a inventar palavras-passe aleatórias. Os gestores geram cadeias de alta entropia como uQ8!kL#7P2@wXf9$rZm4 — extremamente difíceis de adivinhar ou forçar por brute force.",
    },
    {
      title: "Início de sessão automático",
      body: "Os gestores reconhecem sites e preenchem credenciais automaticamente. Gestores de confiança preenchem tipicamente apenas no domínio correto, o que também ajuda a proteger contra phishing.",
    },
    {
      title: "Relatórios de saúde das palavras-passe",
      body: "Muitos gestores assinalam palavras-passe reutilizadas, fracas, credenciais comprometidas, MFA em falta e sites que suportam passkeys — ajudando a melhorar a segurança ao longo do tempo.",
    },
    {
      title: "Sincronização segura",
      body: "Os gestores modernos sincronizam o cofre encriptado em desktop, portátil, telemóvel e tablet para que as palavras-passe estejam disponíveis onde precisar.",
    },
  ],
  passwordsLuPartnerLabel: "Ferramenta parceira",
  passwordsLuTitle: "Geração no navegador com Passwords.lu",
  passwordsLuBody:
    "Às vezes só precisa de uma palavra-passe forte — não de um fluxo completo de cofre. Passwords.lu executa a geração diretamente no navegador. As palavras-passe não são enviadas para servidores; sem conta necessária.",
  passwordsLuWorkflow:
    "Fluxo recomendado: gerar no Passwords.lu e guardar imediatamente no gestor de palavras-passe.",
  passwordsLuCta: "Abrir gerador de palavras-passe",
  passwordsLuTools: [
    "Gerador de palavras-passe fortes",
    "Gerador de frases de passe",
    "Gerador de PIN seguro",
    "Verificador de força de palavra-passe",
    "Gerador de nomes de utilizador",
    "Geradores de hash (Argon2id, bcrypt, scrypt e mais)",
    "Ferramentas educativas de segurança",
  ],
  recommendedTitle: "Gestores de palavras-passe recomendados",
  recommendedIntro:
    "Pense em três camadas: ferramentas integradas na plataforma para estabilidade, cofres open source locais para controlo, e gestores na nuvem quando precisa de sincronização potente — aceitando o risco adicional do lado do servidor que isso implica.",
  tiers: {
    platform: {
      title: "Gestores integrados na plataforma",
      subtitle: "Engenharia sólida, produtos estáveis — melhor opção predefinida para a maioria",
      intro:
        "A Apple e a Google incluem gestores de palavras-passe com o sistema operativo. São apoiados por grandes equipas de segurança, recebem atualizações contínuas e integram passkeys, preenchimento automático e alertas de violação com configuração mínima. Se vive num ecossistema, é muitas vezes a escolha mais fluida e fiável.",
      strengthsLabel: "Pontos fortes",
      tradeoffsLabel: "Compromissos",
      pros: [
        "UX polida com preenchimento automático ao nível do SO e suporte de passkeys",
        "Mantidos por engenheiros de segurança de plataforma em escala",
        "Sem subscrição separada para funcionalidades principais",
        "Sincronização estável via iCloud ou a sua conta Google",
      ],
      cons: [
        "Ligados à conta Apple ou Google e às escolhas de plataforma",
        "Menos flexíveis se misturar livremente Windows, Linux e telemóvel",
        "O modelo de confiança depende da segurança da sua conta na nuvem",
      ],
      managers: {
        apple: {
          verdict: "Ideal para iPhone, iPad, Mac e Vision Pro",
          description:
            "Integrado nas plataformas Apple com armazenamento seguro, geração, alertas de segurança, passkeys e sincronização iCloud Keychain — sem aplicação extra num agregado familiar totalmente Apple.",
          highlights: [
            "Integração profunda com o SO e suporte de passkeys",
            "Alertas de segurança por violações conhecidas",
            "Excelente UX no ecossistema Apple",
          ],
          learnMore: "Saber mais",
        },
        google: {
          verdict: "Ideal para Android e Chrome",
          description:
            "Integrado no Android e Chrome com geração, preenchimento automático, Password Checkup, alertas de violação, passkeys e sincronização via a sua conta Google.",
          highlights: [
            "Opção predefinida conveniente em dispositivos Android",
            "Password Checkup e alertas de violação",
            "Funciona onde quer que use o Chrome",
          ],
          learnMore: "Saber mais",
        },
      },
    },
    local: {
      title: "Cofres open source locais",
      subtitle: "Controlo máximo — possui o ficheiro encriptado",
      intro:
        "O KeePass armazena o cofre como base de dados encriptada local. Não requer conta na nuvem do fornecedor: decide onde o ficheiro fica e como sincroniza. O compromisso é a UX — as interfaces podem parecer datadas face a gestores de plataforma ou nuvem, e a sincronização multi-dispositivo é DIY salvo adicionar a sua própria camada de armazenamento.",
      strengthsLabel: "Pontos fortes",
      tradeoffsLabel: "Compromissos",
      pros: [
        "Open source e auditável",
        "Sem conta na nuvem ou subscrição obrigatória",
        "Offline-first; o ficheiro do cofre permanece sob o seu controlo",
        "Grande ecossistema de plugins (KeePassXC, ports móveis, etc.)",
      ],
      cons: [
        "Interface e onboarding menos polidos que ferramentas de plataforma",
        "Sincronização entre dispositivos manual salvo configuração",
        "Mais trabalho de configuração para famílias ou agregados com dispositivos mistos",
      ],
      managers: {
        keepass: {
          verdict: "Ideal para puristas da privacidade e autoalojamento",
          description:
            "O modelo open source original: um ficheiro .kdbx encriptado que pode armazenar em disco, USB, NAS ou sincronizar via a sua própria nuvem. KeePassXC é um fork multiplataforma popular com interface mais moderna.",
          highlights: [
            "Completamente gratuito — sem dependência do fornecedor",
            "Escolhe estratégia de armazenamento e sincronização",
            "Ideal quando a nuvem é opcional, não predefinida",
          ],
          learnMore: "Saber mais",
        },
      },
    },
    cloud: {
      title: "Gestores de palavras-passe na nuvem",
      subtitle: "Sincronização e partilha potentes — maior risco do lado do servidor",
      intro:
        "Gestores na nuvem dedicados como o Bitwarden destacam-se em sincronização multiplataforma, partilha familiar e funcionalidades de equipa. Essa conveniência traz um modelo de ameaça diferente: o cofre encriptado (e por vezes metadados) vive em servidores alheios. Uma violação ou má configuração do fornecedor é o principal risco residual — por isso auditorias, open source e uma palavra-passe mestra forte importam mais aqui do que em qualquer outro sítio.",
      strengthsLabel: "Pontos fortes",
      tradeoffsLabel: "Compromissos",
      pros: [
        "Melhor sincronização multi-dispositivo pronta a usar",
        "Funcionalidades de partilha familiar e organizacional",
        "Funciona de forma consistente em Windows, macOS, Linux e telemóvel",
        "Opções open source (Bitwarden) com auditorias de segurança públicas",
      ],
      cons: [
        "Maior superfície de ataque se o fornecedor for comprometido",
        "Cópias de segurança encriptadas do cofre ainda podem ser descifradas offline com palavras-passe mestras fracas",
        "Deve confiar na implementação criptográfica e nas operações do fornecedor",
      ],
      managers: {
        bitwarden: {
          verdict: "Melhor opção na nuvem para utilizadores multiplataforma",
          description:
            "Software open source, sincronização encriptada de ponta a ponta, suporte de passkeys, auditorias independentes e plano gratuito sólido — a recomendação predefinida quando precisa de sincronização na nuvem fora da Apple ou Google.",
          highlights: [
            "Clientes open source auditados",
            "Excelente plano gratuito e planos familiares",
            "Experiência consistente em todas as plataformas principais",
          ],
          learnMore: "Saber mais",
        },
        lastpass: {
          verdict: "Opção legada — prefira Bitwarden para novos utilizadores",
          description:
            "Ajudou a popularizar gestores na nuvem, mas incidentes de alto perfil com cópias de segurança encriptadas roubadas levaram muitos profissionais de segurança ao Bitwarden ou KeePass local para novos deployments.",
          highlights: [
            "Utilizável com palavra-passe mestra forte + MFA se já investido",
            "Considere migrar se começar de raiz",
          ],
          learnMore: "Saber mais",
          caution: "Cuidado",
        },
      },
    },
  },
  comparisonHeaders: {
    priority: "A sua prioridade",
    recommendation: "Recomendação",
  },
  comparisonRows: [
    { priority: "Viver no ecossistema Apple", pick: "Apple Passwords" },
    { priority: "Android e Chrome no dia a dia", pick: "Google Password Manager" },
    { priority: "Máxima privacidade e controlo de ficheiros", pick: "KeePass (cofre local)" },
    { priority: "Sincronização na nuvem multiplataforma", pick: "Bitwarden" },
    { priority: "Utilizador LastPass existente", pick: "Continuar se reforçado; avaliar Bitwarden ou KeePass" },
  ],
  sharingTitle: "Partilhar palavras-passe em segurança",
  sharingBody:
    "Mesmo palavras-passe fortes por vezes precisam de ser partilhadas — com colegas, família, administradores de TI, contratados ou clientes. Demasiadas pessoas ainda as enviam por plataformas de mensagens concebidas para chat, não para entrega de segredos.",
  unsafeChannels: ["E-mail", "Slack", "Microsoft Teams", "WhatsApp", "Discord", "SMS"],
  privateNoteSharingTitle: "Use PrivateNote em vez disso",
  privateNoteSharingBody:
    "O PrivateNote encripta segredos no navegador antes do envio. O servidor armazena apenas texto cifrado; a chave de desencriptação viaja separadamente na ligação. As notas podem autodestruir-se após uma leitura ou expirar conforme calendário.",
  privateNoteSharingItems: [
    "Palavras-passe",
    "Chaves API",
    "Credenciais Wi‑Fi",
    "Códigos de recuperação",
    "Inícios de sessão temporários",
  ],
  privateNoteSharingCta: "Criar nota segura de uso único",
  passwordProtectedTitle: "Proteção extra com notas protegidas por palavra-passe",
  passwordProtectedBody1:
    "Adicione uma palavra-passe opcional a uma PrivateNote. O destinatário precisa da ligação e da palavra-passe separada — idealmente entregues por canais diferentes (envie a ligação por e-mail, partilhe a palavra-passe por telefone ou pessoalmente).",
  passwordProtectedBody2:
    "Mesmo que alguém intercepte a ligação, não pode revelar o segredo sem a palavra-passe.",
  bestPracticesTitle: "Boas práticas",
  bestPractices: [
    "Usar uma palavra-passe mestra longa e única",
    "Ativar autenticação multifator no gestor de palavras-passe",
    "Nunca reutilizar palavras-passe entre sites",
    "Gerar palavras-passe com gestor ou Passwords.lu",
    "Guardar cada palavra-passe no cofre encriptado",
    "Ativar passkeys sempre que disponíveis",
    "Rever regularmente relatórios de saúde das palavras-passe",
    "Partilhar palavras-passe via PrivateNote em vez de e-mail ou chat",
    "Para credenciais muito sensíveis, usar proteção por palavra-passe opcional do PrivateNote e entregar a palavra-passe separadamente",
  ],
  faqTitle: "Perguntas frequentes",
  faq: [
    {
      q: "Os gestores de palavras-passe são seguros?",
      a: "Sim. Gestores de confiança usam encriptação forte e padrão do setor. Para quase todos, usar um gestor é significativamente mais seguro do que memorizar palavras-passe ou reutilizar a mesma em vários sites.",
    },
    {
      q: "O fornecedor do gestor pode ler as minhas palavras-passe?",
      a: "Em gestores modernos como KeePass, Bitwarden, Apple Passwords e Google Password Manager, o cofre é encriptado antes do armazenamento. Com palavra-passe mestra forte, o fornecedor geralmente não consegue ler as credenciais armazenadas.",
    },
    {
      q: "O que acontece se esquecer a palavra-passe mestra?",
      a: "A maioria dos gestores não a consegue recuperar porque nunca a conhecem. É deliberado. Alguns serviços oferecem opções de recuperação ou acesso de emergência se configurados antecipadamente.",
    },
    {
      q: "Devo usar o armazenamento de palavras-passe do navegador?",
      a: "Gestores integrados Apple e Google são escolhas sólidas e estáveis nos seus ecossistemas — apoiados por grandes equipas de segurança. KeePass adequa-se para controlo máximo. Bitwarden quando precisa de sincronização na nuvem em plataformas mistas, aceitando maior risco do lado do servidor.",
    },
  ],
  finalTitle: "Recomendação final",
  finalBody:
    "Nenhum gestor é perfeito para todos — mas usar um é um dos passos mais eficazes. Combine com Passwords.lu para geração rápida e PrivateNote quando precisar de partilhar segredos em segurança.",
  finalBullets: [
    { label: "Apple & Google", text: "opções estáveis de plataforma" },
    { label: "KeePass", text: "controlo local, open source" },
    { label: "Bitwarden", text: "sincronização na nuvem para cada dispositivo" },
    { label: "Passwords.lu", text: "geração rápida no navegador" },
  ],
  finalCtaPrivateNote: "Partilhar um segredo com PrivateNote",
  finalCtaPasswordsLu: "Visitar passwords.lu",
  exploreOther: "Explorar outros guias",
  allResources: "Todos os recursos",
  affiliateDisclaimer:
    "Apenas guia educativo. Podemos ganhar comissão por ligações de afiliado ao usar os serviços recomendados, o que ajuda a manter este recurso gratuito de privacidade.",
  otherGuides: [
    { id: "vpn", title: "Guia de serviços VPN" },
    { id: "messenger", title: "Mensagens seguras" },
    { id: "email", title: "E-mail seguro" },
    { id: "browser", title: "Navegadores de privacidade" },
  ],
};
