<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::get('/', [AuthController::class, 'api'])->name('api');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::prefix('user')->name('user.')->group(function(){
        Route::post('update/{id}', [UserController::class, 'update'])->name('update');

        Route::middleware('role:admin')->group(function () {
            Route::get('/', [UserController::class, 'list'])->name('list');
            Route::post('store', [UserController::class, 'store'])->name('store');
            Route::get('edit/{id}', [UserController::class, 'edit'])->name('edit');
            Route::delete('delete/{id}', [UserController::class, 'delete'])->name('delete');
        });

        Route::middleware('role:user')->group(function () {
            Route::get('getProfile', [UserController::class, 'getProfile'])->name('get.profile');
        });
    });

    
});

