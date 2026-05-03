# COMPLETE PORTFOLIO WEBSITE REBUILD — CLAUDE PROMPT

I need you to build a highly professional, production-grade portfolio website for an ML/AI engineer targeting big tech companies. You'll rebuild my existing portfolio with major improvements across design, content, features, and functionality.

---

# MY BACKGROUND (Use This for Content)

## Personal Information
- **Name:** Mohamed Alderdiry
- **Title:** Applied Machine Learning Engineer
- **Location:** Riyadh, Saudi Arabia
- **Email:** mod.derdiry@gmail.com
- **Phone:** +966 570 126 493
- **LinkedIn:** linkedin.com/in/mohamedalderdiry
- **GitHub:** github.com/mohamedalderdiry

## Education
- **Master's in Computer Science** — Donghua University, Shanghai (2020-2024)
- **Bachelor's in Management Information Systems** — Sudan University of Science & Technology (2014-2018)

## Current Role
- **Applied Machine Learning Engineer** at Super Smart Solutions
- Work on computer vision and deep learning systems for agricultural and healthcare applications
- Experience with Vision Transformers, ResNets, EfficientNets, production deployment

## About Me (Use on About Page)
```
Machine Learning Engineer with a Master's in Computer Science from Donghua University. I build production AI systems across computer vision, time series forecasting, and NLP/RAG, focusing on taking models from research to deployment.

I work on computer vision systems for agriculture and healthcare using Vision Transformers, ResNets, and EfficientNets. My experience includes transfer learning for specialized domains, large-scale geospatial platforms, and implementing model interpretability techniques like Grad-CAM for high-stakes domains.

For time series work, I built a 36-model ensemble benchmarking LSTM, GRU, TSMixer, PatchTST, Temporal Fusion Transformer, and Chronos. The most interesting finding: conflict event data from ACLED predicted commodity prices better than technical indicators in unstable markets. Post-coup regime change outranked everything else in the TFT's attention weights at a 30-day lag.

I've deployed a RAG application using LangChain and ChromaDB with hybrid BM25/vector search on Hugging Face Spaces. Built a model-agnostic serving platform with FastAPI, MLflow, and Docker for zero-code deployment with automated versioning and monitoring.

I'm also collaborating with petroleum engineers on an AI decision support system for pipeline integrity management using React, FastAPI, PostgreSQL, and Celery. Academic papers in preparation.

I'm a co-inventor on Australian Patent 2025203718 for medical image processing.

Stack: PyTorch, TensorFlow, Hugging Face Transformers, LangChain, Vision Transformers, ChromaDB, FAISS, FastAPI, Docker, MLflow, PostgreSQL, Redis, React, Streamlit.
```

## Patent
- **Australian Patent #2025203718** — "Innovative Image Processing Approach For Measuring Scar Tissue Extensibility" (Accepted)
- Co-inventor, medical imaging application

---

# PROJECTS TO SHOWCASE (5 Main Projects)

## Project 1: Gold Price Forecaster
**Category:** Time Series Forecasting  
**Status:** Complete  
**GitHub:** [URL when available]  
**Live Demo:** [URL when available]

**Description:**
36-model ensemble forecasting system benchmarking modern architectures (LSTM, GRU, TSMixer, PatchTST, Temporal Fusion Transformer, Chronos) with walk-forward validation on dual tracks (global commodities + Sudan local markets). Demonstrated how conflict event data (ACLED) predicts commodity prices in unstable markets — post-coup regime change outranked all technical indicators in TFT attention weights at 30-day lag. Reproduced TSMixer architecture from original Google Research paper, validating against author benchmarks.

**Tech Stack:** PyTorch, TensorFlow, Optuna, MLflow, Docker, Pandas, NumPy, scikit-learn, Plotly, ACLED API

**Key Features:**
- 36-model ensemble with walk-forward validation
- Dual-track system (global + local markets)
- Conflict event data integration (ACLED)
- TSMixer architecture reproduction
- Automated experiment tracking with MLflow
- Interactive Plotly dashboards

**Results/Metrics:**
- Conflict events outperformed technical indicators
- 30-day lag optimal for regime change predictions
- TSMixer validation within 2% of published benchmarks

---

## Project 2: SudanWiki RAG Chatbot
**Category:** NLP/RAG  
**Status:** Complete (Live on Hugging Face Spaces)  
**GitHub:** [URL when available]  
**Live Demo:** [Hugging Face Spaces URL]

**Description:**
Production RAG application using LangChain + ChromaDB with hybrid BM25/vector search. Curated knowledge base of 60+ academic and institutional sources on Sudan's history and civil war. Swappable LLM backend supporting Claude, Groq, and Cohere APIs. Deployed on Hugging Face Spaces serving 1,000+ queries with 99%+ uptime.

**Tech Stack:** LangChain, ChromaDB, FAISS, Sentence Transformers, Hugging Face Transformers, Anthropic API, Groq API, Cohere API, Streamlit, Docker

**Key Features:**
- Hybrid BM25/vector search
- 60+ curated academic sources
- Swappable LLM backends (Claude/Groq/Cohere)
- Optimized chunking (1024 tokens, 20% overlap)
- Response streaming
- Source citation tracking

**Results/Metrics:**
- 1,000+ queries served
- 99%+ uptime
- Live demo publicly accessible

---

## Project 3: ML Model Serving Platform
**Category:** MLOps Infrastructure  
**Status:** Complete  
**GitHub:** [URL when available]

**Description:**
Model-agnostic serving platform with FastAPI + MLflow + Docker + Prometheus/Grafana enabling zero-code deployment of PyTorch, TensorFlow, and scikit-learn models. Implemented A/B testing with traffic splitting, automated model versioning, and drift detection using KS tests. Supports both time series and computer vision workloads through plugin architecture.

**Tech Stack:** FastAPI, MLflow, Docker, Prometheus, Grafana, PostgreSQL, Redis, ONNX Runtime, GitHub Actions, Python

**Key Features:**
- Zero-code model deployment
- A/B testing infrastructure
- Automated versioning
- Drift detection (KS tests)
- Request batching
- ONNX quantization (40-60% latency reduction)
- Monitoring dashboards

**Results/Metrics:**
- 5-minute model deployment time
- 40-60% inference latency reduction with quantization
- Supports PyTorch, TensorFlow, scikit-learn

---

## Project 4: Pipeline Integrity Management Platform (PIMP)
**Category:** Industrial AI / Full-Stack  
**Status:** Development Complete (Papers in Preparation)  
**GitHub:** Not public (collaborative work)

**Description:**
AI decision support system for pipeline integrity management developed with petroleum engineers in Sudan. Full-stack platform (React, FastAPI, PostgreSQL, Celery) with ML measurement correction (XGBoost) and rule-based repair mode assignment. 16-step decision engine with configurable rule sets. Academic papers in preparation documenting 40% reduction in unnecessary excavations.

**Tech Stack:** React, FastAPI, PostgreSQL, Celery, Redis, XGBoost, Docker, Pandas, NumPy, scikit-learn, Plotly

**Key Features:**
- ML measurement correction (XGBoost)
- 16-step rule-based decision engine
- Full audit trail
- React frontend with forms interface
- Asynchronous processing (Celery)
- Complete workflow automation

**Results/Metrics:**
- 40% reduction in unnecessary excavations
- 60% reduction in decision time
- Validated on 500+ km of pipeline data

**Note:** Architecture diagrams and methodology available; code confidential pending client approval.

---

## Project 5: Water Distribution Sales Dashboard
**Category:** Business Intelligence  
**Status:** Complete (Client Delivery)  
**GitHub:** [URL when available - anonymized version]

**Description:**
Bilingual (Arabic/English) sales analytics dashboard for water distribution company using Streamlit. Automated Excel ingestion, SQLite persistence, and one-click Windows installer deployment. Zero infrastructure costs with desktop-first architecture. Replaced manual Excel workflows with automated KPI tracking and visualization.

**Tech Stack:** Streamlit, Pandas, Plotly, SQLite, PyInstaller, ReportLab, Python

**Key Features:**
- Bilingual UI (Arabic/English toggle)
- Automated Excel ingestion
- SQLite data persistence
- Interactive Plotly visualizations
- One-click Windows installer
- Automated PDF reports
- Zero cloud infrastructure

**Results/Metrics:**
- 6 months in production
- Zero support tickets
- Eliminated manual reporting workflows

---

# TECH STACK SUMMARY

**ML/AI:** PyTorch, TensorFlow, scikit-learn, XGBoost, Hugging Face Transformers, LangChain  
**Computer Vision:** Vision Transformers (ViT), ResNet, EfficientNet, Grad-CAM, Transfer Learning  
**NLP/RAG:** ChromaDB, FAISS, BM25, Semantic Search, Sentence Transformers  
**Time Series:** TSMixer, PatchTST, Temporal Fusion Transformer, LSTM, GRU, Chronos  
**Infrastructure:** Docker, MLflow, FastAPI, PostgreSQL, Redis, Celery, Prometheus, Grafana  
**Frontend:** React, Streamlit, Plotly, Tailwind CSS  
**Data:** Pandas, NumPy, Matplotlib, Plotly

---

# CURRENT WEBSITE STRUCTURE (What I Already Have)

I'm attaching my current portfolio website code (React component). It has:
- Basic navigation (Home, Projects, About)
- Hero section
- Projects grid (showing placeholder projects)
- About section with experience/education
- Contact info
- Dark theme with Outfit + Space Mono fonts

**What's missing/needs improvement:**
- Projects are placeholders, not my actual 5 projects
- No admin dashboard to edit content
- No visitor analytics
- No QR code generation
- No profile photo management
- No contact form
- No downloadable resume
- No project detail pages
- No filtering/search
- Frontend design is okay but could be more polished
- No backend/database
- No authentication

---

# YOUR TASK: BUILD THE COMPLETE WEBSITE

## REQUIREMENTS

### 1. FRONTEND MODERNIZATION

**Tech Stack:**
- React 18+ with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- React Router for navigation
- Framer Motion for animations (smooth, professional)
- Lucide React for icons

**Design Requirements:**
- Keep dark theme as base (current color scheme is good: #080a14 background, #06b6d4 accent)
- Add light/dark mode toggle
- Smooth scroll animations
- Responsive design (mobile-first)
- Professional typography (keep Outfit + Space Mono or suggest better)
- Fast loading (<2s initial load)
- Optimized images (WebP, lazy loading)

**Pages/Sections:**
1. **Home** (Hero + Featured Projects)
2. **Projects** (All 5 projects with filtering)
3. **About** (Bio + Experience + Education + Skills)
4. **Resume** (Downloadable PDF + web view)
5. **Contact** (Contact form + info)
6. **Admin Dashboard** (protected route)
7. **Analytics Dashboard** (protected route)

---

### 2. PROJECTS SECTION (Most Important)

**Project Grid:**
- Display all 5 projects as cards
- Each card shows:
  - Project title
  - Category badge (Time Series / NLP / MLOps / Industrial AI / BI)
  - Tech stack tags (first 5 technologies)
  - Status badge (Complete / In Progress / Papers in Prep)
  - 1-sentence description
  - "View Details" button
  - GitHub link icon (if public)
  - Live demo icon (if available)

**Filtering:**
- Filter by category: All / Computer Vision / NLP/RAG / Time Series / MLOps / Industrial AI / Business Intelligence
- Filter by status: All / Complete / In Progress
- Filter by tech: Dropdown showing all unique technologies

**Project Detail Pages:**
- Individual page for each project at `/projects/:id`
- Full description (2-3 paragraphs)
- Problem statement section
- Technical approach section
- Architecture diagram (placeholder image for now)
- Key features (bullet list)
- Tech stack (all technologies with badges)
- Results/metrics (if available)
- GitHub repo button (opens in new tab)
- Live demo button (opens in new tab)
- "Back to Projects" navigation

**Project Management (Admin):**
- Add new project
- Edit existing project
- Delete project
- Upload architecture diagram
- Reorder projects (drag & drop)

---

### 3. ADMIN DASHBOARD

**Authentication:**
- Simple JWT-based login
- Protected routes (only accessible when logged in)
- Login page at `/admin/login`
- Logout functionality

**Admin Sections:**

**A. Profile Management**
- Edit name, title, location
- Upload profile photo (crop + resize to 400x400)
- Edit bio/about text
- Edit contact details (email, phone, LinkedIn, GitHub)
- Generate QR codes:
  - LinkedIn profile QR code
  - Portfolio website QR code
  - vCard QR code (contact info)
  - Download QR codes as PNG

**B. Projects Management**
- List all projects (table view)
- Add new project (form with all fields)
- Edit project (modal or dedicated page)
- Delete project (with confirmation)
- Upload project images/diagrams
- Reorder projects (priority/featured)

**C. Experience Management**
- Add/edit work experience entries
- Reorder experience entries

**D. Education Management**
- Add/edit education entries

**E. Skills Management**
- Add/edit/remove skills
- Organize skills by category
- Reorder categories

**F. Resume Management**
- Upload PDF resume
- Auto-generate resume from profile data (bonus feature)

---

### 4. ANALYTICS DASHBOARD

**Visitor Tracking:**
- Total visitors (all time)
- Unique visitors (daily, weekly, monthly)
- Page views per page
- Geographic distribution (country-level)
- Referral sources (direct, LinkedIn, GitHub, search engines)
- Most viewed projects
- Average session duration
- Bounce rate

**Charts/Visualizations:**
- Line chart: Visitors over time (last 30 days)
- Bar chart: Page views by page
- Pie chart: Traffic sources
- Map: Geographic distribution
- Table: Most viewed projects

**Implementation:**
- Use lightweight analytics (avoid Google Analytics for privacy)
- Store analytics in database (PostgreSQL or SQLite)
- Update counters on each page view
- Dashboard shows charts with Recharts or Chart.js

---

### 5. CONTACT SECTION

**Contact Information Display:**
- Email (clickable mailto: link)
- Phone (clickable tel: link)
- LinkedIn (opens in new tab)
- GitHub (opens in new tab)
- Location
- Timezone display

**Contact Form:**
- Fields: Name, Email, Subject, Message
- Form validation (required fields, email format)
- Send email via backend API
- Success/error messages
- reCAPTCHA to prevent spam (optional)

**QR Codes Display:**
- Show 3 QR codes:
  - LinkedIn profile QR
  - Portfolio website QR
  - vCard QR
- Downloadable as images

---

### 6. RESUME PAGE

**Resume Display:**
- Web-friendly version of resume
- Structured sections:
  - Header (name, title, contact)
  - Summary
  - Experience
  - Projects (top 3)
  - Education
  - Skills
  - Patent
- Download PDF button
- Print-friendly CSS

**Resume PDF:**
- Upload custom PDF in admin
- OR auto-generate from profile data using PDFKit or similar

---

### 7. BACKEND & DATABASE

**Tech Stack:**
- Node.js + Express OR Python + FastAPI (your choice)
- PostgreSQL for database (or SQLite for simplicity)
- JWT for authentication
- Nodemailer/SendGrid for contact form emails

**Database Schema:**

**Tables:**
1. **profile** (id, name, title, bio, email, phone, linkedin, github, location, photo_url)
2. **projects** (id, title, category, status, description, tech_stack, features, results, github_url, demo_url, architecture_image, priority, created_at)
3. **experience** (id, role, company, location, start_date, end_date, highlights, order)
4. **education** (id, school, degree, field, start_year, end_year, order)
5. **skills** (id, category, skill_name, order)
6. **analytics** (id, page, visitor_id, referrer, country, timestamp)
7. **users** (id, username, password_hash) — for admin login

**API Endpoints:**

**Public:**
- GET /api/profile
- GET /api/projects
- GET /api/projects/:id
- GET /api/experience
- GET /api/education
- GET /api/skills
- POST /api/contact (send email)
- POST /api/analytics (log page view)

**Protected (Admin only):**
- PUT /api/profile
- POST /api/profile/photo
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
- POST /api/experience
- PUT /api/experience/:id
- DELETE /api/experience/:id
- (similar for education, skills)
- GET /api/analytics/stats
- POST /api/qr-codes/generate

---

### 8. DEPLOYMENT

**Frontend:**
- Deploy to Vercel (free tier)
- Custom domain: mohamedalderdiry.com (or similar)
- SSL/HTTPS automatic
- Environment variables for API URL

**Backend:**
- Deploy to Railway, Render, or Fly.io (free tier options)
- PostgreSQL database hosted on same platform
- Environment variables for JWT secret, email credentials

**CI/CD:**
- GitHub Actions for automated deployment
- Deploy on push to main branch

---

### 9. ADDITIONAL FEATURES

**SEO Optimization:**
- Meta tags for each page
- Open Graph tags for social sharing
- Structured data (JSON-LD) for search engines
- Sitemap.xml
- robots.txt

**Performance:**
- Image optimization (WebP, lazy loading)
- Code splitting
- Minification
- Caching headers
- Lighthouse score >90

**Accessibility:**
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance (WCAG AA)

**Security:**
- Input sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting on API endpoints
- Secure password hashing (bcrypt)

---

### 10. DESIGN IMPROVEMENTS

**Current design is good, but enhance:**

**Hero Section:**
- Animated gradient background
- Typing animation for title
- CTA buttons with hover effects
- Profile photo with glow effect

**Project Cards:**
- Hover effects (lift + shadow)
- Animated tech stack badges
- Status indicators with colors
- GitHub stars count (if public repo)

**Navigation:**
- Sticky header with blur background
- Active section indicator
- Smooth scroll to sections
- Mobile hamburger menu

**Footer:**
- Social links with icons
- Copyright notice
- Quick links to sections
- Back to top button

**Animations:**
- Fade in on scroll (Framer Motion)
- Stagger animations for lists
- Smooth page transitions
- Loading states for data fetching

---

# OUTPUT REQUIREMENTS

Provide complete, production-ready code including:

1. **Full React application** (all components, pages, routing)
2. **Backend API** (all endpoints, database setup)
3. **Database schema** (SQL or Prisma schema)
4. **Tailwind config** with custom theme
5. **Environment variables** template (.env.example)
6. **README.md** with:
   - Setup instructions
   - Environment variables needed
   - Database setup steps
   - Deployment guide
   - How to run locally
7. **package.json** with all dependencies
8. **Docker setup** (optional but nice to have)

---

# SPECIFIC QUESTIONS TO ADDRESS

1. **Should I use TypeScript or JavaScript?** (Recommend TypeScript for type safety)
2. **Backend in Node.js or Python?** (Your choice — I know both)
3. **Database: PostgreSQL or SQLite?** (PostgreSQL for production, SQLite for simplicity)
4. **Authentication: JWT or session-based?** (JWT recommended)
5. **Email service: Nodemailer or SendGrid?** (Free tier constraints)
6. **Analytics: Custom or third-party?** (Custom preferred for privacy)
7. **QR code library recommendation?** (qrcode.js or similar)

---

# PRIORITIES (Build in This Order)

**Phase 1 (Week 1):**
1. Frontend structure with all pages (static content first)
2. Project cards with real data (hardcoded initially)
3. Responsive design + animations
4. About page with full content

**Phase 2 (Week 2):**
1. Backend API setup
2. Database schema + seeding with my data
3. Connect frontend to backend
4. Projects CRUD working

**Phase 3 (Week 3):**
1. Admin dashboard (authentication + profile management)
2. Analytics tracking implementation
3. Contact form with email sending
4. QR code generation

**Phase 4 (Week 4):**
1. Resume page + PDF generation
2. SEO optimization
3. Performance optimization
4. Deployment + custom domain

---

# FINAL NOTES

- **Keep it professional** — this is for big tech recruiters
- **Make it fast** — slow sites lose visitors
- **Make it beautiful** — design matters
- **Make it functional** — admin features must work smoothly
- **Make it maintainable** — clean code, good comments
- **Make it secure** — protect admin routes properly

Build this as if it's going to be featured on Awwwards or CSS Design Awards. I want recruiters from Google, Meta, Amazon to see this and think "this person knows how to build production systems."

Start with Phase 1 and give me the complete code for the frontend structure with all pages.
