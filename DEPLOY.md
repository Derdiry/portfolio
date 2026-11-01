# Deployment Guide

| Part | Host | Notes |
|---|---|---|
| Frontend (Vite + React) | Vercel | `www.moderdiry.com` |
| Backend API (FastAPI) | Render, free web service | `render.yaml`, root directory `backend` |
| Database | Neon Postgres | project `summer-voice-22976145`, branch `production`, region `aws-eu-west-2` |

Uploaded files (profile photo, resume, screenshots) are stored in Postgres (`uploaded_files` table),
because Render's free disk is wiped on every restart. They are still served at `/api/uploads/{filename}`.

`railway.toml` and `backend/railway.toml` are unused leftovers from the old Railway setup.

## 1. Database: Neon

The project is already linked (`.neon`, `neon.ts`). To pull its connection strings into `.env.local` (git-ignored):

```bash
neon login        # once, opens a browser
neon env pull     # writes DATABASE_URL (pooled) and DATABASE_URL_UNPOOLED (direct)
```

The backend uses `DATABASE_URL_UNPOOLED` when it is set (one long-running process with its own
connection pool that also creates tables at startup); otherwise `DATABASE_URL`. Neon's `sslmode`
is converted to asyncpg's `ssl` option automatically (`backend/app/core/config.py`).

Tables are created at startup. The seed (`backend/app/services/seed.py`) fills empty tables and creates
the admin user only if none exists **and** `ADMIN_PASSWORD` is set.

## 2. Backend: Render

Either create a Blueprint from `render.yaml` (Render → New → Blueprint → this repo), or create the
service by hand:

| Field | Value |
|---|---|
| Service type | Web Service |
| Repository | `Derdiry/portfolio` |
| Branch | `main` |
| Root directory | `backend` |
| Runtime | Python 3 |
| Region | Frankfurt (closest to the Neon project in London) |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Instance type | Free |
| Health check path | `/health` |

Environment variables:

| Name | Value |
|---|---|
| `PYTHON_VERSION` | `3.10.12` |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string (secret) |
| `JWT_SECRET` | long random string (secret), see below |
| `CORS_ORIGINS` | `https://www.moderdiry.com,https://moderdiry.com` |

Generate `JWT_SECRET` locally and paste it straight into Render (don't save it in a file):

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

`ADMIN_USERNAME` / `ADMIN_PASSWORD` are not needed while the admin user exists in the database.
SMTP variables are not set: Render's free tier blocks outbound SMTP ports (25, 465, 587), so contact
form messages are saved in the `contact_messages` table without an email notification.

Free-tier behaviour: the service sleeps after 15 minutes without traffic and takes about a minute to
wake. Free instance hours (750 per month) are shared by all free services in the Render workspace.

## 3. Frontend: Vercel

- Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
- Environment variable `VITE_API_URL` = the Render service URL (e.g. `https://portfolio-api.onrender.com`).
- `vercel.json` proxies `/uploads/:file` to `<backend>/api/uploads/:file`; keep it pointed at the same backend.
- Redeploy after changing `VITE_API_URL` (it is read at build time).

## 4. Admin password

Passwords are stored as bcrypt hashes. To reset the admin password, run from your machine with the
Neon connection string in `.env.local` (the script prompts for the new password and never prints it):

```bash
cd backend
pip install -r requirements.txt
python -m app.services.reset_admin_password
```

## Local development

`.env.local` points the backend at whichever Neon branch is checked out, so work on a dev branch,
not `production` (new branches expire after 7 days, per `neon.ts`):

```bash
neon checkout dev --create                       # copies production; pulls its env into .env.local
cd backend && pip install -r requirements.txt
uvicorn main:app --reload                        # http://localhost:8000
npm run dev                                      # in the project root, http://localhost:5173
neon checkout production                         # switch back when done
```

Fully local alternative (Postgres in Docker; uses `backend/.env`, see `backend/.env.example`):

```bash
docker compose up -d
npm run dev
```
