import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const shouldWriteReport = String(process.env.WRITE_CLEANUP_REPORTS || "") === "1";

const targetFiles = [
  "components/layout/header/mobile/homepage-header.tsx",
  "components/layout/header/mobile/contextual-header.tsx",
  "components/layout/header/mobile/product-header.tsx",
  "components/layout/header/mobile/profile-header.tsx",
  "components/layout/header/mobile/minimal-header.tsx",
  "components/layout/header/cart/mobile-cart-dropdown.tsx",
  "components/shared/wishlist/mobile-wishlist-button.tsx",
  "components/layout/sidebar/sidebar-menu.tsx",
  "components/mobile/category-nav/category-circles-simple.tsx",
  "app/[locale]/_components/mobile-tab-bar.tsx",
  "app/[locale]/_components/search/mobile-search-overlay.tsx",
  "app/[locale]/(main)/_components/mobile/home-sticky-category-pills.tsx",
  "app/[locale]/(main)/_components/mobile/home-scope-bar.tsx",
  "app/[locale]/(main)/_components/mobile/home-city-drawer.tsx",
  "app/[locale]/(main)/_components/mobile/home-category-drawer.tsx",
  "app/[locale]/(main)/_components/mobile/promoted-listings-strip.tsx",
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
    regex: /\b(?:h-9|h-10|h-11|h-12|size-9|size-10|size-11)\b/g,
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
if (shouldWriteReport) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${output.join("\n")}\n`, "utf8");
}

for (const line of output.slice(0, 40)) {
  console.log(line);
}
if (output.length > 40) {
  if (shouldWriteReport) {
    console.log("...truncated. See full report:", path.relative(projectRoot, reportPath).replaceAll("\\", "/"));
  } else {
    console.log("...truncated. Set WRITE_CLEANUP_REPORTS=1 to emit a full report file.");
  }
}

if (String(process.env.FAIL_ON_FINDINGS || "") === "1") {
  process.exit(1);
}
