<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->isUser()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. User access required.',
            ], 403);
        }

        return $next($request);
    }
}