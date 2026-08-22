---
name: reference-beta-outreach-notion-databases
description: Location of the Outreach Log and Prospect Tracker Notion databases for SurvivorPulse beta acquisition
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6b6b3cc3-1c3b-4a46-8a74-af381f77aac7
  modified: 2026-08-22T23:30:18.415Z
---

Beta user acquisition tracking lives in Notion under SurvivorPulse > Strategy & Growth > Beta User Acquisition System:

- **1. Prospect Tracker** (https://app.notion.com/p/4e14e6e849e846e396e09ce8b3ac9cf1) — one row per prospect (Status: Identified/Outreach Sent/Responded/Signed Up/No Response/Not Interested; State: Open/Converted/Archived). Data source: `collection://13db2a4d-a30b-404d-b4db-fa9ad846437b`.
- **2. Outreach Log** (https://app.notion.com/p/32f9dbb6c22449a2a880a75dde49f088) — one row per outreach message sent (Framework: Cold Reddit/Discord DM/Community Post/Re-engagement; Response Status: Awaiting/Responded Positively/Responded Negatively/No Response After 5 Days). Data source: `collection://498922d6-8e0d-4ec1-8ec0-95808ef761a2`.

After sending any beta-acquisition outreach (Reddit DM, Discord DM, etc.), log it in both: update the Prospect Tracker row's Status/Date Contacted/Framework Used, and create a new Outreach Log row with the message text.

**How to apply:** Whenever a DM, reply, or outreach message to a prospective SurvivorPulse user is sent (by the founder or by Claude on the founder's behalf), check whether these logs need updating — don't wait to be asked a second time.
