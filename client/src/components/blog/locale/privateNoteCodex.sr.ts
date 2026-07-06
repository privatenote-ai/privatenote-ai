import type { PrivateNoteCodexArticleCopy } from "./privateNoteCodex.types";

const claudeDesktopConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

const exampleResponse = `# Primer odgovora asistenta:

PrivateNote kreirana:
https://privatenote.ai/note/xK9m2p...#A3f7...

Ističe za 24 sata · Briše se nakon čitanja`;

const structuredPrompt = `# Strukturirani primer prompta:

Create a PrivateNote with:
content: "The deployment token is ghp_abc123"
expiresIn: "15m"
burnAfterReading: true`;

const codexConfigToml = `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]`;

const selfHostedConfigToml = `[mcp_servers.privatenote]
command = "npx"
args = ["-y", "privatenote-mcp"]

[mcp_servers.privatenote.env]
PRIVATENOTE_API_BASE_URL = "https://notes.your-domain.com"`;

export const privateNoteCodexSr: PrivateNoteCodexArticleCopy = {
  intro: [
    "OpenAI Codex je AI agent za kodiranje. Opisujete šta želite — popraviti bug, dodati funkciju, napisati test — i on to autonomno radi u sandbox okruženju.",
    "Ali agentima trebaju tajne. Moraju klonirati repozitorijume preko SSH-a, povlačiti iz privatnih registara paketa, povezivati se na staging baze podataka, pozivati interne API-je. To znači predaju kredencijala.",
    "Nalepiti API ključ u prompt agenta nije u suštini drugačije od lepljenja u Slack — završava u istoriji konteksta, možda u logovima, možda u memoriji koja preživljava između sesija. PrivateNote daje čistiji put: enkriptujte tajnu pre nego što je agent ikad vidi, podelite link koji se samouništava nakon jednog čitanja i ne ostavljajte ništa iza sebe.",
    "Evo kako povezati ta dva alata.",
  ],
  sections: [
    {
      title: "Šta je MCP?",
      body: [
        "MCP (Model Context Protocol) otvoreni je protokol koji AI aplikacijama omogućava povezivanje sa alatima, izvorima podataka i servisima putem standardizovanih servera. Bilo koji MCP-kompatibilni klijent — Claude Desktop, Cursor, Codex, Windsurf ili drugi asistent — može pozivati alate koje izloži MCP server.",
        "PrivateNote MCP server izlaže jedan alat: create_private_note. Kada ga AI pozove, lokalni Node.js proces enkriptuje sadržaj pre nego bilo šta dotakne mrežu. Rezultat je sigurna, privremena veza koju možete podeliti sa bilo kim.",
      ],
      links: [
        { label: "Model Context Protocol dokumentacija", href: "https://modelcontextprotocol.io" },
        { label: "MCP transporti", href: "https://modelcontextprotocol.io/docs/concepts/transports" },
        { label: "Claude Desktop MCP podešavanje", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
      ],
    },
    {
      title: "Preduslovi",
      body: ["Pre instalacije proverite da li imate:"],
      bullets: [
        "MCP-kompatibilni klijent: Claude Desktop, Cursor, Codex CLI, Windsurf ili bilo koji klijent koji implementira MCP specifikaciju",
        "Node.js 18 ili noviji — provera: node --version",
        "npx dostupan — provera: npx --version",
        "Mrežni pristup privatenote.ai (ili vašoj self-hosted instanci)",
      ],
    },
    {
      title: "Najbrži put: jedna komanda (Codex)",
      body: ["Ako koristite Codex CLI, dodavanje PrivateNote-a kao globalnog MCP servera jedna je komanda:"],
      code: "codex mcp add privatenote -- npx -y privatenote-mcp",
      codeLabel: "Terminal",
      bullets: [
        "To je to. Server je globalno registrovan u ~/.codex/config.toml",
        "Svaka nova Codex sesija ima pristup alatu create_private_note",
        "Nije potrebna konfiguracija na nivou projekta — prati vas kroz repozitorijume",
      ],
    },
    {
      title: "Claude Desktop i drugi MCP klijenti",
      body: [
        "Većina MCP klijenata prihvata JSON konfiguracionu datoteku. Za Claude Desktop otvorite konfiguraciju za vaš OS:",
        "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
        "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
        "Dodajte sledeći unos, sačuvajte datoteku i ponovo pokrenite Claude Desktop:",
      ],
      code: claudeDesktopConfig,
      codeLabel: "claude_desktop_config.json",
      bullets: [
        "Nakon ponovnog pokretanja Claude će otkriti server i automatski izložiti alat create_private_note u četu",
        "Cursor: dodajte isti unos pod Settings → MCP",
        "Bilo koji drugi klijent koji prati MCP specifikaciju koristi isti JSON blok",
      ],
    },
    {
      title: "Šta sada možete pitati AI asistenta",
      body: ["Kada je MCP server povezan, možete koristiti običan prirodni jezik:"],
      bullets: [
        "\"Kreiraj PrivateNote koja kaže: Privremena lozinka je X. Neka ističe za 24 sata.\"",
        "\"Omotaj ovu lozinku baze podataka u samouništavajuću vezu za izvođača\"",
        "\"Pošalji SSH ključ sigurno — istek 15 minuta, brisanje nakon čitanja\"",
        "\"Generiši PrivateNote za staging kredencijale i daj mi link\"",
      ],
      code: exampleResponse,
      codeLabel: "Primer",
    },
    {
      title: "Šta alat zapravo radi",
      body: [
        "Kada AI pozove create_private_note, MCP server pokreće lokalni Node.js proces na vašem računaru. Enkripcija se dešava tamo — pre nego bilo šta dotakne mrežu.",
        "Server generiše slučajni 256-bitni AES ključ, enkriptuje sadržaj AES-256-GCM algoritmom i POST-om šalje samo šifrovani tekst na privatenote.ai. Ključ nije u zahtevu.",
        "Ključ za dešifrovanje živi samo u URL fragmentu — #ovaj-deo koji preglednici nikad ne šalju serverima. Povrat je veza. Ko god otvori link dešifruje u pregledniku. Beleška se odmah briše nakon toga.",
        "privatenote.ai čuva enkriptovane blobove. Bez fragmenta ti blobovi nemaju značenja.",
      ],
    },
    {
      title: "Uobičajene opcije alata",
      body: ["Alat create_private_note prihvata sledeće parametre:"],
      bullets: [
        "content — osetljivi tekst za enkripciju i čuvanje (obavezno)",
        "expiresIn — koliko dugo beleška ostaje dostupna: 15m, 1h, 24h ili 7d (podrazumevano: 24h)",
        "burnAfterReading — uništi belešku nakon prvog pregleda (podrazumevano: true)",
        "title — opciona oznaka dodata sadržaju pre enkripcije",
      ],
      code: structuredPrompt,
      codeLabel: "Prompt",
    },
    {
      title: "Pravila privatnosti koja biste trebali razumeti",
      body: [
        "Evo iskrenog dela: kada upišete tajnu u Codex prompt, Codex je pročita pre nego što MCP alat pokrene. OpenAI serveri obrađuju tu poruku.",
        "Dakle \"kreiraj PrivateNote za sk_live_abc123\" znači da je vrednost sk_live_abc123 kratko bila u cloud kontekstu. Korak PrivateNote osigurava da ne ostane u Slacku, e-pošti ili istoriji četa — ali to nije isto kao da AI nikad nije video sadržaj.",
        "Dva načina da zatvorite tu prazninu:",
      ],
      bullets: [
        "Koristite VS Code proširenje u Codex IDE-u — odaberite tajnu u editoru, desni klik → Share as PrivateNote. Tajna ide direktno iz editora u enkriptovanu vezu. Codex nije uključen",
        "Koristite lokalni model za sesiju agenta. Ništa ne napušta vaš računar dok već nije enkriptovano",
      ],
    },
    {
      title: "Korišćenje VS Code proširenja u Codex IDE-u",
      body: [
        "Codex radi unutar VS Code-kompatibilnog editora. PrivateNote VS Code proširenje instalira se i radi tamo kao u standardnom VS Codeu.",
      ],
      code: "code --install-extension PrivateNote.privatenote-vscode",
      codeLabel: "Terminal",
      bullets: [
        "Nakon instalacije ikona koverte pojavljuje se u activity baru — kliknite je za PrivateNote panel",
        "Odaberite bilo koji tekst u editoru, desni klik → Share as PrivateNote za brzi jednokratni slučaj",
        "Ikona lokota u title baru editora pojavljuje se kada imate odabran tekst",
        "Ovom putanjom Codex nikad ne dira običan tekst — proširenje enkriptuje lokalno u VS Code host procesu",
      ],
    },
    {
      title: "Ako preferirate konfiguracionu datoteku",
      body: [
        "MCP server možete dodati i ručno. Komanda codex mcp add piše u ~/.codex/config.toml — tu datoteku možete uređivati direktno ako preferirate:",
      ],
      code: codexConfigToml,
      codeLabel: "~/.codex/config.toml",
    },
    {
      title: "Usmeravanje na self-hosted instancu",
      body: [
        "Ako vaš tim vodi privatni PrivateNote server, postavite osnovni URL putem promenljive okruženja u MCP konfiguraciji:",
      ],
      code: selfHostedConfigToml,
      codeLabel: "~/.codex/config.toml",
      bullets: [
        "Sve tajne ostaju na vašoj infrastrukturi — ništa ne dolazi do privatenote.ai",
        "Isti AES-256-GCM enkripcijski model; menja se samo odredište čuvanja",
      ],
    },
    {
      title: "Rešavanje problema",
      body: ["Ako se PrivateNote alat ne pojavi u klijentu nakon podešavanja:"],
      bullets: [
        "Ponovo pokrenite MCP klijent — promene konfiguracije ne učitavaju se dok aplikacija radi",
        "Potvrdite da je Node.js instaliran i na PATH-u: node --version",
        "Potvrdite da npx radi: npx --version",
        "Validirajte JSON konfiguraciju — zarez na kraju najčešća je sintaksna greška",
        "Proverite MCP ili extension logove klijenta za greške pri pokretanju",
        "Proverite mrežni pristup privatenote.ai (ili vašem self-hosted hostu)",
      ],
    },
    {
      title: "Nekoliko stvari koje treba zapamtiti",
      body: [
        "URL je tajna. Veza sadrži ključ za dešifrovanje u fragmentu. Tretirajte je sa istom pažnjom kao sam kredencijal — ne commitujte je, ne logirajte, ne objavljujte u javnom kanalu.",
        "Brisanje nakon čitanja znači tačno to. Kada se link otvori, nestaje. Ni vi ni primalac ne možete ponovo otvoriti.",
        "Rotirajte nakon deljenja. Ako se kredencijal pojavio u AI promptu — čak i kratko — tretirajte ga kao potencijalno viđenog. Podelite trenutnu vrednost preko PrivateNote-a, zatim rotirajte na novu.",
        "PrivateNote je za predaju, ne za čuvanje. Ako tajna treba biti dostupna duže od nekoliko dana, koristite pravi secrets manager. PrivateNote je siguran korak predaje, ne trezor.",
        "Koristite kratka vremena isteka. Za jednokratne tajne 15m ili 1h gotovo uvek dovoljno. Podrazumevano birajte najkraće okno koje i dalje radi za primaoca.",
      ],
    },
  ],
  ctaTitle: "Povežite AI asistenta sa PrivateNote-om",
  ctaBody:
    "Jedna komanda ili jedan JSON blok registruje MCP server. Svaka sesija nakon toga ima ugrađen alat za sigurno deljenje tajni.",
  ctaButton: "Isprobajte PrivateNote →",
};
