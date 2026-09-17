# Job Portal — Frontend (React + Vite)

Single-page application for the Job Portal Management System. Built with React 19, Redux Toolkit, React Router, Axios, and Tailwind CSS v4.

See the [project README](../README.md) for full setup and the API reference.

## Quick start

```bash
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:8000/api
npm run dev             # http://localhost:5173
```

The backend must be running at `http://localhost:8000` (already allowed in `config/cors.php`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run oxlint |

## Structure

| Path | Purpose |
|------|---------|
| `src/app/store.js` | Redux store |
| `src/features` | Redux slices and async thunks |
| `src/services/api.js` | Axios instance (base URL, bearer token, 401 handling) |
| `src/layouts` | Public / User / Admin layouts |
| `src/routes` | Route table and guards (`ProtectedRoute`, `AdminRoute`) |
| `src/components` | Reusable common, jobs, and applications UI |
| `src/pages` | Public, auth, user, admin, and error pages |
| `src/utils` | Constants and formatting helpers |
