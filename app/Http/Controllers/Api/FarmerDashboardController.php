<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;

class FarmerDashboardController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $farm = $user->farm;

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farm not found for this user'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => $user,
                'farm' => $farm
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function stats()
    {
        try {
            $user = Auth::user();
            $farm = $user->farm;

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Farm not found for this user'
                ], 404);
            }

            // Product stats
            $totalProducts = Product::where('farm_id', $farm->id)->count();
            $approvedProducts = Product::where('farm_id', $farm->id)->approved()->count();
            $pendingProducts = Product::where('farm_id', $farm->id)->pending()->count();
            $lowStockProducts = Product::where('farm_id', $farm->id)->lowStock()->count();
            $outOfStockProducts = Product::where('farm_id', $farm->id)->outOfStock()->count();

            // Calculate total stock value
            $totalStockValue = Product::where('farm_id', $farm->id)
                ->selectRaw('SUM(price * stock) as total_value')
                ->value('total_value') ?? 0;

            $stats = [
                'total_products' => $totalProducts,
                'approved_products' => $approvedProducts,
                'pending_products' => $pendingProducts,
                'low_stock_products' => $lowStockProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'total_stock_value' => (float) $totalStockValue,
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
