# A spread that is really a spread

The failure this file prevents: four variants that are one design with different padding. It happens naturally. You think of one design, it feels right, and you make three small changes to it to reach four. The developer sees four near-identical tiles, learns the lab is theatre, and stops using it.

The fix is to vary the **bet**, not the arrangement.

## Write the bet first

Every design assumes something about what the person is mainly trying to do. That assumption is the variant. The layout follows from it.

- "Filtering is the main verb" gives a persistent filter rail.
- "Scanning is the main verb, acting is rare" gives a dense list with actions shown on hover.
- "People arrive to deal with the one thing they were notified about" gives search first, or a detail view with the list as a sidebar.
- "The grouping matters more than the rows" gives a board or grouped sections.
- "Zero items is the healthy state" gives a design built around the empty case.

Four bets that conflict give four designs that differ.

## The distinctness test

Run this on your own list before you spend build time. Nobody else will catch a padded spread, because the spread is never sent for approval.

1. **Would being wrong about each variant look different?** Two variants that would fail for the same reason are one variant.
2. **Can you state each bet in one sentence without "cleaner", "more modern", or "better"?** Those words mean you varied the styling, which is the one axis a lab does not need help with.

## Axes that reliably produce difference

- **What is first-class.** Something buried could be the main event; something prominent could be demoted.
- **Density.** A version that fits three times as much on screen is a real option with real costs.
- **Where the detail lives.** In place, a side panel, its own page, a dialog. This changes everything downstream.
- **Navigation model.** Tabs, a rail, one long page with sections, a switcher.
- **Subtraction.** A variant that removes half of what is there. Most underused, and often the winner, because redesigns are usually asked for when a surface has grown, not when it lacks something. Every spread gets one (see below).
- **Clicks.** A variant that gets the main task done in fewer steps, for example acting in place instead of through a dialog.

## The quiet variant

Every spread includes one quiet, subtractive variant: less area, lower contrast, fewer lines, or less persistence than today. Across many labs, people picked the slimmer, quieter, or previously shipped option far more often than the agent's richer recommendation. A promo card, a header control, or a status treatment that wins in a crop often reads as "way too loud" in the full screen.

Weight your own pick the same way: toward the quietest option that still does the job, not the most novel. Pick the richer one only when you can name what the quiet one fails at.

Quiet is not the same as polished. If the developer likes the current design and asks for polish, a round of quieter variants is the wrong answer; that is a craft pass on what exists.

## The two ends have jobs

**A, the safe one, must be shippable today.** Not a straw man. It is the honest answer to "what if we just fixed the hierarchy and spacing", and it wins often enough that making it weak on purpose defeats the lab.

**D, the swing, must be defensible, not just strange.** It should be clearly right if its bet holds and clearly wrong if it does not. If you cannot argue for it sincerely, it is a decoy, and decoys make the whole lab feel padded.

## Ground the bets in what people do

A bet about the main verb is checkable when the product has analytics. Which filters get used, how often the detail opens, what share of sessions touch the thing you would promote. One real number kills a plausible bet faster than any design argument, and it takes minutes when the data is reachable.

When there is no data, say the bet is unverified. Do not state a guess about behaviour as a fact.

## Include what already exists

- **A teammate's version.** If someone has an open or just-merged change to the same surface, mount it as a tile. Seeing both side by side has more than once ended with the teammate's version shipping, which is a fine result.
- **The previous pick.** From round two on, keep the last favourite as a reference tile next to Today.

## Later rounds

- **After a pick, narrow.** Copy the picked file and make each new variant change one layer of it: density, the header, the motion, the empty state. "It must be slim, iterate on the slim idea" is a typical round-one answer.
- **After a second rejection, go wide.** If a direction has been refined twice and still lost, stop refining. Build completely different bets. A round of "completely different" options often produces the pick the same day.
- **Change only what the pick names.** "B, but with C's header" does not license moving B's other controls.

## Limits

- **Only propose what you can build this session.** A variant that needs a new backend endpoint is a project, not a variant. Mention it as a direction and move on.
- **Only show what the product really has.** A tile that shows per-item status, live presence, or progress the backend does not emit will be picked for a feature that does not exist. Fake it in the lab only when you label the tile with the signal it needs, and tick progress from real events, never from timers.
- **Prototype on the surface that ships next.** If the product is moving from an old layout or renderer to a new one, design on the new one.
- **Do not re-propose a rejected idea.** Read DESIGN.md's Do / Don't first; rejected-on-principle ideas belong there.
- **Labels are a letter, a colon, and two to four words.** People say them out loud: "B, but with C's header".
