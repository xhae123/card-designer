import { readFile, readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";

// --- Color parsing ---

const NAMED_COLORS = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  orange: [255, 165, 0],
  transparent: null,
};

function parseHexColor(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  if (hex.length === 6) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  if (hex.length === 8) {
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  return null;
}

function parseRgbColor(str) {
  const match = str.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/
  );
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

function parseColor(value) {
  if (!value) return null;
  value = value.trim().toLowerCase();
  if (NAMED_COLORS[value] !== undefined) return NAMED_COLORS[value];
  if (value.startsWith("#")) return parseHexColor(value);
  if (value.startsWith("rgb")) return parseRgbColor(value);
  return null;
}

// --- WCAG contrast ratio ---

function relativeLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1);
  const l2 = relativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// --- Simple HTML parser (no dependencies) ---

function extractInlineStyle(tag) {
  const match = tag.match(/style=["']([^"']*?)["']/i);
  return match ? match[1] : "";
}

function parseStyleProps(styleStr) {
  const props = {};
  for (const decl of styleStr.split(";")) {
    const [key, ...rest] = decl.split(":");
    if (key && rest.length) {
      props[key.trim().toLowerCase()] = rest.join(":").trim();
    }
  }
  return props;
}

function extractTags(html) {
  const tagPattern = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g;
  const tags = [];
  let match;
  while ((match = tagPattern.exec(html))) {
    tags.push({ name: match[1].toLowerCase(), attrs: match[2], index: match.index });
  }
  return tags;
}

// --- <style> block CSS parser ---

/**
 * Extract all CSS rule blocks from <style> tags.
 * Returns a map: selector string → parsed properties object.
 * Handles simple selectors like `.classname`, `.parent .child`, `tag`.
 * Does not handle @media, @keyframes, or other at-rules.
 */
function parseStyleBlocks(html) {
  const ruleMap = {};
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];

  for (const block of styleBlocks) {
    const inner = block.replace(/<\/?style[^>]*>/gi, "");
    // Remove @import lines and comments
    const cleaned = inner
      .replace(/@import[^;]*;/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "");

    // Match selector { declarations }
    const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
    let m;
    while ((m = rulePattern.exec(cleaned))) {
      const selectors = m[1].trim();
      const declarations = m[2].trim();
      if (!selectors || !declarations) continue;

      // Split comma-separated selectors
      for (const sel of selectors.split(",")) {
        const s = sel.trim();
        if (!s || s === "*") continue;
        ruleMap[s] = { ...ruleMap[s], ...parseStyleProps(declarations) };
      }
    }
  }

  return ruleMap;
}

/**
 * Extract class names from an HTML tag's class attribute.
 */
function extractClasses(attrStr) {
  const match = attrStr.match(/class=["']([^"']*?)["']/i);
  if (!match) return [];
  return match[1].trim().split(/\s+/).filter(Boolean);
}

/**
 * Resolve all CSS properties for a given HTML element by merging:
 * 1. Tag-level CSS rules (e.g., `body { ... }`)
 * 2. Class-based CSS rules (e.g., `.slide { ... }`)
 * 3. Inline style attributes (highest priority)
 *
 * Does NOT handle specificity beyond this ordering, pseudo-classes,
 * combinators deeper than `.parent .child`, or !important.
 */
function resolveElementStyles(tag, ruleMap) {
  let props = {};
  const classes = extractClasses(tag.attrs);

  // 1. Tag-name rules
  if (ruleMap[tag.name]) {
    Object.assign(props, ruleMap[tag.name]);
  }

  // 2. Class rules — both `.classname` and parent selectors like `.slide .title`
  for (const cls of classes) {
    const directSel = `.${cls}`;
    if (ruleMap[directSel]) {
      Object.assign(props, ruleMap[directSel]);
    }
    // Also check compound selectors ending with this class
    for (const sel of Object.keys(ruleMap)) {
      if (sel !== directSel && sel.endsWith(` .${cls}`)) {
        Object.assign(props, ruleMap[sel]);
      }
    }
  }

  // 3. Inline styles (highest priority)
  const inlineStyle = extractInlineStyle(tag.attrs);
  if (inlineStyle) {
    Object.assign(props, parseStyleProps(inlineStyle));
  }

  return props;
}

function extractTextContent(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z]+;/g, " ");
}

function extractBodyContent(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch ? bodyMatch[1] : html;
}

function countTopLevelBodyChildren(html) {
  const bodyContent = extractBodyContent(html);
  // Count direct child elements (simplified: top-level tags in body)
  let depth = 0;
  let count = 0;
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\/?>/g;
  let m;

  while ((m = tagPattern.exec(bodyContent))) {
    const full = m[0];
    const tagName = m[1].toLowerCase();

    // Skip void elements
    const isVoid = /^(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)$/i.test(tagName);
    const isSelfClosing = full.endsWith("/>");

    if (full.startsWith("</")) {
      depth--;
    } else {
      if (depth === 0) count++;
      if (!isVoid && !isSelfClosing) depth++;
    }
  }

  return count;
}

// --- Validation rules ---

/**
 * Check if an element at a given position in HTML contains text content.
 * Finds the matching closing tag by tracking nesting depth, then checks
 * if any non-whitespace text exists between open and close tags.
 */
function elementHasText(html, tagStartIndex) {
  // Extract the tag name
  const nameMatch = html.slice(tagStartIndex).match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
  if (!nameMatch) return false;
  const tagName = nameMatch[1];

  // Find end of opening tag
  const openEnd = html.indexOf(">", tagStartIndex);
  if (openEnd === -1) return false;

  // Check for self-closing
  if (html[openEnd - 1] === "/") return false;

  // Find matching closing tag by tracking depth
  const rest = html.slice(openEnd + 1);
  const tagPattern = new RegExp(`<(/?)${tagName}\\b[^>]*>`, "gi");
  let depth = 1;
  let m;
  let closePos = -1;

  while ((m = tagPattern.exec(rest))) {
    if (m[1] === "/") {
      depth--;
      if (depth === 0) {
        closePos = m.index;
        break;
      }
    } else {
      depth++;
    }
  }

  if (closePos === -1) return false;

  // Get inner content and strip all tags
  const inner = rest.slice(0, closePos);
  const textOnly = inner.replace(/<[^>]*>/g, "").trim();
  return textOnly.length > 0;
}

function checkContrast(html) {
  const issues = [];
  const tags = extractTags(html);
  const ruleMap = parseStyleBlocks(html);
  // Determine the slide/body background color for inheritance.
  // The common pattern is `.slide { background: #xxx; color: #xxx; }`.
  const slideRule = ruleMap[".slide"] || ruleMap["body"] || {};
  const baseBg = parseColor(slideRule["background-color"] || slideRule["background"]);
  const baseColor = parseColor(slideRule["color"]);

  // Skip non-visual tags
  const skipTags = new Set([
    "html", "head", "meta", "style", "script", "link", "title", "svg",
    "polyline", "path", "circle", "rect", "line", "g", "defs",
  ]);

  for (const tag of tags) {
    if (skipTags.has(tag.name)) continue;

    // Only check elements that contain text content
    if (!elementHasText(html, tag.index)) continue;

    const props = resolveElementStyles(tag, ruleMap);
    const fgColor = parseColor(props["color"]) || baseColor;
    const bgColor = parseColor(props["background-color"] || props["background"]) || baseBg;

    if (fgColor && bgColor) {
      const ratio = contrastRatio(fgColor, bgColor);
      if (ratio < 4.5) {
        const label = extractClasses(tag.attrs)[0] || tag.name;
        issues.push({
          rule: "contrast",
          message: `Text on <${tag.name} class="${label}"> has contrast ratio ${ratio.toFixed(1)}:1 (min 4.5:1)`,
          severity: "error",
        });
      }
    }
  }

  return issues;
}

function checkViewportOverflow(html) {
  const issues = [];
  const tags = extractTags(html);
  const ruleMap = parseStyleBlocks(html);
  const { width: vw, height: vh } = parseViewportFromHtml(html);

  const skipTags = new Set([
    "html", "head", "meta", "style", "script", "link", "title",
  ]);

  for (const tag of tags) {
    if (skipTags.has(tag.name)) continue;

    const props = resolveElementStyles(tag, ruleMap);

    const parsePx = (val) => {
      if (!val) return null;
      const m = val.match(/^(\d+(?:\.\d+)?)\s*px$/);
      return m ? parseFloat(m[1]) : null;
    };

    const w = parsePx(props["width"]);
    const h = parsePx(props["height"]);
    const left = parsePx(props["left"]) || 0;
    const top = parsePx(props["top"]) || 0;
    const pl = parsePx(props["padding-left"]) || 0;
    const pr = parsePx(props["padding-right"]) || 0;
    const pt = parsePx(props["padding-top"]) || 0;
    const pb = parsePx(props["padding-bottom"]) || 0;
    const ml = parsePx(props["margin-left"]) || 0;
    const mr = parsePx(props["margin-right"]) || 0;
    const mt = parsePx(props["margin-top"]) || 0;
    const mb = parsePx(props["margin-bottom"]) || 0;

    if (w !== null) {
      const totalW = left + ml + w + pl + pr + mr;
      if (totalW > vw) {
        const label = extractClasses(tag.attrs)[0] || tag.name;
        issues.push({
          rule: "overflow",
          message: `<${tag.name} class="${label}"> horizontal extent ${totalW}px exceeds viewport width ${vw}px`,
          severity: "error",
        });
      }
    }

    if (h !== null) {
      const totalH = top + mt + h + pt + pb + mb;
      if (totalH > vh) {
        const label = extractClasses(tag.attrs)[0] || tag.name;
        issues.push({
          rule: "overflow",
          message: `<${tag.name} class="${label}"> vertical extent ${totalH}px exceeds viewport height ${vh}px`,
          severity: "error",
        });
      }
    }
  }

  return issues;
}

function checkElementCount(html) {
  const count = countTopLevelBodyChildren(html);
  if (count > 5) {
    return [
      {
        rule: "element-count",
        message: `Body has ${count} top-level children (recommended max: 5)`,
        severity: "warning",
      },
    ];
  }
  return [];
}

function checkFontDeclaration(html) {
  const tags = extractTags(html);
  const hasFontFamily =
    html.includes("font-family") ||
    tags.some((t) => {
      const style = extractInlineStyle(t.attrs);
      return style && style.includes("font-family");
    });

  // Also check <style> blocks
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const hasInStyleBlock = styleBlocks.some((b) => b.includes("font-family"));

  if (!hasFontFamily && !hasInStyleBlock) {
    return [
      {
        rule: "font",
        message: "No font-family declaration found; text will use browser defaults",
        severity: "warning",
      },
    ];
  }
  return [];
}

function checkEmoji(html) {
  const text = extractTextContent(html);
  // Emoji Unicode ranges
  const emojiPattern =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/u;

  if (emojiPattern.test(text)) {
    return [
      {
        rule: "emoji",
        message:
          "Emoji characters detected; rendering may be inconsistent across platforms",
        severity: "warning",
      },
    ];
  }
  return [];
}

function checkKoreanWordBreak(html) {
  const issues = [];
  const koreanPattern = /[가-힯ᄀ-ᇿ㄰-㆏ꥠ-꥿]/;

  const tags = extractTags(html);
  // Collect all style declarations including <style> blocks
  const allStyles = (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []).join(" ");
  const hasGlobalWordBreak = allStyles.includes("word-break") && allStyles.includes("keep-all");

  if (hasGlobalWordBreak) return [];

  // Check each tag with Korean text content
  const tagContentPattern =
    /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  let match;
  const checked = new Set();

  while ((match = tagContentPattern.exec(html))) {
    const tagName = match[1].toLowerCase();
    const attrs = match[2];
    const content = match[3].replace(/<[^>]+>/g, "");

    if (!koreanPattern.test(content)) continue;

    const key = `${tagName}-${match.index}`;
    if (checked.has(key)) continue;
    checked.add(key);

    const style = extractInlineStyle(attrs);
    const props = parseStyleProps(style);
    if (!props["word-break"] || props["word-break"] !== "keep-all") {
      issues.push({
        rule: "korean-word-break",
        message: `<${tagName}> contains Korean text but lacks word-break: keep-all`,
        severity: "warning",
      });
      // One warning per file is enough
      break;
    }
  }

  return issues;
}

function parseViewportFromHtml(html) {
  const widthMatch = html.match(/data-width=["']?(\d+)/);
  const heightMatch = html.match(/data-height=["']?(\d+)/);
  return {
    width: widthMatch ? parseInt(widthMatch[1], 10) : 1080,
    height: heightMatch ? parseInt(heightMatch[1], 10) : 1080,
  };
}

// --- Font-weight diversity ---

function checkFontWeightDiversity(html) {
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const combined = styleBlocks.join(" ");
  const weights = new Set();
  const weightPattern = /font-weight\s*:\s*([0-9]{3}|bold|normal|lighter|bolder)/gi;
  let m;
  while ((m = weightPattern.exec(combined))) {
    const v = m[1].toLowerCase();
    if (v === "bold") weights.add("700");
    else if (v === "normal") weights.add("400");
    else if (v === "lighter") weights.add("300");
    else if (v === "bolder") weights.add("800");
    else weights.add(v);
  }

  if (weights.size === 0) return [];
  const set = [...weights].sort();
  const onlyBasic =
    (set.length === 1 && (set[0] === "400" || set[0] === "700")) ||
    (set.length === 2 && set[0] === "400" && set[1] === "700");
  if (onlyBasic) {
    return [
      {
        rule: "font-weight-diversity",
        message: `Only basic font weights used (${set.join(", ")}) — AI slop signal. Mix in 300/500/600/800 for hierarchy.`,
        severity: "warning",
      },
    ];
  }
  return [];
}

// --- AI-slop font detection ---

function checkAiSlopFonts(html) {
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const combined = styleBlocks.join(" ");
  const familyPattern = /font-family\s*:\s*([^;}]+)[;}]/gi;
  const slopFonts = ["inter", "roboto", "arial", "helvetica"];
  const flagged = new Set();
  let m;
  while ((m = familyPattern.exec(combined))) {
    const stack = m[1].trim();
    const primary = stack.split(",")[0].trim().replace(/^["']|["']$/g, "").toLowerCase();
    if (slopFonts.includes(primary)) {
      flagged.add(primary);
    }
  }
  if (flagged.size === 0) return [];
  return [
    {
      rule: "ai-slop-font",
      message: `AI-slop font(s) used as primary family: ${[...flagged].join(", ")}. Prefer Pretendard, SUIT, Wanted Sans, Noto Sans KR.`,
      severity: "warning",
    },
  ];
}

// --- Per-slide color count ---

function extractColorsFromStyles(html) {
  const styleBlocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const combined = styleBlocks.join(" ");
  const colors = new Set();

  const hexPattern = /#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;
  let m;
  while ((m = hexPattern.exec(combined))) {
    const parsed = parseHexColor("#" + m[1]);
    if (parsed) colors.add(parsed.join(","));
  }

  const rgbPattern =
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+\s*)?\)/gi;
  while ((m = rgbPattern.exec(combined))) {
    colors.add(`${m[1]},${m[2]},${m[3]}`);
  }
  return colors;
}

function checkColorCount(html) {
  const colors = extractColorsFromStyles(html);
  if (colors.size > 3) {
    return [
      {
        rule: "color-count",
        message: `${colors.size} distinct colors used (max 3 per slide). Reduce to background + foreground + accent.`,
        severity: "warning",
      },
    ];
  }
  return [];
}

// --- Series-level consistency (multi-file) ---

function summarizeSlideForSeries(html) {
  const tags = extractTags(html);
  const ruleMap = parseStyleBlocks(html);

  const hasPageNumber = tags.some((t) =>
    extractClasses(t.attrs).includes("page-number")
  );

  const brandMarkRule = ruleMap[".brand-mark"] || null;
  const brandMarkSignature = brandMarkRule
    ? [
        brandMarkRule["top"] || "",
        brandMarkRule["bottom"] || "",
        brandMarkRule["left"] || "",
        brandMarkRule["right"] || "",
      ].join("|")
    : null;

  // Primary body font-family
  const bodyRule = ruleMap["body"] || ruleMap[".slide"] || {};
  const bodyFont = (bodyRule["font-family"] || "").trim();

  return { hasPageNumber, brandMarkSignature, bodyFont };
}

function checkSeriesConsistency(files, htmls) {
  const issues = [];
  const summaries = htmls.map(summarizeSlideForSeries);

  const pageNumStates = summaries.map((s) => s.hasPageNumber);
  const allHave = pageNumStates.every(Boolean);
  const noneHave = pageNumStates.every((v) => !v);
  if (!allHave && !noneHave) {
    const withCount = pageNumStates.filter(Boolean).length;
    issues.push({
      rule: "series-page-number",
      message: `Inconsistent page-number usage: ${withCount}/${files.length} slides have it. Use on all body slides or none.`,
      severity: "warning",
    });
  }

  const brandSigs = summaries
    .map((s) => s.brandMarkSignature)
    .filter((v) => v !== null);
  const uniqueBrandSigs = new Set(brandSigs);
  if (uniqueBrandSigs.size > 1) {
    issues.push({
      rule: "series-brand-mark",
      message: `.brand-mark positioned differently across slides (${uniqueBrandSigs.size} variants). Copy the recurring-elements block verbatim.`,
      severity: "warning",
    });
  }

  const bodyFonts = summaries.map((s) => s.bodyFont).filter(Boolean);
  const uniqueFonts = new Set(bodyFonts);
  if (uniqueFonts.size > 1) {
    issues.push({
      rule: "series-font-family",
      message: `Body font-family differs across slides (${uniqueFonts.size} variants). Series must share one font stack.`,
      severity: "warning",
    });
  }

  return issues;
}

// --- Main ---

async function validateFile(filePath) {
  const html = await readFile(filePath, "utf-8");

  const issues = [
    ...checkContrast(html),
    ...checkViewportOverflow(html),
    ...checkElementCount(html),
    ...checkFontDeclaration(html),
    ...checkEmoji(html),
    ...checkKoreanWordBreak(html),
    ...checkFontWeightDiversity(html),
    ...checkAiSlopFonts(html),
    ...checkColorCount(html),
  ];

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  return {
    file: filePath,
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node validate.js <html-file-or-directory>");
    process.exit(1);
  }

  let files;
  let isDir = false;
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      isDir = true;
      const entries = await readdir(target);
      files = entries
        .filter((f) => extname(f).toLowerCase() === ".html")
        .sort()
        .map((f) => join(target, f));
    } else {
      files = [target];
    }
  } catch {
    console.error(`Cannot access: ${target}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error("No HTML files found");
    process.exit(1);
  }

  const results = [];
  let hasErrors = false;
  const htmlBuffers = [];

  for (const file of files) {
    try {
      const result = await validateFile(file);
      results.push(result);
      if (!result.valid) hasErrors = true;
      htmlBuffers.push(await readFile(file, "utf-8"));
    } catch (err) {
      results.push({
        file,
        valid: false,
        warnings: [],
        errors: [{ rule: "parse", message: err.message, severity: "error" }],
      });
      htmlBuffers.push("");
      hasErrors = true;
    }
  }

  // Series-level consistency only runs for directories with 2+ slides.
  let seriesIssues = [];
  if (isDir && files.length >= 2) {
    seriesIssues = checkSeriesConsistency(files, htmlBuffers);
  }

  const output = {
    files: results,
    series: seriesIssues,
  };
  console.log(JSON.stringify(output, null, 2));
  if (hasErrors) process.exit(1);
}

main();
