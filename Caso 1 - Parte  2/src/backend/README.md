# DUA Streamliner — Backend (skeleton)

Layered FastAPI + worker layout per course README §2.11. Method bodies are intentionally stubs (`...`) until implementation.

## Run API (dev)

```bash
cd src/backend
pip install -e .
uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

OpenAPI: http://127.0.0.1:8000/docs

## Layout

- `api/` — HTTP layer (routers, middleware, DI)
- `application/` — commands, queries, services
- `domain/` — aggregates, value objects, repository ports
- `infrastructure/` — SQLAlchemy, S3, SQS, Redis
- `worker/` — SQS consumer and pipeline handlers
