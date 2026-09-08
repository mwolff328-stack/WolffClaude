---
name: project_survivorpulse_supported_seasons_narrower_than_games
description: "SUPPORTED_SEASONS is [2021..2026] and gates pools only; games legitimately hold 2016+, so validating games.season against it would reject 5 years of real history."
metadata: 
  node_type: memory
  type: project
  originSessionId: 06406c48-9309-43e0-a921-c1b757698c20
  modified: 2026-09-08T02:36:13.283Z
---

`SUPPORTED_SEASONS = [2021, 2022, 2023, 2024, 2025, 2026]` (`shared/schema.ts:1500`) is **narrower than the real contents of the `games` table**, which legitimately holds 2016-2020 as well (267-269 games each, verified on the dev DB 2026-09-07).

It is wired into `insertPoolSchema` only (`shared/schema.ts:1522`). `insertGameSchema` (`:1485`) has **no** season validation, and `games.season` is a bare `integer().notNull()` with no CHECK constraint.

**Why it matters:** the obvious-looking fix for junk season values — "validate `games.season` against `SUPPORTED_SEASONS`" — is wrong and would reject five years of real history. Any validation at the games write boundary needs its own bound (`2016..current+1`), separate from the pools constant. This is what turned a seemingly one-line guard into a design task during SST-1585 triage.

Consequence worth knowing separately: `/api/admin/nfl/data-completeness` filters `WHERE season IN (SUPPORTED_SEASONS)`, so that admin matrix shows 2021-2026 ONLY — it is not a full view of the games table, by design.

**How to apply:** Before adding any season validation or allowlist filter, check which constant you are reaching for and what range the target table actually holds. Prefer an explicit `2016..current+1` bound for `games`; `SUPPORTED_SEASONS` is a pool-creation constant, not a data-range constant. Relates to [[project_survivorpulse_unit_config_disables_db_host_guard]].
