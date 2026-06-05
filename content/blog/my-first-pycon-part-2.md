---
title: "My first PyCon — Part 2: agentic workflows and some real talk"
date: "2026-06-05"
excerpt: "The agentic workflow talks at PyCon Italia ranged from 'we already do this' to 'finally, something new.' Here's what stood out — and what didn't."
tags: ["python", "ai", "conferences"]
---

This is part two of my PyCon Italia 2026 series. [Part 1](/blog/my-first-pycon) covered the overall conference impressions and the opening keynote. Now let's talk about the talks — specifically the ones about agentic workflows, which were a big theme this year.

I'll be honest: agentic workflows were everywhere at PyCon, and most of the talks didn't surprise me. What we've built with [Claudio](https://github.com/aipcc-cicd/claudio) (our containerized AI agent — I wrote about it [here](/blog/claudio-intro)) already follows these patterns, and in many cases goes further. But that doesn't mean there was nothing to take home. Some talks confirmed we're on the right track, a couple introduced tools I hadn't tried yet, and the Saturday sessions finally delivered the depth I was looking for.

## The agent reliability talks

Two talks focused on making agents more reliable. The content was largely overlapping, but together they painted a reasonable picture of where the community stands.

### "Most AI Agents Are Broken. Let's Fix That"

This talk was from Bilge Yücel. She started with the agent harness — the core loop where an agent reasons, acts, observes, and repeats — and then walked through common failures in agentic workflows.

She walked through common failures in agentic workflows:

- **Too many tools** — giving the agent too many tools fills up the context window fast and leads to hallucinations. The model doesn't know what to do, so it guesses.
- **No fallback plans** — failures go unnoticed, nobody knows something went wrong.
- **No guardrails** — the agent can run destructive or hallucinated commands unchecked.
- **Wrong use case** — sometimes AI is overkill and a script would be simpler and more reliable.

All of this was pretty obvious to me, because these are problems we've already hit and solved with Claudio. We mostly stopped relying on MCPs for tool discovery because they bloat the context with tool schemas the agent may never need. Instead, our skills system gives the agent a curated set of capabilities per task — markdown instructions plus pre-written scripts — so the context stays focused and the agent knows exactly what's available.

For fallbacks, every Claudio skill that runs unattended posts to Slack on failure, so we always know when something went wrong. And guardrails are baked into the skills themselves: the AI decides *what* to do, but the actual execution happens through scripts we've tested, so it can't accidentally run a destructive command or hallucinate a kubectl invocation.

On the wrong use case point — fair enough, when the pattern is fully predictable, a pipeline is simpler. But I think we've landed on something smarter with Claudio: we lock down in code the sensitive parts and the parts that don't need AI, but we still let the agent be the main reasoning engine and orchestrator. You get the reliability of scripts where it matters and the flexibility of AI where it adds value.

The speaker mentioned [Haystack](https://haystack.deepset.ai/), an open-source orchestration framework I hadn't used before — worth a look. And [Langfuse](https://langfuse.com/) for observability, to inspect which calls the agent made. But one thing that didn't quite resonate with me: this kind of observability isn't automated. The whole point of an agentic workflow is to remove or minimize the human in the loop. If you then need someone to manually go through traces to check what calls were made... you've just shifted the bottleneck. I'd love to see more recommendations for tools that provide automated observability — alerts when things drift, anomaly detection, that kind of thing.

The tips at the end were multi-agent systems, overseeing what agents do, and observability. Solid advice, and probably exactly what most of the audience needed — given that only 10% of attendees were using agents in production, this kind of foundational talk makes a lot of sense. I just happened to be looking for something more advanced.

### "Agents reporting for duty! An (in)complete guide to LLM agents and their limits"

This talk was from Tommaso Radicioni. It was a bit more practical, but the content was mostly the same. It explained the difference between an LLM and an agent (the loop, again), and that reflection is the simplest form of that loop. In a reflection pattern, you have two roles: a *generator* that produces the initial output, and a *reflector* that evaluates it — checking for errors, suggesting improvements, or deciding whether the result is good enough. The agent loops between the two until the reflector is satisfied or a limit is reached.

The speaker showed how he implemented the loop with a `MAX_STEPS` counter to prevent infinite runs. Simple and effective.

He mentioned the ReAct pattern — Reasoning + Acting (yes, the name is confusing given the existence of a certain JavaScript framework). ReAct follows a thought → action → observation cycle: the agent reasons about what to do, takes an action, observes the result, and repeats. It's one of the more widely adopted patterns for tool-using agents.

He showed a demo of a GitHub assistant, and two things stood out to me: he still had a human in the loop for most decisions, and the agent had too many tools attached, which filled up the context. Same problems as the first talk.

He also mentioned multi-agent architectures — dividing problems into subproblems where each sub-agent has its own chain of thought, and how you can use different models for different agents based on privacy requirements, token consumption, and latency. Practical, but not exactly new territory.

At least when he got to observability (yes, again), he mentioned some concrete tools. This was the most useful part — an actual list I can go through and evaluate:

| Category | Tools |
|---|---|
| **Evals** | [RAGAS](https://docs.ragas.io/), [Braintrust](https://www.braintrust.dev/) |
| **Monitoring** | [Galileo](https://www.rungalileo.io/) |
| **Tracing** | OpenTelemetry + GenAI semantic conventions |
| **Open-source backends** | Langfuse, Arize Phoenix |
| **ML platform** | Weights & Biases Weave |

Overall, a well-structured talk and a good introduction to the topic. If you're just getting started with agents, this would give you a solid foundation. For those of us already running agents in production, the content wasn't new — but the tooling references at the end made it worth attending.

## The Saturday talks (finally)

And then came Saturday, and the quality shifted. Two talks that actually said something new, were deeply practical, and reminded me why I was at a Python conference.

### "Durable Agents: long running AI workflows in a flakey world"

This was the Saturday keynote from Samuel Colvin, the founder of Pydantic. And it was genuinely interesting.

He started by introducing [Monty](https://monty.com/): an isolated Python interpreter designed for AI agents in the cloud. The idea is that instead of giving an agent a dozen tools, you give it two: `run_code` and `find_tools`. The agent writes Python to accomplish what it needs, which uses fewer tokens and runs faster than chaining tool calls. There's even a challenge called [hackmonty](https://hackmonty.com/) where they'll pay you $10k if you can find vulnerabilities in it. The competitive person in me already started thinking about when I can find time for that — not just for the money (I mean... yes), but mostly for the fun of it. I'm really competitive.

Then he moved to what made the talk stand out: durable execution. This was the first time anyone at PyCon mentioned it, and it's a genuinely important concept for production agents. When an agent runs a long workflow — minutes, hours, maybe even days — things will go wrong. Network failures, timeouts, model API outages. Durable execution means the workflow can survive these failures: it persists its state, so it can resume from where it left off rather than starting over.

His key points for reliable AI agents:

- **Durable execution** — persist state so workflows survive failures and can resume mid-run
- **Structured output** — Pydantic can enforce typed, validated JSON responses from the model
- **Observability** — he mentioned [Logfire](https://pydantic.dev/logfire), Pydantic's tracing library, which gives you a trace of individual runs
- **Evals** — both offline (before deployment) and online (monitoring how the agent behaves in production)
- **Continuous learning** — agents that improve over time based on what they encounter

Structured output wasn't new to me — I've been doing this with [toon](https://github.com/toon-format/toon) for some of my agentic log analysis. But he made a strong case for why type safety is essential here: when an agent's output feeds into downstream code or another agent, a malformed response doesn't just look ugly — it breaks the pipeline silently. Type validation at the boundary catches these failures early instead of letting them propagate.

Then he got into Pydantic AI's temporal agent type, which gives you a deterministic workflow. The practical advantages are significant: you can resume a workflow from the middle of a run, get automatic retries on transient failures, and even sleep a workflow for extended periods — days or weeks — and pick it back up later.

He made an interesting argument against graph-based workflow definitions. His point: when you have parallel nodes that need to combine results, you want proper typing across the steps. In a graph structure, data typically flows through untyped dictionaries, and there's no way to enforce type safety at the boundaries between nodes. With a code-first approach using a library like Pydantic AI, you get the full type system working for you. Whether you agree or not, it's a coherent position.

He acknowledged himself that the talk looked a bit like a product pitch for Pydantic. But honestly? What he described is a real set of problems, and he showed a coherent way to solve them. If the tools happen to be the ones he built, that's fine. Any good library for durable agent execution would need to address the same things. He shared his [talk materials](https://github.com/pydantic/talks/tree/main/2026-05-pycon-italy) for anyone who wants to dig deeper.

### "AI Frameworks Are Making You Worse"

This one was from Silvano Cerza, and it was exactly what I needed after two and a half days of framework recommendations.

His entire point was simple and refreshing: AI frameworks like LangChain, LlamaIndex, Pydantic AI, Haystack... you can use them (and sometimes pay for them), or you can just reproduce what they do with a small Python snippet. That's all they're doing under the hood. You can achieve the same thing with basic Python libraries like `requests`.

It's hard to summarize the talk because it was full of live coding examples — very hands-on, very practical. But his argument was convincing: you don't need to reinvent the wheel for things like Python itself or Django. Those are genuinely complex. But for AI frameworks that claim to do magic when they're really just wrapping a few API calls? You can write that yourself in a few lines and actually understand what's happening.

I'd suggest checking his [talk codebase](https://github.com/silvanocerza/pycon_it_2026) to see the examples for yourself.

This talk was refreshing. Finally something technical, honest, and actually about Python. Which is not a given — a lot of the AI talks at PyCon don't even mention Python. They just submit to PyCon because Python is the most used language in AI. This was a real Python talk, and I loved it.

### "FeatureOps: Designing for Failure and Speed in Agentic AI Workflows"

The last talk I want to mention was from Alex Casalboni (who I kind of knew already). It wasn't rocket science, but I liked how it was presented and it gave some useful technical insights.

He started with a premise I agree with: AI code assistants are introducing bugs, and failures are now expected. To everyone who complains that AI just introduces bugs that "real engineers" will have to fix — I think the industry doesn't care about that anymore. It's become cheaper and faster to introduce bugs and fix them than to do everything perfectly from the start. That's just something AI has changed about the economics of software development.

So, accepting that failures are the new standard, he proposed different layers of protection:

- **L1: Model safety** — usually handled by the model provider
- **L2: Sandboxing** — on you
- **L3: CI/CD protection** — mostly managed by your CI/CD tools
- **L4: Runtime control** — on you

He focused on L2 and L4, the ones that are currently your responsibility.

For **sandboxing (L2)**, he outlined three approaches:

| Approach | How it works | Our experience |
|---|---|---|
| **Linux Landlock v3** | Kernel-level sandboxing — restricts what a process can access | — |
| **Container isolation** | Agent runs in a container, blast radius is contained | This is what we do with Claudio |
| **Remote execution** | Run on a remote cluster, protect your local machine — though it doesn't protect the repo if it's connected | We do this too (Claudio on OpenShift) |

For **runtime control (L4)**, the questions are: *who* gets access, *when*, and what happens *when something breaks*? Can you limit exposure to beta users or internal teams first? Can you do gradual rollouts? Can you toggle features on and off in production? He made the distinction between a technical release and a business release — one is deploying, the other is making it available to customers. This applies less to what I do day-to-day, but I can see how it matters for customer-facing AI features.

For handling failures: rollbacks, circuit breakers that trigger automatically when metrics drift, and feature flags to control exposure without redeploying. He then mentioned [Unleash](https://www.getunleash.io/), the open-source feature flag platform where he works — another product pitch, but a good one, and the tool is genuinely useful for this kind of thing.

## What I'm taking home

PyCon's agentic workflow talks gave me a clear picture of where the broader Python community stands with AI agents. The fundamentals are solid — everyone agrees on the importance of structured output, guardrails, and not blindly trusting models. But a lot of it still feels early. The gap between "here are the principles" and "here's how you actually do it in production" is still wide.

What I'm actually taking home: a list of tools to evaluate (Haystack, Langfuse, RAGAS, Braintrust, Logfire, Unleash), the concept of durable execution which I want to explore further, and the reinforcement that sometimes the best AI framework is no framework at all — just Python doing what Python does best.

And the confirmation that what we've built with Claudio isn't just functional — it's ahead of where most of the industry is right now. That feels good. And a little scary, because it means there aren't many people to learn from. We're figuring it out as we go.

Next time, maybe I'll be the one on stage talking about it.
