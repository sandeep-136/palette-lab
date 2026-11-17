import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
const files = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/app.js", "app.js"],
  ["/color.js", "color.js"],
  ["/style.css", "style.css"],
  ["/favicon.svg", "favicon.svg"],
]);
const mime = {
  html: "text/html; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  css: "text/css; charset=utf-8",
  svg: "image/svg+xml",
};
createServer(async (req, res) => {
  const file = files.get(new URL(req.url, "http://localhost").pathname);
  if (!file) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  try {
    const data = await readFile(new URL(file, import.meta.url));
    res.writeHead(200, { "Content-Type": mime[file.split(".").pop()] });
    res.end(data);
  } catch {
    res.writeHead(500);
    res.end("Unable to load file");
  }
}).listen(process.env.PORT || 3000, () => console.log("Palette Lab listening"));
