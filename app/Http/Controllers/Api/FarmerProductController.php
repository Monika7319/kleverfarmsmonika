<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FarmerProductController extends Controller
{
    public function index(Request $request)
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

            $query = Product::where('farm_id', $farm->id);

            // Apply filters
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            if ($request->has('status')) {
                switch ($request->status) {
                    case 'featured':
                        $query->where('is_featured', true);
                        break;
                    case 'seasonal':
                        $query->where('is_seasonal', true);
                        break;
                    case 'low-stock':
                        $query->where('stock', '>', 0)->where('stock', '<=', 10);
                        break;
                    case 'out-of-stock':
                        $query->where('stock', 0);
                        break;
                }
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $products = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'products' => $products->items(),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
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

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'price' => 'required|numeric|min:0',
                'unit' => 'required|string|max:50',
                'discount' => 'nullable|integer|min:0|max:100',
                'description' => 'nullable|string',
                'stock' => 'nullable|integer|min:0',
                'is_featured' => 'boolean',
                'is_seasonal' => 'boolean',
                'image' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['farm_id'] = $farm->id;
            $data['discount'] = $data['discount'] ?? 0;
            $data['stock'] = $data['stock'] ?? 0;
            $data['is_featured'] = $data['is_featured'] ?? false;
            $data['is_seasonal'] = $data['is_seasonal'] ?? false;
            $data['is_approved'] = $farm->is_verified ?? true;
            $data['is_active'] = true;

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

    public function update(Request $request, $id)
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

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'price' => 'required|numeric|min:0',
                'unit' => 'required|string|max:50',
                'discount' => 'nullable|integer|min:0|max:100',
                'description' => 'nullable|string',
                'stock' => 'nullable|integer|min:0',
                'is_featured' => 'boolean',
                'is_seasonal' => 'boolean',
                'image' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $product->update($data);

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
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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
                ->where('stock', '>', 0)
                ->where('stock', '<=', $threshold)
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

    public function topSelling(Request $request)
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

            // Mock data for top selling products
            $products = [
                [
                    'id' => 1,
                    'name' => 'Organic Milk',
                    'sales_count' => 45,
                    'revenue' => 2250.00
                ],
                [
                    'id' => 2,
                    'name' => 'Fresh Vegetables',
                    'sales_count' => 32,
                    'revenue' => 1600.00
                ],
                [
                    'id' => 3,
                    'name' => 'Farm Eggs',
                    'sales_count' => 28,
                    'revenue' => 840.00
                ]
            ];

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch top selling products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
