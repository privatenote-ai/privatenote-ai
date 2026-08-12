import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const knowWhenSecretLinkOpenedPt: BlogGuideArticleCopy = {
  heroAlt:
    "Painel de notificações a mostrar um alerta de nota aberta sem qualquer conteúdo da mensagem visível",
  heroCaption:
    "Apenas estado: aberta, destruída, expirada ou revogada—nunca o segredo em si.",
  intro: [
    "Depois de enviar um link sensível, a pergunta natural é: **já abriram?** Esperar em silêncio é stressante; insistir no chat só cria mais ruído em texto simples.",
    "O PrivateNote pode notificá-lo quando o estado de entrega muda—por e-mail, com alertas em direto no separador enquanto o site está aberto, e opcionalmente com notificações do browser—sem nunca enviar o conteúdo da nota por e-mail.",
    "Essa visibilidade ajuda-o a rodar credenciais, revogar links não abertos, ou simplesmente deixar de se perguntar se a entrega chegou.",
  ],
  sections: [
    {
      title: "O que pode saber (e o que não pode)",
      takeaway: "Os alertas são sobre eventos do ciclo de vida, não sobre o texto da mensagem.",
      paragraphs: [
        "Eventos típicos incluem nota aberta, destruída, expirada, anexo descarregado e revogada. A formulação mantém-se deliberadamente grosseira: o suficiente para confiança operacional, não um feed de vigilância do comportamento de leitura.",
        "O modelo de privacidade do PrivateNote continua a aplicar-se. O e-mail de estado e os toasts **não** incluem o segredo desencriptado. Se precisar de um recibo estruturado para um rasto de auditoria, use a **prova de acesso** em planos elegíveis—descrita em [revogar e prova de acesso](blog:revoke-unopened-note-proof-of-access).",
      ],
      comparisonTable: {
        headers: ["Sinal", "Onde aparece", "Bom para"],
        rows: [
          [
            "Alertas por e-mail (conta verificada)",
            "O e-mail da sua conta",
            "Confirmação assíncrona quando está longe do site",
          ],
          [
            "Alertas em direto no separador (com sessão iniciada)",
            "PrivateNote aberto num browser",
            "Consciência quase em tempo real durante uma entrega ativa",
          ],
          [
            "Notificações do browser (permissão necessária)",
            "Permissão do SO pedida a partir de Personalizar",
            "Aviso quando o separador está em segundo plano",
          ],
          [
            "Conta → Atividade (depende do plano)",
            "O seu histórico de atividade privado",
            "Rever mais tarde o que aconteceu",
          ],
        ],
      },
    },
    {
      title: "Como ativar alertas",
      takeaway:
        "Inicie sessão, verifique o e-mail e depois ative alertas por nota ou nas preferências.",
      checklist: [
        "Inicie sessão e verifique o e-mail da sua conta",
        "Ative as notificações por e-mail em Conta → Preferências",
        "Ao criar uma nota, abra Personalizar → Alertas por e-mail",
        "Escolha notificar ao abrir, ou ao abrir e destruir (para fluxos de leitura única)",
        "Permita notificações do browser se quiser avisos ao nível do SO",
        "Mantenha o PrivateNote aberto para toasts em direto no separador durante entregas críticas",
      ],
      paragraphsAfterChecklist: [
        "As notificações de abertura estão disponíveis para utilizadores Free com sessão iniciada assim que o e-mail estiver verificado; o acompanhamento mais rico, como eventos de descarga de anexos e ferramentas de revogação, alarga-se em planos pagos.",
        "Para o padrão de entrega subjacente, veja [como criar uma nota privada](blog:how-to-make-a-private-note) e [enviar uma mensagem secreta sem conta](blog:send-secret-message-without-account) para destinatários.",
      ],
      midCta: {
        body: "A enviar um segredo urgente e precisa de confirmação de que chegou?",
        button: "Criar uma nota com alertas de abertura",
      },
    },
    {
      title: "Usar alertas de forma operacional",
      takeaway:
        "Trate «aberta» como um sinal para rodar ou fechar o ciclo—não como prova de leitura cuidadosa.",
      bullets: [
        "Entrega de palavra-passe: ao ver aberta, rode ou confirme que o destinatário alterou a credencial",
        "Envio de documento: aberta + anexo descarregado (onde disponível) significa que a janela do ficheiro está ativa",
        "Sem abertura antes do prazo: faça follow-up noutro canal, ou revogue se ainda não estiver aberta",
        "Abertura inesperada: assuma que o link pode estar comprometido; revogue se possível e reenvie",
      ],
      calloutTitle: "Limite honesto",
      callout:
        "«Aberta» significa que o fluxo de revelação avançou—não que uma pessoa leu cuidadosamente cada linha, e não que capturas de ecrã eram impossíveis.",
    },
    {
      title: "Expectativas de privacidade",
      takeaway: "Monitorizar a entrega não deve recriar um e-mail do segredo.",
      paragraphs: [
        "As equipas por vezes abusam dos recibos de leitura como vigilância de produtividade. O design do PrivateNote mantém os alertas mínimos: etiquetas de estado e referências, não dumps de conteúdo.",
        "Isso corresponde à promessa do produto noutros sítios—encriptação no browser, [conceitos de encriptação de ponta a ponta](blog:what-is-end-to-end-encryption), e nunca voltar a colocar o segredo no e-mail só para provar que chegou.",
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "O alerta incluirá o texto da minha nota?",
          answer:
            "Não. Os alertas por e-mail e em direto descrevem apenas o estado. O conteúdo da mensagem fica fora dos canais de notificação.",
        },
        {
          question: "Preciso de manter o separador aberto?",
          answer:
            "Os alertas por e-mail funcionam sem o separador. Os toasts em direto no separador precisam do site aberto; as notificações do browser ajudam quando o separador está em segundo plano e a permissão foi concedida.",
        },
        {
          question: "Os destinatários podem ver que ativei alertas?",
          answer:
            "Os destinatários focam-se em abrir e revelar a nota. As definições de notificação do remetente não fazem parte da carga secreta que desencriptam.",
        },
        {
          question: "E se precisar de parar o acesso depois de enviar?",
          answer:
            "Se a nota ainda não estiver aberta, revogue o link no ecrã de sucesso ou na atividade da conta em planos elegíveis. Detalhes em [revogar e prova de acesso](blog:revoke-unopened-note-proof-of-access).",
        },
      ],
    },
    {
      title: "Em resumo",
      takeaway: "Feche o ciclo sem copiar o segredo para outra caixa de entrada.",
      paragraphs: [
        "Saber quando um link foi aberto permite-lhe terminar a história operacional: rodar, fazer follow-up ou revogar.",
        "Ative o canal de alerta que corresponde à forma como trabalha—e-mail para assíncrono, alertas em direto para entregas em direto—e mantenha o texto simples onde deve estar: dentro da nota encriptada.",
      ],
    },
  ],
  ctaTitle: "Envie o segredo. Receba o estado.",
  ctaBody:
    "Ative alertas de abertura e destruição para saber quando uma entrega PrivateNote avança—sem colocar a mensagem no e-mail.",
  ctaButton: "Criar uma nota com alertas",
};
