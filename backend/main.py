import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine
from app.models import models  # noqa: F401 — import all models so Base.metadata is populated
from app.core.database import Base
from app.api import public, auth, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup (idempotent)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Migrate: add screenshots column if it doesn't exist yet
        await conn.execute(text(
            "ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots JSONB DEFAULT '[]'::jsonb"
        ))

    # Seed data if tables are empty
    from app.services.seed import seed
    await seed()

    yield


app = FastAPI(
    title="Portfolio API",
    description="Backend API for Mohamed Alderdiry's portfolio website",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router, prefix="/api")
app.include_router(auth.router,   prefix="/api/auth")
app.include_router(admin.router,  prefix="/api/admin")

os.makedirs("uploads", exist_ok=True)


@app.get("/health")
async def health():
    return {"status": "ok"}
