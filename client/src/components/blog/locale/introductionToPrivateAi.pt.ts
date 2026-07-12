import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiPt: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Pessoa trabalhando numa secretária em casa com um laptop mostrando uma visualização de rede neural e um servidor local compacto de IA ao lado",
  intro: [
    "**Private AI** significa executar um grande modelo de linguagem em hardware que você controla diretamente—seu laptop, seu navegador ou um servidor no escritório—para que seu texto de entrada nunca seja enviado a uma nuvem de terceiros para inferência. É a resposta prática a uma pergunta simples: *posso obter ajuda de alta qualidade da IA sem entregar minhas palavras ao computador de outra pessoa?*",
    "Essa pergunta importa mais a cada ano. Assistentes na nuvem são notavelmente poderosos, mas processam seus prompts em infraestrutura remota. Para notas, credenciais, rascunhos jurídicos, informações de saúde ou qualquer coisa que você não colaria num chatbot público, a IA local e no navegador deixou de ser curiosidade de entusiastas. É um requisito de segurança vital.",
    "Este guia percorre como a private AI evoluiu, por que grandes laboratórios publicam pesos de modelos, as principais formas de executar modelos localmente, os projetos open source e famílias de modelos que mais importam, onde está o estado da arte em 2026—e como a [PrivateNote](app:home) se encaixa com **Write with Private AI**, que roda inteiramente na aba do navegador.",
  ],
  sections: [
    {
      title: "Uma breve evolução: dos laboratórios ao seu laptop",
      paragraphs: [
        "Durante anos, modelos de linguagem úteis viveram quase exclusivamente dentro de gigantes da tecnologia com enormes clusters de GPU. O treinamento exigia milhões de dólares em computação, equipes especializadas e conjuntos de dados proprietários. Se você queria assistência de IA, usava uma API ou um app web na nuvem—e seu texto saía da sua máquina.",
        "Três mudanças na indústria alteraram esse cenário por completo:",
      ],
      bullets: [
        "**Leis de escala dos transformers** — Pesquisas mostraram que modelos bem treinados em grandes conjuntos de dados de alta qualidade podiam entregar capacidades surpreendentemente gerais—não apenas em escala frontier.",
        "**Lançamentos open-weight** — Começando com a família Llama da Meta e seguidos por Mistral, Google Gemma, Alibaba Qwen e outros, parâmetros para download alcançaram desenvolvedores em todo o mundo.",
        "**Amadurecimento das ferramentas de inferência** — Projetos como llama.cpp, Ollama, vLLM, WebLLM e Transformers.js tornaram prático executar esses pesos em hardware de consumo.",
      ],
      callout:
        "Em 2026, a lacuna entre «somente na nuvem» e «roda no meu dispositivo» estreitou dramaticamente. Modelos frontier na nuvem ainda são maiores e mais rápidos, mas modelos abertos pequenos e médios são altamente capazes para redigir, resumir, reescrever e responder perguntas do dia a dia—especialmente para escrita curta como notas.",
    },
    {
      title: "Por que empresas publicam pesos de modelos",
      paragraphs: [
        "Liberar pesos não é caridade. Laboratórios publicam parâmetros por razões estratégicas que moldam todo o ecossistema.",
      ],
      bullets: [
        "**Alavancagem do ecossistema** — Quando desenvolvedores constroem sobre seu modelo, sua arquitetura vira um padrão. Fine-tunes, ferramentas e integrações seguem os pesos.",
        "**Credibilidade de pesquisa** — Pesos abertos convidam escrutínio, reprodutibilidade e adoção acadêmica. Essa visibilidade reforça a liderança técnica.",
        "**Posicionamento regulatório e de confiança** — Players europeus como Mistral e marcas globais como Meta e Google usam lançamentos abertos para sinalizar transparência e se diferenciar de APIs totalmente fechadas.",
        "**Destilação e especialização** — Modelos menores treinados a partir de maiores espalham capacidade para baixo. Publicar pesos-pai acelera essa pipeline na comunidade.",
        "**Pressão competitiva** — Quando um grande laboratório lança abertamente um modelo forte, outros enfrentam pressão para igualar ou arriscam perder a atenção dos desenvolvedores.",
      ],
      callout:
        "Pesos abertos nem sempre são «open source» no sentido estrito. Licenças podem restringir uso comercial, exigir atribuição ou excluir certos domínios. Sempre leia o model card antes de implantar em produção.",
    },
    {
      title: "Três formas de implantar private AI",
      paragraphs: [
        "Não existe uma única arquitetura ideal. A escolha certa depende do seu hardware, requisitos de privacidade e se você precisa de um generalista de 70 bilhões de parâmetros ou um assistente rápido para notas curtas.",
      ],
      beforeFlowSteps: "A maioria das implantações de private AI cai em um destes padrões:",
      flowDiagramCaption: "Três padrões de implantação em resumo",
      flowSteps: [
        {
          step: "Opção 1",
          title: "Ambientes de aplicativos locais (Ollama e apps desktop)",
          body: "Ferramentas como [Ollama](https://ollama.com), LM Studio e GPT4All baixam pesos de modelos e os executam nativamente no seu Mac, Windows ou Linux. Você obtém inferência offline, aceleração nativa por GPU e acesso a modelos maiores do que um navegador consegue carregar confortavelmente. Trade-offs: espaço em disco significativo (muitas vezes dezenas de gigabytes por modelo), RAM ou VRAM dedicada e atualizações manuais.",
        },
        {
          step: "Opção 2",
          title: "Ambientes sandbox (WebGPU no navegador)",
          body: "Navegadores modernos expõem **WebGPU**, que permite ao JavaScript executar redes neurais na sua GPU sem instalar nada. Projetos como WebLLM, MLC LLM e Transformers.js compilam modelos para a web. Você sacrifica tamanho do modelo e velocidade bruta, mas ganha uma propriedade notável: **seu prompt nunca sai da aba do navegador para inferência**. Sem conta, sem ida e volta ao servidor, sem provedor registrando seu rascunho.",
        },
        {
          step: "Opção 3",
          title: "Computação dedicada (servidores em casa ou no escritório)",
          body: "Equipes com GPUs NVIDIA dedicadas, um Mac Studio ou um pequeno rack server frequentemente executam **vLLM**, **llama.cpp** ou Ollama como endpoint interno compartilhado. Este é o padrão para private AI de máxima qualidade: grandes janelas de contexto, modelos maiores e múltiplos usuários numa LAN. Trade-offs: custo de hardware, energia, refrigeração e manutenção operacional contínua.",
        },
      ],
      afterFlowSteps: [
        "O fio condutor é o mesmo nos três casos: **a inferência acontece em infraestrutura que você controla**, não numa nuvem multi-tenant onde seu texto vira carga de processamento de outra pessoa.",
      ],
    },
    {
      title: "Projetos open source que mais importam",
      paragraphs: [
        "Modelos são só metade da história. Estes projetos fundamentais transformaram pesos brutos em software que milhões de pessoas conseguem executar de fato.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Inferência C/C++ de alta eficiência; a base para inúmeras implantações locais em CPU e GPU.",
        "**[Ollama](https://ollama.com)** — Uma experiência amigável de CLI e desktop para baixar, atualizar e conversar com modelos localmente.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Serving em lote de alto throughput para servidores GPU compartilhados de equipe e cargas em escala de API.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — A biblioteca e hub de fato para descobrir, baixar, fazer fine-tune e compartilhar modelos.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Compila modelos para execução nativa no navegador, sem instalação, via WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Executa modelos exportados em ONNX diretamente em JavaScript—outro caminho para inferência no navegador.",
      ],
    },
    {
      title: "Famílias de modelos que vale conhecer",
      paragraphs: [
        "Dezenas de checkpoints aparecem todo mês. Quatro famílias dominam as conversas sobre private AI em 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 e as linhas mais novas Llama 4 definem o benchmark para generalistas open-weight: raciocínio forte, amplo suporte de ferramentas e um enorme ecossistema de fine-tune.",
        "**Google Gemma** — As famílias Gemma 2, Gemma 3 e **Gemma 4** focam em eficiência—forte desempenho por parâmetro, excelentes modelos pequenos e variantes ajustadas para inferência on-device e hospedada.",
        "**Mistral AI (Europa)** — A Mistral, sediada em Paris, entrega modelos compactos e capazes (Mistral, Mixtral, Codestral) com licenças amigáveis para desenvolvedores e uma narrativa europeia distinta de soberania de dados.",
        "**Alibaba Qwen** — As séries Qwen 2.5 e **Qwen 3** se destacam em tarefas multilíngues e oferecem variantes minúsculas (sub‑1B parâmetros) que rodam excepcionalmente bem em hardware modesto de laptop e navegador.",
      ],
      callout:
        "A IA no navegador da PrivateNote usa **Gemma 2 2B** e **Qwen3 0.6B** via WebLLM—modelos open-weight compilados para WebGPU, não um checkpoint fechado proprietário. Variantes maiores de **Gemma 4** aparecem no caminho opcional Cloud Assist, não no Write with Private AI hoje.",
    },
    {
      title: "Estado da arte em 2026",
      paragraphs: [
        "A frontier está dividida. APIs fechadas da OpenAI, Anthropic e Google ainda lideram em capacidade bruta, uso de ferramentas em escala e as maiores janelas de contexto. Mas pesos abertos estão perto o suficiente para muitos fluxos reais—e à frente em **privacidade, controle de custos e personalização**.",
        "Entre modelos abertos, **Gemma 4**, **Llama 4**, **Qwen 3** e grandes checkpoints **Mistral** representam a geração atual: melhor seguimento de instruções, código e matemática aprimorados e recusas mais confiáveis em prompts sensíveis. Variantes destiladas menores trazem uma fatia significativa dessa qualidade para laptops e navegadores.",
        "Modelos multimodais (texto + imagem) estão se expandindo tanto em lançamentos na nuvem quanto abertos, mas para anotações e entregas secretas, modelos pequenos só de texto continuam sendo o ponto ideal: rápidos o suficiente para parecer interativos, pequenos o suficiente para permanecer locais.",
      ],
    },
    {
      title: "Private AI na PrivateNote: Write with Private AI",
      paragraphs: [
        "A PrivateNote foi construída para notas criptografadas e efêmeras—não para substituir toda a sua stack de IA. Ainda assim, redigir uma mensagem sensível é exatamente onde a IA no navegador brilha: você obtém ajuda de escrita **antes** da criptografia, sem enviar seu texto aos nossos servidores para inferência.",
        "Abra a [PrivateNote](app:home) e escolha **Write with Private AI**. Não há seletor manual de modelo—em desktops compatíveis com WebGPU, o nível do seu dispositivo decide qual checkpoint roda:",
        "Seja honesto sobre os trade-offs. Os pesos são baixados no armazenamento do navegador e a inferência roda localmente—mas a IA no navegador é **mais lenta** que um datacenter na nuvem e não iguala as **grandes janelas de contexto** de modelos de classe servidor. Também depende do hardware: muitos telefones e laptops antigos recorrem a digitar sem IA ou ao Cloud Assist opcional. Mas para redigir uma nota privada curta, uma mensagem de entrega de senha ou uma resposta confidencial, é **bastante capaz**—e as propriedades de privacidade são fundamentalmente diferentes dos fluxos de colar no ChatGPT.",
      ],
      bullets: [
        "**Hardware modesto** — Carrega **Qwen3 0.6B** e executa inferência localmente via WebGPU.",
        "**Desktops capazes** — Carrega **Gemma 2 2B** e executa inferência localmente via WebGPU.",
        "**Privado por arquitetura** — Com Write with Private AI, seu rascunho é processado no navegador. Não é enviado aos servidores da PrivateNote para inferência do modelo.",
        "**Criptografe após redigir** — Quando estiver satisfeito com o texto, a nota é criptografada localmente antes do upload—o mesmo modelo de toda outra PrivateNote.",
        "**Cloud Assist opcional** — Se seu dispositivo não consegue executar modelos locais, você pode optar pelo Cloud Assist (Google **Gemma 4 26B** via Cloudflare Workers AI). Esse caminho é mais rápido e capaz, mas **não é totalmente privado**—seu prompt sai do dispositivo em texto claro e você deve habilitá-lo explicitamente. Veja [como a PrivateNote funciona](app:how-it-works) para a comparação completa.",
        "**A ferramenta certa para o trabalho** — Use Private AI no navegador para rascunhos sensíveis. Use Ollama ou um servidor GPU em casa quando precisar de documentos longos, contexto enorme ou os maiores modelos abertos.",
      ],
      callout:
        "Private AI no navegador não tenta vencer modelos frontier na nuvem em benchmarks. Tenta tornar **a redação privada prática** para as notas que as pessoas já criam na PrivateNote.",
    },
    {
      title: "Escolhendo sua configuração de private AI",
      paragraphs: [
        "Se você é novo em private AI, comece simples: instale o Ollama e experimente um checkpoint médio de Llama ou Gemma para escrita do dia a dia no laptop.",
        "Se seu modelo de ameaça exige que rascunhos nunca saiam do dispositivo—mesmo antes da criptografia—use ferramentas no navegador, incluindo Write with Private AI dentro da PrivateNote. Soberania de dados e automação inteligente não se contradizem mais; você simplesmente combina a sensibilidade do texto com a arquitetura que o executa.",
        "Se está protegendo uma equipe, avalie um servidor GPU compartilhado com vLLM e controles de acesso—e leia [protegendo agentes de IA como funcionários](blog:securing-ai-agents-like-employees) para entender como sistemas agênticos mudam a fronteira de confiança. Para desenvolvedores integrando agentes em fluxos de trabalho, veja [PrivateNote para desenvolvedores](blog:privatenote-for-developers) e a [integração Codex MCP](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Experimente redação privada no navegador",
  closingBody: [
    "Abra a PrivateNote, selecione Write with Private AI e redija sua próxima nota sensível sem enviá-la a um modelo de nuvem externo. Criptografe quando estiver pronto—depois compartilhe um link seguro de uso único.",
  ],
  fileSharingNote:
    "Precisa compartilhar arquivos também? [Transferência segura de arquivos](app:secure-file-transfer) usa a mesma criptografia no navegador. O envio requer uma conta gratuita; destinatários podem abrir links sem se cadastrar.",
  tagline: "Redija localmente. Criptografe primeiro. Compartilhe um link.",
  relatedReading: "Leituras relacionadas",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb:
        "À medida que agentes de IA ganham ferramentas e memória, a segurança deve governar todo o sistema—não apenas o modelo.",
    },
    {
      slug: "privatenote-for-developers",
      blurb:
        "Compartilhe segredos do VS Code, Cursor ou um agente de IA sem colar no histórico de chat.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb:
        "Criptografe antes do envio, compartilhe um link e deixe a nota expirar—passo a passo.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Quem detém as chaves e por que a criptografia no navegador difere de HTTPS sozinho.",
    },
    {
      slug: "privacy-tools",
      blurb:
        "Ferramentas práticas de privacidade além de melhores hábitos.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb:
        "Por que notas efêmeras superam logs permanentes de chat para mensagens sensíveis no trabalho.",
    },
  ],
};
