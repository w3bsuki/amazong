import { getRequestConfig } from 'next-intl/server';
import { hasLocale, IntlErrorCode } from 'next-intl';
import { routing } from './routing';

/**
 * Request-scoped i18n configuration for Next.js 16+ App Router
 * 
 * This configuration is created once per request and provides:
 * - Locale validation against supported locales
 * - Message loading from JSON files
 * - Timezone configuration for date/time formatting
 * - Global formats for consistent date/number/list display
 * - Error handling for missing translations
 * 
 * @see https://next-intl-docs.vercel.app/docs/usage/configuration
 */
export default getRequestConfig(async ({ requestLocale }) => {
    const isDev = process.env.NODE_ENV !== 'production';

    // This typically corresponds to the `[locale]` segment
    const requested = await requestLocale;
    
    // Use hasLocale for proper type-safe locale validation
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
        
        // Timezone for consistent date/time formatting
        // Bulgaria uses Eastern European Time (EET/EEST)
        timeZone: 'Europe/Sofia',
        
        // Global formats for consistent UI throughout the app
        formats: {
            dateTime: {
                // Short date: Dec 27, 2025
                short: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                },
                // Long date: Friday, December 27, 2025
                long: {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    weekday: 'long'
                },
                // Delivery dates: Dec 27
                delivery: {
                    day: 'numeric',
                    month: 'short'
                },
                // Order timestamps: Dec 27, 2025, 10:30 AM
                order: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                }
            },
            number: {
                // Currency: Euro (EUR) - Bulgaria joined Eurozone
                currency: {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                },
                // Precise numbers (e.g., ratings)
                precise: {
                    maximumFractionDigits: 1
                },
                // Percentages
                percent: {
                    style: 'percent',
                    maximumFractionDigits: 0
                },
                // Integer quantities
                integer: {
                    maximumFractionDigits: 0
                }
            },
            list: {
                // Enumeration: "item1, item2, and item3"
                enumeration: {
                    style: 'long',
                    type: 'conjunction'
                },
                // Disjunction: "item1, item2, or item3"
                options: {
                    style: 'long',
                    type: 'disjunction'
                }
            }
        },
        
        /**
         * Error handling for missing translations
         * - MISSING_MESSAGE: Expected during development, log warning
         * - Other errors: Indicates app bug, should be reported
         */
        onError(error) {
            if (error.code === IntlErrorCode.MISSING_MESSAGE) {
                // Missing translations are expected during development
                // Avoid noisy logs in production (and never show raw keys to users)
                if (isDev) {
                    console.warn(`[i18n] Missing translation: ${error.message}`);
                }
            } else {
                // Other errors indicate bugs and should be investigated
                if (isDev) {
                    console.error('[i18n] Translation error:', error);
                } else {
                    console.error('[i18n] Translation error:', { code: error.code, message: error.message });
                }
            }
        },
        
        /**
         * Fallback for missing or errored messages
         * Shows the key path in development for easy debugging
         */
        getMessageFallback({ namespace, key, error }) {
            const path = [namespace, key].filter(Boolean).join('.');

            // In production never render raw message keys (looks broken/scammy),
            // but in development keep them visible for fast fixes.
            if (!isDev) return '';

            if (error.code === IntlErrorCode.MISSING_MESSAGE) {
                return `[${path}]`;
            }

            return `⚠️ ${path}`;
        }
    };
});
