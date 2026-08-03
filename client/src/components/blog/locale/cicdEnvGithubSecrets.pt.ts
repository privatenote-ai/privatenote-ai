import type { CicdEnvGithubSecretsArticleCopy } from "./cicdEnvGithubSecrets.types";

export const cicdEnvGithubSecretsPt: CicdEnvGithubSecretsArticleCopy = {
  heroAlt:
    "Laptop de desenvolvedor numa mesa à noite mostrando um terminal e ficheiros de configuração sob luz azul fria",
  heroCaption:
    "A maioria das fugas de secrets começa por comodidade: um .env commitado, uma variável de CI colada, ou uma chave que nunca saiu do histórico do Git.",
  intro: [
    "As chaves de API raramente vazam por ataques criptográficos sofisticados. Vazam por workflows de desenvolvedores—ficheiros `.env` commitados no Git, secrets ecoados em logs de CI e credenciais coladas em pull requests «só por agora».",
    "Se já sabe [como partilhar uma chave de API com segurança](blog:how-to-share-api-key-securely), este guia é a camada seguinte: onde essas chaves realmente escapam na entrega moderna de software, e como impedir que GitHub, CI/CD e a config local se tornem um arquivo permanente do seu acesso de produção.",
    "O padrão é sempre o mesmo. Um secret entra num sistema feito para guardar histórico. Meses depois, um fork, uma exportação de logs, um portátil comprometido ou um scan de um repo público transforma essa comodidade num incidente.",
  ],
  sections: [
    {
      title: "Porque ficheiros .env e CI/CD atraem fugas de desenvolvedores",
      paragraphs: [
        "Ficheiros de ambiente locais e pipelines existem para mover configuração depressa. Essa velocidade é útil—e perigosa—porque os secrets costumam viajar com as mesmas ferramentas que usa para code review, artefactos de build e automação.",
        "Um ficheiro `.env` parece temporário. Um secret no CI parece «tratado». Um `echo $DATABASE_URL` de debug parece inofensivo num repo privado. Atacantes—e scanners automáticos de secrets—não se importam se a exposição foi intencional. Importam-se com permanência, pesquisabilidade e raio de impacto.",
        "Trate cada secret que toque Git ou CI como se eventualmente fosse copiado, espelhado ou indexado. Desenhe o workflow para que essa assunção seja sobrevivível: credenciais de curta duração, stores de secrets adequados e entregas humanas que não deixem texto em claro no chat ou em tickets.",
      ],
    },
    {
      title: "Como os secrets escapam através do GitHub",
      subsections: [
        {
          title: "Ficheiros .env e de config commitados",
          paragraphs: [
            "A fuga clássica continua a ser a mais comum: `cp .env.example .env`, preencher valores de produção e depois `git add .` sem reparar. Mesmo que apague o ficheiro no commit seguinte, o secret permanece no histórico do Git até o reescrever—e repositórios públicos podem ser escaneados muito depressa por credenciais expostas. Reescrever o histórico também não apaga todas as cópias: forks, mirrors, caches de CI e clones locais podem ainda guardar os commits antigos.",
            "As variantes incluem `docker-compose.yml` com passwords hardcoded, estado Terraform com outputs sensíveis, manifests Kubernetes que guardam «secrets» em base64 (base64 é encoding, não encriptação—quem puder ler o manifest pode descodificar o valor) e células de notebook que imprimem tokens. Se parece configuração, assuma que os scanners o tratarão como um dump de credenciais.",
          ],
        },
        {
          title: "Pull requests, issues e comentários",
          paragraphs: [
            "Os desenvolvedores colam chaves de staging em descrições de PR para «ajudar o reviewer a reproduzir o bug». Comentários de tickets e GitHub Discussions herdam o mesmo problema: permanência pesquisável, notificações, digests de email e exportações.",
            "Repositórios privados reduzem muito a exposição casual, mas ainda não são um store de secrets adequado. Mudanças de acesso, contractors, contas comprometidas, clones, backups e integrações podem todos fazer ressurgir texto em claro histórico. Para entregas de chaves de API entre pessoas, use um [link de uso único encriptado no cliente](blog:one-time-secret-links)—não um comentário de PR.",
          ],
        },
        {
          title: "Forks, mirrors e histórico que nunca morre",
          paragraphs: [
            "Uma chave commitada uma vez pode sobreviver em forks, mirrors, caches de CI e clones locais muito depois de a branch principal estar limpa. A rotação do secret é a remediação real; reescrever o histórico é controlo de danos.",
            "Se o GitHub Secret Scanning, TruffleHog, gitleaks ou um alerta do cloud provider disparar, rode primeiro. Depois remova o secret das branches ativas. Só então decida se reescrever o histórico vale o custo de coordenação.",
          ],
        },
      ],
      calloutTitle: "Regra rígida",
      callout:
        "Nunca faça commit de secrets live no Git—nem mesmo credenciais temporárias de staging. Se um secret tiver de se mover entre pessoas, use um canal de entrega seguro adequado, como um link de uso único encriptado no cliente. Se a automação precisar do secret, use o mecanismo nativo de secrets da plataforma CI, um secrets manager dedicado ou, de preferência, credenciais de curta duração obtidas via workload identity ou OIDC—não o repositório.",
    },
    {
      title: "Como os secrets escapam através de CI/CD",
      subsections: [
        {
          title: "Texto em claro em ficheiros de workflow",
          paragraphs: [
            "Colocar `API_KEY: sk-...` diretamente em `.github/workflows/*.yml`, YAML do GitLab CI ou config do CircleCI é só fazer commit de um secret com passos extra. Ficheiros de workflow são código. São revistos, clonados e retidos para sempre.",
            "Use o mecanismo nativo de secrets da plataforma (secrets do GitHub Actions, variáveis do GitLab CI/CD e equivalentes) e referencie-os como bindings de ambiente—não YAML hardcoded. Secrets nativos de CI são muito melhores do que o repositório, mas não são magia: lógica maliciosa de workflow, dependências comprometidas e logging descuidado ainda podem expor valores em runtime. Prefira OIDC ou outra federação de identidade de workload para cloud providers para não precisar de chaves cloud de longa duração no CI.",
          ],
        },
        {
          title: "Logs de pipeline e saída de debug",
          paragraphs: [
            "Logs de build são um arquivo subestimado. Imprimir variáveis de env «para depurar o deploy», fazer dump de `process.env` ou correr saída verbose de Terraform/Helm pode escrever credenciais em armazenamento de logs que sobrevive ao job.",
            "Assuma que os logs são legíveis por quem tem acesso ao CI—e por vezes por quem pode descarregar artefactos. Mascare secrets, evite dumps de env e trate uma linha de log vazada como uma password vazada: rode.",
          ],
        },
        {
          title: "Pull requests de forks",
          paragraphs: [
            "PRs de forks são uma armadilha clássica de CI: código não confiável a correr com secrets. A maioria das plataformas restringe a disponibilidade de secrets em workflows de forks precisamente por isso. Mantenha assim. Nunca «ative secrets» para contribuidores externos só para pôr um check a verde.",
            "Em repos internos, separe na mesma jobs de deploy privilegiados dos checks de PR. Build e test com least privilege; deploy só a partir de branches confiáveis com secrets concedidos explicitamente.",
          ],
        },
        {
          title: "Runners partilhados e fuga de artefactos",
          paragraphs: [
            "Runners self-hosted, caches partilhados e artefactos carregados podem reter tokens mais tempo do que o job que os criou. Limpe workspaces, delimite bem as cache keys e nunca empacote ficheiros `.env` em artefactos de build «por comodidade».",
          ],
        },
      ],
    },
    {
      title: "Um modelo mental mais seguro: três lugares onde secrets podem viver",
      paragraphs: [
        "A confusão acontece quando as equipas usam uma ferramenta para cada tarefa. Divida o problema por ciclo de vida.",
      ],
      comparisonTable: {
        headers: ["Lugar", "Ideal para", "Não para"],
        rows: [
          [
            "Local .env / dotenv",
            "Config de desenvolvimento local que fica no portátil e está corretamente no gitignore",
            "Partilhar com colegas, CI, Git, ou secrets de produção de longa duração em texto em claro",
          ],
          [
            "Secrets nativos de CI / Vault / cloud secret manager",
            "Runtime máquina a máquina e automação de deploy",
            "Entregas humanas por chat ou mensagens de longa duração «passa isto ao contractor»",
          ],
          [
            "Nota de uso único encriptada no cliente",
            "Entrega humana de uma chave, token ou snippet .env",
            "Armazenar secrets de produção para apps ou pipelines",
          ],
        ],
        after: [
          "Um `.env` no gitignore serve para desenvolvimento local. Secrets sensíveis de produção idealmente também não devem viver indefinidamente em texto em claro em máquinas de desenvolvedores—prefira um password manager ou acesso de curta duração quando for prático. PrivateNote está na terceira linha: entrega segura entre pessoas. Não substitui secrets do GitHub Actions, HashiCorp Vault, AWS Secrets Manager ou o seu password manager. Para entregas diárias de chaves de API, combine isto com [como partilhar uma chave de API com segurança](blog:how-to-share-api-key-securely).",
        ],
      },
    },
    {
      title: "Workflow prático: manter secrets fora do Git e do chat",
      flowIntro:
        "Quando um colega, contractor ou cliente precisa de um valor que acabará no CI ou num `.env` local, use esta sequência:",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Criar uma credencial com scope e curta duração",
          body: "Prefira chaves de staging, scopes de só leitura, allowlists de IP e expiração. Evite distribuir a chave principal de produção «porque é mais rápido».",
        },
        {
          step: "Passo 2",
          title: "Entregar através de uma nota de uso único encriptada no cliente",
          body: "Encripte o secret (ou as poucas linhas `.env` necessárias) localmente com PrivateNote—via a [app web](app:home), a [CLI](app:developers/cli), a [extensão VS Code / Cursor](app:developers/vscode) ou a [extensão Chrome](chrome:extension). Defina uma expiração curta ou burn-after-read e envie o link da nota—não o texto em claro—via Slack, email ou ticket.",
        },
        {
          step: "Passo 3",
          title: "Instalar no store certo",
          body: "O destinatário copia o valor para um `.env` local no gitignore (para desenvolvimento), um password manager ou o store de secrets CI/cloud. Não o cole de volta na PR, no thread do chat ou num doc partilhado.",
        },
        {
          step: "Passo 4",
          title: "Rodar quando o trabalho terminar",
          body: "Revogue chaves de contractors, rode após incidentes e substitua qualquer credencial que alguma vez tenha aparecido em logs, Git ou um ticket. Comodidade sem rotação é só resposta a incidentes adiadas.",
        },
      ],
      midCta: {
        body: "Precisa de entregar um token de CI ou umas linhas .env agora? Envie uma nota de uso único encriptada no cliente em vez de commitir ou colar texto em claro.",
        button: "Criar uma nota privada",
      },
    },
    {
      title: "Partilhe de onde já trabalha",
      paragraphs: [
        "Não precisa de sair do terminal, editor ou separador do browser para criar uma nota de uso único encriptada no cliente. Escolha a superfície PrivateNote que encaixa no momento—a encriptação acontece sempre localmente no seu dispositivo antes do upload. Para um guia mais completo, veja [PrivateNote para desenvolvedores](blog:privatenote-for-developers).",
      ],
      subsections: [
        {
          title: "CLI",
          paragraphs: [
            "Leia de um ficheiro ou faça pipe de stdin para que o secret nunca fique no histórico da shell como argumento de `echo`: `npx privatenote-cli --expire 1h --output-url-only .env.local` ou `cat secret.txt | npx privatenote-cli --expire 1h --output-url-only`. Útil em workflows de shell, scripts e entregas rápidas no terminal. Setup e flags: [PrivateNote CLI](app:developers/cli).",
          ],
        },
        {
          title: "VS Code e Cursor",
          paragraphs: [
            "Instale a [extensão VS Code / Cursor](app:developers/vscode) e encripte a partir da sidebar, seleção do editor ou menu de contexto—ideal quando o secret já está no ecrã num `.env` ou ficheiro de config e nunca deve chegar ao Slack em texto em claro.",
          ],
        },
        {
          title: "Extensão Chrome",
          paragraphs: [
            "Quando a credencial aparece em email, docs ou um ticket, a [extensão Chrome](chrome:extension) transforma o texto selecionado numa nota de uso único encriptada no browser sem sair do separador.",
          ],
        },
      ],
    },
    {
      title: "Checklist de desenvolvedor antes de cada push e alteração de pipeline",
      useCaseTable: {
        headers: ["Checkpoint", "O que verificar"],
        rows: [
          [
            "Antes do git commit",
            "`.env`, `*.pem`, `credentials.json` e ficheiros locais de secrets estão no gitignore; `git status` não mostra adições surpresa",
          ],
          [
            "Antes de abrir uma PR",
            "Nenhuma chave em descrição, screenshots, fixtures ou ficheiros de debug «temporários»",
          ],
          [
            "Antes de editar workflows",
            "Secrets vêm do mecanismo nativo de secrets da plataforma ou de OIDC/workload identity—não de YAML hardcoded",
          ],
          [
            "Antes de depurar CI",
            "Sem `env`, `printenv` ou dumps verbose que possam escrever secrets em logs",
          ],
          [
            "Após qualquer exposição",
            "Rodar primeiro, depois limpar histórico/branches; tratar scanners como gatilhos de incidente",
          ],
        ],
      },
      callout:
        "Adicione secret scanning ao caminho por defeito: hooks pre-commit (gitleaks), scanning em CI e GitHub Secret Scanning / push protection. Prevenção bate reescritas heroicas de histórico.",
    },
    {
      title: "O que fazer se um secret já está no GitHub",
      paragraphs: [
        "Aja nesta ordem: **rode ou revogue** a credencial junto do provider, **invalide** sessões ou webhooks dependentes, **remova** o secret da branch por defeito e depois decida se uma reescrita de histórico é necessária por compliance ou exposição pública. Mesmo após uma reescrita, assuma que forks, mirrors, caches e clones ainda podem guardar cópias até serem tratados em separado.",
        "Notifique os owners de qualquer sistema que a chave possa atingir. Verifique faturação cloud, logs de acesso e uso invulgar de API. Se o secret também foi colado no Slack ou email, assuma que esses arquivos ainda o contêm—veja [porque o email é o pior sítio para secrets](blog:why-email-is-worst-for-secrets) e [secrets que nunca deve enviar no chat](blog:secrets-never-send-in-chat).",
        "Para secrets de valor extremamente alto como seed phrases de criptomoeda, evite transmiti-los sempre que possível. Para outras credenciais root insubstituíveis, não as escreva num site—encripte primeiro localmente e partilhe só ciphertext quando tiver de. Esse modelo está coberto no nosso [guia de seed phrase crypto](blog:crypto-seed-phrase-one-time-link).",
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "Um repo privado do GitHub chega para ficheiros .env?",
          answer:
            "Não. Um repositório privado limita muito a exposição, mas ainda não é um store de secrets adequado. Mudanças de acesso, contas comprometidas, clones, backups e integrações de terceiros podem todos fazer ressurgir texto em claro histórico. Mantenha secrets completamente fora do Git.",
        },
        {
          question: "Os secrets do GitHub Actions chegam?",
          answer:
            "São o sítio certo para muitos valores de runtime de CI—muito melhor do que YAML ou ficheiros do repo. Ainda não resolvem entrega humana, fugas em logs, permissões demasiado amplas, riscos de PRs de forks nem exposição via passos de workflow maliciosos e dependências comprometidas. Combine o mecanismo nativo de secrets da plataforma com least privilege, logging cuidadoso e, de preferência, credenciais de curta duração via OIDC ou workload identity.",
        },
        {
          question: "Devo commitir um .env.example redigido?",
          answer:
            "Sim. Commita só nomes de variáveis e placeholders fictícios. Nunca valores reais, chaves de staging «quase reais» ou connection strings de produção com a password removida mas host e username intactos se essa combinação for sensível no seu threat model.",
        },
        {
          question: "Um ficheiro .env local está bem?",
          answer:
            "Para desenvolvimento local, sim—quando está corretamente no gitignore e nunca é commitado. Secrets sensíveis de produção idealmente não devem viver indefinidamente em ficheiros `.env` em texto em claro em máquinas de desenvolvedores; use um password manager, acesso de curta duração ou um secrets manager quando for prático.",
        },
        {
          question: "O PrivateNote pode substituir Vault ou secrets do GitHub?",
          answer:
            "Não. PrivateNote é para entrega segura pessoa a pessoa. Use o mecanismo nativo de secrets da plataforma CI e secrets managers dedicados para automação. Use PrivateNote quando uma pessoa precisa de receber uma chave, token ou snippet .env sem deixar texto em claro no Slack, email ou GitHub.",
        },
        {
          question: "Qual é a entrega segura mais rápida para um token de CI?",
          answer:
            "Crie um token com scope estreito, entregue-o através de uma nota de uso único encriptada no cliente (web, [CLI](app:developers/cli), [VS Code](app:developers/vscode) ou [Chrome](chrome:extension)), faça o destinatário guardá-lo no store de secrets do CI ou num password manager e depois revogue o token quando o trabalho terminar.",
        },
      ],
    },
    {
      title: "Considerações finais",
      paragraphs: [
        "GitHub e CI/CD são excelentes a preservar trabalho. É exatamente por isso que são maus sítios para preservar secrets.",
        "Mantenha ficheiros `.env` locais, no gitignore e limitados ao desenvolvimento quando puder. Coloque credenciais de automação em secrets nativos de CI, um secrets manager ou credenciais OIDC de curta duração. Quando uma pessoa precisa de um valor, use uma nota de uso único encriptada no cliente—depois rode.",
        "Se a sua equipa ainda cola chaves em PRs ou commita credenciais «só de staging», comece pelo [workflow de partilha de chaves de API](blog:how-to-share-api-key-securely) e a checklist acima. Para material de acesso a servidores, use [como partilhar chaves SSH com segurança](blog:how-to-share-ssh-keys-securely). Integre a [CLI](app:developers/cli), a [extensão VS Code](app:developers/vscode) ou a [extensão Chrome](chrome:extension) no caminho de menor resistência para que a opção segura também seja a rápida.",
      ],
    },
  ],
  ctaTitle: "Partilhe o secret—não uma cópia permanente",
  ctaBody:
    "Encripte um token de CI ou um snippet .env localmente com PrivateNote—usando a app web, CLI, VS Code / Cursor ou extensão Chrome—antes de chegar ao chat ou ao Git. Use uma expiração curta ou burn-after-read, envie o link da nota de uso único em vez de texto em claro e mantenha o histórico de Git e pipelines livre de credenciais live.",
  ctaButton: "Criar uma nota privada",
};
