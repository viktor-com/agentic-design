# Proposal pages and explainers

Both are one self-contained HTML file: CSS inline, images inlined as data URIs, no external runtime except fonts you are allowed to load. Render to PNG with `scripts/render.cjs` when the destination wants an image. Colours and fonts come from DESIGN.md.

Infographics and announcement graphics: use the [`infographic`](../../infographic/SKILL.md) skill.

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
- **A Q&A answers what viewers will ask, in product terms:** what I will see, what happens to my old stuff. One sentence each, key words bold, no padding questions and no implementation answers.

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
- Light and dark themes, and it must work at 390 px wide without clipping. Render all three and check that nothing scrolls sideways (`document.documentElement.scrollWidth > innerWidth`); renders catch stretched screenshots, clipped code and squeezed tables.
- A page with inlined images has huge base64 lines. Edit it by script with replacements that must match exactly once, not by reading the whole file or by blind edits.
- Title, description, and Open Graph tags filled in. Aim for under 3 MB.

**Final read.** Read it start to end as that unfamiliar engineer. Can you explain the situation, the problem, and the change? Were concepts explained before their names? Does each figure teach something with the background the page gives? Where does it drag? Rewrite those parts. A successful render is not evidence that anyone learned anything.

**Cold read.** Authors cannot see their own gaps. Give the page to a fresh agent that has not seen your reasoning, ask it to restate the change and list every place it got lost, and fix each one. Repeat until a round comes back clean; one page took three rounds and fourteen fixes.

## Publishing

Use the project's established way to share pages. If there is none, hand over the file and ask before uploading anywhere new: a public link is hard to take back.
