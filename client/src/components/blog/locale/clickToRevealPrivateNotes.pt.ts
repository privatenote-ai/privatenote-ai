import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const clickToRevealPrivateNotesPt: BlogGuideArticleCopy = {
  heroAlt:
    "Vista do destinatário de um ecrã de revelação PrivateNote com um aviso claro Abrir quando estiver pronto antes da desencriptação",
  heroCaption:
    "Revelar é intencional: o destinatário escolhe quando desencriptar—e quando a política de destruição pode entrar em vigor.",
  intro: [
    "Abrir uma nota de utilização única deve ser deliberado. Por isso, o PrivateNote mostra uma porta de **clicar para revelar** com um aviso explícito antes de a desencriptação começar.",
    "A ligação pode chegar cedo. O texto cifrado pode permanecer encriptado até alguém estar pronto. A desencriptação e o consumo só acontecem depois de o destinatário confirmar **Revelar nota**, com texto que deixa a consequência clara: abrir só quando estiver pronto—isto não pode ser anulado.",
    "Essa pausa é deliberada. Reduz revelações acidentais por pré-visualizações de ligações, toques errados ou abertura no dispositivo errado antes de estar pronto para consumir uma nota de utilização única.",
  ],
  sections: [
    {
      title: "Um passo de confirmação, não um desbloqueio agendado",
      takeaway:
        "O destinatário escolhe quando revelar; o servidor não desbloqueia a nota segundo um calendário.",
      paragraphs: [
        "Hoje não existe um interruptor «desbloquear esta nota na próxima terça às 09:00» no produto. Em vez disso, o PrivateNote separa a **entrega** da **abertura**.",
        "Pode enviar a ligação quando a coordenação o exigir. O destinatário pode esperar até estar num ecrã privado, ter pronto qualquer código de verificação ou frase-passe, e estar preparado para uma abertura única. O segredo permanece selado até essa ação consciente.",
        "Controlos de tempo relacionados continuam a importar: tempo de vida da nota (quanto tempo a ligação funciona se nunca for aberta) e janelas de descarga de anexos (quanto tempo os ficheiros permanecem obtíveis após abertura). Esses limitam a disponibilidade; o clicar para revelar limita *quando a desencriptação começa*.",
      ],
    },
    {
      title: "Porque aberturas acidentais são caras",
      takeaway:
        "Notas de utilização única punem curiosidade e toques errados por igual.",
      paragraphs: [
        "Se uma nota estiver configurada para uma única visualização, a primeira revelação bem-sucedida pode destruir o acesso posterior. Abrir no ecrã de bloqueio do telefone, num portátil partilhado ou num café com Wi‑Fi público pode desperdiçar a única visualização—ou expor conteúdo no sítio errado.",
        "O ecrã de revelação força uma pausa. Combinado com [códigos de verificação do destinatário](blog:recipient-verification-code-before-reveal), obtém dois passos deliberados antes de o texto em claro aparecer.",
      ],
      calloutTitle: "Texto do produto, de propósito",
      callout:
        "«Abra apenas quando estiver pronto — isso não pode ser desfeito.» não é enchimento de marketing. É o rail de segurança para fluxos de destruição à abertura.",
    },
    {
      title: "Como funciona o fluxo do destinatário",
      takeaway: "Chegar à ligação → verificar (opcional) → revelar → desencriptar localmente.",
      checklist: [
        "Abrir o URL completo do PrivateNote",
        "Introduzir um código de verificação se o remetente exigiu um",
        "Ler o aviso de revelação",
        "Premir Revelar nota só quando estiver pronto",
        "A desencriptação ocorre no browser; seguir depois qualquer política de abertura/destruição",
      ],
      paragraphsAfterChecklist: [
        "Os remetentes podem reforçar a pausa com uma instrução clara: «Envio a ligação agora; não a revele até estarmos na chamada.» O ecrã de confirmação apoia essa instrução, mas não agenda nem impõe tecnicamente uma hora futura de abertura.",
        "Para o modelo de utilização única mais amplo, veja [ligações secretas de utilização única](blog:one-time-secret-links) e [como criar uma nota privada](blog:how-to-make-a-private-note).",
      ],
      midCta: {
        body: "Envie uma nota que o destinatário possa guardar até estar pronto para a abrir.",
        button: "Criar uma nota privada",
      },
    },
    {
      title: "Controlos de tempo que combinam com revelar",
      takeaway:
        "Tempo de vida, limites de abertura e janelas de ficheiros complementam a porta de clique.",
      comparisonTable: {
        headers: ["Controlo", "Protege contra", "Uso típico"],
        rows: [
          [
            "Clicar para revelar",
            "Desencriptação acidental ou prematura",
            "Qualquer nota de utilização única ou de alta sensibilidade",
          ],
          [
            "Tempo de vida da nota",
            "Ligações por abrir obsoletas",
            "«Se não abrirem em 24 h, destruir»",
          ],
          [
            "Limite de aberturas / visualizações",
            "Acesso repetido após a entrega",
            "Uma vez (ou um pequeno número fixo)",
          ],
          [
            "Janela de descarga de anexos",
            "Re-descargas infinitas de ficheiros após abrir",
            "15 minutos por omissão; mais longo em planos elegíveis",
          ],
        ],
      },
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "Posso agendar o desbloqueio de uma nota para um momento futuro?",
          answer:
            "Não como agenda no servidor. Partilhe a ligação cedo se necessário e peça ao destinatário para esperar—o clicar para revelar mais a verificação opcional mantém o conteúdo selado até confirmar.",
        },
        {
          question: "Pré-visualizar a ligação desencripta a nota?",
          answer:
            "A confirmação de revelação é o passo intencional de desencriptação. Os destinatários não devem premir Revelar até estarem prontos para a política de destruição se aplicar.",
        },
        {
          question: "E se alguém abrir a ligação por engano?",
          answer:
            "Se pararem antes de Revelar, podem ainda voltar mais tarde (sujeito ao tempo de vida). Após Revelar numa nota de utilização única, o acesso posterior tipicamente desaparece—envie uma nota nova se precisar.",
        },
        {
          question: "Como isto se relaciona com notificações por e-mail?",
          answer:
            "Alertas de abertura e destruição dizem ao remetente quando o estado muda. Não incluem o conteúdo da mensagem. Veja [como saber quando uma ligação secreta foi aberta](blog:know-when-secret-link-opened).",
        },
      ],
    },
    {
      title: "Em resumo",
      takeaway:
        "Revelar é uma ação consciente, não uma consequência automática de carregar uma ligação.",
      paragraphs: [
        "Clicar para revelar permite enviar uma ligação cedo sem desencriptar a nota só porque a página de destino carregou.",
        "Combine com tempos de vida curtos, verificação quando os canais são fracos e instruções claras ao destinatário—e obtém revelação atrasada prática sem fingir que o produto pode apagar uma captura de ecrã remotamente.",
      ],
    },
  ],
  ctaTitle: "Deixe o destinatário revelar só quando estiver pronto.",
  ctaBody:
    "O PrivateNote mantém o texto cifrado selado até o destinatário confirmar a revelação—assim as notas de utilização única têm menos probabilidade de se queimarem com um toque acidental.",
  ctaButton: "Criar uma nota com clicar para revelar",
};
