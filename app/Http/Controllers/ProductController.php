<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Apply auth middleware in constructor
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // GET /api/farmer/products
    public function index()
    {
        try {
            $farm = Auth::user();  // assumes authenticated farmer
            
            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $products = $farm->products()
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
    public function store(Request $request)
    {
        try {
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $validator = Validator::make($request->all(), [
                'name'        => 'required|string|max:255',
                'price'       => 'required|numeric|min:0',
                'unit'        => 'required|string|max:50',
                'category'    => 'required|string|max:100',
                'description' => 'nullable|string',
                'discount'    => 'nullable|integer|min:0|max:100',
                'stock'       => 'nullable|integer|min:0',
                'featured'    => 'nullable|boolean',
                'seasonal'    => 'nullable|boolean',
                'image'       => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $validated = $validator->validated();

            $data = array_merge($validated, [
                'discount' => $validated['discount'] ?? 0,
                'stock'    => $validated['stock'] ?? 0,
                'featured' => $validated['featured'] ?? false,
                'seasonal' => $validated['seasonal'] ?? false,
                'image'    => $validated['image'] ?? null,
                'farm_id'  => $farm->id,
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
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $product = $farm->products()->findOrFail($id);

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
    public function update(Request $request, $id)
    {
        try {
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $product = $farm->products()->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name'        => 'sometimes|required|string|max:255',
                'price'       => 'sometimes|required|numeric|min:0',
                'unit'        => 'sometimes|required|string|max:50',
                'category'    => 'sometimes|required|string|max:100',
                'description' => 'nullable|string',
                'discount'    => 'nullable|integer|min:0|max:100',
                'stock'       => 'nullable|integer|min:0',
                'featured'    => 'nullable|boolean',
                'seasonal'    => 'nullable|boolean',
                'image'       => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $product->update($validator->validated());

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
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $product = $farm->products()->findOrFail($id);

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
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $threshold = $request->get('threshold', 10);
            
            $products = $farm->products()
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

    // GET /api/farmer/products/categories
    public function categories()
    {
        try {
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $categories = $farm->products()
                ->select('category')
                ->distinct()
                ->orderBy('category')
                ->pluck('category');

            return response()->json([
                'success' => true,
                'categories' => $categories
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // GET /api/farmer/dashboard/stats
    public function dashboardStats()
    {
        try {
            $farm = Auth::user();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated'
                ], 401);
            }

            $totalProducts = $farm->products()->count();
            $featuredProducts = $farm->products()->where('featured', true)->count();
            $seasonalProducts = $farm->products()->where('seasonal', true)->count();
            $outOfStockProducts = $farm->products()->where('stock', 0)->count();
            $lowStockProducts = $farm->products()->where('stock', '>', 0)->where('stock', '<=', 5)->count();

            // Category distribution
            $categoryStats = $farm->products()
                ->select('category')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('category')
                ->orderByDesc('count')
                ->get();

            // Recent products
            $recentProducts = $farm->products()
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_products' => $totalProducts,
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
