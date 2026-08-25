---
name: project_survivorpulse_notion_select_options_not_autocreated
description: "Notion rejects unknown select values on page writes rather than auto-creating options, and the ALTER COLUMN fix replaces the entire option set."
metadata: 
  node_type: memory
  type: project
  originSessionId: 57653058-040e-4969-b809-27c30e6a84fc
  modified: 2026-08-25T17:03:47.263Z
---

Writing an unknown select value to a Notion page **fails** with `validation_error` ("Value must be one of the following: …"). Notion does **not** auto-create the option. Confirmed live 2026-08-24 writing `Framework = "Cold X DM"` to the SurvivorPulse Outreach Log.

`sp-social-listening/SKILL.md` claimed the opposite in two places ("add them via the page write, Notion will create the option") for the Social Listening Log `Platforms` and Prospect Tracker `Platform` properties. Both were corrected 2026-08-24. Until then it was a latent bug in a 5am unattended cron: the first Substack/Medium/Discord prospect would have failed the Prospect Tracker sync.

**The fix has its own footgun.** Add options with `notion-update-data-source`:
`ALTER COLUMN "Framework" SET SELECT('Existing A':orange, 'Existing B':blue, 'New One':purple)`
That statement **replaces the entire option set**. Omit an existing option and it is stripped from every row already using it — silently, with no error. Always `notion-fetch` the data source first and re-list every current option with its exact name and color, rather than trusting a list written down anywhere (including here).

**Renaming an option is not possible through either tool.** `mcp__notionApi__API-update-a-data-source` accepts a properties payload with an existing option's `id` and a new `name`, returns HTTP 200 with the full data-source object — and the option comes back **unchanged**. It silently ignores the rename while honoring option *removals* in the same call, so the response looks like success. Verified 2026-08-24. Consequence: there is no cheap rename path, and collapsing options means updating every row individually (51 page writes in that session). Always read the returned option list in the response body rather than trusting the 200.

**Why:** the failure mode is asymmetric. The write rejection is loud and obvious; the option-stripping is silent and destroys data across rows you never touched.

**How to apply:** before writing any new select value, fetch the data source, confirm whether the option exists, and if not, ALTER with the full current set plus the addition. Afterwards verify by grouping rows by that property and confirming the blank count did not increase — that is the only check that catches a stripped option. Related: [[project_survivorpulse_notion_page_delete_path]] for the other Notion API gap.
