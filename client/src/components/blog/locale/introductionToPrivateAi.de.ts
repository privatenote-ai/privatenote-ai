import type { IntroductionToPrivateAiArticleCopy } from "./introductionToPrivateAi.types";

export const introductionToPrivateAiDe: IntroductionToPrivateAiArticleCopy = {
  heroAlt:
    "Person am heimischen Schreibtisch mit Laptop, auf dessen Bildschirm eine Visualisierung eines neuronalen Netzes zu sehen ist, daneben ein kompakter lokaler KI-Server",
  intro: [
    "**Private KI** bedeutet, ein großes Sprachmodell auf Hardware auszuführen, die Sie direkt kontrollieren—Ihren Laptop, Ihren Browser oder einen Server in Ihrem Büro—sodass Ihr Eingabetext niemals zur Inferenz an eine Cloud eines Drittanbieters gesendet wird. Es ist die praktische Antwort auf eine einfache Frage: *Kann ich hochwertige Hilfe von KI erhalten, ohne meine Worte an den Computer eines anderen weiterzugeben?*",
    "Diese Frage gewinnt jedes Jahr an Bedeutung. Cloud-Assistenten sind bemerkenswert leistungsfähig, verarbeiten Ihre Prompts aber auf entfernter Infrastruktur. Für Notizen, Zugangsdaten, juristische Entwürfe, Gesundheitsinformationen oder alles, was Sie nicht in einen öffentlichen Chatbot einfügen würden, ist lokale und browserseitige KI längst keine Bastler-Spielerei mehr. Sie ist eine zentrale Sicherheitsanforderung.",
    "Dieser Leitfaden führt Sie durch die Entwicklung privater KI, erklärt, warum große Labore Modellgewichte veröffentlichen, zeigt die wichtigsten Wege zur lokalen Ausführung von Modellen, die relevantesten Open-Source-Projekte und Modellfamilien, wo der Stand der Technik 2026 liegt—und wie [PrivateNote](app:home) mit **Write with Private AI** passt, das vollständig in Ihrem Browser-Tab läuft.",
  ],
  sections: [
    {
      title: "Eine kurze Evolution: von den Laboren auf Ihren Laptop",
      paragraphs: [
        "Jahrelang lebten nützliche Sprachmodelle fast ausschließlich bei Technologiekonzernen mit massiven GPU-Clustern. Training erforderte Millionen Dollar Rechenleistung, spezialisierte Teams und proprietäre Datensätze. Wenn Sie KI-Unterstützung wollten, nutzten Sie eine API oder eine Cloud-Web-App—und Ihr Text verließ Ihr Gerät.",
        "Drei Branchenverschiebungen haben dieses Bild vollständig verändert:",
      ],
      bullets: [
        "**Transformer-Skalierungsgesetze** — Die Forschung zeigte, dass gut trainierte Modelle auf großen, hochwertigen Datensätzen überraschend allgemeine Fähigkeiten liefern können—nicht nur im Frontier-Maßstab.",
        "**Open-Weight-Veröffentlichungen** — Beginnend mit Metas Llama-Familie, gefolgt von Mistral, Google Gemma, Alibaba Qwen und anderen, erreichten herunterladbare Parameter Entwickler weltweit.",
        "**Reife Inferenz-Tools** — Projekte wie llama.cpp, Ollama, vLLM, WebLLM und Transformers.js machten es praktikabel, diese Gewichte auf Consumer-Hardware auszuführen.",
      ],
      callout:
        "Bis 2026 hat sich die Lücke zwischen „nur in der Cloud“ und „läuft auf meinem Gerät“ dramatisch verkleinert. Frontier-Cloud-Modelle sind weiterhin größer und schneller, aber kleine und mittelgroße Open-Modelle sind bei Entwürfen, Zusammenfassungen, Umschreibungen und alltäglichen Fragen hochleistungsfähig—besonders für Kurzform-Texte wie Notizen.",
    },
    {
      title: "Warum Unternehmen Modellgewichte veröffentlichen",
      paragraphs: [
        "Gewichte freizugeben ist keine Wohltätigkeit. Labore veröffentlichen Parameter aus strategischen Gründen, die das gesamte Ökosystem prägen.",
      ],
      bullets: [
        "**Ökosystem-Hebelwirkung** — Wenn Entwickler auf Ihrem Modell aufbauen, wird Ihre Architektur zum Standard. Fine-Tunes, Tools und Integrationen folgen den Gewichten.",
        "**Forschungsglaubwürdigkeit** — Open Weights laden zur Prüfung, Reproduzierbarkeit und akademischen Adoption ein. Diese Sichtbarkeit stärkt technologische Führung.",
        "**Regulatorische und Vertrauenspositionierung** — Europäische Akteure wie Mistral und globale Marken wie Meta und Google nutzen offene Veröffentlichungen, um Transparenz zu signalisieren und sich von vollständig geschlossenen APIs abzuheben.",
        "**Destillation und Spezialisierung** — Kleinere Modelle, die von größeren trainiert werden, verbreiten Fähigkeiten nach unten. Die Veröffentlichung von Eltern-Gewichten beschleunigt diese Pipeline in der Community.",
        "**Wettbewerbsdruck** — Sobald ein großes Labor ein starkes Modell offen veröffentlicht, stehen andere unter Druck nachzuziehen—oder sie riskieren, Entwickler-Mindshare zu verlieren.",
      ],
      callout:
        "Open Weights sind nicht immer im strengen Sinne „Open Source“. Lizenzen können die kommerzielle Nutzung einschränken, eine Namensnennung verlangen oder bestimmte Domänen ausschließen. Lesen Sie vor dem produktiven Einsatz immer die Model Card.",
    },
    {
      title: "Drei Wege, private KI einzusetzen",
      paragraphs: [
        "Es gibt keine einzelne beste Architektur. Die richtige Wahl hängt von Ihrer Hardware, Ihren Datenschutzanforderungen und davon ab, ob Sie einen 70-Milliarden-Parameter-Generalisten oder einen schnellen Assistenten für kurze Notizen brauchen.",
      ],
      beforeFlowSteps: "Die meisten Private-KI-Einsätze fallen in eines dieser Muster:",
      flowDiagramCaption: "Drei Einsatzmuster auf einen Blick",
      flowSteps: [
        {
          step: "Option 1",
          title: "Lokale Anwendungsumgebungen (Ollama und Desktop-Apps)",
          body: "Tools wie [Ollama](https://ollama.com), LM Studio und GPT4All laden Modellgewichte herunter und führen sie nativ auf Ihrem Mac, Windows- oder Linux-Rechner aus. Sie erhalten Offline-Inferenz, native GPU-Beschleunigung und Zugriff auf größere Modelle, als ein Browser bequem laden kann. Kompromisse: erheblicher Speicherplatz (oft zig Gigabyte pro Modell), dedizierter RAM oder VRAM und manuelle Updates.",
        },
        {
          step: "Option 2",
          title: "Sandbox-Umgebungen (WebGPU im Browser)",
          body: "Moderne Browser stellen **WebGPU** bereit, wodurch JavaScript neuronale Netze auf Ihrer GPU ausführen kann—ohne Installation. Projekte wie WebLLM, MLC LLM und Transformers.js kompilieren Modelle für das Web. Sie opfern Modellgröße und Rohgeschwindigkeit, gewinnen aber eine bemerkenswerte Eigenschaft: **Ihr Prompt verlässt den Browser-Tab zur Inferenz nicht**. Kein Konto, kein Server-Roundtrip, kein Anbieter, der Ihren Entwurf protokolliert.",
        },
        {
          step: "Option 3",
          title: "Dedizierte Rechenleistung (Heim- oder Büroserver)",
          body: "Teams mit dedizierten NVIDIA-GPUs, einem Mac Studio oder einem kleinen Rack-Server betreiben oft **vLLM**, **llama.cpp** oder Ollama als gemeinsamen internen Endpunkt. Das ist das Muster für private KI in höchster Qualität: große Kontextfenster, größere Modelle und mehrere Nutzer in einem LAN. Kompromisse: Hardwarekosten, Strom, Kühlung und laufende operative Wartung.",
        },
      ],
      afterFlowSteps: [
        "Der rote Faden ist in allen drei Fällen derselbe: **Die Inferenz erfolgt auf Infrastruktur, die Sie kontrollieren**—nicht in einer Multi-Tenant-Cloud, in der Ihr Text zur Verarbeitungslast eines anderen wird.",
      ],
    },
    {
      title: "Open-Source-Projekte, die am meisten zählen",
      paragraphs: [
        "Modelle sind nur die halbe Geschichte. Diese grundlegenden Projekte haben rohe Gewichte in Software verwandelt, die Millionen Menschen tatsächlich ausführen können.",
      ],
      bullets: [
        "**[llama.cpp](https://github.com/ggerganov/llama.cpp)** — Hoch-effiziente C/C++-Inferenz; die Grundlage für unzählige lokale CPU- und GPU-Einsätze.",
        "**[Ollama](https://ollama.com)** — Eine benutzerfreundliche CLI und Desktop-Erfahrung zum Herunterladen, Aktualisieren und lokalen Chatten mit Modellen.",
        "**[vLLM](https://github.com/vllm-project/vllm)** — Hochdurchsatz-Batch-Serving für gemeinsame Team-GPU-Server und API-Maßstab-Workloads.",
        "**[Hugging Face Transformers](https://github.com/huggingface/transformers)** — Die De-facto-Bibliothek und der Hub zum Entdecken, Herunterladen, Fine-Tunen und Teilen von Modellen.",
        "**[WebLLM / MLC LLM](https://webllm.mlc.ai)** — Kompiliert Modelle für Zero-Install-, browser-native Ausführung über WebGPU.",
        "**[Transformers.js](https://huggingface.co/docs/transformers.js)** — Führt ONNX-exportierte Modelle direkt in JavaScript aus—ein weiterer Weg zur browserseitigen Inferenz.",
      ],
    },
    {
      title: "Modellfamilien, die Sie kennen sollten",
      paragraphs: [
        "Jeden Monat erscheinen Dutzende Checkpoints. Vier Familien dominieren die Gespräche über private KI im Jahr 2026.",
      ],
      bullets: [
        "**Meta Llama** — Llama 3 und die neueren Llama-4-Linien setzen den Maßstab für Open-Weight-Generalisten: starke Reasoning-Fähigkeiten, breite Tool-Unterstützung und ein riesiges Fine-Tune-Ökosystem.",
        "**Google Gemma** — Die Gemma-2-, Gemma-3- und **Gemma-4**-Familien konzentrieren sich auf Effizienz—starke Leistung pro Parameter, exzellente kleine Modelle und Varianten für On-Device- und gehostete Inferenz.",
        "**Mistral AI (Europa)** — Das in Paris ansässige Mistral liefert kompakte, leistungsfähige Modelle (Mistral, Mixtral, Codestral) mit entwicklerfreundlichen Lizenzen und einer ausgeprägt europäischen Erzählung zur Datensouveränität.",
        "**Alibaba Qwen** — Die Qwen-2.5- und **Qwen-3**-Serien brillieren bei mehrsprachigen Aufgaben und liefern winzige Varianten (unter 1B Parameter), die auf bescheidener Laptop- und Browser-Hardware außergewöhnlich gut laufen.",
      ],
      callout:
        "PrivateNotes Browser-KI nutzt **Gemma 2 2B** und **Qwen3 0.6B** über WebLLM—Open-Weight-Modelle, die für WebGPU kompiliert sind, kein proprietärer geschlossener Checkpoint. Größere **Gemma-4**-Varianten erscheinen im optionalen Cloud-Assist-Pfad, nicht in Write with Private AI heute.",
    },
    {
      title: "Stand der Technik im Jahr 2026",
      paragraphs: [
        "Die Frontier ist gespalten. Geschlossene APIs von OpenAI, Anthropic und Google führen weiterhin bei roher Leistungsfähigkeit, Tool-Nutzung im großen Maßstab und den größten Kontextfenstern. Aber Open Weights sind für viele reale Workflows nah genug dran—und bei **Datenschutz, Kostenkontrolle und Anpassung** vorn.",
        "Unter Open-Modellen repräsentieren **Gemma 4**, **Llama 4**, **Qwen 3** und große **Mistral**-Checkpoints die aktuelle Generation: besseres Befolgen von Anweisungen, verbesserte Programmierung und Mathematik sowie zuverlässigere Ablehnungen bei sensiblen Prompts. Kleinere destillierte Varianten bringen einen bedeutsamen Teil dieser Qualität auf Laptops und in Browser.",
        "Multimodale Modelle (Text + Bild) wachsen sowohl in Cloud- als auch in Open-Veröffentlichungen, aber für Notizen und geheime Übergaben bleiben reine Text-Kleinmodelle der Sweet Spot: schnell genug für interaktives Arbeiten, klein genug, um lokal zu bleiben.",
      ],
    },
    {
      title: "Private KI in PrivateNote: Write with Private AI",
      paragraphs: [
        "PrivateNote ist für verschlüsselte, ephemere Notizen gebaut—nicht dafür, Ihren gesamten KI-Stack zu ersetzen. Dennoch ist das Entwerfen einer sensiblen Nachricht genau der Bereich, in dem browserseitige KI glänzt: Sie erhalten Schreibhilfe **vor** der Verschlüsselung, ohne Ihren Text zur Inferenz an unsere Server zu senden.",
        "Öffnen Sie [PrivateNote](app:home) und wählen Sie **Write with Private AI**. Es gibt keinen manuellen Modell-Picker—auf unterstützten Desktops mit WebGPU entscheidet Ihre Geräteklasse, welcher Checkpoint läuft:",
        "Seien Sie ehrlich über die Kompromisse. Gewichte werden in den Browser-Speicher geladen und die Inferenz läuft lokal—aber Browser-KI ist **langsamer** als ein Cloud-Rechenzentrum und kann die **großen Kontextfenster** von Server-Modellen nicht erreichen. Sie ist auch hardwareabhängig: Viele Smartphones und ältere Laptops fallen auf Tippen ohne KI oder auf optionales Cloud Assist zurück. Für den Entwurf einer kurzen privaten Notiz, einer Passwort-Übergabenachricht oder einer vertraulichen Antwort ist sie jedoch **durchaus leistungsfähig**—und die Datenschutzeigenschaften unterscheiden sich grundlegend von Einfügen-in-ChatGPT-Workflows.",
      ],
      bullets: [
        "**Bescheidene Hardware** — Lädt **Qwen3 0.6B** und führt die Inferenz lokal über WebGPU aus.",
        "**Leistungsfähige Desktops** — Lädt **Gemma 2 2B** und führt die Inferenz lokal über WebGPU aus.",
        "**Privat durch Architektur** — Mit Write with Private AI wird Ihr Entwurf im Browser verarbeitet. Er wird nicht zur Modell-Inferenz an PrivateNote-Server gesendet.",
        "**Nach dem Entwurf verschlüsseln** — Sobald Sie mit dem Text zufrieden sind, wird die Notiz lokal verschlüsselt, bevor sie hochgeladen wird—dasselbe Modell wie bei jeder anderen PrivateNote.",
        "**Optionales Cloud Assist** — Wenn Ihr Gerät keine lokalen Modelle ausführen kann, können Sie Cloud Assist aktivieren (Google **Gemma 4 26B** über Cloudflare Workers AI). Dieser Pfad ist schneller und leistungsfähiger, aber **nicht vollständig privat**—Ihr Prompt verlässt das Gerät im Klartext und Sie müssen ihn ausdrücklich aktivieren. Siehe [wie PrivateNote funktioniert](app:how-it-works) für den vollständigen Vergleich.",
        "**Das richtige Werkzeug für die Aufgabe** — Nutzen Sie Browser-Private-KI für sensible Entwürfe. Nutzen Sie Ollama oder einen Heim-GPU-Server, wenn Sie lange Dokumente, riesige Kontexte oder die größten Open-Modelle brauchen.",
      ],
      callout:
        "Private KI im Browser versucht nicht, Frontier-Cloud-Modelle in Benchmarks zu schlagen. Sie versucht, **privates Entwerfen praktikabel** zu machen—für die Notizen, die Menschen bereits in PrivateNote erstellen.",
    },
    {
      title: "Die richtige Private-KI-Einrichtung wählen",
      paragraphs: [
        "Wenn Sie neu bei privater KI sind, starten Sie einfach: Installieren Sie Ollama und probieren Sie einen mittelgroßen Llama- oder Gemma-Checkpoint für alltägliches Schreiben auf Ihrem Laptop.",
        "Wenn Ihr Bedrohungsmodell verlangt, dass Entwürfe das Gerät niemals verlassen—selbst vor der Verschlüsselung—nutzen Sie browserseitige Tools, einschließlich Write with Private AI in PrivateNote. Datensouveränität und intelligente Automatisierung widersprechen sich nicht mehr; Sie passen einfach die Sensibilität des Textes an die Architektur an, die ihn verarbeitet.",
        "Wenn Sie ein Team absichern, evaluieren Sie einen gemeinsamen GPU-Server mit vLLM und Zugriffskontrollen—und lesen Sie [KI-Agenten wie Mitarbeiter absichern](blog:securing-ai-agents-like-employees), um zu verstehen, wie agentische Systeme die Vertrauensgrenze verändern. Für Entwickler, die Agenten in Workflows einbinden, siehe [PrivateNote für Entwickler](blog:privatenote-for-developers) und die [Codex-MCP-Integration](blog:privatenote-codex).",
      ],
    },
  ],
  closingTitle: "Privates Entwerfen in Ihrem Browser ausprobieren",
  closingBody: [
    "Öffnen Sie PrivateNote, wählen Sie Write with Private AI und entwerfen Sie Ihre nächste sensible Notiz, ohne sie an ein externes Cloud-Modell zu senden. Verschlüsseln Sie sie, wenn Sie bereit sind—und teilen Sie dann einen sicheren Einmal-Link.",
  ],
  fileSharingNote:
    "Müssen Sie auch Dateien teilen? [Sicherer Dateitransfer](app:secure-file-transfer) nutzt dieselbe browserseitige Verschlüsselung. Zum Senden ist ein kostenloses Konto erforderlich; Empfänger können Links ohne Anmeldung öffnen.",
  tagline: "Lokal entwerfen. Zuerst verschlüsseln. Link teilen.",
  relatedReading: "Weiterführende Artikel",
  relatedPosts: [
    {
      slug: "securing-ai-agents-like-employees",
      blurb:
        "Wenn KI-Agenten Werkzeuge und Gedächtnis erhalten, muss Sicherheit das gesamte System regeln—nicht nur das Modell.",
    },
    {
      slug: "privatenote-for-developers",
      blurb:
        "Geheimnisse aus VS Code, Cursor oder einem KI-Agenten teilen, ohne sie in den Chat-Verlauf einzufügen.",
    },
    {
      slug: "how-to-make-a-private-note",
      blurb:
        "Vor dem Upload verschlüsseln, einen Link teilen und die Notiz ablaufen lassen—Schritt für Schritt.",
    },
    {
      slug: "what-is-end-to-end-encryption",
      blurb:
        "Wer die Schlüssel hält und warum Browser-Verschlüsselung mehr ist als allein HTTPS.",
    },
    {
      slug: "privacy-tools",
      blurb:
        "Einen praktischen Datenschutz-Stack für 2026 nach Aufgabe zusammenstellen—nicht nach Hype.",
    },
    {
      slug: "workplace-texts-private-note",
      blurb:
        "Warum ephemere Notizen dauerhaften Chat-Protokollen für sensible Arbeitsplatznachrichten überlegen sind.",
    },
  ],
};
