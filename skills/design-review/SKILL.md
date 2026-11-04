---
name: design-review
description: "Review built UI the way a picky designer would, before anyone else sees it: look at it running, sample loads frame by frame for pop-in and jumps, measure alignment, radii and gaps instead of eyeballing them, judge emphasis in the full window and at phone width, walk every state, theme and platform, read every word of copy, then fix what is real. Use after building or changing any screen, component, or visual, before showing it to a person or marking a PR ready, and when asked to review, polish, or QA a UI."
---

# Design review

A person notices in two seconds what an agent misses in twenty minutes: a row 4 px off its neighbour, a header that jumps mid-load, a card that is far too loud once seen in the whole window. This skill is the pass that catches those before the person does.

It runs on the real thing, running. Reading the code is not a review, and neither is a component harness alone: do the last check in the real app.

Read [references/measure.md](references/measure.md) before measuring anything: it has the box, gap, radius, wrap and contrast snippets and the frame sampler. Use [references/checklist.md](references/checklist.md) as the walk-through for a full pass.

## 0. Get the rules, the baseline and the ask

- Read `DESIGN.md` (repo root or `docs/`): principles, voice, Do / Don't, building blocks. No DESIGN.md: review against the app's neighbouring screens and the defaults here, and say so.
- Have the before open next to it (the merge base, not the branch with a flag off). A review that cannot say what changed cannot say whether it got better.
- **Read the note for its surface.** When a note could apply to more than one place (the doc or the product, this bar or that one, this preview or every preview), act on the one the person is looking at and say in one line which reading you took. Do not turn a note about one case into a global rule.
- **Change only what was named.** A request to widen a row is not a request to restyle its hover. Keep every other control where it is, and list any interpretive call you made so the person can reverse it.

## 1. Look at it running, in every state

Open it in a browser (or the device loop) and screenshot each of these. Then look at the screenshots.

- **States:** loaded, empty, loading, error, one item, many items (past the scroll threshold), the longest real string, a missing value, a filtered view. Size the fixtures so overflow, scrolling and shared views actually happen.
- **Sizes:** the default window most people use, a tight window, side panels open, a phone (390 px wide), and for mobile a small phone and the keyboard open.
- **Themes:** light and dark. Check user-picked colours (labels, marks, avatars) against both grounds.
- **Motion and loads:** watch it open, close, load and move between states, and sample it (section 2). A still cannot show a jump.
- **First frame:** look at where each session lands. Seed accounts often open on a wizard or the wrong page.

A state you did not look at is a state you did not review. Say which ones you skipped, which ones synthetic input could not reach (long-press, a real drag-leave, device gestures), and never claim a visual result from an environment that cannot render it (no GPU, no WebGL, a fallback font).

## 2. Nothing moves what the person reads

The most common thing people catch, and the one a still of the settled state never shows.

- **Open at once, at the final size.** Navigation never waits on a spinner. The destination opens with a skeleton that holds the box of what replaces it: same slot, size, radius and gaps, so only tone changes on the swap.
- **Late pieces land together.** A badge, side pane, summary line or card that arrives on its own flashes over a skeleton or shoves the text below it. Hold it until its neighbours are ready, or reserve its space.
- **Plan the empty resolution.** A placeholder that resolves to nothing must not leave a gap or let the content below jump up. Decide the layout only after the data it depends on has arrived.
- **Still coming looks different from nothing here.** Do not show a pane, tab or field until it holds something real; one that only echoes what the person typed looks broken.
- **Controls keep their box across states.** "Copy" to "Copied", a spinner replacing an icon, "Mute" to "Unmute": reserve the longest label's width, swap in place at the same size, and update text without remounting it (a remount restarts fades and scroll).
- **Hover never shifts layout.** Overlay row actions at the row end; reveal with opacity and pointer-events, not display. Measure the row at rest, on hover and on focus: the boxes must match.
- **Growing lists keep their reader.** New content stays in view as it arrives, scrolling up releases the pin, and a capped region ends on a whole row with "N more" rather than slicing one.
- **Entrance motion only for arrivals.** Things that arrive while the person watches may fade in; nothing re-animates on first paint, remount or returning to a tab.

**Prove it per frame.** Run the frame sampler (`scripts/sample-frames.cjs`, see measure.md) on every load and transition you touched. Report counts: frames where a watched element jumped, frames showing neither the placeholder nor the real thing, frames showing both. "0 of 611 frames" is a finding; "looks fine" is not. Delay the slow request (`--delay`) to see the state a fast machine hides.

## 3. Measure, do not eyeball

In the page, with `getBoundingClientRect` and `getComputedStyle` (snippets in measure.md):

- **Columns:** rows of different kinds in one list share the icon column, the title start and the same actions in the same place.
- **Edges:** neighbours that look aligned are aligned (left edges, baselines, centres). Re-measure after any content change; adding a line can knock a group off centre.
- **Gaps:** stacked blocks have equal gaps. When spacing is off, write the system as a few numeric rules (ideally one step) and audit every adjacent pair by script, in every state, at desktop and phone width. Count borders and scrollbar tracks.
- **Padding:** an edge control has equal padding on both sides. Reset native button padding so icons render at their intended size.
- **Radii:** nested corners are concentric (inner radius equals outer radius minus the inset). No child clips the parent's corners or focus ring, and fills and insets follow the container's radius instead of cutting square.
- **Focus and hover:** the hover tint, focus ring and hit area wrap the same visible box, and rings stay inside their container and the viewport.
- **Siblings:** controls in one bar share variant, height and tooltip mechanism; icon-only buttons are square.
- **Computed style:** read the computed value of anything you restyled or overrode, in rest, hover, pressed, selected and both themes. Class merging and variant specificity drop changes silently. Check what a token named "primary" or "accent" actually renders as before using it for state.
- **Zoom:** look at every join (popover arrow, rounded corner, hairline, avatar ring, scrollbar gutter) in an 8x crop, on plain, hovered and selected rows, in both themes.

Report numbers: "title starts at 52 px in project rows and 36 px in chat rows". Fix differences rather than listing them as nits. When the person circles one instance, measure every instance of that kind and fix the rule.

## 4. Text at its real widths

- Check every string at the narrowest sidebar, phone drawer and default window, in the product's real font (confirm it loaded). No lone word on the last line, no title cut while space sits empty beside it.
- Pills, badges, button bars and selects hold their longest label in their narrowest container: fixed heights become min-heights, pills do not wrap, a menu locked to its trigger's width gets its own.
- Fix overflow with shorter copy (a first name, fewer words) before shrinking type.

## 5. Emphasis, judged in the full window

- **Judge loudness in the whole app window and at phone width**, next to the neighbours, never from a close-up crop. Things picked from crops are routinely "beautiful but way too loud" in place.
- **Secondary, promotional and status UI get the quietest form that works.** Lower area, contrast or persistence first. A promo card, header pill or toolbar that competes with the main task is a finding.
- **Squint test:** the thing the screen is for is the first thing you see.
- **Clickable looks clickable at rest**, in both themes; measure the contrast of the outline that carries it. A secondary action beside a status gets a real button style and its own line, not muted text.
- **Hover is not selected.** Different fills. On touch, decide what a tap does; no information or action lives only behind hover or in a native title tooltip, and a control revealed on focus cannot swallow the tap meant for what is under it.
- **Say each thing once.** One call to action per view, no note that the alert already makes, no headline that repeats the line beside it.
- **Animated heroes:** the reduced-motion frame is the settled picture, the no-WebGL fallback matches it, and text sits on a calm patch with measured contrast.

## 6. Motion means work

- A working indicator keeps moving for as long as anything the person waits on runs, delegated work included, and goes still only when nothing does. A calm, still "waiting" state reads as stalled.
- Entrances are short and plain: about 150 to 200 ms, a fade and a few px, no spring or overshoot, instant under reduced motion.
- A progress state stays up long enough to read (about 700 ms). Elapsed time shows only past a minute, in coarse steps.

## 7. Interaction and states

- **Interaction pass:** Tab opens, Escape closes and returns focus, a repeated press re-shows a notice instead of toggling it shut, tapping outside closes, then wait past every timed state and replay slow requests.
- **Verify by effect, not feedback:** read the clipboard after Copy, count requests after rapid clicks, check the server after a send. "Sent" can show while nothing left.
- **Every status has a way out:** a timeout from working to failed, newer prompts above older errors, counters that clear when the work ends. Errors say what happened in a plain sentence and recover on their own; no stack trace, raw provider text or framework overlay reaches the person.
- **The answer lands where the person looks**, and differs visibly from the state before it.
- **Floating layers:** check popovers, tooltips and docked panels at every window edge and at a small window: fully on screen, not covering a close button, a border or the thing they point at.
- **Hidden means hidden:** folded or transparent layers take no clicks and are out of the accessibility tree; an accessible name stays stable when visible text swaps.

## 8. Read every word

- Cut subtitles that restate the heading, explanations the controls already make, and eyebrow labels. Buttons name their action.
- Read a family of messages side by side: the same verb for the same act, a title that agrees with its detail and its button, one name per concept across tooltip, badge and label.
- Copy that states an outcome is true on every path (cancelled, declined, failed), not only the happy one.
- Copy names only controls this platform shows, never "above" or "below" a layout that can move, and people's names, never slugs or ids. After a rename, sweep aria-labels, titles, tooltips and placeholders too.
- Count the clicks to the main task. A dialog, picker or confirmation that could be an undo needs a reason.

## 9. Every platform, with a gap list

Shared code still drifts per platform and per host app.

- Open each build that renders the change (web, desktop shell, mobile, every host wrapper) in its real engine, and check native headers on a device or simulator. A wrapper that forwards props by name drops new ones silently.
- Compare against a fresh capture of the source platform from main, by measured position, and redo it when main moves.
- Every surface shows the same state with the same words, and flips in the same frame. A glyph that disagrees with its word, or a count that lags its header, means the state is derived twice; derive it once in shared code.
- Port the behaviour, not only the look (gates, permissions, empty states), and remove a dropped entry point everywhere: menus, tray, shortcuts, search keywords.
- Keep a **written gap list** per platform until every gap is closed or named in the report.

## 10. Performance

Profile new interactions in a real browser on a page of realistic size with CPU throttling (4x). Report p50 and p95 frame times against the main branch in the same session. Page-wide selectors (`:root[attr] *`, `body:has()`) and blanket `will-change` are the usual causes. Prove performance-only refactors unchanged with a pixel diff.

## 11. Fix, then report

Fix what is real, in the same change, then run the visual check again on the fixed build. "Fixes applied" is not a check. Then report in a few lines:

- what you checked (states, sizes, themes, platforms) and what you could not, with why,
- the reading you took of any ambiguous note,
- what you fixed, each in one line, with the measurement,
- what you left and why (a product decision for the person, not a nit you skipped),
- the gap list, if any platform is not done.

Put the before and after of anything visible in the PR (`visualize-ui`). Where the person will try it, hand them a link that signs in and lands on the seeded state.

If a finding is a lasting rule the team would want every time, offer to add it to DESIGN.md's Do / Don't.

## Using a subagent

A second pair of eyes helps most when it has not seen your reasoning. If your agent can spawn one, give it the running URL, the states to open, DESIGN.md and the before screenshots, not your conclusions, and ask for a ranked list of findings with measurements. Run it as its own pass after implementation, not folded into the build.

Then confirm each finding live before fixing it. Reviewers report confident false positives, and a clipped capture, the script's own hover or a pointer resting on another control can create a defect that is not there.
