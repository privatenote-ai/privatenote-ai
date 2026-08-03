import type { GoogleDriveVsOneTimeEncryptedLinksArticleCopy } from "./googleDriveVsOneTimeEncryptedLinks.types";

export const googleDriveVsOneTimeEncryptedLinksPt: GoogleDriveVsOneTimeEncryptedLinksArticleCopy = {
  heroAlt:
    "Cena calma de secretária sugerindo uma entrega temporária de ficheiros versus pastas de colaboração na cloud de longa duração",
  heroCaption:
    "O Drive brilha na colaboração contínua. Os links de uso único brilham quando o ficheiro só precisa de existir para a entrega.",
  intro: [
    "O Google Drive é uma das melhores ferramentas para guardar ficheiros e colaborar ao longo de dias, semanas ou anos. Os [links encriptados de uso único](blog:one-time-secret-links) resolvem outro problema: entregar informações confidenciais de forma segura uma vez e remover automaticamente o acesso quando já não é necessário.",
    "Nenhuma abordagem é universalmente melhor. A escolha certa depende de estar a colaborar num documento ou simplesmente a entregar informações confidenciais.",
  ],
  sections: [
    {
      title: "Porque isto importa",
      takeaway:
        "A conveniência torna o Drive a opção por defeito—mesmo quando o ficheiro só precisa de ser visto uma vez.",
      paragraphs: [
        "Para muitas pessoas, o Google Drive tornou-se a resposta por defeito sempre que um ficheiro precisa de ser partilhado. Está integrado no Gmail, Android, Google Workspace e inúmeros fluxos de trabalho. Precisa de enviar um PDF, uma folha de cálculo ou um contrato? Carregue-o para o Drive, copie o link e envie.",
        "Essa conveniência tornou o Drive incrivelmente bem-sucedido—mas também pode incentivar-nos a usar a mesma ferramenta em situações para as quais não foi especificamente concebida.",
        "Imagine enviar uma cópia do passaporte ao contabilista, um contrato de trabalho assinado aos RH ou documentos fiscais a um consultor financeiro. Na maioria dos casos, o destinatário só precisa desses ficheiros uma vez. Depois da tarefa concluída, cada cópia restante apenas aumenta a probabilidade de a informação permanecer acessível mais tempo do que o necessário.",
        "O maior risco raramente é alguém intercetar o ficheiro em trânsito. Os serviços cloud modernos encriptam os dados [em trânsito](blog:encrypted-vs-secure-file-sharing). O problema maior é a **retenção**. Informações sensíveis ficam frequentemente no armazenamento cloud, nas notificações de email, nas pastas sincronizadas e nos ficheiros descarregados muito depois de toda a gente ter esquecido que existem.",
      ],
    },
    {
      title: "O Google Drive foi feito para colaboração",
      takeaway:
        "Edição simultânea, histórico de versões e pastas partilhadas são pontos fortes—não falhas.",
      paragraphs: [
        "O Google Drive é excelente a ajudar pessoas a trabalhar em conjunto. Várias pessoas podem editar o mesmo documento ao mesmo tempo, as alterações são guardadas automaticamente, o histórico de versões facilita recuperar revisões anteriores e as permissões podem ser ajustadas quando membros da equipa entram ou saem de um projeto. Para trabalho contínuo, estas são enormes vantagens.",
        "Este é exatamente o ambiente para o qual o Drive foi concebido. Uma pasta de projeto pode permanecer ativa durante meses enquanto os documentos evoluem e novos ficheiros são adicionados.",
        "O desafio aparece quando essas mesmas funcionalidades de colaboração são usadas para informações que nunca deveriam permanecer disponíveis.",
      ],
    },
    {
      title: "O custo oculto do acesso a longo prazo",
      takeaway:
        "Entregas temporárias deixam pegadas permanentes quando a plataforma otimiza a disponibilidade.",
      paragraphs: [
        "A maioria dos ficheiros confidenciais não precisa de estar disponível para sempre. Uma cópia do passaporte pode ser necessária apenas para verificação de identidade. Uma declaração fiscal apenas para uma submissão específica. Uma chave de API pode ser usada uma vez e depois rodada. Quando o destinatário termina, continuar a armazenar a informação traz muito pouco benefício.",
        "Infelizmente, eliminar o acesso nem sempre é simples. As pessoas descarregam ficheiros para os portáteis. Sincronizam pastas entre dispositivos. Os convites por email ficam nas caixas de entrada. As pastas partilhadas continuam a existir. Meses depois, alguém descobre uma pasta antiga com permissões que ninguém se lembrava de ter concedido.",
        "Nenhum destes eventos representa uma falha do Google Drive. São simplesmente a consequência natural de usar uma plataforma de colaboração para uma entrega temporária—o mesmo padrão de retenção que surge quando as pessoas [enviam segredos por email](blog:why-email-is-worst-for-secrets) ou deixam [documentos no chat](blog:secrets-never-send-in-chat).",
      ],
    },
    {
      title: "Quando os links de uso único fazem mais sentido",
      takeaway:
        "Entregar uma vez, expirar por conceção—sem transformar cada entrega num espaço de trabalho partilhado.",
      paragraphs: [
        "Os links encriptados de uso único são concebidos com um objetivo diferente. Em vez de criar um espaço de trabalho partilhado, focam-se em entregar informações confidenciais com a menor pegada digital prática. A informação é encriptada antes de sair do navegador e o acesso pode ser limitado a uma única visualização ou a um período de expiração curto. Quando a entrega termina, o link torna-se inutilizável.",
        "Não se trata de substituir o armazenamento cloud. Trata-se de reconhecer que nem todos os ficheiros merecem armazenamento permanente ou permissões contínuas.",
        "Se está a enviar um código de recuperação a um colega, um contrato assinado a um cliente ou registos médicos a um especialista, provavelmente não precisa de edição colaborativa, histórico de versões ou pasta partilhada. Precisa apenas de a pessoa certa receber a informação em segurança—veja também [como enviar documentos sensíveis com segurança](blog:send-sensitive-documents-securely).",
        "Serviços como o [PrivateNote](app:secure-file-transfer) são construídos em torno deste modelo de partilha temporária. Em vez de incentivar o armazenamento a longo prazo, minimizam a retenção combinando encriptação do lado do cliente com expiração automática.",
      ],
    },
    {
      title: "Que método deve escolher?",
      takeaway:
        "Adapte a ferramenta à duração da informação—não à plataforma mais familiar.",
      paragraphs: [
        "A decisão tem menos a ver com «segurança» abstrata e mais com o propósito.",
        "Se várias pessoas precisam de rever, editar e voltar a um documento ao longo do tempo, o Google Drive é uma excelente escolha. Comentários, histórico de versões e pastas partilhadas tornam a colaboração simples.",
        "Se a informação só precisa de ser entregue uma vez, um link encriptado de uso único costuma encaixar melhor. Remove a necessidade de gerir permissões duradouras, reduz cópias desnecessárias e limita durante quanto tempo a informação permanece disponível.",
      ],
      calloutTitle: "Regra prática",
      callout:
        "Escolha a ferramenta que corresponde a quanto tempo a informação realmente precisa de permanecer disponível—não a que abre por hábito.",
    },
    {
      title: "Comparação",
      takeaway: "Funcionalidades de colaboração e entrega efémera resolvem trabalhos diferentes.",
      comparisonTable: {
        headers: ["Funcionalidade", "Google Drive", "Link encriptado de uso único"],
        rows: [
          ["Concebido para colaboração", "Sim", "Não"],
          ["Armazenamento a longo prazo", "Sim", "Não"],
          ["Encriptação ponta a ponta do lado do cliente", "Não por defeito*", "Sim"],
          ["Expiração automática", "Não (limpeza manual)", "Sim"],
          ["Acesso de leitura única", "Não", "Sim"],
          ["Gestão contínua de permissões", "Sim", "Não"],
          ["Melhor para partilha confidencial temporária", "Às vezes", "Sim"],
        ],
        after: [
          "*O Drive padrão encripta dados em trânsito e em repouso com chaves geridas pelo Google. O Google Workspace oferece [encriptação do lado do cliente](https://support.google.com/a/answer/10741875) opcional para algumas organizações, mas os links partilhados do dia a dia ainda otimizam o acesso duradouro em vez de uma entrega burn-after-reading.",
        ],
      },
    },
    {
      title: "Checklist de boas práticas",
      takeaway: "Pequenos hábitos reduzem o risco de retenção, qualquer que seja a ferramenta.",
      paragraphs: [
        "Qualquer que seja a ferramenta escolhida, alguns hábitos simples reduzem significativamente a exposição desnecessária.",
      ],
      checklist: [
        "Partilhe apenas o que o destinatário precisa—evite pastas inteiras cheias de dados pessoais não relacionados",
        "Remova metadados desnecessários de PDF, ficheiros Office e imagens quando for prático",
        "Se usar uma frase-passe, envie-a por um canal separado (fora de banda / OOB)",
        "Após a tarefa: revogue o acesso partilhado, elimine cópias locais temporárias e evite pastas partilhadas indefinidas",
      ],
      paragraphsAfterChecklist: [
        "A entrega fora de banda significa que o link encriptado viaja num canal (por exemplo, email) enquanto a frase-passe viaja noutro (Signal, SMS ou uma chamada). Comprometer um só canal não deve bastar para abrir o ficheiro.",
        "Para um fluxo mais aprofundado sobre entregas de documentos, siga o [guia de documentos sensíveis](blog:send-sensitive-documents-securely). Para como a encriptação no navegador difere da de transporte, veja [encriptado vs partilha segura de ficheiros](blog:encrypted-vs-secure-file-sharing).",
      ],
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "O Google Drive é seguro?",
          answer:
            "Sim—o Google Drive é uma plataforma cloud madura que encripta informações em trânsito e em repouso. A exposição global ainda depende de como os ficheiros são partilhados, de como as permissões são geridas e de quanto tempo os documentos permanecem acessíveis depois da tarefa concluída.",
        },
        {
          question: "O Google Drive tem encriptação ponta a ponta?",
          answer:
            "Não no sentido usado para mensagens encriptadas do lado do cliente ou links de uso único encriptados no navegador. No armazenamento padrão do Drive, o Google gere as chaves de encriptação. A encriptação opcional do lado do cliente do Workspace altera esse cenário para organizações elegíveis, mas a partilha quotidiana «qualquer pessoa com o link» ainda deixa cópias duradouras e superfícies de permissão que a entrega efémera evita. Veja [o que significa encriptação ponta a ponta](blog:what-is-end-to-end-encryption).",
        },
        {
          question: "Os links de uso único são mais seguros do que o Google Drive?",
          answer:
            "Para entregas confidenciais temporárias, muitas vezes reduzem o risco a longo prazo porque minimizam a retenção e podem remover o acesso automaticamente após a entrega. Para edição colaborativa e projetos contínuos, o Drive continua a ser a melhor ferramenta. A segurança segue o propósito—não um ranking universal.",
        },
        {
          question: "E se eu enviar um link de uso único à pessoa errada?",
          answer:
            "Proteja o conteúdo com uma frase-passe, use uma expiração curta e destrua a nota antes de ser aberta se a ferramenta o permitir. Verificar o destinatário antes de enviar continua a ser a melhor defesa. Agências como a [CISA](https://www.cisa.gov/) enfatizam consistentemente limitar a duração do acesso e o menor privilégio—as mesmas ideias por detrás dos links encriptados de curta duração.",
        },
      ],
    },
  ],
  ctaTitle: "Precisa de uma entrega confidencial temporária?",
  ctaBody:
    "O Google Drive e os links encriptados de uso único são ferramentas complementares. Se as pessoas precisam de colaborar em documentos ao longo do tempo, o Drive é uma das melhores plataformas de colaboração. Se o objetivo é entregar informações confidenciais uma vez e minimizar o tempo em que permanecem acessíveis, crie um link de uso único encriptado ponta a ponta no navegador—sem deixar cópias permanentes no email ou em pastas partilhadas.",
  ctaButton: "Criar um link seguro de uso único",
};
