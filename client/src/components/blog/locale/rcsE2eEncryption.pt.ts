import type { RcsE2eEncryptionArticleCopy } from "./rcsE2eEncryption.types";

export const rcsE2eEncryptionPt: RcsE2eEncryptionArticleCopy = {
  heroAlt:
    "Um iPhone e um telefone Android com ícones de cadeado em balões de mensagem, conectados por um cadeado central representando RCS criptografado de ponta a ponta",
  heroCaption:
    "O RCS multiplataforma finalmente está se atualizando: a mesma garantia de criptografia de ponta a ponta, seja o balão azul ou verde.",
  intro: [
    "Durante anos, uma das maiores frustrações na mensagem móvel não foi a falta de recursos, mas a falta de privacidade consistente.",
    "Usuários da Apple contavam com conversas criptografadas de ponta a ponta pelo iMessage, enquanto usuários Android podiam se beneficiar da criptografia ao usar o Google Messages com outros dispositivos Android. As mensagens enviadas entre Android e iPhone nunca tiveram a mesma proteção. As conversas multiplataforma dependiam do Rich Communication Services (RCS), mas sem criptografia de ponta a ponta interoperável.",
    "Isso finalmente está mudando.",
    "O Google anunciou recentemente que a mensagem RCS criptografada de ponta a ponta entre Android e iPhone está começando a ser implementada, após a publicação do mais recente GSMA RCS Universal Profile, que incorpora o protocolo Messaging Layer Security (MLS). À medida que o suporte se expande entre dispositivos e aplicativos de mensagens, bilhões de usuários ganharão mais privacidade em conversas do dia a dia.",
    "Este é um marco importante para a comunicação digital. Também é uma boa oportunidade para entender o que [a criptografia de ponta a ponta](blog:what-is-end-to-end-encryption) realmente protege — e o que não protege.",
  ],
  sections: [
    {
      title: "Um padrão melhor para a mensagem do dia a dia",
      paragraphs: [
        "A transição do SMS para o RCS modernizou as mensagens de texto com recursos como compartilhamento de fotos de alta qualidade, indicadores de digitação, confirmações de leitura e conversas em grupo mais completas. A segurança, no entanto, permaneceu inconsistente dependendo de quais dispositivos estavam envolvidos.",
        "Até agora, usuários Android que trocavam mensagens com outros usuários Android podiam contar com criptografia de ponta a ponta pelo Google Messages, enquanto usuários de iPhone tinham a mesma proteção dentro do iMessage. As mensagens trocadas entre Android e iPhone, porém, não contavam com criptografia de ponta a ponta interoperável.",
        "O padrão RCS atualizado muda isso. Conforme o suporte é implementado, usuários de ambas as plataformas finalmente podem se beneficiar das mesmas garantias fundamentais de privacidade, independentemente de qual telefone possuem.",
        "Para uma tecnologia de comunicação usada por bilhões de pessoas, este é um passo importante para frente.",
      ],
    },
    {
      title: "O que a criptografia de ponta a ponta realmente significa",
      paragraphs: [
        "Criptografia de ponta a ponta significa que uma mensagem é criptografada antes de deixar o dispositivo do remetente e só pode ser descriptografada no dispositivo do destinatário.",
        "Diferentemente da criptografia de transporte tradicional, em que um provedor de serviço pode conseguir acessar as mensagens quando elas chegam aos seus servidores, a criptografia de ponta a ponta garante que apenas os dispositivos em comunicação possuam as chaves necessárias para ler a conversa. O serviço de mensagens transporta dados criptografados, mas não consegue descriptografar seu conteúdo.",
        "Para os usuários, o benefício é simples: sua conversa permanece privada entre você e a pessoa com quem está falando.",
        "A criptografia de ponta a ponta implementada corretamente protege contra muitas ameaças comuns. Alguém monitorando uma rede Wi-Fi pública não consegue simplesmente ler suas mensagens, os provedores de internet não conseguem inspecionar seu conteúdo, e uma invasão aos servidores do provedor de mensagens exporia dados criptografados em vez de conversas legíveis.",
        "Para a comunicação cotidiana, isso representa uma melhoria significativa na privacidade. Para uma definição técnica mais profunda, veja nosso guia sobre [o que significa criptografia de ponta a ponta](blog:what-is-end-to-end-encryption).",
      ],
    },
    {
      title: "A criptografia tem limites",
      paragraphs: [
        "Por mais importante que seja a criptografia de ponta a ponta, ela costuma ser mal compreendida.",
        "A criptografia protege as mensagens enquanto são transmitidas e enquanto são armazenadas pelo provedor de mensagens. Ela não controla o que acontece depois que a mensagem foi entregue.",
        "Depois que uma mensagem é descriptografada no telefone do destinatário, ela volta a ser informação comum. O destinatário pode mantê-la indefinidamente, encaminhá-la para outra pessoa, copiar seu conteúdo para outro aplicativo, ou simplesmente fazer uma captura de tela. Dependendo da plataforma de mensagens, as conversas também podem ser sincronizadas entre vários dispositivos ou incluídas em backups na nuvem.",
        "Em outras palavras, a criptografia de ponta a ponta protege a entrega — ela não garante que a informação desapareça depois de ser lida.",
      ],
      callout:
        "Essa distinção se torna cada vez mais importante quando a informação compartilhada é particularmente sensível — senhas, códigos de recuperação, chaves de API e outras credenciais que não deveriam viver para sempre em um histórico de chat pesquisável.",
    },
    {
      title: "Nem todo segredo pertence ao histórico do chat",
      paragraphs: [
        "A maioria das conversas merece ser preservada. Mensagens com a família, conversas com amigos ou trocas relacionadas ao trabalho geralmente se tornam um registro útil que as pessoas esperam poder revisitar depois.",
        "Credenciais sensíveis são diferentes.",
        "Imagine enviar uma senha de administrador temporária para um colega. A senha viaja com segurança pela internet graças à criptografia de ponta a ponta, mas seis meses depois ela ainda pode estar em um histórico de conversa pesquisável. O mesmo se aplica a chaves de API, códigos de recuperação, frases-semente de criptomoedas, informações confidenciais de clientes ou credenciais de login temporárias.",
        "Em muitos incidentes reais de segurança, o problema não é que o segredo tenha sido interceptado durante a transmissão. É que ele permaneceu armazenado em algum lugar muito depois de quando deveria ter sido esquecido.",
        "À medida que as mensagens se tornam cada vez mais seguras, a atenção está gradualmente se voltando para um desafio diferente: reduzir a persistência desnecessária. É por isso que alguns [segredos nunca devem ser enviados no chat](blog:secrets-never-send-in-chat) — criptografados ou não.",
      ],
    },
    {
      title: "Quando os links de uso único fazem mais sentido",
      paragraphs: [
        "Para informações que só precisam ser compartilhadas uma vez, deixá-las dentro de uma conversa permanente nem sempre é o ideal.",
        "Uma alternativa cada vez mais comum é compartilhar informações sensíveis por meio de [links criptografados de uso único](blog:one-time-secret-links) que expiram automaticamente ou se tornam inacessíveis após serem visualizados. Em vez de incorporar o segredo diretamente em uma conversa em andamento, o destinatário abre um link dedicado, recupera a informação, e o link eventualmente expira — ou, em alguns casos, só pode ser acessado uma vez.",
        "Essa abordagem não substitui a mensagem criptografada. Em vez disso, ela complementa ao resolver um problema diferente.",
        "Aplicativos de mensagens são projetados para preservar conversas. Links de uso único são projetados para minimizar a exposição de longo prazo de informações que, idealmente, não deveriam permanecer armazenadas indefinidamente.",
        "Seja compartilhando uma senha temporária, um token de API, uma chave de licença de software ou outro valor confidencial, limitar por quanto tempo essa informação existe pode reduzir significativamente o risco de divulgação acidental posterior.",
      ],
    },
    {
      title: "Privacidade é mais do que criptografia",
      paragraphs: [
        "A implementação de mensagens RCS criptografadas de ponta a ponta e interoperáveis é uma notícia genuinamente boa. Pela primeira vez, usuários de Android e iPhone podem contar com o mesmo nível de proteção, independentemente do ecossistema que usam.",
        "É também um lembrete de que privacidade envolve mais do que apenas criptografia.",
        "Proteger as informações enquanto elas viajam pela internet é essencial, mas pensar no que acontece depois também é. Algumas informações merecem permanecer disponíveis por anos. Outras informações — particularmente senhas, códigos de recuperação e credenciais temporárias — costumam ser mais seguras quando existem apenas pelo tempo necessário.",
        "Aplicativos de mensagens modernos e serviços de compartilhamento de segredos de uso único servem a propósitos diferentes. Nenhum substitui o outro; em vez disso, eles tratam de aspectos diferentes da comunicação segura. Escolher a abordagem certa depende do que você está compartilhando e por quanto tempo isso precisa existir.",
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "Isso substitui o SMS?",
          answer:
            "Não. As mensagens SMS tradicionais continuam sem criptografia. As novas proteções se aplicam apenas a conversas RCS compatíveis, quando tanto os dispositivos quanto os aplicativos de mensagens suportam o padrão RCS criptografado de ponta a ponta mais recente.",
        },
        {
          question: "Google ou Apple conseguem ler mensagens RCS criptografadas?",
          answer:
            "A criptografia de ponta a ponta é projetada de forma que apenas os dispositivos em comunicação possuam as chaves necessárias para descriptografar as mensagens. Os provedores transportam dados criptografados, mas não conseguem acessar o conteúdo em texto simples de suas conversas.",
        },
        {
          question: "Alguém ainda pode fazer uma captura de tela?",
          answer:
            "Sim. Depois que uma mensagem é descriptografada no dispositivo do destinatário, ele ainda pode fazer capturas de tela, copiar o conteúdo ou encaminhá-lo a outras pessoas. A criptografia de ponta a ponta protege a transmissão da mensagem, não o que o destinatário decide fazer com ela depois.",
        },
        {
          question: "Os links de uso único são mais seguros do que os aplicativos de mensagens?",
          answer:
            "Não necessariamente — eles resolvem um problema diferente. A mensagem criptografada de ponta a ponta é excelente para conversas contínuas. Os [links de uso único ou expiráveis](blog:one-time-secret-links) costumam ser mais adequados para compartilhar informações sensíveis que não deveriam permanecer indefinidamente no histórico do chat.",
        },
      ],
    },
  ],
  referencesTitle: "Leitura adicional",
  references: [
    {
      label:
        "Usuários de Android e iPhone agora podem contar com mensagens RCS criptografadas de ponta a ponta (Google Blog)",
      href: "https://blog.google/products-and-platforms/platforms/android/android-ios-end-to-end-encrypted-rcs-messaging/",
    },
  ],
  ctaTitle: "Compartilhe segredos que não deveriam viver no chat",
  ctaBody:
    "Quando precisar entregar a alguém uma senha, chave de API ou código de recuperação, envie uma nota de uso único criptografada no navegador em vez de colá-la no Messages. Defina uma expiração curta ou autodestruição após leitura, para que o segredo não fique parado em um histórico pesquisável.",
  ctaButton: "Criar uma nota privada",
};
