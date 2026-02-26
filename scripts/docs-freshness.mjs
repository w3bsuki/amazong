import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, "docs", "_meta", "doc-owners.json");
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateUtc(dateText) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  return Date.UTC(year, month, day);
}

function extractDate(text, dateSource) {
  if (dateSource === "frontmatter.updated_at") {
    const match = /^updated_at:\s*"?(\d{4}-\d{2}-\d{2})"?/m.exec(text);
    return match?.[1] ?? null;
  }

  if (dateSource === "last-updated") {
    const match = /Last updated:\s*(\d{4}-\d{2}-\d{2})/i.exec(text);
    return match?.[1] ?? null;
  }

  if (dateSource === "last-verified") {
    const match = /Last verified:\s*(\d{4}-\d{2}-\d{2})/i.exec(text);
    return match?.[1] ?? null;
  }

  const fallback = /(?:Last updated|Last verified):\s*(\d{4}-\d{2}-\d{2})/i.exec(text);
  return fallback?.[1] ?? null;
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`[docs:freshness] Missing config: ${path.relative(ROOT, CONFIG_PATH)}`);
    process.exit(1);
  }
  const json = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return json.documents ?? [];
}

function main() {
  const docs = loadConfig();
  const issues = [];

  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  for (const doc of docs) {
    const relPath = doc.path;
    const absPath = path.join(ROOT, relPath);
    if (!fs.existsSync(absPath)) {
      issues.push(`[missing-file] ${relPath}`);
      continue;
    }

    const text = fs.readFileSync(absPath, "utf8");
    const dateText = extractDate(text, doc.dateSource);
    if (!dateText) {
      issues.push(`[missing-date] ${relPath} (${doc.dateSource})`);
      continue;
    }

    const docUtc = toDateUtc(dateText);
    if (docUtc == null) {
      issues.push(`[invalid-date] ${relPath} -> ${dateText}`);
      continue;
    }

    const ageDays = Math.floor((todayUtc - docUtc) / MS_PER_DAY);
    if (ageDays > Number(doc.maxAgeDays ?? 0)) {
      issues.push(
        `[stale-doc] ${relPath} age=${ageDays}d max=${doc.maxAgeDays}d owner=${doc.owner}`,
      );
    }
  }

  if (issues.length > 0) {
    console.error(`[docs:freshness] ${issues.length} issue(s) found.`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(`[docs:freshness] OK: ${docs.length} tracked docs are within SLA.`);
}

main();

