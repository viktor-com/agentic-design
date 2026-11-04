---
name: visualize-ui
description: "Turn UI changes, ideas, data, and flows into visuals people get at a glance, built in code: annotated Retina screenshots, slowed side-by-side clips for motion, before/after pairs for pull requests, infographics and announcement graphics, design proposal pages, and HTML explainers with diagrams. Every PR that changes what a person sees gets its before and after: use this without being asked. Also use whenever UI or a result is shown to people in a bug report, message, doc, or announcement."
---

# Visualize UI

People give a picture a few seconds. In that time it has to say **what to look at and why**. A bare screenshot does not: the reader scans the whole screen for the point. Two bare screenshots are a game of spot the difference. A still of something that moves says nothing.

## Read the brand first

Open `DESIGN.md` (repo root or `docs/`) and use its **Graphics** section, its colours, and its fonts for everything around the screenshots. No DESIGN.md: say so in one line, use neutral defaults (a light warm-grey ground, near-black text, one strong accent for notes), and offer the `brand` skill (`../brand/SKILL.md`) afterwards.

## Choose the form by what you are showing

| Showing | Form |
| --- | --- |
| Something static: layout, colour, spacing, copy, an empty or error state | A **Retina still** (2x), cropped to the subject |
| Something that moves: a menu opening, an enter or exit, press feedback, hover timing | A **clip** at 2x, cropped to the element, CSS motion slowed about 5x, with "5x slower" written on it |
| A flow across screens | **One recording** of the flow at real speed |
| Something that does not exist yet | **The live prototype**, clickable (see `prototype-ui`) |
| A comparison: before and after, variants, themes, platforms | **Side by side in one image or one clip**, same crop, state, viewport, and theme on every side |

- **Show the real thing.** The product's own components with seed or fixture data, not a redraw.
- **Crop to the subject,** with just enough around it to tell where on screen it is.
- **Never real customer data.** Capture from fixtures, seed data, or a demo account. Pictures travel.

## Point at what matters

- **Hand-drawn arrows with short handwritten notes,** as if sketched over the screenshot. One or two per frame.
- **Each arrow ends on the exact element,** not near it. Take the element's box from the page, not from guessing.
- **Notes sit in the margin nearest their target,** so arrows stay short and never cross the content or each other.
- **A note says the point in the reader's words** ("opens on the click", "Skip is visible from the start"), not a component name.
- **No numbered pins with a legend.** Matching numbers to text is work the reader should not have to do.
- On a clip, the notes are a still transparent layer over the playing video.

`references/annotated.html` is the composite template; `references/capture.md` has the commands for stills, clips, composites, GIFs, and hosting. The scripts in `scripts/` do the browser work.

## Look before you send

Open every image you made, and frames from across every clip. Check: the crop holds the subject, each arrow ends on its target, each side shows what its label says, nothing peeks in at a frame's edge. Fix and re-render; it takes seconds.

## Where it lands

### A pull request

**Every PR that changes what a person sees carries its before and after,** planned with the change, not added when someone asks.

- The before comes from the merge base (a second worktree), in the same state, viewport, and theme as the after.
- A static change is a pair of stills. A change in motion or timing is a pair of clips, in step.
- Put one annotated composite in the PR body, right under the summary of the change. For motion, a GIF inline with the video linked beside it. Alt text says what the picture shows.
- If the pair truly cannot be captured (no device, a state only production reaches), write one line saying so and why under the PR's testing notes, and carry on.

### An infographic or announcement graphic

This is an editorial piece, not an annotated screenshot. [references/graphics.md](references/graphics.md) has the rules. The core of it:

- Lead with the one product point and its picture. Hierarchy first; equal-weight sections hide the point.
- One landscape frame that reads in a chat preview. Link the long version.
- Every number is a comparison with its baseline named ("3x cheaper than building from scratch"). A lone big number is decoration.

### A design proposal page

A page that takes the wider team from today's UI to a proposal. One self-contained HTML file. Rules in [references/graphics.md](references/graphics.md): today above the proposal and compact, principles with Do and Don't examples, the proposed UI as the live prototype, the rejected options as a journey to the pick.

### An explainer

For a system, a data result, or a flow explained to engineers or the team: one self-contained HTML page that reads like a good engineering blog post. Rules in [references/graphics.md](references/graphics.md), "Explainers".

### Anywhere else

A bug report, a message, a doc: the same forms and the same pointing. Attach the file where the place takes attachments. A GIF plays inline where a video does not.
