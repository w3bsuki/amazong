import fs from "node:fs";
import path from "node:path";

export const DEFAULT_INCLUDE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".mjs"]);

export const DEFAULT_EXCLUDED_DIR_NAMES = new Set([
  ".git",
  ".next",
  "node_modules",
  "dist",
  "build",
  "coverage",
]);

export function isDirectory(absPath) {
  try {
    return fs.statSync(absPath).isDirectory();
  } catch {
    return false;
  }
}

function walkFiles(dirAbs, out, includeExt, excludedDirNames) {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name);

    if (ent.isDirectory()) {
      if (excludedDirNames.has(ent.name)) continue;
      walkFiles(abs, out, includeExt, excludedDirNames);
      continue;
    }

    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!includeExt.has(ext)) continue;
    out.push(abs);
  }
}

export function collectFilesInDirs({
  projectRoot,
  dirs,
  includeExt = DEFAULT_INCLUDE_EXTENSIONS,
  excludedDirNames = DEFAULT_EXCLUDED_DIR_NAMES,
}) {
  const allFiles = [];

  for (const dir of dirs) {
    const abs = path.resolve(projectRoot, dir);
    if (!isDirectory(abs)) continue;
    walkFiles(abs, allFiles, includeExt, excludedDirNames);
  }

  return allFiles;
}

