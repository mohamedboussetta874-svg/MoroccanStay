<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Hotel;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::query()->latest();

        if ($userId = $request->query('userId')) {
            $query->where('user_id', $userId);
        }

        return $query->get()->map(fn (Booking $booking) => $this->serialize($booking));
    }

    public function checkAvailability(Request $request)
    {
        $data = $request->validate([
            'hotelId' => ['required'],
            'roomId' => ['required'],
            'checkIn' => ['required', 'date'],
            'checkOut' => ['required', 'date', 'after:checkIn'],
        ]);

        $conflict = Booking::query()
            ->where('hotel_id', $data['hotelId'])
            ->where('room_id', $data['roomId'])
            ->where('status', '!=', 'cancelled')
            ->whereDate('check_in', '<', $data['checkOut'])
            ->whereDate('check_out', '>', $data['checkIn'])
            ->exists();

        return ['available' => ! $conflict];
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'userId' => ['nullable'],
            'guest' => ['nullable', 'string', 'max:255'],
            'customerName' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'hotelId' => ['required', 'exists:hotels,id'],
            'roomId' => ['required', 'exists:rooms,id'],
            'checkIn' => ['required', 'date'],
            'checkOut' => ['required', 'date', 'after:checkIn'],
            'amount' => ['nullable', 'integer', 'min:0'],
            'status' => ['sometimes', 'in:pending,confirmed,cancelled'],
            'extras' => ['sometimes', 'array'],
        ]);

        $hotel = Hotel::findOrFail($data['hotelId']);
        $room = Room::findOrFail($data['roomId']);
        $checkIn = Carbon::parse($data['checkIn']);
        $checkOut = Carbon::parse($data['checkOut']);
        $nights = max(1, $checkIn->diffInDays($checkOut));
        $guest = $data['guest'] ?? $data['customerName'] ?? 'Guest';

        $booking = Booking::create([
            'user_id' => $data['userId'] ?? null,
            'guest' => $guest,
            'email' => $data['email'] ?? null,
            'hotel_id' => $hotel->id,
            'room_id' => $room->id,
            'hotel' => $hotel->name,
            'room' => $room->name,
            'check_in' => $data['checkIn'],
            'check_out' => $data['checkOut'],
            'nights' => $nights,
            'amount' => $data['amount'] ?? ($room->price * $nights),
            'status' => $data['status'] ?? 'pending',
            'avatar' => collect(explode(' ', $guest))->map(fn ($part) => mb_substr($part, 0, 1))->join(''),
            'extras' => $data['extras'] ?? [],
        ]);

        return response()->json($this->serialize($booking), 201);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,confirmed,cancelled'],
        ]);

        $booking->update(['status' => $data['status']]);

        return $this->serialize($booking->fresh());
    }

    private function serialize(Booking $booking): array
    {
        return [
            'id' => (string) $booking->id,
            'userId' => $booking->user_id,
            'guest' => $booking->guest,
            'email' => $booking->email,
            'hotelId' => $booking->hotel_id ? (string) $booking->hotel_id : null,
            'roomId' => $booking->room_id ? (string) $booking->room_id : null,
            'hotel' => $booking->hotel,
            'room' => $booking->room,
            'checkIn' => optional($booking->check_in)->toDateString(),
            'checkOut' => optional($booking->check_out)->toDateString(),
            'nights' => (int) $booking->nights,
            'amount' => (int) $booking->amount,
            'status' => $booking->status,
            'avatar' => $booking->avatar,
            'createdAt' => $booking->created_at?->toISOString(),
            'updatedAt' => $booking->updated_at?->toISOString(),
        ];
    }
}
