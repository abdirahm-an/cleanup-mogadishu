# AGENTS.md - Cleanup Mogadishu Project

## Project Overview

A community-driven platform for residents of Mogadishu to identify, report, and coordinate cleanup efforts for areas needing environmental improvement.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Hosting**: Vercel

## Project Structure

```
cleanup-mogadishu/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-related routes
│   ├── (main)/            # Main app routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                   # Utilities and helpers
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # Auth configuration
├── prisma/               # Database
│   ├── schema.prisma     # Schema definition
│   └── seed.ts           # Seed data
├── types/                # TypeScript types
├── ralph/                # Ralph orchestration system
└── docs/                 # Documentation
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run typecheck    # Run TypeScript checks
npm run lint         # Run ESLint
npm run test         # Run tests
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
```

## Conventions

### Components

- Use Server Components by default
- Add 'use client' only when needed for interactivity
- Component files: PascalCase (e.g., `PostCard.tsx`)
- One component per file

### API Routes

- Use Route Handlers in `app/api/`
- Return proper HTTP status codes
- Use Zod for request validation

### Database

- All DB operations through Prisma
- Use transactions for multi-step operations
- Handle errors gracefully

### Styling

- Tailwind CSS only (no CSS modules or inline styles)
- Use design tokens from tailwind.config.js
- Mobile-first responsive design

## Environment Variables

Required in `.env`:
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

## Git Workflow

- Main branch: `main`
- Feature branches: `ralph/{story-id}` (e.g., `ralph/US-001`)
- Commit messages: `feat: {story-id} - {description}`

## Gotchas

_(Add learnings here as they're discovered)_

- Remember to run `npx prisma generate` after schema changes
- Mogadishu location data is seeded via `npm run db:seed`
