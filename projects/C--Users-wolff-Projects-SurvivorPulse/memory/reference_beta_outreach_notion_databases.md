---
name: reference-beta-outreach-notion-databases
description: Location of the Outreach Log and Prospect Tracker Notion databases for SurvivorPulse beta acquisition
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6b6b3cc3-1c3b-4a46-8a74-af381f77aac7
  modified: 2026-09-01T15:03:17.419Z
---

Beta user acquisition tracking lives in Notion under SurvivorPulse > Strategy & Growth > Beta User Acquisition System:

- **1. Prospect Tracker** (https://app.notion.com/p/4e14e6e849e846e396e09ce8b3ac9cf1) — one row per prospect (Status: Identified/Outreach Sent/Responded/Signed Up/No Response/Not Interested; State: Open/Converted/Archived). Data source: `collection://13db2a4d-a30b-404d-b4db-fa9ad846437b`.
- **2. Outreach Log** (https://app.notion.com/p/32f9dbb6c22449a2a880a75dde49f088) — one row per outreach message sent (Framework: Cold DM/Community Post/Re-engagement — revised 2026-08-24, the old Cold Reddit/Discord DM/Cold X DM split was merged into one "Cold DM" option since Platform is already its own column; Response Status: Awaiting/Responded Positively/Responded Negatively/No Response After 5 Days). Data source: `collection://498922d6-8e0d-4ec1-8ec0-95808ef761a2`.

**⚠️ Status and State are INDEPENDENT axes, and querying one without the other gives a wrong answer.** Status tracks the outreach lifecycle; State tracks whether the row is still live. A dead prospect keeps `Status = Identified` forever and is retired by setting `State = Archived`. So:

- A live, never-contacted prospect is **`Status = Identified` AND `State = Open`**. Filtering on Status alone counts archived rows as live — on 2026-09-01 that inflated "never contacted" from the true **34** to **50**, a 47% overstatement, and surfaced long-dead rows as fresh leads.
- Always read the row's **Notes** before recommending a prospect. Archived and held rows carry the reason inline, often founder-directed: out-of-product-scope (`@PeteXU`, college football, no NFL data), stale-source (`u/Traditional-Angle204`, source comment ~10 months old), wrong-target (the 2026-08-08 batch scraped r/survivor, the CBS TV show, not r/NFLSurvivor — caught and archived 2026-08-11), or a dated HOLD with a re-check date (`snydxr`, re-check 2026-09-03). Recommending one of these without reading Notes re-proposes work the founder already declined.
- ICP Match Score is self-reported by whatever sourced the row and is not evidence. The r/survivor batch was scored "High (3-10+ entries)" on pure speculation ("Very likely running multiple pool entries"). Trust a verbatim quote in *Why They're a Fit*; distrust an unsourced adjective.

After sending any beta-acquisition outreach (Reddit DM, Discord DM, etc.), log it in both: update the Prospect Tracker row's Status/Date Contacted/Framework Used, and create a new Outreach Log row with the message text.

**How to apply:** Whenever a DM, reply, or outreach message to a prospective SurvivorPulse user is sent (by the founder or by Claude on the founder's behalf), check whether these logs need updating — don't wait to be asked a second time.
