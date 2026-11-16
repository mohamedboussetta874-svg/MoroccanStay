<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guide_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guide_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('hotel_id')->nullable()->constrained()->nullOnDelete();
            $table->string('hotel_name');
            $table->string('customer_name')->nullable();
            $table->string('city')->nullable();
            $table->date('date')->nullable();
            $table->string('status')->default('requested');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guide_assignments');
    }
};
