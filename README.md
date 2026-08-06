# Tiri — Event Invitation System

Tiri is a Next.js application for creating events, managing guests, sending digital invitations, and handling event-day check-in.

## Features

- Email/password and Google sign-in (Better Auth)
- Event creation flow with guest management
- Invitation generation and sending
- Invitation check-in terminal by event
- Dashboard with event summaries

## Tech Stack

- Next.js 16 + React 19
- TypeScript
- Prisma + PostgreSQL
- Better Auth
- Tailwind CSS

## Requirements

- Node.js 20+
- pnpm
- PostgreSQL

## Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=******localhost:5432/tiri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Generate Prisma client and run migrations:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

3. Start development server:

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

## Useful Scripts

- `pnpm dev` — start development server
- `pnpm build` — build for production
- `pnpm start` — run production build
- `pnpm lint` — run ESLint
- `pnpm typecheck` — run TypeScript checks

## Docker (Optional)

The repository includes `Dockerfile` and `docker-compose.yml` for containerized setup with PostgreSQL.

```bash
docker compose up --build
```

## Authors

- [@FIBA00](https://github.com/FIBA00)
- [@ENDragnee](https://github.com/ENDragnee)