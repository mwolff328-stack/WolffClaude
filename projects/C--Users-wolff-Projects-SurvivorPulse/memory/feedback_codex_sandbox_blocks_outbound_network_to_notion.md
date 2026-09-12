---
name: codex-sandbox-blocks-outbound-network-to-notion
description: "A codex:codex-rescue job asked to run dump-ticket-spec.mjs itself fails with connect EACCES on port 443 to api.notion.com -- Codex's sandbox blocks outbound network even in write-file mode. Fix: the orchestrator dumps the spec first, Codex reviews the pre-dumped file."
metadata:
  node_type: memory
  type: feedback
  originSessionId: fa6cc5d2-cfff-45ad-8b3c-dee81cdfeb44
  modified: 2026-09-12T08:27:09.220Z
---

Distinct from [[cass_codex_needs_write_mode_and_quota_budget]] (which is about the sandbox denying local FILE reads). This one is about outbound NETWORK access: a `codex:codex-rescue` job instructed to run `dump-ticket-spec.mjs` itself (to fetch a fresh live Notion spec before reviewing it) failed both attempts with `TypeError: fetch failed` / `AggregateError [EACCES]` / `connect EACCES` on port 443 — i.e. Codex's sandbox has no route to `api.notion.com` at all, even when the job is otherwise write-capable. The job correctly self-reported this as a BLOCKER (not a false PASS or a hallucinated review) and wrote an explicit "retrieval-failure marker" file instead of fabricating spec content — that part worked as designed.

**Why:** Codex's sandbox network policy is apparently independent of its filesystem sandbox mode (`--write` fixes local file reads per the other memory, but doesn't grant outbound internet). The Claude Code orchestrator session, by contrast, has working Notion access (MCP or REST) throughout.

**How to apply:** never ask the forwarded Codex task to fetch the spec from Notion itself. Instead, the orchestrator runs `dump-ticket-spec.mjs <notion-page-id> tmp/cass/final-spec-<TICKET>.md` directly (it already has working Notion access), confirms the output looks like real spec content (not a stale/failure marker — check the file for the expected sections), and only then dispatches Codex with instructions to review the ALREADY-PRESENT file at that path, explicitly telling it not to attempt its own fetch. This is also just... the way it was apparently already being done for every other ticket this session (SST-1634/1635/1636/1637 all had pre-existing `tmp/cass/final-spec-*.md` dumps) — this one job's instructions must have asked Codex to do its own dump instead of using a pre-dumped file, which is the actual mistake to avoid repeating.
