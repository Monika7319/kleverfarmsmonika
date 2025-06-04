<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Farm;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class FarmAuthController extends Controller
{
    /**
     * POST /api/auth/farmer/login
     * Request: { email, password }
     * Response: { token, farm }
     */
    public function login(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Look up the farm by email
        $farm = Farm::where('email', $request->email)->first();

        // If not found or password does not match, throw validation exception
        if (! $farm || ! Hash::check($request->password, $farm->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create a new personal access token for this farm
        $token = $farm->createToken('farm‐token')->plainTextToken;

        // Return the token plus basic farm fields
        return response()->json([
            'token' => $token,
            'farm'  => [
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

    /**
     * POST /api/auth/farmer/logout
     * Requires a valid Bearer token.
     */
    public function logout(Request $request)
    {
        /** @var \App\Models\Farm $farm */
        $farm = $request->user();
        // Revoke the token that was used for this request
        $farm->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
