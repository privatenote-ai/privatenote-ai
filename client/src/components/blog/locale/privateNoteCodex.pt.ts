import type { PrivateNoteCodexArticleCopy } from "./privateNoteCodex.types";

const claudeDesktopConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

const exampleResponse = `# Exemplo de resposta do assistente:

PrivateNote criada:
https://privatenote.ai/note/xK9m2p...#A3f7...

Expira em 24 horas · Destrói após leitura`;

const structuredPrompt = `# Exemplo de prompt estruturado:

Create a PrivateNote with:
content: "The deployment token is ghp_abc123"
expiresIn: "15m"
burnAfterReading: true`;

const codexConfigToml = `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]`;

const selfHostedConfigToml = `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.your-domain.com"`;

export const privateNoteCodexPt: PrivateNoteCodexArticleCopy = {
  intro: [
    "O OpenAI Codex é um agente de codificação com IA. Você descreve o que quer — corrigir um bug, adicionar uma feature, escrever um teste — e ele faz isso autonomamente em um ambiente isolado.",
    "Mas agentes precisam de segredos. Eles precisam clonar repositórios via SSH, buscar pacotes em registros privados, conectar a bancos de staging, chamar APIs internas. Isso significa transferir credenciais.",
    "Colar uma chave de API em um prompt de agente é essencialmente o mesmo que colar no Slack — acaba no histórico de contexto, possivelmente em logs, possivelmente em memória que persiste entre sessões. O PrivateNote oferece um caminho mais limpo: criptografe o segredo antes que o agente o veja, compartilhe um link que se autodestrói após uma leitura e não deixe nada para trás.",
    "Veja como conectar os dois.",
  ],
  sections: [
    {
      title: "O que é MCP?",
      body: [
        "MCP (Model Context Protocol) é um protocolo aberto que permite que aplicações de IA se conectem a ferramentas, fontes de dados e serviços via servidores padronizados. Qualquer cliente compatível com MCP — Claude Desktop, Cursor, Codex, Windsurf ou outro assistente — pode chamar ferramentas expostas por um servidor MCP.",
        "O servidor MCP do PrivateNote oferece uma ferramenta: create_private_note. Quando uma IA a chama, um processo Node.js local criptografa seu conteúdo antes de qualquer coisa tocar a rede. O resultado é um link seguro e com expiração que você pode compartilhar com qualquer pessoa.",
      ],
      links: [
        { label: "Documentação do Model Context Protocol", href: "https://modelcontextprotocol.io" },
        { label: "Transportes MCP", href: "https://modelcontextprotocol.io/docs/concepts/transports" },
        { label: "Configuração MCP do Claude Desktop", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
      ],
    },
    {
      title: "Pré-requisitos",
      body: ["Antes de instalar, verifique se você tem:"],
      bullets: [
        "Um cliente compatível com MCP: Claude Desktop, Cursor, Codex CLI, Windsurf ou um cliente que implemente a especificação MCP",
        "Node.js 18 ou superior — verifique com: node --version",
        "npx disponível — verifique com: npx --version",
        "Acesso de rede a privatenote.ai (ou sua instância self-hosted)",
      ],
    },
    {
      title: "O caminho mais rápido: um comando (Codex)",
      body: ["Se você usa a CLI do Codex, adicionar o PrivateNote como servidor MCP global é um comando:"],
      code: "codex mcp add privatenote -- npx -y privatenote-mcp",
      codeLabel: "Terminal",
      bullets: [
        "É isso. O servidor é registrado globalmente em ~/.codex/config.toml",
        "Cada nova sessão do Codex tem acesso à ferramenta create_private_note",
        "Sem configuração de projeto necessária — acompanha você entre repositórios",
      ],
    },
    {
      title: "Claude Desktop e outros clientes MCP",
      body: [
        "A maioria dos clientes MCP aceita um arquivo de configuração JSON. Para o Claude Desktop, abra a config do seu SO:",
        "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
        "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
        "Adicione o seguinte item, salve o arquivo e reinicie o Claude Desktop:",
      ],
      code: claudeDesktopConfig,
      codeLabel: "claude_desktop_config.json",
      bullets: [
        "Após reiniciar, o Claude detecta o servidor e disponibiliza automaticamente a ferramenta create_private_note no chat",
        "Cursor: adicione o mesmo item em Settings → MCP",
        "Qualquer outro cliente que siga a especificação MCP usa o mesmo bloco JSON",
      ],
    },
    {
      title: "O que você pode pedir ao seu assistente de IA agora",
      body: ["Com o servidor MCP conectado, você pode usar linguagem natural comum:"],
      bullets: [
        "\"Crie uma PrivateNote que diga: A senha temporária é X. Deixe expirar em 24 horas.\"",
        "\"Envolva esta senha de banco de dados em um link autodestrutivo para o contratado\"",
        "\"Envie a chave SSH com segurança — expira em 15 minutos, destruir após leitura\"",
        "\"Gere uma PrivateNote para credenciais de staging e me dê o link\"",
      ],
      code: exampleResponse,
      codeLabel: "Exemplo",
    },
    {
      title: "O que a ferramenta realmente faz",
      body: [
        "Quando a IA chama create_private_note, o servidor MCP inicia um processo Node.js local no seu computador. A criptografia acontece lá — antes de qualquer coisa tocar a rede.",
        "O servidor gera uma chave AES aleatória de 256 bits, criptografa o conteúdo com AES-256-GCM e faz POST apenas do texto cifrado para privatenote.ai. A chave não está na requisição.",
        "A chave de descriptografia vive apenas no fragmento da URL — a parte #que os navegadores nunca enviam aos servidores. O valor de retorno é um link. Quem abre o link descriptografa no navegador. A nota é removida logo depois.",
        "O privatenote.ai armazena blobs criptografados. Sem o fragmento, esses blobs são inúteis.",
      ],
    },
    {
      title: "Opções comuns da ferramenta",
      body: ["A ferramenta create_private_note aceita os seguintes parâmetros:"],
      bullets: [
        "content — texto sensível para criptografar e armazenar (obrigatório)",
        "expiresIn — por quanto tempo a nota fica disponível: 15m, 1h, 24h ou 7d (padrão: 24h)",
        "burnAfterReading — destruir a nota após a primeira visualização (padrão: true)",
        "title — rótulo opcional adicionado ao conteúdo antes da criptografia",
      ],
      code: structuredPrompt,
      codeLabel: "Prompt",
    },
    {
      title: "Regras de privacidade que você deve entender",
      body: [
        "Aqui está a parte honesta: se você digita um segredo em um prompt do Codex, o Codex o lê antes da ferramenta MCP iniciar. Os servidores da OpenAI processam essa mensagem.",
        "Então \"crie uma PrivateNote para sk_live_abc123\" significa que o valor sk_live_abc123 esteve brevemente no contexto na nuvem. A etapa PrivateNote garante que ele não fique no Slack, e-mail ou histórico de chat — mas não é o mesmo que a IA nunca ter visto o conteúdo.",
        "Duas formas de fechar essa lacuna:",
      ],
      bullets: [
        "Use a extensão VS Code na IDE do Codex — selecione o segredo no editor, clique com o botão direito → Share as PrivateNote. O segredo vai direto do editor para um link criptografado. O Codex não está envolvido",
        "Use um modelo local para a sessão do agente. Nada sai do seu computador antes de já estar criptografado",
      ],
    },
    {
      title: "Usando a extensão VS Code na IDE do Codex",
      body: [
        "O Codex roda em um editor compatível com VS Code. A extensão PrivateNote VS Code instala e funciona da mesma forma que no VS Code padrão.",
      ],
      code: "code --install-extension PrivateNote.privatenote-vscode",
      codeLabel: "Terminal",
      bullets: [
        "Após instalar, o ícone de envelope aparece na barra de atividades — clique para o painel PrivateNote",
        "Selecione texto no editor, clique com o botão direito → Share as PrivateNote para um caso rápido de uso único",
        "O ícone de cadeado na barra de título do editor aparece quando você tem texto selecionado",
        "Por este caminho, o Codex nunca toca texto plano — a extensão criptografa localmente no processo host do VS Code",
      ],
    },
    {
      title: "Se você prefere um arquivo de configuração",
      body: [
        "Você também pode adicionar o servidor MCP manualmente. O comando codex mcp add escreve em ~/.codex/config.toml — você pode editar esse arquivo diretamente se preferir:",
      ],
      code: codexConfigToml,
      codeLabel: "~/.codex/config.toml",
    },
    {
      title: "Apontando para uma instância self-hosted",
      body: [
        "Se sua equipe roda um servidor PrivateNote privado, defina a URL base via variável de ambiente na config MCP:",
      ],
      code: selfHostedConfigToml,
      codeLabel: "~/.codex/config.toml",
      bullets: [
        "Todos os segredos permanecem na sua infraestrutura — nada vai para privatenote.ai",
        "O mesmo modelo de criptografia AES-256-GCM; apenas o destino de armazenamento muda",
      ],
    },
    {
      title: "Solução de problemas",
      body: ["Se a ferramenta PrivateNote não aparecer no cliente após a configuração:"],
      bullets: [
        "Reinicie o cliente MCP — mudanças de configuração não carregam enquanto o app está rodando",
        "Confirme que o Node.js está instalado e no PATH: node --version",
        "Confirme que o npx funciona: npx --version",
        "Valide a config JSON — uma vírgula final é o erro de sintaxe mais comum",
        "Verifique logs MCP ou de extensão do cliente por erros de inicialização",
        "Verifique acesso de rede a privatenote.ai (ou seu host self-hosted)",
      ],
    },
    {
      title: "Algumas coisas para lembrar",
      body: [
        "A URL é o segredo. O link contém a chave de descriptografia no fragmento. Trate-o com o mesmo cuidado que a credencial em si — não faça commit, não registre em log, não publique em um canal público.",
        "Destruir após leitura significa exatamente isso. Assim que o link é aberto, ele desaparece. Nem você nem o destinatário podem abri-lo novamente.",
        "Rotacione após compartilhar. Se uma credencial apareceu em um prompt de IA — mesmo brevemente — trate-a como possivelmente vista. Compartilhe o valor atual via PrivateNote e depois rotacione para um novo.",
        "O PrivateNote é para transferência, não para armazenamento. Se um segredo precisa ficar disponível por mais de alguns dias, use um gerenciador de segredos de verdade. O PrivateNote é uma etapa segura de transferência, não um cofre.",
        "Use tempos de expiração curtos. Para segredos de uso único, 15m ou 1h quase sempre bastam. Escolha por padrão a janela mais curta que ainda funcione para o destinatário.",
      ],
    },
  ],
  ctaTitle: "Conecte seu assistente de IA ao PrivateNote",
  ctaBody:
    "Um comando ou um bloco JSON registra o servidor MCP. Cada sessão depois tem uma ferramenta integrada para compartilhamento seguro de segredos.",
  ctaButton: "Experimente o PrivateNote →",
};
