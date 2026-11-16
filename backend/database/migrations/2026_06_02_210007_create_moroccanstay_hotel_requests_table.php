<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_requests', function (Blueprint $table) {
            $table->id();
            $table->string('manager_name');
            $table->string('manager_email');
            $table->json('hotel_payload');
            $table->json('rooms_payload')->nullable();
            $table->string('status')->default('pending');
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_requests');
    }
};
