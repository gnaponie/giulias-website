---
title: "My first PyCon — Part 3: the talks that reminded me why I love Python"
date: "2026-06-24"
excerpt: "The final PyCon Italia post. Local photo search with CLIP, CPython's performance evolution, why temperature zero still hallucinates, an AI installation about gender discrimination, and Python packaging explained properly."
tags: ["python", "ai", "ml", "conferences"]
---

With a bit of delay, here's the third and last blog post about my PyCon Italia 2026 experience. In [part 1](/blog/my-first-pycon) I talked about the conference overall, the brilliant women I met, and Merve Noyan's keynote on open-source multimodal AI. In [part 2](/blog/my-first-pycon-part-2) I went through the agentic workflow talks — some familiar, some genuinely new. This time it's a mix of everything else that caught my attention: ML, CPython internals, an art installation, career advice, and Python packaging. Different topics, but that's kind of the point. The best part of a conference like PyCon is that you walk into a talk about something you didn't plan to care about and walk out thinking about it for days.

## the photo gallery talk that made me want to go home and build something

This one was from Daniele Giunta: "Your Photo Gallery, but Smarter: A Local-First Semantic Image Search System That Runs on Your Laptop." And it was exactly my kind of talk — practical, hands-on, the kind where someone built a thing for fun and you learn a lot just by watching them explain the mistakes they made along the way.

The idea: he built a local photo search and categorization system using open-source models. No cloud, no Google Photos, no Amazon — everything runs on your machine. This hit close to home because I keep all my kids' photos on a NAS precisely because I don't want to hand them over to Big Tech. But the trade-off has always been terrible categorization and search. You end up scrolling through thousands of photos because there's no smart way to find what you're looking for.

His system changes that. Here's how it works at a high level:

Photos get converted to vectors using [CLIP](https://openai.com/research/clip) — OpenAI's model that maps both text and images into the same vector space (512 dimensions). Once everything is vectorized, you can search by natural language ("photos at the beach") or even by providing another image as a query.

For the actual similarity search, he used [FAISS](https://github.com/facebookresearch/faiss) (Facebook AI Similarity Search), specifically `IndexFlatIP` with normalized vectors for inner product similarity. He also needed `IndexIDMap` to bridge between FAISS's internal IDs and the actual file paths on disk — without it, adding and deleting vectors doesn't work properly.

The clustering part was clever too. To go from a chaotic photo dump to organized groups, he used a pipeline inspired by [BERTopic](https://maartengr.github.io/BERTopic/): CLIP for embeddings, then UMAP for dimensionality reduction (compressing the high-dimensional vectors into something more manageable), then HDBSCAN for the actual clustering, and finally BLIP + Ollama to automatically generate labels for each cluster. So you don't just get groups — you get named groups, like "beach vacation" or "birthday party."

He shared the [full codebase](https://github.com/Eleinad/talks/tree/main/pycon_2026/code), and honestly? I'm tempted to run this on my NAS. The idea of being able to search my family photos with natural language while keeping everything local and private is exactly the kind of thing I want to build.

## CPython performance: older than me, faster than ever

The day two keynote was from Diego Russo from ARM: "From 'Fast Enough' to 'Fast by Design': The Evolution of CPython Performance." Not an AI talk, but at a Python conference it was nice to just hear about Python for a change.

One quote stuck with me: "The programmer's time is more important than the computer time." That was the philosophy when Python started back in 1991 — I wasn't even born yet. Back then, Python was mainly for scripting and automation, running on single-core CPUs with limited memory. The design principles were simple: easy to read, easy to change, easy to understand. And they worked.

But the world changed. Python is now used for everything from infrastructure to AI pipelines, and modern CPUs have completely changed the rules. It's less about raw CPU speed now and more about memory and how you use it.

He broke down where CPython spends its time:

- **JIT**: 17.99% — the majority
- **Memory**: 12.67% — for various reasons
- **Too much work at runtime** — the interpreter keeps repeating the same operations that could be resolved earlier

The key insight is that CPython 3.11 brought massive performance improvements by adapting the interpreter — not interpreting everything the same way every time. The idea is to move work earlier, before execution, rather than doing it during runtime.

He also touched on concurrency and the GIL (Global Interpreter Lock), which is part of the performance story too, especially with the ongoing work on free-threaded Python.

I was more interested in AI talks at PyCon, but the keynotes were a good opportunity to learn about Python itself. And this one gave me perspective on things I simply didn't know because Python is much older than my career. It was nice to understand the history behind the language I've been using for so long.

## the zero-temperature lie

This was from Valeria Zuccoli: "The Zero-Temperature Lie: Why Your Deterministic LLM is Still Hallucinating Randomness." And once again — a brilliant woman explaining complex concepts with clarity and confidence.

The premise: she asked GPT the same question multiple times, with temperature set to zero and greedy decoding. And she still got different answers. Wait, what?

Quick background: temperature is a sampling parameter in LLMs. At temperature 1 (the default), the model picks tokens based on their probability distribution — more creative, more varied. At temperature 0, it should always pick the highest-probability token. Deterministic. Predictable. Except... it's not.

She referenced a paper showing 15% difference in accuracy between 10 diverse runs across 5 different models, even with temperature set to zero. So what's going on?

Three culprits:

1. **Floating-point operations** — GPU calculations involve approximations when summing numbers, and these tiny rounding differences can cascade
2. **Parallel operations** — vectors get processed across different cores, and the order of operations isn't always the same, which affects the floating-point results
3. **Request batching** — and this is the big one. There isn't just your request on the GPU. There are other users' requests being batched together, which changes the computation layout

So even if the model itself is deterministic, the infrastructure serving it introduces non-determinism through other users' requests sharing the same hardware.

She mentioned some solutions: [vLLM](https://github.com/vllm-project/vllm) has batch-invariant kernels, and PyTorch offers `use_deterministic_algorithms` to force deterministic behavior (at a performance cost). But the takeaway was clear: if you're relying on temperature zero for reproducibility, you're building on a lie.

This was genuinely one of my favourite talks. As someone who's been working with AI agents and assuming certain behaviors about model outputs, understanding why "deterministic" doesn't actually mean deterministic is important. And it was explained beautifully.

## the art installation about gender discrimination

"Not For Her: Orchestrating Generative AI for an Interactive Installation on Gender Equality" from Lorenzo Bisi. I'll be honest — the speaker was a bit nervous, maybe a language barrier thing, but he was clearly smart and the talk was genuinely fascinating.

The concept: an interactive installation shown at the Triennale in Milan where visitors experienced a simulated job interview through digital avatars. You walk in as "Sofia," sit in front of a screen, and have a conversation with AI-generated interviewers who gradually introduce gender discrimination into the questions — maternal expectations, family life assumptions, the kind of thing women deal with in real interviews all the time.

The technical architecture was interesting. They used a dedicated PC with CPU for real-time local inference, a big screen with pre-recorded avatar visuals, and microphone + camera input that communicated with a remote server. ResNet handled facial recognition and emotion detection — the system adapted the discrimination themes based on the visitor's emotional responses, making the experience uncomfortably personal.

The hardest part? Getting an LLM to discriminate. LLMs are trained specifically *not* to discriminate, so they had to work around the guardrails. They tried several approaches:

- **LLM + finite state machine** to map all possible conversation paths — too difficult to maintain
- **Speech model** — discarded because it was too hard to control
- **Small local models** — a year ago they weren't good enough for natural conversation

They ended up using GPT-4.1's API with carefully crafted prompts. The conversation was driven by a finite state machine with two types of states: single-turn states (one interaction) and dialogue states (multiple turns to reach a goal). [Ready Player Me](https://readyplayer.me/) provided the humanoid avatar framework.

The numbers were impressive: 3,111 experiences, 77 nationalities, majority aged 25–35 but some older visitors too. Six months of operation with no downtime.

I had a nice conversation with the speaker afterwards, and what struck me was how his own understanding of gender discrimination evolved through building this. He hadn't fully appreciated how differently women and men experience and internalize these biases until he saw visitors react to the installation. That's the kind of thing technology should do — make you feel something you couldn't understand from the outside.

I'm sad I missed the actual exposition. I would have loved to experience it.

## the career talk that gave me hope

"You're Not Starting Over: Lessons from Changing Roles in AI" from Reyha Verma from Amazon. It was a nice talk, more inspirational than technical, about how she changed careers multiple times and how to adapt in this AI era where none of us are entirely sure we'll get to keep our jobs.

Her main point: the skills you built in the past will be useful in the future. How you think is your seniority, not what you know. And it's true. The soft skills, the experience, the analytical way I approach problems — that's what makes me different from someone who just learned to code yesterday, regardless of how good their AI assistant is.

Maybe I didn't learn anything technically new, but it gave me hope. And seeing another experienced female engineer on stage always makes me feel a bit more "we can do it." That never gets old.

## Python packaging, explained properly

Last one: "Everything You Always Wanted to Know About Python Packaging (but Were Afraid to Ask)" from Luca Mancusi. Entry level, and I probably knew most of it already. But since my team builds wheels and I've maintained Python packages in the past, it was a nice refresher — especially because the speaker was very precise about the little details and the *why* behind each nitpick.

The key concepts, for anyone who's ever been confused by Python packaging (so... everyone):

- A **module** is the basic unit — a `.py` file
- A **distribution** is what you install: either a **source distribution** (sdist, `.tar.gz`, not platform-specific) or a **built distribution** (wheel, `.whl`, potentially platform-specific)
- If no compatible wheel exists for your platform, pip builds one from the sdist
- The **build backend** (setuptools, uv) turns source into distribution artifacts; the **build frontend** (pip, uv, poetry) is the tool you run — they interact through the PEP 517 standard
- Everything lives in `pyproject.toml` now, with three main tables: `[project]` for metadata, `[build-system]` for backend declaration, and `[tool.*]` for tool-specific settings

He presented well. Clean, precise, no fluff. The kind of talk that makes you realize how much tribal knowledge exists in something as fundamental as packaging.

## looking back

After two or three weeks of writing these blog posts, I must admit I underestimated this conference. When I left Bologna after those first two days, I wasn't sure it had been worth it. But after a few weeks of thinking about it, writing these posts, and going back through my notes — I realized just how many great talks there were. And the fact that some of the agentic stuff felt too basic for me? That's not a criticism of the conference. It just means I can be part of shaping this space instead of just adopting what's already out there.

PyCon Italia 2026, you were better than I expected. Python and I? Still going strong.
