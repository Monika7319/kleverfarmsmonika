<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    /**
     * Get all categories for the authenticated user's farm.
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
        
        // Get unique categories from products
        $categories = Product::where('farm_id', $farm->id)
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');
        
        return response()->json([
            'success' => true,
            'categories' => $categories,
        ]);
    }

    /**
     * Get products by category.
     *
     * @param  string  $category
     * @return \Illuminate\Http\JsonResponse
     */
    public function products($category)
    {
        $user = Auth::user();
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found for this user',
            ], 404);
        }
        
        $products = Product::where('farm_id', $farm->id)
            ->where('category', $category)
            ->orderBy('name')
            ->get();
        
        return response()->json([
            'success' => true,
            'category' => $category,
            'products' => $products,
        ]);
    }

    /**
     * Get category statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $user = Auth::user();
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found for this user',
            ], 404);
        }
        
        // Get category statistics
        $categoryStats = Product::where('farm_id', $farm->id)
            ->select('category')
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active')
            ->selectRaw('SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END) as out_of_stock')
            ->selectRaw('AVG(price) as average_price')
            ->groupBy('category')
            ->orderBy('category')
            ->get();
        
        return response()->json([
            'success' => true,
            'category_statistics' => $categoryStats,
        ]);
    }
}
