'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UserActivityTracker() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const activePathRef = useRef(pathname);

    // Keep pathname updated in ref for interval use
    useEffect(() => {
        activePathRef.current = pathname;
    }, [pathname]);

    // 1. Log view page when pathname changes
    useEffect(() => {
        if (!session?.user) return;

        // Skip layout pages, auth transitions, or admin panel from student logs
        if (
            pathname.startsWith('/super-admin') ||
            pathname.startsWith('/admin') ||
            pathname === '/auth-redirect' ||
            pathname.startsWith('/api/')
        ) {
            return;
        }

        const logPageView = async (path) => {
            try {
                await fetch('/api/tracking/activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'STUDENT_VIEW_PAGE',
                        path: path
                    })
                });
            } catch (e) {
                console.error('[Activity Tracker] Failed to log view page:', e);
            }
        };

        logPageView(pathname);

    }, [pathname, session?.user?.id]);

    // 2. Setup 30s heartbeat ping
    useEffect(() => {
        if (!session?.user) return;

        const interval = setInterval(async () => {
            const currentPath = activePathRef.current;

            // Only log if tab is focused/visible
            if (document.visibilityState !== 'visible') return;

            // Skip admin panels
            if (currentPath.startsWith('/super-admin') || currentPath.startsWith('/admin')) {
                return;
            }

            // Skip course dashboard paths because they handle their own detailed heartbeats!
            if (currentPath.includes('/dashboard/courses/')) {
                return;
            }

            try {
                await fetch('/api/tracking/activity', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'STUDENT_HEARTBEAT',
                        path: currentPath,
                        duration: 30
                    })
                });
            } catch (e) {
                console.error('[Activity Tracker] Heartbeat error:', e);
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [session?.user?.id]);

    return null;
}
