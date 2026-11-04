---
name: infographic
description: "Make an infographic people get in five seconds: a graphic for a pull request, a launch or ship announcement, a result or metric to share in chat, or a social preview image. Produces one self-contained HTML file rendered to a 2x PNG: a headline that states the point, the real product UI large, and numbers shown against a named baseline. Colours and fonts come from the project's DESIGN.md. Use whenever a change or a result is announced or shared as a picture."
---

# Infographic

An infographic gets five seconds in a chat preview. In that time it has to say one thing, show it, and prove it. Everything below serves that.

## Read the brand first

Open the project's `DESIGN.md` and read its Graphics section, then its colour and type. Take the cover treatment, the fonts, the colours and the logo rules from there.

If there is no DESIGN.md, use neutral defaults: a white or near-black ground, one accent colour, the system sans-serif. Then offer to write one with the [`brand`](../brand/SKILL.md) skill, so the next graphic is on brand.

Use the logo only where DESIGN.md allows it, at the size and spacing it gives. If it says nothing, leave the logo out.

## Information hierarchy first

- One product point. Write it as a headline that states it: "Replies land in a third of the time", not "Faster replies".
- Its picture goes large: the real UI that shows the point.
- Cards are headed by a takeaway sentence, not a label. "Search finds it on the first try" beats "Search accuracy".
- The least important detail goes last and smallest. Internals belong in a linked long version.
- Equal-weight sections hide the point. If every block is the same size, the reader has to pick, and they will not.

## Readable at a glance

Shrink the render to the size it will be seen at, about 600 px wide for a chat preview, and read it. Can you read the headline? Do you see what the picture shows? Can you tell which bar wins? If not, cut words, enlarge type, or drop a section.

## High-fidelity screenshots

- Real product UI, captured at 2x. No mock-ups standing in for shipped UI.
- Fixture or seed data. Never customer data.
- Crop to the subject and give it an inner margin inside its card.
- All panels share one px scale. Compute it; do not size shots as a percent of unequal columns, or the type sizes will not match.
- When a crop cuts mid-element, fade that edge instead of slicing it.
- Capture with [`../visualize-ui/scripts/shot.cjs`](../visualize-ui/scripts/shot.cjs) and render the graphic with [`../visualize-ui/scripts/render.cjs`](../visualize-ui/scripts/render.cjs).

## Shape

- Default to one landscape frame, about 1600 by 900 CSS px, rendered at 2x.
- With several cases, a denser, taller cut is fine. Keep it tight: small gaps, one line of title and caption per panel, no empty bottom.
- Link the long version instead of squeezing it in.
- A social preview is the same idea at 1200 by 630: the headline and the product, nothing else.

## Numbers

- Every number in a comparison names its baseline: "3x cheaper than building from scratch", bars labelled "From scratch" and "Now". Never a bare "was" or "a third of".
- A lone big number is decoration. Show it as a ratio against something, with the raw counts ("41 of 50, up from 12 of 50").
- A fact that is not a comparison, like a limit or a date, goes in the text.
- A measurement shows as a dot with its interval and the number of runs.
- Compute chart geometry from the data. Never draw a bar by eye.

## Cases

- A change with several cases shows each case as its own panel. One example undersells it.
- Head each group clearly: "Before" and "New". Nothing new sits under "Before".
- Before goes left, new goes right.

## Copy

- Short sentences. Plain words. No jargon, no internal names, no hype.
- The headline states the result. The lede, one or two lines, says why it matters to the user.
- Labels name the thing in the user's words, not the code's.

## Build

1. Start from [references/template.html](references/template.html). Replace the tokens on `:root` with values from DESIGN.md.
2. Keep it one self-contained HTML file in a scratch folder, with the screenshots beside it.
3. Put the numbers in the data array at the bottom; the script computes the bars.
4. Render: `node ../visualize-ui/scripts/render.cjs graphic.html graphic.png --selector main`.
5. Open the PNG and look at it, full size and shrunk to 600 px. Fix what you see and render again.

## Checklist

- The headline states one point, and the picture shows it large.
- Card headings are takeaway sentences.
- It reads at 600 px wide.
- Screenshots are real UI at 2x, with seed data, at one shared scale.
- Every number has a named baseline; ratios carry raw counts.
- Bars and dots are computed from data.
- Before and New are clearly headed, and nothing new sits under Before.
- Colours, fonts and logo follow DESIGN.md, and there is no empty space at the bottom.
