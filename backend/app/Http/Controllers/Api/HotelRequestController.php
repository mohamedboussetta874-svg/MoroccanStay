<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\HotelRequest;
use Illuminate\Http\Request;

class HotelRequestController extends Controller
{
    public function index(Request $request)
    {
        $query = HotelRequest::query()->latest();

        if ($managerEmail = $request->query('managerEmail')) {
            $query->where('manager_email', $managerEmail);
        }

        return $query->get()->map(fn (HotelRequest $hotelRequest) => $this->serialize($hotelRequest));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'managerName' => ['required', 'string', 'max:255'],
            'managerEmail' => ['required', 'email', 'max:255'],
            'hotel' => ['required', 'array'],
            'hotel.name' => ['required', 'string', 'max:255'],
            'hotel.location' => ['required', 'string', 'max:255'],
            'hotel.price' => ['required', 'integer', 'min:0'],
            'rooms' => ['sometimes', 'array'],
        ]);

        $hotelRequest = HotelRequest::create([
            'manager_name' => $data['managerName'],
            'manager_email' => $data['managerEmail'],
            'hotel_payload' => $data['hotel'],
            'rooms_payload' => $data['rooms'] ?? [],
            'status' => 'pending',
        ]);

        return response()->json($this->serialize($hotelRequest), 201);
    }

    public function updateStatus(Request $request, HotelRequest $hotelRequest)
    {
        $data = $request->validate([
            'status' => ['required', 'in:accepted,refused,pending'],
            'adminNote' => ['nullable', 'string'],
        ]);

        $hotelRequest->update([
            'status' => $data['status'],
            'admin_note' => $data['adminNote'] ?? null,
        ]);

        if ($data['status'] === 'accepted') {
            $payload = $hotelRequest->hotel_payload;
            $hotel = Hotel::create([
                'name' => $payload['name'],
                'location' => $payload['location'],
                'rating' => $payload['rating'] ?? 0,
                'price' => $payload['price'],
                'guests' => $payload['guests'] ?? 0,
                'image' => $payload['image'] ?? null,
                'images' => $payload['images'] ?? [],
                'description' => $payload['description'] ?? null,
                'amenities' => $payload['amenities'] ?? [],
                'manager_name' => $hotelRequest->manager_name,
                'manager_email' => $hotelRequest->manager_email,
            ]);

            foreach ($hotelRequest->rooms_payload ?: [] as $room) {
                $hotel->rooms()->create([
                    'name' => $room['name'] ?? 'Standard Room',
                    'price' => $room['price'] ?? $payload['price'],
                    'capacity' => $room['capacity'] ?? 2,
                ]);
            }
        }

        return $this->serialize($hotelRequest->fresh());
    }

    private function serialize(HotelRequest $hotelRequest): array
    {
        return [
            'id' => (string) $hotelRequest->id,
            'managerName' => $hotelRequest->manager_name,
            'managerEmail' => $hotelRequest->manager_email,
            'hotel' => $hotelRequest->hotel_payload,
            'rooms' => $hotelRequest->rooms_payload ?: [],
            'status' => $hotelRequest->status,
            'adminNote' => $hotelRequest->admin_note,
            'createdAt' => $hotelRequest->created_at?->toISOString(),
            'updatedAt' => $hotelRequest->updated_at?->toISOString(),
        ];
    }
}
