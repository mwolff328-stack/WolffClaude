---
name: notion-grooming-property-write-limits-and-safe-recovery
description: "SST-1583: a grooming property (Test Cases/AC/Description) was destroyed twice by partial update_properties writes; REST caps a write at 100 items x 2000 chars, the hosted MCP path does not carry formatting through REST; the guarded single-atomic-write recovery procedure that worked"
metadata:
  node_type: memory
  type: project
  originSessionId: fa6cc5d2-cfff-45ad-8b3c-dee81cdfeb44
  modified: 2026-09-25T17:55:34.581Z
---

**Facts (2026-09-13 to 2026-09-25, SST-1583):**
- `notion-update-page` `update_properties` REPLACES the whole property value; an agent that "patched" Test Cases in 4 partial calls left a 15K-char fragment of a 200K-char property. A 2026-09-22 human-readable (🗣️) backfill then did the same again. Nothing in the tool warns you.
- The public REST API rejects a rich_text write with more than **100 items** or any item over **2000 chars** (400), so one atomic REST write holds at most 200,000 chars. The hosted MCP tool wrote properties with 499 segments and single segments over 18K chars, but only by the model emitting the full text in one call, which is why agents fell into partial writes.
- REST cannot carry Notion formatting on a big property: AC had 239 inline-code spans, so a REST rewrite turns them into literal `backticks`. Description and AC are plain text otherwise (only accidental auto-links on names like `testing.md`).
- The AC/TC text is agent-facing; the 🗣️ lines are the human layer (Operating Model, 2026-09-22).
- Local backups in Temp get cleaned (~10 days); the durable copy that saved the day was the earlier session's saved tool-results under `~/.claude/projects/<worktree>/<session>/tool-results/` (full-page reads), plus the corrupting agent's own PowerShell edit scripts inside `auto-mode-classifier-error.txt`, which let the lost r11 edits be re-applied exactly (length matched to the char).

**Safe procedure (worked, 6 writes, all byte-verified):** never let agents write Notion properties. Agents edit LOCAL files with the Edit tool (surgical old->new); the orchestrator validates (ids present/ordered, a 🗣️ line above every entry, size <= 199,000, no dropped AC refs/file names) and does ONE atomic REST PATCH per property from a script that (1) aborts unless the live text still equals the frozen baseline, (2) checks <=100 items and no split surrogate pair (emoji), (3) reads the property back and compares byte-for-byte. Dry-run first. Copy backups to `~/.claude/backups/<ticket>/`, not Temp.

**Why it matters:** a spec at 195K+ of a 200K ceiling (SST-1583's Test Cases) cannot take new TCs without cuts; budget space before adding, strip revision-history provenance (it belongs in comments), and put build-time findings in comments.

**How to apply:** any grooming round on an XL ticket, any agent brief that mentions writing Notion properties, any "restore/fix Test Cases" task. See [[project_survivorpulse_notion_page_read_truncates_rich_text]] and [[feedback_survivorpulse_hardcoded_notion_page_id_typo_posts_to_wrong_ticket]].
