# The lab harness

A lab is one view per variant plus a comparison that shows them all. Pick the smallest harness that shows the decision honestly. Say which one you picked.

## Choose the harness

| Surface | Harness |
| --- | --- |
| Web UI, or shared UI that renders on the web | A local-only lab route in the app, with an iframe grid |
| Components with a working Storybook | A stories file with one story per variant and a grid story |
| Desktop or mobile UI that renders faithfully in a browser | The web preview at device sizes (1440 by 900, 390 by 844) |
| Truly native behaviour: windows, tray, safe areas, keyboard | One native session, one screenshot per variant, a labelled contact sheet |

Do not install Storybook or a new framework for a lab. Use what the project has. Run one preview server for the whole lab, owned by the orchestrator. If the chosen harness will not boot, drop to the next row and say why.

## Files

The orchestrator writes these first, before any variant is built:

```
<app>/src/<area>/dev-<slug>-lab/
    contract.tsx      # shared props and mock data
    today.tsx         # today's UI, mounted with the same contract
    variant-a.tsx     # one builder each
    variant-b.tsx
    ...
    main.tsx          # entry for the shareable export (see Export), mounts the switcher
<app>/src/routes/dev-<slug>-lab.tsx   # the switcher route (or Variants.stories.tsx)
```

Name the folder `dev-<slug>-lab` so it is easy to find at cleanup. Do not git-ignore it: some tools skip ignored files, and Tailwind's source scanning is one of them, so classes only the lab uses are never generated and the tiles lose their layout without an error. Leave it untracked and stage your real change by explicit path.

### The contract

```tsx
// contract.tsx
export const ITEMS = [ /* invented, unflattering: long names, nulls, 1 and 40 items */ ];

export type LabState = "loaded" | "empty" | "loading" | "error";   // keep only the states this surface can show

export interface VariantProps {
	items: typeof ITEMS;
	state: LabState;
}
```

Invent the data. Never copy real customer data into a lab: the export gets shared. Pin the date if anything shows relative time, or tiles differ by "3 minutes ago".

### How much each tile mounts

Choose by what the decision is about:

- **Page chrome, navigation, a whole route:** mount the real app shell at a real route, with data faked at the boundary (the data hook, the socket, or `fetch` for one reserved host). The chrome is under discussion, so it must be real.
- **A component inside a page** (a card, a panel, a dialog body): render the real component on the fixture, inside a plain wrapper of the right width and background. Faster, deterministic, and easy to stress.

Either way, use the product's own components. A look-alike shell built for the lab misleads the comparison.

## The switcher route

Two modes:

1. **No `solo` parameter:** the comparison. A heading, one line on what to look at, then a grid. Each cell is the label, the one-line bet, and a scaled iframe.
2. **`?solo=<id>`:** one variant at full size. This is each iframe's `src` and the screenshot target. A tile must never point at the grid itself, or it recurses. Read it as `new URLSearchParams(location.search).get("solo") ?? window.__LAB_SOLO__`, so the export can reuse the same code.

Gate the route to local development using the project's existing pattern for dev-only routes. If auth middleware blocks signed-out visits, allow only this path, only in local development.

**No file router, or no dev-only route pattern?** Use a second HTML entry instead: `dev-<slug>-lab.html` at the app root, loading the lab's `main.tsx`. Vite serves any HTML file in dev (`http://localhost:5173/dev-<slug>-lab.html?solo=a`) and leaves it out of the build unless it is listed as an input. Nothing in the app's routing changes. The same file is the entry for the export.

```tsx
const TILES = [
	{ id: "today", label: "Today", bet: "What ships now." },
	{ id: "a", label: "A: Tightened baseline", bet: "Fix hierarchy and spacing only." },
	{ id: "b", label: "B: Split rail", bet: "Filtering is the main verb." },
];
const W = 1440, H = 900, SCALE = 0.46;

export function LabGrid() {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(2, max-content)", gap: 24, padding: 24 }}>
			{TILES.map((t) => (
				<figure key={t.id} style={{ margin: 0 }}>
					<a href={`?solo=${t.id}`} target="_blank" rel="noreferrer"><strong>{t.label}</strong></a>
					<div style={{ fontSize: 13, opacity: 0.7, margin: "2px 0 8px" }}>{t.bet}</div>
					<div style={{ width: W * SCALE, height: H * SCALE, overflow: "hidden", borderRadius: 8, outline: "1px solid #0002" }}>
						<iframe src={`?solo=${t.id}`} title={t.label}
							style={{ width: W, height: H, border: 0, transform: `scale(${SCALE})`, transformOrigin: "0 0" }} />
					</div>
				</figure>
			))}
		</div>
	);
}
```

Inline styles on purpose, so the grid does not depend on the project's CSS setup. Phone tiles: 390 by 844, three or four per row.

**Why iframes:** full app instances share module-level stores, the URL, and fixed-position elements. Four copies in one document fight. Each iframe is its own document. The exception is a shared clock, where every tile must show the same scripted moment: then mount pure variants in one page and say so.

## Storybook instead

One story per variant plus a grid story whose tiles load `/iframe.html?id=<story-id>&viewMode=story`. Read the real story ids from `http://localhost:<port>/index.json`; do not derive them. Storybook splits digits into their own segment (`B1Variant` is `b-1-variant`), and a wrong id is a blank tile with no error. Append `&globals=theme:dark` to check the other theme.

## Contact sheet (native only)

On one device or window: open variant A, wait for it to settle, screenshot. Repeat for each, same size and state. Compose one HTML page with the screenshots in a labelled grid, and say on it that the tiles are static. Keep the live session up so the developer can try them.

## Check before showing

Screenshot every `?solo=` URL directly, then the grid. A broken tile and a slow tile look the same in the grid; a direct hit tells them apart. Give a grid of full-app tiles ten seconds to settle before believing a blank tile.

Common causes of a broken tile:

- A control with no handler renders as an inert element that looks normal. Variants must hold local state.
- Mocks did not reach the iframe's document (a mock service worker registers per document).
- A feature flag the surface needs is not set in the lab.

## Export

For anyone not at your machine, export the comparison to one HTML file:

- Inline all CSS, JS, fonts you are allowed to embed, and images (as data URIs).
- Each tile becomes an iframe with `srcdoc` holding a complete document, built in full on the parent page.
- No localhost URLs, no backend calls, no external runtime the host might block.
- Keep the interactions. A lab export that cannot be clicked is a contact sheet; say so if that is all it can be.

### 1. Build the lab into one HTML file

Give the lab its own entry that mounts the switcher directly, not the app's router (a `srcdoc` frame's address is `about:srcdoc`, which no app route matches; use a memory router if the variants need one). Then bundle that entry into one file. With Vite:

```bash
npm i -D vite-plugin-singlefile
```

```ts
// vite.lab.config.ts: keep the app's own plugins (React, Tailwind, aliases) and add singlefile
import { defineConfig, mergeConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import app from "./vite.config";

export default mergeConfig(app, defineConfig({
	plugins: [viteSingleFile()],
	build: { outDir: "dist-lab", rollupOptions: { input: "lab.html" } },
}));
```

```html
<!-- lab.html -->
<!doctype html><html><head><meta charset="utf-8"></head>
<body><div id="root"></div><script type="module" src="/src/<area>/dev-<slug>-lab/main.tsx"></script></body></html>
```

`npx vite build -c vite.lab.config.ts` writes `dist-lab/lab.html`. If `vite.config` exports a function, call it with `{ mode: "production", command: "build" }` before merging. Other bundlers have a single-file option too; the goal is one HTML file with JS and CSS inlined.

A `srcdoc` frame has no query string either, so the switcher picks its tile like this:

```ts
const solo = new URLSearchParams(location.search).get("solo") ?? (window as any).__LAB_SOLO__;
```

### 2. Pack the tiles

```bash
node <this skill's folder>/scripts/pack-lab.mjs lab.json <slug>-lab.html
```

`lab.json` names the title, the one-line intro, the tile size and scale, the bundle, and each tile's id, label, and bet (the script's header has an example). It writes one file: a grid of `srcdoc` tiles, each the bundle with `window.__LAB_SOLO__` set to its id, and a click on a label opens that tile at full size. A tile can name its own file instead, for a static screenshot page of a native-only variant.

Many hosts serve shared HTML under `Content-Security-Policy: sandbox` without `allow-same-origin`. There, the page and each tile are separate opaque origins: a tile that reads `parent.document` throws, and `localStorage`, `sessionStorage`, `document.cookie`, and `navigator.locks` throw too. Real app code often touches these as it mounts. `pack-lab.mjs` puts in-memory stand-ins for all four at the top of every tile. Anything else the app needs from the parent page must be inside the bundle.

### 3. Check it sandboxed

A plain static server sends no such header, so passing there proves nothing. Check the export under the sandbox header first:

```bash
node <this skill's folder>/scripts/serve-sandboxed.mjs path/to/<slug>-lab.html
# http://localhost:8766/   set PORT or CSP to change them
```

Open it, check every tile renders and still reacts to clicks, then share it.

## Cleanup

After the pick: delete the lab folder, the switcher route or lab HTML entry, the lab-only middleware or allowlist entry, the lab build config, and its output folder (`dist-lab/`). Regenerate route files with the project's own tooling if it has generated ones. Then check `git status` and the diff. Keep the exported HTML outside the repo, or wherever the team keeps review records.
