# Capturing and composing

Plain Playwright and ffmpeg. Work in a scratch folder outside the repo, with `raw/` for captures and `annotated/` for what gets shown. None of it is committed.

The scripts live in this skill's `scripts/` folder. Below, `$V` stands for that folder's path:

```bash
V=<path to this skill>/scripts    # e.g. .claude/skills/visualize-ui/scripts or .agents/skills/visualize-ui/scripts
```

They look for Playwright in the current directory first, then `NODE_PATH`. Run them from the app's folder if it has Playwright, or install it once in the scratch folder (`npm i -D playwright && npx playwright install chromium`). If that Playwright has no browser downloaded, they fall back to an installed Chrome; set `CHROME_PATH` to point at a specific binary.

## Where the UI comes from

Take the first that can show the subject. A picture needs the UI on screen in a known state, not a working backend.

| | Runs | Use it when |
| --- | --- | --- |
| 1 | **The frontend alone on a fixture**: a Storybook story, a dev-only fixture route | The surface has one. No backend, no sign-in, every retake in seconds |
| 2 | **The dev server with one response mocked** | The page needs the backend, and the state is one seed data cannot reach |
| 3 | **The full dev setup as it is** | The subject is live behaviour: a streamed reply, a saved change |

**The before is a second checkout** at the merge base, on another port:

```bash
git worktree add --detach ../before "$(git merge-base origin/main HEAD)"
# install and start the same dev server there, on a different port
```

The two differ by the change and nothing else. Remove the worktree when done (`git worktree remove ../before`).

To stage a state the seed data cannot reach, answer one request yourself in a steps module and let the rest through:

```js
// steps.cjs
module.exports = async (page) => {
	await page.route("**/api/settings", (route) => route.fulfill({ json: { plan: "free", seats: 1 } }));
	await page.reload();
	await page.getByRole("button", { name: "Settings" }).click();
};
```

Do not hand-mock the whole API to get a picture. The app needs true shapes from many endpoints before it settles.

## A Retina still

```bash
node $V/shot.cjs http://localhost:3000/settings raw/after.png --steps steps.cjs --box "[data-testid=plan-card]"
node $V/shot.cjs http://localhost:3001/settings raw/before.png --steps steps.cjs --box "[data-testid=plan-card]"
```

It captures the whole viewport at 2x and prints the subject's box in CSS px. Crop in the composite, so both sides crop the same way, and take the arrow ends from the printed box.

Options: `--width`, `--height`, `--theme dark`, `--only-local` (blocks other origins except fonts, so a fixture route cannot call out).

A layout bug that shows at some widths only: sweep `page.setViewportSize` in a steps module, measure with `getBoundingClientRect`, then shoot at the width that shows it.

## A clip of something that moves

```js
// action.cjs: the interaction, with waits `slow` times the animation length
module.exports = async (page, slow) => {
	await page.getByRole("button", { name: "Options" }).click();
	await page.waitForTimeout(250 * slow + 400);
	await page.keyboard.press("Escape");
	await page.waitForTimeout(250 * slow + 400);
};
```

```bash
node $V/clip.cjs http://localhost:3001/inbox raw/before --action action.cjs --slow 5
node $V/clip.cjs http://localhost:3000/inbox raw/after  --action action.cjs --slow 5
```

Each prints `action-at <seconds>`. Cut each take there, less about half a second of lead-in, since page load differs between takes. Record the takes one after the other, with the same steps and waits, so they stay in step.

Motion driven from JavaScript frame by frame is not slowed by the playback rate. Record it with `--slow 1` and stretch the clip: `ffmpeg -i in.webm -vf "setpts=5*PTS" -an out.webm`. Typing and other real-time flows stay at real speed, and the tag says so.

## The annotated composite

Copy `references/annotated.html` next to `raw/`. Set the brand values from DESIGN.md, then the frames, tags, notes, and arrow paths. Render:

```bash
node $V/render.cjs annotated.html annotated/settings-before-after.png
```

Open the PNG. Nudge arrow ends until each one touches its target, and render again.

## A side-by-side clip with notes

Render the notes layer: the same page with `class="overlay"` on `<body>` and the `<img>` tags removed.

```bash
node $V/render.cjs annotated.html annotated/notes.png --transparent
```

Then lay the clips under it. Every number is a CSS value from the page, doubled: the canvas is `main`'s size, each `crop=w:h:x:y` takes a frame's size at the subject's place in the recording, each `overlay=x:y` is a frame's left and top. `-ss` is each take's `action-at` less the lead-in. The colour is `--ground`.

```bash
ffmpeg -y -ss 4.45 -t 6.4 -i raw/before/*.webm -ss 4.39 -t 6.4 -i raw/after/*.webm -i annotated/notes.png -filter_complex "
  color=c=0xf6f4f1:s=1240x668[bg];
  [0:v]crop=560:400:440:300[b]; [1:v]crop=560:400:440:300[a];
  [bg][b]overlay=40:84:shortest=1[x]; [x][a]overlay=640:84[y]; [y][2:v]overlay=0:0" \
  -c:v libvpx-vp9 -crf 30 -b:v 0 -an annotated/menu-before-after.webm
```

A GIF plays inline in a PR body or a chat message; a webm usually does not. Keep it to a few megabytes: 12 to 15 frames a second, scaled down when the canvas is wide.

```bash
ffmpeg -y -i annotated/menu-before-after.webm \
  -vf "fps=12,scale=1200:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" annotated/menu-before-after.gif
```

Check frames across the clip, not one:

```bash
ffmpeg -i annotated/menu-before-after.webm -vf "fps=1/1.5,scale=900:-1,tile=4x1" -frames:v 1 check.png
```

It shows a take that started late, a crop that drifts, or something peeking in at a frame's edge.

## Putting pictures in a pull request

GitHub has no API to upload an image into a PR body. Pick one:

- **The team's existing image host or bucket**, if there is one. Upload under a prefix named for the PR.
- **An assets branch in the same repo.** Commit the files to an orphan branch (for example `pr-assets`, under `pr-<number>/`) and link them as `https://github.com/<owner>/<repo>/blob/pr-assets/pr-<number>/<file>?raw=true`. That renders for anyone who can read the repo, private repos included.
- **Drag and drop** in the PR's web editor, if a person is at the keyboard.

```bash
# reuse the branch if it exists, otherwise start it empty (git 2.42 or later for --orphan)
(git fetch origin pr-assets && git worktree add ../pr-assets pr-assets) || git worktree add --orphan -b pr-assets ../pr-assets
mkdir -p ../pr-assets/pr-123 && cp annotated/*.{png,gif,webm} ../pr-assets/pr-123/
git -C ../pr-assets add pr-123 && git -C ../pr-assets commit -m "Screenshots for #123" && git -C ../pr-assets push -u origin pr-assets
git worktree remove ../pr-assets
```

Then edit the body with `gh pr edit <number> --body-file body.md`:

```markdown
![Options menu, before and after: it opens on the click](https://github.com/acme/app/blob/pr-assets/pr-123/menu-before-after.gif?raw=true)

5x slower ([webm](https://github.com/acme/app/blob/pr-assets/pr-123/menu-before-after.webm?raw=true))
```

Only fixture or seed data goes into a picture. A picture in a PR is as public as the repo.
