export type BoostLike = {
  is_boosted?: boolean | null
  boost_expires_at?: string | null
}

export function isBoostActive(boost: BoostLike, now: Date = new Date()): boolean {
  if (boost.is_boosted !== true) return false
  if (!boost.boost_expires_at) return false

  const expiresAt = new Date(boost.boost_expires_at)
  if (Number.isNaN(expiresAt.getTime())) return false

  return expiresAt.getTime() > now.getTime()
}
