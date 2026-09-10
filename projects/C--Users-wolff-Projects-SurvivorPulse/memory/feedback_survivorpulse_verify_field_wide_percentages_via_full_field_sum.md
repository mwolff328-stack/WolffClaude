---
name: feedback_survivorpulse_verify_field_wide_percentages_via_full_field_sum
description: To empirically test whether a displayed survivor-pool "pick %" is of decided-picks-so-far vs. of all-alive-entries, sum percentages across the WHOLE WEEK's candidate teams (one pick per week), not per-matchup — a per-matchup sum is meaningless because survivor picks are one team for the whole week, not one team per game.
metadata:
  type: feedback
  originSessionId: nervous-vaughan-d24dc4
  modified: 2026-09-10T05:02:25.601Z
---

While assessing BetOnline's NFL Survivor contest ownership display (screenshot analysis, comparing it to SurvivorPulse's own Yahoo-sourced pick-popularity data), I first proposed checking whether each matchup's two team-percentages summed to ~100% as a way to distinguish "% of entries who've already picked" from "% of all alive entries (including undecided)." That framing was wrong: survivor pools have entrants make **one pick for the entire week**, not one pick per game. A per-matchup sum is not a meaningful quantity at all.

The correct check: sum the displayed percentage across **every candidate team for the week** (all teams playing that week, across all matchups — e.g. 32 teams / 16 games). If the display is "% of entries who have already submitted a pick this week," that total should land close to 100% (real-world screenshots landed at 89%, fully explained by each of ~32 values being rounded down to the nearest whole percent — up to 16 points of slack from rounding alone). If the display were instead "% of all alive entries regardless of whether they've picked yet," the total would sit well below 100% whenever a meaningful fraction of the field hasn't picked — which is especially detectable early in the week, before the first game of that week has kicked off.

**Why:** self-caught mid-session — proposed the wrong (per-matchup) check first, then corrected it against the actual game mechanics before reporting the finding to the founder. The corrected check was concretely useful: it resolved a real ambiguity (BetOnline never states these semantics anywhere in the UI) with the user's own screenshot data.

**How to apply:** any time a "pick %" or "ownership %" data source's exact denominator (all entries vs. decided-entries-only) is ambiguous and unstated by the source, don't guess — sum the reported percentages across the *whole relevant decision unit* (here: the full week's team choices, since it's one pick per week) and compare to ~100%, accounting for per-value rounding as slack. Applies to any single-pick-per-period pool/contest data (survivor pools, similar season-long elimination formats) — verify what the "one decision" unit actually is before choosing what to sum.
