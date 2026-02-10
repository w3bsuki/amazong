import { test, expect } from "./fixtures/base"

test.describe("Mobile Home Feed Controls", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie-consent", "accepted")
      localStorage.setItem("geo-welcome-dismissed", "true")
    })
  })

  test("shows tabs and switches between promoted and all", async ({ page, app }) => {
    await app.goto("/en")
    await app.waitForHydration()

    await expect(page.getByTestId("home-feed-controls")).toBeVisible()
    const promotedTab = page.getByTestId("home-feed-tab-promoted")
    await expect(promotedTab).toHaveAttribute("aria-pressed", "true")
    await expect(promotedTab).toHaveClass(/bg-foreground/)
    await expect(promotedTab).toHaveClass(/text-background/)
    await expect(promotedTab).not.toHaveClass(/bg-promoted|text-promoted-foreground|border-promoted/)
    await expect(page.getByTestId("home-feed-chip-sort-newest")).toBeVisible()
    await expect(page.getByTestId("home-feed-chip-sort-newest")).toHaveAttribute("aria-pressed", "true")
    await expect(page.getByTestId("home-discovery-header-see-all")).toBeVisible()
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /sort=newest/)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /promoted=true/)
    const sellBanner = page.getByTestId("home-start-selling-cta")
    await expect(sellBanner).toBeVisible()
    await expect(sellBanner).toHaveClass(/border-primary/)
    await expect(sellBanner).toHaveClass(/bg-primary/)
    await expect(sellBanner).not.toHaveClass(/bg-promoted|border-promoted/)

    await page.getByTestId("home-feed-tab-all").click()

    const allTab = page.getByTestId("home-feed-tab-all")
    await expect(allTab).toHaveAttribute("aria-pressed", "true")
    await expect(allTab).toHaveClass(/bg-foreground/)
    await expect(allTab).toHaveClass(/text-background/)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /sort=newest/)
    await expect(page.getByTestId("home-discovery-header-see-all")).not.toHaveAttribute(
      "href",
      /promoted=true/
    )
  })

  test("applies sort from quick chip rail", async ({ page, app }) => {
    let sawPriceAscRequest = false

    await page.route("**/api/products/newest**", async (route) => {
      const url = new URL(route.request().url())
      if (url.searchParams.get("sort") === "price-asc") {
        sawPriceAscRequest = true
      }
      await route.continue()
    })

    await app.goto("/en")
    await app.waitForHydration()

    await page.getByTestId("home-feed-chip-sort-price-asc").click()

    await expect(page.getByTestId("home-feed-chip-sort-price-asc")).toHaveAttribute("aria-pressed", "true")
    await expect.poll(() => sawPriceAscRequest).toBe(true)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /sort=price-asc/)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /promoted=true/)
  })

  test("handles promoted empty state and one-tap switch to all", async ({ page, app }) => {
    await page.route("**/api/products/newest**", async (route) => {
      const url = new URL(route.request().url())
      const type = url.searchParams.get("type")
      const sort = url.searchParams.get("sort")

      if (type === "promoted" && sort === "rating") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ products: [] }),
        })
        return
      }

      if (type === "newest" && sort === "newest") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            products: [
              {
                id: "n-fallback",
                title: "Fresh all listing",
                price: 199,
                image: "/placeholder.svg",
                rating: 4.6,
                reviews: 11,
                slug: "fresh-all-listing",
                storeSlug: "treido",
              },
            ],
          }),
        })
        return
      }

      await route.continue()
    })

    await app.goto("/en")
    await app.waitForHydration()

    await page.getByTestId("home-feed-chip-sort-rating").click()

    await expect(page.getByTestId("home-discovery-empty-promoted")).toBeVisible()

    await page.getByTestId("home-promoted-empty-switch-all").click()

    await expect(page.getByTestId("home-feed-tab-all")).toHaveAttribute("aria-pressed", "true")
    await expect(page.getByRole("link", { name: /Open product: Fresh all listing/i })).toBeVisible()
  })

  test("applies nearby with stored city", async ({ page, app }) => {
    let sawNearbyRequest = false

    await page.addInitScript(() => {
      localStorage.setItem("treido_user_city", "sofia")
    })

    await page.route("**/api/products/newest**", async (route) => {
      const url = new URL(route.request().url())
      if (url.searchParams.get("nearby") === "true" && url.searchParams.get("city") === "sofia") {
        sawNearbyRequest = true
      }
      await route.continue()
    })

    await app.goto("/en")
    await app.waitForHydration()

    await page.getByTestId("home-feed-chip-nearby").click()

    await expect(page.getByTestId("home-feed-chip-nearby")).toHaveAttribute("aria-pressed", "true")
    await expect(page.getByTestId("home-feed-city-configure")).toBeVisible()
    await expect.poll(() => sawNearbyRequest).toBe(true)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /nearby=true/)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /city=sofia/)
  })

  test("nearby opens city picker when city is missing and applies selection", async ({ page, app }) => {
    let sawVarnaNearbyRequest = false

    await page.addInitScript(() => {
      localStorage.removeItem("treido_user_city")
    })

    await page.route("**/api/products/newest**", async (route) => {
      const url = new URL(route.request().url())
      if (url.searchParams.get("nearby") === "true" && url.searchParams.get("city") === "varna") {
        sawVarnaNearbyRequest = true
      }
      await route.continue()
    })

    await app.goto("/en")
    await app.waitForHydration()

    await page.getByTestId("home-feed-chip-nearby").click()

    await expect(page.getByText(/Choose city/i)).toBeVisible()
    await page.getByTestId("home-city-option-varna").click()
    await page.getByTestId("home-city-apply").click()

    await expect(page.getByTestId("home-feed-chip-nearby")).toHaveAttribute("aria-pressed", "true")
    await expect(page.getByTestId("home-feed-city-configure")).toBeVisible()
    await expect.poll(() => sawVarnaNearbyRequest).toBe(true)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /nearby=true/)
    await expect(page.getByTestId("home-discovery-header-see-all")).toHaveAttribute("href", /city=varna/)
  })
})
