---
name: survivorpulse-backtesting-research
description: >
  SurvivorPulse backtesting research and strategy analysis. Use when working in or posting to the
  #stan-backtesting-research Discord channel (1492758599393349673). Covers: strategy evaluation via
  historical season replay, entry scaling analysis, correlation metrics, EV/FV blend optimization,
  and portfolio-size-dependent strategy selection. Stan the Scout produces this research. Trigger on:
  backtesting results, strategy comparison, entry count analysis, blend ratios, or season replay findings.
triggers:
  - "#stan-backtesting-research"
  - "backtesting research"
  - "strategy analysis"
  - "entry scaling"
  - "blend ratio"
  - "EV/FV"
---

# SurvivorPulse Backtesting Research

You are operating in the SurvivorPulse #stan-backtesting-research channel context. This channel is for backtesting analysis, strategy evaluation, and research findings that feed the CMEA prototype.

## Doctrine context

SurvivorPulse validates that "different teams can still be the same bet." Backtesting proves this empirically using historical NFL season data. All analysis is deterministic and reproducible.

## Research history

### Rounds 1-5 (general strategy comparison)
- 5 entries, 3 seasons evaluated
- **Winner:** 70/30 Blend (70% EV + 30% Future Value) in every round
- Full results: `memory/stan-backtesting-research.md`

### Round 6 (entry scaling)
- 14 strategies x 4 entry counts (3, 10, 20, 50) x 3 seasons
- **Key finding:** optimal strategy depends on portfolio size
  - n=3-5: 70/30 Blend wins
  - n=10: SP Production 70%EV+30%FV wins (7 strategies beat 70/30 Blend)
  - n=20: Mixed Portfolio wins (4 strategies beat 70/30 Blend)
  - n=50: 70/30 Blend reclaims #1 (team exhaustion makes sophistication backfire)
- Full results: `memory/stan-entry-scale-research.md`

## Key metrics

- **Survival rate:** % of entries alive at each week
- **Correlation Delta:** positive = harmful correlation, negative = diversification benefit
- **EV (Expected Value):** probability-weighted pick quality
- **FV (Future Value):** preserving strong teams for later weeks
- **Blend ratio:** weighted combination of EV and FV signals

## CA1 credibility asset

- Artifact: `CA1_Rewrite_Final.md` + full JSON output in Google Drive
- Headline: portfolio approach outlasted independent entries by +1.04 weeks avg
- Week 14 chalk collapse: Tampa Bay 57% ownership, Loss = 80% field eliminated
- Season results: 78.9% wipeout probability (all entries), 21.1% chance 1+ survives to end

## Data sources

- Yahoo pick distributions: weeks 1-18 (2025 season)
- 4for4 spreads: weeks 1-17
- Weekly NFL optimizer spreadsheets v1-v24
- All data in Google Drive: `~/Library/CloudStorage/GoogleDrive-michael.wolff@survivorpulse.com/Shared drives/SurvivorPulse/`

## Research output format

Follow Stan's standard format:
- **Brief:** restate the research question
- **Key findings:** 3-7 bullets with "so what" for each
- **Gaps:** what remains unvalidated
- **Next step:** what agent or action follows
- **Sources:** data and methods used

## Channel formatting

- Bullet lists only (no markdown tables)
- Include specific numbers: survival rates, blend ratios, entry counts
- Reference specific weeks/seasons when citing data points
- Link to memory files or Drive docs for full datasets
