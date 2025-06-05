<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmCommentController;
use App\Http\Controllers\KleverCommentController;
use App\Http\Controllers\FarmDisplayController;
use App\Models\Farm;
use App\Http\Controllers\FarmerDashboardController;
use App\Http\Controllers\FarmAuthController;
use App\Http\Controllers\ProductController;

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

// Public farm routes
Route::get('/farms', [FarmController::class, 'index']);
Route::post('/farms', [FarmController::class, 'store']);
Route::patch('/farms/{id}', [FarmController::class, 'update']);
Route::get('/farms/{id}', [FarmController::class, 'show']);
Route::get('/frontend/farms', [FarmDisplayController::class, 'index']);
Route::delete('/farms/{farm}', [FarmController::class, 'destroy']);
Route::get('/frontend/farm/{slug}', [FarmDisplayController::class, 'showBySlug']);

// Authentication routes
Route::post('/auth/farmer/login', [FarmAuthController::class, 'login']);

// Protected routes requiring Sanctum token
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/farmer/logout', [FarmAuthController::class, 'logout']);
    
    // Dashboard
    Route::get('/farmer/dashboard', [FarmerDashboardController::class, 'index']);
    
    // Product management
    Route::prefix('farmer')->group(function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::patch('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        // Additional product routes
        Route::get('/products/low-stock', [ProductController::class, 'lowStock']);
        Route::get('/products/categories', [ProductController::class, 'categories']);
        Route::get('/dashboard/stats', [ProductController::class, 'dashboardStats']);
    });
});
