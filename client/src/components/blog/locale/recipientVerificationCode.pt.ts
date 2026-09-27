import type { BlogGuideArticleCopy } from "./blogGuideArticle.types";

export const recipientVerificationCodePt: BlogGuideArticleCopy = {
  heroAlt:
    "Ecrã de portátil a mostrar um passo de verificação de seis dígitos antes de uma nota privada poder ser revelada",
  heroCaption:
    "O link sozinho não chega: o destinatário introduz um código de utilização única que partilha noutro canal.",
  intro: [
    "Um link de nota privada é poderoso porque normalmente transporta o material necessário para desencriptar a mensagem. Essa comodidade também é um risco: se o URL completo cair na caixa de correio, thread de chat ou captura de ecrã erradas, o segredo pode ficar acessível antes de o destinatário previsto o abrir.",
    "Os **códigos de verificação** do destinatário acrescentam um segundo segredo de entrega que controla. Depois de criar a nota, o PrivateNote mostra um código de seis dígitos específico da nota. Partilha esse código em separado—por telefone, Signal ou outro canal—para que um link interceptado não baste para chegar ao passo de revelação.",
    "Isto é diferente do envelopamento opcional com frase-passe sobre o texto cifrado e diferente de iniciar sessão. É um portão de entrega: **verificar, depois revelar**.",
  ],
  sections: [
    {
      title: "Só o link vs. link mais código",
      takeaway:
        "A entrega em canais separados transforma uma mensagem roubada num puzzle incompleto.",
      paragraphs: [
        "Os bearer links são comuns na partilha segura. Funcionam bem quando o canal é de confiança e a duração é curta. Funcionam pior quando a mesma conta de e-mail ou chat que recebe o link também pode estar monitorizada, partilhada ou comprometida.",
        "Exigir um código de verificação restaura a separação clássica: envie o link no canal A e o código no canal B. Um atacante precisa de ambos. Esse padrão combina naturalmente com [como partilhar uma palavra-passe de forma segura](blog:how-to-share-a-password-securely) e com [links secretos de utilização única](blog:one-time-secret-links).",
      ],
      comparisonTable: {
        headers: ["Controlo", "O que protege", "O que não faz"],
        rows: [
          [
            "Código de verificação (Starter/Business)",
            "Bloqueia a revelação até o destinatário introduzir o código de utilização única",
            "Não substitui o envelopamento com frase-passe nem o login da conta",
          ],
          [
            "Frase-passe na nota",
            "Envolve o texto cifrado para que a desencriptação precise da frase-passe",
            "Continua a exigir partilha out-of-band cuidadosa dessa frase-passe",
          ],
          [
            "Expiração curta + uma abertura",
            "Limita quanto tempo um link vazado continua útil",
            "Não impede quem já tem link + código a tempo",
          ],
        ],
      },
    },
    {
      title: "Como ativar",
      takeaway:
        "Ative em Entrega e verificação e partilhe o código e o link em separado.",
      paragraphs: [
        "Nos planos Starter e Business elegíveis, abra **Personalizar** ao criar uma nota e ative **Exigir código de verificação** em Entrega e verificação. Também pode defini-lo como predefinição em Conta → Preferências para que as novas notas herdem o portão.",
        "Após a criação, o ecrã de sucesso mostra o **código de verificação do destinatário**. Copie o link da nota como habitualmente e envie o código por outro caminho. Informe o destinatário de que verá um passo de verificação antes de **Revelar nota**.",
      ],
      checklist: [
        "Usar Starter ou Business (funcionalidade associada ao plano)",
        "Ativar Exigir código de verificação na nota (ou como predefinição da conta)",
        "Criar a nota e copiar o link",
        "Copiar o código de seis dígitos do ecrã de sucesso",
        "Enviar link e código em canais separados",
        "Confirmar que o destinatário verifica antes de revelar",
      ],
      midCta: {
        body: "Está a enviar algo para uma caixa de correio que pode estar partilhada ou vigiada?",
        button: "Criar uma nota com verificação",
      },
    },
    {
      title: "O que o destinatário experiencia",
      takeaway: "Primeiro o código, depois o aviso habitual de click-to-reveal.",
      paragraphs: [
        "Abrir o link apresenta um ecrã de verificação—não o conteúdo desencriptado. Após um código correto, aparece o portão de revelação familiar: abra só quando estiver pronto, porque revelar pode consumir a nota segundo a política de burn.",
        "Códigos errados falham de forma fechada. O destinatário não precisa de conta; só do código que partilhou. Para o atraso intencional antes da desencriptação, veja [porque as notas esperam pelo click-to-reveal](blog:click-to-reveal-private-notes).",
      ],
    },
    {
      title: "Quando usar códigos de verificação",
      takeaway: "Use-os quando o canal do link for mais fraco do que o segredo.",
      bullets: [
        "Credenciais ou documentos enviados por e-mail para uma caixa partilhada",
        "Links publicados num chat de equipa com muitos membros",
        "Entregas com alto risco de captura de ecrã ou reencaminhamento",
        "Qualquer segredo que também protegeria com partilha de frase-passe em canais separados",
      ],
      calloutTitle: "Dica prática",
      callout:
        "Não coloque o código de verificação no mesmo e-mail que o link. Isso junta ambos os fatores numa única mensagem interceptável.",
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "O código de verificação é o mesmo que uma palavra-passe na nota?",
          answer:
            "Não. O código de verificação é um portão verificado no servidor antes da revelação. Uma frase-passe da nota (quando ativada) envolve o próprio texto cifrado e é um controlo opcional separado.",
        },
        {
          question: "Posso escolher o meu próprio código?",
          answer:
            "O PrivateNote gera um código de seis dígitos específico da nota. Partilha esse valor gerado; não inventa nem reutiliza um PIN pessoal.",
        },
        {
          question: "Está disponível no Free?",
          answer:
            "A verificação do destinatário é uma capacidade Starter e Business. Contas Free ainda podem usar expiração curta, limites de abertura e envelopamento opcional com frase-passe quando oferecidos.",
        },
        {
          question: "A verificação significa que o PrivateNote pode ler a minha nota?",
          answer:
            "Não. A verificação autoriza o acesso ao fluxo de revelação. O conteúdo das mensagens continua encriptado no browser; os alertas de estado nunca incluem texto em claro.",
        },
      ],
    },
    {
      title: "Em resumo",
      takeaway: "Torne o link incompleto sem o seu código out-of-band.",
      paragraphs: [
        "Os códigos de verificação são para momentos em que a comodidade deixaria de outra forma um URL totalmente desencriptável num único canal.",
        "Ative o portão, partilhe o código em separado e mantenha a duração da nota curta—especialmente para [chaves API](blog:how-to-share-api-key-securely), palavras-passe e documentos.",
      ],
    },
  ],
  ctaTitle: "Adicione um passo de verificação separado à entrega.",
  ctaBody:
    "Exija um código de verificação de utilização única antes de revelar e envie esse código noutro canal diferente do link.",
  ctaButton: "Criar uma nota privada verificada",
};
