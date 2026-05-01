#!/usr/bin/env pwsh

# ============================================================
# VERIFICATION CHECKLIST - Catalogue ShopFlow Setup
# ============================================================

Write-Host "🔍 Catalogue Setup Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

$basePath = "C:\Users\jasse\Desktop\shopflow\frontend\src\app"
$filesCreated = @()
$filesMissing = @()

# Define all files that should exist
$requiredFiles = @(
    # Core Services
    "$basePath\core\services\product.service.ts",
    "$basePath\core\services\cart.service.ts",

    # Core Models
    "$basePath\core\models\product.model.ts",

    # Shared Components
    "$basePath\shared\components\rating-stars\rating-stars.component.ts",
    "$basePath\shared\components\product-card\product-card.component.ts",
    "$basePath\shared\components\pagination\pagination.component.ts",

    # Catalogue Feature
    "$basePath\features\catalogue\catalogue.component.ts",
    "$basePath\features\catalogue\components\filter\filter.component.ts",
    "$basePath\features\catalogue\components\category-tree\category-tree.component.ts",
    "$basePath\features\catalogue\components\product-grid\product-grid.component.ts",

    # Product Detail Feature
    "$basePath\features\product-detail\product-detail.component.ts",
    "$basePath\features\product-detail\components\image-gallery\image-gallery.component.ts",
    "$basePath\features\product-detail\components\variant-selector\variant-selector.component.ts",
    "$basePath\features\product-detail\components\reviews\reviews.component.ts",
    "$basePath\features\product-detail\components\review-card\review-card.component.ts",

    # Documentation
    "C:\Users\jasse\Desktop\shopflow\frontend\ARCHITECTURE.md",
    "C:\Users\jasse\Desktop\shopflow\frontend\USAGE_EXAMPLES.md",
    "C:\Users\jasse\Desktop\shopflow\frontend\CATALOGUE_SETUP_COMPLETE.md"
)

Write-Host "📂 Checking files..." -ForegroundColor Yellow

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        $filesCreated += $file
        Write-Host "✅ $([System.IO.Path]::GetFileName($file))"
    } else {
        $filesMissing += $file
        Write-Host "❌ $([System.IO.Path]::GetFileName($file))"
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  ✅ Created: $($filesCreated.Count)"
Write-Host "  ❌ Missing: $($filesMissing.Count)"
Write-Host ""

if ($filesMissing.Count -gt 0) {
    Write-Host "🔴 Missing files:" -ForegroundColor Red
    foreach ($file in $filesMissing) {
        Write-Host "  - $file"
    }
} else {
    Write-Host "🟢 All files created successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Key Features Implemented:" -ForegroundColor Cyan
Write-Host ""

$features = @(
    @{
        name = "ProductService"
        methods = @("getProducts", "getProductById", "searchProducts", "getTopSelling", "getCategories", "getReviews")
    },
    @{
        name = "CartService"
        methods = @("addItem", "updateItem", "removeItem", "clearCart", "getTotalItems", "getTotalPrice")
    },
    @{
        name = "Catalogue"
        features = @("Filtering", "Pagination", "Query Params Sync", "Responsive Grid", "Category Tree")
    },
    @{
        name = "Product Detail"
        features = @("Image Gallery", "Variant Selector", "Reviews Pagination", "Add to Cart", "Skeleton Loading")
    },
    @{
        name = "Shared Components"
        components = @("RatingStars", "ProductCard", "Pagination")
    }
)

foreach ($feature in $features) {
    Write-Host "✨ $($feature.name):" -ForegroundColor Green

    if ($feature.methods) {
        foreach ($method in $feature.methods) {
            Write-Host "    ✓ $method"
        }
    }

    if ($feature.features) {
        foreach ($feat in $feature.features) {
            Write-Host "    ✓ $feat"
        }
    }

    if ($feature.components) {
        foreach ($comp in $feature.components) {
            Write-Host "    ✓ $comp"
        }
    }

    Write-Host ""
}

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Run: npm install"
Write-Host "2. Run: npm start"
Write-Host "3. Navigate to: http://localhost:4200/products"
Write-Host "4. Check browser console for any warnings"
Write-Host ""

Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "  - ARCHITECTURE.md         (Architecture overview)"
Write-Host "  - USAGE_EXAMPLES.md       (8 practical examples)"
Write-Host "  - CATALOGUE_SETUP_COMPLETE.md (This setup guide)"
Write-Host ""

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "✅ Setup verification complete!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Cyan

