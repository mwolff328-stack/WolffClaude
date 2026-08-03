---
name: feedback_survivorpulse_semantic_duplicate_guardrails_git_cant_see
description: "Two concurrent sessions independently built the same class of repo-wide guardrail test under different filenames. Git flags zero conflict — the risk is invisible to any git-based check and was only caught by cross-session chat."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 04f02612-ed35-4023-bbf4-50b8e5d49954
  modified: 2026-07-31T05:35:12.440Z
---

On 2026-07-31, two concurrent Claude sessions on SurvivorPulse each independently found that SST-1139's `tests/optimizerRoutesRequireAuthGuard.test.ts` was prefix-scoped (only scanned `/api/optimizer/*`) and had missed real unauthenticated routes outside that prefix. Both reached the identical conclusion — replace it with a repo-wide scan over every `app.VERB` registration in both `server/routes.ts` and `server/index.ts` — and both built one, under different filenames (`tests/routesRequireAuthGuard.test.ts` vs. `tests/apiRoutesRequireAuthGuard.test.ts`), each with its own quarantine/allowlist of the ~55 still-unguarded routes.

**Why this is a distinct risk from a normal duplicate-ticket or stale-branch problem** (see [[feedback_survivorpulse_fetch_and_search_before_work]]): those are caught by `git fetch` or a Notion search before starting. This wasn't. Two *new* files with two *different* names produce **zero git conflict** on merge — both land, side by side, each asserting it is the authoritative guard, with quarantine lists that will silently drift apart the moment either PR's routes change. Nothing in the normal review path (diff, CI, merge conflict) surfaces this; it was only caught because a third session, doing an unrelated sweep, happened to read both files back to back.

**How to apply:**
1. When building a structural/repo-wide test to close a gap a narrower guard missed, before writing it: grep `tests/` for other recent guardrail files touching the same registration pattern (`app\.(get|post|put|patch|delete)` scans, in this codebase's case), not just for the specific routes you're fixing.
2. If you discover a same-class file already exists on a sibling unmerged branch (via cross-session messaging or a shared board), don't silently let both land — flag the collision explicitly (which file survives, what each has that the other lacks) and treat it as a real blocking decision, not a FYI.
3. Two structurally-identical-purpose test files that both pass is not evidence of safety — it's evidence the check that would normally catch duplication (git diff/conflict) doesn't apply to this failure shape. Ask "could a sibling branch have built the same thing under a different name?" explicitly before assuming a clean merge means no problem.

Related: [[feedback_survivorpulse_fetch_and_search_before_work]], [[feedback_source_scanning_guards_need_three_meta_tests]], [[project_survivorpulse_route_auth_is_opt_in]].
