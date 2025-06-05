<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard data for the authenticated user's farm.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found for this user',
            ], 404);
        }
        
        // Get product counts
        $totalProducts = Product::where('farm_id', $farm->id)->count();
        $activeProducts = Product::where('farm_id', $farm->id)->where('is_active', true)->count();
        $featuredProducts = Product::where('farm_id', $farm->id)->where('is_featured', true)->count();
        $seasonalProducts = Product::where('farm_id', $farm->id)->where('is_seasonal', true)->count();
        
        // Get stock status
        $outOfStockProducts = Product::where('farm_id', $farm->id)->where('stock', 0)->count();
        $lowStockProducts = Product::where('farm_id', $farm->id)
            ->where('stock', '>', 0)
            ->where('stock', '<=', 5)
            ->count();
        
        // Get category distribution
        $categoryDistribution = Product::where('farm_id', $farm->id)
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();
        
        // Get recent products
        $recentProducts = Product::where('farm_id', $farm->id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();
        
        // Get low stock products
        $lowStockProductsList = Product::where('farm_id', $farm->id)
            ->where('stock', '>', 0)
            ->where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(5)
            ->get();
        
        return response()->json([
            'success' => true,
            'dashboard' => [
                'product_counts' => [
                    'total' => $totalProducts,
                    'active' => $activeProducts,
                    'featured' => $featuredProducts,
                    'seasonal' => $seasonalProducts,
                ],
                'stock_status' => [
                    'out_of_stock' => $outOfStockProducts,
                    'low_stock' => $lowStockProducts,
                ],
                'category_distribution' => $categoryDistribution,
                'recent_products' => $recentProducts,
                'low_stock_products' => $lowStockProductsList,
            ],
        ]);
    }
}
