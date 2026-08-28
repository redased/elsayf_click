import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/tracking/click-v2
 * Advanced affiliate click tracking with device, browser, source detection
 */
export async function POST(request) {
    try {
        const { code, landingPage } = await request.json();

        if (!code) {
            return NextResponse.json({ error: 'Missing affiliate code' }, { status: 400 });
        }

        // Get headers for device/browser detection
        const headers = request.headers;
        const userAgent = headers.get('user-agent') || '';
        const referer = headers.get('referer') || headers.get('referrer') || null;

        // Detect device type
        let deviceType = 'desktop';
        if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)) {
            deviceType = 'mobile';
        } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            deviceType = 'tablet';
        }

        // Detect OS
        let os = null;
        if (/windows/i.test(userAgent)) os = 'Windows';
        else if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS';
        else if (/linux/i.test(userAgent)) os = 'Linux';
        else if (/android/i.test(userAgent)) os = 'Android';
        else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

        // Detect browser
        let browser = null;
        let browserVersion = null;
        if (/chrome/i.test(userAgent) && !/edge|opr|brave/i.test(userAgent)) {
            browser = 'Chrome';
            const match = userAgent.match(/chrome\/(\d+\.\d+\.\d+\.\d+)/i);
            if (match) browserVersion = match[1];
        } else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
            browser = 'Safari';
            const match = userAgent.match(/version\/(\d+\.\d+)/i);
            if (match) browserVersion = match[1];
        } else if (/firefox/i.test(userAgent)) {
            browser = 'Firefox';
            const match = userAgent.match(/firefox\/(\d+\.\d+)/i);
            if (match) browserVersion = match[1];
        } else if (/edge/i.test(userAgent)) {
            browser = 'Edge';
            const match = userAgent.match(/edge\/(\d+\.\d+)/i);
            if (match) browserVersion = match[1];
        }

        // Detect source from referrer
        let source = 'direct';
        if (referer) {
            const referrerLower = referer.toLowerCase();

            if (referrerLower.includes('facebook.com') || referrerLower.includes('fb.')) {
                source = 'facebook';
            } else if (referrerLower.includes('instagram.com')) {
                source = 'instagram';
            } else if (referrerLower.includes('linkedin.com')) {
                source = 'linkedin';
            } else if (referrerLower.includes('twitter.com') || referrerLower.includes('x.com')) {
                source = 'twitter';
            } else if (referrerLower.includes('tiktok.com')) {
                source = 'tiktok';
            } else if (referrerLower.includes('youtube.com') || referrerLower.includes('youtu.be')) {
                source = 'youtube';
            } else if (referrerLower.includes('google.')) {
                source = 'google';
            } else if (referrerLower.includes('bing.')) {
                source = 'bing';
            } else if (referrerLower.includes('whatsapp.com')) {
                source = 'whatsapp';
            } else if (referrerLower.includes('telegram.')) {
                source = 'telegram';
            } else {
                source = 'other';
            }
        }

        // Get IP address
        const ipAddress = headers.get('x-forwarded-for')?.split(',')[0] ||
                         headers.get('x-real-ip') ||
                         'unknown';

        // Generate session ID
        const sessionId = headers.get('cookie')?.match(/_session=([^;]+)/)?.[1] ||
                         `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Find affiliate link
        const affiliateLink = await prisma.affiliateLink.findUnique({
            where: { code }
        });

        if (!affiliateLink) {
            return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 });
        }

        // Create click event
        const clickEvent = await prisma.affiliateClick.create({
            data: {
                linkId: affiliateLink.id,
                deviceType,
                os,
                browser,
                browserVersion,
                referrer: referer,
                source,
                ipAddress,
                sessionId,
                landingPage: landingPage || '/'
            }
        });

        // Increment click count
        await prisma.affiliateLink.update({
            where: { id: affiliateLink.id },
            data: { clicks: { increment: 1 } }
        });

        // Set cookie for future attribution
        const response = NextResponse.json({
            success: true,
            tracked: true,
            clickId: clickEvent.id,
            affiliate: {
                code: affiliateLink.code,
                platform: affiliateLink.platform,
                influencer: affiliateLink.influencerName
            }
        });

        // Set cookie that lasts 30 days
        response.cookies.set('ref_code', code, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        response.cookies.set('ref_click_id', clickEvent.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60
        });

        return response;

    } catch (error) {
        console.error('Click tracking error:', error);
        return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
    }
}

/**
 * GET /api/tracking/click-v2
 * Get click statistics (admin only)
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const linkId = searchParams.get('linkId');
        const days = parseInt(searchParams.get('days')) || 30;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const clicks = await prisma.affiliateClick.findMany({
            where: {
                ...(linkId && { linkId }),
                createdAt: { gte: startDate }
            },
            include: {
                link: {
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate statistics
        const stats = {
            total: clicks.length,
            byDevice: {},
            byOS: {},
            byBrowser: {},
            bySource: {},
            conversions: clicks.filter(c => c.converted).length,
            conversionRate: 0
        };

        clicks.forEach(click => {
            stats.byDevice[click.deviceType] = (stats.byDevice[click.deviceType] || 0) + 1;
            if (click.os) stats.byOS[click.os] = (stats.byOS[click.os] || 0) + 1;
            if (click.browser) stats.byBrowser[click.browser] = (stats.byBrowser[click.browser] || 0) + 1;
            if (click.source) stats.bySource[click.source] = (stats.bySource[click.source] || 0) + 1;
        });

        stats.conversionRate = stats.total > 0 ? ((stats.conversions / stats.total) * 100).toFixed(2) : 0;

        return NextResponse.json({
            success: true,
            stats,
            clicks: clicks.slice(0, 100) // Limit to 100 most recent
        });

    } catch (error) {
        console.error('Error fetching click stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
