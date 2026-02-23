import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const routesPath = path.join(repoRoot, "designs", "route-inventory.json");
const outPath = path.join(repoRoot, "docs", "generated", "pencil-route-map.md");

/**
 * @param {string} route
 * @returns {{ template: string; notes: string }}
 */
function pickTemplate(route) {
  // Desktop-first areas (still map them so inventory is complete).
  if (route === "/admin" || route.startsWith("/admin/")) {
    return { template: "Desktop-first placeholder", notes: "Admin area" };
  }
  if (route === "/dashboard" || route.startsWith("/dashboard/")) {
    return { template: "Desktop-first placeholder", notes: "Business dashboard" };
  }

  // Long-form/static content.
  const readingRoutes = new Set([
    "/about",
    "/accessibility",
    "/contact",
    "/cookies",
    "/customer-service",
    "/faq",
    "/feedback",
    "/gift-cards",
    "/members",
    "/privacy",
    "/returns",
    "/security",
    "/terms",
  ]);
  if (readingRoutes.has(route)) {
    return { template: "ReadingPage", notes: "Static/reading content" };
  }

  // Checkout flow.
  if (route === "/checkout" || route.startsWith("/checkout/")) {
    return { template: "Checkout", notes: "Checkout flow" };
  }
  if (route === "/cart") {
    return { template: "ListPage", notes: "Cart list" };
  }

  // Multi-step flows.
  if (route === "/sell" || route.startsWith("/sell/")) {
    return { template: "Wizard", notes: "Listing creation / seller flows" };
  }
  if (route === "/onboarding" || route.startsWith("/onboarding/")) {
    return { template: "Wizard", notes: "Onboarding wizard" };
  }

  // Messaging.
  if (route === "/chat" || route.startsWith("/chat/")) {
    return { template: "Chat", notes: "Messaging" };
  }

  // Product detail.
  if (route.includes("/:productSlug")) {
    return { template: "DetailPage (PDP)", notes: "Product detail page" };
  }

  // Account area.
  if (route === "/account" || route.startsWith("/account/")) {
    if (route.includes("/orders/:id")) {
      return { template: "DetailPage (PDP)", notes: "Order detail" };
    }
    return { template: "ListPage", notes: "Account pages" };
  }

  // Auth screens.
  if (route === "/auth" || route.startsWith("/auth/")) {
    return { template: "ListPage", notes: "Auth forms" };
  }

  // Browse/search style pages.
  if (
    route === "/" ||
    route === "/search" ||
    route === "/categories" ||
    route.startsWith("/categories/") ||
    route === "/todays-deals" ||
    route === "/sellers" ||
    route === "/wishlist" ||
    route.startsWith("/wishlist/")
  ) {
    return { template: "FeedGridPage", notes: "Browse grid" };
  }

  // Plans/billing.
  if (route === "/plans" || route.startsWith("/plans/")) {
    return { template: "ListPage", notes: "Plans + upgrades" };
  }

  // Public profile.
  if (route === "/:username") {
    return { template: "ListPage", notes: "Public profile" };
  }

  return { template: "ListPage", notes: "Default scaffold" };
}

function escapePipes(text) {
  return text.replaceAll("|", "\\|");
}

const routesRaw = fs.readFileSync(routesPath, "utf8");
/** @type {string[]} */
const routes = JSON.parse(routesRaw);

const rows = routes.map((route) => ({ route, ...pickTemplate(route) }));

const date = new Date().toISOString().slice(0, 10);
const templateList = [...new Set(rows.map((r) => r.template))].sort();

const lines = [];
lines.push("# Pencil Route Map (Generated)");
lines.push("");
lines.push(`Generated: ${date}`);
lines.push(`Source: \`designs/route-inventory.json\``);
lines.push(`Design (Pencil): \`designs/treido.pen\``);
lines.push("");
lines.push("## Templates");
for (const t of templateList) lines.push(`- ${t}`);
lines.push("");
lines.push("## Map");
lines.push("");
lines.push("| Route | Template | Notes |");
lines.push("| --- | --- | --- |");
for (const r of rows) {
  lines.push(`| \`${r.route}\` | ${r.template} | ${escapePipes(r.notes)} |`);
}
lines.push("");

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, lines.join("\n"), "utf8");

console.log(`Wrote ${path.relative(repoRoot, outPath)} (${rows.length} routes)`);

