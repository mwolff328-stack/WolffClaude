---
name: subagent-tmp-path-not-shared-with-orchestrator
description: "A dispatched agent writing a handoff/output file to a bare /tmp/... path is unreachable from the orchestrator's own Bash tool on this Windows box -- /tmp resolves to a Temp dir per-session/per-agent, not a shared filesystem root. Tell dispatched agents to write to the shared worktree or the orchestrator's own scratchpad path instead."
metadata:
  node_type: memory
  type: feedback
  originSessionId: fa6cc5d2-cfff-45ad-8b3c-dee81cdfeb44
  modified: 2026-09-12T09:28:29.447Z
---

A Deb subagent building SST-1634's client slices stopped mid-ticket (session-length guardrail before its final slice) and wrote a detailed handoff document to `/tmp/deb-handoff-sst1634-s11.md`, intending the orchestrator to hand it to a fresh session. The orchestrator's own Bash tool could not find that file anywhere: `cygpath -w /tmp` resolved to `C:\Users\wolff\AppData\Local\Temp`, and a search of that directory (and the worktree) at reasonable depth found nothing. The file the agent wrote and the path the orchestrator can read are not the same filesystem location on this Windows setup — a subagent's `/tmp` is not guaranteed to be the orchestrator's `/tmp`.

**Why:** unclear whether this is per-agent sandboxing, a different shell/container per dispatched Agent call, or something else — but empirically the handoff was unrecoverable.

**How to apply:** when asking a dispatched agent to leave a handoff, artifact, or intermediate file for the orchestrator (or a later agent) to read, tell it explicitly to write inside the shared git worktree (e.g. a scratch file under `tmp/` in the repo, which is gitignored but IS on the shared filesystem both sides can reach) or the orchestrator's own scratchpad directory path (state that exact absolute path in the dispatch prompt) — never a bare `/tmp/...` path. If a handoff does go missing this way, don't try to recover it: reconstruct the context from what IS on the shared filesystem (already-committed code, the standing slice/spec plan files) and redispatch fresh rather than losing the slice.
