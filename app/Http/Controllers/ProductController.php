<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Http\Requests\ProductStoreRequest;
use App\Http\Requests\ProductUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // GET /api/farmer/products
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

            $products = Product::where('farm_id', $farm->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // POST /api/farmer/products
    public function store(ProductStoreRequest $request)
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

            $validated = $request->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                $validated['image'] = '/storage/' . $imagePath;
            }

            $data = array_merge($validated, [
                'farm_id' => $farm->id,
                'discount' => $validated['discount'] ?? 0,
                'stock' => $validated['stock'] ?? 0,
                'is_featured' => $validated['is_featured'] ?? false,
                'is_seasonal' => $validated['is_seasonal'] ?? false,
                'is_approved' => $farm->is_verified, // Auto-approve if farm is verified
                'is_active' => true,
            ]);

            $product = Product::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/farmer/products/{id}
    public function show($id)
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

            $product = Product::where('farm_id', $farm->id)->findOrFail($id);

            return response()->json([
                'success' => true,
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    // PUT/PATCH /api/farmer/products/{id}
    public function update(ProductUpdateRequest $request, $id)
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

            $product = Product::where('farm_id', $farm->id)->findOrFail($id);
            $validated = $request->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image && Storage::disk('public')->exists(str_replace('/storage/', '', $product->image))) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
                }

                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('products', $imageName, 'public');
                $validated['image'] = '/storage/' . $imagePath;
            }

            $product->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE /api/farmer/products/{id}
    public function destroy($id)
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

            $product = Product::where('farm_id', $farm->id)->findOrFail($id);

            // Delete image if exists
            if ($product->image && Storage::disk('public')->exists(str_replace('/storage/', '', $product->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $product->image));
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
                'deleted' => true
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/farmer/products/low-stock
    public function lowStock(Request $request)
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

            $threshold = $request->get('threshold', 10);
            
            $products = Product::where('farm_id', $farm->id)
                ->where('stock', '<=', $threshold)
                ->where('stock', '>', 0)
                ->orderBy('stock', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch low stock products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/farmer/dashboard/stats
    public function dashboardStats()
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

            $totalProducts = Product::where('farm_id', $farm->id)->count();
            $activeProducts = Product::where('farm_id', $farm->id)->where('is_active', true)->count();
            $featuredProducts = Product::where('farm_id', $farm->id)->where('is_featured', true)->count();
            $seasonalProducts = Product::where('farm_id', $farm->id)->where('is_seasonal', true)->count();
            $outOfStockProducts = Product::where('farm_id', $farm->id)->where('stock', 0)->count();
            $lowStockProducts = Product::where('farm_id', $farm->id)->where('stock', '>', 0)->where('stock', '<=', 5)->count();

            // Category distribution
            $categoryStats = Product::where('farm_id', $farm->id)
                ->select('category')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('category')
                ->orderByDesc('count')
                ->get();

            // Recent products
            $recentProducts = Product::where('farm_id', $farm->id)
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_products' => $totalProducts,
                    'active_products' => $activeProducts,
                    'featured_products' => $featuredProducts,
                    'seasonal_products' => $seasonalProducts,
                    'out_of_stock_products' => $outOfStockProducts,
                    'low_stock_products' => $lowStockProducts,
                    'category_stats' => $categoryStats,
                    'recent_products' => $recentProducts,
                ]
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
