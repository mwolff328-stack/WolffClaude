---
name: feedback_scratchpad_is_shared_across_sessions_append_dont_overwrite
description: "SurvivorPulse's .claude/scratchpad.md is a repo-tracked file shared across every concurrent session's history, not a per-worktree scratch buffer -- using Write to record a Done status overwrote ~270 lines of other sessions' feature history (SST-1630/1631, SST-1512) in one call. Caught before push; append, never Write-replace."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 9993d1e9-832b-4c4b-8899-555d49920869
  modified: 2026-09-30T01:24:15.551Z
---

Writing a scratchpad status update for SST-1757 with the `Write` tool (full-file overwrite) destroyed every prior `## Feature:` block already in `.claude/scratchpad.md` -- unrelated, still-relevant history from other sessions' work (SST-1630/SST-1631's custom-strategy-card entry, SST-1512's portfolio-optimizer entry, and more), in a single call, silently. It was caught only because the next step (a routine rebase) failed on "unstaged changes" and a closer look at the diff showed 270 deletions for what should have been a 30-line addition.

**Why it happened:** `[scratchpad.md rules]` describe it as *this session's* persistent memory ("survives context compaction... read at the start of every session") and say to archive old content, which reads like ordinary single-session scratch state. It is not — it's a single `git`-tracked file at a fixed repo path, and every concurrent SurvivorPulse session (there are commonly 10-40 active worktrees) reads and writes the *same* file. A `Write` call from any one of them replaces the whole shared document, not just "your" section.

**The fix, mechanically:** before writing anything to this file,
1. `git show origin/2026-v1:.claude/scratchpad.md` (or the equivalent for whatever the branch's real base is) to get the current shared ground truth — never trust an in-memory copy read earlier in the session, since another session may have appended since.
2. Prepend your new entry to that content; never call `Write` with only your own entry.
3. If you already made the mistake and haven't pushed: `git commit --amend` with the corrected append-only diff (`git diff --stat` should show insertions only, deletions ~0) rather than leaving the destructive version anywhere in history, even locally, since a stray push or another session reading your unpushed branch could still propagate it.

**Broader pattern:** any file the project's own rules describe as "this session's persistent memory" is worth one `git log`/`git blame` check before assuming it's private scratch space — in a repo built around dozens of concurrent worktrees, "your session's memory" and "a shared tracked file" are not mutually exclusive, and the failure mode (silent full-file replacement) gives no error to catch it at write time.

See [[project_survivorpulse_notion_grooming_property_write_limits_and_safe_recovery]] for the same append-vs-replace hazard on Notion's AC/TC property fields (a different shared-resource, same root cause: an API/tool whose write semantics are REPLACE, not merge).
