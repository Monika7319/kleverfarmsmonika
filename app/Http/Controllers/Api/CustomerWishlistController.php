<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WishlistItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CustomerWishlistController extends Controller
{
    public function index(Request $request)
    {
        try {
            $customer = $request->user();

            $wishlistItems = WishlistItem::where('customer_id', $customer->id)
                ->with(['product' => function($query) {
                    $query->with('farm');
                }])
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'wishlist' => $wishlistItems
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $customer = $request->user();

            // Check if already in wishlist
            $existingItem = WishlistItem::where('customer_id', $customer->id)
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product already in wishlist'
                ], 409);
            }

            // Add to wishlist
            $wishlistItem = WishlistItem::create([
                'customer_id' => $customer->id,
                'product_id' => $request->product_id,
            ]);

            $wishlistItem->load(['product' => function($query) {
                $query->with('farm');
            }]);

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist',
                'wishlist_item' => $wishlistItem
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add to wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $productId)
    {
        try {
            $customer = $request->user();

            $wishlistItem = WishlistItem::where('customer_id', $customer->id)
                ->where('product_id', $productId)
                ->first();

            if (!$wishlistItem) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found in wishlist'
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove from wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
