import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type TranslationValues = Record<string, string | number | Date>
type Translator = (key: string, values?: TranslationValues) => string

export async function placeholderCategoryMetadata(
  locale: string,
  t: Translator
): Promise<Metadata> {
  const tCategories = await getTranslations({ locale, namespace: "Categories" })
  const categoryName = tCategories("title")
  const description = t("metaDescription", { categoryName })

  return {
    title: categoryName,
    description,
    openGraph: {
      title: categoryName,
      description,
    },
  }
}
