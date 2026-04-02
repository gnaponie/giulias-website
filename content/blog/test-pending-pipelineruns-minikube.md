---
title: "Test pending PipelineRuns in minikube"
date: "2024-10-23"
excerpt: "Testing whether pending PipelineRuns consume resources, and whether they can be used as a natural queue mechanism."
tags: ["ci/cd"]
---

This is a bit of a corner case, but here's what I had to do: I need to start several [PipelineRuns](https://tekton.dev/docs/pipelines/pipelineruns/) (which is a Tekton concept), in pending state, in my OpenShift cluster. Then I need to see if they are consuming a lot of resources or not. Why? Because having a bunch of pending PipelineRuns could create a sort of "natural" queue mechanism. As soon as one completes, I could just change the status of the pending PipelineRuns and start a new one.

I don't think adding more details is necessary. I realize this is an uncommon scenario. But I managed to test some cool things with this work, and I thought it would be interesting to share the key points of it (plus, I really need to put this summary somewhere — this seems like a nice place where to do that).

## What am I running?

A custom Renovate instance. It's not really important what you're running. It can be whatever container image. But Renovate is a cool project, so [check it out](https://docs.renovatebot.com/).

## The PipelineRun definition

Here's how my PipelineRun definition looks like (I've saved this file as `PipelineRun.yaml`):

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

Let's analyze what we have here:

- **[LimitRange](https://kubernetes.io/docs/concepts/policy/limit-range/)**: a policy to constrain the resource allocations (limits and requests) that you can specify for each applicable object kind (such as Pod or [PersistentVolumeClaim](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)) in a namespace.
- **[ResourceQuota](https://kubernetes.io/docs/concepts/policy/resource-quotas/)**: provides constraints that limit aggregate resource consumption per namespace. It can limit the quantity of objects that can be created in a namespace by type, as well as the total amount of compute resources that may be consumed.
- **Secret**: to store the tokens needed to run Renovate (it needs access to your repo and the right permissions to file PRs to update your outdated dependencies).
- **ConfigMap**: to store the configuration for Renovate (it needs to know which repo to check deps for).
- **PipelineRun**: here's the core of this. This is something like the "execution" of a Tekton Pipeline. In fact we can find in there the `pipelineSpec`, that is the definition of the Pipeline. In there we'll also find the `taskSpec`, which similarly is the definition for the Task, and the definition of the steps. For context, Tekton has this kind of structure: **Pipelines → Tasks → Steps**.

A few key points:

- The `status` is set to `PipelineRunPending` — this way we'll create a PipelineRun, but it won't actually start. It will be pending until we clear this field.
- With `generateName` we are able to create a bunch of these PipelineRuns with a script and they will all have different names — we don't have to manually update the name for each new PipelineRun.
- `workspaces` is important to set up the configuration with the ConfigMap that we defined before.

## Testing locally with minikube

We now have our definition, great. But how to test this? We need a Kubernetes cluster locally. To start one we can use [minikube](https://minikube.sigs.k8s.io/docs/start/). Install it (just [check the documentation](https://minikube.sigs.k8s.io/docs/)), then I followed [this Tekton guide for local setup](https://github.com/tektoncd/pipeline/blob/main/docs/developers/local-setup.md#using-minikube) (BTW, Tekton's documentation is simply great and full of nice examples!).

Here are the commands I used:

```bash
minikube start --memory 6144 --cpus 2
eval $(minikube -p minikube docker-env)
minikube addons enable registry
minikube addons enable registry-aliases
```

Make sure you install Tekton on the cluster (you need to have [`kubectl`](https://kubernetes.io/docs/reference/kubectl/) installed):

```bash
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
```

To check the cluster's info you could run:

```bash
kubectl cluster-info
```

## Creating and testing PipelineRuns

Now we can create our PipelineRuns with this command:

```bash
kubectl create --filename PipelineRun.yaml
```

This will create one PipelineRun. It starts with pending state. We can now check the PipelineRun and the quota/resource consumption:

```bash
kubectl get pipelinerun
kubectl get quota
```

We'll see that the quota isn't affected. This means that a pending PipelineRun won't waste many resources and that we can even start thousands of them at the same time.

To be extra sure, we can clear the status of the PipelineRun so that it can actually start. To do that simply run (the name is visible from the previous command):

```bash
kubectl edit pipelinerun/<name-of-the-pipeline-run>
```

And simply remove the `status` from the definition. At this point we can check the PipelineRuns again and we'll see that the PipelineRun is starting. If we check the quota again, we should see that some resources are now being consumed.

An additional test to make sure the quota is increasing is to create a testing pod. You'll definitely see the quota go up in this case. Here's the pod definition:

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

Save this in `testpod.yaml` and apply it:

```bash
kubectl apply --filename testpod.yaml
```

If you check the quota now, you'll see an increase again.

## Conclusion

After this testing we can assume that a pending PipelineRun isn't wasting any resources (or very few) and we can safely use them as a "natural" queue mechanism and start even thousands of them without worrying about resource consumption. We'll for sure have to be more careful on how many "in progress" PipelineRuns will be started, but that's another story.
