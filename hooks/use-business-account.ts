"use client"

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export type AccountType = 'personal' | 'business'

export interface BusinessAccountInfo {
  id: string
  store_name: string
  account_type: AccountType
  is_verified_business: boolean
  business_name: string | null
  tier: string
  avatar_url: string | null
  rating: number | null
  total_reviews: number
  total_sales: number
}

interface UseBusinessAccountResult {
  seller: BusinessAccountInfo | null
  isLoading: boolean
  isBusinessAccount: boolean
  isPersonalAccount: boolean
  isSeller: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * React hook for accessing the current user's seller/business account information.
 * Useful for conditional UI rendering based on account type.
 */
export function useBusinessAccount(): UseBusinessAccountResult {
  const [seller, setSeller] = useState<BusinessAccountInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSellerInfo = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        setSeller(null)
        return
      }
      
      // Get seller info
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select(`
          id,
          store_name,
          account_type,
          is_verified_business,
          business_name,
          tier,
          avatar_url,
          rating,
          total_reviews,
          total_sales
        `)
        .eq('id', user.id)
        .single()
      
      if (sellerError) {
        // User is not a seller
        setSeller(null)
        return
      }
      
      setSeller(sellerData as BusinessAccountInfo)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch seller info'))
      setSeller(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSellerInfo()
  }, [fetchSellerInfo])

  return {
    seller,
    isLoading,
    isBusinessAccount: seller?.account_type === 'business',
    isPersonalAccount: seller?.account_type === 'personal',
    isSeller: seller !== null,
    error,
    refetch: fetchSellerInfo,
  }
}

/**
 * Simple hook to check if user has a business account (for quick checks)
 */
export function useIsBusinessAccount(): { isBusinessAccount: boolean; isLoading: boolean } {
  const { isBusinessAccount, isLoading } = useBusinessAccount()
  return { isBusinessAccount, isLoading }
}

/**
 * Hook to get the appropriate dashboard link based on account type
 */
export function useSellerDashboardLink(): { dashboardLink: string; isLoading: boolean } {
  const { seller, isLoading, isBusinessAccount } = useBusinessAccount()
  
  if (!seller) {
    return { dashboardLink: '/sell', isLoading }
  }
  
  if (isBusinessAccount) {
    return { dashboardLink: '/dashboard', isLoading }
  }
  
  return { dashboardLink: '/account/selling', isLoading }
}
