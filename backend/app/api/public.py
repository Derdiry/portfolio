import os
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import FileResponse
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.models import Analytics, ContactMessage, Education, Experience, Profile, Project, Skill
from app.schemas.schemas import (
    AnalyticsStats,
    ContactRequest,
    ContactResponse,
    EducationResponse,
    ExperienceResponse,
    PageViewRequest,
    PatentSchema,
    ProfileResponse,
    ProjectResponse,
    SkillGroupResponse,
)
from app.services.email import send_contact_email

router = APIRouter()


# ── Profile ──────────────────────────────────────────────────────────────────

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Profile).where(Profile.id == 1))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return ProfileResponse(
        name=profile.name,
        title=profile.title,
        bio=profile.bio,
        email=profile.email,
        phone=profile.phone,
        linkedin=profile.linkedin,
        github=profile.github,
        location=profile.location,
        photo_url=profile.photo_url,
        patent=PatentSchema(
            number=profile.patent_number,
            title=profile.patent_title,
            status=profile.patent_status,
            role=profile.patent_role,
        ),
    )


# ── Projects ─────────────────────────────────────────────────────────────────

@router.get("/projects", response_model=list[ProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.priority))
    return result.scalars().all()


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


# ── Experience ───────────────────────────────────────────────────────────────

@router.get("/experience", response_model=list[ExperienceResponse])
async def list_experience(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Experience).order_by(Experience.order))
    return result.scalars().all()


# ── Education ────────────────────────────────────────────────────────────────

@router.get("/education", response_model=list[EducationResponse])
async def list_education(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Education).order_by(Education.order))
    return result.scalars().all()


# ── Skills ───────────────────────────────────────────────────────────────────

@router.get("/skills", response_model=list[SkillGroupResponse])
async def list_skills(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Skill).order_by(Skill.order))
    skills = result.scalars().all()
    grouped: dict[str, list[str]] = {}
    for s in skills:
        grouped.setdefault(s.category, []).append(s.skill_name)
    return [SkillGroupResponse(category=cat, skills=names) for cat, names in grouped.items()]


# ── Contact ──────────────────────────────────────────────────────────────────

@router.post("/contact", response_model=ContactResponse)
async def contact(body: ContactRequest, db: AsyncSession = Depends(get_db)):
    db.add(ContactMessage(
        name=body.name,
        email=body.email,
        subject=body.subject,
        message=body.message,
    ))
    await db.commit()

    try:
        await send_contact_email(body.name, body.email, body.subject, body.message)
    except Exception as exc:
        # Don't fail the request if email sending fails — message is already saved
        print(f"Email send failed: {exc}")

    return ContactResponse(success=True, message="Message received. I'll get back to you soon.")


# ── Uploads (served via API so CORSMiddleware adds headers) ──────────────────

@router.get("/uploads/{filename}")
async def serve_upload(filename: str):
    path = os.path.join("uploads", filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path)


# ── Analytics ────────────────────────────────────────────────────────────────

@router.post("/analytics", status_code=status.HTTP_204_NO_CONTENT)
async def log_page_view(body: PageViewRequest, request: Request, db: AsyncSession = Depends(get_db)):
    user_agent = body.user_agent or request.headers.get("user-agent", "")
    db.add(Analytics(
        page=body.page,
        visitor_id=body.visitor_id,
        referrer=body.referrer,
        country=body.country,
        user_agent=user_agent,
    ))
    await db.commit()
