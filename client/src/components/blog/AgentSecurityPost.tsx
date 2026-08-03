import React from "react";
import { Link } from "wouter";
import { ArrowLeft, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { localizedPath } from "@/utils/localizedPath";
import type { SupportedLanguage } from "@/utils/translation";
import { BlogPostHeader } from "@/components/blog/BlogPostChrome";
import { BlogGuideArticle } from "@/components/blog/BlogGuideArticle";
import { BlogArticleTakeaways } from "@/components/blog/BlogArticleTakeaways";
import { BlogPostCrossLinks } from "@/components/blog/BlogPostCrossLinks";
import { getBlogArticleCopy } from "@/components/blog/blogArticleLocale";
import { agentSecurityHr } from "@/components/blog/locale/agentSecurity.hr";
import { agentSecurityNl } from "@/components/blog/locale/agentSecurity.nl";
import { agentSecurityPt } from "@/components/blog/locale/agentSecurity.pt";
import { agentSecuritySr } from "@/components/blog/locale/agentSecurity.sr";

type BulletItem = {
  label: string;
  body: string;
};

type ArticleSection = {
  title: string;
  paragraphs: string[];
  callout?: string;
  emphasisBlock?: string[];
  bullets?: BulletItem[];
  afterBullets?: string[];
};

type ArticleCopy = {
  intro: string[];
  introCallout?: string;
  sections: ArticleSection[];
  closingCallout?: {
    title: string;
    body: string;
  };
};


function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={index} className="font-semibold text-gray-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function ArticleParagraph({
  text,
  lead = false,
}: {
  text: string;
  lead?: boolean;
}) {
  return (
    <p
      className={
        lead
          ? "text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100"
          : "text-gray-700 dark:text-gray-300"
      }
    >
      <RichText text={text} />
    </p>
  );
}

function CalloutBox({ text }: { text: string }) {
  return (
    <blockquote className="border-l-2 border-gray-300 py-1 pl-5 dark:border-gray-600">
      <p className="text-[1.05rem] leading-relaxed text-gray-800 dark:text-gray-200">
        <RichText text={text} />
      </p>
    </blockquote>
  );
}

function EmphasisStack({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-1 border-l-2 border-gray-200 py-1 pl-5 dark:border-gray-700">
      {lines.map((line) => (
        <p key={line} className="font-medium leading-relaxed text-gray-800 dark:text-gray-200">
          <RichText text={line} />
        </p>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li className="flex gap-3" key={item.label}>
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
          <span className="text-gray-700 dark:text-gray-300">
            <strong className="font-semibold text-gray-900 dark:text-white">{item.label}</strong>
            {item.body ? <> — {item.body}</> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

const copy: Partial<Record<SupportedLanguage, ArticleCopy>> & { en: ArticleCopy } = {
  en: {
    intro: [
      "The AI industry has spent the last few years obsessing over **prompt injection**—worrying that a malicious prompt might trick a chatbot into producing an unintended response.",
      "But prompt injection is no longer the whole story.",
      "Today's AI systems are rapidly evolving from passive assistants into **autonomous agents**. They don't just answer questions anymore. They access files, parse emails, invoke APIs, execute multi-step workflows, and make operational decisions on behalf of users.",
      "And the moment an AI system gains the ability to **act**, the security playbook changes completely.",
      "A recent USENIX Security 2026 paper, **SoK: Attack and Defense Landscape of Agentic AI Systems** by Kim et al., provides one of the most comprehensive analyses of agent security to date. The researchers reviewed 128 academic papers, identified 51 attack techniques and 60 defense strategies, and proposed a framework for understanding the emerging security challenges of autonomous AI systems.",
      "Their central conclusion is straightforward:",
      "For organizations building, deploying, or relying on AI-powered products, that should serve as a wake-up call.",
    ],
    introCallout:
      "The more autonomy an AI agent gains, the larger its attack surface becomes.",
    sections: [
      {
        title: "Why Agent Security Is Different",
        paragraphs: [
          "Traditional software follows predefined logic. Traditional LLM applications primarily generate text. **Agentic systems operate differently.**",
          "They combine language models with external tools, memory systems, databases, APIs, and autonomous decision-making capabilities. An enterprise agent can read an incoming email, retrieve information from internal documentation, query a CRM, update a database, and send a response—all within a single workflow.",
          "That flexibility is what makes agents so powerful. It's also what makes them difficult to secure.",
          "The USENIX paper argues that focusing solely on model safety is insufficient. Security must be evaluated across the **entire agent ecosystem**: the model, its memory, its tools, its data sources, and the actions it can perform.",
        ],
      },
      {
        title: "The Seven Dimensions of Agent Risk",
        paragraphs: [
          "The researchers identify seven key dimensions that influence an agent's security posture:",
        ],
        bullets: [
          { label: "Input Trust", body: "Where does information originate?" },
          { label: "Data Access Sensitivity", body: "What information can the agent access?" },
          { label: "Workflow Autonomy", body: "Can it independently decide what to do next?" },
          { label: "Action Capability", body: "Can it modify, delete, or transmit data?" },
          { label: "Memory Persistence", body: "Does information persist across sessions?" },
          { label: "Tool Availability", body: "What external systems can it invoke?" },
          { label: "User Interface Power", body: "How much influence does it have over user decisions?" },
        ],
        afterBullets: [
          "Consider the difference between a customer-support chatbot and an autonomous executive assistant.",
          "Every additional capability increases utility. But it also expands the attack surface and creates new opportunities for misuse, manipulation, or unintended behavior.",
          "Security becomes less about protecting a model and more about **governing a complex system**.",
        ],
      },
      {
        title: "Context Is the New Security Boundary",
        paragraphs: [
          "For decades, cybersecurity has focused on three principles: confidentiality, integrity, and availability. Those principles remain essential.",
          "But agentic AI introduces a new challenge: **contextual security**.",
          "An agent can have strong authentication, encrypted communications, and strict access controls, yet still fail catastrophically because it acts on malicious or manipulated information.",
          "Imagine an agent processing a seemingly harmless PDF uploaded by an external party. Hidden instructions inside the document tell the agent to ignore previous guidance, retrieve sensitive information, and transmit it elsewhere.",
          "This distinction matters because many emerging AI attacks exploit information flow rather than software vulnerabilities.",
        ],
        emphasisBlock: [
          "The system was not compromised through stolen credentials.",
          "The infrastructure was not breached.",
          "The agent simply followed the wrong context.",
        ],
        callout:
          "For agentic systems, context becomes a security boundary just as important as authentication, encryption, or network segmentation.",
      },
      {
        title: "Why Memory Creates New Risks",
        paragraphs: [
          "AI memory is often presented as a user experience feature. The argument is simple: better memory enables better personalization.",
          "But memory also creates persistence. And persistence creates risk.",
          "The USENIX paper highlights how attackers may attempt to poison long-term memory stores with malicious instructions or misleading information. Once written into memory, that content can influence future decisions long after the original interaction has ended.",
          "Unlike a temporary prompt injection attack, memory poisoning can persist across workflows, users, and time. The result is a fundamentally different security challenge.",
        ],
        emphasisBlock: [
          "Memory is no longer just a convenience feature.",
          "Memory is infrastructure.",
          "And infrastructure requires governance.",
        ],
      },
      {
        title: "The Most Dangerous Agents Are the Ones With Permissions",
        paragraphs: [
          "The greatest risks in agentic AI do not necessarily come from the intelligence of the model. **They come from the authority granted to it.**",
          "A model that generates an incorrect paragraph is inconvenient. An agent with access to customer records, internal documents, financial systems, communication platforms, and automation tools can create real-world consequences.",
          "As organizations connect agents to increasingly powerful systems, the focus must shift from model capability to operational control.",
        ],
        callout: "The critical question is no longer “How smart is the model?” It is: “What is the model allowed to do?”",
      },
      {
        title: "Building Trustworthy Agent Systems",
        paragraphs: [
          "The paper's broader lesson is that agent security requires **defense-in-depth**.",
          "Organizations deploying AI agents should prioritize:",
        ],
        bullets: [
          { label: "Trusted vs. untrusted data", body: "Strong separation between trusted and untrusted data sources" },
          { label: "Permission boundaries", body: "Explicit limits around what agents can do" },
          { label: "Memory governance", body: "Controls for long-term memory systems" },
          { label: "Human approval", body: "Sign-off for high-risk operations" },
          { label: "Audit and observability", body: "Comprehensive logging and monitoring" },
          { label: "Tool access policies", body: "Clear rules for external integrations" },
        ],
        afterBullets: [
          "These principles mirror long-established cybersecurity practices because, increasingly, AI agents resemble employees more than software features.",
        ],
      },
      {
        title: "The Bigger Lesson",
        paragraphs: [
          "The industry frequently describes AI agents as **digital employees**. That analogy is becoming increasingly accurate.",
          "Employees receive training. Employees operate under policies. Employees have defined permissions. Employees are monitored. Employees can make mistakes.",
          "AI agents are no different. The only difference is that they can make mistakes at machine speed.",
          "The most successful AI products of the next decade will not simply have the most capable models. **They will have the strongest trust architecture.**",
        ],
        emphasisBlock: [
          "Intelligence attracts users.",
          "Trust keeps them.",
        ],
      },
    ],
    closingCallout: {
      title: "Protecting context, not just data",
      body: "At PrivateNote.ai, we believe protecting context is becoming just as important as protecting data itself. As AI systems gain access to more of our personal notes, business knowledge, and operational workflows, security must extend beyond storage and encryption to include the information agents consume, remember, and act upon.",
    },
  },
  it: {
    intro: [
      "Negli ultimi anni l’industria dell’IA si è concentrata quasi ossessivamente sulla **prompt injection**, cioè sul rischio che un prompt malevolo induca un chatbot a produrre una risposta non prevista.",
      "Ma la prompt injection non è più tutta la storia.",
      "I sistemi di IA di oggi stanno evolvendo rapidamente da assistenti passivi ad **agenti autonomi**. Non si limitano più a rispondere a domande. Accedono a file, leggono e-mail, invocano API, eseguono workflow multi-step e prendono decisioni operative per conto degli utenti.",
      "Nel momento in cui un sistema di IA acquisisce la capacità di **agire**, il manuale della sicurezza cambia completamente.",
      "Un recente paper USENIX Security 2026, **SoK: Attack and Defense Landscape of Agentic AI Systems** di Kim et al., offre una delle analisi più complete finora sulla sicurezza degli agenti. I ricercatori hanno esaminato 128 articoli accademici, identificato 51 tecniche di attacco e 60 strategie di difesa, e proposto un framework per comprendere le nuove sfide di sicurezza dei sistemi IA autonomi.",
      "La conclusione centrale è semplice:",
      "Per le organizzazioni che costruiscono, distribuiscono o usano prodotti basati su IA, dovrebbe essere un campanello d’allarme.",
    ],
    introCallout:
      "Più autonomia ottiene un agente IA, più ampia diventa la sua superficie di attacco.",
    sections: [
      {
        title: "Perché la sicurezza degli agenti è diversa",
        paragraphs: [
          "Il software tradizionale segue una logica predefinita. Le applicazioni LLM tradizionali generano soprattutto testo. **I sistemi agentici funzionano diversamente.**",
          "Combinano modelli linguistici con strumenti esterni, sistemi di memoria, database, API e capacità decisionali autonome. Un agente aziendale può leggere un’e-mail in arrivo, recuperare informazioni dalla documentazione interna, interrogare un CRM, aggiornare un database e inviare una risposta, tutto dentro un unico workflow.",
          "Questa flessibilità è ciò che rende gli agenti così potenti. È anche ciò che li rende difficili da mettere in sicurezza.",
          "Il paper USENIX sostiene che concentrarsi solo sulla sicurezza del modello non basta. La sicurezza deve essere valutata lungo **l’intero ecosistema dell’agente**: modello, memoria, strumenti, fonti dati e azioni che può eseguire.",
        ],
      },
      {
        title: "Le sette dimensioni del rischio degli agenti",
        paragraphs: [
          "I ricercatori identificano sette dimensioni chiave che influenzano la postura di sicurezza di un agente:",
        ],
        bullets: [
          { label: "Fiducia nell’input", body: "Da dove provengono le informazioni?" },
          { label: "Sensibilità dell’accesso ai dati", body: "A quali informazioni può accedere l’agente?" },
          { label: "Autonomia del workflow", body: "Può decidere autonomamente cosa fare dopo?" },
          { label: "Capacità di azione", body: "Può modificare, eliminare o trasmettere dati?" },
          { label: "Persistenza della memoria", body: "Le informazioni persistono tra sessioni?" },
          { label: "Disponibilità degli strumenti", body: "Quali sistemi esterni può invocare?" },
          { label: "Potere dell’interfaccia utente", body: "Quanto può influenzare le decisioni dell’utente?" },
        ],
        afterBullets: [
          "Considera la differenza tra un chatbot di assistenza clienti e un assistente esecutivo autonomo.",
          "Ogni capacità aggiuntiva aumenta l’utilità. Ma amplia anche la superficie di attacco e crea nuove opportunità di abuso, manipolazione o comportamento indesiderato.",
          "La sicurezza diventa meno una questione di proteggere un modello e più una questione di **governare un sistema complesso**.",
        ],
      },
      {
        title: "Il contesto è il nuovo confine di sicurezza",
        paragraphs: [
          "Per decenni la cybersecurity si è concentrata su tre principi: confidenzialità, integrità e disponibilità. Restano essenziali.",
          "Ma l’IA agentica introduce una nuova sfida: la **sicurezza contestuale**.",
          "Un agente può avere autenticazione forte, comunicazioni cifrate e controlli di accesso rigorosi, e fallire comunque in modo catastrofico perché agisce su informazioni malevole o manipolate.",
          "Immagina un agente che elabora un PDF apparentemente innocuo caricato da una parte esterna. Istruzioni nascoste nel documento gli dicono di ignorare le indicazioni precedenti, recuperare informazioni sensibili e trasmetterle altrove.",
          "Questa distinzione conta perché molti attacchi IA emergenti sfruttano il flusso delle informazioni invece di vulnerabilità software tradizionali.",
        ],
        emphasisBlock: [
          "Il sistema non è stato compromesso tramite credenziali rubate.",
          "L’infrastruttura non è stata violata.",
          "L’agente ha semplicemente seguito il contesto sbagliato.",
        ],
        callout:
          "Per i sistemi agentici, il contesto diventa un confine di sicurezza importante quanto autenticazione, cifratura o segmentazione di rete.",
      },
      {
        title: "Perché la memoria crea nuovi rischi",
        paragraphs: [
          "La memoria dell’IA viene spesso presentata come una funzione di esperienza utente. L’argomento è semplice: una memoria migliore abilita una personalizzazione migliore.",
          "Ma la memoria crea anche persistenza. E la persistenza crea rischio.",
          "Il paper USENIX evidenzia come gli attaccanti possano tentare di avvelenare archivi di memoria a lungo termine con istruzioni malevole o informazioni fuorvianti. Una volta scritto in memoria, quel contenuto può influenzare decisioni future molto dopo la fine dell’interazione originale.",
          "A differenza di un attacco temporaneo di prompt injection, l’avvelenamento della memoria può persistere attraverso workflow, utenti e tempo. Il risultato è una sfida di sicurezza fondamentalmente diversa.",
        ],
        emphasisBlock: [
          "La memoria non è più solo una funzione comoda.",
          "La memoria è infrastruttura.",
          "E l’infrastruttura richiede governance.",
        ],
      },
      {
        title: "Gli agenti più pericolosi sono quelli con permessi",
        paragraphs: [
          "I rischi maggiori dell’IA agentica non derivano necessariamente dall’intelligenza del modello. **Derivano dall’autorità che gli viene concessa.**",
          "Un modello che genera un paragrafo sbagliato è un inconveniente. Un agente con accesso a record clienti, documenti interni, sistemi finanziari, piattaforme di comunicazione e strumenti di automazione può produrre conseguenze nel mondo reale.",
          "Man mano che le organizzazioni collegano gli agenti a sistemi sempre più potenti, l’attenzione deve spostarsi dalla capacità del modello al controllo operativo.",
        ],
        callout: "La domanda critica non è più “Quanto è intelligente il modello?”. È: “Che cosa è autorizzato a fare il modello?”",
      },
      {
        title: "Costruire sistemi agentici affidabili",
        paragraphs: [
          "La lezione più ampia del paper è che la sicurezza degli agenti richiede **difesa in profondità**.",
          "Le organizzazioni che distribuiscono agenti IA dovrebbero dare priorità a:",
        ],
        bullets: [
          { label: "Dati fidati vs non fidati", body: "Separazione forte tra fonti dati fidate e non fidate" },
          { label: "Confini dei permessi", body: "Limiti espliciti su ciò che gli agenti possono fare" },
          { label: "Governance della memoria", body: "Controlli per i sistemi di memoria a lungo termine" },
          { label: "Approvazione umana", body: "Conferma per operazioni ad alto rischio" },
          { label: "Audit e osservabilità", body: "Logging e monitoraggio completi" },
          { label: "Policy di accesso agli strumenti", body: "Regole chiare per le integrazioni esterne" },
        ],
        afterBullets: [
          "Questi principi rispecchiano pratiche di cybersecurity consolidate perché, sempre più spesso, gli agenti IA assomigliano a dipendenti più che a funzionalità software.",
        ],
      },
      {
        title: "La lezione più grande",
        paragraphs: [
          "Il settore descrive spesso gli agenti IA come **dipendenti digitali**. L’analogia diventa sempre più accurata.",
          "I dipendenti ricevono formazione. Operano sotto policy. Hanno permessi definiti. Sono monitorati. Possono commettere errori.",
          "Gli agenti IA non sono diversi. L’unica differenza è che possono commettere errori alla velocità della macchina.",
          "I prodotti IA di maggior successo nel prossimo decennio non avranno semplicemente i modelli più capaci. **Avranno l’architettura di fiducia più solida.**",
        ],
        emphasisBlock: [
          "L’intelligenza attira gli utenti.",
          "La fiducia li trattiene.",
        ],
      },
    ],
    closingCallout: {
      title: "Proteggere il contesto, non solo i dati",
      body: "In PrivateNote.ai crediamo che proteggere il contesto stia diventando importante quanto proteggere i dati stessi. Man mano che i sistemi IA ottengono accesso a più note personali, conoscenza aziendale e workflow operativi, la sicurezza deve estendersi oltre archiviazione e cifratura per includere le informazioni che gli agenti consumano, ricordano e su cui agiscono.",
    },
  },
  de: {
    intro: [
      "Die KI-Branche hat die letzten Jahre **Prompt Injection** fixiert—mit der Sorge, ein bösartiger Prompt könnte einen Chatbot zu einer unbeabsichtigten Antwort verleiten.",
      "Aber Prompt Injection ist nicht mehr die ganze Geschichte.",
      "Heutige KI-Systeme entwickeln sich schnell von passiven Assistenten zu **autonomen Agenten**. Sie beantworten nicht mehr nur Fragen. Sie greifen auf Dateien zu, parsen E-Mails, rufen APIs auf, führen mehrstufige Workflows aus und treffen operative Entscheidungen im Namen der Nutzer.",
      "Sobald ein KI-System **handeln** kann, ändert sich das Sicherheitsregelwerk vollständig.",
      "Ein aktuelles USENIX-Security-2026-Paper, **SoK: Attack and Defense Landscape of Agentic AI Systems** von Kim et al., liefert eine der umfassendsten Analysen der Agentensicherheit bis heute. Die Forscher werteten 128 wissenschaftliche Arbeiten aus, identifizierten 51 Angriffstechniken und 60 Verteidigungsstrategien und schlugen einen Rahmen vor, um die aufkommenden Sicherheitsherausforderungen autonomer KI-Systeme zu verstehen.",
      "Ihre zentrale Schlussfolgerung ist einfach:",
      "Für Organisationen, die KI-Produkte entwickeln, einsetzen oder darauf vertrauen, sollte das ein Weckruf sein.",
    ],
    introCallout:
      "Je mehr Autonomie ein KI-Agent erhält, desto größer wird seine Angriffsfläche.",
    sections: [
      {
        title: "Warum Agentensicherheit anders ist",
        paragraphs: [
          "Traditionelle Software folgt vordefinierter Logik. Traditionelle LLM-Anwendungen erzeugen vor allem Text. **Agentische Systeme funktionieren anders.**",
          "Sie verbinden Sprachmodelle mit externen Tools, Gedächtnissystemen, Datenbanken, APIs und autonomen Entscheidungsfähigkeiten. Ein Unternehmensagent kann eine eingehende E-Mail lesen, Informationen aus interner Dokumentation abrufen, ein CRM abfragen, eine Datenbank aktualisieren und eine Antwort senden—alles in einem einzigen Workflow.",
          "Diese Flexibilität macht Agenten so leistungsfähig. Sie macht sie auch schwer zu sichern.",
          "Das USENIX-Paper argumentiert, dass alleinige Modellsicherheit nicht ausreicht. Sicherheit muss im **gesamten Agenten-Ökosystem** bewertet werden: Modell, Gedächtnis, Tools, Datenquellen und ausführbare Aktionen.",
        ],
      },
      {
        title: "Die sieben Dimensionen des Agentenrisikos",
        paragraphs: [
          "Die Forscher identifizieren sieben zentrale Dimensionen, die die Sicherheitslage eines Agenten beeinflussen:",
        ],
        bullets: [
          { label: "Input Trust", body: "Woher stammen Informationen?" },
          { label: "Data Access Sensitivity", body: "Auf welche Informationen kann der Agent zugreifen?" },
          { label: "Workflow Autonomy", body: "Kann er selbstständig entscheiden, was als Nächstes zu tun ist?" },
          { label: "Action Capability", body: "Kann er Daten ändern, löschen oder übertragen?" },
          { label: "Memory Persistence", body: "Bleiben Informationen über Sitzungen hinweg erhalten?" },
          { label: "Tool Availability", body: "Welche externen Systeme kann er aufrufen?" },
          { label: "User Interface Power", body: "Wie viel Einfluss hat er auf Entscheidungen der Nutzer?" },
        ],
        afterBullets: [
          "Vergleichen Sie einen Kundensupport-Chatbot mit einem autonomen Executive Assistant.",
          "Jede zusätzliche Fähigkeit steigert den Nutzen. Sie vergrößert aber auch die Angriffsfläche und schafft neue Möglichkeiten für Missbrauch, Manipulation oder unbeabsichtigtes Verhalten.",
          "Sicherheit wird weniger eine Frage des Modellschutzes und mehr eine Frage der **Steuerung eines komplexen Systems**.",
        ],
      },
      {
        title: "Kontext ist die neue Sicherheitsgrenze",
        paragraphs: [
          "Jahrzehntelang konzentrierte sich Cybersicherheit auf drei Prinzipien: Vertraulichkeit, Integrität und Verfügbarkeit. Diese Prinzipien bleiben unverzichtbar.",
          "Agentische KI führt jedoch eine neue Herausforderung ein: **kontextuelle Sicherheit**.",
          "Ein Agent kann starke Authentifizierung, verschlüsselte Kommunikation und strenge Zugriffskontrollen haben und dennoch katastrophal scheitern, weil er auf bösartige oder manipulierte Informationen reagiert.",
          "Stellen Sie sich vor, ein Agent verarbeitet ein scheinbar harmloses PDF, das eine externe Partei hochgeladen hat. Versteckte Anweisungen im Dokument sagen dem Agenten, frühere Vorgaben zu ignorieren, sensible Informationen abzurufen und woanders zu übermitteln.",
          "Diese Unterscheidung ist wichtig, weil viele neue KI-Angriffe Informationsfluss statt Software-Schwachstellen ausnutzen.",
        ],
        emphasisBlock: [
          "Das System wurde nicht durch gestohlene Zugangsdaten kompromittiert.",
          "Die Infrastruktur wurde nicht durchbrochen.",
          "Der Agent folgte einfach dem falschen Kontext.",
        ],
        callout:
          "Bei agentischen Systemen wird Kontext zu einer Sicherheitsgrenze, die genauso wichtig ist wie Authentifizierung, Verschlüsselung oder Netzwerksegmentierung.",
      },
      {
        title: "Warum Gedächtnis neue Risiken schafft",
        paragraphs: [
          "KI-Gedächtnis wird oft als UX-Feature präsentiert. Das Argument ist einfach: besseres Gedächtnis ermöglicht bessere Personalisierung.",
          "Aber Gedächtnis schafft auch Persistenz. Und Persistenz schafft Risiko.",
          "Das USENIX-Paper zeigt, wie Angreifer langfristige Gedächtnisspeicher mit bösartigen Anweisungen oder irreführenden Informationen vergiften können. Einmal im Gedächtnis gespeichert, kann dieser Inhalt künftige Entscheidungen beeinflussen—lange nach dem ursprünglichen Kontakt.",
          "Anders als ein temporärer Prompt-Injection-Angriff kann Memory Poisoning über Workflows, Nutzer und Zeit hinweg bestehen bleiben. Das Ergebnis ist eine grundlegend andere Sicherheitsherausforderung.",
        ],
        emphasisBlock: [
          "Gedächtnis ist nicht mehr nur ein Komfortfeature.",
          "Gedächtnis ist Infrastruktur.",
          "Und Infrastruktur braucht Governance.",
        ],
      },
      {
        title: "Die gefährlichsten Agenten sind die mit Berechtigungen",
        paragraphs: [
          "Die größten Risiken agentischer KI kommen nicht unbedingt von der Intelligenz des Modells. **Sie kommen von der ihm gewährten Autorität.**",
          "Ein Modell, das einen falschen Absatz erzeugt, ist unbequem. Ein Agent mit Zugriff auf Kundendaten, interne Dokumente, Finanzsysteme, Kommunikationsplattformen und Automatisierungstools kann reale Folgen haben.",
          "Wenn Organisationen Agenten an immer mächtigere Systeme anbinden, muss der Fokus von Modellfähigkeit zu operativer Kontrolle wechseln.",
        ],
        callout:
          "Die entscheidende Frage lautet nicht mehr: „Wie intelligent ist das Modell?“ Sondern: „Was darf das Modell tun?“",
      },
      {
        title: "Vertrauenswürdige Agentensysteme aufbauen",
        paragraphs: [
          "Die übergeordnete Lehre des Papers: Agentensicherheit braucht **Defense-in-Depth**.",
          "Organisationen, die KI-Agenten einsetzen, sollten priorisieren:",
        ],
        bullets: [
          { label: "Vertrauenswürdige vs. nicht vertrauenswürdige Daten", body: "Starke Trennung zwischen Datenquellen" },
          { label: "Berechtigungsgrenzen", body: "Explizite Limits für Agentenaktionen" },
          { label: "Gedächtnis-Governance", body: "Kontrollen für Langzeitgedächtnis" },
          { label: "Menschliche Freigabe", body: "Sign-off für risikoreiche Operationen" },
          { label: "Audit und Beobachtbarkeit", body: "Umfassende Protokollierung und Überwachung" },
          { label: "Tool-Zugriffsrichtlinien", body: "Klare Regeln für externe Integrationen" },
        ],
        afterBullets: [
          "Diese Prinzipien spiegeln etablierte Cybersicherheitspraxis wider, weil KI-Agenten zunehmend eher Mitarbeitern als Softwarefeatures gleichen.",
        ],
      },
      {
        title: "Die größere Lehre",
        paragraphs: [
          "Die Branche beschreibt KI-Agenten oft als **digitale Mitarbeiter**. Diese Analogie wird immer zutreffender.",
          "Mitarbeiter erhalten Schulungen. Mitarbeiter arbeiten nach Richtlinien. Mitarbeiter haben definierte Berechtigungen. Mitarbeiter werden überwacht. Mitarbeiter können Fehler machen.",
          "KI-Agenten sind nicht anders. Der einzige Unterschied: Sie machen Fehler mit Maschinengeschwindigkeit.",
          "Die erfolgreichsten KI-Produkte des nächsten Jahrzehnts werden nicht einfach die fähigsten Modelle haben. **Sie werden die stärkste Vertrauensarchitektur haben.**",
        ],
        emphasisBlock: [
          "Intelligenz zieht Nutzer an.",
          "Vertrauen hält sie.",
        ],
      },
    ],
    closingCallout: {
      title: "Kontext schützen, nicht nur Daten",
      body: "Bei PrivateNote.ai glauben wir, dass der Schutz von Kontext genauso wichtig wird wie der Schutz von Daten selbst. Wenn KI-Systeme Zugang zu persönlichen Notizen, Unternehmenswissen und operativen Workflows erhalten, muss Sicherheit über Speicherung und Verschlüsselung hinausgehen—einschließlich der Informationen, die Agenten konsumieren, speichern und auf die sie reagieren.",
    },
  },
  fr: {
    intro: [
      "L'industrie de l'IA a passé les dernières années à obséder sur l'**injection de prompt**—craignant qu'un prompt malveillant ne pousse un chatbot à produire une réponse involontaire.",
      "Mais l'injection de prompt n'est plus toute l'histoire.",
      "Les systèmes d'IA d'aujourd'hui évoluent rapidement d'assistants passifs en **agents autonomes**. Ils ne se contentent plus de répondre aux questions. Ils accèdent aux fichiers, analysent les e-mails, invoquent des API, exécutent des workflows en plusieurs étapes et prennent des décisions opérationnelles pour le compte des utilisateurs.",
      "Dès qu'un système d'IA acquiert la capacité d'**agir**, le manuel de sécurité change complètement.",
      "Un récent article USENIX Security 2026, **SoK: Attack and Defense Landscape of Agentic AI Systems** par Kim et al., propose l'une des analyses les plus complètes de la sécurité des agents à ce jour. Les chercheurs ont examiné 128 articles académiques, identifié 51 techniques d'attaque et 60 stratégies de défense, et proposé un cadre pour comprendre les défis de sécurité émergents des systèmes d'IA autonomes.",
      "Leur conclusion centrale est simple :",
      "Pour les organisations qui conçoivent, déploient ou s'appuient sur des produits alimentés par l'IA, cela devrait servir d'appel au réveil.",
    ],
    introCallout:
      "Plus un agent IA gagne en autonomie, plus sa surface d'attaque s'agrandit.",
    sections: [
      {
        title: "Pourquoi la sécurité des agents est différente",
        paragraphs: [
          "Les logiciels traditionnels suivent une logique prédéfinie. Les applications LLM traditionnelles produisent surtout du texte. **Les systèmes agentiques fonctionnent autrement.**",
          "Ils combinent des modèles de langage avec des outils externes, des systèmes de mémoire, des bases de données, des API et des capacités de décision autonomes. Un agent d'entreprise peut lire un e-mail entrant, récupérer des informations dans la documentation interne, interroger un CRM, mettre à jour une base de données et envoyer une réponse—le tout dans un seul workflow.",
          "Cette flexibilité rend les agents si puissants. C'est aussi ce qui les rend difficiles à sécuriser.",
          "L'article USENIX affirme que se concentrer uniquement sur la sécurité du modèle est insuffisant. La sécurité doit être évaluée sur **l'ensemble de l'écosystème de l'agent** : le modèle, sa mémoire, ses outils, ses sources de données et les actions qu'il peut effectuer.",
        ],
      },
      {
        title: "Les sept dimensions du risque agentique",
        paragraphs: [
          "Les chercheurs identifient sept dimensions clés qui influencent la posture de sécurité d'un agent :",
        ],
        bullets: [
          { label: "Input Trust", body: "D'où provient l'information ?" },
          { label: "Data Access Sensitivity", body: "À quelles informations l'agent peut-il accéder ?" },
          { label: "Workflow Autonomy", body: "Peut-il décider seul de la prochaine action ?" },
          { label: "Action Capability", body: "Peut-il modifier, supprimer ou transmettre des données ?" },
          { label: "Memory Persistence", body: "L'information persiste-t-elle entre les sessions ?" },
          { label: "Tool Availability", body: "Quels systèmes externes peut-il invoquer ?" },
          { label: "User Interface Power", body: "Quelle influence a-t-il sur les décisions des utilisateurs ?" },
        ],
        afterBullets: [
          "Comparez un chatbot de support client et un assistant exécutif autonome.",
          "Chaque capacité supplémentaire augmente l'utilité. Mais elle élargit aussi la surface d'attaque et crée de nouvelles opportunités d'abus, de manipulation ou de comportement involontaire.",
          "La sécurité devient moins une question de protection du modèle et plus une question de **gouvernance d'un système complexe**.",
        ],
      },
      {
        title: "Le contexte devient la nouvelle frontière de sécurité",
        paragraphs: [
          "Pendant des décennies, la cybersécurité s'est concentrée sur trois principes : confidentialité, intégrité et disponibilité. Ces principes restent essentiels.",
          "Mais l'IA agentique introduit un nouveau défi : la **sécurité contextuelle**.",
          "Un agent peut disposer d'une authentification forte, de communications chiffrées et de contrôles d'accès stricts, et échouer pourtant de façon catastrophique parce qu'il agit sur des informations malveillantes ou manipulées.",
          "Imaginez un agent traitant un PDF apparemment inoffensif téléversé par un tiers. Des instructions cachées dans le document disent à l'agent d'ignorer les consignes précédentes, de récupérer des informations sensibles et de les transmettre ailleurs.",
          "Cette distinction compte, car de nombreuses attaques IA émergentes exploitent les flux d'information plutôt que les vulnérabilités logicielles.",
        ],
        emphasisBlock: [
          "Le système n'a pas été compromis par des identifiants volés.",
          "L'infrastructure n'a pas été violée.",
          "L'agent a simplement suivi le mauvais contexte.",
        ],
        callout:
          "Pour les systèmes agentiques, le contexte devient une frontière de sécurité aussi importante que l'authentification, le chiffrement ou la segmentation réseau.",
      },
      {
        title: "Pourquoi la mémoire crée de nouveaux risques",
        paragraphs: [
          "La mémoire IA est souvent présentée comme une fonctionnalité d'expérience utilisateur. L'argument est simple : une meilleure mémoire permet une meilleure personnalisation.",
          "Mais la mémoire crée aussi de la persistance. Et la persistance crée du risque.",
          "L'article USENIX met en lumière la façon dont des attaquants peuvent tenter d'empoisonner des mémoires à long terme avec des instructions malveillantes ou des informations trompeuses. Une fois écrit dans la mémoire, ce contenu peut influencer des décisions futures longtemps après la fin de l'interaction d'origine.",
          "Contrairement à une attaque temporaire par injection de prompt, l'empoisonnement de la mémoire peut persister à travers les workflows, les utilisateurs et le temps. Le résultat est un défi de sécurité fondamentalement différent.",
        ],
        emphasisBlock: [
          "La mémoire n'est plus seulement une fonctionnalité de confort.",
          "La mémoire est une infrastructure.",
          "Et l'infrastructure exige une gouvernance.",
        ],
      },
      {
        title: "Les agents les plus dangereux sont ceux qui ont des permissions",
        paragraphs: [
          "Les plus grands risques de l'IA agentique ne viennent pas nécessairement de l'intelligence du modèle. **Ils viennent de l'autorité qui lui est accordée.**",
          "Un modèle qui génère un paragraphe incorrect est gênant. Un agent avec accès aux dossiers clients, aux documents internes, aux systèmes financiers, aux plateformes de communication et aux outils d'automatisation peut avoir des conséquences réelles.",
          "À mesure que les organisations connectent des agents à des systèmes de plus en plus puissants, l'attention doit passer de la capacité du modèle au contrôle opérationnel.",
        ],
        callout:
          "La question critique n'est plus : « Quelle est l'intelligence du modèle ? » C'est : « Que le modèle est-il autorisé à faire ? »",
      },
      {
        title: "Construire des systèmes d'agents dignes de confiance",
        paragraphs: [
          "La leçon plus large de l'article est que la sécurité des agents exige une **défense en profondeur**.",
          "Les organisations qui déploient des agents IA devraient prioriser :",
        ],
        bullets: [
          { label: "Données de confiance vs. non fiables", body: "Séparation forte entre sources de données" },
          { label: "Limites de permission", body: "Frontières explicites autour des actions des agents" },
          { label: "Gouvernance de la mémoire", body: "Contrôles pour les systèmes de mémoire à long terme" },
          { label: "Approbation humaine", body: "Validation pour les opérations à haut risque" },
          { label: "Audit et observabilité", body: "Journalisation et surveillance complètes" },
          { label: "Politiques d'accès aux outils", body: "Règles claires pour les intégrations externes" },
        ],
        afterBullets: [
          "Ces principes reprennent des pratiques de cybersécurité bien établies, car les agents IA ressemblent de plus en plus à des employés plutôt qu'à des fonctionnalités logicielles.",
        ],
      },
      {
        title: "La leçon la plus large",
        paragraphs: [
          "L'industrie décrit souvent les agents IA comme des **employés numériques**. Cette analogie devient de plus en plus juste.",
          "Les employés reçoivent une formation. Les employés opèrent selon des politiques. Les employés ont des permissions définies. Les employés sont surveillés. Les employés peuvent faire des erreurs.",
          "Les agents IA ne font pas exception. La seule différence : ils peuvent faire des erreurs à la vitesse de la machine.",
          "Les produits IA les plus réussis de la prochaine décennie n'auront pas seulement les modèles les plus capables. **Ils auront l'architecture de confiance la plus solide.**",
        ],
        emphasisBlock: [
          "L'intelligence attire les utilisateurs.",
          "La confiance les retient.",
        ],
      },
    ],
    closingCallout: {
      title: "Protéger le contexte, pas seulement les données",
      body: "Chez PrivateNote.ai, nous croyons que protéger le contexte devient aussi important que protéger les données elles-mêmes. À mesure que les systèmes d'IA accèdent à nos notes personnelles, aux connaissances métier et aux workflows opérationnels, la sécurité doit dépasser le stockage et le chiffrement pour inclure les informations que les agents consomment, mémorisent et sur lesquelles ils agissent.",
    },
  },
  es: {
    intro: [
      "La industria de la IA ha pasado los últimos años obsesionada con la **inyección de prompts**—preocupada de que un prompt malicioso engañe a un chatbot para producir una respuesta no deseada.",
      "Pero la inyección de prompts ya no es toda la historia.",
      "Los sistemas de IA actuales evolucionan rápidamente de asistentes pasivos a **agentes autónomos**. Ya no solo responden preguntas. Acceden a archivos, analizan correos, invocan API, ejecutan flujos de trabajo de varios pasos y toman decisiones operativas en nombre de los usuarios.",
      "En el momento en que un sistema de IA gana la capacidad de **actuar**, el manual de seguridad cambia por completo.",
      "Un reciente artículo de USENIX Security 2026, **SoK: Attack and Defense Landscape of Agentic AI Systems** de Kim et al., ofrece uno de los análisis más completos sobre la seguridad de agentes hasta la fecha. Los investigadores revisaron 128 artículos académicos, identificaron 51 técnicas de ataque y 60 estrategias de defensa, y propusieron un marco para entender los desafíos de seguridad emergentes de los sistemas de IA autónomos.",
      "Su conclusión central es directa:",
      "Para las organizaciones que crean, despliegan o dependen de productos impulsados por IA, esto debería ser una llamada de atención.",
    ],
    introCallout:
      "Cuanta más autonomía gana un agente de IA, mayor es su superficie de ataque.",
    sections: [
      {
        title: "Por qué la seguridad de agentes es diferente",
        paragraphs: [
          "El software tradicional sigue una lógica predefinida. Las aplicaciones LLM tradicionales generan principalmente texto. **Los sistemas agénticos funcionan de otra manera.**",
          "Combinan modelos de lenguaje con herramientas externas, sistemas de memoria, bases de datos, API y capacidades de decisión autónoma. Un agente empresarial puede leer un correo entrante, recuperar información de documentación interna, consultar un CRM, actualizar una base de datos y enviar una respuesta—todo en un solo flujo de trabajo.",
          "Esa flexibilidad es lo que hace tan potentes a los agentes. También es lo que los hace difíciles de asegurar.",
          "El artículo de USENIX sostiene que centrarse solo en la seguridad del modelo es insuficiente. La seguridad debe evaluarse en **todo el ecosistema del agente**: el modelo, su memoria, sus herramientas, sus fuentes de datos y las acciones que puede realizar.",
        ],
      },
      {
        title: "Las siete dimensiones del riesgo agéntico",
        paragraphs: [
          "Los investigadores identifican siete dimensiones clave que influyen en la postura de seguridad de un agente:",
        ],
        bullets: [
          { label: "Input Trust", body: "¿De dónde proviene la información?" },
          { label: "Data Access Sensitivity", body: "¿A qué información puede acceder el agente?" },
          { label: "Workflow Autonomy", body: "¿Puede decidir de forma independiente qué hacer a continuación?" },
          { label: "Action Capability", body: "¿Puede modificar, eliminar o transmitir datos?" },
          { label: "Memory Persistence", body: "¿Persiste la información entre sesiones?" },
          { label: "Tool Availability", body: "¿Qué sistemas externos puede invocar?" },
          { label: "User Interface Power", body: "¿Cuánta influencia tiene sobre las decisiones del usuario?" },
        ],
        afterBullets: [
          "Compare un chatbot de atención al cliente con un asistente ejecutivo autónomo.",
          "Cada capacidad adicional aumenta la utilidad. Pero también expande la superficie de ataque y crea nuevas oportunidades de uso indebido, manipulación o comportamiento no intencionado.",
          "La seguridad pasa de ser proteger un modelo a **gobernar un sistema complejo**.",
        ],
      },
      {
        title: "El contexto es la nueva frontera de seguridad",
        paragraphs: [
          "Durante décadas, la ciberseguridad se ha centrado en tres principios: confidencialidad, integridad y disponibilidad. Esos principios siguen siendo esenciales.",
          "Pero la IA agéntica introduce un nuevo desafío: la **seguridad contextual**.",
          "Un agente puede tener autenticación sólida, comunicaciones cifradas y controles de acceso estrictos, y aun así fallar de forma catastrófica porque actúa sobre información maliciosa o manipulada.",
          "Imagine un agente procesando un PDF aparentemente inofensivo subido por un tercero. Instrucciones ocultas dentro del documento le dicen al agente que ignore las directrices anteriores, recupere información sensible y la transmita a otro lugar.",
          "Esta distinción importa porque muchos ataques emergentes de IA explotan el flujo de información en lugar de vulnerabilidades de software.",
        ],
        emphasisBlock: [
          "El sistema no fue comprometido mediante credenciales robadas.",
          "La infraestructura no fue violada.",
          "El agente simplemente siguió el contexto equivocado.",
        ],
        callout:
          "Para los sistemas agénticos, el contexto se convierte en una frontera de seguridad tan importante como la autenticación, el cifrado o la segmentación de red.",
      },
      {
        title: "Por qué la memoria crea nuevos riesgos",
        paragraphs: [
          "La memoria de IA suele presentarse como una función de experiencia de usuario. El argumento es simple: una mejor memoria permite una mejor personalización.",
          "Pero la memoria también crea persistencia. Y la persistencia crea riesgo.",
          "El artículo de USENIX destaca cómo los atacantes pueden intentar envenenar almacenes de memoria a largo plazo con instrucciones maliciosas o información engañosa. Una vez escrito en la memoria, ese contenido puede influir en decisiones futuras mucho después de que haya terminado la interacción original.",
          "A diferencia de un ataque temporal de inyección de prompts, el envenenamiento de memoria puede persistir entre flujos de trabajo, usuarios y tiempo. El resultado es un desafío de seguridad fundamentalmente diferente.",
        ],
        emphasisBlock: [
          "La memoria ya no es solo una función de conveniencia.",
          "La memoria es infraestructura.",
          "Y la infraestructura requiere gobernanza.",
        ],
      },
      {
        title: "Los agentes más peligrosos son los que tienen permisos",
        paragraphs: [
          "Los mayores riesgos de la IA agéntica no provienen necesariamente de la inteligencia del modelo. **Provienen de la autoridad que se le concede.**",
          "Un modelo que genera un párrafo incorrecto es incómodo. Un agente con acceso a registros de clientes, documentos internos, sistemas financieros, plataformas de comunicación y herramientas de automatización puede crear consecuencias reales.",
          "A medida que las organizaciones conectan agentes a sistemas cada vez más potentes, el enfoque debe pasar de la capacidad del modelo al control operativo.",
        ],
        callout:
          "La pregunta crítica ya no es: «¿Qué tan inteligente es el modelo?» Es: «¿Qué se le permite hacer al modelo?»",
      },
      {
        title: "Construir sistemas de agentes confiables",
        paragraphs: [
          "La lección más amplia del artículo es que la seguridad de agentes requiere **defensa en profundidad**.",
          "Las organizaciones que despliegan agentes de IA deberían priorizar:",
        ],
        bullets: [
          { label: "Datos confiables vs. no confiables", body: "Fuerte separación entre fuentes de datos" },
          { label: "Límites de permiso", body: "Fronteras explícitas en torno a las acciones del agente" },
          { label: "Gobernanza de memoria", body: "Controles para sistemas de memoria a largo plazo" },
          { label: "Aprobación humana", body: "Validación para operaciones de alto riesgo" },
          { label: "Auditoría y observabilidad", body: "Registro y monitorización completos" },
          { label: "Políticas de acceso a herramientas", body: "Reglas claras para integraciones externas" },
        ],
        afterBullets: [
          "Estos principios reflejan prácticas de ciberseguridad consolidadas, porque cada vez más los agentes de IA se parecen a empleados más que a funciones de software.",
        ],
      },
      {
        title: "La lección más amplia",
        paragraphs: [
          "La industria describe con frecuencia a los agentes de IA como **empleados digitales**. Esa analogía es cada vez más precisa.",
          "Los empleados reciben formación. Los empleados operan bajo políticas. Los empleados tienen permisos definidos. Los empleados son monitorizados. Los empleados pueden cometer errores.",
          "Los agentes de IA no son diferentes. La única diferencia es que pueden cometer errores a velocidad de máquina.",
          "Los productos de IA más exitosos de la próxima década no tendrán simplemente los modelos más capaces. **Tendrán la arquitectura de confianza más sólida.**",
        ],
        emphasisBlock: [
          "La inteligencia atrae usuarios.",
          "La confianza los retiene.",
        ],
      },
    ],
    closingCallout: {
      title: "Proteger el contexto, no solo los datos",
      body: "En PrivateNote.ai, creemos que proteger el contexto se vuelve tan importante como proteger los datos en sí. A medida que los sistemas de IA acceden a más notas personales, conocimiento empresarial y flujos operativos, la seguridad debe ir más allá del almacenamiento y el cifrado para incluir la información que los agentes consumen, recuerdan y sobre la que actúan.",
    },
  },
  nl: agentSecurityNl,
  pt: agentSecurityPt,
  hr: agentSecurityHr,
  sr: agentSecuritySr,
};

export const AgentSecurityPost: React.FC = () => {
  const { t, language } = useLanguage();
  const blogPath = localizedPath("/blog", language);
  const article = getBlogArticleCopy(copy, language);

  return (
    <BlogGuideArticle slug="securing-ai-agents-like-employees">
      <article>
        <BlogPostHeader
          slug="securing-ai-agents-like-employees"
          title={t.blogAgentSecurityTitle}
          subtitle={t.blogAgentSecuritySubtitle}
          excerpt={t.blogAgentSecurityExcerpt}
          headerClassName="mb-12"
        />

        <BlogArticleTakeaways slug="securing-ai-agents-like-employees" />

        <div className="space-y-6 leading-relaxed">
          {article.intro.map((paragraph, index) => (
            <ArticleParagraph key={paragraph} text={paragraph} lead={index === 0} />
          ))}
          {article.introCallout ? <CalloutBox text={article.introCallout} /> : null}
        </div>

        <div className="mt-14 space-y-14">
          {article.sections.map((section) => (
            <section className="space-y-5 border-t border-gray-200 pt-10 dark:border-gray-800" key={section.title}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{section.title}</h2>

              {section.paragraphs.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} />
              ))}

              {section.emphasisBlock ? <EmphasisStack lines={section.emphasisBlock} /> : null}

              {section.bullets ? <BulletList items={section.bullets} /> : null}

              {section.afterBullets?.map((paragraph) => (
                <ArticleParagraph key={paragraph} text={paragraph} />
              ))}

              {section.callout ? <CalloutBox text={section.callout} /> : null}
            </section>
          ))}
        </div>

        {article.closingCallout ? (
          <div className="mt-14 border-t border-gray-200 pt-8 dark:border-gray-800">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Shield className="h-4 w-4 text-primary/70" />
              {article.closingCallout.title}
            </h2>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              <RichText text={article.closingCallout.body} />
            </p>
          </div>
        ) : null}

        <BlogPostCrossLinks slug="securing-ai-agents-like-employees" />
      </article>
    </BlogGuideArticle>
  );
};
