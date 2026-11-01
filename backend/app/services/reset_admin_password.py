"""
Reset the admin user's password. Prompts for the new password (never echoed or logged).
Backs up the existing user row to a private file outside the repo before updating.
Run: python -m app.services.reset_admin_password [username]
"""
import asyncio
import getpass
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import select

from app.core.config import settings
from app.core.database import AsyncSessionLocal, engine
from app.core.security import hash_password, verify_password
from app.models.models import User

MIN_LENGTH = 12


def prompt_password() -> str:
    password = getpass.getpass("New admin password: ")
    if len(password) < MIN_LENGTH:
        sys.exit(f"Password must be at least {MIN_LENGTH} characters.")
    if getpass.getpass("Repeat new password: ") != password:
        sys.exit("Passwords do not match.")
    return password


async def reset(username: str) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()
        if not user:
            sys.exit(f"No user named '{username}' in this database.")

        password = prompt_password()

        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        backup = Path.home() / f"portfolio-admin-backup-{stamp}.json"
        backup.write_text(json.dumps(
            {"id": user.id, "username": user.username, "password_hash": user.password_hash}
        ))
        os.chmod(backup, 0o600)
        print(f"Backed up user row to {backup}")

        user.password_hash = hash_password(password)
        await db.commit()

        await db.refresh(user)
        if not verify_password(password, user.password_hash):
            sys.exit("Verification failed after update; restore from the backup file.")
        print(f"Password updated for '{username}'.")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(reset(sys.argv[1] if len(sys.argv) > 1 else settings.admin_username))
