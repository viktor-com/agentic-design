---
name: design-review
description: "Review built UI the way a picky designer would, before anyone else sees it: look at it running, measure alignment instead of eyeballing it, walk every state, both themes, narrow and wide windows, read every word of copy, count the clicks to the main task, check it against DESIGN.md, then fix what is real. Use after building or changing any screen, component, or visual, before showing it to a person or marking a PR ready, and when asked to review, polish, or QA a UI."
---

# Design review

A person notices in two seconds what an agent misses in twenty minutes: a row 4 px off its neighbour, a header that jumps mid-load, a subtitle nobody needs. This skill is the pass that catches those before the person does.

It runs on the real thing, running. Reading the code is not a review.

## 0. Get the rules and the baseline

- Read `DESIGN.md` (repo root or `docs/`): principles, voice, Do / Don't, building blocks. No DESIGN.md: review against the app's own neighbouring screens and the defaults below, and say so.
- Know what it looked like before. For a change, have the before (merge base) open next to it. A review that cannot say what changed cannot say whether it got better.

## 1. Look at it, in every state

Open it in a browser (or the device loop) and screenshot each of these. Then look at the screenshots.

- **States:** loaded, empty, loading, error, one item, many items, the longest real string, a missing value.
- **Sizes:** the common desktop window, a tight window, a phone (390 px wide), and for mobile also a small phone and the keyboard open.
- **Themes:** light and dark, if the app has both.
- **Motion:** watch it open, close, load, and move between states. Record a clip if it is fast; a still cannot show a jump.

A state you did not look at is a state you did not review. Say which ones you skipped.

## 2. Measure, do not eyeball

In the page, with `getBoundingClientRect`:

- Rows of different kinds in one list share the icon column and the title start, and keep the same gaps.
- Neighbouring elements that look aligned are aligned (left edges, baselines, centres).
- Spacing and radii are values from the scale, not near misses.
- A surface keeps its size and place across its states. Compare the boxes in the loading and loaded states; any jump is a bug.

Report numbers: "title starts at 52 px in project rows and 36 px in chat rows". Fix differences rather than listing them as nits.

## 3. Read it as the user

- **Clicks:** count the steps to the main task. Anything that adds one (a dialog, a picker, a confirmation that could be an undo) needs a reason.
- **Copy:** read every word on screen. Cut subtitles that restate the heading, explanations the controls already make, and eyebrow labels. Buttons name their action. Errors say what happened and what to do, in a plain sentence.
- **Controls:** icon-only buttons need a label or a very good reason. A "..." menu with one item is a button.
- **Hierarchy:** squint at the screenshot. The thing the screen is for should be the first thing you see.
- **Waiting:** nothing holds navigation on a spinner. Open at once, skeleton for what is late.

## 4. Check the build

- Uses the team's components and tokens (`building-blocks` skill): grep the diff for raw colours, inline visual styles, and new components that duplicate existing ones.
- Keyboard: tab through it; focus is visible and in order; Escape closes what opened.
- Same feature, same shape on every platform it ships on (web, desktop, mobile), unless DESIGN.md says otherwise.

## 5. Fix, then report

Fix what is real, in the same change. Then report in a few lines:

- what you checked (states, sizes, themes) and what you could not,
- what you fixed, each in one line,
- what you left and why (a product decision for the person, not a nit you skipped).

Put the before and after of anything visible in the PR (`visualize-ui`).

If a finding is a lasting rule the team would want every time, offer to add it to DESIGN.md's Do / Don't.

## Using a subagent

A second pair of eyes helps most when it has not seen your reasoning. If your agent can spawn one, give it the running URL, the states to open, DESIGN.md, and the before screenshots, not your conclusions, and ask for a ranked list of findings with measurements. Then verify each finding yourself before fixing it: reviewers report confident false positives too.
