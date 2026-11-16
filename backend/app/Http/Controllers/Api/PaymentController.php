<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'bookingId' => ['nullable', 'exists:bookings,id'],
            'amount' => ['required', 'integer', 'min:1'],
            'method' => ['sometimes', 'string', 'max:100'],
        ]);

        $payment = Payment::create([
            'booking_id' => $data['bookingId'] ?? null,
            'amount' => $data['amount'],
            'method' => $data['method'] ?? 'card',
            'status' => 'paid',
            'transaction_ref' => 'MS-' . now()->format('Ymd') . '-' . Str::upper(Str::random(8)),
            'payload' => $request->all(),
        ]);

        return response()->json([
            'id' => (string) $payment->id,
            'bookingId' => $payment->booking_id ? (string) $payment->booking_id : null,
            'amount' => (int) $payment->amount,
            'method' => $payment->method,
            'status' => $payment->status,
            'transactionRef' => $payment->transaction_ref,
            'createdAt' => $payment->created_at?->toISOString(),
        ], 201);
    }
}
