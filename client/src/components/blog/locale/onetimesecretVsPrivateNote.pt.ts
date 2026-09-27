import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNotePt: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret e PrivateNote resolvem o mesmo problema prático: mover uma senha, chave de API, código de recuperação ou nota confidencial por um link temporário em vez de deixar texto legível em e-mail ou chat. O destinatário abre o link, e a carga armazenada pode desaparecer depois de ser lida ou quando o prazo de expiração é atingido.",
    "Ambos os produtos criptografam a carga. A diferença importante é onde a criptografia acontece.",
    "OneTimeSecret descreve sua arquitetura como criptografia no servidor. O texto legível chega ao OneTimeSecret antes de ser criptografado. PrivateNote criptografa localmente primeiro, de modo que o serviço recebe texto cifrado em vez da carga em texto legível. Essa diferença define o limite de confiança criptográfica.",
  ],
  sections: [
    {
      title: "Duas formas de construir o mesmo link",
      paragraphs: [
        "Na **criptografia no servidor**, o remetente envia o segredo ao serviço por TLS. O serviço recebe o texto legível, criptografa-o e armazena texto cifrado. Em seguida, pode armazenar a carga, entregá-la, expirar e excluí-la. O servidor da aplicação faz parte do processo de criptografia porque o texto legível entra no serviço antes de se tornar texto cifrado.",
        "Na **criptografia no cliente**, o dispositivo do remetente criptografa primeiro. O serviço recebe e armazena texto cifrado. Esse upload viaja por TLS. O serviço não recebe a chave necessária para descriptografar uma carga padrão. O dispositivo do destinatário descriptografa localmente. O serviço ainda pode armazenar, entregar, expirar e excluir a carga sem precisar de acesso ao texto legível.",
        "Ambos os desenhos podem oferecer links temporários, acesso limitado e expiração. Ambos podem ser descritos com precisão como criptografados. OneTimeSecret usa a primeira arquitetura; PrivateNote, a segunda. A pergunta relevante, portanto, não é apenas se um link de uso único está criptografado, mas quais sistemas precisam ter acesso ao texto legível para que esse link funcione.",
      ],
    },
    {
      title: "OneTimeSecret: criptografia no servidor",
      paragraphs: [
        "No fluxo comum do OneTimeSecret, o remetente envia o segredo por TLS. A aplicação recebe o texto legível, criptografa-o no servidor e armazena a carga criptografada.",
        "Isso oferece proteção significativa para dados armazenados. Obter apenas o armazenamento criptografado não revela necessariamente o conteúdo quando o material necessário para a descriptografia está indisponível para o atacante.",
        "O trade-off arquitetônico ocorre antes do armazenamento. O TLS protege o segredo enquanto ele viaja entre o navegador e o OneTimeSecret, mas a aplicação precisa processar o texto legível para criptografá-lo. O servidor da aplicação fica, portanto, dentro do limite de confiança criptográfica.",
        "Um processo de aplicação malicioso ou comprometido nesse momento poderia acessar o segredo antes de ser criptografado para armazenamento. A criptografia no cliente remove essa dependência específica ao criptografar o segredo antes de ele chegar ao serviço.",
      ],
    },
    {
      title: "A passphrase do OneTimeSecret não muda o limite de criptografia",
      paragraphs: [
        "A documentação do OneTimeSecret descreve uma passphrase opcional. Quando uma passphrase é usada, o OneTimeSecret diz que o segredo é criptografado em seus servidores com a passphrase fornecida pelo remetente. Diz que não armazena a passphrase em si; em vez disso, retém um hash bcrypt usado para verificar a passphrase durante a recuperação. Segundo a documentação, esse hash não pode descriptografar o segredo por si só, e o segredo armazenado protegido por passphrase não pode ser descriptografado sem a passphrase original.",
        "A recuperação usa o mesmo limite no servidor. O destinatário envia a passphrase ao OneTimeSecret por TLS. O serviço a verifica e executa a descriptografia no servidor antes de devolver o texto legível.",
        "Isso significa que o processo da aplicação tem acesso ao segredo e à passphrase quando a criptografia ocorre e processa novamente a passphrase e o texto legível resultante durante a recuperação. Um processo de aplicação malicioso ou comprometido em qualquer um desses pontos poderia potencialmente capturar essa informação. Isso é uma consequência de onde a criptografia e a descriptografia são executadas, não uma alegação de que o OneTimeSecret registra ou faz mau uso desses valores.",
        "A documentação pública do OneTimeSecret, por si só, não estabelece cada detalhe de sua hierarquia interna de chaves—por exemplo, precisamente como material de chave no servidor, chaves por segredo, derivação de chave e a passphrase fornecida são combinados. Não é necessário especular sobre esses detalhes de implementação para esta comparação. A propriedade documentada relevante é que criptografia e descriptografia ocorrem no lado do serviço.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "O segredo que você quer enviar, e a passphrase quando você define uma, ambos viajam ao servidor por TLS. A criptografia roda nesse servidor. O que permanece no armazenamento é texto cifrado.",
          columns: [
            [
              { text: "Segredo + passphrase", via: "TLS" },
              { text: "Servidor", via: "Criptografar" },
              { text: "Texto cifrado" },
            ],
          ],
        },
      ],
    },
    {
      title: "Self-hosting pode tornar razoável essa confiança no servidor",
      paragraphs: [
        "OneTimeSecret é open source. Uma organização pode executar a própria instância dentro de um perímetro de segurança empresarial, em vez de enviar segredos ao serviço público.",
        "Nessa implantação, confiar no servidor da aplicação é confiar na infraestrutura que a organização já opera. O texto legível ainda chega a esse servidor, porque a criptografia ainda acontece lá. A parte do outro lado do limite são os hosts, operadores e backups da própria organização. Para uma equipe que já aceita esses sistemas como parte do caminho que um segredo percorre, a criptografia no servidor pode ser uma escolha razoável. Ela reduz a distância entre os modelos de ameaça no servidor e no cliente, porque o operador deixa de ser um serviço externo.",
      ],
    },
    {
      title: "PrivateNote criptografa antes do upload",
      paragraphs: [
        "Uma PrivateNote padrão é criptografada antes do upload. O navegador do remetente, ou um processo local de [CLI](app:developers/cli), [extensão do Chrome](app:developers/chrome), [extensão de editor](app:developers/vscode) ou [MCP](app:developers/mcp), gera uma chave aleatória e criptografa a carga com AES-256-GCM. Só o texto cifrado é enviado. O TLS transporta esse texto cifrado do navegador ao worker Cloudflare da PrivateNote. A chave de descriptografia fica no fragmento da URL, a parte após `#`, por exemplo `https://privatenote.ai/note/abc123#…`. O fragmento é tratado no cliente e não é incluído na solicitação HTTPS ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). O worker recebe um identificador da nota e devolve texto cifrado pela mesma conexão TLS. O navegador mantém o fragmento e descriptografa localmente.",
      ],
    },
    {
      title: "Uma passphrase protege a chave se o canal do link for comprometido",
      paragraphs: [
        "Uma passphrase na PrivateNote faz um trabalho diferente de uma passphrase no OneTimeSecret. A nota já é texto cifrado antes de sair do dispositivo. Se você adiciona uma passphrase, o navegador deriva dela uma chave de wrapping com Argon2id e usa essa chave para criptografar a chave da nota. O fragmento da URL passa a conter a chave wrapped. O destinatário precisa do link e da passphrase. O navegador unwrapa a chave localmente e só então descriptografa a nota.",
        "PrivateNote não recebe a passphrase. A solicitação de criação carrega texto cifrado, um salt e os parâmetros que o navegador do destinatário precisa para tentar a passphrase localmente. Não há um hash no servidor cuja função seja verificar a passphrase. Uma passphrase errada falha na descriptografia no dispositivo.",
        "A passphrase protege adicionalmente a chave no cliente se o canal que transporta o link for comprometido. Esse canal vê então uma chave wrapped, não uma chave que abra a nota sozinha. Não é o mecanismo que mantém a PrivateNote fora do caminho do texto legível. Essa separação já existe em uma nota padrão, com ou sem passphrase. Compartilhe a passphrase por um canal diferente do link. A mesma mensagem colapsa as duas camadas em uma — a mesma regra de [compartilhar uma senha com segurança](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "A criptografia local produz a chave no cliente e o texto cifrado. Argon2id faz wrap dessa chave, e a chave wrapped fica no fragmento da URL. O TLS transporta apenas o texto cifrado ao worker Cloudflare.",
          columns: [
            [
              { text: "Segredo" },
              { text: "Criptografia local" },
              { text: "Texto cifrado", via: "TLS" },
              { text: "Servidor" },
            ],
            [
              { text: "Passphrase" },
              { text: "Argon2id local" },
              { text: "Envolver a chave" },
              { text: "Fragmento da URL" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "A mesma divisão, uma propriedade de cada vez.",
        headers: ["", "OneTimeSecret + passphrase", "PrivateNote + passphrase"],
        rows: [
          ["Criptografia da carga", "Servidor", "Dispositivo do remetente"],
          ["Texto legível chega ao serviço", "Sim", "Não"],
          ["Passphrase chega ao serviço", "Sim", "Não"],
          [
            "Papel da passphrase",
            "Participa da proteção no servidor",
            "Deriva uma chave de wrapping local",
          ],
          [
            "Verificador ou material armazenado",
            "Verificador bcrypt e carga criptografada, conforme a documentação do OneTimeSecret",
            "Salt, parâmetros de wrap Argon2id e texto cifrado",
          ],
          ["Onde a descriptografia é executada", "Servidor da aplicação OneTimeSecret", "Dispositivo do destinatário"],
        ],
      },
      paragraphsAfterTable: [
        "O tratamento de chaves da PrivateNote está descrito em [Como funciona](app:how-it-works): a chave de conteúdo é wrapped com Argon2id, e a chave wrapped viaja no link.",
      ],
    },
    {
      title: "A premissa de confiança restante do cliente web",
      paragraphs: [
        "A criptografia no cliente em um navegador não é uma aplicação web sem confiança. A criptografia pode rodar localmente enquanto o JavaScript que a implementa é entregue pelo site. O navegador confia no código que recebe para aquela sessão.",
        "Alguém que possa alterar esse JavaScript — pela aplicação, por um CDN ou pelo pipeline de deploy — poderia mudar o cliente e capturar chaves em uma sessão futura do navegador. Isso é uma falha diferente de roubar um banco de dados. Um comprometimento de armazenamento expõe texto cifrado. A entrega de código malicioso ataca o endpoint enquanto a chave está de fato presente.",
        "Um dump posterior do banco de dados não pode fabricar chaves no cliente que nunca foram armazenadas lá. Um cliente ativamente comprometido pode atacar segredos manipulados durante aquela sessão. A mesma premissa está escrita no modelo de ameaça da PrivateNote: o código da aplicação entregue não foi modificado de forma maliciosa, e os dispositivos do remetente e do destinatário são confiáveis no momento da criptografia e da descriptografia.",
        "Software instalado reduz essa dependência de uma página recém-baixada. Um CLI, uma extensão de editor ou um app nativo executa código que você instalou. Esses clientes ainda dependem do sistema operacional, da assinatura, das dependências e do canal de atualização. As [ferramentas para desenvolvedores](app:developers) usam a mesma divisão do navegador: criptografar localmente, enviar texto cifrado, deixar a chave no fragmento.",
      ],
    },
    {
      title: "Tempo de vida e confidencialidade",
      paragraphs: [
        "Um link de uso único responde a duas perguntas separadas. Por quanto tempo a carga criptografada deve existir? E quem pode descriptografá-la enquanto ela existir? Destruí-la após a recuperação ou a expiração encurta a janela. Não decide quem poderia lê-la durante essa janela. Tempo de vida e confidencialidade se apoiam mutuamente. Um não substitui o outro.",
        "A distinção fica mais nítida quando a carga é autoridade: chaves de API, credenciais de banco de dados, tokens de cloud, códigos de recuperação, senhas de infraestrutura. Um serviço de compartilhamento de segredos existe porque o remetente quer confiar essa informação a menos sistemas. Se o intermediário só precisa transportar um objeto criptografado opaco, impor a expiração e excluí-lo, o servidor pode fazer esse trabalho sem receber o segredo nem a chave que o abre.",
      ],
    },
    {
      title: "Onde fica o limite",
      paragraphs: [
        "“Criptografado” não diz onde fica o limite de confiança. O padrão que vale a pena usar é um limite de confiança mínimo: o princípio do menor privilégio aplicado a quem precisa ver o texto legível. Na engenharia criptográfica moderna, o objetivo não é apenas confiar que um servidor se comporta bem, mas reduzir a necessidade matemática de confiança em primeiro lugar.",
        "OneTimeSecret descreve um sistema criptografado no servidor. Com proteção por passphrase, diz que o segredo armazenado não pode ser descriptografado subsequentemente sem a passphrase, e que um comprometimento do servidor deixaria o segredo seguro enquanto essa passphrase permanecer desconhecida. Uma passphrase fraca pode ser atacada por força bruta. Se for fraca, esse comprometimento ainda pode deixar o segredo recuperável. O texto legível e a passphrase chegam ao OneTimeSecret na criação, porque a criptografia acontece em seus servidores, e a passphrase é enviada de volta na recuperação para que esses servidores possam descriptografar.",
        "PrivateNote faz uma escolha arquitetônica diferente. A carga é criptografada antes de chegar ao serviço, e a chave padrão da carga permanece no cliente. Uma passphrase, quando você define uma, protege adicionalmente essa chave no cliente se o canal que transporta o link for comprometido. Ela não é enviada à PrivateNote.",
        "OneTimeSecret criptografa o seu segredo. O cliente que usa o serviço da PrivateNote o criptografa antes de o serviço recebê-lo. Essa distinção não depende de assumir que qualquer um dos provedores seja malicioso. Reduz a pergunta à arquitetura: quantos sistemas precisam de acesso ao texto legível para o serviço funcionar?",
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "O OneTimeSecret armazena o segredo em texto legível?",
          answer:
            "A documentação deles diz que não. Eles criptografam em seus servidores. Com uma passphrase, dizem que armazenam o segredo criptografado e um hash bcrypt da passphrase, não a passphrase, e que o hash não pode descriptografar o segredo.",
        },
        {
          question: "Se eu definir uma passphrase no OneTimeSecret, o segredo fica oculto dos servidores deles?",
          answer:
            "Não durante a criação, e não na recuperação. OneTimeSecret diz que o segredo e a passphrase são fornecidos ao servidor para que o servidor execute a criptografia. Quando o destinatário abre o link, envia a passphrase de volta por TLS, e a descriptografia roda nos servidores do OneTimeSecret antes de o texto legível ser devolvido. Após a criptografia, OneTimeSecret diz que descarta a passphrase em texto legível, retém apenas um hash bcrypt e não pode descriptografar o segredo armazenado sem a passphrase original.",
        },
        {
          question: "O que uma passphrase da PrivateNote protege?",
          answer:
            "A chave no cliente, se o canal que transporta o link for comprometido. A nota em si já está criptografada no seu dispositivo com AES-256-GCM. Argon2id deriva localmente uma chave de wrapping da passphrase, e essa chave de wrapping criptografa a chave da nota. O link passa a conter uma chave wrapped. PrivateNote recebe texto cifrado e um salt. Não recebe a passphrase nem a chave bruta. Uma nota padrão é criptografada antes do upload mesmo sem passphrase. Envie a passphrase por um canal separado do link.",
        },
        {
          question: "A criptografia no cliente pode proteger contra um servidor PrivateNote comprometido?",
          answer:
            "Um comprometimento de dados armazenados ou da API: sim, no sentido de que a criptografia no cliente isola cargas não lidas, porque o servidor não tem a chave padrão da carga. Um dump posterior do banco de dados não pode fabricar chaves que nunca foram armazenadas lá. Entrega de código de cliente malicioso: não. Um atacante que possa alterar o JavaScript entregue a uma sessão futura do navegador poderia tentar capturar a chave enquanto ela estiver presente. Clientes instalados reduzem essa dependência de uma página recém-baixada.",
        },
      ],
    },
    {
      title: "Fontes primárias",
      paragraphs: [
        "Informações de arquitetura sobre o OneTimeSecret foram revisadas em relação à documentação pública em 23 de setembro de 2026. Implementações de produto e documentação podem mudar.",
      ],
      bullets: [
        "[Documentação do OneTimeSecret](https://docs.onetimesecret.com/)",
        "[OneTimeSecret sobre segurança e passphrases](https://onetimesecret.com/en/about)",
        "[Código-fonte do OneTimeSecret](https://github.com/onetimesecret/onetimesecret)",
        "[Como funciona a criptografia da PrivateNote](app:how-it-works)",
        "[PrivateNote para desenvolvedores](blog:privatenote-for-developers), incluindo a CLI",
        "[RFC 3986, seção 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), que separa o fragmento da URI antes do dereference",
        "[URL Standard, fragmento](https://url.spec.whatwg.org/#concept-url-fragment), sobre o tratamento do fragmento no cliente",
      ],
    },
  ],
  ctaTitle: "Criptografe antes de o segredo sair do dispositivo",
  ctaBody:
    "Escreva a nota no navegador. O cliente a criptografa localmente, coloca a chave no link e pode proteger essa chave com uma passphrase que o servidor nunca recebe.",
  ctaPrimary: "Criar uma private note",
  ctaSecondary: "Ver como a criptografia funciona",
};
