import { createAdminClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconCheck, IconX } from "@tabler/icons-react"

// Define seller type to avoid 'any'
interface Seller {
  id: string
  store_name: string
  description: string | null
  verified: boolean | null
  tier: string | null
  is_verified_business: boolean | null
  business_name: string | null
  commission_rate: number | null
  country_code: string | null
  created_at: string
  profiles: {
    email: string | null
    full_name: string | null
  }
}

async function getSellers(): Promise<Seller[]> {
  const adminClient = createAdminClient()
  
  const { data: profiles, error } = await adminClient
    .from('profiles')
    .select(`
      id,
      username,
      display_name,
      bio,
      verified,
      tier,
      is_verified_business,
      business_name,
      commission_rate,
      country_code,
      created_at,
      email,
      full_name
    `)
    .eq('is_seller', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Failed to fetch sellers:', error)
    return []
  }
  
  // Map profiles to expected seller format
  return (profiles || []).map(profile => ({
    id: profile.id,
    store_name: profile.display_name || profile.business_name || profile.username || 'Unknown',
    description: profile.bio,
    verified: profile.verified,
    tier: profile.tier,
    is_verified_business: profile.is_verified_business,
    business_name: profile.business_name,
    commission_rate: profile.commission_rate,
    country_code: profile.country_code,
    created_at: profile.created_at,
    profiles: {
      email: profile.email,
      full_name: profile.full_name,
    }
  }))
}

export default async function AdminSellersPage() {
  const sellers = await getSellers()
  
  const getTierBadge = (tier: string | null) => {
    switch (tier) {
      case 'business':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'premium':
        return 'bg-amber-100 text-amber-700 border-amber-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-4 md:py-6 px-4 lg:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sellers</h1>
          <p className="text-muted-foreground">
            All seller accounts on the platform
          </p>
        </div>
        <Badge variant="outline" className="text-base">
          {sellers.length} sellers
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sellers</CardTitle>
          <CardDescription>
            View and manage seller accounts and their stores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow key={seller.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{seller.store_name}</p>
                      {seller.business_name && (
                        <p className="text-sm text-muted-foreground">
                          {seller.business_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {seller.profiles.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {seller.profiles.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getTierBadge(seller.tier)}>
                      {seller.tier || 'basic'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {seller.verified ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          <IconCheck className="size-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                          <IconX className="size-3 mr-1" />
                          Not verified
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {seller.commission_rate}%
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {seller.country_code || 'BG'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(seller.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
