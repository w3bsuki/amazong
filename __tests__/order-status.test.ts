import { describe, expect, it } from 'vitest'
import {
  canSellerUpdateStatus,
  getNextStatusOptions,
  getOrderStatusFromItems,
  SHIPPING_CARRIER_VALUES,
} from '@/lib/order-status'

describe('lib/order-status', () => {
  describe('getOrderStatusFromItems', () => {
    it('returns fallback for empty list', () => {
      expect(getOrderStatusFromItems([], 'pending')).toBe('pending')
      expect(getOrderStatusFromItems([], 'paid')).toBe('paid')
    })

    it('returns cancelled when all items are cancelled', () => {
      expect(getOrderStatusFromItems(['cancelled', 'cancelled'])).toBe('cancelled')
    })

    it('returns delivered when all active items delivered', () => {
      expect(getOrderStatusFromItems(['delivered', 'delivered'])).toBe('delivered')
    })

    it('returns shipped when any item shipped/delivered', () => {
      expect(getOrderStatusFromItems(['processing', 'shipped'])).toBe('shipped')
      expect(getOrderStatusFromItems(['processing', 'delivered'])).toBe('shipped')
    })

    it('returns processing when any item processing/received', () => {
      expect(getOrderStatusFromItems(['pending', 'received'])).toBe('processing')
      expect(getOrderStatusFromItems(['pending', 'processing'])).toBe('processing')
    })
  })

  describe('canSellerUpdateStatus', () => {
    it('returns true for updateable statuses', () => {
      expect(canSellerUpdateStatus('pending')).toBe(true)
      expect(canSellerUpdateStatus('received')).toBe(true)
      expect(canSellerUpdateStatus('processing')).toBe(true)
      expect(canSellerUpdateStatus('shipped')).toBe(true)
    })

    it('returns false for terminal statuses', () => {
      expect(canSellerUpdateStatus('delivered')).toBe(false)
      expect(canSellerUpdateStatus('cancelled')).toBe(false)
    })
  })

  describe('getNextStatusOptions', () => {
    it('returns correct next options for pending', () => {
      const options = getNextStatusOptions('pending')
      expect(options).toContain('received')
    })

    it('returns correct next options for received', () => {
      const options = getNextStatusOptions('received')
      expect(options).toContain('processing')
    })

    it('returns correct next options for processing', () => {
      const options = getNextStatusOptions('processing')
      expect(options).toContain('shipped')
    })

    it('returns correct next options for shipped', () => {
      const options = getNextStatusOptions('shipped')
      expect(options).toContain('delivered')
    })

    it('returns empty array for delivered (no next status)', () => {
      const options = getNextStatusOptions('delivered')
      expect(options).toEqual([])
    })

    it('returns empty array for cancelled', () => {
      const options = getNextStatusOptions('cancelled')
      expect(options).toEqual([])
    })
  })

  describe('SHIPPING_CARRIER_VALUES', () => {
    it('contains the expected values', () => {
      expect(SHIPPING_CARRIER_VALUES).toContain('speedy')
      expect(SHIPPING_CARRIER_VALUES).toContain('other')
    })

    it('does not contain duplicates', () => {
      expect(new Set(SHIPPING_CARRIER_VALUES).size).toBe(SHIPPING_CARRIER_VALUES.length)
    })
  })
})
