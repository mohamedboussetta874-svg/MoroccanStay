<?php

namespace Database\Seeders;

use App\Models\Guide;
use App\Models\Hotel;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@moroccanstay.com'],
            ['name' => 'Admin MoroccanStay', 'password' => Hash::make('admin123'), 'role' => 'admin']
        );

        User::updateOrCreate(
            ['email' => 'manager@moroccanstay.com'],
            ['name' => 'Mini Admin Hotel', 'password' => Hash::make('manager123'), 'role' => 'mini_admin']
        );

        User::updateOrCreate(
            ['email' => 'client@moroccanstay.com'],
            ['name' => 'Client Demo', 'password' => Hash::make('client123'), 'role' => 'customer']
        );

        $hotels = [
            [
                'name' => 'Hotel Corniche Atlantique',
                'location' => 'Casablanca, Maroc',
                'rating' => 4.8,
                'price' => 1180,
                'image' => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1080&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1080&q=80',
                    'https://images.unsplash.com/photo-1631049035182-249067d7618e?auto=format&fit=crop&w=1080&q=80',
                ],
                'description' => 'Hotel moderne pres de la corniche avec spa, restaurant et vue sur Atlantique.',
                'amenities' => ['Wi-Fi', 'Pool', 'Parking', 'Breakfast', 'Spa'],
                'rooms' => [
                    ['name' => 'Deluxe Ocean View Room', 'price' => 1180, 'capacity' => 2],
                    ['name' => 'Executive Suite', 'price' => 1890, 'capacity' => 3],
                ],
            ],
            [
                'name' => 'Riad Al Bahia',
                'location' => 'Marrakech, Maroc',
                'rating' => 4.9,
                'price' => 920,
                'image' => 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1080&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1080&q=80',
                    'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1080&q=80',
                ],
                'description' => 'Riad traditionnel proche de la medina avec terrasse, hammam et service chaleureux.',
                'amenities' => ['Wi-Fi', 'Breakfast', 'Terrasse', 'Hammam'],
                'rooms' => [
                    ['name' => 'Patio Room', 'price' => 920, 'capacity' => 2],
                    ['name' => 'Atlas Suite', 'price' => 1450, 'capacity' => 4],
                ],
            ],
            [
                'name' => 'Dar El Medina',
                'location' => 'Fes, Maroc',
                'rating' => 4.7,
                'price' => 720,
                'image' => 'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?auto=format&fit=crop&w=1080&q=80',
                'images' => [
                    'https://images.unsplash.com/photo-1648766378129-11c3d8d0da05?auto=format&fit=crop&w=1080&q=80',
                ],
                'description' => 'Maison d hotes au coeur de la medina de Fes avec architecture andalouse.',
                'amenities' => ['Wi-Fi', 'Breakfast', 'Air Conditioning', 'Terrasse'],
                'rooms' => [
                    ['name' => 'Medina Room', 'price' => 720, 'capacity' => 2],
                    ['name' => 'Family Suite', 'price' => 1100, 'capacity' => 4],
                ],
            ],
        ];

        foreach ($hotels as $hotelData) {
            $rooms = $hotelData['rooms'];
            unset($hotelData['rooms']);

            $hotel = Hotel::updateOrCreate(['name' => $hotelData['name']], $hotelData);
            foreach ($rooms as $room) {
                $hotel->rooms()->updateOrCreate(['name' => $room['name']], $room);
            }
        }

        $guides = [
            ['name' => 'Hassan Benjelloun', 'city' => 'Marrakech', 'email' => 'hassan.guide@moroccanstay.com', 'rating' => 4.9, 'rate' => 120, 'languages' => 'French, English'],
            ['name' => 'Khadija Amrani', 'city' => 'Fes', 'email' => 'khadija.guide@moroccanstay.com', 'rating' => 4.8, 'rate' => 95, 'languages' => 'French, Arabic'],
            ['name' => 'Nadia Laarbi', 'city' => 'Casablanca', 'email' => 'nadia.guide@moroccanstay.com', 'rating' => 4.9, 'rate' => 100, 'languages' => 'French, Arabic'],
        ];

        foreach ($guides as $guideData) {
            Guide::updateOrCreate(['email' => $guideData['email']], $guideData);
            User::updateOrCreate(
                ['email' => $guideData['email']],
                ['name' => $guideData['name'], 'password' => Hash::make('guide123'), 'role' => 'guide']
            );
        }
    }
}
