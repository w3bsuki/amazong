import { describe, expect, test } from 'vitest'

import { isBoostActive } from '@/lib/boost/boost-status'

describe('isBoostActive', () => {
  test('returns false when not boosted', () => {
    expect(isBoostActive({ is_boosted: false, boost_expires_at: new Date(Date.now() + 60_000).toISOString() })).toBe(false)
  })

  test('returns false when is_boosted is null', () => {
    expect(isBoostActive({ is_boosted: null, boost_expires_at: new Date(Date.now() + 60_000).toISOString() })).toBe(false)
  })

  test('returns false when is_boosted is undefined', () => {
    expect(isBoostActive({ boost_expires_at: new Date(Date.now() + 60_000).toISOString() })).toBe(false)
  })

  test('returns false when expires_at is missing', () => {
    expect(isBoostActive({ is_boosted: true, boost_expires_at: null })).toBe(false)
  })

  test('returns false when expires_at is undefined', () => {
    expect(isBoostActive({ is_boosted: true })).toBe(false)
  })

  test('returns false when expires_at is invalid ISO string', () => {
    expect(isBoostActive({ is_boosted: true, boost_expires_at: 'not-a-date' })).toBe(false)
  })

  test('returns true when boosted and expiry is in the future', () => {
    const now = new Date('2026-01-14T12:00:00.000Z')
    const future = new Date('2026-01-15T12:00:00.000Z').toISOString()
    expect(isBoostActive({ is_boosted: true, boost_expires_at: future }, now)).toBe(true)
  })

  test('returns false when boosted but expiry is in the past', () => {
    const now = new Date('2026-01-14T12:00:00.000Z')
    const past = new Date('2026-01-13T12:00:00.000Z').toISOString()
    expect(isBoostActive({ is_boosted: true, boost_expires_at: past }, now)).toBe(false)
  })

  test('returns false when expiry is exactly now (edge case)', () => {
    const now = new Date('2026-01-14T12:00:00.000Z')
    const exact = new Date('2026-01-14T12:00:00.000Z').toISOString()
    expect(isBoostActive({ is_boosted: true, boost_expires_at: exact }, now)).toBe(false)
  })

  test('uses current time when now parameter is not provided', () => {
    const future = new Date(Date.now() + 60_000).toISOString()
    expect(isBoostActive({ is_boosted: true, boost_expires_at: future })).toBe(true)

    const past = new Date(Date.now() - 60_000).toISOString()
    expect(isBoostActive({ is_boosted: true, boost_expires_at: past })).toBe(false)
  })
})
