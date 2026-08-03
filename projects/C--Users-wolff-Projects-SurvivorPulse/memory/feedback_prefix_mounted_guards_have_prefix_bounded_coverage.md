---
name: feedback_prefix_mounted_guards_have_prefix_bounded_coverage
description: "A guard mounted at a path prefix covers only that prefix — 'it covers everything' is a claim about today's route table, not a property, until a tripwire pins it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: f8c8a42e-f441-4153-aff9-4a83881d1a26
  modified: 2026-07-31T19:19:02.537Z
---

Found twice in one day, 2026-07-31, in two unrelated files, by two sessions.

**The shape.** Anything scoped to a path prefix — `app.use('/api', guard)`, or a
scan whose regex hardcodes `/api` into the path match — has coverage *bounded by
that prefix*. When nothing currently lives outside the prefix, the guard looks
total and the claim "covers the whole surface" is true. It is true as a fact
about the current route table, not as a property of the design, and nothing
signals when that stops being true.

- `tests/apiRoutesRequireAuthGuard.test.ts` claimed repo-wide auth coverage while
  its regex hardcoded `/api`, so it was blind to `GET /docs` and
  `GET /openapi.yaml` — the exact prefix-scoping failure that test lineage
  exists to eliminate, one level up.
- `rejectReadOnlyWrites` (SST-1174) is mounted at `app.use('/api', ...)`. I
  verified the mount ORDERING carefully and never asked what lives outside the
  prefix. A scan found zero non-`/api` write routes, so the guard was in fact
  total — but one `app.post('/webhook/x')` would have escaped it silently.

**How to apply.** When a guard or scan is scoped to a prefix, do not assert
coverage — assert the *bound*. Add a tripwire that fails when anything appears
outside the prefix (for SST-1174: walk `server/**/*.ts`, assert no
POST/PUT/PATCH/DELETE route registers outside `/api`). Verifying the mount point
is necessary and not sufficient; the question the ordering test cannot ask is
"what isn't behind this mount at all?"

Two details that make such a scan trustworthy:
- **Strip comments before scanning.** My first structural test found
  `registerRoutes(app)` inside the mount's own explanatory COMMENT and concluded
  the mount came after the call. Add meta-tests pinning that the stripper works,
  or the whole block fails open while reporting green. See
  [[feedback_survivorpulse_source_text_guards_fooled_by_text]] and
  [[feedback_source_scanning_guards_need_three_meta_tests]].
- **`app.get("env")` is Express's SETTINGS GETTER, not a route.** A naive
  `app.get(...)` scan counts it. Require the path capture to start with `/` so it
  is excluded at the regex level rather than filtered afterwards.

**RED-prove both directions**, or the tripwire is decorative: (1) insert a real
violation — an `app.post('/webhook/...')` outside the prefix — and watch it fire;
(2) gut the file walker so it returns nothing, and watch the floor assertion
catch the empty scan. A tripwire that only ever ran against a clean tree has
never demonstrated it can fail. See [[feedback_proving_a_test_is_load_bearing]].
