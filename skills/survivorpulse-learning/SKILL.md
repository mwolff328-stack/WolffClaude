---
name: survivorpulse-learning
description: >
  Knowledge capture and lesson extraction for SurvivorPulse. Use when working in or posting to the
  #learning Discord channel (1493965556817334313). Covers: documenting lessons learned from builds,
  research, and ops; capturing reusable patterns; extracting insights from failures and successes;
  updating MEMORY.md and learned skills; and synthesizing cross-channel knowledge. Trigger on:
  "lesson learned", "TIL", "pattern", "what we learned", "knowledge capture", "retrospective",
  or any post-mortem discussion.
triggers:
  - "#learning"
  - "lesson learned"
  - "TIL"
  - "retrospective"
  - "what we learned"
  - "pattern"
---

# SurvivorPulse Learning & Knowledge Capture

You are operating in the SurvivorPulse #learning channel context. This channel captures lessons, patterns, and reusable knowledge from across all SurvivorPulse work streams.

## Purpose

Turn experience into durable knowledge. Every significant failure, success, or surprising finding should produce a learning artifact that prevents repeat mistakes and accelerates future work.

## What belongs here

- **Build lessons:** patterns, anti-patterns, tooling discoveries from Felix/Deb work
- **Research insights:** meta-findings about research methodology from Stan's work
- **Ops lessons:** CI/CD gotchas, deployment patterns, automation design from Rita/infra
- **Product lessons:** ICP validation findings, positioning insights from Pam/Ann
- **Strategy lessons:** what worked and what did not in market approach from Hank

## Learning artifact format

When capturing a lesson:

**What happened:** one-sentence description of the event or discovery
**Context:** which channel/agent/work stream produced this
**The lesson:** what we now know that we did not before
**Action taken:** what was updated (skill file, MEMORY.md, AGENTS.md, code, process)
**Reusable pattern:** if applicable, a generalized rule others can apply

## Where lessons are stored

1. **Quick capture:** post to #learning channel
2. **Durable storage:** update one or more of:
   - `~/.claude/skills/learned/*.md` (technical/tactical patterns)
   - `MEMORY.md` "Lessons learned" section (strategic/operational insights)
   - Agent spec files in `~/.claude/agents/` (if the lesson changes how an agent should operate)
   - `CLAUDE.md` or `.claude/rules/` (if the lesson changes dev workflow)
3. **Commit and push** to WolffClaude repo after any skill/config update

## Existing learned skills

Check `~/.claude/skills/learned/` before creating a new one. Current entries:
- `github-repo-discovery.md` - layered GitHub search for tools/libraries
- `npm-env-var-override.md` - npm scripts silently override shell env vars
- `replit-bashrc-permission-denied.md` - shell alias workaround for Replit
- `vitest-fake-timers-hook-testing.md` - testing time-based React hooks

## Learned skill format

When creating a new learned skill file:

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

## Channel formatting

- Bullet lists only (no markdown tables)
- Keep initial posts concise (3-5 bullets)
- Link to full artifacts for deep context
- Use emoji prefixes for quick scanning:
  - `[BUILD]` technical/code lesson
  - `[OPS]` infrastructure/CI lesson
  - `[RESEARCH]` methodology/analysis lesson
  - `[PRODUCT]` ICP/positioning/strategy lesson
  - `[PROCESS]` workflow/coordination lesson
