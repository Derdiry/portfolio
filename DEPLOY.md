# Deployment Guide

## Step 1 — Create GitHub Repository

1. Go to https://github.com/new
2. Create a repo named `portfolio` (private or public)
3. Run these commands in the project folder:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/mohamedalderdiry/portfolio.git
git push -u origin main
```

## Step 2 — Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project" → import your `portfolio` repo
3. **Framework Preset:** Vite
4. **Root Directory:** `.` (the project root)
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Environment Variables — add:**
   - `VITE_API_URL` = `https://your-backend.railway.app` (fill in after Step 3)
8. Click Deploy

Your site will be live at `mohamedalderdiry.vercel.app` (or similar).

## Step 3 — Deploy Backend to Railway

1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo" → select `portfolio`
3. **Root Directory:** `backend`
4. Railway will detect the Dockerfile automatically
5. Add a **PostgreSQL** service: click "New" → "Database" → "PostgreSQL"
6. In the backend service, add these **Environment Variables:**
   - `DATABASE_URL` = (click the PostgreSQL service → "Connect" → copy the URL, change `postgresql://` to `postgresql+asyncpg://`)
   - `DATABASE_URL_SYNC` = (same URL but keep `postgresql://`)
   - `JWT_SECRET` = (generate a random 32-char string)
   - `ADMIN_USERNAME` = `admin`
   - `ADMIN_PASSWORD` = (your secure password)
   - `CORS_ORIGINS` = `https://mohamedalderdiry.vercel.app`
   - `CONTACT_RECIPIENT` = `mod.derdiry@gmail.com`
7. Deploy — Railway will build the Docker image and run the server

## Step 4 — Connect Frontend to Backend

1. In Vercel dashboard → your project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Railway backend URL (e.g. `https://portfolio-backend.railway.app`)
3. Redeploy: Vercel dashboard → Deployments → "Redeploy"

## Step 5 — Custom Domain (optional, do later)

1. In Vercel dashboard → your project → Settings → Domains
2. Click "Buy Domain" to purchase `mohamedalderdiry.com` (~$10/yr)
3. Vercel handles DNS automatically

## Local development

```bash
# Start backend + database
docker compose up -d

# Start frontend
npm run dev
```
