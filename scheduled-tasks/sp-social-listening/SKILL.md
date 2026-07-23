---
name: sp-social-listening
description: Daily SurvivorPulse social listening summary across Reddit, X, and YouTube, with growth-focused recommended actions and auto-promoting new-source tracking — logged to Notion and shown in chat.
---

You are producing the daily SurvivorPulse social listening report. SurvivorPulse is Michael Wolff's NFL survivor-pool decision-support SaaS. This task runs once a day and has no memory of any other session — everything you need to know is either in this file or must be gathered fresh. Your own file path is `C:\Users\wolff\.claude\scheduled-tasks\sp-social-listening\SKILL.md` — you will edit it in Step 5.

## Objective
Check Reddit, X (Twitter), and YouTube for anything posted or newly notable in the last 24 hours that's relevant to SurvivorPulse or NFL survivor/knockout/suicide pools generally — competitor mentions, ICP pain points, pricing chatter, potential leads, or useful market signal. Produce a summary, a set of growth-focused recommended actions, and maintain the auto-promoting source tracker below. Deliver everything two ways (Notion, chat output). Discord is explicitly OUT of scope for this task (no API connection exists yet) — do not attempt to scrape or check it.

**Linking rule (applies everywhere in this report):** every specific item you cite — a Reddit post, a tweet, a YouTube video, a competitor account, a subreddit, a channel, a suggested new source, anything in the Pending Candidates or Standing Watch Lists — must carry its direct, clickable URL as a Markdown link, so Michael can jump straight to it. Never name something without linking it. Use: Reddit post → its full `postUrl`; subreddit → `https://www.reddit.com/r/<name>/`; tweet → its full tweet `url`; X account/handle → `https://x.com/<handle>`; YouTube video → its `url`; YouTube channel → its `channelUrl` (or `https://www.youtube.com/@<channelUsername>` if that's what you have). When you pull dataset items in Step 2, always include the URL field alongside title/name fields — never fetch a narrowed field set that drops it.

Seasonality: NFL survivor-pool chatter is naturally near-zero during the off-season (roughly February–August) and ramps up fast from late August through January. Don't treat a quiet off-season day as a problem — say so plainly and move on.

## Step 1: Determine the time window
Get today's date (run `date` via Bash/PowerShell if you need to confirm). Your window is the last 24 hours ending now.

## Step 2: Gather from each platform via Apify
Use the Apify MCP tools (search-actors / fetch-actor-details / call-actor / get-dataset-items). For each actor, call fetch-actor-details first if you're unsure of current input field names — these schemas drift over time. When reading dataset items back, always pass a narrow `fields` list (e.g. title, postUrl/url, communityName/channelName, createdAt/date, upVotes/viewCount) — do NOT pull the full item including body/text/media fields, that blows past output limits. The URL field is mandatory in every `fields` list per the linking rule above — never omit it to save space.

**Reddit** — actor `harshmaur/reddit-scraper`:
- Run 1 (targeted subreddits — most reliable signal): `subredditUrls`: CURRENT_REDDIT_SUBREDDITS (see tracker below), `postedAfter`: (24h ago, ISO date), `maxPostsCount`: 30.
- Run 2 (broad keyword sweep — noisy by nature): `searchTerms`: ["survivor pool", "knockout pool", "suicide pool", "PoolGenius", "survivorgrid"], `searchPosts`: true, `postedAfter`: (24h ago), `maxPostsCount`: 40.
  - **Known failure mode: do NOT include "SurvivorPulse" as a bare search term** — Reddit's keyword search treats it as a loose/stemmed match and returns unrelated results. Rely on the subreddit scrape and X/YouTube for direct brand mentions instead.
  - The keyword sweep WILL return heavy false-positive noise: Dead by Daylight (a game with a "Survivor" role), reality-TV Survivor fan communities, cancer-survivor subreddits, zombie/survival video games, and generic "pool" (swimming pool, prize pool) hits. This is expected. Silently discard anything that isn't genuinely about NFL/football survivor, knockout, or suicide pools — never list an irrelevant keyword match in the report just because it technically matched.
- Skip comment crawling (keep cost down) unless a post looks highly relevant, then you may fetch its top comments.

**X/Twitter** — actor `apidojo/tweet-scraper`. Confirmed working with real data as of 2026-07-23 (paid Apify plan).
- `twitterHandles`: CURRENT_X_HANDLES (see tracker below) — always read the CURRENT list from the tracker section, not from memory of any prior version of this file.
- Plus `searchTerms`: ["survivor pool", "#NFLSurvivor", "suicide pool", "knockout pool", "PoolGenius", "survivorgrid", "SurvivorPulse"]. Sort "Latest", `start` = 24h ago (ISO date), `maxItems` ~60.
- Expect real signal here: individual bettors' survivor-pool anecdotes/complaints (genuine ICP voice, often quotable pain points), content accounts posting original strategy tips, and competitor/service accounts advertising their own survivor-pool hosting. Also expect noise needing discard: crypto/gaming "prize pool" tweets, reality-TV Survivor (Big Brother/Survivor franchise) mentions — same discard rule as Reddit, only keep what's genuinely about NFL/football survivor pools.

**YouTube** — actor `streamers/youtube-scraper`:
- `searchQueries`: ["NFL survivor pool picks", "survivor pool strategy", "knockout pool picks", "best survivor pick this week", "PoolGenius survivor"], `sortingOrder`: "date", `dateFilter`: "today", `maxResults`: 3-5 per query.
- Also directly check any CURRENT_YOUTUBE_CHANNELS from the tracker below (if any have been promoted) via `startUrls` with the channel URL, `sortVideosBy`: "NEWEST", small `maxResults`.
- Expect real signal (competitor channel PoolGenius, and a channel called "THE Pipeline EDGE" running a templated team-by-team preview series that boilerplate-mentions "survivor pool strategy"). Templated/boilerplate video series like that one are low-signal padding — don't list each video individually, just note the pattern once if a channel is doing high volume of it, but still link the channel itself.
- Expect occasional unrelated "survivor" noise (shark-attack survivors, Dead by Daylight, reality TV) — discard, same rule as Reddit.

If any actor run fails or returns nothing, note that plainly in the summary rather than failing the whole task — still produce a report for the platforms that worked.

## Step 3: Synthesize
Write one tight summary (under ~500 words), organized by platform, each with a few bullets: what happened, why it matters, and its link (per the linking rule above — every bullet citing a specific post/tweet/video ends with its URL; every account/competitor named is itself a link to its profile/channel). Call out explicitly, in a top "Flags" line: any competitor moves, any recurring ICP pain point or feature request worth reusing in copy (individual X anecdotes are often the best source of this), and any concrete lead (someone asking for exactly what SurvivorPulse does). If nothing meaningful surfaced, say so directly in one line — do not pad or invent signal.

Classify the day with one flag: "Nothing notable", "Worth a look", "Competitor move", "Lead or opportunity", or "Urgent" (use "Urgent" only for something a founder would want same-day).

## Step 4: Recommend actions
Add a "Recommended Actions" section: 1-5 concrete, growth-focused next steps, each grounded in something you actually observed this run — never generic evergreen advice disconnected from a finding. For each: the action, which finding it responds to (linked, per the linking rule), and why it drives growth (acquisition / positioning-differentiation / distribution-content / retention-product). Order by impact. If nothing warrants action, write "No action needed today."

## Step 5: Maintain the source tracker and auto-promote high-confidence repeats

Founder-approved rule (2026-07-23): a candidate source gets added to standing monitoring automatically once it has been genuinely observed as relevant on **3 separate calendar days** — no manual approval needed at that point. Below 3 days, it stays pending and just gets re-flagged. This replaces the old "always ask before adding" rule.

**PENDING CANDIDATES (you maintain this list — read it, update it, then edit this file to save changes; keep each entry linked per the linking rule)**
```
- [Reddit] [r/XSportsbook](https://www.reddit.com/r/XSportsbook/) — community — seen: 2026-07-22
- [X] [SundaySurvivorX](https://x.com/SundaySurvivorX) — competitor — seen: 2026-07-23
- [X] [spgsurvivorpool](https://x.com/spgsurvivorpool) — content creator — seen: 2026-07-23
- [Reddit] [r/NFLSurvivor](https://www.reddit.com/r/NFLSurvivor/) — community — seen: 2026-07-23 (surfaced a genuine lead-quality post same day: "what's the best website for NFL survivor pools?")
- [YouTube] [THE Pipeline EDGE](https://www.youtube.com/@ThePipelineEdge) — content creator — seen: 2026-07-22, 2026-07-23 (templated team-by-team preview series, boilerplate-mentions survivor pool strategy, still expanding daily — one more distinct day from auto-promotion)
- [YouTube] [VSiN](https://www.youtube.com/@VSiNLive) — media amplifier — seen: 2026-07-23 (dedicated "Circa Survivor" show, Season 3 Episode 1 posted; VSiN is already tracked on X but not YouTube)
```

**STANDING WATCH LISTS (promoted candidates land here; Step 2 reads these)**
```
CURRENT_REDDIT_SUBREDDITS: ["r/survivorpool", "r/sportsbook"]
CURRENT_X_HANDLES: ["PoolGenius", "survivorgrid", "RotoBallerNFL", "VSiNLive", "SurvivorAtlas", "PoolCrunch", "OFPSports", "RunYourPool_", "splashsports", "SurvivorSweat", "JD_Sully", "CircaSurvivorTV"]
CURRENT_YOUTUBE_CHANNELS: []
```

Each run, do this:
1. From this run's Step 2/3 findings, identify any X account, subreddit, or YouTube channel that's genuinely relevant (real content, not a coincidental keyword match) and NOT already in the standing watch lists above.
2. For each one: if it's already in the Pending Candidates list, add today's date to its "seen" list (only once per calendar day, even if it appeared multiple times in today's run). If it's new, add it with today's date as its first "seen" entry, formatted as a Markdown link per the linking rule.
3. Any candidate with 3 or more DISTINCT dates in "seen" gets **promoted**: move it into the correct CURRENT_* list in Standing Watch Lists, and remove it from Pending Candidates.
4. Safety valve: if more than 2 candidates would promote in a single run, only promote the 2 with the most distinct seen-dates; leave the rest pending for next run (prevents a single noisy day from bulk-adding low-quality sources).
5. Save all of this by editing this file (`C:\Users\wolff\.claude\scheduled-tasks\sp-social-listening\SKILL.md`) — update the Pending Candidates block and the Standing Watch Lists block with the new state. Do not alter anything else in this file (leave all instructions, steps, and wording exactly as they are).
6. In your report's "Suggested New Sources" section: list what's still pending (linked name, category, X/3 days seen), and separately call out anything promoted this run ("Promoted to standing monitoring: [name](link) — now being tracked daily").

If nothing new surfaced this run, still check whether any existing pending candidate ages out — there's no automatic expiry, so just leave stale ones pending indefinitely unless Michael says to clear them.

## Step 6: Deliver

1. **Notion** — create one page in this exact data source (already created, do not create a new database): data_source_id `7bba5cf1-808c-404c-b11e-234283aef418` (Social Listening Log, under SurvivorPulse > Strategy & Growth > Marketing > Social Media). Properties: `Name` = "Social Listening — <YYYY-MM-DD>", `date:Date:start` = today's date in YYYY-MM-DD (expanded key, not bare `Date`), `Flag` = your classification, `Platforms` = ["Reddit", "X", "YouTube"] (only platforms that returned data). Page content = the full summary, ending with Recommended Actions (Step 4) then Suggested New Sources (Step 5, including any promotions). Notion supports Markdown links (`[text](url)`) natively — use them throughout, don't paste bare URLs.

2. **Chat output** — end your run by outputting the full summary (including both sections) as your final message, same linked formatting.

## Constraints
- Keep Apify usage lean — this runs daily and should stay reasonably cheap even as the watch lists grow over time via promotion.
- Never fabricate activity — if a platform returns nothing relevant, say so plainly.
- Never cite a specific post, tweet, video, account, subreddit, or channel without its direct link — this is not optional, it's the whole point of the report being useful for quick follow-up.
- Do not attempt Discord.
- Do not touch Gmail or create any email drafts — Notion and chat output are the only delivery channels for this task.
- Recommended Actions are for Michael to review — do not take any action autonomously (no replying to posts, no DMs, no publishing) even if it seems low-risk. The ONLY autonomous self-modification allowed is the Step 5 watch-list promotion mechanism described above — do not extend autonomous editing to anything else in this file.
- There is no mechanism to follow/like/interact with accounts on Michael's actual X account — no such connector exists. "Monitoring" only ever means reading public data via Apify, never taking social actions on his behalf.