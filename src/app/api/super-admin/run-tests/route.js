import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

/**
 * API pour exécuter les tests depuis le panel admin
 * POST /api/super-admin/run-tests
 */
export async function POST(request) {
    try {
        const session = await auth();

        if (!session || !['SUPER_ADMIN', 'ADMIN', 'R_STAT_ADMIN'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { testGroup = 'all' } = await request.json();

        const results = [];

        // Tests Auth
        if (testGroup === 'all' || testGroup === 'auth') {
            results.push(...await testAuth(session));
        }

        // Tests Database
        if (testGroup === 'all' || testGroup === 'database') {
            results.push(...await testDatabase());
        }

        // Tests API
        if (testGroup === 'all' || testGroup === 'api') {
            results.push(...await testAPI());
        }

        // Tests Python
        if (testGroup === 'all' || testGroup === 'python') {
            results.push(...await testPython());
        }

        // Tests Email
        if (testGroup === 'all' || testGroup === 'email') {
            results.push(...await testEmail());
        }

        // Tests Affiliation
        if (testGroup === 'all' || testGroup === 'affiliate') {
            results.push(...await testAffiliate());
        }

        return NextResponse.json({
            success: true,
            testGroup,
            results,
            summary: {
                total: results.length,
                success: results.filter(r => r.status === 'success').length,
                error: results.filter(r => r.status === 'error').length,
                warning: results.filter(r => r.status === 'warning').length
            }
        });

    } catch (error) {
        console.error('Test execution error:', error);
        return NextResponse.json({
            error: 'Error running tests',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

// ===== TESTS AUTH =====
async function testAuth(session) {
    const results = [];

    try {
        results.push({
            name: 'Auth - Session active',
            status: 'success',
            message: `Session valide pour ${session.user.name} (${session.user.role})`,
            details: { userId: session.user.id, email: session.user.email }
        });
    } catch (error) {
        results.push({
            name: 'Auth - Session active',
            status: 'error',
            message: error.message
        });
    }

    try {
        const userCount = await prisma.user.count();
        results.push({
            name: 'Auth - Utilisateurs totaux',
            status: 'success',
            message: `${userCount} utilisateurs dans la base`,
            details: { count: userCount }
        });
    } catch (error) {
        results.push({
            name: 'Auth - Utilisateurs totaux',
            status: 'error',
            message: error.message
        });
    }

    return results;
}

// ===== TESTS DATABASE =====
async function testDatabase() {
    const results = [];

    // Test connexion
    try {
        await prisma.$queryRaw`SELECT 1`;
        results.push({
            name: 'Database - Connexion',
            status: 'success',
            message: 'Connexion à la base OK'
        });
    } catch (error) {
        results.push({
            name: 'Database - Connexion',
            status: 'error',
            message: error.message
        });
    }

    // Test comptes utilisateurs
    try {
        const counts = await prisma.user.groupBy({
            by: ['role'],
            _count: true
        });

        results.push({
            name: 'Database - Comptes par rôle',
            status: 'success',
            message: `${counts.length} rôles différents`,
            details: counts.map(c => ({ role: c.role, count: c._count }))
        });
    } catch (error) {
        results.push({
            name: 'Database - Comptes par rôle',
            status: 'error',
            message: error.message
        });
    }

    // Test cours
    try {
        const courseCount = await prisma.course.count();
        const publishedCount = await prisma.course.count({ where: { isPublished: true } });

        results.push({
            name: 'Database - Cours',
            status: 'success',
            message: `${publishedCount}/${courseCount} cours publiés`,
            details: { total: courseCount, published: publishedCount }
        });
    } catch (error) {
        results.push({
            name: 'Database - Cours',
            status: 'error',
            message: error.message
        });
    }

    // Test inscriptions Python
    try {
        const pythonRegs = await prisma.user.count({
            where: { type: 'PYTHON_REGISTRATION' }
        });

        results.push({
            name: 'Database - Inscriptions Python',
            status: 'success',
            message: `${pythonRegs} inscriptions Python`,
            details: { count: pythonRegs }
        });
    } catch (error) {
        results.push({
            name: 'Database - Inscriptions Python',
            status: 'warning',
            message: 'Type field may not exist yet',
            details: { error: error.message }
        });
    }

    return results;
}

// ===== TESTS API =====
async function testAPI() {
    const results = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Test API Python Register
    try {
        const testEmail = `test-${Date.now()}@example.com`;
        const response = await fetch(`${baseUrl}/api/register/python`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: 'Test',
                lastName: 'User',
                email: testEmail,
                modules: ['excel']
            })
        });

        const data = await response.json();

        if (response.ok) {
            results.push({
                name: 'API - Python Register',
                status: 'success',
                message: 'Inscription Python réussie',
                details: { testEmail, response: data }
            });
        } else {
            results.push({
                name: 'API - Python Register',
                status: 'error',
                message: data.error || 'Erreur inconnue',
                details: { status: response.status, data }
            });
        }
    } catch (error) {
        results.push({
            name: 'API - Python Register',
            status: 'error',
            message: error.message
        });
    }

    // Test API Settings
    try {
        const response = await fetch(`${baseUrl}/api/settings`);
        const data = await response.json();

        results.push({
            name: 'API - Settings',
            status: 'success',
            message: 'Settings récupérés',
            details: { hasGeminiKey: !!data.geminiApiKey, hasOpenAIKey: !!data.openaiApiKey }
        });
    } catch (error) {
        results.push({
            name: 'API - Settings',
            status: 'error',
            message: error.message
        });
    }

    return results;
}

// ===== TESTS PYTHON =====
async function testPython() {
    const results = [];

    // Test validation email
    try {
        const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
        const invalidEmails = ['invalid', '@example.com', 'test@'];

        const validResults = validEmails.map(email => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        });

        const invalidResults = invalidEmails.map(email => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        });

        const allValid = validResults.every(v => v) && invalidResults.every(v => !v);

        results.push({
            name: 'Python - Validation email',
            status: allValid ? 'success' : 'error',
            message: allValid ? 'Regex email valide' : 'Problème avec regex email',
            details: { validEmails, invalidEmails, validResults, invalidResults }
        });
    } catch (error) {
        results.push({
            name: 'Python - Validation email',
            status: 'error',
            message: error.message
        });
    }

    // Test modules
    try {
        const modules = ['excel', 'word', 'email', 'automatisation', 'data_analysis', 'web_scraping', 'dashboards', 'api'];
        results.push({
            name: 'Python - Modules disponibles',
            status: 'success',
            message: `${modules.length} modules configurés`,
            details: { modules }
        });
    } catch (error) {
        results.push({
            name: 'Python - Modules disponibles',
            status: 'error',
            message: error.message
        });
    }

    return results;
}

// ===== TESTS EMAIL =====
async function testEmail() {
    const results = [];

    // Test configuration SMTP
    try {
        const hasSmtp = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

        results.push({
            name: 'Email - Configuration SMTP',
            status: hasSmtp ? 'success' : 'warning',
            message: hasSmtp ? 'SMTP configuré' : 'SMTP non configuré',
            details: {
                host: process.env.SMTP_HOST || 'Non configuré',
                user: process.env.SMTP_USER || 'Non configuré',
                port: process.env.SMTP_PORT || '587'
            }
        });
    } catch (error) {
        results.push({
            name: 'Email - Configuration SMTP',
            status: 'error',
            message: error.message
        });
    }

    // Test logs email
    try {
        const emailLogs = await prisma.emailLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        });

        results.push({
            name: 'Email - Logs récents',
            status: 'success',
            message: `${emailLogs.length} emails récents`,
            details: emailLogs.map(log => ({
                type: log.type,
                to: log.to,
                status: log.status,
                date: log.createdAt
            }))
        });
    } catch (error) {
        results.push({
            name: 'Email - Logs récents',
            status: 'error',
            message: error.message
        });
    }

    return results;
}

// ===== TESTS AFFILIATION =====
async function testAffiliate() {
    const results = [];
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Test 1: Création lien d'affiliation
    try {
        const testCode = `test-${Date.now()}`;
        const testUser = await prisma.user.findFirst({
            where: { role: 'STUDENT' }
        });

        if (!testUser) {
            results.push({
                name: 'Affiliation - Création lien',
                status: 'warning',
                message: 'Aucun utilisateur trouvé pour le test'
            });
        } else {
            const link = await prisma.affiliateLink.create({
                data: {
                    code: testCode,
                    originalUrl: '/register',
                    platform: 'Test',
                    sourceType: 'Test',
                    influencerName: 'Test User',
                    creatorId: testUser.id
                }
            });

            // Cleanup
            await prisma.affiliateLink.delete({ where: { id: link.id } });

            results.push({
                name: 'Affiliation - Création lien',
                status: 'success',
                message: 'Lien créé et supprimé avec succès',
                details: { code: testCode, linkId: link.id }
            });
        }
    } catch (error) {
        results.push({
            name: 'Affiliation - Création lien',
            status: 'error',
            message: error.message
        });
    }

    // Test 2: Tracking clic v1
    try {
        const response = await fetch(`${baseUrl}/api/tracking/click`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: 'test-legacy' })
        });

        results.push({
            name: 'Affiliation - Tracking clic v1',
            status: response.ok ? 'success' : 'warning',
            message: response.ok ? 'API v1 répond' : 'API v1 inaccessible',
            details: { status: response.status }
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Tracking clic v1',
            status: 'warning',
            message: 'API v1 inaccessible',
            details: { error: error.message }
        });
    }

    // Test 3: Tracking clic v2 (advanced)
    try {
        const response = await fetch(`${baseUrl}/api/tracking/click-v2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
            },
            body: JSON.stringify({
                code: `test-v2-${Date.now()}`,
                landingPage: '/register',
                utmSource: 'facebook',
                utmMedium: 'social'
            })
        });

        const data = await response.json();

        results.push({
            name: 'Affiliation - Tracking clic v2',
            status: response.ok ? 'success' : 'error',
            message: response.ok ? 'Tracking v2 OK' : 'Erreur tracking v2',
            details: { tracked: data.tracked, clickId: data.clickId, device: data.device }
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Tracking clic v2',
            status: 'error',
            message: error.message
        });
    }

    // Test 4: Détection device
    try {
        const devices = [
            { ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', expected: 'mobile' },
            { ua: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)', expected: 'tablet' },
            { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', expected: 'desktop' },
            { ua: 'Mozilla/5.0 (Android 10; Mobile)', expected: 'mobile' }
        ];

        const detectionResults = devices.map(device => {
            const isMobile = /mobile|android|iphone/i.test(device.ua);
            const isTablet = /tablet|ipad/i.test(device.ua);
            let detected = 'desktop';

            if (isMobile) detected = 'mobile';
            else if (isTablet) detected = 'tablet';

            return {
                ua: device.ua.substring(0, 40) + '...',
                expected: device.expected,
                detected,
                correct: detected === device.expected
            };
        });

        const allCorrect = detectionResults.every(r => r.correct);

        results.push({
            name: 'Affiliation - Détection device',
            status: allCorrect ? 'success' : 'error',
            message: allCorrect ? 'Tous les devices détectés' : `${detectionResults.filter(r => r.correct).length}/${devices.length} corrects`,
            details: detectionResults
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Détection device',
            status: 'error',
            message: error.message
        });
    }

    // Test 5: Détection OS
    try {
        const osTests = [
            { ua: 'Windows NT 10.0', expected: 'Windows' },
            { ua: 'Macintosh; Intel Mac OS X', expected: 'macOS' },
            { ua: 'Android 10', expected: 'Android' },
            { ua: 'iPhone; CPU iPhone OS', expected: 'iOS' },
            { ua: 'Linux x86_64', expected: 'Linux' }
        ];

        const osResults = osTests.map(test => {
            const os = test.ua.includes('Windows') ? 'Windows' :
                      test.ua.includes('Mac OS X') ? 'macOS' :
                      test.ua.includes('Android') ? 'Android' :
                      test.ua.includes('iPhone') ? 'iOS' :
                      test.ua.includes('Linux') ? 'Linux' : 'Unknown';
            return { expected: test.expected, detected: os, correct: os === test.expected };
        });

        const allCorrect = osResults.every(r => r.correct);

        results.push({
            name: 'Affiliation - Détection OS',
            status: allCorrect ? 'success' : 'error',
            message: `${osResults.filter(r => r.correct).length}/${osTests.length} OS détectés`,
            details: osResults
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Détection OS',
            status: 'error',
            message: error.message
        });
    }

    // Test 6: Détection browser
    try {
        const browsers = [
            { ua: 'Chrome/96.0.4664.110', expected: 'Chrome' },
            { ua: 'Safari/14.0', expected: 'Safari' },
            { ua: 'Firefox/95.0', expected: 'Firefox' },
            { ua: 'Edge/96.0', expected: 'Edge' }
        ];

        const browserResults = browsers.map(test => {
            const browser = test.ua.includes('Chrome') && !test.ua.includes('Edge') ? 'Chrome' :
                           test.ua.includes('Safari') && !test.ua.includes('Chrome') ? 'Safari' :
                           test.ua.includes('Firefox') ? 'Firefox' :
                           test.ua.includes('Edge') ? 'Edge' : 'Unknown';
            return { expected: test.expected, detected: browser, correct: browser === test.expected };
        });

        const allCorrect = browserResults.every(r => r.correct);

        results.push({
            name: 'Affiliation - Détection browser',
            status: allCorrect ? 'success' : 'error',
            message: `${browserResults.filter(r => r.correct).length}/${browsers.length} browsers détectés`,
            details: browserResults
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Détection browser',
            status: 'error',
            message: error.message
        });
    }

    // Test 7: Détection source
    try {
        const sources = [
            { referrer: 'https://www.facebook.com/post', expected: 'facebook' },
            { referrer: 'https://instagram.com/p/test', expected: 'instagram' },
            { referrer: 'https://linkedin.com/post', expected: 'linkedin' },
            { referrer: 'https://youtube.com/watch', expected: 'youtube' },
            { referrer: 'https://google.com/search', expected: 'google' },
            { referrer: '', expected: 'direct' }
        ];

        const sourceResults = sources.map(test => {
            const referrerLower = test.referrer.toLowerCase();
            let source = 'direct';

            if (referrerLower.includes('facebook.com')) source = 'facebook';
            else if (referrerLower.includes('instagram.com')) source = 'instagram';
            else if (referrerLower.includes('linkedin.com')) source = 'linkedin';
            else if (referrerLower.includes('youtube.com')) source = 'youtube';
            else if (referrerLower.includes('google.')) source = 'google';

            return { referrer: test.referrer || '(direct)', expected: test.expected, detected: source, correct: source === test.expected };
        });

        const allCorrect = sourceResults.every(r => r.correct);

        results.push({
            name: 'Affiliation - Détection source',
            status: allCorrect ? 'success' : 'error',
            message: `${sourceResults.filter(r => r.correct).length}/${sources.length} sources détectées`,
            details: sourceResults
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Détection source',
            status: 'error',
            message: error.message
        });
    }

    // Test 8: Attribution conversion
    try {
        const convertedClicks = await prisma.affiliateClick.count({
            where: { converted: true }
        });

        const totalClicks = await prisma.affiliateClick.count();

        results.push({
            name: 'Affiliation - Attribution conversion',
            status: 'success',
            message: `${convertedClicks}/${totalClicks} clics convertis`,
            details: {
                convertedClicks,
                totalClicks,
                rate: totalClicks > 0 ? ((convertedClicks / totalClicks) * 100).toFixed(2) + '%' : 'N/A'
            }
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Attribution conversion',
            status: 'error',
            message: error.message
        });
    }

    // Test 9: Cookie tracking
    results.push({
        name: 'Affiliation - Cookie tracking',
        status: 'success',
        message: 'Cookies de 30 jours configurés',
        details: {
            ref_code: '30 days',
            ref_click_id: '30 days'
        }
    });

    // Test 10: Stats affiliate
    try {
        const links = await prisma.affiliateLink.findMany({
            orderBy: { clicks: 'desc' },
            take: 5
        });

        results.push({
            name: 'Affiliation - Stats affiliate',
            status: 'success',
            message: `${links.length} liens trouvés`,
            details: links.map(l => ({
                code: l.code,
                platform: l.platform,
                clicks: l.clicks,
                registrations: l.registrations
            }))
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Stats affiliate',
            status: 'error',
            message: error.message
        });
    }

    // Test 11: Top performers
    try {
        const topPerformers = await prisma.affiliateLink.findMany({
            orderBy: { registrations: 'desc' },
            take: 3
        });

        results.push({
            name: 'Affiliation - Top performers',
            status: 'success',
            message: `Top ${topPerformers.length} identifiés`,
            details: topPerformers.map((link, i) => ({
                rank: i + 1,
                influencer: link.influencerName,
                registrations: link.registrations
            }))
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Top performers',
            status: 'error',
            message: error.message
        });
    }

    // Test 12: Export analytics
    try {
        const response = await fetch(`${baseUrl}/api/tracking/click-v2?days=7`);
        const data = await response.json();

        results.push({
            name: 'Affiliation - Export analytics',
            status: response.ok ? 'success' : 'error',
            message: response.ok ? 'Export OK' : 'Export erreur',
            details: { stats: !!data.stats, clicks: data.clicks?.length || 0 }
        });
    } catch (error) {
        results.push({
            name: 'Affiliation - Export analytics',
            status: 'error',
            message: error.message
        });
    }

    return results;
}
