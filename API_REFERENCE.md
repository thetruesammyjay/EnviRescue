# EnviRescue API Reference

This document describes the public HTTP API implemented in `apps/api`. The API is a FastAPI service for authenticated waste reporting, AI-assisted classification, recycling guidance, collection schedules, dashboards, and administration.

## Base URL and documentation

Local development:

```text
http://localhost:8000
```

The versioned API prefix is `/api/v1`:

```text
http://localhost:8000/api/v1
```

Interactive documentation is available at `/docs`; the machine-readable OpenAPI document is available at `/openapi.json`.

## Authentication

Register and log in through `/api/v1/auth`. Protected endpoints require:

```http
Authorization: Bearer <access-token>
```

Login returns a short-lived access token and a refresh token. Refresh tokens rotate on every successful refresh; the previous token is revoked and cannot be reused.

### Register

```http
POST /api/v1/auth/register
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "full_name": "Example User",
  "password": "a-secure-password"
}
```

Returns `201 Created` and the created user. Duplicate email addresses return `409 Conflict`.

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "a-secure-password"
}
```

Returns:

```json
{
  "access_token": "<jwt>",
  "refresh_token": "<jwt>",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Example User",
    "role": "user",
    "is_active": true,
    "created_at": "2026-08-16T12:00:00Z"
  }
}
```

### Refresh tokens

```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

```json
{"refresh_token": "<refresh-token>"}
```

The response contains a new access token and refresh token. Reusing the old refresh token returns `401 Unauthorized`.

### Logout and revocation

```http
POST /api/v1/auth/logout
POST /api/v1/auth/revoke
Authorization: Bearer <access-token>
```

`/logout` revokes the presented bearer token. `/revoke` accepts an explicit token body:

```json
{"token": "<token>"}
```

Revocations are stored in Redis when configured and are checked by protected dependencies.

### Password reset contract

Email delivery is intentionally not included yet. The API exposes the token contract for a future email provider.

```http
POST /api/v1/auth/password-reset/request
Content-Type: application/json
```

```json
{"email": "user@example.com"}
```

For an existing account, the development response includes a short-lived reset token. Confirm it with:

```http
POST /api/v1/auth/password-reset/confirm
Content-Type: application/json

{"token": "<reset-token>", "new_password": "new-secure-password"}
```

Tokens expire and are single-use. In production, do not expose reset tokens in an HTTP response; deliver them through a trusted email provider.

### Email verification contract

Generate a verification token for the authenticated user:

```http
POST /api/v1/auth/verify-email/request
Authorization: Bearer <access-token>
```

Confirm it with:

```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{"token": "<verification-token>"}
```

Email sending and enforcement of verified status are deferred until an email provider is selected.

## Health and system endpoints

These endpoints do not require authentication:

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Basic service identity and status |
| GET | `/health` | Backward-compatible health response |
| GET | `/health/live` | Dependency-free process liveness check |
| GET | `/health/ready` | PostgreSQL readiness check; returns `503` when unavailable |
| GET | `/health/ai` | AI provider configuration and circuit-breaker state |

Every HTTP response includes an `X-Request-ID` header. Clients may provide their own request ID; otherwise the API generates one.

## Waste reports

All waste-report endpoints require authentication.

### Create a report

```http
POST /api/v1/waste
Content-Type: application/json
```

```json
{
  "category_id": "category-uuid",
  "quantity_kg": 2.5,
  "location": "Main campus",
  "description": "Separated plastic bottles"
}
```

Returns `201 Created`.

### Create a report with an image

```http
POST /api/v1/waste/with-image
Content-Type: multipart/form-data
```

Form fields:

| Field | Type | Required |
|---|---|---|
| `category_id` | UUID | yes |
| `quantity_kg` | positive number | yes |
| `location` | string | yes |
| `description` | string | no |
| `image` | JPEG, PNG, or WebP file | yes |

Images are size-limited and validated by decoding the file, not only by trusting its MIME type.

### List, retrieve, update, and delete reports

```http
GET /api/v1/waste?page=1&page_size=20
GET /api/v1/waste/{report_id}
PATCH /api/v1/waste/{report_id}
DELETE /api/v1/waste/{report_id}
```

Users can access only their own reports. Delete also attempts to remove the associated Cloudinary asset when one exists.

## AI classification

### Classify an image

```http
POST /api/v1/classifications/image
Content-Type: multipart/form-data
```

Form fields:

- `image`: valid JPEG, PNG, or WebP file
- `report_id`: optional owned report UUID

Successful responses include `category`, `detected_type`, `confidence`, `status`, and `source`.

Classification states:

| State | Meaning |
|---|---|
| `pending` | No result has been recorded yet |
| `accepted` | AI result meets the confidence threshold or was manually selected |
| `review_required` | AI returned a low-confidence result |
| `failed` | AI was unavailable; the report remains saved and can be classified manually |

### Retrieve classification status

```http
GET /api/v1/classifications/{report_id}
```

This endpoint is suitable for frontend polling.

### Queue background classification

```http
POST /api/v1/classifications/{report_id}/jobs
```

Returns `202 Accepted` with a Redis job record. Poll the job with:

```http
GET /api/v1/classifications/jobs/{job_id}
```

Jobs contain `job_id`, `report_id`, `status`, `attempts`, and error details when applicable. The worker is started with `SERVICE=worker`.

### Manual classification

```http
POST /api/v1/classifications/{report_id}/manual
Content-Type: application/json
```

```json
{
  "category_id": "active-category-uuid",
  "reason": "The image clearly shows a plastic bottle"
}
```

Manual classification changes the state to `accepted`, sets `source` to `manual`, and marks the classification as no longer requiring review.

## Categories, recycling, and collections

```http
GET /api/v1/categories
GET /api/v1/recycling/tips
GET /api/v1/recycling/tips/{category}
GET /api/v1/collections/zones
GET /api/v1/collections/upcoming
```

These read endpoints use Redis caching when Upstash credentials are configured and gracefully fall back to PostgreSQL when Redis is unavailable.

## Dashboard and reports

```http
GET /api/v1/dashboard/summary
GET /api/v1/reports?start_date=2026-01-01&end_date=2026-12-31
```

Reports return total quantity, report count, recyclable percentage, and totals grouped by category. Date filters are inclusive and use UTC boundaries.

## Administration

Admin endpoints require an authenticated user with `role: "admin"`.

```http
GET    /api/v1/admin/status
GET    /api/v1/admin/users?page=1&page_size=20
PATCH  /api/v1/admin/users/{user_id}
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/{category_id}
DELETE /api/v1/admin/categories/{category_id}
POST   /api/v1/admin/recycling-tips
DELETE /api/v1/admin/recycling-tips/{tip_id}
POST   /api/v1/admin/collections/zones
POST   /api/v1/admin/collections/schedules
PATCH  /api/v1/admin/collections/schedules/{schedule_id}
GET    /api/v1/admin/classifications/review
```

The review endpoint returns classifications that require manual attention, including status, source, confidence, and error information.

## Errors and status codes

| Status | Meaning |
|---|---|
| `400` | Invalid token or request state |
| `401` | Missing, expired, invalid, or revoked authentication |
| `403` | Authenticated user lacks administrator privileges |
| `404` | Resource does not exist or is not owned by the caller |
| `409` | Duplicate resource, such as an existing email |
| `413` | Image exceeds the configured size limit |
| `422` | Validation error or invalid image content |
| `429` | Rate limit exceeded |
| `503` | Database, Redis queue, or other required dependency unavailable |

Error responses use FastAPI's standard format:

```json
{"detail": "Human-readable explanation"}
```

## Configuration and deployment

Required production variables:

```env
APP_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<random-secret-at-least-32-bytes>
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Optional variables enable the remote classifier and Cloudinary image storage. The Hugging Face Docker image runs migrations and starts port `7860`; use `SERVICE=api` for HTTP traffic and `SERVICE=worker` for background jobs.
