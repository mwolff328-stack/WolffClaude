---
name: codex-background-job-state-lost-on-session-restart
description: "A codex:codex-rescue background task's job id vanishes from codex-companion.mjs's registry after a Claude Code session/process restart -- it is not durably tracked, so it must be redispatched from scratch, not resumed."
metadata: 
  node_type: memory
  type: project
  originSessionId: fa6cc5d2-cfff-45ad-8b3c-dee81cdfeb44
  modified: 2026-09-12T06:27:37.919Z
---

Dispatching a `codex:codex-rescue` review as a background Agent returns a job id (e.g. `task-mtx8gbb7-lx2piw`) that the orchestrator is supposed to poll via `node codex-companion.mjs status <task-id>` (the rescue subagent itself is a thin forwarder by design — see [[cass_codex_needs_write_mode_and_quota_budget]] — it kicks off the job and returns immediately, never polling or reporting results itself).

**What actually happened:** a genuine Codex review of SST-1583 was dispatched, confirmed "running" ~45s in via `codex-companion.mjs status <id>`. The Claude Code session then ended (context reset / process restart) before the review finished. On resume in a fresh session, `codex-companion.mjs status <same-id>` returned "No job found," and `codex-companion.mjs status` (no id, listing all jobs) returned "No jobs recorded yet" — the job's existence was completely gone from the registry, not just paused or resumable.

**Why:** the job registry `codex-companion.mjs` reads from is apparently tied to the live process/session that launched it, not a durable cross-process store. A session restart doesn't just lose the orchestrator's polling loop — it loses the job record itself.

**How to apply:** after any session restart (compaction-driven or a hard process exit), before assuming a dispatched genuine-Codex review is still in flight, check `codex-companion.mjs status` fresh. If the job is gone, don't wait for it or try to resume it — redispatch a brand-new `codex:codex-rescue` review from scratch (re-dump the spec to `tmp/cass/final-spec-<TICKET>.md` first, since that file may also be stale from the lost attempt). Budget for this when a long-running Codex review might span a session boundary — there's no way to make the job survive the restart, only to notice quickly and restart it.
