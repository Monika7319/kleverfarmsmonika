<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Harvest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class CultivatorHarvestController extends Controller
{
    /**
     * Get all harvests for authenticated cultivator
     * GET /api/farmer/products
     */
    public function index(Request $request)
    {
        try {
            $cultivator = $request->user();
            
            $query = Harvest::where('cultivator_id', $cultivator->id);

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

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            Log::error('Fetch harvests error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new harvest/product
     * POST /api/farmer/products
     */
    public function store(Request $request)
    {
        try {
            $cultivator = $request->user();

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
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $data = [
                'cultivator_id' => $cultivator->id,
                'name' => $request->name,
                'category' => $request->category,
                'price' => $request->price,
                'unit' => $request->unit,
                'discount' => $request->discount ?? 0,
                'stock' => $request->stock ?? 0,
                'description' => $request->description,
                'is_featured' => filter_var($request->is_featured ?? false, FILTER_VALIDATE_BOOLEAN),
                'is_seasonal' => filter_var($request->is_seasonal ?? false, FILTER_VALIDATE_BOOLEAN),
                'is_approved' => $cultivator->is_verified === 1 ? true : false, // Auto-approve if cultivator is verified
                'is_active' => true,
            ];

            // Handle image upload
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $farmSlug = str_replace(' ', '_', strtolower($cultivator->farmName ?? 'farm'));
                $filename = $farmSlug . '_harvest_' . time() . '.' . $image->getClientOriginalExtension();
                
                // Create directory if it doesn't exist
                $uploadPath = public_path('harvests/images');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                
                // Store in public/harvests/images directory
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $harvest = Harvest::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $harvest,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Create harvest error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single harvest
     * GET /api/farmer/products/{id}
     */
    public function show(Request $request, $id)
    {
        try {
            $cultivator = $request->user();
            $harvest = Harvest::where('id', $id)->where('cultivator_id', $cultivator->id)->first();

            if (!$harvest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'product' => $harvest,
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
     * Update harvest
     * PUT /api/farmer/products/{id}
     */
    public function update(Request $request, $id)
    {
        try {
            $cultivator = $request->user();
            $harvest = Harvest::where('id', $id)->where('cultivator_id', $cultivator->id)->first();

            if (!$harvest) {
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
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
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
                if ($harvest->image) {
                    $oldImagePath = public_path('harvests/images/' . $harvest->image);
                    if (file_exists($oldImagePath)) {
                        @unlink($oldImagePath);
                    }
                }

                $image = $request->file('image');
                $farmSlug = str_replace(' ', '_', strtolower($cultivator->farmName ?? 'farm'));
                $filename = $farmSlug . '_harvest_' . time() . '.' . $image->getClientOriginalExtension();
                
                $uploadPath = public_path('harvests/images');
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0755, true);
                }
                
                $image->move($uploadPath, $filename);
                $data['image'] = $filename;
            }

            $harvest->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $harvest->fresh(),
            ]);

        } catch (\Exception $e) {
            Log::error('Update harvest error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete harvest
     * DELETE /api/farmer/products/{id}
     */
    public function destroy(Request $request, $id)
    {
        try {
            $cultivator = $request->user();
            $harvest = Harvest::where('id', $id)->where('cultivator_id', $cultivator->id)->first();

            if (!$harvest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            // Delete image if exists
            if ($harvest->image) {
                $imagePath = public_path('harvests/images/' . $harvest->image);
                if (file_exists($imagePath)) {
                    @unlink($imagePath);
                }
            }

            $harvest->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete harvest error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get low stock harvests
     * GET /api/farmer/products/low-stock
     */
    public function lowStock(Request $request)
    {
        try {
            $cultivator = $request->user();
            $threshold = $request->get('threshold', 10);
            
            $products = Harvest::where('cultivator_id', $cultivator->id)
                ->where('stock', '>', 0)
                ->where('stock', '<=', $threshold)
                ->orderBy('stock', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'products' => $products
            ]);

        } catch (\Exception $e) {
            Log::error('Low stock harvests error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch low stock products',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
