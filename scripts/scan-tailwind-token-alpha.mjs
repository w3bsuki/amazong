import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const targetDirs = process.argv.slice(2);
const dirs = targetDirs.length ? targetDirs : ["app", "components"]; // workspace-relative
const shouldWriteReport = String(process.env.WRITE_CLEANUP_REPORTS || "") === "1";

const includeExt = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".mjs"]);

function stripComments(text, ext) {
  if (ext === ".css") {
    return text.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function stripVariants(token) {
  // Tailwind class tokens can be prefixed by variants (md:hover:bg-primary/10).
  const parts = token.split(":");
  return parts[parts.length - 1] ?? token;
}

function cleanToken(raw) {
  // Remove leading/trailing punctuation so we can match class tokens inside JSX strings.
  // Also strip common JSX attribute prefixes so we catch patterns like:
  // className="bg-destructive/10 ..."
  const withoutAttr = raw.replace(/^(?:className|class)=/i, "");
  const withoutQuotes = withoutAttr.replace(/^[{\"'`]+/, "");
  return withoutQuotes
    .replace(/^[^A-Za-z0-9]+/, "")
    .replace(/[^A-Za-z0-9\[\]\-/:().%]+$/, "");
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

const bannedPatterns = [
  // Token alpha hacks we explicitly ban (design rails).
  /^border-border\/\d{1,3}$/i,
  /^(?:bg|text|ring)-primary\/\d{1,3}$/i,
  /^(?:bg|text|ring)-destructive\/\d{1,3}$/i,
  /^ring-ring\/\d{1,3}$/i,
  /^(?:bg|text|ring|border)-[a-z0-9-]+-foreground\/\d{1,3}$/i,
  /^(?:bg|text|ring|border)-[a-z0-9-]+-subtle\/\d{1,3}$/i,
  /^(?:bg|text|ring|border)-(?:promoted|promoted-muted|verified|verified-business|verified-personal|top-rated|category-[a-z0-9-]+|deal|deal-light|deal-foreground|surface-[a-z0-9-]+)\/\d{1,3}$/i,
];

const allFiles = [];
for (const d of dirs) {
  const abs = path.resolve(projectRoot, d);
  if (!isDirectory(abs)) continue;
  walkFiles(abs, allFiles);
}

const byFile = [];
let totals = { files: 0, matches: 0 };

for (const abs of allFiles) {
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }

  const ext = path.extname(abs).toLowerCase();
  const scanText = stripComments(text, ext);

  const offenders = new Set();
  const lines = scanText.split(/\r?\n/);
  for (const line of lines) {
    const tokens = line
      .split(/\s+/)
      .map(cleanToken)
      .filter(Boolean)
      .map(stripVariants);

    for (const token of tokens) {
      if (!token.includes("/")) continue;
      if (bannedPatterns.some((re) => re.test(token))) offenders.add(token);
    }
  }

  if (offenders.size === 0) continue;

  totals.files += 1;
  totals.matches += offenders.size;
  byFile.push({
    file: path.relative(projectRoot, abs).replaceAll("\\", "/"),
    total: offenders.size,
    tokens: [...offenders].sort(),
  });
}

byFile.sort((a, b) => b.total - a.total);

const reportLines = [];
reportLines.push("Top offenders (unique banned token alpha usage)");
reportLines.push("--------------------------------");
for (const row of byFile.slice(0, 50)) {
  reportLines.push(`${row.file}  ~${row.total}`);
  reportLines.push(`  ${row.tokens.slice(0, 12).join(", ")}${row.tokens.length > 12 ? ", …" : ""}`);
}
reportLines.push("--------------------------------");
reportLines.push(`Totals: files=${totals.files} matches=${totals.matches}`);

const reportPath = path.resolve(projectRoot, "cleanup/token-alpha-scan-report.txt");
if (shouldWriteReport) {
  fs.mkdirSync(path.resolve(projectRoot, "cleanup"), { recursive: true });
  fs.writeFileSync(reportPath, reportLines.join("\n") + "\n", "utf8");
}

console.log(reportLines.slice(0, 2).join("\n"));
for (const row of byFile.slice(0, 8)) {
  console.log(`${row.file}  ~${row.total}`);
}
console.log("--------------------------------");
console.log(`Totals: files=${totals.files} matches=${totals.matches}`);
if (shouldWriteReport) {
  console.log(`Full report: ${path.relative(projectRoot, reportPath).replaceAll("\\", "/")}`);
}

if (String(process.env.FAIL_ON_FINDINGS || "") === "1" && totals.files > 0) {
  process.exit(1);
}
