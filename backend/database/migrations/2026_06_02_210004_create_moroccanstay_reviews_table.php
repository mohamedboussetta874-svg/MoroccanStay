<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->nullable()->constrained()->nullOnDelete();
            $table->string('hotel_name')->nullable();
            $table->string('user_id')->nullable();
            $table->string('author');
            $table->string('avatar', 8)->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('date')->nullable();
            $table->text('text');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
