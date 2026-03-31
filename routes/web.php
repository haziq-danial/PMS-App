<?php

use App\Http\Controllers\ManagePermissionsController;
use App\Http\Controllers\ManageRolesController;
use App\Http\Controllers\ManageUsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/dashboard', function () {
    return inertia('Dashboard');
})->name('dashboard');

// Route::get('/manage-users', function () {
//     return inertia('ManageUsers');
// })->name('manage-users');

Route::prefix('manage-users')->name('manage-users.')->controller(ManageUsersController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::post('/store', 'store')->name('store');
});

Route::prefix('manage-roles')
    ->name('manage-roles.')->controller(ManageRolesController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::get('/edit/{role_id}', 'edit')->name('edit');
    Route::post('/store', 'store')->name('store');
});

Route::prefix('manage-permissions')
    ->name('manage-permissions.')->controller(ManagePermissionsController::class)->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::get('/edit/{permission_id}', 'edit')->name('edit');
    Route::post('/store', 'store')->name('store');
});