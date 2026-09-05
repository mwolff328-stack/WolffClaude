---
name: feedback_mutation_test_cleanup_needs_a_backup_per_file
description: "A mutation-testing loop that backs up only the file it expects to mutate, then reaches for `git checkout` to restore a DIFFERENT file, destroys that file's uncommitted work — because checkout restores to HEAD, not to \"before this mutation.\""
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 5d7806f4-5094-4b99-9541-24dcb5291fdd
  modified: 2026-09-05T01:56:55.027Z
---

Running a mutation-proof across two files (e.g. a component and its content module) and backing
up only ONE of them — because that's the file most of the mutations target — is a trap the moment
a later mutation targets the SECOND, un-backed-up file. Restoring it with `git checkout -- <path>`
reverts to **HEAD**, not to "the state before this mutation." If that file has uncommitted work
(exactly the case mid-slice, before the commit that would make the mutation-proof itself
meaningful), the checkout silently deletes it.

**Measured, SST-1559 (2026-09-05).** Mutation-proving a Collapsible disclosure required three
mutations: two against `back-tester-lite.tsx` (backed up first), one against
`backTesterLiteCopy.ts` (not backed up — "just a one-line swap, I'll clean it up after"). The
cleanup used `git checkout -- backTesterLiteCopy.ts`. That erased five just-written, uncommitted
`explanation` fields and a new copy export with zero warning — `git checkout` does not ask "are
you sure you want to discard the ONLY copy of this."

**How to apply:**
- **`cp <file> /tmp/name.bakN` for every file any mutation in the loop will touch, before the
  first mutation runs** — not just the file most mutations target. A mutation loop that spans two
  files needs two backups, made at the same time, before any mutation starts.
- **Never use `git checkout -- <path>` to restore mid-slice.** It is only safe for a file that is
  either committed already or has no changes you care about. During active TDD work — which is
  exactly when mutation-proving happens — neither is true. Restore from the backup file instead:
  `cp /tmp/name.bak <file>`, then `diff -q` to confirm it's byte-identical.
- **After any restore, `grep -c` for a token the current slice introduced**, on every file the
  slice touched — not just the one you just mutated. A silent wipe on an unrelated file produces
  no error from the restore command itself; the tell only shows up later; when you go to `git add`
  and get a suspiciously small diff, or a downstream test unexpectedly reverts to red.
- Related: [[feedback_edit_tool_writes_back_a_stale_cached_copy]] is the sibling trap — a
  different tool (Edit vs `git checkout`), the same root cause: a destructive write path being
  applied to a file whose current, uncommitted content the operator was not holding onto.
