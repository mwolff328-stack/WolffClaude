---
name: project_survivorpulse_prior_season_playoff_data_gap
description: Dev DB has NO 2021-2024 playoff game rows; historical playoff pick-popularity is unsourceable; games+spreads-only backfill decided (SST-765)
metadata: 
  node_type: memory
  type: project
  originSessionId: d14e6776-d146-48ad-b14d-95fb47f38697
---

Confirmed via read-only dev-DB spike 2026-07-08 (survivorpulse-dev, Neon `shy-star-37864934`, host `ep-flat-rice-...`), while grooming SST-762 (unified entry-grid team picker):

**Data availability in dev DB:**
- Regular season 2021-2025: games, canonical spread, and pick_popularity all fully present. Ranked lists compute fine for these.
- Playoffs: ONLY 2025 has playoff game rows (13: WC6/DIV4/CONF2/SB1, weeks 19-22, scheduleType `playoffs`), with full spread + pick_popularity coverage. **2021-2024 have ZERO playoff game rows** (max week 18, regular_season only). So prior-season playoff pools show a totally empty ranked list.

**Red herring:** `game_odds_snapshots` table is EMPTY for every season including 2025. Not a problem: `spreadResolver.resolveEffectiveSpreadForAnalysis` reads the canonical `games.spreadUsedForAnalysisHome` field first (100% populated where game rows exist) and returns before touching snapshots. Backfilled games only need the canonical spread fields set, not snapshot rows.

**Pick-popularity for historical playoffs is unsourceable** (Stan research 2026-07-08): our committed fixtures `client/src/backtester/data/survivorgrid_picks_{2021..2024}.json` stop at week 18; SurvivorGrid's live archive stops at week 18; PoolGenius playoff content is paywalled narrative. The existing 2025 playoff pick_popularity has NO documented/repeatable loader (`scripts/` loaders are regular-season only, e.g. seed-historical-backtesting-data.ts) — captured live/manually, can't be replayed. **nflverse** (`nflreadr::load_schedules()` / `nfl_data_py`) is the source for games + closing spreads (`spread_line`, game_type, scores back to 1999), free, no ToS risk.

**Founder decision (SST-765, 2026-07-08): backfill games + closing spreads ONLY** for 2021-2024 playoffs. Playoff pick-popularity out of scope. Result: prior-season playoff ranked lists show real Survival %/Composite but no Pick % / pool-leverage. A spread/win-prob-derived Pick % proxy was deferred; if ever built it must be explicitly labeled `source: 'modeled'/'synthetic'` per the Constitution (no unlabeled proxies). Minor cleanup: 6 mislabeled pick_popularity rows tagged season=2025/week=12/playoffs.

**SST-765 built & loaded to reachable Neon dev DB 2026-07-08/09 (commits e809fa93 fixtures, bc6cbc7f loader):** `scripts/seed-playoff-backtesting-data.ts` + `scripts/lib/nflversePlayoffTransform.ts`, fixtures at `client/src/backtester/data/nfl_games_{2021..2024}_playoffs.json` (13 rows each: 6/4/2/1). Source nflverse `games.csv`. **Sign convention: nflverse `spread_line` positive=home favored; our DB negative=home favored → `our_home_spread = -1 * nflverse_spread_line`.** Team code `LA`→`LAR`. Idempotent (upsert). Render check passed: 2021/2022 playoff pools return real survival/composite, yahooPickPct null. **SST-765 DONE 2026-07-11** — founder ran the loader in the Replit shell against HELIUM (deployed dev DB): 13 games/season upserted, null-spread audit confirms all 52 real playoff games have home_spread (only pre-existing NFC-AFC Pro Bowl placeholders at wk22 2022/2024 are null, and the picker filters AFC/NFC IDs). **PROD LOADED 2026-07-14** (founder's beta publish): ran `DATABASE_URL="<prod>" npx tsx scripts/seed-playoff-backtesting-data.ts` in the Replit shell against the prod Neon DB (endpoint `ep-lingering-tooth-ajmk5gjx`, `neondb`, aws-us-east-2 — distinct from dev `helium/heliumdb` and from the us-west-2 dev/CI Neon projects; the 39-day-old `ep-orange-bush` endpoint note was stale, Neon endpoints rotate). 13/13 games upserted per season, all 52 real games got canonical spreads. Benign warnings confirmed harmless: (1) one `PLAYOFF_KICKOFF_ANOMALY` per season is that season's Monday-night Wild Card game stored in UTC rolling to Tuesday (records-but-doesn't-block; scores match real results); (2) 2 skipped spreads `2022-22-NFC-AFC`/`2024-22-NFC-AFC` are Pro Bowl placeholders the picker filters out. Verify prod shell target before running: `node -e "console.log(new URL(process.env.DATABASE_URL).host)"` — default Replit *workspace* shell is DEV (helium); prod URL comes from Replit Deployment secrets, passed inline only (never committed — flagged for rotation).

**GOTCHA (cost a debug cycle): a loaded game needs `homeSpread` written DIRECTLY, not just the canonical `spread_used_for_analysis_home` fields, or `playoffSurvivorEngine.getEffectiveSpreadSync()` returns ODDS_UNAVAILABLE and the ranked list won't render.** The engine reads `game.homeSpread` directly and bypasses `spreadResolver.ts` entirely — a documented Canonical Spread Contract violation, filed as a Backlog Tech Debt ticket (route getEffectiveSpreadSync through the resolver). Every existing game populates homeSpread in parallel for this reason.

Related: [[project_survivorpulse_make_picks_epic]], [[project_survivorpulse_local_verification]]
