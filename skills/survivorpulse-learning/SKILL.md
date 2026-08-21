---
name: survivorpulse-learning
description: >
  Systematic knowledge capture for SurvivorPulse. Governs the mandatory 🎓 Learning: line in
  Done transition comments, Luigi's weekly synthesis process, and the flow from Notion story
  comments into learned/ skill files and Discord #learning (1493965556817334313). Use when:
  writing a Done transition comment, running Luigi's weekly synthesis, posting to #learning,
  updating learned/ skill files or MEMORY.md, or extracting patterns from completed work.
  Trigger on: "Done comment", "🎓", "learning", "TIL", "pattern", "retrospective",
  "weekly synthesis", "what we learned", "#learning".
triggers:
  - "Done comment"
  - "🎓"
  - "#learning"
  - "lesson learned"
  - "TIL"
  - "retrospective"
  - "weekly synthesis"
  - "what we learned"
  - "pattern"
---

# SurvivorPulse Learning & Knowledge Capture

Every Done transition is a mandatory learning moment. Weekly synthesis turns individual moments into institutional knowledge. This is systematic — baked into the Kanban flow, not ad-hoc.

> **⚠️ SUSPENDED (2026-08-21, founder instruction): Discord `#learning` posting.** All Discord-posting steps below (Luigi's weekly synthesis step 4/5, the "Channel formatting" section) are **suspended** — the founder isn't running OpenClaw right now, which was the mechanism these steps assumed. Everything else in this skill stays in force: the mandatory `🎓 Learning:` line on Done, `learned/` skill file capture, and Notion comment capture all continue as normal. Skip the Discord step entirely (don't ask to connect a Discord tool, don't look for a webhook) until the founder says OpenClaw is back up, at which point re-enable Discord posting by removing this notice.

## When learning is captured

**Mandatory:** Every persona's Done transition comment must include a `🎓 Learning:` line. N/A is acceptable; silence is not.

**Encouraged (not required):** At In Review or In Progress touch points, if a reviewer or builder discovers something worth preserving, they add a `🎓 Learning:` line to that touch comment.

## The 🎓 Learning line format

Every Done transition comment ends with:

```
[PersonaName] — [what was done / verdict]
🎓 Learning: [CATEGORY] [learning statement]
```

Or, if nothing new was learned:

```
🎓 Learning: N/A
```

Example:
```
[Felix] — Implemented picks history table via field_picks_history migration; all 3 slices merged and tests green.
🎓 Learning: [BUILD] field_picks_history.eliminated_week is NULL until an entry is eliminated — guard all queries or you get silent 0s. See survivorpulse-data-field-traps.md.
```

## Category tags

| Tag | Use | Primary personas |
|-----|-----|-----------------|
| `[BUILD]` | Code pattern, schema gotcha, tool discovery, architectural lesson | Felix, Rita |
| `[QA]` | Test gap, reproducibility pattern, coverage miss, what slipped through | Vlad |
| `[PRODUCT]` | Domain model clarification, AC ambiguity resolved, scope insight | Ann, Pam, Sky |
| `[DESIGN]` | UX pattern, component reuse, spec gap found | Deb |
| `[RESEARCH]` | Analytical insight, data quality finding, model assumption | Stan |
| `[PROCESS]` | Workflow improvement, orchestration bottleneck, coordination lesson | Luigi |

## Luigi's weekly synthesis

Every week, Luigi:

1. Reads all Done story and bug comments from the past 7 days.
2. Identifies every substantive `🎓 Learning:` line (not N/A).
3. Promotes any learning that surfaces across **2+ stories** to a `learned/` skill file.
4. Posts standout learnings and new `learned/` entries to Discord `#learning` (channel `1493965556817334313`).
5. Posts a brief weekly synthesis summary to `#learning` — even if no new learnings emerged.
6. Assesses each substantive learning against the operating model: if a learning reveals a process gap, an unclear rule, or a missing convention, Luigi drafts the proposed improvement and presents it to the founder for review and approval before making any edit to the Operating Model.

If a learning changes how an agent should operate, update the relevant agent spec or `CLAUDE.md`/`.claude/rules/` entry. Commit and push to WolffClaude after any skill/config update.

## Where learnings are stored

1. **Notion story/bug comment** — immediate, in-context capture when work is freshest
2. **`SurvivorPulse/.claude/skills/learned/`** — durable project-level patterns
3. **`~/.claude/skills/learned/`** — cross-project patterns (only if learning generalizes beyond SP)
4. **Discord `#learning`** — broadcast for team visibility

## Learning artifact format

When capturing a lesson in `#learning` or a `learned/` file:

**What happened:** one-sentence description of the event or discovery
**Context:** which story/agent/work stream produced this
**The lesson:** what we now know that we did not before
**Action taken:** what was updated (skill file, MEMORY.md, agent spec, code, process)
**Reusable pattern:** if applicable, a generalized rule others can apply

## Learned skill format

When creating a new `learned/` file:

```markdown
# [Title]

**Extracted:** [date]
**Context:** [what project/situation produced this]

## Problem
[What went wrong or was surprising]

## Solution
[What fixed it or what the correct approach is]

## When to Use
[Conditions that should trigger recall of this lesson]
```

## Existing learned skills

Check before creating a new one.

**Project-level (`SurvivorPulse/.claude/skills/learned/`):**
- `survivorpulse-data-field-traps.md` — canonical spread field, stale field warnings

**Global (`~/.claude/skills/learned/`):**
- `github-repo-discovery.md` — layered GitHub search for tools/libraries
- `npm-env-var-override.md` — npm scripts silently override shell env vars
- `replit-bashrc-permission-denied.md` — shell alias workaround for Replit
- `vitest-fake-timers-hook-testing.md` — testing time-based React hooks

## Channel formatting (Discord #learning)

- Bullet lists only (no markdown tables)
- Keep initial posts concise (3-5 bullets)
- Link to full artifacts for deep context
- Use the category tags as prefixes for quick scanning
