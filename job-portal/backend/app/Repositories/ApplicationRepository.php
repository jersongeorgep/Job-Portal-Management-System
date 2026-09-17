<?php

namespace App\Repositories;

use App\Models\JobApplication;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class ApplicationRepository
{
    public function __construct(protected JobApplication $model) {}

    public function getUserApplications(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->newQuery()
            ->with('job.category', 'user')
            ->where('user_id', $userId)
            ->latest('applied_at')
            ->paginate($perPage);
    }

    public function getAdminApplications(array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = $this->model->newQuery()->with('job.category', 'user');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['job_id'])) {
            $query->where('job_id', $filters['job_id']);
        }

        return $query->latest('applied_at')->paginate($perPage);
    }

    public function findById(int $id): ?JobApplication
    {
        return $this->model->newQuery()->with('job.category', 'user')->find($id);
    }

    public function create(array $data): JobApplication
    {
        return $this->model->create($data);
    }

    public function update(Model $application, array $data): JobApplication
    {
        $application->update($data);

        return $application->fresh()->load('job.category', 'user');
    }

    public function hasUserApplied(int $jobId, int $userId): bool
    {
        return $this->model->where('job_id', $jobId)->where('user_id', $userId)->exists();
    }

    public function getDashboardStats(): array
    {
        $model = $this->model->newQuery();

        return [
            'total_applications' => $model->count(),
            'pending_applications' => (clone $model)->where('status', 'pending')->count(),
            'shortlisted_applications' => (clone $model)->where('status', 'shortlisted')->count(),
            'reviewed_applications' => (clone $model)->where('status', 'reviewed')->count(),
            'rejected_applications' => (clone $model)->where('status', 'rejected')->count(),
        ];
    }
}