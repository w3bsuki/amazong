import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { collectFilesInDirs, DEFAULT_EXCLUDED_DIR_NAMES } from "./lib/file-walker.mjs";

const ROOT = process.cwd();
const INCLUDE_EXTENSIONS = new Set([".md"]);
const EXCLUDED_DIRS = new Set([...DEFAULT_EXCLUDED_DIR_NAMES, "archive"]);

function toPosix(filePath) {
  return filePath.replaceAll(path.sep, "/");
}

function fileExists(absPath) {
  try {
    fs.accessSync(absPath);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatterKeys(text) {
  if (!text.startsWith("---")) return new Set();
  const lines = text.split(/\r?\n/);
  if (lines.length < 3 || lines[0].trim() !== "---") return new Set();

  const keys = new Set();
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (line === "---") break;
    const keyMatch = /^([A-Za-z0-9_]+):/.exec(line);
    if (keyMatch) keys.add(keyMatch[1]);
  }
  return keys;
}

function shouldSkipLinkTarget(target) {
  if (!target) return true;
  if (target.startsWith("#")) return true;
  if (target.startsWith("http://") || target.startsWith("https://")) return true;
  if (target.startsWith("mailto:") || target.startsWith("tel:")) return true;
  if (target.startsWith("app://")) return true;
  if (target.includes("*") || target.includes("<") || target.includes(">")) return true;
  if (/^\/[A-Za-z]:\//.test(target)) return true;
  return false;
}

function resolveLinkTarget(baseAbsPath, target) {
  const [withoutHash] = target.split("#");
  const [withoutQuery] = withoutHash.split("?");
  const normalized = withoutQuery.trim();
  if (!normalized) return null;

  if (/^[A-Za-z]:\//.test(normalized)) return normalized;
  if (normalized.startsWith("/")) {
    return path.resolve(ROOT, normalized.slice(1));
  }
  return path.resolve(path.dirname(baseAbsPath), normalized);
}

function checkLinkExists(resolvedPath) {
  if (fileExists(resolvedPath)) return true;
  if (!path.extname(resolvedPath)) {
    if (fileExists(`${resolvedPath}.md`)) return true;
    if (fileExists(path.join(resolvedPath, "README.md"))) return true;
  }
  return false;
}

function checkInternalLinks(absPath, text, issues) {
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  let match = null;
  while ((match = linkPattern.exec(text)) !== null) {
    const target = match[1].trim();
    if (shouldSkipLinkTarget(target)) continue;
    const resolved = resolveLinkTarget(absPath, target);
    if (!resolved) continue;
    if (!checkLinkExists(resolved)) {
      issues.push(`[missing-link] ${toPosix(path.relative(ROOT, absPath))} -> ${target}`);
    }
  }
}

function lintDocs() {
  const absFiles = collectFilesInDirs({
    projectRoot: ROOT,
    dirs: ["docs"],
    includeExt: INCLUDE_EXTENSIONS,
    excludedDirNames: EXCLUDED_DIRS,
  });

  const issues = [];
  for (const absPath of absFiles) {
    const relPath = toPosix(path.relative(ROOT, absPath));
    const text = fs.readFileSync(absPath, "utf8");

    checkInternalLinks(absPath, text, issues);

    if (relPath === "docs/state/NOW.md") {
      const keys = parseFrontmatterKeys(text);
      const required = ["updated_at", "phase", "launch_status", "current_focus"];
      for (const key of required) {
        if (!keys.has(key)) {
          issues.push(`[missing-frontmatter-key] ${relPath} -> ${key}`);
        }
      }
    }
  }

  if (issues.length > 0) {
    console.error(`[docs:lint] ${issues.length} issue(s) found.`);
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(`[docs:lint] OK: ${absFiles.length} markdown files checked.`);
}

lintDocs();
