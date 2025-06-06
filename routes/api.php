<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmDisplayController;
use App\Http\Controllers\FarmerDashboardController;
use App\Http\Controllers\FarmerAuthController;
use App\Http\Controllers\FarmerProductController;

// Public routes
Route::prefix('farms')->group(function () {
    Route::get('/', [FarmDisplayController::class, 'index']);
    Route::get('/{slug}', [FarmDisplayController::class, 'showBySlug']);
    Route::post('/', [FarmController::class, 'store']); // Farm registration
});

// Farmer authentication routes
Route::prefix('farmer')->group(function () {
    Route::post('/login', [FarmerAuthController::class, 'login']);
    
    // Protected farmer routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [FarmerAuthController::class, 'logout']);
        Route::get('/me', [FarmerAuthController::class, 'me']);
        Route::put('/profile', [FarmerAuthController::class, 'updateProfile']);
        
        // Dashboard
        Route::get('/dashboard', [FarmerDashboardController::class, 'index']);
        Route::get('/dashboard/stats', [FarmerProductController::class, 'dashboardStats']);
        
        // Products
        Route::get('/products', [FarmerProductController::class, 'index']);
        Route::post('/products', [FarmerProductController::class, 'store']);
        Route::get('/products/{id}', [FarmerProductController::class, 'show']);
        Route::put('/products/{id}', [FarmerProductController::class, 'update']);
        Route::delete('/products/{id}', [FarmerProductController::class, 'destroy']);
        Route::get('/products/low-stock', [FarmerProductController::class, 'lowStock']);
    });
});

// Admin routes (existing)
Route::prefix('admin')->group(function () {
    Route::get('/farms', [FarmController::class, 'index']);
    Route::get('/farms/{id}', [FarmController::class, 'show']);
    Route::put('/farms/{id}', [FarmController::class, 'update']);
    Route::delete('/farms/{id}', [FarmController::class, 'destroy']);
});
