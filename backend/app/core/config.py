from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
# Later files win: the repo-root .env.local (written by `neon deploy`) overrides backend/.env.
ENV_FILES = (BACKEND_DIR / ".env", BACKEND_DIR.parent / ".env.local")


def to_asyncpg(url: str) -> tuple[str, dict]:
    """Convert a libpq-style URL (e.g. Neon's) into a SQLAlchemy asyncpg URL plus connect_args.

    asyncpg rejects libpq query params: sslmode becomes asyncpg's `ssl` argument,
    and channel_binding (unsupported by asyncpg) is dropped; TLS is still enforced via ssl.
    """
    parts = urlsplit(url)
    query = dict(parse_qsl(parts.query))
    sslmode = query.pop("sslmode", None)
    query.pop("channel_binding", None)
    scheme = "postgresql+asyncpg" if parts.scheme in ("postgres", "postgresql", "postgresql+asyncpg") else parts.scheme
    connect_args = {"ssl": sslmode} if sslmode and sslmode != "disable" else {}
    return urlunsplit((scheme, parts.netloc, parts.path, urlencode(query), parts.fragment)), connect_args


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILES, extra="ignore")

    database_url: str = "postgresql+asyncpg://portfolio:portfolio@localhost:5432/portfolio"
    # Neon's direct (non-pooled) endpoint. Preferred when set: this is one long-running
    # process with its own SQLAlchemy pool that also runs DDL at startup.
    database_url_unpooled: str = ""
    database_url_sync: str = "postgresql://portfolio:portfolio@localhost:5432/portfolio"

    @property
    def async_database(self) -> tuple[str, dict]:
        return to_asyncpg(self.database_url_unpooled or self.database_url)

    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    admin_username: str = "admin"
    # Only used by the seed to create the first admin user; no insecure default.
    admin_password: str = ""

    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    contact_recipient: str = "mod.derdiry@gmail.com"

    cors_origins: str = "http://localhost:5173,http://localhost:4173"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
