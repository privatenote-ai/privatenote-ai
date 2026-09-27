import type { PrivateNoteCodexArticleCopy } from "./privateNoteCodex.types";

const claudeDesktopConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

const exampleResponse = `# Primjer odgovora asistenta:

PrivateNote kreirana:
https://privatenote.ai/note/xK9m2p...#A3f7...

Istječe za 24 sata · Briše se nakon čitanja`;

const structuredPrompt = `# Strukturirani primjer prompta:

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

export const privateNoteCodexHr: PrivateNoteCodexArticleCopy = {
  intro: [
    "OpenAI Codex je AI agent za kodiranje. Opisujete što želite — popraviti bug, dodati značajku, napisati test — i on to autonomno radi u sandbox okruženju.",
    "Ali agentima trebaju tajne. Moraju klonirati repozitorije preko SSH-a, povlačiti iz privatnih registara paketa, spajati se na staging baze podataka, zvati interne API-je. To znači predaju vjerodajnica.",
    "Zalijepiti API ključ u prompt agenta nije u biti drugačije od lijepljenja u Slack — završava u povijesti konteksta, možda u logovima, možda u memoriji koja preživljava između sesija. PrivateNote daje čistiji put: enkriptirajte tajnu prije nego što je agent ikad vidi, podijelite link koji se samouništava nakon jednog čitanja i ne ostavljajte ništa iza sebe.",
    "Evo kako povezati ta dva alata.",
  ],
  sections: [
    {
      title: "Što je MCP?",
      body: [
        "MCP (Model Context Protocol) otvoreni je protokol koji AI aplikacijama omogućuje povezivanje s alatima, izvorima podataka i servisima putem standardiziranih poslužitelja. Bilo koji MCP-kompatibilni klijent — Claude Desktop, Cursor, Codex, Windsurf ili drugi asistent — može pozivati alate koje izloži MCP poslužitelj.",
        "PrivateNote MCP poslužitelj izlaže jedan alat: create_private_note. Kad ga AI pozove, lokalni Node.js proces enkriptira sadržaj prije nego bilo što dotakne mrežu. Rezultat je sigurna, privremena poveznica koju možete podijeliti s bilo kim.",
      ],
      links: [
        { label: "Model Context Protocol dokumentacija", href: "https://modelcontextprotocol.io" },
        { label: "MCP transporti", href: "https://modelcontextprotocol.io/docs/concepts/transports" },
        { label: "Claude Desktop MCP postavka", href: "https://docs.anthropic.com/en/docs/claude-desktop" },
      ],
    },
    {
      title: "Preduvjeti",
      body: ["Prije instalacije provjerite imate li:"],
      bullets: [
        "MCP-kompatibilni klijent: Claude Desktop, Cursor, Codex CLI, Windsurf ili bilo koji klijent koji implementira MCP specifikaciju",
        "Node.js 18 ili noviji — provjera: node --version",
        "npx dostupan — provjera: npx --version",
        "Mrežni pristup privatenote.ai (ili vašoj self-hosted instanci)",
      ],
    },
    {
      title: "Najbrži put: jedna naredba (Codex)",
      body: ["Ako koristite Codex CLI, dodavanje PrivateNote-a kao globalnog MCP poslužitelja jedna je naredba:"],
      code: "codex mcp add privatenote -- npx -y privatenote-mcp",
      codeLabel: "Terminal",
      bullets: [
        "To je to. Poslužitelj je globalno registriran u ~/.codex/config.toml",
        "Svaka nova Codex sesija ima pristup alatu create_private_note",
        "Nije potrebna konfiguracija na razini projekta — prati vas kroz repozitorije",
      ],
    },
    {
      title: "Claude Desktop i drugi MCP klijenti",
      body: [
        "Većina MCP klijenata prihvaća JSON konfiguracijsku datoteku. Za Claude Desktop otvorite konfiguraciju za vaš OS:",
        "macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
        "Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
        "Dodajte sljedeći unos, spremite datoteku i ponovno pokrenite Claude Desktop:",
      ],
      code: claudeDesktopConfig,
      codeLabel: "claude_desktop_config.json",
      bullets: [
        "Nakon ponovnog pokretanja Claude će otkriti poslužitelj i automatski izložiti alat create_private_note u chatu",
        "Cursor: dodajte isti unos pod Settings → MCP",
        "Bilo koji drugi klijent koji slijedi MCP specifikaciju koristi isti JSON blok",
      ],
    },
    {
      title: "Što sada možete pitati AI asistenta",
      body: ["Kad je MCP poslužitelj povezan, možete koristiti običan prirodni jezik:"],
      bullets: [
        "\"Kreiraj PrivateNote koja kaže: Privremena lozinka je X. Neka istekne za 24 sata.\"",
        "\"Omotaj ovu lozinku baze podataka u samouništavajuću poveznicu za izvođača\"",
        "\"Pošalji SSH ključ sigurno — istek 15 minuta, brisanje nakon čitanja\"",
        "\"Generiraj PrivateNote za staging vjerodajnice i daj mi link\"",
      ],
      code: exampleResponse,
      codeLabel: "Primjer",
    },
    {
      title: "Što alat zapravo radi",
      body: [
        "Kad AI pozove create_private_note, MCP poslužitelj pokreće lokalni Node.js proces na vašem računalu. Enkripcija se događa tamo — prije nego bilo što dotakne mrežu.",
        "Poslužitelj generira slučajni 256-bitni AES ključ, enkriptira sadržaj AES-256-GCM algoritmom i POST-om šalje samo šifrirani tekst na privatenote.ai. Ključ nije u zahtjevu.",
        "Ključ za dešifriranje živi samo u URL fragmentu — #ovaj-dio koji preglednici nikad ne šalju poslužiteljima. Povrat je poveznica. Tko god otvori link dešifrira u pregledniku. Bilješka se odmah briše nakon toga.",
        "privatenote.ai pohranjuje enkriptirane blobove. Bez fragmenta ti blobovi nemaju značenja.",
      ],
    },
    {
      title: "Uobičajene opcije alata",
      body: ["Alat create_private_note prihvaća sljedeće parametre:"],
      bullets: [
        "content — osjetljivi tekst za enkripciju i pohranu (obavezno)",
        "expiresIn — koliko dugo bilješka ostaje dostupna: 15m, 1h, 24h ili 7d (zadano: 24h)",
        "burnAfterReading — uništi bilješku nakon prvog pregleda (zadano: true)",
        "title — opcionalna oznaka dodana sadržaju prije enkripcije",
      ],
      code: structuredPrompt,
      codeLabel: "Prompt",
    },
    {
      title: "Pravila privatnosti koja biste trebali razumjeti",
      body: [
        "Evo iskrenog dijela: kad upišete tajnu u Codex prompt, Codex je pročita prije nego što MCP alat pokrene. OpenAI poslužitelji obrađuju tu poruku.",
        "Dakle \"kreiraj PrivateNote za sk_live_abc123\" znači da je vrijednost sk_live_abc123 kratko bila u cloud kontekstu. Korak PrivateNote osigurava da ne ostane u Slacku, e-pošti ili povijesti chata — ali to nije isto kao da AI nikad nije vidio sadržaj.",
        "Dva načina da zatvorite tu prazninu:",
      ],
      bullets: [
        "Koristite VS Code proširenje u Codex IDE-u — odaberite tajnu u editoru, desni klik → Share as PrivateNote. Tajna ide izravno iz editora u enkriptiranu poveznicu. Codex nije uključen",
        "Koristite lokalni model za sesiju agenta. Ništa ne napušta vaše računalo dok već nije enkriptirano",
      ],
    },
    {
      title: "Korištenje VS Code proširenja u Codex IDE-u",
      body: [
        "Codex radi unutar VS Code-kompatibilnog editora. PrivateNote VS Code proširenje instalira se i radi tamo kao u standardnom VS Codeu.",
      ],
      code: "code --install-extension PrivateNote.privatenote-vscode",
      codeLabel: "Terminal",
      bullets: [
        "Nakon instalacije ikona omotnice pojavljuje se u activity baru — kliknite je za PrivateNote panel",
        "Odaberite bilo koji tekst u editoru, desni klik → Share as PrivateNote za brzi jednokratni slučaj",
        "Ikona lokota u title baru editora pojavljuje se kad imate odabran tekst",
        "Ovom putanjom Codex nikad ne dira običan tekst — proširenje enkriptira lokalno u VS Code host procesu",
      ],
    },
    {
      title: "Ako preferirate konfiguracijsku datoteku",
      body: [
        "MCP poslužitelj možete dodati i ručno. Naredba codex mcp add piše u ~/.codex/config.toml — tu datoteku možete uređivati izravno ako preferirate:",
      ],
      code: codexConfigToml,
      codeLabel: "~/.codex/config.toml",
    },
    {
      title: "Usmjeravanje na self-hosted instancu",
      body: [
        "Ako vaš tim vodi privatni PrivateNote poslužitelj, postavite osnovni URL putem varijable okruženja u MCP konfiguraciji:",
      ],
      code: selfHostedConfigToml,
      codeLabel: "~/.codex/config.toml",
      bullets: [
        "Sve tajne ostaju na vašoj infrastrukturi — ništa ne dolazi do privatenote.ai",
        "Isti AES-256-GCM enkripcijski model; mijenja se samo odredište pohrane",
      ],
    },
    {
      title: "Rješavanje problema",
      body: ["Ako se PrivateNote alat ne pojavi u klijentu nakon postavke:"],
      bullets: [
        "Ponovno pokrenite MCP klijent — promjene konfiguracije ne učitavaju se dok aplikacija radi",
        "Potvrdite da je Node.js instaliran i na PATH-u: node --version",
        "Potvrdite da npx radi: npx --version",
        "Validirajte JSON konfiguraciju — zarez na kraju najčešća je sintaksna greška",
        "Provjerite MCP ili extension logove klijenta za greške pri pokretanju",
        "Provjerite mrežni pristup privatenote.ai (ili vašem self-hosted hostu)",
      ],
    },
    {
      title: "Nekoliko stvari koje treba zapamtiti",
      body: [
        "URL je tajna. Poveznica sadrži ključ za dešifriranje u fragmentu. Tretirajte je s istom pažnjom kao samu vjerodajnicu — ne commitajte je, ne logirajte, ne objavljujte u javnom kanalu.",
        "Brisanje nakon čitanja znači točno to. Kad se link otvori, nestaje. Ni vi ni primatelj ne možete ponovno otvoriti.",
        "Rotirajte nakon dijeljenja. Ako se vjerodajnica pojavila u AI promptu — čak i kratko — tretirajte je kao potencijalno viđenu. Podijelite trenutnu vrijednost preko PrivateNote-a, zatim rotirajte na novu.",
        "PrivateNote je za predaju, ne za pohranu. Ako tajna treba biti dostupna duže od nekoliko dana, koristite pravi secrets manager. PrivateNote je siguran korak predaje, ne trezor.",
        "Koristite kratka vremena isteka. Za jednokratne tajne 15m ili 1h gotovo uvijek dovoljno. Zadano birajte najkraće okno koje i dalje radi za primatelja.",
      ],
    },
  ],
  ctaTitle: "Povežite AI asistenta s PrivateNote-om",
  ctaBody:
    "Jedna naredba ili jedan JSON blok registrira MCP poslužitelj. Svaka sesija nakon toga ima ugrađen alat za sigurno dijeljenje tajni.",
  ctaButton: "Isprobajte PrivateNote →",
};
