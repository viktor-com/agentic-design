---
name: building-blocks
description: "Use the team's real UI components, tokens, icons, and patterns instead of inventing new ones. Use before building or changing any screen, component, prototype variant, or styled page in a product codebase, and when reviewing UI code for hand-rolled copies of things the design system already has. Keeps an inventory of the building blocks in DESIGN.md so it is found once, not every task."
---

# Building blocks

The fastest way for an agent to make UI that looks off is to write its own button. It will be close to the real one and wrong in a dozen small ways: radius, focus ring, disabled state, dark mode, the wording. This skill makes the agent find and use what the team already built.

## 1. Read the inventory

Open `DESIGN.md` (repo root, or `docs/DESIGN.md`) and read its **Building blocks** section. If it lists the component library, the token source, and a "Need / Use / Not" table, trust it and skip to step 3.

No DESIGN.md: say so in one line and do step 2 anyway. Offer to write the file with the `brand` skill at the end.

## 2. Take the inventory (once per repo)

Find, in this order:

- **The component library.** A workspace package (`packages/ui`, `@acme/ui`), a `components/ui` folder (shadcn style), or a third-party kit in `package.json` (Radix, MUI, Chakra, Mantine). Note the import path people actually use, by grepping imports, not by reading the package name.
- **The tokens.** CSS custom properties, the Tailwind theme, a tokens file. Note where colour, type, spacing, and radius come from.
- **The icons.** The one icon set the app imports from.
- **A preview.** Storybook (`.storybook/`), a fixture or dev route, or nothing.
- **The patterns.** For each, the component the app already uses:
  status callout, toast, empty state, failed load, loading or skeleton, dialog, sheet or drawer, menu, form field and validation, table or list row, page header, tabs.

Useful searches:

```bash
rg -l "from ['\"](@[^/]+/ui|.*/components/ui)" --type-add 'web:*.{ts,tsx,js,jsx,vue,svelte}' -t web | head
rg -n "export (function|const) (Alert|Toast|Dialog|Modal|Sheet|Drawer|Menu|EmptyState|Skeleton|Spinner)\b"
rg -n -- "--color-|--radius|--space" --glob '*.css' | head -40
```

Write what you found into DESIGN.md's Building blocks section, as a short list plus a table:

```markdown
## Building blocks

- Component library: `@acme/ui` (`packages/ui/src`), imported as `import { Button } from "@acme/ui"`
- Tokens: `packages/ui/src/tokens.css`, mapped into the Tailwind theme
- Icons: `lucide-react`, 16 px in rows, 20 px in headers
- Preview: `pnpm storybook` (port 6006)

| Need | Use | Not |
| --- | --- | --- |
| Status callout | `Alert` | a bordered div with a tinted background |
| Failed fetch | `ErrorState` with a retry | a red sentence in a `<p>` |
| Slow content | `Skeleton` shaped like the content | a centred spinner |
```

Keep it to what a person would get wrong. Twenty rows is plenty.

## 3. Build from what is there

For every piece the change needs:

1. **Find the closest screen that already does something similar** and read it. Copy its structure and its words. If the app says "Archive", do not write "Move to archive" in the new screen.
2. **Search by role, not by the name you expect.** A "modal" may be called `Dialog`, `Sheet`, or `Overlay`. A "card" may be `Panel` or `Tile`.
3. **Use tokens, not values.** No raw hex, no font size off the scale, no one-off spacing. Arbitrary Tailwind values (`w-[248px]`) only where the existing code does the same for the same reason.
4. **Missing piece?** In order of preference: compose it from existing primitives; add a prop to the existing component that defaults to today's behaviour; only then a new shared component. A new shared component is a design decision, so tell the developer in one line. Never copy a component's classes into a new file.

The design system is not a variable in a prototype either. Variants differ in layout, hierarchy, and interaction; they all use the same button.

## 4. Check your own change

Before you call it done:

- Grep your diff for raw colours (`#[0-9a-fA-F]{3,8}`, `rgb(`), inline `style=` with visual values, and new components whose names match existing ones.
- Look at it in both themes if the app has two.
- For any list that mixes row kinds, measure icon and title positions with `getBoundingClientRect` in the browser. A few pixels of offset between neighbouring rows is visible.

For a finished feature of any size, run a reuse pass: have a read-only subagent (or a second read-through, if your agent cannot spawn one) compare the new files against the library and the nearest existing screens, and return a ranked `file:line` list of things rebuilt that already existed. Fix what is real.

## 5. Keep the inventory true

When you find a building block the inventory lacked, or one it lists has moved, update DESIGN.md in the same change.
