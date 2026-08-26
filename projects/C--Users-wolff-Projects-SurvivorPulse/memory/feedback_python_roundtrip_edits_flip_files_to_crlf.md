---
name: feedback_python_roundtrip_edits_flip_files_to_crlf
description: Editing a source file via a Python read/write round-trip on Windows silently converts the WHOLE file LF->CRLF; git diff hides it and only on-disk source-shape guards notice
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b887184b-07be-494e-b087-de5499d4c614
  modified: 2026-08-26T12:49:42.694Z
---

Editing repo files with `io.open(p, encoding='utf-8').read()` then
`io.open(p, 'w', encoding='utf-8').write(s)` on Windows rewrites **every line
ending in the file** from LF to CRLF. `newline=None` translates `\r\n` to `\n`
on read and `\n` back to `os.linesep` on write, so a three-line edit silently
reformats a 1,500-line file.

**Why:** it is invisible exactly where you would look. `git diff --stat` showed a
clean `190 ++++` because git normalises line endings on diff. The only signal was
git's own stderr line, `warning: in the working copy of '<file>', CRLF will be
replaced by LF the next time Git touches it`, which scrolls past with the
output you actually asked for. Four files were converted before anything noticed.

What noticed was a **source-shape test**: `src.indexOf('usedTeams: resolveUsedTeamsAsOfWeek(\n')`
returned -1 because every line now ended `\r\n`. So the damage surfaces only in
guards that read source text off disk, and it surfaces as a confusing
"the call site must exist: expected -1 not to be -1" that reads like a real
refactor break. See [[project_survivorpulse_ca1_snapshot_crlf_churn]] for the
sibling trap in CA1 snapshots (different cause, same symptom class), and
[[feedback_survivorpulse_source_text_guards_fooled_by_text]].

**How to apply:**
- Prefer the Edit/Write tools for source edits. Reach for a Python round-trip
  only for genuinely mechanical multi-site rewrites.
- When a round-trip is the right tool, open in binary and preserve endings, or
  convert back afterwards: read `rb`, `b.replace(b'\r\n', b'\n')`, write `wb`.
- **Read git's stderr warnings**, do not filter to just `--stat`. A
  `CRLF will be replaced by LF` line naming a file you just edited is the tell.
- Verify before committing: `grep -c $'\r' <file>` should be 0 in this repo, and
  `git diff --stat 2>&1 | grep "CRLF will be replaced"` should print nothing for
  files you touched.
