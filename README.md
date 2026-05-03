# Mohamed Alderdiry — Portfolio Website

Production-grade personal portfolio built with React 18 + TypeScript + Vite + Tailwind CSS.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS (custom theme)
- **Animations:** Framer Motion
- **Routing:** React Router v6
- **Icons:** Lucide React

## Project Structure

```
src/
├── App.tsx                    # Root component + router
├── main.tsx                   # Entry point
├── index.css                  # Global styles + Tailwind directives
├── context/
│   └── ThemeContext.tsx        # Dark/light mode toggle
├── data/
│   ├── projects.ts            # All project data (hardcoded Phase 1)
│   └── profile.ts             # Personal info, experience, education, skills
├── hooks/
│   └── useScrollAnimation.ts  # IntersectionObserver + typing animation hooks
├── types/
│   └── index.ts               # TypeScript type definitions
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx         # Sticky nav with blur + mobile menu
│   │   └── Footer.tsx         # Footer with social links
│   └── projects/
│       └── meta.ts            # Category + status display metadata
└── pages/
    ├── Home.tsx               # Hero + featured projects + CTA
    ├── Projects.tsx           # Filterable project grid
    ├── ProjectDetail.tsx      # Individual project page
    ├── About.tsx              # Bio + experience + education + skills
    ├── Resume.tsx             # Web resume view + download button
    └── Contact.tsx            # Contact form + info + QR placeholders
```

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

```bash
# .env.example — no env vars needed for Phase 1 (static frontend)
# Phase 2 will add:
VITE_API_URL=http://localhost:4000
```

## Development Phases

### Phase 1 (current) — Frontend
- [x] All pages with static/hardcoded data
- [x] Real project content and profile data
- [x] Responsive design + Framer Motion animations
- [x] Dark/light mode toggle
- [x] Project filtering + search
- [x] Project detail pages
- [x] Contact form (frontend only)
- [x] Resume web view

### Phase 2 — Backend
- [ ] FastAPI or Node/Express API
- [ ] PostgreSQL database + schema
- [ ] Connect frontend to backend (projects CRUD, contact form email)

### Phase 3 — Admin + Analytics
- [ ] JWT authentication + admin dashboard
- [ ] Visitor analytics tracking
- [ ] QR code generation
- [ ] Profile + project management UI
- [ ] PDF resume upload

### Phase 4 — Deploy
- [ ] Vercel (frontend)
- [ ] Railway/Render (backend + DB)
- [ ] GitHub Actions CI/CD
- [ ] Custom domain + SSL

## Design Tokens

```
Background:    #080a14
Surface:       #0d1117
Border:        #1e2333
Accent:        #06b6d4  (cyan-500)
Accent hover:  #0891b2
Muted text:    #94a3b8
Subtle bg:     #1a1f2e
Fonts:         Outfit (sans) + Space Mono (mono)
```

## Deployment (Phase 4)

```bash
# Vercel (frontend)
npm i -g vercel
vercel --prod

# Environment variable on Vercel:
# VITE_API_URL = https://your-backend-url.railway.app
```
