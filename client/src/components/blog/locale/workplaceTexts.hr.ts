import type { WorkplaceTextsArticleCopy } from "./workplaceTexts.types";

export const workplaceTextsHr: WorkplaceTextsArticleCopy = {
  sourceLabel: "Inspirirano izvještavanjem Business Insidera",
  intro: [
    "Nedavno izvještavanje Business Insidera o suđenju OpenAI-ju podsjeća da je moderna komunikacija na radnom mjestu u praksi trajna.",
    "Tekstualne poruke, Slack razgovori, AI transkripti sastanaka, sinkronizirani uređaji, chatovi na osobnom telefonu i alati za suradnju mogu postati dokaz dugo nakon što nestane izvorni kontekst.",
    "Lekcija nije sakriti pogrešno ponašanje. Radi se o namjernom odlučivanju što se piše, gdje živi i koliko dugo preživljava.",
  ],
  sections: [
    {
      title: "Pisane poruke žive duže nego što ljudi očekuju",
      body: [
        "Brza poruka može djelovati neformalno i privremeno, ali digitalna komunikacija rijetko ostaje zatvorena.",
        "Snimke zaslona, pregledi obavijesti, sigurnosne kopije u oblaku, sinkronizirani uređaji, proslijeđeni e-mailovi, AI sažetci i arhivirani chatovi stvaraju dodatne kopije koje mogu postojati godinama.",
        "Kako se timovi više oslanjaju na AI alate, automatski zapisi i dalje rastu. Asistenti za sastanke generiraju transkripte, copiloti sažimaju razgovore, a produktivne platforme sve više pretvaraju privremene rasprave u pretraživo institucionalno sjećanje.",
      ],
    },
    {
      title: "Ne svaka poruka mora postati trajna povijest",
      body: [
        "Neke komunikacije svakako treba zadržati radi odgovornosti, operacija, usklađenosti ili pravnih obveza. Ali mnoge ne trebaju trajnu pohranu.",
        "Privremene vjerodajnice, kodovi za oporavak, jednokratne upute, osjetljivi nacrti, privatne povratne informacije, pravno osjetljivi kontekst i kratkotrajni operativni detalji često imaju ograničenu svrhu i životni vijek.",
        "Dobra higijena komunikacije znači razlikovati informacije koje moraju trajati od onih koje trebaju postojati samo kratko.",
      ],
    },
    {
      title: "Gdje PrivateNote pomaže",
      body: [
        "PrivateNote je koristan kad informacije treba podijeliti kratko bez stvaranja još jednog dugoročno pretraživog zapisa.",
        "Bilješke se enkriptiraju u pregledniku prije uploada. Poslužitelj pohranjuje samo šifrirani tekst, dok ključ za dešifriranje ostaje u URL fragmentu i ne šalje se poslužitelju u standardnim zahtjevima.",
        "To pomaže timovima dijeliti privremene informacije bez automatskog dodavanja u Slack arhive, Teams povijest, e-mail pretince, SMS sigurnosne kopije ili sustave za suradničke dokumente.",
      ],
      bullets: [
        "Lozinke i kodovi za oporavak",
        "Privremene upute za pristup",
        "Osjetljivi jednokratni operativni detalji",
        "Pravno osjetljivi nacrti ili kontekst",
        "Privatne predaje između članova tima",
        "Informacije s kratkim operativnim životnim vijekom",
      ],
    },
    {
      title: "Što PrivateNote ne rješava",
      body: [
        "Nijedan alat ne čini neprimjerenu poruku sigurnom. Primatelji i dalje mogu snimiti zaslon, kopirati, fotografirati ili proslijediti ono što vide.",
        "Kompromitirani uređaj može otkriti čisti tekst dok je bilješka otvorena. Kratkotrajni alati također ne zamjenjuju pravne obveze, politike tvrtke, zahtjeve zadržavanja niti profesionalnu prosudbu.",
        "PrivateNote smanjuje izloženost na strani poslužitelja i dugoročno zadržavanje. Ne eliminira rizik niti zamjenjuje razgovor uživo kad je nijansa važnija od praktičnosti.",
      ],
    },
    {
      title: "Bolje pravilo za osjetljivu komunikaciju na radu",
      body: [
        "Prije slanja poruke postavite dva pitanja: Treba li ovo biti napisano? Treba li ovo trajati?",
        "Ako je prvi odgovor ne, razgovarajte uživo. Ako je drugi ne, koristite kratkotrajni i enkriptirani kanal dizajniran za privremenu komunikaciju.",
        "Ta mala navika može spriječiti da privremeni kontekst postane trajni dokaz.",
      ],
    },
  ],
  ctaTitle: "Koristite privatnost kao tijek rada, ne kao gumb za paniku",
  ctaBody:
    "Alati za privatnost najučinkovitiji su kad se usvoje prije nego što nastane problem. Koristite kratkotrajnu komunikaciju za tajne, jednokratne upute i kratkotrajni kontekst koji ne bi trebao postati trajna radna povijest.",
  ctaButton: "Napišite privatnu bilješku",
};
