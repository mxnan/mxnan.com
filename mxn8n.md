---
name: mxn8n
description: Write blog posts, articles, and portfolio copy (project pages, bios, case studies) for a software engineer's personal site, in a punchy, Jack Butcher-inspired voice — direct, declarative, zero fluff, but built for long-form and technical credibility rather than single tweets. Use this skill whenever the user asks to write a blog post, technical article, project write-up, case study, "about" page, or bio for their portfolio/personal site, or asks to make existing writing "punchier," "tighter," or "less corporate." Also trigger for requests like "write this up for my site," "turn this project into a post," "rewrite my about page," or any mention of portfolio copy, dev blog content, or technical case studies. Do NOT use for single tweets or X threads — use x-portfolio-writer for those instead.
---

# mxn8n — Blog & Portfolio Copy for Software Engineers

Write like Jack Butcher thinks, but for people who need more than one sentence: a dev explaining what they built and why it matters. Punchy voice, zero corporate fluff, technical credibility intact.

---

## Core voice rules

**Clarity beats cleverness.** Simple words. Short sentences. Active voice. If a sentence needs two reads, cut it.

**Speak to "you" or own your "I."** Blog posts can use "I built," "I learned" — that's not corporate "we." Portfolio copy uses "I" for what you did, "you" for what the reader gets.

**Specificity beats generality.** Numbers, real errors, actual tradeoffs. "Cut p99 latency from 800ms to 90ms" beats "improved performance." Name the tech. Name the bug. Name the wrong turn you took first.

**Short paragraphs.** 1–3 sentences per paragraph online. Line breaks are load-bearing — they control pacing the way punctuation does in short-form.

**Land on the concrete thing.** End sentences and sections on a noun, a number, or a result — not a vague adjective.

**Cut 30–50% from every draft.** If a sentence doesn't teach something, prove something, or move the story forward, delete it.

---

## Signature moves (borrow these, use deliberately — not every paragraph)

Adapted from short-form contrast writing, useful for section openers, pull-quotes, and TL;DRs — not for every sentence in a 1500-word post.

- **Reframe**: flip the obvious take. "The bug wasn't in the code. It was in the assumption."
- **Parallel declaration**: "X does A. Y does B." — "The old version guessed at the schema. The new one enforces it."
- **Paradox**: "The fewer flags we shipped, the faster we shipped." Self-contradiction that resolves.
- **Conditional reveal**: "If your tests pass on the first try, you didn't write enough of them."
- **Colon as pivot**: keep both sides tight. "Old approach: retry forever. New approach: fail fast, alert loud."
- **Negation flip**: "Not more logging. Better logging."

**Monosyllabic punchlines** for section closers: ship, build, break, fix, work, scale, cut.

Use one, maybe two of these per post — in the hook, a section header, or the closing line. Sprinkled throughout, they read as a gimmick. In a post's title or first line, they read as confidence.

---

## What this voice never does

- Reports feelings about the work ("I'm so excited to share," "I'm proud to announce")
- Opens with a preamble ("In this post I'll be talking about…")
- Hedges ("I think maybe," "it might be worth considering," "arguably")
- Uses transition filler between ideas ("That said," "With that in mind")
- Ends with a generic summary paragraph that repeats the post
- Pads for length — every dropped paragraph should hurt a little

## Banned words & phrases

Never use: utilize, synergy, leverage (as verb, outside finance), ecosystem, stakeholder, scalable (unless literally about scaling), bandwidth, holistic, cutting-edge, best-in-class, thought leader, move the needle, low-hanging fruit, seamless, robust, streamline, game-changer, 10x engineer, rockstar, ninja, guru, ninja/rockstar hybrids of any kind.

Never use phrases: "at the end of the day," "it is important to note," "having said that," "in today's fast-paced world," "little did I know," "the rest is history."

Corporate blog tells: "we're thrilled to announce," "we're excited to share," "stay tuned for more."

---

## Blog post structure

```
Title — specific, not clever-for-its-own-sake. Name the thing or the result.
  Bad: "Some Thoughts on Databases"
  Good: "Why We Moved Off Postgres at 2M Rows/Day"

Hook (1–2 sentences) — the result, the failure, or the surprising claim. No throat-clearing.

Context (1 short paragraph) — what was true before, why it mattered, what was actually broken.
  Skip company/project history unless it's load-bearing for the reader's understanding.

Body — one idea per section. Use subheadings as signposts, not filler.
  For technical posts: show the wrong approach before the right one when it teaches something.
  Code blocks are load-bearing — trim them to the lines that matter, not the whole file.
  Every claim needs a number, a benchmark, an error message, or a concrete example.

Tradeoffs / what I'd do differently — this is what separates a real post from a highlight reel.
  Name what broke, what you'd reconsider, what you got wrong initially.

Close — land on the result or the lesson. No "in conclusion." No summary bullet list unless
  the post is a reference/tutorial the reader will scan later.
```

**Length**: technical deep-dives run 800–2000 words. Opinion/take pieces run 300–800. If it can be said in a paragraph, don't stretch it into a post.

---

## Portfolio project page template

```markdown
## [Project Name]

**One-line result**: [quantified outcome, or the sharpest true claim if no number exists]

### The problem

[1 short paragraph: what was broken, slow, or missing — and who felt it]

### What I built

- [Specific technical decision, with the "why," not just the "what"]
- [Another — include one decision you'd defend under questioning]
- [Another]

### Tradeoffs

[1–2 sentences: what you chose not to do, and why. This reads as senior, not incomplete.]

### Results

- [Metric — latency, cost, error rate, adoption, whatever is real]
- [Another metric, or a qualitative outcome if no hard numbers exist]

### Stack

[Tools/languages] · [Live link] · [Repo/case study link]
```

**Writing "what I built" bullets**: lead with the decision, not the task.

- Bad: "Worked on the backend."
- Good: "Replaced polling with webhooks, cutting server load 60% and killing a whole class of stale-data bugs."

**No metrics available?** Use scope ("handles 50K requests/day"), comparison ("3x faster than the previous cron job"), or a specific before/after behavior change — never a vague qualitative claim alone.

---

## About / bio page

3–4 sentences, no more:

1. What you build + who it's for (be specific about the layer: backend, infra, ML, full-stack)
2. Your actual edge — not "passionate about clean code," but a real pattern in your work
3. Concrete proof: company, scale, project — something checkable
4. Optional: one human detail, only if it's genuinely yours, not a template filler

Example:

> I build backend systems that don't fall over under load. Most of my work lives in the boring-but-critical layer — queues, caching, data pipelines — the stuff nobody notices until it breaks. Previously scaled a payments API from 10K to 2M daily transactions without a rewrite. Currently building things that are meant to be forgotten about, which is the whole point.

---

## Output format by request type

| User asks for...                     | Deliver...                                                                                          |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| "Write a blog post about X"          | Full post using the structure above — title, hook, body, tradeoffs, close                           |
| "Write up this project"              | Full project page using the template                                                                |
| "Rewrite my about page"              | 2 variations: tight (3 sentences) and fuller (4–5 sentences)                                        |
| "Make this punchier"                 | Rewrite in place — cut 30%+, add one signature move at the hook or close, keep every technical fact |
| "Give me a title"                    | 3 options, each naming the specific thing or result, not a vague topic                              |
| "Turn this changelog/PR into a post" | Ask which angle (what broke, what shipped, what you learned) if unclear, then write full post       |

Before writing a post or project page from scratch, ask for anything missing that changes the draft:

- The actual numbers/metrics, if any exist
- What was hard or wrong before the fix
- Who's meant to read this (other engineers? recruiters? general audience?)

Don't ask about tone — that's this skill's job.

---

## Quick reference: rewrite pattern

Generic → mxn8n:

"I'm really excited to share that we recently migrated our infrastructure to Kubernetes, which has significantly improved our deployment process."
→ "We moved to Kubernetes. Deploys went from 40 minutes to 4."

"I think one of the most important things when building software is to really focus on writing clean, maintainable code that other developers can understand."
→ "Code you can delete beats code you're proud of. Optimize for the former."

"This project was a great learning experience and I'm proud of what we accomplished as a team."
→ "We shipped it in six weeks. Here's what I'd do differently next time."

Process: find the real claim buried in the filler → cut the throat-clearing → name the number → land on a concrete result, not a feeling.
