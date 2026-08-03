import type { EncryptedFileSharingArticleCopy } from "./encryptedVsSecureFileSharing.types";

export const encryptedVsSecureFileSharingPt: EncryptedFileSharingArticleCopy = {
  intro: [
    'Quando as pessoas buscam "compartilhar arquivos com segurança", muitas vezes assumem que todo serviço com HTTPS ou criptografia TLS protege seus arquivos da mesma forma. Infelizmente, isso não é verdade.',
    'Dois serviços podem anunciar "transferência de arquivos criptografada" com garantias de privacidade muito diferentes. A diferença está inteiramente em **onde a criptografia acontece**. Entender essa distinção explica por que alguns serviços podem inspecionar, indexar e processar seus arquivos, enquanto outros simplesmente não podem.',
  ],
  sections: [
    {
      title: "Os dois tipos de criptografia",
      level: "primary",
      paragraphs: ["Existem duas formas principais pelas quais os serviços modernos de compartilhamento de arquivos protegem seus dados."],
    },
    {
      title: "1. Criptografia de transporte (TLS)",
      level: "secondary",
      paragraphs: [
        "Esta é a criptografia padrão que praticamente todo site na Internet usa hoje. Quando você envia um arquivo, seu navegador estabelece uma conexão segura de Transport Layer Security (TLS) com o servidor hospedeiro. A conexão é criptografada enquanto o arquivo viaja pela rede, protegendo você de atacantes em Wi‑Fi público, roteadores comprometidos ou qualquer pessoa que espione o tráfego de rede.",
      ],
      flow: "tls",
      bullets: [
        "O TLS é essencial, e todo serviço confiável deve usá-lo.",
        "Uma vez que o upload chega ao servidor, o provedor recebe o arquivo original em texto legível.",
        "A partir daí, dependendo das políticas, o serviço pode armazenar o arquivo, gerar pré-visualizações, indexar conteúdo, escanear malware ou usar metadados para análises.",
        'Muitos provedores também criptografam arquivos "em repouso". Isso protege contra roubo físico de discos — mas o serviço ainda tem as chaves e pode ler seus arquivos.',
      ],
      callout:
        "**A vulnerabilidade central do armazenamento em nuvem tradicional:** o servidor só pode criptografar o que já conseguiu ler.",
    },
    {
      title: "2. Criptografia no navegador",
      level: "secondary",
      paragraphs: [
        "Uma abordagem fundamentalmente diferente é criptografar o arquivo **antes** de ele sair do seu dispositivo. Em vez de enviar o arquivo original, seu navegador usa APIs criptográficas locais para criptografá-lo. O servidor recebe apenas texto cifrado — dados que parecem aleatórios e são inúteis sem a chave de descriptografia.",
      ],
      flow: "browser",
      bullets: [
        "A criptografia no navegador não substitui o TLS — ela o complementa.",
        "O TLS ainda protege a conexão contra espiões em nível de rede.",
        "Os servidores do provedor recebem apenas texto cifrado ilegível porque nunca recebem o conteúdo legível nem a chave de descriptografia.",
      ],
    },
    {
      title: "Por que essa diferença importa",
      level: "primary",
      paragraphs: [
        "Suponha que você está compartilhando dados altamente sensíveis: contratos jurídicos, planilhas financeiras, código-fonte proprietário, prontuários médicos ou documentos empresariais confidenciais.",
        "Com apenas criptografia de transporte, sua privacidade é **contratual**. Você precisa confiar na implementação do provedor, nos controles de acesso de funcionários e nas políticas corporativas atuais e futuras.",
        "Com criptografia no navegador, sua privacidade é **arquitetônica**. O provedor armazena apenas texto cifrado. Mesmo se for hackeado, receber uma intimação judicial ou mudar seu modelo de negócio, ele não pode entregar conteúdo legível que nunca possuiu.",
      ],
      callout:
        "Com apenas criptografia de transporte, sua privacidade é **contratual**. Com criptografia no navegador, sua privacidade é **arquitetônica**.",
    },
    {
      title: "Um lembrete recente: o fator de confiança",
      level: "primary",
      paragraphs: [
        "Em 2025, o WeTransfer atualizou seus Termos de Serviço com linguagem que parecia conceder amplos direitos sobre o conteúdo enviado, inclusive para melhorar sistemas de aprendizado de máquina usados em moderação de conteúdo.",
        "A mudança provocou reação imediata de artistas, jornalistas e profissionais criativos que temiam que sua propriedade intelectual fosse usada para treinar sistemas de IA. O WeTransfer esclareceu rapidamente que o conteúdo de clientes não era usado para treinamento de IA e removeu a linguagem confusa — mas o incidente destacou uma lição crucial:",
        "Se um provedor recebe seus arquivos em texto legível, você depende inteiramente das promessas dele. Quando um provedor armazena apenas texto cifrado, a confiança que você precisa depositar nele é estruturalmente minimizada. A arquitetura impõe a privacidade.",
      ],
    },
    {
      title: "Como a PrivateNote lida com compartilhamento de arquivos",
      level: "primary",
      paragraphs: [
        "A criptografia moderna baseada no navegador combina vários blocos criptográficos bem estabelecidos para manter os dados seguros sem depender de confiança no servidor.",
      ],
    },
    {
      title: "Geração e isolamento de chaves",
      level: "secondary",
      paragraphs: [
        "Quando um usuário prepara compartilhar um arquivo, a PrivateNote gera no navegador uma chave simétrica aleatória criptograficamente segura usando a Web Crypto API.",
        "Essa chave nunca é transmitida para nossa infraestrutura. Em vez disso, ela é adicionada ao link de compartilhamento como fragmento de URL (a parte após o símbolo `#`):",
        "`https://privatenote.ai/note/your-note-id#your-secret-key`",
        "Por design, os navegadores nunca enviam o fragmento de URL ao servidor web em uma solicitação HTTP. Esse comportamento é definido pelo padrão de URL e funciona assim há décadas. A chave de descriptografia permanece no navegador do destinatário.",
      ],
    },
    {
      title: "Criptografia em streaming autenticada",
      level: "secondary",
      paragraphs: [
        "Em vez de enviar dados brutos, o navegador criptografa o arquivo antes de ele tocar a rede. Como a PrivateNote suporta anexos grandes, ela usa **criptografia em streaming por blocos**: os arquivos são criptografados bloco a bloco (geralmente em partes de vários megabytes) para que uploads grandes não precisem carregar o arquivo inteiro na memória de uma vez.",
        "Contas gratuitas podem anexar arquivos de até 25 MB; contas Premium suportam uploads muito maiores (até 1 GB por arquivo). Em todos os casos, apenas texto cifrado chega aos nossos servidores.",
        "A implementação se baseia em **AES-GCM** (Authenticated Encryption with Associated Data), fornecendo confidencialidade e integridade:",
      ],
      bullets: [
        "**Confidencialidade** — a carga é ilegível sem a chave.",
        "**Integridade** — a manipulação do texto cifrado em repouso é detectada e rejeitada durante a descriptografia no cliente.",
        "Quando a proteção por senha está ativada, uma chave derivada da senha é gerada com algoritmos que consomem muita memória como **Argon2id**, tornando impraticável a adivinhação por força bruta.",
      ],
    },
    {
      title: "Quais metadados ainda existem",
      level: "primary",
      paragraphs: [
        "Uma arquitetura de segurança rigorosa deve reconhecer seus limites. A criptografia no navegador protege o **conteúdo** dos seus arquivos, mas certos metadados permanecem visíveis para a rede e o serviço:",
      ],
      bullets: [
        "Carimbos de data/hora de upload e download.",
        "O tamanho aproximado da carga criptografada.",
        "Expiração, limites de visualização e janelas de acesso ao arquivo.",
        "O endereço IP do destinatário ao baixar (visível para o servidor web que roteia a solicitação).",
      ],
      callout:
        "Sistemas focados em privacidade minimizam metadados onde é prático, mas nenhum serviço baseado na web pode eliminá-los completamente. A PrivateNote trata metadados com a mesma disciplina de retenção que cargas criptografadas — eles são removidos quando uma nota expira ou é excluída.",
    },
    {
      title: "As compensações da privacidade real",
      level: "primary",
      paragraphs: ["A criptografia no navegador oferece privacidade máxima de conteúdo, mas com compensações intencionais:"],
      bullets: [
        "**Sem varredura de malware no servidor** — porque o servidor não pode ler o arquivo, ele não pode escaneá-lo em busca de vírus. Confie no remetente.",
        "**Sem pré-visualizações geradas no servidor** — miniaturas e pré-visualizações de documentos são renderizadas localmente no navegador do destinatário após a descriptografia, não no servidor.",
        "**Sem recuperação de senha ou chave** — se você perder o link ou a chave de criptografia, o provedor não pode recuperar o arquivo. Não existe \"Esqueci a senha\" para dados aos quais o hospedeiro não tem acesso.",
      ],
    },
    {
      title: "Escolhendo o serviço certo",
      level: "primary",
      paragraphs: [
        "Nem toda transferência de arquivos exige criptografia rigorosa no navegador. Fotos casuais de férias com a família podem ser suficientes com apenas criptografia de transporte.",
        "Se você compartilha propriedade intelectual, acordos jurídicos ou dados pessoais sensíveis, faça uma pergunta arquitetônica:",
        "**O serviço recebe meu arquivo original ou apenas uma versão criptografada dele?**",
        "Essa única distinção determina quem pode acessar tecnicamente seus dados — não apenas hoje, mas conforme políticas corporativas, propriedade e leis de privacidade evoluem ao longo do tempo.",
      ],
    },
  ],
  closingTitle: "Compartilhe arquivos sem entregar conteúdo legível ao servidor",
  closingBody:
    "A transferência segura de arquivos da PrivateNote usa o mesmo modelo de criptografia baseado no navegador das nossas notas que desaparecem: criptografe localmente, envie texto cifrado, compartilhe a chave no fragmento da URL e faça o acesso expirar nas suas condições.",
  ctaLabel: "Experimente a transferência segura de arquivos",
  relatedReading: "Leitura relacionada",
};
