<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FarmerAuthController;
use App\Http\Controllers\FarmerProductController;
use App\Http\Controllers\Api\FarmerDashboardController;
use App\Http\Controllers\Api\FarmerOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Farmer Authentication Routes
Route::prefix('farmer')->group(function () {
    Route::post('register', [FarmerAuthController::class, 'register']);
    Route::post('login', [FarmerAuthController::class, 'login']);
    
    // Protected farmer routes
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('logout', [FarmerAuthController::class, 'logout']);
        Route::get('me', [FarmerAuthController::class, 'me']);
        Route::get('dashboard', [FarmerDashboardController::class, 'index']);
        
        // Product management routes
        Route::get('products/low-stock', [FarmerProductController::class, 'lowStock']);
        Route::get('products/stats', [FarmerProductController::class, 'dashboardStats']);
        Route::apiResource('products', FarmerProductController::class);
        
        // Order management routes
        Route::get('orders', [FarmerOrderController::class, 'index']);
        Route::get('orders/{id}', [FarmerOrderController::class, 'show']);
        Route::put('orders/{id}/status', [FarmerOrderController::class, 'updateStatus']);
    });
});
