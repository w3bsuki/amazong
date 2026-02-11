import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COMPONENTS_DIR = path.join(ROOT, "components");
const OUTPUT_FILE = path.join(ROOT, "COMPONENTS_AUDIT.md");
const MOVE_CANDIDATES_FILE = path.join(ROOT, "cleanup", "components-move-candidates.json");

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const RESOLVE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"];

const IGNORE_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".turbo",
  ".vercel",
  "dist",
  "build",
  "coverage",
  "node_modules",
  "playwright-report",
  "test-results",
  "blob-report",
  "storybook-static",
]);

const toPosix = (value) => value.split(path.sep).join("/");
const toRelative = (absPath) => toPosix(path.relative(ROOT, absPath));

function isCodeFile(filePath) {
  return CODE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function dirExists(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

function readFileText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function countLines(filePath) {
  const content = readFileText(filePath);
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function walkTree(rootDir, { ignoreDirectories = new Set() } = {}) {
  const directories = [];
  const files = [];

  if (!dirExists(rootDir)) {
    return { directories, files };
  }

  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    directories.push(current);

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!ignoreDirectories.has(entry.name)) {
          stack.push(absPath);
        }
        continue;
      }

      if (entry.isFile()) {
        files.push(absPath);
      }
    }
  }

  return { directories, files };
}

function extractImportSpecifiers(sourceText) {
  const specifiers = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:type\s+)?(?:[^"'`]*?\sfrom\s*)?["'`]([^"'`]+)["'`]/g,
    /\bimport\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
    /\brequire\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
  ];

  for (const pattern of patterns) {
    let match = pattern.exec(sourceText);
    while (match) {
      specifiers.add(match[1]);
      match = pattern.exec(sourceText);
    }
  }

  return specifiers;
}

function resolveModuleFile(basePath) {
  if (fileExists(basePath)) return basePath;

  const extension = path.extname(basePath).toLowerCase();
  if (!extension || !RESOLVE_EXTENSIONS.includes(extension)) {
    for (const extension of RESOLVE_EXTENSIONS) {
      const candidate = `${basePath}${extension}`;
      if (fileExists(candidate)) return candidate;
    }
  }

  if (dirExists(basePath)) {
    for (const extension of RESOLVE_EXTENSIONS) {
      const indexCandidate = path.join(basePath, `index${extension}`);
      if (fileExists(indexCandidate)) return indexCandidate;
    }
  }

  return null;
}

function resolveImportTarget(importerFile, specifier) {
  if (specifier.startsWith("@/")) {
    const fromAlias = path.join(ROOT, specifier.slice(2));
    return resolveModuleFile(fromAlias);
  }

  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const fromRelative = path.resolve(path.dirname(importerFile), specifier);
    return resolveModuleFile(fromRelative);
  }

  return null;
}

function toTopLevelBucket(relativePath) {
  if (relativePath === "components") return "(root)";
  if (!relativePath.startsWith("components/")) return "(outside)";

  const afterPrefix = relativePath.slice("components/".length);
  if (!afterPrefix) return "(root)";

  const [firstSegment] = afterPrefix.split("/");
  return firstSegment || "(root)";
}

function markdownEscape(value) {
  return value.replace(/\|/g, "\\|");
}

function getRouteGroup(importerPath) {
  const match = importerPath.match(/^app\/\[locale\]\/\(([^)]+)\)\//);
  return match ? match[1] : null;
}

function getRoutePrivateRoot(importerPath) {
  const markers = ["/_components/", "/_actions/", "/_lib/", "/_providers/"];
  for (const marker of markers) {
    const markerIndex = importerPath.indexOf(marker);
    if (markerIndex >= 0) {
      return importerPath.slice(0, markerIndex + marker.length - 1);
    }
  }
  return null;
}

const componentTree = walkTree(COMPONENTS_DIR);
const componentDirectories = componentTree.directories
  .map(toRelative)
  .sort((a, b) => a.localeCompare(b));
const componentFiles = componentTree.files
  .map(toRelative)
  .sort((a, b) => a.localeCompare(b));

const componentFileSet = new Set(componentFiles);

const repoTree = walkTree(ROOT, { ignoreDirectories: IGNORE_DIRECTORIES });
const repoCodeFiles = repoTree.files.filter((filePath) => isCodeFile(filePath));

const inboundByTarget = new Map();
for (const filePath of componentFiles) {
  inboundByTarget.set(filePath, new Set());
}

for (const importerAbsPath of repoCodeFiles) {
  const importerRelativePath = toRelative(importerAbsPath);
  const sourceText = readFileText(importerAbsPath);
  if (!sourceText) continue;

  const specifiers = extractImportSpecifiers(sourceText);
  for (const specifier of specifiers) {
    const resolvedTarget = resolveImportTarget(importerAbsPath, specifier);
    if (!resolvedTarget) continue;

    const resolvedRelative = toRelative(path.resolve(resolvedTarget));
    if (!componentFileSet.has(resolvedRelative)) continue;

    const inbound = inboundByTarget.get(resolvedRelative);
    if (!inbound) continue;
    inbound.add(importerRelativePath);
  }
}

const fileMetadata = new Map();
for (const relativePath of componentFiles) {
  const absPath = path.join(ROOT, relativePath);
  const inboundImporters = [...(inboundByTarget.get(relativePath) ?? new Set())].sort((a, b) =>
    a.localeCompare(b),
  );

  fileMetadata.set(relativePath, {
    path: relativePath,
    inboundImporters,
    inboundCount: inboundImporters.length,
    used: inboundImporters.length >= 1,
    isCode: isCodeFile(relativePath),
    loc: isCodeFile(relativePath) ? countLines(absPath) : 0,
  });
}

const usedFiles = [...fileMetadata.values()].filter((file) => file.used);
const unusedFiles = [...fileMetadata.values()].filter((file) => !file.used);
const codeFiles = [...fileMetadata.values()].filter((file) => file.isCode);

const topLevelSummary = new Map();
for (const dirPath of componentDirectories) {
  const bucket = toTopLevelBucket(dirPath);
  if (!topLevelSummary.has(bucket)) {
    topLevelSummary.set(bucket, { dirs: 0, files: 0, used: 0, unused: 0 });
  }
  topLevelSummary.get(bucket).dirs += 1;
}

for (const filePath of componentFiles) {
  const bucket = toTopLevelBucket(filePath);
  if (!topLevelSummary.has(bucket)) {
    topLevelSummary.set(bucket, { dirs: 0, files: 0, used: 0, unused: 0 });
  }

  const meta = fileMetadata.get(filePath);
  const summary = topLevelSummary.get(bucket);
  summary.files += 1;
  if (meta?.used) {
    summary.used += 1;
  } else {
    summary.unused += 1;
  }
}

const singleUseLargeComponents = codeFiles
  .filter((file) => file.inboundCount === 1)
  .sort((a, b) => b.loc - a.loc)
  .slice(0, 50);

const appOnlyGlobalComponents = codeFiles
  .filter((file) => file.inboundCount > 0)
  .filter((file) => file.inboundImporters.every((importer) => importer.startsWith("app/")))
  .sort((a, b) => b.loc - a.loc)
  .slice(0, 30);

const moveCandidates = codeFiles
  .filter((file) => file.inboundCount > 0)
  .filter((file) => !file.path.startsWith("components/ui/"))
  .filter((file) => file.inboundImporters.every((importer) => importer.startsWith("app/")))
  .map((file) => {
    const routeGroups = new Set(
      file.inboundImporters
        .map((importer) => getRouteGroup(importer))
        .filter(Boolean),
    );
    if (routeGroups.size !== 1) return null;

    const privateRoots = file.inboundImporters
      .map((importer) => getRoutePrivateRoot(importer))
      .filter(Boolean);
    const uniquePrivateRoots = new Set(privateRoots);
    const singleRouteGroup = [...routeGroups][0];
    const routeGroupScope = `app/[locale]/(${singleRouteGroup})`;

    const isRoutePrivateTreeCandidate =
      privateRoots.length === file.inboundImporters.length && uniquePrivateRoots.size === 1;

    const mode = isRoutePrivateTreeCandidate ? "route-private-tree" : "route-group";
    const routeScope = isRoutePrivateTreeCandidate
      ? [...uniquePrivateRoots][0]
      : routeGroupScope;
    const suggestedTarget = isRoutePrivateTreeCandidate
      ? `${routeScope}/${path.basename(file.path)}`
      : `${routeScope}/_components/${path.basename(file.path)}`;

    const priority = isRoutePrivateTreeCandidate ? 1 : file.inboundCount === 1 ? 2 : 3;
    const reason = isRoutePrivateTreeCandidate
      ? "All importers are in one route-private tree"
      : "All importers are confined to one route group";

    return {
      priority,
      mode,
      reason,
      routeScope,
      suggestedTarget,
      path: file.path,
      loc: file.loc,
      inboundCount: file.inboundCount,
      inboundImporters: file.inboundImporters,
    };
  })
  .filter(Boolean)
  .sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.inboundCount !== b.inboundCount) return a.inboundCount - b.inboundCount;
    if (a.loc !== b.loc) return b.loc - a.loc;
    return a.path.localeCompare(b.path);
  });

const batchARoutePrivate = moveCandidates.filter((candidate) => candidate.mode === "route-private-tree");
const batchBRouteGroup = moveCandidates.filter((candidate) => candidate.mode === "route-group");
const batchCBarrelCleanup = moveCandidates.filter((candidate) =>
  /^index\.[mc]?[jt]sx?$/.test(path.basename(candidate.path)),
);

function getDirectoryRollup(dirPath) {
  const prefix = `${dirPath}/`;
  const descendants = componentFiles.filter((filePath) => filePath.startsWith(prefix));
  const descendantMetadata = descendants.map((filePath) => fileMetadata.get(filePath)).filter(Boolean);

  const used = descendantMetadata.filter((file) => file.used).length;
  const unused = descendantMetadata.length - used;

  return {
    fileCount: descendantMetadata.length,
    used,
    unused,
    status: used > 0 ? "used" : "unused",
  };
}

const mapEntries = [
  ...componentDirectories.map((dirPath) => ({ type: "dir", path: dirPath })),
  ...componentFiles.map((filePath) => ({ type: "file", path: filePath })),
].sort((a, b) => a.path.localeCompare(b.path));

const unusedList = unusedFiles.map((file) => `\`${file.path}\``).join(", ");

const markdown = [
  "# Components Audit",
  "",
  `Generated: ${new Date().toISOString()}`,
  "",
  "## Snapshot",
  "",
  `- Total directories in \`components/\`: ${componentDirectories.length}`,
  `- Total files in \`components/\`: ${componentFiles.length}`,
  `- Code files in \`components/\`: ${codeFiles.length}`,
  `- Used files: ${usedFiles.length}`,
  `- Unused files: ${unusedFiles.length}`,
  "- Status rule: `used` means static inbound import/export/require count >= 1.",
  "- `used` != `well-structured`; architecture findings are listed below.",
  "",
  "## Top-Level Summary",
  "",
  "| Folder | Dirs | Files | Used | Unused |",
  "| --- | ---: | ---: | ---: | ---: |",
];

const topLevelRows = [...topLevelSummary.entries()].sort(([a], [b]) => {
  if (a === "(root)") return -1;
  if (b === "(root)") return 1;
  return a.localeCompare(b);
});

for (const [bucket, stats] of topLevelRows) {
  markdown.push(`| \`${bucket}\` | ${stats.dirs} | ${stats.files} | ${stats.used} | ${stats.unused} |`);
}

markdown.push("", "## Architecture Findings", "", "### 1) Large Single-Use Components", "");
markdown.push("| LOC | File | Single Importer |");
markdown.push("| ---: | --- | --- |");
for (const item of singleUseLargeComponents) {
  markdown.push(
    `| ${item.loc} | \`${markdownEscape(item.path)}\` | \`${markdownEscape(item.inboundImporters[0] ?? "-")}\` |`,
  );
}

markdown.push("", "### 2) App-Only Components Under Global `components/`", "");
markdown.push("| Refs | LOC | File |");
markdown.push("| ---: | ---: | --- |");
for (const item of appOnlyGlobalComponents) {
  markdown.push(`| ${item.inboundCount} | ${item.loc} | \`${markdownEscape(item.path)}\` |`);
}

markdown.push("", "### 3) Deterministic Move Candidates", "");
markdown.push(
  "Rule set: importer scope must be one route group or one route-private tree; `components/ui/*` is excluded.",
);
markdown.push(`Machine-readable output: \`${toRelative(MOVE_CANDIDATES_FILE)}\``);
markdown.push("");
markdown.push("| Priority | File | Reason | Scope | Refs | Suggested target |");
markdown.push("| ---: | --- | --- | --- | ---: | --- |");
for (const candidate of moveCandidates.slice(0, 80)) {
  markdown.push(
    `| ${candidate.priority} | \`${markdownEscape(candidate.path)}\` | ${candidate.reason} | \`${markdownEscape(candidate.routeScope)}\` | ${candidate.inboundCount} | \`${markdownEscape(candidate.suggestedTarget)}\` |`,
  );
}
if (moveCandidates.length === 0) {
  markdown.push("| - | - | No deterministic candidates found | - | - | - |");
}

markdown.push("", "## Full Component Map", "");
markdown.push("| Path | Type | Status | Inbound Refs | Importers (sample) | Notes |");
markdown.push("| --- | --- | --- | ---: | --- | --- |");

for (const entry of mapEntries) {
  if (entry.type === "dir") {
    const rollup = getDirectoryRollup(entry.path);
    markdown.push(
      `| \`${markdownEscape(entry.path)}\` | dir | ${rollup.status} | - | - | ${rollup.used} used / ${rollup.unused} unused files |`,
    );
    continue;
  }

  const file = fileMetadata.get(entry.path);
  if (!file) continue;

  const importerSample = file.inboundImporters.slice(0, 3).join(", ");
  const notes = file.isCode ? `loc=${file.loc}` : "asset";
  markdown.push(
    `| \`${markdownEscape(entry.path)}\` | file | ${file.used ? "used" : "unused"} | ${file.inboundCount} | ${
      importerSample ? `\`${markdownEscape(importerSample)}\`` : "-"
    } | ${notes} |`,
  );
}

markdown.push("", "## Iteration Plan", "", "### Immediate Cleanup Candidates", "");
if (unusedFiles.length > 0) {
  markdown.push(`- [ ] Remove or reconnect unused files: ${unusedList}`);
} else {
  markdown.push("- [ ] No unused component files found by static graph. Validate runtime-only references before removing anything.");
}

markdown.push("", "### Structural Follow-Ups", "");
markdown.push(
  `- [ ] Batch A (route-private tree moves): ${batchARoutePrivate.length} candidates from deterministic rules.`,
);
markdown.push(
  `- [ ] Batch B (route-group confined moves): ${batchBRouteGroup.length} candidates from deterministic rules.`,
);
markdown.push(
  `- [ ] Batch C (barrel/index cleanup after moves): ${batchCBarrelCleanup.length} candidate index files.`,
);
markdown.push("- [ ] Keep shadcn primitives in `components/ui/*` only; keep feature composition in `components/shared/*`, `components/mobile/*`, `components/desktop/*`.");
markdown.push("", "## Method and Limits", "");
markdown.push("- Static import graph only; dynamic runtime resolution is not counted.");
markdown.push("- Import samples list up to 3 callers per file for readability.");
markdown.push("- Deterministic move candidates are suggestions; resolve naming collisions before applying.");

fs.mkdirSync(path.dirname(MOVE_CANDIDATES_FILE), { recursive: true });
fs.writeFileSync(
  MOVE_CANDIDATES_FILE,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      rules: {
        excludes: ["components/ui/*"],
        allowModes: ["route-private-tree", "route-group"],
      },
      counts: {
        total: moveCandidates.length,
        batchA: batchARoutePrivate.length,
        batchB: batchBRouteGroup.length,
        batchC: batchCBarrelCleanup.length,
      },
      candidates: moveCandidates,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
fs.writeFileSync(OUTPUT_FILE, `${markdown.join("\n")}\n`, "utf8");
console.log(`Wrote ${toRelative(OUTPUT_FILE)} with ${componentFiles.length} files.`);
