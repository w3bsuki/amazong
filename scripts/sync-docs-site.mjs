import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());

const docsRoot = path.join(repoRoot, "docs");
const publicDocsRoot = path.join(docsRoot, "public");
const docsSiteContentRoot = path.join(repoRoot, "docs-site", "content");

async function ensureDir(dirAbs) {
  await fs.mkdir(dirAbs, { recursive: true });
}

async function writeTextFile(destAbs, content) {
  await ensureDir(path.dirname(destAbs));
  await fs.writeFile(destAbs, content, "utf8");
}

async function readTextFile(srcAbs) {
  return await fs.readFile(srcAbs, "utf8");
}

async function removeAllMdx(dirAbs) {
  try {
    const entries = await fs.readdir(dirAbs, { withFileTypes: true });
    await Promise.all(
      entries.map(async (ent) => {
        const abs = path.join(dirAbs, ent.name);
        if (ent.isDirectory()) return await removeAllMdx(abs);
        if (ent.isFile() && abs.toLowerCase().endsWith(".mdx")) {
          await fs.unlink(abs);
        }
      }),
    );
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return;
    throw error;
  }
}

async function copyMdxTree({ srcDirAbs, destDirAbs }) {
  const entries = await fs.readdir(srcDirAbs, { withFileTypes: true });
  await ensureDir(destDirAbs);

  for (const ent of entries) {
    const srcAbs = path.join(srcDirAbs, ent.name);
    const destAbs = path.join(destDirAbs, ent.name);

    if (ent.isDirectory()) {
      await copyMdxTree({ srcDirAbs: srcAbs, destDirAbs: destAbs });
      continue;
    }

    if (!ent.isFile()) continue;
    if (!ent.name.toLowerCase().endsWith(".mdx")) continue;

    await fs.copyFile(srcAbs, destAbs);
  }
}

function stripStableSectionIds(markdown) {
  // Public docs use: `## <id>: <Title>` for stable IDs across locales.
  // In docs-site we prefer clean headings.
  return markdown.replace(/^##\s+[a-z0-9][a-z0-9-]*\s*:\s*/gm, "## ");
}

async function syncPublicDocToPolicies({ docKey, outBasename }) {
  const srcAbs = path.join(publicDocsRoot, `${docKey}.en.md`);
  const destAbs = path.join(docsSiteContentRoot, "policies", `${outBasename}.mdx`);
  const raw = await readTextFile(srcAbs);
  const transformed = stripStableSectionIds(raw);
  await writeTextFile(destAbs, transformed);
}

async function syncHelpDoc({ slug }) {
  const srcAbs = path.join(publicDocsRoot, "help", `${slug}.en.md`);
  const destAbs = path.join(docsSiteContentRoot, "help", `${slug}.mdx`);
  const raw = await readTextFile(srcAbs);
  const transformed = stripStableSectionIds(raw);
  await writeTextFile(destAbs, transformed);
}

async function main() {
  await ensureDir(docsSiteContentRoot);

  // Keep docs-site deterministic by rewriting generated MDX content.
  await removeAllMdx(path.join(docsSiteContentRoot, "business"));
  await removeAllMdx(path.join(docsSiteContentRoot, "payments"));
  await removeAllMdx(path.join(docsSiteContentRoot, "guides"));
  await removeAllMdx(path.join(docsSiteContentRoot, "policies"));
  await removeAllMdx(path.join(docsSiteContentRoot, "help"));

  // Mirror internal SSOT docs (mdx trees).
  await copyMdxTree({
    srcDirAbs: path.join(docsRoot, "business"),
    destDirAbs: path.join(docsSiteContentRoot, "business"),
  });
  await copyMdxTree({
    srcDirAbs: path.join(docsRoot, "payments"),
    destDirAbs: path.join(docsSiteContentRoot, "payments"),
  });
  await copyMdxTree({
    srcDirAbs: path.join(docsRoot, "guides"),
    destDirAbs: path.join(docsSiteContentRoot, "guides"),
  });

  // Mirror public SSOT docs (English-only view for internal portal).
  await syncPublicDocToPolicies({ docKey: "legal/terms", outBasename: "terms" });
  await syncPublicDocToPolicies({ docKey: "legal/privacy", outBasename: "privacy" });
  await syncPublicDocToPolicies({ docKey: "legal/cookies", outBasename: "cookies" });
  await syncPublicDocToPolicies({ docKey: "policies/returns", outBasename: "returns" });
  await syncPublicDocToPolicies({ docKey: "policies/prohibited-items", outBasename: "prohibited-items" });
  await syncPublicDocToPolicies({ docKey: "policies/kyc", outBasename: "kyc" });
  await syncPublicDocToPolicies({ docKey: "policies/jurisdictions", outBasename: "jurisdictions" });

  await syncHelpDoc({ slug: "buyer-protection" });
  await syncHelpDoc({ slug: "disputes" });
  await syncHelpDoc({ slug: "shipping" });
  await syncHelpDoc({ slug: "account-security" });

  // Root pages (internal portal UX).
  await writeTextFile(
    path.join(docsSiteContentRoot, "index.mdx"),
    `# Treido Marketplace Documentation (Internal)

> **INTERNAL ONLY.** This docs portal mirrors the canonical documentation stored in \`/docs/**\`.

## Quick Navigation

| Section | Description |
|---------|-------------|
| [🧭 Platform](/platform) | Product requirements and scope |
| [💳 Payments](/payments) | Payments docs (deep dives) |
| [📜 Policies](/policies) | Legal + policy SSOT (EN mirror) |
| [🆘 Help](/help) | Help center SSOT (EN mirror) |
| [🎨 Design](/design) | Design + Tailwind v4 rails |
| [🔧 Engineering](/engineering) | Architecture + server patterns |
| [💼 Business](/business) | Monetization, ops, investor pack |
| [📚 Guides](/guides) | Development guides |
| [🚀 Production](/production) | Launch + production checklist |

## Governance

- **SSOT**: \`docs/00-INDEX.md\`
- **Public copy SSOT**: \`docs/public/00-INDEX.md\`
- **Business SSOT**: \`docs/business/00-INDEX.md\`
`,
  );

  // Mirror selected core docs into existing top-level pages.
  await writeTextFile(
    path.join(docsSiteContentRoot, "platform.mdx"),
    stripStableSectionIds(await readTextFile(path.join(docsRoot, "01-PRD.md"))),
  );
  await writeTextFile(
    path.join(docsSiteContentRoot, "engineering.mdx"),
    stripStableSectionIds(await readTextFile(path.join(docsRoot, "03-ARCHITECTURE.md"))),
  );
  await writeTextFile(
    path.join(docsSiteContentRoot, "design.mdx"),
    stripStableSectionIds(await readTextFile(path.join(docsRoot, "04-DESIGN.md"))),
  );
  await writeTextFile(
    path.join(docsSiteContentRoot, "production.mdx"),
    stripStableSectionIds(await readTextFile(path.join(docsRoot, "12-LAUNCH.md"))),
  );

  // Minimal section indexes for docs-site navigation.
  await writeTextFile(
    path.join(docsSiteContentRoot, "policies", "index.mdx"),
    `# Policies (EN Mirror)

These pages mirror \`docs/public/**\` (English) for internal review.

- [Terms](/policies/terms)
- [Privacy](/policies/privacy)
- [Cookies](/policies/cookies)
- [Returns & Refunds](/policies/returns)
- [Prohibited Items](/policies/prohibited-items)
- [KYC / KYB / AML](/policies/kyc)
- [Jurisdictions](/policies/jurisdictions)
`,
  );

  await writeTextFile(
    path.join(docsSiteContentRoot, "help", "index.mdx"),
    `# Help (EN Mirror)

These pages mirror \`docs/public/help/**\` (English) for internal review.

- [Buyer Protection](/help/buyer-protection)
- [Disputes](/help/disputes)
- [Shipping](/help/shipping)
- [Account Security](/help/account-security)
`,
  );

  await writeTextFile(
    path.join(docsSiteContentRoot, "help", "_meta.js"),
    `export default {
  index: "Overview",
  "buyer-protection": "Buyer Protection",
  disputes: "Disputes",
  shipping: "Shipping",
  "account-security": "Account Security",
}
`,
  );

  await writeTextFile(
    path.join(docsSiteContentRoot, "_meta.js"),
    `export default {
  index: { title: "Home", type: "page" },
  platform: { title: "Platform Overview" },
  payments: { title: "Payments" },
  policies: { title: "Policies" },
  help: { title: "Help" },
  changelog: { title: "Changelog" },
  engineering: { title: "Engineering" },
  design: { title: "Design System" },
  business: { title: "Business" },
  guides: { title: "Guides" },
  production: { title: "Production" },
}
`,
  );

  process.stdout.write("docs-site sync complete\n");
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});

