import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersHr: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Trebate poslati lozinku kolegi. Možda je staging baza podataka. Možda Stripe ključ koji ide u produkciju. Možda SSH vjerodajnica za poslužitelj kojem smiju pristupiti samo vi i još dvoje.",
    "Otvorite Slack. Počnete tipkati. I onda — mali, poznati trenutak oklijevanja.",
    "Ta poruka će ostati u povijesti chata. Sinkronizirat će se na tri uređaja. Može završiti u sigurnosnoj kopiji, indeksu pretraživanja, arhivi usklađenosti. Dugo nakon što rotirate vjerodajnicu i zaboravite na nju, poruka je i dalje tu.",
    "PrivateNote je drugačiji put. Tajna se enkriptira na vašem uređaju prije nego što dotakne bilo koju mrežu. Ključ za dešifriranje živi samo u URL-u koji dijelite — poslužitelj koji pohranjuje bilješku ga nikad ne vidi. Bilješka se briše nakon prvog čitanja. Ništa ne ostaje.",
    "Evo kako je koristiti — počevši od najlakše opcije.",
  ],
  sections: [
    {
      title: "VS Code i Cursor proširenje",
      body: [
        "Ako dane provodite u VS Codeu ili Cursoru, ovo je najglatkiji put. Instalirajte proširenje jednom i ostaje u bočnoj traci, uvijek na jedan klik.",
        "Otvorite panel proširenja (Cmd+Shift+X), potražite PrivateNote i kliknite Install. Nakon ponovnog učitavanja prozora, mala ikona omotnice pojavljuje se u activity baru lijevo.",
        "Kliknite je. Otvara se panel:",
      ],
      bullets: [
        "Upišite ili zalijepite tajnu u polje sadržaja",
        "Postavite istek — 15 minuta, 1 sat, 1 dan ili 7 dana",
        "Ostavite \"Brisanje nakon čitanja\" uključeno (zadano)",
        "Kliknite Share PrivateNote →",
      ],
    },
    {
      title: "Što se događa kad kliknete Share",
      body: [
        "Ugrađena kriptografija preglednika generira slučajni 256-bitni ključ. Taj ključ nikad ne napušta vaš uređaj.",
        "Sadržaj se enkriptira AES-256-GCM algoritmom. Rezultat je blob šifriranog teksta bez čitljivog sadržaja.",
        "Na PrivateNote poslužitelj šalje se samo taj šifrirani blob. Ključ nije uključen — ni u tijelu zahtjeva, ni u zaglavlju, nigdje.",
        "Poslužitelj pohranjuje enkriptirani blob i vraća ID bilješke. Vaš uređaj gradi dijeljivi URL: ID bilješke u putu, ključ za dešifriranje u URL fragmentu — #ovaj-dio koji preglednici nikad ne šalju poslužiteljima.",
        "Link se kopira u međuspremnik. Zalijepite ga gdje biste inače zalijepili tajnu. Razlika je što je link sada tajna, a ne sama lozinka.",
      ],
    },
    {
      title: "Dva druga načina korištenja proširenja",
      body: [
        "Ne morate uvijek otvarati panel. Postoje dva brža prečaca:",
        "Odaberite bilo koji tekst u editoru i desni klik — vidjet ćete Share as PrivateNote u kontekstnom izborniku. Brzi odabir pita za istek i brisanje nakon čitanja, zatim se link kopira u međuspremnik.",
        "Kad imate odabran tekst, ikona lokota također se pojavljuje u title baru editora gore desno. Jedan klik šalje sadržaj.",
      ],
    },
    {
      title: "Ako koristite AI asistenta: MCP poslužitelj",
      body: ["Ako radite u Cursoru s Claudeom ili drugim modelom, AI može stvarati PrivateNote bilješke u vaše ime. MCP (Model Context Protocol) poslužitelj dodaje alat create_private_note koji agent može automatski pozvati.", "Dodajte ovo u ~/.cursor/mcp.json:"],
      code: mcpConfig,
      bullets: [
        "Ponovno pokrenite Cursor i provjerite Settings → MCP — trebali biste vidjeti privatenote sa zelenom točkom",
        "Zatim recite agentu: \"Pošalji ovaj API ključ sigurno, brisanje nakon čitanja\"",
        "Agent poziva alat, enkripcija se izvodi lokalno i dobivate link",
      ],
    },
    {
      title: "Jedna stvar o AI-ju i tajnama",
      body: [
        "Kad uključite tajnu u AI prompt, model je pročita prije nego što MCP alat enkriptira sadržaj. Poslužitelji pružatelja AI-a kratko vide sadržaj.",
        "To je i dalje značajno poboljšanje u odnosu na slanje kroz Slack — tajna ne završava u trajnoj povijesti chata, e-mailu ili logovima poslužitelja. Ali to nije isto kao da AI nikad nije vidio sadržaj.",
        "Za potpunu end-to-end privatnost s AI agentom koristite lokalni model na vašem uređaju (poput Ollame). Tada ništa ne napušta računalo dok već nije enkriptirano.",
      ],
    },
    {
      title: "Bez instalacije: web aplikacija",
      body: [
        "Ako niste u VS Codeu ili ste na uređaju bez uobičajene postavke, web aplikacija na privatenote.ai radi isto u bilo kojem pregledniku.",
        "Zalijepite tajnu, odaberite istek, kliknite Create. Podijelite link. Logika enkripcije radi u pregledniku — isti AES-256-GCM, ista arhitektura ključa u fragmentu.",
      ],
    },
    {
      title: "Što zapamtiti",
      body: [
        "Link sadrži ključ za dešifriranje. Tretirajte URL s istom pažnjom kao i samu tajnu — ne objavljujte ga u javnom kanalu.",
        "Kad se bilješka s brisanjem nakon čitanja otvori, link je mrtav. Ni vi ni primatelj je ne možete ponovno otvoriti.",
        "Ako ste upisali tajnu u AI prompt, razmislite o rotaciji nakon dijeljenja. Prompt je viđen. PrivateNote link nije — ali je izvorna vjerodajnica bila.",
        "Za tajne koje trebaju trajati koristite pravi secrets manager. PrivateNote je za dostavu, ne za pohranu.",
      ],
    },
  ],
  ctaTitle: "Podijelite svoju prvu privatnu bilješku",
  ctaBody: "Instalirajte VS Code proširenje ili isprobajte web aplikaciju — račun nije potreban za bilješke s jednim čitanjem.",
  ctaButton: "Isprobajte PrivateNote →",
};
