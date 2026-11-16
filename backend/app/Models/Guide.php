<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guide extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'email',
        'rating',
        'rate',
        'languages',
        'available',
        'tours',
        'status',
    ];

    protected $casts = [
        'rating' => 'float',
        'rate' => 'integer',
        'available' => 'boolean',
        'tours' => 'integer',
    ];
}
