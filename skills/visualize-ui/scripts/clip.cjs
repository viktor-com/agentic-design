// A 2x video of something that moves, with CSS motion slowed so the eye can follow it.
//
//   node clip.cjs <url> <out-dir> --action action.cjs [--steps steps.cjs]
//        [--width 912] [--height 700] [--slow 5] [--theme light|dark] [--tail 1500]
//        [--hide "<selector>|<selector>"] [--no-pointer]
//
// --steps   async (page) => {}: set the scene before slowing (not part of the take)
// --action  async (page, slow) => {}: the interaction; wait `slow` times longer than the animation
// --hide    hides dev-only chrome (dev badges, debug buttons, warning toasts)
// A visible pointer follows the mouse (headless draws none); --no-pointer turns it off.
// Spellcheck is always off. Prints the fonts the page loaded.
// Prints "action-at <seconds>": cut the take there, less about half a second of lead-in.
// The .webm lands in <out-dir> under a random name. One take per directory.
//
// Notes:
// - True 2x needs --force-device-scale-factor with viewport null; deviceScaleFactor on the
//   context records 1x in the corner of a grey canvas.
// - Animation.setPlaybackRate slows CSS animations, transitions and Web Animations. Motion driven
//   frame by frame from JS is not slowed: record at --slow 1 and stretch with ffmpeg setpts.
const path = require("node:path");
const { load, launch, args, steps, prepare, settle } = require("./playwright.cjs");

(async () => {
	const { positional, flags } = args(process.argv.slice(2));
	const [url, outDir] = positional;
	if (!url || !outDir || !flags.action) {
		console.error("usage: node clip.cjs <url> <out-dir> --action action.cjs [--steps --width --height --slow --theme --tail --hide --no-pointer]");
		process.exit(2);
	}
	const view = { width: Number(flags.width ?? 912), height: Number(flags.height ?? 700) };
	const slow = Number(flags.slow ?? 5);
	const { chromium } = load();
	const browser = await launch(chromium, {
		args: ["--force-device-scale-factor=2", `--window-size=${view.width},${view.height}`],
	});
	const context = await browser.newContext({
		viewport: null,
		colorScheme: flags.theme === "dark" ? "dark" : "light",
		recordVideo: { dir: path.resolve(outDir), size: { width: view.width * 2, height: view.height * 2 } },
	});
	await prepare(context, { ...flags, pointer: !flags["no-pointer"] });
	const started = Date.now();
	const page = await context.newPage();
	await page.goto(url, { waitUntil: "networkidle" }).catch(() => page.goto(url));
	await steps(flags.steps)(page);
	await settle(page, flags);
	if (slow !== 1) {
		const cdp = await context.newCDPSession(page);
		await cdp.send("Animation.enable");
		await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 / slow });
	}
	await page.waitForTimeout(800);
	console.log("action-at", ((Date.now() - started) / 1000).toFixed(2));
	await require(path.resolve(flags.action))(page, slow);
	await page.waitForTimeout(Number(flags.tail ?? 1500));
	await context.close();
	await browser.close();
	console.log(outDir);
})();
