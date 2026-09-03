---
name: feedback_edit_tool_writes_back_a_stale_cached_copy
description: Mixing the Edit tool with shell/python rewrites of the SAME file silently reverts the shell edits — Edit applies to its cached copy and writes the whole file back. Pick one mechanism per file.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5d7806f4-5094-4b99-9541-24dcb5291fdd
  modified: 2026-09-03T14:56:26.426Z
---

Editing one file through **both** the Edit tool and a shell rewrite (`python`, `sed`, a heredoc) in
the same stretch of work silently destroys the shell edits. Edit applies its patch to the version
it has cached and writes the **entire file** back, so every change made outside the tool since its
last read is gone. The tool does warn — *"the file had been modified on disk since you last read
it — the edit applied cleanly, but the file contains other changes not in your context"* — but that
reads like a courtesy note, not "I just reverted your migration."

**Measured, SST-1532 (2026-09-03).** A three-call-site component migration was applied with python,
verified green (33/33, including 21 pre-existing tests passing unedited). Then one doc-comment line
was fixed with Edit. That single Edit reverted the whole migration: `OptionRow` was back,
the primitive import was gone. Cost a full redo of the migration.

**Why:** the trap is worse than it looks because the *symptoms lie*. Immediately after, `grep` on
the file returned contradictory results between two consecutive commands (`OptionRow: 1` then
`OptionRow: 0`, `segmented-radio-group: 0` then `: 2`) — Windows filesystem caching plus an
in-flight write. Reading greps as truth sent the diagnosis the wrong way twice, and a `git checkout`
issued to "reset" then failed on a stale `index.lock` and did nothing, which was lucky rather than
correct.

**How to apply:**
- **One mechanism per file per task.** If a file is being rewritten by script, keep using the script
  for every subsequent change to it, comments included. If it is being edited with Edit, don't
  reach for `sed`/python on it.
- **Never trust `grep` alone to confirm a file's state** right after a write, on Windows especially.
  Confirm with `git diff --stat` / `git diff HEAD -- <path>`, or run the tests — behaviour is the
  only reading that doesn't lie.
- **Treat that Edit warning as a stop signal**, not a note. When it appears, diff against HEAD
  before doing anything else.
- Related: [[feedback_concurrent_reviewer_agents_race_on_shared_file_reverts]] and
  [[feedback_parallel_triage_agents_share_the_dispatching_sessions_worktree]] are the multi-agent
  version of the same class — someone else's write landing between your read and your write.
  [[feedback_mutation_harness_edits_the_first_match_not_yours]] is the sibling for scripted edits
  hitting the wrong target rather than the wrong version.
