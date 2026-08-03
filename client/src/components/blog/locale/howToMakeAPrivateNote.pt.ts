import type { HowToMakeAPrivateNoteArticleCopy } from "./howToMakeAPrivateNote.types";

export const howToMakeAPrivateNotePt: HowToMakeAPrivateNoteArticleCopy = {
  heroAlt:
    "Laptop numa secretária mostrando a tela de criação de nota privada com leitura única e expiração, ao lado de um caderno de couro trancado",
  intro: [
    "Você quer escrever algo sensível—uma [senha](app:password-generator), um código de recuperação, uma mensagem confidencial ou uma nota pessoal—e mantê-lo privado. Talvez tenha pesquisado «how to make a note private» e encontrado conselhos genéricos sobre bloquear um app, ocultar uma pasta local ou ativar uma configuração de privacidade do dispositivo.",
    "Esses passos ajudam com privacidade casual, contra olhares indiscretos. **Não** resolvem o problema mais difícil: compartilhar uma nota com outra pessoa sem deixar uma cópia permanente e pesquisável em um servidor de terceiros.",
    "Uma nota verdadeiramente privada exige três pilares distintos: **criptografia antes do envio**, **controle de acesso rigoroso** e **efemeridade planejada**—um mecanismo para desaparecer. Veja como alcançar isso na prática.",
  ],
  sections: [
    {
      title: "O que «privado» realmente significa",
      paragraphs: [
        "Em aplicativos do dia a dia, «privado» geralmente significa oculto de outras pessoas que pegam seu dispositivo, protegido pelo código do telefone ou bloqueado atrás de uma assinatura premium. Isso é muito útil—mas não é o mesmo que privacidade criptográfica.",
        "Quando você compartilha informações sensíveis pela web, a pergunta real é: **quem pode ler a nota depois que ela sai das suas mãos?**",
        "O provedor do serviço pode lê-la? Alguém não autorizado com acesso a um backup na nuvem pode lê-la? Um futuro colega de equipe pode pesquisar históricos antigos de chat e encontrá-la meses depois?",
        "Uma nota privada, no sentido estrito de segurança, é aquela em que apenas o destinatário pretendido pode ler o conteúdo, o serviço de hospedagem nunca vê o texto em claro subjacente e a nota não permanece online para sempre.",
      ],
    },
    {
      title: "Por que apps de notas comuns ficam aquém",
      paragraphs: [
        "Apple Notes, Google Keep, Notion e Evernote são ferramentas excelentes para organização pessoal, mas em geral são a escolha errada para distribuir segredos de uso único devido a várias características inerentes:",
      ],
      bullets: [
        "**Sincronização e backups** — Sua nota é silenciosamente copiada em vários dispositivos, contas de armazenamento em nuvem e arquivos históricos de longo prazo que você não controla diretamente.",
        "**Busca e compartilhamento** — Compartilhamento público acidental, buscas amplas no workspace ou uma única conta comprometida podem expor notas antigas meses depois.",
        "**Acesso do provedor** — A menos que o app ofereça explicitamente criptografia de ponta a ponta para aquela nota específica, o provedor mantém a capacidade técnica de ler seu conteúdo em seus servidores.",
        "**Sem destruição após leitura** — A maioria dos apps de organização é estruturalmente projetada para armazenar informações indefinidamente, não para eliminá-las após uma única leitura.",
      ],
      callout:
        "Para diário pessoal de longo prazo, apps de notas padrão são ideais. Para senhas, códigos de recuperação e entregas confidenciais, você precisa de uma ferramenta efémera construída para [entrega de segredos de uso único](blog:one-time-secret-links)—não para armazenamento permanente.",
    },
    {
      title: "Como criar uma nota privada: passo a passo",
      paragraphs: [
        "Você não precisa registrar uma conta para enviar uma nota privada segura de uso único. O fluxo estruturado abaixo descreve o que serviços criptografados no navegador são projetados para executar com segurança.",
      ],
      flowDiagramCaption: "Fluxo de trabalho de nota privada em resumo",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Redija a mensagem no navegador",
          body: "Abra [PrivateNote](app:home) e digite sua mensagem diretamente. Já está em outra aba? A [extensão do Chrome](chrome:extension) criptografa o texto selecionado no lugar—o mesmo fluxo no lado do cliente, sem abrir o site primeiro. Evite colar o segredo bruto em clientes de e-mail padrão ou threads de texto não criptografados antes. Você também pode usar [Write with Private AI](app:home) para redigir localmente no dispositivo antes da criptografia.",
        },
        {
          step: "Passo 2",
          title: "Configure suas definições de privacidade efémera",
          body: "Defina uma janela de expiração adequada à tarefa. Ative a destruição após leitura se a nota deve desaparecer completamente após a primeira abertura bem-sucedida, e adicione uma frase secreta opcional para conteúdo altamente sensível.",
        },
        {
          step: "Passo 3",
          title: "Deixe o navegador executar a criptografia local",
          body: "Ao clicar em criar, a criptografia acontece inteiramente no lado do cliente. Apenas texto cifrado é enviado. A chave de descriptografia permanece incorporada no fragmento de URL—a parte após `#`—que navegadores web modernos não transmitem aos servidores de hospedagem.",
        },
        {
          step: "Passo 4",
          title: "Isole seus canais de compartilhamento",
          body: "Transmita o link seguro gerado ao destinatário pelo canal preferido. Se configurou uma senha manual, compartilhe-a fora de banda—por telefonema, Signal ou pessoalmente de forma segura.",
        },
        {
          step: "Passo 5",
          title: "Confirme a entrega e limpe o estado local",
          body: "Use notificações de entrega opcionais para verificar quando a nota foi aberta ou expirou com sucesso. Uma vez consumida, nenhuma cópia em texto claro permanece na caixa de saída ou nos registros históricos de chat.",
        },
      ],
    },
    {
      title: "Configurações de privacidade que valem a pena ativar",
      paragraphs: [
        "Pequenos ajustes arquiteturais produzem enormes ganhos de segurança. Ao criar uma nota efémera, maximize suas defesas utilizando estas configurações:",
      ],
      bullets: [
        "**Destruição após leitura** — O padrão ouro para senhas e credenciais. O texto cifrado subjacente é apagado do servidor no momento em que é lido uma vez com sucesso.",
        "**Janelas de expiração curtas** — Se o destinatário não precisa abrir os dados instantaneamente, limite a janela de exposição a horas ou dias—nunca deixe aberta indefinidamente.",
        "**Senhas em camadas** — Adiciona um segundo fator crucial. Um atacante precisaria comprometer tanto o canal de transporte do link quanto obter a senha separada para ler o conteúdo.",
      ],
    },
    {
      title: "O que não colocar em uma nota privada baseada na web",
      paragraphs: [
        "Links criptografados no navegador são excelentes para segredos temporários ou substituíveis—como credenciais Wi‑Fi, tokens de API e mensagens corporativas. Eles têm limites.",
      ],
      callout:
        "**Regra de segurança crítica:** Nunca digite uma seed phrase de criptomoeda, backup mestre de hardware wallet ou chave privada raiz em qualquer site. Ativos mestres irreplaceáveis justificam criptografia local baseada em terminal com age ou OpenSSL antes da transmissão. Para essa arquitetura, leia [seed phrases cripto e links de uso único](blog:crypto-seed-phrase-one-time-link).",
    },
    {
      title: "Quando uma nota privada é a ferramenta certa",
      paragraphs: [
        "Recorra a uma nota privada dedicada em vez de e-mail ou chat padrão ao entregar informações sensíveis:",
      ],
      table: [
        {
          dataType: "Credenciais",
          scenario:
            "Passar uma [senha ou código de recuperação](blog:how-we-generate-passwords) a um familiar ou colega de confiança.",
        },
        {
          dataType: "Chaves de acesso",
          scenario:
            "Distribuir uma [chave de API ou segredo de assinatura de webhook](blog:how-to-share-api-key-securely) durante o onboarding de desenvolvedores.",
        },
        {
          dataType: "Acesso físico",
          scenario:
            "Compartilhar códigos de porta temporários, PINs de alarme ou credenciais Wi‑Fi de convidados.",
        },
        {
          dataType: "Comunicações corporativas",
          scenario:
            "Enviar uma mensagem empresarial confidencial que não deva ser indexada por [arquivos de chat ou e-mail empresarial](blog:workplace-texts-private-note).",
        },
      ],
    },
    {
      title: "Nossa filosofia na PrivateNote",
      paragraphs: [
        "Projetamos a PrivateNote para devolver o equilíbrio de confiança ao usuário. Ao realizar operações criptográficas inteiramente no navegador antes de a carga atingir nossa infraestrutura, nossos servidores permanecem estruturalmente cegos aos seus segredos em texto claro.",
        "Também acreditamos em transparência clara sobre as limitações do produto. Se você está enviando um token de acesso temporário a um colega, um link criptografado de uso único é uma ferramenta excelente. Se está lidando com suas economias de uma vida inteira, criptografe primeiro localmente em uma máquina offline.",
        "Segurança não é encontrar uma ferramenta mágica universal. É adequar seu fluxo de trabalho ao valor do que você está protegendo. Para o modelo técnico por trás da criptografia no navegador, leia [como a PrivateNote funciona](app:how-it-works) e [o que significa criptografia de ponta a ponta do lado do cliente](blog:what-is-end-to-end-encryption).",
      ],
    },
  ],
  tableHeaders: {
    dataType: "Tipo de dado",
    scenario: "Cenário ideal de compartilhamento",
  },
  closingTitle: "Crie uma nota privada agora",
  closingBody: [
    "Nenhuma conta necessária. Escreva sua nota, configure suas definições de privacidade e compartilhe um link seguro em menos de um minuto.",
  ],
  fileSharingNote:
    "Precisa compartilhar documentos também? [Transferência segura de arquivos](app:secure-file-transfer) usa o mesmo modelo de criptografia no navegador. O envio requer uma conta gratuita; destinatários podem abrir links sem se cadastrar.",
  chromeExtensionNote:
    "Usa o PrivateNote com frequência? A [extensão do Chrome](chrome:extension) adiciona criptografar e compartilhar à barra de ferramentas ou menu de contexto—útil quando uma senha ou chave de API surge no meio de uma conversa.",
  tagline: "Criptografe primeiro. Compartilhe um link. Deixe expirar.",
  relatedReading: "Leituras relacionadas",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb:
        "Links de destruição após leitura, o fragmento de URL e por que a efemeridade supera e-mail ou Slack para segredos de uso único.",
    },
    {
      slug: "why-email-is-worst-for-secrets",
      blurb:
        "Por que o e-mail cria cópias duradouras de segredos—e o que usar em vez disso para entregas confidenciais.",
    },
    {
      slug: "how-to-share-api-key-securely",
      blurb:
        "Um fluxo mais seguro para chaves de API: limitar o escopo, criptografar localmente, enviar o link—não o segredo bruto.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "O que E2EE do lado do cliente realmente significa e como difere da segurança de transporte sozinha.",
    },
  ],
};
