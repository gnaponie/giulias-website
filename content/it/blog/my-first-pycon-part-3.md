---
title: "Il mio primo PyCon — Parte 3: i talk che mi hanno ricordato perché amo Python"
date: "2026-06-24"
excerpt: "L'ultimo post su PyCon Italia. Ricerca foto locale con CLIP, l'evoluzione delle performance di CPython, perché temperature zero continua ad allucinare, un'installazione artistica sulla discriminazione di genere, e il packaging Python spiegato come si deve."
tags: ["python", "ai", "ml", "conferences"]
---

Con un po' di ritardo, ecco il terzo e ultimo blog post sulla mia esperienza a PyCon Italia 2026. Nella [parte 1](/blog/my-first-pycon) ho parlato della conferenza in generale, delle donne brillanti che ho incontrato e del keynote di Merve Noyan sull'AI multimodale open-source. Nella [parte 2](/blog/my-first-pycon-part-2) ho analizzato i talk sui workflow agentici — alcuni familiari, alcuni genuinamente nuovi. Questa volta è un mix di tutto il resto che ha catturato la mia attenzione: ML, internals di CPython, un'installazione artistica, consigli di carriera e Python packaging. Argomenti diversi, ma è proprio questo il punto. La parte migliore di una conferenza come PyCon è che entri in un talk su qualcosa che non pensavi ti interessasse e ne esci pensandoci per giorni.

## il talk sulla galleria fotografica che mi ha fatto venire voglia di costruire qualcosa

Questo era di Daniele Giunta: "Your Photo Gallery, but Smarter: A Local-First Semantic Image Search System That Runs on Your Laptop." Ed era esattamente il mio tipo di talk — pratico, hands-on, di quelli dove qualcuno ha costruito qualcosa per divertimento e impari un sacco solo guardandolo spiegare gli errori che ha fatto lungo la strada.

L'idea: ha costruito un sistema locale di ricerca e categorizzazione foto usando modelli open-source. Niente cloud, niente Google Photos, niente Amazon — tutto gira sulla tua macchina. Questo mi ha toccata da vicino perché tengo tutte le foto dei miei figli su un NAS proprio perché non voglio consegnarle alle Big Tech. Ma il compromesso è sempre stata una categorizzazione e ricerca pessime. Finisci per scorrere migliaia di foto perché non c'è un modo intelligente per trovare quello che cerchi.

Il suo sistema cambia le cose. Ecco come funziona ad alto livello:

Le foto vengono convertite in vettori usando [CLIP](https://openai.com/research/clip) — il modello di OpenAI che mappa sia testo che immagini nello stesso spazio vettoriale (512 dimensioni). Una volta che tutto è vettorizzato, puoi cercare in linguaggio naturale ("foto al mare") o anche fornendo un'altra immagine come query.

Per la ricerca di similarità vera e propria, ha usato [FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search), specificatamente `IndexFlatIP` con vettori normalizzati per similarità del prodotto interno. Ha anche avuto bisogno di `IndexIDMap` per fare da ponte tra gli ID interni di FAISS e i percorsi dei file su disco — senza, aggiungere ed eliminare vettori non funziona correttamente.

La parte di clustering era furba. Per passare da un dump caotico di foto a gruppi organizzati, ha usato una pipeline ispirata a [BERTopic](https://maartengr.github.io/BERTopic/): CLIP per gli embedding, poi UMAP per la riduzione di dimensionalità (comprimere i vettori ad alta dimensione in qualcosa di più gestibile), poi HDBSCAN per il clustering vero e proprio, e infine BLIP + Ollama per generare automaticamente le etichette per ogni cluster. Quindi non ottieni solo gruppi — ottieni gruppi con un nome, tipo "vacanza al mare" o "festa di compleanno."

Ha condiviso il [codice completo](https://github.com/Eleinad/talks/tree/main/pycon_2026/code), e onestamente? Sono tentata di farlo girare sul mio NAS. L'idea di poter cercare le foto di famiglia in linguaggio naturale mantenendo tutto locale e privato è esattamente il tipo di cosa che voglio costruire.

## Performance di CPython: più vecchio di me, più veloce che mai

Il keynote del secondo giorno era di Diego Russo di ARM: "From 'Fast Enough' to 'Fast by Design': The Evolution of CPython Performance." Non un talk sull'AI, ma a una conferenza Python era bello sentir parlare di Python per una volta.

Una citazione mi è rimasta impressa: "Il tempo del programmatore è più importante del tempo del computer." Questa era la filosofia quando Python è nato nel 1991 — io non ero ancora nata. All'epoca, Python serviva principalmente per scripting e automazione, girava su CPU single-core con memoria limitata. I principi di design erano semplici: facile da leggere, facile da modificare, facile da capire. E funzionavano.

Ma il mondo è cambiato. Python ora si usa per tutto, dall'infrastruttura alle pipeline AI, e le CPU moderne hanno completamente cambiato le regole. Non è più tanto questione di velocità della CPU quanto di memoria e di come la usi.

Ha analizzato dove CPython spende il suo tempo:

- **JIT**: 17.99% — la maggior parte
- **Memoria**: 12.67% — per varie ragioni
- **Troppo lavoro a runtime** — l'interprete continua a ripetere le stesse operazioni che potrebbero essere risolte prima

L'intuizione chiave è che CPython 3.11 ha portato miglioramenti di performance enormi adattando l'interprete — non interpretando tutto allo stesso modo ogni volta. L'idea è spostare il lavoro prima, prima dell'esecuzione, anziché farlo durante il runtime.

Ha anche toccato la concorrenza e il GIL (Global Interpreter Lock), che è parte della storia delle performance, specialmente con il lavoro in corso sul free-threaded Python.

Ero più interessata ai talk sull'AI al PyCon, ma i keynote sono stati una buona opportunità per imparare su Python stesso. E questo mi ha dato prospettiva su cose che semplicemente non sapevo perché Python è molto più vecchio della mia carriera. È stato bello capire la storia dietro il linguaggio che uso da così tanto tempo.

## la bugia della temperature zero

Questo era di Valeria Zuccoli: "The Zero-Temperature Lie: Why Your Deterministic LLM is Still Hallucinating Randomness." E ancora una volta — una donna brillante che spiega concetti complessi con chiarezza e sicurezza.

La premessa: ha fatto la stessa domanda a GPT più volte, con temperature impostata a zero e decodifica greedy. E ha comunque ottenuto risposte diverse. Aspetta, cosa?

Un po' di contesto: la temperature è un parametro di campionamento negli LLM. A temperature 1 (il default), il modello sceglie i token in base alla loro distribuzione di probabilità — più creativo, più vario. A temperature 0, dovrebbe sempre scegliere il token con la probabilità più alta. Deterministico. Prevedibile. Tranne che... non lo è.

Ha citato un paper che mostra il 15% di differenza nell'accuratezza tra 10 esecuzioni diverse su 5 modelli differenti, anche con temperature impostata a zero. Quindi cosa sta succedendo?

Tre colpevoli:

1. **Operazioni in virgola mobile** — i calcoli GPU comportano approssimazioni quando si sommano numeri, e queste minuscole differenze di arrotondamento possono propagarsi
2. **Operazioni parallele** — i vettori vengono processati su core diversi, e l'ordine delle operazioni non è sempre lo stesso, il che influenza i risultati in virgola mobile
3. **Batching delle richieste** — e questo è il più importante. Non c'è solo la tua richiesta sulla GPU. Ci sono le richieste di altri utenti che vengono raggruppate insieme, il che cambia il layout del calcolo

Quindi anche se il modello in sé è deterministico, l'infrastruttura che lo serve introduce non-determinismo attraverso le richieste di altri utenti che condividono lo stesso hardware.

Ha menzionato alcune soluzioni: [vLLM](https://github.com/vllm-project/vllm) ha kernel batch-invariant, e PyTorch offre `use_deterministic_algorithms` per forzare un comportamento deterministico (a costo di performance). Ma il messaggio era chiaro: se ti affidi alla temperature zero per la riproducibilità, stai costruendo su una bugia.

Questo è stato genuinamente uno dei miei talk preferiti. Come qualcuno che lavora con agenti AI e fa certe assunzioni sui comportamenti degli output dei modelli, capire perché "deterministico" non significa davvero deterministico è importante. Ed è stato spiegato in modo bellissimo.

## l'installazione artistica sulla discriminazione di genere

"Not For Her: Orchestrating Generative AI for an Interactive Installation on Gender Equality" di Lorenzo Bisi. Sarò onesta — lo speaker era un po' nervoso, forse una questione di barriera linguistica, ma era chiaramente intelligente e il talk era genuinamente affascinante.

Il concetto: un'installazione interattiva esposta alla Triennale di Milano dove i visitatori vivevano un colloquio di lavoro simulato attraverso avatar digitali. Entri nei panni di "Sofia," ti siedi davanti a uno schermo e hai una conversazione con intervistatori generati dall'AI che gradualmente introducono discriminazione di genere nelle domande — aspettative sulla maternità, supposizioni sulla vita familiare, il tipo di cose con cui le donne hanno a che fare nei colloqui veri tutti i giorni.

L'architettura tecnica era interessante. Usavano un PC dedicato con CPU per l'inferenza locale in tempo reale, un grande schermo con avatar video pre-registrati, e input microfono + telecamera che comunicava con un server remoto. ResNet gestiva il riconoscimento facciale e la rilevazione delle emozioni — il sistema adattava i temi discriminatori in base alle risposte emotive del visitatore, rendendo l'esperienza scomodamente personale.

La parte più difficile? Far discriminare un LLM. Gli LLM sono addestrati specificamente a *non* discriminare, quindi hanno dovuto aggirare i guardrail. Hanno provato diversi approcci:

- **LLM + macchina a stati finiti** per mappare tutti i possibili percorsi di conversazione — troppo difficile da mantenere
- **Modello vocale** — scartato perché troppo difficile da controllare
- **Piccoli modelli locali** — un anno fa non erano abbastanza buoni per una conversazione naturale

Alla fine hanno usato l'API di GPT-4.1 con prompt costruiti attentamente. La conversazione era guidata da una macchina a stati finiti con due tipi di stati: stati a singolo turno (un'interazione) e stati di dialogo (più turni per raggiungere un obiettivo). [Ready Player Me](https://readyplayer.me/) ha fornito il framework per gli avatar umanoidi.

I numeri erano impressionanti: 3.111 esperienze, 77 nazionalità, maggioranza tra i 25 e i 35 anni ma anche alcuni visitatori più anziani. Sei mesi di operatività senza downtime.

Ho avuto una bella conversazione con lo speaker dopo, e quello che mi ha colpita è stato come la sua stessa comprensione della discriminazione di genere si è evoluta costruendo tutto questo. Non aveva pienamente apprezzato quanto diversamente donne e uomini vivono e interiorizzano questi pregiudizi fino a quando non ha visto i visitatori reagire all'installazione. Questo è il tipo di cosa che la tecnologia dovrebbe fare — farti sentire qualcosa che non potevi capire dall'esterno.

Mi dispiace essermi persa l'esposizione vera e propria. Mi sarebbe piaciuto molto viverla.

## il talk sulla carriera che mi ha dato speranza

"You're Not Starting Over: Lessons from Changing Roles in AI" di Reyha Verma di Amazon. È stato un bel talk, più ispirazionale che tecnico, su come lei ha cambiato carriera più volte e come adattarsi in quest'era dell'AI dove nessuno di noi è del tutto sicuro che manterrà il proprio lavoro.

Il suo punto principale: le competenze che hai costruito in passato saranno utili in futuro. Come pensi è la tua seniority, non cosa sai. Ed è vero. Le soft skill, l'esperienza, il modo analitico in cui affronto i problemi — è questo che mi distingue da qualcuno che ha imparato a programmare ieri, indipendentemente da quanto sia buono il suo assistente AI.

Forse non ho imparato nulla di tecnicamente nuovo, ma mi ha dato speranza. E vedere un'altra ingegnera esperta sul palco mi fa sempre sentire un po' più "ce la possiamo fare." Non diventa mai vecchio.

## Python packaging, spiegato come si deve

Ultimo: "Everything You Always Wanted to Know About Python Packaging (but Were Afraid to Ask)" di Luca Mancusi. Livello introduttivo, e probabilmente sapevo già la maggior parte delle cose. Ma dato che il mio team costruisce wheel e in passato ho anche mantenuto pacchetti Python, è stato un bel ripasso — soprattutto perché lo speaker era molto preciso sui piccoli dettagli e sul *perché* dietro ogni pignoleria.

I concetti chiave, per chiunque sia mai stato confuso dal Python packaging (quindi... tutti):

- Un **modulo** è l'unità base — un file `.py`
- Una **distribuzione** è quello che installi: o una **source distribution** (sdist, `.tar.gz`, non specifica per piattaforma) o una **built distribution** (wheel, `.whl`, potenzialmente specifica per piattaforma)
- Se non esiste una wheel compatibile per la tua piattaforma, pip ne costruisce una dalla sdist
- Il **build backend** (setuptools, uv) trasforma il sorgente in artefatti di distribuzione; il **build frontend** (pip, uv, poetry) è lo strumento che esegui — interagiscono attraverso lo standard PEP 517
- Ora tutto vive in `pyproject.toml`, con tre tabelle principali: `[project]` per i metadati, `[build-system]` per la dichiarazione del backend, e `[tool.*]` per impostazioni specifiche dello strumento

Ha presentato bene. Pulito, preciso, niente fronzoli. Il tipo di talk che ti fa capire quanta conoscenza tribale esiste in qualcosa di fondamentale come il packaging.

## guardando indietro

Dopo due o tre settimane a scrivere questi blog post, devo ammettere che avevo sottovalutato questa conferenza. Quando sono partita da Bologna dopo quei primi due giorni, non ero sicura che ne fosse valsa la pena. Ma dopo qualche settimana a pensarci, scrivere questi post e rileggere i miei appunti — mi sono resa conto di quanti talk veramente belli ci fossero. E il fatto che alcune cose sugli agenti fossero troppo basic per me? Non è una critica alla conferenza. Significa solo che posso essere parte di chi dà forma a questo spazio, invece di limitarmi ad adottare quello che c'è già.

PyCon Italia 2026, sei stata meglio di quanto mi aspettassi. Io e Python? Andiamo ancora forte.

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
