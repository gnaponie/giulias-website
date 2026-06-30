---
title: "The skill development loop, or how I spent a week arguing with markdown"
date: "2026-06-30"
excerpt: "Building AI agent skills sounds simple — write some instructions, let the agent do the work. In practice, it's an endless loop of tweaking, testing, and wondering if 'good enough' actually exists."
tags: ["ai", "automation", "claude", "developer-experience"]
---

I've spent the last week writing AI skills — for work, for personal projects, for Claude Code. And I need to vent, because nobody warned me that the hardest part of building AI agents isn't the infrastructure or the tooling. It's the skills. The markdown files. You're literally just writing text — it's supposed to be like explaining something to a friend. And yet somehow it's not.

## the loop

Here's what skill development actually looks like in practice.

You write a SKILL.md file. It's clear, it's structured, it covers the main use case. You test it. The agent does something unexpected. So you add more instructions. You test again. Now it handles that case, but it broke something else that was working before. You adjust. You test. You find another edge case. You adjust. You test.

Every skill I built this week felt like it was 80% done in the first hour and then took four more hours to get to something I could actually ship. And even then, there's no clear finish line — the agent might follow your instructions perfectly nine times and then do something completely different on the tenth run. Same input, different behavior. You can't unit-test vibes.

## why it happens

I've been thinking about why this is so frustrating, and I think it comes down to a few things:

- **There's no contract.** When I write a Python function, I know what it takes and what it returns. A skill is natural language instructions for a probabilistic system. The "contract" is whatever the LLM decides it means today. Sometimes it interprets "always check the API first" as "check the API first unless you think you already know the answer." Thanks for the initiative, but no.
- **The whack-a-mole effect.** Adding a rule to handle edge case A changes how the agent processes everything else. More instructions don't always mean better behavior — sometimes they make it worse.
- **Diminishing returns.** The first draft takes thirty minutes and handles the happy path. Getting it to handle edge cases takes hours. At some point you realize you're spending more time on the skill than you would have spent just doing the task manually for the next six months.
- **The feedback loop is slow.** Change the skill, re-run the agent, wait, observe, figure out what went wrong, repeat. And when it goes wrong, the failure mode is "it did something plausible but incorrect" rather than a clear error message.

## what actually helps

After a week of this, here's what I wish someone had told me before I started:

- **Push logic into scripts, not prompts.** If something can be a Python script or a shell script, make it a script. Scripts are deterministic, testable, and don't decide to interpret your instructions creatively at 3 PM on a Thursday. Let the agent orchestrate — the mechanical parts should be code.
- **Define "good enough" before you start.** Before touching the SKILL.md, decide what "done" looks like. If it handles the main use case and the two most common edge cases, ship it. Don't chase perfection in a probabilistic system.
- **Design for graceful failure.** A bad run that produces no output is better than a bad run that posts garbage. Make sure the failure mode is "nothing happens" rather than "wrong thing happens."
- **Time-box the polishing.** If it works nine out of ten times, ship it and fix the tenth case when you actually see it in production. Real failures teach you more than hypothetical ones.
- **Accept the nature of the thing.** We're trained as engineers to make things deterministic, repeatable, predictable. AI skills are none of those things. It's a different kind of development, and it requires a different definition of "done."

## is it worth it?

Yes. The skills I built this week are already saving time, and they're not perfect but they work well enough to be valuable. The frustration isn't with the concept — it's with the gap between how easy it looks ("just write some markdown!") and how it actually feels in practice.

We'll get there. In the meantime, I'll keep writing markdown files and arguing with an AI about what "always" means.
