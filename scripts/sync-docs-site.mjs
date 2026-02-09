import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const docsRoot = path.join(repoRoot, "docs");
const docsSiteContentRoot = path.join(repoRoot, "docs-site", "content");
const docsSitePublicRoot = path.join(repoRoot, "docs-site", "public");

const canonicalRouteMap = new Map([
  ["./PRD.md", "/platform"],
  ["./ARCHITECTURE.md", "/engineering"],
  ["./DATABASE.md", "/database"],
  ["./API.md", "/api"],
  ["./AUTH.md", "/auth"],
  ["./PAYMENTS.md", "/payments"],
  ["./I18N.md", "/i18n"],
  ["./ROUTES.md", "/routes"],
  ["./PRODUCTION.md", "/production"],
  ["./TESTING.md", "/testing"],
  ["./WORKFLOW.md", "/workflow"],
  ["./PROMPTS.md", "/prompts"],
  ["./public/00-INDEX.md", "/public-docs"],
  ["./features/selling.md", "/features/selling"],
  ["./features/buying.md", "/features/buying"],
  ["./features/chat.md", "/features/chat"],
  ["./features/monetization.md", "/features/monetization"],
  ["./features/plans.md", "/features/plans"],
  ["./features/trust-safety.md", "/features/trust-safety"],
  ["./features/search-discovery.md", "/features/search-discovery"],
  ["./features/app-feel.md", "/features/app-feel"],
  ["./features/onboarding.md", "/features/onboarding"],
  // Deleted files — redirect to closest equivalent
  ["./FEATURES.md", "/platform"],
  ["./INDEX.md", "/"],
  ["./DESIGN.md", "/"],
  ["./AGENTS.md", "/workflow"],
  // Parent-relative links used in features/ and core doc cross-references
  ["../PRD.md", "/platform"],
  ["../ARCHITECTURE.md", "/engineering"],
  ["../DATABASE.md", "/database"],
  ["../API.md", "/api"],
  ["../AUTH.md", "/auth"],
  ["../PAYMENTS.md", "/payments"],
  ["../I18N.md", "/i18n"],
  ["../ROUTES.md", "/routes"],
  ["../PRODUCTION.md", "/production"],
  ["../TESTING.md", "/testing"],
  ["../WORKFLOW.md", "/workflow"],
  ["../AGENTS.md", "/workflow"],
  // Root file cross-references (from docs/ to root)
  ["../DESIGN.md", "/"],
  ["../REQUIREMENTS.md", "/platform"],
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

    const mapped = canonicalRouteMap.get(target);
    if (mapped) {
      return `[${label}](${mapped})`;
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

async function mirrorMarkdownTree(srcDirAbs, destDirAbs, options = {}) {
  const entries = await listDir(srcDirAbs);
  await ensureDir(destDirAbs);

  for (const entry of entries) {
    const srcAbs = path.join(srcDirAbs, entry.name);
    const destAbs = path.join(destDirAbs, entry.name);

    if (entry.isDirectory()) {
      await mirrorMarkdownTree(srcAbs, destAbs, options);
      continue;
    }
    if (!entry.isFile()) continue;

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
    { source: "PRD.md", target: "platform.mdx", title: "Platform Overview" },
    { source: "ARCHITECTURE.md", target: "engineering.mdx", title: "Engineering" },
    { source: "DATABASE.md", target: "database.mdx", title: "Database" },
    { source: "API.md", target: "api.mdx", title: "API" },
    { source: "AUTH.md", target: "auth.mdx", title: "Auth" },
    { source: "PAYMENTS.md", target: "payments.mdx", title: "Payments" },
    { source: "I18N.md", target: "i18n.mdx", title: "i18n" },
    { source: "ROUTES.md", target: "routes.mdx", title: "Routes" },
    { source: "PRODUCTION.md", target: "production.mdx", title: "Production Readiness" },
    { source: "TESTING.md", target: "testing.mdx", title: "Testing" },
    { source: "WORKFLOW.md", target: "workflow.mdx", title: "Workflow" },
    { source: "PROMPTS.md", target: "prompts.mdx", title: "Phase Prompts" },
    { source: "public/00-INDEX.md", target: "public-docs.mdx", title: "Public Docs Index" },
  ];

  for (const page of corePages) {
    const sourceAbs = path.join(docsRoot, page.source);
    const targetAbs = path.join(docsSiteContentRoot, page.target);
    const content = await readText(sourceAbs);
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

- [Platform](/platform)
- [Engineering](/engineering)
- [Database](/database)
- [API](/api)
- [Auth](/auth)
- [Payments](/payments)
- [i18n](/i18n)
- [Routes](/routes)
- [Production Readiness](/production)
- [Testing](/testing)
- [Workflow](/workflow)

## Feature Specs

- [Selling](/features/selling)
- [Buying](/features/buying)
- [Chat](/features/chat)
- [Monetization](/features/monetization)
- [Plans](/features/plans)
- [Trust & Safety](/features/trust-safety)
- [Search & Discovery](/features/search-discovery)
- [App Feel](/features/app-feel)
- [Onboarding](/features/onboarding)

## Other

- [Business](/business)
- [Policies](/policies)
- [Help](/help)
- [Guides](/guides)
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
        link.startsWith("http://") ||
        link.startsWith("https://") ||
        link.startsWith("mailto:") ||
        link.startsWith("tel:") ||
        link.startsWith("#") ||
        link.startsWith("/")
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
        // Mirror process renames .md → .mdx
        candidates.push(abs.replace(/\.md$/i, ".mdx"));
      }

      const exists = (await Promise.all(candidates.map(async (candidate) => {
        try {
          await fs.access(candidate);
          return true;
        } catch {
          return false;
        }
      }))).some(Boolean);

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
  await mirrorMarkdownTree(path.join(docsRoot, "features"), path.join(docsSiteContentRoot, "features"));
  await mirrorMarkdownTree(path.join(docsRoot, "business"), path.join(docsSiteContentRoot, "business"));
  await mirrorMarkdownTree(path.join(docsRoot, "guides"), path.join(docsSiteContentRoot, "guides"));
  await mirrorMarkdownTree(path.join(docsRoot, "runbooks"), path.join(docsSiteContentRoot, "runbooks"));
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
