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
use App\Http\Controllers\Api\CultivatorAuthController;
use App\Http\Controllers\Api\CultivatorDashboardController;
use App\Http\Controllers\Api\CultivatorHarvestController;

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

// Cultivator Authentication Routes
Route::post('/auth/farmer/login', [CultivatorAuthController::class, 'login']);

// Protected Cultivator Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/farmer/logout', [CultivatorAuthController::class, 'logout']);
    Route::get('/farmer/dashboard', [CultivatorDashboardController::class, 'index']);

    // Harvest/Product APIs - Order matters! Specific routes before parameterized ones
    Route::get('/farmer/products/low-stock', [CultivatorHarvestController::class, 'lowStock']);
    Route::get('/farmer/products', [CultivatorHarvestController::class, 'index']);
    Route::post('/farmer/products', [CultivatorHarvestController::class, 'store']);
    Route::get('/farmer/products/{id}', [CultivatorHarvestController::class, 'show']);
    Route::put('/farmer/products/{id}', [CultivatorHarvestController::class, 'update']);
    Route::delete('/farmer/products/{id}', [CultivatorHarvestController::class, 'destroy']);
});

// Legacy Farm Routes (keeping for backward compatibility)
Route::post('/auth/farmer/login-legacy', [FarmAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/farmer/logout-legacy', [FarmAuthController::class, 'logout']);
    Route::get('/farmer/dashboard-legacy', [FarmerDashboardController::class, 'index']);

    // Legacy Product APIs
    Route::get('/farmer/products-legacy/low-stock', [FarmerProductController::class, 'lowStock']);
    Route::get('/farmer/products-legacy', [FarmerProductController::class, 'index']);
    Route::post('/farmer/products-legacy', [FarmerProductController::class, 'store']);
    Route::get('/farmer/products-legacy/{id}', [FarmerProductController::class, 'show']);
    Route::put('/farmer/products-legacy/{id}', [FarmerProductController::class, 'update']);
    Route::delete('/farmer/products-legacy/{id}', [FarmerProductController::class, 'destroy']);
});
