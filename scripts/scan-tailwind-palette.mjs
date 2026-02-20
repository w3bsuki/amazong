import fs from "node:fs";
import path from "node:path";

import { collectFilesInDirs, DEFAULT_INCLUDE_EXTENSIONS } from "./lib/file-walker.mjs";
import { countMatches, extractTokensFromLine, stripComments, writeReport } from "./lib/tailwind-scan-utils.mjs";

const projectRoot = process.cwd();
const targetDirs = process.argv.slice(2);
const dirs = targetDirs.length ? targetDirs : ["app", "components"]; // workspace-relative
const shouldWriteReport = String(process.env.WRITE_CLEANUP_REPORTS || "") === "1";

const includeExt = DEFAULT_INCLUDE_EXTENSIONS;

const paletteFamilies = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
  "rose",
];

const paletteAlt = paletteFamilies.join("|");

// Examples we want to catch:
// - bg-gray-100, text-slate-900, border-blue-200, shadow-green-500/20
// - fill-orange-400
// - from-*/to-*/via-* (any value, not just palette)
const rePalette = new RegExp(`\\b(?:${paletteAlt})-\\d{2,3}(?:\\/\\d{1,3})?\\b`, "gi");
const reFillPalette = new RegExp(`\\bfill-(?:${paletteAlt})-\\d{2,3}(?:\\/\\d{1,3})?\\b`, "gi");
const reMono = /\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)(?:\/\d{1,3})?\b/gi;
const gradientIgnoreBases = [/^slide-(?:in|out)-(?:from|to)-/];
const reRawGradient = /\b(?:repeating-)?(?:linear|radial|conic)-gradient\(/gi;

function isGradientIndicator(base) {
  return base.startsWith("bg-gradient-to-") || base === "bg-gradient";
}

function isGradientStop(base) {
  if (gradientIgnoreBases.some((re) => re.test(base))) return false;
  return base.startsWith("from-") || base.startsWith("to-") || base.startsWith("via-");
}

function countGradientClusters(text) {
  let count = 0;
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const tokens = extractTokensFromLine(line);

    if (!tokens.length) continue;

    const stops = tokens.filter(isGradientStop);
    if (!stops.length) continue;

    const hasGradientIndicator = tokens.some(isGradientIndicator);
    const hasFrom = stops.some((t) => t.startsWith("from-"));
    const hasTo = stops.some((t) => t.startsWith("to-"));
    const hasVia = stops.some((t) => t.startsWith("via-"));

    const hasCluster =
      (hasGradientIndicator && (hasFrom || hasTo || hasVia)) ||
      (hasFrom && (hasTo || hasVia)) ||
      (hasVia && hasTo);

    if (!hasCluster) continue;

    count += stops.length + (hasGradientIndicator ? 1 : 0);
  }

  return count;
}

const allFiles = collectFilesInDirs({ projectRoot, dirs, includeExt });

const byFile = [];
let totals = { palette: 0, fill: 0, gradient: 0, files: 0 };

for (const abs of allFiles) {
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }

  const ext = path.extname(abs).toLowerCase();
  const scanText = stripComments(text, ext);

  const palette = countMatches(scanText, rePalette);
  const fill = countMatches(scanText, reFillPalette);
  const mono = countMatches(scanText, reMono);
  const gradient = countGradientClusters(scanText);
  const rawGradient = countMatches(scanText, reRawGradient);
  const total = palette + fill + mono + gradient + rawGradient;

  if (total === 0) continue;

  totals.palette += palette;
  totals.fill += fill;
  totals.mono = (totals.mono ?? 0) + mono;
  totals.gradient += gradient;
  totals.rawGradient = (totals.rawGradient ?? 0) + rawGradient;
  totals.files += 1;

  byFile.push({
    file: path.relative(projectRoot, abs).replaceAll("\\", "/"),
    total,
    palette,
    fill,
    mono,
    gradient,
    rawGradient,
  });
}

byFile.sort((a, b) => b.total - a.total);

const topN = 8;
const authCandidates = byFile.filter((r) => /\/(auth|login|signup|sign-up|register|forgot|reset|password)\b/i.test(r.file));

const reportLines = [];
reportLines.push("Top offenders (rough match counts)");
reportLines.push("--------------------------------");
for (const row of byFile.slice(0, 50)) {
  reportLines.push(
    `${row.file}  ~${row.total} (palette:${row.palette}, mono:${row.mono}, gradient:${row.gradient}, rawGradient:${row.rawGradient}, fill:${row.fill})`
  );
}
reportLines.push("--------------------------------");
reportLines.push(
  `Totals: files=${totals.files} palette=${totals.palette} mono=${totals.mono ?? 0} gradient=${totals.gradient} rawGradient=${totals.rawGradient ?? 0} fill=${totals.fill}`
);
reportLines.push("");
reportLines.push("Auth flow candidates");
reportLines.push("--------------------");
if (authCandidates.length) {
  for (const row of authCandidates.slice(0, 30)) {
    reportLines.push(`${row.file}  ~${row.total} (palette:${row.palette}, gradient:${row.gradient}, fill:${row.fill})`);
  }
} else {
  reportLines.push("(none matched by path heuristic)");
}

const reportPath = path.resolve(projectRoot, "cleanup/palette-scan-report.txt");
if (shouldWriteReport) {
  writeReport(reportPath, reportLines);
}

console.log("Top offenders (rough match counts)");
console.log("--------------------------------");
for (const row of byFile.slice(0, topN)) {
  console.log(`${row.file}  ~${row.total}`);
}
console.log("--------------------------------");
console.log(
  `Totals: files=${totals.files} palette=${totals.palette} mono=${totals.mono ?? 0} gradient=${totals.gradient} rawGradient=${totals.rawGradient ?? 0} fill=${totals.fill}`
);
if (shouldWriteReport) {
  console.log(`Full report: ${path.relative(projectRoot, reportPath).replaceAll("\\", "/")}`);
}
console.log(`Auth candidates found: ${authCandidates.length}`);

if (process.env.FAIL_ON_FINDINGS === "1") {
  const rawGradientTotal = totals.rawGradient ?? 0;
  const monoTotal = totals.mono ?? 0;
  if (totals.palette > 0 || totals.fill > 0 || monoTotal > 0 || totals.gradient > 0 || rawGradientTotal > 0) {
    process.exitCode = 1;
  }
}
