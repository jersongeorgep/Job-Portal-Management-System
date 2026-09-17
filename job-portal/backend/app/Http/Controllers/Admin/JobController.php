<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Job\StoreJobRequest;
use App\Http\Requests\Job\UpdateJobRequest;
use App\Http\Resources\JobResource;
use App\Models\Job;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function __construct(protected JobService $jobService) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search', 'category', 'experience_level', 'employment_type', 'location', 'status',
        ]);

        $perPage = min((int) $request->get('per_page', 15), 50);
        $jobs = $this->jobService->getAdminJobs($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => JobResource::collection($jobs),
            'meta' => [
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage(),
                'total' => $jobs->total(),
            ],
        ]);
    }

    public function store(StoreJobRequest $request): JsonResponse
    {
        $job = $this->jobService->create(
            array_merge($request->validated(), ['created_by' => auth()->id()])
        );

        return response()->json([
            'success' => true,
            'message' => 'Job created successfully',
            'data' => new JobResource($job->load('category')),
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $job = $this->jobService->findById($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new JobResource($job),
        ]);
    }

    public function update(UpdateJobRequest $request, int $id): JsonResponse
    {
        $job = $this->jobService->findById($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found',
            ], 404);
        }

        $job = $this->jobService->update($job, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Job updated successfully',
            'data' => new JobResource($job->load('category')),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $job = $this->jobService->findById($id);

        if (!$job) {
            return response()->json([
                'success' => false,
                'message' => 'Job not found',
            ], 404);
        }

        $this->jobService->delete($job);

        return response()->json([
            'success' => true,
            'message' => 'Job deleted successfully',
        ]);
    }
}