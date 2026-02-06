import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());
const docsRoot = path.join(repoRoot, "docs");
const docsSiteContentRoot = path.join(repoRoot, "docs-site", "content");
const docsSitePublicRoot = path.join(repoRoot, "docs-site", "public");

const canonicalRouteMap = new Map([
  ["./INDEX.md", "/"],
  ["./PRD.md", "/platform"],
  ["./FEATURES.md", "/features"],
  ["./ARCHITECTURE.md", "/engineering"],
  ["./DESIGN.md", "/design"],
  ["./ROUTES.md", "/routes"],
  ["./DATABASE.md", "/database"],
  ["./API.md", "/api"],
  ["./PAYMENTS.md", "/payments-overview"],
  ["./AUTH.md", "/auth"],
  ["./I18N.md", "/i18n"],
  ["./SKILLS.md", "/skills"],
  ["./LAUNCH.md", "/launch"],
  ["./PRODUCTION-PUSH.md", "/production"],
  ["./DEV-DEPARTMENT.md", "/dev-department"],
  ["./AGENTS.md", "/agents"],
  ["./WORKFLOW.md", "/workflow"],
  ["./AGENT-MAP.md", "/agent-map"],
  ["./PROMPT-GUIDE.md", "/prompt-guide"],
  ["./SKILLS-GUIDE.md", "/skills-guide"],
  ["./DOCS-PLAN.md", "/docs-plan"],
  ["./APP-FEEL-GUIDE.md", "/app-feel-guide"],
  ["./APP-FEEL-COMPONENTS.md", "/app-feel-components"],
  ["./APP-FEEL-CHECKLIST.md", "/app-feel-checklist"],
  ["./14-UI-UX-PLAN.md", "/ui-ux-plan"],
  ["./refactor.md", "/refactor"],
  ["./business/00-INDEX.md", "/business/00-INDEX"],
  ["./public/00-INDEX.md", "/public-docs"],
  ["./admin/00-INDEX.md", "/admin-docs-governance"],
  ["./agents/AGENTS_PHASES.md", "/agent-fleet-roadmap"],
  ["./status/LAUNCH-READINESS.yaml", "/launch-status"],
  ["./00-INDEX.md", "/"],
  ["./01-PRD.md", "/platform"],
  ["./02-FEATURES.md", "/features"],
  ["./03-ARCHITECTURE.md", "/engineering"],
  ["./04-DESIGN.md", "/design"],
  ["./05-ROUTES.md", "/routes"],
  ["./06-DATABASE.md", "/database"],
  ["./07-API.md", "/api"],
  ["./08-PAYMENTS.md", "/payments-overview"],
  ["./09-AUTH.md", "/auth"],
  ["./10-I18N.md", "/i18n"],
  ["./11-SKILLS.md", "/skills"],
  ["./12-LAUNCH.md", "/launch"],
  ["./13-PRODUCTION-PUSH.md", "/production"],
  ["./15-DEV-DEPARTMENT.md", "/dev-department"],
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
    { source: "INDEX.md", target: "docs-index.mdx", title: "Docs Index" },
    { source: "PRD.md", target: "platform.mdx", title: "Platform Overview" },
    { source: "FEATURES.md", target: "features.mdx", title: "Feature Status" },
    { source: "ARCHITECTURE.md", target: "engineering.mdx", title: "Engineering" },
    { source: "DESIGN.md", target: "design.mdx", title: "Design System" },
    { source: "ROUTES.md", target: "routes.mdx", title: "Routes" },
    { source: "DATABASE.md", target: "database.mdx", title: "Database" },
    { source: "API.md", target: "api.mdx", title: "API" },
    { source: "PAYMENTS.md", target: "payments-overview.mdx", title: "Payments Overview" },
    { source: "AUTH.md", target: "auth.mdx", title: "Auth" },
    { source: "I18N.md", target: "i18n.mdx", title: "i18n" },
    { source: "SKILLS.md", target: "skills.mdx", title: "Skill Fleet" },
    { source: "LAUNCH.md", target: "launch.mdx", title: "Launch" },
    { source: "PRODUCTION-PUSH.md", target: "production.mdx", title: "Production Push" },
    { source: "DEV-DEPARTMENT.md", target: "dev-department.mdx", title: "Dev Department" },
    { source: "AGENTS.md", target: "agents.mdx", title: "Agent Entry" },
    { source: "WORKFLOW.md", target: "workflow.mdx", title: "Workflow" },
    { source: "AGENT-MAP.md", target: "agent-map.mdx", title: "Agent Map" },
    { source: "PROMPT-GUIDE.md", target: "prompt-guide.mdx", title: "Prompt Guide" },
    { source: "SKILLS-GUIDE.md", target: "skills-guide.mdx", title: "Skills Guide" },
    { source: "DOCS-PLAN.md", target: "docs-plan.mdx", title: "Docs Plan" },
    { source: "APP-FEEL-GUIDE.md", target: "app-feel-guide.mdx", title: "App Feel Guide" },
    { source: "APP-FEEL-COMPONENTS.md", target: "app-feel-components.mdx", title: "App Feel Components" },
    { source: "APP-FEEL-CHECKLIST.md", target: "app-feel-checklist.mdx", title: "App Feel Checklist" },
    { source: "14-UI-UX-PLAN.md", target: "ui-ux-plan.mdx", title: "UI UX Plan" },
    { source: "refactor.md", target: "refactor.mdx", title: "Refactor Program" },
    { source: "admin/00-INDEX.md", target: "admin-docs-governance.mdx", title: "Admin Docs Governance" },
    { source: "agents/AGENTS_PHASES.md", target: "agent-fleet-roadmap.mdx", title: "Deprecated Agent Fleet Roadmap" },
    { source: "public/00-INDEX.md", target: "public-docs.mdx", title: "Public Docs Index" },
  ];

  for (const page of corePages) {
    const sourceAbs = path.join(docsRoot, page.source);
    const targetAbs = path.join(docsSiteContentRoot, page.target);
    const content = await readText(sourceAbs);
    await writeText(targetAbs, transformMarkdown(content));
  }

  const launchStatusRaw = await readText(path.join(docsRoot, "status", "LAUNCH-READINESS.yaml"));
  const launchStatusPage = [
    "# Launch Status (Machine Ledger)",
    "",
    "Canonical machine-readable launch status sourced from `docs/status/LAUNCH-READINESS.yaml`.",
    "",
    "```json",
    launchStatusRaw.trim(),
    "```",
    "",
  ].join("\n");
  await writeText(path.join(docsSiteContentRoot, "launch-status.mdx"), launchStatusPage);
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

## Canonical Sources

- \`docs/INDEX.md\`
- \`docs/public/00-INDEX.md\`
- \`docs/business/00-INDEX.md\`

## Primary Sections

- [Platform](/platform)
- [Features](/features)
- [Engineering](/engineering)
- [Design](/design)
- [Business](/business)
- [Payments](/payments)
- [Policies](/policies)
- [Help](/help)
- [Launch](/launch)
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
  await mirrorMarkdownTree(path.join(docsRoot, "business"), path.join(docsSiteContentRoot, "business"));
  await mirrorMarkdownTree(path.join(docsRoot, "payments"), path.join(docsSiteContentRoot, "payments"));
  await mirrorMarkdownTree(path.join(docsRoot, "guides"), path.join(docsSiteContentRoot, "guides"));
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
