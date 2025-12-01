"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AppBreadcrumb } from "@/components/app-breadcrumb"
import { createCheckoutSession } from "@/app/actions/checkout"
import { createClient } from "@/lib/supabase/client"
import { 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  Shield, 
  MapPin,
  SpinnerGap,
  Lock,
  Package,
  Plus,
  Check
} from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import { useLocale } from "next-intl"
import { StickyCheckoutButton } from "@/components/sticky-checkout-button"

interface SavedAddress {
  id: string
  label: string
  full_name: string
  phone: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  is_default: boolean
}

export default function CheckoutPage() {
  const { items, totalItems, subtotal } = useCart()
  const locale = useLocale()
  const [isProcessing, setIsProcessing] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [mounted, setMounted] = useState(false)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [useNewAddress, setUseNewAddress] = useState(false)
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  })

  useEffect(() => {
    setMounted(true)
    fetchSavedAddresses()
  }, [])

  const fetchSavedAddresses = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setIsLoadingAddresses(false)
      setUseNewAddress(true)
      return
    }

    setIsAuthenticated(true)

    const { data: addresses } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })

    if (addresses && addresses.length > 0) {
      setSavedAddresses(addresses)
      // Select default address or first one
      const defaultAddress = addresses.find(a => a.is_default) || addresses[0]
      setSelectedAddressId(defaultAddress.id)
    } else {
      setUseNewAddress(true)
    }
    
    setIsLoadingAddresses(false)
  }

  // Shipping costs
  const shippingCosts = {
    standard: 0, // Free
    express: 9.99,
    overnight: 19.99
  }

  const shippingCost = shippingCosts[shippingMethod as keyof typeof shippingCosts]
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shippingCost + tax

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-US', {
      style: 'currency',
      currency: locale === 'bg' ? 'BGN' : 'USD',
    }).format(price)
  }

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsProcessing(true)
    try {
      const { url, error } = await createCheckoutSession(items)
      if (error) {
        alert(error)
        return
      }
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("An error occurred during checkout. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <SpinnerGap className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container py-4 bg-background min-h-screen">
        <AppBreadcrumb items={[
          { label: locale === 'bg' ? 'Количка' : 'Cart', href: '/cart' },
          { label: locale === 'bg' ? 'Плащане' : 'Checkout' }
        ]} />
        
        <div className="bg-card p-8 rounded border border-border mt-4 text-center max-w-md mx-auto">
          <ShoppingCart className="size-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {locale === 'bg' ? 'Количката ви е празна' : 'Your cart is empty'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {locale === 'bg' 
              ? 'Добавете продукти, за да продължите към плащане.' 
              : 'Add some items to your cart to proceed with checkout.'}
          </p>
          <Link href="/">
            <Button className="bg-brand hover:bg-brand/90 text-foreground">
              {locale === 'bg' ? 'Продължи пазаруването' : 'Continue Shopping'}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted pb-20 sm:pb-12">
      <div className="container py-4">
        <AppBreadcrumb items={[
          { label: locale === 'bg' ? 'Количка' : 'Cart', href: '/cart' },
          { label: locale === 'bg' ? 'Плащане' : 'Checkout' }
        ]} />

        <h1 className="text-2xl sm:text-3xl font-bold mt-4 mb-6">
          {locale === 'bg' ? 'Плащане' : 'Checkout'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-5 text-brand" />
                    {locale === 'bg' ? 'Адрес за доставка' : 'Shipping Address'}
                  </div>
                  {isAuthenticated && (
                    <Link href="/account/addresses" className="text-sm font-normal text-link hover:underline">
                      {locale === 'bg' ? 'Управление на адреси' : 'Manage addresses'}
                    </Link>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-8">
                    <SpinnerGap className="size-6 animate-spin text-muted-foreground" />
                  </div>
                ) : savedAddresses.length > 0 && !useNewAddress ? (
                  <>
                    {/* Saved Addresses List */}
                    <RadioGroup 
                      value={selectedAddressId || ""} 
                      onValueChange={(value) => {
                        setSelectedAddressId(value)
                        setUseNewAddress(false)
                      }}
                      className="space-y-3"
                    >
                      {savedAddresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddressId === address.id 
                              ? 'border-brand bg-brand/5' 
                              : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                            <Label htmlFor={address.id} className="cursor-pointer flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{address.label}</span>
                                {address.is_default && (
                                  <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded">
                                    {locale === 'bg' ? 'По подразбиране' : 'Default'}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>{address.full_name}</p>
                                <p>{address.address_line1}{address.address_line2 && `, ${address.address_line2}`}</p>
                                <p>{address.city}{address.state && `, ${address.state}`} {address.postal_code}</p>
                                <p>{address.country}</p>
                                {address.phone && <p>{address.phone}</p>}
                              </div>
                            </Label>
                            {selectedAddressId === address.id && (
                              <Check className="size-5 text-brand shrink-0" weight="bold" />
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setUseNewAddress(true)}
                    >
                      <Plus className="size-4 mr-2" />
                      {locale === 'bg' ? 'Използвай нов адрес' : 'Use a new address'}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* New Address Form */}
                    {savedAddresses.length > 0 && (
                      <Button 
                        variant="ghost" 
                        className="mb-2"
                        onClick={() => setUseNewAddress(false)}
                      >
                        ← {locale === 'bg' ? 'Обратно към запазени адреси' : 'Back to saved addresses'}
                      </Button>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          {locale === 'bg' ? 'Име' : 'First Name'}
                        </Label>
                        <Input 
                          id="firstName" 
                          placeholder={locale === 'bg' ? 'Въведете име' : 'Enter first name'}
                          value={newAddress.firstName}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          {locale === 'bg' ? 'Фамилия' : 'Last Name'}
                        </Label>
                        <Input 
                          id="lastName" 
                          placeholder={locale === 'bg' ? 'Въведете фамилия' : 'Enter last name'}
                          value={newAddress.lastName}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">
                        {locale === 'bg' ? 'Адрес' : 'Address'}
                      </Label>
                      <Input 
                        id="address" 
                        placeholder={locale === 'bg' ? 'Улица и номер' : 'Street address'}
                        value={newAddress.address}
                        onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          {locale === 'bg' ? 'Град' : 'City'}
                        </Label>
                        <Input 
                          id="city" 
                          placeholder={locale === 'bg' ? 'Въведете град' : 'Enter city'}
                          value={newAddress.city}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">
                          {locale === 'bg' ? 'Област' : 'State'}
                        </Label>
                        <Input 
                          id="state" 
                          placeholder={locale === 'bg' ? 'Въведете област' : 'Enter state'}
                          value={newAddress.state}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">
                          {locale === 'bg' ? 'Пощенски код' : 'ZIP Code'}
                        </Label>
                        <Input 
                          id="zip" 
                          placeholder="10001"
                          value={newAddress.zip}
                          onChange={(e) => setNewAddress(prev => ({ ...prev, zip: e.target.value }))}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Shipping Method Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="size-5 text-brand" />
                  {locale === 'bg' ? 'Метод на доставка' : 'Shipping Method'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                  <div className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-brand bg-brand/5' : 'border-border hover:border-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="cursor-pointer">
                        <div className="font-medium">
                          {locale === 'bg' ? 'Стандартна доставка' : 'Standard Shipping'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {locale === 'bg' ? '5-7 работни дни' : '5-7 business days'}
                        </div>
                      </Label>
                    </div>
                    <span className="font-semibold text-brand-success">
                      {locale === 'bg' ? 'Безплатно' : 'FREE'}
                    </span>
                  </div>
                  
                  <div className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-brand bg-brand/5' : 'border-border hover:border-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="cursor-pointer">
                        <div className="font-medium">
                          {locale === 'bg' ? 'Експресна доставка' : 'Express Shipping'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {locale === 'bg' ? '2-3 работни дни' : '2-3 business days'}
                        </div>
                      </Label>
                    </div>
                    <span className="font-semibold">{formatPrice(9.99)}</span>
                  </div>
                  
                  <div className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${shippingMethod === 'overnight' ? 'border-brand bg-brand/5' : 'border-border hover:border-muted-foreground'}`}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight" className="cursor-pointer">
                        <div className="font-medium">
                          {locale === 'bg' ? 'Доставка на следващия ден' : 'Overnight Shipping'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {locale === 'bg' ? 'Доставка до утре' : 'Next business day'}
                        </div>
                      </Label>
                    </div>
                    <span className="font-semibold">{formatPrice(19.99)}</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Items Preview */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Package className="size-5 text-brand" />
                    {locale === 'bg' ? 'Преглед на поръчката' : 'Order Items'} ({totalItems})
                  </div>
                  <Link href="/cart" className="text-sm font-normal text-link hover:underline">
                    {locale === 'bg' ? 'Редактирай' : 'Edit'}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-secondary rounded overflow-hidden shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {locale === 'bg' ? 'Кол.' : 'Qty'}: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{items.length - 3} {locale === 'bg' ? 'още продукта' : 'more items'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {locale === 'bg' ? 'Обобщение на поръчката' : 'Order Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === 'bg' ? 'Междинна сума' : 'Subtotal'} ({totalItems} {totalItems === 1 ? (locale === 'bg' ? 'артикул' : 'item') : (locale === 'bg' ? 'артикула' : 'items')})
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === 'bg' ? 'Доставка' : 'Shipping'}
                  </span>
                  <span className={shippingCost === 0 ? 'text-brand-success font-medium' : ''}>
                    {shippingCost === 0 
                      ? (locale === 'bg' ? 'Безплатно' : 'FREE') 
                      : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === 'bg' ? 'Такса (10%)' : 'Tax (10%)'}
                  </span>
                  <span>{formatPrice(tax)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>{locale === 'bg' ? 'Общо' : 'Total'}</span>
                  <span className="text-deal">{formatPrice(total)}</span>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full h-12 bg-brand hover:bg-brand/90 text-foreground font-semibold text-base"
                >
                  {isProcessing ? (
                    <>
                      <SpinnerGap className="size-4 mr-2 animate-spin" />
                      {locale === 'bg' ? 'Обработка...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Lock className="size-4 mr-2" />
                      {locale === 'bg' ? 'Продължи към плащане' : 'Proceed to Payment'}
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="size-4 text-brand-success" />
                    <span>{locale === 'bg' ? 'Сигурно плащане с SSL криптиране' : 'Secure payment with SSL encryption'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="size-4 text-brand" />
                    <span>{locale === 'bg' ? 'Приемаме всички основни карти' : 'We accept all major credit cards'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="size-4 text-brand" />
                    <span>{locale === 'bg' ? '30-дневна политика за връщане' : '30-day return policy'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Button for Mobile */}
      <StickyCheckoutButton 
        total={total}
        totalItems={totalItems}
        isProcessing={isProcessing}
        locale={locale}
        onCheckout={handleCheckout}
      />
    </div>
  )
}
