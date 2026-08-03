import type { GoodEnoughSecurityArticleCopy } from "./goodEnoughSecurity.types";

export const goodEnoughSecurityNl: GoodEnoughSecurityArticleCopy = {
  intro: [
    "Lang vertelde de industrie ons dat voorzichtigheid vooral ging over wachtwoordcomplexiteit en gezond verstand. Een lange reeks tekens en een voorzichtige klik zouden genoeg moeten zijn.",
    "Dat is niet zo. Moderne aanvallen zijn geautomatiseerd, schaalbaar en geduldig. Je gewoonten concurreren niet tegen één persoon; ze concurreren tegen infrastructuur.",
    "Het antwoord is geen paranoia. Het is architectuur: vertrouwen verminderen, gegevensretentie minimaliseren en single points of failure ontwerpen weg.",
  ],
  sections: [
    {
      title: "1. Wachtwoorden: geef entropie uit handen aan de machine",
      paragraphs: [
        "Mensen zijn slecht in het genereren van willekeur. Als we slim proberen te zijn, creëren we patronen die password crackers bewust misbruiken.",
        "Gebruik een wachtwoordmanager zodat elk account een uniek, hoog-entropie wachtwoord krijgt dat door software wordt gegenereerd in plaats van door je geheugen.",
        "Het enige geheim dat je onthoudt zou een lange passphrase moeten zijn, en de kluis zou een moderne key-derivation function zoals Argon2id moeten gebruiken.",
      ],
    },
    {
      title: "2. Authenticatie: origin-bound, niet alleen tweefactor",
      paragraphs: [
        "Traditionele tweefactorcodes helpen, maar kunnen nog steeds in real time worden gephished. SMS is bijzonder kwetsbaar omdat SIM-swaps en nummeroverdrachten routine zijn.",
        "FIDO2 en WebAuthn veranderen het protocol. Een passkey of hardware key bewijst bezit van een private key voor een specifieke website-origin, zodat een phishingdomein hem niet kan hergebruiken.",
      ],
      bullets: [
        "Security keys en passkeys: phishing-resistent en origin-bound.",
        "Authenticator-apps: nuttig, maar nog steeds kwetsbaar voor real-time phishing.",
        "SMS- of e-mailcodes: vermijd ze voor waardevolle accounts.",
      ],
    },
    {
      title: "3. Berichten: versleuteling is geen checkbox",
      paragraphs: [
        "End-to-end-versleuteling beschermt inhoud, maar designdetails doen ertoe. Forward secrecy houdt oude gesprekken veiliger als een langetermijnsleutel later wordt gecompromitteerd.",
        "Verdwijnende berichten verminderen de hoeveelheid data die achterblijft. Data die niet meer bestaat kan niet worden gescraped, opgevraagd via een dagvaarding of maanden later lekken.",
        "Versleuteling wist geen metadata en helpt niet als een aanvaller je ontgrendelde apparaat controleert.",
      ],
    },
    {
      title: "4. Netwerkhygiëne: de VPN-realiteitscheck",
      paragraphs: [
        "Een VPN is geen onzichtbaarheidsmantel. Het verschuift vertrouwen van het lokale netwerk naar de VPN-provider.",
        "Gebruik er een wanneer het een concreet probleem oplost: vijandige wifi, censuur of traffic shaping. Verwacht niet dat het zwakke browserhygiëne of slechte authenticatie oplost.",
        "Moderne protocollen zoals WireGuard zijn aantrekkelijk omdat hun ontwerp compact, auditeerbaar en gebouwd is op goed begrepen cryptografische primitieven.",
      ],
    },
    {
      title: "5. Browsers: waar de meeste accounts echt falen",
      paragraphs: [
        "Veel accountovernames beginnen met gestolen sessiecookies, niet met gebroken cryptografie. De browser is een risicovolle omgeving vol scripts, extensies en langdurige sessies.",
        "Houd extensies minimaal, blokkeer third-party scripts agressief en scheid identiteiten met profielen of containers waar mogelijk.",
        "Phishing-resistente authenticatie is hier cruciaal: een origin-bound hardware key weigert mee te doen op het verkeerde domein.",
      ],
    },
    {
      title: "6. Veilig delen: de blast radius verkleinen",
      paragraphs: [
        "Geheimen moeten soms gedeeld worden, maar e-mail en werkplekchat creëren permanente security debt via logs, back-ups, previews en metadata.",
        "Het veiligere patroon is kortstondig, client-side versleuteld delen: versleutel vóór upload, sla geen sleutels server-side op en laat agressief verlopen.",
        "Kortstondigheid is geen gimmick. Het is dataminimalisatie toegepast op menselijke workflows.",
      ],
    },
    {
      title: "Een weekendbaseline",
      paragraphs: [
        "Security is geen binaire staat. Het is incrementele frictie op de juiste plekken.",
        "Het doel is niet onhackbaar te zijn. Het doel is de kosten van een aanval op jou hoger te maken dan de waarde van de verkregen data.",
      ],
      ordered: [
        "Zet gevoelige accounts over op unieke wachtwoorden gegenereerd door een manager.",
        "Voeg hardware-ondersteunde authenticatie toe aan je primaire identiteit, vooral e-mail.",
        "Bekijk en verwijder onnodige browserextensies.",
        "Verplaats gevoelige gesprekken naar een end-to-end versleutelde messenger met verdwijnende berichten.",
      ],
    },
  ],
};
