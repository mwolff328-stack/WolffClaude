---
name: project-survivorpulse-flex-percentage-height-and-radix-traps
description: "Two silent traps hit on the same component — h-full inside a flex-grown parent degrades to auto (clipping content), and a Radix Dialog with no DialogTrigger has no focus restore at all."
metadata: 
  node_type: memory
  type: project
  originSessionId: ef215415-3268-47ac-93a3-a141e9208eb2
  modified: 2026-07-29T04:23:51.141Z
---

Two independent silent failures found on `LegalDocumentModal` (SST-1093, 2026-07-29). Both are
invisible to jsdom and both generalise well beyond that component.

## 1. `h-full` inside a flex-grown parent silently becomes `auto`

A percentage height resolves against the parent's **specified** height. A `flex-1` parent's
specified height is `auto`, so `height: 100%` on its child falls back to `auto` and the child grows
to its content instead of filling its slot.

This hit the shared `ScrollArea` (`client/src/components/ui/scroll-area.tsx`), whose inner
`Viewport` is `h-full w-full`. Used as a flex child, the viewport measured **1254px inside a 446px
region** — the legal document was **clipped, not scrollable**, unreachable past section 4, and the
overflow pushed the dialog off-screen. Diagnosis confirmed by forcing a pixel height on the
viewport and watching it start scrolling.

Two fixes were needed together, and `min-h-0` alone was NOT enough:
- `min-h-0` on the flex child (a flex item defaults to `min-height: auto` and cannot shrink below
  its content), and
- a plain `overflow-y-auto` div instead of `ScrollArea`, because the percentage-height problem is
  inside the primitive.

There are ~7 other `ScrollArea` call sites. Any used as a flex-grown child is exposed. Ones with an
explicit height (`h-[400px]`) are fine.

## 2. A Radix `Dialog` with no `DialogTrigger` has NO focus restore

`@radix-ui/react-dialog` restores focus on close via `context.triggerRef` (dist/index.mjs:156),
and that ref is populated **only** by a mounted `DialogTrigger` (:71). With no trigger, the ref
stays `null` forever and the optional chain makes the restore a **silent no-op** — and
`FocusScope`'s own `previouslyFocusedElement` fallback is unreachable too, because Radix's handler
`preventDefault()`s unconditionally.

So any dialog opened from an element outside its own tree (here: a real `<a href>` in the footer,
kept so open-in-new-tab and crawlers still work) must wire it explicitly:

```tsx
onCloseAutoFocus={(e) => { e.preventDefault(); triggerRef.current?.focus({ preventScroll: true }); }}
```

`preventScroll` matters: `FocusScope` restores inside a `setTimeout`, so on a close-then-navigate
path the new page mounts and scrolls to top *first*, then a scrolling `focus()` drags the reader
back down to wherever the trigger lives.

Related: [[project_survivorpulse_compact_grid_card_layout_trap]] (jsdom cannot see layout),
the sp-live-verify skill (how to measure this correctly).
