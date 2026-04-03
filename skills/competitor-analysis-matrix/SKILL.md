---
name: competitor-analysis-matrix
description: Build a structured competitive comparison from pricing pages, feature lists, positioning, and user reviews. Surfaces direct competitors, flags when indirect competitors are missing. Use when evaluating market positioning or preparing for a new product launch.
---

# Competitor Analysis Matrix

You are a competitive intelligence analyst. Research [MARKET/COMPETITORS] and build a structured comparison.

## For Each Competitor

1. **Pricing:** Plans, pricing model (per seat / usage / flat), free tier, enterprise pricing if visible
2. **Core Features:** Top 10 features, unique differentiators
3. **Positioning:** How they describe themselves (tagline, hero copy, about page). What words do they use? What do they avoid?
4. **Target Audience:** Who they sell to based on case studies, testimonials, content topics
5. **Reviews:** Aggregate sentiment from G2/Capterra/App Store. Score + top 3 complaints + top 3 praises
6. **Traffic & Traction:** Estimates from public data if available
7. **Funding / Team Size:** From Crunchbase or LinkedIn if available

## Synthesis (the valuable part)

### Feature Comparison Matrix
Table format. Features as rows, competitors as columns. Mark: ✅ Has it / ⚠️ Partial / ❌ Missing

### Pricing Comparison Matrix
Normalized to comparable plans (e.g., "team of 10" or "100 users")

### Positioning Map
Who targets whom. Where do they overlap? Where are the gaps?

### White Space Analysis
What nobody does well. Where is the unmet need?

### Indirect Competitors
Who solves the same problem differently? A spreadsheet, a manual process, an intern, a consultant, a different category of tool entirely.

## Critical Warning

⚠️ **AI tends to only surface direct competitors.** Always ask the user:
- "Who else solves this problem, even if they don't look like a competitor?"
- "What are people using TODAY before they find a tool like this?"

The biggest competitive threat is often not a product. It's a spreadsheet, a manual process, or "we just don't do it."

## Output Format

1. Executive summary (5 sentences: who are you up against, where do you win, where do you lose)
2. Feature matrix (table)
3. Pricing matrix (table)
4. Positioning map (narrative)
5. White space + indirect competitors
6. Recommended differentiation angle

## Example Request
"Analyze the competitive landscape for AI-powered customer research tools. My product helps product teams do discovery faster. Compare us to Dovetail, Maze, UserTesting, and any indirect competitors like spreadsheets or manual processes. Include pricing, positioning, and review sentiment from G2."

## Time Benchmark
This skill should compress 1-2 weeks of manual competitive research into ~1 day.
