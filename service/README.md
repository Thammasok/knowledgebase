# San AI — Backend Service

Backend service for the **San AI** platform — AI assistant for Business. Built with Node.js, Express, and TypeScript.

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Language:** TypeScript
- **ORM:** Prisma with PostgreSQL
- **Cache:** Redis
- **Auth:** JWT (access + refresh token)
- **Validation:** Joi
- **Email:** SendGrid / Nodemailer
- **Logging:** Pino
- **Testing:** Jest + Supertest

## Project Structure

```text
service/
├── src/
│   ├── api/                    # Feature modules (route → controller → service → repository)
│   │   ├── auth/               # Authentication (login, signup, OTP, forgot password)
│   │   ├── auth-session/       # Session management
│   │   ├── account/            # Account profile and settings
│   │   │   ├── profile/
│   │   │   └── setting/
│   │   ├── health/             # Health check endpoint
│   │   └── routes.ts           # Main routes aggregator
│   ├── boot/                   # Application bootstrap
│   │   ├── app.ts              # Express app setup (CORS, rate-limit, middleware)
│   │   ├── router.ts           # Dynamic route registrar
│   │   ├── validator.ts        # Joi validation middleware
│   │   ├── rate-limit.ts       # Rate limiting
│   │   └── logger.ts           # Pino logger configuration
│   ├── config/                 # Environment-based configuration
│   ├── constant/               # Application constants
│   ├── exceptions/             # Custom HTTP exceptions
│   ├── libs/                   # Shared libraries (jwt, mail, redis, db, uuid)
│   ├── middleware/             # Express middlewares (auth, error, multer)
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Helper functions (hash, pagination, slug, IP)
│   ├── views/                  # Handlebars email templates
│   └── server.ts               # Entry point with graceful shutdown
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
├── generated/
│   └── prisma/                 # Generated Prisma client
├── .env.example                # Environment variable template
└── package.json
```

## Prerequisites

- Node.js v18+
- PostgreSQL
- Redis
- pnpm

## Installation

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration (see [Environment Variables](#environment-variables)).

4. Run database migrations:

```bash
pnpm run prisma:mig:init
```

5. Generate Prisma client:

```bash
pnpm run prisma:generate
```

## Development

```bash
pnpm dev
```

Server runs at `http://localhost:3030` by default.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run production server |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:cov` | Run tests with coverage report |
| `pnpm run prisma:generate` | Generate Prisma client |
| `pnpm run prisma:mig:init` | Run initial migration |
| `pnpm run prisma:mig:deploy` | Deploy migrations (production) |
| `pnpm run prisma:reset` | Reset database (development only) |
| `pnpm run prisma:seed` | Seed database |

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Health

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Service health check |

### Authentication

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/auth/signup` | — | Register a new account |
| `POST` | `/auth/request-access` | — | Request account access |
| `POST` | `/auth/signup/request-access` | — | Sign up from an access request |
| `POST` | `/auth/login` | — | Login and receive tokens |
| `POST` | `/auth/refresh` | Refresh token | Refresh access token |
| `POST` | `/auth/logout` | Access token | Logout and invalidate session |
| `POST` | `/auth/otp` | — | OTP operations |
| `POST` | `/auth/forgot` | — | Initiate forgot password flow |

### Account

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/account/profile` | Access token | Get user profile |
| `POST` | `/account/profile` | Access token | Update user profile |
| `GET` | `/account/setting` | Access token | Get account settings |
| `POST` | `/account/setting` | Access token | Update account settings |

### Auth Sessions

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/auth-session` | Access token | List active sessions |
| `DELETE` | `/auth-session/:id` | Access token | Revoke a session |

> **Device ID:** Auth-protected endpoints require a `x-device-id` header.

## Database Schema

| Model | Description |
|-------|-------------|
| `Accounts` | User accounts (email, password, profile) |
| `AccountRequestAccess` | Pre-approved email access list |
| `AccountForgotPassword` | Password reset tokens |
| `AuthSession` | Active login sessions per device |
| `AccountSetting` | User preferences (language, theme) |

## Environment Variables

```env
NODE_ENV=development
PORT=3030

# Enable test APIs (set false in production)
ENABLE_API_TEST=false

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/san_ai
DATABASE_REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
ACCESS_TOKEN_EXPIRES_IN=1H
REFRESH_TOKEN_EXPIRES_IN=7D

# Email (SendGrid)
SENDGRID_API_KEY=

# Mail defaults
MAIL_DEFAULT_FROM_EMAIL=no-reply@example.com
MAIL_DEFAULT_FROM_NANE=San AI

# Frontend URLs
RESET_PASSWORD_URL=http://localhost:3000/auth/reset-password
ALLOWED_ORIGIN_CLIENT_URL=http://localhost:3000

# AWS S3 (file uploads)
AWS_S3_END_POINT=
AWS_S3_REGION=
AWS_S3_BUCKET_NAME=
AWS_S3_ACCESS_KEY_ID=
AWS_S3_SECRET_ACCESS_KEY=

# IP Geolocation API
IP_API_URL=https://freeipapi.com/api/json

# Admin accounts (comma-separated emails)
ADMIN_LIST=
```

## Testing

Tests are co-located with source files using the `.test.ts` suffix or `__tests__/` directories.

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:cov
```

**Test coverage areas:**
- JWT token logic (sign, verify)
- OTP generation and validation
- Forgot password token logic
- Password hashing
- Pagination utilities
- Slug generation
- User agent detection
- Database utilities
- Exception classes
- Prisma client setup
- Mail service

## Linting & Formatting

```bash
pnpm lint      # ESLint
pnpm format    # Prettier
```

## Production Build

```bash
pnpm build   # Compiles to dist/
pnpm start   # Runs dist/src/server.js
```

## Docker

```bash
# Build image
docker build -t san-ai-service .

# Run container
docker run -p 3030:3030 --env-file .env san-ai-service
```
