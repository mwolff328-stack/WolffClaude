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
4. ~~Posts standout learnings and new `learned/` entries to Discord `#learning` (channel `1493965556817334313`).~~ **Suspended — see notice above.**
5. ~~Posts a brief weekly synthesis summary to `#learning` — even if no new learnings emerged.~~ **Suspended — see notice above.**
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

## Backtest quick-check convention (ad-hoc stat citations)

**Founder decision, 2026-10-09 (SST-1870):** this skill is the canonical home for the lightweight "quick-check" convention — not `docs/research/methodology/README.md`. If a divergent description of this rule is ever found there, this section wins; fix the other location to point here instead of restating it.

**The problem this solves:** a 30-second ad-hoc SQL query gets run to answer a one-line backtest question, the number gets typed into a ticket/Discord/content, and the query is never saved — the number becomes unverifiable folklore (confirmed 3 times; see [[feedback_survivorpulse_ephemeral_backtest_scripts_not_persisted]] in project memory). This sits next to the existing HEAVYWEIGHT convention (`scripts/research/*.ts` + `docs/research/backtesting/*.md`, indexed in `docs/research/methodology/research-inventory.md`'s verdict table) — use the heavyweight tier for a real SST-numbered study; use this lightweight tier for everything else. Never modify, restructure, or rename anything in the heavyweight tier to accommodate this.

**The rule, every time you run an ad-hoc backtest/stat query:**

1. **Save the query.** Even 10 lines. Goes in `scripts/research/quick/` (create the folder and its own short README the first time it's used, so it's self-explanatory without this skill).
2. **Write a 5-field stub** next to it (header comment or sibling file): (a) date run, (b) the exact question, (c) table(s)/column(s) queried, (d) result + sample size (n), (e) who ran it. Plus a **staleness clause**: the result is only known-accurate as of (a) — if the underlying data is later corrected, the row in step 3 must be reset to `UNVERIFIED`.
3. **Add one row** to the EXISTING `docs/research/methodology/research-inventory.md` verdict table (its UNVERIFIED section) — never a new table. Status `UNVERIFIED` until a person or session OTHER than the original runner independently re-runs it against the same table/columns and gets a result that matches exactly (same n, same value at the originally-reported rounding precision) — only then flip to `VALID-CURRENT`. A non-matching re-run moves it to `CONTRADICTED`, never silently back to `UNVERIFIED` unexplained.
4. **Link every citation back to its file.** Any number quoted in a Notion ticket, Discord, or published content must link to its `scripts/research/quick/` file, and that file's stated result must actually be the one quoted (a linked-but-mismatched file is exactly as non-compliant as no file). You may post the number before the file exists, but the file AND a link back into the citation must both land before the end of that SAME calendar day (your local time) — after that, an unbacked citation is a violation.
5. **Spot-check, not CI.** There's no automated gate for a human typing a stat into chat. This convention's own enforcement is a periodic manual spot-check (fold it into Luigi's weekly synthesis above): grep recent Notion/Discord/published content for a `%`, `n=`, or "backtest" pattern and confirm each has a matching file + inventory row. A flagged violation requires an actual corrective comment or follow-up ticket — flagging without following up doesn't close the loop.

Full grooming history, the two Cass-rejected rounds, and the detailed Acceptance Criteria/Test Cases are on [SST-1870](https://app.notion.com/3f429ce5833d81df85a4c9b0bac11aac) if you need the exact edge-case rules (same-day midnight rollover, question-mismatch-despite-matching-numbers, etc.) — this section is the operative summary.

## Channel formatting (Discord #learning) — SUSPENDED, see notice at top of file

- Bullet lists only (no markdown tables)
- Keep initial posts concise (3-5 bullets)
- Link to full artifacts for deep context
- Use the category tags as prefixes for quick scanning
