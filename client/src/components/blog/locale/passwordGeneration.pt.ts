import { BarChart3, Lock, Zap } from "lucide-react";
import type { PasswordPostCopy } from "./passwordGeneration.types";

export const passwordGenerationPt: PasswordPostCopy = {
  intro:
    "Uma senha forte é mais do que combinar caracteres aleatórios. No PrivateNote.ai, nosso gerador é construído em torno de três princípios:",
  lead: "Veja como cada componente contribui para a segurança das suas contas.",
  cards: [
    { icon: Lock, title: "Segurança criptográfica", body: "A mesma classe de aleatoriedade segura usada para chaves e tokens." },
    { icon: Zap, title: "Aleatoriedade imparcial", body: "Cada caractere tem a mesma chance de ser selecionado." },
    { icon: BarChart3, title: "Análise inteligente de força", body: "Análise avançada que vai além de verificações simples de comprimento." },
  ],
  sections: [
    {
      icon: Lock,
      title: "Crypto Web API",
      paragraphs: [
        "O gerador usa a Web Crypto API para obter valores aleatórios criptograficamente seguros, adequados para trabalho crítico de segurança.",
        "A aleatoriedade é semeada pelo sistema operacional e projetada para que valores futuros sejam, na prática, imprevisíveis sem acesso ao estado interno.",
        "Toda a geração acontece no seu navegador. Sua senha nunca sai do seu dispositivo, então não pode ser registrada, interceptada ou vazada dos nossos servidores.",
      ],
      notes: [
        {
          title: "Por que isso importa",
          body: "Geração de senha no servidor cria exposição extra via tráfego de rede e logs. Geração local evita esses riscos completamente.",
        },
      ],
    },
    {
      icon: Zap,
      title: "Aleatoriedade imparcial",
      paragraphs: [
        "Usamos rejection sampling para que cada caractere tenha a mesma chance de aparecer. Isso remove distorção sutil que faz alguns caracteres aparecerem com mais frequência.",
        "Seleção simples por módulo pode ser enviesada quando o intervalo de números aleatórios não é divisível uniformemente pelo tamanho do conjunto de caracteres. O rejection sampling descarta valores injustos e sorteia novamente.",
        "Isso torna as senhas mais difíceis de prever porque atacantes não podem explorar padrões na seleção de caracteres.",
      ],
    },
    {
      icon: BarChart3,
      title: "Análise inteligente de força",
      paragraphs: [
        "Um bom medidor vai além de comprimento e regras de símbolos. Strings previsíveis podem parecer complexas e ainda ser fracas.",
        "Usamos análise no estilo zxcvbn para padrões comuns, palavras de dicionário, sequências, repetições, entropia e estimativas realistas de tempo de quebra.",
        "Isso dá uma visão mais realista da força da senha do que uma simples checklist.",
      ],
      bullets: [
        { title: "Padrões comuns", body: "caminhos no teclado, sequências e caracteres repetidos" },
        { title: "Ataques de dicionário", body: "palavras comuns, nomes e variações de vazamentos de dados" },
        { title: "Entropia", body: "quão imprevisível a senha realmente é" },
        { title: "Tempo de quebra", body: "quanto tempo um atacante realisticamente precisaria" },
      ],
    },
  ],
  bestPracticesTitle: "Boas práticas para senhas",
  bestPractices: [
    { title: "Use senhas únicas", body: "Nunca reutilize senhas entre contas." },
    { title: "Mais longa é melhor", body: "Busque pelo menos 16 caracteres; mais para contas importantes." },
    { title: "Use um gerenciador de senhas", body: "Armazene senhas geradas com segurança para não precisar memorizá-las." },
    { title: "Ative a autenticação de dois fatores", body: "Mesmo senhas fortes se beneficiam de uma camada extra." },
    { title: "Não compartilhe senhas", body: "Nunca compartilhe senhas com quem diz ser suporte." },
  ],
};
