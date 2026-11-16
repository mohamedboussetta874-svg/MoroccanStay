<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use Illuminate\Http\Request;

class HotelController extends Controller
{
    public function index(Request $request)
    {
        $query = Hotel::query()->with('rooms');

        if (! $request->boolean('includePending')) {
            $query->where('status', 'active');
        }

        if ($search = $request->query('search')) {
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        return $query->latest()->get()->map(fn (Hotel $hotel) => $this->serialize($hotel));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $rooms = $data['rooms'] ?? [];
        unset($data['rooms']);

        $hotel = Hotel::create($data);
        $this->syncRooms($hotel, $rooms);

        return response()->json($this->serialize($hotel->fresh('rooms')), 201);
    }

    public function show(Hotel $hotel)
    {
        return $this->serialize($hotel->load('rooms'));
    }

    public function update(Request $request, Hotel $hotel)
    {
        $data = $this->validated($request, false);
        $rooms = $data['rooms'] ?? null;
        unset($data['rooms']);

        $hotel->update($data);
        if (is_array($rooms)) {
            $hotel->rooms()->delete();
            $this->syncRooms($hotel, $rooms);
        }

        return $this->serialize($hotel->fresh('rooms'));
    }

    public function destroy(Hotel $hotel)
    {
        $hotel->delete();

        return response()->noContent();
    }

    private function validated(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'location' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'rating' => ['sometimes', 'numeric', 'between:0,5'],
            'price' => [$creating ? 'required' : 'sometimes', 'integer', 'min:0'],
            'guests' => ['sometimes', 'integer', 'min:0'],
            'image' => ['nullable', 'string'],
            'images' => ['sometimes', 'array'],
            'description' => ['nullable', 'string'],
            'amenities' => ['sometimes', 'array'],
            'status' => ['sometimes', 'in:active,pending,disabled'],
            'manager_name' => ['nullable', 'string', 'max:255'],
            'manager_email' => ['nullable', 'email', 'max:255'],
            'rooms' => ['sometimes', 'array'],
            'rooms.*.name' => ['required_with:rooms', 'string', 'max:255'],
            'rooms.*.price' => ['required_with:rooms', 'integer', 'min:0'],
            'rooms.*.capacity' => ['sometimes', 'integer', 'min:1'],
        ]);
    }

    private function syncRooms(Hotel $hotel, array $rooms): void
    {
        foreach ($rooms as $room) {
            $hotel->rooms()->create([
                'name' => $room['name'],
                'price' => $room['price'],
                'capacity' => $room['capacity'] ?? 2,
                'available' => $room['available'] ?? true,
            ]);
        }
    }

    private function serialize(Hotel $hotel): array
    {
        return [
            'id' => (string) $hotel->id,
            'name' => $hotel->name,
            'location' => $hotel->location,
            'rating' => (float) $hotel->rating,
            'price' => (int) $hotel->price,
            'guests' => (int) $hotel->guests,
            'image' => $hotel->image,
            'images' => $hotel->images ?: [],
            'description' => $hotel->description,
            'amenities' => $hotel->amenities ?: [],
            'status' => $hotel->status,
            'managerName' => $hotel->manager_name,
            'managerEmail' => $hotel->manager_email,
            'rooms' => $hotel->rooms->map(fn ($room) => [
                'id' => (string) $room->id,
                'name' => $room->name,
                'price' => (int) $room->price,
                'capacity' => (int) $room->capacity,
                'available' => (bool) $room->available,
            ])->values(),
        ];
    }
}
