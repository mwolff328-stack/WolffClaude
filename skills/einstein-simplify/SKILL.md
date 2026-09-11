---
name: einstein-simplify
description: "Rewrites complex technical explanations, presentations, scripts, or any dense content so that a non-technical person sitting next to an expert could follow every word. Use this skill whenever the user wants to simplify a technical topic, make something ELI5, prepare an explanation for a mixed audience, strip jargon without losing accuracy, or says anything like 'explain it simply', 'make this accessible', 'dumb this down', 'non-technical version', 'teach this to a layman', or 'my audience isn't technical'. Also trigger when preparing presentations, demos, or scripts that will be delivered to audiences of mixed technical backgrounds. Also trigger when the user asks to summarize, recap, or explain THE CURRENT SESSION's work in plain terms — e.g. 'summarize what you did in plain English', 'explain your work so far to me like I'm not technical', 'what did you just do, in simple terms' — in that case apply the same principles to the session's own actions instead of to pasted content (see 'Summarizing session work' below). The Einstein frame: if you can't explain it simply, you don't understand it well enough. This skill enforces that standard."
---

# einstein-simplify

Rewrite complex technical content so a non-technical person sitting next to an expert can follow every word — without losing accuracy or depth.

The goal is not to make things childish. It is to make things clear. An expert should feel the explanation is precise. A layman should feel it is followable.

---

## Core Principles

**1. Concept before label**
Never introduce a technical term before the concept it names exists in the listener's head. Lead with what something _does_, then name it.

- Bad: "RAG, which stands for Retrieval-Augmented Generation, solves the problem of..."
- Good: "The model doesn't know your documents. We solve that by giving it a specific set of pages to read before it answers. That pattern is called RAG."

**2. Analogy before description**
For any abstract concept, deliver a concrete real-world analogy _before_ the technical description. The analogy is the foundation. The description builds on it.

- Bad: "Vector embeddings map semantic meaning into high-dimensional space."
- Good: "Think of it like GPS coordinates, but for meaning instead of location. Every piece of text gets plotted as a point on a map. Things that mean similar things end up near each other — even if the actual words are different. That's what a vector embedding is."

**3. One worked example beats four surface descriptions**
When multiple concepts need explaining, develop one fully with a concrete example rather than naming all four shallowly. Depth on one creates understanding. Width across many creates overwhelm.

- Bad: "There are four key decisions: chunk size, overlap, match threshold, and reranking."
- Good: "The most important decision is chunk size. Here's why it's not obvious: imagine chunking a legal document. Too big and you inject three paragraphs when only one sentence was relevant — noise. Too small and you cut a sentence from the paragraph that gives it meaning — loss of context. There's no universal answer. You tune it for the corpus. The other decisions — overlap, threshold, reranking — follow the same logic."

**4. No acronyms until the concept exists**
Introduce labels only after the concept is understood. Never lead with an acronym even with an immediate expansion — the expansion is still jargon.

**5. Replace, don't define**
Where possible, replace jargon with plain language rather than defining jargon. Definitions ask the listener to hold two words in mind. Replacements give them one.

- Bad: "cosine similarity (a measure of angular distance between vectors)"
- Good: use "nearest neighbors in meaning-space" instead — drop cosine entirely

**6. The teachable moment deserves full space**
Every explanation has one moment where the mechanism clicks. Find it. Give it a full beat. Read it aloud if it's a script. Pause after delivery. Don't rush past the insight to the next concept.

**7. The non-technical test**
After every rewrite section, ask internally: could a smart person with zero domain background follow this? If no — simplify further. If yes — move on.

**8. Format for skimming (when the output is a chat answer, not a script)**
When the rewritten content is something Michael reads directly in chat — as opposed to a script, presentation, or transcript meant to be spoken aloud to someone else — lean on layout, not just prose, to make it skimmable:

- **Default to bullets over paragraphs** once there's more than one point to track. A single gist sentence or a flowing analogy can stay prose; a list of concepts, changes, or steps should not.
- **Bold the load-bearing words** in each bullet or paragraph — the term being introduced, the one number that matters, the actual takeaway — not the whole sentence. Bold is a signpost; overusing it erases the signal.
- **One idea per bullet.** Split anything joined by "and" into two ideas.
- **Lead sections with a bolded tag** ("**The fix:**", "**Why it matters:**") so the shape of the answer is visible before reading the content.

This principle does NOT apply to the actual rewritten script/presentation text itself in Step 4/5 below — spoken content should still read as natural prose a person can say aloud. It applies to how *you*, in chat, present the explanation, the diff, or a session recap.

---

## Summarizing session work

Sometimes there's no pasted content to rewrite — the user wants the **current conversation's actual work** (files touched, code written, commands run, decisions made, problems hit) recapped in plain terms, e.g. "summarize what you did", "explain your work in plain English", "what did you just build, for a non-technical person."

In this mode, treat the session itself as the "dense content" to simplify:

1. **Gather the raw material first.** Review what actually happened in this conversation — which files were changed and why, what commands were run, what broke and got fixed, what decisions were made and the reasoning. Don't guess or pad; only summarize things that actually occurred.
2. **Find the one sentence.** What's the single thing that happened, in outcome terms a non-engineer cares about ("the payout screen now shows split-pot winners correctly" — not "refactored `computePayouts` in `poolSettlement.ts`").
3. **Apply the seven principles above** to that material: lead with what changed and why it matters before naming the technical mechanism; use one concrete before/after example instead of listing every file; replace jargon (function names, library names, error types) with what they *do* in plain terms; if a fix mattered because of a specific bug, tell that story briefly rather than the diff.
4. **Skip the internal narration.** Tool-call sequencing, retries, dead ends that were abandoned, and exploratory reads are process — leave them out unless one caused a real decision the user should know about (e.g. "I found X was already handled elsewhere, so I only needed to change Y").
5. **Structure it for skimming (Principle 8):** bullets under bolded lead-ins — **what changed**, **why it matters**, **what's next / caveats** — each its own group, not paragraphs the user has to read end-to-end to find the point. Skip the Step 4/Step 5 diff-and-confirm dance below; this mode outputs directly, since there's no original text to preserve a before/after of.

The non-technical test (Principle 7) still applies: could someone with zero engineering background read this recap and understand what happened and why it matters to them? So does the skim test: could they get the shape of it from the bullets and bold alone?

---

## Workflow

### Step 1: Identify the audience gap

Before rewriting, assess:

- Who is the primary audience? Who is the secondary audience?
- What is the most complex concept in the content?
- What jargon appears that has no plain English equivalent being used?
- Where is the single most teachable moment?

### Step 2: Scan for violations

Flag every instance of:

- Acronym introduced before concept
- Technical term used without analogy
- Multiple concepts enumerated shallowly
- Jargon defined rather than replaced
- A key insight rushed past without pause
- A chat-facing answer (not a script) written as dense paragraphs instead of skimmable bullets/bold (Principle 8)

### Step 3: Rewrite

Apply the seven principles. For each flagged item:

- Concepts before labels: restructure the sentence order
- Analogies: insert before technical description, not after
- Worked examples: pick the most important concept, develop it fully, compress the rest
- Acronyms: delay until concept is established
- Jargon: find the plain English equivalent and use it exclusively
- Teachable moment: expand, slow down, give it space

### Step 4: Show diff

Present a before/after for each changed section. Do not apply until confirmed.

Format:

**Before:**

> [original text]

**After:**

> [rewritten text]

**Change:** [one-line reason]

### Step 5: Apply on confirmation

Output the full rewritten content once confirmed.

---

## Hard Rules

- DO NOT sacrifice accuracy — simplification is not dumbing down, it is clarifying
- DO NOT remove content — restructure and rephrase, do not delete
- DO NOT add new analogies that are inaccurate or misleading
- DO NOT introduce new jargon while removing existing jargon
- ALWAYS keep the expert in the room satisfied — they should feel the explanation is still precise
- The non-technical person and the expert must both be able to follow — this is the dual standard

---

## Reference: Common Jargon Replacements

| Jargon            | Plain replacement                     |
| ----------------- | ------------------------------------- |
| vector embedding  | coordinates that represent meaning    |
| cosine similarity | nearest neighbors in meaning-space    |
| LLM               | AI language model                     |
| inference         | the model generating an answer        |
| fine-tuning       | retraining the model on specific data |
| context window    | the text the model can read at once   |
| retrieval         | finding the relevant passages         |
| chunking          | breaking documents into passages      |
| semantic search   | searching by meaning, not exact words |
| latency           | response time                         |
| token             | roughly one word or part of a word    |

Add domain-specific replacements as discovered during the rewrite.
