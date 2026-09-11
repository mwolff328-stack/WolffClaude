---
name: project-survivorpulse-notion-page-read-truncates-rich-text
description: "Notion reads of long rich_text properties can be silently incomplete: API-retrieve-a-page caps at ~25 elements (a 12,274-char field read as 7,577), and double-encoding an already-URL-encoded property id (Description = w%40vr) on the property endpoint returns ONLY the first segment — two agents then 'restored' intact Descriptions and destroyed them (2026-09-11). Verify length via a second read path before any rewrite."
metadata: 
  node_type: memory
  type: project
  originSessionId: 21592230-06ea-476f-b7cd-e40061b85574
  modified: 2026-09-11T07:41:37.098Z
---

`mcp__notionApi__API-retrieve-a-page` returns at most ~25 `rich_text` elements per property.
Longer properties come back **silently truncated** — no error, no `has_more`, no ellipsis. The
JSON looks complete and parses fine.

Measured on SST-1424, 2026-08-21:

| Property | Via `API-retrieve-a-page` | Actual |
|---|---|---|
| Test Cases | 7,577 chars | **12,274 chars** |
| Acceptance Criteria | 11,987 chars | 11,987 chars (complete) |
| Description | 10,435 chars | 10,435 chars (complete) |

The truncated read ended at a clean paragraph boundary mid-`TC-A1.5`, so it read as a complete,
well-formed field. Nothing about it looked wrong.

**What it cost:** the missing tail contained a real, buildable requirement —
`TC-A2.8`'s closing clause *"Strip comments before the absence half, per TC-A1.5"* — plus
several `TC-A1.x` corrections. It was built only because a QA agent fetched the ticket
separately and quoted a sentence that was not in the text the orchestrator was working from.
Without that second read it would have shipped as a silent miss, and the ticket's own AC→test
audit would have passed, because the requirement was invisible on the side doing the auditing.

## What to do

**Best: read it through the OAuth connector, not the REST page endpoint.**
`mcp__d77c6777-...__notion-query-data-sources` runs SQL over the data source, so `LENGTH()` and
`SUBSTR()` give you the true size and let you page through a long property in chunks. The A1
session used exactly this and was never bitten — it reported 7,577 before their edit and 12,274
after, both accurate, and reconstructing the field from two SUBSTR chunks lost nothing. That is
the reliable reader for long properties, and it is the actionable half of this memory.

- For any property that might be long — **Description, Acceptance Criteria, Test Cases on a
  Size L/XL story** — read it with `API-retrieve-a-page-property` (needs `page_id` +
  `property_id`; property ids come from `API-retrieve-a-data-source`). It paginates properly
  via `start_cursor` / `has_more`.
- Cheap detection without a second call: if a grooming property's text **ends mid-section or
  without the closing/summary paragraph you'd expect**, suspect truncation rather than a thin
  ticket. A groomed SurvivorPulse story almost always ends with a labeling/binding-rules note.
- Cross-check the length against a later read. `API-patch-page`'s response returned the field in
  full, which is how the discrepancy surfaced at all.

## Second trap: double-encoding the property id (2026-09-11)

Property ids come back from the API **already URL-encoded**. The Description property on SP Stories &
Tasks has the id `w%40vr`. A script that calls
`/v1/pages/{id}/properties/${encodeURIComponent(propId)}` double-encodes the `%`, and Notion returns
**only the first rich_text segment**. There is no error and `has_more` comes back false. Use
`encodeURIComponent(decodeURIComponent(propId))`.

Measured: SST-1583's Description was not edited between 06:48 and 07:31Z. It read as 1,859 chars
through the buggy path and 9,376 through the fixed one. The AC and Test Cases ids have no `%`, so only
Description was hit. That made it look like a data problem rather than a read problem.

**What it cost:**
- Two round-4 Ann agents were told to read the Descriptions through that script.
- Both concluded the *stored* text had been truncated by an earlier write, and rewrote it.
- SST-1636's 13,068-char reviewed Description became 5,391 chars.
- SST-1635's reviewed text was replaced by a 26,970-char "reconstruction" from comments.
- Every substitute adversarial review that session had also seen only the first segment.
- Recovery depended on luck:
  - SST-1636 came back from a raw page GET JSON an agent happened to leave in the scratchpad;
  - SST-1635 came back from the round-3 edit script's output file in `tool-results/`.
- A third agent (SST-1634) noticed the 18-char Description and wrote its own fixed dumper. That is the
  only reason its Description survived.

**How to apply:**
- Before handing agents a read tool, prove it round-trips a known-long field. Compare against a page
  GET or the OAuth SQL `LENGTH()`.
- Tell any agent that rewrites a whole property to confirm its read length against an independent read
  path first.
- Never let an agent "restore" content it believes was lost until the loss is proven by a second read
  path. The destructive write here was a *repair* of damage that did not exist.

Do not confuse this with
[[project-survivorpulse-notion-create-comment-write-path-defect]] (a *comment-visibility* issue on
a different connector) or
[[project-survivorpulse-notion-mcp-create-comment-missing-version]] (comment *writes* failing).
This one is about **reads of page properties being incomplete while appearing complete**, and it
is the one that can silently change what gets built.
