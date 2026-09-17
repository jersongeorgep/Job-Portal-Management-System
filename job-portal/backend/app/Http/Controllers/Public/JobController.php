<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function __construct(protected JobService $jobService) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'search', 'category', 'experience_level', 'employment_type', 'location',
        ]);

        $perPage = min((int) $request->get('per_page', 10), 50);
        $jobs = $this->jobService->getPublicJobs($filters, $perPage);

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

    public function featured(): JsonResponse
    {
        $jobs = $this->jobService->getFeaturedJobs();

        return response()->json([
            'success' => true,
            'data' => JobResource::collection($jobs),
        ]);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->jobService->getPublicStats(),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $job = $this->jobService->findBySlug($slug);

        if (!$job || $job->status !== 'published') {
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
}