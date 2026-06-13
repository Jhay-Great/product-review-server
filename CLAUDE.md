# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with nodemon (hot reload)
npm run build     # Compile TypeScript → dist/
npm start         # Build + run compiled output (production)
```

No test runner is configured yet (`npm test` is a placeholder).

## Architecture Overview

Express 5 / TypeScript backend for a product feedback platform. PostgreSQL is the active database.

**Request flow:** `server.ts` → `app.ts` (middleware stack) → `src/routes/index.ts` → module route files → controllers → services → PostgreSQL pool (`src/config/database.ts`).

### Module Structure

Code is organised by feature under `src/modules/`. Each module owns its routes, controller, service, and Zod schema:

```
src/
├── modules/
│   ├── auth/        # login, logout — auth.routes / auth.controller / auth.service / auth.schema
│   ├── user/        # register, forgot/reset password — user.routes / user.controller / user.service
│   ├── feedback/    # feedback CRUD + upvote — feedback.routes / feedback.controller / feedback.service / feedback.schema
│   └── comment/     # comments on feedback — comment.routes / comment.controller / comment.service / comment.schema
├── middleware/
│   ├── auth.middleware.ts      # requireAuth — JWT guard, sets req.authUser.userId
│   ├── error.middleware.ts     # global error handler
│   ├── validate.middleware.ts  # validate(ZodSchema) factory
│   └── rate-limit.middleware.ts # authRateLimit — 10 req / 15 min
├── config/
│   ├── cors.ts                 # origin whitelist from ALLOWED_ORIGINS env var
│   └── database.ts             # pg Pool + checkDBServer() startup health check
├── types/
│   ├── models.ts               # shared interfaces: User, Feedback, Comment, CreateFeedback, UpdateFeedback, etc.
│   └── express/index.d.ts      # augments Request with req.authUser.userId
├── utils/
│   ├── jwt.ts                  # generateToken / verifyToken
│   ├── hash.ts                 # hashPassword / comparePassword (bcrypt)
│   ├── email.ts                # sendResetPasswordEmail (falls back to Ethereal in dev)
│   └── errors/                 # AppError base class + HTTP error subclasses
├── routes/index.ts             # mounts all module routers under /api/v1/
├── app.ts                      # middleware stack: helmet → cors → json → morgan → routes → 404 → error handler
└── server.ts                   # starts PostgreSQL pool, then HTTP server
```

### Auth

JWT Bearer tokens (`Authorization: Bearer <token>`, 1-hour expiry). `requireAuth` in `auth.middleware.ts` validates the token and populates `req.authUser.userId`. Both login endpoints (`/auth/login` and `/user/login`) delegate to `loginWithEmailPassword` in `auth.service.ts` — both bad-email and bad-password cases return the same `UnauthorizedError` to prevent user enumeration.

Password reset: raw token sent to user via email, SHA-256 hash stored in `users.password_reset_token` with a 1-hour expiry.

### Validation

Every route that accepts a body uses `validate(ZodSchema)` middleware (defined in `validate.middleware.ts`). Schemas live in `<module>.schema.ts` alongside their routes. Validation runs before the controller; invalid input is forwarded as a `BadRequestError` with a field-level error message.

### Error Handling

Custom error hierarchy in `src/utils/errors/`:
- `AppError` — base class with `statusCode` and `isOperational` flag
- `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409), `InternalServerError` (500)

Throw these from controllers or services; `error.middleware.ts` catches them and returns a standardised JSON response. Non-operational errors log a full stack trace and return a generic 500.

### Email

`src/utils/email.ts` sends via SMTP. If `SMTP_HOST`/`SMTP_USER`/`SMTP_PASS` are absent, it creates an Ethereal test account automatically and the preview URL is returned in the function result.

## Environment Variables

```
PORT
PG_HOST / PG_PORT / PG_DATABASE / PG_USER / PG_PASSWORD   # PostgreSQL
JWT_SECRET
ALLOWED_ORIGINS     # Comma-separated list for CORS whitelist
FRONTEND_URL        # Used in password-reset email links
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS              # Optional; falls back to Ethereal
```

## Database

PostgreSQL via the `pg` driver with a connection pool. The server runs `SELECT 1` on startup to verify connectivity. Migrations are plain SQL files in `migrations/` and must be applied manually in order:

- `migrations/001-initial-schema.sql` — creates `users`, `feedback`, `comments` tables
- `migrations/002-create-comments-table.sql` — superseded by 001 (comments are in the base schema); safe to skip if running from scratch
- `migrations/2026-03-07-add-password-reset.sql` — adds password reset columns (already in 001 base schema; only needed when upgrading an existing DB)

Table schema:
- `users` — id, firstname, lastname, email, username, password, password_reset_token, password_reset_expires, created_at, updated_at
- `feedback` — id, title, category, description, status, upvotes, user_id (FK → users), created_at, updated_at
- `comments` — id, content, feedback_id (FK → feedback, CASCADE delete), user_id (FK → users), created_at, updated_at
