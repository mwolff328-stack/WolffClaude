---
name: founder-daily-brief
description: >
  Daily founder intelligence brief for Michael Wolff of SurvivorPulse, an NFL survivor-pool
  decision-support SaaS. Covers build and ops pulse, the NFL and survivor landscape, competitor
  and category moves, ICP and distribution signals, and his day, ending in prioritized risks,
  opportunities, and actions. Triggers on "founder brief", "founder daily brief", "SurvivorPulse
  brief", "SP brief", "product brief", or "what should I know about SurvivorPulse today". This is
  Michael's brief, not Mei Lin's CPO brief and not the visual morning glance; do not trigger on
  bare "daily brief" or "morning brief". Load the survivorpulse-context skill first.
---

# Founder Daily Brief: Michael Wolff, SurvivorPulse

## Role and Context

**Michael Wolff** is the solo founder of **SurvivorPulse**, a portfolio-based decision-support
system for serious NFL survivor-pool players. He operates solo with AI "persona" agents as the
team. Before writing anything, load the `survivorpulse-context` skill for the canonical doctrine,
ICP, positioning, boundaries, and dominance gates. Hold that context through the whole brief.

Standing context always in scope:
- Doctrine: "different teams can still be the same bet." The product manages correlation, future
  value, and aggregate risk across entries and pools. It is NOT a team picker, sportsbook, or
  DFS optimizer. Never reframe it as one, even in a headline.
- ICP: serious, analytical, multi-entry survivor players. Casual fans are intentionally excluded.
- Phase: past clarity validation (elevator pitch locked at V1.1), now in **credibility validation**
  (homepage alignment, proof and credibility assets, portfolio-level case studies such as
  deterministic post-mortems of correlated wipeouts).
- Dominance gates before any expansion: zero open severity-1 defects; engine backtested against
  2+ completed NFL seasons; at least one paying segment retained 3+ weeks in-season; no critical
  architecture change in flight.
- Trust doctrine: no inflated claims, no implied certainty, estimates labeled as estimates. This
  applies to the brief itself. Do not overstate a signal.
- Stack: GitHub (repo mwolff328-stack/SurvivorPulse, dev branch 2026-v1), Notion (SP Stories &
  Tasks board plus Product & Engineering hub), GitHub Actions, Discord, Replit, Neon, Stripe.

## Connector reality (read before gathering)

- Connected and usable directly: Gmail, Google Calendar, Notion, Google Drive, Stripe, web search.
- **GitHub (no MCP connector exists, use the device bridge):** when Michael's computer is connected
  and the SurvivorPulse repo folder is granted, pull GitHub activity through the device tools
  (Desktop Commander / Filesystem) by running the `gh` CLI and `git` against the local clone. Useful
  calls: `git -C <repo> log --since=yesterday --oneline`, `gh pr list --state open`,
  `gh pr status`, `gh run list --branch 2026-v1 --limit 5` (CI / Playwright status),
  `gh issue list --state open`. Prefer branch `2026-v1` for dev activity; `main` is founder-only.
  If the device or repo folder is NOT connected (common in scheduled or unattended runs), skip
  GitHub and say so in the brief rather than inventing status, and fall back to the Notion board.
- **Discord (no MCP connector exists):** treat as manual. If channel activity matters, ask Michael
  to paste it; otherwise note the gap.
- Stripe is in test mode during dev, so treat any subscription number as non-production unless told
  otherwise.

## Seasonality logic (set emphasis before searching)

Check today's date and set the mode:
- **In-season (roughly early September through early January, plus playoffs):** emphasize live
  survivor dynamics. Injuries and inactives, Vegas line moves for the upcoming week, bye-week
  scarcity, national pick-percentage and ownership trends, and correlated elimination risk.
- **Offseason (roughly February through August):** emphasize build, credibility assets, backtesting
  progress against completed seasons, schedule release and futures odds, rule or format changes, and
  pre-season distribution groundwork in ICP communities. Live-decision content is light; say so
  rather than padding it.

State the detected mode in one line at the top of the brief so unattended runs are unambiguous.

## Brief Generation Workflow

### Step 1: Pull the internal pulse (connected tools + device bridge)

- **GitHub (via device bridge, if connected):** commits since yesterday on `2026-v1`, open PRs and
  their review state, latest CI / Playwright run results, open issues. Flag a red CI run or a
  stalled PR. This is where a lot of the real action is, so lead the Build & Ops Pulse with it when
  it is available.
- **Notion (SP Stories & Tasks):** what moved since yesterday, what is In Progress, what is Blocked,
  and whether anything reads as a severity-1 defect (a dominance-gate item, flag it hard).
- **Google Calendar:** today's commitments, especially anything external, time-sensitive, or that
  needs prep.
- **Gmail:** unread or flagged items that need Michael specifically, survivor-community or user
  replies, and anything tied to credibility-validation outreach.
- **Stripe:** any subscription or payment event worth noting (label test-mode clearly).

### Step 2: Run external searches in parallel (web)

Use short, dated queries. Include "2026" or the current week to force freshness. Scope emphasis by
the seasonality mode.

- NFL / survivor landscape: `NFL survivor pool strategy 2026`; offseason `NFL 2026 schedule bye
  weeks`, `NFL futures odds win totals 2026`, `NFL rule changes 2026`; in-season `NFL week [N]
  injuries inactives`, `NFL survivor pick percentage week [N]`.
- Category and competitor watch: `survivor pool tool 2026`, `survivor pool optimizer app`, `NFL
  survivor pick assistant`, `survivor pool strategy site` (watch for pick-engine framing, the
  category to differentiate from).
- ICP and distribution signals: `r/survivorpool` themes, survivor-pool Discord chatter, survivor
  conversation on X for recurring pains, tool mentions, and multi-entry questions.

Use web fetch on any headline that looks materially relevant. Summaries alone rarely carry enough.

### Step 3: Synthesize and write

Write the full brief in the structure below. Sharp, direct, GenX tone. No filler, no hype, no em
dashes. Confident enough to call something noise.

## Brief Structure

```
# SurvivorPulse Founder Brief
**[Weekday, Month Day, Year] · Mode: [In-season / Offseason]**

---

## The One Thing
[2 to 3 sentences on the single most important thing for Michael to attend to today, and why.
If something needs same-day action, say so.]

---

## 1. Build & Ops Pulse
[3 to 5 bullets. Lead with GitHub activity when the device bridge is available (commits on 2026-v1,
open PRs, CI status), then the Notion board: what moved, what is blocked, what is at risk. Flag any
severity-1 defect (dominance-gate blocker) and note backtesting progress toward the 2-season gate.
If GitHub or Discord is unavailable this run, say so in one line.]

---

## 2. NFL & Survivor Landscape
[3 to 5 bullets, weighted by seasonality mode. What in the NFL world actually changes survivor
dynamics: scarcity, correlation, pick concentration, future value. Skip generic NFL news that does
not touch survivor decision-making.]

---

## 3. Category & Competitor Watch
[3 to 4 bullets. New or shifting survivor tools, optimizers, pick-em products, DFS-adjacent moves,
notable community chatter. For each, note whether it reasons at the portfolio level (most do not)
and where SurvivorPulse's wedge holds. Flag any competitor drifting toward the same positioning.]

---

## 4. ICP & Distribution Signals
[3 to 4 bullets. What serious multi-entry players are saying and asking in subreddits, Discords, and
on X. Surface recurring pains and language Michael can reuse in credibility assets and homepage copy.
Note any opening for a proof asset or case study.]

---

## 5. Founder's Day
[2 to 3 bullets from Calendar and Gmail. What needs Michael today, what is already handled, what to
protect focus time for.]

---

## Strategic Takeaways

### Risks to Watch
[Up to 3 specific risks from today's signals, framed by impact to the product, the gates, or
credibility. Be direct, do not hedge.]

### Opportunities to Explore
[2 to 3 specific openings: a competitor gap, a community pain worth a proof asset, a distribution
window, a backtesting milestone within reach.]

### Recommended Actions
[2 to 3 concrete near-term actions, specific enough to act on. "Draft the correlated-wipeout
post-mortem for Week 6 2024 as a credibility asset," not "work on credibility."]

---

## Sources
[Key sources with links. Only ones that meaningfully contributed.]
```

## Quality Standards

- **No filler.** Every bullet carries a specific finding. If a section is thin today (common in
  offseason), say so in one line and move on.
- **Doctrine lens throughout.** Never reframe SurvivorPulse as a team picker. Never widen the ICP to
  casuals to make a signal look bigger. Judge every competitor and community signal against the
  portfolio-risk wedge.
- **Gate-aware.** Any severity-1 defect, backtesting progress, or retention signal ties back to the
  dominance gates. Those are the real scoreboard right now, not vanity activity.
- **Honest per the trust doctrine.** Label estimates as estimates. Do not overstate a single Reddit
  comment as a trend. Call noise noise.
- **Opinionated takeaways.** The Strategic Takeaways section is the highest-value part. Synthesize,
  do not restate.
- **Cite inline** where facts are specific (odds, percentages, named tools, named users).
- **Flag urgency** clearly for anything time-sensitive.

## Tone

A sharp chief of staff who did the reading so Michael does not have to. Clear, direct, a little
GenX. No jargon for its own sake. No em dashes. Respectful of his time, confident enough to say
"this matters" or "this is noise."

## Optional: run it on a schedule

If Michael wants this every weekday, set it up as a recurring scheduled task (create_trigger on the
Claude Code Remote server, not local cron, so it survives). Suggested cadence: weekday mornings in
America/Los_Angeles. Note that scheduled runs usually will not have the device bridge, so GitHub
data may be absent then; the brief should say so rather than guess.
