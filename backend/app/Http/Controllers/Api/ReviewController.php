<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function approved(Request $request)
    {
        $query = Review::query()->where('status', 'approved')->latest();

        if ($hotelId = $request->query('hotelId')) {
            $query->where('hotel_id', $hotelId);
        }

        return $query->get()->map(fn (Review $review) => $this->serialize($review));
    }

    public function pending()
    {
        return Review::query()
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(fn (Review $review) => $this->serialize($review));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'hotelId' => ['nullable', 'exists:hotels,id'],
            'hotelName' => ['nullable', 'string', 'max:255'],
            'userId' => ['nullable'],
            'author' => ['required', 'string', 'max:255'],
            'avatar' => ['nullable', 'string', 'max:8'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'date' => ['nullable', 'string', 'max:100'],
            'text' => ['required', 'string'],
        ]);

        $review = Review::create([
            'hotel_id' => $data['hotelId'] ?? null,
            'hotel_name' => $data['hotelName'] ?? null,
            'user_id' => $data['userId'] ?? null,
            'author' => $data['author'],
            'avatar' => $data['avatar'] ?? null,
            'rating' => $data['rating'],
            'date' => $data['date'] ?? now()->format('M Y'),
            'text' => $data['text'],
            'status' => 'pending',
        ]);

        return response()->json($this->serialize($review), 201);
    }

    public function approve(Review $review)
    {
        $review->update(['status' => 'approved']);

        return $this->serialize($review->fresh());
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return response()->noContent();
    }

    private function serialize(Review $review): array
    {
        return [
            'id' => (string) $review->id,
            'hotelId' => $review->hotel_id ? (string) $review->hotel_id : null,
            'hotelName' => $review->hotel_name,
            'userId' => $review->user_id,
            'author' => $review->author,
            'avatar' => $review->avatar,
            'rating' => (int) $review->rating,
            'date' => $review->date,
            'text' => $review->text,
            'status' => $review->status,
        ];
    }
}
