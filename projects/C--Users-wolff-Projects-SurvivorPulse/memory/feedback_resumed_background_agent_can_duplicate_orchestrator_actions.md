---
name: feedback-resumed-background-agent-can-duplicate-orchestrator-actions
description: "A background agent's \"completed\" task-notification does not mean it stayed stopped — it can be silently resumed and keep taking orchestrator-level actions (filing tickets, changing Notion properties) with no further notification until it truly finishes, colliding with the orchestrator's own parallel work on the same topic."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 9e25e6e2-47ce-4343-aebb-668d261d3abc
  modified: 2026-08-26T20:27:57.933Z
---

A dispatched Felix agent (SST-1476, SurvivorPulse) reported completion, was read and acted on
(reported to the founder, its commit verified against real CI). Independently, the orchestrating
session then found the CI proof itself, filed a new bug ticket (SST-1479) for a second failure the
agent's report had flagged but not fixed, ran it through a 5-persona triage panel, and dispatched a
*second* Felix agent to fix it.

Minutes later, a *second* task-notification arrived for the *same* first agent's task-id, reporting
that it had kept working the whole time — run its own CI verification, and **filed its own ticket
(SST-1480) for the exact same second failure**, complete with its own triage panel. Two duplicate
tickets for one defect, created independently within the same session, one already backed by an
active fix agent.

**Why:** a `<task-notification>` with `status: completed` and the note "fires each time this agent
stops with no live background children of its own" does NOT mean the agent will not run again. The
harness can resume it (the user, or the agent's own queued follow-up work), and it can keep
performing real side effects — including orchestrator-level ones like creating tickets — with zero
visibility to the orchestrator until the NEXT notification lands. Reading "completed" as "inert" was
the mistake; it only means "not running *right now*," not "done for good."

**How to apply:**
- Before filing a ticket, dispatching a fix agent, or taking any other orchestrator-level action
  based on a completed agent's report, treat that report as possibly stale the moment any other work
  happens in between — a completed agent can still be resumed and act again with no further signal
  until it's truly finished.
- When a *second* notification arrives for a task-id you already treated as finished, always read it
  fully before assuming it's a duplicate status update — it may contain NEW side effects (tickets,
  commits, Notion writes) that now collide with whatever the orchestrator did in the interim.
  Cross-check the actual current state (query the DB/Notion/git directly) rather than trusting either
  report's account of "what I set."
- When a collision is found, don't just pick a winner and delete the loser's work outright — the
  duplicate often contains information the original doesn't (here: the second ticket had the precise
  origin-commit lineage the first lacked). Merge the unique findings into the canonical record, then
  cancel the duplicate with a note explaining why and pointing to the canonical one.
- If a fix agent is already actively working on the canonical ticket, message it directly
  (`SendMessage`) with whatever the duplicate surfaced, rather than silently updating the ticket page
  and hoping it re-reads it — a running agent only has the context from its dispatch prompt plus
  whatever it already fetched.

Related: [[feedback_search_memory_before_accepting_a_tool_failure_as_fatal]] (same "verify, don't
assume" instinct, different trigger),
[[feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see]] (duplicate detection generally).
