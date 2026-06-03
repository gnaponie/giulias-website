---
title: "My first PyCon — Part 1: the conference and the keynote"
date: "2026-06-03"
excerpt: "I finally attended PyCon Italia after all these years. Some talks I really liked, some made me realize how much I still need to learn, and the women I met were simply brilliant."
tags: ["python", "ai", "diversity", "conferences"]
---

I've just attended PyCon Italia 2026. It was May 28–30, in Bologna. And after all these years working in Python — I always joke that Python is my longest relationship and we're still very much in love — this was my first PyCon. Participating felt exciting, almost overdue.

But I'll be honest: after the first two days, I had mixed feelings.

## The bubble effect

Here's the thing. Working at a company like Red Hat pushes you to the edge of certain things. You're part of one of the few organizations that implement technologies before the rest of the industry catches up. So when you sit in a talk where the speaker explains what MCPs are, in 2026, or presents RAG as something innovative, or talks about agentic workflows and you think "we've been doing this for months"... it puts things into perspective.

When a speaker asked the audience how many people use agents in production, only about 10% raised their hands. AI moves so fast that often by the time a conference arrives, the talk you submitted is already outdated. I don't mean to be presumptuous — but it did make me realize how advanced our AI org at Red Hat actually is. In fact, it gave me the push to submit another talk at a conference, specifically about our agentic workflow.

But here's the flip side: when it comes to machine learning, data science, and the fundamentals underneath all of this, I'm behind. If the industry is heading deeper into ML — and it clearly is — I need to speed up. I had already started studying these topics, but attending these talks gave me the final push to realize how much more practical experience I need.

## Saturday saved the conference

Luckily, on Saturday I had the chance to attend some more practical, hands-on talks from genuinely talented people. Not that all talks on Thursday and Friday were bad — a couple really grabbed my attention — but the Saturday sessions hit differently. Overall, I met some really nice people and it was an extremely pleasant experience.

## The women

One thing that pleasantly surprised me was the number of women I met. I had the chance to talk with some of them and listen to their talks. And here's what was striking: every single one of them was brilliant. Which, don't get me wrong, isn't a bad thing. But I think it confirms something I've been feeling for a long time. A woman in this industry has to work harder just to stay. Either you work double compared to your male colleagues and become a top engineer, or the industry will quietly cut you off. That doesn't happen to men — at least not at the same rate. The ones who survive are exceptional, because they had to be.

The organizers shared the numbers at the beginning of the conference: 19% of attendees were women. Still not a great number. But looking around, it somehow felt like more than usual. Maybe because the more senior you get, the fewer women you see, and your baseline shifts. When the bar is low, 19% starts to feel like progress.

## The keynote: open-source multimodal AI

The first keynote was from Merve Noyan, an engineer at Hugging Face, and it was about open-source multimodal AI. She was one clear example of an extremely talented engineer. At times I didn't agree with everything she said, but you could feel both the passion and the deep experience behind every slide.

Her core argument was that using open-source models is better because of control, cost reduction, customization, and privacy. And look — I'm a lifelong open-source contributor and evangelist. It's been a core value throughout my entire career. But I found myself questioning this, at least in the AI space. Maybe I'm biased because working at a big corporation gives me access to the most powerful proprietary models at no personal cost. But with models like Claude and GPT-4 available, some even at reasonable prices, does it really make sense to default to less powerful open-source alternatives?

Maybe I'm missing the point. Maybe I'm losing my open-source values. Or maybe that *is* the point — we should use and contribute to open-source models precisely so they can become technically competitive, the way open-source software became the default for everything else. I'm still wrestling with this one.

She mentioned the [Artificial Analysis index](https://artificialanalysis.ai/), which is an independent benchmarking platform that evaluates AI models across quality, speed, and price — a useful resource if you're comparing models and want data that isn't coming from the model providers themselves.

### Multimodality and Vision Language Models

Then she explained multimodality: a model that can process more than one type of input — text, images, audio, video — rather than being limited to just text. A multimodal model can, for example, look at an image and answer questions about it in natural language, or transcribe audio while understanding the visual context of a video.

From there, she focused on Vision Language Models (VLMs) — models that take images and text as input and produce text as output. She walked through a brief history:

- **January 2021** — CLIP by OpenAI, the first major multimodal model connecting images and text
- **April 2022** — Flamingo by Google DeepMind, which could handle few-shot visual reasoning
- **April 2023** — LLaVA by Microsoft, a lightweight approach to visual instruction tuning

Then came models like Sonnet and GPT-4o, and the trajectory became clear: VLMs are essentially becoming the new LLMs. Multimodality isn't a feature anymore — it's the baseline.

She dove into LLaVA's architecture, which uses a projection layer — essentially a bridge that maps visual features from an image encoder into the same space the language model understands, allowing it to "see." She also mentioned SmolVLM, Hugging Face's own small but capable vision-language model designed to be efficient enough to run on consumer hardware.

### Object detection, segmentation, and a word of caution

She showed how these models handle object detection: when you ask a VLM to locate something in an image, the output includes location tokens — coordinates that identify where the object is. But her advice was clear: don't deploy these models in production for object detection. They're large, costly, and still not reliable enough for that kind of use case.

She also talked about SAM 2 (Segment Anything Model 2) by Meta — a segmentation model that can identify and isolate any object in an image or video, essentially drawing precise boundaries around things without needing task-specific training.

### Her open-source model recommendations

This was genuinely useful. She grouped models by use case:

- **Swiss army knives**: Qwen 2.5, Kimi-K2, GLM-4V, Gemma 4 (multimodal with tool-calling)
- **Small yet mighty**: Moondream 2, LFM-2.5-VL
- **Tiny**: Florence-2
- **Document/OCR**: Chandojra-OCR-2, OlmOCR 2, PaddleOCR-VL
- **GUI models**: UI-TARS
- **Any-to-any**: Nemotron-Omni, Gemma 4, Qwen 2.5-Omni

The trend is obvious: almost all LLMs ship multimodal these days.

She also mentioned OLM-OCR-Bench, a new benchmarking feature on Hugging Face for evaluating OCR models — worth keeping an eye on.

### Video, document retrieval, and the "RAG is old" argument

On video understanding, she pointed out something interesting: most models don't actually process video as video. They sample frames as images and ignore the audio entirely. It's not truly multimodal video processing — it's a series of image analyses stitched together.

Then she talked about document retrieval models as a more modern approach, an evolution beyond traditional RAG (Retrieval-Augmented Generation). In classic RAG, you chunk a document into text, create embeddings, and retrieve relevant pieces. But document retrieval models — what she called "ColPali-style" approaches — work directly on the visual representation of documents. Instead of parsing text out of a PDF and losing the layout, tables, and formatting, the model looks at the document as an image and retrieves information visually. She argued this is where things are headed, and that traditional text-based RAG is becoming outdated for document use cases.

She mentioned single-vector models like DSE (Document Screenshot Embedding), which creates one embedding per document screenshot, and MCDSE (Multi-Channel DSE), which generates multiple embeddings per page to capture more visual detail. Both avoid the brittle text-extraction step that makes traditional RAG pipelines so fragile.

### Training and running models

The talk also covered the practical side of working with these models. For fine-tuning, there's TRL (Transformer Reinforcement Learning) — Hugging Face's library for training language models with reinforcement learning from human feedback. And more recently, HuggingFace Skills as a newer approach to model training (apparently before that it was all just TensorFlow).

Then there's quantization, which is one of those things I keep hearing about but hadn't fully understood until now. The idea is simple: you reduce a model's numerical precision — say from 32-bit to 8-bit or even 4-bit — to make it smaller and faster to run. You lose a bit of accuracy, but the trade-off is often worth it, especially if you want to run something locally without a beefy GPU. PyTorch's torchao handles this, and you can do it directly from Hugging Face.

And for actually serving models locally, llama.cpp is the way to go — a couple of commands through the Hugging Face integration and you're running a model on your own machine.

### The Hugging Face pitch (and that's fine)

I'll admit, at the end the talk was heavy on Hugging Face features. It was a bit of a product pitch. But honestly? That's understandable. Hugging Face is a genuinely great tool used massively across the industry, and the features she highlighted were legitimately useful. Sometimes a pitch is just someone showing you tools that actually work.

In the end, I really liked the talk.

## What's next

This is part one of a small series about my PyCon experience. I wanted to start with the overall impressions — the mixed feelings, the women, and the opening keynote, which felt like a natural first topic to give some space to. In the next posts, I'll go through the other talks that impressed me and the things I learned along the way.

Stay tuned. Python and I are still very much in love, and there's more to tell.
