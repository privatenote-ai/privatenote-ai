import type { OneTimeLinkCopy } from "./copy.types";

export const oneTimeLinkPt: OneTimeLinkCopy = {
  heroTitle: "Criar um link de uso único",
  heroSubtitle:
    "Compartilhe senhas, mensagens e arquivos com um link criptografado · Criptografado no navegador · O destinatário não precisa de conta",
  whatHeading: "O que é um link de uso único?",
  whatBody:
    "Um link de uso único é uma forma mais segura de entregar informações que não deveriam permanecer disponíveis indefinidamente nos canais de comunicação habituais. Você coloca uma senha, uma chave de API, um código de recuperação, uma mensagem privada, um documento sensível ou uma credencial temporária atrás de um URL criptografado. O destinatário abre o link para recuperar e descriptografar o conteúdo no navegador. A PrivateNote criptografa o conteúdo no navegador antes do envio, de modo que o servidor recebe dados criptografados, não texto em claro. Você escolhe quanto tempo o link não aberto permanece disponível e quantas vezes ele pode ser aberto. É uma entrega segura, não um lugar para guardar segredos de forma permanente.",
  whatLearnMore: "Como funcionam os links secretos de uso único",
  stepsHeading: "Como criar um link de uso único",
  step1Title: "Adicione o conteúdo",
  step1Body: "Escreva uma mensagem privada, uma senha ou anexe um arquivo.",
  step2Title: "Defina o acesso",
  step2Body: "Escolha o prazo, quantas vezes o link pode ser aberto e, se quiser, uma senha extra.",
  step3Title: "Envie o link",
  step3Body: "A PrivateNote criptografa o conteúdo no seu navegador e devolve um link para enviar pelo canal que você já usa.",
  useHeading: "O que você pode compartilhar com a PrivateNote",
  usePasswordsTitle: "Senhas e credenciais",
  usePasswordsBody:
    "Compartilhe senhas e credenciais temporárias sem deixar o texto em claro de forma permanente no e-mail ou no chat.",
  usePasswordsLink: "Como compartilhar uma senha com segurança",
  useApiTitle: "Chaves de API",
  useApiBody:
    "Compartilhe chaves de API, tokens e segredos de webhook sem deixá-los no histórico do chat ou em tickets.",
  useApiLink: "Como compartilhar uma chave de API com segurança",
  useMessagesTitle: "Mensagens privadas",
  useMessagesBody:
    "Para informações que, depois de lidas, não deveriam permanecer pesquisáveis indefinidamente no e-mail ou no chat.",
  useMessagesLink: "Enviar uma mensagem secreta sem conta",
  useFilesTitle: "Arquivos e documentos",
  useFilesBody:
    "Para arquivos sensíveis em que você quer entrega criptografada e disponibilidade controlada, não uma pasta compartilhada permanente.",
  useFilesLink: "Transferência segura de arquivos",
  persistHeading: "Por que usar um link de uso único?",
  persistBody:
    "Enviar uma senha por e-mail, Slack, Teams, SMS ou outro serviço de mensagens pode deixar uma cópia no histórico, em dispositivos sincronizados, backups, notificações e arquivos pesquisáveis. A criptografia protege a transferência. A expiração reduz quanto tempo o original permanece disponível.",
  handoffHeading: "Feito para uma entrega segura",
  handoffBody:
    "A PrivateNote criptografa mensagens e arquivos no navegador antes do envio. O servidor recebe dados criptografados, não o conteúdo legível. A descriptografia acontece no navegador do destinatário.",
  handoffEncryptionLink: "Como funciona a criptografia",
  handoffHowItWorksLink: "A PrivateNote em detalhe",
  limitsHeading: "O que um link de uso único não consegue impedir",
  limitsBody:
    "Depois de aberto, uma pessoa autorizada ainda pode copiar, salvar ou fotografar a informação. A PrivateNote protege a entrega e limita quanto tempo o link original permanece disponível. Ela não apaga cópias já salvas.",
  faqHeading: "Perguntas frequentes",
  faqs: [
    {
      question: "O que é um link de uso único?",
      answer:
        "Um link de uso único serve para compartilhar informações confidenciais de forma temporária. Em vez de enviar uma senha, uma mensagem ou um arquivo diretamente por e-mail ou chat, você compartilha um link criptografado com prazo e acesso limitados. A PrivateNote criptografa o conteúdo no navegador para que o segredo original não fique indefinidamente no histórico.",
    },
    {
      question: "Como crio um link de uso único?",
      answer:
        "Use o formulário no topo desta página. Adicione uma mensagem, uma senha ou um arquivo, escolha quanto tempo o link não aberto deve permanecer disponível e quantas vezes pode ser aberto, e crie o link. A PrivateNote criptografa o conteúdo no navegador e devolve um URL para enviar pelo canal que você já usa.",
    },
    {
      question: "Posso enviar uma senha com um link de uso único?",
      answer:
        "Sim. Coloque a senha na nota e envie o link criptografado em vez da senha em si. Você pode adicionar uma senha extra. Em contas importantes, troque a credencial depois que o destinatário a usar. Um link de uso único é uma entrega, não um gerenciador de senhas.",
    },
    {
      question: "Posso enviar um arquivo com um link de uso único?",
      answer:
        "Sim. Anexe um arquivo ou uma pasta à mesma nota criptografada. Os arquivos são criptografados no navegador antes do envio. Enviar anexos exige uma conta gratuita da PrivateNote para aplicar limites de armazenamento. O destinatário continua sem precisar de conta para abrir o link.",
    },
    {
      question: "O destinatário precisa de uma conta da PrivateNote?",
      answer:
        "Não. O destinatário abre o link no navegador e descriptografa o conteúdo localmente. Não precisa entrar. Você também pode criar uma nota de texto simples sem conta. Enviar arquivos exige uma conta gratuita para prevenir abusos e aplicar limites de armazenamento.",
    },
    {
      question: "O que acontece depois que alguém abre o link?",
      answer:
        "O navegador do destinatário descriptografa o conteúdo localmente. Notas gratuitas são lidas uma vez: depois dessa abertura, a nota original é destruída. Starter pode permitir até três aberturas e Business até dez. Se ninguém abrir o link, ele expira no prazo que você definiu — no máximo três dias no plano gratuito. Arquivos anexados continuam visíveis por um intervalo limitado após a primeira abertura.",
    },
    {
      question: "Alguém pode tirar uma captura de tela de uma PrivateNote?",
      answer:
        "Sim. Quem puder ver o conteúdo revelado pode capturá-lo, fotografá-lo ou copiá-lo. A PrivateNote não afirma impedir isso. Ela controla a transferência criptografada e quanto tempo o link original permanece disponível.",
    },
    {
      question: "Por quanto tempo um link da PrivateNote pode permanecer ativo?",
      answer:
        "Se a nota nunca for aberta, links gratuitos expiram em no máximo três dias. Starter permite até 15 dias e Business até 30. Depois de abertas, notas gratuitas são lidas uma vez. Starter pode permitir até três aberturas e Business até dez. Escolha o prazo mais curto que ainda permita concluir a entrega.",
    },
  ],
  articleLearnMore: "Saiba mais sobre como os links de uso único funcionam e como permanecem seguros",
  backToCreate: "Pronto? Criar um link de uso único ↑",
};
