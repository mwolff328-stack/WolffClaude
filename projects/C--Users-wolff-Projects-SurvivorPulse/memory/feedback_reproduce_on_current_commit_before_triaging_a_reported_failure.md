---
name: feedback_reproduce_on_current_commit_before_triaging_a_reported_failure
description: A test-failure report from another worktree/session can be stale by the time you triage it — always re-run on the current commit before filing a bug.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 8ea663d2-9268-4eff-a080-3e7451c3d6c2
  modified: 2026-09-12T15:23:42.057Z
---

A bug-triage handoff reported "25 failing tests across 16 test files" from a full `npx vitest run`, with two files confirmed by name: `seasonGridCell.test.ts` (an "Unknown archetype: [object String]" crash) and `heavyContrarianCard.sst1594.test.tsx` (a missing testid). Re-running the exact same two files, and then the full suite, on a DIFFERENT worktree at the IDENTICAL commit hash (`d1218546`) found: both named files pass cleanly (126/126), and the full suite showed only 3 failing files total — all pre-existing DB-integration `ECONNREFUSED` failures already covered by [[project_survivorpulse_sandbox_has_no_local_postgres]], zero relation to cockpit/archetypes. The reported failure had already self-resolved.

Root cause once traced: the failing tests were themselves labeled "SST-1630 follow-up (post-741bfca1)" — proof tests for a fix to a regression that SST-1630's OWN later commits on the same story had already patched (`741bfca1` "critical post-review fixes: Custom archetype crashed...", then `0ce48188`, then `f1485308`). The reporting session almost certainly ran its suite during the narrow window between the regression landing and that story's own follow-up fix landing — both worktrees later converged on the same commit, but the report itself was frozen at an earlier moment.

**Why:** in a repo with dozens of concurrent worktree sessions autonomously pushing multi-slice stories straight to `2026-v1` (see CLAUDE.md's "Autonomous Operation"), a test failure is a snapshot of a specific commit at a specific moment — not a durable fact about the codebase. A story marked "In Progress" in Notion can still have already fixed the exact defect being triaged, via its own later slice.

**How to apply:** before spending triage effort (Notion lookups, multi-persona panels, filing a ticket) on a *reported* failure, re-run the specific failing file(s) fresh, in a live worktree, and confirm the failure still reproduces on HEAD. If it doesn't reproduce: check the git log for that file/area for recent commits mentioning "fix" or "critical" near the reported symptom before concluding it's flaky — it's very likely a since-patched transient regression from a story's own multi-slice landing, not something to file. Only escalate to full triage (survivorpulse-bug-triage skill) once you've confirmed the defect is live on the current commit.
