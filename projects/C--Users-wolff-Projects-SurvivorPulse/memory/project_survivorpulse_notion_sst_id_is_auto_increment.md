---
name: project_survivorpulse_notion_sst_id_is_auto_increment
description: "On the SP Stories & Tasks board the SST-### number is the system-assigned `userDefined:ID` auto-increment column, not part of the `Item` title — so you cannot pick it, set it, or find it by matching the title."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7bee96fe-5ff1-4875-ae75-e19361b3ff63
  modified: 2026-07-31T00:11:09.700Z
---

On **SP Stories & Tasks** (`collection://35929ce5-833d-8156-9e29-000ba878443c`):

- The SST number lives in **`userDefined:ID`**, type `auto_increment_id` — system-managed and
  read-only. Notion assigns it on create. **Do not invent a number**; just create the page and
  read back what it got.
- The `Item` title contains **no** `SST-` prefix. `WHERE "Item" LIKE 'SST-11%'` returns zero rows
  and looks like an empty board. To find the current max:
  `SELECT "userDefined:ID", "Item" FROM "collection://…" ORDER BY "userDefined:ID" DESC LIMIT 5`.
- Bug titles are prefixed in the body text instead: `BUG: `, `SECURITY: `, `TECH DEBT: `,
  `WATCH ITEM: `, `[DUPLICATE of SST-####] `.
- The whole ticket body goes in the **`Description` text property** using `<br><br>` for
  paragraph breaks and 4-space indent for code; the page content itself is left blank.
- Per the bug-triage skill, leave **`Priority` empty** on create — the triage panel sets it.
  (Some existing Backlog rows already carry a Priority; that is not a reason to pre-set one.)
- `Type` is `Bug` — confirmed again on 2026-07-30, consistent with
  [[feedback_check_distribution_before_inferring_convention]].

⚠️ **Commit refs can be wrong.** Commit `122e7135` cites "SST-1124" but implements **SST-1139**;
SST-1124 is an unrelated, already-Done /terms + /privacy Enhancement. Resolve a cited SST number
against the board before repeating it in a ticket or a commit message — see
[[feedback_survivorpulse_verify_a_deferral_reason]].
