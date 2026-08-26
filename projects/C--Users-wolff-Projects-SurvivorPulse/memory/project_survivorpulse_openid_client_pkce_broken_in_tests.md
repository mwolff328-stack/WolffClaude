---
name: project_survivorpulse_openid_client_pkce_broken_in_tests
description: "openid-client's calculatePKCECodeChallenge throws \"input.subarray is not a function\" under this repo's vitest environment, so any test driving an OAuth initiation route must stub that one hash."
metadata: 
  node_type: memory
  type: project
  originSessionId: d581e46c-212b-4660-84cf-9615154ef121
  modified: 2026-08-26T17:39:06.028Z
---

**`client.calculatePKCECodeChallenge()` from `openid-client` throws `TypeError: input.subarray is not a function` under this repo's vitest setup.** Confirmed environmental by a control test that imports *nothing* but `openid-client` and calls it — no SurvivorPulse code in the graph, same failure. Found 2026-08-26 building SST-1467.

**Consequence:** any test that drives an OAuth **initiation** route end-to-end (`GET /api/auth/google`, `GET /api/auth/google/link`) hits it, because those routes call `randomPKCECodeVerifier()` then `calculatePKCECodeChallenge()` before building the authorization URL. The route swallows it into its own catch and redirects to the error destination, so the symptom is **a redirect to `?error=GOOGLE_AUTH_UNAVAILABLE` instead of to `accounts.google.com`** — which looks exactly like a configuration problem or a bug in the route, not like a broken hash. The real error only appears on stderr as `Google ... initiation error: input.subarray is not a function`.

This is very likely why `tests/auth-google-routes.test.ts` never covered the initiation happy path, and it is part of why the sign-in exchange call site was unguarded until SST-1467 added `tests/googleExchangeCallSite.sst1467.test.ts` — see [[feedback_guard_the_wire_not_just_the_helper]].

**Workaround** — stub only that one hash, keeping the rest of `openid-client` real:

```ts
vi.mock('openid-client', async (importActual) => {
  const actual = await importActual<typeof import('openid-client')>();
  return { ...actual, calculatePKCECodeChallenge: async () => 'test-code-challenge' };
});
```

Stub **OIDC discovery** separately (it needs network), but build the authorization URL with the REAL `openid-client` against a real `Configuration` so assertions about `redirect_uri` still test our code rather than a fixture:

```ts
new client.Configuration(
  { issuer: 'https://accounts.google.com',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_endpoint: 'https://oauth2.googleapis.com/token' },
  'test-client-id', 'test-client-secret',
)
```

Do **not** conclude the route is broken, and do not "fix" the route to satisfy such a test. Run the two-line control first — if a bare `openid-client` import fails the same way, it is the environment. Same discipline as [[project_survivorpulse_sandbox_has_no_local_postgres]]: prove the limit is environmental with an untouched control before attributing a failure to your change.
