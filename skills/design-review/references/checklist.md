# Review checklist

One pass, top to bottom. Each line is a check you ran or one you name as skipped in the report. Recipes are in [measure.md](measure.md).

## Before you start

- [ ] DESIGN.md read; the before (merge base) running next to the change.
- [ ] Ambiguous note: reading taken for the surface the person was looking at, written down in one line.
- [ ] Only what was named changed; any interpretive call listed.
- [ ] Real app, not only a harness; brand font confirmed loaded; first frame of the session is the right page.

## Matrix

- [ ] States: loaded, empty, loading, error, one, many (past the scroll threshold), longest string, missing value, filtered.
- [ ] Widths: default window, tight window, side panels open, 390 px phone; small phone and keyboard open on mobile.
- [ ] Themes: light and dark; user-picked colours on both grounds.
- [ ] Platforms and hosts: each build in its real engine; gap list written.

## Layout stability

- [ ] Frame sampler run on each touched load and transition, plain, `--throttle 4` and `--delay`: 0 jumps on what the person reads, 0 neither/both frames, hand-over box change all zeros.
- [ ] Late pieces land in the same frame, or their space is reserved.
- [ ] A placeholder that resolves to nothing leaves no gap and nothing jumps up.
- [ ] Pending and empty look different; no pane shows before it holds something real.
- [ ] Controls keep width and position across label and icon swaps; text updates without remount.
- [ ] Row boxes identical at rest, on hover and on focus.
- [ ] Growing list keeps new content in view; scrolling up releases it; capped regions end on whole rows.
- [ ] Nothing re-animates on remount or returning to a tab.

## Geometry

- [ ] Icon and title columns shared across row kinds; same actions in the same place.
- [ ] Gaps audited by script against the written spacing rule; borders and scrollbar tracks counted.
- [ ] Edge controls inset evenly; native button padding reset.
- [ ] Nested corners concentric; no child clips the parent's corner or ring; fills follow the radius.
- [ ] Hover tint, focus ring and hit area wrap one box; rings not cut by a parent or the viewport.
- [ ] Siblings share variant, height and tooltip mechanism; icon-only buttons square.
- [ ] Computed styles of every override in rest, hover, pressed, selected, both themes.
- [ ] 8x zoom on joins: arrows, corners, hairlines, avatar rings, scrollbar gutters.

## Text

- [ ] No lone last word, no cut title beside empty space, at every real width.
- [ ] Pills, badges, bars and selects fit their longest label in their narrowest container.
- [ ] Overflow fixed with shorter copy before smaller type.
- [ ] Text container widths checked against real usage (window widths, message lengths) where data exists.

## Emphasis

- [ ] Loudness judged in the full app window and at phone width, never a crop.
- [ ] Secondary, promotional and status UI in its quietest working form.
- [ ] The screen's main thing is the first thing seen.
- [ ] Clickables look clickable at rest, outline contrast measured; a secondary action by a status is a real button on its own line.
- [ ] Hover fill differs from selected; nothing lives only behind hover or in a native tooltip; on touch a revealed control cannot steal the tap.
- [ ] Hover cards stay a glance (about three lines) and never show stale content.
- [ ] Each thing said once per view; one call to action; a persuasive card's headline carries the offer.
- [ ] Where two states matter at once (progress and unread), the indicator shows both.
- [ ] Animated hero: reduced-motion frame complete, no-WebGL fallback matches, text contrast measured.

## Motion

- [ ] Working indicator moves while any awaited work runs, delegated work included; still only when nothing runs.
- [ ] Entrances about 150 to 200 ms, fade plus a few px, no spring; instant under reduced motion.
- [ ] Progress states readable (about 700 ms); elapsed time only past a minute.

## Interaction and states

- [ ] Tab, Escape (focus returns), repeated press, outside tap, waited past every timer, slow requests replayed.
- [ ] Actions verified by effect: clipboard, request count, server state.
- [ ] Every status times out or resolves; newer prompts above older errors; counters clear.
- [ ] Errors are a plain sentence, recover on their own, never a stack trace or raw provider text.
- [ ] A missing OS permission is one short line with small inline actions, never a silent no-op.
- [ ] Filtered views say so ("X only, Show all"), reach all history, have their own empty state.
- [ ] Popovers, tooltips and docked panels on screen at every edge and a small window, clear of close buttons and their anchor.
- [ ] Hidden layers take no clicks and are out of the accessibility tree; accessible names stable.

## Copy

- [ ] Every word read; no restating subtitles, eyebrow labels or reassurance notes.
- [ ] One verb per act and one name per concept across a family of messages.
- [ ] Outcome copy true on every path.
- [ ] Only controls this platform shows are named; no "above" or "below"; names, not slugs or ids.
- [ ] After a rename or removal: aria-labels, titles, tooltips, placeholders, search keywords, empty states and entry points swept.
- [ ] Clicks to the main task counted.

## Performance

- [ ] New interactions profiled at realistic page size with 4x CPU throttling, p50 and p95 against main.

## Report

- [ ] Visual check re-run on the fixed build.
- [ ] Checked, skipped (with why), unreachable by synthetic input, fixed (with numbers), left for the person, gap list.
- [ ] Before and after in the PR; a signed-in link to the seeded state where the person will try it.
