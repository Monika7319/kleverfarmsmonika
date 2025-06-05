<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FarmerDashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            // If user is not authenticated, return 401 instead of a 500
            $farm = $request->user();
            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated.'
                ], 401);
            }

            // Get basic farm info
            $farmData = [
                'id'        => $farm->id,
                'farmName'  => $farm->farmName,
                'ownerName' => $farm->ownerName,
                'email'     => $farm->email,
                'phone'     => $farm->phone,
                'city'      => $farm->city,
                'state'     => $farm->state,
                'is_verified' => $farm->is_verified,
                'is_active'   => $farm->is_active,
            ];

            // Get product statistics
            $totalProducts = $farm->products()->count();
            $featuredProducts = $farm->products()->where('featured', true)->count();
            $seasonalProducts = $farm->products()->where('seasonal', true)->count();
            $outOfStockProducts = $farm->products()->where('stock', 0)->count();
            $lowStockProducts = $farm->products()->where('stock', '>', 0)->where('stock', '<=', 5)->count();

            // Get recent products
            $recentProducts = $farm->products()
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            // Get category distribution
            $categoryStats = $farm->products()
                ->select('category')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('category')
                ->orderByDesc('count')
                ->get();

            return response()->json([
                'success' => true,
                'farm' => $farmData,
                'dashboard' => [
                    'product_counts' => [
                        'total' => $totalProducts,
                        'featured' => $featuredProducts,
                        'seasonal' => $seasonalProducts,
                        'out_of_stock' => $outOfStockProducts,
                        'low_stock' => $lowStockProducts,
                    ],
                    'recent_products' => $recentProducts,
                    'category_stats' => $categoryStats,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
