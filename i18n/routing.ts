import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // Bulgarian first for Bulgaria launch, then English
    locales: ['bg', 'en'],

    // Default to Bulgarian for Bulgaria-first market
    defaultLocale: 'bg',

    // Enable automatic locale detection from browser Accept-Language header
    localeDetection: true,

    // Persist user's locale preference in cookie for 1 year
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 31536000  // 1 year in seconds
    },

    // Hide /bg prefix from URLs, show /en for English
    // This gives cleaner URLs for Bulgarian users
    localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
