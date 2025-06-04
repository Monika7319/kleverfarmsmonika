<?php

namespace App\Http\Controllers; // Make sure this namespace is correct

use App\Models\Farm;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller; // Import Controller class

class FarmDisplayController extends Controller
{
    public function index()
    {
        $farms = Farm::where('is_verified', true)
                     ->where('is_active', true)
                     ->orderBy('id', 'desc')
                     ->get([
                         'id', 'user_id', 'farmName', 'ownerName', 'email', 'phone',
                         'address', 'city', 'state', 'zip', 'farmSize', 'farmType',
                         'description', 'farmingMethods', 'specialties', 'images',
                         'acceptTerms', 'latitude', 'longitude',
                         'is_verified', 'is_active', 'created_at', 'slug'
                     ]);

        // Format farms
        $farms->transform(function ($farm) {
            $farm->images = is_string($farm->images) ? json_decode($farm->images, true) : $farm->images;
            $farm->farmingMethods = is_string($farm->farmingMethods) ? json_decode($farm->farmingMethods, true) : $farm->farmingMethods;
            $farm->specialties = is_string($farm->specialties) ? json_decode($farm->specialties, true) : $farm->specialties;
            

            // Convert image filenames to full URLs
            $farm->images = array_map(function ($img) {
                return url('farms/images/' . $img);
            }, $farm->images ?? []);

            $farm->status = 'approved'; // all farms returned are approved
            return $farm;
        });

        return response()->json([
            'farms' => $farms
        ], 200);
    }



    // public function showBySlug($slug)
    // {
    //     $farm = Farm::where('slug', $slug)->first();
    
    //     if (!$farm) {
    //         return response()->json(['message' => 'Farm not found'], 404);
    //     }
    
    //     // No need to decode anything – Laravel handles it via model casting
    //     return response()->json(['farm' => $farm]);
    // }

    public function showBySlug($slug)
{
    $farm = Farm::where('slug', $slug)->first();

    if (!$farm) {
        return response()->json(['message' => 'Farm not found'], 404);
    }

    return response()->json([
        'farm' => [
            ...$farm->toArray(),
            'images' => is_array($farm->images) ? $farm->images : json_decode($farm->images ?? '[]', true),
            'farmingMethods' => is_array($farm->farmingMethods) ? $farm->farmingMethods : json_decode($farm->farmingMethods ?? '[]', true),
            'specialties' => is_array($farm->specialties) ? $farm->specialties : json_decode($farm->specialties ?? '[]', true),
        ]
    ]);
}

    

}




 