<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'guest',
        'email',
        'hotel_id',
        'room_id',
        'hotel',
        'room',
        'check_in',
        'check_out',
        'nights',
        'amount',
        'status',
        'avatar',
        'extras',
    ];

    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'nights' => 'integer',
        'amount' => 'integer',
        'extras' => 'array',
    ];

    public function hotelModel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id');
    }
}
