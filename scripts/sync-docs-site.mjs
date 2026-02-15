import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const docsRoot = path.join(repoRoot, "docs");
const contextRoot = path.join(repoRoot, "context");
const docsSiteContentRoot = path.join(repoRoot, "docs-site", "content");
const docsSitePublicRoot = path.join(repoRoot, "docs-site", "public");

const canonicalRouteMap = new Map([
  // Canonical entries (current doc structure)
  ["./GUIDE.md", "/guide"],
  ["./DESIGN.md", "/design"],
  ["./DOMAINS.md", "/domains"],
  ["./QUALITY.md", "/quality"],
  ["./DECISIONS.md", "/decisions"],
  ["./ARCHITECTURE.md", "/engineering"],
  ["./TASKS.md", "/requirements"],
  ["./public/00-INDEX.md", "/public-docs"],
  ["../ARCHITECTURE.md", "/engineering"],
  ["../AGENTS.md", "/guide"],
  ["../REQUIREMENTS.md", "/requirements"],
  // Root-relative paths (used by root-level markdown files like REQUIREMENTS.md)
  ["docs/GUIDE.md", "/guide"],
  ["docs/DESIGN.md", "/design"],
  ["docs/DOMAINS.md", "/domains"],
  ["docs/QUALITY.md", "/quality"],
  ["docs/DECISIONS.md", "/decisions"],
  ["./docs/GUIDE.md", "/guide"],
  ["./docs/DESIGN.md", "/design"],
  ["./docs/DOMAINS.md", "/domains"],
  ["./docs/QUALITY.md", "/quality"],
  ["./docs/DECISIONS.md", "/decisions"],
  // Compatibility aliases — legacy doc paths redirect to new consolidated targets.
  ["./INDEX.md", "/guide"],
  ["./PROJECT.md", "/guide"],
  ["./WORKFLOW.md", "/guide"],
  ["./QA.md", "/guide"],
  ["./RISK.md", "/guide"],
  ["./REFERENCE.md", "/guide"],
  ["./PRINCIPLES.md", "/guide"],
  ["./domain/AUTH.md", "/domains"],
  ["./domain/PAYMENTS.md", "/domains"],
  ["./domain/DATABASE.md", "/domains"],
  ["./domain/API.md", "/domains"],
  ["./domain/ROUTES.md", "/domains"],
  ["./domain/I18N.md", "/domains"],
  ["./ui/DESIGN.md", "/design"],
  ["./ui/FRONTEND.md", "/design"],
  ["../WORKFLOW.md", "/guide"],
  ["../QA.md", "/guide"],
  ["../RISK.md", "/guide"],
  ["../REFERENCE.md", "/guide"],
  ["./AGENTS.md", "/guide"],
  ["./REQUIREMENTS.md", "/requirements"],
  ["docs/PROJECT.md", "/guide"],
  ["docs/ARCHITECTURE.md", "/domains"],
  ["docs/WORKFLOW.md", "/guide"],
  ["docs/QA.md", "/guide"],
  ["docs/RISK.md", "/guide"],
  ["docs/PRINCIPLES.md", "/guide"],
  ["docs/REFERENCE.md", "/guide"],
  ["docs/domain/AUTH.md", "/domains"],
  ["docs/domain/PAYMENTS.md", "/domains"],
  ["docs/domain/API.md", "/domains"],
  ["docs/domain/ROUTES.md", "/domains"],
  ["docs/domain/DATABASE.md", "/domains"],
  ["docs/domain/I18N.md", "/domains"],
  ["docs/ui/DESIGN.md", "/design"],
  ["docs/ui/FRONTEND.md", "/design"],
]);

function normalizePath(p) {
  return p.replaceAll("\\", "/");
}

function humanizeSlug(slug) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
}

function stripStableSectionIds(markdown) {
  return markdown.replace(/^##\s+[a-z0-9][a-z0-9-]*\s*:\s*/gm, "## ");
}

function rewriteMarkdownLinks(markdown) {
  return markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (full, label, targetRaw) => {
    const target = String(targetRaw).trim().split(/\s+/)[0]?.split("#")[0]?.split("?")[0] ?? "";
    if (!target) return full;

    if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("mailto:")) {
      return full;
    }

    // Archive docs are not mirrored into docs-site; keep them visible but not as broken links.
    if (
      target.startsWith("../archive/")
      || target.startsWith("./archive/")
      || target.startsWith("archive/")
      || target.startsWith("../docs/archive/")
      || target.startsWith("./docs/archive/")
      || target.startsWith("docs/archive/")
    ) {
      const clean = target.replace(/^(\.\.\/)+/, "docs/").replace(/^\.\//, "docs/");
      return `${label} (\`${clean}\`)`;
    }

    // Generated docs are repo artifacts and not mirrored into docs-site content.
    if (
      target.startsWith("../generated/")
      || target.startsWith("./generated/")
      || target.startsWith("generated/")
      || target.startsWith("../docs/generated/")
      || target.startsWith("./docs/generated/")
      || target.startsWith("docs/generated/")
    ) {
      const clean = target.replace(/^(\.\.\/)+/, "docs/").replace(/^\.\//, "docs/");
      return `${label} (\`${clean}\`)`;
    }

    const mapped = canonicalRouteMap.get(target) ?? canonicalRouteMap.get(`./${target}`);
    if (mapped) {
      return `[${label}](${mapped})`;
    }

    const businessPrefixVariants = ["../../context/business/", "../context/business/", "./context/business/"];
    for (const prefix of businessPrefixVariants) {
      if (target.startsWith(prefix)) {
        const rest = target.slice(prefix.length).replace(/\.(md|mdx)$/i, "");
        return `[${label}](/business/${rest})`;
      }
    }

    if (/^\.\.\/(app|components|lib|scripts)\//.test(target)) {
      const clean = target.replace(/^\.\.\//, "");
      return `${label} (\`${clean}\`)`;
    }

    return full;
  });
}

function transformMarkdown(markdown) {
  return rewriteMarkdownLinks(stripStableSectionIds(markdown)).replace(/\r\n/g, "\n");
}

async function pathExists(absPath) {
  try {
    await fs.access(absPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(absPath) {
  await fs.mkdir(absPath, { recursive: true });
}

async function removeDir(absPath) {
  await fs.rm(absPath, { recursive: true, force: true });
}

async function readText(absPath) {
  return await fs.readFile(absPath, "utf8");
}

async function writeText(absPath, text) {
  await ensureDir(path.dirname(absPath));
  await fs.writeFile(absPath, text, "utf8");
}

async function listDir(absPath) {
  return await fs.readdir(absPath, { withFileTypes: true });
}

async function mirrorMarkdownTree(srcDirAbs, destDirAbs) {
  if (!(await pathExists(srcDirAbs))) return;

  const entries = await listDir(srcDirAbs);
  await ensureDir(destDirAbs);

  for (const entry of entries) {
    const srcAbs = path.join(srcDirAbs, entry.name);
    const destAbs = path.join(destDirAbs, entry.name);

    if (entry.isDirectory()) {
      await mirrorMarkdownTree(srcAbs, destAbs);
      continue;
    }
    if (!entry.isFile()) continue;
    if (/^AGENTS\.mdx?$/i.test(entry.name)) continue;

    const ext = path.extname(entry.name).toLowerCase();
    if (ext !== ".md" && ext !== ".mdx") continue;

    const content = await readText(srcAbs);
    const outName = entry.name.replace(/\.(md|mdx)$/i, ".mdx");
    const outAbs = path.join(destDirAbs, outName);
    await writeText(outAbs, transformMarkdown(content));
  }
}

async function writeCorePages() {
  const corePages = [
    { sourceAbs: path.join(repoRoot, "ARCHITECTURE.md"), target: "engineering.mdx" },
    { sourceAbs: path.join(repoRoot, "REQUIREMENTS.md"), target: "requirements.mdx" },
    { sourceAbs: path.join(docsRoot, "GUIDE.md"), target: "guide.mdx" },
    { sourceAbs: path.join(docsRoot, "DESIGN.md"), target: "design.mdx" },
    { sourceAbs: path.join(docsRoot, "DOMAINS.md"), target: "domains.mdx" },
    { sourceAbs: path.join(docsRoot, "QUALITY.md"), target: "quality.mdx" },
    { sourceAbs: path.join(docsRoot, "DECISIONS.md"), target: "decisions.mdx" },
    { sourceAbs: path.join(docsRoot, "public", "00-INDEX.md"), target: "public-docs.mdx" },
  ];

  for (const page of corePages) {
    if (!(await pathExists(page.sourceAbs))) continue;
    const targetAbs = path.join(docsSiteContentRoot, page.target);
    const content = await readText(page.sourceAbs);
    await writeText(targetAbs, transformMarkdown(content));
  }
}

async function writePublicMirrors() {
  const policiesMap = [
    ["legal/terms.en.md", "policies/terms.mdx"],
    ["legal/privacy.en.md", "policies/privacy.mdx"],
    ["legal/cookies.en.md", "policies/cookies.mdx"],
    ["policies/returns.en.md", "policies/returns.mdx"],
    ["policies/prohibited-items.en.md", "policies/prohibited-items.mdx"],
    ["policies/kyc.en.md", "policies/kyc.mdx"],
    ["policies/jurisdictions.en.md", "policies/jurisdictions.mdx"],
  ];

  const helpMap = [
    ["help/account-security.en.md", "help/account-security.mdx"],
    ["help/buyer-protection.en.md", "help/buyer-protection.mdx"],
    ["help/disputes.en.md", "help/disputes.mdx"],
    ["help/shipping.en.md", "help/shipping.mdx"],
  ];

  for (const [sourceRel, targetRel] of [...policiesMap, ...helpMap]) {
    const sourceAbs = path.join(docsRoot, "public", sourceRel);
    if (!(await pathExists(sourceAbs))) continue;
    const targetAbs = path.join(docsSiteContentRoot, targetRel);
    await writeText(targetAbs, transformMarkdown(await readText(sourceAbs)));
  }

  await writeText(
    path.join(docsSiteContentRoot, "policies", "index.mdx"),
    `# Policies (EN Mirror)

These pages mirror \`docs/public/**\` (English) for internal review.
`,
  );

  await writeText(
    path.join(docsSiteContentRoot, "help", "index.mdx"),
    `# Help (EN Mirror)

These pages mirror \`docs/public/help/**\` (English) for internal review.
`,
  );
}

async function writeHomePage() {
  await writeText(
    path.join(docsSiteContentRoot, "index.mdx"),
    `# Treido Marketplace Documentation (Internal)

> **INTERNAL ONLY.** This portal mirrors canonical documentation in \`/docs/**\`.

## Primary Sections

- [Docs Index](/)
- [Engineering](/engineering)
- [Requirements](/requirements)
- [Guide](/guide)
- [Design](/design)
- [Domains](/domains)
- [Quality](/quality)
- [Decisions](/decisions)
- [Public Docs](/public-docs)

## Other

- [Business (Archive)](/business)
- [Policies](/policies)
- [Help](/help)
`,
  );
}

async function buildMetaForDirectory(dirAbs) {
  const entries = (await listDir(dirAbs))
    .filter((entry) => entry.name !== "_meta.js")
    .sort((a, b) => a.name.localeCompare(b.name));

  const rows = [];
  for (const entry of entries) {
    const abs = path.join(dirAbs, entry.name);
    if (entry.isDirectory()) {
      rows.push({ key: entry.name, value: humanizeSlug(entry.name) });
      await buildMetaForDirectory(abs);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith(".mdx")) continue;

    const key = path.basename(entry.name, ".mdx");
    const title = key === "index" ? "Overview" : humanizeSlug(key);
    rows.push({ key, value: title });
  }

  const indexRow = rows.find((row) => row.key === "index");
  const nonIndexRows = rows.filter((row) => row.key !== "index");
  const sortedRows = indexRow ? [indexRow, ...nonIndexRows] : nonIndexRows;

  const js = [
    "export default {",
    ...sortedRows.map((row) => `  ${JSON.stringify(row.key)}: ${JSON.stringify(row.value)},`),
    "}",
    "",
  ].join("\n");

  await writeText(path.join(dirAbs, "_meta.js"), js);
}

function findRelativeLinks(markdown) {
  const links = [];
  const lines = String(markdown ?? "").split("\n");
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    for (const match of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const rawTarget = String(match[1] ?? "").trim();
      if (!rawTarget) continue;
      const target = rawTarget.split(/\s+/)[0]?.split("#")[0]?.split("?")[0] ?? "";
      if (!target) continue;
      links.push(target);
    }
  }

  return links;
}

async function checkBrokenLinksInDocsSite() {
  const files = [];

  async function walk(dirAbs) {
    const entries = await listDir(dirAbs);
    for (const entry of entries) {
      const abs = path.join(dirAbs, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
      files.push(abs);
    }
  }

  await walk(docsSiteContentRoot);
  const errors = [];

  for (const fileAbs of files) {
    const markdown = await readText(fileAbs);
    const links = findRelativeLinks(markdown);
    const fileRel = normalizePath(path.relative(repoRoot, fileAbs));

    for (const link of links) {
      if (
        link.startsWith("http://")
        || link.startsWith("https://")
        || link.startsWith("mailto:")
        || link.startsWith("tel:")
        || link.startsWith("#")
        || link.startsWith("/")
      ) {
        continue;
      }

      const base = path.dirname(fileAbs);
      const abs = path.resolve(base, link);
      const ext = path.extname(abs).toLowerCase();
      const candidates = [abs];
      if (!ext) {
        candidates.push(`${abs}.mdx`, `${abs}.md`, path.join(abs, "index.mdx"), path.join(abs, "index.md"));
      } else if (ext === ".md") {
        candidates.push(abs.replace(/\.md$/i, ".mdx"));
      }

      const exists = (
        await Promise.all(
          candidates.map(async (candidate) => {
            try {
              await fs.access(candidate);
              return true;
            } catch {
              return false;
            }
          }),
        )
      ).some(Boolean);

      if (!exists) {
        errors.push(`${fileRel} -> ${link}`);
      }
    }
  }

  return errors;
}

async function main() {
  await removeDir(docsSiteContentRoot);
  await ensureDir(docsSiteContentRoot);
  await ensureDir(docsSitePublicRoot);

  await writeHomePage();
  await writeCorePages();
  await mirrorMarkdownTree(path.join(contextRoot, "business"), path.join(docsSiteContentRoot, "business"));
  await writePublicMirrors();
  await buildMetaForDirectory(docsSiteContentRoot);

  const linkErrors = await checkBrokenLinksInDocsSite();
  if (linkErrors.length > 0) {
    process.stderr.write("docs-site sync failed: unresolved links found:\n");
    for (const error of linkErrors.sort()) {
      process.stderr.write(`- ${error}\n`);
    }
    process.exitCode = 1;
    return;
  }

  process.stdout.write("docs-site sync complete\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
