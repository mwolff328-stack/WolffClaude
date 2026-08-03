---
name: survivorpulse-replit-secrets-vs-config
description: "Replit \"Configurations\" = plaintext [userenv.*] in .replit (committed + auto-pushed to git); real secrets belong in the encrypted Secrets pane. Config scope matters, and STRIPE_*_DEV is now NODE_ENV-guarded."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7ef0649e-7c31-4cf6-b35d-fb0c6abfea44
---

SurvivorPulse deploys on Replit. Replit's env UI has TWO stores, and only one is safe for secrets:

- **Secrets pane** (padlock, values masked): encrypted, injected at runtime, NEVER written to `.replit`. Real secrets go here.
- **Configurations** (values shown in plaintext): these ARE the `[userenv.*]` blocks in `.replit`. They are committed to the repo and Replit **auto-commits + pushes** them to `2026-v1`. Replit warns they're for "non-sensitive information" only. Putting a secret here leaks it to git.

Key gotcha: **Replit regenerates `.replit` from its Configuration store.** A git-only edit to `.replit` (removing a secret line) does NOT stick — the next Replit sync overwrites it and re-adds the value. To durably remove/rescope anything in `[userenv.*]`, you MUST change it in the Replit Configurations UI, then push from the Replit Git pane. Config edits do not reach GitHub until pushed (Git pane) — they can sit local in the workspace.

**Config scope matters (shared vs development):**
- `[userenv.shared]` (link icon in UI) applies to BOTH the published prod app and dev/workspace.
- `[userenv.development]` (dev-only) applies only to the workspace/dev run.
- `ALLOW_UNSAFE_DEV_FEATURES=true` MUST be `[userenv.development]`. It gates the subscription paywall bypass and `server/envValidation.ts` FATAL-exits the process if it's true under production (`NODE_ENV`/`APP_ENV`=production). If it lands in `[userenv.shared]`, the next Republish makes prod fail to boot (fails safe, but broken deploy). When re-adding a Configuration, pick the Development scope explicitly.

**Stripe env wiring (2026-07-14 cleanup, SST-untracked):** `server/index.ts` is the SOLE reader of `STRIPE_SECRET_KEY_DEV` / `STRIPE_WEBHOOK_SECRET_DEV`. It prefers the `_DEV` test keys, falls back to the live `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (encrypted Secrets = live prod keys, same Replit app). Commit `5bbcbd50` on 2026-v1 added a `NODE_ENV !== "production"` guard so the `_DEV` overrides are honored only outside prod — this lets the `_DEV` test keys live as globally-visible encrypted Secrets without a published build ever preferring a test key over the live key. `docs/STRIPE_DEV_SETUP.md` documents the non-DEV fallback names; webhook secret is optional (checkout works without it). Test-mode webhook secrets have no live endpoint in test mode (only a prod webhook `we_1SmMxc8RnSp1sjU3Z1YV6qZg` exists) — use `stripe listen` or a test-mode destination pointing at the public dev URL.

**⚠️ DEV-SCOPED CONFIGURATIONS SILENTLY VANISH — ROOT CAUSE CONFIRMED + FIXED 2026-07-16.** Both `ALLOW_UNSAFE_DEV_FEATURES` and `DEV_AUTOLOGIN_EMAIL` repeatedly disappeared from the Replit Configurations pane. Confirmed mechanism: the Replit Sync workflow (`.github/workflows/replit-sync.yml`) runs `git reset --hard FETCH_HEAD` inside the Replit workspace on EVERY push to `2026-v1`, replacing the workspace `.replit` with the repo copy; Replit then regenerates its Configurations store from the file. So any Configuration added ONLY via the Replit UI (never committed) is wiped on the next push. The sync direction is file→store here (the reverse of the store→file gotcha above — both directions exist; whichever side last changed wins). **The durable fix: commit the line into `[userenv.development]` in the repo's `.replit`** — done for `ALLOW_UNSAFE_DEV_FEATURES` (e9cdb66f, 2026-07-15) and `DEV_AUTOLOGIN_EMAIL = "mwolff328@gmail.com"` (7bb90413, 2026-07-16). Encrypted App Secrets are NOT stored in `.replit` and survive syncs untouched. Symptom when it bites: **dev auto-login silently breaks — the dev app redirects to `/login` and 401s every `/api/*`**, looking exactly like a code/auth bug. If a live smoke on the deployed dev app hits a surprise `/login` redirect + 401, check that `.replit` in the repo still carries both lines (and the Configurations pane) FIRST — it is not your code. Any future dev-scoped Configuration must be committed to the repo's `.replit`, Development scope only (shared scope makes prod fail to boot — see scope rule above).

Related: [[project_survivorpulse_db_deployment]], [[project_survivorpulse_e2e_cloudflare]], [[project_survivorpulse_visual_verification]]
