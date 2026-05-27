import puppeteer from "puppeteer";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { existsSync } from "node:fs";

const FONT_CACHE_DIR = join(homedir(), ".cache", "card-generator-fonts");
// deviceScaleFactor: 2 renders at 2160x2160 per slide — concurrent rendering
// causes Chromium memory pressure, resulting in blank/broken screenshots.
const MAX_CONCURRENCY = 1;

// --- Font inlining ---

async function ensureCacheDir() {
  if (!existsSync(FONT_CACHE_DIR)) {
    await mkdir(FONT_CACHE_DIR, { recursive: true });
  }
}

function cacheKey(url) {
  return createHash("sha256").update(url).digest("hex");
}

async function fetchWithCache(url) {
  await ensureCacheDir();
  const key = cacheKey(url);
  const cachePath = join(FONT_CACHE_DIR, key);

  if (existsSync(cachePath)) {
    return readFile(cachePath);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(cachePath, buffer);
    return buffer;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFontCSS(importUrl) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(importUrl, {
      signal: controller.signal,
      headers: {
        // Request woff2 format
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch font CSS: ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function inlineFontFaces(cssText) {
  const urlPattern = /url\((https?:\/\/[^)]+\.(?:woff2?|ttf|otf)[^)]*)\)/g;
  const urls = [...cssText.matchAll(urlPattern)].map((m) => m[1]);

  const formatMap = {
    woff2: "font/woff2",
    woff: "font/woff",
    ttf: "font/ttf",
    otf: "font/otf",
  };

  let result = cssText;
  for (const url of urls) {
    try {
      const fontData = await fetchWithCache(url);
      const b64 = fontData.toString("base64");
      const ext = url.match(/\.(woff2?|ttf|otf)/)?.[1] || "woff2";
      const mime = formatMap[ext] || "font/woff2";
      result = result.replace(url, `data:${mime};base64,${b64}`);
    } catch (err) {
      console.error(`Warning: failed to inline font ${url}: ${err.message}`);
    }
  }

  return result;
}

async function extractAndInlineFonts(html) {
  // Match any @import url('https://...') patterns (Google Fonts, CDN, etc.)
  const importPattern =
    /@import\s+url\(\s*['"]?(https:\/\/[^'")]+)['"]?\s*\)/g;
  const imports = [...html.matchAll(importPattern)];

  if (imports.length === 0) return { html, fontFaces: "" };

  let fontFaces = "";
  let cleanedHtml = html;

  for (const match of imports) {
    const importUrl = match[1];
    cleanedHtml = cleanedHtml.replace(match[0], "");
    try {
      const css = await fetchFontCSS(importUrl);
      const inlined = await inlineFontFaces(css);
      fontFaces += inlined + "\n";
    } catch (err) {
      console.error(
        `Warning: failed to process font import ${importUrl}: ${err.message}`
      );
    }
  }

  return { html: cleanedHtml, fontFaces };
}

// --- HTML wrapping ---

function parseViewportFromHtml(html) {
  const widthMatch = html.match(/data-width=["']?(\d+)/);
  const heightMatch = html.match(/data-height=["']?(\d+)/);
  return {
    width: widthMatch ? parseInt(widthMatch[1], 10) : 1080,
    height: heightMatch ? parseInt(heightMatch[1], 10) : 1080,
  };
}

function hasDoctype(html) {
  return /<!DOCTYPE\s/i.test(html.trimStart());
}

function wrapHtml(content, fontFaces, width, height) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${width}, initial-scale=1">
  <style>
${fontFaces}
  </style>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; overflow: hidden; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
}

// --- Rendering ---

// Detect children of `.slide` whose bounding rect extends past the slide box.
// Returns an array of { selector, overflowRight, overflowBottom } objects.
async function detectOverflow(page) {
  return page.evaluate(() => {
    const slide = document.querySelector(".slide");
    if (!slide) return { overflows: [], hasSlide: false };

    const slideRect = slide.getBoundingClientRect();
    const tolerance = 1; // sub-pixel rounding tolerance
    const overflows = [];

    const describe = (el) => {
      let sel = el.tagName.toLowerCase();
      if (el.id) sel += `#${el.id}`;
      if (el.className && typeof el.className === "string") {
        const cls = el.className.trim().split(/\s+/).filter(Boolean).join(".");
        if (cls) sel += `.${cls}`;
      }
      return sel;
    };

    const all = slide.querySelectorAll("*");
    for (const el of all) {
      // Skip non-rendered or decoratively-positioned elements that intentionally
      // sit outside (rare, but page-number / brand-mark are inside .slide).
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;

      const overflowRight = Math.max(0, rect.right - slideRect.right);
      const overflowBottom = Math.max(0, rect.bottom - slideRect.bottom);
      if (overflowRight > tolerance || overflowBottom > tolerance) {
        overflows.push({
          selector: describe(el),
          overflowRight: Math.round(overflowRight),
          overflowBottom: Math.round(overflowBottom),
        });
      }
    }
    return { overflows, hasSlide: true };
  });
}

// Inspect the resolved font-family of key text elements. If a serif fallback
// appears (e.g. "Times", "serif"), the @import font likely failed to load.
async function detectFontFallback(page) {
  return page.evaluate(() => {
    const slide = document.querySelector(".slide");
    if (!slide) return [];

    const SERIF_SIGNAL = /\b(times|serif|georgia|garamond)\b/i;
    const targets = slide.querySelectorAll(
      "h1, h2, h3, .content, .title, .body, .cover, [class*='title'], [class*='headline']"
    );
    const warnings = [];
    for (const el of targets) {
      const ff = getComputedStyle(el).fontFamily || "";
      // The declared family lives at the start; the resolved family is the same
      // string in Chromium. Only flag if a serif token appears AS THE PRIMARY
      // family (first comma-separated entry).
      const primary = ff.split(",")[0].trim().replace(/^["']|["']$/g, "");
      if (SERIF_SIGNAL.test(primary)) {
        warnings.push({ family: ff, primary });
      }
    }
    return warnings;
  });
}

async function renderSlide(browser, htmlPath) {
  const rawHtml = await readFile(htmlPath, "utf-8");
  if (!rawHtml.trim()) throw new Error("Empty HTML file");

  const { width, height } = parseViewportFromHtml(rawHtml);
  const { html: cleanedHtml, fontFaces } = await extractAndInlineFonts(rawHtml);

  let finalHtml;
  if (hasDoctype(cleanedHtml)) {
    // Inject font faces into existing <head>
    if (fontFaces) {
      finalHtml = cleanedHtml.replace(
        /(<head[^>]*>)/i,
        `$1\n<style>\n${fontFaces}\n</style>`
      );
    } else {
      finalHtml = cleanedHtml;
    }
  } else {
    finalHtml = wrapHtml(cleanedHtml, fontFaces, width, height);
  }

  const page = await browser.newPage();
  try {
    await page.setViewport({
      width,
      height,
      deviceScaleFactor: 2,
    });

    await page.setContent(finalHtml, { waitUntil: "networkidle0", timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    // Extra wait for late font swaps / CSS transitions after fonts.ready resolves.
    await new Promise((r) => setTimeout(r, 500));

    // Font fallback warning — surfaces silent @import failures.
    const fallbacks = await detectFontFallback(page);
    if (fallbacks.length > 0) {
      console.error(
        `Warning: ${basename(htmlPath)} resolved to a serif fallback for ${fallbacks.length} element(s). Check @import URL.`
      );
    }

    // Overflow detection + auto-retry. We scale `.content` down 10% per retry
    // (transform-origin: center) and re-test. Two retries max; if still
    // overflowing we screenshot anyway and report it in the summary.
    const MAX_RETRIES = 2;
    let overflowResult = await detectOverflow(page);
    let retries = 0;
    let scale = 1.0;

    while (overflowResult.overflows.length > 0 && retries < MAX_RETRIES) {
      retries++;
      scale *= 0.9;
      console.error(
        `Warning: ${basename(htmlPath)} has ${overflowResult.overflows.length} overflow(s); retry ${retries} scaling .content to ${scale.toFixed(2)}`
      );
      await page.evaluate((s) => {
        const styleId = "__overflow_retry_style__";
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement("style");
          style.id = styleId;
          document.head.appendChild(style);
        }
        // Keep the existing absolute + translateY(-50%) centering intact by
        // appending the scale to that transform via a wrapper rule.
        style.textContent = `
          .content {
            transform: translateY(-50%) scale(${s}) !important;
            transform-origin: center center !important;
          }
        `;
      }, scale);
      // Let layout settle.
      await new Promise((r) => setTimeout(r, 100));
      overflowResult = await detectOverflow(page);
    }

    const overflowFinal = overflowResult.overflows;

    const outputPath = htmlPath.replace(/\.html$/i, ".png");

    // Screenshot the .slide element directly (if present) to capture exactly its
    // bounding box. Falls back to a viewport-sized clip when there is no .slide.
    const slideHandle = await page.$(".slide");
    if (slideHandle) {
      await slideHandle.screenshot({ path: outputPath, type: "png" });
      await slideHandle.dispose();
    } else {
      await page.screenshot({
        path: outputPath,
        type: "png",
        clip: { x: 0, y: 0, width, height },
      });
    }

    return {
      file: basename(outputPath),
      overflow: overflowFinal.length > 0,
      overflowElements: overflowFinal,
      retries,
      fontFallback: fallbacks.length > 0,
    };
  } finally {
    await page.close();
  }
}

// --- Concurrency limiter ---

async function mapWithConcurrency(items, fn, limit) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i]).then(
        (value) => ({ status: "fulfilled", value }),
        (reason) => ({ status: "rejected", reason })
      );
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

// --- Main ---

async function main() {
  const dirPath = process.argv[2];
  if (!dirPath) {
    console.error("Usage: node render.js <directory-path>");
    process.exit(1);
  }

  let entries;
  try {
    entries = await readdir(dirPath);
  } catch {
    console.error(`Cannot read directory: ${dirPath}`);
    process.exit(1);
  }

  const htmlFiles = entries
    .filter((f) => extname(f).toLowerCase() === ".html")
    .sort()
    .map((f) => join(dirPath, f));

  if (htmlFiles.length === 0) {
    console.error("No HTML files found in directory");
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });

  try {
    const results = await mapWithConcurrency(
      htmlFiles,
      (file) => renderSlide(browser, file),
      MAX_CONCURRENCY
    );

    const rendered = [];
    const failed = [];
    const overflowed = [];

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      if (r.status === "fulfilled") {
        rendered.push(r.value);
        if (r.value.overflow) overflowed.push(r.value.file);
      } else {
        failed.push(basename(htmlFiles[i]));
        console.error(
          `Error rendering ${basename(htmlFiles[i])}: ${r.reason?.message || r.reason}`
        );
      }
    }

    const summary = {
      rendered: rendered.length,
      failed: failed.length,
      overflowed: overflowed.length,
      outputDir: dirPath,
      files: rendered,
    };
    console.log(JSON.stringify(summary, null, 2));

    if (failed.length > 0) process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
