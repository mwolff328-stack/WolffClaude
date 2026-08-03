---
name: feedback-relocating-an-entry-point-changes-its-threat-model
description: "Moving a UI affordance from one-page/once-per-session to every-page/always changes the endpoint's threat model even when the handler is untouched — re-ask the security questions about what sits behind it."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-29T22:55:52.632Z
---

SST-1111 (2026-07-29) moved the founding-feedback form from a once-per-session
Game Plan post-apply prompt to a TopBar button on every authenticated page. The
endpoint (`POST /api/me/founding-feedback`) was not modified — auth, server-derived
userId, Zod validation and Drizzle parameterization were all already correct — but
a code review flagged that it had no rate limiting, which was tolerable behind a
one-shot prompt and became an unbounded per-user 5000-char write path once the
button was everywhere. Also missing: a client `maxLength` matching the schema's
5000-char cap, so an over-length message got a "try again" error that could never
succeed.

**Why:** the review of a *relocation* diff naturally focuses on the new component.
The risk lives in the unchanged handler, whose assumptions the relocation quietly
invalidated.

**How to apply:** when you change WHERE or HOW OFTEN an entry point can be reached,
re-audit the endpoint behind it as if it were new — rate limiting, size caps,
abuse surface — even when the diff shows zero server changes. Mirror server-side
validation limits client-side so the user never hits an unactionable error.
