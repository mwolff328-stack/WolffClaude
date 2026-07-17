# Plan and Board Must Describe the Same Project

**Extracted:** 2026-07-17
**Context:** On Jul 17, 2026 the active SurvivorPulse Weekly Plan listed a Primary Outcome naming three V1 components (#369, #374, #375) that no longer existed anywhere in the current backlog. The real beta work was a different six-item set due Jul 31. The plan and the board had silently drifted into describing two different projects, and every status brief built on top of them inherited the contradiction.

## Problem

When a plan names deliverables by ID and those IDs are later renamed, split, closed, or replaced on the board, nothing forces the plan to update. The plan keeps pointing at ghosts. Any status report that reconciles "plan vs actual" then compares against a target that no longer exists, so it either reports false progress, false misses, or quietly picks one source and hides the conflict. This is a definition-of-done defect, not a reporting bug: you cannot know whether work is done when the plan and the board disagree on what the work even is.

## Solution

Before generating any status, standup, or planning output, cross-check the plan's named deliverables against the live board. For every item the plan references by ID or title, confirm it still exists and is still open on the board. If a referenced item is missing, treat that as a first-class finding and surface it at the top: "the plan references #369, #374, #375, which are not in the backlog; the actual open beta work is [list]." Do not silently reconcile to one source.

Make plan-to-board reconciliation a required preflight step, the same way `scheduled-task-connector-preflight` gates on connector health. A plan that references dead IDs should block the brief from claiming any progress until a human reconciles the two.

Verification is objective: pull the set of IDs named in the plan, pull the set of open IDs on the board, and diff them. A non-empty "in plan, not on board" set is the alarm.

## When to Use

Applies when writing or revising any skill that reports progress against a plan, or that plans a sprint or week; whenever a plan references work items by ID or name; and whenever the plan and the board have not been reconciled in the same session. Especially important for long-running efforts where the backlog churns underneath a static plan.

## Related

`status-reports-must-diff-not-restate` (the sibling failure: reporting state instead of change), `red-ci-blocks-shipping`, `scheduled-task-connector-preflight` (the preflight pattern to copy).
