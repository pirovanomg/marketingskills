#!/usr/bin/env node
// Builds files you can hand to staff without GitHub:
//   dist/Serenity Snippets.html          one self-contained file (double-click to open)
//   dist/serenity-snippets-extension.zip  the Chrome/Edge extension ("Load unpacked" after unzipping)
// Usage: node build.js   (Node 18+, no dependencies; uses the `zip` command if present, else Python)

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = __dirname;
const dist = path.join(dir, "dist");
fs.mkdirSync(dist, { recursive: true });

const read = (f) => fs.readFileSync(path.join(dir, f), "utf8");
const safeScript = (js) => js.replace(/<\/script/gi, "<\\/script");

// ---- single-file HTML ----
const iconData = "data:image/png;base64," + fs.readFileSync(path.join(dir, "icons/icon-48.png")).toString("base64");
let html = read("index.html")
  .replace('<link rel="stylesheet" href="styles.css">', () => "<style>\n" + read("styles.css") + "</style>")
  .replace(/icons\/icon-48\.png/g, iconData);
["snippets.js", "shared.js", "app.js"].forEach((f) => {
  html = html.replace(`<script src="${f}"></script>`, () => "<script>\n" + safeScript(read(f)) + "</script>");
});
if (/src="[^"]+\.js"|href="styles\.css"/.test(html)) throw new Error("an asset was not inlined");
const htmlOut = path.join(dist, "Serenity Snippets.html");
fs.writeFileSync(htmlOut, html);

// ---- extension zip ----
const files = ["manifest.json", "index.html", "styles.css", "snippets.js", "shared.js", "app.js", "content.js",
  "icons/icon-16.png", "icons/icon-32.png", "icons/icon-48.png", "icons/icon-128.png"];
const zipOut = path.join(dist, "serenity-snippets-extension.zip");
fs.rmSync(zipOut, { force: true });
try {
  execFileSync("zip", ["-q", "-X", zipOut].concat(files), { cwd: dir });
} catch (e) {
  execFileSync("python3", ["-c",
    "import sys, zipfile\nz = zipfile.ZipFile(sys.argv[1], 'w', zipfile.ZIP_DEFLATED)\n" +
    "for f in sys.argv[2:]: z.write(f, 'serenity-snippets/' + f)\nz.close()",
    zipOut].concat(files), { cwd: dir });
}

console.log("Built:\n  " + htmlOut + "\n  " + zipOut);
