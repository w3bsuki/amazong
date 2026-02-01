import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const targetDirs = process.argv.slice(2);
const dirs = targetDirs.length ? targetDirs : ["app", "components"]; // workspace-relative

const includeExt = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".mjs"]);

// Token source-of-truth. Intentionally contains many oklch() declarations.
// Also allow hex colors in the dedicated product swatches file (see .codex/project/DESIGN.md).
const excludeFiles = new Set([
  "app/globals.css",
  "components/shared/filters/color-swatches.tsx",
]);

// Focus on the most common styling-debt forms:
// - Tailwind arbitrary values: w-[560px], text-[13px], max-w-[900px], rounded-[10px]
// - Color literals: #fff, #ffffff, oklch(...)
// We deliberately do NOT attempt to fully parse Tailwind className strings.
const reArbitrary = /\b(?:h|w|min-h|min-w|max-h|max-w|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|space-x|space-y|rounded|text|leading|tracking|top|right|bottom|left|inset|translate-x|translate-y|shadow|z)-\[[^\]]+\]/g;
const reHex = /#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g;
const reOklch = /\boklch\([^)]*\)/gi;

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function walkFiles(dirAbs, out) {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === ".next" || ent.name === "node_modules" || ent.name === "dist") continue;
      walkFiles(abs, out);
      continue;
    }
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name);
    if (!includeExt.has(ext)) continue;
    out.push(abs);
  }
}

function countMatches(text, regex) {
  let count = 0;
  regex.lastIndex = 0;
  while (regex.exec(text)) count++;
  return count;
}

const allFiles = [];
for (const d of dirs) {
  const abs = path.resolve(projectRoot, d);
  if (!isDirectory(abs)) continue;
  walkFiles(abs, allFiles);
}

const byFile = [];
let totals = { arbitrary: 0, hex: 0, oklch: 0, files: 0 };

for (const abs of allFiles) {
  const rel = path.relative(projectRoot, abs).split(path.sep).join("/")
  if (excludeFiles.has(rel)) continue;

  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }

  const ext = path.extname(abs).toLowerCase();
  const arbitrary = countMatches(text, reArbitrary);
  const hex = countMatches(text, reHex);
  const oklch = ext === ".css" ? 0 : countMatches(text, reOklch);
  const total = arbitrary + hex + oklch;

  if (total === 0) continue;

  totals.arbitrary += arbitrary;
  totals.hex += hex;
  totals.oklch += oklch;
  totals.files += 1;

  byFile.push({
    file: rel,
    total,
    arbitrary,
    hex,
    oklch,
  });
}

byFile.sort((a, b) => b.total - a.total);

const reportLines = [];
reportLines.push("Top offenders (rough match counts)");
reportLines.push("--------------------------------");
for (const row of byFile.slice(0, 50)) {
  reportLines.push(`${row.file}  ~${row.total} (arbitrary:${row.arbitrary}, hex:${row.hex}, oklch:${row.oklch})`);
}
reportLines.push("--------------------------------");
reportLines.push(
  `Totals: files=${totals.files} arbitrary=${totals.arbitrary} hex=${totals.hex} oklch=${totals.oklch}`
);

const reportPath = path.resolve(projectRoot, "cleanup/arbitrary-scan-report.txt");
try {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf8");
} catch {
  // Best-effort reporting.
}

console.log("Top offenders (rough match counts)");
console.log("--------------------------------");
for (const row of byFile.slice(0, 8)) {
  console.log(`${row.file}  ~${row.total}`);
}
console.log("--------------------------------");
console.log(
  `Totals: files=${totals.files} arbitrary=${totals.arbitrary} hex=${totals.hex} oklch=${totals.oklch}`
);
console.log(`Full report: ${path.relative(projectRoot, reportPath).split(path.sep).join("/")}`);

if (process.env.FAIL_ON_FINDINGS === "1") {
  if (totals.arbitrary > 0 || totals.hex > 0 || totals.oklch > 0) {
    process.exitCode = 1;
  }
}
