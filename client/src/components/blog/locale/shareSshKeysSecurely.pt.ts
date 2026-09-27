import type { ShareSshKeysSecurelyArticleCopy } from "./shareSshKeysSecurely.types";

export const shareSshKeysSecurelyPt: ShareSshKeysSecurelyArticleCopy = {
  heroAlt:
    "Desenvolvedor trabalhando em uma mesa com um laptop aberto em código—onde as transferências de chaves SSH costumam começar",
  heroCaption:
    "Chaves privadas SSH pertencem a transferências criptografadas e de curta duração—não ao Slack, e-mail ou histórico do git. Imagem: mesa de programação via Pixabay.",
  intro: [
    "Um colega de equipe precisa acessar o servidor de staging. Um contratado precisa de uma chave de deploy para o fim de semana. O laptop de alguém quebrou e o único acesso restante é a chave privada na sua máquina.",
    "O caminho mais rápido geralmente é o mesmo mau hábito: colar o bloco PEM no Slack, enviá-lo por e-mail «só esta vez», ou colocá-lo em um ticket. Essa mensagem sincroniza com telefones, aparece em índices de busca, e pode ficar em backups muito depois de a emergência ter passado.",
    "Chaves privadas SSH são segredos com um raio de dano alto. Uma única chave vazada pode significar acesso shell completo. Este guia aborda quando você deve compartilhar uma chave privada, o que nunca colar no chat, e como entregar uma com um link criptografado que se autodestrói após a leitura (burn-after-reading)—além das extensões para desenvolvedores da PrivateNote que tornam o caminho seguro também o caminho rápido.",
  ],
  sections: [
    {
      title: "Chave pública vs. chave privada (30 segundos de clareza)",
      paragraphs: [
        "Um par de chaves SSH tem duas metades. A chave **pública** é feita para ser compartilhada: você a adiciona ao `~/.ssh/authorized_keys`, a um console na nuvem, ou a uma chave de deploy do GitHub. Enviar a chave pública de alguém pelo chat é normal.",
        "A chave **privada** (`id_ed25519`, `id_rsa`, um arquivo `.pem`) é o segredo. Qualquer pessoa que a tenha pode se autenticar como essa identidade até você revogar o acesso. Trate-a como uma senha que destranca um servidor—porque é exatamente isso que ela é.",
        "Se seu instinto diz «precisamos compartilhar a chave privada», pare e pense. Em muitos casos você deveria compartilhar a chave **pública** em vez disso: o destinatário gera seu próprio par localmente e você autoriza a chave pública dele no host.",
      ],
      calloutTitle: "Regra prática",
      callout:
        "Prefira adicionar a chave pública deles em vez de enviar sua chave privada. Transferências de chave privada são para casos de recuperação de emergência (break-glass) e casos legados—não para o onboarding padrão.",
    },
    {
      title: "Prefira não compartilhar a chave privada",
      paragraphs: [
        "Antes de criptografar e enviar qualquer coisa, pergunte-se se a chave privada realmente precisa se mover:",
      ],
      subsections: [
        {
          title: "Adicione a chave pública deles",
          paragraphs: [
            "Peça que executem `ssh-keygen`, enviem a você o arquivo `.pub` (seguro no chat), e o adicionem ao `authorized_keys` ou às configurações SSH do provedor. Eles mantêm a metade privada; você nunca a vê.",
          ],
        },
        {
          title: "Use uma chave de deploy dedicada",
          paragraphs: [
            "Para CI ou um único repositório, crie uma chave de deploy dedicada com o escopo mínimo. Evite reutilizar uma chave pessoal de laptop em vários sistemas.",
          ],
        },
        {
          title: "Prefira acesso de curta duração",
          paragraphs: [
            "Onde sua stack suportar—certificados SSH, hosts bastião (jump hosts), Tailscale SSH, papéis de IAM na nuvem—prefira acesso limitado por tempo em vez de copiar chaves privadas de longa duração.",
          ],
        },
        {
          title: "Quando a transferência de chave privada é justificada",
          paragraphs: [
            "Recuperação de emergência (break-glass), um host legado que não pode registrar novas chaves rapidamente, ou uma emergência em que existe apenas uma chave protegida por frase secreta. Mesmo assim: criptografe a transferência, mantenha a expiração curta, confirme o recebimento e depois rotacione ou revogue.",
          ],
        },
      ],
    },
    {
      title: "Onde as chaves SSH morrem na prática",
      paragraphs: [
        "Os mesmos canais que vazam [chaves API](blog:how-to-share-api-key-securely) e [senhas](blog:how-to-share-a-password-securely) vazam material SSH—frequentemente com consequências piores.",
      ],
      comparisonTable: {
        headers: ["Canal", "Por que falha", "O que os atacantes obtêm"],
        rows: [
          [
            "Slack, Teams, Discord",
            "Histórico pesquisável, sincronização de dispositivos, exportações de workspace",
            "Chave privada completa em texto puro para sempre",
          ],
          [
            "E-mail",
            "Caixas de entrada, arquivos, sincronização móvel, reenvios",
            "Uma cópia duradoura que você não pode apagar de forma confiável",
          ],
          [
            "Tickets e documentos",
            "Jira, Notion, Confluence, issues do GitHub",
            "Chaves em backups, busca com IA e trilhas de auditoria",
          ],
          [
            "Repositórios Git",
            "O histórico é persistente; «excluir e fazer push» não apaga nada",
            "Scanners encontram PEMs em minutos em repositórios públicos",
          ],
        ],
        after: [
          "Se o segredo já apareceu no chat ou no git, considere-o queimado. Revogue a chave, gere um novo par, e entregue a substituição por meio de um [link criptografado de uso único](blog:one-time-secret-links)—não outro colar. Para vazamentos de pipeline e `.env`, veja [segredos em CI/CD e GitHub](blog:secrets-in-cicd-env-github-leaks).",
        ],
      },
    },
    {
      title: "Uma transferência mais segura de chave privada SSH",
      paragraphs: [
        "Quando você precisar mover uma chave privada, trate a transferência como uma entrega temporária—não como armazenamento. O mesmo padrão usado para senhas e chaves API se aplica: criptografar localmente, enviar um link, destruir após a leitura, depois rotacionar.",
        "A PrivateNote criptografa no navegador (ou no seu editor/CLI) com AES-256-GCM antes que qualquer coisa chegue à rede. A chave de descriptografia vive apenas no fragmento da URL—a parte `#…` que os navegadores nunca enviam aos servidores. Detalhes: [o que significa criptografia de ponta a ponta aqui](blog:what-is-end-to-end-encryption) e [como fazer uma nota privada](blog:how-to-make-a-private-note).",
      ],
      flowIntro: "Um fluxo de trabalho prático de recuperação de emergência:",
      flowSteps: [
        {
          step: "Passo 1",
          title: "Delimite e proteja a chave",
          body: "Prefira uma chave dedicada para este host ou tarefa. Use uma frase secreta na chave privada. Evite enviar sua chave de identidade pessoal do dia a dia se uma chave mais restrita for suficiente.",
        },
        {
          step: "Passo 2",
          title: "Criptografe localmente",
          body: "Cole apenas o material da chave (não um romance de hostnames e nomes de usuário) na PrivateNote pelo [aplicativo web](app:home), pela [extensão do VS Code / Cursor](app:developers/vscode), pela [CLI](app:developers/cli), ou pela [extensão do Chrome](chrome:extension).",
        },
        {
          step: "Passo 3",
          title: "Envie o link—não o PEM",
          body: "Compartilhe o link criptografado no Slack ou por e-mail. Opcionalmente, ative o encapsulamento com frase secreta e envie essa frase secreta por um canal separado ([dica de canal dividido](blog:how-to-share-a-password-securely)). Prefira expiração de 15 minutos ou 1 hora e destruição após a leitura.",
        },
        {
          step: "Passo 4",
          title: "Confirme e depois rotacione",
          body: "O destinatário instala a chave com as permissões corretas (`chmod 600`), confirma o login, e então você revoga a chave antiga ou a rotaciona. Trate qualquer chave que tenha ficado em um prompt de IA como vista—rotacione-a.",
        },
      ],
      midCta: {
        body: "Precisa transferir uma chave SSH agora? Crie uma nota criptografada de uso único e envie o link em vez da chave privada.",
        button: "Criar uma nota privada",
      },
    },
    {
      title: "Extensões para desenvolvedores: compartilhe chaves SSH de onde você trabalha",
      paragraphs: [
        "As transferências falham quando a ferramenta segura está a três cliques mais distante do que o Slack. As integrações da PrivateNote mantêm a criptografia no seu editor, navegador, terminal ou fluxo de trabalho de agente. Tour completo: [PrivateNote para desenvolvedores](blog:privatenote-for-developers).",
      ],
      useCaseTable: {
        headers: ["Sua situação", "Melhor caminho"],
        rows: [
          [
            "A chave já está aberta no editor",
            "Extensão de IDE VS Code / Cursor / Codex — selecionar → compartilhar como PrivateNote",
          ],
          [
            "A chave está em uma página web ou ticket",
            "Extensão do Chrome — destacar → Criar PrivateNote",
          ],
          [
            "Você está em um terminal",
            "CLI — encaminhe o arquivo por pipe para que o PEM nunca fique no histórico do shell",
          ],
          [
            "Você quer que um agente produza o link",
            "Servidor MCP — depois rotacione; prefira a extensão do editor para chaves privadas",
          ],
          [
            "O destinatário não é técnico",
            "Link do aplicativo web em privatenote.ai",
          ],
        ],
      },
      subsections: [
        {
          title: "VS Code, Cursor e Codex IDE",
          paragraphs: [
            "Instale a partir do marketplace (`PrivateNote.privatenote-vscode`), selecione o bloco da chave, e use **Share as PrivateNote**—ou abra o compositor da barra lateral. A criptografia é executada no processo host do editor, então o texto puro nunca precisa entrar em um chat de IA. Configuração: [extensão VS Code / Cursor](app:developers/vscode).",
          ],
        },
        {
          title: "Extensão do Chrome",
          paragraphs: [
            "Quando uma chave aparece em um ticket, página de documentação ou console de administração, destaque-a e crie uma nota criptografada sem copiá-la primeiro para o Slack. Instalação: [extensão do Chrome](chrome:extension).",
          ],
        },
        {
          title: "CLI",
          paragraphs: [
            "Encaminhe a partir de um arquivo por pipe para que o segredo não seja um argumento de `echo` no histórico do shell: `cat id_ed25519 | npx privatenote-cli --expire 15m --output-url-only`. Documentação: [CLI da PrivateNote](app:developers/cli).",
          ],
        },
        {
          title: "MCP para Cursor, Claude e Codex",
          paragraphs: [
            "Agentes podem chamar `create_private_note` depois de você instalar o [privatenote-mcp](app:developers/mcp). Útil para orquestração—mas se você colar a chave privada no prompt do agente, o provedor do modelo pode vê-la antes da criptografia. Para chaves privadas SSH, prefira a extensão do editor ou do Chrome. Configuração específica do Codex: [PrivateNote com Codex](blog:privatenote-codex).",
          ],
        },
      ],
      calloutTitle: "Ressalva honesta",
      callout:
        "O MCP criptografa depois que o agente lê o prompt. A exposição persistente em chat/e-mail desaparece; a visibilidade do provedor de IA não. Para chaves privadas, use a extensão do VS Code ou do Chrome para que o texto puro nunca saia da sua máquina antes de já ser texto cifrado.",
    },
    {
      title: "Boas práticas e armadilhas",
      subsections: [
        {
          title: "Nunca faça commit de chaves privadas",
          paragraphs: [
            "Mantenha `id_*` e `*.pem` fora dos repositórios. Adicione-os ao `.gitignore`. Se uma chave chegou ao histórico do git, rotacione-a—reescrever o histórico não é mais suficiente depois que o repositório foi clonado ou escaneado.",
          ],
        },
        {
          title: "Corrija as permissões de arquivo",
          paragraphs: [
            "Chaves privadas devem ser `chmod 600` (ou `400`). O SSH vai rejeitar arquivos de chave excessivamente permissivos em muitos sistemas—e chaves legíveis por qualquer pessoa em máquinas compartilhadas são um gol contra.",
          ],
        },
        {
          title: "Não coloque contexto dentro da nota",
          paragraphs: [
            "Coloque apenas o material da chave na nota criptografada. Envie hostname, nome de usuário e porta em uma mensagem separada. Se o link vazar, o atacante não deveria também obter um mapa rotulado do que ele destranca.",
          ],
        },
        {
          title: "Frase secreta e canais separados",
          paragraphs: [
            "Proteja o próprio arquivo de chave com uma frase secreta e, opcionalmente, encapsule a PrivateNote com uma frase secreta separada enviada por outro canal. Mesma orientação de [compartilhamento seguro de senha](blog:how-to-share-a-password-securely).",
          ],
        },
        {
          title: "O encaminhamento de agente não é uma estratégia de compartilhamento",
          paragraphs: [
            "O encaminhamento do agente SSH pode reduzir cópias de chave em hosts remotos, mas não substitui uma distribuição cuidadosa de chaves—e expande a confiança para cada salto pelo qual você encaminha. Use-o deliberadamente, não como desculpa para enviar PEMs por e-mail.",
          ],
        },
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "É seguro enviar uma chave pública pelo Slack?",
          answer:
            "Sim. Chaves públicas são feitas para ser distribuídas. Ainda assim, evite despejar diretórios `~/.ssh` inteiros—as pessoas incluem acidentalmente arquivos privados.",
        },
        {
          question: "Posso colocar uma chave privada SSH em um gerenciador de senhas?",
          answer:
            "Para o armazenamento de longo prazo de chaves que você mantém, um gerenciador de senhas ou um agente baseado em hardware é apropriado. Use um link criptografado de uso único para o momento de entrega de pessoa para pessoa—depois o destinatário armazena a chave corretamente. A PrivateNote é entrega, não um cofre de segredos.",
        },
        {
          question: "Devo compartilhar a chave e a frase secreta juntas?",
          answer:
            "Não. Isso recria um único ponto de falha. Envie o link criptografado em um canal e qualquer frase secreta em outro—ou faça o destinatário definir sua própria frase secreta após a instalação e rotacionar.",
        },
        {
          question: "Que expiração devo usar?",
          answer:
            "Para coordenação em tempo real, 15 minutos com destruição após a leitura. Para transferências assíncronas a contratados, no máximo 1 hora ou 1 dia. Prefira mais curto sempre que o destinatário estiver acessível.",
        },
        {
          question: "A PrivateNote substitui o Vault ou gerenciadores de segredos na nuvem?",
          answer:
            "Não. Use Vault, AWS Secrets Manager e ferramentas semelhantes para armazenamento e injeção máquina a máquina. Use a PrivateNote para o momento de pessoa para pessoa quando uma chave precisa cruzar chat ou e-mail sem se tornar um arquivo permanente. Mesma distinção do [guia de chaves API](blog:how-to-share-api-key-securely).",
        },
      ],
    },
    {
      title: "Considerações finais",
      paragraphs: [
        "A maioria dos problemas de «compartilhamento» SSH são, na verdade, problemas de inscrição: adicione uma chave pública, use uma chave de deploy, ou emita acesso de curta duração. Quando uma chave privada precisar se mover, não a deixe no [histórico de chat](blog:secrets-never-send-in-chat) ou no [e-mail](blog:why-email-is-worst-for-secrets).",
        "Criptografe localmente, envie um link autodestrutivo, confirme a instalação, depois rotacione. Conecte as [ferramentas para desenvolvedores](app:developers) que você já usa para que o caminho seguro seja também o caminho de menor resistência.",
      ],
    },
  ],
  ctaTitle: "Compartilhe o link—não a chave privada",
  ctaBody:
    "Crie uma PrivateNote criptografada no navegador com expiração curta e destruição após a leitura. Ou criptografe pela extensão do VS Code, pela CLI, ou pela extensão do Chrome para que o PEM nunca chegue em texto puro ao Slack.",
  ctaButton: "Criar uma nota privada",
};
