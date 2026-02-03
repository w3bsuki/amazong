export type BoostLike = {
  is_boosted?: boolean | null
  boost_expires_at?: string | null
}

export function isBoostActiveAt(boost: BoostLike, now: Date): boolean {
  if (boost.is_boosted !== true) return false
  if (!boost.boost_expires_at) return false

  const expiresAt = new Date(boost.boost_expires_at)
  if (Number.isNaN(expiresAt.getTime())) return false

  return expiresAt.getTime() > now.getTime()
}

export function isBoostActiveNow(boost: BoostLike): boolean {
  return isBoostActiveAt(boost, new Date())
}

export function isBoostActive(boost: BoostLike, now: Date): boolean {
  return isBoostActiveAt(boost, now)
}
