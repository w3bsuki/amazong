'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
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
import { Globe, X } from '@phosphor-icons/react';

// Region flag emojis
const REGION_FLAGS: Record<ShippingRegion, string> = {
  BG: '🇧🇬',
  UK: '🇬🇧',
  EU: '🇪🇺',
  US: '🇺🇸',
  WW: '🌍',
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
      if (cancelled) return;

      // IMPORTANT: Wait until the SiteHeader is hydrated before rendering any
      // prompt that can open Radix portals. This avoids aria-hidden mutations
      // on unhydrated boundaries (a common source of hydration mismatch warnings).
      const deadline = Date.now() + 2_000;
      const poll = () => {
        if (cancelled) return;
        const headerHydrated = document.querySelector('header[data-hydrated="true"]');
        if (headerHydrated || Date.now() > deadline) {
          setSafeToOpen(true);
          return;
        }
        setTimeout(poll, 50);
      };

      poll();
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
    window.addEventListener('treido:cookie-consent', onConsent);
    return () => window.removeEventListener('treido:cookie-consent', onConsent);
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
  const regionLabel = t(`regions.${selectedRegion}`);

  return (
    <div className="fixed bottom-24 left-0 right-0 z-50 pointer-events-none md:bottom-4 md:left-auto md:right-4">
      <div className="pointer-events-auto mx-3 md:mx-0 w-auto max-w-sm rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-10 items-center justify-center rounded-full bg-muted">
            <Globe size={18} weight="duotone" className="text-foreground" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              {t('title', { country: countryName })}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t('description', { region: regionLabel })}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={closeModal}
            aria-label={t('close')}
          >
            <X size={16} weight="regular" />
          </Button>
        </div>

        <div className="mt-3 space-y-3">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">{t('selectRegion')}</label>

            <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as ShippingRegion)}>
              <SelectTrigger className="h-10 w-full rounded-lg" aria-label={t('selectRegion')}>
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span className="text-base">{REGION_FLAGS[selectedRegion]}</span>
                    <span className="text-sm text-foreground">{regionLabel}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-border">
                {(['BG', 'UK', 'EU', 'US', 'WW'] as ShippingRegion[]).map((region) => (
                  <SelectItem key={region} value={region} className="cursor-pointer py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="text-base">{REGION_FLAGS[region]}</span>
                      <span className="text-sm">{t(`regions.${region}`)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="button" className="w-full" onClick={confirmRegion}>
            {t('confirmButton', { region: regionLabel })}
          </Button>

          <Button type="button" variant="ghost" className="w-full" onClick={declineAndShowAll}>
            {t('declineButton')}
          </Button>

          <p className="pt-1 text-center text-xs text-muted-foreground">{t('changeAnytime')}</p>
        </div>
      </div>
    </div>
  );
}
