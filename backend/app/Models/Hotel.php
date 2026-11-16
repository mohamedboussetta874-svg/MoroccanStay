<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'location',
        'rating',
        'price',
        'guests',
        'image',
        'images',
        'description',
        'amenities',
        'status',
        'manager_name',
        'manager_email',
    ];

    protected $casts = [
        'rating' => 'float',
        'price' => 'integer',
        'guests' => 'integer',
        'images' => 'array',
        'amenities' => 'array',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
