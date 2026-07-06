import type { GoodEnoughSecurityArticleCopy } from "./goodEnoughSecurity.types";

export const goodEnoughSecurityHr: GoodEnoughSecurityArticleCopy = {
  intro: [
    "Dugo su nam govorili da je oprez prvenstveno pitanje složenosti lozinki i zdravog razuma. Duga niz znakova i oprezan klik trebali su biti dovoljni.",
    "Nisu. Moderni napadi su automatizirani, skalabilni i strpljivi. Vaše navike ne natječu se s jednom osobom; natječu se s infrastrukturom.",
    "Odgovor nije paranoia. To je arhitektura: smanjiti povjerenje, minimizirati zadržavanje podataka i ukloniti jedinstvene točke kvara dizajnom.",
  ],
  sections: [
    {
      title: "1. Lozinke: prepustite entropiju stroju",
      paragraphs: [
        "Ljudi loše generiraju slučajnost. Kad pokušavamo biti pametni, stvaramo obrasce koje alati za probijanje lozinki namjerno iskorištavaju.",
        "Koristite upravitelj lozinki kako bi svaki račun dobio jedinstvenu, visokoentropijsku lozinku koju generira softver, a ne pamćenje.",
        "Jedino tajno što pamtite treba biti duga fraza, a trezor bi trebao koristiti modernu derivaciju ključeva poput Argon2id.",
      ],
    },
    {
      title: "2. Autentifikacija: vezana uz porijeklo, ne samo dva faktora",
      paragraphs: [
        "Klasični kodovi za dva faktora pomažu, ali se i dalje mogu phishati u stvarnom vremenu. SMS je posebno krhak jer su SIM swapovi i prijenosi brojeva uobičajeni.",
        "FIDO2 i WebAuthn mijenjaju protokol. Passkey ili hardverski ključ dokazuje posjedovanje privatnog ključa za određeno web-mjesto, pa phishing domena ne može ponovno iskoristiti ključ.",
      ],
      bullets: [
        "Sigurnosni ključevi i passkeyevi: otporni na phishing i vezani uz porijeklo.",
        "Aplikacije za autentifikaciju: korisne, ali i dalje ranjive na phishing u stvarnom vremenu.",
        "SMS ili e-mail kodovi: izbjegavajte ih za vrijedne račune.",
      ],
    },
    {
      title: "3. Poruke: enkripcija nije potvrdni okvir",
      paragraphs: [
        "End-to-end enkripcija štiti sadržaj, ali detalji dizajna imaju značaj. Forward secrecy čini stare razgovore sigurnijima ako se dugoročni ključ kasnije kompromitira.",
        "Nestajuće poruke smanjuju količinu podataka koja ostaje iza. Podaci koji više ne postoje ne mogu se pretraživati, tražiti sudskim putem niti cureti mjesecima kasnije.",
        "Enkripcija ne briše metapodatke i ne pomaže ako napadač kontrolira vaš otključani uređaj.",
      ],
    },
    {
      title: "4. Mrežna higijena: stvarnost VPN-a",
      paragraphs: [
        "VPN nije plašt nevidivosti. Pomiče povjerenje s lokalne mreže na VPN pružatelja.",
        "Koristite ga kad rješava konkretan problem: neprijateljski Wi-Fi, cenzura ili oblikovanje prometa. Ne očekujte da popravi lošu higijenu preglednika ili slabu autentifikaciju.",
        "Moderni protokoli poput WireGuarda privlačni su jer je njihov dizajn kompaktan, provjerljiv i izgrađen na dobro razumijevanim kriptografskim primitivima.",
      ],
    },
    {
      title: "5. Preglednici: gdje većina računa stvarno propadne",
      paragraphs: [
        "Mnoge preuzimanja računa počinju ukradenim session kolačićima, a ne probijenom kriptografijom. Preglednik je rizično okruženje puno skripti, proširenja i dugotrajnih sesija.",
        "Držite proširenja na minimumu, agresivno blokirajte skripte trećih strana i odvajajte identitete profilima ili kontejnerima gdje je moguće.",
        "Autentifikacija otporna na phishing ovdje je ključna: hardverski ključ vezan uz porijeklo odbija sudjelovanje na pogrešnoj domeni.",
      ],
    },
    {
      title: "6. Sigurno dijeljenje: smanjenje radijusa eksplozije",
      paragraphs: [
        "Tajne ponekad treba podijeliti, ali e-mail i poslovni chat stvaraju trajni sigurnosni dug kroz logove, sigurnosne kopije, preglede i metapodatke.",
        "Sigurniji obrazac je kratkotrajno, klijentski enkriptirano dijeljenje: enkriptirati prije uploada, ne pohranjivati ključeve na poslužitelju i agresivno istjecati.",
        "Kratkotrajnost nije trik. To je minimizacija podataka primijenjena na ljudske tijekove rada.",
      ],
    },
    {
      title: "Vikend osnova",
      paragraphs: [
        "Sigurnost nije binarno stanje. To je postupno trenje na pravim mjestima.",
        "Cilj nije biti neprobojan. Cilj je učiniti trošak napada na vas većim od vrijednosti dobivenih podataka.",
      ],
      ordered: [
        "Prebacite osjetljive račune na jedinstvene lozinke generirane upraviteljem.",
        "Dodajte hardverski potkrijepljenu autentifikaciju primarnom identitetu, posebno e-mailu.",
        "Pregledajte i uklonite nepotrebna proširenja preglednika.",
        "Premjestite osjetljive razgovore u end-to-end enkriptirani messenger s uključenim nestajućim porukama.",
      ],
    },
  ],
};
