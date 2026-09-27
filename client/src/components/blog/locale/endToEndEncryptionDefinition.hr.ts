import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionHr: E2eeDefinitionArticleCopy = {
  intro: [
    "End-to-end enkripcija jedna je od najčešće ponavljanih fraza u sigurnosnom marketingu. Također je jedna od najlakših za razvodnjavanje. Prava definicija nije da su podaci negdje enkriptirani. Prava definicija govori o tome tko ih može dešifrirati.",
    "Ako pružatelj usluge ima ključeve, može ih oporaviti ili prima čisti tekst tijekom normalnog rada, sustav može biti enkriptiran, ali nije end-to-end enkriptiran u strogo smislu.",
  ],
  definitionTitle: "Najkraća korisna definicija",
  definitionBody:
    "End-to-end enkripcija znači da samo krajnje točke imaju ključeve potrebne za dešifriranje podataka. Pružatelj usluge može pohraniti ili proslijediti šifrirani tekst, ali ne bi trebao posjedovati ključeve niti čisti tekst.",
  tableHeaders: ["Model", "Enkripcija", "Poslužitelj vidi čisti tekst?", "Poslužitelj ima ključeve?"],
  tableRows: [
    { model: "Transportna sigurnost (TLS)", happens: "Između preglednika i poslužitelja", plaintext: "Da, na poslužitelju", keys: "Da, za obradu na poslužitelju" },
    { model: "Pogrešna klijentska enkripcija", happens: "Na uređaju", plaintext: "Možda", keys: "Da, ako se ključevi uploadaju ili mogu oporaviti" },
    { model: "Prava E2EE", happens: "Na krajnjim točkama", plaintext: "Ne", keys: "Ne" },
  ],
  flowNodes: [
    { title: "Preglednik pošiljatelja", body: "Enkriptira lokalno prije uploada" },
    { title: "PrivateNote pohrana", body: "Pohranjuje samo šifrirani tekst" },
    { title: "Preglednik primatelja", body: "Dešifrira ključem iz fragmenta" },
  ],
  sections: [
    {
      title: "Enkripcija nije isto što i end-to-end enkripcija",
      paragraphs: [
        "Većina ozbiljnih web usluga koristi TLS. To je važno: TLS štiti podatke dok putuju između preglednika i poslužitelja te sprječava napadače na lokalnoj mreži da čitaju vezu.",
        "Ali TLS završava na poslužitelju. Kad zahtjev stigne, usluga obično može vidjeti čisti tekst. Pružatelj ga zatim može pohraniti, skenirati, indeksirati, obrađivati ili ponovno enkriptirati u mirovanju ključevima koje kontrolira.",
        "To je enkriptirani prijenos. Samo po sebi to nije end-to-end enkripcija.",
      ],
      callout: "Praktični test je jednostavan: može li pružatelj dobiti ključ za dešifriranje ili čisti tekst? Ako da, sustav nije istinski end-to-end enkriptiran.",
    },
    {
      title: "Kriptografova definicija",
      paragraphs: [
        "Precizna definicija E2EE počinje posjedovanjem ključeva. U istinskom end-to-end sustavu ključeve za enkripciju i dešifriranje stvaraju i drže krajnje točke, ne usluga dostave.",
        "Poslužitelj može usmjeravati, pohranjivati, ograničavati brzinu i brisati šifrirani tekst. Može raditi uslugu. Ali ne drži materijal ključeva potreban da šifrirani tekst ponovno postane čitljiv sadržaj.",
        "Poznata Matthew Greenova analiza Zoomove enkripcijske kontroverze jasno ističe: ključno svojstvo nije samo postojanje enkripcije, već nedostupnost ključeva za dešifriranje pružatelju.",
      ],
      bullets: [
        "Krajnja točka pošiljatelja može enkriptirati podatke.",
        "Krajnja točka primatelja može dešifrirati podatke.",
        "Posrednički poslužitelj rukuje samo šifriranim tekstom.",
        "Kompromitacija poslužitelja ne bi trebala otkriti čisti tekst sadržaja.",
      ],
    },
    {
      title: "Klijentska enkripcija i dalje može biti nedovoljna",
      paragraphs: [
        "Klijentska enkripcija znači da se kriptografska operacija događa lokalno prije uploada. To je potrebno za mnoge E2EE dizajne, ali samo po sebi nije dovoljno.",
        "Usluga može enkriptirati podatke u pregledniku, a zatim uploadati i šifrirani tekst i odgovarajući ključ na backend. Enkripcija se dogodila na klijentu, ali pružatelj i dalje ima ključ. To lomi end-to-end granicu.",
        "Smislena razlika je isključivo posjedovanje ključa. Ako pružatelj može pristupiti, oporaviti, rotirati, escrowati ili regenerirati upotrebljivi ključ, korisnik i dalje vjeruje pružatelju s pristupom čistom tekstu.",
      ],
    },
    {
      title: "Kako bilješke s URL fragmentom odgovaraju modelu",
      paragraphs: [
        "PrivateNote koristi verziju ove arhitekture u pregledniku za jednokratne bilješke. Preglednik pošiljatelja enkriptira bilješku lokalno. Enkriptirani payload se uploada u pohranu. Ključ za dešifriranje stavlja se u URL fragment: dio nakon # simbola.",
        "Preglednici ne šalju URL fragment poslužitelju u HTTP zahtjevu. To znači da poslužitelj prima šifrirani tekst, ali ne i ključ. Kad primatelj otvori link, preglednik lokalno ima fragment i može dešifrirati bilješku nakon koraka otkrivanja.",
        "To nije ista topologija kao Signal ili MLS, gdje su krajnje točke obično uređaji vezani uz račun s trajnim javnim ključevima. Ali centralno sigurnosno svojstvo je isto: pružatelj pohrane ne posjeduje ključ potreban za dešifriranje sadržaja.",
      ],
    },
    {
      title: "Kanal dostave i dalje ima značaj",
      paragraphs: [
        "Jednokratni enkriptirani link je moćan, ali cijeli link postaje osjetljiv jer u fragmentu nosi ključ za dešifriranje. Ako taj link zalijepite u kanal koji bilježi poruke, sinkronizira povijest ili ga nadzire administrator, kanal može otkriti tajnu prije nego što se otvori.",
        "Zato su istek, jednokratno čitanje i opcionalne lozinke operativno važni. Ne mijenjaju definiciju E2EE, ali smanjuju štetu ako se link proslijedi, zabilježi ili pregleda softverom.",
        "Za visoko osjetljiv materijal pošaljite link jednim kanalom, a opcionalnu lozinku podijelite drugim kanalom. To odvaja posjed enkriptiranog payloada od posjeda ljudske tajne.",
      ],
    },
    {
      title: "Napomena o offline brute-force napadu",
      paragraphs: [
        "Zaštita lozinkom dodaje obranu u dubinu, ali ima stvarnu kriptografsku napomenu. Ako napadač dobije cijeli link i preuzme šifrirani tekst prije isteka, pogadanje lozinke može postati offline napad. Ograničenja brzine poslužitelja više ne pomažu jer napadač lokalno pogađa protiv šifriranog teksta.",
        "PrivateNote koristi Argon2id za bilješke zaštićene lozinkom. Argon2id je memorijski zahtjevna funkcija derivacije ključa koja povećava trošak svakog pokušaja pogadanja lozinke, posebno kod GPU-teških brute-force napada.",
        "To ne čini slabe lozinke sigurnima. Kratka ili ponovno korištena lozinka i dalje može propasti. Što je jača opcionalna lozinka, to je korisniji ovaj drugi sloj.",
      ],
    },
    {
      title: "Zašto arhitektura ima značaj",
      paragraphs: [
        "E2EE mijenja model povjerenja. Kod obične enkripcije u mirovanju korisnici se oslanjaju na politiku pružatelja, kontrole zaposlenika, pravnu obradu i sprječavanje proboja. Kod end-to-end enkripcije pružatelj je strukturno ograničen: može pohraniti enkriptirane podatke, ali ih ne može dešifrirati.",
        "To ne eliminira svaki rizik. Malware na krajnjoj točki, zlonamjerna proširenja preglednika, kopirani linkovi, slabe lozinke i nesigurni kanali dostave i dalje imaju značaj. Kriptografija sužava granicu povjerenja; ne uklanja operativnu prosudbu.",
        "Vrijednost je i dalje značajna: proboj baze podataka trebao bi otkriti nečitljiv šifrirani tekst, a ne sadržaj poruka. To je razlika između obećanja da se podaci neće čitati i nemogućnosti da se uopće pročitaju.",
      ],
    },
  ],
  continueReadingTitle: "Nastavite čitati",
  referencesTitle: "Reference",
  references: [
    { label: "Matthew Green, „Does Zoom use end-to-end encryption?”", href: "https://blog.cryptographyengineering.com/2020/04/03/does-zoom-use-end-to-end-encryption/" },
    { label: "Signal, The X3DH Key Agreement Protocol", href: "https://signal.org/docs/specifications/x3dh/" },
    { label: "IETF RFC 9420, The Messaging Layer Security Protocol", href: "https://www.rfc-editor.org/rfc/rfc9420.html" },
    { label: "Unger et al., SoK: Secure Messaging", href: "https://www.ieee-security.org/TC/SP2015/papers-archived/6949a232.pdf" },
  ],
};
