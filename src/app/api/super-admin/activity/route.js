import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
    try {
        const session = await auth();
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');
        const actionFilter = searchParams.get('action') || 'all'; // all, view, heartbeat

        // Date filter
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);

        let actionClause = {};
        if (actionFilter === 'view') {
            actionClause = { action: { in: ['STUDENT_VIEW_PAGE', 'STUDENT_VIEW_LESSON'] } };
        } else if (actionFilter === 'heartbeat') {
            actionClause = { action: 'STUDENT_HEARTBEAT' };
        } else {
            actionClause = {
                action: {
                    in: ['STUDENT_VIEW_PAGE', 'STUDENT_VIEW_LESSON', 'STUDENT_HEARTBEAT']
                }
            };
        }

        // Fetch logs
        const logs = await prisma.activityLog.findMany({
            where: {
                ...actionClause,
                createdAt: {
                    gte: dateLimit
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 300 // Limit list for performance
        });

        // Collect users details
        const userIds = Array.from(new Set(logs.map(log => log.userId)));
        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true, image: true }
        });
        const userMap = new Map(users.map(u => [u.id, u]));

        // Enrich logs list
        const enrichedLogs = logs.map(log => {
            const user = userMap.get(log.userId) || { 
                name: 'Utilisateur Inconnu', 
                email: 'inconnu@elsayf.click',
                image: null
            };
            let parsedDetails = {};
            try {
                parsedDetails = log.details ? JSON.parse(log.details) : {};
            } catch {
                parsedDetails = { raw: log.details };
            }
            return {
                id: log.id,
                action: log.action,
                userId: log.userId,
                createdAt: log.createdAt,
                ipAddress: log.ipAddress,
                userAgent: log.userAgent,
                user,
                details: parsedDetails
            };
        });

        // Fetch courses for mapping slugs to titles
        const dbCourses = await prisma.course.findMany({
            select: { slug: true, title: true }
        });
        const courseTitleMap = new Map(dbCourses.map(c => [c.slug, c.title]));

        // Fetch all heartbeat pings in this window to build student stats and course popularities
        const heartbeats = await prisma.activityLog.findMany({
            where: {
                action: 'STUDENT_HEARTBEAT',
                createdAt: {
                    gte: dateLimit
                }
            },
            select: {
                userId: true,
                details: true,
                createdAt: true
            }
        });

        const studentTimeMap = {};
        const courseTimeMap = {};

        heartbeats.forEach(ping => {
            let duration = 30; // standard heartbeat interval
            let courseSlug = 'general';
            
            try {
                const details = JSON.parse(ping.details);
                duration = details.duration || 30;
                
                // Try to resolve course slug
                if (details.courseSlug) {
                    courseSlug = details.courseSlug;
                } else if (details.path) {
                    const match = details.path.match(/\/(?:dashboard\/)?courses\/([^/]+)/);
                    if (match) {
                        courseSlug = match[1];
                    }
                }
            } catch {}

            // Initialize student tracking
            if (!studentTimeMap[ping.userId]) {
                studentTimeMap[ping.userId] = {
                    totalTime: 0,
                    lastActive: ping.createdAt,
                    courses: {}
                };
            }

            // Add time to student total
            studentTimeMap[ping.userId].totalTime += duration;
            
            if (ping.createdAt > studentTimeMap[ping.userId].lastActive) {
                studentTimeMap[ping.userId].lastActive = ping.createdAt;
            }

            // Add time to student course specific total
            if (!studentTimeMap[ping.userId].courses[courseSlug]) {
                studentTimeMap[ping.userId].courses[courseSlug] = 0;
            }
            studentTimeMap[ping.userId].courses[courseSlug] += duration;

            // Add time to course popularity total
            if (!courseTimeMap[courseSlug]) {
                courseTimeMap[courseSlug] = 0;
            }
            courseTimeMap[courseSlug] += duration;
        });

        // Fetch user profiles for the aggregation list
        const statsUserIds = Object.keys(studentTimeMap);
        const statsUsers = await prisma.user.findMany({
            where: { id: { in: statsUserIds } },
            select: { id: true, name: true, email: true, image: true }
        });

        const studentStatsList = statsUsers.map(user => {
            const data = studentTimeMap[user.id];
            
            // Map course slugs to human-readable names for student breakdowns
            const coursesBreakdown = {};
            Object.entries(data.courses).forEach(([slug, time]) => {
                const title = courseTitleMap.get(slug) || slug.replace(/-/g, ' ');
                coursesBreakdown[title] = time;
            });

            return {
                id: user.id,
                name: user.name || 'Utilisateur anonyme',
                email: user.email || '',
                image: user.image,
                totalTimeSpent: data.totalTime,
                lastActive: data.lastActive,
                coursesBreakdown
            };
        }).sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);

        // Map course popularity stats to titles
        const coursePopularity = [];
        Object.entries(courseTimeMap).forEach(([slug, duration]) => {
            const title = courseTitleMap.get(slug) || (slug === 'general' ? 'Navigation générale' : slug.replace(/-/g, ' '));
            coursePopularity.push({
                slug,
                title,
                duration
            });
        });
        coursePopularity.sort((a, b) => b.duration - a.duration);

        return NextResponse.json({
            logs: enrichedLogs,
            studentStats: studentStatsList,
            coursePopularity
        });

    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
