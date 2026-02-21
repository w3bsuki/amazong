import CategoryPage, { generateMetadata as generateMetadataSingle } from "../page"
import { routing } from "@/i18n/routing"

const PLACEHOLDER_SLUG = "__placeholder__"
const PLACEHOLDER_SUBSLUG = "__placeholder__"

function isPlaceholderSegment(segment: string) {
  return segment.startsWith("[") || segment === PLACEHOLDER_SLUG || segment === PLACEHOLDER_SUBSLUG
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
    slug: PLACEHOLDER_SLUG,
    subslug: PLACEHOLDER_SUBSLUG,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
}) {
  const { locale, subslug } = await params
  return generateMetadataSingle({ params: Promise.resolve({ locale, slug: subslug }) })
}

export default async function CategoryNestedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; subslug: string; locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale, slug, subslug } = await params

  if (isPlaceholderSegment(slug) || isPlaceholderSegment(subslug)) {
    return null
  }

  const mappedParams = Promise.resolve({ locale, slug: subslug })

  return <CategoryPage params={mappedParams} searchParams={searchParams} />
}
