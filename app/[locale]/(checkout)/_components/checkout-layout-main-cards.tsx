import { MapPin, Package, Truck } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddressSection } from "./address-section"
import { OrderItemsSection, OrderItemsSectionDesktop } from "./order-items-section"
import { ShippingMethodSection } from "./shipping-method-section"
import type { CheckoutLayoutBaseProps, CheckoutLayoutVariant } from "./checkout-layout-types"

function getCardLayoutClasses(variant: CheckoutLayoutVariant) {
  return {
    headerClassName: variant === "desktop" ? "border-b px-5" : "border-b",
    titleClassName:
      variant === "desktop"
        ? "flex items-center gap-2.5 text-base"
        : "flex items-center gap-2 text-sm",
    iconClassName: variant === "desktop" ? "size-5 text-primary" : "size-4 text-primary",
    contentClassName: variant === "desktop" ? "p-5 pt-4" : undefined,
  }
}

export function CheckoutAddressCard({
  variant,
  t,
  isAuthGateActive,
  isAuthenticated,
  isLoadingAddresses,
  savedAddresses,
  selectedAddressId,
  setSelectedAddressId,
  useNewAddress,
  setUseNewAddress,
  newAddress,
  updateNewAddress,
  handleBlur,
  errors,
  touched,
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  if (isAuthGateActive) return null

  const { headerClassName, titleClassName, iconClassName, contentClassName } = getCardLayoutClasses(variant)

  return (
    <Card>
      <CardHeader className={headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className={titleClassName}>
            <MapPin className={iconClassName} />
            {t("shippingAddress")}
          </CardTitle>
          {isAuthenticated && (
            <Link href="/account/addresses" className="text-xs font-medium text-primary">
              {t("manageAddresses")}
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>
        <AddressSection
          isLoadingAddresses={isLoadingAddresses}
          savedAddresses={savedAddresses}
          selectedAddressId={selectedAddressId}
          setSelectedAddressId={setSelectedAddressId}
          useNewAddress={useNewAddress}
          setUseNewAddress={setUseNewAddress}
          newAddress={newAddress}
          updateNewAddress={updateNewAddress}
          handleBlur={handleBlur}
          errors={errors}
          touched={touched}
        />
      </CardContent>
    </Card>
  )
}

export function CheckoutShippingMethodCard({
  variant,
  t,
  isAuthGateActive,
  shippingMethod,
  setShippingMethod,
  formatPrice,
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  if (isAuthGateActive) return null

  const { headerClassName, titleClassName, iconClassName, contentClassName } = getCardLayoutClasses(variant)

  return (
    <Card>
      <CardHeader className={headerClassName}>
        <CardTitle className={titleClassName}>
          <Truck className={iconClassName} />
          {t("shippingMethod")}
        </CardTitle>
      </CardHeader>
      <CardContent className={contentClassName}>
        <ShippingMethodSection
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          formatPrice={formatPrice}
          {...(variant === "mobile" ? { compact: true } : {})}
        />
      </CardContent>
    </Card>
  )
}

export function CheckoutOrderItemsCard({
  variant,
  t,
  items,
  totalItems,
  formatPrice,
}: CheckoutLayoutBaseProps & { variant: CheckoutLayoutVariant }) {
  const { headerClassName, titleClassName, iconClassName, contentClassName } = getCardLayoutClasses(variant)

  return (
    <Card>
      <CardHeader className={headerClassName}>
        <div className="flex items-center justify-between">
          <CardTitle className={titleClassName}>
            <Package className={iconClassName} />
            {t("orderItems")}
            <Badge variant="secondary" className="ml-1">
              {totalItems}
            </Badge>
          </CardTitle>
          <Link href="/cart" className="text-xs font-medium text-primary">
            {t("edit")}
          </Link>
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>
        {variant === "desktop" ? (
          <OrderItemsSectionDesktop items={items} formatPrice={formatPrice} />
        ) : (
          <OrderItemsSection items={items} formatPrice={formatPrice} />
        )}
      </CardContent>
    </Card>
  )
}
