import puppeteer from "/Users/tom.kim/personal/card-generator/scripts/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const slides = ["slide_01", "slide_02", "slide_03", "slide_04", "slide_05"];

const dataUris = await Promise.all(
  slides.map(async (name) => {
    const buf = await readFile(join(__dirname, `${name}.png`));
    return `data:image/png;base64,${buf.toString("base64")}`;
  })
);

const cards = dataUris
  .map(
    (uri, i) => `
    <div class="card card-${i}">
      <img src="${uri}" alt="${slides[i]}">
    </div>`
  )
  .join("");

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 2400px; height: 800px; overflow: hidden; }
  body {
    background: radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0a 85%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1900px;
    height: 700px;
    background: radial-gradient(ellipse, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .stage {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    position: relative;
    z-index: 2;
  }

  .card {
    width: 480px;
    height: 480px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
      0 40px 100px rgba(0, 0, 0, 0.65),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
    background: #0F172A;
  }

  .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .card-0 { transform: rotate(-10deg) translate(140px, 40px); z-index: 1; }
  .card-1 { transform: rotate(-5deg) translate(70px, 12px); z-index: 2; }
  .card-2 {
    width: 560px;
    height: 560px;
    border-radius: 28px;
    transform: rotate(0deg);
    z-index: 5;
    box-shadow:
      0 50px 120px rgba(0, 0, 0, 0.75),
      0 0 0 1px rgba(255, 255, 255, 0.12),
      0 0 80px rgba(59, 130, 246, 0.25);
  }
  .card-3 { transform: rotate(5deg) translate(-70px, 12px); z-index: 2; }
  .card-4 { transform: rotate(10deg) translate(-140px, 40px); z-index: 1; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="stage">${cards}</div>
</body>
</html>`;

const htmlPath = join(__dirname, "banner.html");
await writeFile(htmlPath, html);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 2400, height: 800, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle0", timeout: 30_000 });
await new Promise((r) => setTimeout(r, 500));

const outPath = join(__dirname, "..", "banner.png");
await page.screenshot({
  path: outPath,
  type: "png",
  clip: { x: 0, y: 0, width: 2400, height: 800 },
});

await browser.close();
console.log(`banner rendered → ${outPath}`);
