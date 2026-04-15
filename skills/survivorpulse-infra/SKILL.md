---
name: survivorpulse-infra
description: >
  SurvivorPulse infrastructure, CI/CD, and ops coordination. Use when working in or posting to the
  #infra Discord channel (1491786035980537978). Covers: CI pipeline monitoring (Pre-Publish Gate and
  Release Guardian workflows), deployment coordination via Replit, GitHub Actions troubleshooting,
  environment secrets management, database ops (Neon Postgres), and automation tasks (Rita's domain).
  Trigger on: CI failures, deployment questions, infra alerts, automation design, webhook setup,
  env var changes, or any ops-related discussion in #infra.
triggers:
  - "#infra"
  - "CI failed"
  - "deploy"
  - "pipeline"
  - "workflow failed"
  - "Release Guardian"
  - "Pre-Publish Gate"
---

# SurvivorPulse Infrastructure & Ops

You are operating in the SurvivorPulse #infra channel context. This channel is for ops, CI, integrations, and automation work.

## CI Pipeline

Two GitHub Actions workflows run on push to `main`:

### Pre-Publish Gate (ship gate)
- Runs: unit, integration, E2E, regression tests in sequence
- Stops on first failure
- Notifies Telegram + Discord on pass/fail

### Release Guardian (contract/governance gate)
- Runs: contract tests, governance checks
- Notifies Telegram + Discord on pass/fail

### Shared infrastructure
- Composite action for DB setup: `.github/actions/ci-db-setup/action.yml`
- Stage failure tracking via `FAILED_STAGE` env var
- Telegram bot: @survivorpulse_ci_bot (chat ID: 8508558620)
- GitHub secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, DISCORD_WEBHOOK_URL

## Environment

- **Repo:** `git@github.com:mwolff328-stack/SurvivorPulse.git`
- **Hosting:** Replit (production)
- **Database:** Neon Postgres (connection via env vars)
- **Secrets:** `.env.survivorpulse` (gitignored) covers Neon DB, Stripe live, Postmark, Odds API, session secret, Replit object store
- **Auth:** Custom sessions + CSRF + rate limiting

## When posting to #infra

- Use bullet lists, not markdown tables (Discord limitation)
- Keep messages concise and actionable
- For CI failures: include the failed stage, test file, and first error line
- For deployment: include commit hash, branch, and any env changes needed
- Tag issues as: `[CI]`, `[DEPLOY]`, `[DB]`, `[AUTOMATION]`, `[SECRETS]`

## Automation (Rita's domain)

When automation tasks surface in #infra:
1. Document the manual process first
2. Identify simplest path using existing stack
3. Define trigger, steps, success/failure conditions, and kill switch
4. Never automate irreversible actions without human approval step

## Escalation

- CI failures that block shipping: tag immediately, include full error context
- Secret rotation needed: flag to founder, never commit secrets
- Database migrations: always backup first, test on branch before main
