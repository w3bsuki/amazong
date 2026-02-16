import { permanentRedirect } from "next/navigation"

export default async function BrowseAliasPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  const nextParams = new URLSearchParams()

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (!value) continue
    if (Array.isArray(value)) {
      for (const entry of value) {
        nextParams.append(key, entry)
      }
      continue
    }
    nextParams.set(key, value)
  }

  const queryString = nextParams.toString()
  permanentRedirect(queryString ? `/${locale}/search?${queryString}` : `/${locale}/search`)
}
