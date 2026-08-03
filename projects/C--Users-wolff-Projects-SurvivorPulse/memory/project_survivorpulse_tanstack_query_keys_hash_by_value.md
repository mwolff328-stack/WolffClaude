---
name: survivorpulse-tanstack-query-keys-hash-by-value
description: "TanStack Query hashes queryKey by value (stable JSON.stringify), not reference — two hooks in different files with textually-identical key arrays share ONE cache entry even with different queryFns/staleTime."
metadata: 
  node_type: memory
  type: project
  originSessionId: fd2a6533-9f56-4aba-bc36-5e4f6343c6e7
  modified: 2026-08-03T15:35:06.372Z
---

Two `useQuery` calls with value-equal `queryKey` arrays (e.g. both `["/api/me/season-debrief/current"]`) resolve to the exact same `Query` object in the `QueryClient`'s cache — TanStack Query's default `hashKey` does a stable `JSON.stringify`, not a reference comparison. This is true even when the two calls live in different hook files, have different `queryFn` implementations, and different `staleTime`.

Consequence, confirmed in this codebase (SST-1252): `client/src/hooks/useCurrentSeasonDebrief.ts` and `client/src/hooks/useWizardApi.ts` each declared their own `useCurrentSeasonDebrief()` hook with what looked like independent cache keys — but the literal key values were identical. Whichever hook's observer actually triggered a given fetch (mount-order/staleness dependent, not a clean per-file split) determined the error-handling and 401-redirect behavior **both** consuming components got for that fetch — a session visiting Home then a second surface reading the "same" data could get either hook's error semantics, unpredictably.

**Why this is easy to miss:** each hook "looks" self-contained reading its own file — the collision is invisible until both are mounted under the same `QueryClient` at once, which single-hook unit tests never do.

**How to apply:** when two hooks in different files fetch the same server endpoint, check their actual `queryKey` values for accidental equality before assuming they're independent — don't infer independence from the hooks living in separate files or having separate-looking query-key factory functions. If they must stay separate (different auth/staleTime semantics), give them deliberately distinct keys; if there's no reason for two hooks to exist, consolidate onto one.

The fix mechanism used here: `client/src/lib/queryClient.ts`'s `getQueryFn` gained an additive `url` option, since its fetcher builds the request URL via `queryKey.join("/")` — so simply giving a hook a distinct (non-URL-shaped) key would otherwise silently 404 in production unless the URL is decoupled from the key. See the SST-1252 ticket (Notion) for the full writeup.
