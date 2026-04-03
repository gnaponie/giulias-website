---
title: "Testare PipelineRun in stato pending con minikube"
date: "2024-10-23"
excerpt: "Testare se i PipelineRun in stato pending consumano risorse, e se possono essere usati come meccanismo di coda naturale."
tags: ["ci/cd"]
---

Questo è un caso un po' particolare, ma ecco cosa dovevo fare: dovevo avviare diversi [PipelineRun](https://tekton.dev/docs/pipelines/pipelineruns/) (che è un concetto di Tekton), in stato pending, nel mio cluster OpenShift. Poi dovevo verificare se consumavano molte risorse o meno. Perché? Perché avere un mucchio di PipelineRun in pending potrebbe creare una sorta di meccanismo di coda "naturale". Non appena uno si completa, potrei semplicemente cambiare lo stato dei PipelineRun in pending e avviarne uno nuovo.

Non credo sia necessario aggiungere altri dettagli. Mi rendo conto che è uno scenario insolito. Ma sono riuscita a testare alcune cose interessanti con questo lavoro, e ho pensato che sarebbe stato interessante condividere i punti chiave (inoltre, ho davvero bisogno di mettere questo riepilogo da qualche parte — questo sembra un buon posto dove farlo).

## Cosa sto eseguendo?

Un'istanza personalizzata di Renovate. Non è davvero importante cosa state eseguendo. Può essere qualsiasi immagine container. Ma Renovate è un progetto interessante, quindi [date un'occhiata](https://docs.renovatebot.com/).

## La definizione del PipelineRun

Ecco come appare la mia definizione del PipelineRun (ho salvato questo file come `PipelineRun.yaml`):

```yaml
apiVersion: "v1"
kind: "LimitRange"
metadata:
  name: "resource-limits"
spec:
  limits:
    - type: "Container"
      max:
        cpu: "2"
        memory: "1Gi"
      min:
        cpu: "100m"
        memory: "4Mi"
      default:
        cpu: "300m"
        memory: "200Mi"
      defaultRequest:
        cpu: "200m"
        memory: "100Mi"
      maxLimitRequestRatio:
        cpu: "10"
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-resources
spec:
  hard:
    pods: "4"
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "2"
    limits.memory: 2Gi
---
apiVersion: v1
kind: Secret
metadata:
  name: renovate-env
type: Opaque
stringData:
  GITHUB_COM_TOKEN: 'YOUR-TOKEN-HERE'
  RENOVATE_AUTODISCOVER: 'false'
  RENOVATE_ENDPOINT: 'https://github.company.com/api/v3'
  RENOVATE_TOKEN: 'YOUR-TOKEN-HERE'
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: renovate-config
data:
  config.json: |-
    {
      "repositories": ["your/github/repo/here"]
    }
---
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  generateName: renovate-job-
spec:
  status: "PipelineRunPending"
  pipelineSpec:
    tasks:
      - name: run-renovate
        taskSpec:
          steps:
            - name: run
              image: "quay.io/konflux-ci/mintmaker-renovate-image:latest"
              command: ["renovate"]
              resources:
                limits:
                  cpu: 200m
                  memory: 200Mi
                requests:
                  cpu: 100m
                  memory: 100Mi
              env:
                - name: LOG_LEVEL
                  value: debug
              envFrom:
                - secretRef:
                    name: renovate-env
    workspaces:
      - name: renovate-config-workspace
  workspaces:
    - name: renovate-config-workspace
      configmap:
        name: renovate-config
```

Analizziamo cosa abbiamo qui:

- **[LimitRange](https://kubernetes.io/docs/concepts/policy/limit-range/)**: una policy per vincolare le allocazioni di risorse (limiti e richieste) che potete specificare per ogni tipo di oggetto applicabile (come Pod o [PersistentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)) in un namespace.
- **[ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/)**: fornisce vincoli che limitano il consumo aggregato di risorse per namespace. Può limitare la quantità di oggetti che possono essere creati in un namespace per tipo, così come la quantità totale di risorse computazionali che possono essere consumate.
- **Secret**: per memorizzare i token necessari per eseguire Renovate (ha bisogno di accesso al vostro repository e dei permessi giusti per aprire PR per aggiornare le dipendenze obsolete).
- **ConfigMap**: per memorizzare la configurazione di Renovate (ha bisogno di sapere per quale repository controllare le dipendenze).
- **PipelineRun**: ecco il cuore di tutto questo. Questo è qualcosa come l'"esecuzione" di una Pipeline Tekton. Infatti possiamo trovare al suo interno la `pipelineSpec`, che è la definizione della Pipeline. Lì troveremo anche la `taskSpec`, che similmente è la definizione del Task, e la definizione degli step. Per contesto, Tekton ha questo tipo di struttura: **Pipeline → Task → Step**.

Alcuni punti chiave:

- Lo `status` è impostato su `PipelineRunPending` — in questo modo creeremo un PipelineRun, ma non si avvierà effettivamente. Resterà in pending finché non cancelleremo questo campo.
- Con `generateName` siamo in grado di creare un mucchio di questi PipelineRun con uno script e avranno tutti nomi diversi — non dobbiamo aggiornare manualmente il nome per ogni nuovo PipelineRun.
- `workspaces` è importante per configurare la configurazione con la ConfigMap che abbiamo definito prima.

## Testare localmente con minikube

Ora abbiamo la nostra definizione, ottimo. Ma come testarla? Abbiamo bisogno di un cluster Kubernetes in locale. Per avviarne uno possiamo usare [minikube](https://minikube.sigs.k8s.io/docs/start/). Installatelo (basta [controllare la documentazione](https://minikube.sigs.k8s.io/docs/)), poi ho seguito [questa guida Tekton per il setup locale](https://github.com/tektoncd/pipeline/blob/main/docs/developers/local-setup.md#using-minikube) (tra l'altro, la documentazione di Tekton è semplicemente ottima e piena di bei esempi!).

Ecco i comandi che ho usato:

```bash
minikube start --memory 6144 --cpus 2
eval $(minikube -p minikube docker-env)
minikube addons enable registry
minikube addons enable registry-aliases
```

Assicuratevi di installare Tekton sul cluster (dovete avere [`kubectl`](https://kubernetes.io/docs/reference/kubectl/) installato):

```bash
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
```

Per controllare le informazioni del cluster potete eseguire:

```bash
kubectl cluster-info
```

## Creare e testare i PipelineRun

Ora possiamo creare i nostri PipelineRun con questo comando:

```bash
kubectl create --filename PipelineRun.yaml
```

Questo creerà un PipelineRun. Parte in stato pending. Ora possiamo controllare il PipelineRun e il consumo di quota/risorse:

```bash
kubectl get pipelinerun
kubectl get quota
```

Vedremo che la quota non è influenzata. Questo significa che un PipelineRun in pending non spreca molte risorse e che possiamo avviarne anche migliaia contemporaneamente.

Per essere ancora più sicuri, possiamo cancellare lo status del PipelineRun in modo che possa effettivamente avviarsi. Per farlo basta eseguire (il nome è visibile dal comando precedente):

```bash
kubectl edit pipelinerun/<name-of-the-pipeline-run>
```

E semplicemente rimuovere lo `status` dalla definizione. A questo punto possiamo controllare di nuovo i PipelineRun e vedremo che il PipelineRun si sta avviando. Se controlliamo di nuovo la quota, dovremmo vedere che alcune risorse vengono ora consumate.

Un test aggiuntivo per assicurarsi che la quota stia aumentando è creare un pod di test. In questo caso vedrete sicuramente la quota salire. Ecco la definizione del pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: testpod
spec:
  containers:
  - name: test
    image: alpine:latest
    command: ["sleep", "1d"]
    resources:
      requests:
        memory: "200Mi"
        cpu: "250m"
      limits:
        memory: "500Mi"
        cpu: "500m"
```

Salvate questo in `testpod.yaml` e applicatelo:

```bash
kubectl apply --filename testpod.yaml
```

Se controllate la quota adesso, vedrete di nuovo un aumento.

## Conclusione

Dopo questi test possiamo concludere che un PipelineRun in pending non spreca risorse (o pochissime) e possiamo tranquillamente usarli come meccanismo di coda "naturale" e avviarne anche migliaia senza preoccuparci del consumo di risorse. Dovremo sicuramente essere più attenti a quanti PipelineRun "in corso" verranno avviati, ma questa è un'altra storia.

---
*Questa traduzione è stata realizzata con l'aiuto dell'AI. Il contenuto originale è in inglese.*
