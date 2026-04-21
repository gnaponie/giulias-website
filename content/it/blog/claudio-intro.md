---
title: "Claudio: perché abbiamo messo il nostro agente AI in un container (e perché dovresti farlo anche tu)"
date: "2026-04-21"
excerpt: "Come uno scherzo sulla pronuncia è diventato un agente AI containerizzato e open source per l'automazione DevOps."
tags: ["ai", "devops", "containers"]
---

## Perché Claudio?

Circa un anno fa ho iniziato a usare Claude Code. C'era solo un problema: sono italiana e non avevo idea di come si pronunciasse "Claude." Dopo qualche tentativo imbarazzante, ho fatto quello che qualsiasi italiano che si rispetti avrebbe fatto: "Vabbè, lo chiamo Claudio."

Il nome è rimasto. È diventato un tormentone nel team. Abbiamo creato alias nella shell (`alias claudio=claude`) e parlavamo di Claudio come se fosse un collega. A un certo punto qualcuno ha proposto di rinominarlo "Claudia" — un po' perché Claude ha questa tendenza a dirti con sicurezza qualcosa di completamente sbagliato e poi fare come se niente fosse, e noi scherzavamo sul fatto che una donna non te lo farebbe mai. (Alla fine abbiamo tenuto Claudio. Ci stiamo affezionando.)

Ma tra le battute e gli alias, qualcosa di concreto ha iniziato a prendere forma. Il nostro tech lead vedeva quello che stavamo sperimentando tutti — ognuno aveva un setup locale diverso, i prompt erano imprevedibili, e non c'era modo di far girare niente in autonomia — e ha deciso di intervenire. La sua idea: containerizzare tutto per avere un ambiente consistente per tutti, costruire un sistema di skill per rendere il comportamento dell'agente il più deterministico possibile (meno allucinazioni, output più affidabile), e abbracciare il paradigma agentico che ormai ha senso per l'automazione.

Ha chiamato il progetto Claudio — perché a quel punto il nome era già quello — ed è rapidamente diventato un lavoro di squadra, con diversi contributor che lo hanno modellato in quello che è oggi.

## Il problema

Gli assistenti AI per il codice sono ovunque ormai. Vivono nel tuo IDE, nel tuo terminale, nel tuo browser. Sono fantastici per scrivere codice. Ma ecco cosa la maggior parte di loro non sa fare: funzionare da soli. Svegliarsi alle 8 di mattina di un lunedì, controllare lo stato delle tue release su tre piattaforme diverse, capire se qualcosa non va, e postare un riassunto su Slack prima che tu abbia preso il caffè. Nessuno degli strumenti attuali lo fa.

E onestamente, il problema non è l'intelligenza. I modelli sono abbastanza smart. Il problema è che tutti assumono che ci sia un umano alla tastiera. Claude Code gira sul tuo portatile, con i tuoi strumenti, le tue credenziali, il tuo ambiente. Va bene per il pair programming. Ma se vuoi che faccia il triage dei fallimenti CI durante la notte, o generi un report giornaliero, o coordini una release secondo una schedulazione? Deve girare da un'altra parte. In modo riproducibile. In isolamento. Come qualsiasi altro workload.

Quindi l'abbiamo messo in un container.

## Cos'è davvero Claudio

[Claudio](https://github.com/aipcc-cicd/claudio) è un'immagine OCI open source, basata su Red Hat UBI 10, che impacchetta Claude Code con tutto quello che serve per lavorare in autonomia. Autenticazione (usiamo Google Vertex AI), un set di tool CLI DevOps — kubectl, glab, skopeo, jq, AWS CLI — e un sistema di plugin chiamato [claudio-skills](https://github.com/aipcc-cicd/claudio-skills) che dà all'agente capacità concrete in domini specifici.

Puoi farlo girare in locale con `podman run`, deployarlo come CronJob su Kubernetes, o inserirlo in una pipeline GitLab CI. Stessa immagine ovunque. Questo è il punto.

Ma il container è solo il packaging. Quello che lo rende davvero utile è cosa c'è dentro.

## La questione delle skill

Ecco quella che secondo me è la parte più interessante. Se hai usato agenti AI per qualcosa di serio, conosci il problema più grande: l'affidabilità. Chiedi di "controllare lo stato della release" e potrebbe inventarsi un comando kubectl, formattare male una chiamata API, o semplicemente dirti con sicurezza qualcosa che non è vero. Ci siamo passati tutti (ti sto guardando, Claudio).

La nostra risposta a questo sono quelle che chiamiamo skill. Una skill non è solo un prompt. È un pacchetto con istruzioni, script shell e tool Python che dicono all'agente come lavorare con un dominio specifico. L'idea è semplice: non ci fidiamo dell'AI per scrivere comandi al volo (e neanche voi dovreste), quindi gli diamo script pre-scritti per le parti che contano. L'AI è brava a capire cosa va fatto e in che ordine — ma quando è il momento di farlo davvero, chiama uno script che abbiamo scritto e testato.

Quindi quando Claudio analizza un fallimento di pipeline GitLab, non si inventa comandi CLI dal nulla. Chiama uno script che recupera dati strutturati. Quando crea una release di produzione, usa uno script Python che genera i manifest in modo deterministico. L'AI capisce *cosa* fare. Gli script assicurano che venga fatto *correttamente*.

Questo è ciò che ci fa stare tranquilli nel farlo girare senza supervisione. Hai la flessibilità di un agente AI (può ragionare, adattarsi, gestire cose che non avevi previsto) senza la fragilità (perché le parti importanti sono blindate nel codice che abbiamo testato).

Il [repo claudio-skills](https://github.com/aipcc-cicd/claudio-skills) attualmente ha skill per analisi CI/CD, orchestrazione delle release, analisi dei log, Slack, gestione dei branch e Jira. E aggiungerne una nuova è onestamente abbastanza facile — crei una directory con un file markdown e qualche script. Nessun SDK, nessun framework. Il markdown dice all'agente cosa può fare la skill e come usare gli script. Pensatelo come un runbook molto dettagliato, solo che l'AI lo segue davvero (quasi sempre).

## Cosa ci facciamo in pratica

Vi faccio qualche esempio. Sono generalizzati dai nostri workflow reali, perché alcuni dettagli sono interni, ma capirete l'idea.

Conoscete quella sensazione quando aprite Slack la mattina e ci sono 30 messaggi non letti su cinque canali, e da qualche parte lì dentro c'è l'informazione che vi serve per sapere se la release di ieri è andata a buon fine? Qualcuno passava 30 minuti ogni mattina a mettere insieme il tutto. Ora lo fa Claudio. Gira come CronJob ogni mattina dal lunedì al venerdì, interroga la nostra piattaforma di release, controlla i canali Slack rilevanti, e posta un report. Ma la parte che mi piace è che non sta solo riformattando dati. *Ragiona* su quello che trova. Una release è bloccata? Qualcuno ha annunciato qualcosa che non è ancora stato rilasciato? Ci sono incongruenze? Uno script statico queste cose le perderebbe, perché non puoi scrivere regole per incongruenze che non hai ancora immaginato.

Abbiamo anche una dashboard — una web app che traccia lo stato delle nostre release di prodotto. Alla leadership interessa molto quanto tempo ci mette una release. Tipo, tanto. Ma non avevamo un modo affidabile per dire nemmeno *quando* avevamo ricevuto il via libera. C'è un team che esegue i test, e quando hanno finito, postano in un canale Slack per dire che possiamo iniziare a rilasciare. Quel messaggio è quando il cronometro parte. Il problema? Quel messaggio può arrivare da chiunque, in qualsiasi momento, scritto in modo diverso ogni volta. Non puoi scrivere una regex per quello. Ma l'informazione è sempre più o meno la stessa — c'è una versione, c'è un prodotto, c'è un'intenzione — e questo è esattamente il tipo di cosa in cui un'AI è brava. Claudio legge il canale Slack, riconosce l'annuncio indipendentemente da chi l'ha scritto o come, estrae i dati rilevanti, e li registra nella dashboard. Uno script non potrebbe farlo.

E poi c'è il coordinamento delle release. Fare una release su più componenti sembra semplice finché non lo fai davvero. Controllare che i deploy in staging siano andati bene. Generare i manifest. Creare branch con le regole di protezione giuste. Aggiornare i ticket. Notificare i canali. Ogni step è banale da solo, ma la sequenza è dove le cose vanno storte. Claudio gestisce il coordinamento. L'umano rivede e approva — non stiamo cercando di togliere il giudizio dal processo — ma il lavoro meccanico di assemblare tutto non c'è più.

Lo usiamo anche in modo interattivo. A volte voglio chiedere "perché questa pipeline è fallita?" e avere una risposta in secondi invece di leggere log per venti minuti. Anche quello funziona.

## Ma perché non scrivere degli script?

Sì, bella domanda. E onestamente, se sapete esattamente cosa automatizzare, scrivete uno script. Sarà più semplice e più prevedibile.

Ma un sacco di lavoro DevOps non sta bene in uno script. Il triage CI richiede leggere log e formulare ipotesi. Controllare lo stato delle release significa correlare dati da più sistemi. L'analisi degli errori richiede giudizio su cosa è rumore e cosa conta davvero. Queste cose hanno input imprevedibili. Servono ragionamento, non solo esecuzione.

Penso che il punto ideale siano le task troppo complesse per uno script ma troppo ripetitive per un umano. Rimarreste sorpresi da quanto DevOps ricade in quella categoria.

## E il lock-in?

In questo momento, Claudio gira Claude Code. È letteralmente nel nome, non lo nascondiamo. E il sistema di skill è costruito attorno all'architettura plugin di Claude Code.

Ma il concetto non è legato a Claude. Quello che rende Claudio utile è il pattern: un agente AI containerizzato con skill strutturate, che gira come workload OCI standard. Le skill stesse sono solo markdown e script shell. Non sono accoppiate all'API di nessun modello specifico. Al container non importa cosa c'è dentro.

Potremmo sostituire il modello sottostante un giorno? Supportare più provider? Integrarci con un runtime di agenti diverso? Sì. La containerizzazione, le skill, le integrazioni CI/CD — tutto questo è infrastruttura che non dipende da quale modello gira sotto. Abbiamo costruito questo per risolvere un problema operativo, non per scommettere su un singolo vendor.

Per ora, Claude Code funziona bene per quello che ci serve. Se arriva qualcosa di meglio, Claudio si adatta. Questo è il bello dei container — puoi cambiare cosa c'è dentro senza cambiare come li fai girare.

## Costruisci sopra

Una cosa che voglio menzionare: Claudio è pensato come immagine base. Il progetto open source ti dà le fondamenta — il runtime AI, l'autenticazione, il sistema di plugin, skill general-purpose. Tu costruisci la tua immagine sopra e aggiungi quello che è specifico per il tuo team.

È esattamente quello che facciamo noi. L'immagine upstream di Claudio è generica. La nostra immagine specifica per il team aggiunge conoscenza di dominio, accesso a sistemi interni, skill specifiche per i prodotti. Quando l'immagine base migliora, ogni progetto downstream ne beneficia. Quando qualcuno costruisce una skill utile, può contribuirla al marketplace.

## Provalo

Il progetto è open source sotto Apache 2.0:

- [Claudio](https://github.com/aipcc-cicd/claudio) — immagine base, istruzioni di build, wrapper script, template CI
- [Claudio Skills](https://github.com/aipcc-cicd/claudio-skills) — il marketplace delle skill con esempi e linee guida per contribuire

Se passate ore ogni settimana su lavoro DevOps che richiede giudizio — non solo esecuzione — potrebbe valere la pena darci un'occhiata. E se ci costruite qualcosa, fatecelo sapere.

Claudio è nato come uno scherzo sulla pronuncia. Si è rivelato un collega abbastanza decente. La maggior parte dei giorni.

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
