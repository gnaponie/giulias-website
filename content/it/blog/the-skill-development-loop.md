---
title: "Il loop dello sviluppo di skill, o come ho passato una settimana a litigare con dei markdown"
date: "2026-06-30"
excerpt: "Costruire skill per agenti AI sembra semplice — scrivi delle istruzioni, lascia che l'agente faccia il lavoro. In pratica, è un loop infinito di modifiche, test, e chiedersi se 'abbastanza buono' esiste davvero."
tags: ["ai", "automation", "claude", "developer-experience"]
---

Ho passato l'ultima settimana a scrivere skill per agenti AI — per lavoro, per progetti personali, per Claude Code. E ho bisogno di sfogarmi, perché nessuno mi aveva avvisata che la parte più difficile di costruire agenti AI non è l'infrastruttura o il tooling. Sono le skill. I file markdown. Stai letteralmente solo scrivendo del testo — dovrebbe essere come spiegare qualcosa a un amico. E invece no.

## il loop

Ecco come funziona davvero lo sviluppo di una skill nella pratica.

Scrivi un file SKILL.md. È chiaro, è strutturato, copre il caso d'uso principale. Lo testi. L'agente fa qualcosa di inaspettato. Quindi aggiungi più istruzioni. Testi di nuovo. Ora gestisce quel caso, ma ha rotto qualcos'altro che prima funzionava. Aggiusti. Testi. Trovi un altro edge case. Aggiusti. Testi.

Ogni skill che ho costruito questa settimana sembrava pronta all'80% dopo la prima ora, e poi ci sono volute altre quattro ore per arrivare a qualcosa che potessi effettivamente rilasciare. E anche a quel punto, non c'è un traguardo chiaro — l'agente potrebbe seguire le tue istruzioni perfettamente nove volte e poi fare qualcosa di completamente diverso alla decima. Stesso input, comportamento diverso. Non puoi fare unit-test sulle vibes.

## perché succede

Ho riflettuto sul perché sia così frustrante, e credo si riduca a poche cose:

- **Non c'è un contratto.** Quando scrivo una funzione Python, so cosa prende in input e cosa restituisce. Una skill è un insieme di istruzioni in linguaggio naturale per un sistema probabilistico. Il "contratto" è quello che l'LLM decide che significhi oggi. A volte interpreta "controlla sempre l'API prima" come "controlla l'API prima, a meno che tu non pensi di sapere già la risposta." Grazie per l'iniziativa, ma no.
- **L'effetto whack-a-mole.** Aggiungere una regola per gestire l'edge case A cambia il modo in cui l'agente elabora tutto il resto. Più istruzioni non sempre significano un comportamento migliore — a volte lo peggiorano.
- **Rendimenti decrescenti.** La prima bozza richiede trenta minuti e gestisce l'happy path. Gestire gli edge case richiede ore. A un certo punto ti rendi conto che stai spendendo più tempo sulla skill di quanto ne avresti speso a fare il task manualmente per i prossimi sei mesi.
- **Il feedback loop è lento.** Modifichi la skill, rilanci l'agente, aspetti, osservi, capisci cosa è andato storto, ripeti. E quando va storto, la modalità di fallimento è "ha fatto qualcosa di plausibile ma sbagliato" anziché un messaggio di errore chiaro.

## cosa aiuta davvero

Dopo una settimana così, ecco cosa avrei voluto che qualcuno mi avesse detto prima di iniziare:

- **Metti la logica negli script, non nei prompt.** Se qualcosa può essere uno script Python o uno script shell, fallo diventare uno script. Gli script sono deterministici, testabili, e non decidono di interpretare le tue istruzioni in modo creativo alle 3 di pomeriggio di un giovedì. Lascia che l'agente orchestri — le parti meccaniche dovrebbero essere codice.
- **Definisci "abbastanza buono" prima di iniziare.** Prima di toccare il SKILL.md, decidi che aspetto ha il "fatto". Se gestisce il caso d'uso principale e i due edge case più comuni, rilascialo. Non inseguire la perfezione in un sistema probabilistico.
- **Progetta per il fallimento grazioso.** Un'esecuzione fallita che non produce output è meglio di una che pubblica spazzatura. Assicurati che la modalità di fallimento sia "non succede niente" piuttosto che "succede la cosa sbagliata."
- **Dai un time-box alla rifinitura.** Se funziona nove volte su dieci, rilascialo e correggi il decimo caso quando lo vedi in produzione. I fallimenti reali insegnano più di quelli ipotetici.
- **Accetta la natura della cosa.** Siamo formati come ingegneri per rendere le cose deterministiche, ripetibili, prevedibili. Le skill AI non sono niente di tutto ciò. È un tipo diverso di sviluppo, e richiede una definizione diversa di "fatto."

## ne vale la pena?

Sì. Le skill che ho costruito questa settimana mi stanno già facendo risparmiare tempo, e non sono perfette ma funzionano abbastanza bene da essere utili. La frustrazione non è con il concetto — è con il divario tra quanto sembra facile ("basta scrivere del markdown!") e come ci si sente nella pratica.

Ci arriveremo. Nel frattempo, continuerò a scrivere file markdown e a litigare con un'AI su cosa significa "sempre."

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
