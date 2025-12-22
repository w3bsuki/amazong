export function getSeoProductUrl(args: {
  username?: string | null
  slug?: string | null
  fallbackPath: string
}): string {
  if (args.username && args.slug) {
    return `/${args.username}/${args.slug}`
  }
  return args.fallbackPath
}
