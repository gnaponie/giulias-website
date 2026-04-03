---
title: "Come risolvere \"Failed to find exact match for batch/v1beta1.CronJob\""
date: "2024-02-08"
excerpt: "Una soluzione rapida per l'errore di mismatch dell'apiVersion di CronJob su OpenShift e Kubernetes."
tags: ["ci/cd"]
---

Stavo cercando di configurare un cron job per eseguire la mia pipeline Tekton (in OpenShift — quindi potrebbe applicarsi anche a voi se lavorate con Kubernetes, dato che OpenShift è basato su quello), e ho ottenuto questo errore:

```
Failed to find exact match for batch/v1beta1.CronJob by [kind, name, singularName, shortNames]
```

Cercando un po' su Google era chiaro che c'era qualche problema con la versione del cluster Kubernetes e che la definizione era sbagliata. Ma non riuscivo a trovare il problema.

Questa era parte della mia definizione:

```yaml
kind: CronJob
apiVersion: batch/v1beta1.CronJob
metadata:
  name: name-{{ env }}
  labels:
    env: "{{ env }}"
```

Ma non funzionava. A me sembrava corretta. Ecco come risolvere.

C'era qualcosa di sbagliato specificamente con `batch/v1beta1.CronJob`. Ma come scoprire quale fosse la `apiVersion` corretta? Ecco il comando che potete usare (dovrete prima fare il login al vostro cluster OpenShift):

```bash
oc api-resources | less
```

Questo vi darà una lista simile (che è molto più lunga, ecco perché abbiamo aggiunto `| less`, così potete cercare facilmente ciò che vi serve):

```
NAME                                  SHORTNAMES           APIVERSION                              NAMESPACED   KIND
...
clusterautoscalers                    ca                   autoscaling.openshift.io/v1              false        ClusterAutoscaler
machineautoscalers                    ma                   autoscaling.openshift.io/v1beta1         true         MachineAutoscaler
cronjobs                              cj                   batch/v1                                 true         CronJob
jobs                                                       batch/v1                                 true         Job
sealedsecrets                                              bitnami.com/v1alpha1                     true         SealedSecret
...
```

Ora potete cercare `CronJob` e vi dirà la `apiVersion` che dovreste usare, che nel mio caso era `batch/v1`. Quindi alla fine questa è la configurazione finale:

```yaml
kind: CronJob
apiVersion: batch/v1
metadata:
  name: name-{{ env }}
  labels:
    env: "{{ env }}"
```

Ovviamente questo si applica a qualsiasi tipo di "kind" — `oc api-resources` è il vostro alleato ogni volta che non siete sicuri della versione API corretta per qualsiasi risorsa.

Spero che questo vi sia utile!

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
