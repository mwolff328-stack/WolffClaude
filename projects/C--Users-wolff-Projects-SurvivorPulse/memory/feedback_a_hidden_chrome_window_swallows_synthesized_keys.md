---
name: feedback_a_hidden_chrome_window_swallows_synthesized_keys
description: "A minimized/hidden Chrome window silently drops computer-tool key presses - the feature looks broken and isn't. Install a keydown listener before concluding anything."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: dff6dd94-c747-42ae-88a9-17d5bf29cf89
  modified: 2026-09-02T16:49:48.055Z
---

`mcp__claude-in-chrome__computer {action:"key"}` returns **"Pressed 1 key: ArrowRight"** — a success string — while delivering **nothing** to the page, whenever the Chrome window is minimized or otherwise not compositing. Measured 2026-09-02 verifying a radiogroup arrow-key migration: focus did not move, nothing became checked, and the obvious read was "the arrow keys don't work in a real browser, jsdom lied."

**Why:** the tool synthesizes input into a window that isn't rendering. Same measurement-artifact family as `sp-live-verify` §4's frozen-animation trap — what you're checking isn't what you think you're checking — but it fails *silently and positively*, which is worse: the frozen-animation trap at least returns numbers, this one returns a success message.

**Diagnose before concluding, in one call:**
```js
({ hasFocus: document.hasFocus(), visibility: document.visibilityState,
   w: window.outerWidth, h: window.outerHeight })
```
`visibilityState:"hidden"` with `outerWidth:0` means every native-input result this session is void. Note `document.hasFocus()` returned **true** — it is not a usable signal here. The corroborating symptom is `computer {action:"screenshot"}` failing with `Cannot take screenshot with 0 width`.

**Prove it rather than infer it** — install a capture-phase listener, press the key, and read what arrived:
```js
window.__k=[]; document.addEventListener('keydown', e=>window.__k.push(e.key), true);
// ...press the key via the computer tool...
window.__k   // [] means the event never reached the page at all
```
An empty array is proof the input never arrived. A populated array with the wrong `key` is a different bug (key-name mapping) and needs a different fix.

**The workaround that still buys you something real:** dispatch `new KeyboardEvent('keydown', {key, bubbles:true, cancelable:true})` from `document.activeElement` via `javascript_tool`. That is not native input and must be labelled as such — it bypasses the browser's own focus-order and default-action logic — but it does run through real Chrome's DOM and real React's synthetic-event pipeline against the real running app, which is strictly more than jsdom proves. Native **tab order** can still be verified honestly without any key press: read `tabIndex` on each option, since Chrome natively skips `tabindex="-1"`.

Related: [[project_survivorpulse_chrome_click_coordinate_traps]], [[feedback_a_harness_disagreement_is_evidence_about_the_harness]], [[feedback_shared_resource_outages_are_misattributed]].
