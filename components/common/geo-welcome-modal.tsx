'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGeoWelcome } from '@/hooks/use-geo-welcome';
import { getCountryName } from '@/lib/geolocation';
import type { ShippingRegion } from '@/lib/shipping';
import { Globe } from '@phosphor-icons/react';

// Region flag emojis
const REGION_FLAGS: Record<ShippingRegion, string> = {
  BG: '🇧🇬',
  UK: '🇬🇧',
  EU: '🇪🇺',
  US: '🇺🇸',
  WW: '🌍',
};

// Country code to flag emoji
const COUNTRY_FLAGS: Record<string, string> = {
  BG: '🇧🇬',
  GB: '🇬🇧',
  UK: '🇬🇧',
  US: '🇺🇸',
  DE: '🇩🇪',
  FR: '🇫🇷',
  ES: '🇪🇸',
  IT: '🇮🇹',
  NL: '🇳🇱',
  PL: '🇵🇱',
  RO: '🇷🇴',
  GR: '🇬🇷',
  AT: '🇦🇹',
  BE: '🇧🇪',
  PT: '🇵🇹',
  SE: '🇸🇪',
  CZ: '🇨🇿',
  HU: '🇭🇺',
  DK: '🇩🇰',
  FI: '🇫🇮',
  IE: '🇮🇪',
  NO: '🇳🇴',
  CH: '🇨🇭',
  CA: '🇨🇦',
  AU: '🇦🇺',
  JP: '🇯🇵',
  CN: '🇨🇳',
  IN: '🇮🇳',
  BR: '🇧🇷',
  MX: '🇲🇽',
  RU: '🇷🇺',
  ZA: '🇿🇦',
};

interface GeoWelcomeModalProps {
  locale: string;
}

export function GeoWelcomeModal({ locale }: GeoWelcomeModalProps) {
  const isE2E = process.env.NEXT_PUBLIC_E2E === 'true';
  const t = useTranslations('GeoWelcome');
  const [safeToOpen, setSafeToOpen] = useState(false);
  const [hasCookieDecision, setHasCookieDecision] = useState(false);

  useEffect(() => {
    // Never block E2E runs with region/cookie modals.
    if (isE2E) {
      return;
    }

    // IMPORTANT: Radix Dialog adds aria-hidden to siblings.
    // In Next.js, different Client Component boundaries hydrate at different times.
    // If this dialog opens too early it can mutate DOM nodes (e.g. <header>) before
    // their boundary hydrates, triggering hydration mismatch warnings.
    //
    // Waiting until the browser is idle (or a short fallback timeout) keeps hydration stable.
    let cancelled = false;
    const markReady = () => {
      if (!cancelled) setSafeToOpen(true);
    };

    // Prefer requestIdleCallback when available.
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(markReady, { timeout: 1000 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }

    const timer = setTimeout(markReady, 750);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isE2E]);

  useEffect(() => {
    if (isE2E) return;

    const readDecision = () => {
      try {
        const consent = localStorage.getItem('cookie-consent');
        setHasCookieDecision(Boolean(consent));
      } catch {
        setHasCookieDecision(false);
      }
    };

    readDecision();

    const onConsent = () => readDecision();
    window.addEventListener('amzn:cookie-consent', onConsent);
    return () => window.removeEventListener('amzn:cookie-consent', onConsent);
  }, [isE2E]);

  const {
    isOpen,
    isLoading,
    detectedCountry,
    selectedRegion,
    setSelectedRegion,
    confirmRegion,
    declineAndShowAll,
    closeModal,
  } = useGeoWelcome({ enabled: !isE2E });

  // Avoid SSR/client mismatches by only rendering after the app is safe to open dialogs.
  // Also require that the cookie consent banner has been acted on first to avoid overlapping dialogs.
  if (isE2E || !safeToOpen || !hasCookieDecision || isLoading || !isOpen) {
    return null;
  }

  const countryName = getCountryName(detectedCountry, locale);
  const _countryFlag = COUNTRY_FLAGS[detectedCountry.toUpperCase()] || '🌍';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent 
        className="w-full max-w-sm rounded-xl border border-border bg-background p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">
          {locale === 'bg' ? 'Избор на регион' : 'Choose your region'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {t('title', { country: countryName })}
        </DialogDescription>

        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-6 text-center">
            <h1 className="text-lg font-semibold text-foreground">
              {locale === 'bg' ? 'Добре дошли!' : 'Welcome!'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('title', { country: countryName })}
            </p>
          </div>

          {/* Region Selection */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                {t('selectRegion')}
              </label>
              
              <Select
                value={selectedRegion}
                onValueChange={(value) => setSelectedRegion(value as ShippingRegion)}
              >
                <SelectTrigger
                  className="w-full h-10"
                  aria-label={t('selectRegion')}
                >
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      <span className="text-base">{REGION_FLAGS[selectedRegion]}</span>
                      <span className="text-sm text-foreground">{t(`regions.${selectedRegion}`)}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-border">
                  {(['BG', 'UK', 'EU', 'US', 'WW'] as ShippingRegion[]).map((region) => (
                    <SelectItem 
                      key={region} 
                      value={region}
                      className="py-2.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{REGION_FLAGS[region]}</span>
                        <span className="text-sm">{t(`regions.${region}`)}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Confirm Button */}
            <button
              onClick={confirmRegion}
              className="w-full h-10 bg-cta-trust-blue text-cta-trust-blue-text text-sm font-medium rounded-lg transition-colors hover:bg-cta-trust-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t('confirmButton', { region: t(`regions.${selectedRegion}`) })}
            </button>

            {/* Secondary - Show all */}
            <button
              onClick={declineAndShowAll}
              className="w-full h-10 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('declineButton')}
            </button>

            {/* Footer note */}
            <p className="text-xs text-muted-foreground text-center">
              {t('changeAnytime')}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
