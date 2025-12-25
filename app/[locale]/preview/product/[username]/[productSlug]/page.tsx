import { setRequestLocale, getTranslations } from "next-intl/server"

import { createClient, createStaticClient } from "@/lib/supabase/server"
import { fetchProductByUsernameAndSlug } from "@/lib/data/product-page"

import { ProductPageContentBlocksInspired } from "@/components/shared/product/product-page-content-blocks-inspired"
import { ProductBreadcrumb } from "@/components/shared/product/product-breadcrumb"
import { getDeliveryDate } from "../../../../_lib/delivery-date"

interface PreviewProductPageProps {
  params: Promise<{ username: string; productSlug: string; locale: string }>
}

export default async function PreviewProductDetailBlocksInspired({ params }: PreviewProductPageProps) {
  const { username, productSlug, locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations("Product")

  const supabase = createStaticClient()
  const authClient = await createClient()

  let currentUserId: string | null = null
  let isFollowingSeller = false

  if (authClient) {
    const {
      data: { user },
    } = await authClient.auth.getUser()
    currentUserId = user?.id || null

    if (currentUserId) {
      const { data: sellerProfile } = await supabase
        .from("profiles")
        .select("id")
        .ilike("username", username)
        .single()

      if (sellerProfile && currentUserId !== sellerProfile.id) {
        const { data: followData } = await authClient
          .from("store_followers")
          .select("id")
          .eq("follower_id", currentUserId)
          .eq("seller_id", sellerProfile.id)
          .maybeSingle()
        isFollowingSeller = !!followData
      }
    }
  }

  const formattedDeliveryDate = getDeliveryDate(locale)

  // Try real data; if unavailable (missing env, no match, etc.), fall back to sample data
  const product = supabase ? await fetchProductByUsernameAndSlug(supabase, username, productSlug) : null
  const isSample = !product

  const sampleProduct = {
    id: "preview-product",
    title: "Preview Product (Sample)",
    description:
      "This is sample data because the product lookup did not return a result. The layout and components are what we’re previewing.",
    price: 129.99,
    list_price: 159.99,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    rating: 4.6,
    review_count: 128,
    tags: ["New", "Best Seller", "Limited"],
    is_boosted: true,
    seller_id: "preview-seller",
    slug: productSlug,
  }

  const sampleSeller = {
    id: "preview-seller",
    username,
    display_name: username || "Seller",
    avatar_url: null,
    verified: true,
    is_seller: true,
    created_at: new Date().toISOString(),
  }

  const category = product?.category ?? null
  const seller = product?.seller ?? sampleSeller

  const resolvedProduct = product ?? sampleProduct

  let parentCategory = null
  if (category?.parent_id && supabase) {
    const { data: parent } = await supabase
      .from("categories")
      .select("*")
      .eq("id", category.parent_id)
      .single()
    parentCategory = parent
  }

  const translations = {
    inStock: t("inStock"),
    freeDeliveryDate: t("freeDeliveryDate", { date: formattedDeliveryDate }),
    shipsFrom: t("shipsFrom"),
    amazonStore: t("amazonStore"),
    soldBy: t("soldBy"),
    freeReturns: t("freeReturns"),
    freeDelivery: t("freeDelivery"),
    secureTransaction: t("secureTransaction"),
    aboutThisItem: t("aboutThisItem"),
    ratingLabel: t("ratingLabel", { rating: resolvedProduct.rating || 0, max: 5 }),
    ratings: t("ratings", { count: resolvedProduct.review_count || 0 }),

    shipping: t("shipping"),
    deliveryLabel: t("deliveryLabel"),
    returnsLabel: t("returnsLabel"),
    payments: t("payments"),
    condition: t("condition"),
    conditionNew: t("conditionNew"),

    seeDetails: t("seeDetails"),
    viewStore: t("viewStore"),
    enlarge: t("enlarge"),
    addToWatchlist: t("addToWatchlist"),
    removeFromWatchlist: t("removeFromWatchlist"),
    watching: t("watching"),
    picture: t("picture"),
    of: t("of"),
    popularItem: t("popularItem"),
    watchlistCount: t("watchlistCount"),
    freeShipping: t("freeShipping"),
    locatedIn: t("locatedIn"),
    estimatedDelivery: t("estimatedDelivery"),
    returns30Days: t("returns30Days"),
    moneyBackGuarantee: t("moneyBackGuarantee"),
    getItemOrMoneyBack: t("getItemOrMoneyBack"),
    learnMore: t("learnMore"),
    description: t("description"),
    specifications: t("specifications"),
    inTheBox: t("inTheBox"),
    technicalSpecs: t("technicalSpecs"),
    whatsInTheBox: t("whatsInTheBox"),
    itemNumber: t("itemNumber"),
    brand: t("brand"),
    type: t("type"),
    model: t("model"),
    countryOfOrigin: t("countryOfOrigin"),
    warranty: t("warranty"),
    months: t("months"),
    mainProduct: t("mainProduct"),
    userManual: t("userManual"),
    warrantyCard: t("warrantyCard"),
    originalPackaging: t("originalPackaging"),
    detailedSellerRatings: t("detailedSellerRatings"),
    averageLast12Months: t("averageLast12Months"),
    accurateDescription: t("accurateDescription"),
    reasonableShippingCost: t("reasonableShippingCost"),
    shippingSpeed: t("shippingSpeed"),
    communication: t("communication"),
    sellerFeedback: t("sellerFeedback"),
    allRatings: t("allRatings"),
    positive: t("positive"),
    neutral: t("neutral"),
    negative: t("negative"),
    seeAllFeedback: t("seeAllFeedback"),
    noDescriptionAvailable: t("noDescriptionAvailable"),
    previousImage: t("previousImage"),
    nextImage: t("nextImage"),
    imagePreview: t("imagePreview"),
    clickToEnlarge: t("clickToEnlarge"),
    sold: t("sold"),
    positivePercentage: t("positivePercentage"),
    moreFrom: t("moreFrom"),
    similarProduct: t("similarProduct"),
    viewAllItems: t("viewAllItems"),
    noFeedbackYet: t("noFeedbackYet"),
    noRatingsYet: t("noRatingsYet"),
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="border-b bg-amber-50 text-amber-900">
        <div className="container py-2 text-sm">
          Preview: blocks-inspired product detail layout (does not replace the live page)
          {isSample ? " — using sample data" : ""}.
        </div>
      </div>

      <div className="hidden md:block">
        <div className="container py-2">
          <ProductBreadcrumb
            locale={locale}
            category={category ? { name: category.name, slug: category.slug } : null}
            parentCategory={parentCategory ? { name: parentCategory.name, slug: parentCategory.slug } : null}
            productTitle={resolvedProduct.title}
          />
        </div>
      </div>

      <div className="container pt-4">
        <ProductPageContentBlocksInspired
          product={{
            id: resolvedProduct.id,
            title: resolvedProduct.title,
            description: resolvedProduct.description,
            price: resolvedProduct.price,
            original_price: resolvedProduct.list_price,
            images: (resolvedProduct.images || []) as string[],
            rating: resolvedProduct.rating || 0,
            reviews_count: resolvedProduct.review_count || 0,
            tags: (resolvedProduct.tags || []) as string[],
            is_boosted: resolvedProduct.is_boosted || false,
            seller_id: resolvedProduct.seller_id,
            slug: resolvedProduct.slug ?? undefined,
          }}
          seller={
            seller
              ? {
                  id: seller.id,
                  username: seller.username ?? undefined,
                  display_name: seller.display_name || seller.username || "Seller",
                  verified: seller.verified ?? false,
                  created_at: seller.created_at,
                  avatar_url: seller.avatar_url,
                }
              : null
          }
          locale={locale}
          currentUserId={currentUserId}
          isFollowingSeller={isFollowingSeller}
          formattedDeliveryDate={formattedDeliveryDate}
          t={translations}
        />
      </div>
    </div>
  )
}
