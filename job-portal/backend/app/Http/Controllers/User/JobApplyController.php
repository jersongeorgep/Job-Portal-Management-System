<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Application\StoreApplicationRequest;
use App\Models\Job;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;

class JobApplyController extends Controller
{
    public function __construct(protected ApplicationService $appService) {}

    public function apply(StoreApplicationRequest $request, Job $job): JsonResponse
    {
        if ($job->status !== 'published') {
            return response()->json([
                'success' => false,
                'message' => 'This job is not available for applications.',
            ], 422);
        }

        $this->appService->apply(
            $job,
            $request->safe()->except('resume'),
            $request->file('resume')
        );

        return response()->json([
            'success' => true,
            'message' => 'Application submitted successfully',
        ], 201);
    }
}