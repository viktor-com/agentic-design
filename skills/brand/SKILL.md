---
name: brand
description: "Write or update the project's DESIGN.md, the one file every UI and visual task reads first: product, principles, voice, colour, type, shape, motion, building blocks, graphics, and do/don't rules. Use when a project has no DESIGN.md and someone asks for UI, a prototype, a graphic, or anything \"on brand\"; when asked to set up design guidelines for agents; and when a design correction from the user is a lasting rule worth writing down."
---

# Brand

An agent that does not know the brand makes generic UI. DESIGN.md fixes that. It is one short file at the repo root, and the other skills in this pack read it before they draw anything: `building-blocks`, `prototype-ui`, `visualize-ui`.

This skill ships no brand. Every value in DESIGN.md comes from the project itself.

## Where it lives

`DESIGN.md` at the repo root. If the project keeps docs elsewhere, `docs/DESIGN.md` is fine.

Then make sure every agent finds it. Add one line to the file your agents already load (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, or similar):

```
Read DESIGN.md before any UI, prototype, or visual work.
```

## Write it from evidence

1. **Collect what exists.** Look before you ask:
   - tokens: CSS custom properties, the Tailwind theme, a tokens JSON, a theme file in the design system package
   - fonts: `@font-face` rules, font files, the font loader config
   - the marketing site's stylesheet, which often holds the truest brand values
   - logo and icon files
   - any brand guide, Figma link, or PDF the user points you to
2. **Copy `templates/DESIGN.md`** from this skill's folder to the repo root.
3. **Fill each section with exact values.** Hex codes, font family names and where the files live, the radius and spacing scale. Note the source file next to each group, so the next person can check it is still in sync.
4. **When sources disagree, write both and ask.** The app says one violet, the site another: ask the user which wins. Do not average them.
5. **Ask only for what files cannot tell you.** Usually that is the product line, the principles, the voice, and the don'ts. Ask a few concrete questions in one message and offer your draft answer as the default, so the user can just say yes.
6. **Leave gaps as `TODO`.** A made-up hex code is worse than an empty field, because every later task will trust it.

## What makes it useful

- **Principles are stances, not rules.** "Fewest clicks, least thought" is a principle. "No gradients in the app chrome" is a rule that follows from one; it goes under Do / Don't with its reason.
- **Every don't has a reason.** An agent can apply a reason to a case the rule did not foresee.
- **Short.** Aim for under 200 lines. Agents read it on every task. Link to the full brand guide instead of copying it.
- **Tokens by name.** Write the token name the code uses (`--color-accent`, `bg-accent`) next to each value, so agents use the token and not the raw value.

The template starts with a set of taste defaults under Do / Don't. They are a starting point. Walk through them with the user, keep the ones the team agrees with, and delete the rest.

## Keep it true

When the user corrects a design and the correction is about more than this one task ("never put a single action behind a ... menu"), add it to Do / Don't with a one-line why, in the same change as the fix. This is how the team's taste builds up instead of being re-explained every week.

When the code's tokens change, update the matching values here in the same change.

## When DESIGN.md is missing

Other skills in this pack treat a missing DESIGN.md this way, and so should you: say so in one line, carry on with neutral defaults (the system font stack, greys, one accent from the existing app), and offer to write DESIGN.md with this skill afterwards. Do not block the task on it.
