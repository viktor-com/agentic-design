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

Set up once per repo:

```
> Set up our DESIGN.md
```

That writes `DESIGN.md` and adds the design rules to `AGENTS.md` (and `CLAUDE.md`) and
to the PR template, so every agent follows them on every task. Then just build:

```
> The settings page feels cluttered. Fix it.
```

The agent builds a few variants next to today's UI, posts the lab with its pick and
the reason, and keeps going without waiting. It reviews the result, then opens the
PR with an annotated before/after. Reply with a label ("B, but with C's header") at
any point to switch.

None of the skills carry a brand. Colours, fonts and voice all come from your
`DESIGN.md`.

## License

MIT
