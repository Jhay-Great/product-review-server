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

Express 5 / TypeScript backend for a product feedback platform. PostgreSQL is the active database; MongoDB is configured but currently unused (its connection call is commented out in `server.ts`).

**Request flow:** `server.ts` → `app.ts` (middleware stack) → `src/routes/index.ts` → individual route files → controllers → pg-services → PostgreSQL pool (`src/config/db.pgConfig.ts`).

### Key Directories

- `src/routes/` — route definitions; all mounted under `/api/v1/` in `routes/index.ts`
- `src/controllers/` — thin request handlers; should delegate business logic to services
- `src/services/pg-services/` — PostgreSQL data access layer (active services)
- `src/services/` — legacy/non-pg services; `feedbackService.ts` here targets MongoDB
- `src/middleware/` — `authMiddleware.ts` (JWT guard: `requireAuth`), `errorHandler.ts` (global error handler)
- `src/utils/` — `jwt.ts`, `hash.ts`, `email.ts`, and `errors/` (custom error classes)
- `src/types/express/` — module augmentation that adds `req.authUser.userId`
- `migrations/` — raw SQL migration files (applied manually)

### Auth

JWT Bearer tokens (`Authorization: Bearer <token>`). `requireAuth` middleware validates the token and populates `req.authUser.userId`. Tokens expire in 1 hour. Password reset uses a SHA-256 hashed token stored in the `users` table (`password_reset_token`, `password_reset_expires`).

There are two overlapping login implementations: `auth.controller.ts` (under `/api/v1/auth/`) and `user.controller.ts` (under `/api/v1/user/`). The `user.controller.ts` version is the more complete one.

### Error Handling

Custom error hierarchy in `src/utils/errors/`:
- `AppError` — base class with `statusCode` and `isOperational` flag
- `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409), `InternalServerError` (500)

Throw these from controllers/services; the global `errorHandler` middleware in `app.ts` catches them and returns a standardized JSON response. Non-operational errors (unexpected crashes) are logged and return a generic 500.

### Email

`src/utils/email.ts` sends via SMTP (env vars). In development, if SMTP vars are absent it automatically creates an Ethereal test account and logs the preview URL to the console.

## Environment Variables

```
PORT
PG_HOST / PG_PORT / PG_DATABASE / PG_USER / PG_PASSWORD   # PostgreSQL
DB_URI / DB_USER / DB_PASSWORD                             # MongoDB (unused currently)
JWT_SECRET
ALLOWED_ORIGINS   # Comma-separated list for CORS whitelist
FRONTEND_URL      # Used in password-reset email links
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS              # Optional; falls back to Ethereal
```

## Database

PostgreSQL via the `pg` driver with a connection pool. The server runs `SELECT 1` on startup to verify connectivity. Migrations are plain SQL files in `migrations/` and must be applied manually.

Inferred table schema:
- `users` — id, firstname, lastname, email, username, password, password_reset_token, password_reset_expires
- `feedback` — id, title, category, description, status, upvotes (+ timestamps)
- `comments` — id, comment, feedbackId (FK → feedback)

## Known Gaps

- `comment.controller.ts` stubs responses without hitting the database.
- Several controllers lack try-catch; errors from service calls will propagate as unhandled rejections rather than through the global error handler.
- The DELETE `/product-feedback/:feedbackId` route is not protected by `requireAuth`.
