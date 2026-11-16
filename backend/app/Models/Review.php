<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'hotel_name',
        'user_id',
        'author',
        'avatar',
        'rating',
        'date',
        'text',
        'status',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];
}
