---
name: project_survivorpulse_split_route_registration
description: "Express routes are registered in BOTH server/routes.ts and server/index.ts — grepping only routes.ts misses the Stripe webhook and yields false \"this doesn't exist\" claims."
metadata: 
  node_type: memory
  type: project
  originSessionId: b437897e-804f-4e9b-95e4-e632610b1d9e
  modified: 2026-07-28T22:53:54.738Z
---

SurvivorPulse registers Express routes in **two** places. Most live in `server/routes.ts`, but some are mounted directly in `server/index.ts` — notably `POST /api/stripe/webhook`, which must be registered *before* `app.use(express.json())` because Stripe signature verification needs the raw body.

Grepping only `server/routes.ts` for a route and concluding it doesn't exist is a false negative. It cost a wrong claim in the SF-XX account-surfaces discovery (2026-07-28): I reported "only two Stripe routes exist, no webhook, so the app can never learn about a cancellation." Vlad refuted it — a signature-verified webhook handling `customer.subscription.created/updated/deleted` sits at `server/index.ts:71-164`, and it's wrapped in `if (isStripeConfigured && stripe)` with a 503 no-op `else` branch, so it's also conditionally dark depending on whether `STRIPE_WEBHOOK_SECRET` is set.

**Why:** raw-body middleware ordering forces webhook routes out of the normal registration path, so the split is structural and will persist for any future webhook (not just Stripe).

**How to apply:** when asking "does route X exist?", grep `server/` — not `server/routes.ts`. For any route wrapped in a config guard, check the `else` branch too; "registered" does not mean "live." For Stripe specifically, `GET /api/admin/stripe-webhook-health` already exists and is the cheap way to confirm whether webhooks are actually firing in a given environment, instead of inferring from env vars you can't read. Related: [[project_survivorpulse_publish_prerequisites]], [[project_survivorpulse_schema_drift_takes_down_dev_app]].
