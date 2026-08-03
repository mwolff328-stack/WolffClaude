---
name: project_survivorpulse_env_database_url_two_lines
description: "Local .env has TWO DATABASE_URL lines but the first is commented out; and Playwright does NOT read .env at all — it loads .env.test."
metadata: 
  node_type: memory
  type: project
  originSessionId: 515ac9ce-220f-4755-b974-8f44a68dacc8
  modified: 2026-08-02T01:41:38.741Z
---

`C:\Users\wolff\Projects\SurvivorPulse\.env` contains **two** `DATABASE_URL` lines. A naive grep shows both and looks like unresolvable ambiguity about which database you'd be touching:

- line 1 `ep-cool-brook-a6gheo51-pooler` — **`#`-prefixed and inert**
- line 2 `ep-flat-rice-akn42ssx-pooler` — the live value; `TEST_DATABASE_URL` points at the same host

`CLAUDE.md`'s wrong-host section names **`ep-flat-rice` explicitly as a locally-reachable dev database**, distinct from `helium` (the deployed dev DB, reachable only inside the Replit container) and from production. So it is documented as non-production, not inferred.

**Why this matters:** on 2026-07-28 I refused to apply an idempotent `CREATE TABLE IF NOT EXISTS` locally because the two lines read as ambiguous, and I couldn't confirm which was production. Stopping was correct *method* — the project rule is "if you can't confirm `DATABASE_URL` points at dev, stop and ask" — but the ambiguity was an artifact of not checking for the comment prefix. Grep for the comment marker before concluding a config is ambiguous.

**How to apply:** when a local schema fix is needed, check whether the duplicate line is commented out. If the live host is `ep-flat-rice`, it is the documented local dev DB and an additive, idempotent migration is safe — ideally run with a hard host guard that refuses any other host. Still never `db:push` against `helium` or prod. See [[project_survivorpulse_schema_drift_takes_down_dev_app]] and the sp-live-verify skill.

## Playwright reads `.env.test`, NOT `.env`

`playwright.config.ts:10` is `dotenv.config({ path: path.resolve(__dirname, '.env.test') })`. It never loads `.env`. So **telling someone to put a Playwright-run variable in `.env` is simply wrong** — the suite will not see it. Caught 2026-08-01 while writing setup instructions for the E2E throwaway branch; the `.env` answer was one sentence from being given.

- `.env.test` exists and is gitignored (`.gitignore:17`). At the time it held only `TEST_EMAIL`, `TEST_PASSWORD`, `BASE_URL`.
- `DATABASE_URL` for a local full-suite run against a disposable branch belongs in **`.env.test`**.
- `scripts/seed-e2e.ts` is different again: run via `npx tsx`, which loads no dotenv file at all, so it takes an **inline** `DATABASE_URL=... npx tsx scripts/seed-e2e.ts`, exactly as its own header documents.

Three different mechanisms for what looks like one variable. Check which loader the process actually uses before writing instructions for it.

**Grep trap when hunting `BASE_URL`: `DATABASE_URL` CONTAINS the substring `BASE_URL`** (`DATA` + `BASE_URL`), and so does `TEST_DATABASE_URL`. So `grep BASE_URL .env` returns hits in a file that has **no** `BASE_URL` key at all, and a count-based check ("3 BASE_URL lines in `.env`") reads as "the URL is in `.env`" when it is really in `.env.test`. Cost two rounds of probing a **silently empty** `$URL` on 2026-08-02 — `curl` then reported `http=000`, which reads exactly like an unreachable dev app rather than a broken extraction. Anchor the key (`^BASE_URL=` / `startswith('BASE_URL=')`) and **assert the extracted value is non-empty before using it** — an empty URL and a dead host produce the same `000`.

Related symptom: the local dev DB lagged behind `helium` on SST-1079's `user_preferences` table, so `hasStoredDistinctnessPreferences` threw on **every** authenticated page load (SST-1082 hoisted that hook into `AppShell`, so it fires app-wide, not just on Game Plan). It fails open, but the repeated failures wedged a local static server. Fixed 2026-07-28.
