<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FarmController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\ProductController;

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

    // Farmer routes (with farm check middleware)
    Route::middleware(['App\Http\Middleware\EnsureFarmerHasFarm'])->prefix('farmer')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Farm management
        Route::get('/farm', [FarmController::class, 'show']);
        Route::put('/farm', [FarmController::class, 'update']);
        Route::get('/farm/statistics', [FarmController::class, 'statistics']);
        
        // Product management
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::get('/products/{id}', [ProductController::class, 'show']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::patch('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        // Additional product routes
        Route::get('/products/low-stock', [ProductController::class, 'lowStock']);
        Route::get('/dashboard/stats', [ProductController::class, 'dashboardStats']);
        
        // Categories
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::get('/categories/{category}/products', [CategoryController::class, 'products']);
        Route::get('/categories/statistics', [CategoryController::class, 'statistics']);
    });
});
