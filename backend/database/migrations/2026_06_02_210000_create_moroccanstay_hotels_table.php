<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('price')->default(0);
            $table->unsignedInteger('guests')->default(0);
            $table->text('image')->nullable();
            $table->json('images')->nullable();
            $table->text('description')->nullable();
            $table->json('amenities')->nullable();
            $table->string('status')->default('active');
            $table->string('manager_name')->nullable();
            $table->string('manager_email')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
