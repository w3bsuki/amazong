import {
  buildSimpleNotFoundMetadata,
  renderSimpleNotFoundPage,
  type LocaleNotFoundParams,
} from "../_components/simple-not-found-page"

export async function generateMetadata(props: LocaleNotFoundParams) {
  return buildSimpleNotFoundMetadata(props)
}

export default async function NotFound(props: LocaleNotFoundParams) {
  return renderSimpleNotFoundPage({
    ...props,
    homeHref: "/account",
    secondaryHref: "/account/orders",
  })
}
