---
title: "Automation is now made of markdown files"
date: "2026-06-26"
excerpt: "I built a set of AI skills for my daily workflows — filing Jira tickets, writing blog posts, searching past conversations. Here's why teaching your AI assistant how you work is the most useful thing you can automate right now."
tags: ["ai", "automation", "productivity", "claude"]
---

I have a confession to make. This blog post was written with the help of AI. But you already knew that, right? At this point we all assume everything is AI-generated, and honestly, most of the time we're right. I've become so overwhelmed with AI-generated text that I can barely stand reading Slack messages anymore. Everything sounds the same. Everything is polished the same way. You can spot it in the first sentence.

So here's my version of honesty: yes, AI assists my blog posts. But I still write the majority of them — the ideas, the structure, the opinions are mine. AI tweaks them, cleans up my grammar, and sometimes suggests better phrasing. I can live with that.

But I think I've taken it a step further. And this is what I actually want to talk about.

## automating myself out of a job

In my day-to-day job, we're actively working to turn all our workflows into agentic workflows. We've built [Claudio](/blog/claudio-intro), a containerized AI agent for DevOps automation. We're writing skills, designing pipelines, making AI do the repetitive parts of our jobs. Basically, some AI will do all of my work in six or seven months, and I'm the one writing it until I get laid off because I'm not needed anymore. Yes, I'm so smart.

Worst case scenario, I get laid off and go bake cakes full time — I bake great cakes, by the way. Best case scenario, I still keep my job to manage the infrastructure I've designed. Either way, at least the cakes will be good.

I always say: look at how good AI became in just a couple of years. Imagine what it could be doing in two more. Though some folks claim the steepest part of the curve already happened, and from here the improvements will be more incremental. We'll see. As always with AI, we can only speculate.

## if you do it twice, you're doing it wrong

Here's something I genuinely believe: if you need to do something more than once, you should automate it. This used to mean writing shell scripts, setting up cron jobs, building little tools. Now? Automation is made of markdown files.

I'm not being poetic. That's literally what it is. Claude Code has a skills system where you write a markdown file that describes a workflow, and the AI follows it. No SDK, no framework, no API to learn. You write instructions in plain text, and the AI executes them with the tools it has available.

So I built a set of personal skills for the things I do repeatedly. Here are some of the best examples worth mentioning:

## the skills

**Filing Jira tickets** — I probably create five to ten Jira tickets a week. Each one needs the right project, component, security level, epic link, and sometimes a sprint assignment. I was doing this manually every single time, filling in the same fields, remembering which custom field ID maps to which epic. Now I type `/file-jira A spike to investigate Redis caching options` and it creates the ticket with all the defaults I need. It handles the weird custom field for epic linking that our Jira instance requires — the kind of tribal knowledge that would take a new team member a week to figure out.

**Writing blog posts** — This is the meta one. I wrote a skill that knows my writing style. It knows I use first person, contractions, humor. It knows I don't write "In this blog post I will discuss" or "It's worth noting that." It knows I start with a personal hook, not a generic intro. It knows my headers are lowercase (How Annoying Is When AI Does This Thing). I taught it all of this by writing a detailed style guide as a markdown file, and now when I have rough notes from a conference or an idea I want to explore, I run the skill and get a draft that actually sounds like me. Not perfect — I still edit — but the starting point is genuinely not bad.

**Writing documents** — Similar to the blog post skill, but for work documents. Design proposals, technical specs, decision records. It follows our team's formatting, uses Red Hat branding, and outputs standalone HTML files.

**Sharing documents via S3** — Once I have a document, I need to share it. This skill uploads HTML files to an S3 bucket and generates presigned URLs that expire after seven days. Two commands wrapped into one skill. Before this, I'd open the AWS console, navigate to the bucket, upload, generate a link, copy it — the kind of thing that takes two minutes but feels like ten because of how many clicks are involved. Now it's one command and I get a link back.

**Searching past conversations** — This one I really like. Claude Code has a `--resume` flag that lets you pick up a previous conversation where you left off. The problem is finding the right one. When I think "I discussed this dashboard migration two weeks ago," I don't remember the session ID, and scrolling through a list of past sessions isn't great. So I built a skill called `recall` that searches through my conversation transcripts by topic, finds the matching session, and gives me the ID so I can resume it directly. It turns "I know we talked about this" into actually picking up where I left off.

**Reflecting on sessions** — At the end of a work session, I can run `reflect` and it reviews the conversation to decide what's worth persisting for future sessions. Did I correct Claude's behavior? Did I establish a preference? Did we make a decision that future me should know about? It saves those as memory files that get loaded into future conversations. I have to thank my colleague Jakub for this idea — he told me about his memory and reflect setup, and I just copied it for my own workflow. One of my superpowers — my husband calls it ninja cloning — is seeing something someone else does and immediately making it my own.

**Quarterly reviews** — Red Hat has quarterly performance reviews, and every time the questions are slightly different. I built a skill that pulls my closed Jira tickets for the quarter, combines them with any additional context I provide, and drafts responses in the right tone. It doesn't write fiction — it works with what I actually did. But it saves me from staring at a blank text box for an hour.

## why this actually matters

Here's the thing that I find interesting about all of this. The skills themselves are simple — most of them are just a markdown file with some instructions. The `file-jira` skill is basically "here are my defaults, here's how to handle the custom field, create the ticket." The `write-blog-post` skill is a style guide plus some structural rules. Nothing fancy.

But the compound effect is real. Each skill saves me maybe ten to fifteen minutes. Multiply that by how often I use them, and it adds up fast. More importantly, it removes friction. I'm more likely to file a Jira ticket if it takes ten seconds instead of two minutes. I'm more likely to write a blog post if I don't have to start from a blank page. I'm more likely to reflect on a session if it's one command instead of a deliberate journaling exercise.

The memory system is probably the most impactful part. Claude Code loads my memory files at the start of every conversation, so it knows my preferences, my corrections, my context — without me having to repeat myself. It knows not to use emojis in my blog posts. It knows my Jira instance has a weird custom field for epic links. It knows I prefer understated phrasing over dramatic declarations. Every correction I make gets saved, and I never have to make it again.

## the markdown revolution

I spent years learning to write Python scripts, Bash scripts, Ansible playbooks, Kubernetes manifests. All to automate things. And now the most effective automation I have is a collection of markdown files.

Is it perfect? No. The AI still makes mistakes, ignores instructions, hallucinates details. But writing a markdown skill that handles 80% of a task takes thirty minutes. Writing a script that handles 100% might take a day — and then you have to maintain it.

Now if you'll excuse me, I need to go check whether this blog post sounds like it was written by a human or by the skill I just told you about. The answer is both, and I think that's fine.
