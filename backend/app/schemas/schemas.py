from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, field_validator


# ── Auth ─────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Profile ──────────────────────────────────────────────────────────────────

class PatentSchema(BaseModel):
    number: str
    title: str
    status: str
    role: str


class ProfileResponse(BaseModel):
    name: str
    title: str
    bio: str
    email: str
    phone: str
    linkedin: str
    github: str
    location: str
    photo_url: str | None
    patent: PatentSchema

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    name: str | None = None
    title: str | None = None
    bio: str | None = None
    email: str | None = None
    phone: str | None = None
    linkedin: str | None = None
    github: str | None = None
    location: str | None = None
    patent_number: str | None = None
    patent_title: str | None = None
    patent_status: str | None = None
    patent_role: str | None = None


# ── Project ──────────────────────────────────────────────────────────────────

class ProjectResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    category: str
    status: str
    short_description: str
    description: list[str]
    problem: str
    approach: str
    tech_stack: list[str]
    features: list[str]
    results: list[str]
    github_url: str | None
    demo_url: str | None
    architecture_image: str | None
    screenshots: list[str] = []
    featured: bool
    priority: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ProjectCreate(BaseModel):
    id: str
    title: str
    subtitle: str
    category: str
    status: str
    short_description: str
    description: list[str] = []
    problem: str = ""
    approach: str = ""
    tech_stack: list[str] = []
    features: list[str] = []
    results: list[str] = []
    github_url: str | None = None
    demo_url: str | None = None
    screenshots: list[str] = []
    featured: bool = False
    priority: int = 99


class ProjectUpdate(BaseModel):
    title: str | None = None
    subtitle: str | None = None
    category: str | None = None
    status: str | None = None
    short_description: str | None = None
    description: list[str] | None = None
    problem: str | None = None
    approach: str | None = None
    tech_stack: list[str] | None = None
    features: list[str] | None = None
    results: list[str] | None = None
    github_url: str | None = None
    demo_url: str | None = None
    screenshots: list[str] | None = None
    featured: bool | None = None
    priority: int | None = None


# ── Experience ───────────────────────────────────────────────────────────────

class ExperienceResponse(BaseModel):
    id: int
    role: str
    company: str
    location: str
    start_date: str
    end_date: str
    highlights: list[str]
    order: int

    model_config = {"from_attributes": True}


class ExperienceCreate(BaseModel):
    role: str
    company: str
    location: str
    start_date: str
    end_date: str
    highlights: list[str] = []
    order: int = 0


class ExperienceUpdate(BaseModel):
    role: str | None = None
    company: str | None = None
    location: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    highlights: list[str] | None = None
    order: int | None = None


# ── Education ────────────────────────────────────────────────────────────────

class EducationResponse(BaseModel):
    id: int
    school: str
    degree: str
    field: str
    start_year: int
    end_year: int
    location: str
    note: str | None
    order: int

    model_config = {"from_attributes": True}


class EducationCreate(BaseModel):
    school: str
    degree: str
    field: str
    start_year: int
    end_year: int
    location: str
    note: str | None = None
    order: int = 0


class EducationUpdate(BaseModel):
    school: str | None = None
    degree: str | None = None
    field: str | None = None
    start_year: int | None = None
    end_year: int | None = None
    location: str | None = None
    note: str | None = None
    order: int | None = None


# ── Skills ───────────────────────────────────────────────────────────────────

class SkillGroupResponse(BaseModel):
    category: str
    skills: list[str]


# ── Photo Upload ─────────────────────────────────────────────────────────────

class PhotoUploadResponse(BaseModel):
    photo_url: str


# ── Analytics ────────────────────────────────────────────────────────────────

class PageViewRequest(BaseModel):
    page: str
    visitor_id: str
    referrer: str | None = None
    country: str | None = None
    user_agent: str | None = None


class AnalyticsStats(BaseModel):
    total_views: int
    unique_visitors: int
    views_by_page: dict[str, int]
    views_last_30_days: list[dict[str, Any]]
    top_projects: list[dict[str, Any]]


# ── Contact ──────────────────────────────────────────────────────────────────

class ContactRequest(BaseModel):
    name: str
    email: str
    subject: str
    message: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email address")
        return v


class ContactResponse(BaseModel):
    success: bool
    message: str
