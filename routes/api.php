<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FarmerDashboardController;
use App\Http\Controllers\Api\FarmerProductController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });

    // Farmer routes
    Route::prefix('farmer')->group(function () {
        // Dashboard
        Route::get('/dashboard', [FarmerDashboardController::class, 'index']);
        Route::get('/dashboard/stats', [FarmerDashboardController::class, 'stats']);
        
        // Products
        Route::get('/products', [FarmerProductController::class, 'index']);
        Route::post('/products', [FarmerProductController::class, 'store']);
        Route::get('/products/{id}', [FarmerProductController::class, 'show']);
        Route::put('/products/{id}', [FarmerProductController::class, 'update']);
        Route::delete('/products/{id}', [FarmerProductController::class, 'destroy']);
        Route::get('/products/low-stock', [FarmerProductController::class, 'lowStock']);
    });
});
