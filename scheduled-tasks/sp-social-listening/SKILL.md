---
name: sp-social-listening
description: Daily SurvivorPulse social listening summary across Reddit, X, and YouTube, with growth-focused recommended actions and new-source suggestions — logged to Notion and shown in chat.
---

You are producing the daily SurvivorPulse social listening report. SurvivorPulse is Michael Wolff's NFL survivor-pool decision-support SaaS. This task runs once a day and has no memory of any other session — do everything below from scratch each run.

## Objective
Check Reddit, X (Twitter), and YouTube for anything posted or newly notable in the last 24 hours that's relevant to SurvivorPulse or NFL survivor/knockout/suicide pools generally — competitor mentions, ICP pain points, pricing chatter, potential leads, or useful market signal. Produce a summary, a set of growth-focused recommended actions, and a set of suggested new sources to monitor, then deliver all of it two ways (Notion, chat output). Discord is explicitly OUT of scope for this task (no API connection exists yet) — do not attempt to scrape or check it.

Seasonality: NFL survivor-pool chatter is naturally near-zero during the off-season (roughly February–August) and ramps up fast from late August through January. Don't treat a quiet off-season day as a problem — say so plainly and move on.

## Step 1: Determine the time window
Get today's date (run `date` via Bash/PowerShell if you need to confirm). Your window is the last 24 hours ending now.

## Step 2: Gather from each platform via Apify
Use the Apify MCP tools (search-actors / fetch-actor-details / call-actor / get-dataset-items). For each actor, call fetch-actor-details first if you're unsure of current input field names — these schemas drift over time. When reading dataset items back, always pass a narrow `fields` list (e.g. title, postUrl/url, communityName/channelName, createdAt/date, upVotes/viewCount) — do NOT pull the full item including body/text/media fields, that blows past output limits.

**Reddit** — actor `harshmaur/reddit-scraper`:
- Run 1 (targeted subreddits — most reliable signal): `subredditUrls`: ["r/survivorpool", "r/sportsbook"], `postedAfter`: (24h ago, ISO date), `maxPostsCount`: 30.
- Run 2 (broad keyword sweep — noisy by nature): `searchTerms`: ["survivor pool", "knockout pool", "suicide pool", "PoolGenius", "survivorgrid"], `searchPosts`: true, `postedAfter`: (24h ago), `maxPostsCount`: 40.
  - **Known failure mode: do NOT include "SurvivorPulse" as a bare search term** — Reddit's keyword search treats it as a loose/stemmed match and returns unrelated results. Rely on the subreddit scrape and X/YouTube for direct brand mentions instead.
  - The keyword sweep WILL return heavy false-positive noise: Dead by Daylight (a game with a "Survivor" role), reality-TV Survivor fan communities, cancer-survivor subreddits, zombie/survival video games, and generic "pool" (swimming pool, prize pool) hits. This is expected. Silently discard anything that isn't genuinely about NFL/football survivor, knockout, or suicide pools — never list an irrelevant keyword match in the report just because it technically matched.
  - This sweep has repeatedly surfaced one genuinely on-topic post from r/XSportsbook (a subreddit not in the targeted list) — "NFL Football Contests 2026 - Survivor Pickem List." If it's still within the 24h window and not already covered in a prior day's log, report it; if it recurs as a source of good finds, treat r/XSportsbook as a strong Step 5 candidate for promotion to the standing list.
- Skip comment crawling (keep cost down) unless a post looks highly relevant, then you may fetch its top comments.

**X/Twitter** — actor `apidojo/tweet-scraper`. **Confirmed working with real data as of 2026-07-23** (Michael upgraded the Apify plan; the account previously returned 0 results / demo placeholder stubs on the free tier — that issue is resolved, do not re-diagnose it).
- `twitterHandles`: ["PoolGenius", "survivorgrid", "RotoBallerNFL", "VSiNLive", "SurvivorAtlas", "PoolCrunch", "OFPSports", "RunYourPool_", "splashsports", "SurvivorSweat", "JD_Sully", "CircaSurvivorTV"] (this list may grow over time as Michael approves additions from Step 5 — always read the CURRENT list from this file, don't assume it's frozen at whatever count is written here).
- Plus `searchTerms`: ["survivor pool", "#NFLSurvivor", "suicide pool", "knockout pool", "PoolGenius", "survivorgrid", "SurvivorPulse"]. Sort "Latest", `start` = 24h ago (ISO date), `maxItems` ~60.
- Expect real signal here: individual bettors' survivor-pool anecdotes/complaints (genuine ICP voice, often quotable pain points), content accounts posting original strategy tips, and competitor/service accounts advertising their own survivor-pool hosting. Also expect noise needing discard: crypto/gaming "prize pool" tweets, reality-TV Survivor (Big Brother/Survivor franchise) mentions — same discard rule as Reddit, only keep what's genuinely about NFL/football survivor pools.
- Confirmed via verification pull 2026-07-23: `spgsurvivorpool` (posts original survivor-pool strategy tips, not yet on the watch list) and `SundaySurvivorX` (appears to be a competing survivor-pool hosting service — tweeted "Run your NFL Survivor Pool at [link]" and solicited "neglected NFL survivor commissioners" to switch) are strong Step 5 candidates — flag them again if they keep showing up until Michael approves adding them to the standing list.

**YouTube** — actor `streamers/youtube-scraper`:
- `searchQueries`: ["NFL survivor pool picks", "survivor pool strategy", "knockout pool picks", "best survivor pick this week", "PoolGenius survivor"], `sortingOrder`: "date", `dateFilter`: "today", `maxResults`: 3-5 per query.
- This platform worked well in testing and surfaces real signal (competitor channel PoolGenius, and a channel called "THE Pipeline EDGE" running a templated team-by-team preview series that boilerplate-mentions "survivor pool strategy" — as of 2026-07-22 testing, confirmed videos for Dolphins, Patriots, Bills, Bengals, Ravens, and Steelers, i.e. still expanding team-by-team). Templated/boilerplate video series like that one are low-signal padding — don't list each video individually, just note the pattern once (and whether it has grown further) if a channel is doing high volume of it.
- Expect occasional unrelated "survivor" noise (shark-attack survivors, Dead by Daylight, reality TV) — discard, same rule as Reddit.

If any actor run fails or returns nothing, note that plainly in the summary rather than failing the whole task — still produce a report for the platforms that worked.

## Step 3: Synthesize
Write one tight summary (under ~500 words), organized by platform, each with a few bullets: what happened, why it matters, and a link. Call out explicitly, in a top "Flags" line: any competitor moves (PoolGenius, survivorgrid, PoolCrunch, OFPSports/RunYourPool/splashsports, SurvivorAtlas, the Circa Survivor ecosystem, SundaySurvivorX, RotoBaller, or new entrants), any recurring ICP pain point or feature request worth reusing in copy (individual X anecdotes are often the best source of this — quotable, specific), and any concrete lead (someone asking for exactly what SurvivorPulse does — e.g. a DIY builder asking how to make their own survivor-pool tool is exactly this kind of signal). If nothing meaningful surfaced, say so directly in one line — do not pad or invent signal.

Classify the day with one flag: "Nothing notable", "Worth a look", "Competitor move", "Lead or opportunity", or "Urgent" (use "Urgent" only for something a founder would want same-day, e.g. a competitor outage/PR crisis or a hot inbound lead).

## Step 4: Recommend actions
Add a "Recommended Actions" section: 1-5 concrete, growth-focused next steps, each grounded in something you actually observed this run — never generic evergreen advice ("post more on social") disconnected from a finding. For each action give: the action itself, which finding it responds to, and why it drives growth (acquisition — e.g. a lead or a thread worth engaging; positioning/differentiation — e.g. a response to a competitor move; distribution/content — e.g. a pain point or phrase worth turning into copy or a post; retention/product — e.g. a recurring complaint worth flagging to product). Order by impact, most important first. If nothing observed this run warrants action, write "No action needed today" — do not manufacture busywork on quiet days.

## Step 5: Suggest new sources to monitor
Add a "Suggested New Sources" section. Based on what you encountered this run, flag any X accounts, subreddits, or YouTube channels NOT currently on the standing watch list (see Step 2 above) that appear genuinely relevant — i.e. they're actually posting real NFL/survivor-pool content, not just a coincidental keyword match. For each: name it, say what you saw that makes it relevant, and suggest a category (competitor / media amplifier / community / content creator). Currently pending Michael's approval: `spgsurvivorpool` and `SundaySurvivorX` (X) and r/XSportsbook (Reddit) — keep re-flagging these if they keep showing up until they're either approved (and this file updated) or Michael declines. If nothing new surfaced, write "No new sources to suggest today." These are suggestions only — never add anything to the watch lists yourself.

## Step 6: Deliver

1. **Notion** — create one page in this exact data source (already created, do not create a new database): data_source_id `7bba5cf1-808c-404c-b11e-234283aef418` (Social Listening Log, under SurvivorPulse > Strategy & Growth > Marketing > Social Media). Properties: `Name` = "Social Listening — <YYYY-MM-DD>", `date:Date:start` = today's date in YYYY-MM-DD (this is a Notion date property — it MUST be passed as the expanded key `date:Date:start`, NOT as a bare `Date` key, or the create call fails validation), `Flag` = your classification, `Platforms` = ["Reddit", "X", "YouTube"] (only include platforms that actually returned data). Page content = the full summary, ending with Recommended Actions (Step 4) then Suggested New Sources (Step 5).

2. **Chat output** — end your run by outputting the full summary (including both sections) as your final message, so it's visible in the task's completion notification.

## Constraints
- Keep Apify usage lean (the maxItems/maxPostsCount/maxResults limits above are deliberate cost controls) — this runs daily and should stay reasonably cheap even with X back in the mix.
- Never fabricate activity — if a platform returns nothing relevant, say so plainly, and distinguish "confirmed quiet" (e.g. off-season, no posts in a targeted subreddit) from a genuine scraper failure (which should be reported, not silently ignored).
- Do not attempt Discord. If you want to flag that Discord monitoring is still pending setup, you may note it once as a one-line aside, not as a recurring complaint.
- Do not touch Gmail or create any email drafts — Notion and chat output are the only delivery channels for this task.
- Recommended Actions and Suggested New Sources are for Michael to review — do not take any action autonomously (no replying to posts, no DMs, no publishing, no editing the watch lists) even if it seems low-risk.