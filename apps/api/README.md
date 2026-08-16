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
```

The adapter sends the uploaded image as the `file` multipart field and accepts the classifier response fields `classification`, `detected_type`, and `confidence`. It maps the engineer's labels (for example `Plastic`, `Glass`, and `Biological`) to EnviRescue categories and marks predictions below `AI_CONFIDENCE_THRESHOLD` for review.
