import { requireDashboardAccess } from "@/lib/auth/business"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  IconBrandFacebook,
  IconBrandGoogle,
  IconMail,
  IconTag,
  IconRocket,
  IconChartBar,
  IconArrowRight,
  IconPlus,
} from "@tabler/icons-react"

const marketingChannels = [
  {
    id: "email",
    name: "Email Marketing",
    description: "Send targeted emails to your customers",
    icon: IconMail,
    status: "available",
    action: "Set up",
  },
  {
    id: "facebook",
    name: "Facebook & Instagram",
    description: "Reach customers on Meta platforms",
    icon: IconBrandFacebook,
    status: "coming-soon",
    action: "Coming soon",
  },
  {
    id: "google",
    name: "Google Ads",
    description: "Advertise on Google Search and Shopping",
    icon: IconBrandGoogle,
    status: "coming-soon",
    action: "Coming soon",
  },
]

const quickCampaigns = [
  {
    id: "sale",
    name: "Flash Sale",
    description: "Create a limited-time discount",
    icon: IconTag,
    href: "/dashboard/discounts/new",
  },
  {
    id: "launch",
    name: "Product Launch",
    description: "Announce a new product",
    icon: IconRocket,
    href: "/dashboard/products?add=true",
  },
]

export default async function BusinessMarketingPage() {
  // Requires paid business subscription
  const _businessSeller = await requireDashboardAccess()

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      {/* Shopify-style Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-info/10 text-info">
              <IconRocket className="size-3" />
              Grow your business
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Promote your store and reach more customers
          </p>
        </div>
      </div>

      {/* Quick Campaigns */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Quick campaigns</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickCampaigns.map((campaign) => {
            const Icon = campaign.icon
            return (
              <Link key={campaign.id} href={campaign.href}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">{campaign.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {campaign.description}
                        </p>
                      </div>
                      <IconArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Marketing Channels */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Marketing channels</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {marketingChannels.map((channel) => {
            const Icon = channel.icon
            const isAvailable = channel.status === "available"
            
            return (
              <Card key={channel.id} className={!isAvailable ? "opacity-75" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                      <Icon className="size-5" />
                    </div>
                    {!isAvailable && (
                      <Badge variant="secondary" className="text-2xs">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-3">{channel.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {channel.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant={isAvailable ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                    disabled={!isAvailable}
                  >
                    {channel.action}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Marketing Performance - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <IconChartBar className="size-5" />
            Marketing Performance
          </CardTitle>
          <CardDescription>
            Track the performance of your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
              <IconChartBar className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No marketing campaigns yet. Create a campaign to start tracking performance.
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/dashboard/discounts/new">
                <IconPlus className="size-4 mr-1.5" />
                Create first campaign
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
