<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\GuideAssignmentController;
use App\Http\Controllers\Api\GuideController;
use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\HotelRequestController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReviewController;
use Illuminate\Support\Facades\Route;

Route::get('/health', fn () => ['status' => 'ok', 'app' => 'MoroccanStay']);

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::apiResource('hotels', HotelController::class);
Route::apiResource('guides', GuideController::class);

Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings/check-availability', [BookingController::class, 'checkAvailability']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);

Route::get('/reviews/approved', [ReviewController::class, 'approved']);
Route::get('/reviews/pending', [ReviewController::class, 'pending']);
Route::post('/reviews', [ReviewController::class, 'store']);
Route::patch('/reviews/{review}/approve', [ReviewController::class, 'approve']);
Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

Route::post('/payments', [PaymentController::class, 'store']);

Route::get('/guide-assignments', [GuideAssignmentController::class, 'index']);
Route::post('/guide-assignments', [GuideAssignmentController::class, 'store']);

Route::get('/hotel-requests', [HotelRequestController::class, 'index']);
Route::post('/hotel-requests', [HotelRequestController::class, 'store']);
Route::patch('/hotel-requests/{hotelRequest}/status', [HotelRequestController::class, 'updateStatus']);
