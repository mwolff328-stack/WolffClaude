---
name: feedback_proving_a_change_is_comment_only
description: A +/- comment-prefix filter proves comment-only for edits but NOT for moves — diff re-emits surrounding code on both sides; strip comment-only lines from both versions and compare instead.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 066c9c89-8b11-4632-8f1b-4c9983b1b616
  modified: 2026-08-01T21:30:02.639Z
---

To claim a commit is comment-only, the obvious check is to filter the diff's `+`/`-`
lines and confirm every one starts with `*`, `/**`, `*/` or `//`. That is sound for
in-place edits. **It silently fails when a comment block MOVES**, because git
represents a move by re-emitting the code it moved past on both sides of the diff.

Hit on SurvivorPulse 2026-08-01 (SST-1007, commit c50b13b3). Relocating a ~60-line
JSDoc block past `poolWeekRecommendations` made the filter report ~40 "non-comment"
lines — the entire function body, identical on both sides. Read literally it says
the commit touches code. Read correctly it says nothing at all. The same filter had
been legitimate evidence one commit earlier (e33df5ef), where the edits were
in-place, which is exactly what made the false alarm confusing.

The proof that works for both cases: strip every comment-only line from the old and
new versions and diff the remainders.

```bash
git show HEAD:path/f.ts | grep -vE '^[[:space:]]*(\*|/\*\*|\*/|//)' | grep -vE '^[[:space:]]*$' > /tmp/before.txt
grep -vE '^[[:space:]]*(\*|/\*\*|\*/|//)' path/f.ts | grep -vE '^[[:space:]]*$' > /tmp/after.txt
diff /tmp/before.txt /tmp/after.txt && echo "IDENTICAL — provably comment-only"
```

It reported 230 code lines each, identical — a positive result about the whole file,
not an absence of evidence in a diff.

**Why:** the two checks answer different questions. The diff filter asks "did any
changed line look like code?", which conflates *changed* with *moved*. Stripping asks
"is the code the same?", which is the actual claim. Only the second survives a move,
and comment-relocation is common in this repo's `docs(...)` commits.

**How to apply:** if the change only edits comments in place, the diff filter is
fine. The moment a block moves, is merged, or is reordered, switch to
strip-and-compare — and report the code-line count on both sides, since that is the
evidence. A line-anchored filter that flags code you know you did not touch is a
signal the method is wrong, not that the change is.

Related: [[feedback_confirm_the_check_covers_what_you_changed]] (a green check whose
include globs miss your files), [[feedback_proving_a_test_is_load_bearing]] (printed
invariants proving a revert or mutation actually landed).
