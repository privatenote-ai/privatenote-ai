import type { ShareApiKeyArticleCopy } from "./shareApiKeySecurely.types";

export const shareApiKeySecurelyPt: ShareApiKeyArticleCopy = {
  heroAlt: "Dois laptops trocando uma chave de API por um link criptografado de uso único do PrivateNote",
  heroCaption: "Ilustração gerada para PrivateNote.ai.",
  takeawaysHeading: "Principais conclusões",
  takeaways: [
    "Nunca cole chaves de API em e-mail, chat, tickets, docs ou Git.",
    "Chave mais restrita: menor privilégio, vida curta, depois rotacione.",
    "Envie segredos por um link de uso único cifrado no navegador.",
    "Para chaves de alto risco, cifre localmente primeiro; compartilhe só o ciphertext.",
    "Monitore uso incomum—PrivateNote é entrega, não um vault.",
  ],
  intro:
    "Todo desenvolvedor eventualmente precisa enviar uma chave de API para outra pessoa — para acesso a staging, um contratado, uma integração webhook ou entrega a um cliente. O caminho mais rápido geralmente é também o que deixa o rastro mais longo.",
  avoidChannels: [
    "Slack, Microsoft Teams, Discord ou outro histórico de chat",
    "E-mail, SMS ou threads de caixa de entrada encaminhadas",
    "Jira, Trello, Notion, Confluence ou issues do GitHub",
    "Documentos de texto plano, planilhas e pastas compartilhadas na nuvem",
    "Commits git, pull requests e comentários de código",
  ],
  leakSources: [
    {
      title: "E-mail",
      body: "O e-mail cria cópias de longa duração. Uma chave pode sobreviver em caixas de entrada, arquivos, backups, sincronização móvel, threads encaminhadas e índices de busca — muito depois que a tarefa terminou.",
    },
    {
      title: "Chat de equipe",
      body: "Slack e Teams preservam contexto — o que os torna arriscados para segredos. Uma chave colada pode ficar pesquisável para futuros membros do workspace ou vazar por um dispositivo comprometido.",
    },
    {
      title: "Ferramentas de projeto",
      body: "Jira, Notion, Confluence, Trello e GitHub Issues não são cofres de credenciais. Tickets excluídos podem persistir em exportações, backups, trilhas de auditoria e busca assistida por IA.",
    },
    {
      title: "Repositórios Git",
      body: "O histórico Git gruda. Remover uma chave em um commit posterior não apaga commits anteriores. Repositórios públicos são escaneados continuamente, e credenciais de nuvem expostas podem ser abusadas em minutos.",
    },
  ],
  prepSteps: [
    {
      title: "Use o menor escopo possível",
      body: "Evite chaves primárias de produção. Prefira chaves de staging, permissões somente leitura, restrições de IP, tokens de curta duração e credenciais específicas de integração.",
    },
    {
      title: "Planeje rotação ou revogação",
      body: "Trate chaves de API compartilhadas como temporárias. Revogue-as após onboarding, testes, engajamento de contratado ou entrega ao cliente.",
    },
    {
      title: "Observe padrões de uso",
      body: "Localizações inesperadas, picos súbitos de requisições, novos endpoints ou cobrança incomum são frequentemente os primeiros sinais de que uma chave vazou.",
    },
    {
      title: "Entregue via link criptografado de uso único",
      body: "Criptografe a chave localmente antes de ela entrar em um canal de comunicação. Envie um link de curta duração em vez de deixar o segredo bruto em histórico permanente de chat ou e-mail.",
    },
  ],
  handoffSteps: [
    { key: "scope", label: "Limite a chave", detail: "Apenas permissões mínimas" },
    { key: "encrypt", label: "Criptografe localmente", detail: "A chave nunca sai do seu navegador" },
    { key: "send", label: "Envie o link", detail: "Não o segredo bruto" },
    { key: "revoke", label: "Revogue após uso", detail: "Rotacione após a transferência" },
  ],
  faqs: [
    {
      question: "Por que não apenas uma variável de ambiente?",
      answer:
        "Variáveis de ambiente são ótimas para software local. Elas não resolvem o problema de transporte quando você precisa transferir o valor a um colega, contratado, cliente ou parceiro de integração.",
    },
    {
      question: "Chaves de API devem sempre expirar?",
      answer:
        "Se o provedor suportar: sim. Credenciais de curta duração reduzem a janela de abuso após exposição acidental e tornam a rotação o fluxo normal.",
    },
    {
      question: "Qual é o fluxo de trabalho mais seguro?",
      answer:
        "Crie uma chave com escopo restrito, envie via link criptografado no navegador, compartilhe uma senha opcional por um canal separado e rotacione ou revogue a chave após conclusão. Para chaves de alto risco ou longa duração: primeiro criptografe localmente com age ou OpenSSL e faça upload apenas do ciphertext.",
    },
    {
      question: "O PrivateNote é um gerenciador de segredos?",
      answer:
        "Não. O PrivateNote resolve transferência segura entre humanos. Para armazenamento máquina-a-máquina, use HashiCorp Vault, AWS Secrets Manager, Google Cloud Secret Manager ou Azure Key Vault.",
    },
  ],
  sections: {
    treatLikePasswords: {
      title: "Trate chaves de API como senhas de produção",
      paragraphs: [
        "Uma chave de API é essencialmente uma senha para software. Dependendo das permissões, uma chave vazada pode expor dados de clientes, consumir recursos pagos, implantar infraestrutura na nuvem, enviar e-mail pelo seu domínio verificado ou inflar uma conta de IA.",
        "Diferente de senhas humanas, chaves de API frequentemente permanecem válidas por meses, ficam em arquivos de configuração e contornam completamente a autenticação multifator. Se uma chave vaza, um atacante pode agir como sua aplicação — tráfego malicioso pode se esconder no tráfego normal de produção até os custos subirem ou os dados já estarem expostos.",
      ],
    },
    neverPaste: {
      title: "Nunca cole chaves de API em sistemas permanentes",
      intro:
        "Esses canais são convenientes porque preservam histórico. Exatamente por isso são o lugar errado para segredos.",
      avoidHeading: "Evite estes canais",
    },
    whereLeak: {
      title: "Onde chaves de API realmente vazam",
      intro:
        "A maioria dos vazamentos não são quebras criptográficas complexas. Acontecem quando alguém copia um segredo para um sistema feito para manter registros.",
    },
    beforeShare: {
      title: "Antes de compartilhar",
      intro:
        "Primeiro reduza o raio de dano. Como você entrega a chave importa — mas uma chave com escopo restrito limita o dano se algo der errado.",
      newKeyTitle: "Criando uma nova chave?",
      newKeyBefore: "Gere credenciais de alta entropia localmente no navegador — o",
      newKeyLink: "gerador de chaves de API",
      newKeyAfter: "no passwords.lu roda no cliente; nada é enviado.",
    },
    highRisk: {
      title: "Chaves de alto risco: criptografe localmente primeiro",
      p1: "A maioria das chaves de API é substituível: tokens de staging, segredos de integração de curta duração e credenciais com escopo restrito que você quer rotacionar. Para isso, transferência criptografada no navegador de uso único geralmente basta.",
      p2: "Algumas chaves pesam mais — acesso admin de produção, chaves de assinatura, credenciais root de nuvem ou qualquer coisa de longa duração que seja dolorosa ou impossível de revogar limpo. Trate isso como segredos mestres: **criptografe localmente antes de qualquer coisa ir para a web**, depois envie ciphertext via PrivateNote.",
      calloutHeading: "Criptografe localmente primeiro",
      ageBullet:
        "**age** — defaults mais simples para criptografia de arquivos (`age -p -o key.txt.age key.txt`)",
      opensslBullet: "**OpenSSL** — CLI confiável se você conhece as flags",
      separateChannelBullet:
        "Faça upload do arquivo criptografado com PrivateNote; envie a senha de descriptografia por um **canal separado** (Signal, telefone, pessoalmente)",
      outro:
        "O mesmo fluxo vale para frases de recuperação de criptomoedas e outros segredos mestres irreplaceáveis. Veja [frases de recuperação crypto e links de uso único](blog:crypto-seed-phrase-one-time-link) para o guia completo age/OpenSSL, dicas de senha e quando links de uso único se encaixam — e quando não.",
    },
    handoff: {
      title: "Um fluxo de transferência mais seguro",
      intro:
        "Quando um humano precisa da chave — não quando um app a busca em runtime — siga esta ordem.",
      diagramCaption: "Transferência segura em um relance",
      diagramFootnote:
        "Compartilhe uma senha de nota por um canal separado — nunca na mesma mensagem que o link.",
    },
    privateNote: {
      title: "Como o PrivateNote se encaixa na transferência",
      p1: "O PrivateNote foi construído para o momento humano-a-humano: chaves de API, chaves privadas SSH, credenciais de banco de dados, códigos de recuperação, segredos de assinatura webhook e senhas temporárias que precisam chegar a uma pessoa sem virar registro permanente.",
      relatedSsh:
        "Se o segredo for uma chave SSH em vez de uma credencial de API, veja [como compartilhar chaves SSH com segurança](blog:how-to-share-ssh-keys-securely) sobre chaves públicas vs privadas, deploy keys e extensões do editor.",
      p2: "O segredo é criptografado no seu navegador antes do upload. O PrivateNote armazena ciphertext, não texto plano. A chave de descriptografia fica no fragmento da URL — a parte após `#` — que o navegador não envia ao servidor ao carregar. Esse é o modelo do [link de uso único](blog:one-time-secret-links) aplicado a credenciais de API.",
      urlExample: "https://privatenote.ai/note/abc123#kL8mN4...",
      bullet1: "O servidor recebe o ID da nota e o payload criptografado.",
      bullet2: "O servidor não recebe a chave de descriptografia.",
      bullet3: "Burn-after-reading e expiração limitam por quanto tempo a nota criptografada existe.",
      p3: "O PrivateNote complementa cofres de segredos dedicados — fecha a lacuna quando você envia uma chave Stripe a um parceiro de integração, compartilha uma chave OpenAI temporária com um contratado ou dá acesso de staging único a um colega.",
    },
    faq: { title: "Perguntas frequentes" },
    bottomLine: {
      title: "A conclusão",
      body: "A maioria dos vazamentos de chaves de API não acontece porque a criptografia falhou. Acontecem porque alguém copiou um segredo por conveniência para um sistema permanente e pesquisável. Limite chaves, compartilhe apenas quando necessário e não deixe rastro de texto plano em chat, tickets, e-mail ou git.",
    },
  },
  ctaTitle: "Compartilhe uma chave de API sem deixá-la no chat",
  ctaBody:
    "Crie um link PrivateNote criptografado no navegador com burn-after-reading. Sem conta necessária para notas de uso único.",
  ctaButton: "Criar PrivateNote ->",
};
