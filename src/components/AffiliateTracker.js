'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';

function TrackingLogic() {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    useEffect(() => {
        const ref = searchParams.get('ref');

        if (ref) {
            // Get UTM parameters
            const utmSource = searchParams.get('utm_source') || undefined;
            const utmMedium = searchParams.get('utm_medium') || undefined;
            const utmCampaign = searchParams.get('utm_campaign') || undefined;

            // Track click with v2 API (enhanced tracking)
            fetch('/api/tracking/click-v2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: ref,
                    landingPage: pathname,
                    utmSource,
                    utmMedium,
                    utmCampaign
                })
            }).then(response => response.json())
              .then(data => {
                  if (data.tracked) {
                      console.log('Affiliate click tracked:', data.affiliate);
                  }
              })
              .catch(err => console.error('Tracking failed', err));

            // Also track with legacy API for backward compatibility
            fetch('/api/tracking/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: ref })
            }).catch(err => console.error('Legacy tracking failed', err));
        }
    }, [searchParams, pathname]);

    // Track page view for existing affiliate
    useEffect(() => {
        const refClickId = document.cookie
            .split('; ')
            .find(row => row.startsWith('ref_click_id='))

        if (refClickId) {
            const clickId = refClickId.split('=')[1];
            // Could send page view event here
            console.log('Page view tracked for affiliate click:', clickId);
        }
    }, [pathname]);

    return null;
}

export default function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <TrackingLogic />
        </Suspense>
    );
}
