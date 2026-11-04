# DESIGN.md

<!--
Read by agents before any UI, prototype, or visual work. Keep it under ~250 lines.
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

- Durations and easing: TODO (e.g. 150 ms for hover and press; enter 150 to 200 ms, a fade plus a few px, ease-out, no spring)
- What moves: TODO (e.g. things that arrive while the person watches, and indicators while work runs; nothing else moves on its own)
- Reduced motion: TODO (e.g. entrances become instant; progress still shows)

## Imagery

- Illustration style: TODO (e.g. abstract, built from the brand's own colours and shapes; no literal scenes)
- Logo use: TODO (which official file, on which grounds, minimum size)
- Third-party logos: TODO (where the official files live; shown in their own colours)

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

<!-- Read by visualize-ui and infographic for screenshots, annotated composites, infographics, and proposal pages. -->

- Ground: TODO (page colour behind composites; clearly different from the screenshots' own grounds)
- Annotation ink: TODO (one colour the product UI does not use, so notes never read as UI; not the accent; must read on light and dark screenshots)
- Annotation style: handwritten notes and hand-drawn arrows for product and design audiences; straight leaders with labels in the brand type for technical, developer-facing graphics. No numbered pins with a legend.
- Handwriting font: TODO
- Tag and heading font: TODO
- Small print font: TODO
- Technical graphics: TODO (e.g. a technical metaphor, matte and realistic; no mascots or cute motifs)
- Cover treatment for announcements and infographics: TODO (e.g. which brand colour or image, logo placement)

## Do / Don't

<!--
Starter rules. These are common taste defaults for product UI. Keep the ones your team agrees with,
edit or delete the rest, and add your own with a reason each. When a correction from a reviewer is a
lasting rule, it goes here.
-->

### Flow

- **Do** keep clicks low and act in place. Every modal, picker or wizard step costs usage of the thing behind it.
- **Do** start on sensible defaults, say what you assumed, and offer changes in place. **Don't** stop to ask before acting; a blocking question reads as a form.
- **Do** keep creating something to one click plus typing, and explain a new concept in its empty state. **Don't** add a page or a step to explain it.
- **Do** open setup or connect steps in a popover anchored to their trigger. **Don't** expand them inline, where they push content around.
- **Do** hide what the person cannot use here, and controls that do nothing in the current state. **Don't** show them disabled with an explanation.
- **Do** give every shortcut, modifier click or gesture a visible path too, such as a menu item. A hidden affordance alone is not found.
- **Do** make a gesture that commits on release say in words what letting go will do, and show a refusal with its reason.
- **Don't** nest navigation more than one level deep.

### Loading and status

- **Do** open the destination at once with a skeleton held at the final size. **Don't** hold the person on a spinner before navigating.
- **Do** make the placeholder preview what is coming (labelled outlines of the real sections). **Don't** let a stock template, a default page or a dev error overlay show while content is made.
- **Do** keep a surface the same size and in the same place across its states, and let late content arrive without moving what is on screen. A jump reads as a glitch.
- **Do** hide a panel or section until it holds something real, and make "still coming" look different from "nothing here".
- **Do** keep a working indicator moving while anything the person waits on runs, delegated work included. A still one reads as stalled.
- **Do** draw a determinate progress bar thick enough, with a visible track. A thin bar reads as an endless loader.
- **Do** show success only once the system confirmed it. A "Sent" that did not send costs more trust than a slow one.

### Emphasis

- **Do** give secondary, promotional and status UI the quietest form that works. Lower its area, contrast or persistence before dropping brand character. "Too loud" is the most common review note.
- **Do** build hierarchy with muted ink, fewer lines and detail one click away. **Don't** add a third line, a footnote or a step log by default.
- **Do** keep secondary actions low-key: a small icon on hover and keyboard focus, overlaid so nothing shifts, always shown on touch.
- **Do** size what hangs off a message (cards, summaries, meta rows) clearly below the message text, so it reads as a note on it.
- **Don't** give one visual form two meanings: a count that looks like an unread badge, a focused field that looks like a selected row, a brand mark on half the rows.

### Controls

- **Do** use labelled buttons. Icon-only buttons are hard to read for most people.
- **Do** name the action on the button ("Send invoice", not "Start" or "OK").
- **Don't** put a single action behind a "..." overflow menu. Use an overflow menu only when the actions truly do not fit.
- **Do** place a control inside the group it acts on. A dismiss beside one of two buttons reads as dismissing only that one.
- **Do** put a copy action after the content it copies, always visible, with a default that does not change.
- **Do** show hover with a translucent fill, not a border, and keep hover clearly different from selected.
- **Do** show a picker with one option as plain content. A lone option that looks clickable invites a pointless click.

### Copy

- **Do** use the shortest label that works. Two or three words beat a sentence.
- **Don't** add a subtitle that restates the heading. Explain a concept once, where it first appears, and nowhere else on that screen.
- **Don't** use eyebrow labels (small uppercase captions above a title).
- **Do** use the person's word for an internal concept, glossed once. **Don't** show the system's nouns or codenames. Check a new name for bad connotations and clashes with existing features.
- **Do** name each option by what the product will do or ask, in plain words. Keep rare cases out of labels.
- **Do** write status lines about the work, and set off a name the person typed with quotes, weight or its own line. **Don't** talk about the product in the third person.
- **Do** show errors as a plain sentence saying what happened and what to do, and offer "Try again" only when trying again can help. **Don't** show a raw exception or error code.
- **Don't** write "above" or "below" in shared copy. Layouts move the thing it points at.

### Motion

- **Do** keep entrances short and plain: about 150 to 200 ms, a fade plus a few px, instant under reduced motion. **Don't** use springs or overshoot; they read as try-hard.
- **Do** animate only what arrives while the person watches. **Don't** replay entrances on first paint, a remount or a return to the tab; it reads as reloading.

### Visual

- **Do** line up rows of different kinds in one list on the same icon and title columns. Measure it; do not eyeball it.
- **Do** make nested rounded corners concentric: inner radius is the outer radius minus the inset. A mismatch is the first thing people see.
- **Do** give a block that shares its ground with its neighbours a hairline edge, so it reads as one unit.
- **Do** set quoted text like what it will become: upright, full contrast, body font. Not italic muted grey.
- **Don't** use decorative gradients in the app chrome (washes, gradient rings, gradient text).
- **Do** keep translucency and blur for things that float above the page (menus, popovers, a floating composer), not for the page itself.
- **Do** use the design system's own status components for alerts and empty or failed states. **Don't** hand-roll coloured boxes.

### Brand and third parties

- **Do** read "on brand" as the brand's own material: its palette, display type, official marks and illustration. **Don't** recolour the generic app look and call it on brand.
- **Do** use the official logo files. **Don't** redraw a logo by hand; it reads as butchered.
- **Do** show third-party logos in their own colours, and act on third-party items in the app rather than with buttons that only link out.
- **Do** copy a familiar third-party app's interaction model when mirroring it, but keep your own highlight and selection colours.
- **Do** keep decorative art abstract, and make every interaction something the depicted material could really do. **Don't** draw literal scenes or rings that look like UI.

## Sources

- Brand guide: TODO (link)
- Design files: TODO (link)
- Tokens in code: TODO (path)
