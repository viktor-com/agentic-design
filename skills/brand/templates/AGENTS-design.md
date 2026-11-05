## Design work

These rules apply to every agent working on UI in this repo. The design skills (`brand`, `building-blocks`, `prototype-ui`, `design-review`, `visualize-ui`, `infographic`) hold the how.

- **Read `DESIGN.md` first** for any UI, prototype, screenshot, or graphic. Use the team's components and tokens, never hand-rolled copies (`building-blocks`).
- **Every UI build runs a prototype lab** (`prototype-ui`), sized to the change: variants next to today's UI in the full app frame. Skip it only for copy-only edits, bug fixes that restore the intended design, and changes with no visible effect.
- **Never block on a design choice.** Post the lab, say which variant you are shipping and why (DESIGN.md principles, fewest clicks, quietest that does the job, states that hold up), and build it in the same turn. A later pick from a person replaces yours.
- **Review before anyone sees it** (`design-review`): every state, light and dark, phone width, measured alignment, every word of copy. Fix what is real.
- **Every PR that changes what a person sees carries an annotated before/after** in its body (`visualize-ui`), captured from the merge base and the branch in the same state. A UI PR without one is not ready for review. If it truly cannot be captured, the PR says why in one line.
- **Lasting corrections go into `DESIGN.md`'s Do / Don't** in the same change, with the reason.
