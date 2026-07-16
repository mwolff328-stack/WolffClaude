# Status Reports Must Diff, Not Restate

**Extracted:** 2026-07-12
**Context:** The daily-brief scheduled task ran roughly 14 times in the week of Jul 6-12, 2026 (7am and 8am runs). Nearly every run reported the same facts: 87 CI failures on the SurvivorPulse `2026-v1` branch, PR #50 still in draft, the same three 2026-V1 MITs overdue, and the same two unreadable inboxes. The output was accurate and near-identical every time.

## Problem

A recurring brief that reports current state will restate unchanged facts forever. Volume goes up, signal goes to zero, and the reader learns to skim. Worse, an unchanged fact that has been unchanged for six days is a *bigger* story than it was on day one, but a state-report has no way to say so. The `red-ci-blocks-shipping` note already predicted this: it says escalate when a brief surfaces the same "CI broken" line two runs in a row. It surfaced roughly twenty times and nothing escalated. Writing the rule down was not enough. The reporting skill had no mechanism to enforce it.

## Solution

Any recurring status skill (daily brief, weekly brief, standup, pipeline review) should be specified as a **diff against the previous run**, not a snapshot of current state.

Persist the prior run's findings as state, ideally to the same Notion page or a small JSON file. On each run, compare against that state. Report only what changed, plus anything that crossed an escalation threshold. Suppress unchanged items entirely rather than restating them.

Add an age counter to every open item. When an item has appeared unchanged for more than three consecutive runs, stop reporting it as status and start reporting it as a decision: "this has been red for six days. Fix it or kill it." Escalation is the output, not repetition.

The contract to write into the skill spec is: **answer "what changed, and what needs a decision from me," never "what is the state of everything."**

Verification is cheap and objective. If the rewritten brief is materially shorter than last week's and every remaining line is new information, the spec works. If it is the same length, it does not.

## When to Use

Applies when writing or revising any skill that runs on a schedule and reports status; when a brief or report is being ignored or skimmed; when the same line has appeared in two or more consecutive automated runs; or when an item has been "a known blocker" for more than a few days without anyone deciding anything about it.

## Related

`red-ci-blocks-shipping` (the rule that failed to fire), `scheduled-task-timing-drift`, `skill-creator` (use its eval harness to replay prior runs against the rewritten spec and confirm the output actually shrinks).
