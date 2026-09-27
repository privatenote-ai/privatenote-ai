import type { SecureClientDeliveryForLawyersArticleCopy } from "./secureClientDeliveryForLawyers.types";

export const secureClientDeliveryForLawyersPt: SecureClientDeliveryForLawyersArticleCopy = {
  intro: [
    "As aplicações de mensagens do dia a dia podem deixar um historial duradouro. Em muitas comunicações abrangidas pelo segredo profissional, o objetivo prático é precisamente o contrário: transmitir uma instrução ou um documento sensível sem criar mais um registo permanente. A cifragem é importante, mas também importa saber quem poderá mais tarde recuperar esse conteúdo e durante quanto tempo permanecerá disponível.",
    "Os escritórios sabem que o correio electrónico não é um cofre. Muitos passam para o Signal ou o WhatsApp porque «está cifrado». Fica curto. Essas aplicações existem para conservar uma conversa. Muitas comunicações entre advogado e cliente exigem precisamente o contrário: transmitir uma instrução, um projecto ou um anexo sem criar novas cópias permanentes.",
    "A dificuldade é prática e jurídica. Uma parte relevante da clientela não instalará o Signal. Não acrescentará outra aplicação de mensagens «segura» ao WhatsApp familiar. Abrirá uma hiperligação no navegador que já tem. Sobretudo na defesa penal, a advocacia precisa de um canal que pareça correspondência do escritório, não uma mensagem numa aplicação de chat comum.",
  ],
  sections: [
    {
      title: "Porque uma conversa cifrada pode continuar a deixar um historial",
      paragraphs: [
        "A cifragem de ponta a ponta do Signal e do WhatsApp protege eficazmente o conteúdo contra o acesso do fornecedor do serviço. Mas cifragem e persistência são questões diferentes: uma mensagem pode estar bem protegida e continuar disponível nos dispositivos, em cópias de segurança ou em computadores associados. É esta segunda questão que conta, na prática, para o escritório e, em particular, para a defesa penal:",
      ],
      bullets: [
        "Fica um historial pesquisável no telemóvel do cliente, no de um familiar ou num aparelho que mais tarde será apreendido, perdido ou periciado?",
        "As cópias na nuvem, os computadores ligados, as pré-visualizações de notificação e as capturas reenviadas multiplicam o conteúdo para além das partes originais?",
        "Surge, sem o querer, um comentário escrito contínuo que nunca deveria ter feito parte do processo e depois reaparece como rasto digital?",
      ],
      paragraphsAfterBullets: [
        "O mesmo padrão vê-se fora da audiência: as mensagens escritas sobrevivem à ocasião que as originou. Veja [notas efémeras para mensagens de trabalho](blog:workplace-texts-private-note) e [porque é que os segredos não devem ir para o chat](blog:secrets-never-send-in-chat). Para passaportes, relatórios médicos e contratos, a objecção vale também para os [anexos de correio](blog:why-email-is-worst-for-secrets).",
        "Isto não é um convite a destruir o que o escritório deve conservar. As obrigações de arquivo, a organização regular do processo e, quando ordenadas, as medidas de preservação de prova permanecem. O ponto é mais estreito: muitas comunicações operacionais — instruções pontuais, credenciais de acesso, redacções só para o cliente, um anexo sensível que não deve viver no chat familiar — não deveriam permanecer de forma duradoura numa aplicação de mensagens.",
      ],
    },
    {
      title: "Defesa penal, prisão preventiva e o cliente sem segunda aplicação",
      paragraphs: [
        "A objecção é mais aguda na defesa penal. O cliente está sob pressão, por vezes em prisão preventiva ou a cumprir pena, usa o telemóvel de um familiar e raramente pode adoptar um conjunto próprio de ferramentas de confidencialidade. Pedir-lhe que «instale o Signal» falha em muitos processos. O WhatsApp costuma já estar no aparelho — e esse é precisamente o problema. É um ambiente de comunicação pessoal: aí discute a família, circulam capturas e uma instrução coberta pelo sigilo convive com a brincadeira de um primo.",
        "Junta-se a prática de buscas e apreensões. Se o telemóvel for apreendido, o historial local está no aparelho. O PrivateNote não altera o que as autoridades podem legalmente apreender ou examinar. Coloca outra pergunta: que cópias o próprio cliente guarda, por defeito, num telemóvel do dia-a-dia.",
        "Entre as comunicações que não deveriam permanecer nesse ambiente:",
      ],
      bullets: [
        "Instruções sobre a declaração, a prisão preventiva, medidas de coacção, caução ou um acordo sobre a sentença.",
        "Projectos de declaração, articulado ou alegações sobre a pena que o cliente deve aprovar antes de apresentar.",
        "Moradas, relatórios médicos, situação patrimonial ou identidade de uma testemunha prevista: necessários hoje, perigosos se permanecerem.",
        "Acessos de uma só vez a um portal, a uma videoconferência ou a um documento que o cliente deve ler uma vez, não guardar no chat.",
        "Advogado a advogado: correspondente, substabelecimento, substituição em audiência — os papéis fazem falta agora, não um grupo permanente.",
      ],
      paragraphsAfterBullets: [
        "Em todos esses casos, o objetivo é transmitir o conteúdo ao destinatário previsto sem alargar desnecessariamente o número de pessoas que o poderão reconstruir mais tarde. Uma confirmação de leitura numa aplicação de mensagens não equivale a um registo de entrega específico para o escritório. Não identifica o escritório. Não oferece, de relance, o contexto profissional de que um cliente receloso de hiperligações desconhecidas pode precisar para reconhecer o envio.",
      ],
    },
    {
      title: "O de que a advocacia realmente precisa",
      paragraphs: [
        "Um canal adequado para transmitir informação confidencial deve satisfazer poucos requisitos essenciais. O cliente não deve criar conta nem instalar software. A cifragem deve ocorrer no dispositivo do remetente antes do carregamento, de modo que o serviço armazene só cifrado, não a instrução. O acesso deve poder destruir-se após a leitura e caducar. A página de abertura deve apresentar-se como correspondência do escritório, não como um serviço anónimo para partilhar texto. O remetente deve poder saber se a hiperligação foi aberta, revogá-la se o número era errado e, em anexos sensíveis, dificultar a transferência desnecessária.",
        "É a lógica de uma [hiperligação secreta de uso único](blog:one-time-secret-links), aplicada ao exercício. O PrivateNote cifra o conteúdo no navegador antes de este sair do dispositivo. Os destinatários abrem um URL único; não é necessária conta. O escritório pode enviar a hiperligação pelo canal que o cliente já usa — SMS, correio, até uma chamada breve em que se dita o endereço — sem pôr a instrução nesse canal. O conteúdo sensível está na nota. O chat ou a caixa só guardam um link que deixa de funcionar.",
      ],
      comparisonTable: {
        headers: ["Exigência do exercício", "Signal / WhatsApp", "PrivateNote Business"],
        rows: [
          [
            "O cliente não instala uma aplicação",
            "Não — a aplicação é o canal",
            "Sim — navegador ordinário",
          ],
          [
            "Sem historial duradouro por omissão",
            "Conversa dentro de uma aplicação; podem configurar-se mensagens temporárias",
            "Transmissão pontual por hiperligação; leitura única e caducidade como modelo principal",
          ],
          [
            "Identidade do escritório na entrega",
            "Perfil ou identidade dentro da aplicação de mensagens",
            "Logótipo, nome do escritório e página de abertura com a identidade do escritório",
          ],
          [
            "Prova de que os papéis foram recolhidos",
            "As confirmações de leitura pertencem ao chat, não a um registo de entrega do escritório",
            "Alertas de abertura e prova de acesso (só o estado)",
          ],
          [
            "Revogação se o número for errado",
            "A mensagem já está no aparelho",
            "Revogar uma nota não aberta",
          ],
        ],
      },
      paragraphsAfterTable: [
        "O Signal e o WhatsApp também oferecem mensagens temporárias. O seu modelo continua a ser o de uma conversa numa aplicação de mensagens, ao passo que o PrivateNote está pensado como uma transmissão pontual por hiperligação. Para documentos em vez de instruções breves, veja [como enviar documentos sensíveis de forma segura](blog:send-sensitive-documents-securely).",
      ],
    },
    {
      title: "Usá-lo em conjunto: um hábito de escritório",
      paragraphs: [
        "O valor cresce quando os advogados usam entre si o mesmo canal que usam com o cliente. O correspondente, o substabelecido, a colega que cobre uma audiência e o cliente partilham então uma expectativa: o sensível chega como hiperligação de uso único com a identidade do escritório; não fica num grupo; não se torna outro rasto pesquisável.",
        "É um padrão de exercício, não um produto baseado em licenças por utilizador. O PrivateNote Business é uma conta profissional. Um advogado, um colaborador ou um escritório pequeno podem mostrar o nome e a identidade visual em cada página de abertura. Os colegas com conta Business ou Starter podem devolver os papéis do mesmo modo. O cliente continua sem precisar de conta. A disciplina comum é o essencial: deixar de tratar as aplicações de mensagens do dia a dia como o canal por defeito para comunicações operacionais confidenciais.",
        "A marca não é vaidade. Um cliente habituado a desconfiar de links desconhecidos deve conseguir reconhecer imediatamente o contexto do envio: nome do escritório, logótipo, identidade do remetente e uma breve mensagem de acompanhamento. Isto não autentica criptograficamente o remetente, mas torna a transmissão mais reconhecível e profissional. Uma conversa no WhatsApp não oferece esse mesmo contexto profissional. O Business acrescenta perfil, logótipo, cores e uma página de abertura predefinida ou personalizada, para que a entrega se apresente claramente sob a identidade do escritório.",
      ],
      midCta: {
        body: "O Business é o plano para a entrega profissional: identidade do escritório perante o destinatário, ficheiros em modo apenas de visualização, anexos até 1 GB e o conjunto de controlos de entrega (prova de acesso, verificação do destinatário, revogação, revelação agendada). 12 € / 12 $ por mês, ou 120 € / 120 $ por ano: uma conta profissional, não uma licença por utilizador.",
        button: "Ver Business na página de planos",
      },
    },
    {
      title: "Controlos que cabem a uma conta profissional",
      paragraphs: [
        "O Starter e o Business acrescentam funções que o escritório teria, de outro modo, de coordenar por telefone ou através de canais separados. A [verificação do destinatário](blog:recipient-verification-code-before-reveal) coloca um código próprio da nota noutro canal, de modo que uma hiperligação interceptada não baste. Os [avisos de abertura](blog:know-when-secret-link-opened) e a prova de acesso indicam que os papéis foram recolhidos: só o estado, nunca o conteúdo. Uma hiperligação ainda não aberta pode ser [revogada](blog:revoke-unopened-note-proof-of-access) se foi enviada para o número errado. A revelação agendada pode impedir o acesso a um conjunto de documentos até uma determinada data ou até um momento previamente definido. O Business acrescenta um modo apenas de visualização para anexos que devem ser consultados sem fomentar a transferência desnecessária, e limites de anexo maiores para processos que não pertencem a um chat.",
      ],
      orderedIntro: "Uma sequência praticável é breve:",
      ordered: [
        "Redija a instrução ou anexe os papéis. A cifragem ocorre no navegador antes do carregamento.",
        "Defina uma vida curta e uma só abertura, ou algumas se o cliente e o correspondente tiverem de recolher o mesmo conjunto de documentos.",
        "Active a verificação do destinatário quando o conteúdo for especialmente sensível e comunique o código por outra via (uma chamada, por exemplo).",
        "Envie só a hiperligação por SMS ou correio. Não cole a instrução nessa mensagem.",
        "Aguarde o alerta de abertura. Se o número era errado, revogue antes da abertura. Após abrir, assuma que o destinatário pode conservar o que viu e aja em conformidade.",
      ],
      paragraphsAfterOrdered: [
        "Para processos mais volumosos vale o mesmo modelo: [ficheiros cifrados, dados cifrados no servidor, janela de transferência limitada](app:secure-file-transfer). Enviar um ficheiro exige uma conta gratuita; abrir uma hiperligação, nunca.",
      ],
    },
    {
      title: "O que este canal não decide",
      paragraphs: [
        "Em Portugal, o segredo profissional do advogado articula-se, entre outras normas, no Estatuto da Ordem dos Advogados e no Código de Processo Penal. A sua aplicação concreta depende do enquadramento jurídico e das circunstâncias do caso. O PrivateNote não determina se uma determinada comunicação está juridicamente abrangida pelo segredo profissional. Nenhum produto impede um destinatário legítimo de copiar, capturar ou fotografar uma vez mostrado o conteúdo em claro. O PrivateNote não substitui o sistema documental do escritório, a contabilidade de tempo nem a obrigação de conservar o que o processo deve conservar. Reduz cópias desnecessárias de comunicações que não deveriam tornar-se arquivo permanente. Também o princípio da minimização dos dados favorece a conservação de dados pessoais apenas na medida e durante o tempo necessários à finalidade em causa.",
        "Com esse limite, é uma alternativa profissional aos dois hábitos que hoje dominam: pôr o tráfego operacional coberto pelo sigilo no correio, ou numa aplicação de mensagens do dia a dia porque o cliente não instalará mais nada. O escritório deixa o cliente nas ferramentas que já tem, põe o nome na entrega e não deixa historial onde não faz falta.",
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "A cifragem do Signal ou do WhatsApp é suficiente para proteger o segredo profissional?",
          answer:
            "A cifragem de ponta a ponta protege eficazmente o conteúdo contra o acesso do fornecedor do serviço. No entanto, não resolve a questão de quanto tempo a mensagem permanece nos dispositivos, nas cópias de segurança ou nos computadores associados. Cifragem e persistência são questões diferentes. Numa comunicação confidencial, importa também o que permanece após a entrega, e não apenas como o conteúdo foi protegido durante a transmissão. A proteção jurídica aplicável a uma comunicação não depende apenas da ferramenta utilizada para a transmitir.",
        },
        {
          question: "O cliente tem de criar uma conta ou instalar uma aplicação?",
          answer:
            "Não. O cliente abre uma hiperligação única num navegador ordinário. Não são necessários Signal, WhatsApp nem uma aplicação PrivateNote, e não se exige conta para abrir a nota.",
        },
        {
          question: "O PrivateNote substitui o processo do escritório?",
          answer:
            "Não. É um canal de entrega de curta duração. Os processos, as peças e tudo o que está sujeito a obrigação de conservação continuam nos sistemas habituais do escritório. O PrivateNote serve comunicações que não devem persistir após a recepção.",
        },
        {
          question: "O destinatário pode conservar uma cópia depois de abrir?",
          answer:
            "Sim. Uma vez apresentado o conteúdo em claro, o destinatário pode copiá-lo, fazer uma captura de ecrã, transferi-lo ou fotografá-lo. A destruição após a leitura e a caducidade reduzem cópias residuais no serviço; não eliminam à distância uma cópia que o destinatário já tenha guardado. O modo apenas de visualização do Business dificulta a transferência desnecessária; não proíbe fotografar.",
        },
      ],
    },
  ],
  ctaTitle: "Entregue a instrução. Não deixe o historial.",
  ctaBody:
    "Cifre no navegador, ponha o nome do escritório na página de abertura e envie uma hiperligação que o cliente abre sem instalar o Signal nem o WhatsApp. O Business é o plano para essa entrega profissional.",
  ctaPrimary: "Escolher Business",
  ctaSecondary: "Escrever uma nota privada",
};
