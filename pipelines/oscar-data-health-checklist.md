# Oscar's Weekly Data-Health Checklist (read-only)

Owner: Oscar the Operator. Referenced from `agents/oscar-the-operator.md`.

**Rule: every check compares two INDEPENDENT sources.** A value checked against itself proves nothing (2026-09-07 postmortem: Games & Odds looked fine while Weekly Rankings read stale canonical spreads because `backfillCanonicalSpreads` had never run on prod).

**Method:** Chrome tools, own tab, logged-in session. Read pages only (`get_page_text`, `read_page`, `javascript_tool` for reading). Never click Save/Publish/Refresh/Sync buttons. On any sign-in page: stop and report. Record both values for every check, even passes.

**Ticket:** on fail, file a Notion ticket via the `survivorpulse-bug-triage` skill, assigned for Felix (fix) and Vlad (verify). Title: `[Data health] <check> W<week>: A=<x> vs B=<y>`.

## Cadence

- **Tuesday**, after the Find a Pool sync: full run (checks 1-6) for the week just completed and the upcoming week.
- **Thursday, before kickoff**: checks 1, 2, 3, 5 on the upcoming week only (lines move; picks open).
- Skip outside the NFL season.

## Checks

| # | Check | Source A | Source B | Pass / fail | Ticket |
|---|---|---|---|---|---|
| 1 | Spread agreement | Admin Games & Odds page, home spread per game | Public Weekly Rankings (`survivorpulse.com/rankings`, Week selector), `currentSpreadHome` / displayed spread per game | Pass: every game within 0.5 pt. Fail: any game off by more than 0.5 pt, or a game missing from one side | Bug, severity High (this is the 9/7 failure class). Attach per-game table |
| 2 | Game count per week | Games & Odds row count for the week | ESPN scoreboard API (`site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=N&year=2026&seasontype=2`) event count | Pass: equal (bye weeks accounted for). Fail: any difference | Bug, High if a game is missing, Medium if extra |
| 3 | Lines moved vs frozen openings | Games & Odds current spread vs opening spread for games still before kickoff | A second market source (ESPN odds in the scoreboard/summary API, or a public odds page) for the same games | Pass: current line within 1.5 pt of the second source and openings unchanged since last run. Fail: current line off by more than 1.5 pt, or an opening value that changed | Bug, Medium; High if the stale line drives rankings |
| 4 | Frozen lines after kickoff | Locked/final spread on a started game in Games & Odds | The same game's spread shown on Weekly Rankings and the earlier Thursday run's recorded value | Pass: all three agree for games past kickoff. Fail: any drift | Bug, High (finality contract; see canonical-spread contract in the SurvivorPulse CLAUDE.md) |
| 5 | Pick popularity vs market | App pick popularity (% of entries on each team, Weekly Rankings / field exposure view) | Yahoo Survivor pick-popularity page (or other public market source) for the same week | Pass: top-10 teams overlap by 8 or more, and each shared team within 10 percentage points. Fail: otherwise. Note that app pools are a smaller, different population, so a mild gap is normal; flag large gaps | Investigation ticket, Medium (could be data bug or real population difference; say which is unproven) |
| 6 | Results recorded | App's recorded final score/winner for completed games | ESPN scoreboard final scores for the same games | Pass: all completed games match. Fail: any wrong, missing, or not-final score | Bug, High (grading depends on it) |

## Reading each source (live app)

- **Games & Odds**: Admin Hub (`https://survivorpulse.com/admin`) > Games & Odds. Pick the week; read the table text.
- **Weekly Rankings**: `https://survivorpulse.com/rankings`. The Week selector is a native `<select>` (use `form_input`, not click). Read each game's spread and team probabilities.
- **ESPN**: open the scoreboard API URL above in the tab and read the JSON text. If the browser blocks query-string-looking output, return plain counts and team names only.
- **Yahoo / market popularity**: open the public pick-popularity page in the tab and read the table text. If the source is unavailable, mark the check "Skipped (source unavailable)", never "Pass".

## Report

One table per run: check, A value, B value, verdict, ticket link. State anything skipped or not verified. Send to the founder / Pam; Biz may fold it into the weekly brief.

## Calibration notes

Thresholds above are starting points. If a threshold produces false alarms two weeks running, tell Pam and propose a change; do not quietly loosen it.
