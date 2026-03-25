# Environment Variables Setup

## Overview

| Location | File | Purpose |
|---|---|---|
| `web/` | `.env.local` | Next.js frontend |
| `service/` | `.env` | Express backend |

Copy the example files before starting:

```bash
cp web/.env.example web/.env.local
cp service/.env.example service/.env
```

---

## web/.env.local

### App

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_SERVICE_URL` | `http://localhost:3030` | Backend base URL — used by axios service clients |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3030` | Same as above (legacy alias) |
| `NEXT_IMAGE_URL` | `http://localhost:3000` | Base URL for profile images served from the app |

### Session / JWT

Both variables **must be set to the same value**.

| Variable | Description |
|---|---|
| `NEXTAUTH_SECRET` | Used by the custom cookie-based session (`lib/session.ts`) to sign/verify JWTs |
| `AUTH_SECRET` | Used by NextAuth.js v5 to sign its own session token |

Generate a secure value:

```bash
openssl rand -base64 32
```

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Add Authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret |

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Authorization callback URL**:
   ```
   http://localhost:3000/api/auth/callback/github
   ```

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | Client ID from the OAuth App |
| `GITHUB_CLIENT_SECRET` | Client Secret from the OAuth App |

### Facebook OAuth

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create an app → **Facebook Login** product → **Settings**
3. Add Valid OAuth Redirect URI:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```
4. App credentials are under **Settings → Basic**

| Variable | Description |
|---|---|
| `FACEBOOK_CLIENT_ID` | App ID |
| `FACEBOOK_CLIENT_SECRET` | App Secret |

---

## service/.env

### Server

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Node environment (`development` / `production`) |
| `PORT` | `3030` | Port the Express server listens on |
| `ENABLE_API_TEST` | `false` | Set `true` to mock `req.auth` for local API testing without a token |

### Database

| Variable | Example | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://root:root@localhost:5432/san-db?schema=main` | PostgreSQL connection string (used by Prisma) |
| `DATABASE_REDIS_URL` | `redis://localhost:6379` | Redis connection string |

### JWT

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret used to sign access and refresh tokens — keep this long and random |
| `ACCESS_TOKEN_EXPIRES_IN` | Access token TTL (e.g. `1H`, `15M`) |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token TTL (e.g. `7D`, `30D`) |

### Email (SMTP / Mailtrap)

Mail is sent via Nodemailer over SMTP. Use [Mailtrap](https://mailtrap.io) for local development — it catches all outgoing emails in a sandbox inbox without actually delivering them.

**Mailtrap setup:**
1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Go to **Email Testing → Inboxes → your inbox → SMTP Settings**
3. Copy the credentials into the env vars below

| Variable | Dev default | Description |
|---|---|---|
| `MAIL_HOST` | `sandbox.smtp.mailtrap.io` | SMTP server hostname |
| `MAIL_PORT` | `2525` | SMTP port (`2525`, `465`, or `587`) |
| `MAIL_USER` | — | SMTP username from Mailtrap |
| `MAIL_PASS` | — | SMTP password from Mailtrap |
| `MAIL_SECURE` | `false` | Set `true` only when using port `465` (TLS) |
| `MAIL_DEFAULT_FROM_EMAIL` | — | Sender address (e.g. `no-reply@yourdomain.com`) |
| `MAIL_DEFAULT_FROM_NANE` | — | Sender display name |

**For production** replace the SMTP vars with your real provider (e.g. Postmark, AWS SES, Mailgun).

### Frontend Links

| Variable | Example | Description |
|---|---|---|
| `RESET_PASSWORD_URL` | `http://localhost:3000/auth/reset-password` | Full URL the password-reset email links to |
| `ALLOWED_ORIGIN_CLIENT_URL` | `http://localhost:3000` | CORS allowed origin |

### AWS S3 (File Uploads)

| Variable | Description |
|---|---|
| `AWS_S3_END_POINT` | S3 endpoint URL (use LocalStack for local dev) |
| `AWS_S3_REGION` | AWS region (e.g. `ap-southeast-1`) |
| `AWS_S3_BUCKET_NAME` | S3 bucket name |
| `AWS_S3_ACCESS_KEY_ID` | AWS access key ID |
| `AWS_S3_SECRET_ACCESS_KEY` | AWS secret access key |

### Misc

| Variable | Description |
|---|---|
| `IP_API_URL` | IP geolocation API (default: `https://freeipapi.com/api/json`) |
| `ADMIN_LIST` | Comma-separated list of account IDs with admin privileges |
