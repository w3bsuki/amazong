import { describe, expect, it } from 'vitest'
import {
  ORDER_STATUS_CONFIG,
  getStatusConfig,
  canSellerUpdateStatus,
  getNextStatusOptions,
  type OrderItemStatus,
} from '@/lib/order-status'

describe('lib/order-status', () => {
  describe('ORDER_STATUS_CONFIG', () => {
    const expectedStatuses: OrderItemStatus[] = [
      'pending',
      'received',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]

    it('has config for all expected statuses', () => {
      expectedStatuses.forEach((status) => {
        expect(ORDER_STATUS_CONFIG[status]).toBeDefined()
      })
    })

    it('each status has required properties', () => {
      expectedStatuses.forEach((status) => {
        const config = ORDER_STATUS_CONFIG[status]
        expect(config.label).toBeDefined()
        expect(config.description).toBeDefined()
        expect(config.color).toBeDefined()
        expect(config.bgColor).toBeDefined()
        expect(config.borderColor).toBeDefined()
        expect(config.icon).toBeDefined()
      })
    })

    it('pending has nextStatus of received', () => {
      expect(ORDER_STATUS_CONFIG.pending.nextStatus).toBe('received')
    })

    it('delivered has no nextStatus', () => {
      expect(ORDER_STATUS_CONFIG.delivered.nextStatus).toBeUndefined()
    })

    it('cancelled has no nextStatus', () => {
      expect(ORDER_STATUS_CONFIG.cancelled.nextStatus).toBeUndefined()
    })
  })

  describe('getStatusConfig', () => {
    it('returns correct config for valid status', () => {
      const config = getStatusConfig('pending')
      expect(config.label).toBe('Pending')
      expect(config.icon).toBe('⏳')
    })

    it('returns pending config for unknown status (fallback)', () => {
      const config = getStatusConfig('unknown' as OrderItemStatus)
      expect(config.label).toBe('Pending')
    })

    it('returns correct config for all statuses', () => {
      expect(getStatusConfig('pending').label).toBe('Pending')
      expect(getStatusConfig('received').label).toBe('Received')
      expect(getStatusConfig('processing').label).toBe('Processing')
      expect(getStatusConfig('shipped').label).toBe('Shipped')
      expect(getStatusConfig('delivered').label).toBe('Delivered')
      expect(getStatusConfig('cancelled').label).toBe('Cancelled')
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
})
