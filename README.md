<p align="center">
  <img src=".github/banner/1-van-haecht-gallery.jpg" width="100%" alt="agentic-design">
</p>
<p align="center"><sub><i>Willem van Haecht, The Gallery of Cornelis van der Geest, 1628, hung with our own work</i></sub></p>

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

<p align="center">
  <img src=".github/banner/2-stradanus-workshop.jpg" width="100%" alt="A painter's workshop with apprentices at work">
</p>
<p align="center"><sub><i>Jan Collaert II after Jan van der Straet (Stradanus), Color Olivi (Nova Reperta), c. 1590. A workshop where every hand has one job.</i></sub></p>

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

<p align="center">
  <img src=".github/banner/3-heemskerck-st-luke.jpg" width="100%" alt="St Luke painting the Virgin">
</p>
<p align="center"><sub><i>Maarten van Heemskerck, St Luke Painting the Virgin, 1532. One picture, worked over until it's right.</i></sub></p>

## License

MIT. The paintings are public domain.
