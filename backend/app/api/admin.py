import io
import os
import uuid
from collections import defaultdict
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from PIL import Image
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.models import Analytics, Education, Experience, Profile, Project, Skill
from app.schemas.schemas import (
    AnalyticsStats,
    EducationCreate,
    EducationResponse,
    EducationUpdate,
    ExperienceCreate,
    ExperienceResponse,
    ExperienceUpdate,
    PatentSchema,
    PhotoUploadResponse,
    ProfileResponse,
    ProfileUpdate,
    ProjectCreate,
    ProjectResponse,
    ProjectUpdate,
    SkillGroupResponse,
)

router = APIRouter(dependencies=[Depends(get_current_user)])


# ── Profile ──────────────────────────────────────────────────────────────────

@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    body: ProfileUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.id == 1))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(profile, field, value)

    await db.commit()
    await db.refresh(profile)
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


# ── Photo Upload ─────────────────────────────────────────────────────────────

@router.post("/profile/photo", response_model=PhotoUploadResponse)
async def upload_profile_photo(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    image = Image.open(io.BytesIO(content)).convert("RGB")

    # Center-crop to square
    w, h = image.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    image = image.crop((left, top, left + side, top + side))

    # Resize to 400x400
    image = image.resize((400, 400), Image.LANCZOS)

    # Save to uploads/
    filename = f"{uuid.uuid4().hex}.jpg"
    os.makedirs("uploads", exist_ok=True)
    image.save(os.path.join("uploads", filename), "JPEG", quality=90)

    photo_url = f"/uploads/{filename}"

    # Update profile
    result = await db.execute(select(Profile).where(Profile.id == 1))
    profile = result.scalar_one_or_none()
    if profile:
        profile.photo_url = photo_url
        await db.commit()

    return PhotoUploadResponse(photo_url=photo_url)


# ── Resume Upload ─────────────────────────────────────────────────────────────

@router.post("/resume", response_model=PhotoUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if not file.content_type or file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    content = await file.read()
    os.makedirs("uploads", exist_ok=True)
    with open("uploads/resume.pdf", "wb") as f:
        f.write(content)
    return PhotoUploadResponse(photo_url="/uploads/resume.pdf")


# ── Projects ─────────────────────────────────────────────────────────────────

@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(body: ProjectCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == body.id))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail=f"Project '{body.id}' already exists")
    project = Project(**body.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for field, value in body.model_dump(exclude_none=True).items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()


# ── Experience ───────────────────────────────────────────────────────────────

@router.post("/experience", response_model=ExperienceResponse, status_code=201)
async def create_experience(body: ExperienceCreate, db: AsyncSession = Depends(get_db)):
    exp = Experience(**body.model_dump())
    db.add(exp)
    await db.commit()
    await db.refresh(exp)
    return exp


@router.put("/experience/{exp_id}", response_model=ExperienceResponse)
async def update_experience(
    exp_id: int, body: ExperienceUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(exp, field, value)
    await db.commit()
    await db.refresh(exp)
    return exp


@router.delete("/experience/{exp_id}", status_code=204)
async def delete_experience(exp_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Experience).where(Experience.id == exp_id))
    exp = result.scalar_one_or_none()
    if not exp:
        raise HTTPException(status_code=404, detail="Experience not found")
    await db.delete(exp)
    await db.commit()


# ── Education ────────────────────────────────────────────────────────────────

@router.post("/education", response_model=EducationResponse, status_code=201)
async def create_education(body: EducationCreate, db: AsyncSession = Depends(get_db)):
    edu = Education(**body.model_dump())
    db.add(edu)
    await db.commit()
    await db.refresh(edu)
    return edu


@router.put("/education/{edu_id}", response_model=EducationResponse)
async def update_education(
    edu_id: int, body: EducationUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Education).where(Education.id == edu_id))
    edu = result.scalar_one_or_none()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(edu, field, value)
    await db.commit()
    await db.refresh(edu)
    return edu


@router.delete("/education/{edu_id}", status_code=204)
async def delete_education(edu_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Education).where(Education.id == edu_id))
    edu = result.scalar_one_or_none()
    if not edu:
        raise HTTPException(status_code=404, detail="Education not found")
    await db.delete(edu)
    await db.commit()


# ── Skills ───────────────────────────────────────────────────────────────────

@router.put("/skills", response_model=list[SkillGroupResponse])
async def replace_skills(
    groups: list[SkillGroupResponse],
    db: AsyncSession = Depends(get_db),
):
    """Replace all skills with the provided list."""
    result = await db.execute(select(Skill))
    for s in result.scalars().all():
        await db.delete(s)

    order = 0
    for group in groups:
        for skill_name in group.skills:
            db.add(Skill(category=group.category, skill_name=skill_name, order=order))
            order += 1

    await db.commit()
    return groups


# ── Analytics ────────────────────────────────────────────────────────────────

@router.get("/analytics/stats", response_model=AnalyticsStats)
async def get_analytics_stats(db: AsyncSession = Depends(get_db)):
    # Total views
    total_result = await db.execute(select(func.count(Analytics.id)))
    total_views: int = total_result.scalar_one() or 0

    # Unique visitors (by visitor_id)
    unique_result = await db.execute(select(func.count(Analytics.visitor_id.distinct())))
    unique_visitors: int = unique_result.scalar_one() or 0

    # Views by page
    page_result = await db.execute(
        select(Analytics.page, func.count(Analytics.id).label("count"))
        .group_by(Analytics.page)
        .order_by(func.count(Analytics.id).desc())
    )
    views_by_page = {row.page: row.count for row in page_result}

    # Views last 30 days (daily)
    since = datetime.now(timezone.utc) - timedelta(days=30)
    daily_result = await db.execute(
        select(
            func.date_trunc("day", Analytics.timestamp).label("day"),
            func.count(Analytics.id).label("count"),
        )
        .where(Analytics.timestamp >= since)
        .group_by(func.date_trunc("day", Analytics.timestamp))
        .order_by(func.date_trunc("day", Analytics.timestamp))
    )
    views_last_30 = [
        {"date": str(row.day)[:10], "views": row.count}
        for row in daily_result
    ]

    # Top projects (pages starting with /projects/)
    top_projects_result = await db.execute(
        select(Analytics.page, func.count(Analytics.id).label("count"))
        .where(Analytics.page.like("/projects/%"))
        .group_by(Analytics.page)
        .order_by(func.count(Analytics.id).desc())
        .limit(5)
    )
    top_projects = [
        {"page": row.page, "views": row.count}
        for row in top_projects_result
    ]

    return AnalyticsStats(
        total_views=total_views,
        unique_visitors=unique_visitors,
        views_by_page=views_by_page,
        views_last_30_days=views_last_30,
        top_projects=top_projects,
    )
