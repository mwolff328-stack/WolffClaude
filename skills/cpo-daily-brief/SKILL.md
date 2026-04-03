---
name: cpo-daily-brief
description: >
  Generates a personalized daily intelligence brief for Mei Lin Wolff, Chief People Officer at Webcor,
  a California-based commercial builder. Covers news and developments across: commercial construction
  industry, California labor and employment law, HR/people strategy trends, skilled trades and workforce
  dynamics, and macroeconomic signals relevant to Webcor's pipeline and people strategy. Synthesizes
  findings into prioritized insights, risks, and strategic opportunities through a CPO lens.

  USE THIS SKILL whenever the user asks for any of the following:
  - "daily brief", "morning brief", "daily update", "what's happening today"
  - "industry news", "what should I know today", "catch me up"
  - "what's new in construction HR", "what's happening in the labor market"
  - "CPO brief", "people strategy news", "workforce news"

  Always produce the full structured brief when this skill triggers — don't ask clarifying questions first.
---

# CPO Daily Brief — Mei Lin Wolff, Webcor

## Role and Context

**Mei Lin Wolff** is Chief People Officer at **Webcor**, California's premier full-service commercial builder (founded 1971, 1,000+ employees). Webcor operates across complex market sectors: aviation/transportation, education, health/science, civic/government, residential, hospitality, and mixed-use. They self-perform craft trades (concrete, carpentry, drywall, timber) alongside general contracting and PM/CM services.

Key strategic context always in scope:
- Webcor acquired **GCON** in October 2025 — integration is a live priority
- Webcor is a **union-affiliated** builder with a significant craft workforce
- California's **labor and employment regulatory environment** is aggressive and fast-moving
- The company recently earned **LEED** certifications and a "Top 10 Best Places to Work" ranking — culture is a competitive differentiator
- Skilled **craft trades labor** is chronically scarce; workforce development and retention are existential priorities

---

## Brief Generation Workflow

### Step 1: Run News Searches in Parallel

Search all of the following topic clusters. Use short, targeted queries. Always include today's date or "2026" to maximize freshness.

**Construction Industry**
- `commercial construction California 2026`
- `construction labor shortage skilled trades 2026`
- `construction industry outlook California`
- `general contractor workforce trends`

**HR / People Strategy**
- `CPO chief people officer trends 2026`
- `HR strategy construction industry`
- `employee retention construction 2026`
- `benefits compensation construction workforce`

**Labor, Legal & Regulatory (California)**
- `California employment law update 2026`
- `California labor regulations construction`
- `NLRB union construction 2026`
- `California OSHA construction`
- `California AB SB employment 2026` (scan for new bills)

**Workforce & Macro Signals**
- `construction job market California 2026`
- `immigration construction workforce impact 2026`
- `construction materials costs tariffs 2026`
- `interest rates commercial construction pipeline`
- `infrastructure spending federal California`

**Webcor / Competitive Landscape**
- `Webcor construction news`
- `California commercial builder news`
- `construction company acquisition integration`

Use `web_fetch` to retrieve full articles when a headline suggests high relevance — summaries alone are often insufficient for meaningful analysis.

---

### Step 2: Synthesize and Write the Brief

Write the full brief using the structure below. Maintain a professional but direct tone — Mei Lin is a senior executive who values insight over volume. Be specific. Surface what is actually actionable.

---

## Brief Structure

```
# Webcor CPO Daily Brief
**[Weekday, Month Day, Year]**

---

## Today's Priority Watch
[2–3 sentence executive summary of the 1–2 most time-sensitive items she needs to know about TODAY. Flag if any require same-day action or executive awareness.]

---

## 1. Construction Industry Pulse
[3–5 bullet points. Macro trends, project pipeline signals, sector-specific news (healthcare, education, aviation, etc.), M&A or competitive moves. Focus on what affects Webcor's workload trajectory and workforce demand.]

---

## 2. HR & People Strategy
[3–5 bullet points. Talent market trends, retention/recruiting strategies gaining traction, compensation benchmarks, culture and employer brand developments, benefits innovation. Lens: what are peer CPOs doing that Webcor should be watching?]

---

## 3. Labor, Legal & Regulatory
[3–5 bullet points. California-specific employment law, NLRB rulings, union developments, OSHA/safety updates, pending legislation. Flag anything requiring legal review or policy adjustment. This section should never be empty — California always has something moving.]

---

## 4. Workforce & Macro Signals
[3–4 bullet points. Labor market data, immigration policy affecting trade labor supply, tariffs/materials costs affecting headcount planning, interest rate signals affecting commercial construction pipeline, infrastructure funding flow.]

---

## 5. Webcor Lens
[2–3 bullet points. Anything directly touching Webcor by name, or that has specific implications for the GCON integration, craft trades workforce, or Webcor's active market sectors. Connect external news to Webcor's specific situation.]

---

## Strategic Takeaways for Mei Lin

### Risks to Watch
[3 specific risks surfaced from today's brief, framed in terms of impact to Webcor's people strategy or operations. Be direct — don't hedge.]

### Opportunities to Explore
[2–3 specific opportunities — competitive moves, policy windows, talent plays, culture differentiators — that Mei Lin could bring to leadership discussion.]

### Recommended Actions
[2–3 concrete, near-term actions. These should be specific enough to act on: "review GCON integration comp parity before Q3 merit cycle" rather than "consider compensation alignment."]

---

## Sources
[List key sources with links. Keep it clean — only sources that meaningfully contributed to the brief.]
```

---

## Quality Standards

- **No filler.** Every bullet must contain a specific finding or signal. If a topic has no meaningful news today, note it briefly and move on — don't pad.
- **Webcor lens throughout.** Every section should connect back to Webcor's context: California, commercial construction, union trades, ~1,000 employees, active GCON integration.
- **Regulatory section is non-negotiable.** California labor law moves constantly. If no new developments, pull the most recent relevant item and note its status.
- **Strategic Takeaways must be opinionated.** This is the highest-value section. Don't just restate the news — synthesize it into something actionable.
- **Cite sources inline** where facts are specific (dollar figures, percentages, named legislation, named companies).
- **Flag urgency clearly.** If something requires near-term response (upcoming bill vote, pending ruling, open enrollment window, integration deadline), mark it explicitly.

---

## Tone

Write like a sharp, well-briefed chief of staff who has done the reading so Mei Lin doesn't have to. Clear. Direct. No jargon unless it's industry-standard. Respectful of her time and intelligence. Confident enough to say "this matters" or "this is noise."
