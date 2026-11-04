# Measuring

Numbers end arguments that screenshots start. Everything here runs in a real browser on the running app: paste the page snippets into the devtools console, or into `page.evaluate` / `page.addScriptTag` from a Playwright script.

Before you trust any measurement:

- **Fonts loaded.** A fallback font changes every width and wrap. Check with `font()` below and say so when the capture's font is not the one users get.
- **Settled.** Wait for transitions to end before measuring a resting state, or sample the transition on purpose (the frame sampler, below).
- **Real widths.** Measure at the default window most people use, the tightest supported window, with side panels open, and at 390 px.
- **On a shared or headless machine:** point `TMPDIR` at a roomy folder (a full temp disk crashes headless Chrome), use your own port, and kill your server by its PID. Headless Chrome has no GPU or WebGL by default, so a shader or GPU-driven animation can sit still there while it moves for users.

## Page snippets

Paste the block once, then call the helpers. Selectors are yours to fill in.

```js
// Box of an element, rounded, in CSS px.
const box = (el) => {
	const r = (typeof el === "string" ? document.querySelector(el) : el).getBoundingClientRect();
	const f = (v) => Math.round(v * 10) / 10;
	return { x: f(r.left), y: f(r.top), w: f(r.width), h: f(r.height), right: f(r.right), bottom: f(r.bottom) };
};

// Columns: where the icon and the title start in every row, whatever its kind.
const columns = (rowSel, iconSel, titleSel) =>
	[...document.querySelectorAll(rowSel)].map((row) => ({
		kind: row.dataset.kind ?? row.className.split(" ")[0],
		icon: row.querySelector(iconSel) && box(row.querySelector(iconSel)).x,
		title: row.querySelector(titleSel) && box(row.querySelector(titleSel)).x,
	}));

// Gaps between every pair of visible neighbours in a stack. Expect one value (or the scale's few).
const gaps = (containerSel) => {
	const kids = [...document.querySelector(containerSel).children].filter((k) => k.getBoundingClientRect().height > 0);
	return kids.slice(1).map((k, i) => ({
		between: `${kids[i].className || kids[i].tagName} / ${k.className || k.tagName}`,
		gap: Math.round((k.getBoundingClientRect().top - kids[i].getBoundingClientRect().bottom) * 10) / 10,
	}));
};

// Padding around a control inside its bar, all four sides. Left should equal right.
const padding = (childSel, parentSel) => {
	const c = box(childSel), p = box(parentSel);
	return { left: c.x - p.x, right: p.right - c.right, top: c.y - p.y, bottom: p.bottom - c.bottom };
};

// Concentric corners: an inner box inset from a rounded outer box should have radius = outer - inset.
const concentric = (outerSel, innerSel) => {
	const o = document.querySelector(outerSel), i = document.querySelector(innerSel);
	const inset = Math.min(box(i).x - box(o).x, box(i).y - box(o).y);
	const outer = parseFloat(getComputedStyle(o).borderTopLeftRadius);
	const inner = parseFloat(getComputedStyle(i).borderTopLeftRadius);
	return { outer, inset, inner, expected: Math.max(0, outer - inset), ok: Math.abs(inner - Math.max(0, outer - inset)) < 1 };
};

// Focus ring: the drawn ring's box, and whether the nearest clipping ancestor or the viewport cuts it.
const ring = (sel) => {
	const el = document.querySelector(sel), cs = getComputedStyle(el), b = box(el);
	const grow = cs.outlineStyle === "none" ? 0 : parseFloat(cs.outlineWidth) + parseFloat(cs.outlineOffset);
	const r = { x: b.x - grow, y: b.y - grow, right: b.right + grow, bottom: b.bottom + grow };
	let clip = el.parentElement;
	while (clip && getComputedStyle(clip).overflow === "visible") clip = clip.parentElement;
	const c = clip ? box(clip) : { x: 0, y: 0, right: innerWidth, bottom: innerHeight };
	return { ring: r, clippedBy: clip ? clip.className || clip.tagName : "viewport", cut: r.x < c.x || r.y < c.y || r.right > c.right || r.bottom > c.bottom || r.x < 0 || r.right > innerWidth };
};

// Wrapping: elements whose text wraps to more than one line and leaves one word alone on the last.
const loneWords = (sel = "h1,h2,h3,h4,p,li,button,a,label,span") =>
	[...document.querySelectorAll(sel)]
		.filter((el) => el.children.length === 0 && el.textContent.trim())
		.map((el) => {
			const words = [];
			const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
			for (let n; (n = walker.nextNode()); ) {
				for (const m of n.data.matchAll(/\S+/g)) {
					const r = document.createRange();
					r.setStart(n, m.index);
					r.setEnd(n, m.index + m[0].length);
					const rect = r.getClientRects()[0];
					if (rect) words.push({ w: m[0], top: Math.round(rect.top) });
				}
			}
			const tops = [...new Set(words.map((w) => w.top))];
			const last = words.filter((w) => w.top === tops.at(-1)).map((w) => w.w);
			return { text: el.textContent.trim().slice(0, 50), lines: tops.length, last: last.join(" ") };
		})
		.filter((t) => t.lines > 1 && t.last.split(" ").length === 1);

// Truncation and overflow: text cut by its box, and any horizontal page scroll.
const cut = () => ({
	pageScrolls: document.documentElement.scrollWidth > innerWidth,
	truncated: [...document.querySelectorAll("body *")]
		.filter((el) => el.textContent.trim() && el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== "visible")
		.map((el) => ({ text: el.textContent.trim().slice(0, 40), shown: el.clientWidth, needs: el.scrollWidth })),
});

// Contrast of an element's text (or border) against the first opaque background behind it.
const contrast = (sel, prop = "color") => {
	const rgb = (s) => s.match(/[\d.]+/g).map(Number);
	const lum = ([r, g, b]) => {
		const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
		return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
	};
	const el = document.querySelector(sel);
	let bg = el;
	while (bg && (rgb(getComputedStyle(bg).backgroundColor)[3] ?? 1) === 0) bg = bg.parentElement;
	const back = rgb(bg ? getComputedStyle(bg).backgroundColor : "rgb(255,255,255)");
	const fore = rgb(getComputedStyle(el)[prop]);
	const a = fore[3] ?? 1;
	const mixed = [0, 1, 2].map((k) => fore[k] * a + back[k] * (1 - a));
	const [hi, lo] = [lum(mixed), lum(back)].sort((x, y) => y - x);
	return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};

// Fonts: what the element really renders in, and whether the brand face loaded.
const font = (sel, family) => ({
	computed: getComputedStyle(document.querySelector(sel)).fontFamily,
	// fonts.check() is true when no face of that family is registered at all, so look for the face.
	loaded: [...document.fonts].some((f) => f.family.replace(/["']/g, "") === family && f.status === "loaded"),
	faces: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`),
});

// Floating layers: fully on screen, and not covering what it must not cover (a close button, its anchor).
const onScreen = (sel, avoidSel) => {
	const b = box(sel), a = avoidSel && box(avoidSel);
	return {
		inside: b.x >= 0 && b.y >= 0 && b.right <= innerWidth && b.bottom <= innerHeight,
		covers: Boolean(a) && b.x < a.right && a.x < b.right && b.y < a.bottom && a.y < b.bottom,
	};
};
```

What each answers, and what a good result looks like:

| Call | Answers | Good |
| --- | --- | --- |
| `columns(".row", ".icon", ".title")` | Do rows of different kinds share the icon and title columns? | One `icon` x and one `title` x across all kinds |
| `gaps(".stack")` | Are stacked blocks evenly spaced? | One value, or only values from the spacing scale |
| `padding(".close", ".bar")` | Is an edge control inset evenly? | The edge side equals the matching side at the other end, top equals bottom |
| `concentric(".card", ".card > .inner")` | Is the inner corner concentric? | `ok: true` (inner radius = outer radius minus inset) |
| `ring(".button")` after focusing it | Is the focus ring cut by a clipping parent or the viewport? | `cut: false` |
| `loneWords()` | Which texts leave one word alone on the last line? | Empty |
| `cut()` | Which texts are truncated, and does the page scroll sideways? | `pageScrolls: false`, no truncation where space sits empty |
| `contrast(".link")`, `contrast(".chip", "borderTopColor")` | Text or outline contrast against the ground behind it | 4.5 for body text, 3 for large text and for outlines that signal a control |
| `font("body", "Brand Sans")` | Did the brand face load, and what does the element really use? | `loaded: true` |
| `onScreen(".popover", ".dialog .close")` | Is a floating layer on screen and clear of a neighbour? | `inside: true, covers: false` |

`concentric` reads the top-left corner; repeat for another corner when they differ. A child with its own radius at the parent's corner, or one that overflows a parent with `overflow: hidden`, shaves the parent's corner and its focus ring: zoom in to confirm.

## Auditing a rule, not a case

When one gap or radius is called off, audit every instance at once, in every state and at every width:

```js
// audit.cjs: node audit.cjs <url>   (paste the page snippets into SNIPPETS)
const { chromium } = require("playwright");
const SNIPPETS = `/* the page snippets above */`;
(async () => {
	const browser = await chromium.launch();
	const found = new Map();
	for (const width of [1280, 390]) {
		const page = await browser.newPage({ viewport: { width, height: 800 } });
		await page.goto(process.argv[2]);
		await page.addScriptTag({ content: SNIPPETS + ";window.gaps = gaps;" });
		for (const state of ["rest" /* , "loading", "empty", "open" : bring each about with clicks or routes */]) {
			for (const g of await page.evaluate(() => gaps(".stack"))) {
				const key = `${g.gap}px`;
				found.set(key, [...(found.get(key) ?? []), `${width} ${state} ${g.between}`]);
			}
		}
		await page.close();
	}
	console.log(Object.fromEntries(found)); // every distinct gap, with where it occurs
	await browser.close();
})();
```

Write the system as a few numbers first (for example one 8 px step), then every value outside it is a finding. Count 1 px borders and classic scrollbar tracks: they eat fixed heights and add width.

## States: rest, hover, focus

Boxes must not change when a row is hovered or focused. Computed styles show whether an override really applied.

```js
const row = page.locator(".row").first(), title = row.locator(".title");
const at = {};
await page.mouse.move(0, 0);
at.rest = await title.boundingBox();
await row.hover();
at.hover = await title.boundingBox();
await page.mouse.move(0, 0);
await page.keyboard.press("Tab"); // or locator.focus(), but Tab is what shows focus-visible rings
at.focus = await title.boundingBox();
console.log(at); // all three identical, or hover shifts the layout

const style = (loc, props) => loc.evaluate((el, props) => Object.fromEntries(props.map((p) => [p, getComputedStyle(el)[p]])), props);
await row.hover();
console.log(await style(row, ["backgroundColor", "borderColor", "color", "outlineColor"]));
```

Repeat in the dark theme (`colorScheme: "dark"` on the context). Simulated hover is not a real pointer: overlay scrollbars and some hover cards only show under a real one, so confirm those by hand or in a recording.

## Still or moving

To prove a working indicator moves, or a resting screen stands still, compare two crops a few hundred ms apart. Use a page screenshot with a clip: an element screenshot waits for the element to be stable and times out on anything that animates.

```js
const clip = await page.locator(".status").boundingBox();
const a = await page.screenshot({ clip });
await page.waitForTimeout(400);
const b = await page.screenshot({ clip });
console.log(a.equals(b) ? "identical" : "moves");
```

Identical crops prove stillness only where the environment can animate it. Without a GPU, a WebGL or shader animation is identical in every frame; say so instead of reporting it still.

## The frame sampler

`scripts/sample-frames.cjs` records the box, visibility and first words of named elements on every animation frame, from the first byte of the page, through a steps module, and for `--ms` after. It reports:

- **jumps:** single-frame moves of at least `--jump` px (default 2) of anything watched. Watch the text the person reads, and the controls beside anything that changes.
- **appearsAt:** when each piece first showed. Pieces that should land together and appear 150 ms apart are a finding.
- **pair:** for a placeholder and its replacement, frames showing neither (a blank flash), both (a double draw), and the box change at the hand-over (should be all zeros).

```bash
node <skill>/scripts/sample-frames.cjs http://localhost:5173/projects/42 \
  --watch 'skeleton=[data-skeleton]|list=.project-list|lead=main h1|cta=button.primary' \
  --pair skeleton,list --ms 3000 --throttle 4 --delay '**/api/projects*=1500' --strict
```

Run it from a folder that has Playwright, or set `NODE_PATH`; `CHROME_PATH` picks the browser. It prints JSON on stdout and one line per finding on stderr, and `--strict` exits 1 on any jump or any neither/both frame.

- Run it once plain, once with `--throttle 4`, and once with `--delay` on the slow request. Late pieces that land together on a fast machine often land apart on a slow one.
- `--steps steps.cjs` exports `async (page) => {}` to trigger a transition (open a pane, send a message). The sampler runs through it. Shortcuts and timers in the steps count as hand-driven: say so if you report timings.
- Report the numbers before and after a fix: "lead jumped 72 px at 592 ms; after: 0 jumps in 127 frames, 0 frames with neither."
- Headless frames are often slower than a real screen (the script notes it). A one-frame flash there may last longer or shorter for users; the count still shows it exists.

No script handy? The same probe in the console, started before the action:

```js
(() => {
	const sel = ".lead", log = [];
	let last = "";
	const t0 = performance.now();
	const tick = () => {
		const el = document.querySelector(sel), r = el?.getBoundingClientRect();
		const key = r ? `${r.top},${r.height}` : "none";
		if (key !== last) log.push([Math.round(performance.now() - t0), key]);
		last = key;
		if (performance.now() - t0 < 5000) requestAnimationFrame(tick);
		else console.table(log);
	};
	requestAnimationFrame(tick);
})();
```

## Frame times for an interaction

For drags, scrolls and pane moves. Throttle the CPU (devtools Performance panel, or `Emulation.setCPUThrottlingRate` over CDP with rate 4), start this, do the interaction, then read it. Run main and the branch back to back in the same session and give the spread of several runs.

```js
window.__ft = [];
(() => {
	let prev = performance.now();
	const tick = (t) => {
		__ft.push(t - prev);
		prev = t;
		if (__ft.length < 3000) requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
})();
// after the interaction:
(() => {
	const s = [...__ft].slice(1).sort((a, b) => a - b);
	const ms = (v) => Math.round(v * 10) / 10;
	// A 60 Hz frame is 16.7 ms; 18 leaves room for timer jitter.
	return { frames: s.length, p50: ms(s[s.length >> 1]), p95: ms(s[Math.floor(s.length * 0.95)]), overBudget: s.filter((x) => x > 18).length };
})();
```

Use a page as large as real ones (thousands of elements), not a three-item seed: page-wide selectors like `:root[attr] *` or `body:has(...)` only cost something at size.

## Zoom

Every join gets an 8x look: popover arrows meeting their edge, rounded corners with fills or borders, hairlines, avatar rings, scrollbar gutters. Take a 2x still and crop it, for example with ffmpeg:

```bash
ffmpeg -i shot.png -vf "crop=80:80:<x*2>:<y*2>,scale=640:640:flags=neighbor" zoom.png
```

Do it on plain, hovered and selected rows, in both themes.
