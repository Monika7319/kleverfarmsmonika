<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

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

            // Apply filters if provided
            if ($request->has('category') && $request->category !== 'all') {
                $query->where('category', $request->category);
            }

            if ($request->has('status')) {
                switch ($request->status) {
                    case 'approved':
                        $query->where('is_approved', true);
                        break;
                    case 'pending':
                        $query->where('is_approved', false);
                        break;
                    case 'featured':
                        $query->where('is_featured', true);
                        break;
                    case 'seasonal':
                        $query->where('is_seasonal', true);
                        break;
                    case 'low-stock':
                        $query->where('stock', '<=', 10)->where('stock', '>', 0);
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

            $products = $query->get();

            // Add full image URLs
            $products->transform(function ($product) {
                if ($product->image) {
                    $product->image_url = asset('products/images/' . $product->image);
                } else {
                    $product->image_url = null;
                }
                return $product;
            });

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            Log::error('Fetch products error: ' . $e->getMessage());
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
                'discount' => 'nullable|numeric|min:0|max:100',
                'stock' => 'nullable|integer|min:0',
                'description' => 'nullable|string',
                'is_featured' => 'nullable|boolean',
                'is_seasonal' => 'nullable|boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB max
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = [
                'farm_id' => $farm->id,
                'name' => $request->name,
                'category' => $request->category,
                'price' => $request->price,
                'unit' => $request->unit,
                'discount' => $request->discount ?? 0,
                'stock' => $request->stock ?? 0,
                'description' => $request->description,
                'is_featured' => filter_var($request->is_featured ?? false, FILTER_VALIDATE_BOOLEAN),
                'is_seasonal' => filter_var($request->is_seasonal ?? false, FILTER_VALIDATE_BOOLEAN),
                'is_approved' => $farm->is_verified ? true : false, // Auto-approve if farm is verified
                'is_active' => true,
            ];

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $farmSlug = str_replace(' ', '_', strtolower($farm->farmName ?? 'farm'));
                $filename = $farmSlug . '_product_' . time() . '.' . $image->getClientOriginalExtension();
                
                // Create directory if it doesn't exist
                $uploadPath = public_path('products/images');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                
                // Store in public/products/images directory
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $product = Product::create($data);

            // Add image URL to response
            if ($product->image) {
                $product->image_url = asset('products/images/' . $product->image);
            }

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create product error: ' . $e->getMessage());
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
            $product = Product::where('id', $id)->where('farm_id', $farm->id)->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            // Add image URL
            if ($product->image) {
                $product->image_url = asset('products/images/' . $product->image);
            }

            return response()->json([
                'success' => true,
                'product' => $product,
            ]);
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
            $product = Product::where('id', $id)->where('farm_id', $farm->id)->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:100',
                'price' => 'required|numeric|min:0',
                'unit' => 'required|string|max:50',
                'discount' => 'nullable|numeric|min:0|max:100',
                'stock' => 'nullable|integer|min:0',
                'description' => 'nullable|string',
                'is_featured' => 'nullable|boolean',
                'is_seasonal' => 'nullable|boolean',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
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
                $farmSlug = str_replace(' ', '_', strtolower($farm->farmName ?? 'farm'));
                $filename = $farmSlug . '_product_' . time() . '.' . $image->getClientOriginalExtension();
                
                $uploadPath = public_path('products/images');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $product->update($data);
            $product = $product->fresh();

            // Add image URL
            if ($product->image) {
                $product->image_url = asset('products/images/' . $product->image);
            }

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product,
            ]);

        } catch (\Exception $e) {
            Log::error('Update product error: ' . $e->getMessage());
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
            $product = Product::where('id', $id)->where('farm_id', $farm->id)->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

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
            ]);

        } catch (\Exception $e) {
            Log::error('Delete product error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
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
                ->where('stock', '>', 0)
                ->where('stock', '<=', $threshold)
                ->orderBy('stock', 'asc')
                ->get();

            // Add image URLs
            $products->transform(function ($product) {
                if ($product->image) {
                    $product->image_url = asset('products/images/' . $product->image);
                }
                return $product;
            });

            return response()->json([
                'success' => true,
                'products' => $products
            ]);

        } catch (\Exception $e) {
            Log::error('Low stock products error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch low stock products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
