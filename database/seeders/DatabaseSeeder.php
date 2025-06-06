<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Farm;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@kleverfarms.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create sample farmer
        $farmer = User::create([
            'name' => 'Rajesh Kumar',
            'email' => 'rajesh@example.com',
            'password' => Hash::make('password'),
            'phone' => '+91 98765 43210',
            'role' => 'farmer',
        ]);

        // Create farm for the farmer
        $farm = Farm::create([
            'user_id' => $farmer->id,
            'name' => 'Kumar Organic Farm',
            'description' => 'Organic vegetables and fruits grown with traditional methods',
            'address' => '123 Farm Road',
            'city' => 'Pune',
            'state' => 'Maharashtra',
            'zip_code' => '411001',
            'phone' => '+91 98765 43210',
            'email' => 'rajesh@example.com',
            'is_verified' => true,
        ]);

        // Create sample products
        $products = [
            [
                'name' => 'Organic Tomatoes',
                'category' => 'Vegetables',
                'price' => 80.00,
                'unit' => 'kg',
                'description' => 'Fresh organic tomatoes grown without pesticides',
                'stock' => 50,
                'is_approved' => true,
                'is_featured' => true,
            ],
            [
                'name' => 'Fresh Spinach',
                'category' => 'Vegetables',
                'price' => 40.00,
                'unit' => 'kg',
                'description' => 'Nutrient-rich fresh spinach leaves',
                'stock' => 30,
                'is_approved' => true,
                'is_seasonal' => true,
            ],
            [
                'name' => 'Organic Milk',
                'category' => 'Dairy',
                'price' => 60.00,
                'unit' => 'liter',
                'description' => 'Pure organic milk from grass-fed cows',
                'stock' => 25,
                'is_approved' => false,
            ],
            [
                'name' => 'Farm Fresh Eggs',
                'category' => 'Dairy',
                'price' => 120.00,
                'unit' => 'dozen',
                'description' => 'Free-range chicken eggs',
                'stock' => 40,
                'is_approved' => true,
            ],
            [
                'name' => 'Organic Carrots',
                'category' => 'Vegetables',
                'price' => 50.00,
                'unit' => 'kg',
                'description' => 'Sweet and crunchy organic carrots',
                'stock' => 5, // Low stock
                'is_approved' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::create(array_merge($productData, [
                'farm_id' => $farm->id,
                'discount' => 0,
                'is_active' => true,
            ]));
        }
    }
}
