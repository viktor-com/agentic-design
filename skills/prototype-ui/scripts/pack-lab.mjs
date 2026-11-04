#!/usr/bin/env node
// Pack a lab into one shareable HTML file: a labelled grid of srcdoc iframe tiles that stays
// clickable with no dev server, and works on hosts that sandbox shared pages.
//
//   node pack-lab.mjs lab.json out.html
//
// lab.json:
// {
//   "title": "Inbox lab, round 1",
//   "intro": "Same 40 invented threads in every tile. Try the filters.",
//   "width": 1440, "height": 900, "scale": 0.46,
//   "bundle": "dist-lab/index.html",
//   "tiles": [
//     { "id": "today", "label": "Today", "bet": "What ships now." },
//     { "id": "a", "label": "A: Tightened baseline", "bet": "Fix hierarchy and spacing only." },
//     { "id": "d", "label": "D: Board", "bet": "Grouping beats columns.", "file": "shots/d.html" }
//   ]
// }
//
// "bundle" is one self-contained HTML build of the lab (JS and CSS inlined, for example Vite with
// vite-plugin-singlefile). Each tile gets that document with window.__LAB_SOLO__ set to its id,
// because a srcdoc frame has no query string: have the lab read
//   new URLSearchParams(location.search).get("solo") ?? window.__LAB_SOLO__
// A tile may name its own "file" instead (a different build, or a static contact-sheet page).
// Paths are relative to lab.json.
//
// Every tile also gets in-memory stand-ins for localStorage, sessionStorage, document.cookie and
// navigator.locks, which throw in a sandboxed frame without allow-same-origin.
// Clicking a label opens that tile at full size; Escape or "All variants" goes back.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const [specPath, outPath] = process.argv.slice(2);
if (!specPath || !outPath) {
	console.error("usage: node pack-lab.mjs lab.json out.html");
	process.exit(2);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const base = dirname(resolve(specPath));
const W = spec.width ?? 1440;
const H = spec.height ?? 900;
const SCALE = spec.scale ?? 0.46;

const SHIM = `<script>(function(){
function mem(){var d={};return{getItem:function(k){return k in d?d[k]:null},setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]??null},get length(){return Object.keys(d).length}}}
function safe(name,value){try{window[name];}catch(e){try{Object.defineProperty(window,name,{value:value,configurable:true})}catch(e2){}}}
safe("localStorage",mem());safe("sessionStorage",mem());
try{document.cookie}catch(e){var jar="";try{Object.defineProperty(document,"cookie",{get:function(){return jar},set:function(v){jar=String(v).split(";")[0]},configurable:true})}catch(e2){}}
try{Object.defineProperty(navigator,"locks",{value:{request:function(n,o,cb){var f=typeof o==="function"?o:cb;return Promise.resolve(f({name:n}))},query:function(){return Promise.resolve({held:[],pending:[]})}},configurable:true})}catch(e){}
})();</script>`;

// Each source file is stored once; the page composes each tile's document when it loads.
const sources = [];
const sourceIndex = new Map();
function sourceOf(tile) {
	const file = tile.file ?? spec.bundle;
	if (!file) throw new Error(`tile ${tile.id} has no "file" and the spec has no "bundle"`);
	const path = resolve(base, file);
	if (!sourceIndex.has(path)) {
		sourceIndex.set(path, sources.length);
		sources.push(readFileSync(path, "utf8"));
	}
	return sourceIndex.get(path);
}

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const tiles = spec.tiles.map((tile) => ({ ...tile, source: sourceOf(tile) }));

const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(spec.title ?? "Prototype lab")}</title>
<style>
	:root { color-scheme: light dark; --bg: #f6f5f3; --text: #1c1b1f; --muted: #6f6d78; --line: #0002; }
	@media (prefers-color-scheme: dark) { :root { --bg: #161519; --text: #ecebef; --muted: #a09eab; --line: #fff2; } }
	body { margin: 0; background: var(--bg); color: var(--text); font: 15px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; }
	header { padding: 24px 24px 0; }
	h1 { margin: 0 0 4px; font-size: 20px; }
	header p { margin: 0; color: var(--muted); }
	.grid { display: flex; flex-wrap: wrap; gap: 24px; padding: 24px; }
	figure { margin: 0; }
	figure button { all: unset; cursor: pointer; font-weight: 650; }
	figure button:hover { text-decoration: underline; }
	.bet { color: var(--muted); font-size: 13px; margin: 2px 0 8px; }
	.frame { width: ${W * SCALE}px; height: ${H * SCALE}px; overflow: hidden; border-radius: 8px; outline: 1px solid var(--line); background: #fff; }
	.frame iframe { width: ${W}px; height: ${H}px; border: 0; transform: scale(${SCALE}); transform-origin: 0 0; }
	#solo { display: none; position: fixed; inset: 0; background: var(--bg); flex-direction: column; }
	#solo.on { display: flex; }
	#solo nav { display: flex; gap: 16px; align-items: baseline; padding: 10px 16px; border-bottom: 1px solid var(--line); }
	#solo nav button { all: unset; cursor: pointer; color: var(--muted); }
	#solo iframe { flex: 1; border: 0; width: 100%; background: #fff; }
</style>
</head>
<body>
<header>
	<h1>${esc(spec.title ?? "Prototype lab")}</h1>
	${spec.intro ? `<p>${esc(spec.intro)}</p>` : ""}
</header>
<div class="grid">
${tiles
	.map(
		(t, i) => `	<figure>
		<button data-i="${i}">${esc(t.label)}</button>
		<div class="bet">${esc(t.bet)}</div>
		<div class="frame"><iframe title="${esc(t.label)}" loading="lazy"></iframe></div>
	</figure>`,
	)
	.join("\n")}
</div>
<div id="solo"><nav><button id="back">All variants</button><strong id="solo-label"></strong></nav><iframe title="Variant at full size"></iframe></div>
<script>
const SOURCES = ${JSON.stringify(sources).replace(/<\/script/gi, "<\\/script")};
const SHIM = ${JSON.stringify(SHIM).replace(/<\/script/gi, "<\\/script")};
const TILES = ${JSON.stringify(tiles.map((t) => ({ id: t.id, source: t.source })))};
const DOCS = TILES.map((t) => {
	const html = SOURCES[t.source];
	const head = SHIM + "<scr" + "ipt>window.__LAB_SOLO__=" + JSON.stringify(t.id) + ";</scr" + "ipt>";
	return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + head) : head + html;
});
const LABELS = ${JSON.stringify(tiles.map((t) => t.label))};
document.querySelectorAll(".frame iframe").forEach((f, i) => { f.srcdoc = DOCS[i]; });
const solo = document.getElementById("solo");
function open(i) { solo.querySelector("iframe").srcdoc = DOCS[i]; document.getElementById("solo-label").textContent = LABELS[i]; solo.classList.add("on"); }
function close() { solo.classList.remove("on"); solo.querySelector("iframe").srcdoc = ""; }
document.querySelectorAll("figure button").forEach((b) => b.addEventListener("click", () => open(Number(b.dataset.i))));
document.getElementById("back").addEventListener("click", close);
addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
</script>
</body>
</html>
`;

writeFileSync(outPath, out);
console.log(`${outPath}: ${tiles.length} tiles, ${(out.length / 1024).toFixed(0)} KB`);
