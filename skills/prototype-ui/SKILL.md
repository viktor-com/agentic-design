---
name: prototype-ui
description: "Run a prototype lab for an open UI decision: build a few genuinely different, clickable variants next to today's UI in the full app frame, show them in one view, recommend one, let the developer pick and mix, iterate over rounds, then ship the pick and archive the lab. Use for a new screen or surface, a redesign, a layout or navigation change, a new empty or error state, or any ask to prototype or compare directions. Skip it for a copy fix, a token swap, a single prop, a new table column, a bug fix that restores the intended design, or a request to polish the current design (use design-review)."
---

# Prototype UI

The first design that comes to mind is rarely the best one, and prose cannot settle a visual question. So the work is: **build a spread, show it, let the developer pick, ship the pick.**

The output is not "a design". It is a decision the developer made with real pixels in front of them, and the one implementation that came out of it.

## When to run it

Run it when two competent engineers would build visibly different things: a new surface, a redesign, a hierarchy or layout change, a new empty or error state.

Pick a lighter tool when that fits better. Say in one line which one and why.

- **One obvious implementation:** just build it. Four variants of a one-line change teach people to skip the lab.
- **A small visual choice** (one headline, an icon, two flavours of a card): edit the live page three or four ways and screenshot each. Say which ones are real code and which are page edits. Still show pictures; people answer described options with "can you show me?".
- **"Polish this" or "make it nicer" on a design they like:** that is craft on the current design (type scale, alignment, spacing rhythm, states), not a quieter redesign. Use the `design-review` skill.
- **They need to try a flow end to end:** give them a running instance with a link that signs in and lands on the seeded state, and confirm it is up. A lab cannot show a real flow.

## 1. Read the rules, then see the real thing

- **Read `DESIGN.md`** (repo root or `docs/`) and follow the `building-blocks` skill (installed next to this one: `../building-blocks/SKILL.md`). Every variant uses the team's components, tokens, and fonts. Creative means layout, hierarchy, and interaction, not a new button. No DESIGN.md: say so, use the app's own look, and carry on.
- **Work from the latest main branch,** and look for a teammate's open or just-merged change to the same surface. If there is one, it becomes a tile. People have picked the teammate's version once they saw both.
- **Confirm which surface the ask is about** (the page or the app, this bar or that one). If it could be either, ask once or say which reading you took.
- **Find the component that actually renders the surface**, not one that looks related. If the product is moving to a new rendering surface, prototype there, not on the legacy one it still supports. A pick made on the old surface was rejected once seen on the new one.
- **Look at it running** at the window size most people use. That is the baseline every variant is compared against, and the thing you must not break.
- **List the states.** Loaded, empty, loading, error, one item, many, long strings, narrow window. On mobile also small and large phones and the keyboard open. The states are where variants really differ.

If today's design is already fine, say so. That beats four alternatives to a solved problem.

## 2. Pick the spread and start building

Do not ask the developer to approve a list of options. Choosing them is your job, and nobody can judge a design from prose. Announce the spread in one line each and start building at once:

```
Building four, next to today's UI:
A: Tightened baseline   Today's layout, hierarchy and spacing fixed. The safe pick.
B: Half as much         Drops the filter bar and two columns. Bets most of it goes unused.
C: Inline expansion     Rows open in place. Bets people scan, then dip in.
D: Board                A grouped board instead of a table. Bets grouping beats columns.
```

Four by default: one safe, **one quiet and subtractive**, one different middle, one real swing. Fewer for a small surface. Vary the **bet**, not the padding. The quiet variant is not optional: across many labs people picked the slimmer, quieter, or already shipped option far more often than the novel one. [references/spread.md](references/spread.md) has how to get a spread that is really a spread, the check to run on your list, and how later rounds work.

**Every round also shows today's UI** in the same state, labelled "Today", so the developer compares against what ships now.

Only propose what the product can really do. A tile that shows data or live signals the backend does not have misleads the pick; if a tile needs a new signal, say so on the tile.

## 3. Build the variants

Lab setup, harness choice, the contract, and file layout are in [references/harness.md](references/harness.md). The short version:

- **You write everything shared first:** the lab folder, the switcher with every variant already listed, and the shared contract.
- **The contract covers interactions and scenes, not only props and data.** Action callbacks for every slot, every scene the variants need (including an empty input, if a placeholder is under redesign), the real building pieces as exports (row components, state helpers), and fixtures big enough to trigger every overflow and scroll. Same fixture for every tile, so the lab compares design, not data. Make it unflattering: a 60-character name, one item and forty, a missing value. Builders who lack a piece hack around it in parallel, each differently.
- **Mount the real UI.** Render the product's own components around the part being redesigned, with fake data at the boundary (the data hook, the socket, `fetch`). Build a new element from the surface's own parts: its type, spacing, avatars, and shipped transitions. A hand-built look-alike differs in dozens of small ways, and tiles that "don't quite look like the app" get rejected for that alone.
- **Today mounts the shipped code,** not a re-creation from memory or from the brief.
- **Frame every tile as the full app at a real viewport:** the product's default window and panel sizes, from analytics when you can get them, plus a phone tile if the surface ships there. Write the size on the lab. Loudness judged in a crop flips once seen in the whole screen.
- **Put the design under test behind a prop** on a copy, or on the real component with a default of today's behaviour, so "Today" and the variants are the same page.
- **Build in parallel when your agent can.** One subagent per variant, each owning exactly one file. Without subagents, build them one after another; the rest of the skill is the same.

Rules for every variant builder, because these are the collisions that actually happen:

- Create only your one file. Do not edit the switcher, which already lists you.
- Need something shared that does not exist? Report it back. Do not add it.
- Do not touch the production component.
- Screenshot your own solo tile on the server the orchestrator runs, in light, dark, and a mid-flow frame, and fix what you see. Do not start a server and do not run repo-wide type-check, lint, or codegen. Builders who never render ship blank and broken tiles.
- Make the variant respond to clicks. Hold local state for anything that toggles or expands. A control wired to nothing often still looks like it works.

When the variants are in, run type-check and lint once yourself. Then read every builder's report: when two report the same gap, fix it once in the shared layer instead of letting each tile work around it.

## 4. Look, fix, then show them all at once

One view, every tile labelled with its letter and its bet: a grid of scaled iframes, each loading one variant at full size. Native-only surfaces get a contact sheet of screenshots instead; say that it is static. Animated or live states must run in the tile; a still tile of a moving state reads differently from the real thing.

**Run a look-and-fix pass on every tile** before anyone sees the lab. Open each solo URL in a real browser after the dev server has settled, and judge hierarchy, copy, alignment, and states, not only "it rendered". Fix, then look again, until a round finds nothing. Check that every tile sits in an identical frame. The `design-review` skill has the checklist. Blind-built tiles compile and still ship invisible text, duplicated rows, and corners that leak.

For anyone not sitting at your machine, export the lab to one self-contained HTML file and check it under a sandboxed host header ([references/harness.md](references/harness.md), "Export"). Share it the way the project already shares pages. If there is no established way, hand over the file path and the local URL; do not publish to a new service without asking.

Then tell the developer, in a few lines: which states and viewport the tiles show, the bet behind each label, what is real and what is faked, and **your recommendation with a one-line reason**. Lean toward the quietest option that does the job. Then stop and wait. A recommendation is not a pick, and silence is not a pick.

## 5. Let the developer drive

They will answer in labels: "B, but with C's header." That is the spec. Take it literally: change only what the pick names and keep everything else where it is. Do not smooth it towards your own preference. If one word could mean two elements, ask once.

Expect several rounds. Once they pick a direction, each new variant explores one idea inside it, built from the picked file. Keep Today and the previous pick as reference tiles. After a second rejection of a direction, go wide again with completely different bets instead of refining. Killing losers is progress. Re-export after each round.

If they pick something with a real problem, name the problem once, briefly, then build what they asked for.

## 6. Ship the pick, archive the lab

1. **Merge the chosen traits into the production component,** wired to real data, in the project's conventions. Promoting the variant file is not enough: it has mocks and shortcuts in it.
2. **Make the states you showed work for real:** empty, loading, error.
3. **Archive the lab, then delete it from the repo.** People reverse picks once they live with them, and ask for "the prototypes again". Keep the export playable with every losing tile, and save the lab source outside the repo (a patch or a copied folder) so a new round is cheap. Then delete the variants, switcher, folder, and any lab-only route, middleware entry, or build config. Check `git status` and the diff for leftovers before you push.
4. **Screenshot the shipped result** on the real surface, so what they picked and what shipped are visibly the same, and **list every deviation from the picked tile.** The lab's Today tile is a ready "before". The `visualize-ui` skill covers before and after.
5. **Write the losing variants into the PR:** each label, its bet, and why it lost, in the developer's words. Link the exported lab.
6. **Write lasting taste into DESIGN.md.** If a variant lost on principle ("no overflow menu with one item"), not on execution, add it to Do / Don't with the reason, so it is not proposed again.

## Rules

- Never ask for approval of the spread. Announce it and build.
- Every spread has a quiet, subtractive variant. Recommend toward quiet; never pick for the developer.
- Variants differ in design, never in data.
- Every round includes today's UI, in the full app frame at a real viewport.
- Every variant uses the team's building blocks and only what the product can really do.
- Look at and fix every tile before you show the lab.
- The lab never lands in a commit, but its export and source outlive the pick.
- No em dashes in anything the developer reads. Commas and colons do the job.
