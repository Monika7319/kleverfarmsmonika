<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Farm;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            FarmSeeder::class,
            ProductSeeder::class
        ]);
    }
}
