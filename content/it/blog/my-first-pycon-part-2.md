---
title: "Il mio primo PyCon — Parte 2: workflow agentici e qualche riflessione"
date: "2026-06-05"
excerpt: "I talk sui workflow agentici a PyCon Italia spaziavano dal 'questo lo facciamo già' al 'finalmente qualcosa di nuovo.' Ecco cosa mi ha colpita — e cosa no."
tags: ["python", "ai", "conferences"]
---

Questa è la seconda parte della mia serie su PyCon Italia 2026. La [Parte 1](/blog/my-first-pycon) copriva le impressioni generali sulla conferenza e il keynote di apertura. Ora parliamo dei talk — in particolare quelli sui workflow agentici, che sono stati un tema centrale quest'anno.

Sarò onesta: i workflow agentici erano ovunque al PyCon, e la maggior parte dei talk non mi ha sorpresa. Quello che abbiamo costruito con [Claudio](https://github.com/aipcc-cicd/claudio) (il nostro agente AI containerizzato — ne ho scritto [qui](/blog/claudio-intro)) segue già tutti questi pattern, e in molti casi va oltre. Ma questo non significa che non ci fosse nulla da portare a casa. Alcuni talk hanno confermato che siamo sulla strada giusta, un paio hanno introdotto strumenti che non avevo ancora provato, e le sessioni del sabato hanno finalmente offerto la profondità che cercavo.

## I talk sull'affidabilità degli agenti

Due talk si sono concentrati su come rendere gli agenti più affidabili. Il contenuto era in gran parte sovrapponibile, ma insieme hanno dipinto un quadro ragionevole di dove si trova la community.

### "Most AI Agents Are Broken. Let's Fix That"

Questo talk era di Bilge Yücel. Ha iniziato con l'agent harness — il loop principale in cui un agente ragiona, agisce, osserva e ripete — e poi ha illustrato i fallimenti comuni nei workflow agentici:

- **Troppi strumenti** — dare all'agente troppi strumenti riempie velocemente la finestra di contesto e porta ad allucinazioni. Il modello non sa cosa fare, quindi tira a indovinare.
- **Nessun piano di fallback** — i fallimenti passano inosservati, nessuno sa che qualcosa è andato storto.
- **Nessun guardrail** — l'agente può eseguire comandi distruttivi o allucinati senza controllo.
- **Caso d'uso sbagliato** — a volte l'AI è eccessiva e uno script sarebbe più semplice e affidabile.

Tutto questo era abbastanza ovvio per me, perché sono problemi che abbiamo già incontrato e risolto con Claudio. Abbiamo per lo più smesso di affidarci agli MCP per la scoperta degli strumenti perché gonfiano il contesto con schemi di tool di cui l'agente potrebbe non aver mai bisogno. Invece, il nostro sistema di skill dà all'agente un set curato di capacità per task — istruzioni in markdown più script pre-scritti — così il contesto resta focalizzato e l'agente sa esattamente cosa ha a disposizione.

Per i fallback, ogni skill di Claudio che gira in modo autonomo posta su Slack in caso di fallimento, così sappiamo sempre quando qualcosa è andato storto. E i guardrail sono integrati nelle skill stesse: l'AI decide *cosa* fare, ma l'esecuzione effettiva avviene attraverso script che abbiamo testato, quindi non può accidentalmente eseguire un comando distruttivo o allucinare un'invocazione kubectl.

Sul punto del caso d'uso sbagliato — giusto, quando il pattern è completamente prevedibile, una pipeline è più semplice. Ma penso che con Claudio abbiamo trovato qualcosa di più intelligente: blocchiamo nel codice le parti sensibili e quelle che non hanno bisogno dell'AI, ma lasciamo comunque all'agente il ruolo di motore di ragionamento e orchestratore principale. Ottieni l'affidabilità degli script dove serve e la flessibilità dell'AI dove aggiunge valore.

La speaker ha menzionato [Haystack](https://haystack.deepset.ai/), un framework di orchestrazione open-source che non avevo ancora usato — da esplorare. E [Langfuse](https://langfuse.com/) per l'osservabilità, per ispezionare quali chiamate ha fatto l'agente. Ma una cosa che non mi ha convinta del tutto: questo tipo di osservabilità non è automatizzata. Il punto di un workflow agentico è rimuovere o minimizzare l'umano nel loop. Se poi hai bisogno di qualcuno che controlli manualmente le trace per vedere quali chiamate sono state fatte... hai solo spostato il collo di bottiglia. Mi piacerebbe vedere più raccomandazioni per strumenti che forniscono osservabilità automatizzata — alert quando le cose deviano, rilevamento anomalie, quel tipo di cose.

I suggerimenti alla fine erano: sistemi multi-agente, supervisione su quello che fanno gli agenti, e osservabilità. Consigli solidi, e probabilmente esattamente quello di cui la maggior parte del pubblico aveva bisogno — dato che solo il 10% dei partecipanti usava agenti in produzione, questo tipo di talk fondazionale ha molto senso. Io semplicemente cercavo qualcosa di più avanzato.

### "Agents reporting for duty! An (in)complete guide to LLM agents and their limits"

Questo talk era di Tommaso Radicioni. Era un po' più pratico, ma il contenuto era sostanzialmente lo stesso. Spiegava la differenza tra un LLM e un agente (il loop, di nuovo), e che la riflessione è la forma più semplice di quel loop. In un pattern di riflessione, hai due ruoli: un *generatore* che produce l'output iniziale, e un *riflettore* che lo valuta — cercando errori, suggerendo miglioramenti, o decidendo se il risultato è abbastanza buono. L'agente alterna tra i due finché il riflettore non è soddisfatto o si raggiunge un limite.

Lo speaker ha mostrato come ha implementato il loop con un contatore `MAX_STEPS` per prevenire esecuzioni infinite. Semplice ed efficace.

Ha menzionato il pattern ReAct — Reasoning + Acting (sì, il nome crea confusione vista l'esistenza di un certo framework JavaScript). ReAct segue un ciclo pensiero → azione → osservazione: l'agente ragiona su cosa fare, compie un'azione, osserva il risultato, e ripete. È uno dei pattern più adottati per agenti che usano strumenti.

Ha mostrato una demo di un assistente GitHub, e due cose mi hanno colpita: aveva ancora un umano nel loop per la maggior parte delle decisioni, e l'agente aveva troppi strumenti collegati, che riempivano il contesto. Stessi problemi del primo talk.

Ha anche menzionato architetture multi-agente — dividere i problemi in sottoproblemi dove ogni sotto-agente ha la sua catena di pensiero, e come puoi usare modelli diversi per agenti diversi in base a requisiti di privacy, consumo di token e latenza. Pratico, ma non esattamente territorio inesplorato.

Almeno quando è arrivato all'osservabilità (sì, di nuovo), ha menzionato alcuni strumenti concreti. Questa è stata la parte più utile — una lista reale che posso effettivamente esaminare e valutare:

| Categoria | Strumenti |
|---|---|
| **Evals** | [RAGAS](https://docs.ragas.io/), [Braintrust](https://www.braintrust.dev/) |
| **Monitoring** | [Galileo](https://www.rungalileo.io/) |
| **Tracing** | OpenTelemetry + convenzioni semantiche GenAI |
| **Backend open-source** | Langfuse, Arize Phoenix |
| **Piattaforma ML** | Weights & Biases Weave |

Nel complesso, un talk ben strutturato e una buona introduzione al tema. Se stai iniziando con gli agenti, ti darebbe una base solida. Per chi come noi li usa già in produzione, il contenuto non era nuovo — ma i riferimenti agli strumenti alla fine hanno reso la partecipazione utile.

## I talk del sabato (finalmente)

E poi è arrivato il sabato, e la qualità è cambiata. Due talk che hanno detto qualcosa di nuovo, profondamente pratici, e che mi hanno ricordato perché ero a una conferenza Python.

### "Durable Agents: long running AI workflows in a flakey world"

Questo era il keynote del sabato di Samuel Colvin, il fondatore di Pydantic. Ed era genuinamente interessante.

Ha iniziato presentando [Monty](https://monty.com/): un interprete Python isolato progettato per agenti AI nel cloud. L'idea è che invece di dare all'agente una dozzina di strumenti, gliene dai due: `run_code` e `find_tools`. L'agente scrive Python per fare quello che gli serve, il che usa meno token ed è più veloce del concatenare chiamate a strumenti. C'è anche una sfida chiamata [hackmonty](https://hackmonty.com/) dove ti pagano $10k se trovi vulnerabilità. La persona competitiva in me ha già iniziato a pensare a quando trovare il tempo per partecipare — non solo per i soldi (cioè... sì), ma soprattutto per il divertimento. Sono davvero competitiva.

Poi si è spostato su quello che ha reso il talk speciale: l'esecuzione durabile. Era la prima volta che qualcuno al PyCon la menzionava, ed è un concetto genuinamente importante per agenti in produzione. Quando un agente esegue un workflow lungo — minuti, ore, magari anche giorni — le cose andranno storte. Errori di rete, timeout, interruzioni delle API dei modelli. L'esecuzione durabile significa che il workflow può sopravvivere a questi fallimenti: persiste il suo stato, così può riprendere da dove si era interrotto invece di ricominciare da zero.

I suoi punti chiave per agenti AI affidabili:

- **Esecuzione durabile** — persiste lo stato così i workflow sopravvivono ai fallimenti e possono riprendere a metà esecuzione
- **Output strutturato** — Pydantic può forzare risposte JSON tipizzate e validate dal modello
- **Osservabilità** — ha menzionato [Logfire](https://pydantic.dev/logfire), la libreria di tracing di Pydantic, che dà una traccia delle singole esecuzioni
- **Evals** — sia offline (prima del deployment) che online (monitoraggio di come l'agente si comporta in produzione)
- **Apprendimento continuo** — agenti che migliorano nel tempo in base a quello che incontrano

L'output strutturato non era nuovo per me — lo faccio già con [toon](https://github.com/toon-format/toon) per alcune delle mie analisi agentiche dei log. Ma ha fatto un buon caso sul perché la type safety è essenziale qui: quando l'output di un agente alimenta codice a valle o un altro agente, una risposta malformata non è solo brutta — rompe la pipeline silenziosamente. La validazione dei tipi al confine cattura questi fallimenti presto invece di lasciarli propagare.

Poi è entrato nel tipo di agente temporale di Pydantic AI, che ti dà un workflow deterministico. I vantaggi pratici sono significativi: puoi riprendere un workflow dal mezzo di un'esecuzione, ottenere retry automatici su fallimenti transitori, e persino mettere in pausa un workflow per periodi estesi — giorni o settimane — e riprenderlo dopo.

Ha fatto un argomento interessante contro le definizioni di workflow basate su grafi. Il suo punto: quando hai nodi paralleli che devono combinare risultati, vuoi una tipizzazione adeguata tra i passaggi. In una struttura a grafo, i dati tipicamente fluiscono attraverso dizionari non tipizzati, e non c'è modo di forzare la type safety ai confini tra i nodi. Con un approccio code-first usando una libreria come Pydantic AI, hai il sistema di tipi completo che lavora per te. Che tu sia d'accordo o no, è una posizione coerente.

Ha riconosciuto lui stesso che il talk sembrava un po' un pitch di prodotto per Pydantic. Ma onestamente? Quello che ha descritto è un set reale di problemi, e ha mostrato un modo coerente per risolverli. Se gli strumenti sono quelli che ha costruito lui, va bene. Qualsiasi buona libreria per l'esecuzione durabile degli agenti dovrebbe affrontare le stesse cose. Ha condiviso i [materiali del talk](https://github.com/pydantic/talks/tree/main/2026-05-pycon-italy) per chi vuole approfondire.

### "AI Frameworks Are Making You Worse"

Questo era di Silvano Cerza, ed era esattamente quello di cui avevo bisogno dopo due giorni e mezzo di raccomandazioni su framework.

Il suo punto era semplice e rinfrescante: framework AI come LangChain, LlamaIndex, Pydantic AI, Haystack... puoi usarli (e a volte pagarli), oppure puoi semplicemente riprodurre quello che fanno con un piccolo snippet Python. È tutto quello che fanno sotto il cofano. Puoi ottenere lo stesso risultato con librerie Python di base come `requests`.

È difficile riassumere il talk perché era pieno di esempi di codice dal vivo — molto pratico, molto concreto. Ma il suo argomento era convincente: non devi reinventare la ruota per cose come Python stesso o Django. Quelli sono genuinamente complessi. Ma per framework AI che affermano di fare magia quando in realtà stanno solo wrappando qualche chiamata API? Puoi scriverlo tu stesso in poche righe e capire davvero cosa sta succedendo.

Vi consiglio di controllare il suo [codebase del talk](https://github.com/silvanocerza/pycon_it_2026) per vedere gli esempi di persona.

Questo talk è stato rinfrescante. Finalmente qualcosa di tecnico, onesto e veramente su Python. Il che non è scontato — molti dei talk AI al PyCon non menzionano nemmeno Python. Propongono il talk al PyCon perché, come sappiamo tutti, Python è il linguaggio più usato nell'AI. Questo era un vero talk su Python, e l'ho adorato.

### "FeatureOps: Designing for Failure and Speed in Agentic AI Workflows"

L'ultimo talk che voglio menzionare era di Alex Casalboni (che conoscevo un po' già). Non era scienza missilistica, ma mi è piaciuto come è stato presentato e ha dato alcuni spunti tecnici utili.

Ha iniziato con una premessa con cui concordo: gli assistenti AI per il codice stanno introducendo bug, e i fallimenti sono ora attesi. A tutti quelli che si lamentano che l'AI introduce solo bug che noi "veri ingegneri" dovremo sistemare — penso che all'industria non importi più. È diventato più economico e veloce introdurre bug e sistemarli che fare tutto perfettamente dall'inizio. È semplicemente qualcosa che l'AI ha cambiato nell'economia dello sviluppo software.

Quindi, accettando che i fallimenti sono il nuovo standard, ha proposto diversi livelli di protezione:

- **L1: Sicurezza del modello** — di solito gestita dal provider del modello
- **L2: Sandboxing** — responsabilità tua
- **L3: Protezione CI/CD** — per lo più gestita dai tuoi strumenti CI/CD
- **L4: Controllo runtime** — responsabilità tua

Si è concentrato su L2 e L4, quelli che sono attualmente sotto la tua responsabilità.

Per il **sandboxing (L2)**, ha delineato tre approcci:

| Approccio | Come funziona | La nostra esperienza |
|---|---|---|
| **Linux Landlock v3** | Sandboxing a livello kernel — restringe a cosa un processo può accedere | — |
| **Isolamento container** | L'agente gira in un container, il raggio d'esplosione è contenuto | Questo è quello che facciamo con Claudio |
| **Esecuzione remota** | Esecuzione su un cluster remoto, protegge la macchina locale — anche se non protegge il repo se è connesso | Lo facciamo anche noi (Claudio su OpenShift) |

Per il **controllo runtime (L4)**, le domande sono: *chi* ha accesso, *quando*, e cosa succede *quando qualcosa si rompe*? Puoi limitare l'esposizione a utenti beta o team interni prima? Puoi fare rollout graduali? Puoi attivare e disattivare funzionalità in produzione? Ha fatto la distinzione tra un rilascio tecnico e un rilascio commerciale — uno è il deploy, l'altro è renderlo disponibile ai clienti. Questo si applica poco a quello che faccio quotidianamente, ma capisco come possa essere importante per funzionalità AI rivolte ai clienti.

Per gestire i fallimenti: rollback, circuit breaker che si attivano automaticamente quando le metriche deviano, e feature flag per controllare l'esposizione senza ridistribuire. Ha poi menzionato [Unleash](https://www.getunleash.io/), la piattaforma open-source per feature flag dove lavora — un altro pitch di prodotto, ma buono, e lo strumento è genuinamente utile per questo tipo di cose.

## Cosa mi porto a casa

I talk sui workflow agentici del PyCon mi hanno dato un quadro chiaro di dove si trova la community Python con gli agenti AI. I fondamentali sono solidi — tutti concordano sull'importanza dell'output strutturato, dei guardrail e del non fidarsi ciecamente dei modelli. Ma molto di questo sembra ancora agli inizi. Il divario tra "ecco i principi" e "ecco come farlo davvero in produzione" è ancora ampio.

Quello che mi porto davvero a casa: una lista di strumenti da valutare (Haystack, Langfuse, RAGAS, Braintrust, Logfire, Unleash), il concetto di esecuzione durabile che voglio esplorare ulteriormente, e la conferma che a volte il miglior framework AI è nessun framework — solo Python che fa quello che Python sa fare meglio.

E la conferma che quello che abbiamo costruito con Claudio non è solo funzionale — è più avanti di dove si trova la maggior parte dell'industria in questo momento. Fa piacere. E un po' spaventa, perché significa che non ci sono molte persone da cui imparare. Stiamo capendo le cose man mano.

La prossima volta, forse sarò io sul palco a parlarne.

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
