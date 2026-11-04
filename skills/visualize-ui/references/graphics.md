# Infographics, proposal pages, and explainers

All three are one self-contained HTML file: CSS inline, images inlined as data URIs, no external runtime except fonts you are allowed to load. Render to PNG with `scripts/render.cjs` when the destination wants an image. Colours and fonts come from DESIGN.md.

## Infographics and announcement graphics

An editorial piece about a change or a result, for people who will look at it for five seconds in a chat or a PR.

**Hierarchy**

- Lead with the one product point, in a headline that states it, and its picture (the real UI, large).
- Cards are headed by a takeaway sentence, not a label. "Replies land in a third of the time" beats "Latency".
- The least important detail goes last and smallest. Tables of internals usually belong in a linked long version.

**Shape**

- Default to one landscape frame (about 1600 by 900 CSS px, rendered at 2x). It reads in a chat preview.
- A taller, richer cut is fine as the main graphic when there are several cases to show. Keep it dense: small gaps, one line of title and caption per panel, no empty bottom.
- Link the deep version instead of squeezing it in.

**Numbers**

- Every number sits in a comparison, with the baseline named: "3x cheaper than building from scratch", bars labelled "From scratch" and "Now". Never a bare "was" or "a third of" without saying of what.
- A big number on its own ("17") is decoration. Show it as a ratio against something, with the raw counts.
- A fact that is not a comparison (a limit, a date) goes in the text.
- Single measurements show as dots with their interval, and the count of runs.
- Compute chart geometry from the data. Never draw bars by eye.

**Cases**

- A change with several cases shows each case as its own panel. One example undersells it.
- Screenshots in panels share one scale, computed in px. Sizing them as a percent of unequal columns gives mismatched type.
- Give screenshot cards an inner margin. Fade a crop that cuts mid-element instead of slicing it.
- Mark clearly what is before and what is new, with a heading over each group. Nothing new sits under the "Before" heading.

## Design proposal pages

A page that takes the wider team, not only engineers, from today's UI to a proposal.

- **Hierarchy first.** Lead with the few things that matter and the recommendation. Twenty sections of equal weight read as disjointed even when every fact is right. The inventory of today's UI is supporting detail.
- **Today above the proposal, scrolled, never toggled.** Today is compact: one row of annotated screenshots, so readers reach the proposal fast. The proposal is full width.
- **Headings share one left edge** and need no "Today" or "Proposal" tag pills. The order says it.
- **Principles are the backbone.** Each principle gets a Do and a Don't example: a green Do bar and a red Don't bar, each over a real screenshot. A principle is a stance about the product ("fewest clicks, least thought"); concrete visual rules sit under one as examples. The rest of the page cites principles by name.
- **Screen-by-screen sections are short bullets** that cite the principles.
- **The proposed UI is the live prototype,** embedded and clickable, built from the lab's export. Screenshots only for today's app and rejected options, at 2x.
- **The iteration story is a journey.** Rejected options beside the pick as waypoints joined by arrows, with the deciding argument written on each arrow. Not a list of unconnected cards.
- **Tell the story on the main way people use the product.** A niche flow gets one section, not the headline.
- **No tables of touchpoints.** Show each one as the user sees it.
- **No speculative "still to design" list.** Settle open questions with the developer before publishing.

## Explainers

A page that helps someone understand a system, a result, or a change, and is pleasant to read to the end.

**Write for an experienced engineer who has never seen this part of the code.**

- Read the real code, diff, or data first, even if you wrote it. Run the queries; keep the method. Mark what is observed, what is illustrative, and what is estimated.
- Explain the situation before naming its implementation. Say what normally happens and why, then the problem or change. Introduce a concept through its purpose and an example before using its identifier.
- Order the page by what the reader needs to know first, not by file, by research order, or by which subagent wrote what.
- Connected prose, short paragraphs, concrete examples. Brevity means cutting repetition, not cutting the explanation and leaving jargon.

**Choose the visual for the question it answers.**

- Before drawing, write down what the reader should understand from this figure.
- A race is a timeline. A change is before and after. Branching is a decision tree. A transformation follows one input through. Quantities are a chart. An experience is a screenshot. Sometimes a paragraph is clearest.
- Do not default to boxes and arrows. A row of module names joined by arrows does not explain what happens.
- Split an overloaded diagram into steps instead of cramming more in.
- Label in plain words first; add real identifiers where they connect the idea to the code.
- Diagrams and charts are HTML, CSS, or inline SVG, so their text is searchable and sharp. Label metrics, units, sources, and time ranges.

**Layout**

- Default to a scrolling page. Slides only when pacing helps or someone asks for a deck.
- Prose about 70 characters wide, body text at least 15 px.
- Light and dark themes, and it must work at 390 px wide without clipping.
- Title, description, and Open Graph tags filled in. Aim for under 3 MB.

**Final read.** Read it start to end as that unfamiliar engineer. Can you explain the situation, the problem, and the change? Were concepts explained before their names? Does each figure teach something with the background the page gives? Where does it drag? Rewrite those parts. A successful render is not evidence that anyone learned anything.

## Publishing

Use the project's established way to share pages. If there is none, hand over the file and ask before uploading anywhere new: a public link is hard to take back.
