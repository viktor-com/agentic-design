#!/usr/bin/env node
// Serve one HTML file under a sandboxing Content-Security-Policy, the way many hosts serve shared
// pages. A page that works from file:// or a plain static server can still break there: storage,
// cookies and cross-frame access throw. Check an exported lab here before you share it.
//
//   node serve-sandboxed.mjs <page.html>            -> http://localhost:8766/
//   PORT=9000 CSP="sandbox allow-scripts" node serve-sandboxed.mjs <page.html>

import { readFileSync } from "node:fs";
import { createServer } from "node:http";

const CSP =
	process.env.CSP ??
	"sandbox allow-scripts allow-forms allow-modals allow-popups allow-downloads";
const PORT = Number(process.env.PORT ?? 8766);

const file = process.argv[2];
if (!file) {
	console.error("usage: serve-sandboxed.mjs <page.html>");
	process.exit(2);
}

createServer((_request, response) => {
	response.writeHead(200, {
		"content-type": "text/html; charset=utf-8",
		"content-security-policy": CSP,
	});
	// Read on every request, so a rebuilt export shows on reload.
	response.end(readFileSync(file));
}).listen(PORT, () => {
	console.log(`http://localhost:${PORT}/  (${file}, CSP: ${CSP})`);
});
