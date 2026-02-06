import { describe, expect, test } from 'vitest'

import {
  getListingOverlayBadgeVariants,
  getSellerVerificationBadgeVariant,
} from '@/lib/ui/badge-intent'

describe('getListingOverlayBadgeVariants', () => {
  test('returns empty array when listing is not promoted and has no meaningful discount', () => {
    expect(
      getListingOverlayBadgeVariants({
        isPromoted: false,
        discountPercent: 0,
      }),
    ).toEqual([])
  })

  test('returns only promoted when listing is promoted without discount threshold hit', () => {
    expect(
      getListingOverlayBadgeVariants({
        isPromoted: true,
        discountPercent: 4,
      }),
    ).toEqual(['promoted'])
  })

  test('returns only discount when discount threshold is met and listing is not promoted', () => {
    expect(
      getListingOverlayBadgeVariants({
        isPromoted: false,
        discountPercent: 8,
      }),
    ).toEqual(['discount'])
  })

  test('returns promoted first and discount second when both apply', () => {
    expect(
      getListingOverlayBadgeVariants({
        isPromoted: true,
        discountPercent: 12,
      }),
    ).toEqual(['promoted', 'discount'])
  })

  test('respects custom minimum discount threshold', () => {
    expect(
      getListingOverlayBadgeVariants({
        isPromoted: false,
        discountPercent: 9,
        minDiscountPercent: 10,
      }),
    ).toEqual([])
  })
})

describe('getSellerVerificationBadgeVariant', () => {
  test('returns null for unverified sellers', () => {
    expect(
      getSellerVerificationBadgeVariant({
        isVerified: false,
        isBusiness: true,
      }),
    ).toBeNull()
  })

  test('returns business verification variant for verified business sellers', () => {
    expect(
      getSellerVerificationBadgeVariant({
        isVerified: true,
        isBusiness: true,
      }),
    ).toBe('verified-business')
  })

  test('returns personal verification variant for verified non-business sellers', () => {
    expect(
      getSellerVerificationBadgeVariant({
        isVerified: true,
        isBusiness: false,
      }),
    ).toBe('verified-personal')
  })
})
