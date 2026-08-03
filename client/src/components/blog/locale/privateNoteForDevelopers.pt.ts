import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersPt: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Você precisa enviar uma senha para um colega. Talvez seja o banco de dados de staging. Talvez uma chave Stripe indo para produção. Talvez uma credencial SSH para um servidor ao qual só você e mais duas pessoas têm acesso.",
    "Você abre o Slack. Começa a digitar. E então — um pequeno e familiar momento de hesitação.",
    "Essa mensagem fica no seu histórico de chat. Sincroniza para três dispositivos. Pode acabar em um backup, índice de busca ou arquivo de compliance. Muito depois de você rotacionar a credencial e esquecer que ela existiu, a mensagem ainda está lá.",
    "O PrivateNote é um caminho diferente. O segredo é criptografado na sua máquina antes de tocar qualquer rede. A chave de descriptografia fica apenas na URL que você compartilha — o servidor que armazena a nota nunca a vê. A nota se autodestrói após a primeira leitura. Nada fica preservado.",
    "Veja como usar — começando pela opção mais fácil.",
  ],
  sections: [
    {
      title: "A extensão VS Code e Cursor",
      body: [
        "Se você passa os dias no VS Code ou Cursor, este é o caminho mais fluido. Instale a extensão uma vez e ela fica na barra lateral, sempre a um clique de distância.",
        "Abra o painel de Extensões (Cmd+Shift+X), procure por PrivateNote e clique em Instalar. Após reiniciar a janela, um pequeno ícone de envelope aparece na barra de atividades à esquerda.",
        "Clique nele. Um painel se abre:",
      ],
      bullets: [
        "Digite ou cole o segredo no campo de conteúdo",
        "Defina um tempo de expiração — 15 minutos, 1 hora, 1 dia ou 7 dias",
        "Deixe \"Destruir após leitura\" marcado (o padrão)",
        "Clique em Share PrivateNote →",
      ],
    },
    {
      title: "O que acontece quando você clica em Share",
      body: [
        "A criptografia integrada do seu navegador gera uma chave aleatória de 256 bits. Essa chave nunca sai da sua máquina.",
        "O conteúdo é criptografado com AES-256-GCM. O resultado é um blob de texto cifrado sem conteúdo legível.",
        "Apenas esse blob criptografado é enviado ao servidor PrivateNote. A chave não vai junto — não no corpo da requisição, não em um header, em lugar nenhum.",
        "O servidor armazena o blob criptografado e retorna um ID de nota. Sua máquina monta uma URL compartilhável: o ID da nota no caminho, a chave de descriptografia no fragmento da URL — a parte #que os navegadores nunca enviam aos servidores.",
        "O link é copiado para sua área de transferência. Você cola onde normalmente colaria o segredo. A diferença é que agora o link é o segredo, não a senha em si.",
      ],
    },
    {
      title: "Duas outras formas de usar a extensão",
      body: [
        "Você não precisa abrir o painel sempre. Há dois atalhos mais rápidos:",
        "Selecione texto no editor e clique com o botão direito — você verá Share as PrivateNote no menu de contexto. Um quick-pick pede expiração e preferência de destruição, depois o link é copiado para sua área de transferência.",
        "Com texto selecionado, um ícone de cadeado também aparece na barra de título do editor, no canto superior direito. Um clique e está enviado.",
      ],
    },
    {
      title: "Se você usa um assistente de IA: o servidor MCP",
      body: [
        "Se você trabalha com Claude ou outro modelo no Cursor, a IA pode criar PrivateNotes em seu nome. O servidor MCP (Model Context Protocol) adiciona uma ferramenta create_private_note que o agente pode chamar automaticamente.",
        "Adicione isto em ~/.cursor/mcp.json:",
      ],
      code: mcpConfig,
      bullets: [
        "Reinicie o Cursor e verifique Settings → MCP — você deveria ver privatenote com um ponto verde",
        "Então diga ao agente: \"Envie esta chave de API com segurança, destruir após leitura\"",
        "O agente chama a ferramenta, a criptografia roda localmente e você recebe um link",
      ],
    },
    {
      title: "Uma coisa sobre IA e segredos",
      body: [
        "Se você coloca um segredo em um prompt de IA, o modelo o lê antes da ferramenta MCP criptografar o conteúdo. Os servidores do provedor de IA veem o conteúdo brevemente.",
        "Ainda é uma grande melhoria em relação ao Slack — o segredo não fica em histórico permanente de chat, e-mail ou logs de servidor. Mas não é o mesmo que a IA nunca ter visto o conteúdo.",
        "Para privacidade ponta a ponta completa com um agente de IA, use um modelo local no seu dispositivo (como Ollama). Então nada sai do seu computador antes de já estar criptografado.",
      ],
    },
    {
      title: "Sem instalação: o app web",
      body: [
        "Se você não está no VS Code ou em um dispositivo sem sua configuração usual, o app web em privatenote.ai funciona da mesma forma em qualquer navegador.",
        "Cole o segredo, escolha um tempo de expiração, clique em Create. Compartilhe o link. A lógica de criptografia roda no navegador — o mesmo AES-256-GCM, a mesma arquitetura de chave-no-fragmento.",
      ],
    },
    {
      title: "O que você deve lembrar",
      body: [
        "O link contém a chave de descriptografia. Trate a URL com o mesmo cuidado que o segredo em si — não a publique em um canal público.",
        "Assim que uma nota com destruição após leitura é aberta, o link morre. Nem você nem o destinatário podem abri-lo novamente.",
        "Se você colocou um segredo em um prompt de IA, considere rotacionar após compartilhar. O prompt foi visto. O link PrivateNote não — mas a credencial original sim.",
        "Para segredos que precisam durar muito, use um gerenciador de segredos de verdade. O PrivateNote é para transferência, não para armazenamento.",
      ],
    },
  ],
  ctaTitle: "Compartilhe sua primeira nota privada",
  ctaBody: "Instale a extensão VS Code ou experimente o app web — sem conta necessária para notas de leitura única.",
  ctaButton: "Experimente o PrivateNote →",
};
