<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\WishlistItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Create test user
        $user = User::create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'phone' => '1234567890',
            'address' => '123 Test Street, Test City',
        ]);

        // Get some products
        $products = Product::take(5)->get();

        if ($products->count() > 0) {
            // Add wishlist items
            foreach ($products->take(2) as $product) {
                WishlistItem::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ]);
            }

            // Create an order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-12345678',
                'total_amount' => 150.00,
                'status' => 'delivered',
                'payment_status' => 'paid',
                'payment_method' => 'Credit Card',
                'shipping_address' => '123 Test Street',
                'shipping_city' => 'Test City',
                'shipping_state' => 'Test State',
                'shipping_zip' => '12345',
                'shipping_phone' => '1234567890',
            ]);

            // Add order items
            foreach ($products->take(2) as $index => $product) {
                $quantity = $index + 1;
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'total' => $product->price * $quantity,
                ]);
            }
        }
    }
}
