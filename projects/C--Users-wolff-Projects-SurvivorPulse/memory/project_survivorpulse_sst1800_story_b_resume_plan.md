---
name: project_survivorpulse_sst1800_story_b_resume_plan
description: "Resume plan for SST-1800 (Story B, Apply modal duplicate-picks approach picker UI): spec is final in Notion, build in 6 pieces (S6-S11), founder is metering weekly tokens, backend SST-1799 is Done."
metadata:
  node_type: memory
  type: project
  originSessionId: 190c9fe3-bd35-435e-88be-192c198695c5
  modified: 2026-10-05T15:22:43.882Z
---

**State at 2026-10-05:** Story A (SST-1799, backend) is Done and pushed (d89d65b4..ef106e81, final gate green). Story B (SST-1800, UI) is **Ready**, size L, spec final in its Notion PROPERTY fields (Description, Acceptance Criteria, Test Cases) and body (Deb UI spec, Sky copy). Notion page: 3ee29ce5-833d-8153-837d-f06d1418ba6d. Resolve by SST-1800 and read the title back before writing.

**Founder constraint (2026-10-05):** weekly token budget is limited; wants the work split into pieces he can pause between, decided piece by piece ("start Piece 0, see where that leaves me"). Cost-cut rules he approved: one builder agent per piece with a stop rule, one independent code review per piece, the real Cass + Vlad + Ann run ONCE at the end, no security/Stan re-runs unless a piece adds new risk, Deb visual check only for S9 and S10, spec edits made by the orchestrator in targeted changes (not agents rewriting files).

**Pieces (Felix plan, about 22h):** S6 content files approachCopy.ts + approachClampCopy.ts, sst1757 scan registration, NEW completeness scan (2h); S7 extend useUserDistinctnessPreferences (single-flight PUT, saved-value key, preferenceSettled, unconfirmed state) + useCockpitRecommendation key + game-plan defaults (5h); S8 approach on AutoAllocationRun at ApplyBar ~499 + loader autoAllocationRunStorage ~174 + statusTextFor taper tie text (2h); S9 ApplyBar picker/toggles/notices/summary (6h, Deb); S10 new ClampDot + ProposedSeasonGridCell + NEW WeekViewSection mount (3h, Deb); S11 Playwright against deployed dev API + final reviews + Done (4h). S6-S8 are invisible to users; S9 is the visible feature.

**Locked design decisions (from 3 Cass spec rounds):** NO debounce/queue (single-flight save, 15s timeout, picker disabled while saving); a failed save is UNCONFIRMED and is never confirmed via the preferences GET (it fails open: HTTP 200 defaults); only a 2xx PUT body (strict re-read) confirms; cockpit query key uses SAVED values only and adds the approach only under a taper; settled needs a successful non-placeholder plan; spread DOM byte-identity applies to LEGACY subtrees only (the picker section is new); radio group has ONE tab stop. Known residual R-B1 (late commit of an abandoned PUT, no server revision fence) is accepted; follow-on backend ticket not yet filed.

**Process traps that bit this effort:** (1) The Bash tool eats one level of backslashes: never put a backslash in a command, write scripts with the Write tool. (2) A pre-publish gate failure on a prior push is a hard stop: diagnose first. Two CI-only failures were missed by local targeted runs (an SST-1332 arity guard and the SST-1219 NUL tripwire): run the full unit suite in shards locally (`--shard=N/8`, tmp/run-shards.sh pattern, DB-needing suites fail locally by design) before pushing. (3) Pre-publish gate runs one at a time; a queued run can be cancelled by a newer push, find the latest COMPLETED run. (4) Codex (Cass) quota is separate and can run out for hours; read the job log for the reset time. (5) Spec files live in the worktree's gitignored tmp/grooming and may vanish: the Notion fields are the source of truth. (6) Never leave a mutation proof in the tree: `git checkout --` the file and verify `git status`.

**Next action:** ask the founder which pieces to run this week; start at S6 (lowest risk). Related: [[feedback_survivorpulse_cass_rounds_converge_by_deleting_mechanisms_not_patching]], [[project_survivorpulse_prepublish_gate_mechanism]].
