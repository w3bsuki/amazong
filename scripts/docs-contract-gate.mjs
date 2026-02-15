import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const activeDocsRoot = detectActiveDocsRoot();

const requiredRootFiles = ["AGENTS.md", "ARCHITECTURE.md", "REQUIREMENTS.md", "TASKS.md"];

const requiredActiveDocsFiles = ["GUIDE.md", "DESIGN.md", "DOMAINS.md", "QUALITY.md", "DECISIONS.md"];

const requiredHeadingsByFile = new Map([
  [
    "AGENTS.md",
    [
      "## Product",
      "## Context Loading",
      "## Execution Rules",
      "## High-Risk Pause",
      "## Output Contract",
    ],
  ],
  [
    "GUIDE.md",
    [
      "## Task Loop",
      "## Risk Lanes",
      "## High-Risk Pause",
      "## Verification Matrix",
      "## Report Format",
      "## Golden Principles",
      "## How Principles Evolve",
    ],
  ],
  [
    "DESIGN.md",
    [
      "## Runtime Truth Paths",
      "## Token Contract",
      "## Component Boundaries",
      "## Server vs Client Defaults",
      "## Data Fetching + Caching",
      "## Design Thinking",
      "## Anti-Slop Rules",
      "## Mobile UX Quality Bar",
      "## Ship Criteria",
      "## Accessibility Baseline",
      "## Layout + Motion Tokens",
      "## Verification",
    ],
  ],
  [
    "DOMAINS.md",
    [
      "## Runtime Truth Paths",
      "## Auth",
      "## Database",
      "## Payments",
      "## API",
      "## Routes",
      "## i18n",
      "## Verification",
    ],
  ],
  [
    "QUALITY.md",
    [
      "## Grading Key",
      "## Domain Grades",
      "## Codebase-Wide Metrics",
    ],
  ],
  [
    "DECISIONS.md",
    [
      "## Format",
      "## Decisions",
      "## How To Add A Decision",
    ],
  ],
]);

const stalePointerPatterns = [
  /(?<!-)\bdocs\/HARNESS\.md\b/i,
  /(?<!-)\bdocs\/PROMPTS\.md\b/i,
  /(?<!-)\bdocs\/PRD\.md\b/i,
  /(?<!-)\bdocs\/PLANS\.md\b/i,
  /(?<!-)\bdocs\/PRODUCT_SENSE\.md\b/i,
  /(?<!-)\bdocs\/INDEX\.md\b/i,
  /(?<!-)\bdocs\/PROJECT\.md\b/i,
  /(?<!-)\bdocs\/WORKFLOW\.md\b/i,
  /(?<!-)\bdocs\/QA\.md\b/i,
  /(?<!-)\bdocs\/RISK\.md\b/i,
  /(?<!-)\bdocs\/REFERENCE\.md\b/i,
  /(?<!-)\bdocs\/PRINCIPLES\.md\b/i,
  /(?<!-)\bdocs\/ARCHITECTURE\.md\b/i,
  /(?<!-)\bdocs\/domain\/(AUTH|PAYMENTS|DATABASE|API|ROUTES|I18N)\.md\b/i,
  /(?<!-)\bdocs\/ui\/(DESIGN|FRONTEND)\.md\b/i,
];

function normalizePath(p) {
  return p.replaceAll("\\", "/");
}

function detectActiveDocsRoot() {
  const docs2Index = path.resolve(repoRoot, "docs2", "INDEX.md");
  if (fs.existsSync(docs2Index)) return "docs2";
  return "docs";
}

function readText(relPath) {
  const abs = path.resolve(repoRoot, relPath);
  return fs.readFileSync(abs, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
}

function checkRequiredFiles() {
  const errors = [];

  for (const relPath of requiredRootFiles) {
    const abs = path.resolve(repoRoot, relPath);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing required root file: ${relPath}`);
    }
  }

  for (const relPath of requiredActiveDocsFiles) {
    const abs = path.resolve(repoRoot, activeDocsRoot, relPath);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing required docs file: ${activeDocsRoot}/${relPath}`);
    }
  }

  return errors;
}

function checkRequiredHeadings() {
  const errors = [];

  for (const [relPath, headings] of requiredHeadingsByFile.entries()) {
    const resolvedPath = relPath === "AGENTS.md" ? relPath : `${activeDocsRoot}/${relPath}`;
    const abs = path.resolve(repoRoot, resolvedPath);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing file for heading check: ${resolvedPath}`);
      continue;
    }

    const text = readText(resolvedPath);
    for (const heading of headings) {
      if (!text.includes(heading)) {
        errors.push(`Missing heading in ${resolvedPath}: ${JSON.stringify(heading)}`);
      }
    }
  }

  return errors;
}

function checkStalePointers() {
  const errors = [];

  const filesToCheck = [
    "AGENTS.md",
    ".github/copilot-instructions.md",
    `${activeDocsRoot}/GUIDE.md`,
    `${activeDocsRoot}/DESIGN.md`,
    `${activeDocsRoot}/DOMAINS.md`,
  ];

  for (const relPath of filesToCheck) {
    const abs = path.resolve(repoRoot, relPath);
    if (!fs.existsSync(abs)) continue;

    const text = readText(relPath);
    const matches = stalePointerPatterns.filter((pattern) => pattern.test(text));
    if (!matches.length) continue;

    errors.push(`${normalizePath(relPath)}: stale pointers to retired docs`);
  }

  return errors;
}

function checkSubstance() {
  const errors = [];

  const substantiveFiles = [
    { relPath: "GUIDE.md", minNonEmpty: 120 },
    { relPath: "DESIGN.md", minNonEmpty: 170 },
    { relPath: "DOMAINS.md", minNonEmpty: 260 },
    { relPath: "QUALITY.md", minNonEmpty: 50 },
    { relPath: "DECISIONS.md", minNonEmpty: 50 },
  ];

  for (const { relPath, minNonEmpty } of substantiveFiles) {
    const absPath = path.resolve(repoRoot, activeDocsRoot, relPath);
    if (!fs.existsSync(absPath)) continue;

    const text = readText(`${activeDocsRoot}/${relPath}`);
    const lines = text.split("\n");
    const nonEmptyLines = lines.filter((line) => line.trim().length > 0).length;

    if (nonEmptyLines < minNonEmpty) {
      errors.push(
        `Insufficient substance in ${activeDocsRoot}/${relPath}: ${nonEmptyLines} non-empty lines (min ${minNonEmpty})`,
      );
    }
  }

  return errors;
}

function main() {
  const errors = [
    ...checkRequiredFiles(),
    ...checkRequiredHeadings(),
    ...checkStalePointers(),
    ...checkSubstance(),
  ];

  if (errors.length) {
    console.error("DOCS CONTRACT GATE FAIL:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`DOCS CONTRACT GATE OK (active root: ${activeDocsRoot})`);
}

main();
