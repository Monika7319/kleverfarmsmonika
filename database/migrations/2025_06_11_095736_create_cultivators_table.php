<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cultivators', function (Blueprint $table) {
            $table->id();
            $table->string('farmName');
            $table->string('ownerName');
            $table->string('email')->unique();
            $table->string('phone');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('description')->nullable();
            $table->string('farmSize')->nullable();
            $table->string('farmType')->nullable();
            $table->json('farmingMethods')->nullable();
            $table->json('specialties')->nullable();
            $table->json('images')->nullable();
            $table->boolean('acceptTerms')->default(false);
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->string('latitude')->nullable();
            $table->string('longitude')->nullable();
            $table->integer('is_verified')->default(0); // 0=pending, 1=approved, 3=rejected
            $table->boolean('is_active')->default(true);
            $table->string('slug')->unique();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index(['is_verified', 'is_active']);
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cultivators');
    }
};
