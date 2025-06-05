<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFarmerHasFarm
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user->isFarmer()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Only farmers can access this resource.',
            ], 403);
        }
        
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'No farm associated with this account. Please contact support.',
            ], 403);
        }
        
        if (!$farm->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your farm has been deactivated. Please contact support.',
            ], 403);
        }
        
        return $next($request);
    }
}
