import type { PrivateNoteForDevelopersArticleCopy } from "./privateNoteForDevelopers.types";

const mcpConfig = `{
  "mcpServers": {
    "privatenote": {
      "command": "npx",
      "args": ["-y", "privatenote-mcp"]
    }
  }
}`;

export const privateNoteForDevelopersSr: PrivateNoteForDevelopersArticleCopy = {
  intro: [
    "Trebate poslati lozinku kolegi. Možda je staging baza podataka. Možda Stripe ključ koji ide u produkciju. Možda SSH kredencijal za server kome smeju pristupiti samo vi i još dvoje.",
    "Otvorite Slack. Počnete da kucate. I onda — mali, poznati trenutak oklevanja.",
    "Ta poruka će ostati u istoriji chata. Sinhronizovaće se na tri uređaja. Može završiti u rezervnoj kopiji, indeksu pretrage, arhivi usklađenosti. Dugo nakon što rotirate kredencijal i zaboravite na nju, poruka je i dalje tu.",
    "PrivateNote je drugačiji put. Tajna se enkriptuje na vašem uređaju pre nego što dotakne bilo koju mrežu. Ključ za dešifrovanje živi samo u URL-u koji delite — server koji čuva belešku ga nikad ne vidi. Beleška se briše nakon prvog čitanja. Ništa ne ostaje.",
    "Evo kako je koristiti — počevši od najlakše opcije.",
  ],
  sections: [
    {
      title: "VS Code i Cursor proširenje",
      body: [
        "Ako dane provodite u VS Codeu ili Cursoru, ovo je najglatkiji put. Instalirajte proširenje jednom i ostaje u bočnoj traci, uvek na jedan klik.",
        "Otvorite panel proširenja (Cmd+Shift+X), potražite PrivateNote i kliknite Install. Nakon ponovnog učitavanja prozora, mala ikona koverte pojavljuje se u activity baru levo.",
        "Kliknite je. Otvara se panel:",
      ],
      bullets: [
        "Upišite ili nalepite tajnu u polje sadržaja",
        "Postavite istek — 15 minuta, 1 sat, 1 dan ili 7 dana",
        "Ostavite \"Brisanje nakon čitanja\" uključeno (podrazumevano)",
        "Kliknite Share PrivateNote →",
      ],
    },
    {
      title: "Šta se dešava kada kliknete Share",
      body: [
        "Ugrađena kriptografija pregledača generiše slučajni 256-bitni ključ. Taj ključ nikad ne napušta vaš uređaj.",
        "Sadržaj se enkriptuje AES-256-GCM algoritmom. Rezultat je blob šifrovanog teksta bez čitljivog sadržaja.",
        "Na PrivateNote server šalje se samo taj šifrovani blob. Ključ nije uključen — ni u telu zahteva, ni u zaglavlju, nigde.",
        "Server čuva enkriptovani blob i vraća ID beleške. Vaš uređaj gradi deljivi URL: ID beleške u putu, ključ za dešifrovanje u URL fragmentu — #ovaj-deo koji pregledači nikad ne šalju serverima.",
        "Link se kopira u clipboard. Nalepite ga gde biste inače nalepili tajnu. Razlika je što je link sada tajna, a ne sama lozinka.",
      ],
    },
    {
      title: "Dva druga načina korišćenja proširenja",
      body: [
        "Ne morate uvek otvarati panel. Postoje dva brža prečica:",
        "Odaberite bilo koji tekst u editoru i desni klik — videćete Share as PrivateNote u kontekstnom meniju. Brzi odabir pita za istek i brisanje nakon čitanja, zatim se link kopira u clipboard.",
        "Kada imate odabran tekst, ikona katanca se takođe pojavljuje u title baru editora gore desno. Jedan klik šalje sadržaj.",
      ],
    },
    {
      title: "Ako koristite AI asistenta: MCP server",
      body: ["Ako radite u Cursoru sa Claudeom ili drugim modelom, AI može da kreira PrivateNote beleške u vaše ime. MCP (Model Context Protocol) server dodaje alat create_private_note koji agent može automatski pozvati.", "Dodajte ovo u ~/.cursor/mcp.json:"],
      code: mcpConfig,
      bullets: [
        "Ponovo pokrenite Cursor i proverite Settings → MCP — trebalo bi da vidite privatenote sa zelenom tačkom",
        "Zatim recite agentu: \"Pošalji ovaj API ključ sigurno, brisanje nakon čitanja\"",
        "Agent poziva alat, enkripcija se izvodi lokalno i dobijate link",
      ],
    },
    {
      title: "Jedna stvar o AI-ju i tajnama",
      body: [
        "Kada uključite tajnu u AI prompt, model je pročita pre nego što MCP alat enkriptuje sadržaj. Serveri provajdera AI-a kratko vide sadržaj.",
        "To je i dalje značajno poboljšanje u odnosu na slanje kroz Slack — tajna ne završava u trajnoj istoriji chata, e-mailu ili logovima servera. Ali to nije isto kao da AI nikad nije video sadržaj.",
        "Za potpunu end-to-end privatnost sa AI agentom koristite lokalni model na vašem uređaju (poput Ollame). Tada ništa ne napušta računar dok već nije enkriptovano.",
      ],
    },
    {
      title: "Bez instalacije: web aplikacija",
      body: [
        "Ako niste u VS Codeu ili ste na uređaju bez uobičajene postavke, web aplikacija na privatenote.ai radi isto u bilo kom pregledaču.",
        "Nalepite tajnu, odaberite istek, kliknite Create. Podelite link. Logika enkripcije radi u pregledaču — isti AES-256-GCM, ista arhitektura ključa u fragmentu.",
      ],
    },
    {
      title: "Šta zapamtiti",
      body: [
        "Link sadrži ključ za dešifrovanje. Tretirajte URL sa istom pažnjom kao i samu tajnu — ne objavljujte ga u javnom kanalu.",
        "Kada se beleška sa brisanjem nakon čitanja otvori, link je mrtav. Ni vi ni primalac ga ne možete ponovo otvoriti.",
        "Ako ste upisali tajnu u AI prompt, razmislite o rotaciji nakon deljenja. Prompt je viđen. PrivateNote link nije — ali je izvorni kredencijal bio.",
        "Za tajne koje trebaju trajati koristite pravi secrets manager. PrivateNote je za dostavu, ne za skladištenje.",
      ],
    },
  ],
  ctaTitle: "Podelite svoju prvu privatnu belešku",
  ctaBody: "Instalirajte VS Code proširenje ili isprobajte web aplikaciju — nalog nije potreban za beleške sa jednim čitanjem.",
  ctaButton: "Isprobajte PrivateNote →",
};
