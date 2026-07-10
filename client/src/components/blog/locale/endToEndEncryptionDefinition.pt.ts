import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionPt: E2eeDefinitionArticleCopy = {
  intro: [
    "A criptografia de ponta a ponta é uma das frases mais repetidas no marketing de segurança. Também é uma das mais fáceis de diluir. A definição real não é que os dados estão criptografados em algum lugar. A definição real trata de quem pode descriptografá-los.",
    "Se o provedor do serviço tem as chaves, pode recuperá-las ou recebe texto em claro durante o funcionamento normal, o sistema pode estar criptografado, mas não é criptografia de ponta a ponta no sentido estrito.",
  ],
  definitionTitle: "A definição útil mais curta",
  definitionBody:
    "A criptografia de ponta a ponta significa que apenas os endpoints possuem as chaves necessárias para descriptografar os dados. O provedor do serviço pode armazenar ou retransmitir texto cifrado, mas não deveria possuir as chaves nem o texto em claro.",
  tableHeaders: ["Modelo", "Criptografia", "O servidor vê texto em claro?", "O servidor tem chaves?"],
  tableRows: [
    { model: "Segurança de transporte (TLS)", happens: "Entre o navegador e o servidor", plaintext: "Sim, no servidor", keys: "Sim, para processamento no servidor" },
    { model: "Criptografia no cliente defeituosa", happens: "No dispositivo", plaintext: "Talvez", keys: "Sim, se as chaves forem enviadas ou recuperáveis" },
    { model: "E2EE verdadeira", happens: "Nos endpoints", plaintext: "Não", keys: "Não" },
  ],
  flowNodes: [
    { title: "Navegador do remetente", body: "Criptografa localmente antes do upload" },
    { title: "Armazenamento PrivateNote", body: "Armazena apenas texto cifrado" },
    { title: "Navegador do destinatário", body: "Descriptografa com a chave do fragmento" },
  ],
  sections: [
    {
      title: "Criptografia não é a mesma coisa que criptografia de ponta a ponta",
      paragraphs: [
        "A maioria dos serviços web sérios usa TLS. Isso importa: o TLS protege os dados enquanto viajam entre seu navegador e o servidor, e impede que atacantes na rede local leiam a conexão.",
        "Mas o TLS termina no servidor. Uma vez que a solicitação chega lá, o serviço geralmente pode ver o texto em claro. O provedor pode armazená-lo, escaneá-lo, indexá-lo, processá-lo ou recriptografá-lo em repouso com chaves que ele controla.",
        "Isso é transporte criptografado. Por si só, não é criptografia de ponta a ponta.",
      ],
      callout: "O teste prático é simples: o provedor pode obter a chave de descriptografia ou o texto em claro? Se sim, o sistema não é verdadeiramente criptografado de ponta a ponta.",
    },
    {
      title: "A definição do criptógrafo",
      paragraphs: [
        "Uma definição precisa de E2EE começa com a posse de chaves. Em um sistema verdadeiramente de ponta a ponta, as chaves de criptografia e descriptografia são criadas e mantidas nos endpoints, não no serviço de entrega.",
        "O servidor pode rotear, armazenar, limitar taxa e excluir texto cifrado. Ele pode operar o serviço. Mas não possui o material de chave necessário para converter texto cifrado de volta em conteúdo legível.",
        "A análise conhecida de Matthew Green sobre a controvérsia de criptografia do Zoom deixa isso claro: a propriedade central não é apenas que a criptografia existe, mas que as chaves de descriptografia não estão disponíveis para o provedor.",
      ],
      bullets: [
        "O endpoint do remetente pode criptografar os dados.",
        "O endpoint do destinatário pode descriptografá-los.",
        "O servidor intermediário manipula apenas texto cifrado.",
        "Um comprometimento do servidor não deveria expor conteúdo em texto em claro.",
      ],
    },
    {
      title: "A criptografia no cliente ainda pode falhar",
      paragraphs: [
        "Criptografia no cliente significa que a operação criptográfica acontece localmente antes do upload. Isso é necessário para muitos designs de E2EE, mas não é suficiente por si só.",
        "Um serviço poderia criptografar dados no navegador e depois enviar tanto o texto cifrado quanto a chave correspondente para seu backend. A criptografia aconteceu no cliente, mas o provedor ainda tem a chave. Isso quebra o limite de ponta a ponta.",
        "A distinção significativa é a posse exclusiva da chave. Se o provedor pode acessar, recuperar, rotacionar, custodiar ou regenerar a chave utilizável, você ainda confia no provedor para acessar texto em claro.",
      ],
    },
    {
      title: "Como notas com fragmento de URL se encaixam no modelo",
      paragraphs: [
        "A PrivateNote usa uma versão baseada no navegador dessa arquitetura para notas de uso único. O navegador do remetente criptografa a nota localmente. A carga criptografada é enviada para o armazenamento. A chave de descriptografia fica no fragmento da URL: a parte após o símbolo #.",
        "Os navegadores não enviam o fragmento da URL ao servidor na solicitação HTTP. Isso significa que o servidor recebe o texto cifrado, mas não a chave. Quando o destinatário abre o link, o navegador dele tem o fragmento localmente e pode descriptografar a nota após a etapa de revelação.",
        "Não é a mesma topologia que Signal ou MLS, onde os endpoints são geralmente dispositivos vinculados a uma conta com chaves públicas persistentes. Mas a propriedade de segurança central é a mesma: o provedor de armazenamento não possui a chave necessária para descriptografar o conteúdo.",
      ],
    },
    {
      title: "O canal de entrega ainda importa",
      paragraphs: [
        "Um link criptografado de uso único é poderoso, mas o link completo se torna sensível porque carrega a chave de descriptografia no fragmento. Se você colar esse link em um canal que registra mensagens, sincroniza histórico ou é monitorado por um administrador, esse canal pode expor o segredo antes de ser aberto.",
        "Por isso expiração, leituras de uso único e senhas opcionais são importantes operacionalmente. Eles não mudam a definição de E2EE, mas reduzem o dano se um link for encaminhado, registrado ou pré-visualizado por software.",
        "Para material muito sensível, envie o link por um canal e compartilhe a senha opcional por outro. Isso separa a posse da carga criptografada da posse do segredo humano.",
      ],
    },
    {
      title: "A ressalva da força bruta offline",
      paragraphs: [
        "A proteção por senha adiciona defesa em profundidade, mas tem uma ressalva criptográfica real. Se um atacante obtém o link completo e baixa o texto cifrado antes da expiração, adivinhar a senha pode se tornar um ataque offline. Os limites de taxa do servidor não ajudam mais, porque o atacante pode tentar localmente contra o texto cifrado.",
        "A PrivateNote usa Argon2id para notas protegidas por senha. Argon2id é uma função de derivação de chave que consome muita memória, aumentando o custo de cada tentativa de senha, especialmente contra ataques de força bruta com GPU.",
        "Isso não torna senhas fracas seguras. Uma senha curta ou reutilizada ainda pode falhar. Quanto mais forte a senha opcional, mais útil essa segunda camada se torna.",
      ],
    },
    {
      title: "Por que a arquitetura importa",
      paragraphs: [
        "A E2EE muda o modelo de confiança. Com armazenamento criptografado convencional em repouso, você confia na política do provedor, controles de funcionários, tratamento legal e prevenção de violações. Com criptografia de ponta a ponta, o provedor é estruturalmente limitado: pode armazenar dados criptografados, mas não pode descriptografá-los.",
        "Isso não elimina todo risco. Malware no endpoint, extensões maliciosas do navegador, links copiados, senhas fracas e canais de entrega inseguros ainda importam. A criptografia reduz o limite de confiança; não substitui o julgamento operacional.",
        "O valor ainda é significativo: uma violação de banco de dados deveria expor texto cifrado ilegível, não o conteúdo da mensagem. Essa é a diferença entre prometer não ler os dados e ser tecnicamente incapaz de lê-los desde o início.",
      ],
    },
  ],
  continueReadingTitle: "Continue lendo",
  referencesTitle: "Referências",
  references: [
    { label: "Matthew Green, \"Does Zoom use end-to-end encryption?\"", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
