---
name: building-blocks
description: "Use the team's real UI components, tokens, icons, behaviours, and wording instead of inventing new ones, and keep shared UI identical across platforms and host apps. Use before building or changing any screen, component, prototype variant, embedded or generated page, or styled page in a product codebase; when porting UI to another platform; and when reviewing UI code for hand-rolled copies of things the design system already has. Keeps an inventory of the building blocks in DESIGN.md so it is found once, not every task."
---

# Building blocks

The fastest way for an agent to make UI that looks off is to write its own button. It will be close to the real one and wrong in a dozen small ways: radius, focus ring, disabled and loading states, dark mode, the wording. Copies also rot: every later fix to the original has to be made twice, and nobody remembers the second place. This skill makes the agent find and use what the team already built.

Reuse covers more than components. Behaviours (hover delays, focus detection, keycaps, skeleton rows), shared values (shortcuts, insets, inverse colours), and words are building blocks too.

## 1. Read the inventory

Open `DESIGN.md` (repo root, or `docs/DESIGN.md`) and read its **Building blocks** section. If it lists the component library, the token source, and a "Need / Use / Not" table, trust it and skip to step 3.

No DESIGN.md: say so in one line and do step 2 anyway. Offer to write the file with the `brand` skill at the end.

## 2. Take the inventory (once per repo)

Research on the latest main branch, not a stale checkout. A branch far behind main misses screens and components that exist now. Before building, also look for a teammate's open or just-merged change to the same surface, so you do not ship a parallel copy.

Find, in this order:

- **The component library.** A workspace package (`packages/ui`, `@acme/ui`), a `components/ui` folder (shadcn style), or a third-party kit in `package.json` (Radix, MUI, Chakra, Mantine). Note the import path people actually use, by grepping imports, not by reading the package name.
- **The tokens.** CSS custom properties, the Tailwind theme, a tokens file. Note where colour, type, spacing, and radius come from, and what the ambiguous ones really render as: a token named `primary` may be ink and `accent` may be the neutral hover grey.
- **The icons.** The one icon set the app imports from.
- **A preview.** Storybook (`.storybook/`), a fixture or dev route, a design reference page, or nothing.
- **The patterns.** For each, the component the app already uses: status callout, toast or banner slot, empty state, failed load, loading or skeleton, dialog, sheet or drawer, menu, popover and tooltip, keyboard key hint, form field and validation, table or list row, page header, tabs.
- **The behaviours and shared values.** Hover-open delays, focus-visible detection, autosizing fields, keyboard shortcut helpers, alignment insets, radius helpers. Each should have one owner.
- **The hosts.** Every app that renders the shared UI (web, desktop shell, mobile). Note where a host keeps its own copy of a shared piece, and where a host wrapper forwards props by name; both are where changes silently go missing.

Search by role and behaviour, not by the name you expect. A "modal" may be `Dialog`, `Sheet`, or `Overlay`; a hover timer may live inside a `HoverCard`. The recipes are in [references/finding-components.md](references/finding-components.md); read it when the inventory is missing or a search comes up empty.

Write what you found into DESIGN.md's Building blocks section, as a short list plus a table:

```markdown
## Building blocks

- Component library: `@acme/ui` (`packages/ui/src`), imported as `import { Button } from "@acme/ui"`
- Tokens: `packages/ui/src/tokens.css`, mapped into the Tailwind theme. `accent` is the hover grey, not a brand colour.
- Icons: `lucide-react`, 16 px in rows, 20 px in headers
- Preview: `pnpm storybook` (port 6006)
- Hosts: web and desktop render `@acme/chat`; the web wrapper forwards props by name

| Need | Use | Not |
| --- | --- | --- |
| Status callout | `Alert` | a bordered div with a tinted background |
| Failed fetch | `ErrorState` with a retry | a red sentence in a `<p>` |
| Slow content | `Skeleton` shaped like the content | a centred spinner |
| Hover preview | `HoverCard` (has the open delay) | a `setTimeout` on mouseenter |
| Key hint | `Kbd` | a hand-styled bordered span |
```

Keep it to what a person would get wrong. Twenty rows is plenty.

## 3. Build from what is there

For every piece the change needs:

1. **Find the closest screen that already does something similar** and read it. Copy its structure, its words, its timing. A new element inside an existing surface is built from that surface's own parts: its rows, avatars, type, spacing, and shipped transitions.
2. **Use the existing variant exactly as it is.** Asked for "a bordered button" or "a key hint", use the stock variant or component with its own hover and focus states. Hand-styled versions get rejected.
3. **Use tokens, not values.** No raw hex, no font size off the scale, no one-off spacing. Arbitrary Tailwind values (`w-[248px]`) only where the existing code does the same for the same reason. Read shared values (shortcuts, insets, defaults) from their one owner, never retyped.
4. **Match the neighbours.** Sibling controls in one bar share one variant, one height, and one tooltip mechanism; icon-only buttons are square. A new popover or floating bar takes its neighbours' border, fill, and density, and the small variants of existing parts. Drop a header or close button that Escape and outside click already cover.
5. **Put things where the app already puts them.** Notices go in the existing banner slot, not new toasts. App-level settings go where the platform keeps them (version and updates under About).
6. **Placeholders come from the same helper as the real thing**: same size, radius, and text, so only tone changes on the swap. One that matches by coincidence jumps.
7. **Missing piece?** In order of preference: compose it from existing primitives; export the existing component or helper if it is not exported; add a prop that defaults to today's behaviour; only then a new shared component. A new shared component is a design decision, so tell the developer in one line. Never copy a component's classes, timers, colour maps, or tone-to-icon tables into a new file. Copies drop guards the original had and drift in colour within weeks.

The design system is not a variable in a prototype either. Variants differ in layout, hierarchy, and interaction; they all use the same button.

**Embedded or generated pages** (a page an agent builds, a webview, a template) use the host's building blocks and brand too: the host's button style, one filled button per view, no tinted whole panels, nothing pulsing at rest, no native date inputs, no stock template text or generic sign-in spinner showing through.

**Overriding a component's colours** with utility classes often loses to the variant's own state classes. Confirm the override with computed styles in every state (rest, hover, pressed, both themes) and a contrast ratio. Better: add the variant to the component. Details in [references/reuse-traps.md](references/reuse-traps.md).

**Keep the diff lean.** Component styles in their own stylesheet, not appended to a global one. No boilerplate. Tests only where they guard real logic.

## 4. One vocabulary

Words are building blocks. Before writing any label, status, or notice, read what the nearest surface says for the same thing and use it.

- Same verb for the same act everywhere. A new status row says "Ran commands" if the existing one does, never "Ran scripts".
- One concept has one name across its tooltip, badge, and label.
- One kind of notice has one copy set, shared by every layer and platform that shows it. Keep the strings in one table that every surface imports.
- Reuse the existing sentence for the same error, and the product's existing media (demo video, illustrations) instead of making new ones.
- Copy for one platform names only controls that platform shows.

## 5. Shared UI across platforms and hosts

When the same UI ships on web, desktop, and mobile, or in two host apps:

- **Derive each piece of state once** in shared code and render every surface from that value. Separate derivations drift: one platform says "Thinking" while another says "Working on 3 tasks".
- **Extract the shared shell and the shared copy** rather than porting by copy. If you must port, carry over the accessibility roles and labels, the word table, and the behaviour rules (who may act, what is gated), not only the look.
- **Removing an entry point** means every place it exists: menus, tray, shortcuts, search keywords.
- **Check each host on its own.** A wrapper that forwards props by name silently drops a new prop passed through a spread; type checks pass and the control never appears. A host that keeps its own copy of a shared piece keeps the old behaviour. Run each host, or say which you could not.

## 6. Check your own change

Before you call it done:

- Grep your diff for raw colours (`#[0-9a-fA-F]{3,8}`, `rgb(`), inline `style=` with visual values, `setTimeout` near hover or focus handlers, and new components whose names match existing ones.
- Look at it in both themes if the app has two, in the real running app, not only a harness.
- For any list that mixes row kinds, measure icon and title positions with `getBoundingClientRect` in the browser. A few pixels of offset between neighbouring rows is visible.

For a finished feature of any size, run a reuse pass: have a read-only subagent (or a second read-through, if your agent cannot spawn one) compare the new files against the library, the nearest existing screens, and the other platforms' versions, and return a ranked `file:line` list of things rebuilt that already existed: markup, class strings, timers, word tables, constants. Fix what is real. The brief is in [references/reuse-traps.md](references/reuse-traps.md).

## 7. Keep the inventory true

When you find a building block the inventory lacked, one it lists has moved, or a host trap it did not mention, update DESIGN.md in the same change.
