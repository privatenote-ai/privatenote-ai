import type { CryptoSeedArticleCopy } from "./cryptoSeedPhrase.types";

export const cryptoSeedPhrasePt: CryptoSeedArticleCopy = {
  heroAlt:
    "Conceito de compartilhamento de arquivos criptografados ilustrando criptografia local antes de enviar segredos",
  intro: [
    "Uma frase-semente de criptomoeda é um dos segredos mais valiosos que você terá. Geralmente ela não pode ser redefinida. Não existe “Esqueci a senha”. Quem a possui normalmente controla a carteira e tudo que há nela.",
    "Isso pode parecer estranho no blog de uma empresa que constrói links secretos criptografados de uso único. Segurança não é fingir que toda ferramenta serve para todo trabalho — é adequar a abordagem ao que você está protegendo, incluindo nossas próprias limitações.",
    "Para **segredos substituíveis** — como senhas de Wi‑Fi, credenciais temporárias, códigos de recuperação de MFA, muitas chaves de API e mensagens empresariais confidenciais — um [link secreto criptografado de uso único](blog:one-time-secret-links) é uma excelente solução.",
    "**Segredos mestres de longa duração**, como frases-semente de criptomoeda, merecem uma abordagem diferente.",
  ],
  ruleTitle: "Regra nº 1",
  ruleParagraphs: [
    "**Não insira uma frase-semente de criptomoeda em um site — incluindo a PrivateNote.** Se a transmissão for inevitável, criptografe localmente primeiro e compartilhe **apenas o texto cifrado**. A PrivateNote serve para transportar dados pré-criptografados, não para digitar a mnemonic.",
    "**Fabricantes legítimos de hardware wallet não pedem que você insira sua frase de recuperação em um site.** Se um site solicitar sua frase-semente, trate isso como altamente suspeito — verifique a autenticidade antes de prosseguir.",
    "Evite inserir frases-semente em sites sempre que possível.",
  ],
  offlineAlternatives: [
    { label: "Backup em metal", body: "guardado em um cofre ou cofre de banco" },
    { label: "SLIP-39", body: "ou esquemas similares para herança ou recuperação de desastres" },
    { label: "Transferência de hardware wallet", body: "quando prático, em vez da frase de recuperação" },
  ],
  seedPhraseTraits: [
    { label: "Concede controle total", body: "sobre os ativos" },
    { label: "Costuma durar décadas", body: "sem rotação" },
    { label: "Não pode ser alterada", body: "se comprometida" },
    { label: "Sem recuperação pelo fornecedor", body: "se roubada" },
  ],
  oneTimeLinkFit: [
    "Chaves de API e senhas temporárias",
    "Credenciais de Wi‑Fi",
    "Códigos de recuperação de MFA",
    "Mensagens empresariais e rascunhos jurídicos",
    "Tokens de acesso temporários",
  ],
  localEncryptFirst: [
    "Frases-semente de criptomoeda",
    "Backups de hardware wallet",
    "Chaves privadas de CA e chaves de assinatura",
    "Material de recuperação de gerenciador de senhas",
    "Segredos mestres de alto valor",
  ],
  philosophySteps: [
    "evitar transmitir quando puder",
    "criptografar localmente",
    "enviar apenas texto cifrado",
    "apagar texto em claro temporário",
    "enviar a senha do arquivo age — não a mnemonic — por um canal separado quando possível",
  ],
  sections: {
    sendAtAll: {
      title: "Você precisa enviá-la?",
      question: "**a frase precisa sair de onde está?** Muitas vezes, não.",
      outro:
        "Cada transmissão adiciona uma chance de exposição. Se você puder evitar enviar, faça isso. Para outros canais que também retêm segredos indefinidamente, veja [por que o e-mail é o pior lugar para segredos](blog:why-email-is-worst-for-secrets).",
    },
    different: {
      title: "Por que frases-semente são diferentes",
      p1: "Uma frase-semente é o segredo raiz de um patrimônio digital inteiro — não “mais uma senha”.",
      listIntro: "Diferente da maioria das credenciais, ela:",
      outro:
        "Você não está apenas se defendendo dos atacantes de hoje — está tomando decisões que podem importar daqui a dez ou vinte anos.",
    },
    browserEncryption: {
      title: "A criptografia no navegador é forte — mas não é mágica",
      paragraphs: [
        "A PrivateNote criptografa no seu navegador antes do upload. Nossos servidores veem apenas texto cifrado; a chave nunca chega até nós. Isso é muito melhor do que [e-mail](blog:why-email-is-worst-for-secrets), chat ou documentos na nuvem para segredos do dia a dia — e se alinha a um modelo rigoroso de [criptografia de ponta a ponta](blog:what-is-end-to-end-encryption) para o conteúdo da nota.",
        "Todo app de criptografia no navegador compartilha uma limitação: **o texto em claro precisa existir no navegador antes da criptografia.** JavaScript malicioso — de extensões, comprometimento da cadeia de suprimentos, injeção ou um CDN ruim — poderia teoricamente lê-lo primeiro. Isso é inerente à criptografia no lado do cliente no navegador, não exclusivo da PrivateNote.",
        "Para chaves de API e senhas temporárias, essa troca geralmente é aceitável. Para uma frase-semente que protege suas economias, você pode querer confiar em menos sistemas.",
      ],
    },
    encryptLocal: {
      title: "Criptografar antes que o navegador veja",
      intro: "Criptografe localmente e envie apenas texto cifrado:",
      outro: "A PrivateNote nunca recebe a mnemonic — apenas dados criptografados.",
      callout:
        "A criptografia local **não** impede malware na sua máquina. Ela **mantém o texto em claro fora de web apps, serviços em nuvem e servidores** que não precisam dele. Você reduz a base de computação confiável; não elimina um endpoint comprometido.",
    },
    whichTool: {
      title: "Qual ferramenta usar",
      age: "**age** (recomendado para a maioria dos usuários): criptografia de arquivos simples com padrões seguros — [github.com/FiloSottile/age](https://github.com/FiloSottile/age)",
      gnupg: "**GnuPG**: excelente se você já usa OpenPGP.",
      openssl: "**OpenSSL**: confiável e poderoso; CLI de baixo nível — melhor para usuários experientes.",
    },
    ageExample: {
      title: "Exemplo mínimo (age)",
      passphraseTitle: "Precisa de uma senha forte?",
      passphraseBefore: "Use um segredo longo e único para `age -p`. Gere um localmente no seu navegador — o",
      passphraseLink: "gerador de senhas",
      passphraseAfter: "em passwords.lu roda no lado do cliente; nada é enviado.",
      p1: "Depois que `seed.txt.age` for verificado, **apague o texto em claro com segurança** no dispositivo do remetente. Depois que o destinatário importar em uma carteira, **apague a cópia em texto em claro dele também**.",
      p2: "Para troca regular com alguém, `age -r` (modo de chave pública) evita uma senha compartilhada — vale a pena aprender separadamente.",
      docsLabel: "Documentação:",
    },
    separateChannels: {
      title: "Use canais separados",
      intro:
        "Separe o arquivo criptografado do segredo que o desbloqueia. Você está separando o texto cifrado `.age` da **senha de descriptografia age** — não enviando a mnemonic da frase-semente por um segundo canal.",
      steps: [
        "Envie o **arquivo criptografado** (texto cifrado) com a PrivateNote",
        "Envie a **senha age** que descriptografa esse arquivo — via Signal, telefone ou pessoalmente",
      ],
      outro: "Um atacante precisa comprometer múltiplos sistemas — não apenas um link.",
    },
    recommend: {
      title: "O que recomendamos",
      intro:
        "A divisão é realmente sobre segredos **substituíveis** versus **mestres de longa duração** — não apenas sobre formato de arquivo ou canal.",
      oneTimeTitle: "Bom para links de uso único",
      oneTimeSubtitle: "Segredos substituíveis que você pode rotacionar ou revogar",
      localTitle: "Criptografar localmente primeiro",
      localSubtitle: "Segredos mestres de longa duração que raramente mudam",
      outro:
        "Para chaves de API especificamente, veja nosso guia sobre [como compartilhar uma chave de API com segurança](blog:how-to-share-api-key-securely).",
    },
    matchTool: {
      title: "Adequar a ferramenta ao risco",
      body: "Toda abordagem tem pressupostos de confiança — gerenciadores de senhas, hardware wallets, ferramentas offline, criptografia no navegador. Nenhuma é perfeita; as trocas diferem. A questão é se elas se adequam ao **valor** do que você protege.",
    },
    philosophy: {
      title: "Nossa filosofia",
      p1: "Construímos a PrivateNote para que a criptografia aconteça **antes** dos dados chegarem aos nossos servidores. Para segredos temporários e substituíveis, isso supera e-mail, mensagens ou armazenamento em nuvem. Você também pode [enviar um segredo sem criar uma conta](blog:send-secret-message-without-account). Leia [como a PrivateNote funciona](app:how-it-works) para o modelo completo.",
      listIntro: "Para uma frase-semente que poderia ser suas economias:",
      closingQuote:
        "Às vezes o melhor conselho não é “use nosso produto”. É “use a ferramenta certa para o trabalho”.",
    },
  },
  ctaTitle: "Compartilhe segredos substituíveis — não frases-semente — no navegador",
  ctaBody:
    "Crie uma nota criptografada de uso único para chaves de API, senhas e credenciais. Para frases-semente, criptografe localmente com age primeiro e compartilhe apenas o texto cifrado.",
  ctaButton: "Experimente a PrivateNote ->",
};
