<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class GuideController extends Controller
{
    public function index()
    {
        return Guide::latest()->get()->map(fn (Guide $guide) => $this->serialize($guide));
    }

    public function store(Request $request)
    {
        $guide = Guide::create($this->validated($request));
        $this->ensureGuideUser($guide);

        return response()->json($this->serialize($guide), 201);
    }

    public function show(Guide $guide)
    {
        return $this->serialize($guide);
    }

    public function update(Request $request, Guide $guide)
    {
        $guide->update($this->validated($request, false));
        $this->ensureGuideUser($guide);

        return $this->serialize($guide->fresh());
    }

    public function destroy(Guide $guide)
    {
        $guide->delete();

        return response()->noContent();
    }

    private function validated(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'name' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'city' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'email' => [$creating ? 'required' : 'sometimes', 'email', 'max:255'],
            'rating' => ['sometimes', 'numeric', 'between:0,5'],
            'rate' => ['sometimes', 'integer', 'min:0'],
            'languages' => ['sometimes', 'string', 'max:255'],
            'available' => ['sometimes', 'boolean'],
            'tours' => ['sometimes', 'integer', 'min:0'],
            'status' => ['sometimes', 'string', 'max:50'],
        ]);
    }

    private function ensureGuideUser(Guide $guide): void
    {
        User::firstOrCreate(
            ['email' => $guide->email],
            ['name' => $guide->name, 'password' => Hash::make('guide123'), 'role' => 'guide']
        );
    }

    private function serialize(Guide $guide): array
    {
        return [
            'id' => (string) $guide->id,
            'name' => $guide->name,
            'city' => $guide->city,
            'email' => $guide->email,
            'rating' => (float) $guide->rating,
            'rate' => (int) $guide->rate,
            'languages' => $guide->languages,
            'available' => (bool) $guide->available,
            'tours' => (int) $guide->tours,
            'status' => $guide->status,
        ];
    }
}
