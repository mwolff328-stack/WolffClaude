---
name: sp-autonomous-weekly-review
description: Weekly review of queued sp-autonomous self-learning entries — drafts proposed SKILL.md/session-sync.md edits for founder approval. Sundays 6pm CT.
---

You are reviewing the sp-autonomous skill's self-learning queue for founder Michael Wolff. This runs unattended Sunday evening — Michael is unlikely to be watching live. Read `~/.claude/skills/sp-autonomous/references/self-learning.md` first if you need the exact schema and conventions; this prompt has everything else you need.

QUEUE FILE
`C:\Users\wolff\.claude\projects\C--Users-wolff-Projects-SurvivorPulse\sp-autonomous-learnings.jsonl`
One JSON object per line. If the file does not exist yet, there is nothing to review — skip straight to the "nothing this week" output below.

Entry shape: `{"ts","session","severity","target_file","target_section","observation","evidence","proposed_diff","status"}`.
Status-update companion lines (no `observation` field, just `{"ref_ts","status","batch"}`) reference an earlier entry by its `ts` — use these to determine which entries are still open. An entry is OPEN if no later line has `ref_ts` equal to its `ts` with `status` of `proposed`, `applied`, or `declined`.

YOUR JOB, IN ORDER

1. Parse the whole file. Build the set of OPEN entries (see above).
2. Split OPEN entries into:
   - **Normal severity** — the main batch for this review.
   - **Urgent severity, still open** — this should not normally happen (urgent entries are supposed to be surfaced immediately by the session that logged them), so treat any you find as a backstop catch: flag prominently that this was logged urgent and does NOT appear to have been surfaced yet.
3. For each open entry, read the current content of the named `target_file` (`~/.claude/skills/sp-autonomous/SKILL.md` or `~/.claude/skills/sp-autonomous/references/session-sync.md`) at the named `target_section`. If `proposed_diff` is already filled in, use it as the starting point and sanity-check it still applies cleanly against the current file (files may have moved since the entry was logged). If `proposed_diff` is empty, draft one yourself — concrete, in the same voice and density as the rest of that file (see existing sections for tone: evidence-driven, cites the specific incident, not generic advice).
4. Do NOT apply anything. This task drafts and presents only — every edit to this skill happens after Michael reviews it, same discipline as every prior change to this skill.
5. For each entry you drafted or finalized a diff for, append a status-update line to the queue file: `{"ref_ts":"<entry's ts>","status":"proposed","batch":"<today's date>"}`. This prevents re-proposing it next week. Do this whether or not Michael has responded yet — his response happens later, in a follow-up to this session.

OUTPUT — two deliveries, both required, even if the queue is empty or has nothing open

1. **Chat output** (markdown, this is your final message and IS the session's content — Michael may open this session directly):
   - Headed `🧠 sp-autonomous Weekly Review — <Mon DD>`
   - If nothing open: one line, "No candidate learnings queued this week." Stop there.
   - Otherwise, one subsection per proposed edit:
     - `### <N>. <target_file> — <target_section>`
     - One or two sentences: what happened (from `observation`), with the evidence cited.
     - The proposed diff, either as a fenced before/after quote of the relevant lines or a clear description of the insertion — precise enough that approving it means "yes, make exactly this change."
   - If any urgent-but-still-open entries exist, put those FIRST, under a `## ⚠️ Urgent — not yet surfaced` heading, before the normal batch.
   - End with: "→ Michael: reply 'apply 1' / 'apply all' / 'skip 2' and the next session picking this up will make the edits."

2. **Push notification**: call `PushNotification` (status: "proactive") every run, even on an empty week — it's the only channel that reliably reaches Michael from an unattended run. Under 200 characters, one line, no Markdown. Lead with the count and whether anything needs his eyes. Examples:
   - `sp-autonomous review: nothing queued this week.`
   - `sp-autonomous review: 3 proposed skill edits waiting on your approval. 1 urgent flag.`
   - `sp-autonomous review: 2 proposed skill edits ready to approve.`