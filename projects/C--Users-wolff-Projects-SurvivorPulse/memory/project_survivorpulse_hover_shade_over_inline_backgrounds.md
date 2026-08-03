---
name: project-survivorpulse-hover-shade-over-inline-backgrounds
description: "Class-based :hover backgrounds lose to inline styles — an inset box-shadow overlay is the way to add hover shading to SurvivorPulse's inline-styled cockpit cells, and jsdom can only prove the class contract."
metadata: 
  node_type: memory
  type: project
  originSessionId: 934ead4d-d534-45a5-b163-a22e49249c1a
  modified: 2026-07-29T22:55:39.341Z
---

The cockpit's pick cells and week cards are styled with inline `style` objects
(different background per variant: `--sp-elevated`, `--sp-surface-secondary`,
transparent, `--sp-recommend-subtle` when selected). A class with
`:hover { background: … }` silently loses the cascade to those inline values.

**Pattern that works** (`client/src/index.css`, `@utility sp-hover-shade`, added
SST-1113 2026-07-29):

```css
@utility sp-hover-shade {
  transition: box-shadow 120ms ease;
  &:hover { box-shadow: inset 0 0 0 999px rgba(255, 255, 255, 0.05); }
}
```

An inset box-shadow layers OVER whatever background exists without touching the
property, and inherits the element's own border-radius — one utility covered five
differently-backgrounded cell variants plus the week cards. Shade strength matches
the app's existing hover vocabulary (`btn-toolbar`, `entry-card`: 0.05–0.07).
Caveat: dnd-kit supplies an inline `transition` on week cards, which overrides the
class's, so card shading snaps rather than eases (accepted as cosmetic).

**Testing:** jsdom cannot observe `:hover`, so unit tests pin the CLASS-PRESENCE
contract (editable cell ⇒ class present; inert `out-of-schedule` ⇒ absent) and the
visual effect is verified in a real browser. Measure it as a DOM distribution
rather than a screenshot when the Browser pane isn't compositing — e.g. group
`[data-testid^="season-grid-cell-"]` by `data-cell-kind` and count how many carry
the class. Name which of the two you actually proved.

Related: the sp-live-verify skill
