import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionDe: E2eeDefinitionArticleCopy = {
  intro: [
    "Ende-zu-Ende-Verschluesselung gehoert zu den meistverwendeten Begriffen im Sicherheitsmarketing. Gleichzeitig laesst sich der Begriff leicht verwaessern. Die eigentliche Definition lautet nicht einfach, dass Daten irgendwo verschluesselt werden. Entscheidend ist, wer sie entschluesseln kann.",
    "Wenn der Dienstanbieter die Schluessel besitzt, sie wiederherstellen kann oder im normalen Betrieb Klartext erhaelt, ist das System vielleicht verschluesselt, aber nicht im strengen Sinn ende-zu-ende-verschluesselt.",
  ],
  definitionTitle: "Die kuerzeste sinnvolle Definition",
  definitionBody:
    "Ende-zu-Ende-Verschluesselung bedeutet: Nur die Endpunkte besitzen die Schluessel, die zum Entschluesseln der Daten noetig sind. Der Dienstanbieter kann Chiffretext speichern oder weiterleiten, sollte aber weder die Schluessel noch den Klartext besitzen.",
  tableHeaders: ["Modell", "Verschluesselung", "Sieht der Server Klartext?", "Hat der Server Schluessel?"],
  tableRows: [
    { model: "Transportsicherheit (TLS)", happens: "Zwischen Browser und Server", plaintext: "Ja, auf dem Server", keys: "Ja, fuer serverseitige Verarbeitung" },
    { model: "Schwache browserseitige Verschluesselung", happens: "Auf dem Geraet", plaintext: "Moeglicherweise", keys: "Ja, wenn Schluessel hochgeladen oder wiederherstellbar sind" },
    { model: "Echte E2EE", happens: "An den Endpunkten", plaintext: "Nein", keys: "Nein" },
  ],
  flowNodes: [
    { title: "Browser des Absenders", body: "Verschluesselt lokal vor dem Upload" },
    { title: "PrivateNote-Speicher", body: "Speichert nur Chiffretext" },
    { title: "Browser des Empfaengers", body: "Entschluesselt mit dem Fragment-Schluessel" },
  ],
  sections: [
    {
      title: "Verschluesselung ist nicht automatisch Ende-zu-Ende-Verschluesselung",
      paragraphs: [
        "Die meisten serioesen Webdienste verwenden TLS. Das ist wichtig: TLS schuetzt Daten auf dem Weg zwischen Ihrem Browser und dem Server und verhindert, dass Angreifer im lokalen Netzwerk die Verbindung mitlesen.",
        "Aber TLS endet am Server. Sobald die Anfrage dort ankommt, kann der Dienst in der Regel den Klartext sehen. Der Anbieter kann ihn dann speichern, scannen, indexieren, verarbeiten oder erneut verschluesselt ablegen, mit Schluesseln, die er selbst kontrolliert.",
        "Das ist verschluesselter Transport. Fuer sich allein ist es keine Ende-zu-Ende-Verschluesselung.",
      ],
      callout: "Der Praxistest ist einfach: Kann der Anbieter den Entschluesselungsschluessel oder den Klartext erhalten? Wenn ja, ist das System nicht wirklich ende-zu-ende-verschluesselt.",
    },
    {
      title: "Die kryptografische Definition",
      paragraphs: [
        "Eine praezise Definition von E2EE beginnt beim Besitz der Schluessel. In einem echten Ende-zu-Ende-System werden Verschluesselungs- und Entschluesselungsschluessel von den Endpunkten erzeugt und gehalten, nicht vom Zustelldienst.",
        "Der Server kann Chiffretext weiterleiten, speichern, begrenzen und loeschen. Er kann den Dienst betreiben. Aber er besitzt nicht das Schluesselmaterial, das noetig waere, um Chiffretext wieder in lesbare Inhalte zu verwandeln.",
        "Matthew Greens bekannte Analyse der Zoom-Verschluesselungsdebatte bringt diesen Punkt klar auf den Punkt: Die zentrale Eigenschaft ist nicht nur, dass Verschluesselung existiert, sondern dass die Entschluesselungsschluessel dem Anbieter nicht zur Verfuegung stehen.",
      ],
      bullets: [
        "Der sendende Endpunkt kann die Daten verschluesseln.",
        "Der empfangende Endpunkt kann die Daten entschluesseln.",
        "Der zwischengeschaltete Server verarbeitet nur Chiffretext.",
        "Eine Serverkompromittierung sollte keine Klartextinhalte offenlegen.",
      ],
    },
    {
      title: "Browserseitige Verschluesselung kann trotzdem zu kurz greifen",
      paragraphs: [
        "Browserseitige Verschluesselung bedeutet, dass die kryptografische Operation lokal vor dem Upload passiert. Das ist fuer viele E2EE-Designs notwendig, reicht allein aber nicht aus.",
        "Ein Dienst koennte Daten im Browser verschluesseln und anschliessend sowohl den Chiffretext als auch den passenden Schluessel an sein Backend hochladen. Die Verschluesselung fand browserseitig statt, aber der Anbieter hat trotzdem den Schluessel. Damit ist die Ende-zu-Ende-Grenze gebrochen.",
        "Die entscheidende Unterscheidung ist exklusiver Schluesselbesitz. Wenn der Anbieter auf den verwendbaren Schluessel zugreifen, ihn wiederherstellen, rotieren, hinterlegen oder neu erzeugen kann, vertraut der Nutzer dem Anbieter weiterhin mit Klartextzugriff.",
      ],
    },
    {
      title: "Wie Notizen mit URL-Fragment in dieses Modell passen",
      paragraphs: [
        "PrivateNote nutzt eine browserbasierte Variante dieser Architektur fuer Einmal-Notizen. Der Browser des Absenders verschluesselt die Notiz lokal. Die verschluesselte Nutzlast wird gespeichert. Der Entschluesselungsschluessel liegt im URL-Fragment, also im Teil nach dem #-Zeichen.",
        "Browser senden das URL-Fragment nicht in der HTTP-Anfrage an den Server. Der Server erhaelt also den Chiffretext, aber nicht den Schluessel. Wenn der Empfaenger den Link oeffnet, liegt das Fragment lokal im Browser vor und die Notiz kann nach dem Anzeigen entschluesselt werden.",
        "Das ist nicht dieselbe Topologie wie bei Signal oder MLS, wo Endpunkte meist konto-gebundene Geraete mit dauerhaften oeffentlichen Schluesseln sind. Die zentrale Sicherheitseigenschaft ist aber dieselbe: Der Speicheranbieter besitzt nicht den Schluessel, der zum Entschluesseln der Inhalte noetig ist.",
      ],
    },
    {
      title: "Der Zustellkanal bleibt wichtig",
      paragraphs: [
        "Ein einmaliger verschluesselter Link ist nuetzlich, aber der vollstaendige Link wird sensibel, weil er den Entschluesselungsschluessel im Fragment enthaelt. Wenn Sie diesen Link in einen Kanal kopieren, der Nachrichten protokolliert, Verlaeufe synchronisiert oder administrativ ueberwacht wird, kann dieser Kanal das Geheimnis offenlegen, bevor es geoeffnet wird.",
        "Deshalb sind Ablaufzeiten, Einmal-Lesen und optionale Passwoerter operativ wichtig. Sie veraendern nicht die Definition von E2EE, verringern aber den Schaden, wenn ein Link weitergeleitet, protokolliert oder von Software als Vorschau verarbeitet wird.",
        "Bei besonders sensiblen Inhalten sollten Sie den Link ueber einen Kanal senden und das optionale Passwort ueber einen anderen. So trennen Sie den Besitz der verschluesselten Nutzlast vom Besitz des menschlichen Geheimnisses.",
      ],
    },
    {
      title: "Der Hinweis zu Offline-Brute-Force",
      paragraphs: [
        "Passwortschutz ergaenzt die Verteidigung, hat aber eine echte kryptografische Einschraenkung. Wenn ein Angreifer den vollstaendigen Link erhaelt und den Chiffretext vor Ablauf herunterlaedt, kann das Erraten des Passworts zu einem Offline-Angriff werden. Die Rate Limits des Servers helfen dann nicht mehr, weil der Angreifer lokal gegen den Chiffretext pruefen kann.",
        "PrivateNote verwendet Argon2id fuer passwortgeschuetzte Notizen. Argon2id ist eine speicherharte Schluesselableitungsfunktion und erhoeht die Kosten jedes Passwortversuchs, besonders bei GPU-lastigen Brute-Force-Angriffen.",
        "Das macht schwache Passwoerter nicht sicher. Ein kurzes oder wiederverwendetes Passwort kann weiterhin scheitern. Je staerker das optionale Passwort ist, desto nuetzlicher wird diese zweite Schutzschicht.",
      ],
    },
    {
      title: "Warum die Architektur zaehlt",
      paragraphs: [
        "E2EE veraendert das Vertrauensmodell. Bei gewoehnlicher verschluesselter Speicherung verlassen sich Nutzer auf Anbieterregeln, Mitarbeiterkontrollen, rechtliche Prozesse und Schutz vor Datenpannen. Bei Ende-zu-Ende-Verschluesselung ist der Anbieter strukturell begrenzt: Er kann verschluesselte Daten speichern, aber nicht entschluesseln.",
        "Das beseitigt nicht jedes Risiko. Malware auf Endgeraeten, boesartige Browser-Erweiterungen, kopierte Links, schwache Passwoerter und unsichere Zustellkanaele bleiben relevant. Kryptografie verkleinert die Vertrauensgrenze; sie ersetzt kein operatives Urteilsvermoegen.",
        "Der Wert ist trotzdem erheblich: Ein Datenbankleck sollte unlesbaren Chiffretext offenlegen, nicht Nachrichteninhalte. Das ist der Unterschied zwischen dem Versprechen, Daten nicht zu lesen, und der technischen Unfaehigkeit, sie ueberhaupt zu lesen.",
      ],
    },
  ],
  continueReadingTitle: "Weiterlesen",
  referencesTitle: "Quellen",
  references: [
    { label: "Matthew Green, \"Does Zoom use end-to-end encryption?\"", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
