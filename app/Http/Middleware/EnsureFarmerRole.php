<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureFarmerRole
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isFarmer()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Farmer role required.'
            ], 403);
        }

        return $next($request);
    }
}
