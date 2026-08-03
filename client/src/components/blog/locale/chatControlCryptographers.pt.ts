import type { ChatControlCryptographersArticleCopy } from "./chatControlCryptographers.types";

export const chatControlCryptographersPt: ChatControlCryptographersArticleCopy = {
  heroAlt:
    "Gráfico editorial “Chat Control is back” com balão de chat bloqueado e mapa da Europa",
  heroCaption: "Ilustração gerada para PrivateNote.ai.",
  intro:
    "Hoje, terça-feira, 7 de julho, o Parlamento Europeu deve revisitar novamente o regulamento proposto sobre abuso sexual infantil (CSAR) — comumente chamado pelos críticos de Chat Control. O objetivo por trás da proposta não é controverso: crianças precisam ser protegidas de abusos terríveis. A questão técnica é se a varredura obrigatória de comunicações privadas pode fazer isso sem quebrar as garantias de segurança das quais todos os outros dependem.",
  updatePrefix:
    "**Atualização (9 de julho de 2026):** O Parlamento prorrogou o Chat Control 1.0, embora mais deputados tenham votado contra do que a favor.",
  updateLink: "Leia o que aconteceu e por quê",
  updateSuffix: ".",
  calloutTitle: "Este não é um debate sobre se o abuso infantil deve ser combatido.",
  calloutBody:
    "As vítimas merecem proteção. A aplicação da lei merece ferramentas eficazes. As plataformas devem denunciar rapidamente material ilegal conhecido e cooperar em investigações. A discordância é se a varredura em massa das mensagens privadas de todos é um caminho tecnicamente sólido para chegar lá.",
  expertEyebrow: "Alerta de especialistas",
  expertTitle: "Bart Preneel: a comunidade de segurança está incomumente alinhada",
  expertParagraphs: [
    "Bart Preneel, professor titular na KU Leuven e um dos especialistas europeus mais conhecidos em criptografia, privacidade e direitos digitais, alertou hoje que o Chat Control está retornando para uma terceira votação após duas votações anteriores não terem resolvido a questão. Em sua publicação no LinkedIn, ele descreveu a proposta como varredura indiscriminada de comunicações não criptografadas, agora estendida ao uso de IA para encontrar novo CSAM.",
    "Preneel também apontou o consenso incomumente amplo de especialistas por trás da crítica: mais de 800 especialistas em cibersegurança e privacidade alertaram que a varredura em massa e a análise de conteúdo baseada em IA ainda têm taxas de erro inaceitáveis, levantam sérias preocupações de proporcionalidade e são menos eficazes do que abordagens direcionadas. Como ele colocou, a comunidade de segurança raramente atinge esse nível de concordância sobre qualquer tema.",
    "Sua recomendação prática é direta: entre em contato com membros do Parlamento Europeu e explique por que a varredura indiscriminada não é um caminho sólido para abordar o grave problema da distribuição de CSAM.",
    "Para o contexto técnico, ele direciona os leitores a duas cartas de cientistas: a carta aberta de setembro de 2025, que explica as preocupações centrais com varredura no lado do cliente e detecção baseada em IA, e o acompanhamento de novembro de 2025, que argumenta que o aumento proposto de escopo amplifica os mesmos riscos que a comunidade de segurança já identificou.",
  ],
  expertLinks: {
    preneel: "Publicação no LinkedIn de Bart Preneel",
    sep2025: "Carta aberta de setembro de 2025",
    nov2025: "Acompanhamento de novembro de 2025",
  },
  technicalConcerns: [
    {
      title: "A IA não pode classificar CSAM desconhecido de forma confiável em escala de Internet",
      body: "A classificação de imagens depende de contexto. Fotos de família, imagens médicas, material educacional e imagens consensuais trocadas por adolescentes podem ser difíceis até para humanos interpretarem corretamente.",
    },
    {
      title: "A correspondência de imagens conhecidas pode ser contornada",
      body: "Recorte, redimensionamento, compressão, pequenas alterações de pixel e perturbações adversariais podem deixar uma imagem reconhecível para uma pessoa enquanto mudam como os sistemas automatizados de correspondência a veem.",
    },
    {
      title: "A varredura no lado do cliente muda o modelo de confiança da criptografia",
      body: "O algoritmo de criptografia pode permanecer matematicamente forte, mas o software é obrigado a inspecionar o conteúdo antes que a criptografia o proteja. Essa não é a garantia de privacidade que os usuários esperam da criptografia de ponta a ponta.",
    },
    {
      title: "A infraestrutura de varredura se torna um alvo de alto valor",
      body: "Uma vez que os dispositivos são obrigados a inspecionar mensagens privadas, o mesmo mecanismo pode atrair atacantes, pressão política e demandas futuras para escanear outras categorias de conteúdo.",
    },
  ],
  protectedGroups: [
    "jornalistas e fontes confidenciais",
    "advogados e clientes",
    "médicos e pacientes",
    "empresas que protegem segredos comerciais",
    "funcionários governamentais e diplomatas",
    "comunicações policiais e militares",
  ],
  betterInvestments: [
    { title: "Apoiar vítimas", body: "Canais de denúncia sensíveis a trauma e apoio de longo prazo às vítimas." },
    { title: "Financiar especialistas", body: "Mais capacidade para equipes treinadas de investigação de abuso." },
    { title: "Investigar evidências", body: "Investigação rápida e direcionada com base em pistas e denúncias concretas." },
    { title: "Trabalhar entre fronteiras", body: "Cooperação internacional quando agressores, plataformas e vítimas abrangem jurisdições." },
    { title: "Remover material confirmado", body: "Remoção mais rápida de conteúdo ilegal conhecido após confirmação adequada." },
    { title: "Prevenir abuso mais cedo", body: "Educação e trabalho de prevenção antes que o abuso ocorra." },
  ],
  betterInvestmentEyebrow: "Melhor investimento",
  betterInvestmentTitle: "Fortalecer o trabalho que ajuda diretamente vítimas e investigadores",
  sections: {
    proposalReturns: {
      title: "A proposta continua retornando",
      paragraphs: [
        "Nos últimos anos, o CSAR passou por múltiplas revisões. Algumas mudanças merecem reconhecimento: tratamento mais rápido de denúncias voluntárias, obrigações mais claras e categorias de conteúdo mais restritas são melhores do que mandatos mais amplos e vagos.",
        "Mas essas mudanças não removem o problema técnico central. As versões mais contestadas do Chat Control ainda dependem de tecnologias de detecção sobre as quais criptógrafos, cientistas da computação e pesquisadores de segurança alertaram que não são confiáveis o suficiente para implantar contra centenas de milhões de comunicações privadas.",
      ],
    },
    cryptographersObject: { title: "Por que os criptógrafos continuam se opondo" },
    e2eeScanning: {
      title: "A criptografia de ponta a ponta não sobrevive à varredura obrigatória no lado do cliente",
      paragraphs: [
        "A criptografia de ponta a ponta oferece aos usuários uma promessa simples: apenas o remetente e o destinatário pretendido podem ler a mensagem. A varredura obrigatória no lado do cliente muda essa promessa. O dispositivo deve inspecionar a mensagem antes que a criptografia a proteja e denunciar tudo que o sistema de varredura considerar suspeito.",
        "Em trânsito, a mensagem ainda pode estar criptografada com criptografia forte. O problema é o que acontece antes dessa etapa. Se o software é obrigado a examinar o texto em claro no dispositivo e denunciar correspondências a um sistema externo, o endpoint deixa de agir apenas pelo usuário. Esse é um modelo de confiança diferente da criptografia de ponta a ponta como as pessoas a entendem.",
      ],
    },
    encryptionProtects: {
      title: "A criptografia protege mais do que chats pessoais",
      intro:
        "O debate público frequentemente soa como se mensagens criptografadas fossem apenas sobre conversas casuais. Não é. A comunicação privada segura é infraestrutura crítica para pessoas e instituições que enfrentam risco real.",
    },
    moreTech: {
      title: "Mais tecnologia não significa automaticamente mais segurança",
      paragraphs: [
        "A proposta também se situa ao lado de apelos mais amplos por verificação de idade e sistemas adicionais de mitigação. Essas ideias podem soar como camadas extras de segurança, mas a engenharia de segurança raramente melhora ao adicionar complexidade sem entender as novas superfícies de ataque que isso cria.",
        "Verificações de identidade centralizadas, pipelines de varredura, filas de revisão e infraestrutura de denúncia podem introduzir riscos de privacidade próprios. Um sistema construído para proteger crianças não deveria criar silenciosamente novos bancos de dados, novos incentivos de vigilância e novos modos de falha para todos.",
      ],
    },
    betterWays: {
      title: "Há maneiras melhores de proteger crianças",
      intro:
        "Um ponto da crítica científica merece atenção especial: o CSAM é evidência de um crime anterior. O objetivo real deveria ser prevenir o abuso, apoiar vítimas e permitir investigações direcionadas que possam realmente identificar agressores.",
    },
    privateNote: {
      title: "Por que isso importa para a PrivateNote",
      paragraphs: [
        "Na PrivateNote, o princípio é simples: quando você cria uma nota criptografada, apenas as pessoas que você escolher devem poder lê-la. Não nós. Não anunciantes. Não provedores de nuvem. Ninguém mais.",
        "Esse princípio não é um slogan. Ele reflete décadas de engenharia criptográfica. O debate em torno do Chat Control pergunta se a comunicação privada deve permanecer genuinamente privada — ou se cada dispositivo deve se tornar um posto de controle obrigatório que inspeciona mensagens antes que sejam criptografadas.",
      ],
    },
    policyReality: {
      title: "A política deve seguir a realidade técnica",
      paragraphs: [
        "Pessoas sensatas podem discordar sobre política. **Mas a política deve ser informada pela realidade técnica.** Quando centenas de criptógrafos, cientistas da computação, engenheiros de segurança e pesquisadores de privacidade alertam que uma tecnologia proposta não pode cumprir suas promessas sem enfraquecer garantias fundamentais de segurança, os legisladores devem ouvir.",
        "Proteger crianças e proteger comunicações seguras não são objetivos mutuamente exclusivos. A Europa deveria buscar soluções que alcancem ambos.",
      ],
    },
  },
  ctaTitle: "Envie notas privadas sem entregar a chave ao servidor",
  ctaBody:
    "A PrivateNote criptografa notas no seu navegador e mantém a chave de descriptografia no fragmento da URL.",
  ctaButton: "Experimente a PrivateNote ->",
};
