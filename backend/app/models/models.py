from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)


class Profile(Base):
    __tablename__ = "profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, default=1)
    name: Mapped[str] = mapped_column(String(120))
    title: Mapped[str] = mapped_column(String(200))
    bio: Mapped[str] = mapped_column(Text)
    email: Mapped[str] = mapped_column(String(200))
    phone: Mapped[str] = mapped_column(String(50))
    linkedin: Mapped[str] = mapped_column(String(200))
    github: Mapped[str] = mapped_column(String(200))
    location: Mapped[str] = mapped_column(String(200))
    photo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    patent_number: Mapped[str] = mapped_column(String(100), default="")
    patent_title: Mapped[str] = mapped_column(String(500), default="")
    patent_status: Mapped[str] = mapped_column(String(50), default="Accepted")
    patent_role: Mapped[str] = mapped_column(String(100), default="Co-inventor")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now, onupdate=_now)


class Project(Base):
    __tablename__ = "projects"

    # slug string used as URL id (e.g. 'gold-price-forecaster')
    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    subtitle: Mapped[str] = mapped_column(String(300))
    category: Mapped[str] = mapped_column(String(60))
    status: Mapped[str] = mapped_column(String(60))
    short_description: Mapped[str] = mapped_column(Text)
    description: Mapped[list[str]] = mapped_column(JSON, default=list)
    problem: Mapped[str] = mapped_column(Text)
    approach: Mapped[str] = mapped_column(Text)
    tech_stack: Mapped[list[str]] = mapped_column(JSON, default=list)
    features: Mapped[list[str]] = mapped_column(JSON, default=list)
    results: Mapped[list[str]] = mapped_column(JSON, default=list)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    demo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    architecture_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    priority: Mapped[int] = mapped_column(Integer, default=99)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role: Mapped[str] = mapped_column(String(200))
    company: Mapped[str] = mapped_column(String(200))
    location: Mapped[str] = mapped_column(String(200))
    start_date: Mapped[str] = mapped_column(String(20))
    end_date: Mapped[str] = mapped_column(String(20))
    highlights: Mapped[list[str]] = mapped_column(JSON, default=list)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Education(Base):
    __tablename__ = "education"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    school: Mapped[str] = mapped_column(String(200))
    degree: Mapped[str] = mapped_column(String(100))
    field: Mapped[str] = mapped_column(String(200))
    start_year: Mapped[int] = mapped_column(Integer)
    end_year: Mapped[int] = mapped_column(Integer)
    location: Mapped[str] = mapped_column(String(200))
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0)


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    category: Mapped[str] = mapped_column(String(100))
    skill_name: Mapped[str] = mapped_column(String(100))
    order: Mapped[int] = mapped_column(Integer, default=0)


class Analytics(Base):
    __tablename__ = "analytics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    page: Mapped[str] = mapped_column(String(200))
    visitor_id: Mapped[str] = mapped_column(String(100))
    referrer: Mapped[str | None] = mapped_column(String(500), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(500), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(200))
    subject: Mapped[str] = mapped_column(String(300))
    message: Mapped[str] = mapped_column(Text)
    sent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_now)
