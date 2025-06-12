<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WishlistItem;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlistItems = WishlistItem::where('user_id', $request->user()->id)
            ->with('product')
            ->get();

        return response()->json([
            'success' => true,
            'wishlist' => $wishlistItems
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $exists = WishlistItem::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Product already in wishlist'
            ], 409);
        }

        $wishlistItem = WishlistItem::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist',
            'wishlist_item' => $wishlistItem->load('product')
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $wishlistItem = WishlistItem::where('user_id', $request->user()->id)
            ->where('product_id', $id)
            ->first();

        if (!$wishlistItem) {
            return response()->json([
                'success' => false,
                'message' => 'Wishlist item not found'
            ], 404);
        }

        $wishlistItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from wishlist'
        ], 200);
    }
}
