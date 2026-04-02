---
title: "How to solve \"Failed to find exact match for batch/v1beta1.CronJob\""
date: "2024-02-08"
excerpt: "A quick fix for the CronJob apiVersion mismatch on OpenShift and Kubernetes."
tags: ["ci/cd"]
---

I was trying to set up a cron job to run my Tekton pipeline (in OpenShift — so this might apply to you even if you're working with Kubernetes, since OpenShift is based on that), and I got this error:

```
Failed to find exact match for batch/v1beta1.CronJob by [kind, name, singularName, shortNames]
```

Googling a bit it was clear that there was some problem with the Kubernetes cluster version, and that the definition was wrong. But I didn't seem to be able to find the problem.

That was part of my definition:

```yaml
kind: CronJob
apiVersion: batch/v1beta1.CronJob
metadata:
  name: name-{{ env }}
  labels:
    env: "{{ env }}"
```

But it didn't work. It looked fine to me. Here's how to solve it.

There was something wrong specifically with `batch/v1beta1.CronJob`. But how to find out which one was the correct `apiVersion`? Here's the command you can use (you'll have to login to your OpenShift cluster first):

```bash
oc api-resources | less
```

This will give you a similar list (that is so much bigger, so that's why we added `| less`, so you could easily search what you need):

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

Now you can look for `CronJob` and it will tell you the `apiVersion` that you're supposed to be using, which in my case was `batch/v1`. So in the end that's the final configuration:

```yaml
kind: CronJob
apiVersion: batch/v1
metadata:
  name: name-{{ env }}
  labels:
    env: "{{ env }}"
```

Of course this applies to whatever type of "kind" — `oc api-resources` is your friend whenever you're unsure about the right API version for any resource.

I hope this helps!
