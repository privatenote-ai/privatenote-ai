import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksPt: OneTimeSecretLinksArticleCopy = {
  intro: [
    "A maioria das pessoas compartilha informações sensíveis da mesma forma que tudo o mais: por e-mail, no Slack ou por SMS.",
    "Funciona até você perceber o que realmente fez. Você não apenas entregou uma senha ou chave de API — deixou um **registro permanente** na caixa de entrada de alguém, no arquivo de chat da empresa, em um backup na nuvem, em uma exportação de compliance ou em um resumo de reunião gerado por IA que ninguém mais lembra.",
    "No processo **Musk vs. Altman** em 2026, SMS entre Sam Altman e Mira Murati sobre sua saída da OpenAI em novembro de 2023 foram apresentados como prova. Trocas que pareciam privadas no momento — mensagens apressadas sobre chamadas do conselho e um retorno — acabaram como anexos judiciais. O problema não era interceptação. Era **retenção**.",
    "Algumas informações têm um papel curto. Uma senha de staging. Um código de recuperação. Uma instrução de acesso única. Credenciais de contratado que expiram na sexta. Esses segredos não precisam de um histórico pesquisável. Precisam chegar, ser usados e desaparecer.",
    "É para isso que servem os **links secretos de uso único**.",
  ],
  sections: [
    {
      title: 'O problema dos canais "seguros o suficiente"',
      paragraphs: [
        "O e-mail pode ser criptografado em trânsito. O Slack pode ter SSO. O Signal oferece mensagens que desaparecem. Tudo isso ajuda — mas resolve um problema diferente.",
        "O problema nem sempre é interceptação. É **retenção**.",
        "Quando você envia um segredo por um canal comum, aposta em uma longa cadeia de suposições:",
      ],
      bullets: [
        { label: "A mensagem nunca será encaminhada, capturada em screenshot ou copiada.", body: "" },
        { label: "Ninguém pesquisará por engano o histórico de chat compartilhado seis meses depois.", body: "" },
        {
          label:
            "Backups, exportações de servidor e fluxos de eDiscovery não transformarão uma entrega rápida em responsabilidade de longo prazo.",
          body: "",
        },
        {
          label:
            "Bots de pré-visualização de link no Slack, Teams ou iMessage não buscarão automaticamente a URL e não destruirão a nota antes do destinatário abrir o link.",
          body: "",
        },
        {
          label:
            "O segredo será rotacionado imediatamente após o uso, mesmo que o valor antigo ainda esteja em algum log de servidor.",
          body: "",
        },
      ],
      callout:
        "**Separação de funções:** A criptografia protege o conteúdo em trânsito. A efemeridade reduz o que existe depois. Ambas importam — mas a maioria das ferramentas de comunicação otimiza para a primeira e ignora completamente a segunda.",
    },
    {
      title: "O que é um link secreto de uso único",
      paragraphs: [
        'Um link secreto de uso único (às vezes chamado de link **burn-after-reading** ou nota autodestrutiva) é uma URL destinada a entregar texto sensível uma vez a um leitor. Após essa leitura, o conteúdo deveria desaparecer — não arquivado, não pesquisável, não deixado em uma caixa de entrada ou histórico de chat.',
        "**O design verdadeiramente de uso único** é mais rigoroso que expiração. O essencial: **a chave de criptografia é gerada no seu navegador** — nunca no servidor — e o texto plano é criptografado lá antes de qualquer transferência.",
      ],
      chromeExtensionCta: "Instalar extensão Chrome",
      beforeFlowSteps: "**Na prática, o fluxo completo funciona assim:**",
      flowSteps: [
        {
          title: "Geração de chave e criptografia no navegador",
          step: "Passo 1: Seu navegador",
          body: "Você digita o segredo no navegador. O navegador gera localmente uma nova chave de criptografia e criptografa o texto com ela — antes de qualquer requisição de rede sair do seu dispositivo.",
        },
        {
          title: "Apenas texto criptografado é transferido",
          step: "Passo 2: Servidor",
          body: "Apenas o conteúdo criptografado é transferido. O servidor armazena texto cifrado que não consegue ler porque nunca recebeu a chave ou o texto plano.",
        },
        {
          title: "A chave permanece no link",
          step: "Passo 3: URL",
          body: "A chave gerada no navegador é adicionada ao link no fragmento da URL — a parte após # — que nunca é enviada ao servidor.",
        },
        {
          title: "Uma leitura, depois desaparece",
          step: "Passo 4: Destinatário",
          body: "O destinatário abre o link completo. O navegador lê a chave do fragmento, descriptografa localmente e o servidor remove o conteúdo criptografado após essa primeira leitura bem-sucedida.",
        },
      ],
      afterFlowSteps: [
        "Nem toda ferramenta que se vende como link secreto de uso único segue esse padrão. Algumas criptografam apenas no servidor depois de receber seu texto — ou geram a chave lá, permitindo que o serviço leia seu segredo. Outras dependem de uma senha compartilhada que o serviço pode verificar. Outras ainda removem por agenda, mas mantêm metadados, logs ou cópias recuperáveis. Ao escolher uma ferramenta, pergunte se o design completo foi implementado — não apenas se o link expira.",
      ],
    },
    {
      title: "Por que o fragmento da URL importa",
      paragraphs: [
        "Esse detalhe de arquitetura é facilmente ignorado — e ainda assim é a base da criptografia web moderna.",
        "Em uma requisição HTTPS padrão, tudo antes do símbolo # é enviado diretamente ao servidor. Tudo depois permanece no sandbox do navegador. Um sistema de link de uso único bem projetado pode armazenar conteúdo criptografado em /note/abc123, enquanto a chave de descriptografia em #xK9m2p... permanece invisível para logs de servidor, caminhos de CDN e tabelas de banco de dados externos.",
      ],
    },
    {
      title: "Quando usar um link de uso único (e quando não)",
      paragraphs: [
        "Nem todo canal é errado para todo tipo de segredo — mas a maioria das ferramentas do dia a dia é feita para persistência, não para transferência única.",
      ],
      table: [
        {
          channel: "E-mail",
          encrypted: "Frequentemente em trânsito",
          persistent: "Sim — permanente, em várias caixas de entrada",
          verdict: "✗ Ruim",
        },
        {
          channel: "Slack / Teams",
          encrypted: "Sim, na plataforma",
          persistent: "Sim — pesquisável, exportável",
          verdict: "✗ Ruim",
        },
        {
          channel: "SMS / iMessage",
          encrypted: "Muito variável",
          persistent: "Frequentemente backup, sincronização na nuvem",
          verdict: "✗ Ruim",
        },
        {
          channel: "Gerenciador de senhas",
          encrypted: "Sim",
          persistent: "Projetado para armazenamento permanente",
          verdict: "Frequentemente inconveniente — muitas vezes pago, lento para transferência rápida",
        },
        {
          channel: "Signal / WhatsApp (mensagens que desaparecem)",
          encrypted: "Sim, ponta a ponta",
          persistent: "Mensagens desaparecem com o tempo",
          verdict: "Bom — ambas as partes precisam de conta",
        },
        {
          channel: "Link de uso único",
          encrypted: "Sim, no cliente",
          persistent: "Removido imediatamente após leitura",
          verdict: "✓ Feito para isso",
        },
      ],
      goodFits: [
        "Senhas, chaves de API e tokens temporários transferidos a uma pessoa.",
        "Códigos de recuperação de sistema e backups de 2FA.",
        'Instruções de acesso físico temporário ("use este código da porta até 18h").',
        "Rascunhos jurídicos ou de RH sensíveis que não deveriam virar memória institucional.",
      ],
      poorFits: [
        "Armazenamento de longo prazo: use um cofre de senhas dedicado.",
        "Conversas contínuas: use um mensageiro criptografado ponta a ponta como o Signal.",
        "Segredos para auditoria: se a compliance exige um rastro imutável, use o sistema de armazenamento aprovado da organização.",
      ],
    },
    {
      title: "A armadilha da pré-visualização de link",
      paragraphs: [
        "É assim que muitas equipes descobrem da maneira difícil. Muitos apps de chat corporativo rastreiam automaticamente URLs recebidas para gerar pré-visualizações ricas (títulos, descrições, miniaturas).",
        "Esse rastreamento automático pode consumir um link de uso único antes do destinatário conseguir clicar. O bot de pré-visualização se torna o primeiro leitor, a nota é removida ou destruída e seu colega abre um link morto.",
        "Ferramentas sérias de efemeridade mitigam isso ativamente: bloqueiam user-agents de crawlers conhecidos, exigem um clique explícito antes da descriptografia local e usam tempos de expiração muito curtos.",
      ],
    },
  ],
  tableHeaders: {
    channel: "Tipo de canal",
    encrypted: "Criptografado?",
    persistent: "Permanente?",
    verdict: "Bom para segredos de uso único?",
  },
  goodFitsLabel: "Bons casos de uso",
  poorFitsLabel: "Maus casos de uso",
  closingTitle: "Onde o PrivateNote se encaixa",
  closingBody:
    "O PrivateNote foi construído exatamente em torno desse modelo de criptografia no cliente. Não é um cofre de senhas de longo prazo, nem um wiki de equipe, nem um arquivo permanente de compliance. É uma ferramenta leve e rápida de transferência.",
  encryptLu:
    "Para arquivos maiores que precisam do mesmo modelo de criptografia no cliente, o [Encrypt.lu](https://encrypt.lu) aplica a mesma abordagem arquitetural em escala de arquivos.",
  tagline:
    "Garante que a vida útil dos seus dados sensíveis corresponda à do meio pelo qual eles viajam. Porque às vezes a mensagem mais segura é aquela que deixa completamente de existir.",
  relatedReading: "Leituras relacionadas",
};
