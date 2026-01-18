// =============================================================================
// DEMO DESKTOP PRODUCT PAGE - World-Class E-Commerce Experience
// =============================================================================
//
// This is a pixel-perfect desktop product page prototype demonstrating:
// - Clean, modern marketplace UI matching the landing page patterns
// - Left gallery + Right buy box layout
// - Professional pricing display with clear visual hierarchy
// - Seller integrated into buy box (V1 launch - OLX/Bazar style)
// - Semantic token usage throughout
// - No gradients, no arbitrary values - Pure design system
//
// Redirects to locale-based version for proper i18n support.
// =============================================================================

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/en/demo/product-desktop");
}
