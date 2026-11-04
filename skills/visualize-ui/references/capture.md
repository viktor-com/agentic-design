# Capturing and composing

Plain Playwright and ffmpeg. Work in a scratch folder outside the repo, with `raw/` for captures and `annotated/` for what gets shown. None of it is committed.

The scripts live in this skill's `scripts/` folder. Below, `$V` stands for that folder's path:

```bash
V=<path to this skill>/scripts    # e.g. .claude/skills/visualize-ui/scripts or .agents/skills/visualize-ui/scripts
```

They look for Playwright in the current directory first, then `NODE_PATH`. Run them from the app's folder if it has Playwright, or install it once in the scratch folder (`npm i -D playwright && npx playwright install chromium`). If that Playwright has no browser downloaded, they fall back to an installed Chrome; set `CHROME_PATH` to point at a specific binary.

## Before you capture

**Freeze the code.** No edits, merges or backend restarts while a set of captures runs: a hot reload halfway gives stills from two builds. Note the commit each set covers. If the branch moves, retake the whole set at one commit, and after any design change retake every picture it touches, so no image of a superseded version survives in a PR body.

**Keep the run light and to itself.** Capture is the heaviest step on a shared machine.

- One dev server and one browser at a time, on your own ports, debug port, display and temp folder. Default ports collide with other agents, and a small full temp disk makes headless Chrome fail with resource errors that look like app bugs.
- Block hot reload in the capture run if other people or agents are editing the same checkout.
- Send dev server and session logs to a file, not the console, and never print manifests or env dumps. When a subagent boots a dev session for you, tell it so: a failed start can echo credentials.
- Stop the servers and browser when done. Never end a turn with capture jobs running in the background; they die with the session.

**Clean the screen,** identically on both sides of a pair. Each of these has shipped in evidence and read as a bug.

- Dev-only chrome: dev badges, reset pills, devtools and debug buttons, framework warning toasts. Pass their selectors to `--hide`.
- Spellcheck squiggles. The scripts turn spellcheck off; elsewhere set `spellcheck="false"` on `<html>`.
- Focus rings left by opening something from code: `--blur`, or end the steps with a blur.
- First-run prompts and onboarding wizards (dismiss them in the steps), leftover test data in view, broken fixture avatars, text caught mid-shimmer, third-party requests (`--only-local`).
- Headless browsers draw no pointer. `clip.cjs` draws one by default; `shot.cjs --pointer` for a hover still.
- Windows from other processes in a desktop recording.

**Load the real fonts.** Check the brand fonts, and an emoji font if the UI shows emoji, before the first still. The scripts print the fonts the page loaded and any that failed. A fallback font changes wrapping and weight, so a pair with the brand font on one side and a system font on the other shows a change that does not exist. If a capture must use a fallback, say so beside it. Missing emoji show as dots or boxes; install an emoji font on a headless machine.

**Use realistic demo data** that is a little complex and exercises every new element. A three-step toy run undersells a change; if the first example never shows the new thing, add a second. Pick a seed account that lands in the full app, not on an onboarding wizard.

## Where the UI comes from

Take the first that can show the subject. A picture needs the UI on screen in a known state, not a working backend.

| | Runs | Use it when |
| --- | --- | --- |
| 1 | **The frontend alone on a fixture**: a Storybook story, a dev-only fixture route | The surface has one. No backend, no sign-in, every retake in seconds |
| 2 | **The dev server with one response mocked** | The page needs the backend, and the state is one seed data cannot reach |
| 3 | **The full dev setup as it is** | The subject is live behaviour: a streamed reply, a saved change |

**The before is a second checkout** at the merge base, on another port:

```bash
base=$(git merge-base origin/HEAD HEAD 2>/dev/null || git merge-base origin/main HEAD 2>/dev/null || git rev-parse HEAD)
git worktree add --detach ../before "$base"
# install and start the same dev server there, on a different port
```

For a change that is not committed yet, `HEAD` is the before. Remove the worktree when done (`git worktree remove --force ../before`; `--force` because of the installed dependencies).

The two differ by the change and nothing else: same seed data, account, input, frozen clock, fonts, viewport and theme, and the before taken at the merge base of the current head. Check that the region outside the change is pixel-identical; a diff settles "unchanged" claims too.

- **Never swap files in the working tree** to get the before. A swapped-in old file gets left in the diff, and file watchers can keep serving the stale module. If you must, confirm the dev server serves the restored file afterwards.
- **A build of the branch with the flag off is not the before.** It already carries the PR's other changes. Use the merge base, or label the picture "flag off" and say how it differs from main.
- **Each side runs on data and schema that match its own code.** When the old checkout cannot boot (its database schema is behind), take the cheapest route that does: run the old frontend against today's backend, or mount the real component in a throwaway page or story on the same seed data, with only the changed files taken from the merge base (not from main, which breaks imports). Match width, crop and top exactly, then delete the scaffolding. Say in the evidence when a side had to deviate.
- **Plan a pair for every case the change touches:** left and right, short and long, with and without extras, each platform, flag on and off. One happy example misses the short bubble where the new bar overflows.

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

**Label staged state in the evidence.** A caption says "stubbed data", "injected", or "brought up by hand" for any state the product did not reach on its own, and timings from hand-driven steps are not product measurements. Reviewers trust a picture as the real product. When you report, state per image what is real and what is faked, and every place where what renders differs from the change description.

**Hold a short-lived state on screen** to capture it: a loading button, a "Copied" flash, a half-full progress bar. Add latency to the one request (`await new Promise((r) => setTimeout(r, 1500))` before `route.continue()`), move the page clock (`page.clock`), or use a dev-only state switch. Reset the switch before you finish.

## A Retina still

```bash
node $V/shot.cjs http://localhost:3000/settings raw/after.png --steps steps.cjs --box "[data-testid=plan-card]"
node $V/shot.cjs http://localhost:3001/settings raw/before.png --steps steps.cjs --box "[data-testid=plan-card]"
```

Take every still after transitions have settled, in the light theme unless asked otherwise. It captures the whole viewport at 2x and prints the subject's box in CSS px, the fonts loaded, and the PNG's pixel size. Crop in the composite, so both sides crop the same way, and take the arrow ends from the printed box. `--box` takes several selectors, comma separated with `|` (`--box "#menu|#save"`), and `--no-shot` measures without writing an image.

**From box to composite**, worked through. The capture is 1280 CSS px wide; the subject's box is `{"x":600,"y":180,"width":240,"height":120}`. To show it with 40 px of context in a frame at `left:20px; top:42px`:

- frame size: `width: 240 + 2*40 = 320px`, `height: 120 + 2*40 = 200px`
- image: `width="1280"`, offset `left: -(600 - 40) = -560px`, `top: -(180 - 40) = -140px`
- the subject's centre in `main`: `x = 20 + 40 + 120 = 180`, `y = 42 + 40 + 60 = 142`. End the arrow on its edge, not its centre: for a note below, end at `y = 42 + 40 + 120 = 202`.

Do the same arithmetic for the other side with its own box.

Options: `--width`, `--height`, `--theme dark`, `--only-local` (blocks other origins except fonts, so a fixture route cannot call out), `--hide "<sel>|<sel>"`, `--blur`, `--pointer`.

A desktop app shot sits inside a native-looking window with enough surrounding UI to place it, not a tight crop of one card.

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

The pointer is drawn by default (`--no-pointer` to drop it), and `--hide` works as for stills. Stage the take so the difference shows inside the clip: both sides idle look identical.

Motion driven from JavaScript frame by frame is not slowed by the playback rate. Record it with `--slow 1` and stretch the clip: `ffmpeg -i in.webm -vf "setpts=5*PTS" -an out.webm`. Typing and other real-time flows stay at real speed, and the tag says so.

**A flow walkthrough** runs from the very first screen to the result with no step skipped, marks steps that only one branch sees, and keeps a brisk pace. Look at its first frame: a take that opens on the wrong page for four seconds gets trimmed.

Screen recordings come out at display resolution, not 2x. Check with `ffprobe -v error -show_entries stream=width,height -of csv=p=0 take.webm`.

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

A GIF plays inline in a PR body or a chat message; a webm usually does not. Keep it to a few megabytes: 12 to 15 frames a second, scaled down when the canvas is wide. A looping GIF loops seamlessly: the same objects throughout, frame one already mid-action, every change caused by something visible, the camera still. Lower frame rate at higher resolution is the better trade.

```bash
ffmpeg -y -i annotated/menu-before-after.webm \
  -vf "fps=12,scale=1200:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" annotated/menu-before-after.gif
```

Check frames across the clip, not one:

```bash
ffmpeg -i annotated/menu-before-after.webm -vf "fps=1/1.5,scale=900:-1,tile=4x1" -frames:v 1 check.png
```

It shows a take that started late, a crop that drifts, or something peeking in at a frame's edge.

## Check every capture before you use it

Headless captures fail silently. Before composing:

- **Pixel size** is the viewport times the scale. Devtools-protocol screenshots, screencasts and some helpers ignore the device scale and write 1x; a 1x frame beside a 2x one shows in the composite.
- **Fonts** are the brand fonts, labels are not blank, emoji are not boxes.
- **First frame** shows the app, not a wizard or another page.
- **Nothing predates the last fix.** A stale still draws false review comments.
- **Motion really moved.** A browser without GPU or WebGL can freeze an animation, and two crops a few hundred ms apart that are byte-identical prove nothing about the product.
- **A defect seen only in a screenshot** is confirmed live before you report it: a clipped capture or the script's own hover can create it.

## Proving motion, pop-in and timing

A claim that something moves, stands still, pops in, flashes or jumps needs per-frame evidence, not one still.

- Sample the element's box and visible text every 50 to 200 ms through the transition, from first frame to settled, or run a `requestAnimationFrame` probe that records every frame. Count the frames that show the placeholder, neither, or both.
- Or capture at 60 fps and diff consecutive crops.
- Diff two crops a few hundred ms apart to show something moves (they differ) or holds (they match), on a machine that can actually render the motion.

Performance claims carry p50 and p95 frame times, frames over budget and renders per interaction, before and after measured in one session on the same machine, best of several runs with the spread stated and both commits named. Throttled runs can differ by 2x between takes.

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
