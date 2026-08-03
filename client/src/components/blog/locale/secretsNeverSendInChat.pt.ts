import type { SecretsNeverSendInChatArticleCopy } from "./secretsNeverSendInChat.types";

export const secretsNeverSendInChatPt: SecretsNeverSendInChatArticleCopy = {
  intro: [
    "Do Slack e Microsoft Teams ao WhatsApp e Messenger: o chat se tornou para muitas pessoas a forma padrão de trocar informações. É rápido, conveniente e mantém equipes alinhadas. Infelizmente, também se tornou um cemitério digital para dados muito sensíveis: compartilhados por conveniência e depois esquecidos.",
    "Muitos apps de chat modernos oferecem forte [criptografia de transporte](blog:encrypted-vs-secure-file-sharing) ou até criptografia ponta a ponta. A criptografia protege mensagens enquanto viajam entre dispositivos. O problema maior começa depois. Assim que um segredo cai no chat, frequentemente permanece pesquisável por meses ou anos em vários sistemas.",
    "Essa durabilidade cria uma pegada digital surpreendentemente grande. Informações sensíveis podem continuar vivas em histórico de chat pesquisável, backups na nuvem, exportações de workspace, pré-visualizações de notificação, screenshots e dispositivos sincronizados.",
    "Segundo o [Verizon Data Breach Investigations Report 2026](https://www.verizon.com/business/resources/reports/dbir/), **62% dos incidentes de segurança têm um fator humano**: credenciais roubadas, phishing, engenharia social, abuso e erros simples. Tecnologia sozinha não previne esses incidentes se informações sensíveis são compartilhadas sem cuidado.",
    "Uma abordagem mais segura segue um princípio simples: **compartilhe informação apenas quando necessária e faça-a desaparecer após a primeira visualização.** É nisso que se baseiam os [links de uso único para segredos](blog:one-time-secret-links), e é por isso que o PrivateNote trata a vida útil de uma nota como parte da segurança, não como detalhe secundário.",
  ],
  chatScreenshotCaption:
    "Exemplo ilustrativo: credenciais legíveis em um chat de equipe permanecem preservadas no histórico do canal, backups e busca, muito depois que a transferência terminou.",
  cheatSheetTitle: "A cola de segurança",
  cheatSheetHeaders: ["Nunca envie", "O risco", "Abordagem melhor"],
  cheatSheetRows: [
    {
      neverSend: "Senhas",
      risk: "Ficam indexadas em histórico permanente de chat e logs pesquisáveis.",
      better: "[Link de uso único com criptografia no navegador](blog:one-time-secret-links).",
    },
    {
      neverSend: "Códigos de recuperação",
      risk: "Contornam efetivamente a autenticação multifator de forma permanente.",
      better: "Gerenciador de senhas dedicado ou [nota de uso único](blog:send-secret-message-without-account).",
    },
    {
      neverSend: "Chaves de API",
      risk: "Uma colagem acidental em um canal público compromete ambientes de produção.",
      better: "[Nota segura autodestrutiva](blog:privatenote-for-developers) com criptografia no navegador.",
    },
    {
      neverSend: "Documentos",
      risk: "Deixam cópias persistentes em pastas de download locais e dispositivos sincronizados.",
      better: "[Transferência temporária de arquivos criptografados](app:secure-file-transfer) com acesso limitado.",
    },
  ],
  whyChatTitle: "Por que o chat não é um gerenciador de segredos",
  whyChatParagraphs: [
    "Plataformas de mensagens são construídas para comunicação, não para gerenciamento de segredos. Seu objetivo é preservar conversas entre dispositivos, sincronizar histórico, permitir busca, fazer backups e manter colaboração rastreável.",
    "Exatamente essas funções se tornam um risco quando credenciais ou dados sensíveis da empresa são compartilhados. A informação permanece acessível muito depois de cumprir seu propósito. Nosso artigo sobre [mensagens no trabalho e descoberta legal](blog:workplace-texts-private-note) mostra como mensagens escritas casualmente podem sobreviver ao contexto original por anos.",
    "Um segredo de uso único segue um modelo diferente: a informação está disponível apenas pelo curto período em que é realmente necessária, e depois o acesso no servidor é removido por design.",
  ],
  lifetimeTitle: "Vida útil dos dados: chat clássico versus PrivateNote",
  lifetimeIntro: "A diferença não é apenas se uma mensagem é criptografada em trânsito. É se o segredo ainda existe em algum lugar após ser lido.",
  chatWorkflowLabel: "Fluxo clássico de chat",
  chatWorkflowSteps: ["Senha", "Slack / Teams", "Armazenada", "Pesquisável", "Backups", "Anos depois"],
  chatWorkflowOutcome: "O segredo continua existindo entre sistemas",
  privateNoteWorkflowLabel: "Fluxo PrivateNote",
  privateNoteWorkflowSteps: [
    "Senha",
    "Criptografar no navegador",
    "Link de uso único",
    "Aberta",
    "Removida do servidor",
  ],
  privateNoteWorkflowOutcome: "O segredo é removido após a entrega",
  secretsTitle: "10 segredos que não pertencem a apps de chat",
  secrets: [
    {
      title: "Senhas de conta",
      paragraphs: [
        "Todo mundo conhece a situação: \"Qual era o login da conta de marketing compartilhada?\" e logo a senha está em texto legível no chat. Mesmo confiando totalmente no colega, essa senha agora está indexada no histórico do workspace, em cache nos dados locais do app e possivelmente visível em notificações por e-mail ou push.",
        "Se um atacante comprometer esse histórico de chat meses depois, herda acesso ativo à sua conta.",
      ],
      instead:
        "Envie um [link de uso único com criptografia no navegador](blog:send-secret-message-without-account). Assim que o destinatário abrir e buscar a senha, o texto cifrado é removido do servidor host. Precisa de uma senha forte primeiro? Use nosso [gerador de senhas](app:password-generator).",
    },
    {
      title: "Códigos de recuperação MFA",
      paragraphs: [
        "Ao ativar MFA, serviços geram códigos de backup de emergência. Por medo de perder acesso, usuários frequentemente copiam esses códigos para um chat com um colega ou para seu próprio chat privado.",
        "Códigos de recuperação são chaves mestras de backup. Tratá-los como mensagem casual mina o propósito da segurança multifator.",
      ],
      instead:
        "Armazene-os em um gerenciador de senhas dedicado. Se precisar compartilhá-los em uma transferência de conta, use uma [nota temporária de uso único](blog:one-time-secret-links), para que o segredo não permaneça permanentemente no histórico de chat.",
    },
    {
      title: "Chaves de API de produção",
      paragraphs: [
        "Desenvolvedores frequentemente trocam chaves de API, tokens de acesso ou segredos de nuvem no chat para debugar um problema rapidamente. O [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning) detecta continuamente credenciais vazadas em repositórios públicos, uma pista de quão frequentemente segredos vazam por acidente.",
        "Uma colagem acidental no canal errado pode expor bancos de dados ao vivo ou sistemas de faturamento.",
      ],
      instead:
        "Envie tokens via uma [nota criptografada no navegador](blog:privatenote-for-developers) que expira automaticamente após ser visualizada uma vez.",
    },
    {
      title: "Chaves privadas SSH",
      paragraphs: [
        "Sua chave privada é sua identidade para infraestrutura de servidores. Ela nunca deveria estar em um app de mensagens. Quem copia uma chave privada cria outra cópia fora do ambiente seguro pretendido; ela pode persistir em histórico de chat, backups ou dispositivos de destinatários.",
      ],
      instead:
        "Se uma chave precisa ser transferida com segurança, use um payload criptografado de uso único que se remove do servidor host após a entrega.",
    },
    {
      title: "Links de convite e reset",
      paragraphs: [
        "Links temporários de onboarding e admin caem constantemente em canais de chat:",
      ],
      bullets: [
        "Links de atribuição de host Zoom",
        "Tokens de moderador Google Meet",
        "Convites de onboarding Stripe",
        "Convites para privilégios de administrador",
        "URLs de reset de senha",
      ],
      instead:
        "Envie links privilegiados de onboarding via uma [nota de uso único](blog:one-time-secret-links), para que não possam ser extraídos de logs históricos quando ficarem sem uso.",
    },
    {
      title: "Frases seed de crypto",
      paragraphs: [
        "Sua frase de recuperação de 12 ou 24 palavras controla toda a sua carteira. Se alguém comprometer sua conta de chat anos depois, scrapers automatizados podem vasculhar conversas históricas por frases que correspondam a formatos de seed. Se sua seed phrase for roubada, seus valores podem ser perdidos permanentemente.",
      ],
      instead:
        "Prefira não transferir seed phrases digitalmente. Se uma emergência absoluta exigir, use uma nota criptografada que força remoção imediata após leitura para limitar a exposição.",
    },
    {
      title: "Credenciais temporárias",
      paragraphs: [
        "Helpdesks de TI frequentemente compartilham credenciais iniciais ao integrar novos funcionários. Mesmo que usuários sejam solicitados a alterar a senha no primeiro login, a senha temporária permanece pesquisável no histórico de chat. Se a alteração for atrasada ou o sistema permitir reutilização, essa mensagem permanece uma vulnerabilidade ativa.",
      ],
      instead:
        "Entregue credenciais temporárias via uma [nota com criptografia no navegador](blog:send-secret-message-without-account) que expira após abertura.",
    },
    {
      title: "Informações financeiras e bancárias",
      paragraphs: [
        "Colar IBANs corporativos, dados de roteamento, documentos fiscais ou confirmações de pagamento em chats parece inofensivo, porque um IBAN sozinho não é uma senha. Mas quando atacantes combinam dados bancários com contexto pessoal do histórico de chat, surge a base para phishing convincente e fraude de faturas.",
      ],
      instead:
        "Separe detalhes financeiros da comunicação diária. Compartilhe-os por canais criptografados que removem o acesso assim que a transação for verificada.",
    },
    {
      title: "Scans de documentos pessoais",
      paragraphs: [
        "Precisa enviar rapidamente uma cópia do passaporte, carteira de motorista ou contrato de trabalho para o RH? Um PDF na janela de chat copia dados de identidade muito sensíveis para backups na nuvem, galerias locais de smartphones e pastas de desktop sincronizadas.",
      ],
      instead:
        "Use [transferência segura de arquivos](app:secure-file-transfer) com criptografia no navegador: um download, depois o arquivo é removido do servidor host conforme suas configurações de acesso.",
    },
    {
      title: "Informações confidenciais da empresa",
      paragraphs: [
        "Apresentações de estratégia interna, propostas de preço ainda não anunciadas, rascunhos jurídicos e documentos de aquisição passam constantemente por canais de equipe. Vazamentos de dados nem sempre vêm de hackers externos; às vezes surgem quando um funcionário convida acidentalmente um convidado externo a um canal com anos de estratégia interna.",
      ],
      instead:
        "Compartilhe dados sensíveis da empresa via notas criptografadas com expiração automática rigorosa e janelas de acesso limitadas.",
    },
  ],
  lifespanTitle: "Segredos têm uma vida útil",
  lifespanParagraphs: [
    "A criptografia protege segredos em trânsito. **A expiração os protege ao longo do tempo.** A maioria dos apps de chat ignora quase completamente essa segunda parte.",
    "Com o PrivateNote, você muda a postura de segurança por design. Em vez de esperar que usuários removam manualmente mensagens sensíveis depois, você impõe a vida útil do segredo. O destinatário lê uma vez, depois desaparece do servidor.",
  ],
  lifespanBullets: [
    "**Sem pegada persistente:** Nenhum histórico de chat e nenhum arquivo pesquisável contém o segredo bruto.",
    "**Círculo de dano menor:** Se depois um laptop ou conta de chat for comprometida, não há senhas antigas em logs que possam ser exploradas.",
    "**Menos erros humanos:** O sistema faz minimização de dados automaticamente, em vez de alguém precisar lembrar de excluir manualmente mensagens sensíveis.",
  ],
  underHoodTitle: "Segurança sob o capô: como o PrivateNote funciona",
  underHoodParagraphs: [
    "O PrivateNote criptografa sua mensagem diretamente no navegador antes do upload. O servidor armazena apenas texto cifrado. A chave de descriptografia fica no [fragmento da URL](blog:one-time-secret-links), a parte após `#`, que os navegadores não enviam em requisições HTTP aos servidores web. O servidor nunca recebe a chave de descriptografia.",
    "Assim que a nota é aberta conforme suas configurações, o texto cifrado é removido do servidor. Para senhas, chaves de API, códigos de recuperação e credenciais temporárias, **limitar a vida útil dos dados é tão importante quanto criptografá-los.** Chats preservam conversas. O PrivateNote limita a vida útil dos segredos.",
  ],
  faqTitle: "Perguntas frequentes",
  faq: [
    {
      question: "É seguro enviar senhas no Slack?",
      answer:
        "O Slack criptografa dados em trânsito e em repouso, mas senhas permanecem no histórico de chat pesquisável até serem removidas. Para credenciais temporárias, uma [nota de uso único com criptografia no navegador](blog:send-secret-message-without-account) reduz a exposição de longo prazo.",
    },
    {
      question: "Mensagens do WhatsApp são seguras para senhas?",
      answer:
        "A criptografia ponta a ponta protege mensagens em trânsito, e mensagens que desaparecem podem removê-las após um tempo definido. Destinatários ainda podem capturar conteúdo via screenshots, encaminhamento ou salvamento antes que desapareçam. Senhas idealmente deveriam ser compartilhadas apenas pelo tempo necessário: via um [link de uso único para segredos](blog:one-time-secret-links), não via histórico permanente de chat.",
    },
    {
      question: "O e-mail é mais seguro que chat para senhas?",
      answer:
        "Não. E-mail padrão geralmente não é criptografado ponta a ponta por padrão e passa por vários servidores de e-mail. Após a entrega, uma senha permanece indefinidamente em caixas de entrada, pastas de enviados, caches locais e backups do provedor.",
    },
    {
      question: "O que é um segredo de uso único?",
      answer:
        "Um segredo de uso único é uma mensagem que não está mais disponível após uma visualização ou após um tempo de expiração definido. Isso reduz cópias persistentes entre sistemas. Veja nosso guia sobre [links de uso único para segredos](blog:one-time-secret-links).",
    },
  ],
  referencesTitle: "Referências",
  references: [
    "Verizon. Data Breach Investigations Report 2026 (DBIR). [verizon.com/business/resources/reports/dbir/](https://www.verizon.com/business/resources/reports/dbir/)",
    "Verizon. Healthcare Data Breach Investigations Snapshot 2026. [verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf](https://www.verizon.com/business/resources/reports/2026-dbir-healthcare-snapshot.pdf)",
  ],
  closingTitle: "Compartilhe segredos sem deixar rastro no chat",
  closingBody: [
    "O chat é excelente para coordenação. Como cofre para credenciais, chaves, códigos de recuperação e documentos que nunca deveriam ter existido permanentemente, é inadequado.",
    "O PrivateNote foi construído para o padrão oposto: criptografar no navegador, compartilhar um link e deixar o segredo expirar assim que cumprir sua função. Sem conta necessária para o remetente, sem texto legível em um arquivo pesquisável por anos.",
  ],
  tagline: "Menos histórico de chat. Menos metadados. Mais controle sobre quanto tempo um segredo existe online.",
  relatedReading: "Leituras relacionadas",
  relatedPosts: [
    {
      slug: "send-secret-message-without-account",
      blurb: "Envie senhas e notas privadas sem registro: criptografia no navegador e links com expiração explicados.",
    },
    {
      slug: "one-time-secret-links",
      blurb: "Como links de uso único funcionam, por que o fragmento da URL importa e quando expiração é melhor que e-mail ou Slack.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Por que rastros escritos em e-mail e chat no trabalho criam riscos de longo prazo e quando notas efêmeras são melhores.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS versus criptografia no navegador: o que cada um protege e por que o servidor ainda pode ler seus dados.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Crie senhas fortes antes de compartilhá-las via link de uso único.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Uma base prática de segurança para senhas, autenticação e hábitos de compartilhamento seguro.",
    },
  ],
};
