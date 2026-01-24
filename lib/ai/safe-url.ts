import "server-only"

function isIpv4(hostname: string): boolean {
  const parts = hostname.split(".")
  if (parts.length !== 4) return false
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false
    const n = Number(p)
    return n >= 0 && n <= 255
  })
}

function isPrivateIpv4(hostname: string): boolean {
  if (!isIpv4(hostname)) return false
  const parts = hostname.split(".").map((p) => Number(p))
  const a = parts[0] ?? 0
  const b = parts[1] ?? 0

  if (a === 10) return true
  if (a === 127) return true
  if (a === 0) return true
  if (a === 169 && b === 254) return true
  if (a === 192 && b === 168) return true
  if (a === 172 && b >= 16 && b <= 31) return true

  return false
}

function isLocalhostLike(hostname: string): boolean {
  const h = hostname.toLowerCase()
  if (h === "localhost") return true
  if (h.endsWith(".localhost")) return true
  if (h === "::1") return true
  return false
}

function isPrivateIpv6(hostname: string): boolean {
  const h = hostname.toLowerCase()
  if (!h.includes(":")) return false
  if (h === "::") return true
  if (h.startsWith("fe80:")) return true // link-local
  if (h.startsWith("fc") || h.startsWith("fd")) return true // unique local addresses
  return false
}

/**
 * Basic SSRF guard for user-provided URLs.
 * Allows only http(s) URLs and blocks localhost/private IPs.
 */
export function isSafeUserProvidedUrl(input: string): boolean {
  let url: URL
  try {
    url = new URL(input)
  } catch {
    return false
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false
  const hostname = url.hostname
  if (isLocalhostLike(hostname)) return false
  if (isPrivateIpv4(hostname)) return false
  if (isPrivateIpv6(hostname)) return false

  return true
}
