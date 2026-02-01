import fs from "node:fs";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function usage() {
  process.stderr.write("Usage: node .codex/skills/treido-orchestrator/scripts/lint-audit.mjs <path-to-audit.md>\n");
}

function extractAuditSections(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const sections = [];

  let current = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) {
      if (current) current.lines.push(line);
      continue;
    }

    if (current) sections.push(current);
    current = { name: match[1], startLine: i + 1, lines: [] };
  }

  if (current) sections.push(current);
  return sections;
}

function lintSection(section) {
  const body = section.lines.join("\n");
  const required = ["### Scope", "### Findings", "### Acceptance Checks", "### Risks"];
  const missing = required.filter((h) => !body.includes(h));
  if (missing.length) {
    fail(`Section '${section.name}' missing: ${missing.join(", ")} (starts at line ${section.startLine})`);
  }
}

function lintIds(markdown) {
  const idMatches = [...markdown.matchAll(/\|\s*([A-Z0-9]+-\d{3})\s*\|/g)].map((m) => m[1]);
  const seen = new Set();
  const dup = new Set();
  for (const id of idMatches) {
    if (seen.has(id)) dup.add(id);
    seen.add(id);
  }

  const bad = [...new Set(idMatches.filter((id) => !/^[A-Z0-9]+-\d{3}$/.test(id)))];
  if (dup.size) fail(`Duplicate IDs: ${[...dup].join(", ")}`);
  if (bad.length) fail(`Bad IDs: ${bad.join(", ")}`);
}

function lintFindingsFileLine(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("|")) continue;
    if (/^\|\s*ID\s*\|/i.test(line)) continue;
    if (/^\|\s*-{2,}\s*\|/.test(line)) continue;

    const cols = line.split("|");
    const fileLineCol = (cols[3] || "").trim();
    if (!fileLineCol || !/:\d+/.test(fileLineCol)) fail(`Findings row missing File:Line at ${i + 1}`);
  }
}

function main() {
  const input = process.argv[2];
  if (!input) {
    usage();
    process.exitCode = 2;
    return;
  }

  if (!fs.existsSync(input)) {
    fail(`File not found: ${input}`);
    return;
  }

  const markdown = fs.readFileSync(input, "utf8");
  const sections = extractAuditSections(markdown);
  if (sections.length === 0) {
    fail("No `## <AUDITOR>` sections found.");
    return;
  }

  for (const s of sections) lintSection(s);
  lintIds(markdown);
  lintFindingsFileLine(markdown);

  if (!process.exitCode) process.stdout.write("OK\n");
}

main();
