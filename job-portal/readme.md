# Job Portal Management System

A full-stack job portal application with:

- **Backend** — Laravel 12 REST API (`backend/`)
- **Frontend** — React 19 + Vite + Redux Toolkit SPA (`frontend/`)

## Prerequisites

| Tool      | Version     |
|-----------|-------------|
| PHP       | ^8.2        |
| Composer  | 2.x         |
| Node.js   | 18+         |
| npm       | 9+          |
| MySQL     | 8.x (or SQLite for tests) |

---

## Backend Installation (Laravel API)

```bash
cd backend

# 1. Install PHP dependencies
composer install

# 2. Create environment file and generate app key
cp .env.example .env
php artisan key:generate

# 3. Configure MySQL in .env
#    DB_CONNECTION=mysql
#    DB_DATABASE=job_portal
#    DB_USERNAME=root
#    DB_PASSWORD=

# 4. Create the database, run migrations and seed demo data
php artisan migrate --seed

# 5. Create the storage symlink (for uploaded resumes/avatars)
php artisan storage:link

# 6. Start the API server
php artisan serve --port=8000
```

API runs at `http://localhost:8000/api`.

### Seeded accounts

| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@example.com  | password  |
| User  | user@example.com   | password  |
| User  | jane@example.com   | password  |
| User  | mike@example.com   | password  |

### Run backend tests

```bash
php artisan test
```

Tests run against in-memory SQLite (`phpunit.xml`), no database setup required.

---

## Frontend Installation (React SPA)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
#    VITE_API_URL=http://localhost:8000/api

# 3. Start the Vite dev server
npm run dev
```

App runs at `http://localhost:5173`. The backend must be running on `http://localhost:8000`.

### Frontend scripts

| Command               | Description                        |
|-----------------------|------------------------------------|
| `npm run dev`         | Start the Vite dev server          |
| `npm run build`       | Production build to `dist/`        |
| `npm run preview`     | Preview the production build       |
| `npm run lint`        | Run oxlint                         |

---

## Run Both

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
php artisan serve --port=8000

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Then open `http://localhost:5173` and log in with one of the seeded accounts.

## Project Structure

```
job-portal/
├── backend/    # Laravel 12 REST API
└── frontend/   # React 19 + Vite SPA
```