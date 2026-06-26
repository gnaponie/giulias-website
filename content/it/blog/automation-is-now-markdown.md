---
title: "L'automazione ormai è fatta di file markdown"
date: "2026-06-26"
excerpt: "Ho costruito un set di skill AI per i miei workflow quotidiani — creare ticket Jira, scrivere blog post, cercare conversazioni passate. Ecco perché insegnare al tuo assistente AI come lavori è la cosa più utile che puoi automatizzare adesso."
tags: ["ai", "automation", "productivity", "claude"]
---

Devo fare una confessione. Questo blog post è stato scritto con l'aiuto dell'AI. Ma lo sapevate già, no? A questo punto diamo tutti per scontato che tutto sia generato dall'AI, e onestamente, la maggior parte delle volte abbiamo ragione. Sono talmente sommersa di testo generato dall'AI che non riesco più a leggere neanche i messaggi su Slack. Tutto suona uguale. Tutto è levigato allo stesso modo. Lo capisci dalla prima frase.

Quindi ecco la mia versione di onestà: sì, l'AI assiste i miei blog post. Ma la maggior parte la scrivo ancora io — le idee, la struttura, le opinioni sono mie. L'AI li sistema, mi corregge la grammatica, e a volte suggerisce formulazioni migliori. Ci posso convivere.

Ma credo di aver fatto un passo in più. Ed è di questo che voglio parlare.

## automatizzare me stessa fino a perdere il lavoro

Nel mio lavoro quotidiano, stiamo attivamente lavorando per trasformare tutti i nostri workflow in workflow agentici. Abbiamo costruito [Claudio](/blog/claudio-intro), un agente AI containerizzato per l'automazione DevOps. Scriviamo skill, progettiamo pipeline, facciamo fare all'AI le parti ripetitive del nostro lavoro. In pratica, tra sei o sette mesi un'AI farà tutto il mio lavoro, e sono io che la sto scrivendo finché non mi licenziano perché non servo più. Sì, sono proprio intelligente.

Nel peggiore dei casi mi licenziano e vado a fare torte a tempo pieno — faccio delle torte buonissime, tra l'altro. Nel migliore dei casi mi tengo il lavoro per gestire l'infrastruttura che ho progettato. In ogni caso, almeno le torte saranno buone.

Dico sempre: guardate quanto è migliorata l'AI in un paio d'anni. Immaginate cosa potrebbe fare tra altri due. Anche se c'è chi sostiene che la parte più ripida della curva sia già passata, e da qui in poi i miglioramenti saranno più incrementali. Vedremo. Come sempre con l'AI, possiamo solo speculare.

## se lo fai due volte, stai sbagliando

Ecco una cosa in cui credo davvero: se devi fare qualcosa più di una volta, dovresti automatizzarla. Prima significava scrivere script shell, configurare cron job, costruire piccoli tool. Adesso? L'automazione è fatta di file markdown.

Non sto facendo poesia. È letteralmente così. Claude Code ha un sistema di skill dove scrivi un file markdown che descrive un workflow, e l'AI lo segue. Nessun SDK, nessun framework, nessuna API da imparare. Scrivi istruzioni in testo semplice, e l'AI le esegue con gli strumenti che ha a disposizione.

Quindi ho costruito un set di skill personali per le cose che faccio ripetutamente. Ecco alcuni dei migliori esempi che vale la pena menzionare:

## le skill

**Creare ticket Jira** — Creo probabilmente dai cinque ai dieci ticket Jira a settimana. Ognuno ha bisogno del progetto giusto, del componente, del livello di sicurezza, del link all'epic, e a volte dell'assegnazione allo sprint. Lo facevo manualmente ogni singola volta, compilando gli stessi campi, ricordandomi quale custom field ID corrisponde a quale epic. Adesso scrivo `/file-jira Uno spike per investigare le opzioni di caching Redis` e mi crea il ticket con tutti i default che mi servono. Gestisce il campo custom assurdo per il link all'epic che richiede la nostra istanza Jira — il tipo di conoscenza tribale che un nuovo membro del team ci metterebbe una settimana a capire.

**Scrivere blog post** — Questo è quello meta. Ho scritto una skill che conosce il mio stile di scrittura. Sa che uso la prima persona, le contrazioni, l'umorismo. Sa che non scrivo "In questo blog post discuterò" o "Vale la pena notare che." Sa che comincio con un aggancio personale, non un'introduzione generica. Sa che i miei titoli sono in minuscolo (Che Fastidio Quando l'AI Fa Questa Cosa). Ho insegnato tutto questo scrivendo una guida di stile dettagliata come file markdown, e adesso quando ho appunti grezzi da una conferenza o un'idea che voglio esplorare, lancio la skill e ottengo una bozza che suona davvero come me. Non perfetta — la edito ancora — ma il punto di partenza è genuinamente niente male.

**Scrivere documenti** — Simile alla skill per i blog post, ma per documenti di lavoro. Proposte di design, specifiche tecniche, decision record. Segue la formattazione del nostro team, usa il branding Red Hat, e produce file HTML standalone.

**Condividere documenti via S3** — Una volta che ho un documento, devo condividerlo. Questa skill carica file HTML su un bucket S3 e genera URL presigned che scadono dopo sette giorni. Due comandi racchiusi in una skill. Prima dovevo aprire la console AWS, navigare al bucket, caricare, generare un link, copiarlo — il tipo di cosa che richiede due minuti ma ne sembra dieci per quanti click servono. Adesso è un comando e mi torna un link.

**Cercare conversazioni passate** — Questa mi piace molto. Claude Code ha un flag `--resume` che ti permette di riprendere una conversazione precedente da dove l'avevi lasciata. Il problema è trovare quella giusta. Quando penso "ho discusso questa migrazione del dashboard due settimane fa," non mi ricordo l'ID della sessione, e scorrere una lista di sessioni passate non è il massimo. Quindi ho costruito una skill chiamata `recall` che cerca nei miei transcript delle conversazioni per argomento, trova la sessione corrispondente, e mi dà l'ID per poterla riprendere direttamente. Trasforma "so che ne abbiamo parlato" in riprendere davvero da dove avevo lasciato.

**Riflettere sulle sessioni** — Alla fine di una sessione di lavoro, posso lanciare `reflect` e rivede la conversazione per decidere cosa vale la pena salvare per le sessioni future. Ho corretto un comportamento di Claude? Ho stabilito una preferenza? Abbiamo preso una decisione che il me del futuro dovrebbe sapere? Salva tutto come file di memoria che vengono caricati nelle conversazioni future. Devo ringraziare il mio collega Jakub per questa idea — mi ha raccontato del suo setup di memoria e reflect, e l'ho semplicemente copiato per il mio workflow. Uno dei miei superpoteri — mio marito lo chiama ninja cloning — è vedere qualcosa che fa qualcun altro e farla immediatamente mia.

**Review trimestrali** — Red Hat ha review di performance trimestrali, e ogni volta le domande sono leggermente diverse. Ho costruito una skill che prende i miei ticket Jira chiusi per il trimestre, li combina con qualsiasi contesto aggiuntivo che fornisco, e prepara delle bozze di risposta con il tono giusto. Non inventa nulla — lavora con quello che ho effettivamente fatto. Ma mi salva dallo stare a fissare un campo di testo vuoto per un'ora.

## perché tutto questo conta davvero

Ecco la cosa che trovo interessante in tutto questo. Le skill stesse sono semplici — la maggior parte è solo un file markdown con delle istruzioni. La skill `file-jira` è sostanzialmente "ecco i miei default, ecco come gestire il campo custom, crea il ticket." La skill `write-blog-post` è una guida di stile più alcune regole strutturali. Niente di sofisticato.

Ma l'effetto composto è reale. Ogni skill mi fa risparmiare forse dieci-quindici minuti. Moltiplicate per quanto spesso le uso, e si accumula in fretta. Più importante ancora, elimina l'attrito. È più probabile che crei un ticket Jira se ci vogliono dieci secondi invece di due minuti. È più probabile che scriva un blog post se non devo partire da una pagina bianca. È più probabile che rifletta su una sessione se è un comando invece di un esercizio deliberato di journaling.

Il sistema di memoria è probabilmente la parte con più impatto. Claude Code carica i miei file di memoria all'inizio di ogni conversazione, quindi conosce le mie preferenze, le mie correzioni, il mio contesto — senza che debba ripetermi. Sa di non usare emoji nei miei blog post. Sa che la nostra istanza Jira ha un campo custom assurdo per i link all'epic. Sa che preferisco formulazioni sobrie a dichiarazioni drammatiche. Ogni correzione che faccio viene salvata, e non devo più farla di nuovo.

## la rivoluzione del markdown

Ho passato anni a imparare a scrivere script Python, script Bash, playbook Ansible, manifest Kubernetes. Tutto per automatizzare cose. E adesso l'automazione più efficace che ho è una collezione di file markdown.

È perfetto? No. L'AI fa ancora errori, ignora le istruzioni, allucina dettagli. Ma scrivere una skill markdown che gestisce l'80% di un task richiede trenta minuti. Scrivere uno script che gestisce il 100% potrebbe richiedere un giorno — e poi devi mantenerlo.

Adesso scusatemi, devo andare a controllare se questo blog post sembra scritto da un umano o dalla skill di cui vi ho appena parlato. La risposta è entrambi, e penso che vada bene così.
