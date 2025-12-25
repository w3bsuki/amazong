# CLEANUP PHASE 1: Delete Unused Files
# Run from project root: .\scripts\cleanup-phase1.ps1
# WARNING: Review CLEANUP.md first! Make sure you have a backup/git commit.

param(
    [switch]$DryRun = $true,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"

Write-Host "================================" -ForegroundColor Cyan
Write-Host "AMAZONG CLEANUP - PHASE 1" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun -and -not $Force) {
    Write-Host "DRY RUN MODE - No files will be deleted" -ForegroundColor Yellow
    Write-Host "Use -Force to actually delete files" -ForegroundColor Yellow
    Write-Host ""
}

# Files to delete (from knip-report.json analysis)
$unusedFiles = @(
    # AI Elements (entire folder)
    "components/ai-elements"
    
    # Common Components
    "components/common/ai-assistant-interface.tsx"
    "components/common/chat-container.tsx"
    "components/common/code-block.tsx"
    "components/common/empty.tsx"
    "components/common/error-boundary.tsx"
    "components/common/image-upload.tsx"
    "components/common/item.tsx"
    "components/common/markdown.tsx"
    "components/common/message.tsx"
    "components/common/pricing-card.tsx"
    "components/common/product-card.tsx"
    "components/common/product-card"
    "components/common/prompt-input.tsx"
    "components/common/scroll-button.tsx"
    "components/common/index.ts"
    
    # Product Components
    "components/product/product-actions.tsx"
    "components/product/product-card-menu.tsx"
    "components/product/product-form-enhanced.tsx"
    "components/product/product-form.tsx"
    "components/product/product-quick-view-dialog.tsx"
    "components/product/product-row.tsx"
    "components/product/product-variant-selector.tsx"
    "components/product/rating-scroll-link.tsx"
    "components/product/reviews/review-form.tsx"
    "components/product/reviews/reviews-section.tsx"
    
    # Pricing
    "components/pricing/pricing-card.tsx"
    "components/pricing/upgrade-banner.tsx"
    "components/pricing/upgrade-to-business-modal.tsx"
    
    # Badges
    "components/badges/badge-progress.tsx"
    "components/badges/seller-badge.tsx"
    "components/badges/trust-score.tsx"
    "components/badges/index.ts"
    
    # Category
    "components/category/category-browse-card.tsx"
    "components/category/category-circles.tsx"
    
    # Sections
    "components/sections/hero-carousel.tsx"
    "components/sections/section-cards.tsx"
    "components/sections/tabbed-product-section.tsx"
    
    # Navigation
    "components/navigation/language-switcher.tsx"
    "components/navigation/mega-menu.tsx"
    "components/navigation/nav-documents.tsx"
    "components/navigation/index.ts"
    
    # Mobile
    "components/mobile/mobile-search-bar.tsx"
    
    # Auth
    "components/auth/sign-out-button.tsx"
    
    # Seller
    "components/seller/seller-card.tsx"
    
    # Skeletons
    "components/skeletons/product-carousel-skeleton.tsx"
    "components/skeletons/product-grid-skeleton.tsx"
    "components/skeletons/index.ts"
    
    # Sticky
    "components/sticky/sticky-add-to-cart.tsx"
    "components/sticky/sticky-checkout-button.tsx"
    
    # UI (unused shadcn)
    "components/ui/calendar.tsx"
    "components/ui/context-menu.tsx"
    "components/ui/kbd.tsx"
    "components/ui/menubar.tsx"
    
    # Promo
    "components/promo/promo-banner-strip.tsx"
    
    # Providers
    "components/providers/theme-provider.tsx"
    
    # Layout indexes
    "components/layout/index.ts"
    "components/layout/footer/index.ts"
    "components/layout/header/index.ts"
    "components/layout/sidebar/index.ts"
    
    # Icons
    "components/icons/index.ts"
    
    # Orphan
    "components/product-detail6.tsx"
    
    # Hooks
    "hooks/use-horizontal-scroll.ts"
    "hooks/use-media-query.ts"
    "hooks/use-prompt-input-controller.ts"
    "hooks/use-prompt-input-provider-attachments.ts"
    
    # Lib
    "lib/badges.ts"
    "lib/currency.ts"
    "lib/sell-specifics-policy.ts"
    "lib/data/badges.ts"
    "lib/data/profile-data.ts"
    "lib/data/store.ts"
    "lib/sell/specifics-policy.ts"
    
    # Types
    "types/badges.ts"
    "types/index.ts"
    
    # Config
    "config/mega-menu-config.ts"
    "config/subcategory-images.ts"
    
    # Actions
    "app/actions/account-upgrade.ts"
    "app/actions/index.ts"
    
    # App components
    "app/[locale]/(auth)/_components/reset-password-form.tsx"
    "app/[locale]/(business)/_components/business-date-range-picker.tsx"
    "app/[locale]/(business)/_components/business-page-header.tsx"
    "app/[locale]/(main)/_lib/attribute-filters.ts"
    "app/[locale]/(main)/_lib/format-eur-price.ts"
    "app/[locale]/(main)/_lib/product-url.ts"
    "app/[locale]/(main)/categories/_components/attribute-filters.tsx"
    "app/[locale]/(main)/categories/_components/category-page-breadcrumb.tsx"
    "app/[locale]/(main)/categories/_components/category-sidebar.tsx"
    "app/[locale]/(main)/categories/_data/category-images.ts"
    "app/[locale]/(sell)/_components/sell-header-v3.tsx"
    "app/[locale]/(account)/account/_components/index.ts"
    "app/[locale]/(account)/account/(settings)/addresses/addresses-content.tsx"
    
    # Scripts
    "scripts/phase0-maps.mjs"
    "scripts/codemods/relocate-root-components.mjs"
    
    # Templates
    "templates/agent-skill-template/scripts/example.mjs"
    
    # Other
    "lighthouserc.js"
)

$deletedCount = 0
$skippedCount = 0
$errorCount = 0

foreach ($file in $unusedFiles) {
    $fullPath = Join-Path $PSScriptRoot ".." $file
    
    if (Test-Path $fullPath) {
        if ($Force) {
            try {
                Remove-Item $fullPath -Recurse -Force
                Write-Host "✓ Deleted: $file" -ForegroundColor Green
                $deletedCount++
            } catch {
                Write-Host "✗ Error deleting: $file - $_" -ForegroundColor Red
                $errorCount++
            }
        } else {
            Write-Host "Would delete: $file" -ForegroundColor Gray
            $deletedCount++
        }
    } else {
        Write-Host "⊘ Not found: $file" -ForegroundColor DarkGray
        $skippedCount++
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

if ($Force) {
    Write-Host "Deleted: $deletedCount files/folders" -ForegroundColor Green
} else {
    Write-Host "Would delete: $deletedCount files/folders" -ForegroundColor Yellow
}
Write-Host "Skipped (not found): $skippedCount" -ForegroundColor DarkGray
Write-Host "Errors: $errorCount" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Green" })

if (-not $Force) {
    Write-Host ""
    Write-Host "This was a DRY RUN. Run with -Force to actually delete files:" -ForegroundColor Yellow
    Write-Host "  .\scripts\cleanup-phase1.ps1 -Force" -ForegroundColor White
}
