import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();

const targetFiles = [
  "components/layout/header/mobile/homepage-header.tsx",
  "components/layout/header/mobile/contextual-header.tsx",
  "components/layout/header/mobile/product-header.tsx",
  "components/layout/header/mobile/profile-header.tsx",
  "components/layout/header/mobile/minimal-header.tsx",
  "components/layout/header/cart/mobile-cart-dropdown.tsx",
  "components/mobile/home-sticky-category-pills.tsx",
  "components/mobile/mobile-tab-bar.tsx",
  "components/mobile/product/mobile-bottom-bar.tsx",
  "components/mobile/drawers/category-browse-drawer.tsx",
  "components/mobile/drawers/product-quick-view-drawer.tsx",
  "components/shared/product/product-card.tsx",
  "components/shared/product/product-card-actions.tsx",
  "components/shared/product/quick-view/quick-view-image-gallery.tsx",
  "components/shared/product/quick-view/product-quick-view-content.tsx",
  "components/shared/wishlist/mobile-wishlist-button.tsx",
];

const checks = [
  {
    id: "persistent-blur",
    regex: /\bbackdrop-blur(?:-[a-z]+)?\b/g,
    message: "Avoid backdrop blur on persistent mobile chrome.",
  },
  {
    id: "translucent-background",
    regex: /\bbg-background\/\d{1,3}\b/g,
    message: "Avoid translucent backgrounds on persistent mobile chrome.",
  },
  {
    id: "surface-glass",
    regex: /\bbg-surface-glass\b/g,
    message: "Avoid glass surfaces for persistent mobile chrome.",
  },
  {
    id: "alpha-border",
    regex: /\bborder-border\/\d{1,3}\b/g,
    message: "Use semantic border tokens without alpha fractions.",
  },
  {
    id: "ad-hoc-size",
    regex: /\b(?:h-11|h-12|size-9|size-10|size-11|size-12)\b/g,
    message: "Use control tokens/variants instead of ad-hoc h-/size- classes.",
  },
];

const findings = [];

for (const relativeFile of targetFiles) {
  const abs = path.resolve(projectRoot, relativeFile);
  if (!fs.existsSync(abs)) continue;

  const source = fs.readFileSync(abs, "utf8");
  const lines = source.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    for (const check of checks) {
      check.regex.lastIndex = 0;
      if (!check.regex.test(line)) continue;
      findings.push({
        file: relativeFile,
        line: index + 1,
        check: check.id,
        message: check.message,
        snippet: line.trim(),
      });
    }
  }
}

if (findings.length === 0) {
  console.log("Mobile chrome consistency scan passed (no findings).");
  process.exit(0);
}

const output = [];
output.push("Mobile chrome consistency findings");
output.push("--------------------------------");
for (const finding of findings) {
  output.push(`${finding.file}:${finding.line} [${finding.check}]`);
  output.push(`  ${finding.message}`);
  output.push(`  ${finding.snippet}`);
}
output.push("--------------------------------");
output.push(`Totals: findings=${findings.length}`);

const reportPath = path.resolve(projectRoot, "cleanup/mobile-chrome-scan-report.txt");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${output.join("\n")}\n`, "utf8");

for (const line of output.slice(0, 40)) {
  console.log(line);
}
if (output.length > 40) {
  console.log("...truncated. See full report:", path.relative(projectRoot, reportPath).replaceAll("\\", "/"));
}

if (String(process.env.FAIL_ON_FINDINGS || "") === "1") {
  process.exit(1);
}
