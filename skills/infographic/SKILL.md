---
name: infographic
description: "Make an infographic people get in five seconds: a graphic for a pull request, a launch or ship announcement, a result or metric to share in chat, a social preview image, or a short announcement reel. Produces one self-contained HTML file rendered to a 2x PNG, compact and near square for a chat post or PR by default: a headline that states the point, the real product UI large, before above now, and numbers shown against a named baseline. Colours and fonts come from the project's DESIGN.md. Use whenever a change or a result is announced or shared as a picture."
---

# Infographic

An infographic gets five seconds in a chat feed. In that time it has to say one thing, show it, and prove it. Everything below serves that.

## Read the brand first

Open the project's `DESIGN.md` and read its Graphics section, then its colour and type. Take the ground, the annotation ink, the note font, the cover treatment and the logo rules from there.

If there is no DESIGN.md, use neutral defaults: a light ground, one accent, the system sans-serif, and an annotation ink the product UI never uses. Then offer to write one with the [`brand`](../brand/SKILL.md) skill, so the next graphic is on brand.

Use the logo only where DESIGN.md allows it. If it says nothing, leave it out.

## Pick the shape before you capture

| Where it is seen | Cut | Template |
| --- | --- | --- |
| Chat post, PR body (default) | Compact, near square: 1200 px wide, height 1:1 to 5:4 | [references/template.html](references/template.html) |
| Slides, wide embeds | Landscape 1600 by 900 | [references/template-landscape.html](references/template-landscape.html) |
| Social preview | 1200 by 630, headline and product only | the landscape template, cut down |

- Set a panel budget before any capture starts: at most two screenshots or two before/after pairs for a chat post. Cut cases rather than shrink them. A tall strip or a grid of many panels is "too large to send" and nobody reads it.
- The main change goes first and largest. Lesser changes go in a small "Also:" line at the end.
- The long version (every case, every number, internals) goes in the PR or a linked page, not in the graphic.
- With two cases, give each a visibly different view. Two near-identical panels read as one.

## Hierarchy

- One product point, as a headline that states it: "Search now finds the message, not just the chat", not "Better search". Name the audience in it when only some people get the change.
- Its picture goes large: the real UI that shows the point.
- Then short bullets, then one number, then the aside. Equal-weight blocks hide the point.
- Text is headlines and short bullets only. No paragraphs, no lede, no small print in a corner. Each bullet, caption or panel line is one short phrase.
- Weigh loudness in the full frame at the size it is seen, never by looking at one block alone. A note colour or a bar that is fine in a crop can be the loudest thing on the whole graphic.

## Before and after

- Before is what people actually had, often the absence of the feature. Never an earlier internal iteration.
- Same input, data, viewport, crop and theme on both sides, so the only difference is the change.
- Wide screens stack, before on top; narrow subjects sit side by side, before on the left. A side-by-side pair of wide screens shrinks to unreadable in a chat column.
- Head each side with the state and its one-line story: "Before: Only chat names matched", "Now: Every message and file is searched". Problem under before, fix under now.
- Before is context: show it smaller (never under 0.75 of the after's scale) and a little muted, so now reads as the hero.
- Nothing new sits under Before. Notes go on the after side only.
- When the after shows a case-specific state (one plan, one platform, one kind of workspace), name the condition, or readers assume it is everywhere.

## Screenshots

- Real product UI, captured at 2x after transitions settle, in the light theme unless asked. No mock-ups standing in for shipped UI.
- Full screens or generous crops of them, not close-up snippets. A bento of close-ups confuses; a crop under about 0.75 scale is too small to read.
- Demo data is realistic and a little complex, and it exercises every new element. If the first example does not show one, add a second case. Fixture or seed data only, never customer data; caption stubbed data as such.
- No dev chrome: dev badges, reset pills, debug buttons, stray focus rings. Retake rather than paint out.
- Panels of the same role share one px scale. Compute it; do not size shots as a percent of unequal columns.
- When a crop cuts mid-element, fade that edge instead of slicing it.
- The graphic's ground is clearly different from the screenshots, and each picture has a clear frame. One shadow at most, no coloured verdict panels.
- Capture with [`../visualize-ui/scripts/shot.cjs`](../visualize-ui/scripts/shot.cjs); render with [`../visualize-ui/scripts/render.cjs`](../visualize-ui/scripts/render.cjs).

## Notes and arrows

- Annotation ink is a colour the product UI does not use, so a note can never read as UI. Not the product accent. DESIGN.md Graphics names it.
- Notes sit outside the screenshot frame, in a gutter, with the arrow running in to the target. Two to four notes, each on something new, in the order of their targets.
- Pick the style by audience. Product and design audiences: handwritten notes and hand-drawn arrows. Technical, developer-facing graphics: straight leaders ending in a solid dot, with labels in the brand type. Set `data-notes="straight"` on `main` in the template to switch.
- Never numbered pins with a legend. Never open circles at line ends; they look like radio buttons.
- One level of annotation. When a screenshot already carries notes, the outer graphic adds none.
- For a one-word copy change, underline the exact new words the arrow points at.

## Numbers

- Say what each number counts and against what: "Right message in the top 3, 46 of 50 test queries, up from 19 of 50". A bare "77%" can read as a failure rate.
- Positive first: "196 of 197 graded right", not "1 of 197 wrong".
- A lone big number is decoration. Show a ratio against a named baseline, with the raw counts. Never a bare "was" or "a third of".
- Round honestly and keep the exact count beside it: 23% is "fewer than 1 in 4", not "about 1 in 4".
- A fact that is not a comparison, like a limit or a date, goes in a bullet.
- A measurement shows as a dot with its interval and the number of runs.
- Compute chart geometry from the data. Never draw a bar by eye.

## Pitch and copy

- Pitch for the audience. A product audience gets the product and what they can now do. A technical audience gets architecture-level detail, still on brand: the before/after, the data and the reason, readable in 30 seconds. Monospace walls of internals are too technical; product-only is too thin.
- Plain words, the reader's words, not internal feature or code names. Say in one clause what a score measures.
- Show the realistic case where the feature pays off. Put on only the points the person asked for; padding with extra facts or Q&A dilutes them.
- A follow-up says "since the launch" and drops what was already announced.
- Links go in the post, not in the image.

## Build

1. Copy [references/template.html](references/template.html) (or the landscape one) to a scratch folder. Replace the tokens on `:root` with values from DESIGN.md, including `--note` and `--font-note`.
2. Delete the demo product UI block and put real 2x captures in the frames as `<img>`. Point each note's `data-for` at an element id in the after panel, or position the note by hand over an image.
3. Put the numbers in the data object at the bottom; the script computes the bars and draws the leaders from the layout.
4. Render: `node ../visualize-ui/scripts/render.cjs graphic.html graphic.png --selector main`.
5. Open the PNG and look at it full size and shrunk to about 600 px wide. Can you read the headline and the notes? Is the after the loudest panel? Is there a lone word on a line, an arrow off its target, empty space at the bottom? Fix and render again.

Posting it, writing the post, social previews and reels: read [references/announcing.md](references/announcing.md).

## Checklist

- Near square for a chat post or PR; within the panel budget; the long version linked.
- The headline states one point; the picture shows it large; the rest is short bullets and one "Also:" line.
- It reads at 600 px wide, and loudness was judged in the full frame.
- Before is what users had, stacked above (or left of) now, smaller and muted, same state and data.
- Screenshots are real UI at 2x, realistic seed data showing every new element, no dev chrome.
- Notes in an ink the product does not use, outside the frame, on the after side only, styled for the audience.
- Every number says what it counts, positive first, with a named baseline and raw counts; bars computed from data.
- Colours, fonts and logo follow DESIGN.md.
- Approved before it is posted.
