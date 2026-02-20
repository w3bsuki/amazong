import fs from "node:fs";
import path from "node:path";

import { collectFilesInDirs, DEFAULT_INCLUDE_EXTENSIONS } from "./lib/file-walker.mjs";
import { extractTokensFromLine, stripComments, writeReport } from "./lib/tailwind-scan-utils.mjs";

const projectRoot = process.cwd();
const targetDirs = process.argv.slice(2);
const dirs = targetDirs.length ? targetDirs : ["app", "components"]; // workspace-relative
const shouldWriteReport = String(process.env.WRITE_CLEANUP_REPORTS || "") === "1";

const includeExt = DEFAULT_INCLUDE_EXTENSIONS;

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

const allFiles = collectFilesInDirs({ projectRoot, dirs, includeExt });

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
    const tokens = extractTokensFromLine(line, { stripJsxAttributePrefix: true });

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
  writeReport(reportPath, reportLines);
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
