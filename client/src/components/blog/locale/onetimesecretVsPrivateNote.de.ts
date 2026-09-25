import type { OnetimesecretVsPrivateNoteArticleCopy } from "./onetimesecretVsPrivateNote.types";

export const onetimesecretVsPrivateNoteDe: OnetimesecretVsPrivateNoteArticleCopy = {
  intro: [
    "OneTimeSecret und PrivateNote lösen dasselbe praktische Problem: ein Passwort, einen API-Schlüssel, einen Recovery-Code oder eine vertrauliche Notiz über einen temporären Link zu übermitteln, statt Klartext in E-Mail oder Chat zu hinterlassen. Der Empfänger öffnet den Link, und die gespeicherte Nutzlast kann nach dem Lesen oder bei Erreichen der Ablaufzeit verschwinden.",
    "Beide Produkte verschlüsseln die Nutzlast. Der entscheidende Unterschied liegt darin, wo die Verschlüsselung stattfindet.",
    "OneTimeSecret beschreibt seine Architektur als serverseitige Verschlüsselung. Der Klartext erreicht OneTimeSecret, bevor er verschlüsselt wird. PrivateNote verschlüsselt zuerst lokal, sodass der Dienst Chiffretext statt der Klartext-Nutzlast erhält. Dieser Unterschied bestimmt die kryptografische Vertrauensgrenze.",
  ],
  sections: [
    {
      title: "Zwei Wege, denselben Link zu bauen",
      paragraphs: [
        "Bei **serverseitiger Verschlüsselung** übermittelt der Absender das Geheimnis über TLS an den Dienst. Der Dienst empfängt den Klartext, verschlüsselt ihn und speichert Chiffretext. Anschließend kann er die Nutzlast speichern, ausliefern, ablaufen lassen und löschen. Der Anwendungsserver ist Teil des Verschlüsselungsprozesses, weil Klartext in den Dienst gelangt, bevor daraus Chiffretext wird.",
        "Bei **clientseitiger Verschlüsselung** verschlüsselt zuerst das Gerät des Absenders. Der Dienst empfängt und speichert Chiffretext. Dieser Upload läuft über TLS. Der Dienst erhält nicht den Schlüssel, der nötig wäre, um eine Standard-Nutzlast zu entschlüsseln. Das Gerät des Empfängers entschlüsselt lokal. Der Dienst kann die Nutzlast weiterhin speichern, ausliefern, ablaufen lassen und löschen, ohne Zugriff auf ihren Klartext zu brauchen.",
        "Beide Designs können temporäre Links, begrenzten Zugriff und Ablaufzeiten bieten. Beide lassen sich korrekt als verschlüsselt beschreiben. OneTimeSecret nutzt die erste Architektur; PrivateNote die zweite. Die relevante Frage ist daher nicht einfach, ob ein Einmal-Link verschlüsselt ist, sondern welche Systeme Zugriff auf Klartext haben müssen, damit dieser Link funktioniert.",
      ],
    },
    {
      title: "OneTimeSecret: serverseitige Verschlüsselung",
      paragraphs: [
        "Im gewöhnlichen OneTimeSecret-Ablauf übermittelt der Absender das Geheimnis über TLS. Die Anwendung empfängt den Klartext, verschlüsselt ihn auf dem Server und speichert die verschlüsselte Nutzlast.",
        "Das bietet einen sinnvollen Schutz für gespeicherte Daten. Allein der Besitz verschlüsselter Speicherung offenbart den Inhalt nicht zwingend, wenn dem Angreifer das zur Entschlüsselung nötige Material fehlt.",
        "Der architektonische Kompromiss entsteht vor dem Speichern. TLS schützt das Geheimnis auf dem Weg zwischen Browser und OneTimeSecret, aber die Anwendung muss den Klartext verarbeiten, um ihn zu verschlüsseln. Der Anwendungsserver liegt daher innerhalb der kryptografischen Vertrauensgrenze.",
        "Ein bösartiger oder kompromittierter Anwendungsprozess könnte in diesem Moment auf das Geheimnis zugreifen, bevor es für die Speicherung verschlüsselt wird. Clientseitige Verschlüsselung entfernt genau diese Abhängigkeit, indem das Geheimnis verschlüsselt wird, bevor es den Dienst erreicht.",
      ],
    },
    {
      title: "Die Passphrase von OneTimeSecret ändert die Verschlüsselungsgrenze nicht",
      paragraphs: [
        "Die Dokumentation von OneTimeSecret beschreibt eine optionale Passphrase. Wird eine Passphrase verwendet, verschlüsselt OneTimeSecret laut eigener Aussage das Geheimnis auf seinen Servern mit der vom Absender gelieferten Passphrase. Die Passphrase selbst wird nicht gespeichert; stattdessen behält OneTimeSecret einen bcrypt-Hash zur Überprüfung der Passphrase beim Abruf. Laut Dokumentation kann dieser Hash das Geheimnis selbst nicht entschlüsseln, und das gespeicherte, passphrase-geschützte Geheimnis lässt sich ohne die Original-Passphrase nicht entschlüsseln.",
        "Der Abruf nutzt dieselbe serverseitige Grenze. Der Empfänger übermittelt die Passphrase über TLS an OneTimeSecret. Der Dienst prüft sie und führt die Entschlüsselung auf dem Server durch, bevor der Klartext zurückgegeben wird.",
        "Das bedeutet: Der Anwendungsprozess hat Zugriff auf Geheimnis und Passphrase, wenn die Verschlüsselung stattfindet, und verarbeitet beim Abruf erneut die Passphrase und den resultierenden Klartext. Ein bösartiger oder kompromittierter Anwendungsprozess an einem dieser Punkte könnte diese Informationen potenziell erfassen. Das ist eine Folge davon, wo Verschlüsselung und Entschlüsselung ausgeführt werden — kein Vorwurf, dass OneTimeSecret diese Werte speichert oder missbraucht.",
        "Die öffentliche Dokumentation von OneTimeSecret legt für sich genommen nicht jedes Detail der internen Schlüsselhierarchie fest — etwa, wie genau serverseitiges Schlüsselmaterial, Schlüssel pro Geheimnis, Schlüsselableitung und die gelieferte Passphrase kombiniert werden. Für diesen Vergleich muss man über diese Implementierungsdetails nicht spekulieren. Die relevante dokumentierte Eigenschaft ist, dass Verschlüsselung und Entschlüsselung auf der Seite des Dienstes stattfinden.",
      ],
      diagrams: [
        {
          label: "OneTimeSecret",
          caption:
            "Das Geheimnis, das Sie senden möchten, und die Passphrase, wenn Sie eine setzen, gelangen beide über TLS zum Server. Die Verschlüsselung läuft auf diesem Server. Was in der Speicherung bleibt, ist Chiffretext.",
          columns: [
            [
              { text: "Geheimnis + Passphrase", via: "TLS" },
              { text: "Server", via: "Verschlüsseln" },
              { text: "Chiffretext" },
            ],
          ],
        },
      ],
    },
    {
      title: "Self-Hosting kann dieses Serververtrauen vertretbar machen",
      paragraphs: [
        "OneTimeSecret ist Open Source. Eine Organisation kann eine eigene Instanz innerhalb eines Unternehmens-Sicherheitsperimeters betreiben, statt Geheimnisse an den öffentlichen Dienst zu senden.",
        "In diesem Deployment bedeutet Vertrauen in den Anwendungsserver Vertrauen in Infrastruktur, die die Organisation bereits betreibt. Der Klartext erreicht diesen Server weiterhin, weil die Verschlüsselung weiterhin dort stattfindet. Die Partei auf der anderen Seite der Grenze sind die eigenen Hosts, Betreiber und Backups der Organisation. Für ein Team, das diese Systeme bereits als Teil des Pfads akzeptiert, den ein Geheimnis nimmt, kann serverseitige Verschlüsselung eine vernünftige Wahl sein. Sie verringert den Abstand zwischen den serverseitigen und clientseitigen Bedrohungsmodellen, weil der Betreiber kein externer Dienst mehr ist.",
      ],
    },
    {
      title: "PrivateNote verschlüsselt vor dem Upload",
      paragraphs: [
        "Eine Standard-PrivateNote wird vor dem Upload verschlüsselt. Der Browser des Absenders — oder ein lokaler [CLI](app:developers/cli)-, [Chrome-Erweiterung](app:developers/chrome)-, [Editor-Erweiterung](app:developers/vscode)- oder [MCP](app:developers/mcp)-Prozess — erzeugt einen zufälligen Schlüssel und verschlüsselt die Nutzlast mit AES-256-GCM. Hochgeladen wird nur Chiffretext. TLS transportiert diesen Chiffretext vom Browser zum Cloudflare-Worker von PrivateNote. Der Entschlüsselungsschlüssel liegt im URL-Fragment, dem Teil nach `#`, zum Beispiel `https://privatenote.ai/note/abc123#…`. Das Fragment wird clientseitig verarbeitet und ist nicht in der HTTPS-Anfrage enthalten ([RFC 3986, §3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5); [URL Standard](https://url.spec.whatwg.org/#concept-url-fragment)). Der Worker empfängt eine Notiz-ID und gibt Chiffretext über dieselbe TLS-Verbindung zurück. Der Browser behält das Fragment und entschlüsselt lokal.",
      ],
    },
    {
      title: "Eine Passphrase schützt den Schlüssel, wenn der Link-Kanal kompromittiert ist",
      paragraphs: [
        "Eine Passphrase bei PrivateNote erfüllt eine andere Aufgabe als eine Passphrase bei OneTimeSecret. Die Notiz ist bereits Chiffretext, bevor sie das Gerät verlässt. Fügen Sie eine Passphrase hinzu, leitet der Browser daraus mit Argon2id einen Wrapping-Schlüssel ab und verschlüsselt damit den Notizschlüssel. Das URL-Fragment hält dann den eingewickelten Schlüssel. Der Empfänger braucht den Link und die Passphrase. Der Browser wickelt den Schlüssel lokal aus und entschlüsselt erst dann die Notiz.",
        "PrivateNote empfängt die Passphrase nicht. Die Create-Anfrage trägt Chiffretext, ein Salt und die Parameter, die der Browser des Empfängers braucht, um die Passphrase lokal zu versuchen. Es gibt keinen serverseitigen Hash, dessen Aufgabe die Passphrase-Prüfung wäre. Eine falsche Passphrase scheitert bei der Entschlüsselung auf dem Gerät.",
        "Die Passphrase schützt den clientseitigen Schlüssel zusätzlich lokal, wenn der Kanal, der den Link trägt, kompromittiert wird. Dieser Kanal sieht dann einen eingewickelten Schlüssel, keinen Schlüssel, der die Notiz allein öffnen kann. Das ist nicht der Mechanismus, der PrivateNote außerhalb des Klartext-Pfads hält. Diese Trennung besteht bei einer Standard-Notiz bereits — mit oder ohne Passphrase. Teilen Sie die Passphrase über einen anderen Kanal als den Link. Dieselbe Nachricht kollabiert die beiden Schichten zu einer — dieselbe Regel wie beim [sicheren Teilen eines Passworts](blog:how-to-share-a-password-securely).",
      ],
      diagrams: [
        {
          label: "PrivateNote",
          caption:
            "Lokale Verschlüsselung erzeugt den clientseitigen Schlüssel und den Chiffretext. Argon2id wickelt diesen Schlüssel ein, und der eingewickelte Schlüssel bleibt im URL-Fragment. TLS trägt nur den Chiffretext zum Cloudflare-Worker.",
          columns: [
            [
              { text: "Geheimnis" },
              { text: "Lokale Verschlüsselung" },
              { text: "Chiffretext", via: "TLS" },
              { text: "Server" },
            ],
            [
              { text: "Passphrase" },
              { text: "Lokales Argon2id" },
              { text: "Schlüssel einwickeln" },
              { text: "URL-Fragment" },
            ],
          ],
        },
      ],
      comparisonTable: {
        lead: "Dieselbe Trennung, Eigenschaft für Eigenschaft.",
        headers: ["", "OneTimeSecret + Passphrase", "PrivateNote + Passphrase"],
        rows: [
          ["Verschlüsselung der Nutzlast", "Server", "Gerät des Absenders"],
          ["Klartext erreicht den Dienst", "Ja", "Nein"],
          ["Passphrase erreicht den Dienst", "Ja", "Nein"],
          [
            "Rolle der Passphrase",
            "Beteiligt am serverseitigen Schutz",
            "Leitet einen lokalen Wrapping-Schlüssel ab",
          ],
          [
            "Gespeicherter Verifier oder Material",
            "bcrypt-Verifier und verschlüsselte Nutzlast, laut Dokumentation von OneTimeSecret",
            "Salt, Argon2id-Wrap-Parameter und Chiffretext",
          ],
          ["Wo die Entschlüsselung ausgeführt wird", "Anwendungsserver von OneTimeSecret", "Gerät des Empfängers"],
        ],
      },
      paragraphsAfterTable: [
        "Die Schlüsselbehandlung von PrivateNote ist unter [So funktioniert es](app:how-it-works) beschrieben: Der Inhaltsschlüssel wird mit Argon2id eingewickelt, und der eingewickelte Schlüssel reist im Link.",
      ],
    },
    {
      title: "Die verbleibende Vertrauensannahme beim Web-Client",
      paragraphs: [
        "Clientseitige Verschlüsselung im Browser ist keine vertrauenslose Webanwendung. Die Kryptografie kann lokal laufen, während das JavaScript, das sie implementiert, von der Website ausgeliefert wird. Der Browser vertraut dem Code, den er für diese Sitzung erhält.",
        "Wer dieses JavaScript ändern kann — über die Anwendung, ein CDN oder die Deployment-Pipeline — könnte den Client verändern und in einer künftigen Browser-Sitzung Schlüssel erfassen. Das ist ein anderer Fehler als der Diebstahl einer Datenbank. Eine Speicher-Kompromittierung legt Chiffretext offen. Bösartige Code-Auslieferung greift den Endpunkt an, während der Schlüssel tatsächlich vorhanden ist.",
        "Ein späterer Datenbank-Dump kann keine clientseitigen Schlüssel erzeugen, die dort nie gespeichert waren. Ein aktiv kompromittierter Client kann Geheimnisse angreifen, die in dieser Sitzung verarbeitet werden. Dieselbe Annahme steht im Bedrohungsmodell von PrivateNote: Der ausgelieferte Anwendungscode wurde nicht böswillig verändert, und die Geräte von Absender und Empfänger sind im Moment von Verschlüsselung und Entschlüsselung vertrauenswürdig.",
        "Installierte Software verringert die Abhängigkeit von einer frisch heruntergeladenen Seite. Eine CLI, eine Editor-Erweiterung oder eine native App führt Code aus, den Sie installiert haben. Diese Clients hängen weiterhin vom Betriebssystem, von Signierung, Abhängigkeiten und dem Update-Kanal ab. Die [Entwickler-Tools](app:developers) nutzen dieselbe Trennung wie der Browser: lokal verschlüsseln, Chiffretext hochladen, den Schlüssel im Fragment belassen.",
      ],
    },
    {
      title: "Lebensdauer und Vertraulichkeit",
      paragraphs: [
        "Ein Einmal-Link beantwortet zwei getrennte Fragen. Wie lange soll die verschlüsselte Nutzlast existieren? Und wer kann sie entschlüsseln, solange sie existiert? Zerstörung nach Abruf oder Ablauf verkürzt das Fenster. Sie entscheidet nicht, wer sie in diesem Fenster lesen könnte. Lebensdauer und Vertraulichkeit stützen einander. Das eine ersetzt das andere nicht.",
        "Die Unterscheidung wird am schärfsten, wenn die Nutzlast Autorität ist: API-Schlüssel, Datenbank-Zugangsdaten, Cloud-Tokens, Recovery-Codes, Infrastruktur-Passwörter. Ein Secret-Sharing-Dienst existiert, weil der Absender weniger Systemen diese Information anvertrauen will. Wenn der Vermittler nur ein undurchsichtiges verschlüsseltes Objekt tragen, Ablauf erzwingen und löschen muss, kann der Server diese Arbeit leisten, ohne das Geheimnis oder den Schlüssel zu erhalten, der es öffnet.",
      ],
    },
    {
      title: "Wo die Grenze liegt",
      paragraphs: [
        "„Verschlüsselt“ sagt nicht, wo die Vertrauensgrenze liegt. Der brauchbare Maßstab ist eine minimale Vertrauensgrenze: das Prinzip der geringsten Rechte angewandt darauf, wer Klartext sehen muss. In der modernen kryptografischen Technik geht es nicht nur darum, dem Verhalten eines Servers zu vertrauen, sondern die mathematische Notwendigkeit von Vertrauen von vornherein zu verringern.",
        "OneTimeSecret beschreibt ein serverseitig verschlüsseltes System. Mit Passphrase-Schutz sagt es, dass das gespeicherte Geheimnis anschließend ohne die Passphrase nicht entschlüsselt werden kann und dass eine Server-Kompromittierung das Geheimnis sicher ließe, solange diese Passphrase unbekannt bleibt. Eine schwache Passphrase kann per Brute-Force angegriffen werden. Ist sie schwach, kann die Kompromittierung das Geheimnis trotzdem wiederherstellbar lassen. Klartext und Passphrase erreichen OneTimeSecret bei der Erstellung, weil die Verschlüsselung auf dessen Servern stattfindet, und die Passphrase wird beim Abruf zurückgeschickt, damit diese Server entschlüsseln können.",
        "PrivateNote trifft eine andere architektonische Wahl. Die Nutzlast wird verschlüsselt, bevor sie den Dienst erreicht, und der Standard-Nutzlastschlüssel bleibt clientseitig. Eine Passphrase, wenn Sie eine setzen, schützt diesen clientseitigen Schlüssel zusätzlich lokal, wenn der Kanal, der den Link trägt, kompromittiert wird. Sie wird nicht an PrivateNote gesendet.",
        "OneTimeSecret verschlüsselt Ihr Geheimnis. Der Client, der den PrivateNote-Dienst nutzt, verschlüsselt es, bevor der Dienst es erhält. Diese Unterscheidung hängt nicht davon ab, einen der Anbieter als böswillig anzunehmen. Sie reduziert die Frage auf Architektur: Wie viele Systeme brauchen Zugriff auf Klartext, damit der Dienst funktioniert?",
      ],
    },
    {
      title: "Häufige Fragen",
      faqs: [
        {
          question: "Speichert OneTimeSecret das Geheimnis im Klartext?",
          answer:
            "Ihre Dokumentation sagt nein. Sie verschlüsseln auf ihren Servern. Mit einer Passphrase speichern sie laut eigener Aussage das verschlüsselte Geheimnis und einen bcrypt-Hash der Passphrase, nicht die Passphrase, und der Hash kann das Geheimnis nicht entschlüsseln.",
        },
        {
          question: "Wenn ich bei OneTimeSecret eine Passphrase setze, ist das Geheimnis vor ihren Servern verborgen?",
          answer:
            "Nicht während der Erstellung und nicht beim Abruf. OneTimeSecret sagt, dass Geheimnis und Passphrase dem Server übergeben werden, damit der Server die Verschlüsselung ausführen kann. Wenn der Empfänger den Link öffnet, sendet er die Passphrase über TLS zurück, und die Entschlüsselung läuft auf den Servern von OneTimeSecret, bevor der Klartext zurückgegeben wird. Nach der Verschlüsselung verwirft OneTimeSecret laut eigener Aussage die Klartext-Passphrase, behält nur einen bcrypt-Hash und kann das gespeicherte Geheimnis ohne die Original-Passphrase nicht entschlüsseln.",
        },
        {
          question: "Was schützt eine PrivateNote-Passphrase?",
          answer:
            "Den clientseitigen Schlüssel, wenn der Kanal, der den Link trägt, kompromittiert ist. Die Notiz selbst ist auf Ihrem Gerät bereits mit AES-256-GCM verschlüsselt. Argon2id leitet lokal einen Wrapping-Schlüssel aus der Passphrase ab, und dieser Wrapping-Schlüssel verschlüsselt den Notizschlüssel. Der Link hält dann einen eingewickelten Schlüssel. PrivateNote empfängt Chiffretext und ein Salt. Es empfängt weder die Passphrase noch den Rohschlüssel. Eine Standard-Notiz ist auch ohne Passphrase vor dem Upload verschlüsselt. Senden Sie die Passphrase über einen separaten Kanal vom Link.",
        },
        {
          question: "Kann clientseitige Verschlüsselung vor einem kompromittierten PrivateNote-Server schützen?",
          answer:
            "Bei einer Kompromittierung gespeicherter Daten oder der API: ja, insofern als clientseitige Verschlüsselung ungelesene Nutzlasten isoliert, weil der Server den Standard-Nutzlastschlüssel nicht hat. Ein späterer Datenbank-Dump kann keine Schlüssel erzeugen, die dort nie gespeichert waren. Bei bösartiger Client-Code-Auslieferung: nein. Ein Angreifer, der das an eine künftige Browser-Sitzung ausgelieferte JavaScript ändern kann, könnte versuchen, den Schlüssel zu erfassen, während er vorhanden ist. Installierte Clients verringern diese Abhängigkeit von einer frisch heruntergeladenen Seite.",
        },
      ],
    },
    {
      title: "Primärquellen",
      paragraphs: [
        "Architekturinformationen zu OneTimeSecret wurden am 23. September 2026 gegen die öffentliche Dokumentation geprüft. Produktimplementierungen und Dokumentation können sich ändern.",
      ],
      bullets: [
        "[OneTimeSecret documentation](https://docs.onetimesecret.com/)",
        "[OneTimeSecret on security and passphrases](https://onetimesecret.com/en/about)",
        "[OneTimeSecret source code](https://github.com/onetimesecret/onetimesecret)",
        "[So funktioniert die Verschlüsselung von PrivateNote](app:how-it-works)",
        "[PrivateNote für Entwickler](blog:privatenote-for-developers), einschließlich der CLI",
        "[RFC 3986, section 3.5](https://www.rfc-editor.org/rfc/rfc3986#section-3.5), das das Fragment vor der Dereferenzierung von der URI trennt",
        "[URL Standard, fragment](https://url.spec.whatwg.org/#concept-url-fragment), zur clientseitigen Behandlung des Fragments",
      ],
    },
  ],
  ctaTitle: "Verschlüsseln, bevor das Geheimnis das Gerät verlässt",
  ctaBody:
    "Schreiben Sie die Notiz im Browser. Der Client verschlüsselt sie lokal, legt den Schlüssel in den Link und kann diesen Schlüssel mit einer Passphrase schützen, die der Server nie empfängt.",
  ctaPrimary: "Private Notiz erstellen",
  ctaSecondary: "So funktioniert die Verschlüsselung",
};
