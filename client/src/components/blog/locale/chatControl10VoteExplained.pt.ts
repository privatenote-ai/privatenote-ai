import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedPt: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Votação do Parlamento Europeu sobre Chat Control com um balão de chat bloqueado sobre um mapa da Europa",
  heroCaption: "Ilustração gerada para PrivateNote.ai.",
  intro:
    "Em 9 de julho de 2026, algo incomum aconteceu no Parlamento Europeu. A votação final sobre a prorrogação do regulamento temporário Chat Control 1.0 terminou com mais deputados votando contra do que a favor — e, mesmo assim, a medida foi aprovada.",
  voteEyebrow: "Votação final, 9 de julho de 2026",
  voteHeadline: "Mais votos “Não” do que “Sim” — e ainda assim foi aprovado",
  voteLabels: { against: "Contra", for: "A favor", abstentions: "Abstenções" },
  voteSummary:
    "À primeira vista, a maioria dos observadores concluiria que a proposta havia sido rejeitada. A resposta não está na criptografia nem na cibersegurança — mas no procedimento parlamentar.",
  nonE2eChannels: [
    "serviços de e-mail tradicionais",
    "armazenamento em nuvem",
    "certos serviços de mensagens diretas",
    "outras comunicações em que os provedores podem acessar o conteúdo das mensagens",
  ],
  privacyConcerns: [
    {
      title: "Falsos positivos",
      body: "Detectar material ilegal já conhecido usando hashes criptográficos costuma ser confiável, mas não é perfeito. Pesquisadores demonstraram colisões e erros de implementação que podem gerar denúncias falsas. Se os provedores começarem a usar IA para identificar material novo, ainda não visto, a taxa de falsos positivos fica muito mais difícil de controlar. Cada falso positivo pode envolver a comunicação privada de uma pessoa inocente sendo sinalizada para revisão posterior.",
    },
    {
      title: "Expansão da infraestrutura de vigilância",
      body: "Muitos especialistas argumentam que, uma vez que as plataformas constroem sistemas de varredura em larga escala, ampliar o uso para outros fins se torna tecnicamente simples. A história mostra que tecnologias introduzidas para fins restritos frequentemente evoluem para capacidades de vigilância mais amplas com o tempo.",
    },
    {
      title: "Efeito inibidor",
      body: "A comunicação privada só funciona quando as pessoas confiam que suas conversas permanecem privadas. Se os usuários acreditam que cada mensagem pode ser analisada automaticamente, muitos podem evitar discutir assuntos sensíveis — mesmo quando totalmente legais. Esse fenômeno é bem documentado em pesquisas de privacidade.",
    },
    {
      title: "Eficácia limitada",
      body: "Mais de 800 pesquisadores de cibersegurança e privacidade argumentaram que a varredura ampla de mensagens é improvável de reduzir significativamente o abuso infantil, ao mesmo tempo em que impõe custos substanciais de privacidade a centenas de milhões de usuários. Críticos defendem que recursos de investigação são melhor investidos em investigações direcionadas do que em varredura indiscriminada.",
    },
  ],
  e2eeCalloutTitle: "A criptografia de ponta a ponta muda o modelo de confiança",
  e2eeCalloutBody:
    "A criptografia de ponta a ponta garante que apenas o remetente e o destinatário pretendido possuam as chaves criptográficas necessárias para ler uma mensagem. Nem mesmo o provedor do serviço pode descriptografar o conteúdo. Qualquer exigência de inspecionar mensagens criptografadas antes ou depois da criptografia muda fundamentalmente esse modelo de segurança — e se tornou um dos temas mais controversos da política moderna de cibersegurança.",
  sections: {
    whyPassed: {
      title: "Por que foi aprovado?",
      paragraphs: [
        "Esta não foi uma votação legislativa padrão que exigia maioria simples dos votos emitidos. Por causa do estágio procedimental específico desta legislação, **rejeitar a proposta exigia maioria absoluta de todos os membros do Parlamento Europeu — atualmente 361 votos**.",
        "Embora 314 deputados tenham votado contra a proposta, esse número ficou abaixo do limiar exigido. Como resultado, a proposta foi considerada aprovada.",
      ],
      callout:
        "Esse resultado procedimental surpreendeu muitos observadores — jornalistas, especialistas jurídicos e pesquisadores de cibersegurança — porque a expectativa intuitiva é que mais votos “Não” do que “Sim” deveriam derrotar uma proposta.",
    },
    whatItDoes: {
      title: "O que o Chat Control 1.0 realmente faz?",
      paragraphs: [
        "A medida adotada **não** introduz varredura obrigatória de todas as mensagens privadas. Em vez disso, ela prorroga o quadro jurídico temporário existente que permite que provedores de serviços online **voluntariamente** detectem e denunciem material de abuso sexual infantil (CSAM) em certos tipos de comunicação até 3 de abril de 2028.",
        "Isso se aplica principalmente a comunicações que não são protegidas por [criptografia de ponta a ponta](blog:what-is-end-to-end-encryption), como:",
        "Importante: o Parlamento manteve linguagem que exclui comunicações criptografadas de ponta a ponta desse quadro de varredura voluntária. Para uma definição precisa do que isso significa na prática — e como difere da criptografia de transporte comum — veja nosso guia sobre [o que é criptografia de ponta a ponta](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Por que especialistas em privacidade estão preocupados?",
      intro:
        "Muitos pesquisadores e organizações de direitos civis se opuseram à prorrogação — não porque se oponham à proteção de crianças, mas porque questionam se essa abordagem atinge esse objetivo sem criar riscos significativos. Nosso artigo anterior sobre [por que os criptógrafos europeus continuam alertando sobre o Chat Control](blog:chat-control-europe-cryptographers) explica em profundidade as objeções técnicas mais amplas.",
    },
    chatControl20: {
      title: "A história maior se chama Chat Control 2.0",
      paragraphs: [
        "Embora a votação desta semana tenha atraído atenção significativa, muitos especialistas acreditam que o debate maior ainda está por vir. A proposta comumente chamada de Chat Control 2.0 visa estabelecer um quadro jurídico permanente para detectar CSAM online.",
        "Diferente da prorrogação temporária adotada nesta semana, as discussões em torno do Chat Control 2.0 incluíram repetidamente propostas que poderiam afetar comunicações criptografadas de ponta a ponta. É aí que o debate se torna consideravelmente mais significativo — e onde os alertas em nosso [briefing de criptógrafos sobre o Chat Control](blog:chat-control-europe-cryptographers) importam mais.",
      ],
    },
    privateNote: {
      title: "Por que isso importa para a PrivateNote",
      paragraphs: [
        "A comunicação privada se baseia em um princípio simples: se um serviço não pode ler sua mensagem, ele não pode escaneá-la, analisá-la, vendê-la ou expô-la acidentalmente. A PrivateNote foi projetada em torno dessa ideia.",
        "Quando você cria uma nota, a criptografia acontece diretamente no seu navegador. A chave de criptografia nunca chega aos nossos servidores. Armazenamos apenas texto cifrado. Sem a chave — que permanece inteiramente sob seu controle — o conteúdo da sua nota é matematicamente ilegível para nós.",
        "Esse design não é sobre evitar responsabilidade. É sobre garantir que sua comunicação privada permaneça exatamente isso: privada. Seja compartilhando senhas, documentos jurídicos, informações financeiras, segredos empresariais ou conversas pessoais, a privacidade não deveria depender apenas de confiar no provedor do serviço. Ela deveria ser imposta pela criptografia.",
        "Para uma visão passo a passo de como a criptografia no navegador funciona na prática, veja [como a PrivateNote funciona](app:how-it-works). Para compartilhar segredos de curta duração sem deixá-los em um histórico permanente de chat, [links secretos de uso único](blog:one-time-secret-links) costumam ser mais adequados do que apps de mensagens — mesmo os criptografados.",
      ],
    },
    debateContinues: {
      title: "O debate está longe de terminar",
      paragraphs: [
        "Pessoas sensatas podem discordar sobre como a sociedade deve combater o abuso infantil online. Proteger crianças é, sem dúvida, um dos interesses públicos mais importantes. A pergunta difícil é como alcançar esse objetivo sem minar a infraestrutura de segurança e privacidade da qual jornalistas, empresas, advogados, profissionais de saúde, ativistas e cidadãos comuns dependem todos os dias.",
        "Enquanto as discussões sobre o Chat Control 2.0 continuam, esse equilíbrio entre segurança pública e direitos fundamentais de privacidade permanecerá um dos debates definidores de política tecnológica na Europa. Qualquer que seja sua posição, uma coisa é certa: o futuro da comunicação criptografada será cada vez mais decidido não apenas por criptógrafos e engenheiros de software — mas também por legisladores.",
      ],
    },
  },
  ctaTitle: "Envie notas privadas sem entregar a chave ao servidor",
  ctaBody:
    "A PrivateNote criptografa notas no seu navegador e mantém a chave de descriptografia no fragmento da URL.",
  ctaButton: "Experimente a PrivateNote ->",
};
