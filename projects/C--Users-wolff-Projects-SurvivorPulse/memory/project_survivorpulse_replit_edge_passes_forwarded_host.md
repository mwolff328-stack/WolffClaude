---
name: project_survivorpulse_replit_edge_passes_forwarded_host
description: "Replit's edge forwards a client-supplied X-Forwarded-Host to the app unmodified -- it is not a mitigation for host-header trust, and APP_BASE_URL is unset in dev and prod."
metadata:
  type: project
---

**Measured 2026-08-26 against the deployed dev app.** Replit's edge does NOT overwrite or append to a client-supplied `X-Forwarded-Host` -- it passes it straight through, and `req.hostname` (with `trust proxy` set in `server/replitAuth.ts:86`) resolves to whatever the client sent. Never assume the platform proxy sanitises forwarding headers.

`APP_BASE_URL` is unset in BOTH the dev deployment (measured) and production (founder-confirmed same day), and it is not documented in `.env.example` as a var at all -- it appears only inside a Google-OAuth comment block. So any code branch guarded by `if (process.env.APP_BASE_URL)` is dead in every live environment.

Together these made `getBaseUrl` a host-header password-reset poisoning vector: `POST /api/auth/password/forgot` emailed `${origin}/reset-password?token=` to the account owner with the origin derived from the attacker's header. Fixed in `server/baseUrl.ts` (commit 2a692c32) by validating the host against `CANONICAL_HOST` + `REDIRECTED_HOSTS` + `REPLIT_DOMAINS` + `DEV_BASE_URL`.

**`canonicalHostRedirect` is not a host guard.** It skips `/api` paths and every non-GET/HEAD method, so all API traffic reaches handlers at any host whatsoever.

## Two harmless oracles for measuring host handling live

Both are read-only -- no email sent, no token minted -- so they work without probing the vulnerability itself or touching production:

1. **`GET /` with `X-Forwarded-Host: www.survivorpulse.com`** -> `301` to `https://survivorpulse.com/` if the header reached the app, `200` if the edge stripped it. Uses `REDIRECTED_HOSTS` as the detector.
2. **`GET /api/auth/google` with a forged `X-Forwarded-Host`** -> the `Location` header's `redirect_uri` IS `getBaseUrl`'s return value, printed verbatim. This reveals both whether the header is trusted AND whether `APP_BASE_URL` is set, in one request.

**Keep oracle 1 as the control when verifying a fix with oracle 2.** After the fix, oracle 2 returning the canonical host is ambiguous on its own -- the edge could have started stripping the header. Oracle 1 still returning `301` proves the header is STILL ARRIVING and the code is what rejects it. Without that control the verification cannot distinguish "fixed" from "environment changed". See [[feedback_a_harness_disagreement_is_evidence_about_the_harness]].
