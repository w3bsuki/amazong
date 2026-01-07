import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const targetDirs = process.argv.slice(2);
const dirs = targetDirs.length ? targetDirs : ["app", "components"]; // workspace-relative

const includeExt = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".mjs"]);

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
const gradientIgnoreBases = [/^slide-(?:in|out)-(?:from|to)-/];

function stripVariants(token) {
  // Tailwind class tokens can be prefixed by variants (md:hover:from-*).
  const parts = token.split(":");
  return parts[parts.length - 1] ?? token;
}

function cleanToken(raw) {
  // Remove leading/trailing punctuation so we can match class tokens inside JSX strings.
  return raw.replace(/^[^A-Za-z0-9]+/, "").replace(/[^A-Za-z0-9\[\]\-/:().%]+$/, "");
}

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
    const tokens = line
      .split(/\s+/)
      .map(cleanToken)
      .filter(Boolean)
      .map(stripVariants);

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
      // Skip typical output dirs when they appear under app/components.
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
let totals = { palette: 0, fill: 0, gradient: 0, files: 0 };

for (const abs of allFiles) {
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }

  const palette = countMatches(text, rePalette);
  const fill = countMatches(text, reFillPalette);
  const gradient = countGradientClusters(text);
  const total = palette + fill + gradient;

  if (total === 0) continue;

  totals.palette += palette;
  totals.fill += fill;
  totals.gradient += gradient;
  totals.files += 1;

  byFile.push({
    file: path.relative(projectRoot, abs).replaceAll("\\", "/"),
    total,
    palette,
    fill,
    gradient,
  });
}

byFile.sort((a, b) => b.total - a.total);

const topN = 8;
const authCandidates = byFile.filter((r) => /\/(auth|login|signup|sign-up|register|forgot|reset|password)\b/i.test(r.file));

const reportLines = [];
reportLines.push("Top offenders (rough match counts)");
reportLines.push("--------------------------------");
for (const row of byFile.slice(0, 50)) {
  reportLines.push(`${row.file}  ~${row.total} (palette:${row.palette}, gradient:${row.gradient}, fill:${row.fill})`);
}
reportLines.push("--------------------------------");
reportLines.push(`Totals: files=${totals.files} palette=${totals.palette} gradient=${totals.gradient} fill=${totals.fill}`);
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
try {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, reportLines.join("\n"), "utf8");
} catch {
  // Best-effort reporting.
}

console.log("Top offenders (rough match counts)");
console.log("--------------------------------");
for (const row of byFile.slice(0, topN)) {
  console.log(`${row.file}  ~${row.total}`);
}
console.log("--------------------------------");
console.log(`Totals: files=${totals.files} palette=${totals.palette} gradient=${totals.gradient} fill=${totals.fill}`);
console.log(`Full report: ${path.relative(projectRoot, reportPath).replaceAll("\\", "/")}`);
console.log(`Auth candidates found: ${authCandidates.length}`);
