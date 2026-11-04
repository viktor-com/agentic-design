// Render an HTML composite or graphic to a 2x PNG.
//
//   node render.cjs <page.html> <out.png> [--selector main] [--transparent] [--width 1600]
//
// --transparent  keeps the background clear (for a notes layer over video: body.overlay)
const path = require("node:path");
const { load, launch, args, pngSize } = require("./playwright.cjs");

(async () => {
	const { positional, flags } = args(process.argv.slice(2));
	const [html, out] = positional;
	if (!html || !out) {
		console.error("usage: node render.cjs <page.html> <out.png> [--selector main] [--transparent] [--width 1600]");
		process.exit(2);
	}
	const { chromium } = load();
	const browser = await launch(chromium);
	const page = await browser.newPage({
		deviceScaleFactor: 2,
		viewport: { width: Number(flags.width ?? 1600), height: 900 },
	});
	await page.goto("file://" + path.resolve(html), { waitUntil: "networkidle" }).catch(() => {});
	await page.evaluate(() => document.fonts.ready);
	await page.locator(flags.selector ?? "main").first().screenshot({ path: out, omitBackground: Boolean(flags.transparent) });
	const size = pngSize(out);
	console.log(out, `${size.width}x${size.height}`);
	await browser.close();
})();
