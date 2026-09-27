import type { PrivacyToolsGuideArticleCopy } from "./privacyToolsGuide.types";

export const privacyToolsGuidePt: PrivacyToolsGuideArticleCopy = {
  intro: [
    "A maioria das páginas de «melhores ferramentas de privacidade» são catálogos de afiliados disfarçados. Classificam cada categoria, enterram os trade-offs e deixam-no com vinte abas e nenhum sistema.",
    "Este guia é diferente. É um **quadro de decisão 2026** para montar um stack de privacidade que encaixa na vida real: que trabalho precisa fazer, que default escolher, quando fazer upgrade—e quando uma ferramenta tem a forma errada de todo.",
    "O PrivateNote.ai ocupa um slot estreito—**entregas de segredos de uso único**. Tudo o resto abaixo é opinião curada para que saia desta página com um stack coerente e depois explore o nosso [diretório de ferramentas de privacidade](app:privacy-tools) para o catálogo completo.",
  ],
  sections: [
    {
      title: "Comece com um modelo de ameaça (não com uma lista de compras)",
      paragraphs: [
        "Ferramentas de privacidade só ajudam se corresponderem ao que está a defender. Um freelancer a partilhar credenciais Wi‑Fi tem um problema diferente de um jornalista sob vigilância direcionada. Escolha o stack mais leve que cubra *os seus* riscos—e pare de colecionar ferramentas por desporto.",
      ],
      subsections: [
        {
          title: "Uso pessoal quotidiano",
          paragraphs: [
            "Quer menos tracking, menos desastres por reutilização de palavras-passe e segredos que não fiquem no chat. Não está a tentar desaparecer de estados-nação. Foque-se num gestor de palavras-passe, defaults sensatos do browser, messaging encriptada para chats sensíveis e links efémeros para credenciais pontuais.",
          ],
        },
        {
          title: "Freelancer ou consultor",
          paragraphs: [
            "Entrega segredos a clientes que não partilham as suas apps. Email e Slack tornam-se arquivos permanentes de chaves API e palavras-passe temporárias. Adicione notas encriptadas de uso único e transferência de ficheiros encriptada; guarde credenciais de longa duração num vault, não em threads.",
          ],
        },
        {
          title: "Equipa pequena",
          paragraphs: [
            "Precisa de acesso partilhado que possa ser revogado, regras claras para contratados e menos dependência de «manda só no canal». Prefira a partilha do gestor de palavras-passe para acesso contínuo, links de uso único para entregas temporárias e normas escritas para que a conveniência não se torne silenciosamente política.",
          ],
        },
      ],
      calloutTitle: "Regra prática",
      callout:
        "Se uma ferramenta não corresponde a um trabalho que faz realmente todas as semanas, salte-a. Um stack mínimo que usa vence um stack purista que abandona.",
    },
    {
      title: "Trabalhos de privacidade, não categorias de produto",
      paragraphs: [
        "Categorias (VPN, browser, messenger) incentivam a colecionar logos. Trabalhos forçam os trade-offs à luz. Use este mapa para se orientar; as secções abaixo aprofundam.",
      ],
      comparisonTable: {
        headers: ["Trabalho", "Abordagem por omissão", "Ferramenta errada para o trabalho"],
        rows: [
          [
            "Guardar palavras-passe de longa duração",
            "Gestor de palavras-passe + gerador forte",
            "Só palavras-passe do browser, ou arquivos de chat",
          ],
          [
            "Entregar um segredo de uso único",
            "Nota encriptada no browser e com expiração",
            "Email, Slack, SMS ou uma pasta na cloud «por agora»",
          ],
          [
            "Chat privado do dia a dia",
            "Messenger com encriptação ponta a ponta",
            "SMS, ou mensagens «que desaparecem» em apps que mesmo assim arquivam metadados para sempre",
          ],
          [
            "Reduzir trackers de navegação",
            "Browser mainstream endurecido + bloqueador",
            "Instalar cinco extensões de privacidade conflitantes",
          ],
          [
            "Redes não fiáveis",
            "VPN no-logs com reputação comprovada",
            "Assumir que um VPN o torna anónimo",
          ],
          [
            "Higiene contra tomada de conta",
            "Verificação de breaches + 2FA / passkeys",
            "Reutilizar palavras-passe e esperar",
          ],
        ],
        after: [
          "Para nomes de produto, notas de preços e exclusões, mantenha o [diretório de ferramentas de privacidade](app:privacy-tools) aberto ao lado deste guia.",
        ],
      },
    },
    {
      title: "Trabalho: palavras-passe de longa duração",
      paragraphs: [
        "Palavras-passe que vai reutilizar durante meses pertencem a um vault—não à sua cabeça, não a uma app de notas e não ao thread do Teams de ontem.",
      ],
      subsections: [
        {
          title: "O problema",
          paragraphs: [
            "A reutilização transforma um breach em muitos. Palavras-passe fracas e memoráveis falham no cracking offline. Os stores do browser ajudam, mas raramente igualam gestores dedicados em sync, partilha e auditabilidade.",
          ],
        },
        {
          title: "Default + alternativa",
          paragraphs: [
            "**Default:** [Bitwarden](https://bitwarden.com/) para a maioria—open source, free tier utilizável, sync sólido. **Alternativa:** [KeePassXC](https://keepassxc.org/) se quiser um vault local sem cloud. **Quando o acabamento importa mais do que open source:** [1Password](https://1password.com/) é uma escolha justa; saiba que está a escolher conveniência proprietária.",
          ],
        },
        {
          title: "Quando não usar só um gestor",
          paragraphs: [
            "Gestores excel em *armazenamento* e acesso partilhado contínuo. São desajeitados quando o destinatário não tem conta, ou quando o segredo deve morrer após uma leitura. Isso é outro trabalho—veja segredos de uso único abaixo. Gere valores fortes com um [gerador de palavras-passe](app:password-generator) local antes de os guardar ou partilhar.",
          ],
        },
      ],
    },
    {
      title: "Trabalho: segredos de uso único",
      paragraphs: [
        "Palavras-passe para contratados, códigos de recuperação, chaves API, Wi‑Fi para um visitante—tudo o que não deve tornar-se histórico pesquisável.",
      ],
      subsections: [
        {
          title: "O problema",
          paragraphs: [
            "Email e chat encriptam em trânsito e depois arquivam para sempre. Pastas na cloud ficam. Screenshots e backups de dispositivos alargam o raio. O failure mode não é «alguém snifa o fio»—é «o segredo ainda está lá daqui a seis meses».",
          ],
        },
        {
          title: "Default",
          paragraphs: [
            "**Default:** uma nota encriptada no browser e com expiração como [PrivateNote.ai](app:home)—ciphertext no servidor, material de desencriptação no fragmento do link, burn-after-reading ou TTL curto. Sobre o modelo, veja [como o PrivateNote funciona](app:how-it-works) e [porque o email é o pior sítio para segredos](blog:why-email-is-worst-for-secrets).",
          ],
        },
        {
          title: "Quando não usar",
          paragraphs: [
            "Não substitua o gestor de palavras-passe nem o messenger diário por notas de uso único. Não coloque documentos de longa duração ou conversas contínuas em links efémeros. E não envie o link e uma passphrase opcional no mesmo canal se o segredo for de alto risco—separe os canais.",
          ],
        },
      ],
      midCta: {
        body: "Precisa de entregar uma palavra-passe ou chave API agora? Encripte-a no browser e envie um link que pode expirar após a leitura.",
        button: "Criar uma nota privada",
        href: "app:home",
      },
    },
    {
      title: "Trabalho: messaging do dia a dia",
      paragraphs: [
        "Conversas sensíveis precisam de encriptação ponta a ponta por omissão—não um toggle enterrado nas definições, nem a promessa de que mensagens «que desaparecem» apagam cópias no servidor que não pode verificar.",
      ],
      subsections: [
        {
          title: "Default + trade-off",
          paragraphs: [
            "**Default:** [Signal](https://signal.org/) para chat seguro mainstream. **Trade-off a nomear em voz alta:** o registo exige um número de telefone, que alguns modelos de ameaça de alta anonimidade rejeitam. Para esses casos, olhe além deste guia inicial—e trate sempre os metadados (quem fala com quem) como risco residual em qualquer messenger.",
          ],
        },
        {
          title: "Quando não usar o chat para segredos",
          paragraphs: [
            "Mesmo messengers encriptados mantêm histórico nos dispositivos. Cole uma palavra-passe de produção num thread e criou uma cópia duradoura. Use o chat para conversa; use notas de uso único para credenciais. Mais sobre esse padrão: [segredos que nunca deve enviar no chat](blog:secrets-never-send-in-chat).",
          ],
        },
      ],
    },
    {
      title: "Trabalho: email e separação de identidade",
      paragraphs: [
        "O email é um sistema de endereçamento público com esperanças privadas. Trate a encriptação da caixa e o aliasing como contenção de danos, não como invisibilidade mágica.",
      ],
      subsections: [
        {
          title: "Defaults",
          paragraphs: [
            "**Default de caixa encriptada:** [Proton Mail](https://proton.me/) ou [Tuta](https://tuta.com/) quando quer mail zero-access para correspondência sensível. **Default de aliasing:** [Firefox Relay](https://relay.firefox.com/) para mascaramento leve, ou [SimpleLogin](https://simplelogin.io/) quando precisa de domínios personalizados e separação de identidade mais nítida.",
          ],
        },
        {
          title: "Quando não confiar no email",
          paragraphs: [
            "Email encriptado ainda deixa cabeçalhos, hábitos de reencaminhamento e retenção longa. Nunca coloque credenciais ativas no corpo «só desta vez». Se a carga for uma entrega de segredo, use uma nota de uso único e ponha só contexto no email.",
          ],
        },
      ],
    },
    {
      title: "Trabalho: navegar com menos tracking",
      paragraphs: [
        "Em 2026, a luta é menos sobre «modo secreto» e mais sobre fingerprinting, tracking entre sites e extensões que prometem privacidade enquanto adicionam superfície de ataque.",
      ],
      subsections: [
        {
          title: "Stack por omissão",
          paragraphs: [
            "**Default:** [Firefox](https://www.mozilla.org/) com proteção rigorosa contra tracking mais [uBlock Origin](https://ublockorigin.com/). **Alternativa com forma Chromium:** [Brave](https://brave.com/) se precisar de compatibilidade de extensões—saiba que a comunidade está dividida quanto à sua superfície de rewards/crypto. **Pesquisa:** [DuckDuckGo](https://duckduckgo.com/) (ou pesquisa similar não perfiladora) para que as suas queries não sejam um feed de perfil publicitário.",
          ],
        },
        {
          title: "Quando o Tor é o upgrade certo",
          paragraphs: [
            "O [Tor Browser](https://www.torproject.org/) é o padrão para anonimato mais forte e resistência à censura. Também é mais lento e pesado em CAPTCHA. Use-o quando o modelo de ameaça o exigir—não como browser bancário diário.",
          ],
        },
      ],
    },
    {
      title: "Trabalho: redes não fiáveis (reality check de VPN)",
      paragraphs: [
        "Um VPN encripta o caminho entre si e o fornecedor VPN. Esconde o seu IP dos sites que visita. **Não** o torna anónimo, não encripta os logs do destino e não corrige uma palavra-passe fraca.",
      ],
      subsections: [
        {
          title: "Defaults que estamos dispostos a nomear",
          paragraphs: [
            "Prefira fornecedores com track record público, história de jurisdição clara e claims no-logs auditados—comummente [Mullvad](https://mullvad.net/), [Proton VPN](https://protonvpn.com/) ou [IVPN](https://www.ivpn.net/). Pague pelo produto; modelos de negócio de VPN grátis muitas vezes são o produto.",
          ],
        },
        {
          title: "Quando não se incomodar",
          paragraphs: [
            "Numa rede em que já confia, com HTTPS em todo o lado, um VPN é higiene opcional—não um dever moral. Evite marcas dúbias «military-grade» e tudo o que lidera com códigos de influencers em vez de detalhe de engenharia. As notas de exclusão do nosso diretório cobrem picks «privacy-washed» comuns.",
          ],
        },
      ],
    },
    {
      title: "Trabalho: breaches, 2FA e passkeys",
      paragraphs: [
        "A higiene de contas é a metade pouco glamourosa da privacidade. A maioria dos desastres pessoais é credential stuffing e falhas próximas de SIM-swap, não malware exótico.",
      ],
      subsections: [
        {
          title: "Defaults práticos",
          paragraphs: [
            "Verifique endereços em [Have I Been Pwned](https://haveibeenpwned.com/). Ative fatores resistentes a phishing onde puder—passkeys ou chaves de hardware como [YubiKey](https://www.yubico.com/) vencem OTP por SMS. Use o [2FA Directory](https://2fa.directory/) para ver quais serviços ainda tratam o segundo fator como teatro opcional.",
          ],
        },
        {
          title: "Nota 2026 sobre passwordless",
          paragraphs: [
            "Passkeys reduzem phishing e reutilização de palavras-passe, mas recuperação e lock-in cross-ecossistema são reais. Mantenha uma história de recuperação (chave de hardware, processo documentado) antes de apagar cada palavra-passe. Gestores de palavras-passe continuam úteis para a longa cauda de sites que ainda não apanharam o ritmo.",
          ],
        },
      ],
    },
    {
      title: "O que mudou em 2026 (comentário que vale guardar)",
      bullets: [
        "**O chat de IA é um novo arquivo.** Colar segredos em assistentes cria perguntas de retenção e risco de treino que o seu modelo de ameaça de 2019 nunca incluiu. Trate prompts como corpos de email.",
        "**O fingerprinting ultrapassou os banners de cookies.** Bloquear cookies de terceiros ajuda; escolha do browser, bloqueio de trackers e menos extensões ainda importam mais do que aceitar cada toggle de «interesse legítimo».",
        "**Passkeys estão a tornar-se mainstream.** Prefira-as em contas de alto valor; não finja que todos os sites já as suportam.",
        "**O marketing de VPN ficou mais alto, não mais sábio.** Teatro de jurisdição e leaderboards de afiliados não são auditorias. Escolha fornecedores aborrecidos e documentados—ou nenhum.",
        "**A partilha efémera ainda é nicho—e ainda necessária.** Apps de colaboração otimizadas para pesquisa tornam ferramentas de segredos de uso único mais valiosas, não menos.",
      ],
    },
    {
      title: "Kit inicial mínimo (a maioria das pessoas)",
      paragraphs: [
        "Se só fizer sete coisas, faça estas. Tudo o resto é profundidade opcional.",
      ],
      useCaseTable: {
        headers: ["Slot", "Escolha"],
        rows: [
          ["Vault de palavras-passe", "Bitwarden (ou KeePassXC se recusar a cloud)"],
          ["Criação de palavras-passe", "Gerador local—depois guardar no vault"],
          ["Segredos de uso único", "PrivateNote.ai (ou nota equivalente encriptada no browser)"],
          ["Chat privado", "Signal"],
          ["Browser + bloqueador", "Firefox + uBlock Origin"],
          ["Higiene de breaches / 2FA", "Have I Been Pwned + passkeys ou 2FA de app/hardware"],
          ["Viagens / Wi‑Fi de café", "Mullvad, Proton VPN ou IVPN—quando a rede é o risco"],
        ],
      },
      callout:
        "Add-ons avançados (Tor no dia a dia, ritualismo de disco completo, teias de email anónimo) são válidos—mas só depois de o kit inicial se tornar hábito.",
    },
    {
      title: "O que excluímos—e porquê",
      paragraphs: [
        "Curar é sobretudo dizer não. Alguns padrões que nos recusamos a suavizar:",
      ],
      subsections: [
        {
          title: "VPNs de teatro de privacidade",
          paragraphs: [
            "Free tiers financiados por práticas de dados vagas, badges falsos de «auditoria» e SEO de leaderboards. Se o pitch é medo mais um código de desconto, afaste-se.",
          ],
        },
        {
          title: "Messengers que comercializam encriptação de forma seletiva",
          paragraphs: [
            "Cloud por omissão, E2EE opcional ou modos de «chat secreto» que treinam utilizadores a colar segredos no default inseguro. Preferimos recomendar um default honesto a cinco modos que as pessoas usam mal. Clouds estilo Telegram e as realidades de metadados/backup do WhatsApp estão assinaladas nas nossas [exclusões do diretório](app:privacy-tools).",
          ],
        },
        {
          title: "Qualquer coisa que precise de comprar a nossa recomendação",
          paragraphs: [
            "Este guia e o diretório não são uma lista de afiliados. Não ganhamos nada se clicar. Isso não nos torna omniscientes—significa que os incentivos não estão a dirigir silenciosamente a shortlist.",
          ],
        },
      ],
    },
    {
      title: "Para onde ir a seguir",
      paragraphs: [
        "Use este artigo como camada de decisão. Use o diretório como catálogo vivo—categorias, nuances e links que mantemos revistos.",
      ],
      bullets: [
        "[Diretório de ferramentas de privacidade](app:privacy-tools) — catálogo curado por categoria",
        "[Como partilhar uma palavra-passe de forma segura](blog:how-to-share-a-password-securely) — playbook de entrega",
        "[Enviar um segredo sem conta](blog:send-secret-message-without-account) — sem app partilhada necessária",
        "[Recursos de segurança](app:security-resources) — leitura mais ampla no PrivateNote.ai",
        "[EFF privacy issues](https://www.eff.org/issues/privacy) — contexto de política e direitos",
        "[Privacy Guides](https://www.privacyguides.org/) — recomendações mais profundas mantidas pela comunidade",
      ],
      midCta: {
        body: "Pronto para explorar a shortlist completa com notas de categoria e exclusões?",
        button: "Abrir o diretório de ferramentas de privacidade",
        href: "app:privacy-tools",
      },
    },
    {
      title: "Perguntas frequentes",
      faqs: [
        {
          question: "Isto é o mesmo que o vosso diretório de ferramentas de privacidade?",
          answer:
            "Não. Este post é o guia 2026 de como escolher. O [diretório](app:privacy-tools) é o catálogo curado. Leia o guia para decidir; use o diretório para escolher ferramentas concretas.",
        },
        {
          question: "Posso perseguir o ranking de cada categoria de privacidade?",
          answer:
            "Pode, mas não vai aguentar. Um kit inicial de sete slots que realmente usa vence um santuário de trinta ferramentas que configura uma vez.",
        },
        {
          question: "Onde encaixa o PrivateNote.ai?",
          answer:
            "Só no trabalho de segredos de uso único—credenciais e instruções que devem expirar. Não é um gestor de palavras-passe, messenger ou VPN.",
        },
        {
          question: "Preciso de um VPN todos os dias?",
          answer:
            "Normalmente não. Use um em redes não fiáveis ou quando precisar especificamente de esconder o seu IP de um destino. Não substitui HTTPS, boas palavras-passe nem messengers encriptados.",
        },
        {
          question: "Open source ou proprietário polido?",
          answer:
            "Prefira open source quando o risco é alto e pode viver com a UX. Ferramentas proprietárias podem ser racionais quando a usabilidade determina se a sua família adota um vault—nomeie o trade-off explicitamente, como fazemos com o 1Password.",
        },
      ],
    },
  ],
  ctaTitle: "Construa o stack e depois partilhe segredos corretamente",
  ctaBody:
    "Quando o trabalho é uma entrega temporária, salte o arquivo do chat. Crie uma nota encriptada no browser, envie o link e deixe-o expirar quando o momento passar.",
  ctaButton: "Criar uma nota privada",
  ctaSecondaryLabel: "Explorar o diretório de ferramentas de privacidade",
  ctaSecondaryHref: "app:privacy-tools",
};
