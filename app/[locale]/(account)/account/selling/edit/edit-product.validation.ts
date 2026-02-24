type TranslationFn = (key: string) => string

type ValidateEditProductInput = {
  title: string
  price: string
  stock: string
  isOnSale: boolean
  originalPrice: string
  shipsBulgaria: boolean
  shipsEurope: boolean
  shipsUSA: boolean
  shipsWorldwide: boolean
  sellerCity: string
  t: TranslationFn
  tSell: TranslationFn
}

export function validateEditProduct(input: ValidateEditProductInput): string | null {
  const {
    title,
    price,
    stock,
    isOnSale,
    originalPrice,
    shipsBulgaria,
    shipsEurope,
    shipsUSA,
    shipsWorldwide,
    sellerCity,
    t,
    tSell,
  } = input

  const normalizedTitle = title.trim()
  const parsedPrice = Number.parseFloat(price)
  const parsedStock = Number.parseInt(stock, 10)
  const parsedOriginalPrice = Number.parseFloat(originalPrice)
  const hasShippingDestination = shipsBulgaria || shipsEurope || shipsUSA || shipsWorldwide

  if (normalizedTitle.length < 5) {
    return tSell("validation.titleMin")
  }

  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    return tSell("validation.priceInvalid")
  }

  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return t("selling.edit.toast.failedToSave")
  }

  if (!hasShippingDestination) {
    return tSell("validation.shippingRegionRequired")
  }

  if (shipsBulgaria && !sellerCity) {
    return tSell("shipping.selectCityPlaceholder")
  }

  if (isOnSale && originalPrice && (!Number.isFinite(parsedOriginalPrice) || parsedOriginalPrice <= parsedPrice)) {
    return tSell("validation.compareAtMustBeHigher")
  }

  return null
}
