---
name: sp-daily-acquisition-brief
description: Nightly SurvivorPulse beta acquisition brief: summarizes today's outreach/signups from Notion and updates the Daily Acquisition Brief + Progress Tracker dashboards. Read-only on outreach — never sends messages.
---

You are running the nightly SurvivorPulse 50-Beta-User Acquisition reporting job. This is a REPORTING-ONLY job: you must NOT send any messages, contact any prospects, or take any outreach action. You only read existing Notion data and write summary rows.

## Databases (Notion API)
- Prospect Tracker: data_source_id 13db2a4d-a30b-404d-b4db-fa9ad846437b, database_id 4e14e6e8-49e8-46e3-96e0-9ce8b3ac9cf1. Fields include: Name (title), State (Open/Converted/Archived), Status (Identified/Outreach Sent/Responded/Signed Up/No Response/Not Interested), Platform (Reddit/Discord/X/Email/Organic), Date Contacted (date), Signup Date (date), Framework Used, Contact Info, Notes, Source Post.
- Outreach Log: data_source_id 498922d6-8e0d-4ec1-8ec0-95808ef761a2, database_id 32f9dbb6-c224-49a2-a880-a75dde49f088. Fields include: Prospect Name, Platform, Framework, Outreach Date (date), Response Status (Awaiting/Responded Positively/Responded Negatively/No Response After 5 Days), Outcome (Signup/Interested (Follow-up Sent)/Declined/Unresponsive), Response Text, Next Step.
- Daily Acquisition Brief: data_source_id 811af450-479a-4e9c-869d-636f6ec438a8, database_id 1176aad9-c2fa-4820-8f8b-2c4984b28dca. Fields: Day (title), Brief Date (date), Signups Today (number), Progress to 50 (number), Target 5 Prospects (rich_text), Outreach Sent Today (number), Response Rate This Week % (number), Community Engagement Notes (rich_text), Win/Loss Notes (rich_text), Blockers / Pivots Needed (rich_text).
- Progress Tracker (Dashboard): data_source_id 78368978-fb49-41e1-9a7e-2f6312fc0136, database_id 7aa38a55-7d91-454d-bbc3-a1c861c5e8f5. Fields: Metric (title), Current Count (number), Target (number), % Progress (number), Channel (select: Reddit/Discord/X/Organic/Overall), Conversion Rate % (number), Notes (rich_text).

Campaign started 2026-08-07 (Day 1). Campaign window is Aug 7 - Aug 24, 2026, target 3 signups/day, overall goal 50 signups.

## Steps

1. Determine "today" as the current local date this job is running.

2. Query the full Outreach Log (paginate with start_cursor if has_more is true) and filter to entries with Outreach Date = today. Count them = Outreach Sent Today. Also compute per-platform breakdown (Reddit/Discord/X counts).

3. Query the full Prospect Tracker (paginate if needed). Filter to prospects with Date Contacted = today (these are today's outreach targets/prospects worked). Separately filter to prospects with Signup Date = today — count = Signups Today. Do NOT trust any old/stale rows — always compute fresh from current data, and be aware some historical Prospect Tracker rows before 2026-08-13 may reference fabricated/unverified prospects per the tracker's "Sourcing Integrity Rule" note; ignore that historical caveat for date-filtered queries since you're only looking at today's real rows anyway.

4. Compute Response Rate This Week %: from the Outreach Log, take all rows with Outreach Date in the trailing 7 days (today minus 6 days through today, inclusive). Response Rate = (count of rows where Response Status is "Responded Positively" or "Responded Negatively") / (total count of rows in that window) * 100. If the window has zero outreach rows, report 0 and note "no outreach in trailing 7 days" rather than dividing by zero.

5. Compute Progress to 50: query the full Prospect Tracker and count ALL rows (any date) with Status = "Signed Up". This is the all-time running total toward the 50-user goal. Also independently cross-check via Outreach Log rows with Outcome = "Signup" — if the two counts disagree, use the Prospect Tracker Status="Signed Up" count as authoritative and note the discrepancy in Win/Loss Notes.

6. Compute Day N: N = (today's date - 2026-08-07) in calendar days, plus 1 (so Aug 7 = Day 1, Aug 8 = Day 2, etc.).

7. Create a new row in the Daily Acquisition Brief database (data_source_id 811af450-479a-4e9c-869d-636f6ec438a8) with:
   - Day (title): "{Month} {Day}, {Year} - Day {N} Acquisition" e.g. "Aug 17, 2026 - Day 11 Acquisition"
   - Brief Date: today's date
   - Signups Today: the count from step 3
   - Progress to 50: the count from step 5
   - Outreach Sent Today: the count from step 2
   - Response Rate This Week %: the value from step 4
   - Target 5 Prospects: list the names/handles of prospects with Date Contacted = today from step 3 (if fewer or more than 5, list what actually happened — do not pad or truncate to force exactly 5). If none, write "No prospects contacted today per Prospect Tracker."
   - Community Engagement Notes: summarize any Notes/Contact Info field content from today's touched prospects that describes community engagement (Reddit thread replies, Discord activity, etc.). If nothing notable is logged, write plainly "No community engagement activity logged today" — do not invent content.
   - Win/Loss Notes: summarize any notable responses today (positive/negative) from the Outreach Log Response Text/Response Status fields for rows with Outreach Date = today or Response Received = today. If nothing notable, write "No notable wins or losses logged today."
   - Blockers / Pivots Needed: check Notes/Contact Info fields on today's touched prospects and today's Outreach Log Next Step fields for any blocker language. If none found, write "No blockers logged today."

8. Update the Progress Tracker dashboard (data_source_id 78368978-fb49-41e1-9a7e-2f6312fc0136) so it stays current:
   - Find the existing "Overall Signups Toward 50-User Goal" row (Channel = Overall) and update: Current Count = the all-time Signed Up count from step 5, % Progress = Current Count / 50 * 100, Conversion Rate % = (all-time Outreach Log rows with Outcome=Signup) / (total all-time Outreach Log row count) * 100, Notes = brief note with today's date and what changed.
   - Find the existing "Reddit Channel Progress" and "X (Twitter) Channel Progress" rows and update Current Count (all-time Signed Up count for that platform) and Conversion Rate % (all-time signups on that platform / all-time outreach sent on that platform * 100) similarly. Leave Target/% Progress as-is unless a per-channel target has since been explicitly defined elsewhere (do not invent one).
   - If Discord or Organic now show any activity (any Prospect Tracker row with that Platform, or any Outreach Log row with that Platform) that didn't exist before, create a new row for that channel following the same pattern as Reddit/X (Current Count = all-time Signed Up count for that channel, Target = 0 unless a real target is defined, Conversion Rate % computed the same way, Notes explaining the numbers and that no per-channel target is defined in the playbook). Use API-query-data-source to check first rather than assuming Discord/Organic rows already exist.
   - Use API-patch-page to update existing rows (query the data source first to get their page IDs by matching Metric title / Channel select value) rather than creating duplicates.

9. Do not send any messages, DMs, replies, or outreach of any kind. Do not modify Prospect Tracker or Outreach Log rows. Do not fabricate any prospect, quote, or event that isn't actually present in the Notion data — if a field has nothing to report, say so plainly.

10. Report back a short summary: Day N, outreach sent today, signups today, response rate this week, all-time progress to 50, and confirmation both the Daily Acquisition Brief row and Progress Tracker updates succeeded.