import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const shouldWriteReport = String(process.env.WRITE_CLEANUP_REPORTS || "") === "1";

const targetFiles = [
  "components/mobile/chrome/mobile-bottom-nav.tsx",
  "components/mobile/chrome/mobile-control-recipes.ts",
  "components/mobile/category-nav/filter-sort-bar.tsx",
  "components/layout/header/mobile/homepage-header.tsx",
  "components/layout/header/mobile/contextual-header.tsx",
  "components/layout/header/mobile/product-header.tsx",
  "components/layout/header/mobile/profile-header.tsx",
  "components/layout/header/mobile/minimal-header.tsx",
  "app/[locale]/_components/mobile-tab-bar.tsx",
  "app/[locale]/(main)/_lib/mobile-rail-class-recipes.ts",
  "app/[locale]/(main)/_components/filters/mobile-filter-controls.tsx",
  "app/[locale]/(main)/search/_components/mobile-seller-filter-controls.tsx",
  "app/[locale]/(account)/account/_components/account-header.tsx",
  "app/[locale]/(account)/account/_components/account-tab-bar.tsx",
  "app/[locale]/(checkout)/_components/checkout-header.tsx",
  "app/[locale]/(plans)/_components/minimal-header.tsx",
  "app/[locale]/(sell)/_components/ui/progress-header.tsx",
  "app/[locale]/(sell)/_components/layouts/stepper-wrapper.tsx",
  "components/layout/header/cart/mobile-cart-dropdown.tsx",
  "components/shared/wishlist/mobile-wishlist-button.tsx",
  "components/layout/sidebar/sidebar-menu.tsx",
  "app/[locale]/_components/search/mobile-search-overlay.tsx",
];

const checks = [
  {
    id: "bottom-nav-glass",
    files: ["components/mobile/chrome/mobile-bottom-nav.tsx"],
    regex: /\b(?:backdrop-blur(?:-[a-z]+)?|bg-surface-glass)\b/g,
    message: "Use a flat semantic bottom nav surface; avoid glass/blur treatment.",
  },
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
  {
    id: "primary-nav-text-2xs",
    files: ["app/[locale]/(account)/account/_components/account-tab-bar.tsx"],
    regex: /\btext-2xs\b/g,
    message: "Primary mobile nav labels should be at least text-xs.",
  },
  {
    id: "rail-height-hardcoded",
    files: [
      "components/mobile/chrome/mobile-control-recipes.ts",
      "components/mobile/category-nav/filter-sort-bar.tsx",
      "app/[locale]/(main)/_components/filters/mobile-filter-controls.tsx",
      "app/[locale]/(main)/search/_components/mobile-seller-filter-controls.tsx",
    ],
    regex: /\b(?:min-h-(?:8|9|10|11|12)|h-(?:8|9|10|11|12))\b/g,
    message: "Use tokenized control heights in mobile tab/pill rails.",
  },
];

const railTokenRequirements = [
  {
    file: "components/mobile/chrome/mobile-control-recipes.ts",
    regex: /min-h-\(--control-default\)/,
    message: "Primary mobile tab recipes must include --control-default height.",
  },
  {
    file: "components/mobile/chrome/mobile-control-recipes.ts",
    regex: /min-h-\(--control-compact\)/,
    message: "Quick pill recipes must include --control-compact height.",
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
      if (Array.isArray(check.files) && !check.files.includes(relativeFile)) continue;
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

  for (const requirement of railTokenRequirements) {
    if (requirement.file !== relativeFile) continue;
    if (requirement.regex.test(source)) continue;
    findings.push({
      file: relativeFile,
      line: 1,
      check: "missing-rail-token",
      message: requirement.message,
      snippet: "Missing required tokenized height rule",
    });
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
