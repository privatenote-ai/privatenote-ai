import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";

type ArticleSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  afterBullets?: string[];
};

type ArticleCopy = {
  intro: string[];
  sections: ArticleSection[];
};

const copy: Record<SupportedLanguage, ArticleCopy> = {
  en: {
    intro: [
      "The AI industry has spent the last few years obsessing over prompt injection—worrying that a malicious prompt might trick a chatbot into producing an unintended response.",
      "But prompt injection is no longer the whole story.",
      "Today's AI systems are rapidly evolving from passive assistants into autonomous agents. They don't just answer questions anymore. They access files, parse emails, invoke APIs, execute multi-step workflows, and make operational decisions on behalf of users.",
      "And the moment an AI system gains the ability to act, the security playbook changes completely.",
      "A recent USENIX Security 2026 paper, SoK: Attack and Defense Landscape of Agentic AI Systems by Kim et al., provides one of the most comprehensive analyses of agent security to date. The researchers reviewed 128 academic papers, identified 51 attack techniques and 60 defense strategies, and proposed a framework for understanding the emerging security challenges of autonomous AI systems.",
      "Their central conclusion is straightforward:",
      "The more autonomy an AI agent gains, the larger its attack surface becomes.",
      "For organizations building, deploying, or relying on AI-powered products, that should serve as a wake-up call.",
    ],
    sections: [
      {
        title: "Why Agent Security Is Different",
        paragraphs: [
          "Traditional software follows predefined logic.",
          "Traditional LLM applications primarily generate text.",
          "Agentic systems operate differently.",
          "They combine language models with external tools, memory systems, databases, APIs, and autonomous decision-making capabilities. An enterprise agent can read an incoming email, retrieve information from internal documentation, query a CRM, update a database, and send a response—all within a single workflow.",
          "That flexibility is what makes agents so powerful.",
          "It's also what makes them difficult to secure.",
          "The USENIX paper argues that focusing solely on model safety is insufficient. Security must be evaluated across the entire agent ecosystem: the model, its memory, its tools, its data sources, and the actions it can perform.",
        ],
      },
      {
        title: "The Seven Dimensions of Agent Risk",
        paragraphs: [
          "The researchers identify seven key dimensions that influence an agent's security posture:",
        ],
        bullets: [
          "Input Trust — Where does information originate?",
          "Data Access Sensitivity — What information can the agent access?",
          "Workflow Autonomy — Can it independently decide what to do next?",
          "Action Capability — Can it modify, delete, or transmit data?",
          "Memory Persistence — Does information persist across sessions?",
          "Tool Availability — What external systems can it invoke?",
          "User Interface Power — How much influence does it have over user decisions?",
        ],
        afterBullets: [
          "Consider the difference between a customer-support chatbot and an autonomous executive assistant.",
          "Every additional capability increases utility. But it also expands the attack surface and creates new opportunities for misuse, manipulation, or unintended behavior.",
          "Security becomes less about protecting a model and more about governing a complex system.",
        ],
      },
      {
        title: "Context Is the New Security Boundary",
        paragraphs: [
          "For decades, cybersecurity has focused on three principles: confidentiality, integrity, and availability. Those principles remain essential.",
          "But agentic AI introduces a new challenge: contextual security.",
          "An agent can have strong authentication, encrypted communications, and strict access controls, yet still fail catastrophically because it acts on malicious or manipulated information.",
          "Imagine an agent processing a seemingly harmless PDF uploaded by an external party. Hidden instructions inside the document tell the agent to ignore previous guidance, retrieve sensitive information, and transmit it elsewhere.",
          "The system was not compromised through stolen credentials.",
          "The infrastructure was not breached.",
          "The agent simply followed the wrong context.",
          "This distinction matters because many emerging AI attacks exploit information flow rather than software vulnerabilities.",
          "For agentic systems, context becomes a security boundary just as important as authentication, encryption, or network segmentation.",
        ],
      },
      {
        title: "Why Memory Creates New Risks",
        paragraphs: [
          "AI memory is often presented as a user experience feature. The argument is simple: better memory enables better personalization.",
          "But memory also creates persistence.",
          "And persistence creates risk.",
          "The USENIX paper highlights how attackers may attempt to poison long-term memory stores with malicious instructions or misleading information. Once written into memory, that content can influence future decisions long after the original interaction has ended.",
          "Unlike a temporary prompt injection attack, memory poisoning can persist across workflows, users, and time.",
          "The result is a fundamentally different security challenge.",
          "Memory is no longer just a convenience feature.",
          "Memory is infrastructure.",
          "And infrastructure requires governance.",
        ],
      },
      {
        title: "The Most Dangerous Agents Are the Ones With Permissions",
        paragraphs: [
          "The greatest risks in agentic AI do not necessarily come from the intelligence of the model.",
          "They come from the authority granted to it.",
          "A model that generates an incorrect paragraph is inconvenient.",
          "An agent with access to customer records, internal documents, financial systems, communication platforms, and automation tools can create real-world consequences.",
          "As organizations connect agents to increasingly powerful systems, the focus must shift from model capability to operational control.",
          "The critical question is no longer: “How smart is the model?”",
          "It is: “What is the model allowed to do?”",
        ],
      },
      {
        title: "Building Trustworthy Agent Systems",
        paragraphs: [
          "The paper's broader lesson is that agent security requires defense-in-depth.",
          "Organizations deploying AI agents should prioritize:",
        ],
        bullets: [
          "Strong separation between trusted and untrusted data sources",
          "Explicit permission boundaries around agent actions",
          "Governance controls for memory systems",
          "Human approval for high-risk operations",
          "Comprehensive auditing and observability",
          "Clear policies for tool access and external integrations",
        ],
        afterBullets: [
          "These principles mirror long-established cybersecurity practices because, increasingly, AI agents resemble employees more than software features.",
        ],
      },
      {
        title: "The Bigger Lesson",
        paragraphs: [
          "The industry frequently describes AI agents as digital employees.",
          "That analogy is becoming increasingly accurate.",
          "Employees receive training.",
          "Employees operate under policies.",
          "Employees have defined permissions.",
          "Employees are monitored.",
          "Employees can make mistakes.",
          "AI agents are no different.",
          "The only difference is that they can make mistakes at machine speed.",
          "The most successful AI products of the next decade will not simply have the most capable models.",
          "They will have the strongest trust architecture.",
          "At PrivateNote.ai, we believe protecting context is becoming just as important as protecting data itself. As AI systems gain access to more of our personal notes, business knowledge, and operational workflows, security must extend beyond storage and encryption to include the information agents consume, remember, and act upon.",
          "Intelligence attracts users.",
          "Trust keeps them.",
        ],
      },
    ],
  },
  de: {
    intro: [
      "Die KI-Branche hat die letzten Jahre Prompt Injection fixiert—mit der Sorge, ein bösartiger Prompt könnte einen Chatbot zu einer unbeabsichtigten Antwort verleiten.",
      "Aber Prompt Injection ist nicht mehr die ganze Geschichte.",
      "Heutige KI-Systeme entwickeln sich schnell von passiven Assistenten zu autonomen Agenten. Sie beantworten nicht mehr nur Fragen. Sie greifen auf Dateien zu, parsen E-Mails, rufen APIs auf, führen mehrstufige Workflows aus und treffen operative Entscheidungen im Namen der Nutzer.",
      "Sobald ein KI-System handeln kann, ändert sich das Sicherheitsregelwerk vollständig.",
      "Ein aktuelles USENIX-Security-2026-Paper, SoK: Attack and Defense Landscape of Agentic AI Systems von Kim et al., liefert eine der umfassendsten Analysen der Agentensicherheit bis heute. Die Forscher werteten 128 wissenschaftliche Arbeiten aus, identifizierten 51 Angriffstechniken und 60 Verteidigungsstrategien und schlugen einen Rahmen vor, um die aufkommenden Sicherheitsherausforderungen autonomer KI-Systeme zu verstehen.",
      "Ihre zentrale Schlussfolgerung ist einfach:",
      "Je mehr Autonomie ein KI-Agent erhält, desto größer wird seine Angriffsfläche.",
      "Für Organisationen, die KI-Produkte entwickeln, einsetzen oder darauf vertrauen, sollte das ein Weckruf sein.",
    ],
    sections: [
      {
        title: "Warum Agentensicherheit anders ist",
        paragraphs: [
          "Traditionelle Software folgt vordefinierter Logik.",
          "Traditionelle LLM-Anwendungen erzeugen vor allem Text.",
          "Agentische Systeme funktionieren anders.",
          "Sie verbinden Sprachmodelle mit externen Tools, Gedächtnissystemen, Datenbanken, APIs und autonomen Entscheidungsfähigkeiten. Ein Unternehmensagent kann eine eingehende E-Mail lesen, Informationen aus interner Dokumentation abrufen, ein CRM abfragen, eine Datenbank aktualisieren und eine Antwort senden—alles in einem einzigen Workflow.",
          "Diese Flexibilität macht Agenten so leistungsfähig.",
          "Sie macht sie auch schwer zu sichern.",
          "Das USENIX-Paper argumentiert, dass alleinige Modellsicherheit nicht ausreicht. Sicherheit muss im gesamten Agenten-Ökosystem bewertet werden: Modell, Gedächtnis, Tools, Datenquellen und ausführbare Aktionen.",
        ],
      },
      {
        title: "Die sieben Dimensionen des Agentenrisikos",
        paragraphs: [
          "Die Forscher identifizieren sieben zentrale Dimensionen, die die Sicherheitslage eines Agenten beeinflussen:",
        ],
        bullets: [
          "Input Trust — Woher stammen Informationen?",
          "Data Access Sensitivity — Auf welche Informationen kann der Agent zugreifen?",
          "Workflow Autonomy — Kann er selbstständig entscheiden, was als Nächstes zu tun ist?",
          "Action Capability — Kann er Daten ändern, löschen oder übertragen?",
          "Memory Persistence — Bleiben Informationen über Sitzungen hinweg erhalten?",
          "Tool Availability — Welche externen Systeme kann er aufrufen?",
          "User Interface Power — Wie viel Einfluss hat er auf Entscheidungen der Nutzer?",
        ],
        afterBullets: [
          "Vergleichen Sie einen Kundensupport-Chatbot mit einem autonomen Executive Assistant.",
          "Jede zusätzliche Fähigkeit steigert den Nutzen. Sie vergrößert aber auch die Angriffsfläche und schafft neue Möglichkeiten für Missbrauch, Manipulation oder unbeabsichtigtes Verhalten.",
          "Sicherheit wird weniger eine Frage des Modellschutzes und mehr eine Frage der Steuerung eines komplexen Systems.",
        ],
      },
      {
        title: "Kontext ist die neue Sicherheitsgrenze",
        paragraphs: [
          "Jahrzehntelang konzentrierte sich Cybersicherheit auf drei Prinzipien: Vertraulichkeit, Integrität und Verfügbarkeit. Diese Prinzipien bleiben unverzichtbar.",
          "Agentische KI führt jedoch eine neue Herausforderung ein: kontextuelle Sicherheit.",
          "Ein Agent kann starke Authentifizierung, verschlüsselte Kommunikation und strenge Zugriffskontrollen haben und dennoch katastrophal scheitern, weil er auf bösartige oder manipulierte Informationen reagiert.",
          "Stellen Sie sich vor, ein Agent verarbeitet ein scheinbar harmloses PDF, das eine externe Partei hochgeladen hat. Versteckte Anweisungen im Dokument sagen dem Agenten, frühere Vorgaben zu ignorieren, sensible Informationen abzurufen und woanders zu übermitteln.",
          "Das System wurde nicht durch gestohlene Zugangsdaten kompromittiert.",
          "Die Infrastruktur wurde nicht durchbrochen.",
          "Der Agent folgte einfach dem falschen Kontext.",
          "Diese Unterscheidung ist wichtig, weil viele neue KI-Angriffe Informationsfluss statt Software-Schwachstellen ausnutzen.",
          "Bei agentischen Systemen wird Kontext zu einer Sicherheitsgrenze, die genauso wichtig ist wie Authentifizierung, Verschlüsselung oder Netzwerksegmentierung.",
        ],
      },
      {
        title: "Warum Gedächtnis neue Risiken schafft",
        paragraphs: [
          "KI-Gedächtnis wird oft als UX-Feature präsentiert. Das Argument ist einfach: besseres Gedächtnis ermöglicht bessere Personalisierung.",
          "Aber Gedächtnis schafft auch Persistenz.",
          "Und Persistenz schafft Risiko.",
          "Das USENIX-Paper zeigt, wie Angreifer langfristige Gedächtnisspeicher mit bösartigen Anweisungen oder irreführenden Informationen vergiften können. Einmal im Gedächtnis gespeichert, kann dieser Inhalt künftige Entscheidungen beeinflussen—lange nach dem ursprünglichen Kontakt.",
          "Anders als ein temporärer Prompt-Injection-Angriff kann Memory Poisoning über Workflows, Nutzer und Zeit hinweg bestehen bleiben.",
          "Das Ergebnis ist eine grundlegend andere Sicherheitsherausforderung.",
          "Gedächtnis ist nicht mehr nur ein Komfortfeature.",
          "Gedächtnis ist Infrastruktur.",
          "Und Infrastruktur braucht Governance.",
        ],
      },
      {
        title: "Die gefährlichsten Agenten sind die mit Berechtigungen",
        paragraphs: [
          "Die größten Risiken agentischer KI kommen nicht unbedingt von der Intelligenz des Modells.",
          "Sie kommen von der ihm gewährten Autorität.",
          "Ein Modell, das einen falschen Absatz erzeugt, ist unbequem.",
          "Ein Agent mit Zugriff auf Kundendaten, interne Dokumente, Finanzsysteme, Kommunikationsplattformen und Automatisierungstools kann reale Folgen haben.",
          "Wenn Organisationen Agenten an immer mächtigere Systeme anbinden, muss der Fokus von Modellfähigkeit zu operativer Kontrolle wechseln.",
          "Die entscheidende Frage lautet nicht mehr: „Wie intelligent ist das Modell?“",
          "Sondern: „Was darf das Modell tun?“",
        ],
      },
      {
        title: "Vertrauenswürdige Agentensysteme aufbauen",
        paragraphs: [
          "Die übergeordnete Lehre des Papers: Agentensicherheit braucht Defense-in-Depth.",
          "Organisationen, die KI-Agenten einsetzen, sollten priorisieren:",
        ],
        bullets: [
          "Starke Trennung zwischen vertrauenswürdigen und nicht vertrauenswürdigen Datenquellen",
          "Explizite Berechtigungsgrenzen für Agentenaktionen",
          "Governance-Kontrollen für Gedächtnissysteme",
          "Menschliche Freigabe für risikoreiche Operationen",
          "Umfassende Auditierung und Beobachtbarkeit",
          "Klare Richtlinien für Tool-Zugriff und externe Integrationen",
        ],
        afterBullets: [
          "Diese Prinzipien spiegeln etablierte Cybersicherheitspraxis wider, weil KI-Agenten zunehmend eher Mitarbeitern als Softwarefeatures gleichen.",
        ],
      },
      {
        title: "Die größere Lehre",
        paragraphs: [
          "Die Branche beschreibt KI-Agenten oft als digitale Mitarbeiter.",
          "Diese Analogie wird immer zutreffender.",
          "Mitarbeiter erhalten Schulungen.",
          "Mitarbeiter arbeiten nach Richtlinien.",
          "Mitarbeiter haben definierte Berechtigungen.",
          "Mitarbeiter werden überwacht.",
          "Mitarbeiter können Fehler machen.",
          "KI-Agenten sind nicht anders.",
          "Der einzige Unterschied: Sie machen Fehler mit Maschinengeschwindigkeit.",
          "Die erfolgreichsten KI-Produkte des nächsten Jahrzehnts werden nicht einfach die fähigsten Modelle haben.",
          "Sie werden die stärkste Vertrauensarchitektur haben.",
          "Bei PrivateNote.ai glauben wir, dass der Schutz von Kontext genauso wichtig wird wie der Schutz von Daten selbst. Wenn KI-Systeme Zugang zu persönlichen Notizen, Unternehmenswissen und operativen Workflows erhalten, muss Sicherheit über Speicherung und Verschlüsselung hinausgehen—einschließlich der Informationen, die Agenten konsumieren, speichern und auf die sie reagieren.",
          "Intelligenz zieht Nutzer an.",
          "Vertrauen hält sie.",
        ],
      },
    ],
  },
  fr: {
    intro: [
      "L'industrie de l'IA a passé les dernières années à obséder sur l'injection de prompt—craignant qu'un prompt malveillant ne pousse un chatbot à produire une réponse involontaire.",
      "Mais l'injection de prompt n'est plus toute l'histoire.",
      "Les systèmes d'IA d'aujourd'hui évoluent rapidement d'assistants passifs en agents autonomes. Ils ne se contentent plus de répondre aux questions. Ils accèdent aux fichiers, analysent les e-mails, invoquent des API, exécutent des workflows en plusieurs étapes et prennent des décisions opérationnelles pour le compte des utilisateurs.",
      "Dès qu'un système d'IA acquiert la capacité d'agir, le manuel de sécurité change complètement.",
      "Un récent article USENIX Security 2026, SoK: Attack and Defense Landscape of Agentic AI Systems par Kim et al., propose l'une des analyses les plus complètes de la sécurité des agents à ce jour. Les chercheurs ont examiné 128 articles académiques, identifié 51 techniques d'attaque et 60 stratégies de défense, et proposé un cadre pour comprendre les défis de sécurité émergents des systèmes d'IA autonomes.",
      "Leur conclusion centrale est simple :",
      "Plus un agent IA gagne en autonomie, plus sa surface d'attaque s'agrandit.",
      "Pour les organisations qui conçoivent, déploient ou s'appuient sur des produits alimentés par l'IA, cela devrait servir d'appel au réveil.",
    ],
    sections: [
      {
        title: "Pourquoi la sécurité des agents est différente",
        paragraphs: [
          "Les logiciels traditionnels suivent une logique prédéfinie.",
          "Les applications LLM traditionnelles produisent surtout du texte.",
          "Les systèmes agentiques fonctionnent autrement.",
          "Ils combinent des modèles de langage avec des outils externes, des systèmes de mémoire, des bases de données, des API et des capacités de décision autonomes. Un agent d'entreprise peut lire un e-mail entrant, récupérer des informations dans la documentation interne, interroger un CRM, mettre à jour une base de données et envoyer une réponse—le tout dans un seul workflow.",
          "Cette flexibilité rend les agents si puissants.",
          "C'est aussi ce qui les rend difficiles à sécuriser.",
          "L'article USENIX affirme que se concentrer uniquement sur la sécurité du modèle est insuffisant. La sécurité doit être évaluée sur l'ensemble de l'écosystème de l'agent : le modèle, sa mémoire, ses outils, ses sources de données et les actions qu'il peut effectuer.",
        ],
      },
      {
        title: "Les sept dimensions du risque agentique",
        paragraphs: [
          "Les chercheurs identifient sept dimensions clés qui influencent la posture de sécurité d'un agent :",
        ],
        bullets: [
          "Input Trust — D'où provient l'information ?",
          "Data Access Sensitivity — À quelles informations l'agent peut-il accéder ?",
          "Workflow Autonomy — Peut-il décider seul de la prochaine action ?",
          "Action Capability — Peut-il modifier, supprimer ou transmettre des données ?",
          "Memory Persistence — L'information persiste-t-elle entre les sessions ?",
          "Tool Availability — Quels systèmes externes peut-il invoquer ?",
          "User Interface Power — Quelle influence a-t-il sur les décisions des utilisateurs ?",
        ],
        afterBullets: [
          "Comparez un chatbot de support client et un assistant exécutif autonome.",
          "Chaque capacité supplémentaire augmente l'utilité. Mais elle élargit aussi la surface d'attaque et crée de nouvelles opportunités d'abus, de manipulation ou de comportement involontaire.",
          "La sécurité devient moins une question de protection du modèle et plus une question de gouvernance d'un système complexe.",
        ],
      },
      {
        title: "Le contexte devient la nouvelle frontière de sécurité",
        paragraphs: [
          "Pendant des décennies, la cybersécurité s'est concentrée sur trois principes : confidentialité, intégrité et disponibilité. Ces principes restent essentiels.",
          "Mais l'IA agentique introduit un nouveau défi : la sécurité contextuelle.",
          "Un agent peut disposer d'une authentification forte, de communications chiffrées et de contrôles d'accès stricts, et échouer pourtant de façon catastrophique parce qu'il agit sur des informations malveillantes ou manipulées.",
          "Imaginez un agent traitant un PDF apparemment inoffensif téléversé par un tiers. Des instructions cachées dans le document disent à l'agent d'ignorer les consignes précédentes, de récupérer des informations sensibles et de les transmettre ailleurs.",
          "Le système n'a pas été compromis par des identifiants volés.",
          "L'infrastructure n'a pas été violée.",
          "L'agent a simplement suivi le mauvais contexte.",
          "Cette distinction compte, car de nombreuses attaques IA émergentes exploitent les flux d'information plutôt que les vulnérabilités logicielles.",
          "Pour les systèmes agentiques, le contexte devient une frontière de sécurité aussi importante que l'authentification, le chiffrement ou la segmentation réseau.",
        ],
      },
      {
        title: "Pourquoi la mémoire crée de nouveaux risques",
        paragraphs: [
          "La mémoire IA est souvent présentée comme une fonctionnalité d'expérience utilisateur. L'argument est simple : une meilleure mémoire permet une meilleure personnalisation.",
          "Mais la mémoire crée aussi de la persistance.",
          "Et la persistance crée du risque.",
          "L'article USENIX met en lumière la façon dont des attaquants peuvent tenter d'empoisonner des mémoires à long terme avec des instructions malveillantes ou des informations trompeuses. Une fois écrit dans la mémoire, ce contenu peut influencer des décisions futures longtemps après la fin de l'interaction d'origine.",
          "Contrairement à une attaque temporaire par injection de prompt, l'empoisonnement de la mémoire peut persister à travers les workflows, les utilisateurs et le temps.",
          "Le résultat est un défi de sécurité fondamentalement différent.",
          "La mémoire n'est plus seulement une fonctionnalité de confort.",
          "La mémoire est une infrastructure.",
          "Et l'infrastructure exige une gouvernance.",
        ],
      },
      {
        title: "Les agents les plus dangereux sont ceux qui ont des permissions",
        paragraphs: [
          "Les plus grands risques de l'IA agentique ne viennent pas nécessairement de l'intelligence du modèle.",
          "Ils viennent de l'autorité qui lui est accordée.",
          "Un modèle qui génère un paragraphe incorrect est gênant.",
          "Un agent avec accès aux dossiers clients, aux documents internes, aux systèmes financiers, aux plateformes de communication et aux outils d'automatisation peut avoir des conséquences réelles.",
          "À mesure que les organisations connectent des agents à des systèmes de plus en plus puissants, l'attention doit passer de la capacité du modèle au contrôle opérationnel.",
          "La question critique n'est plus : « Quelle est l'intelligence du modèle ? »",
          "C'est : « Que le modèle est-il autorisé à faire ? »",
        ],
      },
      {
        title: "Construire des systèmes d'agents dignes de confiance",
        paragraphs: [
          "La leçon plus large de l'article est que la sécurité des agents exige une défense en profondeur.",
          "Les organisations qui déploient des agents IA devraient prioriser :",
        ],
        bullets: [
          "Une séparation forte entre sources de données de confiance et non fiables",
          "Des limites de permission explicites autour des actions des agents",
          "Des contrôles de gouvernance pour les systèmes de mémoire",
          "L'approbation humaine pour les opérations à haut risque",
          "Un audit et une observabilité complets",
          "Des politiques claires pour l'accès aux outils et les intégrations externes",
        ],
        afterBullets: [
          "Ces principes reprennent des pratiques de cybersécurité bien établies, car les agents IA ressemblent de plus en plus à des employés plutôt qu'à des fonctionnalités logicielles.",
        ],
      },
      {
        title: "La leçon la plus large",
        paragraphs: [
          "L'industrie décrit souvent les agents IA comme des employés numériques.",
          "Cette analogie devient de plus en plus juste.",
          "Les employés reçoivent une formation.",
          "Les employés opèrent selon des politiques.",
          "Les employés ont des permissions définies.",
          "Les employés sont surveillés.",
          "Les employés peuvent faire des erreurs.",
          "Les agents IA ne font pas exception.",
          "La seule différence : ils peuvent faire des erreurs à la vitesse de la machine.",
          "Les produits IA les plus réussis de la prochaine décennie n'auront pas seulement les modèles les plus capables.",
          "Ils auront l'architecture de confiance la plus solide.",
          "Chez PrivateNote.ai, nous croyons que protéger le contexte devient aussi important que protéger les données elles-mêmes. À mesure que les systèmes d'IA accèdent à nos notes personnelles, aux connaissances métier et aux workflows opérationnels, la sécurité doit dépasser le stockage et le chiffrement pour inclure les informations que les agents consomment, mémorisent et sur lesquelles ils agissent.",
          "L'intelligence attire les utilisateurs.",
          "La confiance les retient.",
        ],
      },
    ],
  },
  es: {
    intro: [
      "La industria de la IA ha pasado los últimos años obsesionada con la inyección de prompts—preocupada de que un prompt malicioso engañe a un chatbot para producir una respuesta no deseada.",
      "Pero la inyección de prompts ya no es toda la historia.",
      "Los sistemas de IA actuales evolucionan rápidamente de asistentes pasivos a agentes autónomos. Ya no solo responden preguntas. Acceden a archivos, analizan correos, invocan API, ejecutan flujos de trabajo de varios pasos y toman decisiones operativas en nombre de los usuarios.",
      "En el momento en que un sistema de IA gana la capacidad de actuar, el manual de seguridad cambia por completo.",
      "Un reciente artículo de USENIX Security 2026, SoK: Attack and Defense Landscape of Agentic AI Systems de Kim et al., ofrece uno de los análisis más completos sobre la seguridad de agentes hasta la fecha. Los investigadores revisaron 128 artículos académicos, identificaron 51 técnicas de ataque y 60 estrategias de defensa, y propusieron un marco para entender los desafíos de seguridad emergentes de los sistemas de IA autónomos.",
      "Su conclusión central es directa:",
      "Cuanta más autonomía gana un agente de IA, mayor es su superficie de ataque.",
      "Para las organizaciones que crean, despliegan o dependen de productos impulsados por IA, esto debería ser una llamada de atención.",
    ],
    sections: [
      {
        title: "Por qué la seguridad de agentes es diferente",
        paragraphs: [
          "El software tradicional sigue una lógica predefinida.",
          "Las aplicaciones LLM tradicionales generan principalmente texto.",
          "Los sistemas agénticos funcionan de otra manera.",
          "Combinan modelos de lenguaje con herramientas externas, sistemas de memoria, bases de datos, API y capacidades de decisión autónoma. Un agente empresarial puede leer un correo entrante, recuperar información de documentación interna, consultar un CRM, actualizar una base de datos y enviar una respuesta—todo en un solo flujo de trabajo.",
          "Esa flexibilidad es lo que hace tan potentes a los agentes.",
          "También es lo que los hace difíciles de asegurar.",
          "El artículo de USENIX sostiene que centrarse solo en la seguridad del modelo es insuficiente. La seguridad debe evaluarse en todo el ecosistema del agente: el modelo, su memoria, sus herramientas, sus fuentes de datos y las acciones que puede realizar.",
        ],
      },
      {
        title: "Las siete dimensiones del riesgo agéntico",
        paragraphs: [
          "Los investigadores identifican siete dimensiones clave que influyen en la postura de seguridad de un agente:",
        ],
        bullets: [
          "Input Trust — ¿De dónde proviene la información?",
          "Data Access Sensitivity — ¿A qué información puede acceder el agente?",
          "Workflow Autonomy — ¿Puede decidir de forma independiente qué hacer a continuación?",
          "Action Capability — ¿Puede modificar, eliminar o transmitir datos?",
          "Memory Persistence — ¿Persiste la información entre sesiones?",
          "Tool Availability — ¿Qué sistemas externos puede invocar?",
          "User Interface Power — ¿Cuánta influencia tiene sobre las decisiones del usuario?",
        ],
        afterBullets: [
          "Compare un chatbot de atención al cliente con un asistente ejecutivo autónomo.",
          "Cada capacidad adicional aumenta la utilidad. Pero también expande la superficie de ataque y crea nuevas oportunidades de uso indebido, manipulación o comportamiento no intencionado.",
          "La seguridad pasa de ser proteger un modelo a gobernar un sistema complejo.",
        ],
      },
      {
        title: "El contexto es la nueva frontera de seguridad",
        paragraphs: [
          "Durante décadas, la ciberseguridad se ha centrado en tres principios: confidencialidad, integridad y disponibilidad. Esos principios siguen siendo esenciales.",
          "Pero la IA agéntica introduce un nuevo desafío: la seguridad contextual.",
          "Un agente puede tener autenticación sólida, comunicaciones cifradas y controles de acceso estrictos, y aun así fallar de forma catastrófica porque actúa sobre información maliciosa o manipulada.",
          "Imagine un agente procesando un PDF aparentemente inofensivo subido por un tercero. Instrucciones ocultas dentro del documento le dicen al agente que ignore las directrices anteriores, recupere información sensible y la transmita a otro lugar.",
          "El sistema no fue comprometido mediante credenciales robadas.",
          "La infraestructura no fue violada.",
          "El agente simplemente siguió el contexto equivocado.",
          "Esta distinción importa porque muchos ataques emergentes de IA explotan el flujo de información en lugar de vulnerabilidades de software.",
          "Para los sistemas agénticos, el contexto se convierte en una frontera de seguridad tan importante como la autenticación, el cifrado o la segmentación de red.",
        ],
      },
      {
        title: "Por qué la memoria crea nuevos riesgos",
        paragraphs: [
          "La memoria de IA suele presentarse como una función de experiencia de usuario. El argumento es simple: una mejor memoria permite una mejor personalización.",
          "Pero la memoria también crea persistencia.",
          "Y la persistencia crea riesgo.",
          "El artículo de USENIX destaca cómo los atacantes pueden intentar envenenar almacenes de memoria a largo plazo con instrucciones maliciosas o información engañosa. Una vez escrito en la memoria, ese contenido puede influir en decisiones futuras mucho después de que haya terminado la interacción original.",
          "A diferencia de un ataque temporal de inyección de prompts, el envenenamiento de memoria puede persistir entre flujos de trabajo, usuarios y tiempo.",
          "El resultado es un desafío de seguridad fundamentalmente diferente.",
          "La memoria ya no es solo una función de conveniencia.",
          "La memoria es infraestructura.",
          "Y la infraestructura requiere gobernanza.",
        ],
      },
      {
        title: "Los agentes más peligrosos son los que tienen permisos",
        paragraphs: [
          "Los mayores riesgos de la IA agéntica no provienen necesariamente de la inteligencia del modelo.",
          "Provienen de la autoridad que se le concede.",
          "Un modelo que genera un párrafo incorrecto es incómodo.",
          "Un agente con acceso a registros de clientes, documentos internos, sistemas financieros, plataformas de comunicación y herramientas de automatización puede crear consecuencias reales.",
          "A medida que las organizaciones conectan agentes a sistemas cada vez más potentes, el enfoque debe pasar de la capacidad del modelo al control operativo.",
          "La pregunta crítica ya no es: «¿Qué tan inteligente es el modelo?»",
          "Es: «¿Qué se le permite hacer al modelo?»",
        ],
      },
      {
        title: "Construir sistemas de agentes confiables",
        paragraphs: [
          "La lección más amplia del artículo es que la seguridad de agentes requiere defensa en profundidad.",
          "Las organizaciones que despliegan agentes de IA deberían priorizar:",
        ],
        bullets: [
          "Fuerte separación entre fuentes de datos confiables y no confiables",
          "Límites de permiso explícitos en torno a las acciones del agente",
          "Controles de gobernanza para sistemas de memoria",
          "Aprobación humana para operaciones de alto riesgo",
          "Auditoría y observabilidad completas",
          "Políticas claras para el acceso a herramientas e integraciones externas",
        ],
        afterBullets: [
          "Estos principios reflejan prácticas de ciberseguridad consolidadas, porque cada vez más los agentes de IA se parecen a empleados más que a funciones de software.",
        ],
      },
      {
        title: "La lección más amplia",
        paragraphs: [
          "La industria describe con frecuencia a los agentes de IA como empleados digitales.",
          "Esa analogía es cada vez más precisa.",
          "Los empleados reciben formación.",
          "Los empleados operan bajo políticas.",
          "Los empleados tienen permisos definidos.",
          "Los empleados son monitorizados.",
          "Los empleados pueden cometer errores.",
          "Los agentes de IA no son diferentes.",
          "La única diferencia es que pueden cometer errores a velocidad de máquina.",
          "Los productos de IA más exitosos de la próxima década no tendrán simplemente los modelos más capaces.",
          "Tendrán la arquitectura de confianza más sólida.",
          "En PrivateNote.ai, creemos que proteger el contexto se vuelve tan importante como proteger los datos en sí. A medida que los sistemas de IA acceden a más notas personales, conocimiento empresarial y flujos operativos, la seguridad debe ir más allá del almacenamiento y el cifrado para incluir la información que los agentes consumen, recuerdan y sobre la que actúan.",
          "La inteligencia atrae usuarios.",
          "La confianza los retiene.",
        ],
      },
    ],
  },
};

export const AgentSecurityPost: React.FC = () => {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);
  const article = copy[language];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <Link
        href={blogPath}
        className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> {t.blogBackToBlog}
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{t.blogAgentSecurityTitle}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t.blogAgentSecurityExcerpt}</p>
        </header>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          {article.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {article.sections.map((section) => (
            <React.Fragment key={section.title}>
              <hr className="border-gray-200 dark:border-gray-700" />
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc pl-5 space-y-2">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.afterBullets?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            </React.Fragment>
          ))}
        </div>
      </article>
    </div>
  );
};
