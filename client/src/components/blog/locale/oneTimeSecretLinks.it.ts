import type { OneTimeSecretLinksArticleCopy } from "./oneTimeSecretLinks.types";

export const oneTimeSecretLinksIt: OneTimeSecretLinksArticleCopy = {
  intro: [
    "La maggior parte delle persone condivide informazioni sensibili come tutto il resto: via e-mail, in Slack o con un SMS.",
    "Funziona finché non ti rendi conto di cosa hai davvero fatto. Non hai solo consegnato una password o una chiave API — hai lasciato un **registro permanente** nella casella di posta di qualcun altro, nell’archivio chat dell’azienda, in un backup cloud, in un export di compliance o in un riepilogo di riunione generato dall’IA a cui nessuno pensa più.",
    "Nel processo **Musk vs. Altman** del 2026, sono stati presentati come prove SMS tra Sam Altman e Mira Murati riguardo al suo allontanamento da OpenAI nel novembre 2023. Scambi che sembravano privati al momento — messaggi affrettati su chiamate del consiglio e un ritorno — sono diventati allegati giudiziari. Il problema non era l’intercettazione. Era la **conservazione**.",
    "Alcune informazioni hanno un ruolo breve. Una password di staging. Un codice di recupero. Un’istruzione di accesso monouso. Credenziali di un contractor che scadono venerdì. Questi segreti non hanno bisogno di una cronologia ricercabile. Devono arrivare, essere usati e scomparire.",
    "A questo servono i **link segreti monouso**.",
  ],
  sections: [
    {
      title: 'Il problema dei canali «abbastanza sicuri»',
      paragraphs: [
        "L’e-mail può essere crittografata in transito. Slack può avere SSO. Signal offre messaggi che scompaiono. Tutto questo aiuta — ma risolve un problema diverso.",
        "Il problema non è sempre l’intercettazione. È la **conservazione**.",
        "Quando invii un segreto tramite un canale normale, scommetti su una lunga catena di assunzioni:",
      ],
      bullets: [
        { label: "Il messaggio non verrà mai inoltrato, catturato in screenshot o copiato.", body: "" },
        { label: "Nessuno cercherà per errore la cronologia chat condivisa sei mesi dopo.", body: "" },
        {
          label:
            "Backup, export del server e flussi eDiscovery non trasformeranno una consegna rapida in una responsabilità a lungo termine.",
          body: "",
        },
        {
          label:
            "I bot di anteprima link in Slack, Teams o iMessage non recupereranno automaticamente l’URL e non bruceranno la nota prima che il destinatario apra il link.",
          body: "",
        },
        {
          label:
            "Il segreto verrà ruotato immediatamente dopo l’uso, anche se il vecchio valore resta da qualche parte in un log del server.",
          body: "",
        },
      ],
      callout:
        "**Separazione dei compiti:** la crittografia protegge il contenuto in movimento. L’effimero riduce ciò che esiste dopo. Entrambi contano — ma la maggior parte degli strumenti di comunicazione ottimizza molto il primo e ignora completamente il secondo.",
    },
    {
      title: "Cos’è davvero un link segreto monouso",
      paragraphs: [
        'Un link segreto monouso (a volte chiamato link **burn-after-reading** o nota autodistruttiva) è un URL pensato per consegnare testo sensibile a un solo lettore, una volta. Dopo quella lettura, il contenuto dovrebbe essere sparito — non archiviato, non ricercabile, non lasciato in una casella di posta o nella cronologia chat.',
        "Un **vero design monouso** è più rigoroso di un timer di scadenza. Punto cruciale: **la chiave di crittografia viene generata nel browser** — mai sul server — e il testo in chiaro viene crittografato lì prima di qualsiasi trasferimento.",
      ],
      chromeExtensionCta: "Installa l’estensione Chrome",
      beforeFlowSteps: "**In pratica, l’intero flusso appare così:**",
      flowSteps: [
        {
          title: "Generazione chiave e crittografia nel browser",
          step: "Passo 1: il tuo browser",
          body: "Scrivi il segreto nel browser. Il browser genera localmente una nuova chiave di crittografia e la usa per crittografare il testo — prima che qualsiasi richiesta di rete lasci il dispositivo.",
        },
        {
          title: "Solo testo cifrato viene trasferito",
          step: "Passo 2: il server",
          body: "Viene caricato solo il contenuto crittografato. Il server memorizza testo cifrato che non può leggere perché non ha mai ricevuto la chiave né il testo in chiaro.",
        },
        {
          title: "La chiave resta nel link",
          step: "Passo 3: l’URL",
          body: "La chiave generata nel browser viene aggiunta al link nel frammento URL — la parte dopo # — che non viene mai inviato al server.",
        },
        {
          title: "Una lettura, poi sparito",
          step: "Passo 4: il destinatario",
          body: "Il destinatario apre il link completo. Il browser legge la chiave dal frammento, decifra localmente e il server elimina il contenuto crittografato dopo quella prima lettura riuscita.",
        },
      ],
      afterFlowSteps: [
        "Non ogni strumento venduto come link segreto monouso segue questo schema. Alcuni strumenti crittografano sul server dopo aver ricevuto il testo — o generano la chiave lì, il che significherebbe che il servizio potrebbe leggere il tuo segreto. Altri si basano su una password condivisa che il servizio può convalidare. Altri ancora eliminano secondo un calendario ma conservano metadati, log o copie recuperabili. Quando scegli uno strumento, chiedi se implementa il design completo — non solo se il link scade.",
      ],
    },
    {
      title: "Perché il frammento URL conta",
      paragraphs: [
        "Questo dettaglio architetturale è facilissimo da trascurare — eppure è la base della crittografia web moderna.",
        "In una richiesta HTTPS standard, tutto ciò che precede il simbolo # viene inviato direttamente al server. Tutto ciò che segue resta nella sandbox del browser. Un sistema di link monouso ben progettato può memorizzare contenuto crittografato sotto /note/abc123, mantenendo la chiave di decifratura sotto #xK9m2p... completamente invisibile a log del server, percorsi CDN e tabelle di database esterne.",
      ],
    },
    {
      title: "Quando usare un link monouso (e quando no)",
      paragraphs: [
        "Non ogni canale è sbagliato per ogni tipo di segreto — ma la maggior parte degli strumenti quotidiani è stata costruita per la persistenza, non per la consegna monouso.",
      ],
      table: [
        {
          channel: "E-mail",
          encrypted: "Spesso in transito",
          persistent: "Sì — per sempre, in più caselle",
          verdict: "✗ Scarso",
        },
        {
          channel: "Slack / Teams",
          encrypted: "Sì, sulla piattaforma",
          persistent: "Sì — ricercabile, esportabile",
          verdict: "✗ Scarso",
        },
        {
          channel: "SMS / iMessage",
          encrypted: "Molto variabile",
          persistent: "Spesso con backup, sincronizzazione cloud",
          verdict: "✗ Scarso",
        },
        {
          channel: "Gestore di password",
          encrypted: "Sì",
          persistent: "Progettato per la conservazione permanente",
          verdict: "Spesso scomodo — spesso a pagamento, lento per consegne rapide",
        },
        {
          channel: "Signal / WhatsApp (messaggi che scompaiono)",
          encrypted: "Sì, end-to-end",
          persistent: "I messaggi scompaiono dopo un timer",
          verdict: "Buono — entrambe le parti hanno bisogno di un account",
        },
        {
          channel: "Link monouso",
          encrypted: "Sì, lato client",
          persistent: "Eliminato subito dopo la lettura",
          verdict: "✓ Pensato per questo",
        },
      ],
      goodFits: [
        "Password, chiavi API e token temporanei consegnati a una persona una sola volta.",
        "Codici di recupero di sistema e backup 2FA.",
        'Istruzioni temporanee di accesso fisico («usa questo codice porta fino alle 18:00»).',
        "Bozze sensibili legali o HR che non dovrebbero diventare memoria istituzionale.",
      ],
      poorFits: [
        "Archiviazione a lungo termine: usa un vault dedicato del gestore di password.",
        "Conversazioni continue: usa un messenger crittografato end-to-end come Signal.",
        "Segreti auditabili: se la compliance richiede una traccia immutabile, usa il sistema di vault approvato dall’organizzazione.",
      ],
    },
    {
      title: "La trappola dell’anteprima link",
      paragraphs: [
        "Ecco un modo in cui molti team lo scoprono a proprie spese. Molte app chat aziendali scansionano automaticamente gli URL in arrivo per generare anteprime ricche (titoli, descrizioni, miniature).",
        "Quella scansione automatica può consumare un link monouso prima che il destinatario abbia la possibilità di cliccare. Il bot di anteprima diventa il primo lettore, la nota brucia e il collega apre un link morto.",
        "Gli strumenti di effimero seri mitigano attivamente questo bloccando user-agent di crawler noti, richiedendo un clic esplicito prima della decifratura locale e mantenendo scadenze molto brevi.",
      ],
    },
  ],
  tableHeaders: {
    channel: "Tipo di canale",
    encrypted: "Crittografato?",
    persistent: "Persistente?",
    verdict: "Adatto ai segreti monouso?",
  },
  goodFitsLabel: "Casi d’uso adatti",
  poorFitsLabel: "Casi d’uso inadatti",
  closingTitle: "Dove si colloca PrivateNote",
  closingBody:
    "PrivateNote è costruito esattamente attorno a questo modello di crittografia lato client. Non è un vault di password a lungo termine, né un wiki di team, né un archivio di compliance permanente. È uno strumento leggero e veloce pensato per la consegna.",
  encryptLu:
    "Per file più grandi che necessitano dello stesso modello di crittografia lato client, [Encrypt.lu](https://encrypt.lu) applica lo stesso approccio architetturale su scala di file.",
  tagline:
    "Garantisce che la durata dei dati sensibili corrisponda a quella del mezzo attraverso cui viaggiano. Perché a volte il messaggio più sicuro è quello che smette completamente di esistere.",
  relatedReading: "Letture correlate",
};
