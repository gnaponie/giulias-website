---
title: "Comandi Ansible da ricordare"
date: "2025-05-12"
excerpt: "Alcuni appunti personali su comandi Ansible usati frequentemente ma lunghi, a cui faccio spesso riferimento."
tags: ["automation"]
---

[Ansible](https://docs.ansible.com/) è un potente strumento open-source per gestire, distribuire e automatizzare vari aspetti delle vostre applicazioni e infrastruttura.

Anche se uso Ansible spesso, questo articolo non vuole essere una spiegazione di base delle sue funzionalità e caratteristiche. Pertanto, se state cercando una guida introduttiva, questo potrebbe non essere il posto giusto. Invece, condividerò alcuni appunti personali su comandi usati frequentemente ma lunghi, a cui faccio spesso riferimento.

## Eseguire un Playbook

Questo comando eseguirà il playbook `deploy-application.yml` sugli host definiti nell'inventario `inventory/application`. Tenterà di connettersi a questi host come l'utente `giulia`, vi chiederà la password e la password per l'escalation dei privilegi, ed eseguirà i task nel playbook con privilegi elevati, fornendo un output dettagliato dell'esecuzione.

```bash
ansible-playbook playbooks/dev/deploy-application.yml -i inventory/application -u giulia -b -k -K -vv
```

Analizziamolo un po' più nel dettaglio:

- `ansible-playbook playbooks/dev/deploy-application.yml` — esegue il file playbook Ansible specificato.
- `-i inventory/application` — specifica il file o la directory di inventario contenente gli host di destinazione.
- `-u giulia` — definisce il nome utente (`giulia`) usato per connettersi ai server remoti.
- `-b` — abilita l'escalation dei privilegi (ad esempio, usando `sudo`).
- `-k` — chiede la password dell'utente remoto (`giulia`).
- `-K` — chiede la password per l'escalation dei privilegi (se si usa `-b`).
- `-vv` — aumenta la verbosità dell'output durante l'esecuzione del playbook.

## Parametro Tag

Un parametro utile e degno di nota è `tags`:

```bash
ansible-playbook playbooks/dev/deploy-application.yml -i inventory/application -u giulia -b -k -K --tags test -vv
```

Il parametro `--tags` permette di eseguire selettivamente parti specifiche (task o play) del vostro playbook Ansible. I playbook possono essere organizzati con tag applicati a singoli task o blocchi di task.

In questo esempio, `--tags test` istruirà Ansible ad eseguire solo i task o i play all'interno del playbook `deploy-application.yml` che sono stati taggati con il nome `test`. Qualsiasi task o play senza questo tag verrà saltato durante questa particolare esecuzione.

I tag sono utili per vari scopi, come ad esempio:

- Eseguire solo task di configurazione e saltare quelli di distribuzione.
- Eseguire test specifici dopo una distribuzione.
- Puntare a un sottoinsieme della vostra infrastruttura per un'azione particolare.

## Vault e gestione dei segreti

[Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html) è una funzionalità potente che permette di mantenere i dati sensibili, come password, token API e chiavi private, crittografati all'interno dei vostri playbook e ruoli Ansible. Questo evita di dover memorizzare queste informazioni riservate in testo in chiaro, migliorando significativamente la sicurezza dei vostri flussi di automazione.

Il principio fondamentale di Ansible Vault è la crittografia simmetrica tramite una password. I dati sensibili vengono crittografati usando una password, e poi bisogna fornire la stessa password (o il percorso di un file contenente la password) quando si vuole decrittare e usare quei dati nelle esecuzioni Ansible.

Ansible Vault può crittografare singoli file o variabili specifiche all'interno di file YAML. Quando Ansible esegue un playbook che usa dati crittografati con Vault, decrittografa temporaneamente le informazioni necessarie in memoria solo per la durata del task, assicurando che i dati sensibili non vengano esposti inutilmente.

**Crittografare un file**

```bash
ANSIBLE_VAULT_PASSWORD_FILE=~/secrets/password ansible-vault encrypt vault/prod/secret-vars.yml
```

- `ANSIBLE_VAULT_PASSWORD_FILE=~/secrets/password` — imposta una variabile d'ambiente che dice ad `ansible-vault` dove trovare la password necessaria per la crittografia. Ansible Vault leggerà la password dal file situato in `~/secrets/password`.
- `ansible-vault encrypt` — dice ad `ansible-vault` di crittografare il file specificato.
- `vault/prod/secret-vars.yml` — il percorso del file che si vuole crittografare. Dopo aver eseguito questo comando, il contenuto di `secret-vars.yml` sarà crittografato e il file originale verrà sovrascritto con la versione crittografata.

**Decrittografare un file**

```bash
ANSIBLE_VAULT_PASSWORD_FILE=~/secrets/password ansible-vault decrypt vault/prod/secret-vars.yml
```

È esattamente uguale a quello per la crittografia, ma in realtà... decrittografa.

## Ansible Galaxy: condividere e riutilizzare contenuti di automazione

[Ansible Galaxy](https://galaxy.ansible.com/) è un hub per trovare, condividere e gestire ruoli e collezioni Ansible. Lo strumento da riga di comando `ansible-galaxy` viene usato per interagire con Ansible Galaxy e gestire questi pezzi riutilizzabili di automazione. Potete usarlo per cercare, installare e gestire ruoli e collezioni.

Vediamo questo comando:

```bash
ansible-galaxy install -r playbooks/dev/requirements.yml
```

- `ansible-galaxy` — lo strumento da riga di comando usato per interagire con Ansible Galaxy.
- `install` — dice ad `ansible-galaxy` di installare del contenuto. In questo contesto, viene usato per installare ruoli Ansible (e potenzialmente collezioni, a seconda del file `requirements.yml`).
- `-r playbooks/dev/requirements.yml` — il parametro `-r` o `--role-file` specifica un file che elenca i ruoli Ansible (e/o le collezioni) che si vogliono installare.

## Conclusione

Abbiamo esplorato una selezione di comandi Ansible essenziali che possono semplificare notevolmente i vostri flussi di automazione. Dalla distribuzione di applicazioni con `ansible-playbook` alla gestione di contenuti di automazione riutilizzabili con `ansible-galaxy` e alla protezione di dati sensibili con `ansible-vault`, questi strumenti offrono potenti funzionalità per gestire e orchestrare la vostra infrastruttura.

Questa guida fornisce un punto di partenza, e il vero potere di Ansible risiede nel suo vasto ecosistema di moduli, plugin e nella flessibilità di adattarlo alle vostre esigenze specifiche.

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
