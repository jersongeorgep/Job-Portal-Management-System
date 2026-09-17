<?php

namespace App\Repositories;

use App\Models\Job;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class JobRepository
{
    public function __construct(protected Job $model) {}

    public function getPublicJobs(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = $this->model->newQuery()
            ->with('category')
            ->where('status', 'published')
            ->where('application_deadline', '>=', now());

        $query = $this->applyFilters($query, $filters);

        return $query->latest()->paginate($perPage);
    }

    public function getFeaturedJobs(int $limit = 6)
    {
        return $this->model->newQuery()
            ->with('category')
            ->where('status', 'published')
            ->where('is_featured', true)
            ->where('application_deadline', '>=', now())
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getAdminJobs(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with('category', 'creator');

        $query = $this->applyFilters($query, $filters, true);

        return $query->latest()->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Job
    {
        return $this->model->newQuery()
            ->with('category', 'creator')
            ->where('slug', $slug)
            ->first();
    }

    public function findById(int $id): ?Job
    {
        return $this->model->newQuery()
            ->with('category', 'creator')
            ->find($id);
    }

    public function create(array $data): Job
    {
        return $this->model->create($data);
    }

    public function update(Job $job, array $data): Job
    {
        $job->update($data);
        return $job->fresh();
    }

    public function delete(Job $job): bool
    {
        return $job->delete();
    }

    public function getDashboardStats(): array
    {
        $model = $this->model->newQuery();

        return [
            'total_jobs' => $model->count(),
            'published_jobs' => (clone $model)->where('status', 'published')->count(),
            'draft_jobs' => (clone $model)->where('status', 'draft')->count(),
            'closed_jobs' => (clone $model)->where('status', 'closed')->count(),
        ];
    }

    public function getPublicStats(): array
    {
        $active = $this->model->newQuery()
            ->where('status', 'published')
            ->where('application_deadline', '>=', now());

        return [
            'total_jobs' => (clone $active)->count(),
            'total_companies' => (clone $active)->distinct()->count('company_name'),
            'total_categories' => \App\Models\Category::count(),
            'total_users' => \App\Models\User::where('role', 'user')->count(),
        ];
    }

    protected function applyFilters(Builder $query, array $filters, bool $admin = false): Builder
    {
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (!empty($filters['experience_level'])) {
            $query->where('experience_level', $filters['experience_level']);
        }

        if (!empty($filters['employment_type'])) {
            $query->where('employment_type', $filters['employment_type']);
        }

        if (!empty($filters['location'])) {
            $query->where('location', 'like', "%{$filters['location']}%");
        }

        if ($admin && !empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query;
    }
}