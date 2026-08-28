# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

El Sayf (Esayf) is a French-language e-learning platform built for StatLabo. It offers courses in Python and R Statistics with an integrated affiliate tracking system, payment via Chargily Pay (Algerian payment gateway), and a role-based access system. The primary language for UI text and documentation is **French**, with i18n support for Arabic, English, and Japanese.

Production URL: https://elsayf.statlabo.com

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Auth**: NextAuth v5 (Auth.js) with JWT strategy, Google OAuth + Credentials providers (`src/auth.ts`)
- **ORM**: Prisma 5 with SQLite (dev) / PostgreSQL (production)
- **Styling**: Tailwind CSS 4 (via PostCSS plugin, not `@tailwind` directives)
- **Real-time**: Pusher for chat/forum
- **Payment**: Chargily Pay (DZ-specific gateway)
- **AI**: OpenAI, Google Gemini, Z-AI (configurable per-user via `Settings` model)
- **Python Backend**: Django 5 at `backend-python/`, proxied via Next.js rewrites (`/api/bot/*` -> Django)
- **Testing**: Jest 30 + React Testing Library

## Common Commands

```bash
npm run dev              # Dev server on :3000
npm run build            # Production build (standalone output)
npm start                # Production server (runs server.js)

# Database
npx prisma generate      # Generate Prisma client after schema changes
npx prisma db push       # Push schema to DB (no migration)
npx prisma migrate dev   # Create migration
npx prisma studio        # DB browser on :5555
npx prisma db seed       # Seed DB (runs prisma/seed.js)

# Tests
npx jest                 # Run all tests
npx jest path/to/test    # Run a single test file
npx jest --watch         # Watch mode

# Docker
docker-compose up -d --build   # Full stack (web :3001, bot-engine :8001)
```

## Architecture

### Authentication Flow

Auth is configured in `src/auth.ts` exporting `{ handlers, auth, signIn, signOut }`. API routes check auth via:
```js
import { auth } from "@/auth";
const session = await auth();
// session.user.id, session.user.role
```

### Role System

Roles stored as string in `User.role`: `STUDENT`, `ADMIN`, `SUPER_ADMIN`, `R_STAT_ADMIN`, `MARKETING_ADMIN`. Additionally, `AdminPermission` model provides granular per-admin permissions. Role checks in API routes use direct string comparison against `session.user.role`.

### Internationalization

`src/context/LanguageContext.js` provides a `LanguageProvider` wrapping the app. Translations live in `src/lib/translations.js` as a nested object keyed by locale (`fr`, `ar`, `en`, `ja`). Default language is `fr`. Database models have `_ar`, `_en`, `_ja` suffixed columns for multilingual content (e.g., `title`, `title_ar`, `title_en`, `title_ja`).

### Affiliate Tracking

Two coexisting versions:
- **v1 (Legacy)**: `/api/tracking/click` - simple counter
- **v2 (Advanced)**: `/api/tracking/click-v2` - device/OS/browser/source detection, 30-day cookie attribution

`AffiliateTracker.js` component in root layout reads `?ref=CODE` from URL params and fires tracking calls.

### Payment Flow

Chargily Pay integration. `Payment` model tracks checkout lifecycle (`pending` -> `paid` / `failed`). Successful payments create `CourseEnrollment` records.

### Course Structure

`Course` -> `Lesson` -> `CourseContent` (ordered content blocks per lesson). Quizzes: `Lesson` -> `Quiz` -> `Question` -> `Answer`. Progress tracked via `CourseProgress` (course-level) and `UserLessonProgress` (lesson-level).

### Next.js Config

`next.config.mjs` sets `output: 'standalone'` for Docker and rewrites `/api/bot/*` to the Python Django backend.

### Prisma Singleton

`src/lib/prisma.js` exports a singleton Prisma client (avoids multiple instances in dev hot reload).

## Conventions

- **Imports**: Use `@/` alias for `src/` (e.g., `@/lib/prisma`, `@/components/Navbar`)
- **API Routes**: One `route.js` file per endpoint following Next.js App Router conventions
- **Components**: Server Components by default; `"use client"` directive when needed
- **Naming**: PascalCase for components, camelCase for utilities and variables
- **Styling**: Tailwind utility classes directly in JSX (no CSS modules)

## Database Notes

- Dev uses SQLite (`file:./dev.db`), production uses PostgreSQL
- Prisma schema is at `prisma/schema.prisma`
- Multiple seed scripts exist (`seed.js`, `seed-r.js`, `seed_courses.js`, etc.) for different course data
- The `Settings` model stores app-wide config (AI provider keys, SMTP, Twitch integration) - editable via super-admin UI
