---
name: project-survivorpulse-notion-page-read-truncates-rich-text
description: "mcp__notionApi__API-retrieve-a-page silently TRUNCATES long rich_text properties — a 12,274-char Test Cases field came back as 7,577 chars with no error and no marker. It hid a real, buildable AC clause. Read long properties via the OAuth connector SQL path, or API-retrieve-a-page-property."
metadata: 
  node_type: memory
  type: project
  originSessionId: 21592230-06ea-476f-b7cd-e40061b85574
  modified: 2026-08-21T13:27:05.619Z
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

Do not confuse this with
[[project-survivorpulse-notion-create-comment-write-path-defect]] (a *comment-visibility* issue on
a different connector) or
[[project-survivorpulse-notion-mcp-create-comment-missing-version]] (comment *writes* failing).
This one is about **reads of page properties being incomplete while appearing complete**, and it
is the one that can silently change what gets built.
