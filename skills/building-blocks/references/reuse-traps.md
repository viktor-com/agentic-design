# Reuse traps and the reuse pass

Read this when overriding a component's styles, porting UI to another platform, building a placeholder, or running the reuse pass on a finished feature.

## What copies cost

Reviews of real diffs kept finding the same hand copies: buttons, card shells, hover cards, autosizing fields, glyph renderers, keycaps, skeleton rows, indents. Each one:

- dropped a guard the original had (a loading state, a disabled check, a focus colour),
- drifted 1 to 3 px or a spacing class from the original within weeks,
- doubled every later change, and
- inflated the diff (one feature carried about 900 lines of copied markup).

The fix is always the same: export the original, add a prop with today's behaviour as default, or lift the shared part into a helper.

## Overriding a component's colours

Utility classes on a design-system component often lose to the variant's own state classes (`hover:`, `data-[state=open]:`) or to unlayered styles with higher specificity. The result looks right at rest and turns into a grey slab on hover.

1. Prefer adding a variant to the component over overriding at the call site.
2. If you override, check computed styles in the browser for rest, hover, pressed, focus, and disabled, in both themes.
3. Check the contrast ratio of text on the overridden fill in each state.
4. Check what the token actually renders as. `primary` and `accent` are often not what the name suggests.

## Placeholders that do not jump

- Build the placeholder from the same component, helper, size, and radius as the element that replaces it.
- Show the real text when you know it (an optimistic row shows the name it will arrive with, dimmed).
- A hand-sized radius that happens to match today will not match after the next change.

## Porting to another platform

When a component moves to another platform or a new surface, carry over:

- accessibility roles and labels (a `status` role, a "thinking" screen-reader label),
- the word table, imported from one place, not retyped,
- behaviour rules: who may act, what is gated, what a tap does where there is no hover,
- every entry point, and every removal of one.

Better than any port: extract the shared shell and the shared copy so both platforms render the same code from the same derived state.

## The reuse pass

Run it on any finished feature beyond a few lines. Give a read-only reviewer this brief, plus the list of changed files:

> Compare these new and changed files against the component library, the token source, and the nearest existing screens on every platform. List things rebuilt that already exist: markup, class strings, timers, focus or hover logic, colour or icon maps, word tables, constants, placeholder shapes. For each, give `file:line`, the existing thing to use, and how sure you are. Rank by how visible the drift would be. Do not edit.

Then fix what is real, and add any missing piece you found to the DESIGN.md inventory.
