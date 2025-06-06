<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:20',
                'farm_name' => 'required|string|max:255',
                'farm_address' => 'required|string',
                'farm_city' => 'required|string|max:100',
                'farm_state' => 'required|string|max:100',
                'farm_zip_code' => 'required|string|max:10',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => 'farmer',
            ]);

            // Create farm
            $farm = Farm::create([
                'user_id' => $user->id,
                'name' => $request->farm_name,
                'address' => $request->farm_address,
                'city' => $request->farm_city,
                'state' => $request->farm_state,
                'zip_code' => $request->farm_zip_code,
                'phone' => $request->phone,
                'email' => $request->email,
            ]);

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => $user,
                'farm' => $farm,
                'token' => $token
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            $user = Auth::user();

            // Check if user is active
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is deactivated'
                ], 403);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'farm' => $user->farm,
                'token' => $token
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $user = $request->user()->load('farm');

            return response()->json([
                'success' => true,
                'user' => $user,
                'farm' => $user->farm
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'phone' => 'nullable|string|max:20',
                'farm_name' => 'required|string|max:255',
                'farm_description' => 'nullable|string',
                'farm_address' => 'required|string',
                'farm_city' => 'required|string|max:100',
                'farm_state' => 'required|string|max:100',
                'farm_zip_code' => 'required|string|max:10',
                'farm_phone' => 'nullable|string|max:20',
                'farm_email' => 'nullable|email|max:255',
                'farm_website' => 'nullable|url|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update user
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
            ]);

            // Update farm
            if ($user->farm) {
                $user->farm->update([
                    'name' => $request->farm_name,
                    'description' => $request->farm_description,
                    'address' => $request->farm_address,
                    'city' => $request->farm_city,
                    'state' => $request->farm_state,
                    'zip_code' => $request->farm_zip_code,
                    'phone' => $request->farm_phone,
                    'email' => $request->farm_email,
                    'website' => $request->farm_website,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user->fresh(),
                'farm' => $user->farm->fresh()
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
