---
name: survivorpulse-failed-replit-publish-triage
description: "When a Replit publish fails at Build - what to check, why pasted \"errors\" may be runtime noise, and why the tip can move under a retry"
metadata:
  node_type: memory
  type: project
  originSessionId: 39612460-2a27-4d47-b49e-d48024047efd
  modified: 2026-09-28T16:51:31.061Z
---

2026-09-28: two Replit publish attempts of the REL-45/46 tip failed at the Build step. Build log stopped right after `3336 modules transformed.` with no error line (never reached `rendering chunks...`). Builder is Node v20.20.0 / npm 10.8.2 / vite 8.2.2. The same commits built fine in every CI e2e shard (`npm run build`, ~4 s) and locally under Node 20.20.0 (exit 0, ~840 MB peak). Cause of the Replit-side failure was never proven from the repo.

**Why:** a failed Build leaves production untouched (Replit shows previous publish live, bundle name unchanged), so a retry is safe. Do not click "Fix with Agent" for a build that CI proves is fine.

**How to apply:**
- Reproduce with the exact builder Node: `npx -y -p node@20.20.0 node scripts/build-v1.js` (preload a `--require` file printing `process.version` to prove build-v1, vite and esbuild really ran on 20.20.0), plus compare "modules transformed" and entry chunk size against the e2e shard logs of the previous tip.
- The founder may paste the wrong pane: `[SST-1664] market-data change bus connection error; reconnecting` with Postgres 57P01 "terminating connection due to administrator command" every 60-120 s is documented benign runtime noise (header of `server/services/marketDataChangeBus.ts`), not a build error. Ask for the last ~40 lines of the Build STEP log before the red marker.
- A publish builds the Replit workspace HEAD, and Replit Sync moves it on every push to 2026-v1. The tip can move between a filed verdict and the founder's retry (it did: fb7e9578 -> ab18ca0f between attempt 1 and 2). Re-fetch on every founder message during a publish and re-audit; file a new Releases record for the new tip.
- Add an explicit production-build line to every verdict (modules transformed and entry chunk size from the e2e shard logs, vs the previous tip). CI runs `npm run build` only inside the e2e shards, and `tsc` is in no workflow.

Related: [[project_survivorpulse_stale_spa_bundle_after_publish]], [[feedback_survivorpulse_ship_verdicts_go_to_releases_database_not_sst1491]].
