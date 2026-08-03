import type { WorkplaceTextsArticleCopy } from "./workplaceTexts.types";

export const workplaceTextsSr: WorkplaceTextsArticleCopy = {
  sourceLabel: "Inspirisano izveštavanjem Business Insidera",
  intro: [
    "Nedavno izveštavanje Business Insidera o suđenju OpenAI-ju podseća da je moderna komunikacija na radnom mestu u praksi trajna.",
    "Tekstualne poruke, Slack razgovori, AI transkripti sastanaka, sinhronizovani uređaji, chatovi na ličnom telefonu i alati za saradnju mogu postati dokaz dugo nakon što nestane izvorni kontekst.",
    "Lekcija nije sakriti pogrešno ponašanje. Radi se o namernom odlučivanju šta se piše, gde živi i koliko dugo preživljava.",
  ],
  sections: [
    {
      title: "Pisane poruke žive duže nego što ljudi očekuju",
      body: [
        "Brza poruka može delovati neformalno i privremeno, ali digitalna komunikacija retko ostaje zatvorena.",
        "Snimci ekrana, pregledi obaveštenja, rezervne kopije u oblaku, sinhronizovani uređaji, prosleđeni e-mailovi, AI sažeci i arhivirani chatovi stvaraju dodatne kopije koje mogu postojati godinama.",
        "Kako se timovi više oslanjaju na AI alate, automatski zapisi i dalje rastu. Asistenti za sastanke generišu transkripte, copiloti sažimaju razgovore, a produktivne platforme sve više pretvaraju privremene rasprave u pretraživo institucionalno sećanje.",
      ],
    },
    {
      title: "Ne svaka poruka mora postati trajna istorija",
      body: [
        "Neke komunikacije svakako treba zadržati radi odgovornosti, operacija, usklađenosti ili pravnih obaveza. Ali mnoge ne trebaju trajnu pohranu.",
        "Privremene kredencijale, kodovi za oporavak, jednokratne upute, osetljivi nacrti, privatne povratne informacije, pravno osetljiv kontekst i kratkotrajni operativni detalji često imaju ograničenu svrhu i životni vek.",
        "Dobra higijena komunikacije znači razlikovati informacije koje moraju trajati od onih koje trebaju postojati samo kratko.",
      ],
    },
    {
      title: "Gde PrivateNote pomaže",
      body: [
        "PrivateNote je koristan kada informacije treba podeliti kratko bez stvaranja još jednog dugoročno pretraživog zapisa.",
        "Beleške se enkriptuju u pregledaču pre uploada. Server čuva samo šifrovani tekst, dok ključ za dešifrovanje ostaje u URL fragmentu i ne šalje se serveru u standardnim zahtevima.",
        "To pomaže timovima da dele privremene informacije bez automatskog dodavanja u Slack arhive, Teams istoriju, e-mail sandučiće, SMS rezervne kopije ili sisteme za saradničke dokumente.",
      ],
      bullets: [
        "Lozinke i kodovi za oporavak",
        "Privremene upute za pristup",
        "Osetljivi jednokratni operativni detalji",
        "Pravno osetljivi nacrti ili kontekst",
        "Privatne predaje između članova tima",
        "Informacije sa kratkim operativnim životnim vekom",
      ],
    },
    {
      title: "Šta PrivateNote ne rešava",
      body: [
        "Nijedan alat ne čini neprimerenu poruku sigurnom. Primaoci i dalje mogu snimiti ekran, kopirati, fotografisati ili proslediti ono što vide.",
        "Kompromitovani uređaj može otkriti čist tekst dok je beleška otvorena. Kratkotrajni alati takođe ne zamenjuju pravne obaveze, politike kompanije, zahteve zadržavanja niti profesionalnu procenu.",
        "PrivateNote smanjuje izloženost na strani servera i dugoročno zadržavanje. Ne eliminiše rizik niti zamenjuje razgovor uživo kada je nijansa važnija od praktičnosti.",
      ],
    },
    {
      title: "Bolje pravilo za osetljivu komunikaciju na poslu",
      body: [
        "Pre slanja poruke postavite dva pitanja: Da li ovo treba biti napisano? Da li ovo treba trajati?",
        "Ako je prvi odgovor ne, razgovarajte uživo. Ako je drugi ne, koristite kratkotrajni i enkriptovani kanal dizajniran za privremenu komunikaciju.",
        "Ta mala navika može sprečiti da privremeni kontekst postane trajni dokaz.",
      ],
    },
  ],
  ctaTitle: "Koristite privatnost kao tok rada, ne kao dugme za paniku",
  ctaBody:
    "Alati za privatnost najefikasniji su kada se usvoje pre nego što nastane problem. Koristite kratkotrajnu komunikaciju za tajne, jednokratne upute i kratkotrajni kontekst koji ne bi trebalo da postane trajna radna istorija.",
  ctaButton: "Napišite privatnu belešku",
};
