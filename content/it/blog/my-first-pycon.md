---
title: "Il mio primo PyCon — Parte 1: la conferenza e il keynote"
date: "2026-06-03"
excerpt: "Finalmente ho partecipato a PyCon Italia dopo tutti questi anni. Alcuni talk mi sono piaciuti molto, altri mi hanno fatto capire quanto ho ancora da imparare, e le donne che ho incontrato erano semplicemente brillanti."
tags: ["python", "ai", "diversity", "conferences"]
---

Ho appena partecipato a PyCon Italia 2026. Era il 28–30 maggio, a Bologna. E dopo tutti questi anni a lavorare con Python — scherzo sempre dicendo che Python è la mia relazione più lunga e che siamo ancora molto innamorati — questo era il mio primo PyCon. Partecipare è stato emozionante, quasi in ritardo.

Ma sarò onesta: dopo i primi due giorni, avevo sentimenti contrastanti.

## L'effetto bolla

Il punto è questo. Lavorare in un'azienda come Red Hat ti spinge ai confini di certe cose. Fai parte di una delle poche organizzazioni che implementano tecnologie prima che il resto dell'industria le raggiunga. Quindi quando ti siedi ad un talk dove lo speaker spiega cosa sono gli MCP, nel 2026, o presenta il RAG come qualcosa di innovativo, o parla di workflow agentici e pensi "noi lo facciamo da mesi"... mette le cose in prospettiva.

Quando uno speaker ha chiesto al pubblico quante persone usano agenti in produzione, solo circa il 10% ha alzato la mano. L'AI si muove così velocemente che spesso, quando arriva la conferenza, il talk che hai proposto è già superato. Non voglio essere presuntuosa — ma mi ha fatto capire quanto sia avanzata la nostra organizzazione AI in Red Hat. Infatti, mi ha dato la spinta per proporre un altro talk a una conferenza, specificamente sul nostro workflow agentico.

Ma c'è il rovescio della medaglia: quando si tratta di machine learning, data science e i fondamenti di tutto questo, sono indietro. Se l'industria si sta orientando sempre più verso il ML — e chiaramente è così — devo accelerare. Avevo già iniziato a studiare questi argomenti, ma partecipare a questi talk mi ha dato la spinta finale per capire quanta esperienza pratica in più mi serve.

## Il sabato ha salvato la conferenza

Per fortuna, il sabato ho avuto la possibilità di seguire alcuni talk più pratici, da persone genuinamente talentuose. Non che tutti i talk del giovedì e venerdì fossero brutti — un paio hanno davvero catturato la mia attenzione — ma le sessioni del sabato avevano un altro impatto. Nel complesso, ho incontrato persone davvero simpatiche ed è stata un'esperienza estremamente piacevole.

## Le donne

Una cosa che mi ha piacevolmente sorpresa è stato il numero di donne che ho incontrato. Ho avuto la possibilità di parlare con alcune di loro e ascoltare i loro talk. E quello che mi ha colpita: ogni singola donna era brillante. Che, intendiamoci, non è una cosa negativa. Ma penso che confermi qualcosa che sento da molto tempo. Una donna in questa industria deve lavorare più duramente solo per restare. O lavori il doppio rispetto ai tuoi colleghi maschi e diventi un'ingegnera top, oppure l'industria ti taglierà fuori silenziosamente. Questo non succede agli uomini — almeno non con la stessa frequenza. Quelle che sopravvivono sono eccezionali, perché hanno dovuto esserlo.

Gli organizzatori hanno condiviso i numeri all'inizio della conferenza: il 19% dei partecipanti erano donne. Ancora non un gran numero. Ma guardandomi intorno, in qualche modo sembravano più del solito. Forse perché più diventi senior, meno donne vedi, e il tuo punto di riferimento si sposta. Quando l'asticella è bassa, il 19% inizia a sembrare progresso.

## Il keynote: AI multimodale open-source

Il primo keynote era di Merve Noyan, un'ingegnera di Hugging Face, e riguardava l'AI multimodale open-source. Era un chiaro esempio di ingegnera estremamente talentuosa. A volte non ero d'accordo con tutto quello che diceva, ma si percepivano sia la passione che la profonda esperienza dietro ogni slide.

Il suo argomento principale era che usare modelli open-source è meglio per controllo, riduzione dei costi, personalizzazione e privacy. E guardate — sono una contributrice e sostenitrice open-source da tutta la vita. È stato un valore fondamentale in tutta la mia carriera. Ma mi sono trovata a mettere in discussione questo, almeno nello spazio AI. Forse sono di parte perché lavorare in una grande azienda mi dà accesso ai modelli proprietari più potenti senza costi personali. Ma con modelli come Claude e GPT-4 disponibili, alcuni anche a prezzi ragionevoli, ha davvero senso puntare di default su alternative open-source meno potenti?

Forse mi sfugge il punto. Forse sto perdendo i miei valori open-source. O forse *è* proprio quello il punto — dovremmo usare e contribuire ai modelli open-source proprio perché possano diventare tecnicamente competitivi, come il software open-source è diventato lo standard per tutto il resto. Ci sto ancora ragionando su.

Ha menzionato l'[Artificial Analysis index](https://artificialanalysis.ai/), una piattaforma indipendente di benchmarking che valuta i modelli AI in base a qualità, velocità e prezzo — una risorsa utile se stai confrontando modelli e vuoi dati che non provengano dai provider dei modelli stessi.

### Multimodalità e Vision Language Model

Poi ha spiegato la multimodalità: un modello capace di elaborare più di un tipo di input — testo, immagini, audio, video — invece di essere limitato al solo testo. Un modello multimodale può, per esempio, guardare un'immagine e rispondere a domande su di essa in linguaggio naturale, o trascrivere audio comprendendo il contesto visivo di un video.

Da lì, si è concentrata sui Vision Language Model (VLM) — modelli che prendono immagini e testo come input e producono testo come output. Ha fatto un breve excursus storico:

- **Gennaio 2021** — CLIP di OpenAI, il primo grande modello multimodale che collegava immagini e testo
- **Aprile 2022** — Flamingo di Google DeepMind, capace di ragionamento visivo few-shot
- **Aprile 2023** — LLaVA di Microsoft, un approccio leggero al visual instruction tuning

Poi sono arrivati modelli come Sonnet e GPT-4o, e la traiettoria è diventata chiara: i VLM stanno essenzialmente diventando i nuovi LLM. La multimodalità non è più una funzionalità — è la base.

Ha approfondito l'architettura di LLaVA, che usa un projection layer — essenzialmente un ponte che mappa le caratteristiche visive da un encoder di immagini nello stesso spazio che il modello linguistico comprende, permettendogli di "vedere". Ha anche menzionato SmolVLM, il modello vision-language piccolo ma capace di Hugging Face, progettato per essere abbastanza efficiente da girare su hardware consumer.

### Object detection, segmentazione e una nota di cautela

Ha mostrato come questi modelli gestiscono l'object detection: quando chiedi a un VLM di localizzare qualcosa in un'immagine, l'output include location token — coordinate che identificano dove si trova l'oggetto. Ma il suo consiglio era chiaro: non mettere questi modelli in produzione per l'object detection. Sono grandi, costosi e ancora non abbastanza affidabili per quel tipo di caso d'uso.

Ha anche parlato di SAM 2 (Segment Anything Model 2) di Meta — un modello di segmentazione capace di identificare e isolare qualsiasi oggetto in un'immagine o video, disegnando essenzialmente confini precisi attorno agli oggetti senza bisogno di addestramento specifico per task.

### Le sue raccomandazioni di modelli open-source

Questa parte è stata genuinamente utile. Ha raggruppato i modelli per caso d'uso:

- **Coltellini svizzeri**: Qwen 2.5, Kimi-K2, GLM-4V, Gemma 4 (multimodali con tool-calling)
- **Piccoli ma potenti**: Moondream 2, LFM-2.5-VL
- **Minuscoli**: Florence-2
- **Documenti/OCR**: Chandojra-OCR-2, OlmOCR 2, PaddleOCR-VL
- **Modelli GUI**: UI-TARS
- **Any-to-any**: Nemotron-Omni, Gemma 4, Qwen 2.5-Omni

Il trend è ovvio: quasi tutti gli LLM oggi escono multimodali.

Ha anche menzionato OLM-OCR-Bench, una nuova funzionalità di benchmarking su Hugging Face per valutare modelli OCR — da tenere d'occhio.

### Video, document retrieval e l'argomento "il RAG è vecchio"

Sulla comprensione dei video, ha evidenziato qualcosa di interessante: la maggior parte dei modelli non elabora davvero i video come video. Campionano frame come immagini e ignorano completamente l'audio. Non è un'elaborazione video veramente multimodale — è una serie di analisi di immagini cucite insieme.

Poi ha parlato dei modelli di document retrieval come approccio più moderno, un'evoluzione oltre il tradizionale RAG (Retrieval-Augmented Generation). Nel RAG classico, si spezza un documento in pezzi di testo, si creano embedding e si recuperano le parti rilevanti. Ma i modelli di document retrieval — quelli che lei ha chiamato approcci "stile ColPali" — lavorano direttamente sulla rappresentazione visiva dei documenti. Invece di estrarre testo da un PDF perdendo layout, tabelle e formattazione, il modello guarda il documento come un'immagine e recupera le informazioni visivamente. Ha sostenuto che questa è la direzione, e che il RAG tradizionale basato su testo sta diventando obsoleto per i casi d'uso documentali.

Ha menzionato modelli single-vector come DSE (Document Screenshot Embedding), che crea un embedding per ogni screenshot di documento, e MCDSE (Multi-Channel DSE), che genera embedding multipli per pagina per catturare più dettaglio visivo. Entrambi evitano il fragile passaggio di estrazione del testo che rende le pipeline RAG tradizionali così fragili.

### Addestramento ed esecuzione dei modelli

Il talk ha anche coperto il lato pratico del lavoro con questi modelli. Per il fine-tuning, c'è TRL (Transformer Reinforcement Learning) — la libreria di Hugging Face per addestrare modelli linguistici con reinforcement learning dal feedback umano. E più recentemente, HuggingFace Skills come approccio più nuovo all'addestramento dei modelli (a quanto pare prima era tutto solo TensorFlow).

Poi c'è la quantizzazione, una di quelle cose che continuo a sentire nominare ma che non avevo pienamente capito fino ad ora. L'idea è semplice: riduci la precisione numerica di un modello — diciamo da 32-bit a 8-bit o anche 4-bit — per renderlo più piccolo e veloce da eseguire. Perdi un po' di accuratezza, ma il compromesso spesso vale la pena, specialmente se vuoi far girare qualcosa in locale senza una GPU potente. torchao di PyTorch gestisce questo, e puoi farlo direttamente da Hugging Face.

E per servire modelli in locale, llama.cpp è la strada da percorrere — un paio di comandi attraverso l'integrazione Hugging Face e hai un modello che gira sulla tua macchina.

### Il pitch di Hugging Face (e va bene così)

Lo ammetto, alla fine il talk era pieno di funzionalità di Hugging Face. Era un po' un pitch di prodotto. Ma onestamente? È comprensibile. Hugging Face è uno strumento genuinamente ottimo, usato massivamente nell'industria, e le funzionalità che ha evidenziato erano legittimamente utili. A volte un pitch è semplicemente qualcuno che ti mostra strumenti che funzionano davvero.

Alla fine, il talk mi è piaciuto molto.

## Cosa viene dopo

Questa è la prima parte di una piccola serie sulla mia esperienza al PyCon. Volevo iniziare con le impressioni generali — i sentimenti contrastanti, le donne, e il keynote di apertura, che mi è sembrato un primo argomento naturale a cui dare spazio. Nei prossimi post, parlerò degli altri talk che mi hanno colpita e delle cose che ho imparato lungo il percorso.

Restate sintonizzati. Python e io siamo ancora molto innamorati, e c'è altro da raccontare.

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
