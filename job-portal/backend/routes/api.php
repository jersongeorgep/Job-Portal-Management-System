<?php

use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\JobController as AdminJobController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\JobController;
use App\Http\Controllers\User\ApplicationController as UserApplicationController;
use App\Http\Controllers\User\JobApplyController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/featured', [JobController::class, 'featured']);
Route::get('/jobs/{slug}', [JobController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/stats', [JobController::class, 'stats']);

/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'user'])->prefix('user')->group(function () {
    Route::get('/applications', [UserApplicationController::class, 'index']);
    Route::get('/applications/{id}', [UserApplicationController::class, 'show']);
});

Route::middleware(['auth:sanctum', 'user'])->post('/jobs/{job}/apply', [JobApplyController::class, 'apply']);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('jobs', AdminJobController::class);

    Route::get('/applications', [AdminApplicationController::class, 'index']);
    Route::get('/applications/{id}', [AdminApplicationController::class, 'show']);
    Route::patch('/applications/{id}/status', [AdminApplicationController::class, 'updateStatus']);
});