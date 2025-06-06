<?php

namespace App\Http\Controllers;

use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class FarmerAuthController extends Controller
{
    /**
     * Farmer Login
     * POST /api/farmer/login
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Find farm by email
            $farm = Farm::where('email', $request->email)->first();

            if (!$farm) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check password
            if (!Hash::check($request->password, $farm->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check if farm is active
            if (!$farm->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your farm account is deactivated. Please contact support.'
                ], 403);
            }

            // Check if farm is verified (optional - you might want to allow unverified farms to login)
            if (!$farm->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your farm is still under review. You will be notified once approved.',
                    'status' => 'pending_verification'
                ], 403);
            }

            // Create token
            $token = $farm->createToken('farmer_auth_token')->plainTextToken;

            // Prepare farm data
            $farmData = [
                'id' => $farm->id,
                'farmName' => $farm->farmName,
                'ownerName' => $farm->ownerName,
                'email' => $farm->email,
                'phone' => $farm->phone,
                'address' => $farm->address,
                'city' => $farm->city,
                'state' => $farm->state,
                'zip' => $farm->zip,
                'farmSize' => $farm->farmSize,
                'farmType' => $farm->farmType,
                'description' => $farm->description,
                'farmingMethods' => is_string($farm->farmingMethods) ? json_decode($farm->farmingMethods, true) : $farm->farmingMethods,
                'specialties' => is_string($farm->specialties) ? json_decode($farm->specialties, true) : $farm->specialties,
                'images' => is_string($farm->images) ? json_decode($farm->images, true) : $farm->images,
                'latitude' => $farm->latitude,
                'longitude' => $farm->longitude,
                'is_verified' => $farm->is_verified,
                'is_active' => $farm->is_active,
            ];

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'farm' => $farmData,
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Farmer login error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Farmer Logout
     * POST /api/farmer/logout
     */
    public function logout(Request $request)
    {
        try {
            // Delete current access token
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Farmer logout error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Authenticated Farmer
     * GET /api/farmer/me
     */
    public function me(Request $request)
    {
        try {
            $farm = $request->user();

            $farmData = [
                'id' => $farm->id,
                'farmName' => $farm->farmName,
                'ownerName' => $farm->ownerName,
                'email' => $farm->email,
                'phone' => $farm->phone,
                'address' => $farm->address,
                'city' => $farm->city,
                'state' => $farm->state,
                'zip' => $farm->zip,
                'farmSize' => $farm->farmSize,
                'farmType' => $farm->farmType,
                'description' => $farm->description,
                'farmingMethods' => is_string($farm->farmingMethods) ? json_decode($farm->farmingMethods, true) : $farm->farmingMethods,
                'specialties' => is_string($farm->specialties) ? json_decode($farm->specialties, true) : $farm->specialties,
                'images' => is_string($farm->images) ? json_decode($farm->images, true) : $farm->images,
                'latitude' => $farm->latitude,
                'longitude' => $farm->longitude,
                'is_verified' => $farm->is_verified,
                'is_active' => $farm->is_active,
            ];

            return response()->json([
                'success' => true,
                'farm' => $farmData
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Get farmer data error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch farmer data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update Farmer Profile
     * PUT /api/farmer/profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $farm = $request->user();

            $validator = Validator::make($request->all(), [
                'farmName' => 'required|string|max:255',
                'ownerName' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:100',
                'state' => 'required|string|max:100',
                'zip' => 'required|string|max:20',
                'farmSize' => 'required|string|max:100',
                'farmType' => 'required|string|max:100',
                'description' => 'required|string',
                'farmingMethods' => 'required|array',
                'specialties' => 'required|array',
                'latitude' => 'nullable|string',
                'longitude' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update farm data
            $farm->update([
                'farmName' => $request->farmName,
                'ownerName' => $request->ownerName,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'zip' => $request->zip,
                'farmSize' => $request->farmSize,
                'farmType' => $request->farmType,
                'description' => $request->description,
                'farmingMethods' => json_encode($request->farmingMethods),
                'specialties' => json_encode($request->specialties),
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'farm' => $farm->fresh()
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Update farmer profile error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
