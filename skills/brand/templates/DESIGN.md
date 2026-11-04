# DESIGN.md

<!--
Read by agents before any UI, prototype, or visual work. Keep it under ~200 lines.
Exact values only. Write TODO where a value is not known yet; never guess one.
Note the source file for each group of values so it can be kept in sync.
-->

## Product

TODO: One paragraph. What the product is, who uses it, and how technical they are.
Example shape: "A scheduling tool for clinic front desks. Users are receptionists, not engineers;
every screen should make sense to someone who has never used software like it."

## Principles

<!-- 3 to 5 stances about the product and its users. Not visual rules: those go under Do / Don't. -->

1. TODO: e.g. "Fewest clicks, least thought."
2. TODO
3. TODO

## Voice

- TODO: How the product talks. e.g. "Plain, short, friendly. Second person. No jargon."
- Buttons: TODO (e.g. sentence case, a verb that names the result)
- Errors: TODO (e.g. say what happened and what to do next, in one sentence)
- Words we use / words we avoid: TODO

## Colour

Source: TODO (e.g. `packages/ui/src/tokens.css`)

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| TODO `--color-bg` | | | page ground |
| TODO `--color-surface` | | | cards, panels |
| TODO `--color-text` | | | body text |
| TODO `--color-muted` | | | secondary text |
| TODO `--color-line` | | | hairlines, borders |
| TODO `--color-accent` | | | primary actions, focus |
| TODO `--color-danger` | | | destructive actions, errors |

## Type

Source: TODO (font files and where they load)

| Role | Family | Weight | Size / line height | Token |
| --- | --- | --- | --- | --- |
| Display | TODO | | | |
| Heading | TODO | | | |
| Body | TODO | | | |
| Small | TODO | | | |
| Code | TODO | | | |

Licence notes: TODO (can the font files be embedded in a shared HTML page?)

## Shape and space

- Spacing scale: TODO (e.g. 4, 8, 12, 16, 24, 32)
- Radii: TODO (e.g. controls 8, cards 12, sheets 16)
- Borders and elevation: TODO (when a hairline, when a shadow)
- Layout widths: TODO (max content width, sidebar width, breakpoints)

## Motion

- Durations and easing: TODO (e.g. 150 ms for hover and press, 200 ms for enter, ease-out)
- What moves: TODO (e.g. things the user caused; nothing moves on its own except progress)

## Imagery

- Illustration style: TODO
- Logo use: TODO (which file, on which grounds, minimum size)

## Building blocks

<!-- Filled in by the building-blocks skill. The real components and where they live. -->

- Component library: TODO (package, path, how to import)
- Tokens: TODO (where colour, type, spacing and radius come from in code)
- Icons: TODO (the one icon set, and sizes)
- Preview: TODO (Storybook command, a fixture route, or none)

| Need | Use | Not |
| --- | --- | --- |
| TODO e.g. Status callout | `Alert` from `@acme/ui` | a hand-rolled bordered div |

## Graphics

<!-- Read by visualize-ui for screenshots, annotated composites, infographics, and proposal pages. -->

- Ground: TODO (page colour behind composites)
- Annotation ink: TODO (one colour that reads on both light and dark screenshots)
- Tag and heading font: TODO
- Small print font: TODO
- Cover treatment for announcements and infographics: TODO (e.g. which brand colour or image, logo placement)

## Do / Don't

<!--
Starter rules. These are common taste defaults for product UI. Keep the ones your team agrees with,
edit or delete the rest, and add your own with a reason each. When a correction from a reviewer is a
lasting rule, it goes here.
-->

### Flow

- **Do** keep the number of clicks low. Every modal, picker, or wizard step costs usage of the thing behind it. Prefer acting in place.
- **Do** open the destination at once when a step is slow, and show a skeleton shaped like the content still coming. **Don't** hold the person on a spinner before navigating.
- **Do** keep a surface the same size and in the same place across its states (placeholder, loading, done). A restyle mid-flow reads as a glitch.
- **Don't** nest navigation more than one level deep.

### Controls

- **Do** use labelled buttons. Icon-only buttons are hard to read for most people.
- **Do** name the action on the button ("Send invoice", not "Start" or "OK").
- **Don't** put a single action behind a "..." overflow menu. Use an overflow menu only when the actions truly do not fit.

### Copy

- **Do** use the shortest label that works. Two or three words beat a sentence.
- **Don't** add a subtitle that restates the heading, or an explanation the controls already give.
- **Don't** use eyebrow labels (small uppercase captions above a title).
- **Do** show errors as a plain sentence saying what happened and what to do. **Don't** show a raw exception or error code.

### Visual

- **Do** line up rows of different kinds in one list on the same icon and title columns. Measure it; do not eyeball it.
- **Don't** use decorative gradients in the app chrome (washes, gradient rings, gradient text).
- **Do** keep translucency and blur for things that float above the page (menus, popovers, a floating composer), not for the page itself.
- **Do** use the design system's own status components for alerts and empty or failed states. **Don't** hand-roll coloured boxes.

## Sources

- Brand guide: TODO (link)
- Design files: TODO (link)
- Tokens in code: TODO (path)
