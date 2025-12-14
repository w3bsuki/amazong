import { requireDashboardAccess } from "@/lib/auth/business"
import { createClient } from "@/lib/supabase/server"
import { connection } from "next/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  IconBuildingStore, 
  IconUser,
  IconBell,
  IconShield,
} from "@tabler/icons-react"

async function getSellerDetails(sellerId: string) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sellerId)
    .single()
  
  // Map profile fields to expected seller format
  if (profile) {
    return {
      ...profile,
      store_name: profile.display_name || profile.business_name || profile.username,
      bio: profile.bio || '',
    }
  }
  return profile
}

export default async function BusinessSettingsPage() {
  await connection()
  
  // Requires paid business subscription
  const businessSeller = await requireDashboardAccess()
  const sellerDetails = await getSellerDetails(businessSeller.id)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
              <IconBuildingStore className="size-3" />
              {sellerDetails?.store_name || 'Your Store'}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage your business settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuildingStore className="size-5" />
              Store Information
            </CardTitle>
            <CardDescription>
              Your store details visible to customers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="store_name">Store Name</Label>
                <Input 
                  id="store_name" 
                  defaultValue={sellerDetails?.store_name || ''} 
                  placeholder="Your Store Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name (Legal)</Label>
                <Input 
                  id="business_name" 
                  defaultValue={sellerDetails?.business_name || ''} 
                  placeholder="Legal Business Name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Store Description</Label>
              <Textarea 
                id="bio" 
                defaultValue={sellerDetails?.bio || ''} 
                placeholder="Tell customers about your store..."
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vat_number">VAT Number</Label>
                <Input 
                  id="vat_number" 
                  defaultValue={sellerDetails?.vat_number || ''} 
                  placeholder="BG123456789"
                />
              </div>
              {/* EIK field removed: not present in profiles table */}
            </div>
            <Button>Save Store Information</Button>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield className="size-5" />
              Account Status
            </CardTitle>
            <CardDescription>
              Your business account verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Account Type</p>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Business
                </Badge>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Verification</p>
                <Badge 
                  variant="outline" 
                  className={sellerDetails?.is_verified_business 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }
                >
                  {sellerDetails?.is_verified_business ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              <div className="p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Subscription</p>
                <Badge variant="outline">
                  {sellerDetails?.tier || 'Basic'}
                </Badge>
              </div>
            </div>
            {!sellerDetails?.is_verified_business && (
              <div className="mt-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Your business verification is pending. Submit your business documents to get verified and unlock additional features.
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Submit Documents
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="size-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              How customers can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Business Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue={businessSeller.email || ''} 
                  placeholder="business@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Business Phone</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  defaultValue={sellerDetails?.phone || ''} 
                  placeholder="+359 88 888 8888"
                />
              </div>
            </div>
            {/* Address field removed: not present in profiles table */}
            <Button>Save Contact Information</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBell className="size-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">New Orders</p>
                  <p className="text-sm text-muted-foreground">Get notified when you receive a new order</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when products are low on stock</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Customer Messages</p>
                  <p className="text-sm text-muted-foreground">Get notified when customers send you messages</p>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
