---
name: project_survivorpulse_se91_batch2_outcome
description: "SE-91 batch 2 (SST-959/960/961/962/967) outcome + the defect patterns that took 15 review rounds: hollow fixtures, user-scoped counts describing pool-scoped actions, precedent transfer without the backstop"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8f10d85a-d2da-48f8-95e3-32dc4aa42a12
  modified: 2026-07-23T11:17:04.004Z
---

**All 5 shipped to `2026-v1` 2026-07-23, 17 commits, `5ad95ad7`..`1105e3ab`.** Review rounds: 967 = 1, 959 = 2, 961 = 3, 960 = 4, 962 = 5. **Every story failed its first review on something real.** No story was Done without an independent mutation-testing review passing.

## The three defect patterns worth remembering

**1. A client number describing a server action, derived from a different predicate.** SST-962's worst class, found on THREE surfaces (pool-wide, per-week, then inside the fix's own fallback). The confirmation counted the caller's OWN entries (user-scoped cockpit DTO) while the request hit a POOL-scoped route where `canWriteEntry` returns true for every entry when `role === 'ADMIN'`. **The founder is an admin**: dialog said "3 entries", server would delete every member's picks, on an irreversible action.
- **Rule: when a client number describes a server action, both must derive from the SAME predicate** — not two sources that agree in the common case.
- Watch `canEditPoolSettings` (creator OR admin) vs `role === 'ADMIN'`. Using the former *overstates* for a non-admin creator. Both directions are wrong on a destructive control.

**2. Precedent transfer without the backstop.** The round-4 blocker was justified by citing the at-cap pre-check's "undercount is the safe direction". That holds there because the server's 409 REFUSES the action. On a destructive confirmation the server says yes and deletes more than shown. **The direction that is safe when the server says no is the dangerous one when the server says yes.** When copying a safety argument, check the backstop came with it.

**3. Hollow instruments** — see [[feedback_survivorpulse_hollow_fixtures]] for the fixture form. Two more forms found here:
- **Hollow PATTERN** (not fixture): a source-text regex whose assertion is real but whose match cannot fail. `[\s\S]*?` spanned a whole file and matched a style line 1000 lines away; the bounded `[^;]*?` retry was defeated by a COMMENT one line above, because `String.match()` returns the FIRST match. **Three rounds of tightening failed; one behavioural assertion closed it permanently** (render, stub `clientWidth`, fire scroll, assert which weeks were fetched) — and survived helper-extraction into another module, which defeats any regex.
- **Hand-enumeration cannot converge.** Four rounds of hand-listing ungoverned copy strings produced four incomplete lists; the last gap sat 17 lines from the string just fixed. Fix: a walker over exported copy modules so a NEW export fails by default. **Prove the META-property (a new thing fails by default), not the instances.** Residual: the walker is O(exports), not O(branches).

## Process facts
- **Mutation testing is the review standard.** Reviewers BUILD and RUN mutants. Reviewers writing mutants must run in `isolation: "worktree"` — they write to the tree exactly like builders do. `npm install` per worktree (node_modules not shared).
- **Strongest proof of a fix**: revert the production code, keep the new tests, watch them go RED with the exact defect text. Or extract the pre-fix test file from git and run the post-fix mutant against it.
- **`retry: false`** (`client/src/lib/queryClient.ts:130`) means an errored query is STICKY, not transient. Any "brief loading window" argument is wrong for error states.
- Reviewers repeatedly caught agent self-reports being stale (Felix's "isSettled has no consumer" was true when written, false 40 min later — I filed a whole story off it). **Re-verify cross-story claims against origin/HEAD before acting.**
- I propagated TWO false claims from reviewers without checking (`$NaN` on a decimal column; "teams/usage self-heals via finite staleTime" when the global default is Infinity). One got written into a code comment in good faith. **Check a claim before relaying it.**

Related: [[feedback_survivorpulse_hollow_fixtures]], [[feedback_survivorpulse_parallel_agents_worktree]], [[project_survivorpulse_gameplan_se91_enhancements]]
