import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

const skipDirNames = new Set([
  ".git",
  ".next",
  ".vercel",
  "node_modules",
  "playwright-report",
  "test-results",
  "storybook-static",
  "dist",
  "build",
]);

const allowedExact = new Set(["README.md", "TASKS.md", "REQUIREMENTS.md", "DESIGN.md"]);

function normalizePath(p) {
  return p.replaceAll("\\", "/");
}

function isAllowedMarkdownPath(relPath) {
  const p = normalizePath(relPath);

  if (allowedExact.has(p)) return true;
  if (p === "AGENTS.md" || p.endsWith("/AGENTS.md")) return true;
  if (p.startsWith("docs/")) return true;
  if (p.startsWith(".codex/")) return true;
  if (p.startsWith("docs-site/")) return true; // internal portal (mirrors from /docs)
  if (p.startsWith(".github/")) return true; // repo metadata (templates, instructions)

  return false;
}

function walkMarkdownFiles(dirAbs, out) {
  const entries = fs.readdirSync(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dirAbs, ent.name);

    if (ent.isDirectory()) {
      if (skipDirNames.has(ent.name)) continue;
      walkMarkdownFiles(abs, out);
      continue;
    }

    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (ext !== ".md" && ext !== ".mdx") continue;

    out.push(abs);
  }
}

function stripMarkdownLinkTarget(raw) {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";

  // `<./file.md>` form
  const withoutAngle =
    trimmed.startsWith("<") && trimmed.endsWith(">")
      ? trimmed.slice(1, -1).trim()
      : trimmed;

  const first = withoutAngle.split(/\s+/)[0] ?? "";
  return first.split("#")[0].split("?")[0] ?? "";
}

function findRelativeLinksInMarkdown(text) {
  const links = [];
  const normalized = String(text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");

  let inCodeFence = false;
  for (const line of normalized.split("\n")) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const re = /\[[^\]]*\]\(([^)]+)\)/g;
    for (const match of line.matchAll(re)) {
      const rawTarget = match[1] ?? "";
      const target = stripMarkdownLinkTarget(rawTarget);
      if (!target) continue;
      links.push(target);
    }
  }

  return links;
}

const markdownFiles = [];
walkMarkdownFiles(projectRoot, markdownFiles);

const disallowed = [];
for (const abs of markdownFiles) {
  const rel = normalizePath(path.relative(projectRoot, abs));
  if (isAllowedMarkdownPath(rel)) continue;
  disallowed.push(rel);
}

const brokenRelativeLinks = [];
for (const abs of markdownFiles) {
  const rel = normalizePath(path.relative(projectRoot, abs));
  if (!rel.startsWith("docs/")) continue;
  const text = fs.readFileSync(abs, "utf8");
  const targets = findRelativeLinksInMarkdown(text);

  for (const target of targets) {
    if (
      target.startsWith("http://") ||
      target.startsWith("https://") ||
      target.startsWith("mailto:") ||
      target.startsWith("tel:") ||
      target.startsWith("#") ||
      target.startsWith("/")
    ) {
      continue;
    }

    const targetAbs = path.resolve(path.dirname(abs), target);
    const ext = path.extname(targetAbs);
    const candidates = [targetAbs];

    const endsWithSlash = target.endsWith("/");
    const hasExt = Boolean(ext);

    if (endsWithSlash) {
      candidates.push(path.join(targetAbs, "index.md"), path.join(targetAbs, "index.mdx"));
    } else if (!hasExt) {
      candidates.push(`${targetAbs}.md`, `${targetAbs}.mdx`);
      candidates.push(path.join(targetAbs, "index.md"), path.join(targetAbs, "index.mdx"));
    }

    const exists = candidates.some((p) => fs.existsSync(p));
    if (!exists) {
      brokenRelativeLinks.push({ from: rel, to: target });
    }
  }
}

let failed = false;

if (disallowed.length) {
  failed = true;
  console.error("DOCS GATE FAIL: markdown files found outside allowed zones:");
  for (const p of disallowed.sort()) console.error(`- ${p}`);
  console.error("");
  console.error("Allowed:");
  console.error("- docs/**");
  console.error("- .codex/**");
  console.error("- **/AGENTS.md");
  console.error("- README.md, TASKS.md, REQUIREMENTS.md, DESIGN.md");
  console.error("- .github/**");
}

if (brokenRelativeLinks.length) {
  failed = true;
  console.error("DOCS GATE FAIL: broken relative markdown links in docs/**:");
  for (const { from, to } of brokenRelativeLinks.sort((a, b) => (a.from + a.to).localeCompare(b.from + b.to))) {
    console.error(`- ${from} -> ${to}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  const rootAgentsPath = path.resolve(projectRoot, "AGENTS.md");
  if (!fs.existsSync(rootAgentsPath)) {
    console.error("DOCS GATE FAIL: missing root AGENTS.md");
    process.exitCode = 1;
  } else {
    const agentsText = fs.readFileSync(rootAgentsPath, "utf8");
    const lineCount = agentsText.replace(/\r\n/g, "\n").split("\n").length;
    if (lineCount > 200) {
      console.error(`DOCS GATE FAIL: root AGENTS.md is too large (${lineCount} lines, max 200).`);
      process.exitCode = 1;
    }
  }
}

if (!process.exitCode) {
  console.log("DOCS GATE OK");
}
