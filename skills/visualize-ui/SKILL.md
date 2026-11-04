---
name: visualize-ui
description: "Turn UI changes, ideas, data, and flows into visuals people get at a glance, built in code: annotated Retina screenshots, slowed side-by-side clips for motion, before/after pairs for pull requests, infographics and announcement graphics, design proposal pages, and HTML explainers with diagrams. Every PR that changes what a person sees gets its before and after: use this without being asked. Also use whenever UI or a result is shown to people in a bug report, message, doc, or announcement."
---

# Visualize UI

People give a picture a few seconds. In that time it has to say **what to look at and why**. A bare screenshot does not: the reader scans the whole screen for the point. Two bare screenshots are a game of spot the difference. A still of something that moves says nothing.

## Read the brand first

Open `DESIGN.md` (repo root or `docs/`) and use its **Graphics** section, its colours, and its fonts for everything around the screenshots. Graphics names the annotation ink: a colour the product UI does not use, so a note never reads as part of the UI. Never the product accent. Graphics empty but Colour filled: take the ground from the page background, pick an ink outside the product palette, and say so. No DESIGN.md: say so in one line, use neutral defaults (a light warm-grey ground, near-black text, the template's proofing magenta for notes), and offer the `brand` skill (`../brand/SKILL.md`) afterwards.

## Choose the form by what you are showing

| Showing | Form |
| --- | --- |
| Something static: layout, colour, spacing, copy, an empty or error state | A **Retina still** (2x), cropped to the subject |
| Something that moves: a menu opening, an enter or exit, press feedback, hover timing | A **clip** at 2x, cropped to the element, CSS motion slowed about 5x, with "5x slower" written on it |
| A flow across screens | **One recording** at real speed, brisk, from the first screen to the result with no step skipped |
| Something that does not exist yet | **The live prototype**, clickable (see `prototype-ui`) |
| A comparison: before and after, variants, themes, platforms | **One image or one clip**: side by side for narrow subjects, stacked (before on top) for wide ones. Same crop, state, viewport, and theme on every side |
| Options to choose between, even small ones like icons | **Render them all.** Described options get "can you show me?" |

- **Show the real thing.** The product's own components with seed or fixture data, not a redraw.
- **Use realistic data** that is a little complex and exercises every new element. A toy example undersells the change.
- **Crop to the subject,** with just enough around it to tell where on screen it is. A desktop app shot sits in a native-looking window with some surrounding UI, not a tight crop of one card.
- **Why wide shots stack:** side by side, two wide screenshots shrink to unreadable in a chat column or PR at reading width, and many chat tools take one image per message.
- **Never real customer data.** Capture from fixtures, seed data, or a demo account. Pictures travel.
- **Label staged state.** A caption says "stubbed data" or "injected" for any state the product did not reach on its own. Reviewers trust a picture as the real product.

## Point at what matters

- **Pick the style by audience.** For product and design readers: hand-drawn arrows with short handwritten notes, as if sketched over the screenshot. For technical, developer-facing graphics: straight leaders ending in a solid dot, with labels in the brand type; handwriting reads as hard to read and not technical there. One or two per frame either way.
- **Notes in the annotation ink,** never the product accent: notes in the accent get read as real UI.
- **Each arrow ends on the exact element,** not near it. Take the element's box from the page, not from guessing. For a copy change, underline the exact new words.
- **Notes sit outside the frames, in the margin nearest their target,** so arrows stay short and never cross the content or each other.
- **A note says the point in the reader's words** ("opens on the click", "Skip is visible from the start"), not a component name.
- **No numbered pins with a legend.** Matching numbers to text is work the reader should not have to do.
- **One level of annotation.** A screenshot someone gave you loses its stray marks first; annotate only the after side. A graphic of pictures that carry their own notes frames each picture, sits on a ground clearly different from them, and drops extra shadows and coloured verdict panels.
- On a clip, the notes are a still transparent layer over the playing video.

`references/annotated.html` is the composite template, with both annotation styles and the stacked layout described. Read `references/capture.md` before any capture: it has the commands for stills, clips, composites, GIFs, and hosting, and the traps that spoil a pair (stale code, a wrong before, missing fonts, dev chrome on screen). The scripts in `scripts/` do the browser work.

## Look before you send

Open every image you made, and frames from across every clip. Check: the crop holds the subject, each arrow ends on its target, each side shows what its label says, nothing peeks in at a frame's edge. Check the file really is 2x, the brand fonts and emoji rendered, the first frame is the right screen, and nothing predates the last change. Fix and re-render; it takes seconds.

A claim that something moves, holds still, or does not jump needs per-frame sampling, not one still. Headless browsers without GPU can freeze an animation and make two frames identical. See "Proving motion" in `references/capture.md`.

## Where it lands

### A pull request

**Every PR that changes what a person sees carries its before and after,** planned with the change, not added when someone asks.

- The before comes from its own checkout at the merge base, in the same state, input, data, viewport, and theme as the after. Not a flag-off build of the branch, which already carries the PR's other changes, and never files swapped back in the working tree.
- Freeze the code while the pair is captured, and name the commit it covers. After every design change, capture again, so no stale image survives in the body.
- A pair for every case the change touches: each changed screen, each platform, short and long, with and without extras.
- A static change is a pair of stills. A change in motion or timing is a pair of clips, in step.
- Put one annotated composite in the PR body, right under the summary of the change. For motion, a GIF inline with the video linked beside it. Alt text says what the picture shows.
- If the pair truly cannot be captured (no device, a state only production reaches), write one line saying so and why under the PR's testing notes, and carry on.

### An infographic or announcement graphic

This is an editorial piece, not an annotated screenshot. Use the [`infographic`](../infographic/SKILL.md) skill: it has the rules, a template, and the checklist.

### A design proposal page

A page that takes the wider team from today's UI to a proposal. One self-contained HTML file. Rules in [references/graphics.md](references/graphics.md): today above the proposal and compact, principles with Do and Don't examples, the proposed UI as the live prototype, the rejected options as a journey to the pick.

### An explainer

For a system, a data result, or a flow explained to engineers or the team: one self-contained HTML page that reads like a good engineering blog post, checked by a cold read from a fresh agent before anyone sees it. Rules in [references/graphics.md](references/graphics.md), "Explainers".

### Anywhere else

A bug report, a message, a doc: the same forms and the same pointing. Attach the file where the place takes attachments. A GIF plays inline where a video does not.
