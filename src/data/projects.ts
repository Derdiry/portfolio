import type { Project } from '@/types'

export const PROJECTS: Project[] = [
  {
    id: 'gold-price-forecaster',
    title: 'Gold Price Forecasting Under Regime Change',
    subtitle: 'A reproducible study of deep forecasters vs a random walk, Sudan and global gold',
    category: 'time_series',
    status: 'complete',
    shortDescription:
      'Diagnosed why deep forecasters failed on Sudan\'s gold market (test prices 6.4–9.9× outside the training range broke MinMax scaling) and fixed it with scale-free targets. Under preregistered Diebold–Mariano tests, none of 231 configurations (5 architectures, ensembles, zero-shot Chronos, conflict and regime features, transfer learning) beat a random walk, and validation-based selection reversed on test after the regime shift.',
    description: [
      'A reproducible forecasting study on two tracks: international gold (USD/oz) and Sudan\'s local gold price (SDG/g, 2015–2022). The Sudan local price is an official reference price computed from the international gold price and the official exchange rate (× 0.875 for 21-karat), so forecasting it means forecasting official exchange-rate changes under regime change.',
      'The original models failed because Sudan test prices were 6.4–9.9× above the training range, and train-fitted MinMax scaling made them extrapolate catastrophically. Scale-free targets (log-returns, RevIN) removed that failure.',
      'After the fix, 0 of 231 forecast configurations significantly beat a random walk (persistence): five neural architectures (LSTM, GRU, TSMixer, PatchTST, TFT), validation-selected ensembles, zero-shot Chronos, FX-as-target, ACLED conflict features, regime dummies and global→Sudan transfer learning, across 3 horizons (1/7/30 days), 3 seeds and 5 rolling-origin folds.',
    ],
    problem:
      'Sudan\'s local gold price is computed from the international gold price and the official exchange rate, so after the currency collapse its test prices were 6.4–9.9× above the training range. Models trained with train-fitted MinMax scaling extrapolated catastrophically on these prices.',
    approach:
      'Scale-free targets (log-returns, RevIN) replaced train-fitted MinMax scaling. Every configuration was compared against a random walk (persistence) with Diebold–Mariano tests (HAC/HLN correction) and Holm correction, under verdict rules preregistered and committed before test evaluation. Every reported number traces to a saved results file and regenerates from code (claims ledger in CLAIMS.md).',
    techStack: [
      'PyTorch', 'TensorFlow/Keras', 'Chronos', 'statsmodels', 'MLflow', 'scikit-learn',
    ],
    features: [
      'Two tracks: international gold (USD/oz) and Sudan local gold (SDG/g, 2015–2022)',
      '5 neural architectures (LSTM, GRU, TSMixer, PatchTST, TFT) plus zero-shot Chronos',
      'Scale-free targets (log-returns, RevIN) to fix out-of-range extrapolation',
      'Evaluated across 3 horizons (1/7/30 days), 3 seeds and 5 rolling-origin folds',
      'Verdict rules preregistered and committed before test evaluation',
      'Diebold–Mariano tests with HAC/HLN correction and Holm correction',
      'Claims ledger (CLAIMS.md): every number regenerates from code and saved results',
    ],
    results: [
      'Diagnosed the original failure: Sudan test prices were 6.4–9.9× above the training range, breaking train-fitted MinMax scaling',
      'Scale-free targets (log-returns, RevIN) removed the extrapolation failure',
      '0 of 231 configurations significantly beat a random walk, including ensembles, zero-shot Chronos, FX-as-target, ACLED conflict features, regime dummies and global→Sudan transfer learning',
      'Validation-based selection misled under regime change: at Sudan 30-day, models beat persistence on validation in 3/3 seeds and on test in 0/3',
      'Fixed-width conformal intervals and Chronos quantiles under-covered after the price-level shift',
    ],
    screenshots: [],
    featured: true,
    priority: 1,
  },
  {
    id: 'sudan-wiki',
    title: 'SudanWiki — RAG Research Assistant',
    subtitle: 'LangChain + ChromaDB with Hybrid BM25/Vector Search',
    category: 'nlp_rag',
    status: 'complete',
    shortDescription:
      'Production RAG chatbot on Sudan\'s history and civil war — 60+ curated academic sources, hybrid BM25/vector retrieval, swappable LLM backends (Claude/Groq/Cohere), deployed on Hugging Face Spaces.',
    description: [
      'A production RAG application answering research questions about Sudan\'s political history, the 2023 civil war, and the ongoing humanitarian crisis. Built on LangChain and ChromaDB with a hybrid retrieval strategy combining BM25 lexical search and dense vector search — getting the best of both keyword precision and semantic recall.',
      'The knowledge base covers 60+ carefully curated sources: academic books (including Mansour Khalid\'s complete works, Alex de Waal\'s corpus on Darfur), UN system reports (OCHA, IPC, UNHCR, UNICEF), think-tank analyses (Small Arms Survey, ICG, Chatham House), and human rights documentation — organised across 8 thematic tracks from political history to the RSF/SAF conflict.',
      'Swappable LLM backends (Anthropic Claude, Groq, Cohere) allow cost/quality tradeoffs at runtime. Deployed containerised on Hugging Face Spaces with scheduled content ingestion via APScheduler and Playwright for live sources.',
    ],
    problem:
      'Sudan\'s civil war is one of the worst humanitarian crises in the world yet remains poorly understood outside specialist circles. Navigating dozens of academic papers, UN reports, and conflict analyses requires expert-level curation. A RAG system with a curated corpus makes this knowledge accessible.',
    approach:
      'Hybrid retrieval: BM25 for keyword-exact matching (names, dates, factions) combined with ChromaDB dense vector search for semantic queries. Chunk size 1024 tokens with 20% overlap preserves context across document boundaries. LLM response streaming for fast perceived latency. Source citation tracked per response for verifiability.',
    techStack: [
      'LangChain', 'ChromaDB', 'Sentence Transformers', 'rank-bm25',
      'Anthropic API', 'Groq API', 'Cohere API', 'FastAPI', 'React',
      'Docker', 'Playwright', 'APScheduler', 'Nginx',
    ],
    features: [
      'Hybrid BM25 + ChromaDB vector retrieval for precision and recall',
      '60+ curated sources: academic books, UN reports, think-tank analyses (8 thematic tracks)',
      'Swappable LLM backends at runtime: Claude, Groq, Cohere',
      'Scheduled content ingestion via APScheduler + Playwright for live web sources',
      'Response streaming with source citation tracking',
      'Multi-platform deployment: Hugging Face Spaces, Railway, Render',
    ],
    results: [
      'Live and publicly accessible on Hugging Face Spaces',
      'Knowledge base spans Jan 2015–2026 across 8 thematic tracks',
      'Covers political history, Darfur, RSF, SAF, economy, identity, external actors, humanitarian',
    ],
    demoUrl: '#',
    screenshots: [],
    featured: true,
    priority: 2,
  },
  {
    id: 'ml-serving-platform',
    title: 'ML Model Serving Platform',
    subtitle: 'Model-Agnostic FastAPI + MLflow + Docker Infrastructure',
    category: 'mlops',
    status: 'complete',
    shortDescription:
      'Generic production platform serving any MLflow-registered model via REST API — API key auth, Prometheus metrics, Grafana dashboards, batch prediction, A/B testing, and GitHub Actions CI/CD.',
    description: [
      'A model-agnostic serving platform that takes any MLflow-registered PyTorch, TensorFlow, or scikit-learn model and exposes it as a production REST endpoint in under 5 minutes — no code changes required. Built as reusable infrastructure backing the Plant Disease Detector.',
      'The platform handles everything production requires: API key authentication, input validation, batch prediction, Prometheus metrics per model (request count, latency histograms), Grafana dashboards, and health checks for load balancer integration. Model versions are managed through MLflow\'s registry — promote Staging → Production without redeployment.',
      'ONNX quantization support achieves 40-60% latency reduction for compatible models. A/B testing infrastructure splits traffic between model versions with configurable ratios for safe rollouts.',
    ],
    problem:
      'Every ML project reinvents the same serving boilerplate: authentication, batching, monitoring, versioning. A reusable platform eliminates this duplication and enforces production-quality standards across all projects.',
    approach:
      'FastAPI app loads models by name from MLflow registry at startup and caches them in memory. Prometheus middleware tracks per-model metrics automatically. Docker Compose orchestrates API, Prometheus, and Grafana. GitHub Actions runs tests and deploys on push to main.',
    techStack: [
      'FastAPI', 'MLflow', 'Docker', 'Docker Compose', 'Prometheus',
      'Grafana', 'ONNX Runtime', 'GitHub Actions', 'PostgreSQL', 'Redis', 'Python',
    ],
    features: [
      'Serve any MLflow model via POST /predict/{model_name} — zero code changes',
      'API key authentication with rate limiting',
      'Prometheus metrics per model: latency histograms, request counts, error rates',
      'ONNX quantization: 40-60% latency reduction for compatible models',
      'A/B testing infrastructure with configurable traffic splitting',
      'Automated drift detection using Kolmogorov-Smirnov tests',
      'Model discovery endpoint: GET /models',
      'GitHub Actions CI/CD — deploy on push to main',
    ],
    results: [
      '5-minute model deployment time (copy mlruns/, docker compose up)',
      '40-60% inference latency reduction with ONNX quantization',
      'Supports PyTorch, TensorFlow, and scikit-learn models without modification',
      'Validated against CV (Plant Disease Detector) workloads',
    ],
    screenshots: [],
    featured: true,
    priority: 3,
  },
  {
    id: 'pipeline-integrity-platform',
    title: 'Pipeline Integrity Management Platform',
    subtitle: 'AI Decision Support System for Corrosion Assessment',
    category: 'industrial_ai',
    status: 'papers_in_prep',
    shortDescription:
      'Full-stack AI platform replacing Excel-based pipeline inspection workflows — ML measurement correction (XGBoost), 16-step DSS engine, React + FastAPI + PostgreSQL, 7-container Docker deployment. 40% reduction in unnecessary excavations.',
    description: [
      'An AI decision support system for pipeline corrosion management developed in collaboration with petroleum engineers. The platform replaces manual Excel workflows with an end-to-end web application: ML models correct systematic measurement deviations from inline inspection (IP) sensors, a configurable 16-step rule engine assigns repair modes, and every decision is logged in a full audit trail for regulatory compliance.',
      'The ML pipeline trains separate regression models (Ridge, Random Forest, XGBoost) on ground truth dig verification data to predict corrected values for 4 targets: location, depth, length, and width. All experiments are tracked in MLflow. The best model per target is promoted to production through the registry — zero code changes required.',
      'The DSS engine implements 16 decision steps across pre-screening (repair history matching with confidence scoring), severity/location flagging, repair mode selection (internal/external gate, depth+span logic), and exception handling (wall thickness availability, constructability, utility proximity). Papers documenting the methodology are in preparation.',
    ],
    problem:
      'Inline inspection sensors have systematic measurement deviations. Using raw readings to assign repair modes causes over-excavation (costly false positives) and missed repairs (dangerous false negatives). Manual Excel processes introduce human error and leave no audit trail for regulatory review.',
    approach:
      '7-service Docker Compose architecture: FastAPI backend (async SQLAlchemy), React frontend, PostgreSQL, Redis (Celery queue), MLflow, Jupyter, Nginx. DSS engine implemented as independent Python modules — each decision step is testable in isolation. Celery handles async pipeline execution so the UI remains responsive during long DSS runs.',
    techStack: [
      'FastAPI', 'React 18', 'TypeScript', 'PostgreSQL', 'Redis',
      'Celery', 'XGBoost', 'LightGBM', 'MLflow', 'DVC',
      'Docker Compose', 'Tailwind CSS', 'SQLAlchemy', 'Alembic', 'Nginx',
    ],
    features: [
      'ML measurement correction: 4 regression targets (location, depth, length, width)',
      '16-step DSS engine from pre-screening to exception handling',
      'Current-to-previous IP feature matching with high/medium/low confidence scoring',
      '14-table PostgreSQL schema with full decision audit trail per feature',
      'Celery async pipeline — processes 500+ km of inspection data without blocking UI',
      'Configurable rule sets via database — no code changes to update business rules',
      'React dashboard with Upload, Decisions, Reports, and Admin pages',
      'DVC for data versioning — every model maps to a specific dataset version',
    ],
    results: [
      '40% reduction in unnecessary excavations (false positive repair assignments)',
      '60% reduction in decision time vs. manual Excel workflow',
      'Validated on 500+ km of pipeline inspection data',
      'Academic papers in preparation documenting DSS methodology',
    ],
    screenshots: [],
    featured: true,
    priority: 4,
  },
  {
    id: 'sales-dashboard',
    title: 'Water Distribution Sales Dashboard',
    subtitle: 'Bilingual Analytics for Tal Water Company',
    category: 'business_intelligence',
    status: 'complete',
    shortDescription:
      'Bilingual (Arabic/English) Streamlit dashboard for a water distribution company — auto-detects Excel file types, 4 analytics tabs, what-if simulator, PDF/Excel export, one-click Windows deployment. 6 months in production.',
    description: [
      'A production sales analytics dashboard built for Tal Water Company, a water distribution business in the Arab region. The application reads their existing Excel export files, requires zero database setup, and runs locally on any Windows machine with a one-click installer — no IT infrastructure, no cloud costs, no server.',
      'The dashboard auto-detects 3 Excel file types by sheet names rather than filenames (Sales Report, Trucks/Pivot, Multi-Pivot), merges multi-month uploads, and renders a fully bilingual UI with Arabic RTL layout. Dark/light theme toggle is included.',
      'Four analytics tabs cover the full business: Overview KPIs with monthly trends, Monthly Details per distribution category (Retail/Wholesale/Agent), Trucks tab with per-truck daily data and days-to-target tracker, and Analytics with year-end projection, MoM growth, Pareto analysis, and a what-if simulator for target planning.',
    ],
    problem:
      'The company\'s team spent hours every month manually producing Excel reports from raw data exports. No historical trend visibility, no projections, no per-truck performance tracking — all analysis was ad-hoc and not reproducible.',
    approach:
      'Pure Streamlit frontend — no backend required. Data flows from Excel upload through pandas parse functions into a session-state dictionary. Plotly renders all interactive charts. ReportLab generates PDF exports with Arabic text support via Cairo font. Windows .bat scripts handle Python installation and launch.',
    techStack: [
      'Python', 'Streamlit', 'Pandas', 'Plotly', 'openpyxl',
      'ReportLab', 'Cairo Font', 'Windows Batch',
    ],
    features: [
      'Auto-detects Excel file type by sheet names — no manual config',
      'Multi-file upload: merge up to 3 months of pivot data for trend analysis',
      'Bilingual UI with Arabic RTL layout and EN/AR toggle',
      'What-if simulator: adjust targets and see projected year-end outcomes',
      'Year-end projection, MoM growth, Pareto analysis, multi-month trends',
      'Per-truck daily data with days-to-target tracker',
      'PDF and Excel export per tab (scoped to tab\'s data only)',
      'One-click Windows installer (setup.bat + run.bat) — no IT support needed',
    ],
    results: [
      '6 months in production, actively used by client team',
      'Zero support tickets since delivery',
      'Eliminated manual monthly reporting workflows entirely',
      'Zero cloud infrastructure cost — runs fully offline',
    ],
    screenshots: [],
    featured: false,
    priority: 5,
  },
]

export const getFeaturedProjects = (): Project[] =>
  PROJECTS.filter((p) => p.featured).sort((a, b) => a.priority - b.priority)

export const getProjectById = (id: string): Project | undefined =>
  PROJECTS.find((p) => p.id === id)
