import { useState } from "react";

const PROJECTS = [
  // ─── COMPUTER VISION ───
  {
    id: 1,
    title: "Plant Disease Detector",
    subtitle: "ViT-Based Multi-Class Crop Disease Classification",
    description: "Open-source crop disease identification system using Vision Transformers (ViT). Trained on PlantVillage dataset covering 38 disease classes across multiple crop types. Includes data augmentation pipeline, transfer learning from pretrained ViT, and a FastAPI serving endpoint. Built from professional experience developing a production disease detection system across 6 agricultural sectors.",
    tags: ["ViT", "PyTorch", "FastAPI", "Computer Vision", "Transfer Learning"],
    difficulty: "Advanced",
    impact: "You've already built this at production scale — this open-source version proves the skill without exposing company IP. Instant credibility.",
    status: "in_progress",
    category: "computer_vision",
    icon: "🌱",
    priority: 1,
    steps: [
      "Download PlantVillage dataset (54K+ images, 38 classes)",
      "Build augmentation pipeline: random crop, rotation, color jitter, mixup",
      "Fine-tune ViT-B/16 (pretrained on ImageNet) with custom classification head",
      "Compare against ResNet50 and EfficientNet baselines",
      "Implement Grad-CAM visualization to show which leaf regions drive predictions",
      "Build FastAPI endpoint with image upload → prediction + confidence + heatmap",
      "Create Streamlit demo app with sample images and live upload",
      "Write technical blog post: 'Why Vision Transformers Outperform CNNs for Plant Disease Detection'"
    ],
    github: "plant-disease-vit",
    timeline: "2–3 weeks"
  },
  {
    id: 2,
    title: "Real-Time Object Counter",
    subtitle: "YOLOv8 Video Analytics for Retail & Warehouse",
    description: "Real-time object detection and counting system using YOLOv8. Processes video feeds to count people, vehicles, or inventory items crossing defined zones. Includes line-crossing logic, tracking with ByteTrack, and a live dashboard. Applicable to retail foot traffic, warehouse inventory, and smart city use cases.",
    tags: ["YOLOv8", "OpenCV", "ByteTrack", "Streamlit", "Python"],
    difficulty: "Intermediate",
    impact: "CV skills beyond classification — shows you can handle detection, tracking, and real-time video. Very in-demand in Saudi smart city projects.",
    status: "not_started",
    category: "computer_vision",
    icon: "📹",
    priority: 5,
    steps: [
      "Set up YOLOv8 inference pipeline with ultralytics library",
      "Implement ByteTrack for multi-object tracking across frames",
      "Build line-crossing / zone-counting logic with configurable regions",
      "Create real-time video processing with OpenCV (webcam + video file)",
      "Add analytics overlay: count, direction, dwell time",
      "Build Streamlit dashboard with live feed and historical charts",
      "Deploy as Docker container with GPU support option"
    ],
    github: "realtime-object-counter",
    timeline: "2 weeks"
  },
  // ─── CHATBOTS & CONVERSATIONAL AI ───
  {
    id: 3,
    title: "RAG Knowledge Assistant",
    subtitle: "Document Q&A Chatbot with Retrieval-Augmented Generation",
    description: "Production-ready chatbot that answers questions from uploaded documents (PDFs, docs, websites) using RAG architecture. Combines vector embeddings (sentence-transformers), ChromaDB for retrieval, and an LLM for generation. Supports multi-document conversations with source citations and follow-up questions.",
    tags: ["LangChain", "ChromaDB", "OpenAI API", "Streamlit", "RAG"],
    difficulty: "Advanced",
    impact: "RAG is the #1 most in-demand LLM skill right now. Every company building AI products needs engineers who can implement this.",
    status: "not_started",
    category: "chatbots",
    icon: "🤖",
    priority: 2,
    steps: [
      "Build document ingestion pipeline: PDF, DOCX, URL → chunked text",
      "Implement embedding generation with sentence-transformers",
      "Set up ChromaDB vector store with metadata filtering",
      "Build retrieval pipeline: query → top-k chunks → reranking",
      "Integrate LLM (OpenAI or open-source via Ollama) for answer generation",
      "Add source citation: each answer shows which document chunks were used",
      "Build chat UI with Streamlit: upload docs, ask questions, see sources",
      "Add conversation memory for multi-turn follow-ups"
    ],
    github: "rag-knowledge-assistant",
    timeline: "2–3 weeks"
  },
  {
    id: 4,
    title: "Customer Support Agent",
    subtitle: "Multi-Turn Chatbot with Intent Detection & Escalation",
    description: "Intelligent customer support chatbot that classifies user intent, routes queries to the right knowledge base, handles multi-turn conversations, and knows when to escalate to a human. Uses fine-tuned intent classifier + LLM for response generation. Includes admin dashboard for monitoring conversations and training the model on new intents.",
    tags: ["Transformers", "FastAPI", "WebSocket", "React", "PostgreSQL"],
    difficulty: "Advanced",
    impact: "Shows you can build a complete AI product with business logic, not just a model. This is what companies actually ship.",
    status: "not_started",
    category: "chatbots",
    icon: "💬",
    priority: 6,
    steps: [
      "Design intent taxonomy (billing, technical, general, complaint, etc.)",
      "Fine-tune DistilBERT for intent classification on custom dataset",
      "Build conversation state machine: greet → classify → respond → resolve/escalate",
      "Implement LLM response generation with guardrails and prompt templates",
      "Create WebSocket-based real-time chat backend with FastAPI",
      "Build React chat widget (embeddable component)",
      "Add admin dashboard: conversation logs, intent analytics, model retraining",
      "Deploy with Docker Compose (API + DB + frontend)"
    ],
    github: "smart-support-agent",
    timeline: "3–4 weeks"
  },
  // ─── TIME SERIES & FORECASTING ───
  {
    id: 5,
    title: "Gold Price Forecaster",
    subtitle: "Multi-Model Financial Prediction with LSTM & Transformers",
    description: "End-to-end gold price prediction system comparing LSTM, GRU, and Temporal Fusion Transformer architectures. Features engineered from macroeconomic indicators (USD index, oil, inflation, interest rates). Includes walk-forward validation, model ensembling, and an interactive Streamlit dashboard for real-time predictions.",
    tags: ["Time Series", "LSTM", "TFT", "Python", "Streamlit"],
    difficulty: "Advanced",
    impact: "Directly proves your financial modeling specialization — the core niche in your LinkedIn headline. Build this early.",
    status: "not_started",
    category: "forecasting",
    icon: "📈",
    priority: 3,
    steps: [
      "Collect gold price + macro data (Yahoo Finance, FRED API)",
      "Engineer features: moving averages, RSI, USD index correlation, oil spread",
      "Build LSTM baseline with proper time series train/val/test splits",
      "Implement GRU variant and Temporal Fusion Transformer",
      "Set up walk-forward cross-validation framework",
      "Build model ensemble (weighted average of top performers)",
      "Create Streamlit dashboard: historical charts, live predictions, model comparison",
      "Deploy on Hugging Face Spaces with daily auto-refresh"
    ],
    github: "gold-price-forecaster",
    timeline: "2–3 weeks"
  },
  {
    id: 6,
    title: "Energy Demand Predictor",
    subtitle: "Smart Grid Forecasting Aligned with Saudi Vision 2030",
    description: "Multi-horizon energy consumption forecasting using XGBoost, Prophet, and LSTM. Incorporates weather data, calendar features (including Ramadan/Eid schedules), and historical patterns. Targets Saudi Arabia's smart city and sustainability goals with practical utility for NEOM-style projects.",
    tags: ["XGBoost", "Prophet", "LSTM", "Plotly", "Python"],
    difficulty: "Intermediate",
    impact: "Vision 2030 alignment makes this magnetic to Saudi employers and government contractors. Strategic positioning project.",
    status: "not_started",
    category: "forecasting",
    icon: "⚡",
    priority: 9,
    steps: [
      "Use UCI Household Power or Kaggle energy datasets",
      "Engineer temporal features: hour, weekday, season, Ramadan calendar, holidays",
      "Add weather correlation features (temperature, humidity)",
      "Train XGBoost, Prophet, and LSTM models",
      "Build multi-horizon output: 1hr, 24hr, 7-day ahead forecasts",
      "Create interactive Plotly dashboard comparing models and horizons",
      "Deploy as web app with automatic daily retraining pipeline"
    ],
    github: "energy-demand-sa",
    timeline: "2–3 weeks"
  },
  // ─── NLP & TEXT PROCESSING ───
  {
    id: 7,
    title: "Arabic Sentiment Analyzer",
    subtitle: "Fine-Tuned AraBERT for Saudi Social Media Analysis",
    description: "Sentiment analysis pipeline optimized for Saudi Arabic dialect. Fine-tunes AraBERT/CAMeL on Arabic tweet datasets, handles dialect-specific preprocessing (emoji, hashtag expansion, diacritics normalization), and serves predictions via API. Includes benchmarks against multilingual models to show the value of Arabic-specific fine-tuning.",
    tags: ["AraBERT", "HuggingFace", "Arabic NLP", "FastAPI", "PyTorch"],
    difficulty: "Intermediate",
    impact: "Arabic NLP is massively underserved — few ML engineers specialize here. This makes you rare and valuable in the Saudi market.",
    status: "not_started",
    category: "nlp",
    icon: "🗣️",
    priority: 7,
    steps: [
      "Collect Arabic sentiment datasets (ASTD, ArSenTi, Twitter-based)",
      "Build Arabic text preprocessing: normalization, emoji handling, dialect tokens",
      "Fine-tune AraBERT and CAMeL-BERT on sentiment task",
      "Benchmark against multilingual BERT and XLM-RoBERTa",
      "Build FastAPI endpoint: text → sentiment + confidence + attention highlights",
      "Create demo app analyzing real-time Arabic tweets on any topic",
      "Document findings in a technical write-up comparing model architectures"
    ],
    github: "arabic-sentiment-analyzer",
    timeline: "2 weeks"
  },
  {
    id: 8,
    title: "Smart Document Summarizer",
    subtitle: "Extractive + Abstractive Summarization Pipeline",
    description: "Dual-mode document summarization system that combines extractive methods (TextRank, sentence scoring) with abstractive generation (T5/BART). Handles long documents via chunked processing, supports both English and Arabic text, and outputs summaries at configurable length. Practical tool for research, legal, and business documents.",
    tags: ["T5", "BART", "spaCy", "HuggingFace", "Streamlit"],
    difficulty: "Intermediate",
    impact: "Shows NLP depth beyond classification. Summarization is used in every industry — legal, healthcare, finance, government.",
    status: "not_started",
    category: "nlp",
    icon: "📋",
    priority: 10,
    steps: [
      "Implement TextRank extractive summarizer as baseline",
      "Fine-tune T5-small on CNN/DailyMail for abstractive summarization",
      "Build long document handling: chunk → summarize → merge strategy",
      "Add Arabic support with mT5 or AraBART",
      "Create length-controlled generation (short, medium, detailed)",
      "Build Streamlit app: paste text or upload PDF → get summary",
      "Add comparison view: original vs extractive vs abstractive side-by-side"
    ],
    github: "smart-doc-summarizer",
    timeline: "2 weeks"
  },
  // ─── GENERATIVE AI ───
  {
    id: 9,
    title: "AI Code Review Assistant",
    subtitle: "LLM-Powered Code Analysis with GitHub Integration",
    description: "Automated code review tool that analyzes pull requests using LLMs. Detects bugs, security vulnerabilities, style issues, and suggests improvements with explanations. Integrates with GitHub via webhooks and posts review comments directly on PRs. Shows you can build developer tools with LLMs — a hot and growing market.",
    tags: ["OpenAI API", "GitHub API", "FastAPI", "Python", "Docker"],
    difficulty: "Advanced",
    impact: "Developer tools + LLMs = one of the fastest growing sectors. Shows you can build with APIs, webhooks, and real integrations.",
    status: "not_started",
    category: "generative_ai",
    icon: "🔮",
    priority: 8,
    steps: [
      "Set up GitHub webhook listener with FastAPI",
      "Build diff parser to extract changed code from pull requests",
      "Design prompt engineering pipeline: code context → structured review",
      "Implement multi-pass analysis: bugs, security, style, performance",
      "Create GitHub API integration to post inline review comments",
      "Add configuration: severity thresholds, ignored patterns, custom rules",
      "Deploy as GitHub App installable on any repository",
      "Write documentation with demo GIFs showing the review flow"
    ],
    github: "ai-code-reviewer",
    timeline: "2–3 weeks"
  },
  {
    id: 10,
    title: "Multimodal Content Generator",
    subtitle: "Text + Image Generation Pipeline with LLM Orchestration",
    description: "Content generation system that creates coordinated text and images for social media, marketing, or documentation. Uses LLM for text generation and Stable Diffusion/DALL-E for images, orchestrated by a planning agent that ensures visual-textual coherence. Demonstrates multi-model orchestration and prompt engineering at scale.",
    tags: ["LangChain", "Stable Diffusion", "OpenAI", "Streamlit", "Python"],
    difficulty: "Advanced",
    impact: "Multimodal AI is the frontier. Shows you're not just using LLMs — you're orchestrating complex multi-model systems.",
    status: "not_started",
    category: "generative_ai",
    icon: "🎨",
    priority: 11,
    steps: [
      "Design agent architecture: planner → text generator → image generator → reviewer",
      "Build text generation pipeline with tone/style controls",
      "Integrate image generation (Stable Diffusion via API or local)",
      "Implement coherence checker: does the image match the text?",
      "Add template system for different content types (social post, blog, ad)",
      "Build Streamlit app: describe content → get text + matching images",
      "Add batch generation mode for content calendars"
    ],
    github: "multimodal-content-gen",
    timeline: "3 weeks"
  },
  // ─── MLOps & DEPLOYMENT ───
  {
    id: 11,
    title: "ML Model Serving Platform",
    subtitle: "Production MLOps Template with FastAPI + Docker + CI/CD",
    description: "Reusable template repository for deploying any ML model to production. Includes FastAPI serving with async inference, Docker containerization, automated testing, model versioning with MLflow, health monitoring, and GitHub Actions CI/CD. Not just a project — it's infrastructure you'll reuse for every other project.",
    tags: ["FastAPI", "Docker", "MLflow", "GitHub Actions", "pytest"],
    difficulty: "Intermediate",
    impact: "Every interviewer asks 'How would you deploy this?' This repo IS the answer. Build it first, reuse for everything else.",
    status: "not_started",
    category: "mlops",
    icon: "⚙️",
    priority: 4,
    steps: [
      "Create FastAPI app with /predict, /health, /model-info endpoints",
      "Add Pydantic request/response validation with error handling",
      "Implement async inference with batching support",
      "Write comprehensive tests: unit, integration, load testing",
      "Create multi-stage Dockerfile (build → slim runtime image)",
      "Set up MLflow for experiment tracking and model registry",
      "Configure GitHub Actions: lint → test → build → push to registry",
      "Write production-grade README with architecture diagram and quickstart"
    ],
    github: "ml-serving-platform",
    timeline: "1–2 weeks"
  },
  {
    id: 12,
    title: "Automated Training Pipeline",
    subtitle: "End-to-End ML Pipeline with Airflow & Experiment Tracking",
    description: "Automated ML training pipeline that handles data ingestion, preprocessing, feature engineering, model training, evaluation, and deployment — all orchestrated by Airflow. Includes automatic retraining triggers, data drift detection, and model performance monitoring. The kind of infrastructure ML teams actually build.",
    tags: ["Airflow", "MLflow", "Docker", "Python", "PostgreSQL"],
    difficulty: "Advanced",
    impact: "Shows you think in systems, not notebooks. This is what separates ML engineers from data scientists in job levels and salary.",
    status: "not_started",
    category: "mlops",
    icon: "🔄",
    priority: 12,
    steps: [
      "Design DAG architecture: ingest → preprocess → train → evaluate → deploy",
      "Set up Airflow with Docker Compose",
      "Build data ingestion operators with validation checks",
      "Implement feature engineering as reusable pipeline components",
      "Add model training with MLflow experiment tracking",
      "Create evaluation gate: only deploy if metrics beat current production model",
      "Add data drift detection with statistical tests",
      "Build monitoring dashboard for pipeline health and model performance"
    ],
    github: "auto-ml-pipeline",
    timeline: "3–4 weeks"
  },
  // ─── DATA ENGINEERING ───
  {
    id: 13,
    title: "Real-Time Data Lakehouse",
    subtitle: "Streaming ETL Pipeline with Kafka, Spark & Delta Lake",
    description: "End-to-end data engineering pipeline that ingests streaming data via Kafka, processes it with PySpark, stores in Delta Lake format, and serves to ML models and dashboards. Demonstrates the data infrastructure skills that ML engineers need but rarely showcase — the plumbing that makes ML systems actually work.",
    tags: ["Kafka", "PySpark", "Delta Lake", "Docker", "Airflow"],
    difficulty: "Advanced",
    impact: "Most ML engineers can't build their own data pipelines. This skill commands a premium and makes you self-sufficient on any team.",
    status: "not_started",
    category: "data_engineering",
    icon: "🔧",
    priority: 13,
    steps: [
      "Set up Kafka cluster with Docker Compose (producer + broker + consumer)",
      "Build data producer simulating IoT sensor / financial tick data",
      "Implement PySpark Structured Streaming consumer with transformations",
      "Store processed data in Delta Lake with partitioning strategy",
      "Add data quality checks: schema validation, null detection, anomaly flagging",
      "Create batch processing layer for historical aggregations",
      "Build simple dashboard reading from Delta Lake",
      "Document architecture with data flow diagrams"
    ],
    github: "realtime-data-lakehouse",
    timeline: "3–4 weeks"
  },
  {
    id: 14,
    title: "Feature Store",
    subtitle: "Centralized ML Feature Management with Feast",
    description: "Production feature store using Feast that serves both batch and real-time features to ML models. Includes feature definitions, offline/online stores, feature freshness monitoring, and integration examples with training and serving pipelines. The missing piece that most ML portfolios don't have.",
    tags: ["Feast", "Redis", "PostgreSQL", "Python", "Docker"],
    difficulty: "Intermediate",
    impact: "Feature stores are standard in production ML but almost nobody has one in their portfolio. Instant differentiation at interviews.",
    status: "not_started",
    category: "data_engineering",
    icon: "🗄️",
    priority: 14,
    steps: [
      "Design feature schema for a sample ML use case (e.g., user behavior prediction)",
      "Set up Feast with PostgreSQL offline store and Redis online store",
      "Define feature views with time-based aggregations",
      "Build materialization pipeline: offline → online store sync",
      "Create training data generation using point-in-time joins",
      "Build serving integration: model requests features at inference time",
      "Add feature freshness monitoring and alerting",
      "Write guide: 'Why Your ML Team Needs a Feature Store'"
    ],
    github: "ml-feature-store",
    timeline: "2 weeks"
  },
];

const CATEGORIES = {
  all: { label: "All Projects", icon: "🎯", color: "#06b6d4" },
  computer_vision: { label: "Computer Vision", icon: "👁️", color: "#10b981" },
  chatbots: { label: "Chatbots & AI Agents", icon: "🤖", color: "#8b5cf6" },
  forecasting: { label: "Time Series", icon: "📈", color: "#f59e0b" },
  nlp: { label: "NLP", icon: "🗣️", color: "#ec4899" },
  generative_ai: { label: "Generative AI", icon: "🔮", color: "#6366f1" },
  mlops: { label: "MLOps", icon: "⚙️", color: "#06b6d4" },
  data_engineering: { label: "Data Engineering", icon: "🔧", color: "#f97316" },
};

const STATUS_CONFIG = {
  not_started: { label: "To Build", color: "#64748b", bg: "rgba(100,116,139,0.12)" },
  in_progress: { label: "In Progress", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  completed: { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
};

function NavBar({ activeSection, setActiveSection }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(8,10,20,0.88)", backdropFilter: "blur(24px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{
        maxWidth: 1240, margin: "0 auto", padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color: "#fff", fontFamily: "'Space Mono', monospace",
          }}>MA</div>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17,
            color: "#e2e8f0", letterSpacing: "-0.02em",
          }}>Mohamed Alderdiry</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["home", "projects", "about"].map(s => (
            <button key={s} onClick={() => setActiveSection(s)} style={{
              background: activeSection === s ? "rgba(6,182,212,0.12)" : "transparent",
              border: activeSection === s ? "1px solid rgba(6,182,212,0.25)" : "1px solid transparent",
              borderRadius: 8, padding: "7px 16px", cursor: "pointer",
              color: activeSection === s ? "#06b6d4" : "#64748b",
              fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13,
              textTransform: "capitalize", transition: "all 0.2s",
            }}>{s}</button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ onNavigate }) {
  const stats = [
    { n: "14", label: "Portfolio Projects" },
    { n: "7", label: "AI Domains" },
    { n: "6", label: "Sectors (CV Production)" },
    { n: "2", label: "Degrees" },
  ];
  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />
      <div style={{
        position: "absolute", top: "5%", left: "10%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", right: "5%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", width: 400, height: 400,
        background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(50px)", transform: "translate(-50%,-50%)",
      }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 100,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{
              fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 500,
              color: "#10b981", letterSpacing: "0.04em",
            }}>OPEN TO OPPORTUNITIES</span>
          </div>

          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(36px, 5.5vw, 64px)",
            fontWeight: 800, color: "#f1f5f9", lineHeight: 1.08, margin: "0 0 12px",
            letterSpacing: "-0.035em",
          }}>
            Machine Learning<br />Engineer
          </h1>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(20px, 3vw, 32px)",
            fontWeight: 600, margin: "0 0 24px", letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Computer Vision · Forecasting · LLMs · NLP
          </h2>

          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "#94a3b8",
            lineHeight: 1.75, maxWidth: 560, margin: "0 0 36px",
          }}>
            I build production AI systems — from crop disease detection serving 6 agricultural sectors
            to financial forecasting models and intelligent chatbots.
            Based in Riyadh, Saudi Arabia.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
            <button onClick={() => onNavigate("projects")} style={{
              background: "linear-gradient(135deg, #06b6d4, #0891b2)",
              border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer",
              color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15,
              transition: "transform 0.2s", boxShadow: "0 4px 20px rgba(6,182,212,0.3)",
            }}>View Projects</button>
            <button onClick={() => onNavigate("about")} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "12px 28px", cursor: "pointer",
              color: "#cbd5e1", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 15,
              transition: "all 0.2s",
            }}>About Me</button>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {stats.map((s, i) => (
              <div key={i}>
                <p style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 28, fontWeight: 700,
                  color: "#f1f5f9", margin: "0 0 2px",
                }}>{s.n}</p>
                <p style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#64748b",
                  margin: 0, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em",
                }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 8, opacity: 0.5,
        }}>
          {["Python", "PyTorch", "TensorFlow", "LangChain", "FastAPI", "Docker", "Kafka", "MLflow"].map(t => (
            <span key={t} style={{
              padding: "6px 14px", borderRadius: 6,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)",
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569",
              textAlign: "right",
            }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false);
  const status = STATUS_CONFIG[project.status];
  const catColor = CATEGORIES[project.category]?.color || "#06b6d4";

  return (
    <div
      onClick={() => onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
        border: hovered ? `1px solid ${catColor}44` : "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 26, cursor: "pointer",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: hovered ? `linear-gradient(90deg, ${catColor}, transparent)` : "transparent",
        transition: "all 0.3s",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 28 }}>{project.icon}</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{
            padding: "3px 10px", borderRadius: 6,
            background: status.bg, border: `1px solid ${status.color}33`,
            fontFamily: "'Outfit', sans-serif", fontSize: 11, color: status.color, fontWeight: 600,
          }}>{status.label}</span>
          <span style={{
            width: 24, height: 24, borderRadius: 6,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: "#64748b",
          }}>#{project.priority}</span>
        </div>
      </div>

      <h3 style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700,
        color: "#f1f5f9", margin: "0 0 4px", letterSpacing: "-0.01em",
      }}>{project.title}</h3>
      <p style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: catColor,
        margin: "0 0 12px", fontWeight: 600,
      }}>{project.subtitle}</p>
      <p style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: "#94a3b8",
        lineHeight: 1.65, margin: "0 0 16px",
        display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>{project.description}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
        {project.tags.slice(0, 4).map(tag => (
          <span key={tag} style={{
            padding: "3px 9px", borderRadius: 5,
            background: `${catColor}11`, border: `1px solid ${catColor}22`,
            fontFamily: "'Space Mono', monospace", fontSize: 10.5, color: `${catColor}cc`, fontWeight: 500,
          }}>{tag}</span>
        ))}
        {project.tags.length > 4 && (
          <span style={{
            padding: "3px 9px", borderRadius: 5, background: "rgba(255,255,255,0.04)",
            fontFamily: "'Space Mono', monospace", fontSize: 10.5, color: "#64748b", fontWeight: 500,
          }}>+{project.tags.length - 4}</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#475569" }}>{project.timeline}</span>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11.5, color: "#64748b", fontWeight: 600 }}>{project.difficulty}</span>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const status = STATUS_CONFIG[project.status];
  const catColor = CATEGORIES[project.category]?.color || "#06b6d4";

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0c1021", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, maxWidth: 700, width: "100%", maxHeight: "88vh",
        overflow: "auto", padding: "36px 36px 32px", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "sticky", top: 0, float: "right", background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
          width: 32, height: 32, cursor: "pointer", color: "#94a3b8", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
        }}>&times;</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 36 }}>{project.icon}</span>
          <span style={{
            padding: "3px 10px", borderRadius: 6,
            background: status.bg, border: `1px solid ${status.color}33`,
            fontFamily: "'Outfit', sans-serif", fontSize: 11, color: status.color, fontWeight: 600,
          }}>{status.label}</span>
          <span style={{
            padding: "3px 10px", borderRadius: 6,
            background: `${catColor}15`, border: `1px solid ${catColor}25`,
            fontFamily: "'Outfit', sans-serif", fontSize: 11, color: catColor, fontWeight: 600,
          }}>{CATEGORIES[project.category]?.label}</span>
        </div>

        <h2 style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 26, fontWeight: 800,
          color: "#f1f5f9", margin: "8px 0 4px", letterSpacing: "-0.02em",
        }}>{project.title}</h2>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: catColor,
          margin: "0 0 18px", fontWeight: 600,
        }}>{project.subtitle}</p>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14.5, color: "#cbd5e1",
          lineHeight: 1.8, margin: "0 0 24px",
        }}>{project.description}</p>

        <div style={{
          background: `${catColor}08`, border: `1px solid ${catColor}18`,
          borderRadius: 12, padding: "16px 20px", marginBottom: 28,
        }}>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
            color: catColor, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em",
          }}>Why This Project Matters for Your Job Hunt</p>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: "#94a3b8",
            lineHeight: 1.7, margin: 0,
          }}>{project.impact}</p>
        </div>

        <h4 style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700,
          color: "#e2e8f0", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.04em",
        }}>Build Roadmap</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {project.steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                minWidth: 26, height: 26, borderRadius: 7,
                background: `${catColor}12`, border: `1px solid ${catColor}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: catColor,
              }}>{i + 1}</div>
              <p style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: "#94a3b8",
                lineHeight: 1.6, margin: 0, paddingTop: 3,
              }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{
          display: "flex", gap: 24, flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18,
        }}>
          {[
            { label: "Timeline", val: project.timeline },
            { label: "Difficulty", val: project.difficulty },
            { label: "Repo", val: `github.com/mohamedalderdiry/${project.github}`, mono: true },
          ].map((m, i) => (
            <div key={i}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#475569", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.label}</p>
              <p style={{ fontFamily: m.mono ? "'Space Mono', monospace" : "'Outfit', sans-serif", fontSize: m.mono ? 12 : 14, color: m.mono ? catColor : "#f1f5f9", margin: 0, fontWeight: 600 }}>{m.val}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 18 }}>
          {project.tags.map(tag => (
            <span key={tag} style={{
              padding: "4px 11px", borderRadius: 6,
              background: `${catColor}11`, border: `1px solid ${catColor}22`,
              fontFamily: "'Space Mono', monospace", fontSize: 11, color: `${catColor}cc`, fontWeight: 500,
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [activeCat, setActiveCat] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = activeCat === "all" ? PROJECTS : PROJECTS.filter(p => p.category === activeCat);
  const catCount = (cat) => cat === "all" ? PROJECTS.length : PROJECTS.filter(p => p.category === cat).length;

  return (
    <section style={{ maxWidth: 1240, margin: "0 auto", padding: "80px 32px 100px" }}>
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 500,
          color: "#06b6d4", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px",
        }}>PORTFOLIO</p>
        <h2 style={{
          fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 800, color: "#f1f5f9", margin: "0 0 10px", letterSpacing: "-0.03em",
        }}>Project Roadmap</h2>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#64748b", maxWidth: 600, margin: 0,
        }}>
          14 projects across 7 AI domains — strategically chosen to demonstrate breadth and depth for ML Engineer, Data Scientist, and AI Engineer roles.
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 32 }}>
        {Object.entries(CATEGORIES).map(([key, { label, icon, color }]) => (
          <button key={key} onClick={() => setActiveCat(key)} style={{
            background: activeCat === key ? `${color}15` : "rgba(255,255,255,0.02)",
            border: activeCat === key ? `1px solid ${color}30` : "1px solid rgba(255,255,255,0.05)",
            borderRadius: 9, padding: "8px 14px", cursor: "pointer",
            color: activeCat === key ? color : "#64748b",
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12.5,
            transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 14 }}>{icon}</span>
            {label}
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, opacity: 0.6, marginLeft: 2 }}>({catCount(key)})</span>
          </button>
        ))}
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16,
      }}>
        {filtered.sort((a, b) => a.priority - b.priority).map(p => (
          <ProjectCard key={p.id} project={p} onClick={setSelected} />
        ))}
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function AboutSection() {
  const experience = [
    {
      role: "Machine Learning Engineer",
      company: "Super Smart Solutions",
      period: "Sep 2024 – Present",
      location: "Riyadh, Saudi Arabia",
      highlights: [
        "Built production crop disease detection system using Vision Transformers (ViT) across 6 agricultural sectors",
        "Develop and deploy AI/ML models for client projects across the full ML lifecycle",
        "Lead client-facing delivery: requirements → technical specs → deployed API solutions for web and mobile",
      ],
    },
    {
      role: "IT Services Specialist",
      company: "Sudan Gold Refinery",
      period: "Aug 2021 – Present",
      location: "Khartoum, Sudan",
      highlights: [
        "Architected complete IT infrastructure: networks, applications, and web systems",
        "Spearheaded automation of administrative workflows across departments",
        "Established IT governance framework including security policies and backup protocols",
      ],
    },
  ];

  const skills = {
    "ML & AI": ["PyTorch", "TensorFlow", "scikit-learn", "HuggingFace", "LangChain", "OpenCV"],
    "Languages": ["Python", "Java", "PHP", "JavaScript", "SQL"],
    "MLOps": ["Docker", "FastAPI", "MLflow", "Git", "GitHub Actions", "Airflow"],
    "Data": ["Pandas", "NumPy", "Spark", "PostgreSQL", "Redis", "Delta Lake"],
  };

  return (
    <section style={{ maxWidth: 860, margin: "0 auto", padding: "80px 32px 100px" }}>
      <p style={{
        fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 500,
        color: "#06b6d4", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px",
      }}>ABOUT</p>
      <h2 style={{
        fontFamily: "'Outfit', sans-serif", fontSize: "clamp(26px, 4vw, 40px)",
        fontWeight: 800, color: "#f1f5f9", margin: "0 0 32px", letterSpacing: "-0.03em",
      }}>Mohamed Alderdiry</h2>

      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 32, marginBottom: 24,
      }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "#e2e8f0", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 500 }}>
          I build production AI systems that turn raw data into business decisions.
        </p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14.5, color: "#94a3b8", lineHeight: 1.8, margin: "0 0 16px" }}>
          At Super Smart Solutions, I develop computer vision models, forecasting systems, and AI solutions serving real clients. My most impactful work has been building a ViT-based crop disease detection system deployed across 6 agricultural sectors — from model training to API delivery for web and mobile applications.
        </p>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14.5, color: "#94a3b8", lineHeight: 1.8, margin: 0 }}>
          My technical range spans computer vision, time series forecasting, NLP, conversational AI, generative AI, and MLOps. Before moving into ML, I spent 4+ years managing enterprise IT systems — experience that gives me a practical edge in deploying AI within real organizational infrastructure.
        </p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 32, marginBottom: 24,
      }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "#06b6d4", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Experience</h3>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: i < experience.length - 1 ? 24 : 0, paddingBottom: i < experience.length - 1 ? 24 : 0, borderBottom: i < experience.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4 }}>
              <h4 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{e.role}</h4>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#475569" }}>{e.period}</span>
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#64748b", margin: "2px 0 10px" }}>{e.company} · {e.location}</p>
            {e.highlights.map((h, j) => (
              <div key={j} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#06b6d4", fontSize: 8, marginTop: 7 }}>●</span>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>{h}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 32, marginBottom: 24,
      }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "#06b6d4", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Education</h3>
        {[
          { school: "Donghua University, Shanghai", degree: "M.Sc. Computer & Information Sciences", year: "2020 – 2024" },
          { school: "Sudan University of Science & Technology", degree: "B.Sc. Management Information Systems", year: "2014 – 2018" },
        ].map((e, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10, flexWrap: "wrap", gap: 4 }}>
            <div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#f1f5f9", margin: 0, fontWeight: 600 }}>{e.school}</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#94a3b8", margin: "2px 0 0" }}>{e.degree}</p>
            </div>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#475569" }}>{e.year}</span>
          </div>
        ))}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 32, marginBottom: 24,
      }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "#06b6d4", margin: "0 0 20px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Technical Skills</h3>
        {Object.entries(skills).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 14 }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12.5, color: "#64748b", margin: "0 0 8px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cat}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {items.map(s => (
                <span key={s} style={{
                  padding: "5px 12px", borderRadius: 6,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  fontFamily: "'Space Mono', monospace", fontSize: 12, color: "#cbd5e1",
                }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 16, padding: 32,
      }}>
        <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "#06b6d4", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Get in Touch</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "mod.derdiry@gmail.com", icon: "✉️" },
            { label: "linkedin.com/in/mohamedalderdiry", icon: "💼" },
            { label: "github.com/mohamedalderdiry", icon: "🔗" },
            { label: "+966 570 126 493", icon: "📱" },
            { label: "Riyadh, Saudi Arabia", icon: "📍" },
          ].map((c, i) => (
            <span key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#94a3b8",
            }}>{c.icon} {c.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: "#080a14", color: "#f1f5f9" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <NavBar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div style={{ paddingTop: 60 }}>
        {activeSection === "home" && (
          <>
            <HeroSection onNavigate={setActiveSection} />
            <ProjectsSection />
          </>
        )}
        {activeSection === "projects" && <ProjectsSection />}
        {activeSection === "about" && <AboutSection />}
      </div>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "28px 0", textAlign: "center" }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#334155", margin: 0 }}>&copy; {new Date().getFullYear()} Mohamed Alderdiry</p>
      </footer>
    </div>
  );
}
