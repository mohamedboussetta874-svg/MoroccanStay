<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuideAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'guide_id',
        'booking_id',
        'hotel_id',
        'hotel_name',
        'customer_name',
        'city',
        'date',
        'status',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}
