import type { WorkplaceTextsArticleCopy } from "./workplaceTexts.types";

export const workplaceTextsPt: WorkplaceTextsArticleCopy = {
  sourceLabel: "Inspirado na cobertura do Business Insider",
  intro: [
    "A cobertura recente do Business Insider sobre o processo da OpenAI lembra que a comunicação moderna no trabalho é, na prática, permanente.",
    "SMS, conversas no Slack, transcrições de reuniões com IA, dispositivos sincronizados, chats no seu celular pessoal e ferramentas de colaboração podem todos se tornar prova, muito depois que o contexto original desapareceu.",
    "A lição não é esconder comportamento errado. É estar consciente do que você escreve, onde fica e por quanto tempo é preservado.",
  ],
  sections: [
    {
      title: "Mensagens escritas vivem mais do que as pessoas esperam",
      body: [
        "Uma mensagem rápida parece informal e temporária, mas a comunicação digital raramente fica contida.",
        "Screenshots, pré-visualizações de notificação, backups na nuvem, dispositivos sincronizados, e-mails encaminhados, resumos de IA e históricos de chat arquivados criam cópias extras que podem persistir por anos.",
        "À medida que as equipes dependem mais de ferramentas de IA, registros automáticos continuam crescendo. Assistentes de reunião criam transcrições, copilotos resumem conversas e plataformas de produtividade transformam discussões temporárias em memória institucional pesquisável com frequência crescente.",
      ],
    },
    {
      title: "Nem toda mensagem precisa virar histórico permanente",
      body: [
        "Alguma comunicação deve absolutamente ser preservada para prestação de contas, operações, compliance ou obrigações legais. Mas muitas mensagens não precisam de armazenamento duradouro.",
        "Credenciais temporárias, códigos de recuperação, instruções de uso único, rascunhos sensíveis, feedback privado, contexto juridicamente delicado e detalhes operacionais de curta duração frequentemente têm um propósito limitado e vida útil curta.",
        "Boa higiene de comunicação significa distinguir informação que deve persistir da informação que só precisa existir por pouco tempo.",
      ],
    },
    {
      title: "Onde o PrivateNote ajuda",
      body: [
        "O PrivateNote é útil quando a informação precisa ser compartilhada brevemente sem criar mais um registro pesquisável de longa duração.",
        "As notas são criptografadas no navegador antes do upload. O servidor armazena apenas texto cifrado, enquanto a chave de descriptografia permanece no fragmento da URL e não é enviada ao servidor em requisições padrão.",
        "Isso ajuda equipes a compartilhar informação temporária sem adicioná-la automaticamente a arquivos do Slack, histórico do Teams, caixas de entrada de e-mail, backups de SMS ou documentos de colaboração.",
      ],
      bullets: [
        "Senhas e códigos de recuperação",
        "Instruções de acesso temporário",
        "Detalhes operacionais sensíveis de uso único",
        "Rascunhos ou contexto juridicamente delicado",
        "Transferências privadas entre membros da equipe",
        "Informação com vida operacional curta",
      ],
    },
    {
      title: "O que o PrivateNote não resolve",
      body: [
        "Nenhuma ferramenta torna uma mensagem inadequada segura. Destinatários ainda podem fazer screenshots, copiar, fotografar ou encaminhar o que veem.",
        "Um dispositivo comprometido pode expor texto plano enquanto uma nota está aberta. Ferramentas efêmeras também não substituem obrigações legais, políticas corporativas, retenção obrigatória ou julgamento profissional.",
        "O PrivateNote reduz exposição no lado do servidor e retenção de longo prazo. Não elimina risco e não substitui uma conversa ao vivo quando a nuance importa mais que a conveniência.",
      ],
    },
    {
      title: "Uma regra melhor para comunicação sensível no trabalho",
      body: [
        "Antes de enviar uma mensagem, faça duas perguntas: Isso precisa ser escrito? Isso precisa permanecer?",
        "Se a resposta à primeira for não, converse ao vivo. Se a resposta à segunda for não, use um canal efêmero e criptografado projetado para comunicação temporária.",
        "Esse pequeno hábito pode evitar que contexto temporário se torne prova permanente.",
      ],
    },
  ],
  ctaTitle: "Use privacidade como fluxo de trabalho, não como botão de pânico",
  ctaBody:
    "Ferramentas de privacidade funcionam melhor quando você as adota antes de existir um problema. Use comunicação efêmera para segredos, instruções de uso único e contexto de curta duração que não deveria virar histórico permanente do trabalho.",
  ctaButton: "Escreva uma nota privada",
};
