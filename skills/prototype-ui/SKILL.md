---
name: prototype-ui
description: "Run a prototype lab for an open UI decision: build a few genuinely different, clickable variants next to today's UI, show them in one view, recommend one, let the developer pick and mix, iterate over rounds, then ship the pick and delete the lab. Use for a new screen or surface, a redesign, a layout or navigation change, a new empty or error state, \"make this look better\", or any ask to prototype or compare directions. Skip it for a copy fix, a token swap, a single prop, a new table column, or a bug fix that restores the intended design."
---

# Prototype UI

The first design that comes to mind is rarely the best one, and prose cannot settle a visual question. So the work is: **build a spread, show it, let the developer pick, ship the pick.**

The output is not "a design". It is a decision the developer made with real pixels in front of them, and the one implementation that came out of it.

## When to run it

Run it when two competent engineers would build visibly different things: a new surface, a redesign, a hierarchy or layout change, a new empty or error state, "make this nicer".

Skip it when there is one obvious implementation. Four variants of a one-line change waste time and teach people to skip the lab. When it is borderline, say in one line that you are skipping the spread and why, then do the work.

## 1. Read the rules, then see the real thing

- **Read `DESIGN.md`** (repo root or `docs/`) and follow the `building-blocks` skill. Every variant uses the team's components, tokens, and fonts. Creative means layout, hierarchy, and interaction, not a new button. No DESIGN.md: say so, use the app's own look, and carry on.
- **Find the component that actually renders the surface**, not one that looks related.
- **Look at it running.** That is the baseline every variant is compared against, and the thing you must not break.
- **List the states.** Loaded, empty, loading, error, one item, many, long strings, narrow window. On mobile also small and large phones and the keyboard open. The states are where variants really differ.

If today's design is already fine, say so. That beats four alternatives to a solved problem.

## 2. Pick the spread and start building

Do not ask the developer to approve a list of options. Choosing them is your job, and nobody can judge a design from prose. Announce the spread in one line each and start building at once:

```
Building four, next to today's UI:
A: Tightened baseline   Today's layout, hierarchy and spacing fixed. The safe pick.
B: Split rail           Filters in a persistent left rail. Bets filtering is the main verb.
C: Inline expansion     Rows open in place. Bets people scan, then dip in.
D: Board                A grouped board instead of a table. Bets grouping beats columns.
```

Four by default: one safe, two different middles, one real swing. Fewer for a small surface. Vary the **bet**, not the padding. [references/spread.md](references/spread.md) has how to get a spread that is really a spread, and the check to run on your list.

**Every round also shows today's UI** in the same state, labelled "Today", so the developer compares against what ships now.

## 3. Build the variants

Lab setup, harness choice, and file layout are in [references/harness.md](references/harness.md). The short version:

- **You write everything shared first:** the lab folder, the switcher page with every variant already imported, and the shared contract (props plus mock data). Same fixture for every tile, so the lab compares design, not data. Make the fixture unflattering: a 60-character name, one item and forty, a missing value.
- **Mount the real UI.** Render the product's own components around the part being redesigned, with fake data at the boundary (the data hook, the socket, `fetch`). A hand-built look-alike shell differs from the product in dozens of small ways and misleads the comparison.
- **Put the design under test behind a prop** on a copy, or on the real component with a default of today's behaviour, so "Today" and the variants are the same page.
- **Build in parallel when your agent can.** One subagent per variant, each owning exactly one file. Without subagents, build them one after another; the rest of the skill is the same.

Rules for every variant builder, because these are the collisions that actually happen:

- Create only your one file. Do not edit the switcher, which already imports you.
- Need something shared that does not exist? Report it back. Do not add it.
- Do not touch the production component.
- Do not run type-check, lint, or codegen, and do not start a dev server. The orchestrator does that once.
- Make the variant respond to clicks. Hold local state for anything that toggles or expands. A control wired to nothing often still looks like it works.

When the variants are in, run type-check and lint once yourself and fix what is left. A variant that does not compile is a blank tile.

## 4. Show them all at once

One view, every tile labelled with its letter and its bet: a grid of scaled iframes, each loading one variant at full size. Native-only surfaces get a contact sheet of screenshots instead; say that it is static.

**Look before you show.** Screenshot every tile yourself and check each one rendered its variant, not an error boundary, a spinner, or the baseline.

For anyone not sitting at your machine, export the lab to one self-contained HTML file and check it under a sandboxed host header ([references/harness.md](references/harness.md), "Export"). Share it the way the project already shares pages. If there is no established way, hand over the file path and the local URL; do not publish to a new service without asking.

Then tell the developer, in a few lines: which states the tiles show, the bet behind each label, and **your recommendation with a one-line reason**. Then stop and wait. A recommendation is not a pick, and silence is not a pick.

## 5. Let the developer drive

They will answer in labels: "B, but with C's header." That is the spec. Take it literally; do not smooth it towards your own preference.

Expect several rounds. Cheap moves: adjust one variant, add one, kill one, show a different state or viewport. Killing losers is progress. Re-export the same file after each round.

If they pick something with a real problem, name the problem once, briefly, then build what they asked for.

## 6. Ship the pick, delete the lab

1. **Merge the chosen traits into the production component,** wired to real data, in the project's conventions. Promoting the variant file is not enough: it has mocks and shortcuts in it.
2. **Make the states you showed work for real:** empty, loading, error.
3. **Delete the lab:** variants, switcher, folder, any lab-only route or middleware entry. Check `git status` and the diff for leftovers before you push. Keep the exported HTML outside the app as the review record.
4. **Screenshot the shipped result** on the real surface, so what they picked and what shipped are visibly the same. The `visualize-ui` skill covers before and after.
5. **Write the losing variants into the PR:** each label, its bet, and why it lost, in the developer's words. Link the exported lab.
6. **Write lasting taste into DESIGN.md.** If a variant lost on principle ("no overflow menu with one item"), not on execution, add it to Do / Don't with the reason, so it is not proposed again.

## Rules

- Never ask for approval of the spread. Announce it and build.
- Always recommend; never pick for the developer.
- Variants differ in design, never in data.
- Every round includes today's UI.
- Every variant uses the team's building blocks.
- Check every tile rendered before you show the lab.
- The lab is throwaway. It never lands in a commit.
- No em dashes in anything the developer reads. Commas and colons do the job.
