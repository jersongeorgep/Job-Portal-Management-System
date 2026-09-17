# Job Portal Management System

A full-stack job board where visitors browse and filter published jobs, registered users apply with a cover letter and resume, and administrators manage jobs, applications, and view dashboard statistics.

- **Backend:** Laravel 12 REST API with Sanctum token authentication
- **Frontend:** React 19 + Vite + Redux Toolkit + Tailwind CSS v4
- **Database:** MySQL

---

## Features

### Public / Guest
- Browse published, non-expired jobs with pagination
- Search by keyword and filter by category, location, experience level, and employment type
- Filters are reflected in the URL (shareable/bookmarkable) and search input is debounced
- View job details by slug
- Browse jobs grouped by category
- Live site statistics (jobs, companies, categories, job seekers)

### Registered User
- Register and log in
- Personal dashboard
- Apply to a job with a cover letter (required) and resume (PDF/DOC/ DOCX, required)
- Prevented from applying twice to the same job
- View own applications and their statuses

### Administrator
- Dashboard with job/application/user statistics
- Full CRUD for jobs (draft / published / closed, featured flag)
- View and filter all applications by status
- Update application status (pending / reviewed / shortlisted / rejected)
- Download applicant resumes

### Cross-cutting
- Role-based access control (`user` / `admin`) via middleware and policies
- Clean JSON response envelope: `{ success, message?, data, meta? }`
- Consistent validation errors (HTTP 422) and business errors (409) rendered as clean JSON
- Resume files stored on the `public` disk with generated URLs

---

## Architecture

### Backend (layered)

```
HTTP Request
   │
   ▼
routes/api.php
   │
   ▼
Controller (thin)
   │
   ▼
FormRequest  ──►  validation
   │
   ▼
Service (business rules)
   │
   ▼
Repository (query/persistence)
   │
   ▼
Eloquent Model
   │
   ▼
Resource (JSON shape)
```

- **Controllers** (`app/Http/Controllers/{Public,User,Admin}`) only orchestrate.
- **FormRequests** (`app/Http/Requests`) hold validation rules.
- **Services** (`app/Services`) hold business logic (duplicate applications, deadlines, slugs, stats).
- **Repositories** (`app/Repositories`) hold all database queries.
- **Resources** (`app/Http/Resources`) shape JSON output.
- **Policies** (`app/Policies`) enforce per-model authorization.
- **Middleware aliases** `admin` and `user` are registered in `bootstrap/app.php`.

### Frontend

```
src/
├── app/store.js               # Redux store
├── features/                  # Redux slices + async thunks (auth, jobs, categories, applications)
├── services/api.js            # Axios instance (base URL, bearer token, 401 handling)
├── layouts/                   # PublicLayout, UserLayout, AdminLayout
├── routes/                    # AppRoutes, ProtectedRoute, AdminRoute
├── components/
│   ├── common/                # Button, Input, Select, Modal, Pagination, Loader, ...
│   ├── jobs/                  # JobCard, JobTable, JobFilters, JobForm
│   └── applications/          # ApplicationCard, ApplicationTable
├── pages/
│   ├── public/ auth/ user/ admin/ errors/
└── utils/                     # constants.js, helpers.js
```

Local auth state is persisted in `localStorage` (`access_token`, `user`) and attached to every request by the Axios interceptor.

---

## Project Structure

```
Job-Portal-Management-System/
└── job-portal/
    ├── backend/         # Laravel 12 API
    └── frontend/        # React + Vite app
```

---

## Prerequisites

- PHP >= 8.2 (with the `pdo_mysql`, `fileinfo`, and `mbstring` extensions)
- Composer 2.x
- Node.js 20+ and npm
- MySQL 8.x (or MariaDB)

---

## Setup

### 1. Backend

```bash
cd job-portal/backend

composer install
cp .env.example .env
php artisan key:generate
```

Configure the database in `.env`:

```env
APP_NAME=JobPortal
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=job_portal
DB_USERNAME=root
DB_PASSWORD=
```

Create the database and migrate/seed:

```bash
mysql -u root -e "CREATE DATABASE job_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

php artisan migrate --seed
php artisan storage:link     # required so resume URLs resolve
```

Start the API:

```bash
php artisan serve --port=8000
```

### 2. Frontend

```bash
cd job-portal/frontend

npm install
cp .env.example .env        # VITE_API_URL=http://localhost:8000/api
npm run dev                 # http://localhost:5173
```

> `http://localhost:5173` is already present in `backend/config/cors.php`.

---

## Demo Credentials

Seeded by `DatabaseSeeder` (idempotent — safe to run repeatedly):

| Role  | Email                 | Password |
|-------|-----------------------|----------|
| Admin | `admin@example.com`   | `password` |
| User  | `user@example.com`    | `password` |

Other seeded applicants: `jane@example.com`, `mike@example.com` (password `password`).

---

## API Reference

Base URL: `http://localhost:8000/api`

Success responses use `{ "success": true, "data": ..., "meta"? }`. Errors use `{ "success": false, "message": "..." }` (422 includes `errors`).

### Authentication

| Method | Endpoint         | Auth | Description |
|--------|------------------|------|-------------|
| POST   | `/register`      | —    | Register a new user, returns a token |
| POST   | `/login`         | —    | Log in, returns a token |
| POST   | `/logout`        | ✅   | Revoke the current token |
| POST   | `/refresh`       | ✅   | Revoke the current token and issue a new one |
| GET    | `/me`            | ✅   | Current authenticated user |

### Public

| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| GET    | `/jobs`            | Paginated published jobs (`search`, `category`, `location`, `experience_level`, `employment_type`, `per_page`, `page`) |
| GET    | `/jobs/featured`   | Featured published jobs |
| GET    | `/jobs/{slug}`     | Single published job (404 if not published/missing) |
| GET    | `/categories`      | Categories with published job counts |
| GET    | `/stats`           | Site statistics (jobs, companies, categories, users) |

### User (`auth:sanctum` + `user`)

| Method | Endpoint                     | Description |
|--------|------------------------------|-------------|
| GET    | `/user/applications`         | List the current user's applications (paginated) |
| GET    | `/user/applications/{id}`    | View one of the current user's applications |
| POST   | `/jobs/{job}/apply`          | Apply (multipart: `cover_letter`, `resume`) |

### Admin (`auth:sanctum` + `admin`)

| Method | Endpoint                             | Description |
|--------|--------------------------------------|-------------|
| GET    | `/admin/dashboard`                   | Dashboard statistics |
| GET    | `/admin/jobs`                        | List all jobs (supports filters + `status`) |
| POST   | `/admin/jobs`                        | Create a job |
| GET    | `/admin/jobs/{id}`                   | View a job |
| PUT    | `/admin/jobs/{id}`                   | Update a job |
| DELETE | `/admin/jobs/{id}`                   | Soft-delete a job |
| GET    | `/admin/applications`                | List applications (filter by `status`) |
| GET    | `/admin/applications/{id}`           | View an application |
| PATCH  | `/admin/applications/{id}/status`    | Update application status |

### Example

```bash
# Log in
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Use the returned token
curl http://localhost:8000/api/admin/dashboard \
  -H "Authorization: Bearer <TOKEN>"

# Apply to a job (multipart)
curl -X POST http://localhost:8000/api/jobs/1/apply \
  -H "Authorization: Bearer <TOKEN>" \
  -F "cover_letter=I would love to join." \
  -F "resume=@/path/to/resume.pdf"
```

---

## Testing

Backend feature tests run against an in-memory SQLite database (configured in `phpunit.xml`):

```bash
cd job-portal/backend
php artisan test
```

Covers authentication/token revocation, public job listing and filters, job CRUD, and the full application lifecycle (apply, duplicate prevention, deadline/validation rules, status updates, authorization).

Frontend:

```bash
cd job-portal/frontend
npm run lint      # oxlint
npm run build     # production build
```

---

## Notes & Limitations

- **Token model:** Sanctum uses a single personal access token per session. `/refresh` revokes the presented token and issues a new one (no refresh-token/rotation strategy). Single-page clients should store only the latest token.
- **File uploads:** Resumes are stored on the `public` disk; run `php artisan storage:link` so URLs under `/storage/...` resolve.
- **Job visibility:** A job is public only when `status = published` **and** its `application_deadline` has not passed.
- **Soft deletes:** Jobs are soft-deleted, so historical applications remain intact.
