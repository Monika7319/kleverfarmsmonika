<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FarmController extends Controller
{
    /**
     * Get the authenticated user's farm.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $user = Auth::user();
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found for this user',
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'farm' => $farm,
        ]);
    }

    /**
     * Update the authenticated user's farm.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found for this user',
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'address' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:100',
            'state' => 'sometimes|required|string|max:100',
            'zip_code' => 'sometimes|required|string|max:20',
            'phone' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'website' => 'nullable|url|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        // Update farm fields
        if ($request->has('name')) $farm->name = $request->name;
        if ($request->has('description')) $farm->description = $request->description;
        if ($request->has('address')) $farm->address = $request->address;
        if ($request->has('city')) $farm->city = $request->city;
        if ($request->has('state')) $farm->state = $request->state;
        if ($request->has('zip_code')) $farm->zip_code = $request->zip_code;
        if ($request->has('phone')) $farm->phone = $request->phone;
        if ($request->has('email')) $farm->email = $request->email;
        if ($request->has('website')) $farm->website = $request->website;
        
        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($farm->logo && Storage::disk('public')->exists(str_replace('/storage/', '', $farm->logo))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $farm->logo));
            }
            
            $logo = $request->file('logo');
            $logoName = time() . '_logo.' . $logo->getClientOriginalExtension();
            $logoPath = $logo->storeAs('farms', $logoName, 'public');
            $farm->logo = '/storage/' . $logoPath;
        }
        
        // Handle banner upload
        if ($request->hasFile('banner')) {
            // Delete old banner if exists
            if ($farm->banner && Storage::disk('public')->exists(str_replace('/storage/', '', $farm->banner))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $farm->banner));
            }
            
            $banner = $request->file('banner');
            $bannerName = time() . '_banner.' . $banner->getClientOriginalExtension();
            $bannerPath = $banner->storeAs('farms', $bannerName, 'public');
            $farm->banner = '/storage/' . $bannerPath;
        }
        
        $farm->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Farm updated successfully',
            'farm' => $farm,
        ]);
    }

    /**
     * Get farm statistics.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics()
    {
        $user = Auth::user();
        $farm = $user->farm;
        
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found for this user',
            ], 404);
        }
        
        // Get product statistics
        $totalProducts = $farm->products()->count();
        $activeProducts = $farm->products()->where('is_active', true)->count();
        $featuredProducts = $farm->products()->where('is_featured', true)->count();
        $seasonalProducts = $farm->products()->where('is_seasonal', true)->count();
        $outOfStockProducts = $farm->products()->where('stock', 0)->count();
        $lowStockProducts = $farm->products()->where('stock', '>', 0)->where('stock', '<=', 5)->count();
        
        // Get category statistics
        $categories = $farm->products()
            ->select('category')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();
        
        return response()->json([
            'success' => true,
            'statistics' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'featured_products' => $featuredProducts,
                'seasonal_products' => $seasonalProducts,
                'out_of_stock_products' => $outOfStockProducts,
                'low_stock_products' => $lowStockProducts,
                'categories' => $categories,
            ],
        ]);
    }
}
