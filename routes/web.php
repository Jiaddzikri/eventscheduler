<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\Tenant\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Global Event browsing for everyone
Route::get('/', [EventController::class, 'index'])->name('events.index');
Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');

// Member Global Dashboard
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Authenticated Event operations
    Route::post('/events/{event}/join', [EventController::class, 'join'])->name('events.join');
    Route::post('/payments/{event}', [EventController::class, 'pay'])->name('payments.store');

    // Tenant routes (Manager & Treasurer)
    Route::prefix('t/{tenant}')->name('tenant.')->middleware(['tenant.role:any'])->group(function () {
        // Shared tenant dashboard (rekap saldo & summary)
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Manager only (manage events)
        Route::middleware(['tenant.role:manager'])->group(function () {
            Route::resource('events', EventController::class)->except(['index', 'show']);
        });

        // Treasurer only (verify payments)
        Route::middleware(['tenant.role:treasurer'])->group(function () {
            Route::post('/payments/{payment}/verify', [DashboardController::class, 'verifyPayment'])->name('payments.verify');
        });
    });

    // Super Admin Routes
    Route::prefix('admin')->name('admin.')->middleware([\App\Http\Middleware\EnsureSuperAdmin::class])->group(function () {
        Route::resource('tenants', \App\Http\Controllers\Admin\TenantController::class)->except(['show']);
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->except(['show']);
    });
});

require __DIR__.'/auth.php';
