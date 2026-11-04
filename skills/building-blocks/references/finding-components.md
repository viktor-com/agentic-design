# Finding the real components

Read this when DESIGN.md has no inventory, or a search for a component came up empty. Most "it does not exist" findings are wrong: the piece exists under another name, inside another component, or only on main.

## Start from the right code

- Fetch and read the latest main. A local branch far behind main misses whole screens and components. If you research on a branch, check how far behind it is first (`git log --oneline HEAD..origin/main | wc -l`).
- Search open and just-merged changes for the same surface or component name. A teammate may be building the same card today.
- Confirm which surface the ask is about (in-app page or standalone page, web or mobile) before mapping it.

## Search recipes

Components the app imports, by real import path:

```bash
rg -l "from ['\"](@[^/]+/ui|.*/components/ui)" --type-add 'web:*.{ts,tsx,js,jsx,vue,svelte}' -t web | head
rg -n "export (function|const) (Alert|Toast|Banner|Dialog|Modal|Sheet|Drawer|Menu|Popover|HoverCard|Tooltip|EmptyState|Skeleton|Spinner|Kbd)\b"
```

Tokens:

```bash
rg -n --glob '*.css' -e '--(color|radius|space|spacing|font|text|shadow)-' | head -40
```

Behaviours, not names. Before writing any of these, search for code that already does it:

| You are about to write | Search for |
| --- | --- |
| a hover open or close delay | `openDelay`, `closeDelay`, `setTimeout` inside `onMouseEnter` / `onPointerEnter` |
| keyboard focus detection | `focus-visible`, `useFocusVisible`, `:focus-visible` |
| a key hint | `Kbd`, `KeyCap`, `Shortcut`, `<kbd` |
| a skeleton or placeholder row | `Skeleton`, `Placeholder`, `animate-pulse` |
| a column indent or inset | the row component's padding constant, an `inset` or `gutter` export |
| a corner radius on a mark or tile | a radius helper next to the real mark |
| a keyboard shortcut label | an accelerator or shortcut formatting helper (the user may have rebound it) |
| an inverse or on-colour pill | existing inverse variants; count how many copies already exist |
| a status word or step verb | the word table the nearest surface imports |
| a success or warning glyph | the alert component's own tone-to-icon map |

No `rg`? `grep -rnE` with the same patterns works, slower.

## Where pieces hide

- **Not exported.** The component exists but its package does not export it, so the last agent copied it. Export it.
- **Inside a bigger component.** The hover timer is in a popover, the autosizing logic is in the composer, the row shell is in a list. Lift it into a shared helper rather than reimplementing.
- **Only in one host.** Each host app may keep its own copy of a sidebar or header. Find every copy before changing one, and prefer collapsing them into the shared package.
- **On a design reference page.** A team's internal design page or story often shows the treatment to use. Match it exactly.
- **In another platform's code.** The mobile app may already have the piece you are about to build for web. Check before porting the other way.

## Host wrappers

A host wrapper that forwards props by name (`<Shared title={p.title} onClose={p.onClose} />`) drops any new prop you pass through a spread upstream. Type checks may pass. When you add a prop to a shared component, grep every host for the component name and confirm each forwards it, then check it live in each host.
