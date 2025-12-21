import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());

const APP_LOCALE_DIR = path.join(repoRoot, 'app', '[locale]');
const COMPONENTS_DIR = path.join(repoRoot, 'components');

function posixPath(p) {
  return p.split(path.sep).join('/');
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function listDirNames(p) {
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));
}

function walkFiles(rootDir, { includeExts, excludeDirs }) {
  /** @type {string[]} */
  const results = [];
  /** @type {string[]} */
  const stack = [rootDir];

  while (stack.length) {
    const current = stack.pop();
    if (!current) break;

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (excludeDirs && excludeDirs.has(entry.name)) continue;
        stack.push(full);
        continue;
      }

      if (!entry.isFile()) continue;
      if (includeExts) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!includeExts.has(ext)) continue;
      }
      results.push(full);
    }
  }

  results.sort((a, b) => a.localeCompare(b));
  return results;
}

function groupFromAppPath(appFileAbs) {
  // app/[locale]/(group)/... => group
  const rel = posixPath(path.relative(repoRoot, appFileAbs));
  const match = rel.match(/^app\/\[locale\]\/\(([^)]+)\)\//);
  if (match) return match[1];
  if (rel.startsWith('app/[locale]/')) return 'root';
  return 'unknown';
}

function buildRouteMap() {
  if (!exists(APP_LOCALE_DIR)) {
    throw new Error(`Missing ${APP_LOCALE_DIR}`);
  }

  const groups = listDirNames(APP_LOCALE_DIR).filter((n) => n.startsWith('(') && n.endsWith(')'));

  /** @type {Record<string, any>} */
  const map = {
    generatedAt: new Date().toISOString(),
    appLocaleDir: posixPath(path.relative(repoRoot, APP_LOCALE_DIR)),
    groups: {},
    root: {
      specialFiles: [],
      dynamicSegments: []
    }
  };

  // root-level special files + dynamic segments (e.g. [username])
  const rootEntries = fs.readdirSync(APP_LOCALE_DIR, { withFileTypes: true });
  for (const entry of rootEntries) {
    const full = path.join(APP_LOCALE_DIR, entry.name);
    if (entry.isFile()) {
      map.root.specialFiles.push(entry.name);
    } else if (entry.isDirectory()) {
      if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
        map.root.dynamicSegments.push(entry.name);
      }
    }
  }

  // For each group, list routes by presence of page/layout/route files
  for (const groupDirName of groups) {
    const groupName = groupDirName.slice(1, -1);
    const groupAbs = path.join(APP_LOCALE_DIR, groupDirName);

    const files = walkFiles(groupAbs, {
      includeExts: new Set(['.ts', '.tsx']),
      excludeDirs: new Set(['node_modules', '.next'])
    });

    /** @type {Record<string, { pages: string[], routes: string[], layouts: string[], other: string[] }>} */
    const byDir = {};

    for (const fileAbs of files) {
      const rel = posixPath(path.relative(repoRoot, fileAbs));
      const relDir = posixPath(path.relative(repoRoot, path.dirname(fileAbs)));
      const base = path.basename(fileAbs);

      if (!byDir[relDir]) byDir[relDir] = { pages: [], routes: [], layouts: [], other: [] };
      if (base === 'page.tsx' || base === 'page.ts') byDir[relDir].pages.push(rel);
      else if (base === 'route.ts' || base === 'route.tsx') byDir[relDir].routes.push(rel);
      else if (base === 'layout.tsx' || base === 'layout.ts') byDir[relDir].layouts.push(rel);
      else if (base.endsWith('.tsx') || base.endsWith('.ts')) byDir[relDir].other.push(rel);
    }

    map.groups[groupName] = {
      dir: `app/[locale]/(${groupName})`,
      directories: Object.fromEntries(
        Object.entries(byDir)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([dir, data]) => [dir, data])
      )
    };
  }

  return map;
}

function classifyComponentFile(componentRelPath, fileText, usageGroups) {
  const rel = componentRelPath;

  // Folder-based (authoritative)
  if (rel.startsWith('components/ui/')) return { bucket: 'components/ui (primitive)', reason: 'Located under components/ui/' };
  if (rel.startsWith('components/providers/')) return { bucket: 'components/providers', reason: 'Located under components/providers/' };
  if (rel.startsWith('components/layout/')) return { bucket: 'components/layout', reason: 'Located under components/layout/' };
  if (rel.startsWith('components/common/')) return { bucket: 'components/common (shared composite)', reason: 'Located under components/common/' };

  // Heuristics
  const lower = rel.toLowerCase();
  const looksProvider =
    lower.includes('provider') ||
    fileText.includes('createContext') ||
    fileText.includes('useContext') && fileText.includes('createContext') ||
    fileText.includes('SessionContext') ||
    fileText.includes('ThemeProvider');
  if (looksProvider) return { bucket: 'components/providers', reason: 'Provider/context heuristics' };

  const looksLayout =
    lower.includes('header') ||
    lower.includes('footer') ||
    lower.includes('sidebar') ||
    lower.includes('nav') ||
    lower.includes('breadcrumb') ||
    lower.includes('layout');
  if (looksLayout) return { bucket: 'components/layout', reason: 'Layout/navigation naming heuristics' };

  // Usage-based suggestion: single group => route-owned
  const groupList = Array.from(usageGroups);
  if (groupList.length === 1 && groupList[0] !== 'unknown') {
    return {
      bucket: 'should move to route-owned _components',
      reason: `Referenced only from app group: ${groupList[0]}`
    };
  }

  // Default
  return { bucket: 'components/common (shared composite)', reason: 'Default bucket (shared component under components/ root)' };
}

function buildComponentsOwnershipMap() {
  if (!exists(COMPONENTS_DIR)) {
    throw new Error(`Missing ${COMPONENTS_DIR}`);
  }

  const componentFiles = walkFiles(COMPONENTS_DIR, {
    includeExts: new Set(['.ts', '.tsx']),
    excludeDirs: new Set(['node_modules', '.next'])
  });

  // Scan all source files (excluding scripts, which tsconfig excludes too)
  const sourceRoots = ['app', 'components', 'hooks', 'lib', 'types', 'config'].map((p) => path.join(repoRoot, p));
  const allSourceFiles = sourceRoots
    .filter(exists)
    .flatMap((root) =>
      walkFiles(root, {
        includeExts: new Set(['.ts', '.tsx']),
        excludeDirs: new Set(['node_modules', '.next', 'dist', 'build'])
      })
    );

  /** @type {Map<string, { groups: Set<string>, refs: Array<{file: string, group: string}> }>} */
  const usageByComponent = new Map();

  // Preload file texts once
  /** @type {Map<string, string>} */
  const fileTextCache = new Map();
  for (const fileAbs of allSourceFiles) {
    try {
      fileTextCache.set(fileAbs, readText(fileAbs));
    } catch {
      // ignore
    }
  }

  // Helper to compute likely import specifiers that appear in code
  function getNeedlesFor(componentAbs) {
    const rel = posixPath(path.relative(repoRoot, componentAbs));
    const relNoExt = rel.replace(/\.(tsx|ts)$/i, '');

    // Most common in this repo: @/components/...
    const fromComponentsRoot = relNoExt.replace(/^components\//, '');

    const needles = new Set([
      `@/components/${fromComponentsRoot}`,
      `@/components/${fromComponentsRoot}.tsx`,
      `@/components/${fromComponentsRoot}.ts`,
      // sometimes people import from the file path without removing extension
      `@/components/${fromComponentsRoot.replace(/\//g, '/')}`
    ]);

    // Also support bare components alias if used (shadcn alias)
    needles.add(`@/components/${fromComponentsRoot}`);

    return { rel, needles: Array.from(needles).filter(Boolean) };
  }

  // Build usage map
  for (const componentAbs of componentFiles) {
    const { rel: componentRel, needles } = getNeedlesFor(componentAbs);

    const usage = { groups: new Set(), refs: [] };

    for (const [fileAbs, text] of fileTextCache.entries()) {
      // Avoid self-match by skipping the component file itself
      if (fileAbs === componentAbs) continue;

      // quick check: any needle substring
      let matched = false;
      for (const needle of needles) {
        if (text.includes(needle)) {
          matched = true;
          break;
        }
      }
      if (!matched) continue;

      const group = groupFromAppPath(fileAbs);
      usage.groups.add(group);
      usage.refs.push({ file: posixPath(path.relative(repoRoot, fileAbs)), group });
    }

    usageByComponent.set(componentRel, usage);
  }

  // Produce ownership classification
  /** @type {any[]} */
  const records = [];

  for (const componentAbs of componentFiles) {
    const componentRel = posixPath(path.relative(repoRoot, componentAbs));
    const usage = usageByComponent.get(componentRel) ?? { groups: new Set(), refs: [] };

    let fileText = '';
    try {
      fileText = readText(componentAbs);
    } catch {
      fileText = '';
    }

    const classification = classifyComponentFile(componentRel, fileText, usage.groups);

    records.push({
      file: componentRel,
      bucket: classification.bucket,
      reason: classification.reason,
      usageGroups: Array.from(usage.groups).sort((a, b) => a.localeCompare(b)),
      refCount: usage.refs.length
    });
  }

  records.sort((a, b) => a.file.localeCompare(b.file));

  return {
    generatedAt: new Date().toISOString(),
    componentsDir: posixPath(path.relative(repoRoot, COMPONENTS_DIR)),
    totals: {
      files: records.length
    },
    records
  };
}

function toMarkdownRouteMap(routeMap) {
  const lines = [];
  lines.push('# Phase 0 — Route Map');
  lines.push('');
  lines.push(`Generated: ${routeMap.generatedAt}`);
  lines.push('');

  lines.push('## Root (app/[locale])');
  lines.push(`- Special files: ${routeMap.root.specialFiles.join(', ') || '(none)'}`);
  lines.push(`- Dynamic segments: ${routeMap.root.dynamicSegments.join(', ') || '(none)'}`);
  lines.push('');

  const groupNames = Object.keys(routeMap.groups).sort((a, b) => a.localeCompare(b));
  for (const group of groupNames) {
    const g = routeMap.groups[group];
    lines.push(`## (${group})`);

    const dirs = Object.entries(g.directories);
    const interesting = dirs.filter(([, d]) => (d.pages?.length || 0) + (d.routes?.length || 0) + (d.layouts?.length || 0) > 0);

    if (interesting.length === 0) {
      lines.push('- (No route entrypoints found)');
      lines.push('');
      continue;
    }

    for (const [dir, d] of interesting) {
      const parts = [];
      if (d.layouts?.length) parts.push(`layout: ${d.layouts.map((p) => p.split('/').slice(-1)[0]).join(', ')}`);
      if (d.pages?.length) parts.push(`page: ${d.pages.map((p) => p.split('/').slice(-1)[0]).join(', ')}`);
      if (d.routes?.length) parts.push(`route: ${d.routes.map((p) => p.split('/').slice(-1)[0]).join(', ')}`);

      lines.push(`- ${dir.replace(/^app\/\[locale\]\//, '')} — ${parts.join(' | ')}`);
    }

    lines.push('');
  }

  return lines.join('\n');
}

function toMarkdownComponentsOwnership(map) {
  const lines = [];
  lines.push('# Phase 0 — Components Ownership Map');
  lines.push('');
  lines.push(`Generated: ${map.generatedAt}`);
  lines.push('');

  // Summary by bucket
  const counts = new Map();
  for (const r of map.records) {
    counts.set(r.bucket, (counts.get(r.bucket) ?? 0) + 1);
  }

  lines.push('## Summary (by bucket)');
  for (const [bucket, count] of Array.from(counts.entries()).sort((a, b) => String(a[0]).localeCompare(String(b[0])))) {
    lines.push(`- ${bucket}: ${count}`);
  }
  lines.push('');

  lines.push('## Full Classification');
  lines.push('');
  lines.push('| File | Bucket | Usage Groups | Refs | Reason |');
  lines.push('| --- | --- | --- | ---: | --- |');
  for (const r of map.records) {
    const groups = r.usageGroups.length ? r.usageGroups.join(', ') : '(none found)';
    lines.push(`| ${r.file} | ${r.bucket} | ${groups} | ${r.refCount} | ${String(r.reason).replaceAll('|', '\\|')} |`);
  }

  lines.push('');
  lines.push('## Notes');
  lines.push('- “Referenced only from app group X” is a heuristic; Phase 3 will confirm before moving anything.');
  lines.push('- Missing refs can mean: dynamic import paths, barrel exports, or component used only by tests/stories.');

  return lines.join('\n');
}

function writeJson(outPath, obj) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function writeText(outPath, text) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, text, 'utf8');
}

function main() {
  const outDir = path.join(repoRoot, 'cleanup', 'phase0');

  const routeMap = buildRouteMap();
  const ownershipMap = buildComponentsOwnershipMap();

  writeJson(path.join(outDir, 'route-map.json'), routeMap);
  writeText(path.join(outDir, 'route-map.md'), toMarkdownRouteMap(routeMap));

  writeJson(path.join(outDir, 'components-ownership.json'), ownershipMap);
  writeText(path.join(outDir, 'components-ownership.md'), toMarkdownComponentsOwnership(ownershipMap));

  // Minimal index
  writeText(
    path.join(outDir, 'README.md'),
    [
      '# Phase 0 Outputs',
      '',
      '- route-map.md / route-map.json',
      '- components-ownership.md / components-ownership.json',
      ''
    ].join('\n')
  );

  process.stdout.write(`Wrote Phase 0 outputs to ${posixPath(path.relative(repoRoot, outDir))}\n`);
}

main();
