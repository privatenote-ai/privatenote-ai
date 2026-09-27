import type { PrivnoteAlternativeCopy } from "./copy.types";

export const privnoteAlternativePt: PrivnoteAlternativeCopy = {
  breadcrumbCurrent: "Alternativa ao Privnote",
  eyebrow: "Alternativa ao Privnote",
  heroTitleLine1: "Uma alternativa privada ao Privnote",
  heroTitleLine2: "para notas, senhas e arquivos",
  heroBody:
    "A PrivateNote mantém a simplicidade de uma nota que desaparece e acrescenta compartilhamento de arquivos criptografados, proteção por senha, controles do destinatário e ferramentas para entregar informação sensível.",
  primaryCta: "Criar uma nota privada",
  secondaryCta: "Como funciona",
  trustLine: "Sem conta para notas de texto · Criptografia no navegador · Leitura única",

  introHeading: "Se você já conhece o Privnote",
  introBody:
    "Se você procura uma alternativa ao Privnote, a PrivateNote segue a mesma ideia: criar um link privado, compartilhá-lo e fazer o conteúdo expirar ou desaparecer depois de aberto. A criptografia acontece no navegador antes de qualquer envio. Quem recebe abre o link e descriptografa localmente. Não precisa de conta.",
  introBody2:
    "A PrivateNote estende esse fluxo além de uma mensagem de texto curta. Você pode compartilhar senhas, documentos, fotos, gravações de voz ou vídeo e outros arquivos na mesma entrega criptografada, com controles extras quando a situação pede.",

  compareHeading: "PrivateNote vs Privnote",
  compareIntro:
    "Os dois serviços são pensados para o compartilhamento temporário. A PrivateNote estende a ideia a arquivos, mídia, controles do destinatário e fluxos empresariais.",
  compareFeatureColumn: "Recurso",
  comparePrivnoteColumn: "Privnote",
  comparePrivateNoteColumn: "PrivateNote",
  compareYes: "Sim",
  compareNo: "Não oferecido",
  comparePaid: "Starter e Business",
  compareRows: [
    { feature: "Notas autodestrutivas", privnote: "yes", privatenote: "yes" },
    { feature: "Destinatário não precisa de conta", privnote: "yes", privatenote: "yes" },
    { feature: "Proteção por senha", privnote: "yes", privatenote: "yes" },
    { feature: "Anexos criptografados", privnote: "no", privatenote: "yes" },
    { feature: "Vários arquivos em um único link", privnote: "no", privatenote: "yes" },
    { feature: "Fotos, áudio e vídeo", privnote: "no", privatenote: "yes" },
    { feature: "Avisos de abertura e destruição", privnote: "yes", privatenote: "yes" },
    { feature: "Verificação do destinatário", privnote: "no", privatenote: "paid" },
    { feature: "Revelação agendada", privnote: "no", privatenote: "paid" },
    {
      feature: "Identidade visual na página de abertura",
      privnote: "no",
      privatenote: "paid",
      privatenoteNote: "Business",
    },
    { feature: "Ferramentas para desenvolvedores (CLI, MCP, extensões)", privnote: "no", privatenote: "yes" },
  ],
  compareFootnote:
    "Os recursos podem mudar. Comparação com base em informações públicas do produto em setembro de 2026.",
  compareCta: "Experimentar a PrivateNote",

  whyHeading: "Por que procurar uma alternativa ao Privnote?",
  whyBody:
    "O Privnote funciona bem quando o requisito é simples: enviar uma nota de texto temporária. Texto temporário é só uma das formas pelas quais informação sensível circula entre pessoas.",
  whyBody2:
    "Você pode precisar enviar um PDF, compartilhar vários arquivos, confirmar que um link foi aberto, proteger o acesso com uma senha ou entregar documentos confidenciais sem deixá-los no e-mail comum.",
  whyClose:
    "Esse é o problema que a PrivateNote foi feita para resolver: uma entrega segura, não só uma mensagem que desaparece.",

  passwordHeading: "Uma alternativa ao Privnote para compartilhar senhas",
  passwordBody:
    "Senhas de Wi-Fi, chaves de API e códigos de recuperação costumam viajar no mesmo e-mail ou chat que explica para que servem. Isso pode deixar cópias no histórico, em dispositivos sincronizados e em backups.",
  passwordBody2:
    "A PrivateNote coloca a credencial atrás de um link criptografado separado. Você envia o contexto pelo canal que já usa, e o segredo numa nota temporária que pode expirar, se autodestruir depois da leitura e, se quiser, exigir uma senha. É uma entrega, não um gerenciador de senhas.",
  passwordCta: "Compartilhar uma senha com segurança",
  passwordArticleLink: "Como compartilhar uma senha com segurança",

  filesHeading: "Envie arquivos, não só texto",
  filesBody:
    "Contratos, documentos de identidade, PDFs financeiros, arquivos de configuração, fotos e arquivos compactados costumam ser o conteúdo real. Uma nota de texto que desaparece não consegue carregá-los. A PrivateNote mantém a nota e os anexos criptografados na mesma entrega segura, para que a mensagem e os arquivos viajem juntos.",
  filesBody2:
    "Enviar arquivos exige uma conta gratuita da PrivateNote para aplicar limites de armazenamento e transferência. Quem recebe continua abrindo o link sem entrar. Depois da primeira abertura, os anexos ficam disponíveis por uma janela limitada — não como uma pasta compartilhada permanente.",
  filesLimits:
    "Limites atuais: Free até {freeSize} por arquivo e {freeCount} arquivos por transferência ({freeTransfers} transferências por mês). Starter até {starterSize} e {starterCount} arquivos. Business até {businessSize} e {businessCount} arquivos.",
  filesCta: "Enviar um arquivo criptografado",
  filesArticleLink: "Enviar documentos sensíveis com segurança",

  mediaHeading: "Compartilhe fotos, áudio e vídeo sensíveis",
  mediaBody:
    "Alguma informação nunca começa como um arquivo no disco. Você pode fotografar um documento, gravar um recado de voz curto ou anexar uma foto existente sem passar primeiro por outro app de mensagens.",
  mediaBody2:
    "A PrivateNote pode tirar uma foto, gravar áudio ou vídeo, ou anexar mídia existente. A captura acontece no navegador; em seguida vale a mesma criptografia no cliente usada para arquivos, antes do envio.",
  mediaPhotoLink: "Como compartilhar fotos com segurança",
  mediaVoiceLink: "Mensagens de voz criptografadas",

  businessHeading: "Quando uma nota que desaparece vira um fluxo empresarial",
  businessBody:
    "O mesmo link privado é útil quando quem envia é um contador, um administrador de TI, um consultor ou um escritório que entrega arquivos confidenciais a um cliente. A necessidade não é só o sigilo. É confirmação, controle e uma entrega profissional.",
  businessScenarios: [
    "Um contador envia números confidenciais a um cliente.",
    "Um administrador de TI envia credenciais a um funcionário.",
    "Um escritório envia documentos de identidade ou financeiros a um cliente.",
    "Um consultor transfere arquivos de projeto que não deveriam ficar no e-mail.",
    "Uma empresa precisa saber que informações sensíveis foram acessadas.",
  ],
  businessBody2:
    "Starter e Business acrescentam verificação do destinatário, revelação agendada, prova de acesso, janelas de acesso mais longas, revogação de notas não abertas e o acompanhamento das notas enviadas. Business acrescenta páginas de abertura à sua imagem, acesso a arquivos só de leitura e transferências maiores. A criptografia continua no navegador em todos os planos.",
  businessCta: "Conhecer a PrivateNote Business",
  businessNotifyLink: "Saber quando um link secreto foi aberto",
  businessVerifyLink: "Verificação do destinatário",

  securityHeading: "Como a PrivateNote protege o seu conteúdo",
  securityBody:
    "O conteúdo sensível é criptografado no seu navegador antes do envio. A infraestrutura da PrivateNote armazena texto cifrado, não a nota ou o arquivo em claro.",
  securityArchitecture:
    "Para uma nota padrão, o navegador gera uma chave de criptografia aleatória de 256 bits e usa criptografia autenticada AES-256-GCM. A chave de descriptografia viaja no fragmento da URL — a parte depois de #. Os navegadores não incluem o fragmento em requisições HTTP normais, então o servidor não recebe a chave como parte da URL da requisição.",
  securityRecipient:
    "O navegador de quem recebe usa a chave do link compartilhado para descriptografar o conteúdo localmente.",
  securityLimitation:
    "Quem mais tarde tiver o link completo ainda pode copiar ou tirar um print do que vê. A PrivateNote controla a entrega, não o que o destinatário faz depois de abrir.",
  securityFlowWrite: "Escrever / anexar",
  securityFlowEncrypt: "Criptografar no navegador",
  securityFlowCiphertext: "Enviar o texto cifrado",
  securityFlowShare: "Compartilhar o link privado",
  securityFlowDecrypt: "O destinatário descriptografa",
  securityEncryptionLink: "Como funciona a criptografia da PrivateNote",
  securityHowItWorksLink: "Como funciona em detalhe",
  founderHeading: "Feito com criptografia em mente",
  founderBody:
    "A PrivateNote é desenvolvida por Marjan Skrobot, pesquisador de criptografia e segurança da informação. O modelo de segurança e as limitações estão documentados publicamente, inclusive o que a PrivateNote pode — e não pode — proteger.",
  founderLink: "Sobre o modelo de segurança",

  decideHeading: "Qual você deve usar?",
  decidePrivnoteTitle: "O Privnote pode bastar se…",
  decidePrivnoteItems: [
    "Você só precisa enviar uma nota de texto temporária.",
    "Você quer o fluxo mais simples possível.",
    "Você não precisa de anexos nem de controles extras de entrega.",
  ],
  decidePrivateNoteTitle: "A PrivateNote pode encaixar melhor se…",
  decidePrivateNoteItems: [
    "Você quer criptografia no cliente documentada.",
    "Você precisa compartilhar arquivos ou mídia além do texto.",
    "Você precisa de verificação do destinatário ou revelação agendada.",
    "Você quer avisos de acesso ou prova de acesso.",
    "Você precisa de identidade visual profissional ou controles de entrega para o trabalho.",
  ],
  decideOneTimeLink: "Como funcionam os links secretos de uso único",
  decideDevelopersLink: "Integrações de desenvolvedor",

  faqHeading: "Perguntas frequentes",
  faqs: [
    {
      question: "Quais são algumas alternativas ao Privnote?",
      answer:
        "Vários serviços oferecem compartilhamento temporário ou criptografado de notas. A PrivateNote é feita para quem quer o fluxo de uma nota que desaparece, mas também precisa de arquivos criptografados, mídia, controles do destinatário ou recursos de entrega profissional.",
    },
    {
      question: "Como a PrivateNote difere do Privnote?",
      answer:
        "Os dois criam um link privado temporário que o destinatário pode abrir sem conta. A PrivateNote acrescenta anexos criptografados, captura de foto e áudio no navegador, proteção opcional por senha no mesmo fluxo, e controles pagos como verificação do destinatário e páginas de abertura à sua imagem. O Privnote se concentra em notas de texto autodestrutivas.",
    },
    {
      question: "Posso usar a PrivateNote sem uma conta?",
      answer:
        "Sim. Você pode criar uma nota de texto criptografada básica sem entrar. Quem recebe nunca precisa de conta. Enviar arquivos, fotos ou gravações exige uma conta gratuita para aplicar limites de armazenamento e de transferências mensais.",
    },
    {
      question: "Posso enviar arquivos com a PrivateNote?",
      answer:
        "Sim. Anexe um ou mais arquivos à mesma nota criptografada. Os arquivos são criptografados no navegador antes do envio. Enviar exige uma conta gratuita; abrir o link, não. Quem recebe pode baixar os anexos durante uma janela limitada depois da abertura.",
    },
    {
      question: "Posso compartilhar senhas com a PrivateNote?",
      answer:
        "Sim. Coloque a senha na nota e envie o link criptografado em vez da senha. Você pode acrescentar uma senha extra e manter a validade curta. Depois de usar uma credencial importante, troque-a. Uma nota privada é uma entrega, não um gerenciador de senhas.",
    },
    {
      question: "Como a PrivateNote criptografa as notas?",
      answer:
        "O navegador gera uma chave aleatória de 256 bits e criptografa a nota com AES-256-GCM antes do envio. A chave viaja no fragmento da URL — a parte depois de # — que os navegadores não enviam numa requisição HTTP normal. Notas protegidas por senha envolvem essa chave com Argon2id. Anexos também são criptografados no navegador.",
    },
    {
      question: "O destinatário precisa de uma conta da PrivateNote?",
      answer:
        "Não. Quem recebe abre o link num navegador e descriptografa o conteúdo localmente. Não entra na conta. Quem tiver o link completo, e a senha se você definiu uma, pode abrir a nota.",
    },
  ],

  finalHeading: "Compartilhe algo em privado.",
  finalBody: "Crie uma nota criptografada ou uma entrega de arquivo e envie o link ao destinatário.",
  finalPrimaryCta: "Criar uma nota privada",
  finalSecondaryCta: "Ver preços",
  finalTrust: "Não é preciso conta para começar.",
};
