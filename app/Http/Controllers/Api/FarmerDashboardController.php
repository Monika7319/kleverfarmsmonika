<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;

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
                'farm' => $farm,
                'user' => $user
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

            $currentMonth = Carbon::now()->startOfMonth();
            $lastMonth = Carbon::now()->subMonth()->startOfMonth();

            // Product stats
            $totalProducts = Product::where('farm_id', $farm->id)->count();
            $newProductsThisMonth = Product::where('farm_id', $farm->id)
                ->where('created_at', '>=', $currentMonth)
                ->count();
            $lowStockProducts = Product::where('farm_id', $farm->id)
                ->where('stock', '>', 0)
                ->where('stock', '<=', 10)
                ->count();
            $outOfStockProducts = Product::where('farm_id', $farm->id)
                ->where('stock', 0)
                ->count();

            // Order stats (if orders table exists)
            $totalOrders = 0;
            $pendingOrders = 0;
            $totalRevenue = 0;
            $newCustomersThisMonth = 0;
            $totalCustomers = 0;

            // Mock data for demonstration
            $stats = [
                'totalRevenue' => 45231.89,
                'productCount' => $totalProducts,
                'newProductsThisMonth' => $newProductsThisMonth,
                'ordersCount' => 156,
                'pendingOrders' => 8,
                'customersCount' => 89,
                'newCustomersThisMonth' => 12,
                'lowStockProducts' => $lowStockProducts,
                'outOfStockProducts' => $outOfStockProducts,
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
