---
name: check-social-listening-staleness-gate
description: One-time check that the new 60-day staleness gate fired in tomorrow's Social Listening Log
---

The sp-social-listening scheduled task (SurvivorPulse Reddit/X sourcing job) runs daily at 5:07am local time and writes an entry to the Social Listening Log in Notion each run. As of 2026-08-19, Rita the Relay implemented a new 60-day staleness gate in that job's Step 6.2: before creating any Prospect Tracker row, it now reads the source comment's own timestamp (not the parent post's) and hard-skips anything over 60 days old, logging a one-line "skipped for staleness" note in the Social Listening Log instead of creating the row. This was implemented after two stale prospects (u/Alternative_Worry101 and u/Traditional-Angle204, both sourced from an October 2025 thread that was ~10 months old) slipped through and had to be manually caught and archived.

Your task: find today's Social Listening Log entry in Notion (it's a database/log under the SurvivorPulse > Strategy & Growth > Beta User Acquisition System area — search Notion for "Social Listening" if the exact path isn't obvious) for the run that just fired at 5:07am today. Check whether:
1. The entry exists (the job ran).
2. It contains any "skipped for staleness" line(s), meaning the gate fired and caught at least one stale item, OR explicitly shows zero staleness skips (meaning nothing stale was scraped today — also a valid, healthy outcome).
3. No new Prospect Tracker rows were created with a Source Post Date older than 60 days before today (spot check a few of today's new "Identified" rows in the Prospect Tracker collection://13db2a4d-a30b-404d-b4db-fa9ad846437b if any exist, comparing Source Post Date to today's date).

Report back concisely: did the gate fire correctly (or correctly find nothing to skip), and is there any sign the 60-day filter is not working (e.g. a new row with an old Source Post Date, or the log missing entirely because the job didn't run). This is a one-time verification — after reporting, no further action needed unless something looks broken, in which case flag it clearly as a bug in Rita's implementation.