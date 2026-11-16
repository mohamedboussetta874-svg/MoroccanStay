<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HotelRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'manager_name',
        'manager_email',
        'hotel_payload',
        'rooms_payload',
        'status',
        'admin_note',
    ];

    protected $casts = [
        'hotel_payload' => 'array',
        'rooms_payload' => 'array',
    ];
}
