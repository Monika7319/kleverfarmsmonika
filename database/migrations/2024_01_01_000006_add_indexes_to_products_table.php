<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->index('farm_id');
            $table->index('category');
            $table->index('is_approved');
            $table->index('is_active');
            $table->index(['farm_id', 'is_approved']);
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex(['farm_id']);
            $table->dropIndex(['category']);
            $table->dropIndex(['is_approved']);
            $table->dropIndex(['is_active']);
            $table->dropIndex(['farm_id', 'is_approved']);
        });
    }
};
