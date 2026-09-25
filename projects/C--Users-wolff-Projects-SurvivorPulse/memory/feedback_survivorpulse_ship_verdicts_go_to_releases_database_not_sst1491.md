---
name: survivorpulse-ship-verdicts-go-to-releases-database
description: "Ship verdicts are records in the Notion Releases database under Product & Engineering, never comments on SST-1491; ids, property schema, and the release-notes voice rules"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 649454c1-f731-4182-8dd5-41f032205354
  modified: 2026-09-25T13:52:43.128Z
---

Post each SHIP verdict as a record in the **Releases** database (Product & Engineering page), NOT as a comment on SST-1491.

**Why:** founder ruling 2026-09-25. SST-1491 is a closed bug ticket (Pre-Publish Gate season time-bomb, Done 8/30) that had become a 40-comment dumping ground. A Done bug never shows up as active, and the verdicts were buried in one thread. He wants each release recorded with release notes and its data.

**Where:** database_id `f79636a6-248d-4c09-95cc-7cabddd4fe1d`, data source `b08f4ddf-e008-4a69-b12d-1bd5e4690db4`, parent page Product & Engineering `2f629ce5-833d-80af-bf8f-ffe402ff1c29`. All 39 old SST-1491 verdict comments (through window 779fe928..5c0a3ac0, 2026-09-25T05:10Z) were migrated as REL-1 to REL-37 (comments 12 to 14 were one report, merged). The originals still sit on SST-1491: the Notion API cannot delete comments, so the founder decides what to do with them. A "Newest first" table view exists.

**How to apply:**
- One record per verdict comment, not per publish. A NOT READY and the READY that follows are separate records. On "Published", update the SAME record (Published, Published at, Publish commit URL, plus a "Publish confirmation" section).
- Properties: Name (title, no date in it), Verdict (select: Ready to publish / Not ready / Retroactive audit / Urgent flag), Reviewed (datetime), Published (checkbox), Published at (datetime), Publish commit (GitHub commit URL), Window ("from..to"), Commits (number), Tickets (relation to SP Stories & Tasks, 35929ce5-833d-8156-9e29-000ba878443c), Touches schema files (checkbox), Original comment (URL), Release ID (auto REL-n, so create in order).
- Body: heading_2 "Release notes" (2 to 4 short paragraphs), heading_2 "Ship verdict" (full audit text).
- Link Tickets to the REAL ticket. Commits often self-label a wrong or nonexistent SST number (a recurring problem), so check titles.
- Release notes are written with the authentic-tone-of-voice and explain-simply skills (founder's explicit instruction). Authentic-tone wins on formatting: prose only, no bullets, no bold, no numbered lists, no em dashes, no emoji, plain words before jargon, state results straight, company "we", "I" only for things the founder himself did. Skill's banned-word list applies.
- Bulk-load pattern that worked (fidelity with no retyping): pull text to files, build blocks in a node script, POST /v1/pages with database_id parent, chunk rich_text under 2000 chars, append children in batches of 100. Templates: the session scratchpad `rel/load.js` and `rel/notes.js` from the 2026-09-25 migration session (may be gone; rebuild if so).
- Notion's page-property API shows only the first 25 relation values; the full set is stored (verified with the property endpoint).
