import type { GoodEnoughSecurityArticleCopy } from "./goodEnoughSecurity.types";

export const goodEnoughSecurityPt: GoodEnoughSecurityArticleCopy = {
  intro: [
    "Por muito tempo, a indústria nos disse que ser cuidadoso era principalmente uma questão de complexidade de senha e bom senso. Uma longa sequência de caracteres e um clique cauteloso deveriam ser suficientes.",
    "Não são. Ataques modernos são automatizados, escaláveis e pacientes. Seus hábitos não competem contra uma pessoa; competem contra infraestrutura.",
    "A resposta não é paranoia. É arquitetura: reduzir confiança, minimizar retenção de dados e projetar fora pontos únicos de falha.",
  ],
  sections: [
    {
      title: "1. Senhas: deixe a entropia para a máquina",
      paragraphs: [
        "Humanos são ruins em gerar aleatoriedade. Quando tentamos ser espertos, criamos padrões que crackers de senha exploram deliberadamente.",
        "Use um gerenciador de senhas para que cada conta tenha uma senha única de alta entropia gerada por software em vez de pela sua memória.",
        "O único segredo que você memoriza deveria ser uma passphrase longa, e o cofre deveria usar uma função moderna de derivação de chave como Argon2id.",
      ],
    },
    {
      title: "2. Autenticação: vinculada à origem, não apenas dois fatores",
      paragraphs: [
        "Códigos tradicionais de dois fatores ajudam, mas ainda podem ser phished em tempo real. SMS é particularmente vulnerável porque SIM swaps e portabilidade de número são rotineiros.",
        "FIDO2 e WebAuthn mudam o protocolo. Uma passkey ou chave de hardware prova posse de uma chave privada para uma origem de site específica, então um domínio de phishing não pode reutilizá-la.",
      ],
      bullets: [
        "Chaves de segurança e passkeys: resistentes a phishing e vinculadas à origem.",
        "Apps autenticadores: úteis, mas ainda vulneráveis a phishing em tempo real.",
        "Códigos por SMS ou e-mail: evite-os para contas valiosas.",
      ],
    },
    {
      title: "3. Mensagens: criptografia não é uma caixa de seleção",
      paragraphs: [
        "A criptografia de ponta a ponta protege o conteúdo, mas detalhes de design importam. Forward secrecy mantém conversas antigas mais seguras se uma chave de longo prazo for comprometida depois.",
        "Mensagens que desaparecem reduzem a quantidade de dados que ficam para trás. Dados que não existem mais não podem ser raspados, obtidos por intimação ou vazados meses depois.",
        "A criptografia não apaga metadados e não ajuda se um atacante controlar seu dispositivo desbloqueado.",
      ],
    },
    {
      title: "4. Higiene de rede: a realidade da VPN",
      paragraphs: [
        "Uma VPN não é um manto de invisibilidade. Ela transfere confiança da rede local para o provedor de VPN.",
        "Use uma quando resolver um problema concreto: Wi‑Fi hostil, censura ou limitação de tráfego. Não espere que resolva higiene fraca do navegador ou autenticação ruim.",
        "Protocolos modernos como WireGuard são atraentes porque seu design é compacto, auditável e construído sobre primitivas criptográficas bem compreendidas.",
      ],
    },
    {
      title: "5. Navegadores: onde a maioria das contas realmente falha",
      paragraphs: [
        "Muitos takeovers de conta começam com cookies de sessão roubados, não com criptografia quebrada. O navegador é um ambiente de risco cheio de scripts, extensões e sessões de longa duração.",
        "Mantenha extensões mínimas, bloqueie scripts de terceiros agressivamente e separe identidades com perfis ou containers quando possível.",
        "Autenticação resistente a phishing é crucial aqui: uma chave de hardware vinculada à origem se recusa a participar no domínio errado.",
      ],
    },
    {
      title: "6. Compartilhamento seguro: reduzir o raio de explosão",
      paragraphs: [
        "Segredos às vezes precisam ser compartilhados, mas e-mail e chat do trabalho criam dívida de segurança permanente via logs, backups, pré-visualizações e metadados.",
        "O padrão mais seguro é compartilhamento efêmero criptografado no lado do cliente: criptografar antes do upload, não armazenar chaves no servidor e expirar agressivamente.",
        "A efemeridade não é um truque. É minimização de dados aplicada a fluxos de trabalho humanos.",
      ],
    },
    {
      title: "Uma linha de base para o fim de semana",
      paragraphs: [
        "Segurança não é um estado binário. É fricção incremental nos lugares certos.",
        "O objetivo não é ser inquebrável. O objetivo é tornar o custo de atacar você maior do que o valor dos dados obtidos.",
      ],
      ordered: [
        "Mova contas sensíveis para senhas únicas geradas por um gerenciador.",
        "Adicione autenticação com suporte de hardware à sua identidade principal, especialmente e-mail.",
        "Revise e remova extensões de navegador desnecessárias.",
        "Mova conversas sensíveis para um messenger criptografado de ponta a ponta com mensagens que desaparecem ativadas.",
      ],
    },
  ],
};
