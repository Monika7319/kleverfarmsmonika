<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cultivator;

class CultivatorDashboardController extends Controller
{
    /**
     * GET /api/farmer/dashboard
     * Returns the authenticated cultivator's info.
     */
    public function index(Request $request)
    {
        try {
            /** @var Cultivator $cultivator */
            $cultivator = $request->user();

            return response()->json([
                'success' => true,
                'user' => [
                    'id' => $cultivator->id,
                    'name' => $cultivator->ownerName,
                    'email' => $cultivator->email,
                    'phone' => $cultivator->phone,
                ],
                'farm' => [
                    'id' => $cultivator->id,
                    'name' => $cultivator->farmName,
                    'address' => $cultivator->address,
                    'city' => $cultivator->city,
                    'state' => $cultivator->state,
                    'is_verified' => $cultivator->is_verified === 1,
                    'description' => $cultivator->description,
                    'farmSize' => $cultivator->farmSize,
                    'farmType' => $cultivator->farmType,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
