<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\JobService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(protected JobService $jobService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->jobService->getDashboardStats(),
        ]);
    }
}