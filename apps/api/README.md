# EnviRescue API

FastAPI backend, PostgreSQL models, Redis caching, and AI model integration for EnviRescue.

## Development with uv

```bash
uv sync --dev
uv run alembic upgrade head
uv run python scripts/seed.py
uv run uvicorn app.main:app --reload --port 8000
```

Run quality checks:

```bash
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

Integration tests are isolated from the normal database configuration. Set a dedicated test PostgreSQL URL, run migrations against it, then execute the suite:

```powershell
$env:TEST_DATABASE_URL="postgresql://user:password@localhost:5432/envirescue_test"
$env:DATABASE_URL=$env:TEST_DATABASE_URL
uv run alembic upgrade head
uv run pytest tests/integration
```

Integration tests are isolated from the normal database configuration. Set a dedicated test PostgreSQL URL, run migrations against it, then execute the suite:

```powershell
$env:TEST_DATABASE_URL="postgresql://user:password@localhost:5432/envirescue_test"
$env:DATABASE_URL=$env:TEST_DATABASE_URL
uv run alembic upgrade head
uv run pytest tests/integration
```

## Health endpoints

- `GET /health/live` is a dependency-free liveness check for Hugging Face Spaces.
- `GET /health/ready` verifies that PostgreSQL is reachable and returns `503` when the API is not ready to receive traffic.

## Request protection

Login, registration, and image-classification endpoints use a process-local rate limiter by default. Configure `RATE_LIMIT_WINDOW_SECONDS` and `RATE_LIMIT_MAX_REQUESTS` as needed. `FRONTEND_URL` is always allowed by CORS; additional production origins can be supplied through `CORS_ORIGINS` as a JSON list. For multiple API replicas, move the limiter counter to Upstash Redis so limits are shared across instances.

Copy `.env.example` to `.env` and configure the database before applying migrations. The classifier currently returns a low-confidence fallback until a trained model is selected and integrated.

## Cloudinary image storage

Local storage is the default for development. For Hugging Face Spaces, use Cloudinary so uploads survive container restarts:

```dotenv
IMAGE_STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=envirescue/waste
```

The API uploads through Cloudinary's server-side Python SDK, stores `secure_url` and `public_id` on each waste report, and attempts to delete the Cloudinary asset when the report is deleted. Keep `CLOUDINARY_API_SECRET` server-side and configure it as a Hugging Face Space secret.

## Hugging Face classifier connection

When the engineer provides the classifier Space, configure the API to call its `/classify` endpoint:

```dotenv
AI_PROVIDER=remote
AI_MODEL_NAME=prithivMLmods/Augmented-Waste-Classifier-SigLIP2
AI_CLASSIFIER_URL=https://YOUR-CLASSIFIER-SPACE.hf.space/classify
HF_API_TOKEN=optional-space-token
AI_MAX_RETRIES=2
AI_RETRY_BACKOFF_SECONDS=0.5
AI_CIRCUIT_FAILURE_THRESHOLD=3
AI_CIRCUIT_RECOVERY_SECONDS=30
```

The adapter sends the uploaded image as the `file` multipart field and accepts the classifier response fields `classification`, `detected_type`, and `confidence`. It maps the engineer's labels (for example `Plastic`, `Glass`, and `Biological`) to EnviRescue categories and marks predictions below `AI_CONFIDENCE_THRESHOLD` for review. Transient network errors and 5xx responses are retried with exponential backoff; repeated failures open a short-lived circuit so requests fail quickly and can use manual classification.

## Classification fallback and manual review

Classification is deliberately non-blocking for waste reports. When an image is submitted with a `report_id`, the report is saved first and the API records the classifier result separately:

- `accepted`: AI returned a confident result;
- `review_required`: AI returned a low-confidence result;
- `failed`: the classifier was unavailable or timed out. The report remains saved and the response includes a safe error message.

In both review states, the client can complete classification manually:

```http
POST /api/v1/classifications/{report_id}/manual
Content-Type: application/json

{"category_id": "<active-category-uuid>"}
```

The manual endpoint validates that the category is active and belongs to the authenticated user’s report, then changes the classification to `accepted` with `source: "manual"`. This keeps reporting available during model outages and provides an auditable correction path for uncertain predictions.
