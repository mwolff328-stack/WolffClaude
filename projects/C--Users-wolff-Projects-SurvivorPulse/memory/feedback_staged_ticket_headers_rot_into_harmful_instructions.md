---
name: feedback-staged-ticket-headers-rot-into-harmful-instructions
description: "A pending-notion-tickets staging file's STATUS header is the first thing to go stale and the last thing anyone re-reads — and when it does, its instructions invert from useful to actively harmful (duplicate tickets, dead SHAs)."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f99d0a63-4af6-4f8c-b996-d3e14dec4463
  modified: 2026-08-03T02:41:26.847Z
---

When the Notion connector is unauthorized, SurvivorPulse sessions stage ticket
content in `pending-notion-tickets/*.md` (the SST-1147/1148 convention). Those
files carry a **STATUS header with instructions for whoever posts it**. That
header is the part most likely to become false, and the part nobody re-reads.

**Twice in 48 hours, two different sessions:**

- **SST-1211 (2026-08-01).** The header warned that its own SHAs would go stale
  after a rebase. The work was then rebased and pushed — and the warning itself
  went stale in exactly the way it warned about, inverting from "not landed yet"
  to a false claim that nothing shipped, under different commit numbers. Caught
  by a peer session reading the file on `2026-v1` days later.
- **SST-1232 (2026-08-02).** The header read "STATUS: NOT YET POSTED" and
  instructed the reader to **create the story**. A peer session with the
  connector did exactly that. From that moment the instruction produced a
  **duplicate ticket** for anyone else who followed it. Corrected in place.

The pattern is not "docs go stale". It is sharper: **a staging file's header is
imperative**, so when it rots it does not merely mislead, it directs someone to
take a wrong action.

## How to apply

1. **Cite commits by SUBJECT, never SHA.** A rebase rewrites every hash. Give a
   re-derivation command instead:
   `git log --oneline --grep='SST-1234' origin/2026-v1`
2. **The moment the ticket is created, the header must change.** If another
   session posts it for you, updating the file is part of that handoff — treat a
   "posted as SST-####" reply as a work item, not a notification.
3. **Correct in place and leave the old text visible**, with why it inverted.
   Deleting it loses the evidence that this keeps happening; the visible
   correction is what makes the pattern reviewable.
4. **Never write a status line whose failure mode is a destructive action.**
   "Create the story" is imperative and unconditional. Prefer a guarded form —
   "if no SST-### appears below, create the story" — so the stale version is
   inert rather than harmful.
5. If a landing freeze is in force, a docs-only correction is still usually worth
   landing when the stale text would cause a duplicate ticket or a wrong revert —
   but **say so to the freeze holder, with the reason and the fact that the gate
   SHA was or was not already superseded**. Don't land it silently.

---

**Disambiguation (2026-08-02):** don't conflate this with
[[project_survivorpulse_notion_create_comment_write_path_defect]]. Checked both cited incidents
directly — SST-1211 was SHA staleness after a rebase, and SST-1232's ticket genuinely existed (a
different session holding a valid connector posted it; only the header was stale). In both, the
underlying write **succeeded**. The write-path defect is a different animal: the tool call itself
returns a fabricated success with a phantom ID and nothing ever lands, confirmed only via a direct
fetch of that ID. Don't let one explain away the other.

Related: [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]],
[[project_survivorpulse_notion_sst_id_is_auto_increment]],
[[feedback_local_run_differs_from_ci_by_construction]],
[[project_survivorpulse_notion_create_comment_write_path_defect]]
