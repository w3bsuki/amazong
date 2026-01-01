import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const REPO_ROOT = path.resolve(process.cwd());

const SCAN_DIRS = ["app", "components", "lib", "hooks"];

const DEFAULT_BASELINE_PATH = path.join("scripts", "ts-safety-gate.baseline.json");

const EXCLUDED_DIR_SEGMENTS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  "playwright-report",
  "test-results",
]);

const EXCLUDED_TEST_SEGMENTS = new Set(["__tests__", "e2e", "test"]);

const EXCLUDED_FILE_SUFFIXES = [".d.ts"];

const EXCLUDED_FILES = new Set([
  path.normalize("types/database.types.ts"),
  path.normalize("lib/supabase/database.types.ts"),
]);

function isTsFile(filePath) {
  return (
    (filePath.endsWith(".ts") || filePath.endsWith(".tsx")) &&
    !EXCLUDED_FILE_SUFFIXES.some((suffix) => filePath.endsWith(suffix))
  );
}

function isExcludedPath(relPath) {
  const normalized = path.normalize(relPath);
  if (EXCLUDED_FILES.has(normalized)) return true;

  const segments = normalized.split(path.sep);
  if (segments.some((s) => EXCLUDED_DIR_SEGMENTS.has(s))) return true;

  // Exclude tests/specs by folder name and file name.
  if (segments.some((s) => EXCLUDED_TEST_SEGMENTS.has(s))) return true;
  const lower = normalized.toLowerCase();
  if (lower.endsWith(".test.ts") || lower.endsWith(".test.tsx")) return true;
  if (lower.endsWith(".spec.ts") || lower.endsWith(".spec.tsx")) return true;

  return false;
}

function walkDir(absDir, relDir, out) {
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(absDir, entry.name);
    const rel = path.join(relDir, entry.name);

    if (isExcludedPath(rel)) {
      continue;
    }

    if (entry.isDirectory()) {
      walkDir(abs, rel, out);
      continue;
    }

    if (entry.isFile() && isTsFile(rel)) {
      out.push({ absPath: abs, relPath: rel.replaceAll(path.sep, "/") });
    }
  }
}

/** @typedef {{ file: string; line: number; column: number; kind: "any" | "as-any" | "non-null" }} Finding */

function addFinding(findings, sourceFile, node, kind) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  findings.push({
    file: path.relative(REPO_ROOT, sourceFile.fileName).replaceAll(path.sep, "/"),
    line: pos.line + 1,
    column: pos.character + 1,
    kind,
  });
}

function scanFile(absPath) {
  const text = fs.readFileSync(absPath, "utf8");
  const sourceFile = ts.createSourceFile(absPath, text, ts.ScriptTarget.Latest, true);

  /** @type {Finding[]} */
  const findings = [];

  /** @param {ts.Node} node */
  function visit(node) {
    // Non-null assertion: foo!.bar
    if (ts.isNonNullExpression(node)) {
      addFinding(findings, sourceFile, node, "non-null");
    }

    // `as any`
    if (ts.isAsExpression(node) && node.type.kind === ts.SyntaxKind.AnyKeyword) {
      addFinding(findings, sourceFile, node.type, "as-any");
    }

    // `<any>expr`
    if (ts.isTypeAssertionExpression(node) && node.type.kind === ts.SyntaxKind.AnyKeyword) {
      addFinding(findings, sourceFile, node.type, "as-any");
    }

    // `any` in annotations/types (exclude the ones captured above)
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const parent = node.parent;
      const isAsAny =
        (ts.isAsExpression(parent) && parent.type === node) ||
        (ts.isTypeAssertionExpression(parent) && parent.type === node);
      if (!isAsAny) {
        addFinding(findings, sourceFile, node, "any");
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return findings;
}

function loadBaseline(baselinePath) {
  const abs = path.resolve(REPO_ROOT, baselinePath);
  if (!fs.existsSync(abs)) return [];
  const raw = fs.readFileSync(abs, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed;
}

function keyForFinding(f) {
  return `${f.kind}:${f.file}:${f.line}:${f.column}`;
}

function writeJson(filePath, value) {
  const abs = path.resolve(REPO_ROOT, filePath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function main() {
  const args = process.argv.slice(2);

  const updateBaseline = args.includes("--update-baseline");
  const baselinePathArgIndex = args.findIndex((a) => a === "--baseline");
  const baselinePath =
    baselinePathArgIndex >= 0 ? args[baselinePathArgIndex + 1] : DEFAULT_BASELINE_PATH;

  if (!baselinePath || typeof baselinePath !== "string") {
    console.error("[ts:gate] Missing baseline path (use --baseline <path>)");
    process.exit(2);
  }

  const files = [];
  for (const dir of SCAN_DIRS) {
    const absDir = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(absDir)) continue;
    walkDir(absDir, dir, files);
  }

  /** @type {Finding[]} */
  const current = [];
  for (const file of files) {
    try {
      current.push(...scanFile(file.absPath));
    } catch (err) {
      console.error(`[ts:gate] Failed to scan ${file.relPath}`);
      console.error(err);
      process.exit(2);
    }
  }

  current.sort((a, b) =>
    a.file === b.file
      ? a.line === b.line
        ? a.column - b.column
        : a.line - b.line
      : a.file.localeCompare(b.file),
  );

  if (updateBaseline) {
    writeJson(baselinePath, current);
    console.log(`[ts:gate] Baseline updated: ${baselinePath} (${current.length} findings)`);
    return;
  }

  const baseline = loadBaseline(baselinePath);
  const baselineSet = new Set(baseline.map(keyForFinding));

  const newFindings = current.filter((f) => !baselineSet.has(keyForFinding(f)));

  if (newFindings.length > 0) {
    console.error(`[ts:gate] New unsafe TypeScript patterns detected: ${newFindings.length}`);
    for (const f of newFindings.slice(0, 50)) {
      console.error(`- ${f.file}:${f.line}:${f.column} (${f.kind})`);
    }
    if (newFindings.length > 50) {
      console.error(`...and ${newFindings.length - 50} more`);
    }
    console.error(`[ts:gate] If intentional, run: pnpm -s ts:gate:baseline`);
    process.exit(1);
  }

  console.log(`[ts:gate] OK (${current.length} findings; baseline enforced)`);
}

main();
