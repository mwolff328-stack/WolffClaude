---
name: feedback_survivorpulse_cass_rounds_converge_by_deleting_mechanisms_not_patching
description: "Grooming an L spec through genuine Cass took 6 rounds (~45 min each incl. agents); it converged only when I DELETED a client mechanism instead of patching it; verify your own decision premises in code; bound Cass with a PASS WITH MINORS rule."
metadata:
  node_type: feedback
  type: feedback
  originSessionId: 16cf4f84-760d-4785-80fa-19543ac4e60f
  modified: 2026-10-02T23:20:48.044Z
---

SST-1797 (2026-10-02): genuine Codex Cass failed the spec FIVE times (r1 0/4/5 major/minor, then new 0/2/2,
0/1/0, 0/1/0, 0/2/0) before PASS WITH MINORS at r6. Each Codex run was 3 to 10 min; the persona
rework between runs was the bulk. Every finding was real and code-derived (several by running the real
season service and the installed query library offline).

**Lessons**
- **Delete, don't patch.** Majors stopped recurring only after I removed the recovery override/release/chain-token
  machinery and let the clock drive. Every bolt-on client mechanism handed Cass a new edge case. If a fix adds
  state, ask whether the state can be derived instead.
- **Verify your own decision premises in code BEFORE issuing a decision.** I told Ann and Vlad the season service
  had "no provenance flag"; Vlad found `SeasonInfo.source` already existed. A false premise cost a whole round.
- **Bound the loop.** Tell Cass up front: only BLOCKER/MAJOR drive FAIL; MINOR-only is PASS WITH MINORS; list accepted
  defaults she must not re-raise; give a closure checklist mapping each of her findings to the resolution;
  narrow each recheck to the delta. Copy resolution docs into `tmp/cass/` (she has no network).
- **Mechanics that worked:** agents edit LOCAL files only; the orchestrator does ONE guarded REST PATCH per
  round (dry-run validates ids/🗣️/size and backs up the live value, write aborts if live != baseline, then
  byte-compare read-back + other properties unchanged); scripted exact-match edits (count==1 assertion) for
  multi-edit passes; `node codex-companion.mjs task --background --write --prompt-file` then a SEPARATE
  tracked `run_in_background` wait (a bare `nohup &` wait gives no completion notification).
- **Resume the same persona agents** (SendMessage) so they keep context; give Ann and Vlad the same decision
  file and tell Vlad to re-read Ann's final AC file before finishing.
Related: [[feedback_cass_codex_needs_write_mode_and_quota_budget]],
[[project_survivorpulse_notion_grooming_property_write_limits_and_safe_recovery]].
