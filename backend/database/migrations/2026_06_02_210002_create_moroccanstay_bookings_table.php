<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('user_id')->nullable();
            $table->string('guest');
            $table->string('email')->nullable();
            $table->foreignId('hotel_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('room_id')->nullable()->constrained()->nullOnDelete();
            $table->string('hotel');
            $table->string('room');
            $table->date('check_in');
            $table->date('check_out');
            $table->unsignedInteger('nights')->default(1);
            $table->unsignedInteger('amount')->default(0);
            $table->string('status')->default('pending');
            $table->string('avatar', 8)->nullable();
            $table->json('extras')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
