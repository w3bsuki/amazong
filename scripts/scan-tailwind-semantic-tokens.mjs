import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const targetDirs = process.argv.slice(2);
const dirs = targetDirs.length ? targetDirs : ["app", "components"]; // workspace-relative

const includeExt = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".mjs"]);

const globalsPath = path.resolve(projectRoot, "app/globals.css");
const globalsCss = fs.existsSync(globalsPath)
  ? fs.readFileSync(globalsPath, "utf8")
  : "";

// Extract `--color-*` tokens from globals.css (Tailwind v4 theme bridge + @theme blocks).
const definedTokens = new Set();
const reColorVar = /--color-([a-z0-9-]+)\s*:/gi;
for (let m; (m = reColorVar.exec(globalsCss)); ) {
  definedTokens.add(m[1]);
}

// We only flag *semantic color* tokens we own (avoids false positives for
// Tailwind `text-sm`, `bg-cover`, etc.).
const semanticPrefixes = [
  "admin",
  "badge",
  "brand",
  "cart",
  "category",
  "condition",
  "cta",
  "deal",
  "gallery",
  "header",
  "live",
  "notification",
  "order",
  "overlay",
  "price",
  "rating",
  "search",
  "seller",
  "social",
  "status",
  "surface",
  "urgency",
  "verify",
  "wishlist",
];

const reSemanticPrefix = new RegExp(`^(?:${semanticPrefixes.join("|")})-`, "i");
const reColorUtility =
  /^(?:bg|text|border|ring|fill|stroke)-([a-z0-9-]+)(?:\/\d{1,3})?$/i;

function stripComments(text, ext) {
  if (ext === ".css") {
    return text.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  return text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function stripVariants(token) {
  const parts = token.split(":");
  return parts[parts.length - 1] ?? token;
}

function cleanToken(raw) {
  return raw
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
      if (ent.name === ".next" || ent.name === "node_modules" || ent.name === "dist")
        continue;
      walkFiles(abs, out);
      continue;
    }
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name);
    if (!includeExt.has(ext)) continue;
    out.push(abs);
  }
}

const allFiles = [];
for (const d of dirs) {
  const abs = path.resolve(projectRoot, d);
  if (!isDirectory(abs)) continue;
  walkFiles(abs, allFiles);
}

const byFile = [];
let totals = { files: 0, missing: 0 };

for (const abs of allFiles) {
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }

  const ext = path.extname(abs).toLowerCase();
  const scanText = stripComments(text, ext);

  const missingTokens = new Set();
  const lines = scanText.split(/\r?\n/);
  for (const line of lines) {
    const tokens = line
      .split(/\s+/)
      .map(cleanToken)
      .filter(Boolean)
      .map(stripVariants);

    for (const token of tokens) {
      const m = token.match(reColorUtility);
      if (!m) continue;

      const name = m[1] ?? "";
      if (!name.includes("-")) continue;
      if (!reSemanticPrefix.test(name)) continue;
      if (definedTokens.has(name)) continue;

      missingTokens.add(name);
    }
  }

  if (missingTokens.size === 0) continue;

  totals.files += 1;
  totals.missing += missingTokens.size;
  byFile.push({
    file: path.relative(projectRoot, abs).replaceAll("\\", "/"),
    total: missingTokens.size,
    tokens: [...missingTokens].sort(),
  });
}

byFile.sort((a, b) => b.total - a.total);

const reportLines = [];
reportLines.push("Top offenders (unique missing semantic tokens)");
reportLines.push("--------------------------------");
for (const row of byFile.slice(0, 50)) {
  reportLines.push(`${row.file}  ~${row.total}`);
  reportLines.push(`  ${row.tokens.slice(0, 12).join(", ")}${row.tokens.length > 12 ? ", …" : ""}`);
}
reportLines.push("--------------------------------");
reportLines.push(`Totals: files=${totals.files} missing=${totals.missing}`);

fs.mkdirSync(path.resolve(projectRoot, "cleanup"), { recursive: true });
const reportPath = path.resolve(projectRoot, "cleanup/semantic-token-scan-report.txt");
fs.writeFileSync(reportPath, reportLines.join("\n") + "\n", "utf8");

console.log(reportLines.slice(0, 2).join("\n"));
for (const row of byFile.slice(0, 8)) {
  console.log(`${row.file}  ~${row.total}`);
}
console.log("--------------------------------");
console.log(`Totals: files=${totals.files} missing=${totals.missing}`);
console.log(`Full report: ${path.relative(projectRoot, reportPath).replaceAll("\\", "/")}`);

if (String(process.env.FAIL_ON_FINDINGS || "") === "1" && totals.files > 0) {
  process.exit(1);
}

