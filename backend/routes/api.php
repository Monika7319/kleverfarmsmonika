<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FarmController;
use App\Http\Controllers\FarmCommentController;
use App\Http\Controllers\KleverCommentController;
use App\Http\Controllers\FarmDisplayController;
use App\Models\Farm;
use App\Http\Controllers\FarmerDashboardController;
use App\Http\Controllers\FarmAuthController;

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
//Route::get('/home', [FarmDisplayController::class, 'index']);
Route::get('/frontend/farms', [FarmDisplayController::class, 'index']);

Route::delete('/farms/{farm}', [FarmController::class, 'destroy']);
//Route::get('/frontend/farm/{slug}', [FarmController::class, 'showBySlug']);
Route::get('/frontend/farm/{slug}', [FarmDisplayController::class, 'showBySlug']);


Route::post('/auth/farmer/login', [FarmAuthController::class, 'login']);

// Protected: logout and dashboard require Sanctum token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/farmer/logout', [FarmAuthController::class, 'logout']);
    Route::get('/farmer/dashboard',  [FarmerDashboardController::class, 'index']);
});