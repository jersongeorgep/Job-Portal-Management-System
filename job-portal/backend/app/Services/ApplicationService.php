<?php

namespace App\Services;

use App\Models\Job;
use App\Models\JobApplication;
use App\Repositories\ApplicationRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ApplicationService
{
    public function __construct(protected ApplicationRepository $repo) {}

    public function apply(Job $job, array $data, UploadedFile $resume = null): JobApplication
    {
        if ($this->repo->hasUserApplied($job->id, auth()->id())) {
            throw new HttpException(409, 'You have already applied for this job.');
        }

        if ($job->application_deadline && $job->application_deadline->isPast()) {
            throw ValidationException::withMessages([
                'job' => ['Applications for this job are closed.'],
            ]);
        }

        if ($resume) {
            $data['resume'] = $resume->store('resumes', 'public');
        }

        $data['user_id'] = auth()->id();
        $data['job_id'] = $job->id;
        $data['applied_at'] = now();

        return $this->repo->create($data);
    }

    public function getUserApplications(int $userId, int $perPage = 15)
    {
        return $this->repo->getUserApplications($userId, $perPage);
    }

    public function getAdminApplications(array $filters = [], int $perPage = 15)
    {
        return $this->repo->getAdminApplications($filters, $perPage);
    }

    public function findById(int $id): ?JobApplication
    {
        return $this->repo->findById($id);
    }

    public function updateStatus(JobApplication $application, string $status): JobApplication
    {
        return $this->repo->update($application, ['status' => $status]);
    }
}