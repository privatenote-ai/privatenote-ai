import type { GoodEnoughSecurityArticleCopy } from "./goodEnoughSecurity.types";

export const goodEnoughSecuritySr: GoodEnoughSecurityArticleCopy = {
  intro: [
    "Dugo su nam govorili da je oprez prvenstveno pitanje složenosti lozinki i zdravog razuma. Duga niz znakova i oprezan klik trebali su biti dovoljni.",
    "Nisu. Moderni napadi su automatizovani, skalabilni i strpljivi. Vaše navike se ne takmiče sa jednom osobom; takmiče se sa infrastrukturom.",
    "Odgovor nije paranoia. To je arhitektura: smanjiti poverenje, minimizovati zadržavanje podataka i ukloniti jedinstvene tačke kvara dizajnom.",
  ],
  sections: [
    {
      title: "1. Lozinke: prepustite entropiju mašini",
      paragraphs: [
        "Ljudi loše generišu slučajnost. Kada pokušavamo da budemo pametni, stvaramo obrasce koje alati za probijanje lozinki namerno iskorišćavaju.",
        "Koristite menadžer lozinki kako bi svaki nalog dobio jedinstvenu, visokoentropijsku lozinku koju generiše softver, a ne pamćenje.",
        "Jedino tajno koje pamtite treba da bude duga fraza, a trezor bi trebalo da koristi modernu derivaciju ključeva poput Argon2id.",
      ],
    },
    {
      title: "2. Autentifikacija: vezana za poreklo, ne samo dva faktora",
      paragraphs: [
        "Klasični kodovi za dva faktora pomažu, ali se i dalje mogu phishovati u realnom vremenu. SMS je posebno krhak jer su SIM swapovi i prenosi brojeva uobičajeni.",
        "FIDO2 i WebAuthn menjaju protokol. Passkey ili hardverski ključ dokazuje posedovanje privatnog ključa za određeno web-mesto, pa phishing domen ne može ponovo iskoristiti ključ.",
      ],
      bullets: [
        "Bezbednosni ključevi i passkeyevi: otporni na phishing i vezani za poreklo.",
        "Aplikacije za autentifikaciju: korisne, ali i dalje ranjive na phishing u realnom vremenu.",
        "SMS ili e-mail kodovi: izbegavajte ih za vredne naloge.",
      ],
    },
    {
      title: "3. Poruke: enkripcija nije potvrdni okvir",
      paragraphs: [
        "End-to-end enkripcija štiti sadržaj, ali detalji dizajna imaju značaj. Forward secrecy čini stare razgovore sigurnijim ako se dugoročni ključ kasnije kompromituje.",
        "Nestajuće poruke smanjuju količinu podataka koja ostaje iza. Podaci koji više ne postoje ne mogu se pretraživati, tražiti sudskim putem niti cureti mesecima kasnije.",
        "Enkripcija ne briše metapodatke i ne pomaže ako napadač kontroliše vaš otključani uređaj.",
      ],
    },
    {
      title: "4. Mrežna higijena: stvarnost VPN-a",
      paragraphs: [
        "VPN nije plašt nevidivosti. Pomeri poverenje sa lokalne mreže na VPN provajdera.",
        "Koristite ga kada rešava konkretan problem: neprijateljski Wi-Fi, cenzura ili oblikovanje saobraćaja. Ne očekujte da popravi lošu higijenu pregledača ili slabu autentifikaciju.",
        "Moderni protokoli poput WireGuarda privlačni su jer je njihov dizajn kompaktan, proverljiv i izgrađen na dobro razumevanim kriptografskim primitivima.",
      ],
    },
    {
      title: "5. Pregledači: gde većina naloga stvarno propadne",
      paragraphs: [
        "Mnoge preuzimanja naloga počinju ukradenim session kolačićima, a ne probijenom kriptografijom. Pregledač je rizično okruženje puno skripti, proširenja i dugotrajnih sesija.",
        "Držite proširenja na minimumu, agresivno blokirajte skripte trećih strana i odvajajte identitete profilima ili kontejnerima gde je moguće.",
        "Autentifikacija otporna na phishing ovde je ključna: hardverski ključ vezan za poreklo odbija učešće na pogrešnoj domeni.",
      ],
    },
    {
      title: "6. Sigurno deljenje: smanjenje radijusa eksplozije",
      paragraphs: [
        "Tajne ponekad treba podeliti, ali e-mail i poslovni chat stvaraju trajni bezbednosni dug kroz logove, rezervne kopije, preglede i metapodatke.",
        "Sigurniji obrazac je kratkotrajno, klijentski enkriptovano deljenje: enkriptovati pre uploada, ne čuvati ključeve na serveru i agresivno istecati.",
        "Kratkotrajnost nije trik. To je minimizacija podataka primenjena na ljudske tokove rada.",
      ],
    },
    {
      title: "Vikend osnova",
      paragraphs: [
        "Bezbednost nije binarno stanje. To je postepeno trenje na pravim mestima.",
        "Cilj nije biti neprobojan. Cilj je učiniti trošak napada na vas većim od vrednosti dobijenih podataka.",
      ],
      ordered: [
        "Prebacite osetljive naloge na jedinstvene lozinke generisane menadžerom.",
        "Dodajte hardverski potkrepljenu autentifikaciju primarnom identitetu, posebno e-mailu.",
        "Pregledajte i uklonite nepotrebna proširenja pregledača.",
        "Premestite osetljive razgovore u end-to-end enkriptovani messenger sa uključenim nestajućim porukama.",
      ],
    },
  ],
};
