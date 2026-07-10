import type { SecretMessageArticleCopy } from "./secretMessageWithoutAccount.types";

export const secretMessageWithoutAccountPt: SecretMessageArticleCopy = {
  intro: [
    "Às vezes você precisa compartilhar algo confidencial: uma [senha](app:password-generator), um código de recuperação, uma senha de Wi‑Fi, uma nota privada ou uma mensagem pessoal. Mas criar uma conta só para isso frequentemente parece desnecessário.",
    "A boa notícia: não precisa.",
    "A [criptografia no navegador](blog:encrypted-vs-secure-file-sharing) moderna torna possível enviar uma mensagem secreta com segurança **sem fazer login**, instalar software ou confiar sua mensagem legível a um serviço.",
  ],
  sections: [
    {
      title: "Por que não criar uma conta?",
      paragraphs: [
        "Criar uma conta deixa mais rastros do que muitas pessoas percebem. Um serviço típico pode armazenar seu e-mail, um [nome de usuário](https://passwords.lu/en/blog/username-privacy-identity), histórico de login, informações do dispositivo, endereços IP e metadados sobre sua atividade.",
        "Para colaboração de longo prazo, isso pode ser perfeitamente razoável. Para compartilhar uma única mensagem confidencial, geralmente não.",
        'Se seu objetivo é simplesmente: "Quero que esta pessoa leia esta mensagem exatamente uma vez", uma conta frequentemente adiciona complexidade sem melhorar a segurança. Para esse padrão, [links secretos de uso único](blog:one-time-secret-links) costumam ser melhores.',
      ],
    },
    {
      title: "Criptografe antes de enviar",
      paragraphs: [
        "A pergunta importante não é apenas se um site usa HTTPS. Quase todo site usa HTTPS (TLS) hoje, que protege dados enquanto viajam pela internet. Nosso guia sobre [criptografia versus compartilhamento seguro de arquivos](blog:encrypted-vs-secure-file-sharing) explica por que criptografia de transporte sozinha não é o mesmo que privacidade ponta a ponta.",
        "A pergunta mais importante é: **quem pode ler sua mensagem depois que ela chega ao servidor?**",
      ],
    },
    {
      title: "Serviços web tradicionais",
      paragraphs: [
        "Muitas plataformas de mensagens enviam sua mensagem por uma conexão criptografada (HTTPS/TLS). Assim que a mensagem chega aos servidores deles, eles tecnicamente podem acessá-la antes de armazená-la ou processá-la.",
        "Dependendo do serviço, a mensagem pode ser escaneada por spam ou abuso, indexada para busca, processada por sistemas na nuvem, preservada em backups ou acessível a administradores.",
        "O TLS protege a conexão entre seu navegador e o serviço. Ele **não** impede necessariamente que o próprio serviço leia sua mensagem.",
      ],
    },
    {
      title: "Criptografia no navegador",
      paragraphs: ["Uma abordagem mais amigável à privacidade é criptografar a mensagem no seu navegador antes do upload."],
      beforeFlowSteps: "Neste modelo:",
      flowSteps: [
        {
          title: "Escreva sua mensagem",
          body: "Você compõe o segredo no navegador; nada é enviado ainda. Ou use Private AI e [Write with Private AI](app:home) para escrever no seu dispositivo antes da criptografia.",
        },
        {
          title: "Gere uma chave única localmente",
          body: "Seu navegador cria uma chave de criptografia no seu dispositivo.",
        },
        {
          title: "Criptografe antes do upload",
          body: "A mensagem é criptografada localmente. Apenas texto cifrado é enviado ao servidor.",
        },
        {
          title: "Compartilhe a chave no link",
          body: "A chave de descriptografia permanece com você e é compartilhada como parte do link seguro, geralmente no [fragmento da URL](blog:one-time-secret-links) que os navegadores não enviam aos servidores web.",
        },
      ],
      afterFlowSteps: [
        "O serviço armazena apenas dados criptografados e funciona como um intermediário. Sem a chave de descriptografia, o texto cifrado é praticamente inútil.",
        "O mesmo princípio vale para arquivos. A [transferência segura de arquivos](app:secure-file-transfer) criptografa documentos e arquivos no seu navegador antes do upload. Destinatários podem abrir o link sem conta; o envio requer login em uma conta PrivateNote gratuita.",
      ],
    },
    {
      title: "Por que você não precisa de conta por causa disso",
      paragraphs: [
        "Se um serviço nunca precisa ler sua mensagem, ele também tem pouca razão para saber quem você é. Por isso serviços com criptografia no navegador frequentemente funcionam sem registro. Veja [como links secretos de uso único funcionam](blog:one-time-secret-links) para o processo completo.",
        "Em vez de criar uma conta, você simplesmente escreve sua mensagem, gera um link seguro e o envia ao destinatário. Sem nomes de usuário. Sem senhas para memorizar. Sem caixa de entrada cheia de e-mails de verificação.",
      ],
    },
    {
      title: "Adicione uma camada extra com senha",
      paragraphs: [
        "Para informações muito sensíveis, você pode proteger a mensagem criptografada com uma senha adicional.",
        "Uma abordagem comum é enviar o link criptografado por um canal de comunicação e a senha por outro, por exemplo por telefone, SMS ou mensageiro. Um atacante precisaria de ambos para descriptografar a mensagem.",
      ],
    },
    {
      title: "Mensagens que desaparecem automaticamente",
      paragraphs: [
        "Informações confidenciais geralmente não deveriam ficar online para sempre. Muitos serviços de notas seguras permitem que mensagens [se removam após a primeira leitura](blog:one-time-secret-links), expirem após um tempo escolhido ou sejam excluídas automaticamente.",
        "Isso reduz quanta informação sensível permanece disponível online, similar a por que [mensagens no trabalho e logs de chat](blog:workplace-texts-private-note) são um lugar ruim para segredos de uso único. Nenhuma tecnologia impede que um destinatário faça screenshot ou copie o conteúdo após abrir, mas expiração automática reduz significativamente a exposição de longo prazo.",
      ],
    },
    {
      title: "Quando usar mensagens secretas anônimas?",
      paragraphs: ["Enviar mensagens criptografadas sem criar conta é útil para compartilhar:"],
      bullets: [
        "[Senhas e códigos de recuperação](blog:how-we-generate-passwords) — ou use nosso [gerador de senhas](app:password-generator) antes de compartilhar",
        "[Chaves de API](blog:privatenote-for-developers) e chaves de licença de software",
        "Links privados e notas comerciais confidenciais",
        "Informações financeiras e senhas de Wi‑Fi",
        "Mensagens pessoais temporárias que não deveriam ficar para sempre em e-mail ou histórico de chat",
      ],
    },
    {
      title: "O que procurar em um serviço seguro",
      paragraphs: ['Nem todo serviço de "mensagens privadas" ou "notas secretas" oferece o mesmo nível de proteção. Procure serviços que:'],
      bullets: [
        "Criptografam mensagens no seu navegador antes do upload",
        "Nunca recebem seu texto legível",
        "Não exigem conta",
        "Suportam expiração automática",
        "Oferecem proteção opcional por senha",
        "Usam criptografia autenticada moderna",
      ],
      callout:
        'Essas escolhas de design reduzem quanta confiança você precisa depositar no próprio serviço. Para uma base de segurança mais ampla — incluindo senhas, autenticação e compartilhamento seguro — veja [O mito da segurança "boa o suficiente"](blog:myth-good-enough-security).',
    },
    {
      title: "Como o PrivateNote se encaixa nesses princípios",
      paragraphs: [
        "O PrivateNote foi construído exatamente em torno dessas ideias. Quando você cria uma nota, a criptografia acontece inteiramente no seu navegador antes de qualquer upload. O servidor armazena apenas texto cifrado e funciona exclusivamente como intermediário entre você e seu destinatário; ele nunca recebe o texto legível da sua mensagem.",
        "Por esse design, você não precisa criar uma conta para enviar uma nota privada. Simplesmente escreva sua mensagem, gere um link seguro e compartilhe pelo canal de comunicação que preferir.",
        "Para proteção extra, você pode proteger a nota com senha, escolher quando expira, deixá-la autodestrutiva após a primeira leitura, anexar arquivos criptografados e opcionalmente receber notificações de entrega indicando quando uma nota foi aberta ou expirou — sem revelar o conteúdo da mensagem.",
        "O objetivo é simples: compartilhar informações confidenciais tão facilmente quanto um link, enquanto você deposita o mínimo de confiança no serviço.",
      ],
    },
    {
      title: "Conclusão",
      paragraphs: [
        "Enviar uma mensagem secreta não deveria significar criar mais uma conta ou entregar dados pessoais desnecessários.",
        "A criptografia no navegador permite criptografar sua mensagem antes de sair do seu dispositivo, para que o serviço armazene apenas texto cifrado em vez da sua mensagem real. Combinada com [links com expiração](blog:one-time-secret-links) e proteção opcional por senha, isso oferece uma forma simples e prática de compartilhar informações confidenciais.",
        "Seja uma senha, um código de recuperação ou uma nota pessoal: um serviço que criptografa dados no seu navegador e não exige conta oferece mais privacidade com menos complicação.",
      ],
    },
  ],
  closingTitle: "Experimente sem fazer login",
  closingBody: [
    "O PrivateNote foi projetado em torno desses princípios: compartilhar mensagens seguras tão simples quanto criar um link e enviá-lo ao destinatário pretendido.",
  ],
  fileSharingNote:
    "O PrivateNote também oferece [transferência segura de arquivos](app:secure-file-transfer) para compartilhar documentos e pastas com o mesmo modelo de criptografia no navegador. O envio requer uma conta gratuita; destinatários podem abrir o link sem fazer login.",
  tagline: "Menos complicação de conta. Menos metadados. Mais controle sobre o que permanece online após a transferência.",
  relatedReading: "Leituras relacionadas",
  relatedPosts: [
    {
      slug: "one-time-secret-links",
      blurb: "Explicação detalhada sobre links de uso único, o fragmento da URL e por que efemeridade é melhor que e-mail ou Slack para segredos de uso único.",
    },
    {
      slug: "encrypted-vs-secure-file-sharing",
      blurb: "TLS versus criptografia no navegador — o que cada um protege e por que o servidor ainda pode ler seus dados.",
    },
    {
      slug: "how-we-generate-passwords",
      blurb: "Como criar senhas fortes e compartilhá-las sem reutilizar padrões ou deixá-las no histórico de chat.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb: "Por que rastros escritos em e-mail e chat no trabalho criam riscos de longo prazo — e quando notas efêmeras são melhores.",
    },
    {
      slug: "myth-good-enough-security",
      blurb: "Uma base prática de segurança: senhas, autenticação, mensagens e padrões de compartilhamento seguro.",
    },
    {
      slug: "privatenote-for-developers",
      blurb: "Compartilhe chaves de API e credenciais do seu editor sem colar segredos no Slack ou em tickets.",
    },
  ],
};
