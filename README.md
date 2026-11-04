# agentic-design

How we do design with coding agents, packaged as skills. They give an agent the
team's taste and rules, so it builds options worth picking from and shows its
work in pictures people can read at a glance.

```bash
npx skills add viktor-com/agentic-design
```

## Skills

- **brand**: writes the project's `DESIGN.md`, the one file every visual task reads first.
- **building-blocks**: makes the agent use the team's real components and tokens instead of inventing new ones.
- **design-review**: reviews built UI like a picky designer before anyone sees it: every state, measured alignment, copy, clicks.
- **infographic**: makes a one-frame graphic for a PR, a launch or a result, with real UI and numbers against a named baseline.
- **prototype-ui**: runs a prototype lab, a few clickable variants next to today's UI, picked and iterated over rounds.
- **visualize-ui**: turns UI changes, data and flows into annotated stills, slowed clips, infographics and explainer pages.

## Example

Start with `DESIGN.md`, once per repo, then ask for a design:

```
> Set up our DESIGN.md
> The settings page feels cluttered. Prototype a few directions.
```

The agent builds four variants and today's UI side by side, recommends one, and
waits. You answer in labels ("B, but with C's header"), it iterates, then ships
the pick with a before and after in the PR.

None of the skills carry a brand. Colours, fonts and voice all come from your
`DESIGN.md`.

## License

MIT
