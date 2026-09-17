<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ApplicationResource;
use App\Models\JobApplication;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(protected ApplicationService $appService) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'job_id']);
        $perPage = min((int) $request->get('per_page', 15), 50);
        $applications = $this->appService->getAdminApplications($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => ApplicationResource::collection($applications),
            'meta' => [
                'current_page' => $applications->currentPage(),
                'last_page' => $applications->lastPage(),
                'per_page' => $applications->perPage(),
                'total' => $applications->total(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $application = $this->appService->findById($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new ApplicationResource($application),
        ]);
    }

    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'in:pending,reviewed,shortlisted,rejected'],
        ]);

        $application = $this->appService->findById($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Application not found',
            ], 404);
        }

        $application = $this->appService->updateStatus($application, $request->status);

        return response()->json([
            'success' => true,
            'message' => 'Application status updated successfully',
            'data' => new ApplicationResource($application),
        ]);
    }
}