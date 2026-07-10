import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersNl: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Je moet een wachtwoord naar een collega sturen. Misschien is het de staging-database. Misschien een Stripe-sleutel die naar productie gaat. Misschien een SSH-credential voor een server waar alleen jij en nog twee anderen bij mogen.",
    "Je opent Slack. Je begint te typen. En dan — een klein, bekend moment van aarzeling.",
    "Dat bericht blijft in je chatgeschiedenis staan. Het synchroniseert naar drie apparaten. Het kan in een back-up, zoekindex of compliance-archief belanden. Lang nadat je de credential hebt geroteerd en bent vergeten dat het ooit bestond, staat dat bericht er nog.",
    "PrivateNote is een ander pad. Het geheim wordt op je machine versleuteld voordat het een netwerk raakt. De ontsleutelingssleutel zit alleen in de URL die je deelt — de server die de notitie opslaat ziet hem nooit. De notitie vernietigt zichzelf na het eerste lezen. Niets blijft bewaard.",
    "Zo gebruik je het — te beginnen met de makkelijkste optie.",
  ],
  sections: [
    {
      title: "De VS Code- en Cursor-extensie",
      body: [
        "Als je je dagen in VS Code of Cursor doorbrengt, is dit het meest soepele pad. Installeer de extensie eenmaal en hij blijft in je zijbalk, altijd één klik verwijderd.",
        "Open het Extensions-paneel (Cmd+Shift+X), zoek naar PrivateNote en klik op Install. Na een vensterherstart verschijnt een klein envelopicoon in de activity bar links.",
        "Klik erop. Er opent een paneel:",
      ],
      bullets: [
        "Typ of plak het geheim in het inhoudsveld",
        "Stel een vervaltijd in — 15 minuten, 1 uur, 1 dag of 7 dagen",
        "Laat \"Vernietigen na lezen\" aangevinkt (de standaard)",
        "Klik op Share PrivateNote →",
      ],
    },
    {
      title: "Wat er gebeurt als je op Share klikt",
      body: [
        "De ingebouwde cryptografie van je browser genereert een willekeurige 256-bits sleutel. Die sleutel verlaat je machine nooit.",
        "De inhoud wordt versleuteld met AES-256-GCM. Het resultaat is een blob versleutelde tekst zonder leesbare inhoud.",
        "Alleen die versleutelde blob wordt naar de PrivateNote-server gestuurd. De sleutel zit er niet bij — niet in de request body, niet in een header, nergens.",
        "De server slaat de versleutelde blob op en geeft een notitie-ID terug. Je machine bouwt een deelbare URL: het notitie-ID in het pad, de ontsleutelingssleutel in het URL-fragment — het #dit-deel dat browsers nooit naar servers sturen.",
        "De link wordt naar je klembord gekopieerd. Je plakt hem waar je normaal het geheim zou plakken. Het verschil is dat de link nu het geheim is, niet het wachtwoord zelf.",
      ],
    },
    {
      title: "Twee andere manieren om de extensie te gebruiken",
      body: [
        "Je hoeft het paneel niet altijd te openen. Er zijn twee snellere shortcuts:",
        "Selecteer tekst in je editor en klik met de rechtermuisknop — je ziet Share as PrivateNote in het contextmenu. Een quick-pick vraagt om vervaltijd en vernietigingsvoorkeur, daarna wordt de link naar je klembord gekopieerd.",
        "Als je tekst geselecteerd hebt, verschijnt er ook een sloticoon in de title bar van de editor rechtsboven. Eén klik en het is verstuurd.",
      ],
    },
    {
      title: "Als je een AI-assistent gebruikt: de MCP-server",
      body: [
        "Als je in Cursor met Claude of een ander model werkt, kan de AI PrivateNotes namens jou aanmaken. De MCP-server (Model Context Protocol) voegt een create_private_note-tool toe die de agent automatisch kan aanroepen.",
        "Voeg dit toe aan ~/.cursor/mcp.json:",
      ],
      code: mcpConfig,
      bullets: [
        "Start Cursor opnieuw en controleer Settings → MCP — je zou privatenote met een groene stip moeten zien",
        "Zeg dan tegen de agent: \"Stuur deze API-sleutel veilig, vernietigen na lezen\"",
        "De agent roept de tool aan, versleuteling draait lokaal en je krijgt een link",
      ],
    },
    {
      title: "Eén ding over AI en geheimen",
      body: [
        "Als je een geheim in een AI-prompt zet, leest het model het voordat de MCP-tool de inhoud versleutelt. AI-provider-servers zien de inhoud kort.",
        "Dat is nog steeds een grote verbetering ten opzichte van Slack — het geheim belandt niet in permanente chatgeschiedenis, e-mail of serverlogs. Maar het is niet hetzelfde als dat de AI de inhoud nooit heeft gezien.",
        "Voor volledige end-to-end privacy met een AI-agent gebruik je een lokaal model op je apparaat (zoals Ollama). Dan verlaat niets je computer voordat het al versleuteld is.",
      ],
    },
    {
      title: "Zonder installatie: de webapp",
      body: [
        "Als je niet in VS Code zit of op een apparaat zonder je gebruikelijke setup, werkt de webapp op privatenote.ai hetzelfde in elke browser.",
        "Plak het geheim, kies een vervaltijd, klik op Create. Deel de link. De versleutelingslogica draait in de browser — dezelfde AES-256-GCM, dezelfde sleutel-in-fragment-architectuur.",
      ],
    },
    {
      title: "Wat je moet onthouden",
      body: [
        "De link bevat de ontsleutelingssleutel. Behandel de URL met dezelfde zorg als het geheim zelf — post hem niet in een openbaar kanaal.",
        "Zodra een notitie met vernietigen na lezen wordt geopend, is de link dood. Jij noch de ontvanger kunnen hem opnieuw openen.",
        "Als je een geheim in een AI-prompt hebt gezet, overweeg te roteren na het delen. De prompt is gezien. De PrivateNote-link niet — maar de oorspronkelijke credential wel.",
        "Voor geheimen die lang moeten blijven bestaan gebruik je een echte secrets manager. PrivateNote is voor overdracht, niet voor opslag.",
      ],
    },
  ],
  ctaTitle: "Deel je eerste privénotitie",
  ctaBody: "Installeer de VS Code-extensie of probeer de webapp — geen account nodig voor notities met één lezing.",
  ctaButton: "Probeer PrivateNote →",
};
