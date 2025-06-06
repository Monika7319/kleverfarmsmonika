<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class FarmerProductController extends Controller
{
    /**
     * Get all products for authenticated farmer
     * GET /api/farmer/products
     */
    public function index(Request $request)
    {
        try {
            $farm = $request->user();

            $query = Product::where('farm_id', $farm->id);

            // Apply filters
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            if ($request->has('status')) {
                switch ($request->status) {
                    case 'approved':
                        $query->approved();
                        break;
                    case 'pending':
                        $query->pending();
                        break;
                    case 'featured':
                        $query->featured();
                        break;
                    case 'seasonal':
                        $query->seasonal();
                        break;
                    case 'low-stock':
                        $query->lowStock();
                        break;
                    case 'out-of-stock':
                        $query->outOfStock();
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

            // Get products
            $products = $query->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Fetch products error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new product
     * POST /api/farmer/products
     */
    public function store(Request $request)
    {
        try {
            $farm = $request->user();

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
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
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
            $data['is_approved'] = $farm->is_verified ? true : false; // Auto-approve if farm is verified
            $data['is_active'] = true;

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $farmSlug = str_replace(' ', '_', strtolower($farm->farmName));
                $filename = $farmSlug . '_product_' . time() . '.' . $image->getClientOriginalExtension();
                
                // Store in public/products/images directory
                $image->move(public_path('products/images'), $filename);
                $data['image'] = $filename;
            }

            $product = Product::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Create product error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single product
     * GET /api/farmer/products/{id}
     */
    public function show(Request $request, $id)
    {
        try {
            $farm = $request->user();
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

    /**
     * Update product
     * PUT /api/farmer/products/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $farm = $request->user();
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
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image) {
                    $oldImagePath = public_path('products/images/' . $product->image);
                    if (file_exists($oldImagePath)) {
                        @unlink($oldImagePath);
                    }
                }

                $image = $request->file('image');
                $farmSlug = str_replace(' ', '_', strtolower($farm->farmName));
                $filename = $farmSlug . '_product_' . time() . '.' . $image->getClientOriginalExtension();
                
                $image->move(public_path('products/images'), $filename);
                $data['image'] = $filename;
            }

            $product->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product->fresh()
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Update product error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete product
     * DELETE /api/farmer/products/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $farm = $request->user();
            $product = Product::where('farm_id', $farm->id)->findOrFail($id);

            // Delete image if exists
            if ($product->image) {
                $imagePath = public_path('products/images/' . $product->image);
                if (file_exists($imagePath)) {
                    @unlink($imagePath);
                }
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Delete product error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics
     * GET /api/farmer/dashboard/stats
     */
    public function dashboardStats(Request $request)
    {
        try {
            $farm = $request->user();

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
            \Log::error('Dashboard stats error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get low stock products
     * GET /api/farmer/products/low-stock
     */
    public function lowStock(Request $request)
    {
        try {
            $farm = $request->user();
            $threshold = $request->get('threshold', 10);
            
            $products = Product::where('farm_id', $farm->id)
                ->lowStock($threshold)
                ->orderBy('stock', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Low stock products error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch low stock products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
