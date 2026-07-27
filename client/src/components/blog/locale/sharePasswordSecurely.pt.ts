import type { SharePasswordSecurelyArticleCopy } from "./sharePasswordSecurely.types";

export const sharePasswordSecurelyPt: SharePasswordSecurelyArticleCopy = {
  heroAlt:
    "Laptop numa secretária a mostrar uma ligação segura PrivateNote.ai pronta a copiar, com expiração após uma visualização e passphrase ativada",
  heroCaption:
    "Partilhe uma ligação segura—não a palavra-passe em si—com expiração curta, visualização única e uma passphrase opcional.",
  intro: [
    "Partilhar uma palavra-passe parece uma tarefa quotidiana e menor—até algo correr mal.",
    "Quer um colega precise de acesso temporário a uma ferramenta interna, um representante de apoio ao cliente peça acesso ao sistema, ou tenha de enviar credenciais Wi-Fi a um visitante, a opção mais rápida parece muitas vezes colar a palavra-passe em texto simples num chat do Microsoft Teams, numa mensagem WhatsApp ou num e-mail rápido.",
    "Infelizmente, essa comodidade deixa um rasto digital permanente. Assim que um segredo entra nestes canais, é sincronizado entre dispositivos, pesquisável através de funções de pesquisa, armazenado em cópias de segurança automáticas da caixa de correio e retido indefinidamente nos arquivos de mensagens empresariais. Uma palavra-passe que se destinava a ser temporária torna-se uma responsabilidade permanente.",
    "Felizmente, existe uma forma melhor de proteger as suas credenciais.",
  ],
  sections: [
    {
      title: "O problema central da partilha em texto simples",
      paragraphs: [
        "As aplicações de e-mail e chat são excelentes plataformas de colaboração, mas nunca foram concebidas para guardar segredos. Embora os sistemas modernos normalmente cifrem os dados durante a transmissão, falham na efemeridade—garantir que os segredos desaparecem depois de terem cumprido o seu propósito.",
        "Quando cola uma palavra-passe num chat ou thread de e-mail padrão, perde imediatamente o controlo do seu ciclo de vida. Permanece armazenada nas caixas de correio, pesquisável nos registos de chat anos mais tarde, e visível nas notificações dos dispositivos ou ecrãs de bloqueio. Se a sua conta ou a do destinatário for algum dia comprometida, essas histórias de chat em texto simples tornam-se uma mina de ouro para atacantes.",
      ],
    },
    {
      title: "GDPR (DSGVO) e riscos de conformidade na Europa",
      paragraphs: [
        "Para organizações europeias, isto não é apenas uma preocupação de segurança—é um risco de conformidade. Nos termos do Regulamento Geral sobre a Proteção de Dados (GDPR / DSGVO), as empresas são legalmente obrigadas a proteger o acesso a dados pessoais com medidas técnicas e organizacionais de topo.",
        "Colar credenciais ativas em registos de chat na cloud alojados nos EUA ou em servidores de e-mail sem cifra dedicada de ponta a ponta pode aumentar a exposição à conformidade, especialmente se essas palavras-passe derem acesso a bases de dados com dados de clientes ou colaboradores.",
        "Usar cifra local no browser reduz drasticamente os locais onde as credenciais podem permanecer, alinhando as entregas do dia a dia com uma abordagem privacy-first. Isto não é aconselhamento jurídico; trate a partilha segura de credenciais como uma parte de um controlo de acessos mais amplo, gestão de palavras-passe e política de rotação.",
      ],
    },
    {
      title: "Como funcionam as ligações cifradas no browser",
      paragraphs: [
        "Para partilha rápida e pontual de palavras-passe, as ligações de utilização única cifradas no browser estão entre as opções mais seguras e eficientes. Em vez de enviar a credencial em si, envia uma ligação única e temporária para uma nota cifrada.",
        "O browser faz o trabalho pesado: a palavra-passe é cifrada localmente antes do carregamento, pelo que o servidor intermediário armazena ciphertext—não a sua palavra-passe em bruto. A chave de decifração fica tipicamente no fragmento da ligação, que os browsers não enviam ao servidor.",
      ],
      flowIntro: "Para partilhar um segredo com uma ligação temporária e autodestrutiva, siga estes quatro passos:",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Introdução e cifra local",
          body: "Introduza a palavra-passe numa ferramenta segura. O browser cifra-a localmente com uma chave que nunca sai da sua máquina em texto simples.",
        },
        {
          step: "Passo 2",
          title: "Gerar a ligação",
          body: "A ferramenta carrega apenas o payload cifrado para um servidor zero-knowledge e cria uma ligação de partilha única. O material de decifração fica com a ligação—não num cofre do lado do servidor de segredos legíveis.",
        },
        {
          step: "Passo 3",
          title: "Enviar a ligação",
          body: "Copie e envie a ligação via Microsoft Teams, e-mail ou WhatsApp. A plataforma de chat vê um URL, não a sua palavra-passe.",
        },
        {
          step: "Passo 4",
          title: "Revelação e autodestruição",
          body: "O browser do destinatário decifra o conteúdo localmente. Dependendo da política de partilha, o payload cifrado pode depois ser eliminado do servidor após a visualização ou após uma janela curta de expiração.",
        },
      ],
      midCta: {
        body: "Precisa de partilhar uma palavra-passe agora? Crie uma nota cifrada de utilização única e envie a ligação segura em vez da palavra-passe em si.",
        button: "Criar uma nota privada",
      },
    },
    {
      title: "Dica de alta segurança: partilha em canais separados",
      paragraphs: [
        "Uma ligação cifrada é tão segura quanto o canal que usa para a enviar. Se um terceiro malicioso obtiver acesso à sua caixa de entrada do Teams ou e-mail, pode interceptar a ligação antes de o destinatário a abrir.",
        "Muitas ferramentas de partilha segura—incluindo PrivateNote.ai—oferecem uma definição opcional para proteger a nota com uma palavra-passe adicional (passphrase wrapping). Isto não está ativado por predefinição: ativa-o quando cria a nota, escolhe uma passphrase e o destinatário tem de a introduzir antes de o segredo ser revelado.",
        "Para evitar um único ponto de falha (SPoF) com credenciais altamente sensíveis, use essa opção para partilha em canais separados: gere a ligação cifrada com proteção por passphrase ativada, envie a ligação pelo canal principal (por exemplo, Microsoft Teams) e envie a passphrase por um canal completamente diferente—de preferência um messenger focado na privacidade como Signal ou Threema, ou uma breve chamada telefónica.",
      ],
      callout:
        "Um atacante precisaria tanto da ligação como da passphrase. Essa separação é o que torna a partilha em canais separados eficaz.",
    },
    {
      title: "Partilha via gestores de palavras-passe vs. ligações de utilização única",
      paragraphs: [
        "Ambos os métodos podem ser altamente seguros, mas servem propósitos diferentes. Escolher a ferramenta certa depende de quanto tempo o destinatário precisa de acesso.",
      ],
      comparisonTable: {
        headers: ["Categoria", "Ideal para", "Limitações técnicas"],
        rows: [
          [
            "E-mail, Teams ou WhatsApp",
            "Não recomendado para palavras-passe",
            "Deixa cópias permanentes e pesquisáveis em texto simples em cópias de segurança e arquivos",
          ],
          [
            "Gestores de palavras-passe",
            "Acesso contínuo: partilha de cofres com familiares, departamentos internos ou equipas de confiança",
            "Exige que ambas as partes mantenham contas ativas e compatíveis de gestores de palavras-passe",
          ],
          [
            "Ligações cifradas de utilização única",
            "Acesso temporário: freelancers, apoio ao cliente, visitantes e entregas pontuais",
            "Qualquer pessoa com a ligação pode ler o segredo, a menos que esteja protegido por uma passphrase secundária",
          ],
        ],
        after: [
          "Como regra prática: use um **gestor de palavras-passe** para acesso partilhado contínuo, e uma **ligação cifrada de utilização única** quando a credencial deve mudar pouco depois da entrega.",
        ],
      },
    },
    {
      title: "Quando usar uma ligação de palavra-passe de utilização única",
      paragraphs: [
        "A partilha de palavras-passe de utilização única é ideal para credenciais transacionais que só precisam de ser comunicadas uma vez. Exemplos comuns em locais de trabalho europeus incluem:",
      ],
      useCaseTable: {
        headers: ["Departamento", "Casos de uso comuns"],
        rows: [
          [
            "Administração e escritório",
            "Palavras-passe do router ou Wi-Fi de convidados do escritório, credenciais de admin da impressora ou definições de smart office",
          ],
          [
            "Finanças e negócios",
            "Credenciais para o seu contabilista ou auditores financeiros externos",
          ],
          [
            "IT e operações",
            "Onboarding de prestadores de serviços de IT externos temporários, ou partilha de logins temporários de contractors",
          ],
          [
            "Equipas técnicas",
            "Credenciais de bases de dados, chaves API, chaves SSH ou palavras-passe de plataformas cloud com programadores",
          ],
        ],
      },
    },
    {
      title: "Boas práticas e erros a evitar",
      subsections: [
        {
          title: "Imponha a rotação",
          paragraphs: [
            "Sempre que partilhar uma palavra-passe, trate-a como temporária. Peça ao destinatário que a altere assim que iniciar sessão e confirme que a rotação está concluída antes de considerar a entrega terminada.",
          ],
        },
        {
          title: "Gere palavras-passe fortes e locais",
          paragraphs: [
            "Não invente as palavras-passe sozinho. Use uma ferramenta local como o [gerador de palavras-passe](app:password-generator) do PrivateNote, ou [passwords.lu](https://passwords.lu) para opções de passphrase e PIN. Ambos funcionam localmente—nada é carregado. Para o modelo técnico, veja [Como geramos palavras-passe seguras](blog:how-we-generate-passwords).",
          ],
        },
        {
          title: "Mantenha tempos de expiração curtos",
          paragraphs: [
            "A maioria das palavras-passe só precisa de existir durante alguns minutos ou horas. Prefira uma única visualização ou uma janela curta, como duas horas, quando isso ainda se adequa ao fluxo de trabalho do destinatário.",
          ],
        },
        {
          title: "Não coloque palavras-passe em títulos ou assuntos",
          paragraphs: [
            "Nunca coloque palavras-passe em texto simples no assunto de e-mails, títulos de sistemas de tickets, nomes de canais do Teams, títulos de grupos WhatsApp, nomes de documentos ou convites de calendário. Esses campos raramente recebem o mesmo cuidado que o corpo das mensagens—e persistem nos índices de pesquisa.",
          ],
        },
        {
          title: "Mantenha o contexto fora da nota segura",
          paragraphs: [
            "Se estiver a partilhar uma palavra-passe de base de dados, não escreva “Palavra-passe da base de dados para CRM de produção: MySecret123!” na nota. Coloque apenas o segredo em bruto na ligação cifrada. Se a ligação for interceptada, o atacante não deve também saber que conta ou sistema desbloqueia.",
          ],
        },
      ],
      calloutTitle: "Erro comum",
      callout:
        "Enviar tanto a ligação cifrada como a respetiva passphrase na mesma mensagem do Teams, chat WhatsApp ou e-mail anula a partilha em canais separados e recria um único ponto de falha.",
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "O Microsoft Teams ou o WhatsApp são mais seguros do que o e-mail?",
          answer:
            "Os seus protocolos de transmissão são geralmente seguros, mas funcionam mesmo assim como arquivos de chat de longo prazo. Qualquer palavra-passe colada num thread pode permanecer pesquisável indefinidamente, o que a torna uma vulnerabilidade persistente.",
        },
        {
          question: "O GDPR (DSGVO) afeta a forma como partilho palavras-passe?",
          answer:
            "Nos termos do artigo 32.º do GDPR, as organizações devem implementar medidas técnicas e organizacionais adequadas para proteger os dados pessoais. Armazenar palavras-passe em texto simples em cópias de segurança na cloud ou cadeias de e-mail abertas aumenta a exposição à conformidade. Ligações zero-knowledge autodestrutivas mantêm a pegada das credenciais mais pequena.",
        },
        {
          question: "Devo enviar a ligação e a passphrase juntos?",
          answer:
            "Não. Enviar ambas as peças na mesma mensagem anula a partilha em canais separados. Envie a passphrase por um meio separado—de preferência Signal ou Threema, ou uma chamada telefónica.",
        },
        {
          question: "Devo usar um gestor de palavras-passe ou uma ligação de utilização única?",
          answer:
            "Use um gestor de palavras-passe para acesso partilhado de longo prazo. Use uma ligação de utilização única cifrada no browser quando só precisa de comunicar uma palavra-passe uma vez.",
        },
        {
          question: "Ainda preciso de um gestor de palavras-passe?",
          answer:
            "Sim. Os gestores de palavras-passe continuam a ser o sítio certo para armazenar e gerir as credenciais que mantém. As ligações cifradas de utilização única complementam-nos para entregas controladas e temporárias.",
        },
      ],
    },
    {
      title: "Considerações finais",
      paragraphs: [
        "A partilha segura de palavras-passe não tem de ser um gargalo no seu fluxo de trabalho. Exige apenas uma pequena mudança de hábito: deixe de deixar dados sensíveis permanentemente em registos de chat e históricos de caixas de entrada.",
        "Ao usar cifra local no browser e ligações autodestrutivas, reduz o risco de segurança e conformidade organizacional mantendo as entregas rápidas e práticas.",
        "Da próxima vez que precisar de partilhar uma palavra-passe, evite copiá-la e colá-la no Microsoft Teams, WhatsApp ou e-mail. Crie uma nota cifrada de utilização única, envie a ligação em vez da palavra-passe e deixe a nota expirar depois de ter cumprido o seu propósito.",
      ],
    },
  ],
  ctaTitle: "Pronto para partilhar com segurança?",
  ctaBody:
    "Crie uma nota privada em PrivateNote.ai para cifrar credenciais no browser antes do carregamento. As notas podem expirar automaticamente ou após a leitura, a proteção opcional com passphrase adiciona outra camada, e os dados das notas cifradas são tratados sob jurisdição da UE.",
  ctaButton: "Criar uma nota privada",
};
