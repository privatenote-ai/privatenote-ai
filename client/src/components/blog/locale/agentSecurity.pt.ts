import type { AgentSecurityArticleCopy } from "./agentSecurity.types";

export const agentSecurityPt: AgentSecurityArticleCopy = {
  intro: [
    "A indústria de IA passou os últimos anos obcecada com **prompt injection** — a preocupação de que um prompt malicioso possa induzir um chatbot a produzir uma resposta não intencionada.",
    "Mas prompt injection não é mais toda a história.",
    "Os sistemas de IA de hoje estão evoluindo rapidamente de assistentes passivos para **agentes autônomos**. Eles não respondem apenas a perguntas. Acessam arquivos, analisam e-mails, invocam APIs, executam fluxos de trabalho em várias etapas e tomam decisões operacionais em seu nome.",
    "No momento em que um sistema de IA ganha a capacidade de **agir**, o manual de segurança muda completamente.",
    "Um artigo recente do USENIX Security 2026, **SoK: Attack and Defense Landscape of Agentic AI Systems**, de Kim et al., oferece uma das análises mais abrangentes sobre segurança de agentes até hoje. Os pesquisadores revisaram 128 artigos acadêmicos, identificaram 51 técnicas de ataque e 60 estratégias de defesa e propuseram um framework para entender os desafios emergentes de segurança dos sistemas de IA autônomos.",
    "A conclusão central é direta:",
    "Para organizações que constroem, implantam ou dependem de produtos baseados em IA, isso deveria servir como um alerta.",
  ],
  introCallout: "Quanto mais autonomia um agente de IA ganha, maior fica sua superfície de ataque.",
  sections: [
    {
      title: "Por que a segurança de agentes é diferente",
      paragraphs: [
        "O software tradicional segue uma lógica predefinida. As aplicações LLM tradicionais geram principalmente texto. **Os sistemas agênticos funcionam de outro jeito.**",
        "Eles combinam modelos de linguagem com ferramentas externas, sistemas de memória, bancos de dados, APIs e capacidades de decisão autônoma. Um agente corporativo pode ler um e-mail recebido, recuperar informações da documentação interna, consultar um CRM, atualizar um banco de dados e enviar uma resposta — tudo em um único fluxo de trabalho.",
        "Essa flexibilidade é o que torna os agentes tão poderosos. Também é o que os torna difíceis de proteger.",
        "O artigo do USENIX argumenta que focar apenas na segurança do modelo é insuficiente. A segurança precisa ser avaliada em **todo o ecossistema do agente**: o modelo, sua memória, suas ferramentas, suas fontes de dados e as ações que ele pode executar.",
      ],
    },
    {
      title: "As sete dimensões do risco agêntico",
      paragraphs: [
        "Os pesquisadores identificam sete dimensões-chave que influenciam a postura de segurança de um agente:",
      ],
      bullets: [
        { label: "Input Trust", body: "De onde vem a informação?" },
        { label: "Data Access Sensitivity", body: "A quais informações o agente pode acessar?" },
        { label: "Workflow Autonomy", body: "Ele pode decidir de forma independente o que fazer em seguida?" },
        { label: "Action Capability", body: "Ele pode modificar, excluir ou transmitir dados?" },
        { label: "Memory Persistence", body: "A informação persiste entre sessões?" },
        { label: "Tool Availability", body: "Quais sistemas externos ele pode invocar?" },
        { label: "User Interface Power", body: "Quanta influência ele tem sobre as decisões do usuário?" },
      ],
      afterBullets: [
        "Compare um chatbot de suporte ao cliente com um assistente executivo autônomo.",
        "Cada capacidade adicional aumenta a utilidade. Mas também expande a superfície de ataque e cria novas oportunidades de uso indevido, manipulação ou comportamento não intencionado.",
        "A segurança deixa de ser proteger um modelo e passa a ser **governar um sistema complexo**.",
      ],
    },
    {
      title: "O contexto é a nova fronteira de segurança",
      paragraphs: [
        "Por décadas, a cibersegurança se concentrou em três princípios: confidencialidade, integridade e disponibilidade. Esses princípios continuam essenciais.",
        "Mas a IA agêntica introduz um novo desafio: **segurança contextual**.",
        "Um agente pode ter autenticação forte, comunicações criptografadas e controles de acesso rigorosos — e ainda assim falhar de forma catastrófica porque age com base em informações maliciosas ou manipuladas.",
        "Imagine um agente processando um PDF aparentemente inofensivo enviado por uma parte externa. Instruções ocultas no documento dizem ao agente para ignorar orientações anteriores, recuperar informações sensíveis e transmiti-las para outro lugar.",
        "Essa distinção importa porque muitos ataques emergentes de IA exploram o fluxo de informações em vez de vulnerabilidades de software.",
      ],
      emphasisBlock: [
        "O sistema não foi comprometido por meio de credenciais roubadas.",
        "A infraestrutura não foi violada.",
        "O agente simplesmente seguiu o contexto errado.",
      ],
      callout:
        "Para sistemas agênticos, o contexto se torna uma fronteira de segurança tão importante quanto autenticação, criptografia ou segmentação de rede.",
    },
    {
      title: "Por que a memória cria novos riscos",
      paragraphs: [
        "A memória de IA costuma ser apresentada como um recurso de experiência do usuário. O argumento é simples: uma memória melhor permite uma personalização melhor.",
        "Mas a memória também cria persistência. E persistência cria risco.",
        "O artigo do USENIX destaca como atacantes podem tentar envenenar armazenamentos de memória de longo prazo com instruções maliciosas ou informações enganosas. Uma vez gravado na memória, esse conteúdo pode influenciar decisões futuras muito depois de a interação original ter terminado.",
        "Diferente de um ataque temporário de prompt injection, o envenenamento de memória pode persistir entre fluxos de trabalho, usuários e tempo. O resultado é um desafio de segurança fundamentalmente diferente.",
      ],
      emphasisBlock: [
        "A memória não é mais apenas um recurso de conveniência.",
        "A memória é infraestrutura.",
        "E infraestrutura exige governança.",
      ],
    },
    {
      title: "Os agentes mais perigosos são os que têm permissões",
      paragraphs: [
        "Os maiores riscos da IA agêntica não vêm necessariamente da inteligência do modelo. **Eles vêm da autoridade concedida a ele.**",
        "Um modelo que gera um parágrafo incorreto é inconveniente. Um agente com acesso a registros de clientes, documentos internos, sistemas financeiros, plataformas de comunicação e ferramentas de automação pode criar consequências reais.",
        "À medida que as organizações conectam agentes a sistemas cada vez mais poderosos, o foco precisa mudar da capacidade do modelo para o controle operacional.",
      ],
      callout:
        "A pergunta crítica não é mais: “Quão inteligente é o modelo?” É: “O que o modelo tem permissão para fazer?”",
    },
    {
      title: "Construindo sistemas agênticos confiáveis",
      paragraphs: [
        "A lição mais ampla do artigo é que a segurança de agentes exige **defesa em profundidade**.",
        "Organizações que implantam agentes de IA devem priorizar:",
      ],
      bullets: [
        { label: "Dados confiáveis vs. não confiáveis", body: "Separação forte entre fontes de dados confiáveis e não confiáveis" },
        { label: "Limites de permissão", body: "Limites explícitos sobre o que os agentes podem fazer" },
        { label: "Governança de memória", body: "Controles para sistemas de memória de longo prazo" },
        { label: "Aprovação humana", body: "Confirmação para operações de alto risco" },
        { label: "Auditoria e observabilidade", body: "Registro e monitoramento abrangentes" },
        { label: "Políticas de acesso a ferramentas", body: "Regras claras para integrações externas" },
      ],
      afterBullets: [
        "Esses princípios refletem práticas consolidadas de cibersegurança porque, cada vez mais, os agentes de IA se parecem mais com funcionários do que com recursos de software.",
      ],
    },
    {
      title: "A lição mais ampla",
      paragraphs: [
        "A indústria descreve com frequência os agentes de IA como **funcionários digitais**. Essa analogia está ficando cada vez mais precisa.",
        "Funcionários recebem treinamento. Funcionários operam sob políticas. Funcionários têm permissões definidas. Funcionários são monitorados. Funcionários podem cometer erros.",
        "Os agentes de IA não são diferentes. A única diferença é que eles podem cometer erros na velocidade da máquina.",
        "Os produtos de IA mais bem-sucedidos da próxima década não terão simplesmente os modelos mais capazes. **Eles terão a arquitetura de confiança mais sólida.**",
      ],
      emphasisBlock: ["A inteligência atrai usuários.", "A confiança os mantém."],
    },
  ],
  closingCallout: {
    title: "Proteger o contexto, não apenas os dados",
    body: "Na PrivateNote.ai, acreditamos que proteger o contexto está se tornando tão importante quanto proteger os próprios dados. À medida que os sistemas de IA ganham acesso a mais notas pessoais, conhecimento empresarial e fluxos operacionais, a segurança precisa ir além de armazenamento e criptografia — incluindo as informações que os agentes consomem, lembram e sobre as quais agem.",
  },
};
