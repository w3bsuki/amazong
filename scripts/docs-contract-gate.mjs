import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const activeDocsRoot = detectActiveDocsRoot();

const requiredRootFiles = ["AGENTS.md", "ARCHITECTURE.md", "REQUIREMENTS.md", "TASKS.md"];

const requiredActiveDocsFiles = [
  "INDEX.md",
  "PROJECT.md",
  "WORKFLOW.md",
  "QA.md",
  "RISK.md",
  "REFERENCE.md",
  "QUALITY.md",
  "PRINCIPLES.md",
  "DECISIONS.md",
  "domain/AUTH.md",
  "domain/PAYMENTS.md",
  "domain/DATABASE.md",
  "domain/API.md",
  "domain/ROUTES.md",
  "domain/I18N.md",
  "ui/DESIGN.md",
  "ui/FRONTEND.md",
];

const requiredHeadingsByFile = new Map([
  [
    "AGENTS.md",
    [
      "## Context Loading (Default)",
      "## Optional Context",
      "## Execution Rules",
      "## High-Risk Pause",
      "## Output Contract",
    ],
  ],
  [
    "INDEX.md",
    [
      "## Start Here",
      "## Default Load Order",
      "## Load Only If Needed",
      "## Archive Map",
    ],
  ],
  [
    "PROJECT.md",
    [
      "## Product Snapshot",
      "## Current Phase",
      "## P0 Flows",
      "## Out of Scope",
      "## Done Means",
    ],
  ],
  [
    "WORKFLOW.md",
    [
      "## Task Loop",
      "## Risk Lanes",
      "## Prompt Packet",
      "## Verification Matrix",
      "## Report Format",
    ],
  ],
  [
    "QA.md",
    [
      "## Gate Matrix",
      "## When To Run Unit",
      "## When To Run E2E",
      "## Manual Checks",
      "## Release Checks",
    ],
  ],
  [
    "RISK.md",
    [
      "## Stop-And-Ask Domains",
      "## Approval Log Format",
      "## Rollback Expectations",
    ],
  ],
  [
    "REFERENCE.md",
    [
      "## Domain Links",
      "## Cross-Cutting References",
      "## Code Truth Paths",
      "## When To Ignore Docs And Read Code",
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
    "PRINCIPLES.md",
    [
      "## 1. Parse at the boundary, trust inside",
      "## 2. Code is runtime truth",
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
  [
    "domain/AUTH.md",
    ["## Scope", "## Runtime Truth Paths", "## Verification", "## Deep Dive", "## See Also"],
  ],
  [
    "domain/PAYMENTS.md",
    ["## Scope", "## Runtime Truth Paths", "## Verification", "## Deep Dive", "## See Also"],
  ],
  [
    "domain/DATABASE.md",
    ["## Scope", "## Runtime Truth Paths", "## Verification", "## Deep Dive", "## See Also"],
  ],
  [
    "domain/API.md",
    ["## Scope", "## Runtime Truth Paths", "## Verification", "## Deep Dive", "## See Also"],
  ],
  [
    "domain/ROUTES.md",
    ["## Scope", "## Runtime Truth Paths", "## Verification", "## Deep Dive", "## See Also"],
  ],
  [
    "domain/I18N.md",
    ["## Scope", "## Runtime Truth Paths", "## Verification", "## Deep Dive", "## See Also"],
  ],
  [
    "ui/DESIGN.md",
    [
      "## Scope",
      "## Runtime Truth Paths",
      "### 2.1) Design Thinking (Before Coding)",
      "### 2.2) Anti-Slop Rules (Banned Patterns)",
      "## See Also",
    ],
  ],
  [
    "ui/FRONTEND.md",
    [
      "## Scope",
      "## Runtime Truth Paths",
      "## 6) Design Quality Bar (Ship Criteria)",
      "## 8) Verification",
      "## See Also",
    ],
  ],
]);

const stalePointerPatterns = [
  // Retired root-level docs paths (pre-cutover). Avoid matching archive paths like
  // `pre-cutover-docs/*.md` (the directory name ends with `docs/`).
  /(?<!-)\bdocs\/HARNESS\.md\b/i,
  /(?<!-)\bdocs\/PROMPTS\.md\b/i,
  /(?<!-)\bdocs\/PRD\.md\b/i,
  /(?<!-)\bdocs\/PLANS\.md\b/i,
  /(?<!-)\bdocs\/PRODUCT_SENSE\.md\b/i,
  // Pre-cutover domain/UI docs lived at docs/*.md. Active docs moved under docs/domain and docs/ui.
  /(?<!-)\bdocs\/AUTH\.md\b/i,
  /(?<!-)\bdocs\/PAYMENTS\.md\b/i,
  /(?<!-)\bdocs\/DATABASE\.md\b/i,
  /(?<!-)\bdocs\/API\.md\b/i,
  /(?<!-)\bdocs\/ROUTES\.md\b/i,
  /(?<!-)\bdocs\/I18N\.md\b/i,
  /(?<!-)\bdocs\/DESIGN\.md\b/i,
  /(?<!-)\bdocs\/FRONTEND\.md\b/i,
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
    "README.md",
    ".github/copilot-instructions.md",
    ...requiredActiveDocsFiles.map((p) => `${activeDocsRoot}/${p}`),
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

  // These files are required and should contain real guidance, not pointer shells.
  const domainAndUi = requiredActiveDocsFiles.filter((p) => p.startsWith("domain/") || p.startsWith("ui/"));

  // Cross-cutting docs that must also have substance
  const crossCuttingSubstance = ["QUALITY.md", "PRINCIPLES.md", "DECISIONS.md"];
  const substantiveFiles = [...domainAndUi, ...crossCuttingSubstance];

  for (const relPath of substantiveFiles) {
    const absPath = path.resolve(repoRoot, activeDocsRoot, relPath);
    if (!fs.existsSync(absPath)) continue;

    const text = readText(`${activeDocsRoot}/${relPath}`);
    const lines = text.split("\n");
    const nonEmptyLines = lines.filter((l) => l.trim().length > 0).length;

    const minNonEmpty = relPath.startsWith("ui/") ? 70 : 50;
    if (nonEmptyLines < minNonEmpty) {
      errors.push(
        `Insufficient substance in ${activeDocsRoot}/${relPath}: ${nonEmptyLines} non-empty lines (min ${minNonEmpty})`
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
