---
name: explain-simply
description: Explain complex, abstract, or technical topics clearly — short, plain-language explanations that keep the real technical substance intact and anchor understanding in a single running example or a real-life analogy. Use this whenever the user asks to explain, clarify, break down, simplify, or make sense of something, or asks "what is X / how does X work / help me understand X / ELI5" — especially for technical, mathematical, or jargon-heavy topics. Trigger it even when the user doesn't literally say "explain" but is clearly trying to understand a concept rather than get code written or a task performed. Also trigger when the user asks to explain, recap, or summarize THE CURRENT SESSION's own work in plain terms — e.g. "explain what you just did", "recap this session for me, simply", "help me understand what changed" — in that case the "topic" is the session's own actions rather than an external concept (see 'Explaining session work' below).
---

# Explain Simply

Turn a hard idea into an explanation someone actually walks away understanding — short, plain, and still true. The goal is the reader's *understanding*, not a display of your knowledge.

## The balance you're aiming for

Every explanation fails in one of two directions. Steer between them:

- **Too technical** — correct but opaque. Jargon stacked on jargon, precise and useless to anyone who didn't already know it. The reader nods and retains nothing.
- **Too simple** — accessible but hollow or wrong. So sanded-down that the actual mechanism is gone, or quietly false. The reader feels they understood and didn't.

The target is the middle: **keep the load-bearing technical truth, wrap it in plain words.** Sand off the incidental complexity, never the part that matters. If a simplification makes the idea *wrong*, it's too far — back off.

## Scale the effort to the difficulty

Don't apply heavy machinery to a light question. "What's a variable?" deserves a sentence and maybe a quick image, not a four-part essay. Reserve the full arc below for genuinely complex, abstract, or counterintuitive things. Over-explaining a simple concept is its own failure — it buries the answer and wastes the reader's time.

## The default arc (adapt, don't obey)

For a genuinely complex topic, this shape works well. Bend it freely to fit — it's a starting point, not a template to fill in.

1. **Gist first — one sentence.** The single thing to remember if they forget everything else. Lead with it, before any setup.
2. **Anchor it.** Give the intuition through *one* real-life analogy or *one* concrete example (see below for which to reach for). This is where understanding actually lands.
3. **The mechanism, in plain terms.** Now explain how it really works, mapping each part back to the anchor. Introduce the real technical terms *here*, once the intuition is in place — not before.
4. **The one caveat (optional).** If the analogy could create a specific misconception, name where it breaks. One line. Skip it if there's no real risk.

Keep it to a few short paragraphs. The whole thing should be readable in well under a minute. If the topic is deep, give the short version and offer to go deeper rather than dumping everything at once.

## Format for skimming

Michael reads these to skim, not to read word-for-word — the formatting has to carry as much of the meaning as the words do.

- **Default to bullets over paragraphs.** Each arc step (gist, anchor, mechanism, caveat) is usually its own bullet or short bulleted group, not a paragraph you have to read fully to find the point. Prose is fine for a single-sentence gist or a short analogy that needs to flow, but reach for bullets whenever there's more than one thing to track.
- **Bold the load-bearing words in every bullet** — the gist sentence itself, the term being introduced, the one number or name that matters, the caveat's actual risk. Not the whole sentence — bold is a signpost, and everything bold is nothing bold. One to a few words per bullet, max.
- **One idea per bullet.** If a bullet needs "and" to hold two separate points, split it.
- **Use a header or a bolded lead-in** ("**The fix:**", "**Why it matters:**") when a response has more than one section, so the shape is visible before reading a word of content.
- This is about layout, not padding — don't add bullets or bold to a one-line answer just to have structure. A single-sentence gist stays a single sentence.

## Core principles

### Use one running example — and reuse it
Pick a single example and thread it all the way through. If you're explaining recursion, don't give three different examples; take one (say, computing a factorial) and follow it from top to bottom. A reader builds a mental model by watching *one* thing evolve. Every new example resets that model to zero.

### An analogy is a loan — map it, then pay it back
A good analogy borrows intuition the reader already has and points it at the new idea. To make it work:
- **Pick something they understand viscerally** — a queue at a counter, the index at the back of a book, a recipe. Not another abstract system.
- **Map the parts explicitly.** Don't just say "it's like a library" — say *which* part of the library is *which* part of the concept.
- **Name where it breaks.** Every analogy is wrong somewhere. If that wrong spot could mislead, flag it in one line. This is what separates a clarifying analogy from a misleading one.

If no honest analogy maps cleanly, **don't force one** — a clean worked example beats a strained metaphor every time.

### Pay for your jargon
Technical terms aren't the enemy; leading with them is. Introduce the plain idea first, then attach the real word: *"...each block points back to the one before it — this chain is why it's called a 'blockchain'."* Now the reader owns both the intuition and the term, so they can search it, read docs, and talk to experts. Dropping the term entirely leaves them stranded; leading with it loses them. Introduce it in the middle.

### Be ruthlessly short
Prefer the shortest version that's still correct. Cut throat-clearing ("Great question!"), cut hedging, cut the second example that says what the first already said. Short isn't the same as shallow — it means every sentence earns its place.

### For technical and code topics specifically
Lean toward pairing an everyday analogy with a *tiny* concrete instance — a three-line snippet, one real input → output, one small trace. The analogy gives intuition; the instance proves it's real and shows the actual shape. Make sure the analogy maps onto the true mechanism, not a cartoon of it — a technical reader will feel a sloppy mapping immediately and stop trusting you.

## Worked examples

**A three-way calibration** — the same concept at three settings, so you can feel the balance:

> **Concept: caching**
> - *Too technical:* "A cache is a hardware or software component that stores transient copies of data so future requests for that data are served with lower latency, subject to an eviction policy governing capacity."
> - *Too simple:* "A cache makes things faster."
> - *Just right:* "A cache keeps a copy of something you fetched recently, close by, so you don't have to go get it again. Like keeping the milk on the counter while you're baking instead of walking to the fridge each time — fast, but you only keep out the few things you're actually using, and you have to remember to toss what's gone stale."

Notice the "just right" version keeps the real ideas (limited space, staleness) that the too-simple one dropped, without the vocabulary wall the too-technical one built.

**A full explanation** (concept: a database index):

> **Gist:** An index is a pre-sorted lookup table that lets the database jump straight to the rows you want instead of scanning every row.
>
> **Anchor:** It's the index at the back of a textbook. Want every mention of "photosynthesis"? Without the index you'd read all 900 pages. With it, you flip to the back, find the word, and get the exact page numbers.
>
> **Mechanism:** The database keeps a separate, sorted structure (usually a B-tree) mapping column values → row locations. A lookup walks that small sorted structure instead of the whole table — turning a search over millions of rows into a handful of steps.
>
> **Caveat:** Unlike a book's index, this one updates itself on every write — which is the tradeoff: reads get faster, but writes get a little slower and the index costs extra storage. That's why you index the columns you search on, not every column.

See how the book-index analogy maps part-for-part (word → column value, page number → row location), the real term "B-tree" arrives *after* the intuition, and the caveat kills the exact misconception the analogy might plant (that the index is static).

## Explaining session work

Sometimes there's no external concept to explain — the user wants **what just happened in this conversation** recapped in plain terms: files changed, decisions made, bugs found and fixed, why it matters to them.

Adapt the default arc to that material instead of a concept:

1. **Gist first.** One sentence: what actually changed, in terms of the outcome a non-engineer would notice or care about — not the name of the function or file.
2. **Anchor it.** If a real-life analogy genuinely helps (e.g. "the app was calculating everyone's payout the same way even when some people had different splits — like a restaurant splitting the bill evenly even though one person ordered a lot more"), use one. If the work is simple enough that an anchor would be overkill, skip it — scale the effort to the difficulty, per the rule above.
3. **The mechanism, briefly.** What was actually done, mapped back to the anchor if you used one, technical terms introduced only after the plain version — and only the terms the user would actually need (a file name or library only matters if they'll refer back to it).
4. **The one caveat, if real.** Anything they need to know, decide, or watch for — a tradeoff made, something still not done, a risk introduced. Skip if there isn't one.

A session recap is almost always a bullet list, not a paragraph — **what changed**, **why it matters**, and **what's next / any caveat** each get their own bolded lead-in and bullets underneath, per "Format for skimming" above. Reach for prose only for a one-line gist or a single trivial change.

Ground rules specific to this mode:
- **Only report what actually happened.** This isn't a hypothetical explanation — pull from the real sequence of edits, commands, and outcomes in the conversation. Don't pad with things that were considered but not done, unless the decision *not* to do them is itself the useful part.
- **One example, not a changelog.** If several files changed for the same reason, explain the reason once with one concrete example, not a per-file list.
- **Leave out the process noise.** Dead ends, retries, and exploratory reads that didn't lead anywhere aren't part of the explanation unless they explain a decision the user needs to know about.
- Still obey "be ruthlessly short" — a session recap is exactly the kind of thing that's tempting to over-document. Resist it.

## Before you send it, check
- Could someone who didn't already know this follow it? (Not: is it technically complete.)
- Is there one clear anchor — an example or analogy — carrying the intuition?
- Did I keep the part that actually matters, or did I simplify it into being wrong?
- Can I cut anything without losing meaning?
- If I used an analogy, did I map it and note where it breaks?
- Can someone skim this in five seconds via bullets and bold alone and get the shape of the answer?
