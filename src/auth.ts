import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"


// Détection dynamique multi-domaine (elsayf.click ET mycv.click)
// Supprimer les URLs statiques qui forcent les redirections vers un seul domaine
delete process.env.AUTH_URL;
delete process.env.NEXTAUTH_URL;
process.env.AUTH_TRUST_HOST = "true";

// DEBUG: Check environment variables
const googleId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

if (!googleId || !googleSecret) {
    console.error("❌ CRITICAL ERROR: Google Client ID or Secret is missing in environment variables!");
    console.error("GOOGLE_CLIENT_ID:", googleId ? "Set" : "Missing");
    console.error("GOOGLE_CLIENT_SECRET:", googleSecret ? "Set" : "Missing");
} else {
    console.log("✅ Google Auth credentials loaded successfully.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    providers: [
        Google({
            clientId: googleId,
            clientSecret: googleSecret,
            allowDangerousEmailAccountLinking: true,
            checks: ["state"],
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !user.password) return null;

                // Check password
                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!passwordsMatch) return null;

                return user;
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (user) {
                token.id = user.id;

                // Récupérer le rôle directement depuis la DB
                // (l'objet user OAuth peut ne pas inclure les champs custom)
                if (user.id) {
                    try {
                        const dbUser = await prisma.user.findUnique({
                            where: { id: user.id as string },
                            select: { role: true, rStatAdminAccess: true }
                        });
                        token.role = dbUser?.role ?? (user as any).role ?? 'STUDENT';
                        token.rStatAdminAccess = dbUser?.rStatAdminAccess ?? (user as any).rStatAdminAccess ?? false;
                    } catch {
                        token.role = (user as any).role ?? 'STUDENT';
                        token.rStatAdminAccess = (user as any).rStatAdminAccess ?? false;
                    }

                    // Auto-enroll new users in free courses
                    try {
                        const freeCourses = await prisma.course.findMany({
                            where: { isFree: true, isPublished: true },
                            select: { id: true }
                        });

                        for (const course of freeCourses) {
                            await prisma.courseEnrollment.upsert({
                                where: {
                                    userId_courseId: {
                                        userId: user.id as string,
                                        courseId: course.id
                                    }
                                },
                                update: {},
                                create: {
                                    userId: user.id as string,
                                    courseId: course.id,
                                    enrollmentType: 'FREE'
                                }
                            });
                        }
                    } catch (e) {
                        console.error("Auto-enroll error:", e);
                    }

                    // Notification Telegram instantanée lors d'une connexion ou inscription Google
                    if (account?.provider === 'google') {
                        try {
                            const { notifyTelegramInstantEvent } = await import('@/lib/telegram');
                            notifyTelegramInstantEvent('GOOGLE_AUTH', {
                                name: user.name || '',
                                email: user.email || '',
                                isNewUser: Boolean((user as any).isNewUser),
                                source: 'MyCV.click / Elsayf (Google OAuth)',
                            }).catch(() => {});
                        } catch (e) {
                            // Silencieux pour ne pas bloquer l'authentification
                        }
                    }
                } else {
                    token.role = (user as any).role ?? 'STUDENT';
                    token.rStatAdminAccess = (user as any).rStatAdminAccess ?? false;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                (session.user as any).rStatAdminAccess = token.rStatAdminAccess ?? false;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Permettre les redirections relatives
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }
            // Autoriser les domaines autorisés du projet
            try {
                const parsed = new URL(url);
                if (
                    parsed.origin === baseUrl ||
                    parsed.hostname.endsWith("elsayf.click") ||
                    parsed.hostname.endsWith("mycv.click") ||
                    parsed.hostname.endsWith("elsayf.statlabo.com") ||
                    parsed.hostname === "localhost"
                ) {
                    return url;
                }
            } catch {
                // Ignore invalid URL
            }
            return baseUrl;
        }
    },
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
})

