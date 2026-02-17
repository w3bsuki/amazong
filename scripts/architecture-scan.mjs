import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const DEFAULT_BASELINE_PATH = path.join("scripts", "architecture-gate.baseline.json");
const TMP_JSCPD_DIR = path.join(".tmp", "architecture-jscpd");
const SCAN_DIRS = ["app", "components", "lib", "hooks"];
const PAGE_ROOT = path.join("app", "[locale]");

const EXCLUDED_DIRS = new Set([
  ".git",
  ".next",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "playwright-report",
  "test-results",
  "blob-report",
  "storybook-static",
]);

const VALID_SECTIONS = new Set(["all", "client-boundary", "oversized", "routes", "duplicates"]);

function toPosix(filePath) {
  return filePath.replaceAll(path.sep, "/");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const getArgValue = (name, fallback = undefined) => {
    const index = args.findIndex((arg) => arg === name);
    if (index < 0) return fallback;
    return args[index + 1] ?? fallback;
  };

  const section = getArgValue("--section", "all");
  const baseline = getArgValue("--baseline", DEFAULT_BASELINE_PATH);
  const writePath = getArgValue("--write");
  const updateBaseline = args.includes("--update-baseline");
  const gate = args.includes("--gate") || String(process.env.FAIL_ON_FINDINGS || "") === "1";
  const skipDuplicates = String(process.env.ARCH_SCAN_SKIP_DUPES || "") === "1";

  if (!VALID_SECTIONS.has(section)) {
    console.error(
      `[architecture:scan] Invalid --section "${section}". Expected one of: ${[...VALID_SECTIONS].join(", ")}`,
    );
    process.exit(2);
  }

  return { section, baseline, writePath, updateBaseline, gate, skipDuplicates };
}

function walkDir(absDir, relDir, outFiles) {
  if (!fs.existsSync(absDir)) return;
  const entries = fs.readdirSync(absDir, { withFileTypes: true });

  for (const entry of entries) {
    const abs = path.join(absDir, entry.name);
    const rel = path.join(relDir, entry.name);
    const relPosix = toPosix(rel);

    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walkDir(abs, rel, outFiles);
      continue;
    }

    if (entry.isFile()) {
      outFiles.push(relPosix);
    }
  }
}

function listFilesInDirs(dirs) {
  const files = [];
  for (const dir of dirs) {
    const abs = path.join(ROOT, dir);
    walkDir(abs, dir, files);
  }
  return files;
}

function readTextFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function isCodeFile(relPath) {
  return (
    (relPath.endsWith(".ts") || relPath.endsWith(".tsx")) &&
    !relPath.endsWith(".d.ts")
  );
}

function hasUseClientDirective(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  let inBlockComment = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (inBlockComment) {
      if (line.includes("*/")) inBlockComment = false;
      continue;
    }

    if (line.startsWith("/*")) {
      if (!line.includes("*/")) inBlockComment = true;
      continue;
    }

    if (line.startsWith("//")) continue;

    return /^["']use client["'];?$/.test(line);
  }

  return false;
}

function countLines(text) {
  if (text.length === 0) return 0;
  return text.split(/\r?\n/).length;
}

function scanClientBoundary(codeFiles) {
  let useClientFiles = 0;

  for (const relPath of codeFiles) {
    const text = readTextFile(relPath);
    if (hasUseClientDirective(text)) {
      useClientFiles += 1;
    }
  }

  const totalFiles = codeFiles.length;
  const useClientRatio = totalFiles === 0 ? 0 : Number(((useClientFiles / totalFiles) * 100).toFixed(2));

  return {
    totalFiles,
    useClientFiles,
    useClientRatio,
  };
}

function scanOversizedFiles(codeFiles) {
  let over300 = 0;
  let over500 = 0;

  for (const relPath of codeFiles) {
    const text = readTextFile(relPath);
    const lines = countLines(text);

    if (lines > 300) over300 += 1;
    if (lines > 500) over500 += 1;
  }

  return { over300, over500 };
}

function scanRouteCompleteness(allFiles) {
  const pageFiles = allFiles.filter((file) => file.startsWith(`${toPosix(PAGE_ROOT)}/`) && file.endsWith("/page.tsx"));

  let missingLoading = 0;
  let missingMetadata = 0;

  for (const pageFile of pageFiles) {
    const pageDir = pageFile.slice(0, -"/page.tsx".length);
    const loadingPath = `${pageDir}/loading.tsx`;
    if (!allFiles.includes(loadingPath)) {
      missingLoading += 1;
    }

    const source = readTextFile(pageFile);
    const hasMetadata =
      /\bexport\s+async\s+function\s+generateMetadata\b/.test(source) ||
      /\bexport\s+function\s+generateMetadata\b/.test(source) ||
      /\bexport\s+const\s+metadata\b/.test(source);

    if (!hasMetadata) {
      missingMetadata += 1;
    }
  }

  return {
    pageCount: pageFiles.length,
    missingLoading,
    missingMetadata,
  };
}

function runJscpdJson() {
  const command =
    "pnpm exec jscpd ./app ./components ./lib --min-lines 10 --reporters json --output .tmp/architecture-jscpd --gitignore";

  const result = spawnSync(command, {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    console.error("[architecture:scan] jscpd execution failed.");
    if (stdout) console.error(stdout);
    if (stderr) console.error(stderr);
    process.exit(2);
  }

  const reportPath = path.join(ROOT, TMP_JSCPD_DIR, "jscpd-report.json");
  if (!fs.existsSync(reportPath)) {
    console.error(`[architecture:scan] Missing jscpd report: ${toPosix(path.relative(ROOT, reportPath))}`);
    process.exit(2);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const total = report?.statistics?.total;
  if (!total) {
    console.error("[architecture:scan] jscpd report missing statistics.total.");
    process.exit(2);
  }

  return {
    clones: Number(total.clones ?? 0),
    duplicatedLines: Number(total.duplicatedLines ?? 0),
    percentage: Number(total.percentage ?? 0),
  };
}

function scanDuplicates(skipDuplicates) {
  if (skipDuplicates) {
    return {
      skipped: true,
    };
  }

  return runJscpdJson();
}

function buildMetrics(section, skipDuplicates) {
  const allFiles = listFilesInDirs(SCAN_DIRS);
  const codeFiles = allFiles.filter(isCodeFile);

  const sections = {};

  if (section === "all" || section === "client-boundary") {
    sections.clientBoundary = scanClientBoundary(codeFiles);
  }
  if (section === "all" || section === "oversized") {
    sections.oversized = scanOversizedFiles(codeFiles);
  }
  if (section === "all" || section === "routes") {
    sections.routes = scanRouteCompleteness(allFiles);
  }
  if (section === "all" || section === "duplicates") {
    sections.duplicates = scanDuplicates(skipDuplicates);
  }

  return {
    generatedAt: new Date().toISOString(),
    sections,
  };
}

function writeJson(relPath, value) {
  const absPath = path.resolve(ROOT, relPath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function loadBaseline(relPath) {
  const absPath = path.resolve(ROOT, relPath);
  if (!fs.existsSync(absPath)) return null;
  return JSON.parse(fs.readFileSync(absPath, "utf8"));
}

function compareGate(metrics, baseline) {
  if (!baseline || !baseline.sections) {
    return [{ label: "baseline", current: 0, baseline: 0, message: "Missing baseline file" }];
  }

  const regressions = [];
  const checks = [
    ["clientBoundary", "useClientFiles", "use client files"],
    ["oversized", "over300", "files over 300 lines"],
    ["oversized", "over500", "files over 500 lines"],
    ["routes", "missingLoading", "pages missing loading.tsx"],
    ["routes", "missingMetadata", "pages missing metadata export"],
    ["duplicates", "clones", "duplicate clones"],
    ["duplicates", "percentage", "duplicate percentage"],
  ];

  for (const [section, key, label] of checks) {
    const currentSection = metrics.sections?.[section];
    const baselineSection = baseline.sections?.[section];
    if (!currentSection || !baselineSection) continue;
    if (currentSection.skipped || baselineSection.skipped) continue;

    const currentValue = Number(currentSection[key]);
    const baselineValue = Number(baselineSection[key]);
    if (Number.isNaN(currentValue) || Number.isNaN(baselineValue)) continue;

    if (currentValue > baselineValue) {
      regressions.push({
        label,
        key: `${section}.${key}`,
        current: currentValue,
        baseline: baselineValue,
      });
    }
  }

  return regressions;
}

function printSummary(metrics) {
  const { sections } = metrics;
  console.log("[architecture:scan] Metrics");
  if (sections.clientBoundary) {
    console.log(
      `- client-boundary: ${sections.clientBoundary.useClientFiles}/${sections.clientBoundary.totalFiles} (${sections.clientBoundary.useClientRatio}%)`,
    );
  }
  if (sections.oversized) {
    console.log(`- oversized: >300=${sections.oversized.over300}, >500=${sections.oversized.over500}`);
  }
  if (sections.routes) {
    console.log(
      `- routes: pages=${sections.routes.pageCount}, missingLoading=${sections.routes.missingLoading}, missingMetadata=${sections.routes.missingMetadata}`,
    );
  }
  if (sections.duplicates) {
    if (sections.duplicates.skipped) {
      console.log("- duplicates: skipped (ARCH_SCAN_SKIP_DUPES=1)");
    } else {
      console.log(
        `- duplicates: clones=${sections.duplicates.clones}, duplicatedLines=${sections.duplicates.duplicatedLines}, percentage=${sections.duplicates.percentage}%`,
      );
    }
  }
}

function cleanupTemp() {
  fs.rmSync(path.join(ROOT, TMP_JSCPD_DIR), { recursive: true, force: true });
}

function main() {
  const options = parseArgs();
  const metrics = buildMetrics(options.section, options.skipDuplicates);
  printSummary(metrics);

  if (options.writePath) {
    writeJson(options.writePath, metrics);
    console.log(`[architecture:scan] Wrote metrics: ${toPosix(options.writePath)}`);
  }

  if (options.updateBaseline) {
    writeJson(options.baseline, metrics);
    console.log(`[architecture:scan] Baseline updated: ${toPosix(options.baseline)}`);
  }

  if (options.gate) {
    const baseline = loadBaseline(options.baseline);
    const regressions = compareGate(metrics, baseline);
    if (regressions.length > 0) {
      console.error(`[architecture:gate] Regressions detected (${regressions.length})`);
      for (const regression of regressions) {
        console.error(
          `- ${regression.label}: ${regression.current} > baseline ${regression.baseline} (${regression.key})`,
        );
      }
      process.exit(1);
    }
    console.log("[architecture:gate] OK (no regressions vs baseline)");
  }

  cleanupTemp();
}

main();
