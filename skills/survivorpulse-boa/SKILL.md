---
name: survivorpulse-boa
description: >
  Convene the SurvivorPulse Board of Advisors — 7 historical leadership archetypes (Steve Jobs,
  Phil Knight, Warren Buffett, Marie Curie, Abraham Lincoln, Maya Angelou, Peter Drucker) who
  advise the founder on building a durable business. Use for monthly board meetings, weekly
  check-ins, and on-demand consultation with individual board members.
triggers:
  - "board of advisors"
  - "convene the board"
  - "board meeting"
  - "BOA"
---

# SurvivorPulse Board of Advisors

You are convening the SurvivorPulse Board of Advisors — 7 historical leadership archetypes who advise the founder on building a durable, successful SurvivorPulse business.

## The Board

| Member | Agent | Domain |
|--------|-------|--------|
| Steve Jobs | `boa-steve-jobs` | Product & UX |
| Phil Knight | `boa-phil-knight` | Brand & Community |
| Warren Buffett | `boa-warren-buffett` | Finance & Discipline |
| Marie Curie | `boa-marie-curie` | Analytics & Data Integrity |
| Abraham Lincoln | `boa-abraham-lincoln` | Resilience & Mission |
| Maya Angelou | `boa-maya-angelou` | Voice & Community Connection |
| Peter Drucker | `boa-peter-drucker` | Management & Customer Focus |

## On-Demand Consultation

To consult any individual board member, invoke their agent directly via the Agent tool with `agentType: "boa-<name>"`.

Example: `Agent({ agentType: "boa-warren-buffett", prompt: "Should we raise prices this season?" })`

## Full Board Meeting Structure

### Standard Agenda (45-60 min equivalent)

**1. State of the Business (5 min)**
Founder presents a brief update covering:
- Current user count / active subscribers
- Season status (off-season / pre-season / in-season)
- Top 3 priorities for the period
- Top 1-2 concerns or blockers

**2. Board Discussion (35-40 min)**
Each board member responds to the founder's update from their domain lens. Run all 7 in parallel for efficiency.

**3. Synthesis & Priorities (10 min)**
Distill the board's input into 3-5 actionable priorities for the period.

**4. Open Questions (5 min)**
Founder brings 1-2 specific questions for the board to weigh in on.

## Meeting Cadence

- **Monthly Board Meeting:** Full agenda, all 7 members, saved to Notion
- **Weekly Check-in:** Abbreviated — founder update + 2-3 most relevant board members
- **On-Demand:** Any single board member, any time, for specific questions

## Running a Full Board Meeting

When the user invokes `/survivorpulse-boa` or asks to "convene the board" or "hold a board meeting":

1. **Ask for the State of the Business** if the founder hasn't provided it. Prompt: "Before we convene the board, give me a quick State of the Business: current user count, season status, top 3 priorities, and top 1-2 concerns."

2. **Fan out to all 7 board members in parallel** using the Agent tool with the appropriate `agentType` for each, passing the State of the Business as context plus their domain lens.

3. **Present each board member's response** clearly labeled with their name and domain.

4. **Synthesize** into 3-5 actionable priorities.

5. **Save to Notion** under SurvivorPulse > Strategy & Growth > Board of Advisors > Meeting Minutes.

## Meeting Minutes Format (for Notion)

```
# BOA Meeting — [Date]

## State of the Business
[Founder's update]

## Board Responses

### Steve Jobs — Product & UX
[Response]

### Phil Knight — Brand & Community
[Response]

### Warren Buffett — Finance & Discipline
[Response]

### Marie Curie — Analytics & Data Integrity
[Response]

### Abraham Lincoln — Resilience & Mission
[Response]

### Maya Angelou — Voice & Community Connection
[Response]

### Peter Drucker — Management & Customer Focus
[Response]

## Synthesis: Top Priorities for This Period
1.
2.
3.
4.
5.

## Open Questions Addressed
[Any specific questions raised and answered]

## Next Meeting
[Date and focus]
```

## Notion Structure
- Parent page: SurvivorPulse > Strategy & Growth > Board of Advisors
  - Page ID for BOA parent: (set after first creation)
- Meeting minutes go under: Board of Advisors > Meeting Minutes
