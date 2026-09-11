---
name: cass-codex-needs-write-mode-and-quota-budget
description: "Cass (codex:codex-rescue) read-only runs can't read any file on this Windows box; ~10 Cass runs in one session exhausted the Codex quota for ~4h"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fa6cc5d2-cfff-45ad-8b3c-dee81cdfeb44
  modified: 2026-09-11T06:38:50.149Z
---

Running Cass (the Operating Model's adversarial reviewer, `codex:codex-rescue`) with a read-only request makes the Codex job run `sandbox: "read-only"`, and on this Windows machine that sandbox denies **every** file read — the spec file AND the repository ("Access is denied" / UnauthorizedAccessException). The review comes back a hollow "blocked" FAIL. Fix: phrase the forwarded request as "Run this as a write-capable Codex task (use --write) … this is still a REVIEW: do not modify any file", and put the spec inside the worktree's gitignored `tmp/` (e.g. `tmp/cass/spec-SST-XXXX.md`); scratchpad paths outside the repo are also denied.

Codex jobs often return immediately ("started in the background as task-…"). Collect them with a background `node <plugin>/scripts/codex-companion.mjs status <id> --wait --timeout-ms 1500000` then `result <id>`. The stored result is sometimes only Codex's closing summary, not the structured findings.

Quota: 2026-09-11 an sp-autonomous run with five stories (each reviewed + re-reviewed) hit "You've hit your usage limit … try again at 3:53 AM" after ~10 Cass runs, blocking the Ready gate for ~4h.

**Why:** Cass is required at both the Ready gate and In Review on every story, so an unplanned outage stalls the whole pipeline, and a read-only run silently produces no review at all.
**How to apply:** always run Cass write-capable with the spec in `tmp/`; budget Cass passes (batch small stories, fix all reviewers' findings in one round before re-running Cass); if the quota is hit, a clearly-labelled substitute adversarial review on a different model may unblock Ready, but a genuine Codex Cass pass must still happen before Done. Related: [[prefer-notion-oauth-connector]].
