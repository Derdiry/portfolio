from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://portfolio:portfolio@localhost:5432/portfolio"
    database_url_sync: str = "postgresql://portfolio:portfolio@localhost:5432/portfolio"

    def __init__(self, **data):
        super().__init__(**data)
        # Railway injects postgresql:// but asyncpg needs postgresql+asyncpg://
        if self.database_url.startswith("postgresql://"):
            self.database_url = self.database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
        if self.database_url.startswith("postgres://"):
            self.database_url = self.database_url.replace("postgres://", "postgresql+asyncpg://", 1)

    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440

    admin_username: str = "admin"
    admin_password: str = "admin"

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
