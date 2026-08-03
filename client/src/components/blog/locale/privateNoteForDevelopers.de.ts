import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersDe: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Sie müssen einem Kollegen ein Passwort schicken. Vielleicht geht es um die Staging-Datenbank. Vielleicht um einen Stripe-Key, der bald in Produktion geht. Vielleicht um SSH-Zugangsdaten für einen Server, auf den nur Sie und zwei andere Personen zugreifen sollen.",
    "Sie öffnen Slack. Sie beginnen zu tippen. Und dann — ein kleines, vertrautes Zögern.",
    "Diese Nachricht bleibt in Ihrem Chatverlauf. Sie synchronisiert sich auf drei Geräte. Sie kann in einem Backup, einem Suchindex oder einem Compliance-Archiv landen. Lange nachdem Sie die Zugangsdaten rotiert und vergessen haben, ist die Nachricht noch da.",
    "PrivateNote ist ein anderer Weg. Das Geheimnis wird auf Ihrem Gerät verschlüsselt, bevor es ein Netzwerk berührt. Der Entschlüsselungsschlüssel steckt nur in der URL, die Sie teilen — der Server, der die Notiz speichert, sieht ihn nie. Die Notiz löscht sich nach dem ersten Lesen selbst. Nichts bleibt erhalten.",
    "So funktioniert es — beginnend mit der einfachsten Option.",
  ],
  sections: [
    {
      title: "Die VS Code- und Cursor-Erweiterung",
      body: [
        "Wenn Sie Ihren Tag in VS Code oder Cursor verbringen, ist dies der reibungsloseste Weg. Installieren Sie die Erweiterung einmal — danach sitzt sie in Ihrer Seitenleiste, immer nur einen Klick entfernt.",
        "Öffnen Sie den Erweiterungsbereich (Cmd+Shift+X), suchen Sie nach PrivateNote und klicken Sie auf Installieren. Nach einem Fenster-Neustart erscheint links in der Aktivitätsleiste ein kleines Umschlag-Symbol.",
        "Klicken Sie darauf. Ein Seitenbereich öffnet sich:",
      ],
      bullets: [
        "Geben Sie das Geheimnis in das Inhaltsfeld ein oder fügen Sie es ein",
        "Legen Sie ein Ablaufdatum fest — 15 Minuten, 1 Stunde, 1 Tag oder 7 Tage",
        "Lassen Sie „Nach dem Lesen löschen“ aktiviert (Standard)",
        "Klicken Sie auf Private Notiz teilen →",
      ],
    },
    {
      title: "Was passiert, wenn Sie auf Teilen klicken",
      body: [
        "Die integrierte Kryptografie Ihres Browsers erzeugt einen zufälligen 256-Bit-Schlüssel. Dieser Schlüssel verlässt niemals Ihr Gerät.",
        "Der Inhalt wird mit AES-256-GCM verschlüsselt. Das Ergebnis ist ein Block aus Chiffretext ohne lesbaren Inhalt.",
        "Nur dieser Chiffretext wird an den PrivateNote-Server gesendet. Der Schlüssel ist nicht dabei — weder im Anfragekörper, noch in einem HTTP-Header, nirgendwo.",
        "Der Server speichert den verschlüsselten Datenblock und gibt eine Notiz-ID zurück. Ihr Gerät baut eine teilbare URL: die Notiz-ID im Pfad, der Entschlüsselungsschlüssel im URL-Fragment — dem #dieser-Teil, den Browser niemals an Server senden.",
        "Der Link wird in Ihre Zwischenablage kopiert. Sie fügen ihn dort ein, wo Sie sonst das Geheimnis einfügen würden. Der Unterschied: Das Geheimnis ist jetzt der Link, nicht das Passwort selbst.",
      ],
    },
    {
      title: "Zwei weitere Wege, die Erweiterung zu nutzen",
      body: [
        "Sie müssen den Seitenbereich nicht immer öffnen. Es gibt zwei schnellere Abkürzungen:",
        "Wählen Sie beliebigen Text im Editor aus und klicken Sie mit der rechten Maustaste — im Kontextmenü sehen Sie Als PrivateNote teilen. Eine Schnellauswahl fragt nach Ablauf und Löschoption, dann wird der Link in die Zwischenablage kopiert.",
        "Wenn Text ausgewählt ist, erscheint oben rechts in der Titelleiste des Editors auch ein Schloss-Symbol. Ein Klick genügt.",
      ],
    },
    {
      title: "Wenn Sie einen KI-Assistenten nutzen: der MCP-Server",
      body: [
        "Wenn Sie in Cursor mit Claude oder einem anderen Modell arbeiten, kann die KI PrivateNotes in Ihrem Namen erstellen. Der MCP-Server (Model Context Protocol) fügt ein create_private_note-Tool hinzu, das der Agent automatisch aufrufen kann.",
        "Fügen Sie dies zu ~/.cursor/mcp.json hinzu:",
      ],
      code: mcpConfig,
      bullets: [
        "Starten Sie Cursor neu und prüfen Sie Einstellungen → MCP — Sie sollten privatenote mit einem grünen Punkt sehen",
        "Sagen Sie dem Agenten dann: „Schicke diesen API-Schlüssel sicher, nach dem Lesen löschen“",
        "Der Agent ruft das Tool auf, die Verschlüsselung läuft lokal und Sie erhalten einen Link",
      ],
    },
    {
      title: "Eines über KI und Geheimnisse",
      body: [
        "Wenn Sie ein Geheimnis in einen KI-Prompt einfügen, liest das Modell es, bevor das MCP-Tool es verschlüsselt. Die Server des KI-Anbieters sehen den Inhalt kurz.",
        "Das ist trotzdem eine deutliche Verbesserung gegenüber Slack — das Geheimnis landet nicht in dauerhafter Chat-Historie, E-Mail oder Server-Logs. Aber es ist nicht dasselbe, als hätte die KI es nie gesehen.",
        "Für vollständige Ende-zu-Ende-Privatsphäre mit einem KI-Agenten nutzen Sie ein lokales Modell auf Ihrem Gerät (wie Ollama). Dann verlässt nichts Ihren Computer, bevor es bereits verschlüsselt ist.",
      ],
    },
    {
      title: "Keine Installation nötig: die Web-App",
      body: [
        "Wenn Sie nicht in VS Code sind oder auf einem Gerät ohne Ihre übliche Einrichtung arbeiten, macht die Web-App unter privatenote.ai dasselbe in jedem Browser.",
        "Fügen Sie Ihr Geheimnis ein, wählen Sie ein Ablaufdatum und klicken Sie auf Erstellen. Teilen Sie den Link. Die Verschlüsselungslogik läuft in Ihrem Browser — dasselbe AES-256-GCM, dieselbe Schlüssel-im-Fragment-Architektur.",
      ],
    },
    {
      title: "Was Sie beachten sollten",
      body: [
        "Der Link enthält den Entschlüsselungsschlüssel. Behandeln Sie die URL mit der gleichen Sorgfalt wie das Geheimnis selbst — posten Sie sie nicht in einem öffentlichen Kanal.",
        "Sobald eine Notiz, die sich nach dem Lesen selbst löscht, geöffnet wurde, ist der Link ungültig. Weder Sie noch der Empfänger können ihn erneut öffnen.",
        "Wenn Sie ein Geheimnis in einen KI-Prompt eingegeben haben, sollten Sie die Zugangsdaten nach dem Teilen rotieren. Der Prompt wurde gesehen. Der PrivateNote-Link nicht — aber die zugrunde liegende Zugangsdaten schon.",
        "Für Geheimnisse, die dauerhaft bleiben müssen, nutzen Sie eine richtige Geheimnisverwaltung. PrivateNote ist für die Übergabe, nicht für die Speicherung.",
      ],
    },
  ],
  ctaTitle: "Teilen Sie Ihre erste private Notiz",
  ctaBody: "Installieren Sie die VS Code-Erweiterung oder probieren Sie die Web-App — kein Konto erforderlich für Einmal-Notizen.",
  ctaButton: "PrivateNote ausprobieren →",
};
