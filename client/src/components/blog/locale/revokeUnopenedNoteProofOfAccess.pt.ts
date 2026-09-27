import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const revokeUnopenedNoteProofOfAccessPt: BlogGuideArticleCopy = {
  heroAlt:
    "Vista de atividade da conta com uma nota não aberta e uma opção clara para revogar o link",
  heroCaption:
    "Mudou de ideia antes de alguém abrir? Destrua o link. Precisa de um recibo? Veja a prova de acesso.",
  intro: [
    "A partilha segura não se resume à encriptação no momento do envio. Trata-se também do **controlo depois**: interromper um link que não deveria ter enviado e manter um registo respeitador da privacidade do que aconteceu a um link que enviou.",
    "Os planos Starter e Business do PrivateNote acrescentam duas ferramentas complementares. **Revogar** destrói um link não aberto para que já não possa ser revelado. A **prova de acesso** mostra uma linha temporal simples—criada, aberta, anexo transferido, destruída, expirada ou revogada—sem expor o conteúdo da nota.",
    "Juntas respondem às duas perguntas de seguimento que as equipas realmente fazem: «Posso recuperar?» e «Posso mostrar que o link foi acedido?»",
  ],
  sections: [
    {
      title: "Revogue enquanto ainda está por abrir",
      takeaway:
        "A revogação funciona antes da revelação—não depois de alguém já ter desencriptado uma cópia.",
      paragraphs: [
        "Se uma nota ainda não foi aberta, pode revogá-la no ecrã de sucesso após a criação ou em Conta → Atividade. O link deixa de funcionar; os destinatários que cheguem mais tarde veem que o acesso desapareceu.",
        "Revogar é o passo certo quando colou o destinatário errado, detetou o segredo no chat errado ou decidiu que a entrega deve esperar. **Não** é a eliminação remota de um ficheiro que alguém já transferiu após a revelação—nenhuma ferramenta honesta de entrega E2EE pode prometer isso.",
      ],
      checklist: [
        "Crie a nota no Starter ou Business",
        "Se algo parecer errado, revogue de imediato no ecrã de sucesso",
        "Ou abra Conta → Atividade e revogue enquanto o estado ainda estiver por abrir",
        "Envie uma nota de substituição se o destinatário ainda precisar do segredo",
      ],
      midCta: {
        body: "Precisa de retomas e recibos em entregas sensíveis?",
        button: "Criar uma nota que possa revogar",
      },
    },
    {
      title: "Prova de acesso sem fugas de conteúdo",
      takeaway:
        "Um registo de estado respeitador da privacidade: o link foi acedido—não uma transcrição da leitura.",
      paragraphs: [
        "A prova de acesso foi concebida para conversas operacionais e de conformidade que precisam de evidência de eventos de entrega sem colocar segredos em e-mails ou tickets.",
        "A linha temporal mantém-se de alto nível: criada, link aberto, anexo transferido (quando acompanhado), destruída, expirada, revogada. Isso alinha-se com a postura de privacidade dos [alertas de abertura](blog:know-when-secret-link-opened): estado, não substância.",
      ],
      calloutTitle: "Leia o rótulo com atenção",
      callout:
        "A prova de acesso é um recibo de que o link foi acedido—não uma prova criptográfica de que uma pessoa específica leu cuidadosamente cada palavra, nem DRM contra capturas de ecrã.",
    },
    {
      title: "Como revogar e a prova se encaixam",
      takeaway:
        "Impeça o acesso quando puder; documente o acesso quando tiver de o fazer.",
      comparisonTable: {
        headers: ["Situação", "Usar", "Resultado"],
        rows: [
          [
            "Destinatário errado, ainda por abrir",
            "Revogar",
            "O link morre; criar uma nota corrigida",
          ],
          [
            "Entrega concluída, o auditor pergunta «foi aberta?»",
            "Prova de acesso",
            "Mostrar eventos da linha temporal sem conteúdo",
          ],
          [
            "Nota já revelada",
            "Rodar o segredo / assumir exposição",
            "Revogar já não recupera cópias em texto simples",
          ],
          [
            "À espera do destinatário",
            "Alertas + tempo de vida",
            "Fazer seguimento ou deixar expirar automaticamente se nunca for aberta",
          ],
        ],
      },
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "Posso revogar depois de o destinatário abrir a nota?",
          answer:
            "A revogação visa notas não abertas. Após a revelação, assuma que o destinatário pode reter o que viu; rode credenciais ou trate o documento como entregue.",
        },
        {
          question: "A prova de acesso inclui o texto da mensagem?",
          answer:
            "Não. É apenas uma linha temporal de estado. O conteúdo permanece fora de Atividade e das vistas de prova.",
        },
        {
          question: "A revogação está disponível no Free?",
          answer:
            "Revogar e a prova de acesso são capacidades Starter/Business. Os utilizadores Free continuam a ter encriptação, tempos de vida curtos e alertas de abertura depois de iniciarem sessão com um e-mail verificado.",
        },
        {
          question: "Onde encontro a prova mais tarde?",
          answer:
            "Abra Conta → Atividade, encontre a nota e escolha Ver prova de acesso quando o plano o permitir.",
        },
      ],
    },
    {
      title: "Em resumo",
      takeaway: "Controle o link por abrir; documente o que foi aberto.",
      paragraphs: [
        "A encriptação responde a «quem pode ler isto em trânsito e em repouso.» Revogar e a prova respondem a «o que fazemos a seguir.»",
        "Use-as com [códigos de verificação](blog:recipient-verification-code-before-reveal) e [alertas de abertura](blog:know-when-secret-link-opened) para um ciclo de entrega completo—do envio à confirmação, até à retoma ou ao recibo.",
      ],
    },
  ],
  ctaTitle: "Recupere um segredo por abrir.",
  ctaBody:
    "Revogue links que nunca deveriam abrir e mantenha uma linha temporal respeitadora da privacidade quando precisar de mostrar que uma entrega foi acedida—sem enviar o segredo por e-mail.",
  ctaButton: "Criar uma nota privada",
};
