import CategoryPage, { generateMetadata as generateMetadataSingle } from "../page"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
}) {
  const { locale, subslug } = await params
  return generateMetadataSingle({ params: Promise.resolve({ locale, slug: subslug }) })
}

export default function CategoryNestedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const mappedParams = (async () => {
    const { locale, subslug } = await params
    return { locale, slug: subslug }
  })()

  return CategoryPage({ params: mappedParams, searchParams })
}
