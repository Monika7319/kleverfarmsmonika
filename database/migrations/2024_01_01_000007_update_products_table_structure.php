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
        Schema::table('products', function (Blueprint $table) {
            // Ensure all required columns exist with correct types
            if (!Schema::hasColumn('products', 'farm_id')) {
                $table->foreignId('farm_id')->constrained('farms')->onDelete('cascade');
            }
            
            // Update discount column to be decimal instead of integer
            if (Schema::hasColumn('products', 'discount')) {
                $table->decimal('discount', 5, 2)->default(0)->change();
            }
            
            // Add indexes for better performance
            if (!Schema::hasIndex('products', ['farm_id', 'is_approved', 'is_active'])) {
                $table->index(['farm_id', 'is_approved', 'is_active']);
            }
            
            if (!Schema::hasIndex('products', ['category', 'is_approved'])) {
                $table->index(['category', 'is_approved']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['farm_id', 'is_approved', 'is_active']);
            $table->dropIndex(['category', 'is_approved']);
        });
    }
};
