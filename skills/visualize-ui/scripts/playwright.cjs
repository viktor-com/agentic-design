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

module.exports = { load, launch, args, steps };
