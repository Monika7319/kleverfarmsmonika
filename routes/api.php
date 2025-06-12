<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmCommentController;
use App\Http\Controllers\KleverCommentController;
use App\Http\Controllers\FarmDisplayController;
use App\Models\Farm;
use App\Http\Controllers\FarmerDashboardController;
use App\Http\Controllers\FarmAuthController;
use App\Http\Controllers\FarmerProductController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\CustomerWishlistController;
use App\Http\Controllers\Api\CustomerOrderController;

Route::get('/test-slug-fetch', function () {
    $slug = 'krishna-in-belagavi-karnataka';
    $farm = Farm::where('slug', $slug)->first();

    if (!$farm) {
        return response()->json(['message' => 'NOT FOUND'], 404);
    }

    return response()->json($farm);
});

Route::post('/farm-comments', [KleverCommentController::class, 'store']);
Route::get('/farm-comments/{farmId}', [KleverCommentController::class, 'show']);

Route::get('/farms', [FarmController::class, 'index']);
Route::post('/farms', [FarmController::class, 'store']);
Route::patch('/farms/{id}', [FarmController::class, 'update']);
Route::get('/farms/{id}', [FarmController::class, 'show']);
Route::delete('/farms/{farm}', [FarmController::class, 'destroy']);

Route::get('/frontend/farms', [FarmDisplayController::class, 'index']);
Route::get('/frontend/farm/{slug}', [FarmDisplayController::class, 'showBySlug']);

// Farmer Authentication
Route::post('/auth/farmer/login', [FarmAuthController::class, 'login']);

// Customer Authentication
Route::post('/customer/register', [CustomerAuthController::class, 'register']);
Route::post('/customer/login', [CustomerAuthController::class, 'login']);

// Protected Farmer Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/farmer/logout', [FarmAuthController::class, 'logout']);
    Route::get('/farmer/dashboard', [FarmerDashboardController::class, 'index']);

    // Product APIs - Order matters! Specific routes before parameterized ones
    Route::get('/farmer/products/low-stock', [FarmerProductController::class, 'lowStock']);
    Route::get('/farmer/products', [FarmerProductController::class, 'index']);
    Route::post('/farmer/products', [FarmerProductController::class, 'store']);
    Route::get('/farmer/products/{id}', [FarmerProductController::class, 'show']);
    Route::put('/farmer/products/{id}', [FarmerProductController::class, 'update']);
    Route::delete('/farmer/products/{id}', [FarmerProductController::class, 'destroy']);
});

// Protected Customer Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/customer/logout', [CustomerAuthController::class, 'logout']);
    Route::get('/customer/profile', [CustomerAuthController::class, 'profile']);
    Route::put('/customer/profile', [CustomerAuthController::class, 'updateProfile']);
    
    // Wishlist Routes
    Route::get('/customer/wishlist', [CustomerWishlistController::class, 'index']);
    Route::post('/customer/wishlist', [CustomerWishlistController::class, 'store']);
    Route::delete('/customer/wishlist/{productId}', [CustomerWishlistController::class, 'destroy']);
    
    // Order Routes
    Route::get('/customer/orders', [CustomerOrderController::class, 'index']);
    Route::post('/customer/orders', [CustomerOrderController::class, 'store']);
    Route::get('/customer/orders/{orderId}', [CustomerOrderController::class, 'show']);
});
