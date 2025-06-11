<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FarmerDashboardController;
use App\Http\Controllers\Api\FarmerProductController;
use App\Http\Controllers\Api\FarmerOrderController;

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Laravel API is running',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/farmer/login', [AuthController::class, 'farmerLogin']);
    Route::post('/farmer/register', [AuthController::class, 'farmerRegister']);
});

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });

    // Farmer routes
    Route::prefix('farmer')->group(function () {
        Route::get('/dashboard', [FarmerDashboardController::class, 'index']);
        
        // Products
        Route::get('/products', [FarmerProductController::class, 'index']);
        Route::post('/products', [FarmerProductController::class, 'store']);
        Route::get('/products/{product}', [FarmerProductController::class, 'show']);
        Route::put('/products/{product}', [FarmerProductController::class, 'update']);
        Route::delete('/products/{product}', [FarmerProductController::class, 'destroy']);
        
        // Orders
        Route::get('/orders', [FarmerOrderController::class, 'index']);
        Route::get('/orders/{order}', [FarmerOrderController::class, 'show']);
        Route::put('/orders/{order}/status', [FarmerOrderController::class, 'updateStatus']);
    });
});
