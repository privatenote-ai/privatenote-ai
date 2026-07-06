import type { E2eeDefinitionArticleCopy } from "./endToEndEncryptionDefinition.types";

export const endToEndEncryptionDefinitionSr: E2eeDefinitionArticleCopy = {
  intro: [
    "End-to-end enkripcija jedna je od najčešće ponavljanih fraza u bezbednosnom marketingu. Takođe je jedna od najlakših za razvodnjavanje. Prava definicija nije da su podaci negde enkriptovani. Prava definicija govori o tome ko ih može dešifrovati.",
    "Ako provajder usluge ima ključeve, može ih oporaviti ili prima čist tekst tokom normalnog rada, sistem može biti enkriptovan, ali nije end-to-end enkriptovan u strogo smislu.",
  ],
  definitionTitle: "Najkraća korisna definicija",
  definitionBody:
    "End-to-end enkripcija znači da samo krajnje tačke imaju ključeve potrebne za dešifrovanje podataka. Provajder usluge može čuvati ili proslediti šifrovani tekst, ali ne bi trebalo da poseduje ključeve niti čist tekst.",
  tableHeaders: ["Model", "Enkripcija", "Server vidi čist tekst?", "Server ima ključeve?"],
  tableRows: [
    { model: "Transportna bezbednost (TLS)", happens: "Između pregledača i servera", plaintext: "Da, na serveru", keys: "Da, za obradu na serveru" },
    { model: "Pogrešna klijentska enkripcija", happens: "Na uređaju", plaintext: "Možda", keys: "Da, ako se ključevi uploaduju ili mogu oporaviti" },
    { model: "Prava E2EE", happens: "Na krajnjim tačkama", plaintext: "Ne", keys: "Ne" },
  ],
  flowNodes: [
    { title: "Pregledač pošiljaoca", body: "Enkriptuje lokalno pre uploada" },
    { title: "PrivateNote skladište", body: "Čuva samo šifrovani tekst" },
    { title: "Pregledač primaoca", body: "Dešifruje ključem iz fragmenta" },
  ],
  sections: [
    {
      title: "Enkripcija nije isto što i end-to-end enkripcija",
      paragraphs: [
        "Većina ozbiljnih veb usluga koristi TLS. To je važno: TLS štiti podatke dok putuju između pregledača i servera i sprečava napadače na lokalnoj mreži da čitaju vezu.",
        "Ali TLS se završava na serveru. Kada zahtev stigne, usluga obično može videti čist tekst. Provajder ga zatim može čuvati, skenirati, indeksirati, obrađivati ili ponovo enkriptovati u mirovanju ključevima koje kontroliše.",
        "To je enkriptovani prenos. Samo po sebi to nije end-to-end enkripcija.",
      ],
      callout: "Praktični test je jednostavan: može li provajder dobiti ključ za dešifrovanje ili čist tekst? Ako da, sistem nije istinski end-to-end enkriptovan.",
    },
    {
      title: "Kriptografova definicija",
      paragraphs: [
        "Precizna definicija E2EE počinje posedovanjem ključeva. U istinskom end-to-end sistemu ključeve za enkripciju i dešifrovanje stvaraju i drže krajnje tačke, ne usluga dostave.",
        "Server može usmeravati, čuvati, ograničavati brzinu i brisati šifrovani tekst. Može raditi uslugu. Ali ne drži materijal ključeva potreban da šifrovani tekst ponovo postane čitljiv sadržaj.",
        "Poznata Matthew Greenova analiza Zoomove enkripcione kontroverze jasno ističe: ključno svojstvo nije samo postojanje enkripcije, već nedostupnost ključeva za dešifrovanje provajderu.",
      ],
      bullets: [
        "Krajnja tačka pošiljaoca može enkriptovati podatke.",
        "Krajnja tačka primaoca može dešifrovati podatke.",
        "Posrednički server rukuje samo šifrovanim tekstom.",
        "Kompromitacija servera ne bi trebalo da otkrije čist tekst sadržaja.",
      ],
    },
    {
      title: "Klijentska enkripcija i dalje može biti nedovoljna",
      paragraphs: [
        "Klijentska enkripcija znači da se kriptografska operacija dešava lokalno pre uploada. To je potrebno za mnoge E2EE dizajne, ali samo po sebi nije dovoljno.",
        "Usluga može enkriptovati podatke u pregledaču, a zatim uploadovati i šifrovani tekst i odgovarajući ključ na backend. Enkripcija se desila na klijentu, ali provajder i dalje ima ključ. To lomi end-to-end granicu.",
        "Smislena razlika je isključivo posedovanje ključa. Ako provajder može pristupiti, oporaviti, rotirati, escrowati ili regenerisati upotrebljivi ključ, korisnik i dalje veruje provajderu sa pristupom čistom tekstu.",
      ],
    },
    {
      title: "Kako beleške sa URL fragmentom odgovaraju modelu",
      paragraphs: [
        "PrivateNote koristi verziju ove arhitekture u pregledaču za jednokratne beleške. Pregledač pošiljaoca enkriptuje belešku lokalno. Enkriptovani payload se uploaduje u skladište. Ključ za dešifrovanje stavlja se u URL fragment: deo posle # simbola.",
        "Pregledači ne šalju URL fragment serveru u HTTP zahtevu. To znači da server prima šifrovani tekst, ali ne i ključ. Kada primalac otvori link, pregledač lokalno ima fragment i može dešifrovati belešku posle koraka otkrivanja.",
        "To nije ista topologija kao Signal ili MLS, gde su krajnje tačke obično uređaji vezani za nalog sa trajnim javnim ključevima. Ali centralno bezbednosno svojstvo je isto: provajder skladišta ne poseduje ključ potreban za dešifrovanje sadržaja.",
      ],
    },
    {
      title: "Kanal dostave i dalje ima značaj",
      paragraphs: [
        "Jednokratni enkriptovani link je moćan, ali ceo link postaje osetljiv jer u fragmentu nosi ključ za dešifrovanje. Ako taj link nalepite u kanal koji beleži poruke, sinhronizuje istoriju ili ga nadzire administrator, kanal može otkriti tajnu pre nego što se otvori.",
        "Zato su istek, jednokratno čitanje i opcionalne lozinke operativno važni. Ne menjaju definiciju E2EE, ali smanjuju štetu ako se link prosledi, zabeleži ili pregleda softverom.",
        "Za visoko osetljiv materijal pošaljite link jednim kanalom, a opcionalnu lozinku podelite drugim kanalom. To odvaja posed enkriptovanog payloada od posed ljudske tajne.",
      ],
    },
    {
      title: "Napomena o offline brute-force napadu",
      paragraphs: [
        "Zaštita lozinkom dodaje odbranu u dubinu, ali ima stvarnu kriptografsku napomenu. Ako napadač dobije ceo link i preuzme šifrovani tekst pre isteka, pogadanje lozinke može postati offline napad. Ograničenja brzine servera više ne pomažu jer napadač lokalno pogađa protiv šifrovanog teksta.",
        "PrivateNote koristi Argon2id za beleške zaštićene lozinkom. Argon2id je memorijski zahtevna funkcija derivacije ključa koja povećava trošak svakog pokušaja pogadanja lozinke, posebno kod GPU-teških brute-force napada.",
        "To ne čini slabe lozinke sigurnim. Kratka ili ponovo korišćena lozinka i dalje može propasti. Što je jača opcionalna lozinka, to je korisniji ovaj drugi sloj.",
      ],
    },
    {
      title: "Zašto arhitektura ima značaj",
      paragraphs: [
        "E2EE menja model poverenja. Kod obične enkripcije u mirovanju korisnici se oslanjaju na politiku provajdera, kontrole zaposlenih, pravnu obradu i sprečavanje proboja. Kod end-to-end enkripcije provajder je strukturno ograničen: može čuvati enkriptovane podatke, ali ih ne može dešifrovati.",
        "To ne eliminiše svaki rizik. Malver na krajnjoj tački, zlonamerna proširenja pregledača, kopirani linkovi, slabe lozinke i nesigurni kanali dostave i dalje imaju značaj. Kriptografija sužava granicu poverenja; ne uklanja operativnu procenu.",
        "Vrednost je i dalje značajna: proboj baze podataka trebalo bi da otkrije nečitljiv šifrovani tekst, a ne sadržaj poruka. To je razlika između obećanja da se podaci neće čitati i nemogućnosti da se uopšte pročitaju.",
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
