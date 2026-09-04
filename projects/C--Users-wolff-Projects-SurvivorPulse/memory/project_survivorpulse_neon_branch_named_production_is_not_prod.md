---
name: project_survivorpulse_neon_branch_named_production_is_not_prod
description: "The Neon branch named \"production\" is inside the DEV project and is ep-flat-rice, the local test DB — production is not reachable from Neon MCP at all."
metadata: 
  node_type: memory
  type: project
  originSessionId: aef2a246-0042-49f9-a49f-ba43897dca85
  modified: 2026-09-04T21:37:55.763Z
---

Production is **not** in the founder's Neon org. `list_projects` (org `org-floral-tree-54805924`)
returns exactly two projects — `survivorpulse-dev` (`shy-star-37864934`) and
`survivorpulse-ci-e2e` (`damp-sunset-84903170`). Neither is prod.

**The trap:** `survivorpulse-dev`'s default/primary branch is literally named
**`production`** (`br-plain-fire-aky5it6n`). Querying it and reporting "confirmed against
production" is wrong. Verified 2026-09-04 — that branch resolves to
`neon.endpoint_id = ep-flat-rice-akn42ssx`, i.e. the **local test DB** named in `.env`,
the same host `CLAUDE.md` warns is "a DIFFERENT database."

It fails *closed-looking but backwards*: `ep-flat-rice` still HAS `pick_confirmations`
(`DB_OPERATIONS.md` documents it as the expected EXTRA table there, matching
`tests/schemaDriftCheck.sst1514.test.ts:132`), so a verifier run there shows the table
PRESENT — the opposite of prod, where SST-940's publish dropped it on 2026-07-21.

**How to identify what you actually hit** — branch/project names are not evidence:
```sql
SELECT current_setting('neon.endpoint_id', true), current_setting('neon.project_id', true);
```
`current_database()` is useless here (always `neondb`). See
[[project_survivorpulse_production_smoke_access.md]] for the same host-not-database rule.

**Reaching prod at all** requires `PROD_DATABASE_URL` supplied interactively
(`read -rs`, per `docs/DB_OPERATIONS.md`) or the Replit SQL console. Never ask the founder
to paste a prod credential into chat — SST-1017 was a committed live prod password, and a
transcript is a file. Hand them the SQL to run in the Replit console instead.

Related: [[project_survivorpulse_env_database_url_two_lines]],
[[project_survivorpulse_schema_drift_takes_down_dev_app]].
