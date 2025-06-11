<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Farm;
use App\Models\Product;

class FarmerDashboardController extends Controller
{
    /**
     * GET /api/farmer/dashboard
     * Returns the authenticated farm's info with dashboard stats.
     * Protected by sanctum.
     */
    public function index(Request $request)
    {
        try {
            /** @var Farm $farm */
            $farm = $request->user(); // Sanctum-authenticated farm

            // Get product statistics
            $totalProducts = Product::where('farm_id', $farm->id)->count();
            $approvedProducts = Product::where('farm_id', $farm->id)->where('is_approved', true)->count();
            $pendingProducts = Product::where('farm_id', $farm->id)->where('is_approved', false)->count();
            $lowStockProducts = Product::where('farm_id', $farm->id)->where('stock', '<=', 10)->where('stock', '>', 0)->count();
            $outOfStockProducts = Product::where('farm_id', $farm->id)->where('stock', 0)->count();

            // Calculate total stock value
            $totalStockValue = Product::where('farm_id', $farm->id)
                ->selectRaw('SUM(price * stock) as total_value')
                ->value('total_value') ?? 0;

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $farm->id,
                    'name' => $farm->ownerName,
                    'email' => $farm->email,
                    'phone' => $farm->phone,
                ],
                'farm' => [
                    'id' => $farm->id,
                    'name' => $farm->farmName,
                    'address' => $farm->address,
                    'city' => $farm->city,
                    'state' => $farm->state,
                    'is_verified' => $farm->is_verified,
                ],
                'stats' => [
                    'total_products' => $totalProducts,
                    'approved_products' => $approvedProducts,
                    'pending_products' => $pendingProducts,
                    'low_stock_products' => $lowStockProducts,
                    'out_of_stock_products' => $outOfStockProducts,
                    'total_stock_value' => (float) $totalStockValue,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
