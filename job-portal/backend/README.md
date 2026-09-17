# Job Portal — Backend (Laravel 12 API)

REST API for the Job Portal Management System. Layered architecture: Controller → FormRequest → Service → Repository → Model, with API Resources for JSON shaping and Policies for authorization.

See the [project README](../README.md) for full setup and the API reference.

## Quick start

```bash
composer install
cp .env.example .env
php artisan key:generate
# configure MySQL in .env, then:
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

## Tests

```bash
php artisan test
```

Runs against in-memory SQLite (`phpunit.xml`).

## Directory highlights

| Path | Purpose |
|------|---------|
| `app/Http/Controllers/{Public,User,Admin}` | Thin controllers grouped by audience |
| `app/Http/Requests` | Validation rules |
| `app/Services` | Business logic |
| `app/Repositories` | Database queries |
| `app/Http/Resources` | JSON response shapes |
| `app/Policies` | Authorization |
| `routes/api.php` | All API routes |
| `tests/Feature` | Feature tests |
