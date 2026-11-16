<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guides', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('city');
            $table->string('email')->unique();
            $table->decimal('rating', 3, 1)->default(0);
            $table->unsignedInteger('rate')->default(100);
            $table->string('languages')->default('French, Arabic');
            $table->boolean('available')->default(true);
            $table->unsignedInteger('tours')->default(0);
            $table->string('status')->default('Actif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guides');
    }
};
