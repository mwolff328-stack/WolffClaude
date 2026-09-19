---
name: feedback-survivorpulse-hardcoded-notion-page-id-typo-posts-to-wrong-ticket
description: A hand-typed Notion page id in a comment script posted two comments to an unrelated live ticket (SST-1682 instead of SST-1685) and returned 200; look pages up by SST number and read the title back.
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c9ab76e2-3a95-49c9-bce6-b72b1b340791
  modified: 2026-09-19T21:45:32.625Z
---

On 2026-09-19 a routing script hard-coded `S1685 = '3e029ce5-833d-81de-8c3d-c6a5a72adf7d'`. The real SST-1685 page is `...81ca-954e-fa2a7e45c01d`; the typed id was a DIFFERENT, real ticket (SST-1682, the Yahoo-label claim tripwire). Notion returned 200 for both comments, so nothing failed loudly. It was found only when a reviewer (Ann) went looking for the comment and counted zero on SST-1685. Notion's API cannot delete comments, so the two misplaced comments stayed and needed a "please ignore" note.

**Why:** a page id that is real but wrong is indistinguishable from a right one at post time. The Notion database ID lookup by unique_id is cheap and exact.

**How to apply:** never paste a page id from memory or a previous script. Resolve by SST number with `POST /v1/databases/<db>/query` filtered on `ID` `unique_id.equals`, and for any comment that must land somewhere specific, GET the page and print its title/ID before posting (or right after: `GET /v1/comments?block_id=` and count). The helpers `find-sst.js` and `comment-heads.js` (session scratchpad) do this. See [[feedback_resumed_background_agent_can_duplicate_orchestrator_actions]] for the sibling failure of a duplicated post.
