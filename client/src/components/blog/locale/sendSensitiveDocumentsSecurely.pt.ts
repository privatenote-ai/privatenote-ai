import type { SendSensitiveDocumentsSecurelyArticleCopy } from "./sendSensitiveDocumentsSecurely.types";

export const sendSensitiveDocumentsSecurelyPt: SendSensitiveDocumentsSecurelyArticleCopy = {
  heroAlt:
    "Conceito de transferência segura de documentos: um envelope selado e a entrega de um arquivo criptografado sobre uma mesa tranquila",
  heroCaption:
    "A parte difícil raramente é o botão de enviar. É o que acontece com cada cópia depois que o documento chega.",
  intro: [
    "Imagine que você precisa enviar seu passaporte para um banco, seu contador pede documentos fiscais, seu empregador solicita comprovante de identidade, ou um cliente precisa de um contrato assinado.",
    "A tarefa em si leva apenas alguns segundos: anexar o arquivo, clicar em Enviar, seguir com o dia. A transferência raramente é a parte mais fraca do processo. O verdadeiro problema começa depois que o documento chega.",
    "Esse anexo pode permanecer em caixas de entrada, backups na nuvem, dispositivos sincronizados, caixas de correio arquivadas e conversas antigas de chat por anos. Em muitas situações, o maior risco à privacidade não é a interceptação em trânsito — é o fato de que cópias continuam existindo muito depois que o documento já cumpriu seu propósito.",
    "Este guia explica por que o compartilhamento tradicional de documentos frequentemente falha, o que realmente significa compartilhamento seguro de documentos, e como [a criptografia no navegador](blog:encrypted-vs-secure-file-sharing) e os [links de uso único](blog:one-time-secret-links) ajudam a manter privadas as informações confidenciais.",
  ],
  sections: [
    {
      title: "Por que documentos confidenciais merecem um tratamento diferente",
      takeaway:
        "Se um documento seria difícil de substituir — ou doloroso de vazar — não o trate como uma foto de férias.",
      paragraphs: [
        "Nem todo arquivo merece o mesmo nível de proteção. Perder uma foto de férias online pode ser decepcionante. Perder um documento confidencial pode ter consequências que duram anos.",
        "Documentos de identidade geralmente contêm seu nome completo, data de nascimento, número de identificação, nacionalidade, assinatura e fotografia. Registros financeiros revelam renda, economias, informações fiscais ou dados de conta bancária. Documentos médicos contêm informações profundamente pessoais, enquanto contratos frequentemente incluem detalhes comercialmente sensíveis que nunca foram destinados a se tornar públicos.",
        "Se alguém descobre sua senha, você a troca. Se alguém copia seu passaporte, carteira de identidade nacional, declaração de imposto de renda ou contrato de trabalho, a situação é muito mais complicada. É por isso que documentos confidenciais merecem uma abordagem diferente da comunicação cotidiana.",
      ],
    },
    {
      title: "O problema oculto do e-mail",
      takeaway: "O TLS protege a jornada; ele não impede que cópias permanentes se acumulem depois.",
      paragraphs: [
        "O e-mail continua sendo uma das ferramentas de comunicação mais úteis já criadas. Nunca foi projetado para ser um sistema seguro de entrega de documentos.",
        "Os provedores de e-mail modernos protegem as mensagens em trânsito com conexões criptografadas como o TLS. Depois que a mensagem chega, o anexo geralmente é armazenado para poder ser pesquisado, sincronizado, filtrado, submetido a backup e recuperado mais tarde.",
        "Um único anexo rapidamente se torna múltiplas cópias: sua pasta de Enviados, a caixa de entrada do destinatário, telefones, laptops, arquivos corporativos, backups na nuvem e, às vezes, sistemas de reenvio automático. Excluir o e-mail depois raramente remove todas as cópias.",
        "Para conversas do dia a dia isso geralmente é aceitável. Para passaportes, contratos, extratos financeiros ou laudos médicos, muitas vezes não é. Para uma análise mais profunda de por que o e-mail é um péssimo lugar para guardar segredos, veja [por que o e-mail é o pior lugar para segredos](blog:why-email-is-worst-for-secrets).",
      ],
    },
    {
      title: "Por que os aplicativos de mensagens deixam um rastro permanente",
      takeaway: "O chat facilita a colaboração — e torna a retenção de documentos acidental.",
      paragraphs: [
        "Muitas pessoas evitam o e-mail e, em vez disso, enviam documentos confidenciais por Slack, Microsoft Teams, WhatsApp, Signal, Telegram ou Discord. Essas plataformas resolvem a colaboração. Elas não resolvem o gerenciamento do ciclo de vida dos documentos.",
        "Arquivos compartilhados em chat costumam permanecer pesquisáveis por meses ou anos, sincronizar entre dispositivos, entrar em backups automáticos e ser baixados em computadores pessoais. Mesmo depois que a conversa é esquecida, os documentos geralmente permanecem.",
        "O maior risco à privacidade muitas vezes não é a interceptação por hackers. É o fato de que informações confidenciais silenciosamente acumulam cópias que ninguém pretendia manter. O mesmo padrão aparece quando equipes [colam segredos no chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "O armazenamento em nuvem resolve um problema diferente",
      takeaway: "Drives na nuvem são feitos para acesso duradouro; a entrega temporária precisa de expiração por design.",
      paragraphs: [
        "Serviços como Google Drive, OneDrive, Dropbox e iCloud são excelentes para colaboração, backups e armazenamento de longo prazo. A entrega segura de documentos é um problema diferente.",
        "Se vários colegas precisam de acesso contínuo aos mesmos arquivos, o armazenamento em nuvem é a ferramenta certa. Se você simplesmente quer que uma pessoa receba hoje um documento confidencial — e não precisa mais que ele esteja disponível no mês seguinte — os requisitos são completamente diferentes.",
        "Links de compartilhamento permanentes costumam permanecer no histórico do navegador, em e-mails antigos, documentos de projeto, mensagens de chat e favoritos muito depois de todos assumirem que desapareceram. O armazenamento em nuvem otimiza para disponibilidade de longo prazo, não para entrega temporária.",
      ],
    },
    {
      title: "Compartilhamento seguro de documentos é mais do que criptografia",
      takeaway: "A criptografia protege os bits; os controles de ciclo de vida decidem quanto tempo a exposição dura.",
      paragraphs: [
        "Quando as pessoas ouvem “compartilhamento seguro de documentos”, muitas vezes pensam apenas em criptografia. A criptografia é essencial. Ela não é a história completa.",
        "Compartilhamento seguro trata de reduzir a exposição desnecessária durante toda a vida de um documento. Um sistema bem projetado deve responder: Apenas o destinatário pretendido pode acessar o documento? O acesso expira automaticamente? Cópias desnecessárias são evitadas? O serviço recebe o documento original ou apenas dados criptografados?",
        "Segurança não é apenas proteger um arquivo em trânsito. É também limitar quem pode acessá-lo — e por quanto tempo.",
      ],
    },
    {
      title: "E-mail vs. link criptografado de uso único",
      takeaway:
        "O e-mail é feito para guardar mensagens; links criptografados de uso único são feitos para entregar um documento e depois parar de guardá-lo.",
      comparisonTable: {
        headers: ["", "Anexo de e-mail", "Link criptografado de uso único"],
        rows: [
          ["Facilidade de envio", "Muito alta", "Alta"],
          [
            "Cópias criadas",
            "Muitas (enviados, caixa de entrada, dispositivos, backups)",
            "Muito menos por design",
          ],
          ["Tempo de vida do acesso", "Frequentemente indefinido", "Expira ou se autodestrói após o uso"],
          [
            "O que o serviço vê",
            "Geralmente o arquivo original",
            "Texto cifrado, se criptografado primeiro no navegador",
          ],
          [
            "Melhor para",
            "Correspondência cotidiana e não sensível",
            "Passaportes, contratos, documentos fiscais e de identidade",
          ],
        ],
        after: [
          "**Frase pronta para citação:** Anexo de e-mail = envio fácil, cópias que podem durar anos. Link criptografado de uso único = criptografia no navegador antes do upload, acesso que expira, muito menos cópias remanescentes.",
        ],
      },
    },
    {
      title: "A criptografia no navegador reduz a confiança necessária",
      takeaway: "Criptografe antes do upload para que o serviço armazene texto cifrado — não seu documento original.",
      paragraphs: [
        "As plataformas tradicionais de compartilhamento de arquivos geralmente recebem seu documento original antes de armazená-lo ou processá-lo. A criptografia baseada no navegador funciona de forma diferente.",
        "Antes que o arquivo saia do seu computador, seu navegador o criptografa localmente. O serviço armazena texto cifrado em vez do documento original. Sem a chave de descriptografia correspondente, os dados armazenados são incompreensíveis.",
        "Em vez de depender totalmente do provedor depois que ele recebe seu documento, você reduz desde o início as informações disponíveis ao provedor. O guia da PrivateNote sobre [criptografia vs. compartilhamento seguro de arquivos](blog:encrypted-vs-secure-file-sharing) detalha esse modelo.",
      ],
    },
    {
      title: "Links de uso único reduzem a exposição de longo prazo",
      takeaway: "A maioria dos vazamentos é acesso remanescente — não hacking de filme.",
      paragraphs: [
        "Muitos vazamentos de documentos acontecem porque documentos antigos continuam existindo: anexos de e-mail em caixas de entrada, links na nuvem que ainda funcionam, históricos de chat que preservam arquivos antigos.",
        "Links de uso único adotam uma abordagem diferente. O destinatário recupera o documento uma única vez. Depois disso, os dados criptografados são removidos ou o link de compartilhamento expira permanentemente.",
        "Nenhuma pasta compartilhada esquecida. Nenhum link de download de anos atrás. Nenhum documento confidencial esperando silenciosamente para ser descoberto.",
        "Nenhuma tecnologia pode impedir que um destinatário autorizado salve intencionalmente uma cópia depois de abrir o documento. O que o compartilhamento de uso único consegue fazer é eliminar muitas das cópias desnecessárias criadas pelas ferramentas tradicionais.",
      ],
      calloutTitle: "Regra prática",
      callout:
        "Se você não se sentiria confortável publicando um documento em um site público, pense com cuidado antes de enviá-lo como um anexo de e-mail permanente.",
    },
    {
      title: "Uma camada extra: compartilhamento protegido por senha",
      takeaway: "Separe o link da senha para que um erro não exponha os dois.",
      paragraphs: [
        "Às vezes até o link de compartilhamento merece proteção — um e-mail encaminhado por acidente, histórico de navegador visível, ou uma conta de mensagens comprometida.",
        "Adicionar uma senha cria outra camada. Mesmo que alguém descubra o link de compartilhamento, ainda não conseguirá descriptografar o documento sem a senha.",
        "Para informações particularmente sensíveis, comunique a senha por um canal diferente — telefone ou pessoalmente — em vez de na mesma mensagem que o link. O mesmo padrão se aplica quando você [compartilha uma senha com segurança](blog:how-to-share-a-password-securely).",
      ],
    },
    {
      title: "Compartilhamento seguro de documentos na Europa e além",
      takeaway: "O GDPR não indica um produto — mas limitar acesso e retenção está alinhado com seu espírito.",
      paragraphs: [
        "Em toda a Europa, as organizações processam informações pessoais sob o GDPR. Ele não exige um serviço específico de compartilhamento de arquivos, mas exige medidas técnicas e organizacionais adequadas de acordo com o risco.",
        "Compartilhamento criptografado, disponibilidade limitada e menos cópias desnecessárias são exemplos práticos desses princípios. As mesmas ideias se aplicam quer você esteja enviando documentos a um contador, empregador, advogado, universidade, prestador de serviços de saúde, banco, seguradora ou autoridade pública.",
      ],
    },
    {
      title: "Quando você deve usar compartilhamento seguro de documentos?",
      takeaway: "Se importasse que este documento se tornasse público, não o envie como um anexo permanente.",
      paragraphs: [
        "Isso inclui passaportes, carteiras de identidade nacionais, carteiras de motorista, registros financeiros, documentos fiscais, solicitações de hipoteca, contratos de trabalho, documentação de seguros, acordos jurídicos, laudos médicos, informações comerciais confidenciais, dados de pesquisa, informações de clientes e propriedade intelectual.",
        "Quanto mais difícil for substituir um documento — ou quanto maiores forem as consequências de sua exposição — mais cuidado deve ser tomado ao compartilhá-lo.",
      ],
    },
    {
      title: "Formas práticas de reduzir o risco",
      takeaway: "Segurança perfeita não existe; menos cópias e acesso mais curto quase sempre ajudam.",
      paragraphs: [
        "Antes de enviar um documento confidencial, siga esta breve lista de verificação:",
      ],
      checklist: [
        "Verifique o destinatário — pessoa correta, endereço ou canal correto",
        "Envie apenas o necessário — as páginas exigidas, não o pacote inteiro quando possível",
        "Use um link com expiração ou de uso único — não um anexo permanente",
        "Adicione uma senha para arquivos de alta sensibilidade — e compartilhe-a em um canal separado",
        "Confirme a entrega e depois faça a limpeza — exclua cópias locais e da caixa de entrada que você não precisa mais",
      ],
      paragraphsAfterChecklist: [
        "Reduzir o número de cópias é uma das melhorias de privacidade mais simples e eficazes que qualquer pessoa pode fazer.",
      ],
      midCta: {
        body: "Pronto para enviar a digitalização de um passaporte, um contrato ou um arquivo fiscal sem deixar um rastro permanente no e-mail?",
        button: "Iniciar uma transferência segura de arquivo",
      },
    },
    {
      title: "Perguntas frequentes",
      takeaway: "A criptografia ajuda; a expiração e menos cópias terminam o trabalho.",
      faqs: [
        {
          question: "Proteger um PDF com senha já é suficiente?",
          answer:
            "Ajuda, mas não resolve o problema da persistência. O PDF criptografado ainda pode permanecer em arquivos de e-mail, backups na nuvem e downloads por anos. Combine a criptografia com entrega com expiração ou de uso único.",
        },
        {
          question: "O HTTPS já não é seguro?",
          answer:
            "O HTTPS protege os dados em trânsito. Ele não impede necessariamente que o serviço receptor acesse ou armazene o arquivo depois. A criptografia baseada no navegador criptografa antes do upload.",
        },
        {
          question: "E os arquivos ZIP criptografados?",
          answer:
            "Razoáveis se você usar criptografia forte e comunicar a senha separadamente — mas ainda deixam arquivos permanentes em sistemas de e-mail, a menos que o método de compartilhamento também limite por quanto tempo o arquivo permanece disponível.",
        },
        {
          question: "O compartilhamento seguro pode impedir que o destinatário salve o documento?",
          answer:
            "Não. Depois que alguém recebe legitimamente um documento, pode salvá-lo, imprimi-lo ou fotografar a tela. O compartilhamento seguro reduz a exposição desnecessária antes e depois da entrega; ele não pode impedir ações intencionais de destinatários confiáveis.",
        },
      ],
    },
    {
      title: "Compartilhando documentos confidenciais com a PrivateNote",
      takeaway:
        "A PrivateNote é feita para entrega temporária de documentos criptografados — não armazenamento permanente na nuvem.",
      paragraphs: [
        "A PrivateNote foi projetada em torno de uma observação simples: muitos documentos confidenciais só precisam existir online o tempo suficiente para que um único destinatário os recupere.",
        "Em vez de tratar o compartilhamento de documentos como armazenamento permanente, a PrivateNote criptografa arquivos no seu navegador antes do upload e armazena apenas o texto cifrado resultante. Você pode escolher expiração automática, criar links de uso único e, quando apropriado, proteger o documento com uma senha adicional por meio da [transferência segura de arquivos](app:secure-file-transfer).",
      ],
      useCaseTable: {
        headers: ["O que a PrivateNote faz", "O que ela não faz"],
        rows: [
          [
            "Criptografa no seu navegador antes do upload",
            "Ler seu documento original no servidor",
          ],
          [
            "Usa chaves criptográficas separadas para texto da nota, arquivos e metadados",
            "Misturar essas responsabilidades sob uma única chave reutilizável",
          ],
          [
            "Usa criptografia autenticada AES-256-GCM, com política (expiração / limites de acesso) vinculada ao texto cifrado",
            "Depender de “criptografia” que ignora quem pode abrir a nota ou por quanto tempo",
          ],
          [
            "Suporta links de uso único e com expiração para limitar o acesso remanescente",
            "Manter documentos disponíveis indefinidamente por padrão, por conveniência",
          ],
          [
            "Permite adicionar uma senha opcional como segundo fator para o link",
            "Impedir que um destinatário autorizado salve ou imprima depois de abrir",
          ],
          [
            "Reduz cópias online desnecessárias antes e depois da entrega",
            "Substituir processo organizacional, julgamento do destinatário ou armazenamento de longo prazo em cofre",
          ],
        ],
      },
      paragraphsAfterTable: [
        "Essa abordagem não pode impedir que um destinatário autorizado salve uma cópia depois de abrir o documento — nenhuma tecnologia pode. O que ela reduz é o número de cópias desnecessárias que permanecem online antes e depois da entrega.",
      ],
    },
    {
      title: "Considerações finais",
      takeaway:
        "O melhor controle costuma ser o tempo de vida mais curto — apenas as pessoas que precisam, apenas pelo tempo que precisam.",
      paragraphs: [
        "A Internet tornou o compartilhamento de documentos quase sem esforço. Também tornou notavelmente fácil mantê-los para sempre.",
        "A maioria dos documentos confidenciais não precisa permanecer acessível por meses ou anos. Eles só precisam chegar em segurança ao destinatário pretendido.",
        "Escolher um método que criptografa antes do upload, limita cópias desnecessárias e remove os dados depois que cumpriram seu propósito é uma das formas mais simples de melhorar a privacidade — sem tornar muito mais difícil o compartilhamento cotidiano de documentos.",
        "A medida de segurança mais forte não é sempre a criptografia mais sofisticada. Às vezes é simplesmente garantir que um documento confidencial exista apenas para as pessoas que precisam dele, e apenas pelo tempo que precisam.",
      ],
    },
  ],
  ctaTitle: "Envie o documento. Mantenha as cópias sob controle.",
  ctaBody:
    "Criptografe um arquivo no seu navegador, defina uma expiração ou abertura de uso único, e compartilhe um link — não um anexo permanente que vive para sempre na caixa de entrada de alguém.",
  ctaButton: "Transferir um arquivo com segurança",
};
