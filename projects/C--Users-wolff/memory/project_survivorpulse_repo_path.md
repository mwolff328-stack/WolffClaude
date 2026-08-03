---
name: project_survivorpulse_repo_path
description: Canonical SurvivorPulse working repo path + warning about a stray duplicate clone that misleads agents
metadata: 
  node_type: memory
  type: project
  originSessionId: 618da064-d711-4616-b98a-f17121146007
---

The canonical SurvivorPulse working repo (where the founder works and where dev/commits happen) is **`C:\Users\wolff\Projects\SurvivorPulse`**, branch `2026-v1`. Founder confirmed this on 2026-07-06.

**2026-07-14 — canonical is ACTUALLY on 2026-v1 again (was silently wrong for a while).** The repo had been parked on `feat/design-system-foundation`, which made the in-app preview launcher (anchored to this path) serve the WRONG branch and produced bogus verification results. Fixed: canonical checked out `2026-v1`; the DS branch got its own worktree; the temporary `spulse-merge-final` worktree was removed (it was clean + fully pushed, so nothing lost). Worktree map (all share `SurvivorPulse/.git`; a branch can be checked out in only ONE worktree — that constraint is why 2026-v1 had to be released from spulse-merge-final first):
- `Projects\SurvivorPulse` → **2026-v1** (canonical — do work here)
- `Projects\sp-wt-design-system` → `feat/design-system-foundation`
- `Projects\sp-wt-cockpit` → `feat/cockpit-the-call`; `sp-worktree-release2` → `feat/release-2-multipool`; `sp-wt-sst782`/`sp-wt-sst783` → research; `spulse-season-scope-fix` → sst702; `sp-wt-review` → detached

**⚠️ `sp-wt-cockpit` PUSH TRAP — STRUCTURALLY FIXED 2026-07-17 after THREE recurrences.** Its local branch is named `feat/cockpit-the-call` but IS the 2026-v1 line. Bare `git push` used to create a stray `origin/feat/cockpit-the-call` branch (agents "pushed" verified commits nowhere useful three separate times — the third stranded a whole review-fix pass while the deployed app faithfully served the fixless 2026-v1, masquerading as "Replit sync lag"). **Durable fix now in place: `git config push.default upstream` in this worktree** — a bare push targets the tracked upstream (origin/2026-v1) regardless of the name mismatch (the local branch can't be renamed 2026-v1 because that branch is checked out in the canonical Projects\SurvivorPulse worktree — one-checkout-per-branch constraint). Explicit `git push origin HEAD:refs/heads/2026-v1` still works and remains the belt-and-suspenders instruction for agents; verify with `git log --oneline -1 origin/2026-v1`. If the stray branch EVER reappears: check patch-equivalence (`git cherry origin/2026-v1 <tip>`), land anything missing, delete it.

**DS-branch reconcile — MEASURED, conflict is SMALL** (an earlier guess that DS was a "parallel rewrite of the same components" was WRONG; corrected 2026-07-14). merge-base `e3640906`; DS is 20 ahead / 155 behind. DS does NOT touch PoolDataSubSection / HistoryTab / AliveEntriesSummaryTable / TeamPickDataEntry / historical-pool-data.tsx (all verified untouched) — its "migrate HistoryPoolData" commit targets a different legacy file (`components/pool/HistoryPoolData.tsx`, still live, no conflict). Only THREE files conflict:
1. `pages/data-management.tsx` — deleted on 2026-v1 (SST-786) vs migrated on DS -> accept the deletion, DS's work there is obsolete.
2. `pages/picks-management.tsx` — DS DataTable migration vs 2026-v1's 12-line scheduleType fix (4dff345d) -> take DS, re-apply the fix.
3. `pages/pools.tsx` — DS DataTable expandable rows vs 2026-v1's History-missing pill + SST-714 polish + ROI fixes -> the only real reconcile.
Approach: MERGE 2026-v1 into DS (not rebase — rebase replays the delete/modify conflict across commits). Full plan lives in the Notion story "Reconcile feat/design-system-foundation with 2026-v1". FUTURE RISK: migrating the new Historical Pool Data components onto DataTable would regress SST-809's hand-tuned layout (no sticky, no nested v-scroll, h-scroll-in-card, mobile tab sizing) — re-measure at 375/1280 if that wave happens. See [[project_survivorpulse_historical_pool_data]] and [[project_survivorpulse_visual_verification]].

**RESOLVED 2026-07-06:** the stray duplicate clone at `C:\Users\wolff\survivorpulse` (lowercase) has been **deleted** with founder confirmation. It was an independent clone of the same GitHub repo (mwolff328-stack/SurvivorPulse, case-insensitive on GitHub — same remote), not a worktree/symlink. It caused real confusion the night of 2026-07-05/06: many agents worked in it directly (pushing real commits to `2026-v1`) unaware `Projects\SurvivorPulse` was the intended canonical copy, and at least one agent misjudged "which repo is real" by git cleanliness alone. Before deleting, verified all local-only branches in the stray clone (`claude/brave-lumiere-13a476`, `claude/keen-northcutt-2b16a3`, `feat/se-85-make-picks`) were already fully merged into `origin/2026-v1` — nothing unique was lost. Deletion required killing 5 leftover `tsx watch server/index.ts` node processes first (Windows "device or resource busy" on `rm -rf` when a directory has open file handles).

If a lowercase `survivorpulse` clone ever reappears (e.g. an agent re-clones out of habit), treat it the same way: verify it's not uniquely ahead of `origin/2026-v1` before deleting, and always prefer `Projects\SurvivorPulse` as the working copy going forward.

Related: [[project_survivorpulse_local_verification]], [[feedback_survivorpulse_parallel_agents_worktree]].
