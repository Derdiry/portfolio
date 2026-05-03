"""
Seed the database with Mohamed's real project and profile data.
Run: python -m app.services.seed
"""
import asyncio

from sqlalchemy import select, text

from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.core.config import settings
from app.models.models import (
    User, Profile, Project, Experience, Education, Skill
)

PROFILE_DATA = {
    "id": 1,
    "name": "Mohamed Alderdiry",
    "title": "Applied Machine Learning Engineer",
    "bio": (
        "Machine Learning Engineer with a Master's in Computer Science from Donghua University. "
        "I build production AI systems across computer vision, time series forecasting, and NLP/RAG, "
        "focusing on taking models from research to deployment.\n\n"
        "I work on computer vision systems for agriculture and healthcare using Vision Transformers, "
        "ResNets, and EfficientNets. My experience includes transfer learning for specialized domains, "
        "large-scale geospatial platforms, and implementing model interpretability techniques like "
        "Grad-CAM for high-stakes domains.\n\n"
        "For time series work, I built a 36-model ensemble benchmarking LSTM, GRU, TSMixer, PatchTST, "
        "Temporal Fusion Transformer, and Chronos. The most interesting finding: conflict event data "
        "from ACLED predicted commodity prices better than technical indicators in unstable markets. "
        "Post-coup regime change outranked everything else in the TFT's attention weights at a 30-day lag.\n\n"
        "I've deployed a RAG application using LangChain and ChromaDB with hybrid BM25/vector search on "
        "Hugging Face Spaces. Built a model-agnostic serving platform with FastAPI, MLflow, and Docker "
        "for zero-code deployment with automated versioning and monitoring.\n\n"
        "I'm also collaborating with petroleum engineers on an AI decision support system for pipeline "
        "integrity management. Academic papers in preparation."
    ),
    "email": "mod.derdiry@gmail.com",
    "phone": "+966 570 126 493",
    "linkedin": "linkedin.com/in/mohamedalderdiry",
    "github": "github.com/mohamedalderdiry",
    "location": "Riyadh, Saudi Arabia",
    "photo_url": None,
    "patent_number": "Australian Patent #2025203718",
    "patent_title": "Innovative Image Processing Approach For Measuring Scar Tissue Extensibility",
    "patent_status": "Accepted",
    "patent_role": "Co-inventor",
}

PROJECTS_DATA = [
    {
        "id": "gold-price-forecaster",
        "title": "Gold Price Forecaster",
        "subtitle": "36-Model Ensemble for Global & Sudan Local Markets",
        "category": "time_series",
        "status": "complete",
        "short_description": (
            "36-model ensemble (LSTM, GRU, TSMixer, PatchTST, TFT, Chronos) with walk-forward validation "
            "on global commodities and Sudan local markets — proving conflict event data outperforms technical indicators."
        ),
        "description": [
            "A production-grade ML system forecasting gold prices on two independent tracks: Global (USD/oz) and Sudan local market (SDG/gram). Six model architectures × 2 tracks × 3 horizons = 36 trained models, served via a FastAPI REST API with MLflow tracking and a Streamlit dashboard for live predictions.",
            "The Sudan track is a special case where currency collapse, conflict events, and political regime changes dominate over standard commodity signals. The SDG/USD rate devalued 67× in seven years — making this primarily a currency forecasting problem, not a commodity one. Conflict event data from ACLED predicted prices at a 30-day lag, and a post-coup regime dummy outranked every technical indicator in the TFT's feature importance.",
            "TSMixer architecture was reproduced from the original Google Research paper and benchmarked head-to-head against PatchTST, TFT, and Amazon's Chronos foundation model. Amazon Chronos (zero-shot, no training) achieved ~3% MAPE on Sudan's 7-day forecast — winning on trend extrapolation during a period of near-linear currency collapse.",
        ],
        "problem": "Standard gold price forecasting assumes stable currency and open markets. Sudan violates both. The local market is driven by FX collapse, political instability, and conflict — not commodity fundamentals. Existing models fail catastrophically in this context.",
        "approach": "Dual-track architecture with independent feature engineering: 29 macro + technical features for the global track; Sudan-specific features including FX rate, ACLED conflict severity at 30/60/90-day lags, and political regime dummies. Walk-forward validation prevents data leakage. Ensemble weights optimised with SLSQP on validation MAE.",
        "tech_stack": ["PyTorch", "TensorFlow/Keras", "scikit-learn", "MLflow", "FastAPI", "Streamlit", "Docker", "Prometheus", "Grafana", "Pandas", "Optuna", "ACLED API"],
        "features": [
            "6 architectures benchmarked: LSTM, GRU, TSMixer, PatchTST, TFT, Chronos (zero-shot)",
            "Walk-forward validation — no data leakage across the 7-year window",
            "Sudan feature engineering: FX rate, conflict severity lags (30/60/90d), regime dummies",
            "SLSQP-optimised ensemble from top-2 models by validation MAE",
            "Streamlit dashboard: upload CSV → instant predictions from all 36 models",
            "MLflow experiment tracking for all 36 runs",
        ],
        "results": [
            "Sudan 1-day horizon: ~9% MAPE — practically useful for local gold traders",
            "Chronos zero-shot: ~3% MAPE on Sudan 7-day (beats all trained models on trend extrapolation)",
            "Post-coup regime dummy ranked #1 feature in TFT, outranking RSI, MACD, and Bollinger Bands",
            "Conflict events predict prices at 30-day lag — matching real-world demand dynamics",
            "TSMixer validation within 2% of published Google Research benchmarks",
            "GRU outperformed TFT and PatchTST on global track — simpler wins on stable signals",
        ],
        "github_url": None,
        "demo_url": None,
        "featured": True,
        "priority": 1,
    },
    {
        "id": "sudan-wiki",
        "title": "SudanWiki — RAG Research Assistant",
        "subtitle": "LangChain + ChromaDB with Hybrid BM25/Vector Search",
        "category": "nlp_rag",
        "status": "complete",
        "short_description": (
            "Production RAG chatbot on Sudan's history and civil war — 60+ curated academic sources, "
            "hybrid BM25/vector retrieval, swappable LLM backends (Claude/Groq/Cohere), deployed on Hugging Face Spaces."
        ),
        "description": [
            "A production RAG application answering research questions about Sudan's political history, the 2023 civil war, and the ongoing humanitarian crisis. Built on LangChain and ChromaDB with a hybrid retrieval strategy combining BM25 lexical search and dense vector search.",
            "The knowledge base covers 60+ carefully curated sources: academic books (including Mansour Khalid's complete works, Alex de Waal's corpus on Darfur), UN system reports, think-tank analyses (Small Arms Survey, ICG, Chatham House), and human rights documentation — organised across 8 thematic tracks.",
            "Swappable LLM backends (Anthropic Claude, Groq, Cohere) allow cost/quality tradeoffs at runtime. Deployed containerised on Hugging Face Spaces with scheduled content ingestion via APScheduler and Playwright.",
        ],
        "problem": "Sudan's civil war is one of the worst humanitarian crises in the world yet remains poorly understood outside specialist circles. Navigating dozens of academic papers, UN reports, and conflict analyses requires expert-level curation.",
        "approach": "Hybrid retrieval: BM25 for keyword-exact matching combined with ChromaDB dense vector search. Chunk size 1024 tokens with 20% overlap. LLM response streaming for fast perceived latency. Source citation tracked per response for verifiability.",
        "tech_stack": ["LangChain", "ChromaDB", "Sentence Transformers", "rank-bm25", "Anthropic API", "Groq API", "Cohere API", "FastAPI", "React", "Docker", "Playwright", "APScheduler", "Nginx"],
        "features": [
            "Hybrid BM25 + ChromaDB vector retrieval for precision and recall",
            "60+ curated sources: academic books, UN reports, think-tank analyses (8 thematic tracks)",
            "Swappable LLM backends at runtime: Claude, Groq, Cohere",
            "Scheduled content ingestion via APScheduler + Playwright for live web sources",
            "Response streaming with source citation tracking",
            "Multi-platform deployment: Hugging Face Spaces, Railway, Render",
        ],
        "results": [
            "Live and publicly accessible on Hugging Face Spaces",
            "Knowledge base spans Jan 2015–2026 across 8 thematic tracks",
        ],
        "github_url": None,
        "demo_url": None,
        "featured": True,
        "priority": 2,
    },
    {
        "id": "ml-serving-platform",
        "title": "ML Model Serving Platform",
        "subtitle": "Model-Agnostic FastAPI + MLflow + Docker Infrastructure",
        "category": "mlops",
        "status": "complete",
        "short_description": (
            "Generic production platform serving any MLflow-registered model via REST API — "
            "API key auth, Prometheus metrics, Grafana dashboards, batch prediction, A/B testing, and GitHub Actions CI/CD."
        ),
        "description": [
            "A model-agnostic serving platform that takes any MLflow-registered PyTorch, TensorFlow, or scikit-learn model and exposes it as a production REST endpoint in under 5 minutes — no code changes required.",
            "The platform handles everything production requires: API key authentication, input validation, batch prediction, Prometheus metrics per model, Grafana dashboards, and health checks. Model versions are managed through MLflow's registry.",
            "ONNX quantization support achieves 40-60% latency reduction. A/B testing infrastructure splits traffic between model versions with configurable ratios for safe rollouts.",
        ],
        "problem": "Every ML project reinvents the same serving boilerplate: authentication, batching, monitoring, versioning. A reusable platform eliminates this duplication and enforces production-quality standards across all projects.",
        "approach": "FastAPI app loads models by name from MLflow registry at startup and caches them in memory. Prometheus middleware tracks per-model metrics automatically. Docker Compose orchestrates API, Prometheus, and Grafana.",
        "tech_stack": ["FastAPI", "MLflow", "Docker", "Docker Compose", "Prometheus", "Grafana", "ONNX Runtime", "GitHub Actions", "PostgreSQL", "Redis", "Python"],
        "features": [
            "Serve any MLflow model via POST /predict/{model_name} — zero code changes",
            "API key authentication with rate limiting",
            "Prometheus metrics per model: latency histograms, request counts, error rates",
            "ONNX quantization: 40-60% latency reduction for compatible models",
            "A/B testing infrastructure with configurable traffic splitting",
            "Automated drift detection using Kolmogorov-Smirnov tests",
            "GitHub Actions CI/CD — deploy on push to main",
        ],
        "results": [
            "5-minute model deployment time",
            "40-60% inference latency reduction with ONNX quantization",
            "Supports PyTorch, TensorFlow, and scikit-learn models without modification",
            "Validated against time-series and CV workloads",
        ],
        "github_url": None,
        "demo_url": None,
        "featured": True,
        "priority": 3,
    },
    {
        "id": "pipeline-integrity-platform",
        "title": "Pipeline Integrity Management Platform",
        "subtitle": "AI Decision Support System for Corrosion Assessment",
        "category": "industrial_ai",
        "status": "papers_in_prep",
        "short_description": (
            "Full-stack AI platform replacing Excel-based pipeline inspection workflows — ML measurement correction (XGBoost), "
            "16-step DSS engine, React + FastAPI + PostgreSQL, 7-container Docker. 40% reduction in unnecessary excavations."
        ),
        "description": [
            "An AI decision support system for pipeline corrosion management developed in collaboration with petroleum engineers. The platform replaces manual Excel workflows with a full web application: ML models correct systematic measurement deviations, a configurable 16-step rule engine assigns repair modes, and every decision is logged in a full audit trail.",
            "The ML pipeline trains regression models (Ridge, Random Forest, XGBoost) on ground truth dig verification data to predict corrected values for 4 targets: location, depth, length, and width. All experiments are tracked in MLflow.",
            "The DSS engine implements 16 decision steps across pre-screening, severity/location flagging, repair mode selection, and exception handling. Papers documenting the methodology are in preparation.",
        ],
        "problem": "Inline inspection sensors have systematic measurement deviations. Using raw readings to assign repair modes causes over-excavation (costly false positives) and missed repairs (dangerous false negatives). Manual Excel processes leave no audit trail for regulatory review.",
        "approach": "7-service Docker Compose architecture: FastAPI backend (async SQLAlchemy), React frontend, PostgreSQL, Redis (Celery queue), MLflow, Jupyter, Nginx. DSS engine implemented as independent Python modules — each decision step is testable in isolation.",
        "tech_stack": ["FastAPI", "React 18", "TypeScript", "PostgreSQL", "Redis", "Celery", "XGBoost", "LightGBM", "MLflow", "DVC", "Docker Compose", "Tailwind CSS", "SQLAlchemy", "Alembic", "Nginx"],
        "features": [
            "ML measurement correction: 4 regression targets (location, depth, length, width)",
            "16-step DSS engine from pre-screening to exception handling",
            "Current-to-previous IP feature matching with confidence scoring",
            "14-table PostgreSQL schema with full decision audit trail per feature",
            "Celery async pipeline — processes 500+ km of inspection data without blocking UI",
            "Configurable rule sets via database — no code changes to update business rules",
            "React dashboard with Upload, Decisions, Reports, and Admin pages",
        ],
        "results": [
            "40% reduction in unnecessary excavations",
            "60% reduction in decision time vs. manual Excel workflow",
            "Validated on 500+ km of pipeline inspection data",
            "Academic papers in preparation",
        ],
        "github_url": None,
        "demo_url": None,
        "featured": True,
        "priority": 4,
    },
    {
        "id": "sales-dashboard",
        "title": "Water Distribution Sales Dashboard",
        "subtitle": "Bilingual Analytics for Tal Water Company",
        "category": "business_intelligence",
        "status": "complete",
        "short_description": (
            "Bilingual (Arabic/English) Streamlit dashboard for a water distribution company — "
            "auto-detects Excel file types, 4 analytics tabs, what-if simulator, PDF/Excel export, one-click Windows deployment."
        ),
        "description": [
            "A production sales analytics dashboard built for Tal Water Company. Reads their existing Excel export files, requires zero database setup, and runs locally on any Windows machine with a one-click installer.",
            "The dashboard auto-detects 3 Excel file types by sheet names, merges multi-month uploads, and renders a fully bilingual UI with Arabic RTL layout.",
            "Four analytics tabs cover the full business: Overview KPIs, Monthly Details per distribution category, Trucks tab with per-truck daily data, and Analytics with year-end projection, MoM growth, Pareto analysis, and a what-if simulator.",
        ],
        "problem": "The company's team spent hours every month manually producing Excel reports. No historical trend visibility, no projections, no per-truck performance tracking.",
        "approach": "Pure Streamlit frontend — no backend required. Data flows from Excel upload through pandas parse functions into session state. Plotly renders all interactive charts. ReportLab generates PDF exports with Arabic text support.",
        "tech_stack": ["Python", "Streamlit", "Pandas", "Plotly", "openpyxl", "ReportLab", "Cairo Font", "Windows Batch"],
        "features": [
            "Auto-detects Excel file type by sheet names — no manual config",
            "Multi-file upload: merge up to 3 months of pivot data",
            "Bilingual UI with Arabic RTL layout and EN/AR toggle",
            "What-if simulator: adjust targets and see projected year-end outcomes",
            "PDF and Excel export per tab",
            "One-click Windows installer (setup.bat + run.bat)",
        ],
        "results": [
            "6 months in production, actively used by client",
            "Zero support tickets since delivery",
            "Eliminated manual monthly reporting workflows",
            "Zero cloud infrastructure cost",
        ],
        "github_url": None,
        "demo_url": None,
        "featured": False,
        "priority": 5,
    },
]

EXPERIENCE_DATA = [
    {
        "role": "Applied Machine Learning Engineer",
        "company": "Super Smart Solutions",
        "location": "Riyadh, Saudi Arabia",
        "start_date": "2024",
        "end_date": "Present",
        "highlights": [
            "Developing an AI decision support system for pipeline integrity management — replacing Excel workflows with a 7-service Docker platform (FastAPI, React, PostgreSQL, MLflow, Celery) and a 16-step DSS engine with ML-corrected measurements",
            "Building computer vision systems for agricultural and healthcare applications using Vision Transformers, ResNets, and EfficientNets with transfer learning for specialized domains",
            "Implementing Grad-CAM explainability for high-stakes medical imaging models",
            "Designing model deployment infrastructure with FastAPI, MLflow, and Docker for zero-code model serving",
            "Co-inventor on Australian Patent #2025203718 for medical image processing",
        ],
        "order": 0,
    },
]

EDUCATION_DATA = [
    {
        "school": "Donghua University",
        "degree": "Master's",
        "field": "Computer Science",
        "start_year": 2020,
        "end_year": 2024,
        "location": "Shanghai, China",
        "note": "Research focus on deep learning and computer vision",
        "order": 0,
    },
    {
        "school": "Sudan University of Science & Technology",
        "degree": "Bachelor's",
        "field": "Management Information Systems",
        "start_year": 2014,
        "end_year": 2018,
        "location": "Khartoum, Sudan",
        "note": None,
        "order": 1,
    },
]

SKILLS_DATA = [
    ("ML / AI",          ["PyTorch", "TensorFlow / Keras", "scikit-learn", "XGBoost", "LightGBM", "Hugging Face Transformers", "LangChain", "Optuna"]),
    ("Computer Vision",  ["Vision Transformers (ViT)", "ResNet", "EfficientNet", "Grad-CAM", "Transfer Learning", "Object Detection", "Segmentation"]),
    ("NLP / RAG",        ["ChromaDB", "FAISS", "BM25", "Sentence Transformers", "Semantic Search", "Prompt Engineering", "Claude API", "Groq API"]),
    ("Time Series",      ["TSMixer", "PatchTST", "Temporal Fusion Transformer", "LSTM", "GRU", "Chronos", "Walk-Forward Validation"]),
    ("Infrastructure",   ["Docker", "Docker Compose", "MLflow", "FastAPI", "PostgreSQL", "Redis", "Celery", "Prometheus", "Grafana", "GitHub Actions", "DVC"]),
    ("Frontend",         ["React", "TypeScript", "Tailwind CSS", "Streamlit", "Plotly", "Vite", "Framer Motion"]),
    ("Data",             ["Pandas", "NumPy", "Matplotlib", "SQLAlchemy", "Alembic", "Jupyter", "DVC"]),
]


async def seed() -> None:
    async with AsyncSessionLocal() as db:
        # Admin user
        result = await db.execute(select(User).where(User.username == settings.admin_username))
        if not result.scalar_one_or_none():
            db.add(User(username=settings.admin_username, password_hash=hash_password(settings.admin_password)))
            print(f"Created admin user: {settings.admin_username}")

        # Profile
        result = await db.execute(select(Profile).where(Profile.id == 1))
        if not result.scalar_one_or_none():
            db.add(Profile(**PROFILE_DATA))
            print("Seeded profile")

        # Projects
        for p in PROJECTS_DATA:
            result = await db.execute(select(Project).where(Project.id == p["id"]))
            if not result.scalar_one_or_none():
                db.add(Project(**p))
                print(f"Seeded project: {p['id']}")

        # Experience
        result = await db.execute(select(Experience))
        if not result.scalars().all():
            for e in EXPERIENCE_DATA:
                db.add(Experience(**e))
            print("Seeded experience")

        # Education
        result = await db.execute(select(Education))
        if not result.scalars().all():
            for e in EDUCATION_DATA:
                db.add(Education(**e))
            print("Seeded education")

        # Skills
        result = await db.execute(select(Skill))
        if not result.scalars().all():
            order = 0
            for category, skills in SKILLS_DATA:
                for skill in skills:
                    db.add(Skill(category=category, skill_name=skill, order=order))
                    order += 1
            print("Seeded skills")

        await db.commit()
        print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
