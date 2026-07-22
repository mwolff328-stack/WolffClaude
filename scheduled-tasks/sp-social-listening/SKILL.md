---
name: sp-social-listening
description: Daily SurvivorPulse social listening summary across Reddit, X, and YouTube — logged to Notion, drafted to email, and shown in chat.
---

You are producing the daily SurvivorPulse social listening report. SurvivorPulse is Michael Wolff's NFL survivor-pool decision-support SaaS. This task runs once a day and has no memory of any other session — do everything below from scratch each run.

## Objective
Check Reddit, X (Twitter), and YouTube for anything posted or newly notable in the last 24 hours that's relevant to SurvivorPulse or NFL survivor/knockout/suicide pools generally — competitor mentions, ICP pain points, pricing chatter, potential leads, or useful market signal. Produce one summary and deliver it three ways (Notion, email draft, chat output). Discord is explicitly OUT of scope for this task (no API connection exists yet) — do not attempt to scrape or check it.

## Step 1: Determine the time window
Get today's date (run `date` via Bash/PowerShell if you need to confirm). Your window is the last 24 hours ending now.

## Step 2: Gather from each platform via Apify
Use the Apify MCP tools (search-actors / fetch-actor-details / call-actor / get-dataset-items). For each actor, call fetch-actor-details first if you're unsure of current input field names — these schemas drift over time.

**Reddit** — actor `harshmaur/reddit-scraper`:
- Run 1: `searchTerms`: ["survivor pool", "survivor pick", "knockout pool", "suicide pool", "PoolGenius", "survivorgrid", "multi-entry survivor", "SurvivorPulse"], `searchPosts`: true, `postedAfter`: (24h ago, ISO date), `maxPostsCount`: 50.
- Run 2: `subredditUrls`: ["https://www.reddit.com/r/survivorpool/", "https://www.reddit.com/r/sportsbook/"], `postedAfter`: (24h ago), `maxPostsCount`: 30.
- Skip comment crawling (keep cost down) unless a post looks highly relevant, then you may fetch its top comments.

**X/Twitter** — actor `apidojo/tweet-scraper`:
- `twitterHandles`: ["PoolGenius", "survivorgrid", "RotoBallerNFL", "VSiNLive"], plus `searchTerms`: ["survivor pool", "#NFLSurvivor", "suicide pool", "knockout pool", "PoolGenius", "survivorgrid", "SurvivorPulse"]. Filter/sort for the last 24 hours, `maxItems` ~50.

**YouTube** — actor `streamers/youtube-scraper`:
- `searchQueries`: ["NFL survivor pool picks", "survivor pool strategy", "knockout pool picks", "best survivor pick this week", "PoolGenius survivor"], recent-first sort, `dateFilter` constrained to the last day if the field allows it (otherwise pull recent-sorted results and manually filter by published date), `maxResults` ~15.

If any actor run fails or returns nothing, note that plainly in the summary rather than failing the whole task — still produce a report for the platforms that worked.

## Step 3: Synthesize
Write one tight summary (under ~500 words), organized by platform, each with a few bullets: what happened, why it matters, and a link. Call out explicitly, in a top "Flags" line: any competitor moves (PoolGenius, survivorgrid, RotoBaller, or new entrants), any recurring ICP pain point or feature request worth reusing in copy, and any concrete lead (someone asking for exactly what SurvivorPulse does). If nothing meaningful surfaced, say so directly in one line — do not pad or invent signal.

Classify the day with one flag: "Nothing notable", "Worth a look", "Competitor move", "Lead or opportunity", or "Urgent" (use "Urgent" only for something a founder would want same-day, e.g. a competitor outage/PR crisis or a hot inbound lead).

## Step 4: Deliver

1. **Notion** — create one page in this exact data source (already created, do not create a new database): data_source_id `7bba5cf1-808c-404c-b11e-234283aef418` (Social Listening Log, under SurvivorPulse > Strategy & Growth > Marketing > Social Media). Properties: `Name` = "Social Listening — <YYYY-MM-DD>", `Date` = today, `Flag` = your classification, `Platforms` = ["Reddit", "X", "YouTube"] (only include platforms that actually returned data). Page content = the full summary.

2. **Email draft** — use the Gmail `create_draft` tool (never send/auto-send — draft only). `to`: ["mwolff328@gmail.com"], `subject`: "SurvivorPulse Social Listening — <YYYY-MM-DD>", `body`: the same summary in plain text.

3. **Chat output** — end your run by outputting the full summary as your final message, so it's visible in the task's completion notification.

## Constraints
- Keep Apify usage lean (the maxItems/maxPostsCount/maxResults limits above are deliberate cost controls) — this runs daily and should stay cheap (roughly $0.25–0.50/run in Apify costs).
- Never fabricate activity — if a platform returns nothing relevant, say so plainly.
- Do not attempt Discord. If you want to flag that Discord monitoring is still pending setup, you may note it once as a one-line aside, not as a recurring complaint.
- Do not send email — draft only, every time.