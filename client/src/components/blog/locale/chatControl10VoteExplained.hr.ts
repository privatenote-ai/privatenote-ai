import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedHr: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Glasovanje Europskog parlamenta o Chat Controlu sa zaključanim chat oblačićem iznad karte Europe",
  heroCaption: "Ilustracija izrađena za PrivateNote.ai.",
  intro:
    "9. srpnja 2026. dogodilo se nešto neobično u Europskom parlamentu. Završno glasovanje o produljenju privremene uredbe Chat Control 1.0 završilo je s više zastupnika protiv nego za—i mjera je ipak usvojena.",
  voteEyebrow: "Završno glasovanje, 9. srpnja 2026.",
  voteHeadline: "Više glasova protiv nego za—i ipak usvojeno",
  voteLabels: { against: "Protiv", for: "Za", abstentions: "Suzdržani" },
  voteSummary:
    "Na prvi pogled većina promatrača zaključila bi da je prijedlog odbijen. Odgovor ne leži u šifriranju ili kibernetičkoj sigurnosti—već u parlamentarnom postupku.",
  nonE2eChannels: [
    "klasične usluge e-pošte",
    "pohrana u oblaku",
    "određene usluge izravnih poruka",
    "druga komunikacija u kojoj pružatelji mogu pristupiti sadržaju poruka",
  ],
  privacyConcerns: [
    {
      title: "Lažno pozitivni rezultati",
      body: "Otkrivanje već poznatog ilegalnog sadržaja putem kriptografskih hashova općenito je pouzdano, ali nije savršeno. Istraživači su pokazali kolizije i pogreške implementacije koje mogu stvoriti lažne prijave. Ako pružatelji koriste AI za prepoznavanje novog, dosad neviđenog materijala, stopu lažno pozitivnih rezultata znatno je teže kontrolirati. Svaka lažna prijava može značiti da se privatna komunikacija nevine osobe označi za daljnju provjeru.",
    },
    {
      title: "Širenje nadzorne infrastrukture",
      body: "Mnogi stručnjaci tvrde: kad platforme izgrade sustave za masovno skeniranje, tehnički je jednostavno proširiti ih na druge svrhe. Povijest pokazuje da tehnologije uvedene za uske svrhe često postaju širi nadzor.",
    },
    {
      title: "Odvratni učinak",
      body: "Privatna komunikacija funkcionira samo ako ljudi vjeruju da će njihovi razgovori ostati privatni. Ako korisnici vjeruju da se svaka poruka može automatski analizirati, mnogi u potpunosti izbjegavaju osjetljive teme—čak i ako su potpuno legalne. Taj fenomen dobro je dokumentiran u istraživanju privatnosti.",
    },
    {
      title: "Ograničena učinkovitost",
      body: "Više od 800 istraživača kibernetičke sigurnosti i privatnosti tvrdi da široko skeniranje poruka jedva da će značajno smanjiti zlostavljanje djece, ali će uzrokovati značajne troškove privatnosti za stotine milijuna korisnika. Kritičari smatraju ciljane istrage smislenijima od općeg skeniranja.",
    },
  ],
  e2eeCalloutTitle: "End-to-end šifriranje mijenja model povjerenja",
  e2eeCalloutBody:
    "End-to-end šifriranje osigurava da samo pošiljatelj i namjereni primatelj posjeduju kriptografske ključeve za čitanje poruke. Čak ni pružatelj usluge ne može dešifrirati sadržaj. Svaka obveza da se šifrirane poruke provjeravaju prije ili nakon šifriranja fundamentalno mijenja taj sigurnosni model—i jedna je od najkontroverznijih tema moderne politike kibernetičke sigurnosti.",
  sections: {
    whyPassed: {
      title: "Zašto je ipak usvojeno?",
      paragraphs: [
        "Ovo nije bilo uobičajeno zakonodavno glasovanje s jednostavnom većinom danih glasova. Zbog konkretne proceduralne faze **odbijanje prijedloga zahtijevalo je apsolutnu većinu svih članova Europskog parlamenta—trenutačno 361 glas**.",
        "Iako je 314 zastupnika glasovalo protiv, to nije bilo dovoljno za potrebni prag. Posljedično, prijedlog je smatran usvojenim.",
      ],
      callout:
        "Ovaj proceduralni ishod iznenadio je mnoge promatrače—novinare, pravnike i istraživače kibernetičke sigurnosti—jer se intuitivno očekuje da više glasova protiv nego za dovede do neuspjeha prijedloga.",
    },
    whatItDoes: {
      title: "Što Chat Control 1.0 zapravo radi?",
      paragraphs: [
        "Usvojena mjera **ne** uvodi obvezno skeniranje svih privatnih poruka. Umjesto toga produljuje postojeći privremeni pravni okvir koji online pružateljima usluga dopušta **dobrovoljno** otkrivanje i prijavljivanje dječje pornografije (CSAM) u određenim oblicima komunikacije do 3. travnja 2028.",
        "To se prvenstveno odnosi na komunikaciju bez [end-to-end šifriranja](blog:what-is-end-to-end-encryption), na primjer:",
        "Važno: Parlament je zadržao formulacije koje isključuju end-to-end šifriranu komunikaciju iz ovog okvira dobrovoljnog skeniranja. Preciznu definiciju—i razliku u odnosu na uobičajeno transportno šifriranje—nalazite u našem vodiču [Što end-to-end šifriranje zapravo jest](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Zašto su stručnjaci za privatnost zabrinuti?",
      intro:
        "Mnogi istraživači i organizacije za građanska prava odbili su produljenje—ne zato što odbijaju zaštitu djece, već zato što sumnjaju da ovaj pristup postiže cilj bez značajnih rizika. Naš raniji članak [Zašto europski kriptografi upozoravaju na Chat Control](blog:chat-control-europe-cryptographers) detaljno objašnjava šire tehničke prigovore.",
    },
    chatControl20: {
      title: "Veća priča zove se Chat Control 2.0",
      paragraphs: [
        "Iako je ovo tjedno glasovanje privuklo puno pažnje, mnogi stručnjaci vjeruju da prava rasprava tek dolazi. Prijedlog koji se često naziva Chat Control 2.0 cilja na trajni pravni okvir za otkrivanje CSAM-a na internetu.",
        "Za razliku od privremenog produljenja usvojenog ovog tjedna, rasprave o Chat Controlu 2.0 višekratno su uključivale prijedloge koji bi mogli zahvatiti end-to-end šifriranu komunikaciju. Tamo rasprava postaje znatno važnija—i tamo su upozorenja u našem [kriptografskom brifingu o Chat Controlu](blog:chat-control-europe-cryptographers) najvažnija.",
      ],
    },
    privateNote: {
      title: "Zašto je to važno za PrivateNote",
      paragraphs: [
        "Privatna komunikacija temelji se na jednostavnom načelu: ako usluga ne može pročitati vašu poruku, ne može je skenirati, analizirati, prodavati niti slučajno otkriti. PrivateNote je dizajniran oko te ideje.",
        "Kad stvorite bilješku, šifriranje se odvija izravno u vašem pregledniku. Ključ za šifriranje nikad ne stiže do naših poslužitelja. Pohranjujemo samo šifrirani tekst. Bez ključa—koji ostaje u potpunosti pod vašom kontrolom—sadržaj vaše bilješke za nas je matematički nečitljiv.",
        "Ovaj dizajn ne ide o izbjegavanju odgovornosti. Ide o tome da vaša privatna komunikacija ostane upravo to: privatna. Bilo da dijelite lozinke, pravne dokumente, financijske informacije, poslovne tajne ili osobne razgovore—privatnost ne bi trebala ovisiti samo o povjerenju u pružatelja. Trebala bi biti prisiljena kriptografijom.",
        "Korak po korak do šifriranja u pregledniku: [Kako PrivateNote radi](app:how-it-works). Za kratkotrajne tajne bez trajne povijesti chata [jednokratne tajne poveznice](blog:one-time-secret-links) često su prikladnije od messengera—čak i šifriranih.",
      ],
    },
    debateContinues: {
      title: "Rasprava daleko nije gotova",
      paragraphs: [
        "Razumni ljudi mogu se razilaziti o tome kako društvo treba boriti se protiv online zlostavljanja djece. Zaštita djece nedvojbeno je jedan od najvažnijih javnih interesa. Teško pitanje je kako postići taj cilj bez potkopavanja sigurnosne i privatnosne infrastrukture na koju se novinari, tvrtke, odvjetnici, zdravstveni radnici, aktivist i građani svakodnevno oslanjaju.",
        "Dok rasprave o Chat Controlu 2.0 traju, ova ravnoteža između javne sigurnosti i temeljnih prava na privatnost ostaje jedna od ključnih tehnološko-političkih rasprava u Europi. Bez obzira na stajalište: budućnost šifrirane komunikacije sve manje odlučuju samo kriptografi i softverski inženjeri—već i zakonodavci.",
      ],
    },
  },
  ctaTitle: "Šaljite privatne bilješke bez davanja ključa poslužitelju",
  ctaBody:
    "PrivateNote šifrira bilješke u vašem pregledniku i drži ključ za dešifriranje u URL fragmentu.",
  ctaButton: "Isprobajte PrivateNote ->",
};
