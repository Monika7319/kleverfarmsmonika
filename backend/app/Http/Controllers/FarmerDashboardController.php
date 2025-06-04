<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Farm;

class FarmerDashboardController extends Controller
{
    /**
     * GET  /api/farmer/dashboard
     * Returns the authenticated farm’s info.
     * Protected by sanctum.
     */
    public function index(Request $request)
    {
        /** @var Farm $farm */
        $farm = $request->user(); // Sanctum-authenticated farm

        return response()->json([
            'farm' => [
                'id'            => $farm->id,
                'farmName'      => $farm->farmName,
                'ownerName'     => $farm->ownerName,
                'email'         => $farm->email,
                'phone'         => $farm->phone,
                'address'       => $farm->address,
                'city'          => $farm->city,
                'state'         => $farm->state,
                'zip'           => $farm->zip,
                'farmSize'      => $farm->farmSize,
                'farmType'      => $farm->farmType,
                'description'   => $farm->description,
                'farmingMethods'=> $farm->farmingMethods,
                'specialties'   => $farm->specialties,
                'images'        => $farm->images,
                'latitude'      => $farm->latitude,
                'longitude'     => $farm->longitude,
                'is_verified'   => $farm->is_verified,
                'is_active'     => $farm->is_active,
            ],
        ]);
    }
}
