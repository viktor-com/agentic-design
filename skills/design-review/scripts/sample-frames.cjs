// Samples element boxes on every animation frame while a page loads or a transition runs,
// then reports jumps, late arrivals and placeholder hand-overs as frame counts.
//
//   node sample-frames.cjs <url> --watch "name=<selector>|name=<selector>"
//        [--pair placeholder,real] [--ms 3000] [--jump 2]
//        [--width 1280] [--height 800] [--theme light|dark]
//        [--steps steps.cjs] [--throttle 4] [--delay "<url glob>=<ms>|<url glob>=<ms>"]
//        [--log frames.json] [--strict]
//
// --watch    elements to track, by name. The first match of each selector is read every frame:
//            its box (CSS px, rounded to 0.5), whether it is visible, and its first 40 characters.
// --pair     a placeholder and what replaces it. Counts frames that show neither (a blank flash)
//            and frames that show both (a double draw), from the first frame either is visible.
// --ms       how long to keep sampling after the page has loaded and the steps have run.
// --jump     smallest single-frame move, in px, reported as a jump (default 2). Smooth animation
//            moves a little every frame; a jump moves a lot in one.
// --steps    module exporting async (page) => {} that triggers the transition (click, type).
//            Sampling runs through the steps. A navigation inside the steps restarts the probe.
// --throttle CPU slowdown factor (4 is a mid phone). Late pieces that land together on a fast
//            machine often land apart here.
// --delay    hold matching requests this long, to see the loading state a fast backend hides.
// --log      write every state change (frame number, time, boxes) as JSON.
// --strict   exit 1 if there is any jump or any neither/both frame.
//
// Needs Playwright: run from a folder that has it, or set NODE_PATH. CHROME_PATH picks the browser.
const { createRequire } = require("node:module");
const fs = require("node:fs");
const path = require("node:path");

function loadPlaywright() {
	const tries = [
		() => createRequire(path.join(process.cwd(), "noop.js"))("playwright"),
		() => createRequire(path.join(process.cwd(), "noop.js"))("@playwright/test"),
		() => require("playwright"),
	];
	for (const attempt of tries) {
		try {
			return attempt();
		} catch {}
	}
	console.error("Playwright not found. Run from a folder where it is installed, or set NODE_PATH.");
	process.exit(2);
}

function parseArgs(argv) {
	const positional = [];
	const flags = {};
	for (let i = 0; i < argv.length; i++) {
		if (argv[i].startsWith("--")) {
			const name = argv[i].slice(2);
			const next = argv[i + 1];
			if (next === undefined || next.startsWith("--")) flags[name] = true;
			else flags[name] = argv[++i];
		} else positional.push(argv[i]);
	}
	return { positional, flags };
}

// "name=selector": split on the first "=" only, so attribute selectors survive.
function pairs(text) {
	return String(text)
		.split("|")
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => {
			const at = part.indexOf("=");
			if (at < 1) throw new Error(`expected name=value, got "${part}"`);
			return [part.slice(0, at).trim(), part.slice(at + 1).trim()];
		});
}

// Runs in the page before any of its scripts. Records only frames where something changed,
// with the frame number, so frames per state are the difference of two numbers.
function probe(watch) {
	const t0 = performance.now();
	const changes = [];
	const times = [];
	let frame = 0;
	let lastKey = "";
	const read = () =>
		watch.map(([, selector]) => {
			const el = document.querySelector(selector);
			if (!el) return null;
			const r = el.getBoundingClientRect();
			const shown = el.checkVisibility
				? el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
				: getComputedStyle(el).visibility !== "hidden";
			if (!shown || r.width === 0 || r.height === 0) return null;
			const half = (v) => Math.round(v * 2) / 2;
			return [half(r.x), half(r.y), half(r.width), half(r.height), (el.textContent || "").trim().slice(0, 40)];
		});
	const tick = () => {
		frame++;
		const t = performance.now() - t0;
		if (times.length < 50000) times.push(t);
		const state = read();
		const key = JSON.stringify(state);
		if (key !== lastKey) {
			changes.push({ frame, t: Math.round(t), state });
			lastKey = key;
		}
		requestAnimationFrame(tick);
	};
	requestAnimationFrame(tick);
	window.__frameProbe = { changes, times, frames: () => frame };
}

function percentile(sorted, p) {
	if (sorted.length === 0) return 0;
	return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

function analyse(watch, data, flags) {
	const { changes, times, total } = data;
	const jumpAt = Number(flags.jump ?? 2);
	const gaps = times.slice(1).map((t, i) => t - times[i]).sort((a, b) => a - b);
	const report = {
		frames: total,
		frameMs: { p50: +percentile(gaps, 50).toFixed(1), p95: +percentile(gaps, 95).toFixed(1) },
		elements: {},
	};
	// Frames each change lasted: until the next change, or until the last frame.
	const spans = changes.map((c, i) => (i + 1 < changes.length ? changes[i + 1].frame : total + 1) - c.frame);

	watch.forEach(([name], index) => {
		const entry = { appearsAt: null, disappearsAt: null, visibleFrames: 0, appearances: 0, moves: 0, jumps: [], textChanges: 0 };
		let prev = null;
		changes.forEach((c, i) => {
			const box = c.state[index];
			if (box) entry.visibleFrames += spans[i];
			if (box && !prev) {
				entry.appearances++;
				if (entry.appearsAt === null) entry.appearsAt = c.t;
			}
			if (!box && prev) entry.disappearsAt = c.t;
			if (box && prev) {
				const dx = box[0] - prev[0];
				const dy = box[1] - prev[1];
				const dw = box[2] - prev[2];
				const dh = box[3] - prev[3];
				const step = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dw), Math.abs(dh));
				if (step > 0) entry.moves++;
				if (step >= jumpAt) entry.jumps.push({ t: c.t, frame: c.frame, dx, dy, dw, dh });
				if (box[4] !== prev[4]) entry.textChanges++;
			}
			prev = box;
		});
		report.elements[name] = entry;
	});

	if (flags.pair) {
		const [a, b] = String(flags.pair).split(",").map((s) => s.trim());
		const ia = watch.findIndex(([n]) => n === a);
		const ib = watch.findIndex(([n]) => n === b);
		if (ia < 0 || ib < 0) throw new Error(`--pair names must be in --watch: ${a}, ${b}`);
		const pair = { neither: 0, both: 0, placeholderOnly: 0, realOnly: 0, neitherAt: [] };
		let started = false;
		changes.forEach((c, i) => {
			const hasA = Boolean(c.state[ia]);
			const hasB = Boolean(c.state[ib]);
			if (hasA || hasB) started = true;
			if (!started) return;
			if (!hasA && !hasB) {
				// A blank after the real element left is the end of the view, not a flash.
				const realSeen = changes.slice(0, i).some((p) => p.state[ib]);
				const realLater = changes.slice(i + 1).some((p) => p.state[ib]);
				if (!realSeen || realLater) {
					pair.neither += spans[i];
					pair.neitherAt.push(c.t);
				}
			} else if (hasA && hasB) pair.both += spans[i];
			else if (hasA) pair.placeholderOnly += spans[i];
			else pair.realOnly += spans[i];
		});
		// The hand-over: the placeholder's last box against the real element's first box.
		// Anything but zero is the jump the placeholder existed to prevent.
		const lastA = [...changes].reverse().find((c) => c.state[ia])?.state[ia];
		const firstB = changes.find((c) => c.state[ib])?.state[ib];
		if (lastA && firstB)
			pair.handover = { dx: firstB[0] - lastA[0], dy: firstB[1] - lastA[1], dw: firstB[2] - lastA[2], dh: firstB[3] - lastA[3] };
		report.pair = { placeholder: a, real: b, ...pair };
	}
	return report;
}

(async () => {
	const { positional, flags } = parseArgs(process.argv.slice(2));
	const [url] = positional;
	if (!url || !flags.watch) {
		console.error('usage: node sample-frames.cjs <url> --watch "name=<selector>|..." [--pair a,b] [--ms 3000] [--steps s.cjs] [--throttle 4] [--delay "glob=ms"] [--log f.json] [--strict]');
		process.exit(2);
	}
	const watch = pairs(flags.watch);
	const { chromium } = loadPlaywright();
	const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
	const context = await browser.newContext({
		viewport: { width: Number(flags.width ?? 1280), height: Number(flags.height ?? 800) },
		colorScheme: flags.theme === "dark" ? "dark" : "light",
	});
	const page = await context.newPage();
	await page.addInitScript(probe, watch);
	if (flags.throttle) {
		const cdp = await context.newCDPSession(page);
		await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(flags.throttle) });
	}
	if (flags.delay) {
		for (const [glob, ms] of pairs(flags.delay)) {
			await page.route(glob, async (route) => {
				await new Promise((resolve) => setTimeout(resolve, Number(ms)));
				await route.continue().catch(() => {});
			});
		}
	}
	await page.goto(url, { waitUntil: "load" });
	if (flags.steps) await require(path.resolve(String(flags.steps)))(page);
	await page.waitForTimeout(Number(flags.ms ?? 3000));
	const data = await page.evaluate(() => {
		const p = window.__frameProbe;
		return { changes: p.changes, times: p.times, total: p.frames() };
	});
	await browser.close();

	if (flags.log) fs.writeFileSync(String(flags.log), JSON.stringify({ watch, changes: data.changes }, null, 1));
	const report = analyse(watch, data, flags);
	console.log(JSON.stringify(report, null, 2));
	// One line per finding, for the review report.
	for (const [name, e] of Object.entries(report.elements)) {
		if (e.appearsAt === null) console.error(`${name}: never visible while sampling (check the selector, or raise --ms)`);
		for (const j of e.jumps) console.error(`${name}: jumped at ${j.t} ms (dx ${j.dx}, dy ${j.dy}, dw ${j.dw}, dh ${j.dh})`);
	}
	if (report.pair) {
		const p = report.pair;
		console.error(`${p.placeholder} -> ${p.real}: ${p.neither} frames showed neither, ${p.both} showed both`);
		if (p.handover && Object.values(p.handover).some((v) => v !== 0)) console.error(`${p.placeholder} -> ${p.real}: box changed at hand-over ${JSON.stringify(p.handover)}`);
	}
	if (report.frameMs.p50 > 20) console.error(`note: frames ran at about ${Math.round(1000 / report.frameMs.p50)} fps, so one frame here is longer than on a real screen`);
	const bad =
		Object.values(report.elements).some((e) => e.jumps.length > 0) ||
		(report.pair && (report.pair.neither > 0 || report.pair.both > 0));
	if (flags.strict && bad) process.exit(1);
})();
