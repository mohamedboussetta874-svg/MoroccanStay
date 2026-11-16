<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GuideAssignment;
use Illuminate\Http\Request;

class GuideAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $query = GuideAssignment::query()->latest();

        if ($guideId = $request->query('guideId')) {
            $query->where('guide_id', $guideId);
        }

        return $query->get()->map(fn (GuideAssignment $assignment) => $this->serialize($assignment));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'guideId' => ['nullable', 'exists:guides,id'],
            'bookingId' => ['nullable', 'exists:bookings,id'],
            'hotelId' => ['nullable', 'exists:hotels,id'],
            'hotelName' => ['required', 'string', 'max:255'],
            'customerName' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
            'status' => ['sometimes', 'string', 'max:50'],
        ]);

        $assignment = GuideAssignment::create([
            'guide_id' => $data['guideId'] ?? null,
            'booking_id' => $data['bookingId'] ?? null,
            'hotel_id' => $data['hotelId'] ?? null,
            'hotel_name' => $data['hotelName'],
            'customer_name' => $data['customerName'] ?? null,
            'city' => $data['city'] ?? null,
            'date' => $data['date'] ?? null,
            'status' => $data['status'] ?? 'requested',
        ]);

        return response()->json($this->serialize($assignment), 201);
    }

    private function serialize(GuideAssignment $assignment): array
    {
        return [
            'id' => (string) $assignment->id,
            'guideId' => $assignment->guide_id ? (string) $assignment->guide_id : null,
            'bookingId' => $assignment->booking_id ? (string) $assignment->booking_id : null,
            'hotelId' => $assignment->hotel_id ? (string) $assignment->hotel_id : null,
            'hotelName' => $assignment->hotel_name,
            'customerName' => $assignment->customer_name,
            'city' => $assignment->city,
            'date' => optional($assignment->date)->toDateString(),
            'status' => $assignment->status,
            'createdAt' => $assignment->created_at?->toISOString(),
        ];
    }
}
