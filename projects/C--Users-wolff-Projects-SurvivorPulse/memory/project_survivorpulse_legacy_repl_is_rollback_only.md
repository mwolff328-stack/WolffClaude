---
name: project_survivorpulse_legacy_repl_is_rollback_only
description: "Domain cutover to v1 is COMPLETE (2026-07-28, re-confirmed 2026-07-31) — survivorpulse.com serves the v1 app; the Legacy Repl survives only at optivor.replit.app as a rollback target. An apex cutover is a live-customer migration, not pure DNS plumbing."
metadata: 
  node_type: memory
  type: project
  originSessionId: 9506305b-cbe2-42d0-b9b7-09aeddfb687c
  modified: 2026-08-01T22:55:41.459Z
---

**CUTOVER COMPLETE 2026-07-28**, independently re-confirmed 2026-07-31 (HTTP fingerprint: identical `Etag`/`Content-Length` on `survivorpulse.com` vs `survivorpulse-beta.replit.app`; identical bespoke JSON error shape on an admin-only API route; landing-page copy matches current free/open-access v1 positioning). The apex `survivorpulse.com` now serves the v1 app (Repl renamed `SurvivorPulse-v1`; deployment slug stayed `survivorpulse-beta.replit.app` — a Repl rename does NOT change the deployment URL). Legacy still serves at `optivor.replit.app` = rollback only. Domain was moved via the **destination** side (add the domain in the v1 Repl); the source Repl's `…` menu offers only "Disconnect", the destructive path — never use it to move a domain.

**A stale filename/description can outlive the fact it describes and mislead downstream work that reads only the index line, not the body.** This memory's original name asserted the opposite of current reality, and that framing propagated into a 2026-07-28 discovery brief (`docs/briefs/SF-XX-account-surfaces-discovery.md`) before the mistake was caught. Same failure family as [[feedback_a_doc_saying_code_was_deleted_is_not_evidence]] — renamed 2026-08-01 to stop it recurring.

**Replit domain quirk, worth knowing if another subdomain is ever added:** a TLS cert is issued per **registered domain entry**, not per DNS record — adding a `CNAME www → apex` DNS record alone still fails the `www` TLS handshake. Fix is a SECOND entry in the Repl's Domains tab (full FQDN), not a row in the DNS Records table (its relative-label Hostname column turns a typed-in FQDN into a self-referential CNAME that Replit rejects).

**Canonical host redirect** (commit `506d8410`, 2026-07-29): Replit serves both `survivorpulse.com` and `www.survivorpulse.com` directly with no redirect between them, so the app does it — `server/middleware/canonicalHost.ts` 301s www → apex (GET/HEAD only, registered before every other handler; `/api` passes through, and a redirected POST is excluded because downgrading it to GET could drop a Stripe webhook body). `client/src/hooks/useCanonicalUrl.ts` adds the path-only `rel="canonical"` tag.

**The 2 external paying customers were grandfathered, RESOLVED 2026-07-28 — not an open obligation.** Legacy DB showed 16 `status='active'` subscription rows but Stripe live mode had only 5 (11 rows were webhook/reconciliation drift); of the 5 real subs, 3 were the founder's own test accounts. The 2 genuine external customers (both on the $19.99/yr plan, both started 2026-01-10) were the founder's friends — decision was to cancel both Stripe subs and grant beta access (`users.betaGrantedAt`) rather than a Stripe comp.

**Why this mattered:** the domain question looked like pure DNS plumbing. It was actually a live-customer migration — cutting the apex over strands whatever's still on the old app, and the Legacy site keeps selling a product being retired until someone stops it.

**How to apply:** never treat a "legacy"/predecessor deployment as dormant. Before any apex cutover: (1) stop new sales on the old app, (2) decide refund-vs-comp for any customers mid-term, (3) reconcile any DB-vs-payment-provider drift. A coded-access free beta doesn't need the apex at all — a `beta.`/`app.` subdomain decouples launch from migration.

See [[project_survivorpulse_beta_launch_site_decisions]], [[project_survivorpulse_publish_prerequisites]], [[project_survivorpulse_production_smoke_access]] (current DB/host-reachability facts — this file no longer restates them), [[project_survivorpulse_env_database_url_two_lines]], [[project_survivorpulse_schema_drift_takes_down_dev_app]].
