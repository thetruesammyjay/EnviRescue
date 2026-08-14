# EnviRescue API

FastAPI backend, PostgreSQL models, Redis caching, and AI model integration for EnviRescue.

## Development with uv

```bash
uv sync --dev
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000
```

Run quality checks:

```bash
uv run ruff check .
uv run ruff format --check .
uv run pytest
```

Copy `.env.example` to `.env` and configure the database before applying migrations. The classifier currently returns a low-confidence fallback until a trained model is selected and integrated.
