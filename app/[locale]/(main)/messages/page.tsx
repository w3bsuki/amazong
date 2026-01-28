import { redirect } from "@/i18n/routing"

/**
 * Legacy redirect: /messages -> /chat
 * 
 * This page redirects old /messages URLs to the new /chat route
 * while preserving query parameters like seller=xxx, user=xxx
 */
export default async function MessagesRedirectPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ seller?: string; user?: string; product?: string }>
}) {
  const { locale } = await params
  const { seller, user, product } = await searchParams

  // Build the chat URL with appropriate params
  const chatParams = new URLSearchParams()
  if (seller) chatParams.set("seller", seller)
  if (user) chatParams.set("seller", user) // Map 'user' to 'seller' for sellers messaging buyers
  if (product) chatParams.set("product", product)

  const queryString = chatParams.toString()
  const href = queryString ? `/chat?${queryString}` : "/chat"

  return redirect({ href, locale })
}
