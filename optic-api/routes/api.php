<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\DemoController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login')
        ->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Lead routes
    Route::prefix('leads')->group(function () {
        Route::get('/', [LeadController::class, 'index'])->name('leads.index');
        Route::post('/', [LeadController::class, 'store'])->name('leads.store');
        Route::get('/{uuid}', [LeadController::class, 'show'])->name('leads.show');
        Route::put('/{uuid}', [LeadController::class, 'update'])->name('leads.update');
        Route::delete('/{uuid}', [LeadController::class, 'destroy'])->name('leads.destroy');
        Route::post('/{uuid}/regenerate-insights', [LeadController::class, 'regenerateInsights'])
            ->name('leads.regenerate-insights')
            ->middleware('throttle:5,1');
    });

    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats'])->name('dashboard.stats');
        Route::get('/recent-leads', [DashboardController::class, 'recentLeads'])->name('dashboard.recent-leads');
    });

    // Demo / Simulator routes
    Route::prefix('demo')->group(function () {
        Route::post('/generate-lead', [DemoController::class, 'generateLead'])->name('demo.generate-lead');
        Route::delete('/clear-leads', [DemoController::class, 'clearLeads'])->name('demo.clear-leads');
    });
});
