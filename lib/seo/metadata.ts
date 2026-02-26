import 'server-only'

import type { Metadata } from 'next'

import { locales, validateLocale } from '@/i18n/routing'

const DEFAULT_SITE_URL = 'https://treido.eu'
const DEFAULT_OG_IMAGE_URL = '/og-image.svg'

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
}

function normalizeLocalePath(path: string): string {
  if (!path || path === '/') return ''
  return path.startsWith('/') ? path : `/${path}`
}

function withLocalePrefix(locale: string, path: string): string {
  const normalized = normalizeLocalePath(path)
  return normalized ? `/${locale}${normalized}` : `/${locale}`
}

function buildLanguageAlternates(path: string): Record<string, string> {
  const siteUrl = getSiteUrl()
  return Object.fromEntries(
    locales.map((altLocale) => [altLocale, `${siteUrl}${withLocalePrefix(altLocale, path)}`])
  )
}

type CreatePageMetadataOptions = {
  locale: string
  /**
   * Locale-less path (e.g. "", "/categories", "/auth/login", "/{username}/{slug}").
   * The locale prefix is added automatically.
   */
  path: string
  title: string
  description: string
  robots?: Metadata['robots']
  openGraph?: Partial<NonNullable<Metadata['openGraph']>>
  twitter?: Partial<NonNullable<Metadata['twitter']>>
}

export function createPageMetadata(options: CreatePageMetadataOptions): Metadata {
  const locale = validateLocale(options.locale)
  const siteUrl = getSiteUrl()
  const canonicalUrl = `${siteUrl}${withLocalePrefix(locale, options.path)}`

  const openGraphImages = options.openGraph?.images ?? [
    {
      url: DEFAULT_OG_IMAGE_URL,
      width: 1200,
      height: 630,
      alt: 'Treido marketplace',
    },
  ]

  const twitterImages = options.twitter?.images ?? [DEFAULT_OG_IMAGE_URL]

  return {
    title: options.title,
    description: options.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(options.path),
    },
    openGraph: {
      title: options.title,
      description: options.description,
      url: canonicalUrl,
      siteName: 'Treido',
      type: 'website',
      ...options.openGraph,
      images: openGraphImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: options.description,
      ...options.twitter,
      images: twitterImages,
    },
    ...(options.robots ? { robots: options.robots } : {}),
  }
}

type LocalizedCopy = {
  en: string
  bg: string
}

type CreatePrivatePageMetadataOptions = Omit<CreatePageMetadataOptions, 'title' | 'description' | 'robots'> & {
  title: LocalizedCopy
  description: LocalizedCopy
}

export function createPrivatePageMetadata(options: CreatePrivatePageMetadataOptions): Metadata {
  const locale = validateLocale(options.locale)
  const title = locale === 'bg' ? options.title.bg : options.title.en
  const description = locale === 'bg' ? options.description.bg : options.description.en

  return createPageMetadata({
    ...options,
    locale,
    title,
    description,
    robots: {
      index: false,
      follow: false,
    },
  })
}
