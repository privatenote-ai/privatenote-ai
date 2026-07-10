import type { ChatControl10VoteArticleCopy } from "./chatControl10VoteExplained.types";

export const chatControl10VoteExplainedSr: ChatControl10VoteArticleCopy = {
  heroAlt:
    "Glasanje Evropskog parlamenta o Chat Controlu sa zaključanim čet oblačićem iznad mape Evrope",
  heroCaption: "Ilustracija napravljena za PrivateNote.ai.",
  intro:
    "9. jula 2026. dogodilo se nešto neobično u Evropskom parlamentu. Završno glasanje o produženju privremene uredbe Chat Control 1.0 završilo se sa više poslanika protiv nego za—i mera je ipak usvojena.",
  voteEyebrow: "Završno glasanje, 9. jula 2026.",
  voteHeadline: "Više glasova protiv nego za—i ipak usvojeno",
  voteLabels: { against: "Protiv", for: "Za", abstentions: "Suzdržani" },
  voteSummary:
    "Na prvi pogled većina posmatrača zaključila bi da je predlog odbijen. Odgovor ne leži u šifrovanju ili sajber bezbednosti—već u parlamentarnom postupku.",
  nonE2eChannels: [
    "klasične usluge e-pošte",
    "skladištenje u oblaku",
    "određene usluge direktnih poruka",
    "druga komunikacija u kojoj provajderi mogu pristupiti sadržaju poruka",
  ],
  privacyConcerns: [
    {
      title: "Lažno pozitivni rezultati",
      body: "Otkrivanje već poznatog ilegalnog sadržaja putem kriptografskih hashova opštenito je pouzdano, ali nije savršeno. Istraživači su pokazali kolizije i greške implementacije koje mogu stvoriti lažne prijave. Ako provajderi koriste AI za prepoznavanje novog, dosad neviđenog materijala, stopu lažno pozitivnih rezultata znatno je teže kontrolisati. Svaka lažna prijava može značiti da se privatna komunikacija nevine osobe označi za dalju proveru.",
    },
    {
      title: "Širenje nadzorne infrastrukture",
      body: "Mnogi stručnjaci tvrde: kada platforme izgrade sisteme za masovno skeniranje, tehnički je jednostavno proširiti ih na druge svrhe. Istorija pokazuje da tehnologije uvedene za uske svrhe često postaju širi nadzor.",
    },
    {
      title: "Odvratni efekat",
      body: "Privatna komunikacija funkcioniše samo ako ljudi veruju da će njihovi razgovori ostati privatni. Ako korisnici veruju da se svaka poruka može automatski analizirati, mnogi u potpunosti izbegavaju osetljive teme—čak i ako su potpuno legalne. Taj fenomen dobro je dokumentovan u istraživanju privatnosti.",
    },
    {
      title: "Ograničena efikasnost",
      body: "Više od 800 istraživača sajber bezbednosti i privatnosti tvrdi da široko skeniranje poruka jedva da će značajno smanjiti zlostavljanje dece, ali će uzrokovati značajne troškove privatnosti za stotine miliona korisnika. Kritičari smatraju ciljane istrage smislenijim od opšteg skeniranja.",
    },
  ],
  e2eeCalloutTitle: "End-to-end šifrovanje menja model poverenja",
  e2eeCalloutBody:
    "End-to-end šifrovanje obezbeđuje da samo pošiljalac i namerni primalac poseduju kriptografske ključeve za čitanje poruke. Čak ni provajder usluge ne može dešifrovati sadržaj. Svaka obaveza da se šifrovane poruke proveravaju pre ili posle šifrovanja fundamentalno menja taj bezbednosni model—i jedna je od najkontroverznijih tema moderne politike sajber bezbednosti.",
  sections: {
    whyPassed: {
      title: "Zašto je ipak usvojeno?",
      paragraphs: [
        "Ovo nije bilo uobičajeno zakonodavno glasanje sa jednostavnom većinom datih glasova. Zbog konkretne proceduralne faze **odbijanje predloga zahtevalo je apsolutnu većinu svih članova Evropskog parlamenta—trenutno 361 glas**.",
        "Iako je 314 poslanika glasalo protiv, to nije bilo dovoljno za potrebni prag. Posledično, predlog je smatran usvojenim.",
      ],
      callout:
        "Ovaj proceduralni ishod iznenadio je mnoge posmatrače—novinare, pravnike i istraživače sajber bezbednosti—jer se intuitivno očekuje da više glasova protiv nego za dovede do neuspeha predloga.",
    },
    whatItDoes: {
      title: "Šta Chat Control 1.0 zapravo radi?",
      paragraphs: [
        "Usvojena mera **ne** uvodi obavezno skeniranje svih privatnih poruka. Umesto toga produžava postojeći privremeni pravni okvir koji online provajderima usluga dozvoljava **dobrovoljno** otkrivanje i prijavljivanje dečje pornografije (CSAM) u određenim oblicima komunikacije do 3. aprila 2028.",
        "To se prvenstveno odnosi na komunikaciju bez [end-to-end šifrovanja](blog:what-is-end-to-end-encryption), na primer:",
        "Važno: Parlament je zadržao formulacije koje isključuju end-to-end šifrovanu komunikaciju iz ovog okvira dobrovoljnog skeniranja. Preciznu definiciju—i razliku u odnosu na uobičajeno transportno šifrovanje—nalazite u našem vodiču [Šta end-to-end šifrovanje zapravo jeste](blog:what-is-end-to-end-encryption).",
      ],
    },
    privacyExperts: {
      title: "Zašto su stručnjaci za privatnost zabrinuti?",
      intro:
        "Mnogi istraživači i organizacije za građanska prava odbili su produženje—ne zato što odbijaju zaštitu dece, već zato što sumnjaju da ovaj pristup postiže cilj bez značajnih rizika. Naš raniji članak [Zašto evropski kriptografi upozoravaju na Chat Control](blog:chat-control-europe-cryptographers) detaljno objašnjava šire tehničke prigovore.",
    },
    chatControl20: {
      title: "Veća priča zove se Chat Control 2.0",
      paragraphs: [
        "Iako je ovo nedeljno glasanje privuklo puno pažnje, mnogi stručnjaci veruju da prava rasprava tek dolazi. Predlog koji se često naziva Chat Control 2.0 cilja na trajni pravni okvir za otkrivanje CSAM-a na internetu.",
        "Za razliku od privremenog produženja usvojenog ove nedelje, rasprave o Chat Controlu 2.0 višekratno su uključivale predloge koji bi mogli zahvatiti end-to-end šifrovanu komunikaciju. Tamo rasprava postaje znatno važnija—i tamo su upozorenja u našem [kriptografskom brifingu o Chat Controlu](blog:chat-control-europe-cryptographers) najvažnija.",
      ],
    },
    privateNote: {
      title: "Zašto je to važno za PrivateNote",
      paragraphs: [
        "Privatna komunikacija temelji se na jednostavnom načelu: ako usluga ne može pročitati vašu poruku, ne može je skenirati, analizirati, prodavati niti slučajno otkriti. PrivateNote je dizajniran oko te ideje.",
        "Kada stvorite belešku, šifrovanje se odvija direktno u vašem pretraživaču. Ključ za šifrovanje nikad ne stiže do naših servera. Čuvamo samo šifrovani tekst. Bez ključa—koji ostaje u potpunosti pod vašom kontrolom—sadržaj vaše beleške za nas je matematički nečitljiv.",
        "Ovaj dizajn ne ide o izbegavanju odgovornosti. Ide o tome da vaša privatna komunikacija ostane upravo to: privatna. Bilo da delite lozinke, pravne dokumente, finansijske informacije, poslovne tajne ili lične razgovore—privatnost ne bi trebalo da zavisi samo od poverenja u provajdera. Trebalo bi da bude prisiljena kriptografijom.",
        "Korak po korak do šifrovanja u pretraživaču: [Kako PrivateNote radi](app:how-it-works). Za kratkotrajne tajne bez trajne istorije četa [jednokratni tajni linkovi](blog:one-time-secret-links) često su prikladniji od messengera—čak i šifrovanih.",
      ],
    },
    debateContinues: {
      title: "Rasprava daleko nije gotova",
      paragraphs: [
        "Razumni ljudi mogu se razilaziti o tome kako društvo treba da se bori protiv online zlostavljanja dece. Zaštita dece nedvojbeno je jedan od najvažnijih javnih interesa. Teško pitanje je kako postići taj cilj bez potkopavanja bezbednosne i privatnosne infrastrukture na koju se novinari, kompanije, advokati, zdravstveni radnici, aktivisti i građani svakodnevno oslanjaju.",
        "Dok rasprave o Chat Controlu 2.0 traju, ova ravnoteža između javne bezbednosti i temeljnih prava na privatnost ostaje jedna od ključnih tehnološko-političkih rasprava u Evropi. Bez obzira na stajalište: budućnost šifrovane komunikacije sve manje odlučuju samo kriptografi i softverski inženjeri—već i zakonodavci.",
      ],
    },
  },
  ctaTitle: "Šaljite privatne beleške bez davanja ključa serveru",
  ctaBody:
    "PrivateNote šifruje beleške u vašem pretraživaču i drži ključ za dešifrovanje u URL fragmentu.",
  ctaButton: "Isprobajte PrivateNote ->",
};
