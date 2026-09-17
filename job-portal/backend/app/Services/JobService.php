<?php

namespace App\Services;

use App\Models\Job;
use App\Repositories\JobRepository;
use Illuminate\Support\Str;

class JobService
{
    public function __construct(protected JobRepository $repo) {}

    public function getPublicJobs(array $filters = [], int $perPage = 10)
    {
        return $this->repo->getPublicJobs($filters, $perPage);
    }

    public function getFeaturedJobs(int $limit = 6)
    {
        return $this->repo->getFeaturedJobs($limit);
    }

    public function getAdminJobs(array $filters = [], int $perPage = 15)
    {
        return $this->repo->getAdminJobs($filters, $perPage);
    }

    public function findBySlug(string $slug): ?Job
    {
        return $this->repo->findBySlug($slug);
    }

    public function findById(int $id): ?Job
    {
        return $this->repo->findById($id);
    }

    public function create(array $data): Job
    {
        $data['slug'] = $this->generateSlug($data['title']);

        return $this->repo->create($data);
    }

    public function update(Job $job, array $data): Job
    {
        if (isset($data['title']) && $data['title'] !== $job->title) {
            $data['slug'] = $this->generateSlug($data['title'], $job->id);
        }

        return $this->repo->update($job, $data);
    }

    public function delete(Job $job): bool
    {
        return $this->repo->delete($job);
    }

    public function getPublicStats(): array
    {
        return $this->repo->getPublicStats();
    }

    public function getDashboardStats(): array
    {
        $jobStats = $this->repo->getDashboardStats();
        $appRepo = app()->make(\App\Repositories\ApplicationRepository::class);
        $appStats = $appRepo->getDashboardStats();

        return array_merge($jobStats, $appStats, [
            'total_users' => \App\Models\User::count(),
        ]);
    }

    protected function generateSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;

        while (Job::where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}