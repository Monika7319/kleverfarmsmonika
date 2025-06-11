<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Cultivator;

class CultivatorAuthController extends Controller
{
    /**
     * Login cultivator
     * POST /api/auth/farmer/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $cultivator = Cultivator::where('email', $request->email)->first();

        if (!$cultivator || !Hash::check($request->password, $cultivator->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!$cultivator->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Account is deactivated'
            ], 403);
        }

        $token = $cultivator->createToken('farmer-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $cultivator->id,
                'name' => $cultivator->ownerName,
                'email' => $cultivator->email,
                'farmName' => $cultivator->farmName,
                'is_verified' => $cultivator->is_verified === 1,
            ]
        ]);
    }

    /**
     * Logout cultivator
     * POST /api/auth/farmer/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
