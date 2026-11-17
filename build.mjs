import { mkdir, copyFile } from "node:fs/promises";
await mkdir("dist", { recursive: true });
for (const file of [
  "index.html",
  "app.js",
  "color.js",
  "style.css",
  "favicon.svg",
])
  await copyFile(file, `dist/${file}`);
console.log("Static site built to dist/");
