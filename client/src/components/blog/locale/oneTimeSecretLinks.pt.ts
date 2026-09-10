import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksPt: OneTimeSecretLinksArticleCopy = {
  intro: [
    "Um **link de uso único** é uma URL para entregar informação sensível sem deixar o texto em claro de forma permanente no e-mail ou no histórico de um chat. Quem recebe abre o link, revela o segredo no navegador e a cópia cifrada no servidor deixa de estar disponível segundo as regras de acesso e de validade.",
    "Serve para senhas, chaves de API, códigos de recuperação, credenciais temporárias e mensagens privadas que precisam chegar uma vez e não precisam de uma conversa permanente.",
    "O problema nem sempre é a interceptação. É a **retenção**. A criptografia protege o acesso. O caráter efêmero reduz o tempo em que cópias desnecessárias ficam disponíveis. Um link de uso único cobre um terceiro trabalho: a **entrega temporária**.",
  ],
  earlyCta: {
    body: "Precisa enviar um agora?",
    linkLabel: "Crie um link cifrado de uso único com o PrivateNote",
  },
  sections: [
    {
      title: "O que é um link de uso único?",
      paragraphs: [
        "Há vários nomes para a mesma ideia: link secreto, nota autodestrutiva, link que expira, «queimar após leitura». O rótulo muda. As propriedades de segurança não vêm automaticamente com o nome.",
        "Um produto chamado «segredo de uso único» não implica, por si, que a criptografia aconteça no navegador, que o fornecedor não possa ler o conteúdo, que a chave fique fora do servidor, que a eliminação siga mesmo a leitura, ou que os metadados desapareçam. Isso são decisões de desenho. Avalie as propriedades, não o slogan.",
        "Uma lista útil: onde o texto em claro é cifrado? O servidor recebe alguma vez a chave? O que acontece depois da consulta prevista? Quanto tempo um link não usado continua disponível? O que a pré-visualização de um chat pede se alguém colar a URL?",
      ],
    },
    {
      title: "Como funciona um link de uso único?",
      paragraphs: [
        "Num desenho do lado do cliente como o do PrivateNote, o segredo é cifrado no navegador de quem envia antes do envio. O servidor guarda texto cifrado. O navegador de quem recebe decifra localmente. O texto de uma nota usa AES-256-GCM através da API Web Crypto.",
      ],
      beforeFlowSteps: "**Na prática, o percurso completo é este:**",
      flowSteps: [
        {
          title: "Chave e criptografia no navegador",
          step: "Passo 1: o seu navegador",
          body: "Escreve o segredo localmente. O navegador gera o material criptográfico e cifra o texto em claro antes de qualquer pedido de rede sair do dispositivo.",
        },
        {
          title: "Só sobe o texto cifrado",
          step: "Passo 2: o servidor",
          body: "Só a carga cifrada é enviada. O servidor guarda um texto que não consegue ler, porque não recebe o claro nem a chave do fragmento.",
        },
        {
          title: "A chave fica no link",
          step: "Passo 3: a URL",
          body: "A chave de decifragem vai para o fragmento da URL—a parte depois de #. O caminho público identifica a nota; o fragmento fica no navegador numa navegação HTTPS habitual.",
        },
        {
          title: "Revelar, decifrar e aplicar as regras de acesso",
          step: "Passo 4: quem recebe",
          body: "Abrir a página não chega. É preciso clicar para revelar, e só então se pede o texto cifrado. O navegador decifra localmente. Depois de uma revelação bem-sucedida, o PrivateNote aplica o limite de visualizações—uma por padrão—e apaga o texto cifrado quando esse limite é atingido. Links não usados também expiram no tempo.",
        },
      ],
      afterFlowSteps: [
        "Nem todos os produtos vendidos como link de uso único seguem este modelo. Alguns cifram no servidor depois de receber o seu texto, ou geram a chave lá, o que permitiria ao serviço ler o segredo. Outros apagam segundo um calendário mas guardam cópias recuperáveis. Pergunte se o desenho completo está implementado—não só se o link expira.",
        "Para a arquitetura de criptografia do PrivateNote, incluindo o encapsulamento com senha via Argon2id, veja [Como funciona](app:how-it-works).",
      ],
    },
    {
      title: "Por que o fragmento da URL importa",
      paragraphs: [
        "Este detalhe passa facilmente despercebido, e é a base desta arquitetura.",
        "Numa navegação HTTPS normal, o navegador envia o caminho e a consulta ao servidor. O [fragmento da URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment)—tudo o que vem depois de #—fica no navegador e não entra nesse pedido. Um sistema bem desenhado pode portanto guardar o texto cifrado num identificador como `/note/abc123` e o material de decifragem em `#…`, fora dos registos ordinários dessa carga de página.",
        "Colocar uma chave depois de # não torna uma aplicação segura por si. A criptografia à volta tem de ser sólida: uma chave aleatória forte, cifra autenticada e um servidor que nunca precisa do texto em claro. O fragmento serve para separar essas peças, não para as contornar.",
      ],
    },
    {
      title: "Link de uso único, link que expira e mensagem que desaparece",
      paragraphs: [
        "Estas ideias misturam-se com frequência. São controlos diferentes, e um mesmo produto pode combiná-los.",
      ],
      bullets: [
        {
          label: "Link de uso único",
          body: "A disponibilidade depende sobretudo do acesso. Depois da consulta prevista—no PrivateNote, uma revelação bem-sucedida que atinge o limite—a carga cifrada desaparece do servidor.",
        },
        {
          label: "Link que expira",
          body: "A disponibilidade depende sobretudo do tempo. O link continua recuperável até ao prazo, tenha sido aberto ou não.",
        },
        {
          label: "Mensagem que desaparece",
          body: "Faz parte de uma conversa em curso. A retenção segue a política do messenger, que ainda pode deixar cópias de segurança, citações ou cópias no dispositivo.",
        },
      ],
      callout:
        "**O PrivateNote combina acesso e tempo.** Notas novas começam com uma revelação bem-sucedida e também expiram se ninguém as abrir—um dia por padrão, com prazos mais curtos ou mais longos conforme o plano. É uma entrega temporária: recupera-se, ou espera-se, e a cópia no servidor desaparece.",
    },
    {
      title: "Os links de uso único são seguros?",
      paragraphs: [
        "Podem ser. A segurança depende da implementação e de como o link é enviado—não da expressão «uso único».",
        "Um desenho sério deve considerar criptografia no cliente, chaves aleatórias fortes, o que o servidor pode ver, validade, o sentido do acesso, proteção opcional por senha, verificação opcional de quem recebe, metadados, fugas do link, um dispositivo comprometido e o comportamento de quem recebe.",
        "O PrivateNote cifra no navegador, guarda texto cifrado, mantém a chave no fragmento da URL, limita por padrão a uma revelação e faz expirar notas não usadas. Pode acrescentar uma senha ou, nos planos pagos, verificação do destinatário. Quem recebe não precisa de conta.",
        "Um link de uso único **não protege** contra um dispositivo comprometido, alguém que copia o segredo depois de o ver, uma captura de tela ou uma foto, ou o envio da URL completa—incluindo o fragmento—à pessoa errada. Trate o link inteiro como a capacidade de acesso.",
      ],
    },
    {
      title: "Quando usar um link de uso único?",
      paragraphs: [
        "Quando o segredo tem um trabalho curto: chegar, ser usado e deixar de viver no canal pelo qual o enviou.",
      ],
      subsections: [
        {
          title: "Senhas",
          paragraphs: [
            "Um link de uso único encaixa bem para entregar uma senha temporária ou recém-criada a uma pessoa, sem deixar o texto em claro no correio ou no chat. Para o fluxo específico, veja [como compartilhar uma senha de forma segura](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "Chaves de API e tokens",
          paragraphs: [
            "Quem desenvolve ou colabora como contratado muitas vezes precisa de uma chave uma vez. Enviá-la por um link evita deixar a credencial em threads do Slack, tickets ou comentários Git. Veja [como compartilhar uma chave de API de forma segura](blog:how-to-share-api-key-securely).",
          ],
        },
        {
          title: "Códigos de recuperação",
          paragraphs: [
            "Útil quando um código de cópia de segurança ou de recuperação 2FA precisa mesmo de ir para outra pessoa autorizada—e não deve continuar pesquisável no fio que o transportou.",
          ],
        },
        {
          title: "Mensagens privadas",
          paragraphs: [
            "Informação que precisa de ser comunicada uma vez, sem se tornar uma conversa permanente. Quem recebe pode abrir a nota sem criar conta. Veja [enviar uma mensagem secreta sem conta](blog:send-secret-message-without-account).",
          ],
        },
        {
          title: "Ficheiros sensíveis",
          paragraphs: [
            "Um arquivo pede mais cuidado: tamanho, download, pré-visualização e uma janela de acesso distinta depois de abrir a nota. No PrivateNote, enviar um arquivo exige conta de quem envia; abrir, não. Anexos continuam recuperáveis durante uma janela limitada após a revelação—uma hora por padrão. Use a [transferência segura de arquivos](app:secure-file-transfer) quando o conteúdo é um documento e não um segredo curto.",
          ],
        },
      ],
    },
    {
      title: "Quando não usar?",
      paragraphs: [
        "O link de uso único é a ferramenta errada quando o trabalho é armazenar, colaborar ou guardar um registo que está obrigado a conservar.",
      ],
      poorFits: [
        "Armazenar senhas a longo prazo: use o cofre de um gestor de senhas.",
        "Uma conversa contínua: use um messenger que ambas as partes já usam, por exemplo o Signal.",
        "Arquivos da organização que têm de ser conservados para auditoria ou obrigação legal.",
        "Segredos que não precisam de ser transmitidos—gere-os no lugar, ou não os compartilhe.",
        "Frases semente de criptomoedas e outros segredos mestres irrecuperáveis: um link ainda pode vazar se a URL completa for copiada. Leia [frases semente cripto e links de uso único](blog:crypto-seed-phrase-one-time-link) antes de usar este padrão.",
      ],
    },
    {
      title: "Link de uso único, e-mail, mensagens e gestores de senhas",
      paragraphs: [
        "A comparação útil é o propósito e a persistência—não um ranking de qual canal é «seguro».",
      ],
      comparisonTable: {
        headers: [
          "Meio",
          "Uso principal",
          "Criptografia de ponta a ponta",
          "Persistência típica",
          "Adequado a uma entrega pontual?",
        ],
        rows: [
          [
            "E-mail",
            "Correspondência duradoura",
            "A criptografia em trânsito é comum; a de ponta a ponta em geral não é o valor predefinido",
            "Costuma ficar em várias caixas, cópias de segurança e pesquisas",
            "Mau encaixe para um segredo em claro",
          ],
          [
            "Slack / Teams",
            "Conversa de trabalho e pesquisa",
            "Cifrado em trânsito e em repouso na plataforma; não de ponta a ponta por padrão",
            "Histórico do espaço de trabalho pesquisável e exportável",
            "Mau encaixe para um segredo em claro; aceitável para enviar um link",
          ],
          [
            "SMS / iMessage",
            "Mensagens pessoais",
            "Varia muito conforme operadora e plataforma",
            "Muitas vezes com cópia de segurança ou sincronização na nuvem",
            "Mau encaixe para um segredo em claro",
          ],
          [
            "WhatsApp",
            "Conversa privada",
            "Ponta a ponta nas conversas; as cópias de segurança podem não o ser",
            "Cópias no dispositivo e, se ativadas, na nuvem",
            "Melhor do que o e-mail para conversar; continua a ser um mau lugar para deixar uma senha",
          ],
          [
            "Signal",
            "Conversa privada",
            "Ponta a ponta",
            "As mensagens que desaparecem são configuráveis",
            "Uma alternativa razoável se ambas as partes já o usam",
          ],
          [
            "Gestor de senhas",
            "Armazenar e compartilhar credenciais",
            "Sim, por concepção",
            "Feito para retenção a longo prazo",
            "Excelente para equipas e acesso estável; muitas vezes mais pesado do que uma entrega pontual",
          ],
          [
            "PrivateNote",
            "Entrega cifrada temporária",
            "Criptografia no cliente; chave no fragmento da URL",
            "Limite de visualizações mais validade; o texto cifrado é apagado quando essas condições se cumprem",
            "Desenhado para este uso",
          ],
        ],
      },
    },
    {
      title: "O problema da pré-visualização do link",
      paragraphs: [
        "Muitas apps de chat pedem uma URL recebida para montar uma pré-visualização—título, descrição, miniatura. Se carregar a página contasse como uma leitura, esse robot gastaria o link antes de quem recebe o abrir.",
        "O PrivateNote não trata um carregamento de página como uma leitura. A URL pública da nota mostra uma porta de clicar para revelar. Os metadados dessa página podem ser pedidos sem devolver o texto em claro. O texto cifrado só é obtido depois de uma ação deliberada de revelar. Uma pré-visualização do Slack, Teams ou iMessage portanto não recebe o segredo e não consome o limite de visualizações.",
        "É uma escolha de desenho do cliente e da API, não uma lista de agentes de utilizador bloqueados. Continua a importar como envia o link: quem tiver a URL completa, incluindo o fragmento, e clicar para revelar, pode ler a nota. Para o aviso a quem recebe, veja [porque as notas esperam um clique para se revelar](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Como criar um link de uso único",
      paragraphs: ["Mantenha os passos curtos. A ferramenta cifra; você escolhe as regras de acesso."],
      numberedSteps: [
        { title: "Abra o PrivateNote", body: "Use o editor no site—não é preciso conta para uma nota de texto." },
        { title: "Insira o que precisa compartilhar", body: "Uma senha, uma mensagem, uma chave de API ou, com conta, um arquivo." },
        {
          title: "Escolha validade e acesso",
          body: "Prefira a vida útil mais curta que ainda seja prática. Por padrão: uma visualização e um dia se não for usado. Acrescente uma senha ou verificação do destinatário se a sensibilidade o justificar.",
        },
        { title: "Crie o link cifrado", body: "O navegador cifra primeiro e depois envia o texto cifrado." },
        { title: "Envie o link a quem deve recebê-lo", body: "Não cole o texto em claro ao lado." },
      ],
      closingNote: "Quando estiver pronto, [crie um link de uso único](app:one-time-link).",
    },
    {
      title: "Antes de enviar um segredo",
      paragraphs: ["Uma entrega cuidada é sobretudo operacional. A criptografia não corrige o destinatário errado."],
      checklist: [
        "Confirme quem recebe antes de enviar a URL completa.",
        "Use a validade mais curta que faça sentido.",
        "Acrescente uma senha ou verificação do destinatário se a sensibilidade o justificar.",
        "Envie qualquer fator extra por outro canal.",
        "Rode credenciais temporárias depois de as usar.",
        "Não transmita segredos que não precisam de se mover.",
        "Lembre-se de que quem recebe pode copiar, fotografar ou capturar o que vê.",
      ],
    },
    {
      title: "Perguntas frequentes",
      paragraphs: [],
      faqs: [
        {
          question: "O que é um link de uso único?",
          answer:
            "Uma URL que entrega um segredo para ser recuperado e depois torna inacessível a cópia cifrada no servidor segundo regras de acesso e validade—para que o texto em claro não tenha de viver no e-mail ou no chat.",
        },
        {
          question: "Como enviar uma senha por um link seguro?",
          answer:
            "Coloque a senha na nota, não na mensagem que transporta o link. Dicas de canais separados em [como compartilhar uma senha de forma segura](blog:how-to-share-a-password-securely).",
        },
        {
          question: "É mais seguro do que o e-mail?",
          answer:
            "Para o segredo em si, sim, porque o e-mail conserva o texto em claro. O link pode mesmo assim viajar por e-mail; na caixa fica uma URL, não a credencial.",
        },
        {
          question: "O que acontece depois de abrir o link?",
          answer:
            "No PrivateNote, uma revelação bem-sucedida conta como uma visualização. Com o limite predefinido de uma visualização, o servidor apaga depois o texto cifrado. O conteúdo pode continuar visível no navegador já aberto. Links não usados também expiram no tempo.",
        },
        {
          question: "Quem recebe precisa de uma conta?",
          answer:
            "Não. Quem tiver o link completo pode abrir uma nota sem proteção. Uma senha ou uma verificação só se aplicam se quem envia as ativou.",
        },
        {
          question: "Dá para enviar um arquivo com um link de uso único?",
          answer:
            "Sim, através da [transferência segura de arquivos](app:secure-file-transfer) do PrivateNote. Enviar exige uma conta gratuita; abrir, não. Depois de revelar, os anexos seguem uma janela de acesso distinta—uma hora por padrão.",
        },
        {
          question: "Qual a diferença entre um link de uso único e um link que expira?",
          answer:
            "Uso único fala de acesso: deixa de estar disponível após a consulta prevista. Expirar fala de tempo: deixa de estar disponível após o prazo, mesmo sem abertura. O PrivateNote usa os dois.",
        },
        {
          question: "Dá para tirar um print de um segredo de uso único?",
          answer:
            "Sim. O que está na tela pode ser copiado, fotografado ou capturado. Um link de uso único limita a cópia original no servidor; não é um DRM.",
        },
      ],
    },
  ],
  tableHeaders: {
    channel: "Tipo de canal",
    encrypted: "Cifrado?",
    persistent: "Persistente?",
    verdict: "Adequado a um segredo pontual?",
  },
  goodFitsLabel: "Bons encaixes",
  poorFitsLabel: "Maus encaixes",
  closingTitle: "Onde o PrivateNote encaixa",
  closingBody:
    "O PrivateNote é uma ferramenta de entrega. Não é um cofre de senhas a longo prazo, nem um wiki de equipa, nem um arquivo de conformidade. Cifre no navegador, compartilhe um link temporário e deixe a cópia no servidor expirar quando o trabalho estiver feito.",
  encryptLu: "",
  tagline: "Faça coincidir a vida do segredo com a do meio que o transporta.",
  relatedReading: "Leituras relacionadas",
  ctaTitle: "Criar um link de uso único",
  ctaBody: "Cifre uma mensagem, uma senha ou um arquivo no navegador e compartilhe-os por um link temporário.",
  ctaButton: "Criar um link seguro",
};
