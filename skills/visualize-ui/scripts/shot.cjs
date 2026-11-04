// A Retina still of a page, plus the box of the subject for cropping and arrow ends.
//
//   node shot.cjs <url> <out.png> [--width 1280] [--height 800] [--scale 2]
//        [--theme light|dark] [--steps steps.cjs] [--box "<css selector>"] [--only-local]
//
// --steps    a module exporting async (page) => {} that brings the page to the state to show
// --box      prints the selector's bounding box (CSS px) as JSON
// --only-local  blocks requests to other origins except fonts (useful on fixture routes)
//
// Captures the whole viewport on purpose: crop in the composite, so both sides of a comparison
// crop identically.
const { load, launch, args, steps } = require("./playwright.cjs");

(async () => {
	const { positional, flags } = args(process.argv.slice(2));
	const [url, out] = positional;
	if (!url || !out) {
		console.error("usage: node shot.cjs <url> <out.png> [--width --height --scale --theme --steps --box --only-local]");
		process.exit(2);
	}
	const { chromium } = load();
	const browser = await launch(chromium);
	const context = await browser.newContext({
		viewport: { width: Number(flags.width ?? 1280), height: Number(flags.height ?? 800) },
		deviceScaleFactor: Number(flags.scale ?? 2),
		colorScheme: flags.theme === "dark" ? "dark" : "light",
	});
	const page = await context.newPage();
	if (flags["only-local"]) {
		const origin = new URL(url).origin;
		await page.route((u) => u.origin !== origin && !/font/.test(u.host), (r) => r.abort());
	}
	await page.goto(url, { waitUntil: "networkidle" }).catch(() => page.goto(url));
	await steps(flags.steps)(page);
	await page.evaluate(() => document.fonts.ready);
	if (flags.box) console.log(JSON.stringify(await page.locator(flags.box).first().boundingBox()));
	await page.screenshot({ path: out });
	console.log(out);
	await browser.close();
})();
