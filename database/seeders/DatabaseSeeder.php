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
    public function run(): void
    {
        // Create sample farms
        $farm1 = Farm::create([
            'name' => 'Green Valley Farm',
            'email' => 'farmer@greenvalley.com',
            'password' => Hash::make('password123'),
            'phone' => '+91 98765 43210',
            'address' => '123 Farm Road, Green Valley',
            'city' => 'Bangalore',
            'state' => 'Karnataka',
            'postal_code' => '560001',
            'is_verified' => true,
            'is_active' => true,
        ]);

        $farm2 = Farm::create([
            'name' => 'Sunrise Organic Farm',
            'email' => 'contact@sunriseorganic.com',
            'password' => Hash::make('password123'),
            'phone' => '+91 87654 32109',
            'address' => '456 Organic Lane, Sunrise Hills',
            'city' => 'Pune',
            'state' => 'Maharashtra',
            'postal_code' => '411001',
            'is_verified' => true,
            'is_active' => true,
        ]);

        // Create sample products
        $products = [
            [
                'farm_id' => $farm1->id,
                'name' => 'Fresh Tomatoes',
                'category' => 'Vegetables',
                'price' => 45.00,
                'unit' => 'kg',
                'description' => 'Fresh, organic tomatoes grown without pesticides',
                'stock' => 100,
                'is_approved' => true,
                'is_featured' => true,
            ],
            [
                'farm_id' => $farm1->id,
                'name' => 'Organic Carrots',
                'category' => 'Vegetables',
                'price' => 35.00,
                'unit' => 'kg',
                'description' => 'Sweet, crunchy organic carrots',
                'stock' => 75,
                'is_approved' => true,
            ],
            [
                'farm_id' => $farm1->id,
                'name' => 'Farm Fresh Eggs',
                'category' => 'Dairy',
                'price' => 8.00,
                'unit' => 'piece',
                'description' => 'Free-range chicken eggs',
                'stock' => 200,
                'is_approved' => false, // Pending approval
            ],
            [
                'farm_id' => $farm2->id,
                'name' => 'Organic Apples',
                'category' => 'Fruits',
                'price' => 120.00,
                'unit' => 'kg',
                'description' => 'Crisp, sweet organic apples',
                'stock' => 50,
                'is_approved' => true,
                'is_featured' => true,
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }

        // Create sample orders
        $order1 = Order::create([
            'farm_id' => $farm1->id,
            'customer_name' => 'Rahul Sharma',
            'customer_email' => 'rahul@example.com',
            'customer_phone' => '+91 98765 43210',
            'customer_address' => '789 Customer Street, Bangalore, Karnataka',
            'subtotal' => 225.00,
            'tax_amount' => 22.50,
            'delivery_fee' => 50.00,
            'total' => 297.50,
            'status' => 'delivered',
            'payment_status' => 'paid',
            'payment_method' => 'UPI',
        ]);

        // Create order items for order1
        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 1, // Fresh Tomatoes
            'product_name' => 'Fresh Tomatoes',
            'product_price' => 45.00,
            'product_unit' => 'kg',
            'quantity' => 3,
            'total_price' => 135.00,
        ]);

        OrderItem::create([
            'order_id' => $order1->id,
            'product_id' => 2, // Organic Carrots
            'product_name' => 'Organic Carrots',
            'product_price' => 35.00,
            'product_unit' => 'kg',
            'quantity' => 2,
            'total_price' => 70.00,
        ]);

        $order2 = Order::create([
            'farm_id' => $farm1->id,
            'customer_name' => 'Priya Patel',
            'customer_email' => 'priya@example.com',
            'customer_phone' => '+91 87654 32109',
            'customer_address' => '456 Another Street, Bangalore, Karnataka',
            'subtotal' => 90.00,
            'tax_amount' => 9.00,
            'delivery_fee' => 30.00,
            'total' => 129.00,
            'status' => 'processing',
            'payment_status' => 'paid',
            'payment_method' => 'Credit Card',
        ]);

        OrderItem::create([
            'order_id' => $order2->id,
            'product_id' => 1, // Fresh Tomatoes
            'product_name' => 'Fresh Tomatoes',
            'product_price' => 45.00,
            'product_unit' => 'kg',
            'quantity' => 2,
            'total_price' => 90.00,
        ]);
    }
}
