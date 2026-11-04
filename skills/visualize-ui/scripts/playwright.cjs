// Finds Playwright: the project's own copy first (from the current directory), then a global one.
const { createRequire } = require("node:module");
const path = require("node:path");

function load() {
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
	console.error(
		"Playwright not found. Run from a folder where it is installed, or:\n" +
			"  npm i -D playwright && npx playwright install chromium\n" +
			"Or point NODE_PATH at a node_modules that has it.",
	);
	process.exit(1);
}

// Tiny flag parser: --name value, or --flag for true.
function args(argv) {
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

// Optional steps module: module.exports = async (page) => { ...bring the page to the state... }
function steps(file) {
	if (!file) return async () => {};
	return require(path.resolve(file));
}

// Launch Chromium. Order: CHROME_PATH if set, Playwright's own browser, then an installed Chrome.
// Covers the common case where the project's Playwright version has no downloaded browser.
async function launch(chromium, options = {}) {
	if (process.env.CHROME_PATH) return chromium.launch({ ...options, executablePath: process.env.CHROME_PATH });
	try {
		return await chromium.launch(options);
	} catch (error) {
		if (!/Executable doesn't exist/.test(String(error))) throw error;
		try {
			return await chromium.launch({ ...options, channel: "chrome" });
		} catch {
			console.error(
				"No browser for this Playwright version. Run `npx playwright install chromium`,\n" +
					"or set CHROME_PATH to a Chrome or Chromium binary.",
			);
			process.exit(1);
		}
	}
}

// Clean the capture before anything renders: spellcheck off (it is inherited from <html>), the
// selectors in --hide hidden (dev badges, debug buttons, warning toasts), and with --pointer a
// visible pointer that follows the mouse, since headless browsers draw none.
async function prepare(context, flags) {
	const hide = flags.hide ? String(flags.hide).split("|").map((s) => s.trim()).filter(Boolean) : [];
	await context.addInitScript(
		({ hide, pointer }) => {
			const apply = () => {
				document.documentElement.setAttribute("spellcheck", "false");
				if (hide.length && !document.getElementById("__capture-hide")) {
					const style = document.createElement("style");
					style.id = "__capture-hide";
					style.textContent = hide.join(",") + "{visibility:hidden !important}";
					document.head.append(style);
				}
				if (pointer && !document.getElementById("__capture-pointer")) {
					const dot = document.createElement("div");
					dot.id = "__capture-pointer";
					dot.innerHTML =
						'<svg width="22" height="22" viewBox="0 0 22 22"><path d="M3 2 L3 17 L7 13 L10 20 L13 19 L10 12 L16 12 Z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
					dot.style.cssText = "position:fixed;left:-40px;top:-40px;z-index:2147483647;pointer-events:none;width:22px;height:22px;margin:-2px 0 0 -3px";
					document.documentElement.append(dot);
					addEventListener("mousemove", (e) => { dot.style.left = e.clientX + "px"; dot.style.top = e.clientY + "px"; }, true);
				}
			};
			if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
			else apply();
		},
		{ hide, pointer: Boolean(flags.pointer) },
	);
}

// After the steps: blur focus left by code (--blur), and report the fonts the page loaded, so a
// silent fallback to a system font shows up before the picture is used.
async function settle(page, flags) {
	if (flags.blur) await page.evaluate(() => document.activeElement?.blur());
	await page.evaluate(() => document.fonts.ready);
	const fonts = await page.evaluate(() => {
		const loaded = new Set();
		const failed = new Set();
		for (const face of document.fonts) {
			if (face.status === "loaded") loaded.add(face.family.replace(/["']/g, ""));
			if (face.status === "error") failed.add(face.family.replace(/["']/g, ""));
		}
		return { loaded: [...loaded], failed: [...failed] };
	});
	console.log("fonts loaded:", fonts.loaded.join(", ") || "none (system fonts only)");
	if (fonts.failed.length) console.log("fonts FAILED:", fonts.failed.join(", "));
}

// Width and height of a PNG from its header, to confirm a "2x" file really is 2x.
function pngSize(file) {
	const head = require("node:fs").readFileSync(file).subarray(16, 24);
	return { width: head.readUInt32BE(0), height: head.readUInt32BE(4) };
}

module.exports = { load, launch, args, steps, prepare, settle, pngSize };
