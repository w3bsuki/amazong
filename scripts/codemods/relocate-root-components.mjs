import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());

/**
 * Map of old import specifiers -> new import specifiers.
 * Only includes previous root-level component entrypoints.
 */
const REWRITES = new Map([
  ["@/components/ai-chatbot", "@/components/ai/ai-chatbot"],
  ["@/components/ai-sell-assistant", "@/components/ai/ai-sell-assistant"],
  ["@/components/analytics", "@/components/providers/analytics"],
  ["@/components/app-breadcrumb", "@/components/navigation/app-breadcrumb"],
  ["@/components/auth-state-listener", "@/components/providers/auth-state-listener"],
  ["@/components/buyer-order-actions", "@/components/buyer/buyer-order-actions"],
  ["@/components/category-browse-card", "@/components/category/category-browse-card"],
  ["@/components/category-circles", "@/components/category/category-circles"],
  ["@/components/chart-area-interactive", "@/components/charts/chart-area-interactive"],
  ["@/components/contact-seller-button", "@/components/seller/contact-seller-button"],
  ["@/components/cookie-consent", "@/components/layout/cookie-consent"],
  ["@/components/data-table", "@/components/common/data-table"],
  ["@/components/deals-section", "@/components/sections/deals-section"],
  ["@/components/desktop-filter-modal", "@/components/desktop/desktop-filter-modal"],
  ["@/components/desktop-hero-cta", "@/components/desktop/desktop-hero-cta"],
  ["@/components/desktop-search", "@/components/desktop/desktop-search"],
  ["@/components/error-boundary", "@/components/common/error-boundary"],
  ["@/components/featured-products-section", "@/components/sections/featured-products-section"],
  ["@/components/follow-seller-button", "@/components/seller/follow-seller-button"],
  ["@/components/geo-welcome-modal", "@/components/common/geo-welcome-modal"],
  ["@/components/hero-carousel", "@/components/sections/hero-carousel"],
  ["@/components/image-upload", "@/components/common/image-upload"],
  ["@/components/language-switcher", "@/components/navigation/language-switcher"],
  ["@/components/mobile-category-rail", "@/components/mobile/mobile-category-rail"],
  ["@/components/mobile-menu-sheet", "@/components/mobile/mobile-menu-sheet"],
  ["@/components/mobile-search-bar", "@/components/mobile/mobile-search-bar"],
  ["@/components/mobile-tab-bar", "@/components/mobile/mobile-tab-bar"],
  ["@/components/nav-documents", "@/components/navigation/nav-documents"],
  ["@/components/order-status-actions", "@/components/orders/order-status-actions"],
  ["@/components/order-status-badge", "@/components/orders/order-status-badge"],
  ["@/components/plan-card", "@/components/pricing/plan-card"],
  ["@/components/plans-modal", "@/components/pricing/plans-modal"],
  ["@/components/pricing-card", "@/components/pricing/pricing-card"],
  ["@/components/product-actions", "@/components/product/product-actions"],
  ["@/components/product-card-menu", "@/components/product/product-card-menu"],
  ["@/components/product-card", "@/components/product/product-card"],
  ["@/components/product-form-enhanced", "@/components/product/product-form-enhanced"],
  ["@/components/product-form", "@/components/product/product-form"],
  ["@/components/product-quick-view-dialog", "@/components/product/product-quick-view-dialog"],
  ["@/components/product-row", "@/components/product/product-row"],
  ["@/components/product-variant-selector", "@/components/product/product-variant-selector"],
  ["@/components/promo-banner-strip", "@/components/promo/promo-banner-strip"],
  ["@/components/promo-card", "@/components/promo/promo-card"],
  ["@/components/rating-scroll-link", "@/components/product/rating-scroll-link"],
  ["@/components/review-form", "@/components/product/reviews/review-form"],
  ["@/components/reviews-section-client", "@/components/product/reviews/reviews-section-client"],
  ["@/components/reviews-section-server", "@/components/product/reviews/reviews-section-server"],
  ["@/components/reviews-section", "@/components/product/reviews/reviews-section"],
  ["@/components/section-cards", "@/components/sections/section-cards"],
  ["@/components/seller-card", "@/components/seller/seller-card"],
  ["@/components/seller-rate-buyer-actions", "@/components/seller/seller-rate-buyer-actions"],
  ["@/components/sidebar-menu", "@/components/layout/sidebar/sidebar-menu"],
  ["@/components/sign-out-button", "@/components/auth/sign-out-button"],
  ["@/components/start-selling-banner", "@/components/sections/start-selling-banner"],
  ["@/components/sticky-add-to-cart", "@/components/sticky/sticky-add-to-cart"],
  ["@/components/sticky-checkout-button", "@/components/sticky/sticky-checkout-button"],
  ["@/components/subcategory-circles", "@/components/category/subcategory-circles"],
  ["@/components/subcategory-tabs", "@/components/category/subcategory-tabs"],
  ["@/components/tabbed-product-feed", "@/components/sections/tabbed-product-feed"],
  ["@/components/tabbed-product-section", "@/components/sections/tabbed-product-section"],
  ["@/components/theme-provider", "@/components/providers/theme-provider"],
  ["@/components/trending-products-section", "@/components/sections/trending-products-section"],
  ["@/components/upgrade-banner", "@/components/pricing/upgrade-banner"],
  ["@/components/upgrade-to-business-modal", "@/components/pricing/upgrade-to-business-modal"],
]);

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  "dist",
  "build",
  "playwright-report",
  "test-results",
]);

function* walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(path.join(dir, entry.name));
      continue;
    }
    if (!entry.isFile()) continue;
    if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) continue;
    yield path.join(dir, entry.name);
  }
}

let filesChanged = 0;
let totalReplacements = 0;

for (const filePath of walk(repoRoot)) {
  const before = fs.readFileSync(filePath, "utf8");
  let after = before;

  for (const [from, to] of REWRITES.entries()) {
    // Replace both single-quoted and double-quoted occurrences.
    after = after.split(`"${from}"`).join(`"${to}"`);
    after = after.split(`'${from}'`).join(`'${to}'`);
  }

  if (after !== before) {
    // Count approx replacements for reporting
    let delta = 0;
    for (const [from, to] of REWRITES.entries()) {
      if (from === to) continue;
      const beforeCount = before.split(from).length - 1;
      const afterCount = after.split(to).length - 1;
      if (beforeCount > 0) delta += beforeCount;
      // afterCount not used; just best-effort
    }

    fs.writeFileSync(filePath, after, "utf8");
    filesChanged += 1;
    totalReplacements += delta;
  }
}

console.log(`relocate-root-components: changed ${filesChanged} files, ~${totalReplacements} replacements`);
