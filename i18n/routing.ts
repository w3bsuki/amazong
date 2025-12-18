import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // English primary for tests, Bulgarian secondary
    locales: ['en', 'bg'],

    // Default to English (tests use /en as primary)
    defaultLocale: 'en',

    // Enable automatic locale detection from browser Accept-Language header
    localeDetection: true,

    // Persist user's locale preference in cookie for 1 year
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 31536000  // 1 year in seconds
    },

    // Always prefix locales so both /en and /bg are valid and stable.
    localePrefix: 'always'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
